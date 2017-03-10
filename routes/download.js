var router = require('express').Router(),
path = require('path'),
mime = require('mime'),
fs = require('fs'),
config = require('../config');

router.get('/', function(req, res){

	var file = config.directory + '/data.csv';

  	var filename = path.basename(file);
  	var mimetype = mime.lookup(file);

  	res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  	res.setHeader('Content-type', mimetype);

  	var filestream = fs.createReadStream(file);
  	filestream.pipe(res);
});

module.exports = router;
