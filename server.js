const http = require('http'),
      fs = require('fs'),
      express = require('express'),
      path = require('path'),
      app = express(),
      request = require('request'),
      fetch = require('node-fetch'),
      tzwhere = require('tzwhere');
require('dotenv').config()
const PORT = process.env.PORT || 3000;
const STORM = process.env.STORM_API;
const MAP = process.env.MAP_API;

app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    res
     .status(200)
     .sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, function() {
  console.log('server up');
});

tzwhere.init();

var cord1,
    cord2,
    timezone,
    cityAPI,
    params = 'cloudCover',
    utc = new Date(),
    utcyear = utc.getFullYear(),
    utcmonth = utc.getMonth(),
    utcday = utc.getDate(),
    newutc = new Date(utcyear, utcmonth, utcday + 11).toJSON().slice(0,10).replace(/-/g,'-'),
    cloudsDate = [],
    clouds = [],
    tablica = [],
    integers = [],
    median = [],
    myObject = {};

    app.get('/myapi/:city', async (request, response) => {
      const city = request.params.city.split(',');
      const living = city[0];
      const country = city[1];
      const api_url = `http://www.mapquestapi.com/geocoding/v1/address?key=${MAP}&location=${living},${country}`;
      const fetch_response = await fetch(api_url);
      const json = await fetch_response.json();
      cord1 = json.results[0].locations[0].latLng.lat;
      cord2 = json.results[0].locations[0].latLng.lng;
      cityAPI = json.results[0].locations[0].adminArea5;
      timezone = tzwhere.tzNameAt(cord1, cord2);
      console.log(timezone);
      myObject = {};
      // NEXT
      fetch(`https://api.stormglass.io/v2/astronomy/point?lat=${cord1}&lng=${cord2}&end=${newutc}`, {
      headers: {
        'Authorization': `${STORM}`
      }
    }).then((response) => response.json()).then((jsonData) => {
      let myJson = jsonData.data;
      console.log(myJson.length);
      for(let i = 0; i < myJson.length; i++) {
        let currentJson = myJson[i].sunset;
        tablica.push(currentJson);
        integers.push(currentJson.slice(11,14));
      }
      // NEXT
      fetch(`https://api.stormglass.io/v2/weather/point?lat=${cord1}&lng=${cord2}&params=${params}`, {
        headers: {
          'Authorization': `${process.env.STORM_API}`
        }
      }).then((response) => response.json()).then((jsonData) => {
        console.log(jsonData.hours.length);
        let leng = jsonData.hours.length;
        let j = 0;
        for(let i = 0; i<leng;i++) {
          if(jsonData.hours[i].time.includes(integers[j]) && j < 10) {
            j++;
            cloudsDate.push(jsonData.hours[i].time)
            clouds.push(jsonData.hours[i].cloudCover)
          }
        }
        // NEXT
        console.log(cloudsDate);
        console.log(clouds);
        let calcs = (obj) => {
          let sum = 0;
          let count = 0;
          for(let el in obj) {
            if(obj.hasOwnProperty( el )) {
              sum+=parseInt(obj[el]);
              count++;
            }
          }
          return sum / count;
        }
        for(let i = 0; i<clouds.length; i++) {
          console.log(calcs(clouds[i]));
          median.push(calcs(clouds[i]));
        }
        console.log(median);
        calcs();

        for(let i = 0; i<tablica.length; i++) {
          myObject[`key${i}`] = new Array();
          let fastDate = new Date(tablica[i]).toLocaleString('en-US', {timeZone: timezone});
          let helpDate = new Date(fastDate);
          myObject[`key${i}`].push(new Date(helpDate.getTime() - (helpDate.getTimezoneOffset() * 60000)).toISOString());
          myObject[`key${i}`].push(median[i]);
        }
        myObject['city'] = new Array();
        myObject['city'].push(cityAPI);
        console.log(myObject['key0'][1]);
        response.json(myObject);
        cloudsDate = [];
        clouds = [];
        tablica = [];
        integers = [];
        median = [];
        myObject = {};
      });
     })
});
