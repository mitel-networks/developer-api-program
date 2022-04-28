# Notification Sample Code

This sample code makes use of the Create Subscription endpoint to create a subscription for ringing events on a range of endpoints defined by the user. This sample code is expected to output any received webhooks to the console

## Pre-requisites

* Have an cloudlink account and obtain a client id

* [Node.js](https://nodejs.org/en/) - Install node.js


## Setup

At the root level, run the below command to install the necessary dependencies

```
$ npm install
```

# Provide valid input data

Open input inputData.js file and modify the below details

```json
{
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
```

<br />

# Run the code

At the root level, run the below command

Install your modules
```
$ node index.js
```

# Result

Listen to the webhook and something similar will be logged

```json
{
  "publicationId": "d588e181-8847-4ca3-864c-53a3e80afa87",
  "topic": "platform-api-media",
  "method": "PUT",
  "subject": "/2017-09-01/endpoints/2001/calls/33656066",
  "content": {
    "from": "2002",
    "fromName": "",
    "to": "2001",
    "toName": "",
    "state": "ringing",
    "cause": "newCall",
    "direction": "inbound",
    "extraPbxData": {
      "alertingDevice": "2001",
      "calledDevice": "2001",
      "eventType": "deliveredEvent",
      "callTrackingID": "1650975157#7"
    },
    "createdOn": "2022-04-26T12:12:38.940Z",
    "callId": "endpoints/2001/calls/33656066",
    "endpointId": "2001",
    "siteId": "7c511070-e9de-4f72-80f3-bc7ac9f61eea",
    "accountId": "0265da2a-8da2-4f37-baae-b3dcedc31c6b",
    "timestamp": 1650975158944,
    "eventId": "97407df6-adf7-4abf-bda3-4ee9d6d99769",
    "mediaReceivedTimestamp": 1650975159466,
    "_links": {
      "self": "/2017-09-01/endpoints/2001/calls/33656066"
    },
    "isCtiEvent": true,
    "principalId": "993743f0-f24e-4428-b483-b8b1639b42ed",
    "callLegOwner": "993743f0-f24e-4428-b483-b8b1639b42ed",
    "mediaEventProcessedTimestamp": 1650975159484,
    "eventType": "CallStateNotification",
    "deviceId": "platform-api-mediaservice-us-west-2-800148832223-us",
    "userId": "993743f0-f24e-4428-b483-b8b1639b42ed"
  },
  "publisher": {
    "accountId": "0265da2a-8da2-4f37-baae-b3dcedc31c6b",
    "principalId": "993743f0-f24e-4428-b483-b8b1639b42ed"
  },
  "subscription": {
    "subscriptionId": "2d086378f1c948655ea6fd0a8b8a8303"
  },
  "notification": {
    "createdOn": "2022-04-26T12:12:39.971Z",
    "correlationId": "b036edf6-a6e3-42ee-b7d8-9436c3e3631f"
  }
}
```


**_NOTE:_**  User should have the **ADMIN rights** or above to perform the call operation.

**_WEBHOOK:_**  https://webhook.site/ is useful website to test your webhook output