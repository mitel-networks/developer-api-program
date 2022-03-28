module.exports = {
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
