const fetch = require('isomorphic-fetch');
const inputData = require('./inputData.js');
const prompt = require('prompt-sync')();

let token1 = undefined;
let token2 = undefined;

/**
 * Function to call Token API to fetch bearer token
 * @returns bearer token
 */
async function getToken(userData) {
    if(! userData) {
        const resp = {"error": "Must specify userData."};
        return resp;
    }
    try {
        // Encode form data in URL encoded format and pass it request body of token api
        let formData = Object.keys(userData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(userData[key]);
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
 * 
 * @param {access token} token, 
 * @param {extension number} endPoint 
 * @returns result
 */
 async function getEndpointState(token, endpoint) {
    if(! token || ! endpoint) {
        const resp = {"error": "Must specify token and endpoint."};
        return resp;
    }
    
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/endpoints/${endpoint}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });
        if(response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token,
 * @param {extension number} endPoint 
 * 
 * @returns result
 */
 async function makeCall(token, fromEndpoint, toEndpoint) {
    if(! token || ! fromEndpoint || ! toEndpoint) {
        const resp = {"error": "Must specify token, fromEndpoint, and toEndpoint."};
        return resp;
    }
    try {
        bodyObj = `{"from": "${fromEndpoint}", "to": "${toEndpoint}" }`;

        // Call create conversation API to start the conversation
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/endpoints/${fromEndpoint}/calls`, {
            method: 'post',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {answer, endpoint, hold, etc} action
 * @param {extension number} endPoint
 * @param callId
 * @param {destination phone number optional} destination
 * 
 * @returns result
 */
 async function invokeTelephonyFeature(token, action, endpoint, callId, destination) {
    try {

        if(! token || ! action || ! endpoint || ! callId) {
            const resp = {"error": "Must specify token, action, endpoint, and callId."};
            return resp;
        }
        let bodyObj;
        if(destination) {
            bodyObj = `{"action": "${action}", "args": "${callId}", "destination": "${destination}"}`;
        }
        else {
            bodyObj = `{"action": "${action}", "args": "${callId}"}`; 
        }
        
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/endpoints/${endpoint}/calls/${callId}`, {
            method: 'put',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });
        
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} principalId
 * @param {number of call history records} numberOdRecs
 * 
 * @returns result
 */
 async function getCallHistory(token, principalId, numberOfRecs) {
    if(! token || ! principalId || ! numberOfRecs) {
        const resp = {"error": "Must specify token, principalId and numberOdRecs."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/calls/records?$filter=contains(principal, \'${principalId}\')&$top=${numberOfRecs}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json(); 
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * Delete/hide all call history records.
 * 
 * @param {access token} token
 * @param {user identifier} principalId
 * 
 * @returns result
 */

 async function deleteAllCallHistory(token, principalId) {
    if(! token || ! principalId) {
        const resp = {"error": "Must specify token and principalId."};
        return resp;
    }
    try {
        bodyObj = `{"hide": "true"}`;
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/calls/records?$filter=contains(principal, \'${principalId}\')`, {
            method: 'put',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}
/**
 * Delete/hide call history record.
 * 
 * @param {access token} token
 * @param {user identifier} principalId
 * @param {call identifier} callId
 * 
 * @returns result
 */

 async function deleteCallHistoryRecord(token, principalId, callId) {
    if(! token || ! callId || ! principalId) {
        const resp = {"error": "Must specify token, principalId and callId."};
        return resp;
    }
    try {
        bodyObj = `{"hide": "true"}`;
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/calls/${callId}/records?$filter=contains(principal, \'${principalId}\')`, {
            method: 'put',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} principalId
 * @param {call identifier} callId
 * 
 * @returns result
 */

 async function getCallHistoryRecord(token, principalId, callId) {
    if(! token || ! principalId || ! callId) {
        const resp = {"error": "Must specify token and callId."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/calls/${callId}/records?$filter=contains(principal, \'${principalId}\')`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });
        if(response && response.status && response.status == 200) {
            const data = response.json(); 
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * 
 * @param {access token} token
 * @returns result
 */
 async function getConferences(token) {
    if(! token) {
        const resp = {"error": "Must specify token."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * 
 * @param {access token} token
 * @returns result
 */
 async function createConference(token) {
    if(! token) {
        const resp = {"error": "Must specify token."};
        return resp;
    }
    try {
        const bodyObj = `{"name": "status meeting cloudLink", "accessCodeLength": 9, "participants": [{"participantId": "f5d8a302-7ab0-4017-aa1c-b46bf0ab26a4"}]}`;
        console.log("bodyObj = ", bodyObj);
    
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences`, {
            method: 'post',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });
        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
        return(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function getConferenceDetails(token, conferenceId) {
    if(! token || ! conferenceId) {
        const resp = {"error": "Must specify token and conferenceId."};
        return resp;
    }
    try {
       
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} userId
 * 
 * @returns result
 */
 async function getUserConferences(token, userId) {
    if(! token || ! userId) {
        const resp = {"error": "Must specify token and conferenceId."};
        return resp;
    }
    try {
       
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/users/${userId}/conferences`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * 
 * @param {access token} token
 * @param {string to search for} searchStr
 * 
 * @returns result
 */
 async function getConferencesContent(token, searchStr) {
    if(! token || ! searchStr) {
        const resp = {"error": "Must specify token and conferenceId."};
        return resp;
    }
    try {
       
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/content?$search=${searchStr}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} userId
 * 
 * @returns result
 */
 async function getUserMeetingsAttendances(token, userId) {
    if(! token || ! userId) {
        const resp = {"error": "Must specify token and conferenceId."};
        return resp;
    }
    try {
       
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/users/${userId}/attendances`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * 
 * @param {access token} token
 * @param {conference identifier} conferenceId
 * 
 * @returns result
 */
 async function updateConference(token, conferenceId) {
    if(! token || ! conferenceId) {
        const resp = {"error": "Must specify token and conferenceId."};
        return resp;
    }
    try {
        const bodyObj = `{"name": "Updated sample conference", "lobbyPolicy": "pstnLobby"}`;
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}`, {
            method: 'put',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function invokeConferenceFeature(token, conferenceId) {
    if(! token || ! conferenceId) {
        const resp = {"error": "Must specify token and conferenceId."};
        return resp;
    }
    try {
        const bodyObj = `{ "action": "end" }`;
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}`, {
            method: 'post',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function deleteConference(token, conferenceId) {
    if(! token || ! conferenceId) {
        const resp = {"error": "Must specify token and conferenceId."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function getConferenceParticipants(token, conferenceId) {
    if(! token || ! conferenceId) {
        const resp = {"error": "Must specify token and conferenceId."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}/participants`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} participantId
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function addConferenceParticipant(token, conferenceId, participantId) {
    if(! token || ! conferenceId || ! participantId) {
        const resp = {"error": "Must specify token, participantId, and conferenceId."};
        return resp;
    }
    try {
        const bodyObj = `{ "participantId": "${participantId}" }`;
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}/participants`, {
            method: 'post',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} participantId
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function getConferenceParticipant(token, conferenceId, participantId) {
    if(! token || ! conferenceId || ! participantId) {
        const resp = {"error": "Must specify token, participantId, and conferenceId."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}/participants/${participantId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} participantId
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function updateConferenceParticipant(token, conferenceId, participantId) {
    if(! token || ! conferenceId || ! participantId) {
        const resp = {"error": "Must specify token, participantId, and conferenceId."};
        return resp;
    }
    try {
        const bodyObj = `{ "associatedParticipantId":"${participantId}", "muted": true, "action": "leave", "onetimeAcceptance": true }`;
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}/participants/${participantId}`, {
            method: 'put',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} participantId
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function deleteConferenceParticipant(token, conferenceId, participantId) {
    if(! token || ! conferenceId || ! participantId) {
        const resp = {"error": "Must specify token, participantId, and conferenceId."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}/participants/${participantId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {user identifier} participantId
 * @param {conference identifier} conferenceId
 * 
 * @returns result 
 */
 async function createConferenceParticipantConnection(token, conferenceId, participantId) {
    if(! token || ! conferenceId || ! participantId) {
        const resp = {"error": "Must specify token, participantId, and conferenceId."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/conferences/${conferenceId}/participants/${participantId}/connections`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        
        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * 
 * @returns result
 */
 async function getRecordings(token) {
    if(! token) {
        const resp = {"error": "Must specify token."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/recordings`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        
        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {recording identifier} recordingId
 * 
 * @returns result
 */
 async function getRecordingMeta(token, recordingId) {
    if(! token || ! recordingId) {
        const resp = {"error": "Must specify token and recordingId."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/recordings/${recordingId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        
        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {recording identifier} recordingId
 * @param {recording label} label
 * 
 * @returns result
 */
 async function updateRecordingMeta(token, recordingId, label) {
    if(! token || ! recordingId || ! label) {
        const resp = {"error": "Must specify token, recordingId, and label."};
        return resp;
    }
    try {
        const bodyObj = `{"label": "${label}"}`;
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/recordings/${recordingId}`, {
            method: 'put',
            body: bodyObj,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        
        if(response && response.status && response.status == 200) {
            const data = response.json();
            return data;
        }
        return response;

    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {access token} token
 * @param {recording identifier} recordingId
 * 
 * @returns result
 */
 async function deleteRecording(token, recordingId) {
    if(! token || ! recordingId) {
        const resp = {"error": "Must specify token and recordingId."};
        return resp;
    }
    try {
        const response = await fetch(`https://media.us-west-2.us.dev.api.mitel.io/2017-09-01/recordings/${recordingId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        
        return response;

    } catch (e) {
        console.log(e);
    }
}

async function displayTelephonyMenu() {
    let exitMenu = false;
    while(! exitMenu) {
        console.log(`(1) Get User Endpoint status for: ${inputData.userData[0].username}`);
        console.log(`(2) Get User Endpoint status for: ${inputData.userData[1].username}`);
        console.log(`(3) Make call ${inputData.userData[0].username} to ${inputData.userData[1].username}`);
        console.log(`(4) Make call ${inputData.userData[1].username} to ${inputData.userData[0].username}`);
        console.log(`(5) Answer call for ${inputData.userData[0].username}`);
        console.log(`(6) Answer call for ${inputData.userData[1].username}`);
        console.log(`(7) Hangup call for ${inputData.userData[0].username}`);
        console.log(`(8) Hangup call for ${inputData.userData[1].username}`);
        console.log(`(9) Blind Transfer from ${inputData.userData[1].username}`);
        console.log(`(e) Return to Main menu.`);

        const menuSelection = prompt('\nMenu selection: ');
        switch(menuSelection) {
            case '1':
                {
                    let user0EndpointState = await getEndpointState(token1.access_token, inputData.userData[0].extension_number);
                    console.log(`User: ${inputData.userData[0].username} endpoint: ${inputData.userData[0].extension_number} state: `, user0EndpointState);
                    prompt('Press enter to continue.');
                }
                break;
            case '2':
                {
                    const user1EndpointState = await getEndpointState(token2.access_token, inputData.userData[1].extension_number);
                    console.log(`User: ${inputData.userData[1].username} endpoint: ${inputData.userData[1].extension_number} state: `, user1EndpointState);
                    prompt('Press enter to continue.');
                    break;
                }
            case '3':
                {
                    const result = await makeCall(token1.access_token, inputData.userData[0].extension_number, inputData.userData[1].extension_number);
                    console.log(`Making call user1 to user2:`, result);
                    break;
                }
            case '4':
                {
                    const result = await makeCall(token2.access_token, inputData.userData[1].extension_number, inputData.userData[0].extension_number);
                    console.log(`Making call user1 to user2:`, result);
                    break;
                }
            case '5':
                {
                    const callId = prompt('Enter the callId: ');
                    const resAns = await invokeTelephonyFeature(token1.access_token, 'answer', inputData.userData[0].extension_number, callId);
                    console.log('Answer call result', resAns);
                    break;
                }
            case '6':
                {
                    const callId = prompt('Enter the callId: ');
                    const resAns = await answerCall(token2.access_token, 'answer', inputData.userData[1].extension_number, callId);
                    console.log('Answer call result', resAns);
                    break;
                }
            case '7':
                {
                    const callId = prompt('Enter the callId: ');
                    const resAns = await invokeTelephonyFeature(token1.access_token, 'end', inputData.userData[0].extension_number, callId);
                    console.log('Hangup call result', resAns);
                    break;
                }
            case '8':
                {
                    const callId = prompt('Enter the callId: ');
                    const resAns = await invokeTelephonyFeature(token2.access_token, 'end', inputData.userData[1].extension_number, callId);
                    console.log('Hangup call result', resAns);
                    break;
                }
            case '9':
                {
                    const callId = prompt('Enter the callId: ');
                    const dest = prompt('Enter the destination number: ');
                    const resAns = await invokeTelephonyFeature(token1.access_token, 'blindTransfer', inputData.userData[0].extension_number, callId, dest);
                    console.log('Hangup call result', resAns);
                    break;
                }
            case 'e':
                exitMenu = true;
                break;
            default:
                console.log(`Unknown command: ${menuSelection}`);
                prompt('Press enter to continue.');
        }
    }  
}

async function displayCallHistoryMenu() {
    let exitMenu = false;
    while(! exitMenu) {
        console.log(`(1) Get call history ${inputData.userData[0].username}`);
        console.log(`(2) Delete call history record.`);
        console.log(`(3) Get call history record`);
        console.log(`(4) Delete all call history records for ${inputData.userData[0].username}`);
       
        console.log(`(e) Return to Main menu.`);

        const menuSelection = prompt('\nMenu selection: ');
        switch(menuSelection) {
            case '1':
                {
                    const result = await getCallHistory(token1.access_token, inputData.userData[0].principal_id, 5);
                    console.log('Get call history result', result);
                    if(result && result._embedded && result._embedded.items) {
                        for(const record of result._embedded.items) {
                            console.log("call record: ", record);
                        }
                    }
                    break;
                }
            case '2':
                {
                    const callId = prompt("Enter the callId: ");
                    const result = await deleteCallHistoryRecord(token1.access_token, inputData.userData[0].principal_id, callId);
                    console.log(`Delete call history record: `, result);
                    break;
                }
            case '3':
                {
                    const callId = prompt('Enter the callId: ');
                    const result = await getCallHistoryRecord(token1.access_token, inputData.userData[0].principal_id, callId);
                    console.log('Get call history record result', result);
                    if(result && result._embedded && result._embedded.items) {
                        for(const record of result._embedded.items) {
                            console.log("call record: ", record);
                        }
                    }
                    break;
                }
            case '4':
                {
                    const resAns = await deleteAllCallHistory(token1.access_token, inputData.userData[0].principal_id);
                    console.log('Delete all call history result: ', resAns);
                    break;
                }
            case 'e':
                exitMenu = true;
                break;
            default:
                console.log(`Unknown command: ${menuSelection}`);
                prompt('Press enter to continue.');
        }
    }  
}

async function displayConferenceMenu() {
    let exitMenu = false;
    while(! exitMenu) {
        console.log(`(1) Get conferences for account.`);
        console.log(`(2) Create conference.`);
        console.log(`(3) Get conference details.`);
        console.log(`(4) Invoke conference feature.`);
        console.log(`(5) Update conference.`);
        console.log(`(6) Delete conference.`);
        console.log(`(7) Search conference content.`);
        console.log(`(8) Get ${inputData.userData[0].username} conferences.`);
        console.log(`(9) Get ${inputData.userData[0].username} conferences attendances.`);
        console.log(`(e) Return to main menu.`);

        const menuSelection = prompt('\nMenu selection: ');
        switch(menuSelection) {
            case '1':
                {
                    const result = await getConferences(token1.access_token);
                    console.log(`Get conferences: `, result);
                    if(result && result._embedded && result._embedded.items) {
                        for(const conf of result._embedded.items) {
                            console.log("conference: ", conf);
                        }
                    }
                    break;
                }
            case '2':
                {
                    const result = await createConference(token1.access_token);
                    console.log(`Create conference: `, result);
                    break;
                }
            case '3':
                {
                    const conferenceId = prompt('Enter the conferenceId: ');
                    const result = await getConferenceDetails(token1.access_token, conferenceId);
                    console.log('Conferennce details result', result);
                    break;
                }
            case '4':
                {
                    const conferenceId = prompt('Enter the conferenceId: ');
                    const result = await invokeConferenceFeature(token1.access_token, conferenceId);
                    console.log('Invoke conference feature result: ', result);
                    break;
                }
            case '5':
                {
                    const conferenceId = prompt('Enter the conferenceId: ');
                    const result = await updateConference(token1.access_token, conferenceId);
                    console.log('Update conference result', result);
                    break;
                }
            case '6':
                {
                    const conferenceId = prompt('Enter the conferenceId: ');
                    const result = await deleteConference(token1.access_token, conferenceId);
                    console.log('Delete conference result', result);
                    break;
                }
            case '7':
                {
                    const searchStr = prompt('Enter search string: ');
                    const result = await getConferencesContent(token1.access_token, searchStr);
                    console.log('Get user conferences content: ', result);
                    if(result && result._embedded && result._embedded.items) {
                        for(const conf of result._embedded.items) {
                            console.log("matching conferences: ", conf);
                        }
                    }
                    break;
                }
            case '8':
                {
                    const result = await getUserConferences(token1.access_token, inputData.userData[0].principal_id);
                    console.log('Get user conferences result', result);
                    if(result && result._embedded && result._embedded.items) {
                        for(const conf of result._embedded.items) {
                            console.log("conference: ", conf);
                        }
                    }
                    break;
                }
            case '9':
                {
                    const result = await getUserMeetingsAttendances(token1.access_token, inputData.userData[0].principal_id);
                    console.log('Get user conferences result', result);
                    if(result && result._embedded && result._embedded.items) {
                        for(const conf of result._embedded.items) {
                            console.log("conference: ", conf);
                        }
                    }
                    break;
                }
        
            case 'e':
                exitMenu = true;
                break;
            default:
                console.log(`Unknown command: ${menuSelection}`);
                prompt('Press enter to continue.');
        }
    }  
}

async function displayConferenceParticipantsMenu() {
    let exitMenu = false;
    while(! exitMenu) {
        console.log(`(1) Get conference participants.`);
        console.log(`(2) Add conference participant.`);
        console.log(`(3) Get conference participant.`);
        console.log(`(4) Update conference participant.`);
        console.log(`(5) Remove conference participant.`);
        console.log(`(6) Create conference participant connection detail.`);
        console.log(`(e) Return to main menu.`);

        const menuSelection = prompt('\nMenu selection: ');
        switch(menuSelection) {
            case '1':
                {
                    const confId = prompt("Enter the conferenceId: ");
                    const result = await getConferenceParticipants(token1.access_token, confId);
                    console.log(`Get conference participants: `, result);
                    if(result && result._embedded && result._embedded.items) {
                        for(const participant of result._embedded.items) {
                            console.log("Conference Participant: ", participant);
                        }
                    }
                    break;
                }
            case '2':
                {
                    const confId = prompt("Enter the conferenceId: ");
                    const partId = prompt("Enter the participantId: ");
                    const result = await addConferenceParticipant(token1.access_token, confId, partId);
                    console.log(`Add conference participant: `, result);
                    break;
                }
            case '3':
                {
                    const conferenceId = prompt('Enter the conferenceId: ');
                    const partId = prompt("Enter the participantId: ");
                    const result = await getConferenceParticipant(token1.access_token, conferenceId, partId);
                    console.log('Conferennce details result', result);
                    break;
                }
            case '4':
                {
                    const conferenceId = prompt('Enter the conferenceId: ');
                    const partId = prompt("Enter the participantId: ");
                    const result = await updateConferenceParticipant(token1.access_token, conferenceId, partId);
                    console.log('Update conference participant result: ', result);
                    break;
                }
            case '5':
                {
                    const conferenceId = prompt('Enter the conferenceId: ');
                    const partId = prompt("Enter the participantId: ");
                    const result = await deleteConferenceParticipant(token1.access_token, conferenceId, partId);
                    console.log('Delete conference participant result', result);
                    break;
                }
            case '6':
                {
                    const conferenceId = prompt('Enter the conferenceId: ');
                    const partId = prompt("Enter the participantId: ");
                    const result = await createConferenceParticipantConnection(token1.access_token, conferenceId, partId);
                    console.log('Create conference participant connection result', result);
                    break;
                }
        
            case 'e':
                exitMenu = true;
                break;
            default:
                console.log(`Unknown command: ${menuSelection}`);
                prompt('Press enter to continue.');
        }
    }  
}

async function displayRecordingsMenu() {
    let exitMenu = false;
    while(! exitMenu) {
        console.log(`(1) Get recordings.`);
        console.log(`(2) Get recording meta.`);
        console.log(`(3) Update recording metadata.`);
        console.log(`(4) Delete recording`);
        console.log(`(e) Return to main menu.`);

        const menuSelection = prompt('\nMenu selection: ');
        switch(menuSelection) {
            case '1':
                {
                    const result = await getRecordings(token1.access_token);
                    console.log(`Get recordings: `, result);
                    if(result && result._embedded && result._embedded.items) {
                        for(const rec of result._embedded.items) {
                            console.log("Recording: ", rec);
                        }
                    }
                    break;
                }
            case '2':
                {
                    const recordingId = prompt("Enter the recordingId: ");
                    const result = await getRecordingMeta(token1.access_token, recordingId);
                    console.log(`Get recording meta: `, result);
                    break;
                }
            case '3':
                {
                    const recordingId = prompt("Enter the recordingId: ");
                    const label = prompt("Enter new recording label: ");
                    const result = await updateRecordingMeta(token1.access_token, recordingId, label);
                    console.log('Update recording meta result', result);
                    break;
                }
            case '4':
                {
                    const recordingId = prompt("Enter the recordingId: ");
                    const result = await deleteRecording(token1.access_token, recordingId);
                    console.log('Delete recording result: ', result);
                    break;
                }
        
            case 'e':
                exitMenu = true;
                break;
            default:
                console.log(`Unknown command: ${menuSelection}`);
                prompt('Press enter to continue.');
        }
    }  
}

async function displayMenu() {
    
    let shutdown = false;
    
    while(!shutdown) {
        //console.clear();
        console.log(`(1) Login User ${inputData.userData[0].username}`);
        console.log(`(2) Login User ${inputData.userData[1].username}`);
        console.log(`(3) Call History Menu`);
        console.log(`(4) Telephony Menu`);
        console.log(`(5) Conference Menu`);
        console.log(`(6) Conference Participants Menu`);
        console.log(`(7) Recording menu`);
        console.log(`(e) Exit Application`);
    
        const menuSelection = prompt('\nMenu selection: ');
        switch(menuSelection) {
            case '1':
                token1 = await getToken(inputData.userData[0]); // Get data for user 1
                console.log(`Token obtained for ${inputData.userData[0].username}: ${JSON.stringify(token1.access_token)}`);
                prompt('Press enter to continue.');
                break;
            case '2':
                token2 = await getToken(inputData.userData[1]); // Get data for user 1
                console.log(`Token obtained for ${inputData.userData[1].username}: ${JSON.stringify(token2.access_token)}`);
                prompt('Press enter to continue.');
                break;
            case '3':
                await displayCallHistoryMenu();
                break;
            case '4':
                await displayTelephonyMenu();
                break;
            case '5':
                await displayConferenceMenu();
                break;
            case '6':
                await displayConferenceParticipantsMenu();
                break;
            case '7':
                await displayRecordingsMenu();
                break; 
            case 'e':
                console.log('Exiting application.');
                shutdown = true;
                break;
            default:
                console.log(`Unknown command: ${menuSelection}`);
                prompt('Press enter to continue.');
        }
    }
}


/**
 * Calling the main function
 * @returns
 */
displayMenu();
