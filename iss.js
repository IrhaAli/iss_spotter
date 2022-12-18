const client = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const ipAddressFinder = 'https://api.ipify.org/?format=json';
  client.get(ipAddressFinder, (error, response, body) => {
    let ip;
    if (!error) {
      (response.statusCode !== 200) ? error = `Status Code: ${response.statusCode}, (See https://http.cat/${response.statusCode} for more info)` : ip = JSON.parse(body).ip;
    }
    callback(error, ip);
  });
};

/**
 * Fetches the Geo Coordinates By IP
 * @param {string} ip address to check
 * @param {function} callback to put the geocoordinates in
 */
const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch coordinates from JSON API
  const longLatLink = `http://ipwho.is/${ip}`;
  client.get(longLatLink, (error, response, body) => {
    if (!error && response.statusCode !== 200) {
      error = `Server message says: ${body.message}`;
      callback(error, null);
      return;
    }
    const JSONbody = JSON.parse(body);
    const coords = { "longitude": JSONbody.longitude, "latitude": JSONbody.latitude };
    callback(null, coords);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // use request to fetch flying times of ISS from JSON API
  const flyoverTime = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  client.get(flyoverTime, (error, response, body) => {
    let flyTimes;
    if (!error) {
      (response.statusCode !== 200) ? error = `Status Code: ${response.statusCode}, (See https://http.cat/${response.statusCode} for more info)` : flyTimes = JSON.parse(body).response;
    }
    callback(error, flyTimes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };