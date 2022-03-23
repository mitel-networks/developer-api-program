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
    userdata: [{
        grant_type: "password", // grant_type will be password
        username: "USER1_NAME", // provide your yourname
        password: "PASSWORD", // provide password for user
        account_id: "ACCOUNT_ID" // provide account_id for user
    }{
        grant_type: "password", // grant_type will be password
        username: "USER2_NAME", // provide your yourname
        password: "PASSWORD", // provide password for user
        account_id: "ACCOUNT_ID" // provide account_id for user
    }],
    conversationData: {
        "stream": false,
        "hidden": true,
        "generateSystemMessages": false,
        "originalParticipants": [
            {
                "type": "USER",
                "participantId": "USER_ID"  // provide user_id (user 1)
            },
            {
                "type": "USER",
                "participantId": "USER_ID"  // provide user_id (User 2) 
            }
        ]
    },
    messageData: {
        "body": "MESSAGE_BODY",     // Message body not greater than 1024 characters
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

