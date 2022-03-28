# Authentication Sample Code

This sample code will create a chat stream, send a message, and then deletes the stream

## Pre-requisites

[Node.js](https://nodejs.org/en/) - Install node.js


## Setup

At the root level, run the below command to install the necessary dependencies

```
$ npm install
```

# Provide valid input data

Open input inputData.js file and modify the below details

```json
{
    userData: [{
        response_type: "code",       // no change needed
        username: "USER_NAME",       // provide your username for user 1
        password: "PASSWORD",        // provide password for user
        account_id: "ACCOUNT_ID",    // provide account_id for user
    },
    {
        response_type: "code",       // no change needed
        username: "USER_NAME",       // provide your username for user 2
        password: "PASSWORD",        // provide password for user
        account_id: "ACCOUNT_ID",    // provide account_id for user
    }],
    appData: {
        client_id: "CLIENT_ID"       // provide valid unique clientId issued by Mitel
    },
    conversationData: {
        "stream": false,
        "hidden": true,
        "generateSystemMessages": false,
        // originalParticipants values will be replaced with real value at runtime
        "originalParticipants": [
            {
                "type": "USER",
                "participantId": "USER1_ID"
            },
            {
                "type": "USER",
                "participantId": "USER2_ID"
            }
        ]
    },
    messageData: {
        "body": "Hello World!",
        "contentType": "text/plain"
    }

}
```

<br />

# Run the code

At the root level, run the below command

Install your modules
```
$ node index.js
```

