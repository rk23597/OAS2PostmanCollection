const fs = require('fs');
const axios = require('axios');

const addScriptsToRequests = (items) => {
    items.forEach(item => {
        if (item.item) {
            // If the item is a folder, recursively call the function
            addScriptsToRequests(item.item);
        } else if (item.request) {
            const method = item.request.method.toUpperCase();
            let script = [];

            //put common test cases accross all the apis
            if( method == "GET" || method == "POST" || method == "PUT" || method == "DELETE" ){
                script.push(`pm.test("Response is OK", function () {`);
                script.push(`    pm.response.to.have.status(200);`);
                script.push(`});`);
                script.push(`pm.test("Content-Type is application/json", function () {`);
                script.push(`    pm.response.to.have.header("Content-Type", "application/json");`);
                script.push(`});`); 
            }

            item.event = [
                {
                    listen: 'test',
                    script: {
                        type: 'text/javascript',
                        exec: script
                    }
                }
            ];
        }
    });
};


const updateCollection = async (openApiSpecFileNameWithTime, psCollection, apiKey) => {
    const options = {
        method: 'POST',
        url: 'https://api.getpostman.com/collections',
        headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            collection: {
                ...psCollection,
                info: {
                    ...psCollection.info,
                    name: openApiSpecFileNameWithTime
                }
            }
        })
    };

    await axios(options);
    console.log ("---------------------- Test Scritps are created successfully for all the APIs --------------------------........");
   
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            console.log ("---------------------- Thank You --- Thank You --- Thank You --- Thank You -----------------------------........");
        }, i * 1000);
    }    
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Define the main function as an async function
async function syncToPostmanCloud(openApiSpecFileNameWithTime, psCollection , apiKey ) {
    try {
        await sleep(30000); 
        addScriptsToRequests(psCollection.item); // Start with the root items
        console.log(JSON.stringify(psCollection))
     
        await updateCollection(openApiSpecFileNameWithTime, psCollection, apiKey);
    } catch (error) {
        console.error ("---------------------- ERROR occured while creating Test Scritps ---------------------------------------........");
        console.error('Error updating collection:', error.response ? error.response.data : error.message);
    }
}

// Export the function
module.exports = {
    syncToPostmanCloud
};