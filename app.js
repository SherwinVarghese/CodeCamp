var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');

var app = express();

// configuration =============================
if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   mongoose.connect(env['mongodb'][0].credentials.uri);
} else {
   mongoose.connect('mongodb://r3nwsa9dhoq7hb40:ratm745ilgtrok3b@10.11.241.3:44923/ew0nt2x4gifseont');
}

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api.json' }));
app.use(methodOverride());

var RegisterSchema = require('./models/Register.js').RegisterSchema;
var Registrations = mongoose.model('Registration', RegisterSchema);
var crosswordClues = require('./models/CrosswordClues.js').Clues;

//get all registrations
app.get('/api/registrations', function(req, res) {
	// use mongoose to get all todos in the database
	Registrations.find(function(err, registrations) {
		// if there is an error retrieving, send the error.
		// nothing after res.send(err) will execute
		if(err)
			res.send(err);
		
		res.json(registrations); //return all registrations in JSON format
	});
});

//create registration and send back all registrations after creation
app.post('/api/registrations', function(req, res) {
	// create a registration, information comes from AJAX request from Angular
	Registrations.create({
		name : req.body.name,
		inumber : req.body.inumber,
		mailid : req.body.mailid,
		message : req.body.message,
		status : "Success",
		regtime : (new Date()).getTime()
	}, function(err, registration) {
		if (err) {
			console.log(err);
			res.status(400).json({"code" : "400","message" : err});
			//res.send(err);			
		} else {
			//get and return all the registrations after you create another
			Registrations.find(function(err, registrations) {
				if (err)
					res.send(err);
				console.log("Number of registrations::::: " + registrations.length);
				if(registrations.length > 80 && registrations.length <= 1000) {
				    var conditions = { _id: registration._id }
				      , update = { status: 'waitinglist' }
				      , options = {};
				
					Registrations.update(conditions, update, options, function(err, registration) {
						if(err) {
							console.log(err);
							var error = {
								"code" : "1002",
								"message" : "Something went wrong!"
							};
							res.status(400).json({"code" : "400", "message" : error});
						}
					});
					var error = {
						"code" : "1000",
						"message" : "You are on the waiting list!"
					};
					res.status(400).json({"code" : "400", "message" : error});
				} else if(registrations.length > 1000) {
				    var conditions = { _id: registration._id }
				      , update = { status: 'closed' }
				      , options = { multi: true };
				
					Registrations.update(conditions, update, options, function(err, numAffected) {
						if(err) {
							console.log("Failed to update row " + registration._id + " ::  " + err);
							var error = {
								"code" : "1002",
								"message" : "Something went wrong!"
							};
							res.status(400).json({"code" : "400", "message" : error});
						} else {
							console.log("Updation of row " + registration._id + " was successful");
						}
					});
					var error = {
						"code" : "1001",
						"message" : "Registrations are closed!"
					};
					res.status(400).json({"code" : "400", "message" : error});
				} else {
					res.status(200).json({"code":"201", "message":"Successfully registered"});	
				}
			});			
		}		
	});
});

app.post('/api/validate', function(req, res) {
	var right = 0;
	var wrong = 0;

	console.log("CROSSWORD LENGTH:::::::: "+crosswordClues.length);

	var i = 0;
	for (i; i< crosswordClues.length; i++) {
		console.log(i+" ::::: "+req.param("cw"+i));
		if(crosswordClues[i] == req.param("cw"+i)) {
			right++;
			console.log("right:::: "+crosswordClues[i]);
		} else {
			wrong++;
			console.log("wrong::::: "+crosswordClues[i]);
		}
	}
	if(right == crosswordClues.length && wrong == 0) {
		console.log("Sending success");
		res.status(200).json({"code":"200", "message":"Crossword successfully solved"});
	} else if (right >= 5) {
		console.log("Completed with few errors");
		res.status(200).json({"code":"200", "message":right+" Correct; "+wrong+" Incorrect"});
	} else {
		console.log("More errors, sending error");
		res.status(400).json({"code":"400", "message":right+" correct answers. Get atleast 5 right for successful registration but maximum possible to have a better chance."});
	}
		
});

//delete a registration
app.delete('/api/registrations/:registration_id', function(req, res) {
	Registrations.remove({
		_id : req.params.registration_id
	}, function(err, registration) {
		if(err)
			res.send(err);		
		// get and return all the registration after you delete this
		Registrations.find(function(err, registrations) {
			if(err)
				res.send(err);
			res.json(registrations);	
		});
	});
});

app.delete('/api/resetdata', function(req, res) {
	Registrations.remove({}, function(err) {
		if(err)
			res.send(err);
		// get and return all the registration after you delete this
		Registrations.find(function(err, registrations) {
			if(err)
				res.send(err);
			res.json(registrations);	
		});
	});
});

// application ------------------------
app.get('/', function(req, res) {
	res.sendfile('./public/register.html');
});

app.get('/registrations', function(req, res) {
	res.sendfile('./public/registrations.html');
});

app.get('/register', function(req, res) {
	res.sendfile('./public/register.html');
});

app.get('/reset', function(req, res) {
	res.sendfile('./public/resetdata.html');
});

// listen (start app with node app.js) ===================
var PORT = process.env.PORT || 5050;
app.listen(PORT);
console.log("App listening on port " + PORT);



