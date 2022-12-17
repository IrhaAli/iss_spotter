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
  const longLatLink = `http://ipwho.is/${ip}`;
  client.get(longLatLink, (error, response, body) => {
    body = JSON.parse(body);
    const coords = { "longitude": body.longitude, "latitude": body.latitude };
    if (!error && !body.success) {
      error = `Server message says: ${body.message}`;
    }
    callback(error, coords);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };