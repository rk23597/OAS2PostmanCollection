const fs = require('fs');
const axios = require('axios');
const path = require('path');
const converter = require('openapi-to-postmanv2');
const { outputTestCollection } = require('./test-cases-output');
const { syncToPostmanCloud } = require('./syncToPostmanCloud');
const directoryPath = __dirname; 
const files = fs.readdirSync(directoryPath);
const yamlFile = files.find(file => file.endsWith('.yaml'));
const apiKey = process.env.apiKey;
const sync = process.env.sync;
let openApiSpecFileNameWithTime;
 

if (!yamlFile) {
    console.error ("---------------------- No .yaml file found in the directory --------------------------------------------........");
    process.exit(1);
}

const specPath = path.join(__dirname, yamlFile);
const openApiSpec = fs.readFileSync(specPath, 'utf8');

converter.convert({ type: 'string', data: openApiSpec }, {}, (err, conversionResult) => {
   
    if (!conversionResult.result) {
        console.error('Could not convert', conversionResult.reason);
    } else {
        if( sync == "yes"){
            if (!apiKey) {
                console.error ("---------------------- Please pass apiKey of your Postman Cloud ----------------------------------------........");
                process.exit(1);
            }else{
                const openApiSpecFileName = path.basename(yamlFile, '.yaml')
                const currentTimeEpoch  = Date.now();
                openApiSpecFileNameWithTime = `${openApiSpecFileName}_${currentTimeEpoch }`;

                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                console.log ("---------------------- Converting OpenSpec To Postman Collections---------------------------------------........");  
                sleep(2000);

                const postmanCollection = conversionResult.output[0].data;
                console.log ("---------------------- Creating Test Scritps for all the APIs ------------------------------------------........");            
                syncToPostmanCloud(openApiSpecFileNameWithTime, postmanCollection, apiKey);
    

            }            
        }else{
            outputTestCollection(conversionResult.output[0].data);
        }            
    }
});


