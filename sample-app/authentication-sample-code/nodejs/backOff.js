const randomMilliseconds = require('./random-milliseconds');

/*
* returns exponential back-off interval for the retry attempt (with or without jitter) 
*
* @param count - number of the current retry attempt (number)
* @param base - initial interval i.e. wait interval of the first retry attempt (milliseconds)
* @param randomize - add jitter to the calculated interval (boolean)
* @param maximumBackoff - maximum allowed interval for retry backoff (milliseconds)
*/
function generateBackoffInterval(retryAfter = '', jitter = true) {
    let delayMs = 2000; // two second default
    if(retryAfter) {
        delayMs = new Date(retryAfter).getTime() - Date.now();
    }

    if (delayMs < 0) {
        console.log('InvalidArgumentException: delayMs cannot be less than 0');
        process.exit();
    }

    // Add a randomized delay so that not all clients hit the Cloudlink 
    // platform at the same time
    if (jitter) {
        return delayMs + randomMilliseconds.randomMilliseconds();
    }

    return delayMs;
}

module.exports = {
    generateBackoffInterval
}
    