# alexa-google
A highly unofficial alexa skill for google search

THIS SKILL IS FOR PERSONAL USE ONLY AND IS NOT ENDORSED BY GOOGLE - DO NOT SUBMIT THIS TO AMAZON FOR CERTIFICATION AS IT WON'T PASS!

This skill is based upon the google search module created for the Adrian Smart assistant project here:-

https://github.com/TheAdrianProject/AdrianSmartAssistant/blob/master/Modules/Google/Google.js

Full credit to the Adrian team for working out the parsing routines for the google search results.

I have wrapped this module so that it can be utilised as an Alexa skill - if you host it on Lambda and call the skill "google" then you will be abe to ask Alexa queries that she does not natively know the answer to such as:-

"Alexa ask google how do I cook a chicken?"

Whilst the skill will return weather forecasts, these will default to either West virginia or Dublin, Ireland (based upon which lambda node you are hosting your skill on) unless you add a location to the search command.

I am based in the UK, so I have customised the search so that it uses the en-GB localisation for results. You can change this in index.js to from "en-GB" to "en-US" or "de" if you want US or german based resuts.

Note - this skill works by parsing the google results page and looking for the google answers boxes at the top of the results page. This may be against the google terms of service so you use it at your own risk. 