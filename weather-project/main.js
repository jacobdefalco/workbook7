"use strict";

const citiesDDL = document.querySelector("#cities-ddl");
const weatherDetailsTbody = document.querySelector("#weather-details-tbody");
const cityNameDisplay = document.querySelector("#city-div");

window.onload = function fetchCitiesFromArray() {
  fetch(
    "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
  )
    .then((response) => response.json())
    .then((json) => loadCitiesInDDL(json));
};

function loadCitiesInDDL(citiesArray) {
  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select A City";
  citiesDDL.appendChild(defaultOption);

  for (let i = 0; i < citiesArray.length; i++) {
    let newOption = document.createElement("option");
    newOption.value = citiesArray[i].rank;
    newOption.textContent = citiesArray[i].city;
    citiesDDL.appendChild(newOption);
  }
}

function fetchAndLoadWeatherDetailsInTable(citiesArray, value) {
  cityNameDisplay.innerText = "";
  let matchingCity = citiesArray.filter((r) => r.rank == value);
  cityNameDisplay.innerText =
    citiesDDL.options[citiesDDL.selectedIndex].innerText +
    `, ${matchingCity[0].state}`;
  let lat = matchingCity[0].latitude;
  let long = matchingCity[0].longitude;
  fetch(`https://api.weather.gov/points/${lat},${long}`)
    .then((response) => response.json())
    .then((json) => fetchForecast(json));
}

function fetchCities(value) {
  weatherDetailsTbody.innerHTML = "";
  fetch(
    "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
  )
    .then((response) => response.json())
    .then((jsonedArray) =>
      fetchAndLoadWeatherDetailsInTable(jsonedArray, value)
    );
}

function fetchForecast(matchingCity) {
  let url = matchingCity.properties.forecast;
  fetch(url)
    .then((response) => response.json())
    .then((jsonedResponse) => buildWeatherDetailsRow(jsonedResponse));
}

function buildWeatherDetailsRow(matchingCity) {
  weatherDetailsTbody.innerHTML = "";
  for (let i = 0; i < matchingCity.properties.periods.length; i++) {
    let row = weatherDetailsTbody.insertRow(-1);

    let cell1 = row.insertCell(0);
    cell1.innerText = matchingCity.properties.periods[i].name;

    let cell2 = row.insertCell(1);
    cell2.innerText = matchingCity.properties.periods[i].temperature + "°F";

    let cell3 = row.insertCell(2);
    cell3.innerText = `${matchingCity.properties.periods[i].windSpeed}, ${matchingCity.properties.periods[i].windDirection}`;

    let cell4 = row.insertCell(3);
    if (
      matchingCity.properties.periods[i].probabilityOfPrecipitation.value ==
      null
    ) {
      cell4.innerText = "No Chance";
    } else {
      cell4.innerText = `${matchingCity.properties.periods[i].probabilityOfPrecipitation.value}%`;
    }

    let cell5 = row.insertCell(4);
    cell5.innerText = `${matchingCity.properties.periods[
      i
    ].dewpoint.value.toFixed(1)}%`;

    let cell6 = row.insertCell(5);
    cell6.innerText = `${matchingCity.properties.periods[i].relativeHumidity.value}%`;

    let cell7 = row.insertCell(6);
    cell7.innerText = `${matchingCity.properties.periods[i].shortForecast}`;

    let cell8 = row.insertCell(7);
    cell8.innerHTML = `<img src="${matchingCity.properties.periods[i].icon}">
    `;
  }
}
