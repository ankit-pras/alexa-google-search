// This skill reuses elements from the Adrian Smart Assistant Project
// https://github.com/TheAdrianProject/AdrianSmartAssistant/blob/master/Modules/Google/Google.js



'use strict'

var AlexaSkill = require('./AlexaSkill')
var rp = require('request-promise')
var $ = require('cheerio')
var Entities = require('html-entities').XmlEntities;
var entities = new Entities();
var striptags = require('striptags');
var locale = "en-GB"  // replace with en-US for us specifc results


var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var AlexaGoogleSearch = function() {
    AlexaSkill.call(this, APP_ID)
}

AlexaGoogleSearch.prototype = Object.create(AlexaSkill.prototype)
AlexaGoogleSearch.prototype.constructor = AlexaGoogleSearch


AlexaGoogleSearch.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
    console.log("AlexaGoogleSearch onLaunch requestId" + launchRequest.requestId + ", sessionId: " + session.sessionId)
    var speechOutput = "Welcome to Google Search. What are you searching for?"
    var repromptText = ""
    response.ask(speechOutput, repromptText)
}


AlexaGoogleSearch.prototype.intentHandlers = {
    "SearchIntent": function(intent, session, response) {
		var query = intent.slots.search.value
		
		// Title for Alexa app card
        var cardTitle = ("Google search result for: " + query)
        
		// Remove spaces and replace with +
		query = query.replace(" ","+")
		
		// Remove _ and replace with +
		query = query.replace(/ /g ,"+")
		
		
        var speechOutput = "Error"
        


        // Parsing routine modified from 
        // https://github.com/TheAdrianProject/AdrianSmartAssistant/blob/master/Modules/Google/Google.js        

        //create google search string
        // var queryString = "http://www.google.com/search?q=?hl=" + locale + '&client=firefox-a' + "&oe=utf8&q=" + query 
        
        	var queryString = "http://www.google.com/search?q=" 
			+'?hl=en-GB'      //  Search language
	        +'&oe=utf8'                         //  Output encoding
	        +'&q='+query                 //  Query string
	


        // use request-promise to acquire html from google and use cheerio to search for specific div sections on page
        rp(queryString)
            .then(function(body) {
            	console.log("Running parsing")
            	                
        
		var result = "";

		
	
        
        //var mainresults = $('#ires',body).html()

        //	console.log(mainresults)
            


		// Look for google answers box type 2
		if (!result){
		
				var items = $('._m3b',body).get().length // find how many sections there are in answer box
		
            if (items) {
            console.log( items + " Type 2 answer sections result")

                    for (var count = 0; count < items; count++) {	

                    result = result +	 $('._m3b',body).eq(count).html() + "<br> <br>" 
                    }
            }
        }
		// Look for google answers box type 3
		if (!result){
		
				var items = $('._G0d',body).get().length // find how many sections there are in answer box
		
                if (items) {
                console.log( items + " Type 3 answer sections result")

                        for (var count = 0; count < items; count++) {	

                        result = result +	 $('._G0d',body).eq(count).html() + "<br> <br>"
                        }
                }
        }
            
		// Look for google answers box type 4 (Data table)
		if (!result){
		
				var items = $('.g>div>table>tr>td>ol>li',body).get().length // find how many lines there are in answer table
		
                if (items) {
                console.log( items + " Type 4 answer sections result")


                        for (var count = 0; count < items; count++) {	

                        result = result + " " + (count+1)+ " " + $('.g>div>table>tr>td>ol>li',body).eq(count).html() + ""
                        }
            }
        }  
            
                     if (!result){
		// Look for google answers box type 1
		var items = $('._o0d',body).get().length // find how many sections there are in answer box
		
		if (items) {
		console.log( items + " Type 1 answer sections result")
		
				for (var count = 0; count < 2; count++) {	// limit to two sections as there may be two answer boxes also wikipedia boxes have multiple sections
		 
				result = result +	$('._o0d',body).eq(count).html() + "<br> <br>"
				}
		}
            }   

            

     

			// strip out html tags to leave just text
			var speechOutputTemp = entities.decode(striptags(result))
			
			// make sure all full stops have space after them otherwise alexa says the word dot 
			var speechOutputTemp = speechOutputTemp.split('.com').join(" dot com ") // deal with dot com
			var speechOutputTemp = speechOutputTemp.split('.co.uk').join(" dot co dot uk ") // deal with .co.uk
            // need and extra filter to deal with decimal points but have to figure out javascript expression to do so
            
			var speechOutput = speechOutputTemp.split('.').join(". ") // deal with any remaining dots and turn them into full stops with spaces after which are ignored by alexa
			
			if (speechOutput=="") speechOutput = "I'm sorry, I wasn't able to find an answer."
			response.tellWithCard(speechOutput, cardTitle, speechOutput)

            //    response.tell(speechOutput)
            }).catch(function(err) {
            console.log("ERROR" + err)
            speechOutput = "There was an error processing your search."
            response.tell(speechOutput)
        })
    },

    "AMAZON.StopIntent": function(intent, session, response) {
        var speechOutput = ""
        response.tell(speechOutput)
    }
}

exports.handler = function(event, context) {
    var AlexaGoogleSearchHelper = new AlexaGoogleSearch()
    AlexaGoogleSearchHelper.execute(event, context)
}