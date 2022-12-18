const request = require('request-promise-native');

/**
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

/**
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(ip) {
  return request(`http://ipwho.is/${JSON.parse(ip).ip}`);
};

const fetchISSFlyOverTimes = function(coords) {
  const { latitude, longitude } = JSON.parse(coords);
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const printPassTimes = function(body) {
  const passTimes = JSON.parse(body).response;
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

const nextISSTimesForMyLocation = function() {
  fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(printPassTimes)
    .catch(err => console.error('It didn\'t work : ', err));
};

module.exports = { nextISSTimesForMyLocation };