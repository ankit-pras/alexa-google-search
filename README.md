# alexa-google-search

A highly unofficial alexa skill for google search

### THIS SKILL IS FOR PERSONAL USE ONLY AND IS NOT ENDORSED BY GOOGLE - DO NOT SUBMIT THIS TO AMAZON FOR CERTIFICATION AS IT WON'T PASS!

This skill is based upon the google search module created for the Adrian Smart assistant project here:-

https://github.com/TheAdrianProject/AdrianSmartAssistant/blob/master/Modules/Google/Google.js

Full credit to the Adrian team for working out the parsing routines for the google search results.

I have wrapped this module so that it can be utilised as an Alexa skill - if you host it on Lambda and call the skill "google" then you will be abe to ask Alexa queries that she does not natively know the answer to such as:-

"Alexa ask google how do I cook a chicken?"

Whilst the skill will return weather forecasts, these will default to either West virginia or Dublin, Ireland (based upon which lambda node you are hosting your skill on) unless you add a location to the search command.


###  Note - this skill works by parsing the google results page and looking for the google answers boxes at the top of the results page. This may be against the google terms of service so you use it at your own risk. 



## Setup

To run the skill you need to do two things:-

1. deploy the example code in lambda
2. configure the Alexa skill to use Lambda.

### AWS Lambda Setup

1. Go to http://aws.amazon.com/lambda/ . You will need to set-up an AWS account if you don't have one already. 
2. Go to the AWS Console and click on the Lambda link. Note: ensure you are in US-East(N. Virginia) if you are based in the US or EU(Ireland) if you are based in the UK. This is important as only these two regions support Alexa. NOTE: the choice of either US or EU is imprtant as it will affect the resutls that you get. The EU node will provide answers in metric and will be much more UK focused, whilst the US node will be imperial and more US focused.
3. Click on the Create a Lambda Function or Get Started Now button.
4. Skip the blueprint
5. Name the Lambda Function "google".
6. Select the runtime as Node.js
7. Go to the the src directory, select all files (including the node_modules folder) and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
8. Select Code entry type as "Upload a .ZIP file" and then upload the .zip file to the Lambda
9. Keep the Handler as index.handler (this refers to the main js file in the zip).
10. Create a basic execution role and click create.
11. Under Advanced settings change the Timeout to 10 seconds
12. Click "Next" and review the settings then click "Create Function"
13. Click the "Event Sources" tab and select "Add event source"
14. Set the Event Source type as Alexa Skills kit and Enable it now. Click Submit.
15. Copy the ARN from the top right to be used later in the Alexa Skill Setup.

### Alexa Skill Setup

1. Go to the Alexa Console (https://developer.amazon.com/edw/home.html) and click Add a New Skill.
2. Set Custom Interaction as the Skill type
3. Select the language as English (US) or English (UK) depending on your location
3. Set "google" as the skill name and "google" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, Ask google who is the queen of england."
4. Select the Lambda ARN for the skill Endpoint (either US or EU as appropriate) and paste the ARN copied from above. Click Next.
5. Copy the Intent Schema from the included IntentSchema.json and paste it into the Intent Schema box.
6. Copy the custom slot types from SEARCH.txt in the customSlotTypes folder. Name the Custom SlotType "SEARCH" and paste in the values into the Enter Values box.
7. Copy the Sample Utterances from the included SampleUtterances.txt and paste them into the Sample Uterances box.
8. Click Next.
9. You can test the skill by typing a query into the Service Simulator field or on your actual Alexa device. There is no need to go anyfurther through the process i.e. submitting for certification.
10. [optional] go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable APP_ID, then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source.
