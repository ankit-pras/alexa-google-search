# alexa-google-search

A highly unofficial alexa skill for google search

### THIS SKILL IS FOR PERSONAL USE ONLY AND IS NOT ENDORSED BY GOOGLE OR AMAZON - DO NOT SUBMIT THIS TO AMAZON FOR CERTIFICATION AS IT WON'T PASS!

This skill is based upon the google search module created for the Adrian Smart assistant project here:-

https://github.com/TheAdrianProject/AdrianSmartAssistant/blob/master/Modules/Google/Google.js

Full credit to the Adrian team for working out the parsing routines for the google search results.

I have wrapped this module so that it can be utilised as an Alexa skill - if you host it on Lambda and call the skill "google" then you will be abe to ask Alexa queries that she does not natively know the answer to such as:-

"Alexa ask google how do I cook a chicken?"

Whilst the skill will return weather forecasts, these will default to either West virginia or Dublin, Ireland (based upon which lambda node you are hosting your skill on) unless you add a location to the search command.


###  Note - this skill works as a screen reader by parsing the google results page and looking for the google answers boxes at the top of the results page. This may be against the google terms of service so you use it at your own risk. 



## Setup

To run the skill you need to do three things:-

1. download the file from github 
2. deploy the example code in lambda
2. configure the Alexa skill to use Lambda.

### Download code from github

1. Click on the green "Clone or download" button just under the yellow bar
2. Click download ZIP
3. Unzip the file to a known place on your hard-drive


### AWS Lambda Setup

1. Go to http://aws.amazon.com/lambda/ . You will need to set-up an AWS account if you don't have one already. 
2. Go to the AWS Console and click on the Lambda link. Note: ensure you are in US-East(N. Virginia) if you are based in the US or EU(Ireland) if you are based in the UK. This is important as only these two regions support Alexa. NOTE: the choice of either US or EU is imprtant as it will affect the results that you get. The EU node will provide answers in metric and will be much more UK focused, whilst the US node will be imperial and more US focused.
3. Click on the Create a Lambda Function or Get Started Now button.
4. Skip the Select Blueprint Tab and just click on the "Configure Triggers" Option on the left hand side
5. On the Cofigure Triggers tab Click the dotted box and select "Alexa Skills Kit". Click Next  
6. Name the Lambda Function "google".
7. Select the runtime as Node.js
8. Go to the folder that you downloaded from github and unzipped. Open the src folder and select all the files in that folder (including the node_modules folder) and then create a zip file called ARCHIVE.zip. **Make sure the zip file is not just the src directory itself**, otherwise Lambda function will not work.
9. Select Code entry type as "Upload a .ZIP file" and then upload the .zip file to the Lambda

**NOTE: if you get a lambda response saying : "The remote endpoint could not be called, or the response it returned was invalid." It is likely that you have zipped the src folder and not it's contents**

10. Keep the Handler as index.handler (this refers to the main js file in the zip).
11. Create a basic execution role and click create (or Choose use an existing role if you have deployed skills previously and then select "lambda_basic_executuion" from the existing role dropdown ).
12. Under Advanced settings change the Timeout to 10 seconds
13. Click "Next" and review the settings then click "Create Function"
14. Copy the ARN from the top right to be used later in the Alexa Skill Setup (it's the text after ARN -). Hint - Paste it into notepad or similar

### Alexa Skill Setup

1. Go to the Alexa Console (https://developer.amazon.com/edw/home.html and select Alexa on the top menu)
2. Click "Get Started" under Alexa Skills Kit
3. Click the "Add a New Skill" yellow box.
4. You will now be on the "Skill Information" page. 
5. Set "Custom Interaction Model" as the Skill type
6. Select the language as English (US) or English (UK) depending on your location
7. Set "google" as the skill name and "google" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, Ask google who is the queen of england."
8. Leave the "Audio Player" setting to "No"
9. Click Next.
10. You will now be on the "Inovation Model" page. 
11. Copy the text below into the "Intent Schema" box.

    ```
    {
      "intents": [
        {
          "intent": "SearchIntent",
       "slots": [
         {
           "name": "search",
           "type": "SEARCH"
         }
       ]    


        },
        {
          "intent": "AMAZON.StopIntent"
        }
      ]
    }
    ```

12. Click on the "Add Slot Type" button.
13 Type "SEARCH" into the "Enter Type" field
14. Paste the text below into the "Enter Values" box

    ```
    who is the queen
    why is the sky blue
    ```

15. Copy the text below amd paste them into the Sample Uterances box.

    ```
    SearchIntent {search}
    ```
16. Click Next.
17. You will now be on the "Configuration" page.
18. Select "AWS Lambda ARN (Amazon Resource Name)" for the skill Endpoint Type.
19. Then pick the most appropriate geographical region (either US or EU as appropriate) and paste the ARN you copied in step 14 from the AWS Lambda setup. 
20. Select no for Account Linking
21. Click Next.
22. You can test the skill by typing a query into the Service Simulator field or on your actual Alexa device. There is no need to go anyfurther through the process i.e. submitting for certification.
23. [optional] go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable APP_ID (IMPORTANT make sure it is in quotes), then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source.
