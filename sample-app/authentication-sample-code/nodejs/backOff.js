const randomMilliseconds = require('./random-milliseconds');

/*
* returns exponential back-off interval for the retry attempt (with or without jitter) 
*
* @param count - number of the current retry attempt (number)
* @param base - initial interval i.e. wait interval of the first retry attempt (milliseconds)
* @param randomize - add jitter to the calculated interval (boolean)
* @param maximumBackoff - maximum allowed interval for retry backoff (milliseconds)
*/
function generateBackoffInterval(count = 0, base = 1000, maximumBackoff = 128000, jitter = true) {
    // throw an error if count is negative
    if (count < 0) {
        console.log('InvalidArgumentException: count cannot be less than 0');
        process.exit();
    }
    // throw an error if maximumBackoff is less than base
    if (maximumBackoff < base) {
        console.log('InvalidArgumentException: maximumBackoff cannot be less than base');
        process.exit();
    }

    let interval = base * Math.pow(2, count); // calculate back-off interval exponentially

    if (maximumBackoff) {
        interval = Math.min(maximumBackoff, interval);
    }
    if (jitter) {
        return interval + randomMilliseconds.randomMilliseconds();
    }

    return interval;
}

module.exports = {
    generateBackoffInterval
}
    