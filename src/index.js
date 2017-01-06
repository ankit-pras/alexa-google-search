// This skill reuses elements from the Adrian Smart Assistant project
// https://github.com/TheAdrianProject/AdrianSmartAssistant/blob/master/Modules/Google/Google.js

'use strict';

var AlexaSkill = require('./AlexaSkill');
var rp = require('request-promise');
var $ = require('cheerio');
var Entities = require('html-entities').XmlEntities;
var entities = new Entities();
var striptags = require('striptags');
var tabletojson = require('tabletojson');
var xray = require('x-ray')();
var json2csv = require('json2csv');

var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var AlexaGoogleSearch = function() {
	AlexaSkill.call(this, APP_ID);
}

AlexaGoogleSearch.prototype = Object.create(AlexaSkill.prototype);
AlexaGoogleSearch.prototype.constructor = AlexaGoogleSearch;

AlexaGoogleSearch.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
	console.log("AlexaGoogleSearch onLaunch requestId" + launchRequest.requestId + ", sessionId: " + session.sessionId);
	var speechOutput = "Welcome to Google Search. What are you searching for?";
	var repromptText = "";
	response.ask(speechOutput, repromptText);
}

AlexaGoogleSearch.prototype.intentHandlers = {
	"SearchIntent": function(intent, session, response) {
		var query = intent.slots.search.value;
		
		// Title for Alexa app card
		var cardTitle = ("Google Search Result for: " + query);
		
		// Remove spaces and replace with +
		query = query.replace(" ","+");
		
		// Remove _ and replace with +
		query = query.replace(/ /g ,"+");
		
		var speechOutput = "Error";
		
		// Parsing routine modified from 
		// https://github.com/TheAdrianProject/AdrianSmartAssistant/blob/master/Modules/Google/Google.js        

		//parse queries
		
		// Create search sring
		var queryString = "http://www.google.com/search?q=" + query + '&oe=utf8';
		
		rp(queryString)
			.then(function(body) {
				console.log("Running parsing");
				console.log("Search string is:" + queryString);
				console.log("HTML is:" + $("#ires",body).html());
								
			// result variable init
			var found = 0;
		
//			if (!found && $('._m3b',body).length>0){
//                console.log("Don't know")
//				found = $('._m3b',body).html()
						
//			}
			//how many 2
			if (!found ){
				//how many
				var items = $('._m3b',body).get().length; // find how many lines there are in answer table
		
				if (items) {
					console.log( items + " how many 2 answer found");
					found = $('._eGc',body).html() + ", ";


					for (var count = 0; count < items; count++) {	
						found = found + $('._m3b',body).eq(count).html() + ", ";
					}
				}
            }

                        			//name list
			if (!found && $('#_vBb',body).length>0){

				found = $('#_vBb',body).html();
				console.log("Found name list");
			}

			//facts 1
			if (!found && $('._tXc>span',body).length>0){

				found = $('._tXc>span',body).html();
				console.log("Found facts 1");
			}

			//facts 2
			if (!found && $('._sPg',body).length>0){

				found = " "+$('._sPg',body).html();
				console.log("Found facts 2");			
			}
		
			//instant + description 1
			if (!found && $('._Oqb',body).length>0){

				found = $('._Oqb',body).html();
				console.log("Found instant and desc 1");

			//how many 1
				if ( $('._Mqb',body).length>0){

					found+= " "+$('._Mqb',body).html();
					console.log("Found Found instant and desc 1 - how many");
				}
			}
			//instant + description 2
			if (!found && $('._o0d',body).length>0){
                
                console.log("Found Found instant and desc 2")
				var tablehtml = $('._o0d',body).html()
                
                found = tablehtml // fallback in case a table isn't found
                
                xray(tablehtml, ['table@html'])(function (conversionError, tableHtmlList) {
                if (conversionError) {
                  console.log("Xray conversionError");
                }
                if (tableHtmlList){
                  // xray returns the html inside each table tag, and tabletojson
                  // expects a valid html table, so we need to re-wrap the table.
                  var table1 = tabletojson.convert('<table>' + tableHtmlList[0]+ '</table>');
                   console.log(table1)
                    
                   var csv = json2csv({data: table1, hasCSVColumnTitle: false })
                   
                   csv = csv.replace(/(['"])/g, "") //get rid of double quotes
                       csv = csv.replace(/\,(.*?)\:/g, ", ") //get rid column names
                       csv = csv.replace(/\{(.*?)\:/g, ", ") //get rid column names
                       csv = csv.replace(/([}])/g, " ALEXAPAUSE ") //get rid of } and add a pause which will be replaced with SSML later
                               
                    found = csv.toString();
                    
                }
 
                
              });
			}

			//Time, Date
			if (!found && $('._rkc._Peb',body).length>0){

				found = $('._rkc._Peb',body).html();
				console.log("Found date and Time");
								
			}
			//Maths	
			if (!found && $('.nobr>.r',body).length>0){
				found = $('.nobr>.r',body).html();
				console.log("Found maths");					
			}

			//simple answer
			if (!found && $('.obcontainer',body).length>0){
				found = $('.obcontainer',body).html();
				console.log("Found Simple answer");
								
			}

			//Definition
			if (!found && $('.r>div>span',body).first().length>0){
				found = $('.r>div>span',body).first().html() +" definition. ";
				console.log("Found definition");
				//how many
				var items = $('.g>div>table>tr>td>ol>li',body).get().length; // find how many lines there are in answer table
				
				if (items) {
					console.log( items + " Type 4 answer sections result");

					for (var count = 0; count < items; count++) {	

						found = found + $('.g>div>table>tr>td>ol>li',body).eq(count).html() + ", ";
					}
				}
			}
			//TV show
			if (!found && $('._B5d',body).length>0){	
				found = $('._B5d',body).html();
				console.log("Found tv show");
				//how many
				if ( $('._Pxg',body).length>0){
					found+= ". "+$('._Pxg',body).html();
				}
				//how many
				if ( $('._tXc',body).length>0){

					found+= ". "+$('._tXc',body).html();
				}
			}
		
			//Weather
			if (!found && $('.g>.e>h3',body).length>0){
			
				found = $('.g>.e>h3',body).html();
				console.log("Found weather");

				//how many
				if ( $('.wob_t',body).first().length>0){

					found+= " "+ $('.wob_t',body).first().html();
					console.log("Found weather");
				}

				//how many
				if ( $('._Lbd',body).length>0){

					found+= " "+ $('._Lbd',body).html();
					console.log("Found how many");
				}
			}

			// strip out html tags to leave just text
			var speechOutputTemp = entities.decode(striptags(found));
			var cardOutputText = speechOutputTemp;
			// make sure all full stops have space after them otherwise alexa says the word dot 

			speechOutputTemp = speechOutputTemp.split('.com').join(" dot com ") // deal with dot com
			speechOutputTemp = speechOutputTemp.split('.co.uk').join(" dot co dot uk ") // deal with .co.uk
      speechOutputTemp = speechOutputTemp.split('.net').join(" dot net ") // deal with .net
      speechOutputTemp = speechOutputTemp.split('.org').join(" dot org ") // deal with .org
      speechOutputTemp = speechOutputTemp.split('a.m').join("am") // deal with a.m
      speechOutputTemp = speechOutputTemp.split('p.m').join("pm") // deal with a.m
      
            
      // deal with decimal places
      speechOutputTemp = speechOutputTemp.replace(/\d[\.]{1,}/g,'\$&DECIMALPOINT')// search for decimal points following a digit and add DECIMALPOINT TEXT
      speechOutputTemp = speechOutputTemp.replace(/.DECIMALPOINT/g,'DECIMALPOINT')// remove decimal point
      
      // deal with characters that are illegal in SSML
      
      speechOutputTemp = speechOutputTemp.replace(/&/g,' and ') // replace ampersands 
      speechOutputTemp = speechOutputTemp.replace(/</g,' less than ') // replace < symbol 
      speechOutputTemp = speechOutputTemp.replace(/""/g,'') // replace double quotes 
                                        
            
      speechOutputTemp = speechOutputTemp.split('ALEXAPAUSE').join('<break time=\"500ms\"/>') // add in SSML pauses at table ends 
      cardOutputText = cardOutputText.split('ALEXAPAUSE').join('') // remove pauses from card text
			speechOutputTemp = speechOutputTemp.split('.').join(". <break time=\"250ms\"/>") // Assume any remaining dot are concatonated sentances so turn them into full stops with a pause afterwards
			var speechOutput = speechOutputTemp.replace(/DECIMALPOINT/g,'.') // Put back decimal points
            
						
			if (speechOutput=="") speechOutput = "I'm sorry, I wasn't able to find an answer."
            
            // Covert speechOutput into SSML so that pauses can be processed
            var SSMLspeechOutput = {
                speech: '<speak>' + speechOutput + '</speak>',
                type: 'SSML'
            };

            
			response.tellWithCard(SSMLspeechOutput, cardTitle, cardOutputText);
            
            

            //    response.tell(speechOutput)
            }).catch(function(err) {
            console.log("ERROR" + err);
            speechOutput = "There was an error processing your search.";
            response.tell(speechOutput);
        })
    },

    "AMAZON.StopIntent": function(intent, session, response) {
        var speechOutput = "";
        response.tell(speechOutput);
    }
}

exports.handler = function(event, context) {
	var AlexaGoogleSearchHelper = new AlexaGoogleSearch();
	AlexaGoogleSearchHelper.execute(event, context);
}