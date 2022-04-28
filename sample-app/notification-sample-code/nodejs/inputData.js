module.exports = {
    userdata: {
        response_type: "code",       // no change needed
        username: "USER_NAME",       // this is your cloudlink user
        password: "PASSWORD",        // provide password for your cloudlink user
        account_id: "ACCOUNT_ID",    // provide account_id for user
    },
    appData: {
        client_id: "CLIENT_ID"       // provide valid unique clientId issued by Mitel
    },
    // Data for subscription creation
    subscriptionData: {
        applicationId: "APPLICATION_ID", // This is a unique ID specific to your app that’s required if you’re using a webhooks. You can generate this yourself, just make sure it’s unique, so something like a 128-bit GUID is a good choice.
        deviceId: "DEVICE_ID", //URL for webhooks to be delivered to ( https://webhook.site/ can be used to test webhook output)
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
