const lat = 58.7984;
const lng = 17.8081;
const end = 2020-06-01;
const http = require('http'),
      fs = require('fs'),
      express = require('express'),
      path = require('path'),
      app = express(),
      request = require('request'),
      fetch = require('node-fetch');
let elo = async () => {
  var myObject = {};
  const api_url = `http://www.mapquestapi.com/geocoding/v1/address?key=k9dA7kjGnptNIrjn845RSkB3LHAjGxt1&location=Bialystok,Poland`;
  const fetch_response = await fetch(api_url);
  const json = await fetch_response.json();
  const nota = json.results[0].locations[0].adminArea5;
  for(let i = 0; i<10; i++) {
    myObject[`key${i}`] = new Array();
    myObject[`key${i}`].push('hejka');
    myObject[`key${i}`].push('siemanko');
  }
  myObject['city'] =  new Array();
  myObject['city'].push(nota);
  console.log(myObject);
}
elo();
