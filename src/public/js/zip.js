/*

navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log("✅ User allowed location!");
    console.log("Latitude:", position.coords.latitude);
    console.log("Longitude:", position.coords.longitude);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("ZIP Code:", data.address.postcode);
      });
  },
  (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      console.log("❌ User denied location access.");
      getZipfromIP();
    } else {
      console.log("⚠️ Error getting location:", error.message);
      getZipfromIP();
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

*/
