var zip_code;
navigator.geolocation.getCurrentPosition(
  async (position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    zip_code = data.address.postcode;
    console.log("from nomiatim", zip_code);
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log("ZIP Code:", data.address.postcode);
    //   zip_code = data.address.postcode;
    // });
    zip_code = "03896";
    if (zip_code.length === 5) {
      const wResponse = await fetch(
        `https://wx.whizti.com/api/weather/800?zip_code=${zip_code}`
      );
      const weatherjson = await wResponse.json();
      console.log("weaather Response", weatherjson);
      const weather = document.querySelector("#weather");
      weather.innerHTML = `
      <div>${weatherjson.CurrentCondition.City}</div>
      <div>${weatherjson.CurrentCondition.Temperature}&deg;F <span><img src="${weatherjson.CurrentCondition.WeatherIconURL}"/></span></div>
      `;
      const weatherHero = document.querySelector("#weatherHero");
      weatherHero.innerHTML = `<div class="panTemp">${weatherjson.CurrentCondition.Temperature}&deg;F
     <span><img src="${weatherjson.CurrentCondition.WeatherIconURL}"/></span>
     <span class="lead">${weatherjson.CurrentCondition.WeatherDescShort}</span>
     <spna class="display-6">Feels like ${weatherjson.CurrentCondition.RealFeelTemperature}&deg;F</span>
      </div>
      
      `;
      // const weekly = document.querySelector("#panWeekday");
      // weatherjson.WeeklyForecast.forEach((element) => {
      //   weekly.innerHTML += `<div>${element.Date}</div>`;
      //   weekly.innerHTML += `<div>${element.TempMaxF}</div>`;
      // });
    }
  },
  async (error) => {
    /*
    if (error.code === error.PERMISSION_DENIED) {
      console.log("❌ User denied location access.");
      // getZipfromIP();
    } else {
      console.log("⚠️ Error getting location:", error.message);
      // getZipfromIP();
    }
*/
    const responseFromip = await fetch(
      "https://ipinfo.io/json?token=e2131bd04aca82"
    );
    const respData = await responseFromip.json();
    zip_code = respData.postal;
    console.log("zzzzzzzzzz ", zip_code);

    if (zip_code.length === 5) {
      const wResponse = await fetch(
        `https://wx.whizti.com/api/weather/800?zip_code=${zip_code}`
      );
      const weatherjson = await wResponse.json();
      console.log("weaather Response", weatherjson);
    }
  }
);

//apiinfo.io
//token: e2131bd04aca82
function getZipfromIP() {
  fetch("https://ipinfo.io/json?token=e2131bd04aca82")
    .then((response) => response.json())
    .then((data) => console.log("ZIP Code:", data.postal));
}
