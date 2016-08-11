//Mandatory Modules
var express = require("express")
var parser = require("body-parser");

//Modules for Handling .csv file and Download
var fs = require("fs");
var http = require("http");
var path = require('path');
var mime = require('mime');

//Modules for connecting the Mongo Db
var MongoClient = require('mongodb').MongoClient;

//Setting the express and body-parser module
var app=express();
app.use(express.static(__dirname));
app.set('views',__dirname+'/Views');
app.set('view engine','ejs');
app.use(parser.urlencoded({ extended: false }));


//Function to convert the Cursor obj to .CSV

function ConvertToCSV(objArray) 
{
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str = '';
      var attribute = '';
      for (var index in array[0]) {

              if(typeof(array[0][index])=="object"){

                  if(Array.isArray(array[0][index]))
                  {  
                    for(var j=0;j<array[0][index].length;j++) 
                    {                      
                        if(typeof(array[0][index][j])=="object")
                        {  
                          for(var m in array[0][index][j]) {     
                              attribute += String(index+'['+j+']'+'.'+m).replace(/\n/g, " ").replace(/,/g, ".");
                              attribute += ',' ;
                           } 
                         } 
                         else 
                         {
                              attribute += String(index+'.'+j).replace(/\n/g, " ").replace(/,/g, ".");
                              attribute += ',';
                         } 
                    }  
                  } 
                  else 
                  {
                       for(var l in array[0][index]) {      
                          attribute += String(index+'.'+l).replace(/\n/g, " ").replace(/,/g, ".");
                          attribute += ',';          
                       }
                  }     
                } 
                else 
                {
                    attribute += String(index).replace(/\n/g, " ").replace(/,/g, "."); 
                    attribute += ',';
                }
        }
        str += attribute + '\r\n';
      for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {

              if(typeof(array[i][index])=="object"){

                  if(Array.isArray(array[i][index]))
                  {  
                    for(var j=0;j<array[i][index].length;j++) 
                    {                      
                        if(typeof(array[i][index][j])=="object")
                        {  
                          for(var m in array[i][index][j]) {     
                              line += String(array[i][index][j][m]).replace(/\n/g, " ").replace(/,/g, ".");
                              line += ',' ;
                           } 
                         } 
                         else 
                         {
                              line += String(array[i][index][j]).replace(/\n/g, " ").replace(/,/g, ".");
                              line += ',';
                         } 
                    }  
                  } 
                  else 
                  {
                       for(var l in array[i][index]) {      
                          line += String(array[i][index][l]).replace(/\n/g, " ").replace(/,/g, ".");
                          line += ',';          
                       }
                  }     
                } 
                else 
                {
                    line += String(array[i][index]).replace(/\n/g, " ").replace(/,/g, "."); 
                    line += ',';
                }
          } 
          str += line + '\r\n';
      }
      fs.writeFile("data.csv",str,function(err,data)
      {
          if(err){
              console.log(err);
           }
      })
          
}

// Handling the Mongo Db export Tool's Input request.
app.get('/Query',function(req,res){
	res.render("QueryForm.ejs");
})


// Connecting to the Mongo db server
app.post('/Query',function(req,res){
  var url = req.body.url;
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
              ConvertToCSV(JSON.parse(JSON.stringify(doc)));       //Conversion of JSON to .CSV
        		}
            console.log("Completed");
    		}); 
  	};
  });
});


// File Downloading handler.
app.get('/download', function(req, res){

	var file = __dirname + '/data.csv';

  	var filename = path.basename(file);
  	var mimetype = mime.lookup(file);

  	res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  	res.setHeader('Content-type', mimetype);

  	var filestream = fs.createReadStream(file);
  	filestream.pipe(res);
});


// Sends the data at port 1234
app.listen(1234, function(){
	console.log("Listen @ 1234");
})
