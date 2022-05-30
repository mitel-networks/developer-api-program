/*
 * returns randomly generated jitter in milliseconds between 0 and 'randomInterval'
 *
 * @param randomInterval - number of milliseconds on which the random jitter can be spread (milliseconds)
 */
const randomMilliseconds = (min = 1000, max = 2000) => {
    return Math.floor(Math.random() * (max - min) + min); // generates random number between min and max
};

module.exports = {
    randomMilliseconds
}