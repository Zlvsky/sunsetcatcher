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
var cord1, cord2, slides, slideWidth;

const button = document.getElementById('submit'),
      input = document.getElementById('inputstyle'),
      inputcontainer = document.getElementById('input-container'),
      weatherwrap = document.getElementById('weatherwrap'),
      letsgo = document.getElementById('letsgo'),
      layers = document.querySelectorAll('.left-layer'),
      cityspan = document.getElementById('citylocation');
// DIVS TO MANIPULATE WITH OPACITY AND display and width
const appwrap = document.getElementById('appwrap'),
      locationwrap = document.getElementById('locationwrap'),
      inputwrap = document.getElementById('inputwrap'),
      arrowrap = document.getElementById('arrowwrap'),
      content = document.getElementById('content');


letsgo.onclick = () => {
  for(const layer of layers) {
    layer.classList.toggle("active");
  }
  setTimeout(() => {
    appwrap.style.display = 'none';
    inputwrap.style.display ='block';
  }, 650)
}

button.onclick = () => {
  let inputval = input.value,
      val = inputval.split(/[,]+/);
  if(inputval == "" || inputval.includes(',') == false || val[1] == '' || val[1] == false) {
    input.classList.add('start-color');
    inputcontainer.classList.add('start-shake');
    setTimeout(()=>{
      input.classList.remove('start-color');
      inputcontainer.classList.remove('start-shake');
      input.value = '';
    }, 700);
  } else {
  content.classList.toggle('height190');
  val = input.value.split(/[,]+/);
  for(const layer of layers) {
    layer.classList.toggle("active");
  }
  setTimeout(() => {
    locationwrap.style.display ='block';
    inputwrap.style.display ='none';
    arrowrap.style.display ='flex';
  }, 850);

  (async () => {
    const api_url = `/myapi/${val[0].polishChars()},${val[1].polishChars()}`;
    const response = await fetch(api_url);
    const json = await response.json();
    // const weather_url = '/weather/city';
    // const weather_response = await fetch(weather_url);
    // const summary = await weather_response.json();
    const summary = json;
    cityspan.innerHTML = summary['city'];
    console.log(summary);

    for(let i=0; i<10;i++) {
      const weatherinfo = Math.ceil(summary[`key${i}`][1]);
      const sunsetinfo = summary[`key${i}`][0].slice(11,16);
      const day = summary[`key${i}`][0].slice(5,10);
      let iDiv = document.createElement('div');
      let iconDiv = document.createElement('div');
      let sunsetDiv = document.createElement('div');
      let cloudsDiv = document.createElement('div');
      let dateDiv = document.createElement('div');
      iDiv.className = 'weather';
      sunsetDiv.className = 'sunsetinfo';
      cloudsDiv.className = 'cloudinfo';
      dateDiv.className = 'dayinfo';
      if(weatherinfo < 30) {
        iconDiv.className = 'sun';
      } else if(weatherinfo >= 30 && weatherinfo < 60) {
        iconDiv.className = 'lessclouds';
      } else if(weatherinfo >= 60) {
        iconDiv.className = 'clouds';
      }
      sunsetDiv.textContent = sunsetinfo;
      cloudsDiv.textContent = `clouds ${weatherinfo}%`;
      dateDiv.textContent = day;
      iDiv.appendChild(iconDiv);
      iDiv.appendChild(sunsetDiv);
      iDiv.appendChild(cloudsDiv);
      iDiv.appendChild(dateDiv);
      weatherwrap.appendChild(iDiv);
    }
    slides = document.getElementsByClassName('weather'),
    slideWidth = slides[0].clientWidth + 20;

    var carousel = $('#weatherwrap'),
        threshold = 50;


    $('#next').click(function(){ shiftSlide(-1) })
    $('#prev').click(function(){ shiftSlide(1) })

    function shiftSlide(direction) {
      if (carousel.hasClass('transition')) return;
      carousel.off('mousemove')
              .addClass('transition')
              .css('transform','translateX(' + (direction * slideWidth) + 'px)');
      setTimeout(function(){
        if (direction === 1) {
          $('.weather:first').before($('.weather:last'));
        } else if (direction === -1) {
          $('.weather:last').after($('.weather:first'));
        }
        carousel.removeClass('transition');
        carousel.css('transform','translateX(0px)');
        slideWidth = slides[0].clientWidth + 20;
      },500);
    }
  })();
  // console.log(input);
 }
}
locationwrap.onclick = () => {
  $('.weather').remove();
  for(const layer of layers) {
    layer.classList.toggle("active");
    input.value = '';
  }
  content.classList.toggle('height190');
  setTimeout(function (){
    arrowrap.style.display = 'none';
    locationwrap.style.display = 'none';
    inputwrap.style.display = 'block';
  }, 650);

}

// REPLACE POLISH CHARS
String.prototype.polishChars = function()
{
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
}
