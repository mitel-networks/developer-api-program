const fetch = require('isomorphic-fetch');
const inputData = require('./inputData.js')

/**
 * 
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

        // Call the code api to obtain the valid code
        const response = await fetch('https://authentication.dev.api.mitel.io/2017-09-01/authorize', {
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
        const response = await fetch('https://authentication.dev.api.mitel.io/2017-09-01/token', {
            method: 'post',
            body:  JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
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
 * Decode the bearer token to fetch user info
 * @param {token} token 
 * @returns user info
 */
async function decodeToken(token) {
    try {

        // Call the token api to decode/validate the user data
        const response = await fetch('https://authentication.dev.api.mitel.io/2017-09-01/token', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        // If response code is greater than 201, stop the execution and terminate the program
        if (response.status > 201) {
            throw response;
        }

        const userData = await response.json();
        return userData;

    } catch (e) {
        console.log(e);
    }
}


/**
 * 
 * @param {access token} token 
 * @returns 
 */
async function startConversation(token) {
    try {
        // Call create conversation API to start the conversation
        const response = await fetch('https://chat.dev.api.mitel.io/2017-09-01/conversations', {
            method: 'post',
            body: JSON.stringify(inputData.conversationData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        // If response code is greater than 201, stop the execution and terminate the program
        if (response.status > 201) {
            throw response.json();
        }

        const data = await response.json();
        return data;

    } catch (e) {
        console.log(e);
    }
}

/**
 * Function to call send message API
 * @param {access token} token 
 * @param {conversation id} conversationId 
 * @param {username} username 
 * @returns 
 */
async function sendMessage(token, conversationId, username) {
    try {
        // Get the generic messga body from input data
        let messageBody = inputData.messageData;
        // Modify the message as per need
        messageBody.body = `Hi from ${username}`;

        // Call the message API to send message
        const response = await fetch(`https://chat.dev.api.mitel.io/2017-09-01/conversations/${conversationId}/messages`, {
            method: 'post',
            body: JSON.stringify(messageBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        // If response code is greater than 201, stop the execution and terminate the program
        if (response.status > 201) {
            throw response.json();
        }

        const data = await response.json();
        return data;

    } catch (e) {
        console.log(e);
    }
}

/**
 * Function to call delete conversation API
 * @param {tokem} token 
 * @param {conversationId} conversationId 
 * @returns 
 */
async function deleteConversation(token, conversationId) {
    try {
        const response = await fetch(`https://chat.dev.api.mitel.io/2017-09-01/conversations/${conversationId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if (response.status > 201) {
            throw response.json();
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
    // Obtain token for User 
    console.log(`Fetching token for user 1`)
    console.log(`=========================`);
    const user1code = await getCode(inputData.userData[0])
    const token1 = await getToken(user1code.code, inputData.appData.client_id); // Get data for user 1
    console.log(`Token obtained for user 1: ${JSON.stringify(token1.access_token)}`)
    console.log(`=========================`);

    // Decode token 1 to get user 1 details
    const user1Data = await decodeToken(token1.access_token)
    console.log(`Decoded user 1 data: ${JSON.stringify(user1Data)}`);
    console.log(`=========================`);

    // Obtain token for User 2
    console.log(`Fetching token for user 2`)
    console.log(`=========================`);
    const user2code = await getCode(inputData.userData[1])
    const token2 = await getToken(user2code.code, inputData.appData.client_id); // Get data for user 2
    console.log(`Token obtained for user 2: ${JSON.stringify(token2.access_token)}`)
    console.log(`=========================`);

    // Decode token 1 to get user 2 details
    const user2Data = await decodeToken(token2.access_token)
    console.log(`Decoded user 2 data: ${JSON.stringify(user2Data)}`);
    console.log(`=========================`);
    

    /**
     * Get user1 and user2 Ids from user1Data and user2Data
     * and prepare user object to be send in the create conversation api
     * to create conversation between 2 users
     * */

    let participants = [
        {
            "type": "USER",
            "participantId": user1Data.userId
        },
        {
            "type": "USER",
            "participantId": user2Data.userId
        }
    ]

    // Replacing original participants key of conversationData from inputData with participants array created above
    inputData.conversationData.originalParticipants = participants;


    // Starting the conversation
    console.log(`Starting the conversation`)
    console.log(`=========================`);
    const conversation = await startConversation(token1.access_token);
    console.log(`Conversation started with conversationId: ${conversation.conversationId}`);
    console.log(`=========================`);

    console.log(`Sending message by User 1`);
    console.log(`=========================`);
    const message1 = await sendMessage(token1.access_token, conversation.conversationId, inputData.userData[0].username)
    console.log(`Message sent by user 1: ${JSON.stringify(message1)}`);
    console.log(`=========================`);

    console.log(`Sending message by User 2`);
    const message2 = await sendMessage(token2.access_token, conversation.conversationId, inputData.userData[1].username)
    console.log(`Message sent by user 2: ${JSON.stringify(message2)}`);
    console.log(`=========================`);

    console.log(`Deleting the conversation`);
    const deletedConversation = await deleteConversation(token1.access_token, conversation.conversationId);
    console.log(`=========================`);
    console.log(`Deleted conversation is: ${JSON.stringify(deletedConversation)}`);

    return deleteConversation;
}

/**
 * Calling the main function
 * @returns
 */
main();
