var express = require('express'),
	app = express(),
	path = require('path'),
	http = require('http').Server(app),
	fs = require('fs')

var bodyParser = require('body-parser');

eventList = [];
tableData = [];
tooltip = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var signup = require('./routes/register');
app.use('/', signup);

function generateTableData()
{
	fs.stat('eventNames.txt', function(err, stat) {
		if(err == null) {
			fs.readFile('signUp.txt', 'utf8', function (err,data) {
				if (err)
					return console.log(err);
				
				var splitData = data.split('\n');
				
				eventList.forEach(function(eventPlace) {
					currentInfo = ["",""]
					splitData.forEach(function(splitPlace) {
						if(splitPlace != "")
							if(eventPlace == splitPlace.split(":")[0])
								currentInfo = [splitPlace.split(":")[1].split(",")[0],splitPlace.split(":")[1].split(",")[1]];
					});
					tableData.push(currentInfo);
				});
			});
		} else if(err.code == 'ENOENT') {
			fs.writeFile('eventNames.txt', '');
		} else {
			console.log('Error: ', err.code);
		}
	});
}

function generateEventList(callback_)
{
	fs.readFile('eventNames.txt', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		splitData = data.split('\n')
		for(event in splitData)
		{
			if(splitData[event] != "")
				eventList.push(splitData[event].split(":")[0]);
				tooltip.push(splitData[event].split(":")[1]);
			if(event == splitData.length-1)
				callback_()
		}
	});
}

http.listen(3000, function(){
	console.log('listening on *:3000');
	
	generateEventList(function() {
		generateTableData();
	});
	
	app.use(express.static(__dirname + '/static'));
});
