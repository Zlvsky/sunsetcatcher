// const http = require('http'),
//       fs = require('fs');
//
// const server = http.createServer(function(req, res) {
//   console.log('request was made: ' + req.url);
//   res.writeHead(200, {'Content type': 'text/html'});
//   const myStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
//   myStream.pipe(res);
// });
// server.listen(3000, '127.0.0.1');
// console.log('ayo');

// ecc544be-8e0c-11ea-84c3-0242ac130002-ecc5455e-8e0c-11ea-84c3-0242ac130002 stormglass

  const request = require('request');
  const fetch = require('node-fetch');
  const _ = require('underscore');
  const fs = require('fs');
  var cord1 = 52.9911,
      cord2 = 22.88422,
      params = 'cloudCover',
      utc = new Date().toJSON().slice(0,10).replace(/-/g,'-'),
      utcplus = parseInt(utc.slice(8,10)) + 10,
      newutc = utc.slice(0,8) + utcplus,
      cloudsDate = [],
      clouds = [],
      tablica = [],
      integers = [],
      median = [];
    // request('http://www.mapquestapi.com/geocoding/v1/address?key=k9dA7kjGnptNIrjn845RSkB3LHAjGxt1&location=Bialystok,Poland', { json: true }, (err, res, body) => {
    //   cord1 = body.results[0].locations[0].latLng.lat;
    //   cord2 = body.results[0].locations[0].latLng.lng;
    // });

// setTimeout(function() {
//   request(`https://api.weatherbit.io/v2.0/forecast/daily?key=dfea8201c6be4130b42786e0bd60ce94&lat=${cord1.toString()}&lon=${cord2.toString()}`, { json: true }, (err, res, body) => {
//     const elo = body.data.filter(function(x) {
//       console.log(x.weather);
//     })[0];
//     elo;
//   });
//
// }, 1000)

setTimeout(function() {
  fetch(`https://api.stormglass.io/v2/astronomy/point?lat=${cord1}&lng=${cord2}&end=${newutc}`, {
  headers: {
    'Authorization': 'ecc544be-8e0c-11ea-84c3-0242ac130002-ecc5455e-8e0c-11ea-84c3-0242ac130002'
  }
}).then((response) => response.json()).then((jsonData) => {
  let myJson = jsonData.data;

  console.log(myJson.length);
  for(let i = 0; i < myJson.length; i++) {
    let currentJson = myJson[i].sunset;
    tablica.push(currentJson);
    integers.push(currentJson.slice(11,14));
  }
  console.log(tablica);
  console.log(integers);

  })
},1000);
setTimeout(function() {
  console.log(integers);
}, 2500);


setTimeout(function() {
  fetch(`https://api.stormglass.io/v2/weather/point?lat=${cord1}&lng=${cord2}&params=${params}`, {
    headers: {
      'Authorization': 'ecc544be-8e0c-11ea-84c3-0242ac130002-ecc5455e-8e0c-11ea-84c3-0242ac130002'
    }
  }).then((response) => response.json()).then((jsonData) => {
    console.log(jsonData.hours.length); // SPRAWDZ KAZDY PO KOLEI CZY MA 18:0 I WPIERDOL TO DO TABLICY ELO
    let leng = jsonData.hours.length;
    let j = 0;
    for(let i = 0; i<leng;i++) {
      if(jsonData.hours[i].time.includes(integers[j]) && j < 10) {
        j++;
        cloudsDate.push(jsonData.hours[i].time)
        clouds.push(jsonData.hours[i].cloudCover)
      }
    }
  });
},3500);

setTimeout(function() {
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
  var myObject = {};
  for(let i = 0; i<tablica.length; i++) {
    myObject[`key${i}`] = new Array();
    myObject[`key${i}`].push(tablica[i]);
    myObject[`key${i}`].push(median[i]);
  }
  console.log(myObject['key0'][1]);
}, 4500)
