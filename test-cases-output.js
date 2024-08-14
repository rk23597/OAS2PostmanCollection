const fs = require('fs');
const axios = require('axios');
const path = require('path');



// Function to add scripts to each request
const addScriptsToRequests = (items) => {
    items.forEach(item => {
        if (item.item) {
            // If the item is a folder, recursively call the function
            addScriptsToRequests(item.item);
        } else if (item.request) {
            const method = item.request.method.toUpperCase();
            let script = [];

            // Add common test cases
            if (["GET", "POST", "PUT", "DELETE"].includes(method)) {
                script.push(`pm.test("Response is OK", function () {`);
                script.push(`    pm.response.to.have.status(200);`);
                script.push(`});`);
                script.push(`pm.test("Content-Type is application/json", function () {`);
                script.push(`    pm.response.to.have.header("Content-Type", "application/json");`);
                script.push(`});`);
            }

            // Add the test script to the item
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

// Main function
const outputTestCollection = async (collection) => {
    try {
        addScriptsToRequests(collection.item);
        console.log(JSON.stringify(collection, null, 2));   
     } catch (error) {
        console.error("---------------------- ERROR occurred while creating Test Scripts ---------------------------------------........");
        console.error('Error updating collection:', error.response ? error.response.data : error.message);
    }
};

// Export the function
module.exports = {
    outputTestCollection
};
