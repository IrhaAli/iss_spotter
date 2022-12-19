const { nextISSTimesForMyLocation } = require('./iss_promised');
const { printPassTimes } = require('./helper');

nextISSTimesForMyLocation()
  .then((data) => {
    printPassTimes(data);
  })
  .catch(err => console.error('It didn\'t work : ', err));