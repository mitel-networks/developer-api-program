module.exports = {
    userData: [{
        grant_type: "password",      // no change needed
        username: "USER_NAME",       // provide your username for user 1
        password: "PASSWORD",        // provide password for user
        account_id: "ACCOUNT_ID"     // provide account_id for user
    },
    {
        grant_type: "password",      // no change needed
        username: "USER_NAME",       // provide your username for user 2
        password: "PASSWORD",        // provide password for user
        account_id: "ACCOUNT_ID"     // provide account_id for user
    }],
    conversationData: {
        "stream": false,
        "hidden": true,
        "generateSystemMessages": false,
        "originalParticipants": [
            {
                "type": "USER",
                "participantId": "USER1_ID" // Provide user 1 id
            },
            {
                "type": "USER",
                "participantId": "USER2_ID" // Provide user 2 id
            }
        ]
    },
    messageData: {
        "body": "Hello World!",
        "contentType": "text/plain"
    }

}
