const { nextISSTimesForMyLocation } = require('./iss');
const { printPassTimes } = require('./helper');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes);
});