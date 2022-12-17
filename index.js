// index.js
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  fetchCoordsByIP(ip, (error, coords) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    fetchISSFlyOverTimes(coords, (error, issflyTimes) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }
      console.log('Sucess: ', issflyTimes);
    });
  });
});