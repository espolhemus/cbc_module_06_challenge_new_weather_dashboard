var searchFormEl = document.querySelector('#searchInput');
var API_key = "082ccd32fbf466c90e98e887c8b8fd7d"
var cityName
var cityLat
var cityLon
var cityTimeZone

// At page load, call the searchHistoryArray[] and display on the index.html
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data from localStorage
    var searchHistoryList = document.getElementById('cardsContainer')
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory'))
  
    // Check if data exists
    if (searchHistoryArray !== null) {
    // Loop through only the 10 most recent searches to keep list managable
      for (var i = 0; i < searchHistoryArray.length && i < 10; i++) {
      // Update HTML element with the retrieved data
  
        var searchHistoryListItem = document.createElement("li");
        console.log(searchHistoryArray[i])
   
        var a = document.createElement('a');
  
        a.textContent = searchHistoryArray[i]
      
        // Set the href attribute of the <a> element to a JavaScript function call with the value as the parameter
        a.setAttribute("href", "javascript:getCoordinates('" + searchHistoryArray[i] + "')");
        // Append the <a> element to the <li> element
        searchHistoryListItem.appendChild(a);
        // Append the <li> element to the <ul> element
        searchHistoryList.appendChild(searchHistoryListItem);
      }
    }
  });
  
function handleSearchFormSubmit(event) {
  event.preventDefault();
  
  var cityName = document.querySelector('#searchInput').value;
    
      if (!cityName) {
        console.error('Please enter a valid city name');
        return;
      }
    
      // Call next function
    storeHistory(cityName)
  }
  
// function to append cityName to array and storing in localstorage
  
  function storeHistory(cityName){
    // Retrieve existing array from localStorage
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory'));
  
    // Check if the retrieved value is null or undefined
    if (!searchHistoryArray) {
      searchHistoryArray = [];
    }
  
    // else check to see city name value already exists in array
    // if it does exist, delete if from the array and .push to array
    // else appent to array
  
    for (var i = 0; i < searchHistoryArray.length; i++) {
      if (searchHistoryArray[i] === cityName) {
        searchHistoryArray.splice(i, 1);
        i--}
      }
  
    // Append a new city to the array
    // Use array.unshift() to add new cityName as first item in array
    // searchHistoryArray.push(cityName);
    searchHistoryArray.unshift(cityName);
  
    // Save the updated array back to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
  
    // Call next function
    getCoordinates(cityName)
  }

// receive cityName and generate API call to obtain lat and lon coordinates
function getCoordinates(cityName) {
  var geocodingURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + API_key;
  
  fetch(geocodingURL)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        cityLat = (data[0].lat)
        cityLon = (data[0].lon)
        console.log('Name and Lat and Long \n----------');
        {
            console.log(data[0].name);
            console.log(data[0].lat);
            console.log(data[0].lon);
            console.log(cityLat);
            console.log(cityLon);
            console.log(data)
        }
  getCurrentConditions(cityLat, cityLon) 
})
}

function getCurrentConditions(cityLat, cityLon){
var currentConditionsURL = "http://api.openweathermap.org/data/3.0/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,daily,alerts" + "&appid=" + API_key + "&units=imperial"
  // console.log(currentConditionsURL)
  // console.log (cityLat, cityLon)
const container = document.querySelector('#cardsContainer')   
fetch(currentConditionsURL)
  // const container = document.querySelector('#cardsContainer') 
  .then(response => response.json()) // Parse the response as JSON
  .then(data => {
    const formattedDate = dayjs.unix(data.current.dt).format('MMMM DD, YYYY')
    const card = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">City Name: ${cityName}</h5>
        <p class="card-text">DT: ${formattedDate}</p>
        <p class="card-text">Timezone: ${data.timezone}</p>
        <p class="card-text">TZ Offset: ${data.timezone_offset}</p>
        <p class="card-text">Temperature: ${data.current.temp}</p>
        <p class="card-text">Wind Speed: ${data.current.wind_speed}</p>
        <p class="card-text">Humidity: ${data.current.humidity}</p>
        <p class="card-text">Description: ${data.current.weather[0].main}</p>
        <p class="card-text">Weather Icon Link: ${data.current.weather[0].icon}</p>
      </div>
      </div>
      `;
      container.innerHTML += card;
  });

  // .catch(error => {
  //   // Handle any errors that occurred during the request
  //   console.error(error);
  // });    

//   getForecast(cityLat, cityLon, cityTimeZone)
}