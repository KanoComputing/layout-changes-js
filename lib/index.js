var Loop = require('game-loop'),
    loop = new Loop(),
    elementData = require('./util/element-data');

var listeners = [],
    listening = false;

/*
 * Main loop function running within getAnimationFrame loop
 * @return {void}
 */
loop.use(function () {
    listeners.forEach(function (listener) {
        var el = listener.el,
            html, changed;

        if (!el || !el.parentNode) {
            removeListener(el, listener.fn);
        }

        html = el.innerHTML;
        changed = checkChangeRecursive(listener.el);

        if (changed || html !== listener._html) {
            listener.fn.call(el, el);
        }

        listener._html = html;
    });
});

/*
 * Check a size changed in element and children recursively, cache size
 * @return {void}
 */
function checkChangeRecursive(el) {
    var cachedSize = elementData(el, 'size'),
        size = el.offsetWidth + ',' + el.offsetHeight,
        i, changed = false;

    if (!cachedSize || cachedSize !== size) {
        elementData(el, 'size', size);
        changed = true;
    }

    for (i = 0; i < el.children.length; i += 1) {
        if (checkChangeRecursive(el.children[i])) {
            changed = true;
        }
    }

    return changed;
}

/*
 * Start listening loop if not already running
 * @return {void}
 */
function start() {
    if (!listening) { loop.play(); }
    listening = true;
}

/*
 * Stop listening loop if running
 * @return {void}
 */
function stop() {
    if (listening) { loop.stop(); }
    listening = false;
}

/*
 * Get an assigned listener from element and callback
 * @param {HTMLNode} element
 * @param {Function} callback
 * @return {Function|void}
 */
function getListener(element, callback) {
    for (var i = 0; i < listeners.length; i += 1) {
        if (listeners[i].el === element && listeners[i].fn === callback) {
            return listeners[i];
        }
    }

    return null;
}

/*
 * Assign a listener on element
 * @param {HTMLNode} element
 * @param {Function} callback
 * @return {void}
 */
function addListener (element, callback) {
    if (getListener(element, callback)) {
        return;
    }

    listeners.push({
        el : element,
        fn : callback
    });

    // Start loop
    start();
}

/*
 * Remove a listener from element
 * @param {HTMLNode} element
 * @param {Function} callback
 * @return {void}
 */
function removeListener(element, callback) {
    var match = getListener(element, callback);

    if (match) {
        listeners.splice(listeners.indexOf(match), 1);
    }

    // Stop loop if no listeners are left
    if (!listeners.length) {
        stop();
    }
}

module.exports = {
    addListener    : addListener,
    removeListener : removeListener
};