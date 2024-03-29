# Code Camp
This is the registration app for CodeCamp. The app captures basic info of the registrant such as name, inumber and email id. It exposes the topic specific Crossword, expected to be answered by the registrant. 

**Note:** The application works best on Google Chrome

## Deployment guide
Follow the steps below to deploy the application for a new CodeCamp:

### Clone the repo
Clone the repo locally
> git clone https://github.com/SherwinVarghese/CodeCamp.git


### Generate the required crossword for the CodeCamp
Generate a crossword for the available questions and answers using the tool EclipseCrossword. Kindly note that the tool is available only for Windows.

1. Download [EclipseCrossword](https://www.eclipsecrossword.com/) and follow the instructions to install the tool locally
2. Generate the crossword following the instructions, should be self-explanatory 
3. Save the following [html] files from the tool
    - interactive javascript files
    - crossword grid 
4. Save the crossword for future reference, if required

### Update the Crossword details in the application
The application uses the html+javascript files generated from the tool as describe above. The code is refactored to separate the generic code from event specific code like the questions and answers for the event. Follow the below steps to update the event specific content 

1. Replace the **[public/show_crossword.html](https://github.com/SherwinVarghese/CodeCamp/blob/master/public/show_crossword.html)** with the crossword grid html file saved in the above step
2. Update the **[models/CrosswordClues.js](https://github.com/SherwinVarghese/CodeCamp/blob/master/models/CrosswordClues.js)** with the answers of the current crossword. This is required for validating the answers during registration
3. Replace the **[public/crossword.js](https://github.com/SherwinVarghese/CodeCamp/blob/master/public/crossword.js)** with the similar script from the generated interactive javascript files in the above step. Look for similar section in the file. Check the **[/public/crossword.js](https://github.com/SherwinVarghese/CodeCamp/blob/master/public/crossword.js)** file for reference
4. Ensure to remove the answers [Word array] array from the script
5. Compare with the section in **[public/crossword.js](https://github.com/SherwinVarghese/CodeCamp/blob/master/public/crossword.js)** and remove the unwanted lines

### Update CodeCamp details 
The application displays the title, date, venue of the CodeCamp event. So, update this appropriately 

1. Update the file **[public/CodeCampdetails.html](https://github.com/SherwinVarghese/CodeCamp/blob/master/public/codecampdetails.html)** with the title, date and venue of the event
2. Replace the **[codecamp.png](https://github.com/SherwinVarghese/CodeCamp/blob/master/public/codecamp.png)** with the graphics of the event

### Deploy the application (Alternatively, skip this step and Deploy via zip file upload to SAP BTP or other Cloud Service providers)
This is a nodejs application. It uses MongoDB for persistency. Deploy this application on SAP Business Technology Platform as a Cloud Foundry application. You can deploy the application in the Trial account.

1. Using _CF CLI_, log on to SAP Business Technology Platform and navigate to the Subaccount and Space where you want to deploy the application 
2. Create a service instance of MongoDB with the name **_mongodb-codecampblr** in the Space 
3. Run **_cf push_** from the root folder
4. If the deployment is successful and the application is started, access the application through browser

### Registrations for the event
Access the link **\<appurl\>/registrations** to get the detailed list of the registrations made

### Reset the data [Disabled by default for security reasons]
Simply launch the link **\<appurl\>/reset** and click on **Reset Data** to reset the registrations maintained so far


### Obtain Mongo DB instances
Mongo DB free instances are available at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)