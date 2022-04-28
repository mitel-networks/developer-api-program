const fetch = require('isomorphic-fetch');
const os = require('os');
const package = require('./package.json');
const inputData = require('./inputData.js')

/**
 * Function to get the valid code from auth api
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

        // Call the auth api to obtain a valid code
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
 * Function to create subscription on ringing event
 * @param {access token} token 
 * @returns 
 */
async function createSubscription(token) {
    try {
        // Call create subscriptions API to start the conversation
        const response = await fetch('https://notifications.api.mitel.io/2017-09-01/subscriptions', {
            method: 'post',
            body: JSON.stringify(inputData.subscriptionData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
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
 * Function to call from one extension to another/ source for ringing event
 * @param {access token} token 
 * @returns 
 */
async function makeCall(token) {
    try {
        // Get the generic messga body from input data
        let callBody = {
            to: inputData.makeCallData.to
        }

        // Call the message API to send message
        const response = await fetch(`https://media.api.mitel.io/2017-09-01/endpoints/${inputData.makeCallData.from}/calls`, {
            method: 'post',
            body: JSON.stringify(callBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
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
 * Main function is entry point for application
 * @returns Valid caller id
 */
async function main() {
    // Obtain token for User 
    // Call the getCode and getToken function to obtain the valid token
    const userCode = await getCode(inputData.userdata);
    const token = await getToken(userCode.code, inputData.appData.client_id);
        
    // Create the subscription
    console.log(`Creating subscription`)
    console.log(`=========================`);
    const subscription = await createSubscription(token.access_token);
    console.log(`Subscription created with subscriptionId: ${subscription.subscriptionId}`);
    console.log(`=========================`);

    // Make a call
    console.log(`Calling from ext ${inputData.makeCallData.from} to ext ${inputData.makeCallData.to}`);
    const call = await makeCall(token.access_token);
    console.log(`=========================`);
    console.log(`Called with caller id: ${call.callId}`);

    return call;
}

/**
 * Calling the main function
 * @returns
 */
main();
