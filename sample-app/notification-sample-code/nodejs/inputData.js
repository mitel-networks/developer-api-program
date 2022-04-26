module.exports = {
    userdata: {
        response_type: "code",       // no change needed
        username: "USER_NAME",       // provide your username for user 1
        password: "PASSWORD",        // provide password for user
        account_id: "ACCOUNT_ID",    // provide account_id for user
    },
    appData: {
        client_id: "CLIENT_ID"       // provide valid unique clientId issued by Mitel
    },
    // Data for subscription creation
    subscriptionData: {
        applicationId: "APPLICATION_ID", // 128-bit GUID that identifies the application for trust/signing purposes
        deviceId: "DEVICE_ID", //URL for webhooks to be delivered to
        transport: "webhook",
        topic: "platform-api-media",
        subjectFilter: "/2017-09-01/endpoints/",
        publicationFilter: "$.publications[?(@.content.state == 'ringing')]" // This is a filter for ringing events
    },
    // Data for calling
    makeCallData: {
        from: "CALL_FROM_EXTENSION_NO", // Caller extension number
        to: "CALL_TO_EXTENSION_NO" // Callee extension number
    }
}
