const nodeGeocoder = require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = nodeGeocoder(options);

module.exports = geocoder;
