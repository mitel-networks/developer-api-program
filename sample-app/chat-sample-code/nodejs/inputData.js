module.exports = {
    userData: [{
        response_type: "code",       // no change needed
        username: "USER_NAME",       // this is your cloudlink user(user 1)
        password: "PASSWORD",        // provide password for your cloudlink user(user 1)
        account_id: "ACCOUNT_ID",    // provide account_id for user
    },
    {
        response_type: "code",       // no change needed
        username: "USER_NAME",       // this is your cloudlink user(user 2)
        password: "PASSWORD",        // provide password for your cloudlink user(user 2)
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
