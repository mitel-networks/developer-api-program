# Authentication Sample Code

This sample code uses the Mitel Authentication portal to execute the OICD workflow and obtain a valid token for a custom application

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
    userdata: {
        response_type: "code",       // no change needed
        username: "USER_NAME",       // provide your username for user 1
        password: "PASSWORD",        // provide password for user
        account_id: "ACCOUNT_ID",    // provide account_id for user
    },
    appData: {
        client_id: "CLIENT_ID"       // provide valid unique clientId issued by Mitel
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

<br />

# Result

Result obtained by running would give data in below format

```json
{
    "token_type": "bearer",
    "expires_in": 3747,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVVc2VySWQiOiI2YmE0NjJjNi1lNjFkLTQyNGYtYTRmYi1mMmU2NDY4YWQ3ODEiLCJwcmluY2lwYWxJZCI6IjZiYTQ2MmM2LWU2MWQtNDI0Zi1hNGZiLWYyZTY0NjhhZDc4MSIsImFjY291bnRJZCI6IjU2MzA5YWQ0LThjNmEtNDllYy05Zjc0LTdhZmNhNzI3MGYzZSIsInBhcnRuZXJJZCI6IjQwNjkwOTcyMCIsImRvbWFpbiI6IjU2MzA5YWQ0LThjNmEtNDllYy05Zjc0LTdhZmNhNzI3MGYzZS51cy5kZXYuYXBpLm1pdGVsLmlvIiwiZW1haWwiOiJwcmFzaGFudC5zaW5naEBtaXRlbC5jb20iLCJlbWFpbFZlcmlmaWVkIjp0cnVlLCJleHRlbnNpb25WZXJpZmllZCI6ZmFsc2UsImxhbmd1YWdlQ29kZSI6ImVuLVVTIiwibW9iaWxlVmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiUHJhc2hhbnQgU2luZ2giLCJwaG9uZVZlcmlmaWVkIjpmYWxzZSwicm9sZSI6IkFDQ09VTlRfQURNSU4iLCJ1c2VySWQiOiI2YmE0NjJjNi1lNjFkLTQyNGYtYTRmYi1mMmU2NDY4YWQ3ODEiLCJzaXBBZGRyZXNzIjoiNmJhNDYyYzYtZTYxZC00MjRmLWE0ZmItZjJlNjQ2OGFkNzgxQDU2MzA5YWQ0LThjNmEtNDllYy05Zjc0LTdhZmNhNzI3MGYzZS51cy5kZXYuYXBpLm1pdGVsLmlvIiwiaXNzIjoiaHR0cHM6Ly9hdXRoZW50aWNhdGlvbi51cy1lYXN0LTEudXMuZGV2LmFwaS5taXRlbC5pby9jbG91ZGxpbmsiLCJpYXQiOjE2NDgwMjI5OTUsImV4cCI6MTY0ODAyNjc0Mn0.TYlQ8ZSOk1v_hqgNKbZlctLIKERy_0MR0m4S6xaLC40",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1NjMwOWFkNC04YzZhLTQ5ZWMtOWY3NC03YWZjYTcyNzBmM2UiLCJpc3MiOiJodHRwczovL2F1dGhlbnRpY2F0aW9uLnVzLWVhc3QtMS51cy5kZXYuYXBpLm1pdGVsLmlvL2Nsb3VkbGluayIsInR5cGUiOiJ1c2VyIiwiaWQiOiI2YmE0NjJjNi1lNjFkLTQyNGYtYTRmYi1mMmU2NDY4YWQ3ODEiLCJhc3N1bWVkUm9sZSI6IkFDQ09VTlRfQURNSU4iLCJhdXRoUHJvdmlkZXIiOiJjbG91ZGxpbmsiLCJpYXQiOjE2NDgwMjI5OTUsImV4cCI6MTY0OTMxODk5NX0.HD1CXhUpEIxCVtNmYEBRE_an5EygdhqR2bGHUrd2dk0",
    "scope": "read write"
}
```