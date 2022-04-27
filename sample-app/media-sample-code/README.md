# Media Services Sample Code

This Media Services sample code is used to demonstrate how to use the Media Services API.

## Pre-requisites
Ideally this sample application should be used with 2 users which have desk phone extensions.
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
        extension_number: "User's extension" // provide the user's extension
    }{
        grant_type: "password", // grant_type will be password
        username: "USER2_NAME", // provide your yourname
        password: "PASSWORD", // provide password for user
        account_id: "ACCOUNT_ID" // provide account_id for user
        extension_number: "User's extension" // provide the user's extension
    }]
}
```

<br />

# Run the code

At the root level, run the below command

Install your modules
```
$ node index.js
```

