module.exports.dbURI = 'mongodb://localhost/dhscompsci';
module.exports.dbName = 'dhscompsci';
module.exports.dbPort = 27017;
module.exports.dbHost = 'localhost';
if (!process.env.NODE_ENV || process.env.NODE_ENV == 'development') {
	module.exports.host = 'localhost';
	module.exports.port = 8000;
}
else if (process.env.NODE_ENV == 'production') {
	module.exports.host = '192.168.1.254'; 
	module.exports.port = 80;
}
module.exports.cookie_secret = 'hsVwy4GLieLI90ZNlJD2heC3zRFWJjwHAeAnbxLvXcVzW18SelwogU0G0zcHd6IH';
