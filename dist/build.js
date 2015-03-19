(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var lib = {
    addListener    : addListener,
    removeListener : removeListener
};

/**
 * Export to `window` if in the browser
 */
if (window) {
    window.LayoutChanges = lib;
}

/**
 * Export to `module.exports` if commonJS
 */
if (module) {
    module.exports = lib;
}
},{"./util/element-data":2,"game-loop":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){

var requestAnimFrame = require('./utils/requestAnimFrame');

var Loop = function () {
  this.callbacks = [];
  this.playing = false;
  this.fps = 0;
  this.frame = 0;
};

Loop.prototype.play = function () {
  this.playing = true;
  this.next();
};

Loop.prototype.stop = function () {
  this.playing = false;
};

Loop.prototype.use = function (callback) {
  this.callbacks.push(callback);
};

Loop.prototype.next = function () {
  if (this.playing) {
    var self = this;

    this.getFPS();

    for (var i = 0; i < this.callbacks.length; i += 1) {
      this.callbacks[i]();
    }

    this.frame+= 1;

    requestAnimFrame(function () {
      self.next();
    });
  }
};

Loop.prototype.getFPS = function () {
  var delta;

  if (!this.lastUpdate) {
    this.lastUpdate = new Date().getTime();
  }

  delta = (new Date().getTime() - this.lastUpdate) / 1000;
  this.lastUpdate = new Date().getTime();
  this.fps = 1 / delta;
};

module.exports = Loop;

},{"./utils/requestAnimFrame":4}],4:[function(require,module,exports){

var polyfill = function (callback) {
  setTimeout(callback, 1000 / 60);
};

module.exports =
  (window) ? (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    polyfill
  ) : polyfill;

},{}]},{},[1]);
