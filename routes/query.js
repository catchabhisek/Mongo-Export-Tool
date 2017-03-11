var router = require('express').Router();
var csvConverter = require('../csv-converter');
var MongoClient = require('mongodb').MongoClient;
var User = require('../model/user');

router.get('/',function(req,res,next){
	if(!req.session.user) return res.redirect('/');
	res.render("QueryForm.ejs",{user:req.session.user});
});

router.get('/history',function(req,res,next){
	User.findOne({email:req.session.user.email},function(err,user){
		res.json(user.history);
	});
});

// Connecting to the Mongo db server
router.post('/',function(req,res,next){
  var url = req.body.url;
  console.log(req.body);
	User.update({email:req.session.user.email},{$push:{history:req.body}},null,function(err,user){
		console.log("updated");
		console.log(user.history);
	});
  MongoClient.connect(url, function (err, db) {
    if (err) {
      	console.log('Unable to connect to the mongoDB server. Error:', err);
        res.send(err);
  	}
  	else {
    	console.log('Connection established to', url);

    	// Get the collection name
    	var collection = db.collection(req.body.collection);


    	// Handling the post request of Query
        var lim,ski,sor,field;

        if(isNaN(parseInt(req.body.limit, 10)))
        {
              lim=50
        }

        else{
              lim=parseInt(req.body.limit, 10);
        }


        if(isNaN(parseInt(req.body.skip, 10))){
              ski=0;
        }

        else{
              ski=parseInt(req.body.skip, 10);
        }

        if(req.body.sort==""){
              sor="{}";
        }

        else{
              sor=req.body.sort;
        }

        if(req.body.fields==""){
              field="{}";
        }

        else{
              field=req.body.fields;
        }


    		//We have a cursor now with our find criteria and desired projection
    		var cursor = collection.find(JSON.parse(req.body.query),{fields:JSON.parse(field)});

    		// to sort the collection.
    		cursor.sort(JSON.parse(sor));

    		//to Limit
    		cursor.limit(lim);

    		//Skip specified records.
    		cursor.skip(ski);


    		//Cnvert the tuples of the result of the Query into an array
    		cursor.toArray(function (err, doc) {
      			if (err) {
       				console.log(err);
      			}
      			else {
              res.render("Results.ejs",{Doc:JSON.parse(JSON.stringify(doc))});  //Display of the resultent entities on the client-side
              csvConverter.convertToCSV(JSON.parse(JSON.stringify(doc)));       //Conversion of JSON to .CSV
        		}
            console.log("Completed");
    		});
  	};
  });
});

module.exports = router;
