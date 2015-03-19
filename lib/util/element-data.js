var cache = [0],
    expando = 'data' + new Date();

/*
 * Retrieve / Assign key-value pair to element
 * @param {HTMLNode} element
 * @param {String} key
 * @param {Mixed*} value
 * @return {void}
 */
module.exports = function (element, key, value) {
    var cacheIndex = element[expando],
        nextCacheIndex = cache.length;

    if (!cacheIndex) {
        cacheIndex = element[expando] = nextCacheIndex;
        cache[cacheIndex] = {};
    }

    if (value) { // set
        cache[cacheIndex][key] = value;
        return value;
    } else { // get
        return cache[cacheIndex][key];
    }
};