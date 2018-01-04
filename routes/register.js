var express = require('express');
var router = express.Router();
var fs = require('fs');

function addRegister(eventInfo, callback_)
{
	eventNumber = parseInt(Object.keys(eventInfo)[0]);
	
	if(eventInfo[eventNumber][0] == "" || eventInfo[eventNumber][1] == "")
		callback_("Error submitting: A field was left blank");
	else if(tableData[eventNumber][0] != "")
		callback_("Error submitting: Someone else is already signed up for that");
	else
	{
		tableData[eventNumber][0] = eventInfo[eventNumber][0];
		tableData[eventNumber][1] = eventInfo[eventNumber][1];
		
		fs.appendFileSync('signUp.txt', eventList[eventNumber] + ":" + eventInfo[eventNumber][0] + "," + eventInfo[eventNumber][1] + '\n');
		
		callback_("Information Submitted");
	}
}

router.get('/', function(req, res) {
	res.render('index', { title: 'Register'});
});

router.post("/", function(req, res) {
	addRegister(req.body, function(error) {
		res.render('index', { title: 'Register', error:error});
	});
});

module.exports = router;
