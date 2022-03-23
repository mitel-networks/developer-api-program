const fetch = require('isomorphic-fetch');
const inputData = require('./inputData.js')

/**
 * Function to call token API to fetch bearer token
 * @returns bearer token
 */
 async function getToken() {
    try {
        // Encode form data in URL encoded format and pass it request body of token api
        let formData = Object.keys(inputData.userdata).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(inputData.userdata[key]);
        }).join('&');

        // Call the token api to obtain the valid token
        const response = await fetch('https://authentication.dev.api.mitel.io/2017-09-01/token', {
            method: 'post',
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        // If response code is greater than 201, stop the execution and terminate the program
        if (response.status > 201) {
            throw response;
        }

        const data = await response.json();
        return data;

    } catch (e) {
        console.log(e);
    }
}

/**
 * Main function is entry point for application
 * @returns valid token data
 */
async function main() {
    // Call the getToken function to obtain the valid token
    const token = await getToken();
    // Print the token data
    console.log('Token data: ', token);
    return token;
}

// Calling the main function
main();
