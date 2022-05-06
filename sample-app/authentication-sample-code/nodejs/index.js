const fetch = require('isomorphic-fetch');
const os = require('os');
const package = require('./package.json');
const inputData = require('./inputData.js')

/**
 * Function to get code from auth api
 * @param {userData from inputData} userData 
 * @returns Valid code
 */
 async function getCode(userData) {
    try {
        // Add client_id in userData to send in get code api request body
        userData.client_id = inputData.appData.client_id;
        // Encode form data in URL encoded format and pass it request body of token api
        let formData = Object.keys(userData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(userData[key]);
        }).join('&');

        // Call the auth api to obtain the valid code
        const response = await fetch('https://authentication.api.mitel.io/2017-09-01/authorize', {
            method: 'post',
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // Pass the x-mitel-app header info
                'x-mitel-app': `${package.name}/${package.version};platform=${os.platform}/${os.version};session=session-id;`
            }
        });

        // If response code is greater than 201, stop the execution and terminate the program
        if (response.status > 201) {
            console.log(await response.json());
            process.exit();
        }

        const data = await response.json();
        return data;

    } catch (e) {
        console.log(e);
    }
}

/**
 * Function to call Token API to fetch bearer token
 * @returns bearer token
 */
async function getToken(code, clientId) {
    try {
        // Create form data for authorize api to fetch bearer token
        let formData = {
            grant_type: "authorization_code",
            code: code,
            client_id: clientId
        }

        // Call the token api to obtain the valid token
        const response = await fetch('https://authentication.api.mitel.io/2017-09-01/token', {
            method: 'post',
            body:  JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                // Pass the x-mitel-app header info
                'x-mitel-app': `${package.name}/${package.version};platform=${os.platform}/${os.version};session=session-id;`
            }
        });

        // If response code is greater than 201, stop the execution and terminate the program
        if (response.status > 201) {
            console.log(await response.json());
            process.exit();
        }

        const data = await response.json();
        return data;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {inputData} inputData 
 * @returns valid token
 */
async function main(inputData) {
    // Call the getCode and getToken function to obtain the valid token
    const userCode = await getCode(inputData.userdata);
    const token = await getToken(userCode.code, inputData.appData.client_id);
    // Print the token data
    console.log('Token data: ', token);
    return token;
}

// Calling the main function
main(inputData);
