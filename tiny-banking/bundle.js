(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],3:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":4}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (process){(function (){
// Run using node --> node index.js
// Run using html --> open index.html in browser

const dotenv = require('dotenv').config();
const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const createHttpLink = require('apollo-link-http').createHttpLink;
const fetch = require('cross-fetch/polyfill').fetch;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const ApolloLinkContext = require('apollo-link-context');

process.env.API = "http://localhost:4000/graphql";
const client = new ApolloClient({
    link: createHttpLink({
        uri: process.env.API,
        fetch: fetch
    }),
    cache: new InMemoryCache()
});

// Mutation
client.mutate({
    mutation: gql`
    mutation {
        createCustomer(firstName: "Tom", lastName: "Holland") {
          customerId
        }
      }
    `
}).then(res => {
    console.log("mutation response : ", res);
})

// Query
client.query({
    query: gql`
    query{
        customer(customerId: 1) {
          firstName
          lastName
          customerId
          active
        }
      }
    `,
}).then(res => {
    console.log("query response : ", res);
})
}).call(this)}).call(this,require('_process'))
},{"_process":4,"apollo-boost":8,"apollo-cache-inmemory":10,"apollo-link-context":15,"apollo-link-http":22,"cross-fetch/polyfill":30,"dotenv":31,"graphql-tag":34}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// This currentContext variable will only be used if the makeSlotClass
// function is called, which happens only if this is the first copy of the
// @wry/context package to be imported.
var currentContext = null;
// This unique internal object is used to denote the absence of a value
// for a given Slot, and is never exposed to outside code.
var MISSING_VALUE = {};
var idCounter = 1;
// Although we can't do anything about the cost of duplicated code from
// accidentally bundling multiple copies of the @wry/context package, we can
// avoid creating the Slot class more than once using makeSlotClass.
var makeSlotClass = function () { return /** @class */ (function () {
    function Slot() {
        // If you have a Slot object, you can find out its slot.id, but you cannot
        // guess the slot.id of a Slot you don't have access to, thanks to the
        // randomized suffix.
        this.id = [
            "slot",
            idCounter++,
            Date.now(),
            Math.random().toString(36).slice(2),
        ].join(":");
    }
    Slot.prototype.hasValue = function () {
        for (var context_1 = currentContext; context_1; context_1 = context_1.parent) {
            // We use the Slot object iself as a key to its value, which means the
            // value cannot be obtained without a reference to the Slot object.
            if (this.id in context_1.slots) {
                var value = context_1.slots[this.id];
                if (value === MISSING_VALUE)
                    break;
                if (context_1 !== currentContext) {
                    // Cache the value in currentContext.slots so the next lookup will
                    // be faster. This caching is safe because the tree of contexts and
                    // the values of the slots are logically immutable.
                    currentContext.slots[this.id] = value;
                }
                return true;
            }
        }
        if (currentContext) {
            // If a value was not found for this Slot, it's never going to be found
            // no matter how many times we look it up, so we might as well cache
            // the absence of the value, too.
            currentContext.slots[this.id] = MISSING_VALUE;
        }
        return false;
    };
    Slot.prototype.getValue = function () {
        if (this.hasValue()) {
            return currentContext.slots[this.id];
        }
    };
    Slot.prototype.withValue = function (value, callback, 
    // Given the prevalence of arrow functions, specifying arguments is likely
    // to be much more common than specifying `this`, hence this ordering:
    args, thisArg) {
        var _a;
        var slots = (_a = {
                __proto__: null
            },
            _a[this.id] = value,
            _a);
        var parent = currentContext;
        currentContext = { parent: parent, slots: slots };
        try {
            // Function.prototype.apply allows the arguments array argument to be
            // omitted or undefined, so args! is fine here.
            return callback.apply(thisArg, args);
        }
        finally {
            currentContext = parent;
        }
    };
    // Capture the current context and wrap a callback function so that it
    // reestablishes the captured context when called.
    Slot.bind = function (callback) {
        var context = currentContext;
        return function () {
            var saved = currentContext;
            try {
                currentContext = context;
                return callback.apply(this, arguments);
            }
            finally {
                currentContext = saved;
            }
        };
    };
    // Immediately run a callback function without any captured context.
    Slot.noContext = function (callback, 
    // Given the prevalence of arrow functions, specifying arguments is likely
    // to be much more common than specifying `this`, hence this ordering:
    args, thisArg) {
        if (currentContext) {
            var saved = currentContext;
            try {
                currentContext = null;
                // Function.prototype.apply allows the arguments array argument to be
                // omitted or undefined, so args! is fine here.
                return callback.apply(thisArg, args);
            }
            finally {
                currentContext = saved;
            }
        }
        else {
            return callback.apply(thisArg, args);
        }
    };
    return Slot;
}()); };
// We store a single global implementation of the Slot class as a permanent
// non-enumerable symbol property of the Array constructor. This obfuscation
// does nothing to prevent access to the Slot class, but at least it ensures
// the implementation (i.e. currentContext) cannot be tampered with, and all
// copies of the @wry/context package (hopefully just one) will share the
// same Slot implementation. Since the first copy of the @wry/context package
// to be imported wins, this technique imposes a very high cost for any
// future breaking changes to the Slot class.
var globalKey = "@wry/context:Slot";
var host = Array;
var Slot = host[globalKey] || function () {
    var Slot = makeSlotClass();
    try {
        Object.defineProperty(host, globalKey, {
            value: host[globalKey] = Slot,
            enumerable: false,
            writable: false,
            configurable: false,
        });
    }
    finally {
        return Slot;
    }
}();

var bind = Slot.bind, noContext = Slot.noContext;
function setTimeoutWithContext(callback, delay) {
    return setTimeout(bind(callback), delay);
}
// Turn any generator function into an async function (using yield instead
// of await), with context automatically preserved across yields.
function asyncFromGen(genFn) {
    return function () {
        var gen = genFn.apply(this, arguments);
        var boundNext = bind(gen.next);
        var boundThrow = bind(gen.throw);
        return new Promise(function (resolve, reject) {
            function invoke(method, argument) {
                try {
                    var result = method.call(gen, argument);
                }
                catch (error) {
                    return reject(error);
                }
                var next = result.done ? resolve : invokeNext;
                if (isPromiseLike(result.value)) {
                    result.value.then(next, result.done ? reject : invokeThrow);
                }
                else {
                    next(result.value);
                }
            }
            var invokeNext = function (value) { return invoke(boundNext, value); };
            var invokeThrow = function (error) { return invoke(boundThrow, error); };
            invokeNext();
        });
    };
}
function isPromiseLike(value) {
    return value && typeof value.then === "function";
}
// If you use the fibers npm package to implement coroutines in Node.js,
// you should call this function at least once to ensure context management
// remains coherent across any yields.
var wrappedFibers = [];
function wrapYieldingFiberMethods(Fiber) {
    // There can be only one implementation of Fiber per process, so this array
    // should never grow longer than one element.
    if (wrappedFibers.indexOf(Fiber) < 0) {
        var wrap = function (obj, method) {
            var fn = obj[method];
            obj[method] = function () {
                return noContext(fn, arguments, this);
            };
        };
        // These methods can yield, according to
        // https://github.com/laverdet/node-fibers/blob/ddebed9b8ae3883e57f822e2108e6943e5c8d2a8/fibers.js#L97-L100
        wrap(Fiber, "yield");
        wrap(Fiber.prototype, "run");
        wrap(Fiber.prototype, "throwInto");
        wrappedFibers.push(Fiber);
    }
    return Fiber;
}

exports.Slot = Slot;
exports.asyncFromGen = asyncFromGen;
exports.bind = bind;
exports.noContext = noContext;
exports.setTimeout = setTimeoutWithContext;
exports.wrapYieldingFiberMethods = wrapYieldingFiberMethods;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _a = Object.prototype, toString = _a.toString, hasOwnProperty = _a.hasOwnProperty;
var previousComparisons = new Map();
/**
 * Performs a deep equality check on two JavaScript values, tolerating cycles.
 */
function equal(a, b) {
    try {
        return check(a, b);
    }
    finally {
        previousComparisons.clear();
    }
}
function check(a, b) {
    // If the two values are strictly equal, our job is easy.
    if (a === b) {
        return true;
    }
    // Object.prototype.toString returns a representation of the runtime type of
    // the given value that is considerably more precise than typeof.
    var aTag = toString.call(a);
    var bTag = toString.call(b);
    // If the runtime types of a and b are different, they could maybe be equal
    // under some interpretation of equality, but for simplicity and performance
    // we just return false instead.
    if (aTag !== bTag) {
        return false;
    }
    switch (aTag) {
        case '[object Array]':
            // Arrays are a lot like other objects, but we can cheaply compare their
            // lengths as a short-cut before comparing their elements.
            if (a.length !== b.length)
                return false;
        // Fall through to object case...
        case '[object Object]': {
            if (previouslyCompared(a, b))
                return true;
            var aKeys = Object.keys(a);
            var bKeys = Object.keys(b);
            // If `a` and `b` have a different number of enumerable keys, they
            // must be different.
            var keyCount = aKeys.length;
            if (keyCount !== bKeys.length)
                return false;
            // Now make sure they have the same keys.
            for (var k = 0; k < keyCount; ++k) {
                if (!hasOwnProperty.call(b, aKeys[k])) {
                    return false;
                }
            }
            // Finally, check deep equality of all child properties.
            for (var k = 0; k < keyCount; ++k) {
                var key = aKeys[k];
                if (!check(a[key], b[key])) {
                    return false;
                }
            }
            return true;
        }
        case '[object Error]':
            return a.name === b.name && a.message === b.message;
        case '[object Number]':
            // Handle NaN, which is !== itself.
            if (a !== a)
                return b !== b;
        // Fall through to shared +a === +b case...
        case '[object Boolean]':
        case '[object Date]':
            return +a === +b;
        case '[object RegExp]':
        case '[object String]':
            return a == "" + b;
        case '[object Map]':
        case '[object Set]': {
            if (a.size !== b.size)
                return false;
            if (previouslyCompared(a, b))
                return true;
            var aIterator = a.entries();
            var isMap = aTag === '[object Map]';
            while (true) {
                var info = aIterator.next();
                if (info.done)
                    break;
                // If a instanceof Set, aValue === aKey.
                var _a = info.value, aKey = _a[0], aValue = _a[1];
                // So this works the same way for both Set and Map.
                if (!b.has(aKey)) {
                    return false;
                }
                // However, we care about deep equality of values only when dealing
                // with Map structures.
                if (isMap && !check(aValue, b.get(aKey))) {
                    return false;
                }
            }
            return true;
        }
    }
    // Otherwise the values are not equal.
    return false;
}
function previouslyCompared(a, b) {
    // Though cyclic references can make an object graph appear infinite from the
    // perspective of a depth-first traversal, the graph still contains a finite
    // number of distinct object references. We use the previousComparisons cache
    // to avoid comparing the same pair of object references more than once, which
    // guarantees termination (even if we end up comparing every object in one
    // graph to every object in the other graph, which is extremely unlikely),
    // while still allowing weird isomorphic structures (like rings with different
    // lengths) a chance to pass the equality test.
    var bSet = previousComparisons.get(a);
    if (bSet) {
        // Return true here because we can be sure false will be returned somewhere
        // else if the objects are not equivalent.
        if (bSet.has(b))
            return true;
    }
    else {
        previousComparisons.set(a, bSet = new Set);
    }
    bSet.add(b);
    return false;
}

exports.default = equal;
exports.equal = equal;


},{}],8:[function(require,module,exports){
(function (process){(function (){
exports.__esModule = true;
var _exportNames = {
  gql: true,
  HttpLink: true
};
exports.default = exports.gql = void 0;

var _tslib = require("tslib");

var _apolloClient = _interopRequireWildcard(require("apollo-client"));

Object.keys(_apolloClient).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _apolloClient[key];
});

var _apolloLink = require("apollo-link");

Object.keys(_apolloLink).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _apolloLink[key];
});

var _apolloCacheInmemory = require("apollo-cache-inmemory");

Object.keys(_apolloCacheInmemory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _apolloCacheInmemory[key];
});

var _apolloLinkHttp = require("apollo-link-http");

exports.HttpLink = _apolloLinkHttp.HttpLink;

var _apolloLinkError = require("apollo-link-error");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

exports.gql = _graphqlTag.default;

var _tsInvariant = require("ts-invariant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PRESET_CONFIG_KEYS = ['request', 'uri', 'credentials', 'headers', 'fetch', 'fetchOptions', 'clientState', 'onError', 'cacheRedirects', 'cache', 'name', 'version', 'resolvers', 'typeDefs', 'fragmentMatcher'];

var DefaultClient = function (_super) {
  (0, _tslib.__extends)(DefaultClient, _super);

  function DefaultClient(config) {
    if (config === void 0) {
      config = {};
    }

    var _this = this;

    if (config) {
      var diff = Object.keys(config).filter(function (key) {
        return PRESET_CONFIG_KEYS.indexOf(key) === -1;
      });

      if (diff.length > 0) {
        process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn('ApolloBoost was initialized with unsupported options: ' + ("" + diff.join(' ')));
      }
    }

    var request = config.request,
        uri = config.uri,
        credentials = config.credentials,
        headers = config.headers,
        fetch = config.fetch,
        fetchOptions = config.fetchOptions,
        clientState = config.clientState,
        cacheRedirects = config.cacheRedirects,
        errorCallback = config.onError,
        name = config.name,
        version = config.version,
        resolvers = config.resolvers,
        typeDefs = config.typeDefs,
        fragmentMatcher = config.fragmentMatcher;
    var cache = config.cache;
    process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(!cache || !cacheRedirects, 1) : (0, _tsInvariant.invariant)(!cache || !cacheRedirects, 'Incompatible cache configuration. When not providing `cache`, ' + 'configure the provided instance with `cacheRedirects` instead.');

    if (!cache) {
      cache = cacheRedirects ? new _apolloCacheInmemory.InMemoryCache({
        cacheRedirects: cacheRedirects
      }) : new _apolloCacheInmemory.InMemoryCache();
    }

    var errorLink = errorCallback ? (0, _apolloLinkError.onError)(errorCallback) : (0, _apolloLinkError.onError)(function (_a) {
      var graphQLErrors = _a.graphQLErrors,
          networkError = _a.networkError;

      if (graphQLErrors) {
        graphQLErrors.forEach(function (_a) {
          var message = _a.message,
              locations = _a.locations,
              path = _a.path;
          return process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn("[GraphQL error]: Message: " + message + ", Location: " + (locations + ", Path: " + path));
        });
      }

      if (networkError) {
        process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn("[Network error]: " + networkError);
      }
    });
    var requestHandler = request ? new _apolloLink.ApolloLink(function (operation, forward) {
      return new _apolloLink.Observable(function (observer) {
        var handle;
        Promise.resolve(operation).then(function (oper) {
          return request(oper);
        }).then(function () {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        }).catch(observer.error.bind(observer));
        return function () {
          if (handle) {
            handle.unsubscribe();
          }
        };
      });
    }) : false;
    var httpLink = new _apolloLinkHttp.HttpLink({
      uri: uri || '/graphql',
      fetch: fetch,
      fetchOptions: fetchOptions || {},
      credentials: credentials || 'same-origin',
      headers: headers || {}
    });

    var link = _apolloLink.ApolloLink.from([errorLink, requestHandler, httpLink].filter(function (x) {
      return !!x;
    }));

    var activeResolvers = resolvers;
    var activeTypeDefs = typeDefs;
    var activeFragmentMatcher = fragmentMatcher;

    if (clientState) {
      if (clientState.defaults) {
        cache.writeData({
          data: clientState.defaults
        });
      }

      activeResolvers = clientState.resolvers;
      activeTypeDefs = clientState.typeDefs;
      activeFragmentMatcher = clientState.fragmentMatcher;
    }

    _this = _super.call(this, {
      cache: cache,
      link: link,
      name: name,
      version: version,
      resolvers: activeResolvers,
      typeDefs: activeTypeDefs,
      fragmentMatcher: activeFragmentMatcher
    }) || this;
    return _this;
  }

  return DefaultClient;
}(_apolloClient.default);

var _default = DefaultClient; 

exports.default = _default;

}).call(this)}).call(this,require('_process'))
},{"_process":4,"apollo-cache-inmemory":10,"apollo-client":13,"apollo-link":24,"apollo-link-error":17,"apollo-link-http":22,"graphql-tag":34,"ts-invariant":159,"tslib":9}],9:[function(require,module,exports){
(function (global){(function (){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __createBinding = function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
(function (process){(function (){
exports.__esModule = true;
exports.assertIdValue = assertIdValue;
exports.defaultDataIdFromObject = defaultDataIdFromObject;
exports.defaultNormalizedCacheFactory = defaultNormalizedCacheFactory$1;
exports.enhanceErrorWithDocument = enhanceErrorWithDocument;
exports.WriteError = exports.StoreWriter = exports.StoreReader = exports.ObjectCache = exports.IntrospectionFragmentMatcher = exports.InMemoryCache = exports.HeuristicFragmentMatcher = void 0;

var _tslib = require("tslib");

var _apolloCache = require("apollo-cache");

var _apolloUtilities = require("apollo-utilities");

var _optimism = require("optimism");

var _tsInvariant = require("ts-invariant");

var haveWarned = false;

function shouldWarn() {
  var answer = !haveWarned;

  if (!(0, _apolloUtilities.isTest)()) {
    haveWarned = true;
  }

  return answer;
}

var HeuristicFragmentMatcher = function () {
  function HeuristicFragmentMatcher() {}

  HeuristicFragmentMatcher.prototype.ensureReady = function () {
    return Promise.resolve();
  };

  HeuristicFragmentMatcher.prototype.canBypassInit = function () {
    return true;
  };

  HeuristicFragmentMatcher.prototype.match = function (idValue, typeCondition, context) {
    var obj = context.store.get(idValue.id);
    var isRootQuery = idValue.id === 'ROOT_QUERY';

    if (!obj) {
      return isRootQuery;
    }

    var _a = obj.__typename,
        __typename = _a === void 0 ? isRootQuery && 'Query' : _a;

    if (!__typename) {
      if (shouldWarn()) {
        process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn("You're using fragments in your queries, but either don't have the addTypename:\n  true option set in Apollo Client, or you are trying to write a fragment to the store without the __typename.\n   Please turn on the addTypename option and include __typename when writing fragments so that Apollo Client\n   can accurately match fragments.");
        process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn('Could not find __typename on Fragment ', typeCondition, obj);
        process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn("DEPRECATION WARNING: using fragments without __typename is unsupported behavior " + "and will be removed in future versions of Apollo client. You should fix this and set addTypename to true now.");
      }

      return 'heuristic';
    }

    if (__typename === typeCondition) {
      return true;
    }

    if (shouldWarn()) {
      process.env.NODE_ENV === "production" || _tsInvariant.invariant.error('You are using the simple (heuristic) fragment matcher, but your ' + 'queries contain union or interface types. Apollo Client will not be ' + 'able to accurately map fragments. To make this error go away, use ' + 'the `IntrospectionFragmentMatcher` as described in the docs: ' + 'https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher');
    }

    return 'heuristic';
  };

  return HeuristicFragmentMatcher;
}();

exports.HeuristicFragmentMatcher = HeuristicFragmentMatcher;

var IntrospectionFragmentMatcher = function () {
  function IntrospectionFragmentMatcher(options) {
    if (options && options.introspectionQueryResultData) {
      this.possibleTypesMap = this.parseIntrospectionResult(options.introspectionQueryResultData);
      this.isReady = true;
    } else {
      this.isReady = false;
    }

    this.match = this.match.bind(this);
  }

  IntrospectionFragmentMatcher.prototype.match = function (idValue, typeCondition, context) {
    process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(this.isReady, 1) : (0, _tsInvariant.invariant)(this.isReady, 'FragmentMatcher.match() was called before FragmentMatcher.init()');
    var obj = context.store.get(idValue.id);
    var isRootQuery = idValue.id === 'ROOT_QUERY';

    if (!obj) {
      return isRootQuery;
    }

    var _a = obj.__typename,
        __typename = _a === void 0 ? isRootQuery && 'Query' : _a;

    process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(__typename, 2) : (0, _tsInvariant.invariant)(__typename, "Cannot match fragment because __typename property is missing: " + JSON.stringify(obj));

    if (__typename === typeCondition) {
      return true;
    }

    var implementingTypes = this.possibleTypesMap[typeCondition];

    if (__typename && implementingTypes && implementingTypes.indexOf(__typename) > -1) {
      return true;
    }

    return false;
  };

  IntrospectionFragmentMatcher.prototype.parseIntrospectionResult = function (introspectionResultData) {
    var typeMap = {};

    introspectionResultData.__schema.types.forEach(function (type) {
      if (type.kind === 'UNION' || type.kind === 'INTERFACE') {
        typeMap[type.name] = type.possibleTypes.map(function (implementingType) {
          return implementingType.name;
        });
      }
    });

    return typeMap;
  };

  return IntrospectionFragmentMatcher;
}();

exports.IntrospectionFragmentMatcher = IntrospectionFragmentMatcher;
var hasOwn = Object.prototype.hasOwnProperty;

var DepTrackingCache = function () {
  function DepTrackingCache(data) {
    var _this = this;

    if (data === void 0) {
      data = Object.create(null);
    }

    this.data = data;
    this.depend = (0, _optimism.wrap)(function (dataId) {
      return _this.data[dataId];
    }, {
      disposable: true,
      makeCacheKey: function (dataId) {
        return dataId;
      }
    });
  }

  DepTrackingCache.prototype.toObject = function () {
    return this.data;
  };

  DepTrackingCache.prototype.get = function (dataId) {
    this.depend(dataId);
    return this.data[dataId];
  };

  DepTrackingCache.prototype.set = function (dataId, value) {
    var oldValue = this.data[dataId];

    if (value !== oldValue) {
      this.data[dataId] = value;
      this.depend.dirty(dataId);
    }
  };

  DepTrackingCache.prototype.delete = function (dataId) {
    if (hasOwn.call(this.data, dataId)) {
      delete this.data[dataId];
      this.depend.dirty(dataId);
    }
  };

  DepTrackingCache.prototype.clear = function () {
    this.replace(null);
  };

  DepTrackingCache.prototype.replace = function (newData) {
    var _this = this;

    if (newData) {
      Object.keys(newData).forEach(function (dataId) {
        _this.set(dataId, newData[dataId]);
      });
      Object.keys(this.data).forEach(function (dataId) {
        if (!hasOwn.call(newData, dataId)) {
          _this.delete(dataId);
        }
      });
    } else {
      Object.keys(this.data).forEach(function (dataId) {
        _this.delete(dataId);
      });
    }
  };

  return DepTrackingCache;
}();

function defaultNormalizedCacheFactory(seed) {
  return new DepTrackingCache(seed);
}

var StoreReader = function () {
  function StoreReader(_a) {
    var _this = this;

    var _b = _a === void 0 ? {} : _a,
        _c = _b.cacheKeyRoot,
        cacheKeyRoot = _c === void 0 ? new _optimism.KeyTrie(_apolloUtilities.canUseWeakMap) : _c,
        _d = _b.freezeResults,
        freezeResults = _d === void 0 ? false : _d;

    var _e = this,
        executeStoreQuery = _e.executeStoreQuery,
        executeSelectionSet = _e.executeSelectionSet,
        executeSubSelectedArray = _e.executeSubSelectedArray;

    this.freezeResults = freezeResults;
    this.executeStoreQuery = (0, _optimism.wrap)(function (options) {
      return executeStoreQuery.call(_this, options);
    }, {
      makeCacheKey: function (_a) {
        var query = _a.query,
            rootValue = _a.rootValue,
            contextValue = _a.contextValue,
            variableValues = _a.variableValues,
            fragmentMatcher = _a.fragmentMatcher;

        if (contextValue.store instanceof DepTrackingCache) {
          return cacheKeyRoot.lookup(contextValue.store, query, fragmentMatcher, JSON.stringify(variableValues), rootValue.id);
        }
      }
    });
    this.executeSelectionSet = (0, _optimism.wrap)(function (options) {
      return executeSelectionSet.call(_this, options);
    }, {
      makeCacheKey: function (_a) {
        var selectionSet = _a.selectionSet,
            rootValue = _a.rootValue,
            execContext = _a.execContext;

        if (execContext.contextValue.store instanceof DepTrackingCache) {
          return cacheKeyRoot.lookup(execContext.contextValue.store, selectionSet, execContext.fragmentMatcher, JSON.stringify(execContext.variableValues), rootValue.id);
        }
      }
    });
    this.executeSubSelectedArray = (0, _optimism.wrap)(function (options) {
      return executeSubSelectedArray.call(_this, options);
    }, {
      makeCacheKey: function (_a) {
        var field = _a.field,
            array = _a.array,
            execContext = _a.execContext;

        if (execContext.contextValue.store instanceof DepTrackingCache) {
          return cacheKeyRoot.lookup(execContext.contextValue.store, field, array, JSON.stringify(execContext.variableValues));
        }
      }
    });
  }

  StoreReader.prototype.readQueryFromStore = function (options) {
    return this.diffQueryAgainstStore((0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
      returnPartialData: false
    })).result;
  };

  StoreReader.prototype.diffQueryAgainstStore = function (_a) {
    var store = _a.store,
        query = _a.query,
        variables = _a.variables,
        previousResult = _a.previousResult,
        _b = _a.returnPartialData,
        returnPartialData = _b === void 0 ? true : _b,
        _c = _a.rootId,
        rootId = _c === void 0 ? 'ROOT_QUERY' : _c,
        fragmentMatcherFunction = _a.fragmentMatcherFunction,
        config = _a.config;
    var queryDefinition = (0, _apolloUtilities.getQueryDefinition)(query);
    variables = (0, _apolloUtilities.assign)({}, (0, _apolloUtilities.getDefaultValues)(queryDefinition), variables);
    var context = {
      store: store,
      dataIdFromObject: config && config.dataIdFromObject,
      cacheRedirects: config && config.cacheRedirects || {}
    };
    var execResult = this.executeStoreQuery({
      query: query,
      rootValue: {
        type: 'id',
        id: rootId,
        generated: true,
        typename: 'Query'
      },
      contextValue: context,
      variableValues: variables,
      fragmentMatcher: fragmentMatcherFunction
    });
    var hasMissingFields = execResult.missing && execResult.missing.length > 0;

    if (hasMissingFields && !returnPartialData) {
      execResult.missing.forEach(function (info) {
        if (info.tolerable) return;
        throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(8) : new _tsInvariant.InvariantError("Can't find field " + info.fieldName + " on object " + JSON.stringify(info.object, null, 2) + ".");
      });
    }

    if (previousResult) {
      if ((0, _apolloUtilities.isEqual)(previousResult, execResult.result)) {
        execResult.result = previousResult;
      }
    }

    return {
      result: execResult.result,
      complete: !hasMissingFields
    };
  };

  StoreReader.prototype.executeStoreQuery = function (_a) {
    var query = _a.query,
        rootValue = _a.rootValue,
        contextValue = _a.contextValue,
        variableValues = _a.variableValues,
        _b = _a.fragmentMatcher,
        fragmentMatcher = _b === void 0 ? defaultFragmentMatcher : _b;
    var mainDefinition = (0, _apolloUtilities.getMainDefinition)(query);
    var fragments = (0, _apolloUtilities.getFragmentDefinitions)(query);
    var fragmentMap = (0, _apolloUtilities.createFragmentMap)(fragments);
    var execContext = {
      query: query,
      fragmentMap: fragmentMap,
      contextValue: contextValue,
      variableValues: variableValues,
      fragmentMatcher: fragmentMatcher
    };
    return this.executeSelectionSet({
      selectionSet: mainDefinition.selectionSet,
      rootValue: rootValue,
      execContext: execContext
    });
  };

  StoreReader.prototype.executeSelectionSet = function (_a) {
    var _this = this;

    var selectionSet = _a.selectionSet,
        rootValue = _a.rootValue,
        execContext = _a.execContext;
    var fragmentMap = execContext.fragmentMap,
        contextValue = execContext.contextValue,
        variables = execContext.variableValues;
    var finalResult = {
      result: null
    };
    var objectsToMerge = [];
    var object = contextValue.store.get(rootValue.id);
    var typename = object && object.__typename || rootValue.id === 'ROOT_QUERY' && 'Query' || void 0;

    function handleMissing(result) {
      var _a;

      if (result.missing) {
        finalResult.missing = finalResult.missing || [];

        (_a = finalResult.missing).push.apply(_a, result.missing);
      }

      return result.result;
    }

    selectionSet.selections.forEach(function (selection) {
      var _a;

      if (!(0, _apolloUtilities.shouldInclude)(selection, variables)) {
        return;
      }

      if ((0, _apolloUtilities.isField)(selection)) {
        var fieldResult = handleMissing(_this.executeField(object, typename, selection, execContext));

        if (typeof fieldResult !== 'undefined') {
          objectsToMerge.push((_a = {}, _a[(0, _apolloUtilities.resultKeyNameFromField)(selection)] = fieldResult, _a));
        }
      } else {
        var fragment = void 0;

        if ((0, _apolloUtilities.isInlineFragment)(selection)) {
          fragment = selection;
        } else {
          fragment = fragmentMap[selection.name.value];

          if (!fragment) {
            throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(9) : new _tsInvariant.InvariantError("No fragment named " + selection.name.value);
          }
        }

        var typeCondition = fragment.typeCondition && fragment.typeCondition.name.value;
        var match = !typeCondition || execContext.fragmentMatcher(rootValue, typeCondition, contextValue);

        if (match) {
          var fragmentExecResult = _this.executeSelectionSet({
            selectionSet: fragment.selectionSet,
            rootValue: rootValue,
            execContext: execContext
          });

          if (match === 'heuristic' && fragmentExecResult.missing) {
            fragmentExecResult = (0, _tslib.__assign)((0, _tslib.__assign)({}, fragmentExecResult), {
              missing: fragmentExecResult.missing.map(function (info) {
                return (0, _tslib.__assign)((0, _tslib.__assign)({}, info), {
                  tolerable: true
                });
              })
            });
          }

          objectsToMerge.push(handleMissing(fragmentExecResult));
        }
      }
    });
    finalResult.result = (0, _apolloUtilities.mergeDeepArray)(objectsToMerge);

    if (this.freezeResults && process.env.NODE_ENV !== 'production') {
      Object.freeze(finalResult.result);
    }

    return finalResult;
  };

  StoreReader.prototype.executeField = function (object, typename, field, execContext) {
    var variables = execContext.variableValues,
        contextValue = execContext.contextValue;
    var fieldName = field.name.value;
    var args = (0, _apolloUtilities.argumentsObjectFromField)(field, variables);
    var info = {
      resultKey: (0, _apolloUtilities.resultKeyNameFromField)(field),
      directives: (0, _apolloUtilities.getDirectiveInfoFromField)(field, variables)
    };
    var readStoreResult = readStoreResolver(object, typename, fieldName, args, contextValue, info);

    if (Array.isArray(readStoreResult.result)) {
      return this.combineExecResults(readStoreResult, this.executeSubSelectedArray({
        field: field,
        array: readStoreResult.result,
        execContext: execContext
      }));
    }

    if (!field.selectionSet) {
      assertSelectionSetForIdValue(field, readStoreResult.result);

      if (this.freezeResults && process.env.NODE_ENV !== 'production') {
        (0, _apolloUtilities.maybeDeepFreeze)(readStoreResult);
      }

      return readStoreResult;
    }

    if (readStoreResult.result == null) {
      return readStoreResult;
    }

    return this.combineExecResults(readStoreResult, this.executeSelectionSet({
      selectionSet: field.selectionSet,
      rootValue: readStoreResult.result,
      execContext: execContext
    }));
  };

  StoreReader.prototype.combineExecResults = function () {
    var execResults = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      execResults[_i] = arguments[_i];
    }

    var missing;
    execResults.forEach(function (execResult) {
      if (execResult.missing) {
        missing = missing || [];
        missing.push.apply(missing, execResult.missing);
      }
    });
    return {
      result: execResults.pop().result,
      missing: missing
    };
  };

  StoreReader.prototype.executeSubSelectedArray = function (_a) {
    var _this = this;

    var field = _a.field,
        array = _a.array,
        execContext = _a.execContext;
    var missing;

    function handleMissing(childResult) {
      if (childResult.missing) {
        missing = missing || [];
        missing.push.apply(missing, childResult.missing);
      }

      return childResult.result;
    }

    array = array.map(function (item) {
      if (item === null) {
        return null;
      }

      if (Array.isArray(item)) {
        return handleMissing(_this.executeSubSelectedArray({
          field: field,
          array: item,
          execContext: execContext
        }));
      }

      if (field.selectionSet) {
        return handleMissing(_this.executeSelectionSet({
          selectionSet: field.selectionSet,
          rootValue: item,
          execContext: execContext
        }));
      }

      assertSelectionSetForIdValue(field, item);
      return item;
    });

    if (this.freezeResults && process.env.NODE_ENV !== 'production') {
      Object.freeze(array);
    }

    return {
      result: array,
      missing: missing
    };
  };

  return StoreReader;
}();

exports.StoreReader = StoreReader;

function assertSelectionSetForIdValue(field, value) {
  if (!field.selectionSet && (0, _apolloUtilities.isIdValue)(value)) {
    throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(10) : new _tsInvariant.InvariantError("Missing selection set for object of type " + value.typename + " returned for query field " + field.name.value);
  }
}

function defaultFragmentMatcher() {
  return true;
}

function assertIdValue(idValue) {
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)((0, _apolloUtilities.isIdValue)(idValue), 11) : (0, _tsInvariant.invariant)((0, _apolloUtilities.isIdValue)(idValue), "Encountered a sub-selection on the query, but the store doesn't have an object reference. This should never happen during normal use unless you have custom code that is directly manipulating the store; please file an issue.");
}

function readStoreResolver(object, typename, fieldName, args, context, _a) {
  var resultKey = _a.resultKey,
      directives = _a.directives;
  var storeKeyName = fieldName;

  if (args || directives) {
    storeKeyName = (0, _apolloUtilities.getStoreKeyName)(storeKeyName, args, directives);
  }

  var fieldValue = void 0;

  if (object) {
    fieldValue = object[storeKeyName];

    if (typeof fieldValue === 'undefined' && context.cacheRedirects && typeof typename === 'string') {
      var type = context.cacheRedirects[typename];

      if (type) {
        var resolver = type[fieldName];

        if (resolver) {
          fieldValue = resolver(object, args, {
            getCacheKey: function (storeObj) {
              var id = context.dataIdFromObject(storeObj);
              return id && (0, _apolloUtilities.toIdValue)({
                id: id,
                typename: storeObj.__typename
              });
            }
          });
        }
      }
    }
  }

  if (typeof fieldValue === 'undefined') {
    return {
      result: fieldValue,
      missing: [{
        object: object,
        fieldName: storeKeyName,
        tolerable: false
      }]
    };
  }

  if ((0, _apolloUtilities.isJsonValue)(fieldValue)) {
    fieldValue = fieldValue.json;
  }

  return {
    result: fieldValue
  };
}

var ObjectCache = function () {
  function ObjectCache(data) {
    if (data === void 0) {
      data = Object.create(null);
    }

    this.data = data;
  }

  ObjectCache.prototype.toObject = function () {
    return this.data;
  };

  ObjectCache.prototype.get = function (dataId) {
    return this.data[dataId];
  };

  ObjectCache.prototype.set = function (dataId, value) {
    this.data[dataId] = value;
  };

  ObjectCache.prototype.delete = function (dataId) {
    this.data[dataId] = void 0;
  };

  ObjectCache.prototype.clear = function () {
    this.data = Object.create(null);
  };

  ObjectCache.prototype.replace = function (newData) {
    this.data = newData || Object.create(null);
  };

  return ObjectCache;
}();

exports.ObjectCache = ObjectCache;

function defaultNormalizedCacheFactory$1(seed) {
  return new ObjectCache(seed);
}

var WriteError = function (_super) {
  (0, _tslib.__extends)(WriteError, _super);

  function WriteError() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = 'WriteError';
    return _this;
  }

  return WriteError;
}(Error);

exports.WriteError = WriteError;

function enhanceErrorWithDocument(error, document) {
  var enhancedError = new WriteError("Error writing result to store for query:\n " + JSON.stringify(document));
  enhancedError.message += '\n' + error.message;
  enhancedError.stack = error.stack;
  return enhancedError;
}

var StoreWriter = function () {
  function StoreWriter() {}

  StoreWriter.prototype.writeQueryToStore = function (_a) {
    var query = _a.query,
        result = _a.result,
        _b = _a.store,
        store = _b === void 0 ? defaultNormalizedCacheFactory() : _b,
        variables = _a.variables,
        dataIdFromObject = _a.dataIdFromObject,
        fragmentMatcherFunction = _a.fragmentMatcherFunction;
    return this.writeResultToStore({
      dataId: 'ROOT_QUERY',
      result: result,
      document: query,
      store: store,
      variables: variables,
      dataIdFromObject: dataIdFromObject,
      fragmentMatcherFunction: fragmentMatcherFunction
    });
  };

  StoreWriter.prototype.writeResultToStore = function (_a) {
    var dataId = _a.dataId,
        result = _a.result,
        document = _a.document,
        _b = _a.store,
        store = _b === void 0 ? defaultNormalizedCacheFactory() : _b,
        variables = _a.variables,
        dataIdFromObject = _a.dataIdFromObject,
        fragmentMatcherFunction = _a.fragmentMatcherFunction;
    var operationDefinition = (0, _apolloUtilities.getOperationDefinition)(document);

    try {
      return this.writeSelectionSetToStore({
        result: result,
        dataId: dataId,
        selectionSet: operationDefinition.selectionSet,
        context: {
          store: store,
          processedData: {},
          variables: (0, _apolloUtilities.assign)({}, (0, _apolloUtilities.getDefaultValues)(operationDefinition), variables),
          dataIdFromObject: dataIdFromObject,
          fragmentMap: (0, _apolloUtilities.createFragmentMap)((0, _apolloUtilities.getFragmentDefinitions)(document)),
          fragmentMatcherFunction: fragmentMatcherFunction
        }
      });
    } catch (e) {
      throw enhanceErrorWithDocument(e, document);
    }
  };

  StoreWriter.prototype.writeSelectionSetToStore = function (_a) {
    var _this = this;

    var result = _a.result,
        dataId = _a.dataId,
        selectionSet = _a.selectionSet,
        context = _a.context;
    var variables = context.variables,
        store = context.store,
        fragmentMap = context.fragmentMap;
    selectionSet.selections.forEach(function (selection) {
      var _a;

      if (!(0, _apolloUtilities.shouldInclude)(selection, variables)) {
        return;
      }

      if ((0, _apolloUtilities.isField)(selection)) {
        var resultFieldKey = (0, _apolloUtilities.resultKeyNameFromField)(selection);
        var value = result[resultFieldKey];

        if (typeof value !== 'undefined') {
          _this.writeFieldToStore({
            dataId: dataId,
            value: value,
            field: selection,
            context: context
          });
        } else {
          var isDefered = false;
          var isClient = false;

          if (selection.directives && selection.directives.length) {
            isDefered = selection.directives.some(function (directive) {
              return directive.name && directive.name.value === 'defer';
            });
            isClient = selection.directives.some(function (directive) {
              return directive.name && directive.name.value === 'client';
            });
          }

          if (!isDefered && !isClient && context.fragmentMatcherFunction) {
            process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn("Missing field " + resultFieldKey + " in " + JSON.stringify(result, null, 2).substring(0, 100));
          }
        }
      } else {
        var fragment = void 0;

        if ((0, _apolloUtilities.isInlineFragment)(selection)) {
          fragment = selection;
        } else {
          fragment = (fragmentMap || {})[selection.name.value];
          process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(fragment, 3) : (0, _tsInvariant.invariant)(fragment, "No fragment named " + selection.name.value + ".");
        }

        var matches = true;

        if (context.fragmentMatcherFunction && fragment.typeCondition) {
          var id = dataId || 'self';
          var idValue = (0, _apolloUtilities.toIdValue)({
            id: id,
            typename: undefined
          });
          var fakeContext = {
            store: new ObjectCache((_a = {}, _a[id] = result, _a)),
            cacheRedirects: {}
          };
          var match = context.fragmentMatcherFunction(idValue, fragment.typeCondition.name.value, fakeContext);

          if (!(0, _apolloUtilities.isProduction)() && match === 'heuristic') {
            process.env.NODE_ENV === "production" || _tsInvariant.invariant.error('WARNING: heuristic fragment matching going on!');
          }

          matches = !!match;
        }

        if (matches) {
          _this.writeSelectionSetToStore({
            result: result,
            selectionSet: fragment.selectionSet,
            dataId: dataId,
            context: context
          });
        }
      }
    });
    return store;
  };

  StoreWriter.prototype.writeFieldToStore = function (_a) {
    var _b;

    var field = _a.field,
        value = _a.value,
        dataId = _a.dataId,
        context = _a.context;
    var variables = context.variables,
        dataIdFromObject = context.dataIdFromObject,
        store = context.store;
    var storeValue;
    var storeObject;
    var storeFieldName = (0, _apolloUtilities.storeKeyNameFromField)(field, variables);

    if (!field.selectionSet || value === null) {
      storeValue = value != null && typeof value === 'object' ? {
        type: 'json',
        json: value
      } : value;
    } else if (Array.isArray(value)) {
      var generatedId = dataId + "." + storeFieldName;
      storeValue = this.processArrayValue(value, generatedId, field.selectionSet, context);
    } else {
      var valueDataId = dataId + "." + storeFieldName;
      var generated = true;

      if (!isGeneratedId(valueDataId)) {
        valueDataId = '$' + valueDataId;
      }

      if (dataIdFromObject) {
        var semanticId = dataIdFromObject(value);
        process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(!semanticId || !isGeneratedId(semanticId), 4) : (0, _tsInvariant.invariant)(!semanticId || !isGeneratedId(semanticId), 'IDs returned by dataIdFromObject cannot begin with the "$" character.');

        if (semanticId || typeof semanticId === 'number' && semanticId === 0) {
          valueDataId = semanticId;
          generated = false;
        }
      }

      if (!isDataProcessed(valueDataId, field, context.processedData)) {
        this.writeSelectionSetToStore({
          dataId: valueDataId,
          result: value,
          selectionSet: field.selectionSet,
          context: context
        });
      }

      var typename = value.__typename;
      storeValue = (0, _apolloUtilities.toIdValue)({
        id: valueDataId,
        typename: typename
      }, generated);
      storeObject = store.get(dataId);
      var escapedId = storeObject && storeObject[storeFieldName];

      if (escapedId !== storeValue && (0, _apolloUtilities.isIdValue)(escapedId)) {
        var hadTypename = escapedId.typename !== undefined;
        var hasTypename = typename !== undefined;
        var typenameChanged = hadTypename && hasTypename && escapedId.typename !== typename;
        process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(!generated || escapedId.generated || typenameChanged, 5) : (0, _tsInvariant.invariant)(!generated || escapedId.generated || typenameChanged, "Store error: the application attempted to write an object with no provided id but the store already contains an id of " + escapedId.id + " for this object. The selectionSet that was trying to be written is:\n" + JSON.stringify(field));
        process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(!hadTypename || hasTypename, 6) : (0, _tsInvariant.invariant)(!hadTypename || hasTypename, "Store error: the application attempted to write an object with no provided typename but the store already contains an object with typename of " + escapedId.typename + " for the object of id " + escapedId.id + ". The selectionSet that was trying to be written is:\n" + JSON.stringify(field));

        if (escapedId.generated) {
          if (typenameChanged) {
            if (!generated) {
              store.delete(escapedId.id);
            }
          } else {
            mergeWithGenerated(escapedId.id, storeValue.id, store);
          }
        }
      }
    }

    storeObject = store.get(dataId);

    if (!storeObject || !(0, _apolloUtilities.isEqual)(storeValue, storeObject[storeFieldName])) {
      store.set(dataId, (0, _tslib.__assign)((0, _tslib.__assign)({}, storeObject), (_b = {}, _b[storeFieldName] = storeValue, _b)));
    }
  };

  StoreWriter.prototype.processArrayValue = function (value, generatedId, selectionSet, context) {
    var _this = this;

    return value.map(function (item, index) {
      if (item === null) {
        return null;
      }

      var itemDataId = generatedId + "." + index;

      if (Array.isArray(item)) {
        return _this.processArrayValue(item, itemDataId, selectionSet, context);
      }

      var generated = true;

      if (context.dataIdFromObject) {
        var semanticId = context.dataIdFromObject(item);

        if (semanticId) {
          itemDataId = semanticId;
          generated = false;
        }
      }

      if (!isDataProcessed(itemDataId, selectionSet, context.processedData)) {
        _this.writeSelectionSetToStore({
          dataId: itemDataId,
          result: item,
          selectionSet: selectionSet,
          context: context
        });
      }

      return (0, _apolloUtilities.toIdValue)({
        id: itemDataId,
        typename: item.__typename
      }, generated);
    });
  };

  return StoreWriter;
}();

exports.StoreWriter = StoreWriter;

function isGeneratedId(id) {
  return id[0] === '$';
}

function mergeWithGenerated(generatedKey, realKey, cache) {
  if (generatedKey === realKey) {
    return false;
  }

  var generated = cache.get(generatedKey);
  var real = cache.get(realKey);
  var madeChanges = false;
  Object.keys(generated).forEach(function (key) {
    var value = generated[key];
    var realValue = real[key];

    if ((0, _apolloUtilities.isIdValue)(value) && isGeneratedId(value.id) && (0, _apolloUtilities.isIdValue)(realValue) && !(0, _apolloUtilities.isEqual)(value, realValue) && mergeWithGenerated(value.id, realValue.id, cache)) {
      madeChanges = true;
    }
  });
  cache.delete(generatedKey);
  var newRealValue = (0, _tslib.__assign)((0, _tslib.__assign)({}, generated), real);

  if ((0, _apolloUtilities.isEqual)(newRealValue, real)) {
    return madeChanges;
  }

  cache.set(realKey, newRealValue);
  return true;
}

function isDataProcessed(dataId, field, processedData) {
  if (!processedData) {
    return false;
  }

  if (processedData[dataId]) {
    if (processedData[dataId].indexOf(field) >= 0) {
      return true;
    } else {
      processedData[dataId].push(field);
    }
  } else {
    processedData[dataId] = [field];
  }

  return false;
}

var defaultConfig = {
  fragmentMatcher: new HeuristicFragmentMatcher(),
  dataIdFromObject: defaultDataIdFromObject,
  addTypename: true,
  resultCaching: true,
  freezeResults: false
};

function defaultDataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return result.__typename + ":" + result.id;
    }

    if (result._id !== undefined) {
      return result.__typename + ":" + result._id;
    }
  }

  return null;
}

var hasOwn$1 = Object.prototype.hasOwnProperty;

var OptimisticCacheLayer = function (_super) {
  (0, _tslib.__extends)(OptimisticCacheLayer, _super);

  function OptimisticCacheLayer(optimisticId, parent, transaction) {
    var _this = _super.call(this, Object.create(null)) || this;

    _this.optimisticId = optimisticId;
    _this.parent = parent;
    _this.transaction = transaction;
    return _this;
  }

  OptimisticCacheLayer.prototype.toObject = function () {
    return (0, _tslib.__assign)((0, _tslib.__assign)({}, this.parent.toObject()), this.data);
  };

  OptimisticCacheLayer.prototype.get = function (dataId) {
    return hasOwn$1.call(this.data, dataId) ? this.data[dataId] : this.parent.get(dataId);
  };

  return OptimisticCacheLayer;
}(ObjectCache);

var InMemoryCache = function (_super) {
  (0, _tslib.__extends)(InMemoryCache, _super);

  function InMemoryCache(config) {
    if (config === void 0) {
      config = {};
    }

    var _this = _super.call(this) || this;

    _this.watches = new Set();
    _this.typenameDocumentCache = new Map();
    _this.cacheKeyRoot = new _optimism.KeyTrie(_apolloUtilities.canUseWeakMap);
    _this.silenceBroadcast = false;
    _this.config = (0, _tslib.__assign)((0, _tslib.__assign)({}, defaultConfig), config);

    if (_this.config.customResolvers) {
      process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn('customResolvers have been renamed to cacheRedirects. Please update your config as we will be deprecating customResolvers in the next major version.');
      _this.config.cacheRedirects = _this.config.customResolvers;
    }

    if (_this.config.cacheResolvers) {
      process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn('cacheResolvers have been renamed to cacheRedirects. Please update your config as we will be deprecating cacheResolvers in the next major version.');
      _this.config.cacheRedirects = _this.config.cacheResolvers;
    }

    _this.addTypename = !!_this.config.addTypename;
    _this.data = _this.config.resultCaching ? new DepTrackingCache() : new ObjectCache();
    _this.optimisticData = _this.data;
    _this.storeWriter = new StoreWriter();
    _this.storeReader = new StoreReader({
      cacheKeyRoot: _this.cacheKeyRoot,
      freezeResults: config.freezeResults
    });
    var cache = _this;
    var maybeBroadcastWatch = cache.maybeBroadcastWatch;
    _this.maybeBroadcastWatch = (0, _optimism.wrap)(function (c) {
      return maybeBroadcastWatch.call(_this, c);
    }, {
      makeCacheKey: function (c) {
        if (c.optimistic) {
          return;
        }

        if (c.previousResult) {
          return;
        }

        if (cache.data instanceof DepTrackingCache) {
          return cache.cacheKeyRoot.lookup(c.query, JSON.stringify(c.variables));
        }
      }
    });
    return _this;
  }

  InMemoryCache.prototype.restore = function (data) {
    if (data) this.data.replace(data);
    return this;
  };

  InMemoryCache.prototype.extract = function (optimistic) {
    if (optimistic === void 0) {
      optimistic = false;
    }

    return (optimistic ? this.optimisticData : this.data).toObject();
  };

  InMemoryCache.prototype.read = function (options) {
    if (typeof options.rootId === 'string' && typeof this.data.get(options.rootId) === 'undefined') {
      return null;
    }

    var fragmentMatcher = this.config.fragmentMatcher;
    var fragmentMatcherFunction = fragmentMatcher && fragmentMatcher.match;
    return this.storeReader.readQueryFromStore({
      store: options.optimistic ? this.optimisticData : this.data,
      query: this.transformDocument(options.query),
      variables: options.variables,
      rootId: options.rootId,
      fragmentMatcherFunction: fragmentMatcherFunction,
      previousResult: options.previousResult,
      config: this.config
    }) || null;
  };

  InMemoryCache.prototype.write = function (write) {
    var fragmentMatcher = this.config.fragmentMatcher;
    var fragmentMatcherFunction = fragmentMatcher && fragmentMatcher.match;
    this.storeWriter.writeResultToStore({
      dataId: write.dataId,
      result: write.result,
      variables: write.variables,
      document: this.transformDocument(write.query),
      store: this.data,
      dataIdFromObject: this.config.dataIdFromObject,
      fragmentMatcherFunction: fragmentMatcherFunction
    });
    this.broadcastWatches();
  };

  InMemoryCache.prototype.diff = function (query) {
    var fragmentMatcher = this.config.fragmentMatcher;
    var fragmentMatcherFunction = fragmentMatcher && fragmentMatcher.match;
    return this.storeReader.diffQueryAgainstStore({
      store: query.optimistic ? this.optimisticData : this.data,
      query: this.transformDocument(query.query),
      variables: query.variables,
      returnPartialData: query.returnPartialData,
      previousResult: query.previousResult,
      fragmentMatcherFunction: fragmentMatcherFunction,
      config: this.config
    });
  };

  InMemoryCache.prototype.watch = function (watch) {
    var _this = this;

    this.watches.add(watch);
    return function () {
      _this.watches.delete(watch);
    };
  };

  InMemoryCache.prototype.evict = function (query) {
    throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(7) : new _tsInvariant.InvariantError("eviction is not implemented on InMemory Cache");
  };

  InMemoryCache.prototype.reset = function () {
    this.data.clear();
    this.broadcastWatches();
    return Promise.resolve();
  };

  InMemoryCache.prototype.removeOptimistic = function (idToRemove) {
    var toReapply = [];
    var removedCount = 0;
    var layer = this.optimisticData;

    while (layer instanceof OptimisticCacheLayer) {
      if (layer.optimisticId === idToRemove) {
        ++removedCount;
      } else {
        toReapply.push(layer);
      }

      layer = layer.parent;
    }

    if (removedCount > 0) {
      this.optimisticData = layer;

      while (toReapply.length > 0) {
        var layer_1 = toReapply.pop();
        this.performTransaction(layer_1.transaction, layer_1.optimisticId);
      }

      this.broadcastWatches();
    }
  };

  InMemoryCache.prototype.performTransaction = function (transaction, optimisticId) {
    var _a = this,
        data = _a.data,
        silenceBroadcast = _a.silenceBroadcast;

    this.silenceBroadcast = true;

    if (typeof optimisticId === 'string') {
      this.data = this.optimisticData = new OptimisticCacheLayer(optimisticId, this.optimisticData, transaction);
    }

    try {
      transaction(this);
    } finally {
      this.silenceBroadcast = silenceBroadcast;
      this.data = data;
    }

    this.broadcastWatches();
  };

  InMemoryCache.prototype.recordOptimisticTransaction = function (transaction, id) {
    return this.performTransaction(transaction, id);
  };

  InMemoryCache.prototype.transformDocument = function (document) {
    if (this.addTypename) {
      var result = this.typenameDocumentCache.get(document);

      if (!result) {
        result = (0, _apolloUtilities.addTypenameToDocument)(document);
        this.typenameDocumentCache.set(document, result);
        this.typenameDocumentCache.set(result, result);
      }

      return result;
    }

    return document;
  };

  InMemoryCache.prototype.broadcastWatches = function () {
    var _this = this;

    if (!this.silenceBroadcast) {
      this.watches.forEach(function (c) {
        return _this.maybeBroadcastWatch(c);
      });
    }
  };

  InMemoryCache.prototype.maybeBroadcastWatch = function (c) {
    c.callback(this.diff({
      query: c.query,
      variables: c.variables,
      previousResult: c.previousResult && c.previousResult(),
      optimistic: c.optimistic
    }));
  };

  return InMemoryCache;
}(_apolloCache.ApolloCache); 


exports.InMemoryCache = InMemoryCache;

}).call(this)}).call(this,require('_process'))
},{"_process":4,"apollo-cache":12,"apollo-utilities":28,"optimism":156,"ts-invariant":159,"tslib":11}],11:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],12:[function(require,module,exports){
exports.__esModule = true;
exports.Cache = exports.ApolloCache = void 0;

var _apolloUtilities = require("apollo-utilities");

function queryFromPojo(obj) {
  var op = {
    kind: 'OperationDefinition',
    operation: 'query',
    name: {
      kind: 'Name',
      value: 'GeneratedClientQuery'
    },
    selectionSet: selectionSetFromObj(obj)
  };
  var out = {
    kind: 'Document',
    definitions: [op]
  };
  return out;
}

function fragmentFromPojo(obj, typename) {
  var frag = {
    kind: 'FragmentDefinition',
    typeCondition: {
      kind: 'NamedType',
      name: {
        kind: 'Name',
        value: typename || '__FakeType'
      }
    },
    name: {
      kind: 'Name',
      value: 'GeneratedClientQuery'
    },
    selectionSet: selectionSetFromObj(obj)
  };
  var out = {
    kind: 'Document',
    definitions: [frag]
  };
  return out;
}

function selectionSetFromObj(obj) {
  if (typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'string' || typeof obj === 'undefined' || obj === null) {
    return null;
  }

  if (Array.isArray(obj)) {
    return selectionSetFromObj(obj[0]);
  }

  var selections = [];
  Object.keys(obj).forEach(function (key) {
    var nestedSelSet = selectionSetFromObj(obj[key]);
    var field = {
      kind: 'Field',
      name: {
        kind: 'Name',
        value: key
      },
      selectionSet: nestedSelSet || undefined
    };
    selections.push(field);
  });
  var selectionSet = {
    kind: 'SelectionSet',
    selections: selections
  };
  return selectionSet;
}

var justTypenameQuery = {
  kind: 'Document',
  definitions: [{
    kind: 'OperationDefinition',
    operation: 'query',
    name: null,
    variableDefinitions: null,
    directives: [],
    selectionSet: {
      kind: 'SelectionSet',
      selections: [{
        kind: 'Field',
        alias: null,
        name: {
          kind: 'Name',
          value: '__typename'
        },
        arguments: [],
        directives: [],
        selectionSet: null
      }]
    }
  }]
};

var ApolloCache = function () {
  function ApolloCache() {}

  ApolloCache.prototype.transformDocument = function (document) {
    return document;
  };

  ApolloCache.prototype.transformForLink = function (document) {
    return document;
  };

  ApolloCache.prototype.readQuery = function (options, optimistic) {
    if (optimistic === void 0) {
      optimistic = false;
    }

    return this.read({
      query: options.query,
      variables: options.variables,
      optimistic: optimistic
    });
  };

  ApolloCache.prototype.readFragment = function (options, optimistic) {
    if (optimistic === void 0) {
      optimistic = false;
    }

    return this.read({
      query: (0, _apolloUtilities.getFragmentQueryDocument)(options.fragment, options.fragmentName),
      variables: options.variables,
      rootId: options.id,
      optimistic: optimistic
    });
  };

  ApolloCache.prototype.writeQuery = function (options) {
    this.write({
      dataId: 'ROOT_QUERY',
      result: options.data,
      query: options.query,
      variables: options.variables
    });
  };

  ApolloCache.prototype.writeFragment = function (options) {
    this.write({
      dataId: options.id,
      result: options.data,
      variables: options.variables,
      query: (0, _apolloUtilities.getFragmentQueryDocument)(options.fragment, options.fragmentName)
    });
  };

  ApolloCache.prototype.writeData = function (_a) {
    var id = _a.id,
        data = _a.data;

    if (typeof id !== 'undefined') {
      var typenameResult = null;

      try {
        typenameResult = this.read({
          rootId: id,
          optimistic: false,
          query: justTypenameQuery
        });
      } catch (e) {}

      var __typename = typenameResult && typenameResult.__typename || '__ClientData';

      var dataToWrite = Object.assign({
        __typename: __typename
      }, data);
      this.writeFragment({
        id: id,
        fragment: fragmentFromPojo(dataToWrite, __typename),
        data: dataToWrite
      });
    } else {
      this.writeQuery({
        query: queryFromPojo(data),
        data: data
      });
    }
  };

  return ApolloCache;
}();

exports.ApolloCache = ApolloCache;
var Cache;
exports.Cache = Cache;

(function (Cache) {})(Cache || (exports.Cache = Cache = {}));

},{"apollo-utilities":28}],13:[function(require,module,exports){
(function (process){(function (){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "tslib", "apollo-utilities", "apollo-link", "symbol-observable", "ts-invariant", "graphql/language/visitor"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("tslib"), require("apollo-utilities"), require("apollo-link"), require("symbol-observable"), require("ts-invariant"), require("graphql/language/visitor"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.tslib, global.apolloUtilities, global.apolloLink, global.symbolObservable, global.tsInvariant, global.visitor);
    global.unknown = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _tslib, _apolloUtilities, _apolloLink, _symbolObservable, _tsInvariant, _visitor) {

  _exports.__esModule = true;
  _exports.isApolloError = isApolloError;
  _exports.ObservableQuery = _exports.NetworkStatus = _exports.FetchType = _exports.ApolloError = _exports.ApolloClient = _exports.default = void 0;
  _symbolObservable = _interopRequireDefault(_symbolObservable);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var NetworkStatus;
  _exports.NetworkStatus = NetworkStatus;

  (function (NetworkStatus) {
    NetworkStatus[NetworkStatus["loading"] = 1] = "loading";
    NetworkStatus[NetworkStatus["setVariables"] = 2] = "setVariables";
    NetworkStatus[NetworkStatus["fetchMore"] = 3] = "fetchMore";
    NetworkStatus[NetworkStatus["refetch"] = 4] = "refetch";
    NetworkStatus[NetworkStatus["poll"] = 6] = "poll";
    NetworkStatus[NetworkStatus["ready"] = 7] = "ready";
    NetworkStatus[NetworkStatus["error"] = 8] = "error";
  })(NetworkStatus || (_exports.NetworkStatus = NetworkStatus = {}));

  function isNetworkRequestInFlight(networkStatus) {
    return networkStatus < 7;
  }

  var Observable = function (_super) {
    (0, _tslib.__extends)(Observable, _super);

    function Observable() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Observable.prototype[_symbolObservable.default] = function () {
      return this;
    };

    Observable.prototype['@@observable'] = function () {
      return this;
    };

    return Observable;
  }(_apolloLink.Observable);

  function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
  }

  function isApolloError(err) {
    return err.hasOwnProperty('graphQLErrors');
  }

  var generateErrorMessage = function (err) {
    var message = '';

    if (isNonEmptyArray(err.graphQLErrors)) {
      err.graphQLErrors.forEach(function (graphQLError) {
        var errorMessage = graphQLError ? graphQLError.message : 'Error message not found.';
        message += "GraphQL error: " + errorMessage + "\n";
      });
    }

    if (err.networkError) {
      message += 'Network error: ' + err.networkError.message + '\n';
    }

    message = message.replace(/\n$/, '');
    return message;
  };

  var ApolloError = function (_super) {
    (0, _tslib.__extends)(ApolloError, _super);

    function ApolloError(_a) {
      var graphQLErrors = _a.graphQLErrors,
          networkError = _a.networkError,
          errorMessage = _a.errorMessage,
          extraInfo = _a.extraInfo;

      var _this = _super.call(this, errorMessage) || this;

      _this.graphQLErrors = graphQLErrors || [];
      _this.networkError = networkError || null;

      if (!errorMessage) {
        _this.message = generateErrorMessage(_this);
      } else {
        _this.message = errorMessage;
      }

      _this.extraInfo = extraInfo;
      _this.__proto__ = ApolloError.prototype;
      return _this;
    }

    return ApolloError;
  }(Error);

  _exports.ApolloError = ApolloError;
  var FetchType;
  _exports.FetchType = FetchType;

  (function (FetchType) {
    FetchType[FetchType["normal"] = 1] = "normal";
    FetchType[FetchType["refetch"] = 2] = "refetch";
    FetchType[FetchType["poll"] = 3] = "poll";
  })(FetchType || (_exports.FetchType = FetchType = {}));

  var hasError = function (storeValue, policy) {
    if (policy === void 0) {
      policy = 'none';
    }

    return storeValue && (storeValue.networkError || policy === 'none' && isNonEmptyArray(storeValue.graphQLErrors));
  };

  var ObservableQuery = function (_super) {
    (0, _tslib.__extends)(ObservableQuery, _super);

    function ObservableQuery(_a) {
      var queryManager = _a.queryManager,
          options = _a.options,
          _b = _a.shouldSubscribe,
          shouldSubscribe = _b === void 0 ? true : _b;

      var _this = _super.call(this, function (observer) {
        return _this.onSubscribe(observer);
      }) || this;

      _this.observers = new Set();
      _this.subscriptions = new Set();
      _this.isTornDown = false;
      _this.options = options;
      _this.variables = options.variables || {};
      _this.queryId = queryManager.generateQueryId();
      _this.shouldSubscribe = shouldSubscribe;
      var opDef = (0, _apolloUtilities.getOperationDefinition)(options.query);
      _this.queryName = opDef && opDef.name && opDef.name.value;
      _this.queryManager = queryManager;
      return _this;
    }

    ObservableQuery.prototype.result = function () {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var observer = {
          next: function (result) {
            resolve(result);

            _this.observers.delete(observer);

            if (!_this.observers.size) {
              _this.queryManager.removeQuery(_this.queryId);
            }

            setTimeout(function () {
              subscription.unsubscribe();
            }, 0);
          },
          error: reject
        };

        var subscription = _this.subscribe(observer);
      });
    };

    ObservableQuery.prototype.currentResult = function () {
      var result = this.getCurrentResult();

      if (result.data === undefined) {
        result.data = {};
      }

      return result;
    };

    ObservableQuery.prototype.getCurrentResult = function () {
      if (this.isTornDown) {
        var lastResult = this.lastResult;
        return {
          data: !this.lastError && lastResult && lastResult.data || void 0,
          error: this.lastError,
          loading: false,
          networkStatus: NetworkStatus.error
        };
      }

      var _a = this.queryManager.getCurrentQueryResult(this),
          data = _a.data,
          partial = _a.partial;

      var queryStoreValue = this.queryManager.queryStore.get(this.queryId);
      var result;
      var fetchPolicy = this.options.fetchPolicy;
      var isNetworkFetchPolicy = fetchPolicy === 'network-only' || fetchPolicy === 'no-cache';

      if (queryStoreValue) {
        var networkStatus = queryStoreValue.networkStatus;

        if (hasError(queryStoreValue, this.options.errorPolicy)) {
          return {
            data: void 0,
            loading: false,
            networkStatus: networkStatus,
            error: new ApolloError({
              graphQLErrors: queryStoreValue.graphQLErrors,
              networkError: queryStoreValue.networkError
            })
          };
        }

        if (queryStoreValue.variables) {
          this.options.variables = (0, _tslib.__assign)((0, _tslib.__assign)({}, this.options.variables), queryStoreValue.variables);
          this.variables = this.options.variables;
        }

        result = {
          data: data,
          loading: isNetworkRequestInFlight(networkStatus),
          networkStatus: networkStatus
        };

        if (queryStoreValue.graphQLErrors && this.options.errorPolicy === 'all') {
          result.errors = queryStoreValue.graphQLErrors;
        }
      } else {
        var loading = isNetworkFetchPolicy || partial && fetchPolicy !== 'cache-only';
        result = {
          data: data,
          loading: loading,
          networkStatus: loading ? NetworkStatus.loading : NetworkStatus.ready
        };
      }

      if (!partial) {
        this.updateLastResult((0, _tslib.__assign)((0, _tslib.__assign)({}, result), {
          stale: false
        }));
      }

      return (0, _tslib.__assign)((0, _tslib.__assign)({}, result), {
        partial: partial
      });
    };

    ObservableQuery.prototype.isDifferentFromLastResult = function (newResult) {
      var snapshot = this.lastResultSnapshot;
      return !(snapshot && newResult && snapshot.networkStatus === newResult.networkStatus && snapshot.stale === newResult.stale && (0, _apolloUtilities.isEqual)(snapshot.data, newResult.data));
    };

    ObservableQuery.prototype.getLastResult = function () {
      return this.lastResult;
    };

    ObservableQuery.prototype.getLastError = function () {
      return this.lastError;
    };

    ObservableQuery.prototype.resetLastResults = function () {
      delete this.lastResult;
      delete this.lastResultSnapshot;
      delete this.lastError;
      this.isTornDown = false;
    };

    ObservableQuery.prototype.resetQueryStoreErrors = function () {
      var queryStore = this.queryManager.queryStore.get(this.queryId);

      if (queryStore) {
        queryStore.networkError = null;
        queryStore.graphQLErrors = [];
      }
    };

    ObservableQuery.prototype.refetch = function (variables) {
      var fetchPolicy = this.options.fetchPolicy;

      if (fetchPolicy === 'cache-only') {
        return Promise.reject(process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(1) : new _tsInvariant.InvariantError('cache-only fetchPolicy option should not be used together with query refetch.'));
      }

      if (fetchPolicy !== 'no-cache' && fetchPolicy !== 'cache-and-network') {
        fetchPolicy = 'network-only';
      }

      if (!(0, _apolloUtilities.isEqual)(this.variables, variables)) {
        this.variables = (0, _tslib.__assign)((0, _tslib.__assign)({}, this.variables), variables);
      }

      if (!(0, _apolloUtilities.isEqual)(this.options.variables, this.variables)) {
        this.options.variables = (0, _tslib.__assign)((0, _tslib.__assign)({}, this.options.variables), this.variables);
      }

      return this.queryManager.fetchQuery(this.queryId, (0, _tslib.__assign)((0, _tslib.__assign)({}, this.options), {
        fetchPolicy: fetchPolicy
      }), FetchType.refetch);
    };

    ObservableQuery.prototype.fetchMore = function (fetchMoreOptions) {
      var _this = this;

      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(fetchMoreOptions.updateQuery, 2) : (0, _tsInvariant.invariant)(fetchMoreOptions.updateQuery, 'updateQuery option is required. This function defines how to update the query data with the new results.');
      var combinedOptions = (0, _tslib.__assign)((0, _tslib.__assign)({}, fetchMoreOptions.query ? fetchMoreOptions : (0, _tslib.__assign)((0, _tslib.__assign)((0, _tslib.__assign)({}, this.options), fetchMoreOptions), {
        variables: (0, _tslib.__assign)((0, _tslib.__assign)({}, this.variables), fetchMoreOptions.variables)
      })), {
        fetchPolicy: 'network-only'
      });
      var qid = this.queryManager.generateQueryId();
      return this.queryManager.fetchQuery(qid, combinedOptions, FetchType.normal, this.queryId).then(function (fetchMoreResult) {
        _this.updateQuery(function (previousResult) {
          return fetchMoreOptions.updateQuery(previousResult, {
            fetchMoreResult: fetchMoreResult.data,
            variables: combinedOptions.variables
          });
        });

        _this.queryManager.stopQuery(qid);

        return fetchMoreResult;
      }, function (error) {
        _this.queryManager.stopQuery(qid);

        throw error;
      });
    };

    ObservableQuery.prototype.subscribeToMore = function (options) {
      var _this = this;

      var subscription = this.queryManager.startGraphQLSubscription({
        query: options.document,
        variables: options.variables
      }).subscribe({
        next: function (subscriptionData) {
          var updateQuery = options.updateQuery;

          if (updateQuery) {
            _this.updateQuery(function (previous, _a) {
              var variables = _a.variables;
              return updateQuery(previous, {
                subscriptionData: subscriptionData,
                variables: variables
              });
            });
          }
        },
        error: function (err) {
          if (options.onError) {
            options.onError(err);
            return;
          }

          process.env.NODE_ENV === "production" || _tsInvariant.invariant.error('Unhandled GraphQL subscription error', err);
        }
      });
      this.subscriptions.add(subscription);
      return function () {
        if (_this.subscriptions.delete(subscription)) {
          subscription.unsubscribe();
        }
      };
    };

    ObservableQuery.prototype.setOptions = function (opts) {
      var oldFetchPolicy = this.options.fetchPolicy;
      this.options = (0, _tslib.__assign)((0, _tslib.__assign)({}, this.options), opts);

      if (opts.pollInterval) {
        this.startPolling(opts.pollInterval);
      } else if (opts.pollInterval === 0) {
        this.stopPolling();
      }

      var fetchPolicy = opts.fetchPolicy;
      return this.setVariables(this.options.variables, oldFetchPolicy !== fetchPolicy && (oldFetchPolicy === 'cache-only' || oldFetchPolicy === 'standby' || fetchPolicy === 'network-only'), opts.fetchResults);
    };

    ObservableQuery.prototype.setVariables = function (variables, tryFetch, fetchResults) {
      if (tryFetch === void 0) {
        tryFetch = false;
      }

      if (fetchResults === void 0) {
        fetchResults = true;
      }

      this.isTornDown = false;
      variables = variables || this.variables;

      if (!tryFetch && (0, _apolloUtilities.isEqual)(variables, this.variables)) {
        return this.observers.size && fetchResults ? this.result() : Promise.resolve();
      }

      this.variables = this.options.variables = variables;

      if (!this.observers.size) {
        return Promise.resolve();
      }

      return this.queryManager.fetchQuery(this.queryId, this.options);
    };

    ObservableQuery.prototype.updateQuery = function (mapFn) {
      var queryManager = this.queryManager;

      var _a = queryManager.getQueryWithPreviousResult(this.queryId),
          previousResult = _a.previousResult,
          variables = _a.variables,
          document = _a.document;

      var newResult = (0, _apolloUtilities.tryFunctionOrLogError)(function () {
        return mapFn(previousResult, {
          variables: variables
        });
      });

      if (newResult) {
        queryManager.dataStore.markUpdateQueryResult(document, variables, newResult);
        queryManager.broadcastQueries();
      }
    };

    ObservableQuery.prototype.stopPolling = function () {
      this.queryManager.stopPollingQuery(this.queryId);
      this.options.pollInterval = undefined;
    };

    ObservableQuery.prototype.startPolling = function (pollInterval) {
      assertNotCacheFirstOrOnly(this);
      this.options.pollInterval = pollInterval;
      this.queryManager.startPollingQuery(this.options, this.queryId);
    };

    ObservableQuery.prototype.updateLastResult = function (newResult) {
      var previousResult = this.lastResult;
      this.lastResult = newResult;
      this.lastResultSnapshot = this.queryManager.assumeImmutableResults ? newResult : (0, _apolloUtilities.cloneDeep)(newResult);
      return previousResult;
    };

    ObservableQuery.prototype.onSubscribe = function (observer) {
      var _this = this;

      try {
        var subObserver = observer._subscription._observer;

        if (subObserver && !subObserver.error) {
          subObserver.error = defaultSubscriptionObserverErrorCallback;
        }
      } catch (_a) {}

      var first = !this.observers.size;
      this.observers.add(observer);
      if (observer.next && this.lastResult) observer.next(this.lastResult);
      if (observer.error && this.lastError) observer.error(this.lastError);

      if (first) {
        this.setUpQuery();
      }

      return function () {
        if (_this.observers.delete(observer) && !_this.observers.size) {
          _this.tearDownQuery();
        }
      };
    };

    ObservableQuery.prototype.setUpQuery = function () {
      var _this = this;

      var _a = this,
          queryManager = _a.queryManager,
          queryId = _a.queryId;

      if (this.shouldSubscribe) {
        queryManager.addObservableQuery(queryId, this);
      }

      if (this.options.pollInterval) {
        assertNotCacheFirstOrOnly(this);
        queryManager.startPollingQuery(this.options, queryId);
      }

      var onError = function (error) {
        _this.updateLastResult((0, _tslib.__assign)((0, _tslib.__assign)({}, _this.lastResult), {
          errors: error.graphQLErrors,
          networkStatus: NetworkStatus.error,
          loading: false
        }));

        iterateObserversSafely(_this.observers, 'error', _this.lastError = error);
      };

      queryManager.observeQuery(queryId, this.options, {
        next: function (result) {
          if (_this.lastError || _this.isDifferentFromLastResult(result)) {
            var previousResult_1 = _this.updateLastResult(result);

            var _a = _this.options,
                query_1 = _a.query,
                variables = _a.variables,
                fetchPolicy_1 = _a.fetchPolicy;

            if (queryManager.transform(query_1).hasClientExports) {
              queryManager.getLocalState().addExportedVariables(query_1, variables).then(function (variables) {
                var previousVariables = _this.variables;
                _this.variables = _this.options.variables = variables;

                if (!result.loading && previousResult_1 && fetchPolicy_1 !== 'cache-only' && queryManager.transform(query_1).serverQuery && !(0, _apolloUtilities.isEqual)(previousVariables, variables)) {
                  _this.refetch();
                } else {
                  iterateObserversSafely(_this.observers, 'next', result);
                }
              });
            } else {
              iterateObserversSafely(_this.observers, 'next', result);
            }
          }
        },
        error: onError
      }).catch(onError);
    };

    ObservableQuery.prototype.tearDownQuery = function () {
      var queryManager = this.queryManager;
      this.isTornDown = true;
      queryManager.stopPollingQuery(this.queryId);
      this.subscriptions.forEach(function (sub) {
        return sub.unsubscribe();
      });
      this.subscriptions.clear();
      queryManager.removeObservableQuery(this.queryId);
      queryManager.stopQuery(this.queryId);
      this.observers.clear();
    };

    return ObservableQuery;
  }(Observable);

  _exports.ObservableQuery = ObservableQuery;

  function defaultSubscriptionObserverErrorCallback(error) {
    process.env.NODE_ENV === "production" || _tsInvariant.invariant.error('Unhandled error', error.message, error.stack);
  }

  function iterateObserversSafely(observers, method, argument) {
    var observersWithMethod = [];
    observers.forEach(function (obs) {
      return obs[method] && observersWithMethod.push(obs);
    });
    observersWithMethod.forEach(function (obs) {
      return obs[method](argument);
    });
  }

  function assertNotCacheFirstOrOnly(obsQuery) {
    var fetchPolicy = obsQuery.options.fetchPolicy;
    process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(fetchPolicy !== 'cache-first' && fetchPolicy !== 'cache-only', 3) : (0, _tsInvariant.invariant)(fetchPolicy !== 'cache-first' && fetchPolicy !== 'cache-only', 'Queries that specify the cache-first and cache-only fetchPolicies cannot also be polling queries.');
  }

  var MutationStore = function () {
    function MutationStore() {
      this.store = {};
    }

    MutationStore.prototype.getStore = function () {
      return this.store;
    };

    MutationStore.prototype.get = function (mutationId) {
      return this.store[mutationId];
    };

    MutationStore.prototype.initMutation = function (mutationId, mutation, variables) {
      this.store[mutationId] = {
        mutation: mutation,
        variables: variables || {},
        loading: true,
        error: null
      };
    };

    MutationStore.prototype.markMutationError = function (mutationId, error) {
      var mutation = this.store[mutationId];

      if (mutation) {
        mutation.loading = false;
        mutation.error = error;
      }
    };

    MutationStore.prototype.markMutationResult = function (mutationId) {
      var mutation = this.store[mutationId];

      if (mutation) {
        mutation.loading = false;
        mutation.error = null;
      }
    };

    MutationStore.prototype.reset = function () {
      this.store = {};
    };

    return MutationStore;
  }();

  var QueryStore = function () {
    function QueryStore() {
      this.store = {};
    }

    QueryStore.prototype.getStore = function () {
      return this.store;
    };

    QueryStore.prototype.get = function (queryId) {
      return this.store[queryId];
    };

    QueryStore.prototype.initQuery = function (query) {
      var previousQuery = this.store[query.queryId];
      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(!previousQuery || previousQuery.document === query.document || (0, _apolloUtilities.isEqual)(previousQuery.document, query.document), 19) : (0, _tsInvariant.invariant)(!previousQuery || previousQuery.document === query.document || (0, _apolloUtilities.isEqual)(previousQuery.document, query.document), 'Internal Error: may not update existing query string in store');
      var isSetVariables = false;
      var previousVariables = null;

      if (query.storePreviousVariables && previousQuery && previousQuery.networkStatus !== NetworkStatus.loading) {
        if (!(0, _apolloUtilities.isEqual)(previousQuery.variables, query.variables)) {
          isSetVariables = true;
          previousVariables = previousQuery.variables;
        }
      }

      var networkStatus;

      if (isSetVariables) {
        networkStatus = NetworkStatus.setVariables;
      } else if (query.isPoll) {
        networkStatus = NetworkStatus.poll;
      } else if (query.isRefetch) {
        networkStatus = NetworkStatus.refetch;
      } else {
        networkStatus = NetworkStatus.loading;
      }

      var graphQLErrors = [];

      if (previousQuery && previousQuery.graphQLErrors) {
        graphQLErrors = previousQuery.graphQLErrors;
      }

      this.store[query.queryId] = {
        document: query.document,
        variables: query.variables,
        previousVariables: previousVariables,
        networkError: null,
        graphQLErrors: graphQLErrors,
        networkStatus: networkStatus,
        metadata: query.metadata
      };

      if (typeof query.fetchMoreForQueryId === 'string' && this.store[query.fetchMoreForQueryId]) {
        this.store[query.fetchMoreForQueryId].networkStatus = NetworkStatus.fetchMore;
      }
    };

    QueryStore.prototype.markQueryResult = function (queryId, result, fetchMoreForQueryId) {
      if (!this.store || !this.store[queryId]) return;
      this.store[queryId].networkError = null;
      this.store[queryId].graphQLErrors = isNonEmptyArray(result.errors) ? result.errors : [];
      this.store[queryId].previousVariables = null;
      this.store[queryId].networkStatus = NetworkStatus.ready;

      if (typeof fetchMoreForQueryId === 'string' && this.store[fetchMoreForQueryId]) {
        this.store[fetchMoreForQueryId].networkStatus = NetworkStatus.ready;
      }
    };

    QueryStore.prototype.markQueryError = function (queryId, error, fetchMoreForQueryId) {
      if (!this.store || !this.store[queryId]) return;
      this.store[queryId].networkError = error;
      this.store[queryId].networkStatus = NetworkStatus.error;

      if (typeof fetchMoreForQueryId === 'string') {
        this.markQueryResultClient(fetchMoreForQueryId, true);
      }
    };

    QueryStore.prototype.markQueryResultClient = function (queryId, complete) {
      var storeValue = this.store && this.store[queryId];

      if (storeValue) {
        storeValue.networkError = null;
        storeValue.previousVariables = null;

        if (complete) {
          storeValue.networkStatus = NetworkStatus.ready;
        }
      }
    };

    QueryStore.prototype.stopQuery = function (queryId) {
      delete this.store[queryId];
    };

    QueryStore.prototype.reset = function (observableQueryIds) {
      var _this = this;

      Object.keys(this.store).forEach(function (queryId) {
        if (observableQueryIds.indexOf(queryId) < 0) {
          _this.stopQuery(queryId);
        } else {
          _this.store[queryId].networkStatus = NetworkStatus.loading;
        }
      });
    };

    return QueryStore;
  }();

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  var LocalState = function () {
    function LocalState(_a) {
      var cache = _a.cache,
          client = _a.client,
          resolvers = _a.resolvers,
          fragmentMatcher = _a.fragmentMatcher;
      this.cache = cache;

      if (client) {
        this.client = client;
      }

      if (resolvers) {
        this.addResolvers(resolvers);
      }

      if (fragmentMatcher) {
        this.setFragmentMatcher(fragmentMatcher);
      }
    }

    LocalState.prototype.addResolvers = function (resolvers) {
      var _this = this;

      this.resolvers = this.resolvers || {};

      if (Array.isArray(resolvers)) {
        resolvers.forEach(function (resolverGroup) {
          _this.resolvers = (0, _apolloUtilities.mergeDeep)(_this.resolvers, resolverGroup);
        });
      } else {
        this.resolvers = (0, _apolloUtilities.mergeDeep)(this.resolvers, resolvers);
      }
    };

    LocalState.prototype.setResolvers = function (resolvers) {
      this.resolvers = {};
      this.addResolvers(resolvers);
    };

    LocalState.prototype.getResolvers = function () {
      return this.resolvers || {};
    };

    LocalState.prototype.runResolvers = function (_a) {
      var document = _a.document,
          remoteResult = _a.remoteResult,
          context = _a.context,
          variables = _a.variables,
          _b = _a.onlyRunForcedResolvers,
          onlyRunForcedResolvers = _b === void 0 ? false : _b;
      return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
        return (0, _tslib.__generator)(this, function (_c) {
          if (document) {
            return [2, this.resolveDocument(document, remoteResult.data, context, variables, this.fragmentMatcher, onlyRunForcedResolvers).then(function (localResult) {
              return (0, _tslib.__assign)((0, _tslib.__assign)({}, remoteResult), {
                data: localResult.result
              });
            })];
          }

          return [2, remoteResult];
        });
      });
    };

    LocalState.prototype.setFragmentMatcher = function (fragmentMatcher) {
      this.fragmentMatcher = fragmentMatcher;
    };

    LocalState.prototype.getFragmentMatcher = function () {
      return this.fragmentMatcher;
    };

    LocalState.prototype.clientQuery = function (document) {
      if ((0, _apolloUtilities.hasDirectives)(['client'], document)) {
        if (this.resolvers) {
          return document;
        }

        process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn('Found @client directives in a query but no ApolloClient resolvers ' + 'were specified. This means ApolloClient local resolver handling ' + 'has been disabled, and @client directives will be passed through ' + 'to your link chain.');
      }

      return null;
    };

    LocalState.prototype.serverQuery = function (document) {
      return this.resolvers ? (0, _apolloUtilities.removeClientSetsFromDocument)(document) : document;
    };

    LocalState.prototype.prepareContext = function (context) {
      if (context === void 0) {
        context = {};
      }

      var cache = this.cache;
      var newContext = (0, _tslib.__assign)((0, _tslib.__assign)({}, context), {
        cache: cache,
        getCacheKey: function (obj) {
          if (cache.config) {
            return cache.config.dataIdFromObject(obj);
          } else {
            process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(false, 6) : (0, _tsInvariant.invariant)(false, 'To use context.getCacheKey, you need to use a cache that has ' + 'a configurable dataIdFromObject, like apollo-cache-inmemory.');
          }
        }
      });
      return newContext;
    };

    LocalState.prototype.addExportedVariables = function (document, variables, context) {
      if (variables === void 0) {
        variables = {};
      }

      if (context === void 0) {
        context = {};
      }

      return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
        return (0, _tslib.__generator)(this, function (_a) {
          if (document) {
            return [2, this.resolveDocument(document, this.buildRootValueFromCache(document, variables) || {}, this.prepareContext(context), variables).then(function (data) {
              return (0, _tslib.__assign)((0, _tslib.__assign)({}, variables), data.exportedVariables);
            })];
          }

          return [2, (0, _tslib.__assign)({}, variables)];
        });
      });
    };

    LocalState.prototype.shouldForceResolvers = function (document) {
      var forceResolvers = false;
      (0, _visitor.visit)(document, {
        Directive: {
          enter: function (node) {
            if (node.name.value === 'client' && node.arguments) {
              forceResolvers = node.arguments.some(function (arg) {
                return arg.name.value === 'always' && arg.value.kind === 'BooleanValue' && arg.value.value === true;
              });

              if (forceResolvers) {
                return _visitor.BREAK;
              }
            }
          }
        }
      });
      return forceResolvers;
    };

    LocalState.prototype.buildRootValueFromCache = function (document, variables) {
      return this.cache.diff({
        query: (0, _apolloUtilities.buildQueryFromSelectionSet)(document),
        variables: variables,
        returnPartialData: true,
        optimistic: false
      }).result;
    };

    LocalState.prototype.resolveDocument = function (document, rootValue, context, variables, fragmentMatcher, onlyRunForcedResolvers) {
      if (context === void 0) {
        context = {};
      }

      if (variables === void 0) {
        variables = {};
      }

      if (fragmentMatcher === void 0) {
        fragmentMatcher = function () {
          return true;
        };
      }

      if (onlyRunForcedResolvers === void 0) {
        onlyRunForcedResolvers = false;
      }

      return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
        var mainDefinition, fragments, fragmentMap, definitionOperation, defaultOperationType, _a, cache, client, execContext;

        return (0, _tslib.__generator)(this, function (_b) {
          mainDefinition = (0, _apolloUtilities.getMainDefinition)(document);
          fragments = (0, _apolloUtilities.getFragmentDefinitions)(document);
          fragmentMap = (0, _apolloUtilities.createFragmentMap)(fragments);
          definitionOperation = mainDefinition.operation;
          defaultOperationType = definitionOperation ? capitalizeFirstLetter(definitionOperation) : 'Query';
          _a = this, cache = _a.cache, client = _a.client;
          execContext = {
            fragmentMap: fragmentMap,
            context: (0, _tslib.__assign)((0, _tslib.__assign)({}, context), {
              cache: cache,
              client: client
            }),
            variables: variables,
            fragmentMatcher: fragmentMatcher,
            defaultOperationType: defaultOperationType,
            exportedVariables: {},
            onlyRunForcedResolvers: onlyRunForcedResolvers
          };
          return [2, this.resolveSelectionSet(mainDefinition.selectionSet, rootValue, execContext).then(function (result) {
            return {
              result: result,
              exportedVariables: execContext.exportedVariables
            };
          })];
        });
      });
    };

    LocalState.prototype.resolveSelectionSet = function (selectionSet, rootValue, execContext) {
      return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
        var fragmentMap, context, variables, resultsToMerge, execute;

        var _this = this;

        return (0, _tslib.__generator)(this, function (_a) {
          fragmentMap = execContext.fragmentMap, context = execContext.context, variables = execContext.variables;
          resultsToMerge = [rootValue];

          execute = function (selection) {
            return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
              var fragment, typeCondition;
              return (0, _tslib.__generator)(this, function (_a) {
                if (!(0, _apolloUtilities.shouldInclude)(selection, variables)) {
                  return [2];
                }

                if ((0, _apolloUtilities.isField)(selection)) {
                  return [2, this.resolveField(selection, rootValue, execContext).then(function (fieldResult) {
                    var _a;

                    if (typeof fieldResult !== 'undefined') {
                      resultsToMerge.push((_a = {}, _a[(0, _apolloUtilities.resultKeyNameFromField)(selection)] = fieldResult, _a));
                    }
                  })];
                }

                if ((0, _apolloUtilities.isInlineFragment)(selection)) {
                  fragment = selection;
                } else {
                  fragment = fragmentMap[selection.name.value];
                  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(fragment, 7) : (0, _tsInvariant.invariant)(fragment, "No fragment named " + selection.name.value);
                }

                if (fragment && fragment.typeCondition) {
                  typeCondition = fragment.typeCondition.name.value;

                  if (execContext.fragmentMatcher(rootValue, typeCondition, context)) {
                    return [2, this.resolveSelectionSet(fragment.selectionSet, rootValue, execContext).then(function (fragmentResult) {
                      resultsToMerge.push(fragmentResult);
                    })];
                  }
                }

                return [2];
              });
            });
          };

          return [2, Promise.all(selectionSet.selections.map(execute)).then(function () {
            return (0, _apolloUtilities.mergeDeepArray)(resultsToMerge);
          })];
        });
      });
    };

    LocalState.prototype.resolveField = function (field, rootValue, execContext) {
      return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
        var variables, fieldName, aliasedFieldName, aliasUsed, defaultResult, resultPromise, resolverType, resolverMap, resolve;

        var _this = this;

        return (0, _tslib.__generator)(this, function (_a) {
          variables = execContext.variables;
          fieldName = field.name.value;
          aliasedFieldName = (0, _apolloUtilities.resultKeyNameFromField)(field);
          aliasUsed = fieldName !== aliasedFieldName;
          defaultResult = rootValue[aliasedFieldName] || rootValue[fieldName];
          resultPromise = Promise.resolve(defaultResult);

          if (!execContext.onlyRunForcedResolvers || this.shouldForceResolvers(field)) {
            resolverType = rootValue.__typename || execContext.defaultOperationType;
            resolverMap = this.resolvers && this.resolvers[resolverType];

            if (resolverMap) {
              resolve = resolverMap[aliasUsed ? fieldName : aliasedFieldName];

              if (resolve) {
                resultPromise = Promise.resolve(resolve(rootValue, (0, _apolloUtilities.argumentsObjectFromField)(field, variables), execContext.context, {
                  field: field,
                  fragmentMap: execContext.fragmentMap
                }));
              }
            }
          }

          return [2, resultPromise.then(function (result) {
            if (result === void 0) {
              result = defaultResult;
            }

            if (field.directives) {
              field.directives.forEach(function (directive) {
                if (directive.name.value === 'export' && directive.arguments) {
                  directive.arguments.forEach(function (arg) {
                    if (arg.name.value === 'as' && arg.value.kind === 'StringValue') {
                      execContext.exportedVariables[arg.value.value] = result;
                    }
                  });
                }
              });
            }

            if (!field.selectionSet) {
              return result;
            }

            if (result == null) {
              return result;
            }

            if (Array.isArray(result)) {
              return _this.resolveSubSelectedArray(field, result, execContext);
            }

            if (field.selectionSet) {
              return _this.resolveSelectionSet(field.selectionSet, result, execContext);
            }
          })];
        });
      });
    };

    LocalState.prototype.resolveSubSelectedArray = function (field, result, execContext) {
      var _this = this;

      return Promise.all(result.map(function (item) {
        if (item === null) {
          return null;
        }

        if (Array.isArray(item)) {
          return _this.resolveSubSelectedArray(field, item, execContext);
        }

        if (field.selectionSet) {
          return _this.resolveSelectionSet(field.selectionSet, item, execContext);
        }
      }));
    };

    return LocalState;
  }();

  function multiplex(inner) {
    var observers = new Set();
    var sub = null;
    return new Observable(function (observer) {
      observers.add(observer);
      sub = sub || inner.subscribe({
        next: function (value) {
          observers.forEach(function (obs) {
            return obs.next && obs.next(value);
          });
        },
        error: function (error) {
          observers.forEach(function (obs) {
            return obs.error && obs.error(error);
          });
        },
        complete: function () {
          observers.forEach(function (obs) {
            return obs.complete && obs.complete();
          });
        }
      });
      return function () {
        if (observers.delete(observer) && !observers.size && sub) {
          sub.unsubscribe();
          sub = null;
        }
      };
    });
  }

  function asyncMap(observable, mapFn) {
    return new Observable(function (observer) {
      var next = observer.next,
          error = observer.error,
          complete = observer.complete;
      var activeNextCount = 0;
      var completed = false;
      var handler = {
        next: function (value) {
          ++activeNextCount;
          new Promise(function (resolve) {
            resolve(mapFn(value));
          }).then(function (result) {
            --activeNextCount;
            next && next.call(observer, result);
            completed && handler.complete();
          }, function (e) {
            --activeNextCount;
            error && error.call(observer, e);
          });
        },
        error: function (e) {
          error && error.call(observer, e);
        },
        complete: function () {
          completed = true;

          if (!activeNextCount) {
            complete && complete.call(observer);
          }
        }
      };
      var sub = observable.subscribe(handler);
      return function () {
        return sub.unsubscribe();
      };
    });
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var QueryManager = function () {
    function QueryManager(_a) {
      var link = _a.link,
          _b = _a.queryDeduplication,
          queryDeduplication = _b === void 0 ? false : _b,
          store = _a.store,
          _c = _a.onBroadcast,
          onBroadcast = _c === void 0 ? function () {
        return undefined;
      } : _c,
          _d = _a.ssrMode,
          ssrMode = _d === void 0 ? false : _d,
          _e = _a.clientAwareness,
          clientAwareness = _e === void 0 ? {} : _e,
          localState = _a.localState,
          assumeImmutableResults = _a.assumeImmutableResults;
      this.mutationStore = new MutationStore();
      this.queryStore = new QueryStore();
      this.clientAwareness = {};
      this.idCounter = 1;
      this.queries = new Map();
      this.fetchQueryRejectFns = new Map();
      this.transformCache = new (_apolloUtilities.canUseWeakMap ? WeakMap : Map)();
      this.inFlightLinkObservables = new Map();
      this.pollingInfoByQueryId = new Map();
      this.link = link;
      this.queryDeduplication = queryDeduplication;
      this.dataStore = store;
      this.onBroadcast = onBroadcast;
      this.clientAwareness = clientAwareness;
      this.localState = localState || new LocalState({
        cache: store.getCache()
      });
      this.ssrMode = ssrMode;
      this.assumeImmutableResults = !!assumeImmutableResults;
    }

    QueryManager.prototype.stop = function () {
      var _this = this;

      this.queries.forEach(function (_info, queryId) {
        _this.stopQueryNoBroadcast(queryId);
      });
      this.fetchQueryRejectFns.forEach(function (reject) {
        reject(process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(8) : new _tsInvariant.InvariantError('QueryManager stopped while query was in flight'));
      });
    };

    QueryManager.prototype.mutate = function (_a) {
      var mutation = _a.mutation,
          variables = _a.variables,
          optimisticResponse = _a.optimisticResponse,
          updateQueriesByName = _a.updateQueries,
          _b = _a.refetchQueries,
          refetchQueries = _b === void 0 ? [] : _b,
          _c = _a.awaitRefetchQueries,
          awaitRefetchQueries = _c === void 0 ? false : _c,
          updateWithProxyFn = _a.update,
          _d = _a.errorPolicy,
          errorPolicy = _d === void 0 ? 'none' : _d,
          fetchPolicy = _a.fetchPolicy,
          _e = _a.context,
          context = _e === void 0 ? {} : _e;
      return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
        var mutationId, generateUpdateQueriesInfo, self;

        var _this = this;

        return (0, _tslib.__generator)(this, function (_f) {
          switch (_f.label) {
            case 0:
              process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(mutation, 9) : (0, _tsInvariant.invariant)(mutation, 'mutation option is required. You must specify your GraphQL document in the mutation option.');
              process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(!fetchPolicy || fetchPolicy === 'no-cache', 10) : (0, _tsInvariant.invariant)(!fetchPolicy || fetchPolicy === 'no-cache', "Mutations only support a 'no-cache' fetchPolicy. If you don't want to disable the cache, remove your fetchPolicy setting to proceed with the default mutation behavior.");
              mutationId = this.generateQueryId();
              mutation = this.transform(mutation).document;
              this.setQuery(mutationId, function () {
                return {
                  document: mutation
                };
              });
              variables = this.getVariables(mutation, variables);
              if (!this.transform(mutation).hasClientExports) return [3, 2];
              return [4, this.localState.addExportedVariables(mutation, variables, context)];

            case 1:
              variables = _f.sent();
              _f.label = 2;

            case 2:
              generateUpdateQueriesInfo = function () {
                var ret = {};

                if (updateQueriesByName) {
                  _this.queries.forEach(function (_a, queryId) {
                    var observableQuery = _a.observableQuery;

                    if (observableQuery) {
                      var queryName = observableQuery.queryName;

                      if (queryName && hasOwnProperty.call(updateQueriesByName, queryName)) {
                        ret[queryId] = {
                          updater: updateQueriesByName[queryName],
                          query: _this.queryStore.get(queryId)
                        };
                      }
                    }
                  });
                }

                return ret;
              };

              this.mutationStore.initMutation(mutationId, mutation, variables);
              this.dataStore.markMutationInit({
                mutationId: mutationId,
                document: mutation,
                variables: variables,
                updateQueries: generateUpdateQueriesInfo(),
                update: updateWithProxyFn,
                optimisticResponse: optimisticResponse
              });
              this.broadcastQueries();
              self = this;
              return [2, new Promise(function (resolve, reject) {
                var storeResult;
                var error;
                self.getObservableFromLink(mutation, (0, _tslib.__assign)((0, _tslib.__assign)({}, context), {
                  optimisticResponse: optimisticResponse
                }), variables, false).subscribe({
                  next: function (result) {
                    if ((0, _apolloUtilities.graphQLResultHasError)(result) && errorPolicy === 'none') {
                      error = new ApolloError({
                        graphQLErrors: result.errors
                      });
                      return;
                    }

                    self.mutationStore.markMutationResult(mutationId);

                    if (fetchPolicy !== 'no-cache') {
                      self.dataStore.markMutationResult({
                        mutationId: mutationId,
                        result: result,
                        document: mutation,
                        variables: variables,
                        updateQueries: generateUpdateQueriesInfo(),
                        update: updateWithProxyFn
                      });
                    }

                    storeResult = result;
                  },
                  error: function (err) {
                    self.mutationStore.markMutationError(mutationId, err);
                    self.dataStore.markMutationComplete({
                      mutationId: mutationId,
                      optimisticResponse: optimisticResponse
                    });
                    self.broadcastQueries();
                    self.setQuery(mutationId, function () {
                      return {
                        document: null
                      };
                    });
                    reject(new ApolloError({
                      networkError: err
                    }));
                  },
                  complete: function () {
                    if (error) {
                      self.mutationStore.markMutationError(mutationId, error);
                    }

                    self.dataStore.markMutationComplete({
                      mutationId: mutationId,
                      optimisticResponse: optimisticResponse
                    });
                    self.broadcastQueries();

                    if (error) {
                      reject(error);
                      return;
                    }

                    if (typeof refetchQueries === 'function') {
                      refetchQueries = refetchQueries(storeResult);
                    }

                    var refetchQueryPromises = [];

                    if (isNonEmptyArray(refetchQueries)) {
                      refetchQueries.forEach(function (refetchQuery) {
                        if (typeof refetchQuery === 'string') {
                          self.queries.forEach(function (_a) {
                            var observableQuery = _a.observableQuery;

                            if (observableQuery && observableQuery.queryName === refetchQuery) {
                              refetchQueryPromises.push(observableQuery.refetch());
                            }
                          });
                        } else {
                          var queryOptions = {
                            query: refetchQuery.query,
                            variables: refetchQuery.variables,
                            fetchPolicy: 'network-only'
                          };

                          if (refetchQuery.context) {
                            queryOptions.context = refetchQuery.context;
                          }

                          refetchQueryPromises.push(self.query(queryOptions));
                        }
                      });
                    }

                    Promise.all(awaitRefetchQueries ? refetchQueryPromises : []).then(function () {
                      self.setQuery(mutationId, function () {
                        return {
                          document: null
                        };
                      });

                      if (errorPolicy === 'ignore' && storeResult && (0, _apolloUtilities.graphQLResultHasError)(storeResult)) {
                        delete storeResult.errors;
                      }

                      resolve(storeResult);
                    });
                  }
                });
              })];
          }
        });
      });
    };

    QueryManager.prototype.fetchQuery = function (queryId, options, fetchType, fetchMoreForQueryId) {
      return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
        var _a, metadata, _b, fetchPolicy, _c, context, query, variables, storeResult, isNetworkOnly, needToFetch, _d, complete, result, shouldFetch, requestId, cancel, networkResult;

        var _this = this;

        return (0, _tslib.__generator)(this, function (_e) {
          switch (_e.label) {
            case 0:
              _a = options.metadata, metadata = _a === void 0 ? null : _a, _b = options.fetchPolicy, fetchPolicy = _b === void 0 ? 'cache-first' : _b, _c = options.context, context = _c === void 0 ? {} : _c;
              query = this.transform(options.query).document;
              variables = this.getVariables(query, options.variables);
              if (!this.transform(query).hasClientExports) return [3, 2];
              return [4, this.localState.addExportedVariables(query, variables, context)];

            case 1:
              variables = _e.sent();
              _e.label = 2;

            case 2:
              options = (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
                variables: variables
              });
              isNetworkOnly = fetchPolicy === 'network-only' || fetchPolicy === 'no-cache';
              needToFetch = isNetworkOnly;

              if (!isNetworkOnly) {
                _d = this.dataStore.getCache().diff({
                  query: query,
                  variables: variables,
                  returnPartialData: true,
                  optimistic: false
                }), complete = _d.complete, result = _d.result;
                needToFetch = !complete || fetchPolicy === 'cache-and-network';
                storeResult = result;
              }

              shouldFetch = needToFetch && fetchPolicy !== 'cache-only' && fetchPolicy !== 'standby';
              if ((0, _apolloUtilities.hasDirectives)(['live'], query)) shouldFetch = true;
              requestId = this.idCounter++;
              cancel = fetchPolicy !== 'no-cache' ? this.updateQueryWatch(queryId, query, options) : undefined;
              this.setQuery(queryId, function () {
                return {
                  document: query,
                  lastRequestId: requestId,
                  invalidated: true,
                  cancel: cancel
                };
              });
              this.invalidate(fetchMoreForQueryId);
              this.queryStore.initQuery({
                queryId: queryId,
                document: query,
                storePreviousVariables: shouldFetch,
                variables: variables,
                isPoll: fetchType === FetchType.poll,
                isRefetch: fetchType === FetchType.refetch,
                metadata: metadata,
                fetchMoreForQueryId: fetchMoreForQueryId
              });
              this.broadcastQueries();

              if (shouldFetch) {
                networkResult = this.fetchRequest({
                  requestId: requestId,
                  queryId: queryId,
                  document: query,
                  options: options,
                  fetchMoreForQueryId: fetchMoreForQueryId
                }).catch(function (error) {
                  if (isApolloError(error)) {
                    throw error;
                  } else {
                    if (requestId >= _this.getQuery(queryId).lastRequestId) {
                      _this.queryStore.markQueryError(queryId, error, fetchMoreForQueryId);

                      _this.invalidate(queryId);

                      _this.invalidate(fetchMoreForQueryId);

                      _this.broadcastQueries();
                    }

                    throw new ApolloError({
                      networkError: error
                    });
                  }
                });

                if (fetchPolicy !== 'cache-and-network') {
                  return [2, networkResult];
                }

                networkResult.catch(function () {});
              }

              this.queryStore.markQueryResultClient(queryId, !shouldFetch);
              this.invalidate(queryId);
              this.invalidate(fetchMoreForQueryId);

              if (this.transform(query).hasForcedResolvers) {
                return [2, this.localState.runResolvers({
                  document: query,
                  remoteResult: {
                    data: storeResult
                  },
                  context: context,
                  variables: variables,
                  onlyRunForcedResolvers: true
                }).then(function (result) {
                  _this.markQueryResult(queryId, result, options, fetchMoreForQueryId);

                  _this.broadcastQueries();

                  return result;
                })];
              }

              this.broadcastQueries();
              return [2, {
                data: storeResult
              }];
          }
        });
      });
    };

    QueryManager.prototype.markQueryResult = function (queryId, result, _a, fetchMoreForQueryId) {
      var fetchPolicy = _a.fetchPolicy,
          variables = _a.variables,
          errorPolicy = _a.errorPolicy;

      if (fetchPolicy === 'no-cache') {
        this.setQuery(queryId, function () {
          return {
            newData: {
              result: result.data,
              complete: true
            }
          };
        });
      } else {
        this.dataStore.markQueryResult(result, this.getQuery(queryId).document, variables, fetchMoreForQueryId, errorPolicy === 'ignore' || errorPolicy === 'all');
      }
    };

    QueryManager.prototype.queryListenerForObserver = function (queryId, options, observer) {
      var _this = this;

      function invoke(method, argument) {
        if (observer[method]) {
          try {
            observer[method](argument);
          } catch (e) {
            process.env.NODE_ENV === "production" || _tsInvariant.invariant.error(e);
          }
        } else if (method === 'error') {
          process.env.NODE_ENV === "production" || _tsInvariant.invariant.error(argument);
        }
      }

      return function (queryStoreValue, newData) {
        _this.invalidate(queryId, false);

        if (!queryStoreValue) return;

        var _a = _this.getQuery(queryId),
            observableQuery = _a.observableQuery,
            document = _a.document;

        var fetchPolicy = observableQuery ? observableQuery.options.fetchPolicy : options.fetchPolicy;
        if (fetchPolicy === 'standby') return;
        var loading = isNetworkRequestInFlight(queryStoreValue.networkStatus);
        var lastResult = observableQuery && observableQuery.getLastResult();
        var networkStatusChanged = !!(lastResult && lastResult.networkStatus !== queryStoreValue.networkStatus);
        var shouldNotifyIfLoading = options.returnPartialData || !newData && queryStoreValue.previousVariables || networkStatusChanged && options.notifyOnNetworkStatusChange || fetchPolicy === 'cache-only' || fetchPolicy === 'cache-and-network';

        if (loading && !shouldNotifyIfLoading) {
          return;
        }

        var hasGraphQLErrors = isNonEmptyArray(queryStoreValue.graphQLErrors);
        var errorPolicy = observableQuery && observableQuery.options.errorPolicy || options.errorPolicy || 'none';

        if (errorPolicy === 'none' && hasGraphQLErrors || queryStoreValue.networkError) {
          return invoke('error', new ApolloError({
            graphQLErrors: queryStoreValue.graphQLErrors,
            networkError: queryStoreValue.networkError
          }));
        }

        try {
          var data = void 0;
          var isMissing = void 0;

          if (newData) {
            if (fetchPolicy !== 'no-cache' && fetchPolicy !== 'network-only') {
              _this.setQuery(queryId, function () {
                return {
                  newData: null
                };
              });
            }

            data = newData.result;
            isMissing = !newData.complete;
          } else {
            var lastError = observableQuery && observableQuery.getLastError();
            var errorStatusChanged = errorPolicy !== 'none' && (lastError && lastError.graphQLErrors) !== queryStoreValue.graphQLErrors;

            if (lastResult && lastResult.data && !errorStatusChanged) {
              data = lastResult.data;
              isMissing = false;
            } else {
              var diffResult = _this.dataStore.getCache().diff({
                query: document,
                variables: queryStoreValue.previousVariables || queryStoreValue.variables,
                returnPartialData: true,
                optimistic: true
              });

              data = diffResult.result;
              isMissing = !diffResult.complete;
            }
          }

          var stale = isMissing && !(options.returnPartialData || fetchPolicy === 'cache-only');
          var resultFromStore = {
            data: stale ? lastResult && lastResult.data : data,
            loading: loading,
            networkStatus: queryStoreValue.networkStatus,
            stale: stale
          };

          if (errorPolicy === 'all' && hasGraphQLErrors) {
            resultFromStore.errors = queryStoreValue.graphQLErrors;
          }

          invoke('next', resultFromStore);
        } catch (networkError) {
          invoke('error', new ApolloError({
            networkError: networkError
          }));
        }
      };
    };

    QueryManager.prototype.transform = function (document) {
      var transformCache = this.transformCache;

      if (!transformCache.has(document)) {
        var cache = this.dataStore.getCache();
        var transformed = cache.transformDocument(document);
        var forLink = (0, _apolloUtilities.removeConnectionDirectiveFromDocument)(cache.transformForLink(transformed));
        var clientQuery = this.localState.clientQuery(transformed);
        var serverQuery = this.localState.serverQuery(forLink);
        var cacheEntry_1 = {
          document: transformed,
          hasClientExports: (0, _apolloUtilities.hasClientExports)(transformed),
          hasForcedResolvers: this.localState.shouldForceResolvers(transformed),
          clientQuery: clientQuery,
          serverQuery: serverQuery,
          defaultVars: (0, _apolloUtilities.getDefaultValues)((0, _apolloUtilities.getOperationDefinition)(transformed))
        };

        var add = function (doc) {
          if (doc && !transformCache.has(doc)) {
            transformCache.set(doc, cacheEntry_1);
          }
        };

        add(document);
        add(transformed);
        add(clientQuery);
        add(serverQuery);
      }

      return transformCache.get(document);
    };

    QueryManager.prototype.getVariables = function (document, variables) {
      return (0, _tslib.__assign)((0, _tslib.__assign)({}, this.transform(document).defaultVars), variables);
    };

    QueryManager.prototype.watchQuery = function (options, shouldSubscribe) {
      if (shouldSubscribe === void 0) {
        shouldSubscribe = true;
      }

      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(options.fetchPolicy !== 'standby', 11) : (0, _tsInvariant.invariant)(options.fetchPolicy !== 'standby', 'client.watchQuery cannot be called with fetchPolicy set to "standby"');
      options.variables = this.getVariables(options.query, options.variables);

      if (typeof options.notifyOnNetworkStatusChange === 'undefined') {
        options.notifyOnNetworkStatusChange = false;
      }

      var transformedOptions = (0, _tslib.__assign)({}, options);
      return new ObservableQuery({
        queryManager: this,
        options: transformedOptions,
        shouldSubscribe: shouldSubscribe
      });
    };

    QueryManager.prototype.query = function (options) {
      var _this = this;

      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(options.query, 12) : (0, _tsInvariant.invariant)(options.query, 'query option is required. You must specify your GraphQL document ' + 'in the query option.');
      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(options.query.kind === 'Document', 13) : (0, _tsInvariant.invariant)(options.query.kind === 'Document', 'You must wrap the query string in a "gql" tag.');
      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(!options.returnPartialData, 14) : (0, _tsInvariant.invariant)(!options.returnPartialData, 'returnPartialData option only supported on watchQuery.');
      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(!options.pollInterval, 15) : (0, _tsInvariant.invariant)(!options.pollInterval, 'pollInterval option only supported on watchQuery.');
      return new Promise(function (resolve, reject) {
        var watchedQuery = _this.watchQuery(options, false);

        _this.fetchQueryRejectFns.set("query:" + watchedQuery.queryId, reject);

        watchedQuery.result().then(resolve, reject).then(function () {
          return _this.fetchQueryRejectFns.delete("query:" + watchedQuery.queryId);
        });
      });
    };

    QueryManager.prototype.generateQueryId = function () {
      return String(this.idCounter++);
    };

    QueryManager.prototype.stopQueryInStore = function (queryId) {
      this.stopQueryInStoreNoBroadcast(queryId);
      this.broadcastQueries();
    };

    QueryManager.prototype.stopQueryInStoreNoBroadcast = function (queryId) {
      this.stopPollingQuery(queryId);
      this.queryStore.stopQuery(queryId);
      this.invalidate(queryId);
    };

    QueryManager.prototype.addQueryListener = function (queryId, listener) {
      this.setQuery(queryId, function (_a) {
        var listeners = _a.listeners;
        listeners.add(listener);
        return {
          invalidated: false
        };
      });
    };

    QueryManager.prototype.updateQueryWatch = function (queryId, document, options) {
      var _this = this;

      var cancel = this.getQuery(queryId).cancel;
      if (cancel) cancel();

      var previousResult = function () {
        var previousResult = null;

        var observableQuery = _this.getQuery(queryId).observableQuery;

        if (observableQuery) {
          var lastResult = observableQuery.getLastResult();

          if (lastResult) {
            previousResult = lastResult.data;
          }
        }

        return previousResult;
      };

      return this.dataStore.getCache().watch({
        query: document,
        variables: options.variables,
        optimistic: true,
        previousResult: previousResult,
        callback: function (newData) {
          _this.setQuery(queryId, function () {
            return {
              invalidated: true,
              newData: newData
            };
          });
        }
      });
    };

    QueryManager.prototype.addObservableQuery = function (queryId, observableQuery) {
      this.setQuery(queryId, function () {
        return {
          observableQuery: observableQuery
        };
      });
    };

    QueryManager.prototype.removeObservableQuery = function (queryId) {
      var cancel = this.getQuery(queryId).cancel;
      this.setQuery(queryId, function () {
        return {
          observableQuery: null
        };
      });
      if (cancel) cancel();
    };

    QueryManager.prototype.clearStore = function () {
      this.fetchQueryRejectFns.forEach(function (reject) {
        reject(process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(16) : new _tsInvariant.InvariantError('Store reset while query was in flight (not completed in link chain)'));
      });
      var resetIds = [];
      this.queries.forEach(function (_a, queryId) {
        var observableQuery = _a.observableQuery;
        if (observableQuery) resetIds.push(queryId);
      });
      this.queryStore.reset(resetIds);
      this.mutationStore.reset();
      return this.dataStore.reset();
    };

    QueryManager.prototype.resetStore = function () {
      var _this = this;

      return this.clearStore().then(function () {
        return _this.reFetchObservableQueries();
      });
    };

    QueryManager.prototype.reFetchObservableQueries = function (includeStandby) {
      var _this = this;

      if (includeStandby === void 0) {
        includeStandby = false;
      }

      var observableQueryPromises = [];
      this.queries.forEach(function (_a, queryId) {
        var observableQuery = _a.observableQuery;

        if (observableQuery) {
          var fetchPolicy = observableQuery.options.fetchPolicy;
          observableQuery.resetLastResults();

          if (fetchPolicy !== 'cache-only' && (includeStandby || fetchPolicy !== 'standby')) {
            observableQueryPromises.push(observableQuery.refetch());
          }

          _this.setQuery(queryId, function () {
            return {
              newData: null
            };
          });

          _this.invalidate(queryId);
        }
      });
      this.broadcastQueries();
      return Promise.all(observableQueryPromises);
    };

    QueryManager.prototype.observeQuery = function (queryId, options, observer) {
      this.addQueryListener(queryId, this.queryListenerForObserver(queryId, options, observer));
      return this.fetchQuery(queryId, options);
    };

    QueryManager.prototype.startQuery = function (queryId, options, listener) {
      process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn("The QueryManager.startQuery method has been deprecated");
      this.addQueryListener(queryId, listener);
      this.fetchQuery(queryId, options).catch(function () {
        return undefined;
      });
      return queryId;
    };

    QueryManager.prototype.startGraphQLSubscription = function (_a) {
      var _this = this;

      var query = _a.query,
          fetchPolicy = _a.fetchPolicy,
          variables = _a.variables;
      query = this.transform(query).document;
      variables = this.getVariables(query, variables);

      var makeObservable = function (variables) {
        return _this.getObservableFromLink(query, {}, variables, false).map(function (result) {
          if (!fetchPolicy || fetchPolicy !== 'no-cache') {
            _this.dataStore.markSubscriptionResult(result, query, variables);

            _this.broadcastQueries();
          }

          if ((0, _apolloUtilities.graphQLResultHasError)(result)) {
            throw new ApolloError({
              graphQLErrors: result.errors
            });
          }

          return result;
        });
      };

      if (this.transform(query).hasClientExports) {
        var observablePromise_1 = this.localState.addExportedVariables(query, variables).then(makeObservable);
        return new Observable(function (observer) {
          var sub = null;
          observablePromise_1.then(function (observable) {
            return sub = observable.subscribe(observer);
          }, observer.error);
          return function () {
            return sub && sub.unsubscribe();
          };
        });
      }

      return makeObservable(variables);
    };

    QueryManager.prototype.stopQuery = function (queryId) {
      this.stopQueryNoBroadcast(queryId);
      this.broadcastQueries();
    };

    QueryManager.prototype.stopQueryNoBroadcast = function (queryId) {
      this.stopQueryInStoreNoBroadcast(queryId);
      this.removeQuery(queryId);
    };

    QueryManager.prototype.removeQuery = function (queryId) {
      this.fetchQueryRejectFns.delete("query:" + queryId);
      this.fetchQueryRejectFns.delete("fetchRequest:" + queryId);
      this.getQuery(queryId).subscriptions.forEach(function (x) {
        return x.unsubscribe();
      });
      this.queries.delete(queryId);
    };

    QueryManager.prototype.getCurrentQueryResult = function (observableQuery, optimistic) {
      if (optimistic === void 0) {
        optimistic = true;
      }

      var _a = observableQuery.options,
          variables = _a.variables,
          query = _a.query,
          fetchPolicy = _a.fetchPolicy,
          returnPartialData = _a.returnPartialData;
      var lastResult = observableQuery.getLastResult();
      var newData = this.getQuery(observableQuery.queryId).newData;

      if (newData && newData.complete) {
        return {
          data: newData.result,
          partial: false
        };
      }

      if (fetchPolicy === 'no-cache' || fetchPolicy === 'network-only') {
        return {
          data: undefined,
          partial: false
        };
      }

      var _b = this.dataStore.getCache().diff({
        query: query,
        variables: variables,
        previousResult: lastResult ? lastResult.data : undefined,
        returnPartialData: true,
        optimistic: optimistic
      }),
          result = _b.result,
          complete = _b.complete;

      return {
        data: complete || returnPartialData ? result : void 0,
        partial: !complete
      };
    };

    QueryManager.prototype.getQueryWithPreviousResult = function (queryIdOrObservable) {
      var observableQuery;

      if (typeof queryIdOrObservable === 'string') {
        var foundObserveableQuery = this.getQuery(queryIdOrObservable).observableQuery;
        process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(foundObserveableQuery, 17) : (0, _tsInvariant.invariant)(foundObserveableQuery, "ObservableQuery with this id doesn't exist: " + queryIdOrObservable);
        observableQuery = foundObserveableQuery;
      } else {
        observableQuery = queryIdOrObservable;
      }

      var _a = observableQuery.options,
          variables = _a.variables,
          query = _a.query;
      return {
        previousResult: this.getCurrentQueryResult(observableQuery, false).data,
        variables: variables,
        document: query
      };
    };

    QueryManager.prototype.broadcastQueries = function () {
      var _this = this;

      this.onBroadcast();
      this.queries.forEach(function (info, id) {
        if (info.invalidated) {
          info.listeners.forEach(function (listener) {
            if (listener) {
              listener(_this.queryStore.get(id), info.newData);
            }
          });
        }
      });
    };

    QueryManager.prototype.getLocalState = function () {
      return this.localState;
    };

    QueryManager.prototype.getObservableFromLink = function (query, context, variables, deduplication) {
      var _this = this;

      if (deduplication === void 0) {
        deduplication = this.queryDeduplication;
      }

      var observable;
      var serverQuery = this.transform(query).serverQuery;

      if (serverQuery) {
        var _a = this,
            inFlightLinkObservables_1 = _a.inFlightLinkObservables,
            link = _a.link;

        var operation = {
          query: serverQuery,
          variables: variables,
          operationName: (0, _apolloUtilities.getOperationName)(serverQuery) || void 0,
          context: this.prepareContext((0, _tslib.__assign)((0, _tslib.__assign)({}, context), {
            forceFetch: !deduplication
          }))
        };
        context = operation.context;

        if (deduplication) {
          var byVariables_1 = inFlightLinkObservables_1.get(serverQuery) || new Map();
          inFlightLinkObservables_1.set(serverQuery, byVariables_1);
          var varJson_1 = JSON.stringify(variables);
          observable = byVariables_1.get(varJson_1);

          if (!observable) {
            byVariables_1.set(varJson_1, observable = multiplex((0, _apolloLink.execute)(link, operation)));

            var cleanup = function () {
              byVariables_1.delete(varJson_1);
              if (!byVariables_1.size) inFlightLinkObservables_1.delete(serverQuery);
              cleanupSub_1.unsubscribe();
            };

            var cleanupSub_1 = observable.subscribe({
              next: cleanup,
              error: cleanup,
              complete: cleanup
            });
          }
        } else {
          observable = multiplex((0, _apolloLink.execute)(link, operation));
        }
      } else {
        observable = Observable.of({
          data: {}
        });
        context = this.prepareContext(context);
      }

      var clientQuery = this.transform(query).clientQuery;

      if (clientQuery) {
        observable = asyncMap(observable, function (result) {
          return _this.localState.runResolvers({
            document: clientQuery,
            remoteResult: result,
            context: context,
            variables: variables
          });
        });
      }

      return observable;
    };

    QueryManager.prototype.fetchRequest = function (_a) {
      var _this = this;

      var requestId = _a.requestId,
          queryId = _a.queryId,
          document = _a.document,
          options = _a.options,
          fetchMoreForQueryId = _a.fetchMoreForQueryId;
      var variables = options.variables,
          _b = options.errorPolicy,
          errorPolicy = _b === void 0 ? 'none' : _b,
          fetchPolicy = options.fetchPolicy;
      var resultFromStore;
      var errorsFromStore;
      return new Promise(function (resolve, reject) {
        var observable = _this.getObservableFromLink(document, options.context, variables);

        var fqrfId = "fetchRequest:" + queryId;

        _this.fetchQueryRejectFns.set(fqrfId, reject);

        var cleanup = function () {
          _this.fetchQueryRejectFns.delete(fqrfId);

          _this.setQuery(queryId, function (_a) {
            var subscriptions = _a.subscriptions;
            subscriptions.delete(subscription);
          });
        };

        var subscription = observable.map(function (result) {
          if (requestId >= _this.getQuery(queryId).lastRequestId) {
            _this.markQueryResult(queryId, result, options, fetchMoreForQueryId);

            _this.queryStore.markQueryResult(queryId, result, fetchMoreForQueryId);

            _this.invalidate(queryId);

            _this.invalidate(fetchMoreForQueryId);

            _this.broadcastQueries();
          }

          if (errorPolicy === 'none' && isNonEmptyArray(result.errors)) {
            return reject(new ApolloError({
              graphQLErrors: result.errors
            }));
          }

          if (errorPolicy === 'all') {
            errorsFromStore = result.errors;
          }

          if (fetchMoreForQueryId || fetchPolicy === 'no-cache') {
            resultFromStore = result.data;
          } else {
            var _a = _this.dataStore.getCache().diff({
              variables: variables,
              query: document,
              optimistic: false,
              returnPartialData: true
            }),
                result_1 = _a.result,
                complete = _a.complete;

            if (complete || options.returnPartialData) {
              resultFromStore = result_1;
            }
          }
        }).subscribe({
          error: function (error) {
            cleanup();
            reject(error);
          },
          complete: function () {
            cleanup();
            resolve({
              data: resultFromStore,
              errors: errorsFromStore,
              loading: false,
              networkStatus: NetworkStatus.ready,
              stale: false
            });
          }
        });

        _this.setQuery(queryId, function (_a) {
          var subscriptions = _a.subscriptions;
          subscriptions.add(subscription);
        });
      });
    };

    QueryManager.prototype.getQuery = function (queryId) {
      return this.queries.get(queryId) || {
        listeners: new Set(),
        invalidated: false,
        document: null,
        newData: null,
        lastRequestId: 1,
        observableQuery: null,
        subscriptions: new Set()
      };
    };

    QueryManager.prototype.setQuery = function (queryId, updater) {
      var prev = this.getQuery(queryId);
      var newInfo = (0, _tslib.__assign)((0, _tslib.__assign)({}, prev), updater(prev));
      this.queries.set(queryId, newInfo);
    };

    QueryManager.prototype.invalidate = function (queryId, invalidated) {
      if (invalidated === void 0) {
        invalidated = true;
      }

      if (queryId) {
        this.setQuery(queryId, function () {
          return {
            invalidated: invalidated
          };
        });
      }
    };

    QueryManager.prototype.prepareContext = function (context) {
      if (context === void 0) {
        context = {};
      }

      var newContext = this.localState.prepareContext(context);
      return (0, _tslib.__assign)((0, _tslib.__assign)({}, newContext), {
        clientAwareness: this.clientAwareness
      });
    };

    QueryManager.prototype.checkInFlight = function (queryId) {
      var query = this.queryStore.get(queryId);
      return query && query.networkStatus !== NetworkStatus.ready && query.networkStatus !== NetworkStatus.error;
    };

    QueryManager.prototype.startPollingQuery = function (options, queryId, listener) {
      var _this = this;

      var pollInterval = options.pollInterval;
      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(pollInterval, 18) : (0, _tsInvariant.invariant)(pollInterval, 'Attempted to start a polling query without a polling interval.');

      if (!this.ssrMode) {
        var info = this.pollingInfoByQueryId.get(queryId);

        if (!info) {
          this.pollingInfoByQueryId.set(queryId, info = {});
        }

        info.interval = pollInterval;
        info.options = (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
          fetchPolicy: 'network-only'
        });

        var maybeFetch_1 = function () {
          var info = _this.pollingInfoByQueryId.get(queryId);

          if (info) {
            if (_this.checkInFlight(queryId)) {
              poll_1();
            } else {
              _this.fetchQuery(queryId, info.options, FetchType.poll).then(poll_1, poll_1);
            }
          }
        };

        var poll_1 = function () {
          var info = _this.pollingInfoByQueryId.get(queryId);

          if (info) {
            clearTimeout(info.timeout);
            info.timeout = setTimeout(maybeFetch_1, info.interval);
          }
        };

        if (listener) {
          this.addQueryListener(queryId, listener);
        }

        poll_1();
      }

      return queryId;
    };

    QueryManager.prototype.stopPollingQuery = function (queryId) {
      this.pollingInfoByQueryId.delete(queryId);
    };

    return QueryManager;
  }();

  var DataStore = function () {
    function DataStore(initialCache) {
      this.cache = initialCache;
    }

    DataStore.prototype.getCache = function () {
      return this.cache;
    };

    DataStore.prototype.markQueryResult = function (result, document, variables, fetchMoreForQueryId, ignoreErrors) {
      if (ignoreErrors === void 0) {
        ignoreErrors = false;
      }

      var writeWithErrors = !(0, _apolloUtilities.graphQLResultHasError)(result);

      if (ignoreErrors && (0, _apolloUtilities.graphQLResultHasError)(result) && result.data) {
        writeWithErrors = true;
      }

      if (!fetchMoreForQueryId && writeWithErrors) {
        this.cache.write({
          result: result.data,
          dataId: 'ROOT_QUERY',
          query: document,
          variables: variables
        });
      }
    };

    DataStore.prototype.markSubscriptionResult = function (result, document, variables) {
      if (!(0, _apolloUtilities.graphQLResultHasError)(result)) {
        this.cache.write({
          result: result.data,
          dataId: 'ROOT_SUBSCRIPTION',
          query: document,
          variables: variables
        });
      }
    };

    DataStore.prototype.markMutationInit = function (mutation) {
      var _this = this;

      if (mutation.optimisticResponse) {
        var optimistic_1;

        if (typeof mutation.optimisticResponse === 'function') {
          optimistic_1 = mutation.optimisticResponse(mutation.variables);
        } else {
          optimistic_1 = mutation.optimisticResponse;
        }

        this.cache.recordOptimisticTransaction(function (c) {
          var orig = _this.cache;
          _this.cache = c;

          try {
            _this.markMutationResult({
              mutationId: mutation.mutationId,
              result: {
                data: optimistic_1
              },
              document: mutation.document,
              variables: mutation.variables,
              updateQueries: mutation.updateQueries,
              update: mutation.update
            });
          } finally {
            _this.cache = orig;
          }
        }, mutation.mutationId);
      }
    };

    DataStore.prototype.markMutationResult = function (mutation) {
      var _this = this;

      if (!(0, _apolloUtilities.graphQLResultHasError)(mutation.result)) {
        var cacheWrites_1 = [{
          result: mutation.result.data,
          dataId: 'ROOT_MUTATION',
          query: mutation.document,
          variables: mutation.variables
        }];
        var updateQueries_1 = mutation.updateQueries;

        if (updateQueries_1) {
          Object.keys(updateQueries_1).forEach(function (id) {
            var _a = updateQueries_1[id],
                query = _a.query,
                updater = _a.updater;

            var _b = _this.cache.diff({
              query: query.document,
              variables: query.variables,
              returnPartialData: true,
              optimistic: false
            }),
                currentQueryResult = _b.result,
                complete = _b.complete;

            if (complete) {
              var nextQueryResult = (0, _apolloUtilities.tryFunctionOrLogError)(function () {
                return updater(currentQueryResult, {
                  mutationResult: mutation.result,
                  queryName: (0, _apolloUtilities.getOperationName)(query.document) || undefined,
                  queryVariables: query.variables
                });
              });

              if (nextQueryResult) {
                cacheWrites_1.push({
                  result: nextQueryResult,
                  dataId: 'ROOT_QUERY',
                  query: query.document,
                  variables: query.variables
                });
              }
            }
          });
        }

        this.cache.performTransaction(function (c) {
          cacheWrites_1.forEach(function (write) {
            return c.write(write);
          });
          var update = mutation.update;

          if (update) {
            (0, _apolloUtilities.tryFunctionOrLogError)(function () {
              return update(c, mutation.result);
            });
          }
        });
      }
    };

    DataStore.prototype.markMutationComplete = function (_a) {
      var mutationId = _a.mutationId,
          optimisticResponse = _a.optimisticResponse;

      if (optimisticResponse) {
        this.cache.removeOptimistic(mutationId);
      }
    };

    DataStore.prototype.markUpdateQueryResult = function (document, variables, newResult) {
      this.cache.write({
        result: newResult,
        dataId: 'ROOT_QUERY',
        variables: variables,
        query: document
      });
    };

    DataStore.prototype.reset = function () {
      return this.cache.reset();
    };

    return DataStore;
  }();

  var version = "2.6.10";
  var hasSuggestedDevtools = false;

  var ApolloClient = function () {
    function ApolloClient(options) {
      var _this = this;

      this.defaultOptions = {};
      this.resetStoreCallbacks = [];
      this.clearStoreCallbacks = [];
      var cache = options.cache,
          _a = options.ssrMode,
          ssrMode = _a === void 0 ? false : _a,
          _b = options.ssrForceFetchDelay,
          ssrForceFetchDelay = _b === void 0 ? 0 : _b,
          connectToDevTools = options.connectToDevTools,
          _c = options.queryDeduplication,
          queryDeduplication = _c === void 0 ? true : _c,
          defaultOptions = options.defaultOptions,
          _d = options.assumeImmutableResults,
          assumeImmutableResults = _d === void 0 ? false : _d,
          resolvers = options.resolvers,
          typeDefs = options.typeDefs,
          fragmentMatcher = options.fragmentMatcher,
          clientAwarenessName = options.name,
          clientAwarenessVersion = options.version;
      var link = options.link;

      if (!link && resolvers) {
        link = _apolloLink.ApolloLink.empty();
      }

      if (!link || !cache) {
        throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(4) : new _tsInvariant.InvariantError("In order to initialize Apollo Client, you must specify 'link' and 'cache' properties in the options object.\n" + "These options are part of the upgrade requirements when migrating from Apollo Client 1.x to Apollo Client 2.x.\n" + "For more information, please visit: https://www.apollographql.com/docs/tutorial/client.html#apollo-client-setup");
      }

      this.link = link;
      this.cache = cache;
      this.store = new DataStore(cache);
      this.disableNetworkFetches = ssrMode || ssrForceFetchDelay > 0;
      this.queryDeduplication = queryDeduplication;
      this.defaultOptions = defaultOptions || {};
      this.typeDefs = typeDefs;

      if (ssrForceFetchDelay) {
        setTimeout(function () {
          return _this.disableNetworkFetches = false;
        }, ssrForceFetchDelay);
      }

      this.watchQuery = this.watchQuery.bind(this);
      this.query = this.query.bind(this);
      this.mutate = this.mutate.bind(this);
      this.resetStore = this.resetStore.bind(this);
      this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this);
      var defaultConnectToDevTools = process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && !window.__APOLLO_CLIENT__;

      if (typeof connectToDevTools === 'undefined' ? defaultConnectToDevTools : connectToDevTools && typeof window !== 'undefined') {
        window.__APOLLO_CLIENT__ = this;
      }

      if (!hasSuggestedDevtools && process.env.NODE_ENV !== 'production') {
        hasSuggestedDevtools = true;

        if (typeof window !== 'undefined' && window.document && window.top === window.self) {
          if (typeof window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
            if (window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('Chrome') > -1) {
              console.debug('Download the Apollo DevTools ' + 'for a better development experience: ' + 'https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm');
            }
          }
        }
      }

      this.version = version;
      this.localState = new LocalState({
        cache: cache,
        client: this,
        resolvers: resolvers,
        fragmentMatcher: fragmentMatcher
      });
      this.queryManager = new QueryManager({
        link: this.link,
        store: this.store,
        queryDeduplication: queryDeduplication,
        ssrMode: ssrMode,
        clientAwareness: {
          name: clientAwarenessName,
          version: clientAwarenessVersion
        },
        localState: this.localState,
        assumeImmutableResults: assumeImmutableResults,
        onBroadcast: function () {
          if (_this.devToolsHookCb) {
            _this.devToolsHookCb({
              action: {},
              state: {
                queries: _this.queryManager.queryStore.getStore(),
                mutations: _this.queryManager.mutationStore.getStore()
              },
              dataWithOptimisticResults: _this.cache.extract(true)
            });
          }
        }
      });
    }

    ApolloClient.prototype.stop = function () {
      this.queryManager.stop();
    };

    ApolloClient.prototype.watchQuery = function (options) {
      if (this.defaultOptions.watchQuery) {
        options = (0, _tslib.__assign)((0, _tslib.__assign)({}, this.defaultOptions.watchQuery), options);
      }

      if (this.disableNetworkFetches && (options.fetchPolicy === 'network-only' || options.fetchPolicy === 'cache-and-network')) {
        options = (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
          fetchPolicy: 'cache-first'
        });
      }

      return this.queryManager.watchQuery(options);
    };

    ApolloClient.prototype.query = function (options) {
      if (this.defaultOptions.query) {
        options = (0, _tslib.__assign)((0, _tslib.__assign)({}, this.defaultOptions.query), options);
      }

      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(options.fetchPolicy !== 'cache-and-network', 5) : (0, _tsInvariant.invariant)(options.fetchPolicy !== 'cache-and-network', 'The cache-and-network fetchPolicy does not work with client.query, because ' + 'client.query can only return a single result. Please use client.watchQuery ' + 'to receive multiple results from the cache and the network, or consider ' + 'using a different fetchPolicy, such as cache-first or network-only.');

      if (this.disableNetworkFetches && options.fetchPolicy === 'network-only') {
        options = (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
          fetchPolicy: 'cache-first'
        });
      }

      return this.queryManager.query(options);
    };

    ApolloClient.prototype.mutate = function (options) {
      if (this.defaultOptions.mutate) {
        options = (0, _tslib.__assign)((0, _tslib.__assign)({}, this.defaultOptions.mutate), options);
      }

      return this.queryManager.mutate(options);
    };

    ApolloClient.prototype.subscribe = function (options) {
      return this.queryManager.startGraphQLSubscription(options);
    };

    ApolloClient.prototype.readQuery = function (options, optimistic) {
      if (optimistic === void 0) {
        optimistic = false;
      }

      return this.cache.readQuery(options, optimistic);
    };

    ApolloClient.prototype.readFragment = function (options, optimistic) {
      if (optimistic === void 0) {
        optimistic = false;
      }

      return this.cache.readFragment(options, optimistic);
    };

    ApolloClient.prototype.writeQuery = function (options) {
      var result = this.cache.writeQuery(options);
      this.queryManager.broadcastQueries();
      return result;
    };

    ApolloClient.prototype.writeFragment = function (options) {
      var result = this.cache.writeFragment(options);
      this.queryManager.broadcastQueries();
      return result;
    };

    ApolloClient.prototype.writeData = function (options) {
      var result = this.cache.writeData(options);
      this.queryManager.broadcastQueries();
      return result;
    };

    ApolloClient.prototype.__actionHookForDevTools = function (cb) {
      this.devToolsHookCb = cb;
    };

    ApolloClient.prototype.__requestRaw = function (payload) {
      return (0, _apolloLink.execute)(this.link, payload);
    };

    ApolloClient.prototype.initQueryManager = function () {
      process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn('Calling the initQueryManager method is no longer necessary, ' + 'and it will be removed from ApolloClient in version 3.0.');
      return this.queryManager;
    };

    ApolloClient.prototype.resetStore = function () {
      var _this = this;

      return Promise.resolve().then(function () {
        return _this.queryManager.clearStore();
      }).then(function () {
        return Promise.all(_this.resetStoreCallbacks.map(function (fn) {
          return fn();
        }));
      }).then(function () {
        return _this.reFetchObservableQueries();
      });
    };

    ApolloClient.prototype.clearStore = function () {
      var _this = this;

      return Promise.resolve().then(function () {
        return _this.queryManager.clearStore();
      }).then(function () {
        return Promise.all(_this.clearStoreCallbacks.map(function (fn) {
          return fn();
        }));
      });
    };

    ApolloClient.prototype.onResetStore = function (cb) {
      var _this = this;

      this.resetStoreCallbacks.push(cb);
      return function () {
        _this.resetStoreCallbacks = _this.resetStoreCallbacks.filter(function (c) {
          return c !== cb;
        });
      };
    };

    ApolloClient.prototype.onClearStore = function (cb) {
      var _this = this;

      this.clearStoreCallbacks.push(cb);
      return function () {
        _this.clearStoreCallbacks = _this.clearStoreCallbacks.filter(function (c) {
          return c !== cb;
        });
      };
    };

    ApolloClient.prototype.reFetchObservableQueries = function (includeStandby) {
      return this.queryManager.reFetchObservableQueries(includeStandby);
    };

    ApolloClient.prototype.extract = function (optimistic) {
      return this.cache.extract(optimistic);
    };

    ApolloClient.prototype.restore = function (serializedState) {
      return this.cache.restore(serializedState);
    };

    ApolloClient.prototype.addResolvers = function (resolvers) {
      this.localState.addResolvers(resolvers);
    };

    ApolloClient.prototype.setResolvers = function (resolvers) {
      this.localState.setResolvers(resolvers);
    };

    ApolloClient.prototype.getResolvers = function () {
      return this.localState.getResolvers();
    };

    ApolloClient.prototype.setLocalStateFragmentMatcher = function (fragmentMatcher) {
      this.localState.setFragmentMatcher(fragmentMatcher);
    };

    return ApolloClient;
  }();

  _exports.ApolloClient = ApolloClient;
  var _default = ApolloClient; 

  _exports.default = _default;
});

}).call(this)}).call(this,require('_process'))
},{"_process":4,"apollo-link":24,"apollo-utilities":28,"graphql/language/visitor":84,"symbol-observable":157,"ts-invariant":159,"tslib":14}],14:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_link_1 = require("apollo-link");
function setContext(setter) {
    return new apollo_link_1.ApolloLink(function (operation, forward) {
        var request = tslib_1.__rest(operation, []);
        return new apollo_link_1.Observable(function (observer) {
            var handle;
            Promise.resolve(request)
                .then(function (req) { return setter(req, operation.getContext()); })
                .then(operation.setContext)
                .then(function () {
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
                .catch(observer.error.bind(observer));
            return function () {
                if (handle)
                    handle.unsubscribe();
            };
        });
    });
}
exports.setContext = setContext;

},{"apollo-link":24,"tslib":16}],16:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_link_1 = require("apollo-link");
function onError(errorHandler) {
    return new apollo_link_1.ApolloLink(function (operation, forward) {
        return new apollo_link_1.Observable(function (observer) {
            var sub;
            var retriedSub;
            var retriedResult;
            try {
                sub = forward(operation).subscribe({
                    next: function (result) {
                        if (result.errors) {
                            retriedResult = errorHandler({
                                graphQLErrors: result.errors,
                                response: result,
                                operation: operation,
                                forward: forward,
                            });
                            if (retriedResult) {
                                retriedSub = retriedResult.subscribe({
                                    next: observer.next.bind(observer),
                                    error: observer.error.bind(observer),
                                    complete: observer.complete.bind(observer),
                                });
                                return;
                            }
                        }
                        observer.next(result);
                    },
                    error: function (networkError) {
                        retriedResult = errorHandler({
                            operation: operation,
                            networkError: networkError,
                            graphQLErrors: networkError &&
                                networkError.result &&
                                networkError.result.errors,
                            forward: forward,
                        });
                        if (retriedResult) {
                            retriedSub = retriedResult.subscribe({
                                next: observer.next.bind(observer),
                                error: observer.error.bind(observer),
                                complete: observer.complete.bind(observer),
                            });
                            return;
                        }
                        observer.error(networkError);
                    },
                    complete: function () {
                        if (!retriedResult) {
                            observer.complete.bind(observer)();
                        }
                    },
                });
            }
            catch (e) {
                errorHandler({ networkError: e, operation: operation, forward: forward });
                observer.error(e);
            }
            return function () {
                if (sub)
                    sub.unsubscribe();
                if (retriedSub)
                    sub.unsubscribe();
            };
        });
    });
}
exports.onError = onError;
var ErrorLink = (function (_super) {
    tslib_1.__extends(ErrorLink, _super);
    function ErrorLink(errorHandler) {
        var _this = _super.call(this) || this;
        _this.link = onError(errorHandler);
        return _this;
    }
    ErrorLink.prototype.request = function (operation, forward) {
        return this.link.request(operation, forward);
    };
    return ErrorLink;
}(apollo_link_1.ApolloLink));
exports.ErrorLink = ErrorLink;

},{"apollo-link":24,"tslib":18}],18:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var printer_1 = require("graphql/language/printer");
var ts_invariant_1 = require("ts-invariant");
var defaultHttpOptions = {
    includeQuery: true,
    includeExtensions: false,
};
var defaultHeaders = {
    accept: '*/*',
    'content-type': 'application/json',
};
var defaultOptions = {
    method: 'POST',
};
exports.fallbackHttpConfig = {
    http: defaultHttpOptions,
    headers: defaultHeaders,
    options: defaultOptions,
};
exports.throwServerError = function (response, result, message) {
    var error = new Error(message);
    error.name = 'ServerError';
    error.response = response;
    error.statusCode = response.status;
    error.result = result;
    throw error;
};
exports.parseAndCheckHttpResponse = function (operations) { return function (response) {
    return (response
        .text()
        .then(function (bodyText) {
        try {
            return JSON.parse(bodyText);
        }
        catch (err) {
            var parseError = err;
            parseError.name = 'ServerParseError';
            parseError.response = response;
            parseError.statusCode = response.status;
            parseError.bodyText = bodyText;
            return Promise.reject(parseError);
        }
    })
        .then(function (result) {
        if (response.status >= 300) {
            exports.throwServerError(response, result, "Response not successful: Received status code " + response.status);
        }
        if (!Array.isArray(result) &&
            !result.hasOwnProperty('data') &&
            !result.hasOwnProperty('errors')) {
            exports.throwServerError(response, result, "Server response was missing for query '" + (Array.isArray(operations)
                ? operations.map(function (op) { return op.operationName; })
                : operations.operationName) + "'.");
        }
        return result;
    }));
}; };
exports.checkFetcher = function (fetcher) {
    if (!fetcher && typeof fetch === 'undefined') {
        var library = 'unfetch';
        if (typeof window === 'undefined')
            library = 'node-fetch';
        throw new ts_invariant_1.InvariantError("\nfetch is not found globally and no fetcher passed, to fix pass a fetch for\nyour environment like https://www.npmjs.com/package/" + library + ".\n\nFor example:\nimport fetch from '" + library + "';\nimport { createHttpLink } from 'apollo-link-http';\n\nconst link = createHttpLink({ uri: '/graphql', fetch: fetch });");
    }
};
exports.createSignalIfSupported = function () {
    if (typeof AbortController === 'undefined')
        return { controller: false, signal: false };
    var controller = new AbortController();
    var signal = controller.signal;
    return { controller: controller, signal: signal };
};
exports.selectHttpOptionsAndBody = function (operation, fallbackConfig) {
    var configs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        configs[_i - 2] = arguments[_i];
    }
    var options = tslib_1.__assign({}, fallbackConfig.options, { headers: fallbackConfig.headers, credentials: fallbackConfig.credentials });
    var http = fallbackConfig.http;
    configs.forEach(function (config) {
        options = tslib_1.__assign({}, options, config.options, { headers: tslib_1.__assign({}, options.headers, config.headers) });
        if (config.credentials)
            options.credentials = config.credentials;
        http = tslib_1.__assign({}, http, config.http);
    });
    var operationName = operation.operationName, extensions = operation.extensions, variables = operation.variables, query = operation.query;
    var body = { operationName: operationName, variables: variables };
    if (http.includeExtensions)
        body.extensions = extensions;
    if (http.includeQuery)
        body.query = printer_1.print(query);
    return {
        options: options,
        body: body,
    };
};
exports.serializeFetchParameter = function (p, label) {
    var serialized;
    try {
        serialized = JSON.stringify(p);
    }
    catch (e) {
        var parseError = new ts_invariant_1.InvariantError("Network request failed. " + label + " is not serializable: " + e.message);
        parseError.parseError = e;
        throw parseError;
    }
    return serialized;
};
exports.selectURI = function (operation, fallbackURI) {
    var context = operation.getContext();
    var contextURI = context.uri;
    if (contextURI) {
        return contextURI;
    }
    else if (typeof fallbackURI === 'function') {
        return fallbackURI(operation);
    }
    else {
        return fallbackURI || '/graphql';
    }
};

},{"graphql/language/printer":81,"ts-invariant":159,"tslib":20}],20:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_link_1 = require("apollo-link");
var apollo_link_http_common_1 = require("apollo-link-http-common");
exports.createHttpLink = function (linkOptions) {
    if (linkOptions === void 0) { linkOptions = {}; }
    var _a = linkOptions.uri, uri = _a === void 0 ? '/graphql' : _a, fetcher = linkOptions.fetch, includeExtensions = linkOptions.includeExtensions, useGETForQueries = linkOptions.useGETForQueries, requestOptions = tslib_1.__rest(linkOptions, ["uri", "fetch", "includeExtensions", "useGETForQueries"]);
    apollo_link_http_common_1.checkFetcher(fetcher);
    if (!fetcher) {
        fetcher = fetch;
    }
    var linkConfig = {
        http: { includeExtensions: includeExtensions },
        options: requestOptions.fetchOptions,
        credentials: requestOptions.credentials,
        headers: requestOptions.headers,
    };
    return new apollo_link_1.ApolloLink(function (operation) {
        var chosenURI = apollo_link_http_common_1.selectURI(operation, uri);
        var context = operation.getContext();
        var clientAwarenessHeaders = {};
        if (context.clientAwareness) {
            var _a = context.clientAwareness, name_1 = _a.name, version = _a.version;
            if (name_1) {
                clientAwarenessHeaders['apollographql-client-name'] = name_1;
            }
            if (version) {
                clientAwarenessHeaders['apollographql-client-version'] = version;
            }
        }
        var contextHeaders = tslib_1.__assign({}, clientAwarenessHeaders, context.headers);
        var contextConfig = {
            http: context.http,
            options: context.fetchOptions,
            credentials: context.credentials,
            headers: contextHeaders,
        };
        var _b = apollo_link_http_common_1.selectHttpOptionsAndBody(operation, apollo_link_http_common_1.fallbackHttpConfig, linkConfig, contextConfig), options = _b.options, body = _b.body;
        var controller;
        if (!options.signal) {
            var _c = apollo_link_http_common_1.createSignalIfSupported(), _controller = _c.controller, signal = _c.signal;
            controller = _controller;
            if (controller)
                options.signal = signal;
        }
        var definitionIsMutation = function (d) {
            return d.kind === 'OperationDefinition' && d.operation === 'mutation';
        };
        if (useGETForQueries &&
            !operation.query.definitions.some(definitionIsMutation)) {
            options.method = 'GET';
        }
        if (options.method === 'GET') {
            var _d = rewriteURIForGET(chosenURI, body), newURI = _d.newURI, parseError = _d.parseError;
            if (parseError) {
                return apollo_link_1.fromError(parseError);
            }
            chosenURI = newURI;
        }
        else {
            try {
                options.body = apollo_link_http_common_1.serializeFetchParameter(body, 'Payload');
            }
            catch (parseError) {
                return apollo_link_1.fromError(parseError);
            }
        }
        return new apollo_link_1.Observable(function (observer) {
            fetcher(chosenURI, options)
                .then(function (response) {
                operation.setContext({ response: response });
                return response;
            })
                .then(apollo_link_http_common_1.parseAndCheckHttpResponse(operation))
                .then(function (result) {
                observer.next(result);
                observer.complete();
                return result;
            })
                .catch(function (err) {
                if (err.name === 'AbortError')
                    return;
                if (err.result && err.result.errors && err.result.data) {
                    observer.next(err.result);
                }
                observer.error(err);
            });
            return function () {
                if (controller)
                    controller.abort();
            };
        });
    });
};
function rewriteURIForGET(chosenURI, body) {
    var queryParams = [];
    var addQueryParam = function (key, value) {
        queryParams.push(key + "=" + encodeURIComponent(value));
    };
    if ('query' in body) {
        addQueryParam('query', body.query);
    }
    if (body.operationName) {
        addQueryParam('operationName', body.operationName);
    }
    if (body.variables) {
        var serializedVariables = void 0;
        try {
            serializedVariables = apollo_link_http_common_1.serializeFetchParameter(body.variables, 'Variables map');
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam('variables', serializedVariables);
    }
    if (body.extensions) {
        var serializedExtensions = void 0;
        try {
            serializedExtensions = apollo_link_http_common_1.serializeFetchParameter(body.extensions, 'Extensions map');
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam('extensions', serializedExtensions);
    }
    var fragment = '', preFragment = chosenURI;
    var fragmentStart = chosenURI.indexOf('#');
    if (fragmentStart !== -1) {
        fragment = chosenURI.substr(fragmentStart);
        preFragment = chosenURI.substr(0, fragmentStart);
    }
    var queryParamsPrefix = preFragment.indexOf('?') === -1 ? '?' : '&';
    var newURI = preFragment + queryParamsPrefix + queryParams.join('&') + fragment;
    return { newURI: newURI };
}
var HttpLink = (function (_super) {
    tslib_1.__extends(HttpLink, _super);
    function HttpLink(opts) {
        return _super.call(this, exports.createHttpLink(opts).request) || this;
    }
    return HttpLink;
}(apollo_link_1.ApolloLink));
exports.HttpLink = HttpLink;

},{"apollo-link":24,"apollo-link-http-common":19,"tslib":23}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./httpLink"), exports);

},{"./httpLink":21,"tslib":23}],23:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./link"), exports);
var linkUtils_1 = require("./linkUtils");
exports.createOperation = linkUtils_1.createOperation;
exports.makePromise = linkUtils_1.makePromise;
exports.toPromise = linkUtils_1.toPromise;
exports.fromPromise = linkUtils_1.fromPromise;
exports.fromError = linkUtils_1.fromError;
exports.getOperationName = linkUtils_1.getOperationName;
var zen_observable_ts_1 = tslib_1.__importDefault(require("zen-observable-ts"));
exports.Observable = zen_observable_ts_1.default;

},{"./link":25,"./linkUtils":26,"tslib":27,"zen-observable-ts":162}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var zen_observable_ts_1 = tslib_1.__importDefault(require("zen-observable-ts"));
var ts_invariant_1 = require("ts-invariant");
var linkUtils_1 = require("./linkUtils");
function passthrough(op, forward) {
    return forward ? forward(op) : zen_observable_ts_1.default.of();
}
function toLink(handler) {
    return typeof handler === 'function' ? new ApolloLink(handler) : handler;
}
function empty() {
    return new ApolloLink(function () { return zen_observable_ts_1.default.of(); });
}
exports.empty = empty;
function from(links) {
    if (links.length === 0)
        return empty();
    return links.map(toLink).reduce(function (x, y) { return x.concat(y); });
}
exports.from = from;
function split(test, left, right) {
    var leftLink = toLink(left);
    var rightLink = toLink(right || new ApolloLink(passthrough));
    if (linkUtils_1.isTerminating(leftLink) && linkUtils_1.isTerminating(rightLink)) {
        return new ApolloLink(function (operation) {
            return test(operation)
                ? leftLink.request(operation) || zen_observable_ts_1.default.of()
                : rightLink.request(operation) || zen_observable_ts_1.default.of();
        });
    }
    else {
        return new ApolloLink(function (operation, forward) {
            return test(operation)
                ? leftLink.request(operation, forward) || zen_observable_ts_1.default.of()
                : rightLink.request(operation, forward) || zen_observable_ts_1.default.of();
        });
    }
}
exports.split = split;
exports.concat = function (first, second) {
    var firstLink = toLink(first);
    if (linkUtils_1.isTerminating(firstLink)) {
        ts_invariant_1.invariant.warn(new linkUtils_1.LinkError("You are calling concat on a terminating link, which will have no effect", firstLink));
        return firstLink;
    }
    var nextLink = toLink(second);
    if (linkUtils_1.isTerminating(nextLink)) {
        return new ApolloLink(function (operation) {
            return firstLink.request(operation, function (op) { return nextLink.request(op) || zen_observable_ts_1.default.of(); }) || zen_observable_ts_1.default.of();
        });
    }
    else {
        return new ApolloLink(function (operation, forward) {
            return (firstLink.request(operation, function (op) {
                return nextLink.request(op, forward) || zen_observable_ts_1.default.of();
            }) || zen_observable_ts_1.default.of());
        });
    }
};
var ApolloLink = (function () {
    function ApolloLink(request) {
        if (request)
            this.request = request;
    }
    ApolloLink.prototype.split = function (test, left, right) {
        return this.concat(split(test, left, right || new ApolloLink(passthrough)));
    };
    ApolloLink.prototype.concat = function (next) {
        return exports.concat(this, next);
    };
    ApolloLink.prototype.request = function (operation, forward) {
        throw new ts_invariant_1.InvariantError('request is not implemented');
    };
    ApolloLink.empty = empty;
    ApolloLink.from = from;
    ApolloLink.split = split;
    ApolloLink.execute = execute;
    return ApolloLink;
}());
exports.ApolloLink = ApolloLink;
function execute(link, operation) {
    return (link.request(linkUtils_1.createOperation(operation.context, linkUtils_1.transformOperation(linkUtils_1.validateOperation(operation)))) || zen_observable_ts_1.default.of());
}
exports.execute = execute;

},{"./linkUtils":26,"ts-invariant":159,"tslib":27,"zen-observable-ts":162}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var zen_observable_ts_1 = tslib_1.__importDefault(require("zen-observable-ts"));
var apollo_utilities_1 = require("apollo-utilities");
exports.getOperationName = apollo_utilities_1.getOperationName;
var ts_invariant_1 = require("ts-invariant");
function validateOperation(operation) {
    var OPERATION_FIELDS = [
        'query',
        'operationName',
        'variables',
        'extensions',
        'context',
    ];
    for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
        var key = _a[_i];
        if (OPERATION_FIELDS.indexOf(key) < 0) {
            throw new ts_invariant_1.InvariantError("illegal argument: " + key);
        }
    }
    return operation;
}
exports.validateOperation = validateOperation;
var LinkError = (function (_super) {
    tslib_1.__extends(LinkError, _super);
    function LinkError(message, link) {
        var _this = _super.call(this, message) || this;
        _this.link = link;
        return _this;
    }
    return LinkError;
}(Error));
exports.LinkError = LinkError;
function isTerminating(link) {
    return link.request.length <= 1;
}
exports.isTerminating = isTerminating;
function toPromise(observable) {
    var completed = false;
    return new Promise(function (resolve, reject) {
        observable.subscribe({
            next: function (data) {
                if (completed) {
                    ts_invariant_1.invariant.warn("Promise Wrapper does not support multiple results from Observable");
                }
                else {
                    completed = true;
                    resolve(data);
                }
            },
            error: reject,
        });
    });
}
exports.toPromise = toPromise;
exports.makePromise = toPromise;
function fromPromise(promise) {
    return new zen_observable_ts_1.default(function (observer) {
        promise
            .then(function (value) {
            observer.next(value);
            observer.complete();
        })
            .catch(observer.error.bind(observer));
    });
}
exports.fromPromise = fromPromise;
function fromError(errorValue) {
    return new zen_observable_ts_1.default(function (observer) {
        observer.error(errorValue);
    });
}
exports.fromError = fromError;
function transformOperation(operation) {
    var transformedOperation = {
        variables: operation.variables || {},
        extensions: operation.extensions || {},
        operationName: operation.operationName,
        query: operation.query,
    };
    if (!transformedOperation.operationName) {
        transformedOperation.operationName =
            typeof transformedOperation.query !== 'string'
                ? apollo_utilities_1.getOperationName(transformedOperation.query)
                : '';
    }
    return transformedOperation;
}
exports.transformOperation = transformOperation;
function createOperation(starting, operation) {
    var context = tslib_1.__assign({}, starting);
    var setContext = function (next) {
        if (typeof next === 'function') {
            context = tslib_1.__assign({}, context, next(context));
        }
        else {
            context = tslib_1.__assign({}, context, next);
        }
    };
    var getContext = function () { return (tslib_1.__assign({}, context)); };
    Object.defineProperty(operation, 'setContext', {
        enumerable: false,
        value: setContext,
    });
    Object.defineProperty(operation, 'getContext', {
        enumerable: false,
        value: getContext,
    });
    Object.defineProperty(operation, 'toKey', {
        enumerable: false,
        value: function () { return getKey(operation); },
    });
    return operation;
}
exports.createOperation = createOperation;
function getKey(operation) {
    var query = operation.query, variables = operation.variables, operationName = operation.operationName;
    return JSON.stringify([operationName, query, variables]);
}
exports.getKey = getKey;

},{"apollo-utilities":28,"ts-invariant":159,"tslib":27,"zen-observable-ts":162}],27:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],28:[function(require,module,exports){
(function (process){(function (){
exports.__esModule = true;
exports.addTypenameToDocument = addTypenameToDocument;
exports.argumentsObjectFromField = argumentsObjectFromField;
exports.assign = assign;
exports.buildQueryFromSelectionSet = buildQueryFromSelectionSet;
exports.checkDocument = checkDocument;
exports.cloneDeep = cloneDeep;
exports.createFragmentMap = createFragmentMap;
exports.getDefaultValues = getDefaultValues;
exports.getDirectiveInfoFromField = getDirectiveInfoFromField;
exports.getDirectiveNames = getDirectiveNames;
exports.getDirectivesFromDocument = getDirectivesFromDocument;
exports.getEnv = getEnv;
exports.getFragmentDefinition = getFragmentDefinition;
exports.getFragmentDefinitions = getFragmentDefinitions;
exports.getFragmentQueryDocument = getFragmentQueryDocument;
exports.getInclusionDirectives = getInclusionDirectives;
exports.getMainDefinition = getMainDefinition;
exports.getMutationDefinition = getMutationDefinition;
exports.getOperationDefinition = getOperationDefinition;
exports.getOperationDefinitionOrDie = getOperationDefinitionOrDie;
exports.getOperationName = getOperationName;
exports.getQueryDefinition = getQueryDefinition;
exports.getStoreKeyName = getStoreKeyName;
exports.graphQLResultHasError = graphQLResultHasError;
exports.hasClientExports = hasClientExports;
exports.hasDirectives = hasDirectives;
exports.isDevelopment = isDevelopment;
exports.isEnv = isEnv;
exports.isField = isField;
exports.isIdValue = isIdValue;
exports.isInlineFragment = isInlineFragment;
exports.isJsonValue = isJsonValue;
exports.isNumberValue = isNumberValue;
exports.isProduction = isProduction;
exports.isScalarValue = isScalarValue;
exports.isTest = isTest;
exports.maybeDeepFreeze = maybeDeepFreeze;
exports.mergeDeep = mergeDeep;
exports.mergeDeepArray = mergeDeepArray;
exports.removeArgumentsFromDocument = removeArgumentsFromDocument;
exports.removeClientSetsFromDocument = removeClientSetsFromDocument;
exports.removeConnectionDirectiveFromDocument = removeConnectionDirectiveFromDocument;
exports.removeDirectivesFromDocument = removeDirectivesFromDocument;
exports.removeFragmentSpreadFromDocument = removeFragmentSpreadFromDocument;
exports.resultKeyNameFromField = resultKeyNameFromField;
exports.shouldInclude = shouldInclude;
exports.storeKeyNameFromField = storeKeyNameFromField;
exports.stripSymbols = stripSymbols;
exports.toIdValue = toIdValue;
exports.tryFunctionOrLogError = tryFunctionOrLogError;
exports.valueFromNode = valueFromNode;
exports.valueToObjectRepresentation = valueToObjectRepresentation;
exports.variablesInOperation = variablesInOperation;
exports.warnOnceInDevelopment = warnOnceInDevelopment;
exports.canUseWeakMap = exports.isEqual = void 0;

var _visitor = require("graphql/language/visitor");

var _tsInvariant = require("ts-invariant");

var _tslib = require("tslib");

var _fastJsonStableStringify = _interopRequireDefault(require("fast-json-stable-stringify"));

var _equality = require("@wry/equality");

exports.isEqual = _equality.equal;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isScalarValue(value) {
  return ['StringValue', 'BooleanValue', 'EnumValue'].indexOf(value.kind) > -1;
}

function isNumberValue(value) {
  return ['IntValue', 'FloatValue'].indexOf(value.kind) > -1;
}

function isStringValue(value) {
  return value.kind === 'StringValue';
}

function isBooleanValue(value) {
  return value.kind === 'BooleanValue';
}

function isIntValue(value) {
  return value.kind === 'IntValue';
}

function isFloatValue(value) {
  return value.kind === 'FloatValue';
}

function isVariable(value) {
  return value.kind === 'Variable';
}

function isObjectValue(value) {
  return value.kind === 'ObjectValue';
}

function isListValue(value) {
  return value.kind === 'ListValue';
}

function isEnumValue(value) {
  return value.kind === 'EnumValue';
}

function isNullValue(value) {
  return value.kind === 'NullValue';
}

function valueToObjectRepresentation(argObj, name, value, variables) {
  if (isIntValue(value) || isFloatValue(value)) {
    argObj[name.value] = Number(value.value);
  } else if (isBooleanValue(value) || isStringValue(value)) {
    argObj[name.value] = value.value;
  } else if (isObjectValue(value)) {
    var nestedArgObj_1 = {};
    value.fields.map(function (obj) {
      return valueToObjectRepresentation(nestedArgObj_1, obj.name, obj.value, variables);
    });
    argObj[name.value] = nestedArgObj_1;
  } else if (isVariable(value)) {
    var variableValue = (variables || {})[value.name.value];
    argObj[name.value] = variableValue;
  } else if (isListValue(value)) {
    argObj[name.value] = value.values.map(function (listValue) {
      var nestedArgArrayObj = {};
      valueToObjectRepresentation(nestedArgArrayObj, name, listValue, variables);
      return nestedArgArrayObj[name.value];
    });
  } else if (isEnumValue(value)) {
    argObj[name.value] = value.value;
  } else if (isNullValue(value)) {
    argObj[name.value] = null;
  } else {
    throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(17) : new _tsInvariant.InvariantError("The inline argument \"" + name.value + "\" of kind \"" + value.kind + "\"" + 'is not supported. Use variables instead of inline arguments to ' + 'overcome this limitation.');
  }
}

function storeKeyNameFromField(field, variables) {
  var directivesObj = null;

  if (field.directives) {
    directivesObj = {};
    field.directives.forEach(function (directive) {
      directivesObj[directive.name.value] = {};

      if (directive.arguments) {
        directive.arguments.forEach(function (_a) {
          var name = _a.name,
              value = _a.value;
          return valueToObjectRepresentation(directivesObj[directive.name.value], name, value, variables);
        });
      }
    });
  }

  var argObj = null;

  if (field.arguments && field.arguments.length) {
    argObj = {};
    field.arguments.forEach(function (_a) {
      var name = _a.name,
          value = _a.value;
      return valueToObjectRepresentation(argObj, name, value, variables);
    });
  }

  return getStoreKeyName(field.name.value, argObj, directivesObj);
}

var KNOWN_DIRECTIVES = ['connection', 'include', 'skip', 'client', 'rest', 'export'];

function getStoreKeyName(fieldName, args, directives) {
  if (directives && directives['connection'] && directives['connection']['key']) {
    if (directives['connection']['filter'] && directives['connection']['filter'].length > 0) {
      var filterKeys = directives['connection']['filter'] ? directives['connection']['filter'] : [];
      filterKeys.sort();
      var queryArgs_1 = args;
      var filteredArgs_1 = {};
      filterKeys.forEach(function (key) {
        filteredArgs_1[key] = queryArgs_1[key];
      });
      return directives['connection']['key'] + "(" + JSON.stringify(filteredArgs_1) + ")";
    } else {
      return directives['connection']['key'];
    }
  }

  var completeFieldName = fieldName;

  if (args) {
    var stringifiedArgs = (0, _fastJsonStableStringify.default)(args);
    completeFieldName += "(" + stringifiedArgs + ")";
  }

  if (directives) {
    Object.keys(directives).forEach(function (key) {
      if (KNOWN_DIRECTIVES.indexOf(key) !== -1) return;

      if (directives[key] && Object.keys(directives[key]).length) {
        completeFieldName += "@" + key + "(" + JSON.stringify(directives[key]) + ")";
      } else {
        completeFieldName += "@" + key;
      }
    });
  }

  return completeFieldName;
}

function argumentsObjectFromField(field, variables) {
  if (field.arguments && field.arguments.length) {
    var argObj_1 = {};
    field.arguments.forEach(function (_a) {
      var name = _a.name,
          value = _a.value;
      return valueToObjectRepresentation(argObj_1, name, value, variables);
    });
    return argObj_1;
  }

  return null;
}

function resultKeyNameFromField(field) {
  return field.alias ? field.alias.value : field.name.value;
}

function isField(selection) {
  return selection.kind === 'Field';
}

function isInlineFragment(selection) {
  return selection.kind === 'InlineFragment';
}

function isIdValue(idObject) {
  return idObject && idObject.type === 'id' && typeof idObject.generated === 'boolean';
}

function toIdValue(idConfig, generated) {
  if (generated === void 0) {
    generated = false;
  }

  return (0, _tslib.__assign)({
    type: 'id',
    generated: generated
  }, typeof idConfig === 'string' ? {
    id: idConfig,
    typename: undefined
  } : idConfig);
}

function isJsonValue(jsonObject) {
  return jsonObject != null && typeof jsonObject === 'object' && jsonObject.type === 'json';
}

function defaultValueFromVariable(node) {
  throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(18) : new _tsInvariant.InvariantError("Variable nodes are not supported by valueFromNode");
}

function valueFromNode(node, onVariable) {
  if (onVariable === void 0) {
    onVariable = defaultValueFromVariable;
  }

  switch (node.kind) {
    case 'Variable':
      return onVariable(node);

    case 'NullValue':
      return null;

    case 'IntValue':
      return parseInt(node.value, 10);

    case 'FloatValue':
      return parseFloat(node.value);

    case 'ListValue':
      return node.values.map(function (v) {
        return valueFromNode(v, onVariable);
      });

    case 'ObjectValue':
      {
        var value = {};

        for (var _i = 0, _a = node.fields; _i < _a.length; _i++) {
          var field = _a[_i];
          value[field.name.value] = valueFromNode(field.value, onVariable);
        }

        return value;
      }

    default:
      return node.value;
  }
}

function getDirectiveInfoFromField(field, variables) {
  if (field.directives && field.directives.length) {
    var directiveObj_1 = {};
    field.directives.forEach(function (directive) {
      directiveObj_1[directive.name.value] = argumentsObjectFromField(directive, variables);
    });
    return directiveObj_1;
  }

  return null;
}

function shouldInclude(selection, variables) {
  if (variables === void 0) {
    variables = {};
  }

  return getInclusionDirectives(selection.directives).every(function (_a) {
    var directive = _a.directive,
        ifArgument = _a.ifArgument;
    var evaledValue = false;

    if (ifArgument.value.kind === 'Variable') {
      evaledValue = variables[ifArgument.value.name.value];
      process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(evaledValue !== void 0, 13) : (0, _tsInvariant.invariant)(evaledValue !== void 0, "Invalid variable referenced in @" + directive.name.value + " directive.");
    } else {
      evaledValue = ifArgument.value.value;
    }

    return directive.name.value === 'skip' ? !evaledValue : evaledValue;
  });
}

function getDirectiveNames(doc) {
  var names = [];
  (0, _visitor.visit)(doc, {
    Directive: function (node) {
      names.push(node.name.value);
    }
  });
  return names;
}

function hasDirectives(names, doc) {
  return getDirectiveNames(doc).some(function (name) {
    return names.indexOf(name) > -1;
  });
}

function hasClientExports(document) {
  return document && hasDirectives(['client'], document) && hasDirectives(['export'], document);
}

function isInclusionDirective(_a) {
  var value = _a.name.value;
  return value === 'skip' || value === 'include';
}

function getInclusionDirectives(directives) {
  return directives ? directives.filter(isInclusionDirective).map(function (directive) {
    var directiveArguments = directive.arguments;
    var directiveName = directive.name.value;
    process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(directiveArguments && directiveArguments.length === 1, 14) : (0, _tsInvariant.invariant)(directiveArguments && directiveArguments.length === 1, "Incorrect number of arguments for the @" + directiveName + " directive.");
    var ifArgument = directiveArguments[0];
    process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(ifArgument.name && ifArgument.name.value === 'if', 15) : (0, _tsInvariant.invariant)(ifArgument.name && ifArgument.name.value === 'if', "Invalid argument for the @" + directiveName + " directive.");
    var ifValue = ifArgument.value;
    process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(ifValue && (ifValue.kind === 'Variable' || ifValue.kind === 'BooleanValue'), 16) : (0, _tsInvariant.invariant)(ifValue && (ifValue.kind === 'Variable' || ifValue.kind === 'BooleanValue'), "Argument for the @" + directiveName + " directive must be a variable or a boolean value.");
    return {
      directive: directive,
      ifArgument: ifArgument
    };
  }) : [];
}

function getFragmentQueryDocument(document, fragmentName) {
  var actualFragmentName = fragmentName;
  var fragments = [];
  document.definitions.forEach(function (definition) {
    if (definition.kind === 'OperationDefinition') {
      throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(11) : new _tsInvariant.InvariantError("Found a " + definition.operation + " operation" + (definition.name ? " named '" + definition.name.value + "'" : '') + ". " + 'No operations are allowed when using a fragment as a query. Only fragments are allowed.');
    }

    if (definition.kind === 'FragmentDefinition') {
      fragments.push(definition);
    }
  });

  if (typeof actualFragmentName === 'undefined') {
    process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(fragments.length === 1, 12) : (0, _tsInvariant.invariant)(fragments.length === 1, "Found " + fragments.length + " fragments. `fragmentName` must be provided when there is not exactly 1 fragment.");
    actualFragmentName = fragments[0].name.value;
  }

  var query = (0, _tslib.__assign)((0, _tslib.__assign)({}, document), {
    definitions: (0, _tslib.__spreadArrays)([{
      kind: 'OperationDefinition',
      operation: 'query',
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{
          kind: 'FragmentSpread',
          name: {
            kind: 'Name',
            value: actualFragmentName
          }
        }]
      }
    }], document.definitions)
  });
  return query;
}

function assign(target) {
  var sources = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    sources[_i - 1] = arguments[_i];
  }

  sources.forEach(function (source) {
    if (typeof source === 'undefined' || source === null) {
      return;
    }

    Object.keys(source).forEach(function (key) {
      target[key] = source[key];
    });
  });
  return target;
}

function getMutationDefinition(doc) {
  checkDocument(doc);
  var mutationDef = doc.definitions.filter(function (definition) {
    return definition.kind === 'OperationDefinition' && definition.operation === 'mutation';
  })[0];
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(mutationDef, 1) : (0, _tsInvariant.invariant)(mutationDef, 'Must contain a mutation definition.');
  return mutationDef;
}

function checkDocument(doc) {
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(doc && doc.kind === 'Document', 2) : (0, _tsInvariant.invariant)(doc && doc.kind === 'Document', "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql");
  var operations = doc.definitions.filter(function (d) {
    return d.kind !== 'FragmentDefinition';
  }).map(function (definition) {
    if (definition.kind !== 'OperationDefinition') {
      throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(3) : new _tsInvariant.InvariantError("Schema type definitions not allowed in queries. Found: \"" + definition.kind + "\"");
    }

    return definition;
  });
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(operations.length <= 1, 4) : (0, _tsInvariant.invariant)(operations.length <= 1, "Ambiguous GraphQL document: contains " + operations.length + " operations");
  return doc;
}

function getOperationDefinition(doc) {
  checkDocument(doc);
  return doc.definitions.filter(function (definition) {
    return definition.kind === 'OperationDefinition';
  })[0];
}

function getOperationDefinitionOrDie(document) {
  var def = getOperationDefinition(document);
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(def, 5) : (0, _tsInvariant.invariant)(def, "GraphQL document is missing an operation");
  return def;
}

function getOperationName(doc) {
  return doc.definitions.filter(function (definition) {
    return definition.kind === 'OperationDefinition' && definition.name;
  }).map(function (x) {
    return x.name.value;
  })[0] || null;
}

function getFragmentDefinitions(doc) {
  return doc.definitions.filter(function (definition) {
    return definition.kind === 'FragmentDefinition';
  });
}

function getQueryDefinition(doc) {
  var queryDef = getOperationDefinition(doc);
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(queryDef && queryDef.operation === 'query', 6) : (0, _tsInvariant.invariant)(queryDef && queryDef.operation === 'query', 'Must contain a query definition.');
  return queryDef;
}

function getFragmentDefinition(doc) {
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(doc.kind === 'Document', 7) : (0, _tsInvariant.invariant)(doc.kind === 'Document', "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql");
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(doc.definitions.length <= 1, 8) : (0, _tsInvariant.invariant)(doc.definitions.length <= 1, 'Fragment must have exactly one definition.');
  var fragmentDef = doc.definitions[0];
  process.env.NODE_ENV === "production" ? (0, _tsInvariant.invariant)(fragmentDef.kind === 'FragmentDefinition', 9) : (0, _tsInvariant.invariant)(fragmentDef.kind === 'FragmentDefinition', 'Must be a fragment definition.');
  return fragmentDef;
}

function getMainDefinition(queryDoc) {
  checkDocument(queryDoc);
  var fragmentDefinition;

  for (var _i = 0, _a = queryDoc.definitions; _i < _a.length; _i++) {
    var definition = _a[_i];

    if (definition.kind === 'OperationDefinition') {
      var operation = definition.operation;

      if (operation === 'query' || operation === 'mutation' || operation === 'subscription') {
        return definition;
      }
    }

    if (definition.kind === 'FragmentDefinition' && !fragmentDefinition) {
      fragmentDefinition = definition;
    }
  }

  if (fragmentDefinition) {
    return fragmentDefinition;
  }

  throw process.env.NODE_ENV === "production" ? new _tsInvariant.InvariantError(10) : new _tsInvariant.InvariantError('Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment.');
}

function createFragmentMap(fragments) {
  if (fragments === void 0) {
    fragments = [];
  }

  var symTable = {};
  fragments.forEach(function (fragment) {
    symTable[fragment.name.value] = fragment;
  });
  return symTable;
}

function getDefaultValues(definition) {
  if (definition && definition.variableDefinitions && definition.variableDefinitions.length) {
    var defaultValues = definition.variableDefinitions.filter(function (_a) {
      var defaultValue = _a.defaultValue;
      return defaultValue;
    }).map(function (_a) {
      var variable = _a.variable,
          defaultValue = _a.defaultValue;
      var defaultValueObj = {};
      valueToObjectRepresentation(defaultValueObj, variable.name, defaultValue);
      return defaultValueObj;
    });
    return assign.apply(void 0, (0, _tslib.__spreadArrays)([{}], defaultValues));
  }

  return {};
}

function variablesInOperation(operation) {
  var names = new Set();

  if (operation.variableDefinitions) {
    for (var _i = 0, _a = operation.variableDefinitions; _i < _a.length; _i++) {
      var definition = _a[_i];
      names.add(definition.variable.name.value);
    }
  }

  return names;
}

function filterInPlace(array, test, context) {
  var target = 0;
  array.forEach(function (elem, i) {
    if (test.call(this, elem, i, array)) {
      array[target++] = elem;
    }
  }, context);
  array.length = target;
  return array;
}

var TYPENAME_FIELD = {
  kind: 'Field',
  name: {
    kind: 'Name',
    value: '__typename'
  }
};

function isEmpty(op, fragments) {
  return op.selectionSet.selections.every(function (selection) {
    return selection.kind === 'FragmentSpread' && isEmpty(fragments[selection.name.value], fragments);
  });
}

function nullIfDocIsEmpty(doc) {
  return isEmpty(getOperationDefinition(doc) || getFragmentDefinition(doc), createFragmentMap(getFragmentDefinitions(doc))) ? null : doc;
}

function getDirectiveMatcher(directives) {
  return function directiveMatcher(directive) {
    return directives.some(function (dir) {
      return dir.name && dir.name === directive.name.value || dir.test && dir.test(directive);
    });
  };
}

function removeDirectivesFromDocument(directives, doc) {
  var variablesInUse = Object.create(null);
  var variablesToRemove = [];
  var fragmentSpreadsInUse = Object.create(null);
  var fragmentSpreadsToRemove = [];
  var modifiedDoc = nullIfDocIsEmpty((0, _visitor.visit)(doc, {
    Variable: {
      enter: function (node, _key, parent) {
        if (parent.kind !== 'VariableDefinition') {
          variablesInUse[node.name.value] = true;
        }
      }
    },
    Field: {
      enter: function (node) {
        if (directives && node.directives) {
          var shouldRemoveField = directives.some(function (directive) {
            return directive.remove;
          });

          if (shouldRemoveField && node.directives && node.directives.some(getDirectiveMatcher(directives))) {
            if (node.arguments) {
              node.arguments.forEach(function (arg) {
                if (arg.value.kind === 'Variable') {
                  variablesToRemove.push({
                    name: arg.value.name.value
                  });
                }
              });
            }

            if (node.selectionSet) {
              getAllFragmentSpreadsFromSelectionSet(node.selectionSet).forEach(function (frag) {
                fragmentSpreadsToRemove.push({
                  name: frag.name.value
                });
              });
            }

            return null;
          }
        }
      }
    },
    FragmentSpread: {
      enter: function (node) {
        fragmentSpreadsInUse[node.name.value] = true;
      }
    },
    Directive: {
      enter: function (node) {
        if (getDirectiveMatcher(directives)(node)) {
          return null;
        }
      }
    }
  }));

  if (modifiedDoc && filterInPlace(variablesToRemove, function (v) {
    return !variablesInUse[v.name];
  }).length) {
    modifiedDoc = removeArgumentsFromDocument(variablesToRemove, modifiedDoc);
  }

  if (modifiedDoc && filterInPlace(fragmentSpreadsToRemove, function (fs) {
    return !fragmentSpreadsInUse[fs.name];
  }).length) {
    modifiedDoc = removeFragmentSpreadFromDocument(fragmentSpreadsToRemove, modifiedDoc);
  }

  return modifiedDoc;
}

function addTypenameToDocument(doc) {
  return (0, _visitor.visit)(checkDocument(doc), {
    SelectionSet: {
      enter: function (node, _key, parent) {
        if (parent && parent.kind === 'OperationDefinition') {
          return;
        }

        var selections = node.selections;

        if (!selections) {
          return;
        }

        var skip = selections.some(function (selection) {
          return isField(selection) && (selection.name.value === '__typename' || selection.name.value.lastIndexOf('__', 0) === 0);
        });

        if (skip) {
          return;
        }

        var field = parent;

        if (isField(field) && field.directives && field.directives.some(function (d) {
          return d.name.value === 'export';
        })) {
          return;
        }

        return (0, _tslib.__assign)((0, _tslib.__assign)({}, node), {
          selections: (0, _tslib.__spreadArrays)(selections, [TYPENAME_FIELD])
        });
      }
    }
  });
}

var connectionRemoveConfig = {
  test: function (directive) {
    var willRemove = directive.name.value === 'connection';

    if (willRemove) {
      if (!directive.arguments || !directive.arguments.some(function (arg) {
        return arg.name.value === 'key';
      })) {
        process.env.NODE_ENV === "production" || _tsInvariant.invariant.warn('Removing an @connection directive even though it does not have a key. ' + 'You may want to use the key parameter to specify a store key.');
      }
    }

    return willRemove;
  }
};

function removeConnectionDirectiveFromDocument(doc) {
  return removeDirectivesFromDocument([connectionRemoveConfig], checkDocument(doc));
}

function hasDirectivesInSelectionSet(directives, selectionSet, nestedCheck) {
  if (nestedCheck === void 0) {
    nestedCheck = true;
  }

  return selectionSet && selectionSet.selections && selectionSet.selections.some(function (selection) {
    return hasDirectivesInSelection(directives, selection, nestedCheck);
  });
}

function hasDirectivesInSelection(directives, selection, nestedCheck) {
  if (nestedCheck === void 0) {
    nestedCheck = true;
  }

  if (!isField(selection)) {
    return true;
  }

  if (!selection.directives) {
    return false;
  }

  return selection.directives.some(getDirectiveMatcher(directives)) || nestedCheck && hasDirectivesInSelectionSet(directives, selection.selectionSet, nestedCheck);
}

function getDirectivesFromDocument(directives, doc) {
  checkDocument(doc);
  var parentPath;
  return nullIfDocIsEmpty((0, _visitor.visit)(doc, {
    SelectionSet: {
      enter: function (node, _key, _parent, path) {
        var currentPath = path.join('-');

        if (!parentPath || currentPath === parentPath || !currentPath.startsWith(parentPath)) {
          if (node.selections) {
            var selectionsWithDirectives = node.selections.filter(function (selection) {
              return hasDirectivesInSelection(directives, selection);
            });

            if (hasDirectivesInSelectionSet(directives, node, false)) {
              parentPath = currentPath;
            }

            return (0, _tslib.__assign)((0, _tslib.__assign)({}, node), {
              selections: selectionsWithDirectives
            });
          } else {
            return null;
          }
        }
      }
    }
  }));
}

function getArgumentMatcher(config) {
  return function argumentMatcher(argument) {
    return config.some(function (aConfig) {
      return argument.value && argument.value.kind === 'Variable' && argument.value.name && (aConfig.name === argument.value.name.value || aConfig.test && aConfig.test(argument));
    });
  };
}

function removeArgumentsFromDocument(config, doc) {
  var argMatcher = getArgumentMatcher(config);
  return nullIfDocIsEmpty((0, _visitor.visit)(doc, {
    OperationDefinition: {
      enter: function (node) {
        return (0, _tslib.__assign)((0, _tslib.__assign)({}, node), {
          variableDefinitions: node.variableDefinitions.filter(function (varDef) {
            return !config.some(function (arg) {
              return arg.name === varDef.variable.name.value;
            });
          })
        });
      }
    },
    Field: {
      enter: function (node) {
        var shouldRemoveField = config.some(function (argConfig) {
          return argConfig.remove;
        });

        if (shouldRemoveField) {
          var argMatchCount_1 = 0;
          node.arguments.forEach(function (arg) {
            if (argMatcher(arg)) {
              argMatchCount_1 += 1;
            }
          });

          if (argMatchCount_1 === 1) {
            return null;
          }
        }
      }
    },
    Argument: {
      enter: function (node) {
        if (argMatcher(node)) {
          return null;
        }
      }
    }
  }));
}

function removeFragmentSpreadFromDocument(config, doc) {
  function enter(node) {
    if (config.some(function (def) {
      return def.name === node.name.value;
    })) {
      return null;
    }
  }

  return nullIfDocIsEmpty((0, _visitor.visit)(doc, {
    FragmentSpread: {
      enter: enter
    },
    FragmentDefinition: {
      enter: enter
    }
  }));
}

function getAllFragmentSpreadsFromSelectionSet(selectionSet) {
  var allFragments = [];
  selectionSet.selections.forEach(function (selection) {
    if ((isField(selection) || isInlineFragment(selection)) && selection.selectionSet) {
      getAllFragmentSpreadsFromSelectionSet(selection.selectionSet).forEach(function (frag) {
        return allFragments.push(frag);
      });
    } else if (selection.kind === 'FragmentSpread') {
      allFragments.push(selection);
    }
  });
  return allFragments;
}

function buildQueryFromSelectionSet(document) {
  var definition = getMainDefinition(document);
  var definitionOperation = definition.operation;

  if (definitionOperation === 'query') {
    return document;
  }

  var modifiedDoc = (0, _visitor.visit)(document, {
    OperationDefinition: {
      enter: function (node) {
        return (0, _tslib.__assign)((0, _tslib.__assign)({}, node), {
          operation: 'query'
        });
      }
    }
  });
  return modifiedDoc;
}

function removeClientSetsFromDocument(document) {
  checkDocument(document);
  var modifiedDoc = removeDirectivesFromDocument([{
    test: function (directive) {
      return directive.name.value === 'client';
    },
    remove: true
  }], document);

  if (modifiedDoc) {
    modifiedDoc = (0, _visitor.visit)(modifiedDoc, {
      FragmentDefinition: {
        enter: function (node) {
          if (node.selectionSet) {
            var isTypenameOnly = node.selectionSet.selections.every(function (selection) {
              return isField(selection) && selection.name.value === '__typename';
            });

            if (isTypenameOnly) {
              return null;
            }
          }
        }
      }
    });
  }

  return modifiedDoc;
}

var canUseWeakMap = typeof WeakMap === 'function' && !(typeof navigator === 'object' && navigator.product === 'ReactNative');
exports.canUseWeakMap = canUseWeakMap;
var toString = Object.prototype.toString;

function cloneDeep(value) {
  return cloneDeepHelper(value, new Map());
}

function cloneDeepHelper(val, seen) {
  switch (toString.call(val)) {
    case "[object Array]":
      {
        if (seen.has(val)) return seen.get(val);
        var copy_1 = val.slice(0);
        seen.set(val, copy_1);
        copy_1.forEach(function (child, i) {
          copy_1[i] = cloneDeepHelper(child, seen);
        });
        return copy_1;
      }

    case "[object Object]":
      {
        if (seen.has(val)) return seen.get(val);
        var copy_2 = Object.create(Object.getPrototypeOf(val));
        seen.set(val, copy_2);
        Object.keys(val).forEach(function (key) {
          copy_2[key] = cloneDeepHelper(val[key], seen);
        });
        return copy_2;
      }

    default:
      return val;
  }
}

function getEnv() {
  if (typeof process !== 'undefined' && process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  return 'development';
}

function isEnv(env) {
  return getEnv() === env;
}

function isProduction() {
  return isEnv('production') === true;
}

function isDevelopment() {
  return isEnv('development') === true;
}

function isTest() {
  return isEnv('test') === true;
}

function tryFunctionOrLogError(f) {
  try {
    return f();
  } catch (e) {
    if (console.error) {
      console.error(e);
    }
  }
}

function graphQLResultHasError(result) {
  return result.errors && result.errors.length;
}

function deepFreeze(o) {
  Object.freeze(o);
  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (o[prop] !== null && (typeof o[prop] === 'object' || typeof o[prop] === 'function') && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  return o;
}

function maybeDeepFreeze(obj) {
  if (isDevelopment() || isTest()) {
    var symbolIsPolyfilled = typeof Symbol === 'function' && typeof Symbol('') === 'string';

    if (!symbolIsPolyfilled) {
      return deepFreeze(obj);
    }
  }

  return obj;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function mergeDeep() {
  var sources = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }

  return mergeDeepArray(sources);
}

function mergeDeepArray(sources) {
  var target = sources[0] || {};
  var count = sources.length;

  if (count > 1) {
    var pastCopies = [];
    target = shallowCopyForMerge(target, pastCopies);

    for (var i = 1; i < count; ++i) {
      target = mergeHelper(target, sources[i], pastCopies);
    }
  }

  return target;
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

function mergeHelper(target, source, pastCopies) {
  if (isObject(source) && isObject(target)) {
    if (Object.isExtensible && !Object.isExtensible(target)) {
      target = shallowCopyForMerge(target, pastCopies);
    }

    Object.keys(source).forEach(function (sourceKey) {
      var sourceValue = source[sourceKey];

      if (hasOwnProperty.call(target, sourceKey)) {
        var targetValue = target[sourceKey];

        if (sourceValue !== targetValue) {
          target[sourceKey] = mergeHelper(shallowCopyForMerge(targetValue, pastCopies), sourceValue, pastCopies);
        }
      } else {
        target[sourceKey] = sourceValue;
      }
    });
    return target;
  }

  return source;
}

function shallowCopyForMerge(value, pastCopies) {
  if (value !== null && typeof value === 'object' && pastCopies.indexOf(value) < 0) {
    if (Array.isArray(value)) {
      value = value.slice(0);
    } else {
      value = (0, _tslib.__assign)({
        __proto__: Object.getPrototypeOf(value)
      }, value);
    }

    pastCopies.push(value);
  }

  return value;
}

var haveWarned = Object.create({});

function warnOnceInDevelopment(msg, type) {
  if (type === void 0) {
    type = 'warn';
  }

  if (!isProduction() && !haveWarned[msg]) {
    if (!isTest()) {
      haveWarned[msg] = true;
    }

    if (type === 'error') {
      console.error(msg);
    } else {
      console.warn(msg);
    }
  }
}

function stripSymbols(data) {
  return JSON.parse(JSON.stringify(data));
}

}).call(this)}).call(this,require('_process'))
},{"@wry/equality":7,"_process":4,"fast-json-stable-stringify":32,"graphql/language/visitor":84,"ts-invariant":159,"tslib":29}],29:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],30:[function(require,module,exports){
(function(self) {

var irrelevant = (function (exports) {

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
})(typeof self !== 'undefined' ? self : this);

},{}],31:[function(require,module,exports){
(function (process){(function (){
/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/

const fs = require('fs')
const path = require('path')
const os = require('os')

function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g
const NEWLINES_MATCH = /\r\n|\n|\r/

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug)
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

function resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding /*: string */ = 'utf8'
  let debug = false

  if (options) {
    if (options.path != null) {
      dotenvPath = resolveHome(options.path)
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
    if (options.debug != null) {
      debug = true
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.parse = parse

}).call(this)}).call(this,require('_process'))
},{"_process":4,"fs":1,"os":2,"path":3}],32:[function(require,module,exports){
'use strict';

module.exports = function (data, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'function') opts = { cmp: opts };
    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;

    var cmp = opts.cmp && (function (f) {
        return function (node) {
            return function (a, b) {
                var aobj = { key: a, value: node[a] };
                var bobj = { key: b, value: node[b] };
                return f(aobj, bobj);
            };
        };
    })(opts.cmp);

    var seen = [];
    return (function stringify (node) {
        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        if (node === undefined) return;
        if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
        if (typeof node !== 'object') return JSON.stringify(node);

        var i, out;
        if (Array.isArray(node)) {
            out = '[';
            for (i = 0; i < node.length; i++) {
                if (i) out += ',';
                out += stringify(node[i]) || 'null';
            }
            return out + ']';
        }

        if (node === null) return 'null';

        if (seen.indexOf(node) !== -1) {
            if (cycles) return JSON.stringify('__cycle__');
            throw new TypeError('Converting circular structure to JSON');
        }

        var seenIndex = seen.push(node) - 1;
        var keys = Object.keys(node).sort(cmp && cmp(node));
        out = '';
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = stringify(node[key]);

            if (!value) continue;
            if (out) out += ',';
            out += JSON.stringify(key) + ':' + value;
        }
        seen.splice(seenIndex, 1);
        return '{' + out + '}';
    })(data);
};

},{}],33:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('graphql')) :
    typeof define === 'function' && define.amd ? define(['exports', 'tslib', 'graphql'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['graphql-tag'] = {}, global.tslib, global.graphql));
}(this, (function (exports, tslib, graphql) { 'use strict';

    var docCache = new Map();
    var fragmentSourceMap = new Map();
    var printFragmentWarnings = true;
    var experimentalFragmentVariables = false;
    function normalize(string) {
        return string.replace(/[\s,]+/g, ' ').trim();
    }
    function cacheKeyFromLoc(loc) {
        return normalize(loc.source.body.substring(loc.start, loc.end));
    }
    function processFragments(ast) {
        var seenKeys = new Set();
        var definitions = [];
        ast.definitions.forEach(function (fragmentDefinition) {
            if (fragmentDefinition.kind === 'FragmentDefinition') {
                var fragmentName = fragmentDefinition.name.value;
                var sourceKey = cacheKeyFromLoc(fragmentDefinition.loc);
                var sourceKeySet = fragmentSourceMap.get(fragmentName);
                if (sourceKeySet && !sourceKeySet.has(sourceKey)) {
                    if (printFragmentWarnings) {
                        console.warn("Warning: fragment with name " + fragmentName + " already exists.\n"
                            + "graphql-tag enforces all fragment names across your application to be unique; read more about\n"
                            + "this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names");
                    }
                }
                else if (!sourceKeySet) {
                    fragmentSourceMap.set(fragmentName, sourceKeySet = new Set);
                }
                sourceKeySet.add(sourceKey);
                if (!seenKeys.has(sourceKey)) {
                    seenKeys.add(sourceKey);
                    definitions.push(fragmentDefinition);
                }
            }
            else {
                definitions.push(fragmentDefinition);
            }
        });
        return tslib.__assign(tslib.__assign({}, ast), { definitions: definitions });
    }
    function stripLoc(doc) {
        var workSet = new Set(doc.definitions);
        workSet.forEach(function (node) {
            if (node.loc)
                delete node.loc;
            Object.keys(node).forEach(function (key) {
                var value = node[key];
                if (value && typeof value === 'object') {
                    workSet.add(value);
                }
            });
        });
        var loc = doc.loc;
        if (loc) {
            delete loc.startToken;
            delete loc.endToken;
        }
        return doc;
    }
    function parseDocument(source) {
        var cacheKey = normalize(source);
        if (!docCache.has(cacheKey)) {
            var parsed = graphql.parse(source, {
                experimentalFragmentVariables: experimentalFragmentVariables,
                allowLegacyFragmentVariables: experimentalFragmentVariables
            });
            if (!parsed || parsed.kind !== 'Document') {
                throw new Error('Not a valid GraphQL document.');
            }
            docCache.set(cacheKey, stripLoc(processFragments(parsed)));
        }
        return docCache.get(cacheKey);
    }
    function gql(literals) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (typeof literals === 'string') {
            literals = [literals];
        }
        var result = literals[0];
        args.forEach(function (arg, i) {
            if (arg && arg.kind === 'Document') {
                result += arg.loc.source.body;
            }
            else {
                result += arg;
            }
            result += literals[i + 1];
        });
        return parseDocument(result);
    }
    function resetCaches() {
        docCache.clear();
        fragmentSourceMap.clear();
    }
    function disableFragmentWarnings() {
        printFragmentWarnings = false;
    }
    function enableExperimentalFragmentVariables() {
        experimentalFragmentVariables = true;
    }
    function disableExperimentalFragmentVariables() {
        experimentalFragmentVariables = false;
    }
    var extras = {
        gql: gql,
        resetCaches: resetCaches,
        disableFragmentWarnings: disableFragmentWarnings,
        enableExperimentalFragmentVariables: enableExperimentalFragmentVariables,
        disableExperimentalFragmentVariables: disableExperimentalFragmentVariables
    };
    (function (gql_1) {
        gql_1.gql = extras.gql, gql_1.resetCaches = extras.resetCaches, gql_1.disableFragmentWarnings = extras.disableFragmentWarnings, gql_1.enableExperimentalFragmentVariables = extras.enableExperimentalFragmentVariables, gql_1.disableExperimentalFragmentVariables = extras.disableExperimentalFragmentVariables;
    })(gql || (gql = {}));
    gql["default"] = gql;
    var gql$1 = gql;

    exports.default = gql$1;
    exports.disableExperimentalFragmentVariables = disableExperimentalFragmentVariables;
    exports.disableFragmentWarnings = disableFragmentWarnings;
    exports.enableExperimentalFragmentVariables = enableExperimentalFragmentVariables;
    exports.gql = gql;
    exports.resetCaches = resetCaches;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"graphql":46,"tslib":161}],34:[function(require,module,exports){
// For backwards compatibility, make sure require("graphql-tag") returns
// the gql function, rather than an exports object.
module.exports = require('./lib/graphql-tag.umd.js').gql;

},{"./lib/graphql-tag.umd.js":33}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.GraphQLError = void 0;
exports.formatError = formatError;
exports.printError = printError;

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _location = require('../language/location.js');

var _printLocation = require('../language/printLocation.js');

/**
 * A GraphQLError describes an Error found during the parse, validate, or
 * execute phases of performing a GraphQL operation. In addition to a message
 * and stack trace, it also includes information about the locations in a
 * GraphQL document and/or execution result that correspond to the Error.
 */
class GraphQLError extends Error {
  /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */

  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */

  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */

  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */

  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */

  /**
   * The original error thrown from a field resolver during execution.
   */

  /**
   * Extension fields to add to the formatted error.
   */
  constructor(
    message,
    nodes,
    source,
    positions,
    path,
    originalError,
    extensions,
  ) {
    var _this$nodes, _nodeLocations$, _ref;

    super(message);
    this.name = 'GraphQLError';
    this.path = path !== null && path !== void 0 ? path : undefined;
    this.originalError =
      originalError !== null && originalError !== void 0
        ? originalError
        : undefined; // Compute list of blame nodes.

    this.nodes = undefinedIfEmpty(
      Array.isArray(nodes) ? nodes : nodes ? [nodes] : undefined,
    );
    const nodeLocations = undefinedIfEmpty(
      (_this$nodes = this.nodes) === null || _this$nodes === void 0
        ? void 0
        : _this$nodes.map((node) => node.loc).filter((loc) => loc != null),
    ); // Compute locations in the source for the given nodes/positions.

    this.source =
      source !== null && source !== void 0
        ? source
        : nodeLocations === null || nodeLocations === void 0
        ? void 0
        : (_nodeLocations$ = nodeLocations[0]) === null ||
          _nodeLocations$ === void 0
        ? void 0
        : _nodeLocations$.source;
    this.positions =
      positions !== null && positions !== void 0
        ? positions
        : nodeLocations === null || nodeLocations === void 0
        ? void 0
        : nodeLocations.map((loc) => loc.start);
    this.locations =
      positions && source
        ? positions.map((pos) => (0, _location.getLocation)(source, pos))
        : nodeLocations === null || nodeLocations === void 0
        ? void 0
        : nodeLocations.map((loc) =>
            (0, _location.getLocation)(loc.source, loc.start),
          );
    const originalExtensions = (0, _isObjectLike.isObjectLike)(
      originalError === null || originalError === void 0
        ? void 0
        : originalError.extensions,
    )
      ? originalError === null || originalError === void 0
        ? void 0
        : originalError.extensions
      : undefined;
    this.extensions =
      (_ref =
        extensions !== null && extensions !== void 0
          ? extensions
          : originalExtensions) !== null && _ref !== void 0
        ? _ref
        : Object.create(null); // Only properties prescribed by the spec should be enumerable.
    // Keep the rest as non-enumerable.

    Object.defineProperties(this, {
      message: {
        writable: true,
        enumerable: true,
      },
      name: {
        enumerable: false,
      },
      nodes: {
        enumerable: false,
      },
      source: {
        enumerable: false,
      },
      positions: {
        enumerable: false,
      },
      originalError: {
        enumerable: false,
      },
    }); // Include (non-enumerable) stack trace.
    // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')

    if (
      originalError !== null &&
      originalError !== void 0 &&
      originalError.stack
    ) {
      Object.defineProperty(this, 'stack', {
        value: originalError.stack,
        writable: true,
        configurable: true,
      });
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GraphQLError);
    } else {
      Object.defineProperty(this, 'stack', {
        value: Error().stack,
        writable: true,
        configurable: true,
      });
    }
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLError';
  }

  toString() {
    let output = this.message;

    if (this.nodes) {
      for (const node of this.nodes) {
        if (node.loc) {
          output += '\n\n' + (0, _printLocation.printLocation)(node.loc);
        }
      }
    } else if (this.source && this.locations) {
      for (const location of this.locations) {
        output +=
          '\n\n' +
          (0, _printLocation.printSourceLocation)(this.source, location);
      }
    }

    return output;
  }

  toJSON() {
    const formattedError = {
      message: this.message,
    };

    if (this.locations != null) {
      formattedError.locations = this.locations;
    }

    if (this.path != null) {
      formattedError.path = this.path;
    }

    if (this.extensions != null && Object.keys(this.extensions).length > 0) {
      formattedError.extensions = this.extensions;
    }

    return formattedError;
  }
}

exports.GraphQLError = GraphQLError;

function undefinedIfEmpty(array) {
  return array === undefined || array.length === 0 ? undefined : array;
}
/**
 * See: https://spec.graphql.org/draft/#sec-Errors
 */

/**
 * Prints a GraphQLError to a string, representing useful location information
 * about the error's position in the source.
 *
 * @deprecated Please use `error.toString` instead. Will be removed in v17
 */
function printError(error) {
  return error.toString();
}
/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification.
 *
 * @deprecated Please use `error.toString` instead. Will be removed in v17
 */

function formatError(error) {
  return error.toJSON();
}

},{"../jsutils/isObjectLike.js":57,"../language/location.js":76,"../language/printLocation.js":79}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'GraphQLError', {
  enumerable: true,
  get: function () {
    return _GraphQLError.GraphQLError;
  },
});
Object.defineProperty(exports, 'formatError', {
  enumerable: true,
  get: function () {
    return _GraphQLError.formatError;
  },
});
Object.defineProperty(exports, 'locatedError', {
  enumerable: true,
  get: function () {
    return _locatedError.locatedError;
  },
});
Object.defineProperty(exports, 'printError', {
  enumerable: true,
  get: function () {
    return _GraphQLError.printError;
  },
});
Object.defineProperty(exports, 'syntaxError', {
  enumerable: true,
  get: function () {
    return _syntaxError.syntaxError;
  },
});

var _GraphQLError = require('./GraphQLError.js');

var _syntaxError = require('./syntaxError.js');

var _locatedError = require('./locatedError.js');

},{"./GraphQLError.js":35,"./locatedError.js":37,"./syntaxError.js":38}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.locatedError = locatedError;

var _inspect = require('../jsutils/inspect.js');

var _GraphQLError = require('./GraphQLError.js');

/**
 * Given an arbitrary value, presumably thrown while attempting to execute a
 * GraphQL operation, produce a new GraphQLError aware of the location in the
 * document responsible for the original Error.
 */
function locatedError(rawOriginalError, nodes, path) {
  var _nodes;

  // Sometimes a non-error is thrown, wrap it as an Error instance to ensure a consistent Error interface.
  const originalError =
    rawOriginalError instanceof Error
      ? rawOriginalError
      : new Error(
          'Unexpected error value: ' + (0, _inspect.inspect)(rawOriginalError),
        ); // Note: this uses a brand-check to support GraphQL errors originating from other contexts.

  if (isLocatedGraphQLError(originalError)) {
    return originalError;
  }

  return new _GraphQLError.GraphQLError(
    originalError.message,
    (_nodes = originalError.nodes) !== null && _nodes !== void 0
      ? _nodes
      : nodes,
    originalError.source,
    originalError.positions,
    path,
    originalError,
  );
}

function isLocatedGraphQLError(error) {
  return Array.isArray(error.path);
}

},{"../jsutils/inspect.js":52,"./GraphQLError.js":35}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.syntaxError = syntaxError;

var _GraphQLError = require('./GraphQLError.js');

/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */
function syntaxError(source, position, description) {
  return new _GraphQLError.GraphQLError(
    `Syntax Error: ${description}`,
    undefined,
    source,
    [position],
  );
}

},{"./GraphQLError.js":35}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.collectFields = collectFields;
exports.collectSubfields = collectSubfields;

var _kinds = require('../language/kinds.js');

var _directives = require('../type/directives.js');

var _definition = require('../type/definition.js');

var _typeFromAST = require('../utilities/typeFromAST.js');

var _values = require('./values.js');

/**
 * Given a selectionSet, collect all of the fields and returns it at the end.
 *
 * CollectFields requires the "runtime type" of an object. For a field which
 * returns an Interface or Union type, the "runtime type" will be the actual
 * Object type returned by that field.
 *
 * @internal
 */
function collectFields(
  schema,
  fragments,
  variableValues,
  runtimeType,
  selectionSet,
) {
  const fields = new Map();
  collectFieldsImpl(
    schema,
    fragments,
    variableValues,
    runtimeType,
    selectionSet,
    fields,
    new Set(),
  );
  return fields;
}
/**
 * Given an array of field nodes, collects all of the subfields of the passed
 * in fields, and returns it at the end.
 *
 * CollectFields requires the "return type" of an object. For a field which
 * returns an Interface or Union type, the "return type" will be the actual
 * Object type returned by that field.
 *
 * @internal
 */

function collectSubfields(
  schema,
  fragments,
  variableValues,
  returnType,
  fieldNodes,
) {
  const subFieldNodes = new Map();
  const visitedFragmentNames = new Set();

  for (const node of fieldNodes) {
    if (node.selectionSet) {
      collectFieldsImpl(
        schema,
        fragments,
        variableValues,
        returnType,
        node.selectionSet,
        subFieldNodes,
        visitedFragmentNames,
      );
    }
  }

  return subFieldNodes;
}

function collectFieldsImpl(
  schema,
  fragments,
  variableValues,
  runtimeType,
  selectionSet,
  fields,
  visitedFragmentNames,
) {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case _kinds.Kind.FIELD: {
        if (!shouldIncludeNode(variableValues, selection)) {
          continue;
        }

        const name = getFieldEntryKey(selection);
        const fieldList = fields.get(name);

        if (fieldList !== undefined) {
          fieldList.push(selection);
        } else {
          fields.set(name, [selection]);
        }

        break;
      }

      case _kinds.Kind.INLINE_FRAGMENT: {
        if (
          !shouldIncludeNode(variableValues, selection) ||
          !doesFragmentConditionMatch(schema, selection, runtimeType)
        ) {
          continue;
        }

        collectFieldsImpl(
          schema,
          fragments,
          variableValues,
          runtimeType,
          selection.selectionSet,
          fields,
          visitedFragmentNames,
        );
        break;
      }

      case _kinds.Kind.FRAGMENT_SPREAD: {
        const fragName = selection.name.value;

        if (
          visitedFragmentNames.has(fragName) ||
          !shouldIncludeNode(variableValues, selection)
        ) {
          continue;
        }

        visitedFragmentNames.add(fragName);
        const fragment = fragments[fragName];

        if (
          !fragment ||
          !doesFragmentConditionMatch(schema, fragment, runtimeType)
        ) {
          continue;
        }

        collectFieldsImpl(
          schema,
          fragments,
          variableValues,
          runtimeType,
          fragment.selectionSet,
          fields,
          visitedFragmentNames,
        );
        break;
      }
    }
  }
}
/**
 * Determines if a field should be included based on the `@include` and `@skip`
 * directives, where `@skip` has higher precedence than `@include`.
 */

function shouldIncludeNode(variableValues, node) {
  const skip = (0, _values.getDirectiveValues)(
    _directives.GraphQLSkipDirective,
    node,
    variableValues,
  );

  if ((skip === null || skip === void 0 ? void 0 : skip.if) === true) {
    return false;
  }

  const include = (0, _values.getDirectiveValues)(
    _directives.GraphQLIncludeDirective,
    node,
    variableValues,
  );

  if (
    (include === null || include === void 0 ? void 0 : include.if) === false
  ) {
    return false;
  }

  return true;
}
/**
 * Determines if a fragment is applicable to the given type.
 */

function doesFragmentConditionMatch(schema, fragment, type) {
  const typeConditionNode = fragment.typeCondition;

  if (!typeConditionNode) {
    return true;
  }

  const conditionalType = (0, _typeFromAST.typeFromAST)(
    schema,
    typeConditionNode,
  );

  if (conditionalType === type) {
    return true;
  }

  if ((0, _definition.isAbstractType)(conditionalType)) {
    return schema.isSubType(conditionalType, type);
  }

  return false;
}
/**
 * Implements the logic to compute the key of a given field's entry
 */

function getFieldEntryKey(node) {
  return node.alias ? node.alias.value : node.name.value;
}

},{"../language/kinds.js":74,"../type/definition.js":86,"../type/directives.js":87,"../utilities/typeFromAST.js":112,"./values.js":44}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.assertValidExecutionArguments = assertValidExecutionArguments;
exports.buildExecutionContext = buildExecutionContext;
exports.buildResolveInfo = buildResolveInfo;
exports.defaultTypeResolver = exports.defaultFieldResolver = void 0;
exports.execute = execute;
exports.executeSync = executeSync;
exports.getFieldDef = getFieldDef;

var _inspect = require('../jsutils/inspect.js');

var _memoize = require('../jsutils/memoize3.js');

var _invariant = require('../jsutils/invariant.js');

var _devAssert = require('../jsutils/devAssert.js');

var _isPromise = require('../jsutils/isPromise.js');

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _promiseReduce = require('../jsutils/promiseReduce.js');

var _promiseForObject = require('../jsutils/promiseForObject.js');

var _Path = require('../jsutils/Path.js');

var _isIterableObject = require('../jsutils/isIterableObject.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _locatedError = require('../error/locatedError.js');

var _ast = require('../language/ast.js');

var _kinds = require('../language/kinds.js');

var _validate = require('../type/validate.js');

var _introspection = require('../type/introspection.js');

var _definition = require('../type/definition.js');

var _values = require('./values.js');

var _collectFields = require('./collectFields.js');

/**
 * A memoized collection of relevant subfields with regard to the return
 * type. Memoizing ensures the subfields are not repeatedly calculated, which
 * saves overhead when resolving lists of values.
 */
const collectSubfields = (0, _memoize.memoize3)(
  (exeContext, returnType, fieldNodes) =>
    (0, _collectFields.collectSubfields)(
      exeContext.schema,
      exeContext.fragments,
      exeContext.variableValues,
      returnType,
      fieldNodes,
    ),
);
/**
 * Terminology
 *
 * "Definitions" are the generic name for top-level statements in the document.
 * Examples of this include:
 * 1) Operations (such as a query)
 * 2) Fragments
 *
 * "Operations" are a generic name for requests in the document.
 * Examples of this include:
 * 1) query,
 * 2) mutation
 *
 * "Selections" are the definitions that can appear legally and at
 * single level of the query. These include:
 * 1) field references e.g `a`
 * 2) fragment "spreads" e.g. `...c`
 * 3) inline fragment "spreads" e.g. `...on Type { a }`
 */

/**
 * Data that must be available at all points during query execution.
 *
 * Namely, schema of the type system that is currently executing,
 * and the fragments defined in the query document
 */

/**
 * Implements the "Executing requests" section of the GraphQL specification.
 *
 * Returns either a synchronous ExecutionResult (if all encountered resolvers
 * are synchronous), or a Promise of an ExecutionResult that will eventually be
 * resolved and never rejected.
 *
 * If the arguments to this function do not result in a legal execution context,
 * a GraphQLError will be thrown immediately explaining the invalid input.
 */
function execute(args) {
  const { schema, document, variableValues, rootValue } = args; // If arguments are missing or incorrect, throw an error.

  assertValidExecutionArguments(schema, document, variableValues); // If a valid execution context cannot be created due to incorrect arguments,
  // a "Response" with only errors is returned.

  const exeContext = buildExecutionContext(args); // Return early errors if execution context failed.

  if (!('schema' in exeContext)) {
    return {
      errors: exeContext,
    };
  } // Return a Promise that will eventually resolve to the data described by
  // The "Response" section of the GraphQL specification.
  //
  // If errors are encountered while executing a GraphQL field, only that
  // field and its descendants will be omitted, and sibling fields will still
  // be executed. An execution which encounters errors will still result in a
  // resolved Promise.
  //
  // Errors from sub-fields of a NonNull type may propagate to the top level,
  // at which point we still log the error and null the parent field, which
  // in this case is the entire response.

  try {
    const { operation } = exeContext;
    const result = executeOperation(exeContext, operation, rootValue);

    if ((0, _isPromise.isPromise)(result)) {
      return result.then(
        (data) => buildResponse(data, exeContext.errors),
        (error) => {
          exeContext.errors.push(error);
          return buildResponse(null, exeContext.errors);
        },
      );
    }

    return buildResponse(result, exeContext.errors);
  } catch (error) {
    exeContext.errors.push(error);
    return buildResponse(null, exeContext.errors);
  }
}
/**
 * Also implements the "Executing requests" section of the GraphQL specification.
 * However, it guarantees to complete synchronously (or throw an error) assuming
 * that all field resolvers are also synchronous.
 */

function executeSync(args) {
  const result = execute(args); // Assert that the execution was synchronous.

  if ((0, _isPromise.isPromise)(result)) {
    throw new Error('GraphQL execution failed to complete synchronously.');
  }

  return result;
}
/**
 * Given a completed execution context and data, build the `{ errors, data }`
 * response defined by the "Response" section of the GraphQL specification.
 */

function buildResponse(data, errors) {
  return errors.length === 0
    ? {
        data,
      }
    : {
        errors,
        data,
      };
}
/**
 * Essential assertions before executing to provide developer feedback for
 * improper use of the GraphQL library.
 *
 * @internal
 */

function assertValidExecutionArguments(schema, document, rawVariableValues) {
  document || (0, _devAssert.devAssert)(false, 'Must provide document.'); // If the schema used for execution is invalid, throw an error.

  (0, _validate.assertValidSchema)(schema); // Variables, if provided, must be an object.

  rawVariableValues == null ||
    (0, _isObjectLike.isObjectLike)(rawVariableValues) ||
    (0, _devAssert.devAssert)(
      false,
      'Variables must be provided as an Object where each property is a variable value. Perhaps look to see if an unparsed JSON string was provided.',
    );
}
/**
 * Constructs a ExecutionContext object from the arguments passed to
 * execute, which we will pass throughout the other execution methods.
 *
 * Throws a GraphQLError if a valid execution context cannot be created.
 *
 * @internal
 */

function buildExecutionContext(args) {
  var _definition$name, _operation$variableDe;

  const {
    schema,
    document,
    rootValue,
    contextValue,
    variableValues: rawVariableValues,
    operationName,
    fieldResolver,
    typeResolver,
    subscribeFieldResolver,
  } = args;
  let operation;
  const fragments = Object.create(null);

  for (const definition of document.definitions) {
    switch (definition.kind) {
      case _kinds.Kind.OPERATION_DEFINITION:
        if (operationName == null) {
          if (operation !== undefined) {
            return [
              new _GraphQLError.GraphQLError(
                'Must provide operation name if query contains multiple operations.',
              ),
            ];
          }

          operation = definition;
        } else if (
          ((_definition$name = definition.name) === null ||
          _definition$name === void 0
            ? void 0
            : _definition$name.value) === operationName
        ) {
          operation = definition;
        }

        break;

      case _kinds.Kind.FRAGMENT_DEFINITION:
        fragments[definition.name.value] = definition;
        break;
    }
  }

  if (!operation) {
    if (operationName != null) {
      return [
        new _GraphQLError.GraphQLError(
          `Unknown operation named "${operationName}".`,
        ),
      ];
    }

    return [new _GraphQLError.GraphQLError('Must provide an operation.')];
  } // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

  const variableDefinitions =
    (_operation$variableDe = operation.variableDefinitions) !== null &&
    _operation$variableDe !== void 0
      ? _operation$variableDe
      : [];
  const coercedVariableValues = (0, _values.getVariableValues)(
    schema,
    variableDefinitions,
    rawVariableValues !== null && rawVariableValues !== void 0
      ? rawVariableValues
      : {},
    {
      maxErrors: 50,
    },
  );

  if (coercedVariableValues.errors) {
    return coercedVariableValues.errors;
  }

  return {
    schema,
    fragments,
    rootValue,
    contextValue,
    operation,
    variableValues: coercedVariableValues.coerced,
    fieldResolver:
      fieldResolver !== null && fieldResolver !== void 0
        ? fieldResolver
        : defaultFieldResolver,
    typeResolver:
      typeResolver !== null && typeResolver !== void 0
        ? typeResolver
        : defaultTypeResolver,
    subscribeFieldResolver:
      subscribeFieldResolver !== null && subscribeFieldResolver !== void 0
        ? subscribeFieldResolver
        : defaultFieldResolver,
    errors: [],
  };
}
/**
 * Implements the "Executing operations" section of the spec.
 */

function executeOperation(exeContext, operation, rootValue) {
  const rootType = exeContext.schema.getRootType(operation.operation);

  if (rootType == null) {
    throw new _GraphQLError.GraphQLError(
      `Schema is not configured to execute ${operation.operation} operation.`,
      operation,
    );
  }

  const rootFields = (0, _collectFields.collectFields)(
    exeContext.schema,
    exeContext.fragments,
    exeContext.variableValues,
    rootType,
    operation.selectionSet,
  );
  const path = undefined;

  switch (operation.operation) {
    case _ast.OperationTypeNode.QUERY:
      return executeFields(exeContext, rootType, rootValue, path, rootFields);

    case _ast.OperationTypeNode.MUTATION:
      return executeFieldsSerially(
        exeContext,
        rootType,
        rootValue,
        path,
        rootFields,
      );

    case _ast.OperationTypeNode.SUBSCRIPTION:
      // TODO: deprecate `subscribe` and move all logic here
      // Temporary solution until we finish merging execute and subscribe together
      return executeFields(exeContext, rootType, rootValue, path, rootFields);
  }
}
/**
 * Implements the "Executing selection sets" section of the spec
 * for fields that must be executed serially.
 */

function executeFieldsSerially(
  exeContext,
  parentType,
  sourceValue,
  path,
  fields,
) {
  return (0, _promiseReduce.promiseReduce)(
    fields.entries(),
    (results, [responseName, fieldNodes]) => {
      const fieldPath = (0, _Path.addPath)(path, responseName, parentType.name);
      const result = executeField(
        exeContext,
        parentType,
        sourceValue,
        fieldNodes,
        fieldPath,
      );

      if (result === undefined) {
        return results;
      }

      if ((0, _isPromise.isPromise)(result)) {
        return result.then((resolvedResult) => {
          results[responseName] = resolvedResult;
          return results;
        });
      }

      results[responseName] = result;
      return results;
    },
    Object.create(null),
  );
}
/**
 * Implements the "Executing selection sets" section of the spec
 * for fields that may be executed in parallel.
 */

function executeFields(exeContext, parentType, sourceValue, path, fields) {
  const results = Object.create(null);
  let containsPromise = false;

  for (const [responseName, fieldNodes] of fields.entries()) {
    const fieldPath = (0, _Path.addPath)(path, responseName, parentType.name);
    const result = executeField(
      exeContext,
      parentType,
      sourceValue,
      fieldNodes,
      fieldPath,
    );

    if (result !== undefined) {
      results[responseName] = result;

      if ((0, _isPromise.isPromise)(result)) {
        containsPromise = true;
      }
    }
  } // If there are no promises, we can just return the object

  if (!containsPromise) {
    return results;
  } // Otherwise, results is a map from field name to the result of resolving that
  // field, which is possibly a promise. Return a promise that will return this
  // same map, but with any promises replaced with the values they resolved to.

  return (0, _promiseForObject.promiseForObject)(results);
}
/**
 * Implements the "Executing field" section of the spec
 * In particular, this function figures out the value that the field returns by
 * calling its resolve function, then calls completeValue to complete promises,
 * serialize scalars, or execute the sub-selection-set for objects.
 */

function executeField(exeContext, parentType, source, fieldNodes, path) {
  var _fieldDef$resolve;

  const fieldDef = getFieldDef(exeContext.schema, parentType, fieldNodes[0]);

  if (!fieldDef) {
    return;
  }

  const returnType = fieldDef.type;
  const resolveFn =
    (_fieldDef$resolve = fieldDef.resolve) !== null &&
    _fieldDef$resolve !== void 0
      ? _fieldDef$resolve
      : exeContext.fieldResolver;
  const info = buildResolveInfo(
    exeContext,
    fieldDef,
    fieldNodes,
    parentType,
    path,
  ); // Get the resolve function, regardless of if its result is normal or abrupt (error).

  try {
    // Build a JS object of arguments from the field.arguments AST, using the
    // variables scope to fulfill any variable references.
    // TODO: find a way to memoize, in case this field is within a List type.
    const args = (0, _values.getArgumentValues)(
      fieldDef,
      fieldNodes[0],
      exeContext.variableValues,
    ); // The resolve function's optional third argument is a context value that
    // is provided to every resolve function within an execution. It is commonly
    // used to represent an authenticated user, or request-specific caches.

    const contextValue = exeContext.contextValue;
    const result = resolveFn(source, args, contextValue, info);
    let completed;

    if ((0, _isPromise.isPromise)(result)) {
      completed = result.then((resolved) =>
        completeValue(exeContext, returnType, fieldNodes, info, path, resolved),
      );
    } else {
      completed = completeValue(
        exeContext,
        returnType,
        fieldNodes,
        info,
        path,
        result,
      );
    }

    if ((0, _isPromise.isPromise)(completed)) {
      // Note: we don't rely on a `catch` method, but we do expect "thenable"
      // to take a second callback for the error case.
      return completed.then(undefined, (rawError) => {
        const error = (0, _locatedError.locatedError)(
          rawError,
          fieldNodes,
          (0, _Path.pathToArray)(path),
        );
        return handleFieldError(error, returnType, exeContext);
      });
    }

    return completed;
  } catch (rawError) {
    const error = (0, _locatedError.locatedError)(
      rawError,
      fieldNodes,
      (0, _Path.pathToArray)(path),
    );
    return handleFieldError(error, returnType, exeContext);
  }
}
/**
 * @internal
 */

function buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path) {
  // The resolve function's optional fourth argument is a collection of
  // information about the current execution state.
  return {
    fieldName: fieldDef.name,
    fieldNodes,
    returnType: fieldDef.type,
    parentType,
    path,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues,
  };
}

function handleFieldError(error, returnType, exeContext) {
  // If the field type is non-nullable, then it is resolved without any
  // protection from errors, however it still properly locates the error.
  if ((0, _definition.isNonNullType)(returnType)) {
    throw error;
  } // Otherwise, error protection is applied, logging the error and resolving
  // a null value for this field if one is encountered.

  exeContext.errors.push(error);
  return null;
}
/**
 * Implements the instructions for completeValue as defined in the
 * "Field entries" section of the spec.
 *
 * If the field type is Non-Null, then this recursively completes the value
 * for the inner type. It throws a field error if that completion returns null,
 * as per the "Nullability" section of the spec.
 *
 * If the field type is a List, then this recursively completes the value
 * for the inner type on each item in the list.
 *
 * If the field type is a Scalar or Enum, ensures the completed value is a legal
 * value of the type by calling the `serialize` method of GraphQL type
 * definition.
 *
 * If the field is an abstract type, determine the runtime type of the value
 * and then complete based on that type
 *
 * Otherwise, the field type expects a sub-selection set, and will complete the
 * value by executing all sub-selections.
 */

function completeValue(exeContext, returnType, fieldNodes, info, path, result) {
  // If result is an Error, throw a located error.
  if (result instanceof Error) {
    throw result;
  } // If field type is NonNull, complete for inner type, and throw field error
  // if result is null.

  if ((0, _definition.isNonNullType)(returnType)) {
    const completed = completeValue(
      exeContext,
      returnType.ofType,
      fieldNodes,
      info,
      path,
      result,
    );

    if (completed === null) {
      throw new Error(
        `Cannot return null for non-nullable field ${info.parentType.name}.${info.fieldName}.`,
      );
    }

    return completed;
  } // If result value is null or undefined then return null.

  if (result == null) {
    return null;
  } // If field type is List, complete each item in the list with the inner type

  if ((0, _definition.isListType)(returnType)) {
    return completeListValue(
      exeContext,
      returnType,
      fieldNodes,
      info,
      path,
      result,
    );
  } // If field type is a leaf type, Scalar or Enum, serialize to a valid value,
  // returning null if serialization is not possible.

  if ((0, _definition.isLeafType)(returnType)) {
    return completeLeafValue(returnType, result);
  } // If field type is an abstract type, Interface or Union, determine the
  // runtime Object type and complete for that type.

  if ((0, _definition.isAbstractType)(returnType)) {
    return completeAbstractValue(
      exeContext,
      returnType,
      fieldNodes,
      info,
      path,
      result,
    );
  } // If field type is Object, execute and complete all sub-selections.
  // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

  if ((0, _definition.isObjectType)(returnType)) {
    return completeObjectValue(
      exeContext,
      returnType,
      fieldNodes,
      info,
      path,
      result,
    );
  } // istanbul ignore next (Not reachable. All possible output types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Cannot complete value of unexpected output type: ' +
        (0, _inspect.inspect)(returnType),
    );
}
/**
 * Complete a list value by completing each item in the list with the
 * inner type
 */

function completeListValue(
  exeContext,
  returnType,
  fieldNodes,
  info,
  path,
  result,
) {
  if (!(0, _isIterableObject.isIterableObject)(result)) {
    throw new _GraphQLError.GraphQLError(
      `Expected Iterable, but did not find one for field "${info.parentType.name}.${info.fieldName}".`,
    );
  } // This is specified as a simple map, however we're optimizing the path
  // where the list contains no Promises by avoiding creating another Promise.

  const itemType = returnType.ofType;
  let containsPromise = false;
  const completedResults = Array.from(result, (item, index) => {
    // No need to modify the info object containing the path,
    // since from here on it is not ever accessed by resolver functions.
    const itemPath = (0, _Path.addPath)(path, index, undefined);

    try {
      let completedItem;

      if ((0, _isPromise.isPromise)(item)) {
        completedItem = item.then((resolved) =>
          completeValue(
            exeContext,
            itemType,
            fieldNodes,
            info,
            itemPath,
            resolved,
          ),
        );
      } else {
        completedItem = completeValue(
          exeContext,
          itemType,
          fieldNodes,
          info,
          itemPath,
          item,
        );
      }

      if ((0, _isPromise.isPromise)(completedItem)) {
        containsPromise = true; // Note: we don't rely on a `catch` method, but we do expect "thenable"
        // to take a second callback for the error case.

        return completedItem.then(undefined, (rawError) => {
          const error = (0, _locatedError.locatedError)(
            rawError,
            fieldNodes,
            (0, _Path.pathToArray)(itemPath),
          );
          return handleFieldError(error, itemType, exeContext);
        });
      }

      return completedItem;
    } catch (rawError) {
      const error = (0, _locatedError.locatedError)(
        rawError,
        fieldNodes,
        (0, _Path.pathToArray)(itemPath),
      );
      return handleFieldError(error, itemType, exeContext);
    }
  });
  return containsPromise ? Promise.all(completedResults) : completedResults;
}
/**
 * Complete a Scalar or Enum by serializing to a valid value, returning
 * null if serialization is not possible.
 */

function completeLeafValue(returnType, result) {
  const serializedResult = returnType.serialize(result);

  if (serializedResult == null) {
    throw new Error(
      `Expected \`${(0, _inspect.inspect)(returnType)}.serialize(${(0,
      _inspect.inspect)(result)})\` to ` +
        `return non-nullable value, returned: ${(0, _inspect.inspect)(
          serializedResult,
        )}`,
    );
  }

  return serializedResult;
}
/**
 * Complete a value of an abstract type by determining the runtime object type
 * of that value, then complete the value for that type.
 */

function completeAbstractValue(
  exeContext,
  returnType,
  fieldNodes,
  info,
  path,
  result,
) {
  var _returnType$resolveTy;

  const resolveTypeFn =
    (_returnType$resolveTy = returnType.resolveType) !== null &&
    _returnType$resolveTy !== void 0
      ? _returnType$resolveTy
      : exeContext.typeResolver;
  const contextValue = exeContext.contextValue;
  const runtimeType = resolveTypeFn(result, contextValue, info, returnType);

  if ((0, _isPromise.isPromise)(runtimeType)) {
    return runtimeType.then((resolvedRuntimeType) =>
      completeObjectValue(
        exeContext,
        ensureValidRuntimeType(
          resolvedRuntimeType,
          exeContext,
          returnType,
          fieldNodes,
          info,
          result,
        ),
        fieldNodes,
        info,
        path,
        result,
      ),
    );
  }

  return completeObjectValue(
    exeContext,
    ensureValidRuntimeType(
      runtimeType,
      exeContext,
      returnType,
      fieldNodes,
      info,
      result,
    ),
    fieldNodes,
    info,
    path,
    result,
  );
}

function ensureValidRuntimeType(
  runtimeTypeName,
  exeContext,
  returnType,
  fieldNodes,
  info,
  result,
) {
  if (runtimeTypeName == null) {
    throw new _GraphQLError.GraphQLError(
      `Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}". Either the "${returnType.name}" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`,
      fieldNodes,
    );
  } // releases before 16.0.0 supported returning `GraphQLObjectType` from `resolveType`
  // TODO: remove in 17.0.0 release

  if ((0, _definition.isObjectType)(runtimeTypeName)) {
    throw new _GraphQLError.GraphQLError(
      'Support for returning GraphQLObjectType from resolveType was removed in graphql-js@16.0.0 please return type name instead.',
    );
  }

  if (typeof runtimeTypeName !== 'string') {
    throw new _GraphQLError.GraphQLError(
      `Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}" with ` +
        `value ${(0, _inspect.inspect)(result)}, received "${(0,
        _inspect.inspect)(runtimeTypeName)}".`,
    );
  }

  const runtimeType = exeContext.schema.getType(runtimeTypeName);

  if (runtimeType == null) {
    throw new _GraphQLError.GraphQLError(
      `Abstract type "${returnType.name}" was resolved to a type "${runtimeTypeName}" that does not exist inside the schema.`,
      fieldNodes,
    );
  }

  if (!(0, _definition.isObjectType)(runtimeType)) {
    throw new _GraphQLError.GraphQLError(
      `Abstract type "${returnType.name}" was resolved to a non-object type "${runtimeTypeName}".`,
      fieldNodes,
    );
  }

  if (!exeContext.schema.isSubType(returnType, runtimeType)) {
    throw new _GraphQLError.GraphQLError(
      `Runtime Object type "${runtimeType.name}" is not a possible type for "${returnType.name}".`,
      fieldNodes,
    );
  }

  return runtimeType;
}
/**
 * Complete an Object value by executing all sub-selections.
 */

function completeObjectValue(
  exeContext,
  returnType,
  fieldNodes,
  info,
  path,
  result,
) {
  // Collect sub-fields to execute to complete this value.
  const subFieldNodes = collectSubfields(exeContext, returnType, fieldNodes); // If there is an isTypeOf predicate function, call it with the
  // current result. If isTypeOf returns false, then raise an error rather
  // than continuing execution.

  if (returnType.isTypeOf) {
    const isTypeOf = returnType.isTypeOf(result, exeContext.contextValue, info);

    if ((0, _isPromise.isPromise)(isTypeOf)) {
      return isTypeOf.then((resolvedIsTypeOf) => {
        if (!resolvedIsTypeOf) {
          throw invalidReturnTypeError(returnType, result, fieldNodes);
        }

        return executeFields(
          exeContext,
          returnType,
          result,
          path,
          subFieldNodes,
        );
      });
    }

    if (!isTypeOf) {
      throw invalidReturnTypeError(returnType, result, fieldNodes);
    }
  }

  return executeFields(exeContext, returnType, result, path, subFieldNodes);
}

function invalidReturnTypeError(returnType, result, fieldNodes) {
  return new _GraphQLError.GraphQLError(
    `Expected value of type "${returnType.name}" but got: ${(0,
    _inspect.inspect)(result)}.`,
    fieldNodes,
  );
}
/**
 * If a resolveType function is not given, then a default resolve behavior is
 * used which attempts two strategies:
 *
 * First, See if the provided value has a `__typename` field defined, if so, use
 * that value as name of the resolved type.
 *
 * Otherwise, test each possible type for the abstract type by calling
 * isTypeOf for the object being coerced, returning the first type that matches.
 */

const defaultTypeResolver = function (value, contextValue, info, abstractType) {
  // First, look for `__typename`.
  if (
    (0, _isObjectLike.isObjectLike)(value) &&
    typeof value.__typename === 'string'
  ) {
    return value.__typename;
  } // Otherwise, test each possible type.

  const possibleTypes = info.schema.getPossibleTypes(abstractType);
  const promisedIsTypeOfResults = [];

  for (let i = 0; i < possibleTypes.length; i++) {
    const type = possibleTypes[i];

    if (type.isTypeOf) {
      const isTypeOfResult = type.isTypeOf(value, contextValue, info);

      if ((0, _isPromise.isPromise)(isTypeOfResult)) {
        promisedIsTypeOfResults[i] = isTypeOfResult;
      } else if (isTypeOfResult) {
        return type.name;
      }
    }
  }

  if (promisedIsTypeOfResults.length) {
    return Promise.all(promisedIsTypeOfResults).then((isTypeOfResults) => {
      for (let i = 0; i < isTypeOfResults.length; i++) {
        if (isTypeOfResults[i]) {
          return possibleTypes[i].name;
        }
      }
    });
  }
};
/**
 * If a resolve function is not given, then a default resolve behavior is used
 * which takes the property of the source object of the same name as the field
 * and returns it as the result, or if it's a function, returns the result
 * of calling that function while passing along args and context value.
 */

exports.defaultTypeResolver = defaultTypeResolver;

const defaultFieldResolver = function (source, args, contextValue, info) {
  // ensure source is a value for which property access is acceptable.
  if ((0, _isObjectLike.isObjectLike)(source) || typeof source === 'function') {
    const property = source[info.fieldName];

    if (typeof property === 'function') {
      return source[info.fieldName](args, contextValue, info);
    }

    return property;
  }
};
/**
 * This method looks up the field on the given type definition.
 * It has special casing for the three introspection fields,
 * __schema, __type and __typename. __typename is special because
 * it can always be queried as a field, even in situations where no
 * other fields are allowed, like on a Union. __schema and __type
 * could get automatically added to the query type, but that would
 * require mutating type definitions, which would cause issues.
 *
 * @internal
 */

exports.defaultFieldResolver = defaultFieldResolver;

function getFieldDef(schema, parentType, fieldNode) {
  const fieldName = fieldNode.name.value;

  if (
    fieldName === _introspection.SchemaMetaFieldDef.name &&
    schema.getQueryType() === parentType
  ) {
    return _introspection.SchemaMetaFieldDef;
  } else if (
    fieldName === _introspection.TypeMetaFieldDef.name &&
    schema.getQueryType() === parentType
  ) {
    return _introspection.TypeMetaFieldDef;
  } else if (fieldName === _introspection.TypeNameMetaFieldDef.name) {
    return _introspection.TypeNameMetaFieldDef;
  }

  return parentType.getFields()[fieldName];
}

},{"../error/GraphQLError.js":35,"../error/locatedError.js":37,"../jsutils/Path.js":47,"../jsutils/devAssert.js":48,"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../jsutils/isIterableObject.js":56,"../jsutils/isObjectLike.js":57,"../jsutils/isPromise.js":58,"../jsutils/memoize3.js":62,"../jsutils/promiseForObject.js":65,"../jsutils/promiseReduce.js":66,"../language/ast.js":69,"../language/kinds.js":74,"../type/definition.js":86,"../type/introspection.js":89,"../type/validate.js":92,"./collectFields.js":39,"./values.js":44}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'createSourceEventStream', {
  enumerable: true,
  get: function () {
    return _subscribe.createSourceEventStream;
  },
});
Object.defineProperty(exports, 'defaultFieldResolver', {
  enumerable: true,
  get: function () {
    return _execute.defaultFieldResolver;
  },
});
Object.defineProperty(exports, 'defaultTypeResolver', {
  enumerable: true,
  get: function () {
    return _execute.defaultTypeResolver;
  },
});
Object.defineProperty(exports, 'execute', {
  enumerable: true,
  get: function () {
    return _execute.execute;
  },
});
Object.defineProperty(exports, 'executeSync', {
  enumerable: true,
  get: function () {
    return _execute.executeSync;
  },
});
Object.defineProperty(exports, 'getDirectiveValues', {
  enumerable: true,
  get: function () {
    return _values.getDirectiveValues;
  },
});
Object.defineProperty(exports, 'responsePathAsArray', {
  enumerable: true,
  get: function () {
    return _Path.pathToArray;
  },
});
Object.defineProperty(exports, 'subscribe', {
  enumerable: true,
  get: function () {
    return _subscribe.subscribe;
  },
});

var _Path = require('../jsutils/Path.js');

var _execute = require('./execute.js');

var _subscribe = require('./subscribe.js');

var _values = require('./values.js');

},{"../jsutils/Path.js":47,"./execute.js":40,"./subscribe.js":43,"./values.js":44}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.mapAsyncIterator = mapAsyncIterator;

/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
function mapAsyncIterator(iterable, callback) {
  const iterator = iterable[Symbol.asyncIterator]();

  async function mapResult(result) {
    if (result.done) {
      return result;
    }

    try {
      return {
        value: await callback(result.value),
        done: false,
      };
    } catch (error) {
      // istanbul ignore else (FIXME: add test case)
      if (typeof iterator.return === 'function') {
        try {
          await iterator.return();
        } catch (_e) {
          /* ignore error */
        }
      }

      throw error;
    }
  }

  return {
    async next() {
      return mapResult(await iterator.next());
    },

    async return() {
      // If iterator.return() does not exist, then type R must be undefined.
      return typeof iterator.return === 'function'
        ? mapResult(await iterator.return())
        : {
            value: undefined,
            done: true,
          };
    },

    async throw(error) {
      if (typeof iterator.throw === 'function') {
        return mapResult(await iterator.throw(error));
      }

      throw error;
    },

    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

},{}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.createSourceEventStream = createSourceEventStream;
exports.subscribe = subscribe;

var _inspect = require('../jsutils/inspect.js');

var _isAsyncIterable = require('../jsutils/isAsyncIterable.js');

var _Path = require('../jsutils/Path.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _locatedError = require('../error/locatedError.js');

var _collectFields = require('./collectFields.js');

var _values = require('./values.js');

var _execute = require('./execute.js');

var _mapAsyncIterator = require('./mapAsyncIterator.js');

/**
 * Implements the "Subscribe" algorithm described in the GraphQL specification.
 *
 * Returns a Promise which resolves to either an AsyncIterator (if successful)
 * or an ExecutionResult (error). The promise will be rejected if the schema or
 * other arguments to this function are invalid, or if the resolved event stream
 * is not an async iterable.
 *
 * If the client-provided arguments to this function do not result in a
 * compliant subscription, a GraphQL Response (ExecutionResult) with
 * descriptive errors and no data will be returned.
 *
 * If the source stream could not be created due to faulty subscription
 * resolver logic or underlying systems, the promise will resolve to a single
 * ExecutionResult containing `errors` and no `data`.
 *
 * If the operation succeeded, the promise resolves to an AsyncIterator, which
 * yields a stream of ExecutionResults representing the response stream.
 *
 * Accepts either an object with named arguments, or individual arguments.
 */
async function subscribe(args) {
  const {
    schema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    subscribeFieldResolver,
  } = args;
  const resultOrStream = await createSourceEventStream(
    schema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    subscribeFieldResolver,
  );

  if (!(0, _isAsyncIterable.isAsyncIterable)(resultOrStream)) {
    return resultOrStream;
  } // For each payload yielded from a subscription, map it over the normal
  // GraphQL `execute` function, with `payload` as the rootValue.
  // This implements the "MapSourceToResponseEvent" algorithm described in
  // the GraphQL specification. The `execute` function provides the
  // "ExecuteSubscriptionEvent" algorithm, as it is nearly identical to the
  // "ExecuteQuery" algorithm, for which `execute` is also used.

  const mapSourceToResponse = (payload) =>
    (0, _execute.execute)({
      schema,
      document,
      rootValue: payload,
      contextValue,
      variableValues,
      operationName,
      fieldResolver,
    }); // Map every source value to a ExecutionResult value as described above.

  return (0, _mapAsyncIterator.mapAsyncIterator)(
    resultOrStream,
    mapSourceToResponse,
  );
}
/**
 * Implements the "CreateSourceEventStream" algorithm described in the
 * GraphQL specification, resolving the subscription source event stream.
 *
 * Returns a Promise which resolves to either an AsyncIterable (if successful)
 * or an ExecutionResult (error). The promise will be rejected if the schema or
 * other arguments to this function are invalid, or if the resolved event stream
 * is not an async iterable.
 *
 * If the client-provided arguments to this function do not result in a
 * compliant subscription, a GraphQL Response (ExecutionResult) with
 * descriptive errors and no data will be returned.
 *
 * If the the source stream could not be created due to faulty subscription
 * resolver logic or underlying systems, the promise will resolve to a single
 * ExecutionResult containing `errors` and no `data`.
 *
 * If the operation succeeded, the promise resolves to the AsyncIterable for the
 * event stream returned by the resolver.
 *
 * A Source Event Stream represents a sequence of events, each of which triggers
 * a GraphQL execution for that event.
 *
 * This may be useful when hosting the stateful subscription service in a
 * different process or machine than the stateless GraphQL execution engine,
 * or otherwise separating these two steps. For more on this, see the
 * "Supporting Subscriptions at Scale" information in the GraphQL specification.
 */

async function createSourceEventStream(
  schema,
  document,
  rootValue,
  contextValue,
  variableValues,
  operationName,
  subscribeFieldResolver,
) {
  // If arguments are missing or incorrectly typed, this is an internal
  // developer mistake which should throw an early error.
  (0, _execute.assertValidExecutionArguments)(schema, document, variableValues); // If a valid execution context cannot be created due to incorrect arguments,
  // a "Response" with only errors is returned.

  const exeContext = (0, _execute.buildExecutionContext)({
    schema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    subscribeFieldResolver,
  }); // Return early errors if execution context failed.

  if (!('schema' in exeContext)) {
    return {
      errors: exeContext,
    };
  }

  try {
    const eventStream = await executeSubscription(exeContext); // Assert field returned an event stream, otherwise yield an error.

    if (!(0, _isAsyncIterable.isAsyncIterable)(eventStream)) {
      throw new Error(
        'Subscription field must return Async Iterable. ' +
          `Received: ${(0, _inspect.inspect)(eventStream)}.`,
      );
    }

    return eventStream;
  } catch (error) {
    // If it GraphQLError, report it as an ExecutionResult, containing only errors and no data.
    // Otherwise treat the error as a system-class error and re-throw it.
    if (error instanceof _GraphQLError.GraphQLError) {
      return {
        errors: [error],
      };
    }

    throw error;
  }
}

async function executeSubscription(exeContext) {
  const { schema, fragments, operation, variableValues, rootValue } =
    exeContext;
  const rootType = schema.getSubscriptionType();

  if (rootType == null) {
    throw new _GraphQLError.GraphQLError(
      'Schema is not configured to execute subscription operation.',
      operation,
    );
  }

  const rootFields = (0, _collectFields.collectFields)(
    schema,
    fragments,
    variableValues,
    rootType,
    operation.selectionSet,
  );
  const [responseName, fieldNodes] = [...rootFields.entries()][0];
  const fieldDef = (0, _execute.getFieldDef)(schema, rootType, fieldNodes[0]);

  if (!fieldDef) {
    const fieldName = fieldNodes[0].name.value;
    throw new _GraphQLError.GraphQLError(
      `The subscription field "${fieldName}" is not defined.`,
      fieldNodes,
    );
  }

  const path = (0, _Path.addPath)(undefined, responseName, rootType.name);
  const info = (0, _execute.buildResolveInfo)(
    exeContext,
    fieldDef,
    fieldNodes,
    rootType,
    path,
  );

  try {
    var _fieldDef$subscribe;

    // Implements the "ResolveFieldEventStream" algorithm from GraphQL specification.
    // It differs from "ResolveFieldValue" due to providing a different `resolveFn`.
    // Build a JS object of arguments from the field.arguments AST, using the
    // variables scope to fulfill any variable references.
    const args = (0, _values.getArgumentValues)(
      fieldDef,
      fieldNodes[0],
      variableValues,
    ); // The resolve function's optional third argument is a context value that
    // is provided to every resolve function within an execution. It is commonly
    // used to represent an authenticated user, or request-specific caches.

    const contextValue = exeContext.contextValue; // Call the `subscribe()` resolver or the default resolver to produce an
    // AsyncIterable yielding raw payloads.

    const resolveFn =
      (_fieldDef$subscribe = fieldDef.subscribe) !== null &&
      _fieldDef$subscribe !== void 0
        ? _fieldDef$subscribe
        : exeContext.subscribeFieldResolver;
    const eventStream = await resolveFn(rootValue, args, contextValue, info);

    if (eventStream instanceof Error) {
      throw eventStream;
    }

    return eventStream;
  } catch (error) {
    throw (0, _locatedError.locatedError)(
      error,
      fieldNodes,
      (0, _Path.pathToArray)(path),
    );
  }
}

},{"../error/GraphQLError.js":35,"../error/locatedError.js":37,"../jsutils/Path.js":47,"../jsutils/inspect.js":52,"../jsutils/isAsyncIterable.js":55,"./collectFields.js":39,"./execute.js":40,"./mapAsyncIterator.js":42,"./values.js":44}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getArgumentValues = getArgumentValues;
exports.getDirectiveValues = getDirectiveValues;
exports.getVariableValues = getVariableValues;

var _keyMap = require('../jsutils/keyMap.js');

var _inspect = require('../jsutils/inspect.js');

var _printPathArray = require('../jsutils/printPathArray.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _kinds = require('../language/kinds.js');

var _printer = require('../language/printer.js');

var _definition = require('../type/definition.js');

var _typeFromAST = require('../utilities/typeFromAST.js');

var _valueFromAST = require('../utilities/valueFromAST.js');

var _coerceInputValue = require('../utilities/coerceInputValue.js');

/**
 * Prepares an object map of variableValues of the correct type based on the
 * provided variable definitions and arbitrary input. If the input cannot be
 * parsed to match the variable definitions, a GraphQLError will be thrown.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 *
 * @internal
 */
function getVariableValues(schema, varDefNodes, inputs, options) {
  const errors = [];
  const maxErrors =
    options === null || options === void 0 ? void 0 : options.maxErrors;

  try {
    const coerced = coerceVariableValues(
      schema,
      varDefNodes,
      inputs,
      (error) => {
        if (maxErrors != null && errors.length >= maxErrors) {
          throw new _GraphQLError.GraphQLError(
            'Too many errors processing variables, error limit reached. Execution aborted.',
          );
        }

        errors.push(error);
      },
    );

    if (errors.length === 0) {
      return {
        coerced,
      };
    }
  } catch (error) {
    errors.push(error);
  }

  return {
    errors,
  };
}

function coerceVariableValues(schema, varDefNodes, inputs, onError) {
  const coercedValues = {};

  for (const varDefNode of varDefNodes) {
    const varName = varDefNode.variable.name.value;
    const varType = (0, _typeFromAST.typeFromAST)(schema, varDefNode.type);

    if (!(0, _definition.isInputType)(varType)) {
      // Must use input types for variables. This should be caught during
      // validation, however is checked again here for safety.
      const varTypeStr = (0, _printer.print)(varDefNode.type);
      onError(
        new _GraphQLError.GraphQLError(
          `Variable "$${varName}" expected value of type "${varTypeStr}" which cannot be used as an input type.`,
          varDefNode.type,
        ),
      );
      continue;
    }

    if (!hasOwnProperty(inputs, varName)) {
      if (varDefNode.defaultValue) {
        coercedValues[varName] = (0, _valueFromAST.valueFromAST)(
          varDefNode.defaultValue,
          varType,
        );
      } else if ((0, _definition.isNonNullType)(varType)) {
        const varTypeStr = (0, _inspect.inspect)(varType);
        onError(
          new _GraphQLError.GraphQLError(
            `Variable "$${varName}" of required type "${varTypeStr}" was not provided.`,
            varDefNode,
          ),
        );
      }

      continue;
    }

    const value = inputs[varName];

    if (value === null && (0, _definition.isNonNullType)(varType)) {
      const varTypeStr = (0, _inspect.inspect)(varType);
      onError(
        new _GraphQLError.GraphQLError(
          `Variable "$${varName}" of non-null type "${varTypeStr}" must not be null.`,
          varDefNode,
        ),
      );
      continue;
    }

    coercedValues[varName] = (0, _coerceInputValue.coerceInputValue)(
      value,
      varType,
      (path, invalidValue, error) => {
        let prefix =
          `Variable "$${varName}" got invalid value ` +
          (0, _inspect.inspect)(invalidValue);

        if (path.length > 0) {
          prefix += ` at "${varName}${(0, _printPathArray.printPathArray)(
            path,
          )}"`;
        }

        onError(
          new _GraphQLError.GraphQLError(
            prefix + '; ' + error.message,
            varDefNode,
            undefined,
            undefined,
            undefined,
            error.originalError,
          ),
        );
      },
    );
  }

  return coercedValues;
}
/**
 * Prepares an object map of argument values given a list of argument
 * definitions and list of argument AST nodes.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 *
 * @internal
 */

function getArgumentValues(def, node, variableValues) {
  var _node$arguments;

  const coercedValues = {}; // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

  const argumentNodes =
    (_node$arguments = node.arguments) !== null && _node$arguments !== void 0
      ? _node$arguments
      : [];
  const argNodeMap = (0, _keyMap.keyMap)(
    argumentNodes,
    (arg) => arg.name.value,
  );

  for (const argDef of def.args) {
    const name = argDef.name;
    const argType = argDef.type;
    const argumentNode = argNodeMap[name];

    if (!argumentNode) {
      if (argDef.defaultValue !== undefined) {
        coercedValues[name] = argDef.defaultValue;
      } else if ((0, _definition.isNonNullType)(argType)) {
        throw new _GraphQLError.GraphQLError(
          `Argument "${name}" of required type "${(0, _inspect.inspect)(
            argType,
          )}" ` + 'was not provided.',
          node,
        );
      }

      continue;
    }

    const valueNode = argumentNode.value;
    let isNull = valueNode.kind === _kinds.Kind.NULL;

    if (valueNode.kind === _kinds.Kind.VARIABLE) {
      const variableName = valueNode.name.value;

      if (
        variableValues == null ||
        !hasOwnProperty(variableValues, variableName)
      ) {
        if (argDef.defaultValue !== undefined) {
          coercedValues[name] = argDef.defaultValue;
        } else if ((0, _definition.isNonNullType)(argType)) {
          throw new _GraphQLError.GraphQLError(
            `Argument "${name}" of required type "${(0, _inspect.inspect)(
              argType,
            )}" ` +
              `was provided the variable "$${variableName}" which was not provided a runtime value.`,
            valueNode,
          );
        }

        continue;
      }

      isNull = variableValues[variableName] == null;
    }

    if (isNull && (0, _definition.isNonNullType)(argType)) {
      throw new _GraphQLError.GraphQLError(
        `Argument "${name}" of non-null type "${(0, _inspect.inspect)(
          argType,
        )}" ` + 'must not be null.',
        valueNode,
      );
    }

    const coercedValue = (0, _valueFromAST.valueFromAST)(
      valueNode,
      argType,
      variableValues,
    );

    if (coercedValue === undefined) {
      // Note: ValuesOfCorrectTypeRule validation should catch this before
      // execution. This is a runtime check to ensure execution does not
      // continue with an invalid argument value.
      throw new _GraphQLError.GraphQLError(
        `Argument "${name}" has invalid value ${(0, _printer.print)(
          valueNode,
        )}.`,
        valueNode,
      );
    }

    coercedValues[name] = coercedValue;
  }

  return coercedValues;
}
/**
 * Prepares an object map of argument values given a directive definition
 * and a AST node which may contain directives. Optionally also accepts a map
 * of variable values.
 *
 * If the directive does not exist on the node, returns undefined.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */

function getDirectiveValues(directiveDef, node, variableValues) {
  var _node$directives;

  // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
  const directiveNode =
    (_node$directives = node.directives) === null || _node$directives === void 0
      ? void 0
      : _node$directives.find(
          (directive) => directive.name.value === directiveDef.name,
        );

  if (directiveNode) {
    return getArgumentValues(directiveDef, directiveNode, variableValues);
  }
}

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},{"../error/GraphQLError.js":35,"../jsutils/inspect.js":52,"../jsutils/keyMap.js":59,"../jsutils/printPathArray.js":64,"../language/kinds.js":74,"../language/printer.js":81,"../type/definition.js":86,"../utilities/coerceInputValue.js":98,"../utilities/typeFromAST.js":112,"../utilities/valueFromAST.js":113}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.graphql = graphql;
exports.graphqlSync = graphqlSync;

var _isPromise = require('./jsutils/isPromise.js');

var _parser = require('./language/parser.js');

var _validate = require('./validation/validate.js');

var _validate2 = require('./type/validate.js');

var _execute = require('./execution/execute.js');

function graphql(args) {
  // Always return a Promise for a consistent API.
  return new Promise((resolve) => resolve(graphqlImpl(args)));
}
/**
 * The graphqlSync function also fulfills GraphQL operations by parsing,
 * validating, and executing a GraphQL document along side a GraphQL schema.
 * However, it guarantees to complete synchronously (or throw an error) assuming
 * that all field resolvers are also synchronous.
 */

function graphqlSync(args) {
  const result = graphqlImpl(args); // Assert that the execution was synchronous.

  if ((0, _isPromise.isPromise)(result)) {
    throw new Error('GraphQL execution failed to complete synchronously.');
  }

  return result;
}

function graphqlImpl(args) {
  const {
    schema,
    source,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    typeResolver,
  } = args; // Validate Schema

  const schemaValidationErrors = (0, _validate2.validateSchema)(schema);

  if (schemaValidationErrors.length > 0) {
    return {
      errors: schemaValidationErrors,
    };
  } // Parse

  let document;

  try {
    document = (0, _parser.parse)(source);
  } catch (syntaxError) {
    return {
      errors: [syntaxError],
    };
  } // Validate

  const validationErrors = (0, _validate.validate)(schema, document);

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors,
    };
  } // Execute

  return (0, _execute.execute)({
    schema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    typeResolver,
  });
}

},{"./execution/execute.js":40,"./jsutils/isPromise.js":58,"./language/parser.js":77,"./type/validate.js":92,"./validation/validate.js":154}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'BREAK', {
  enumerable: true,
  get: function () {
    return _index2.BREAK;
  },
});
Object.defineProperty(exports, 'BreakingChangeType', {
  enumerable: true,
  get: function () {
    return _index6.BreakingChangeType;
  },
});
Object.defineProperty(exports, 'DEFAULT_DEPRECATION_REASON', {
  enumerable: true,
  get: function () {
    return _index.DEFAULT_DEPRECATION_REASON;
  },
});
Object.defineProperty(exports, 'DangerousChangeType', {
  enumerable: true,
  get: function () {
    return _index6.DangerousChangeType;
  },
});
Object.defineProperty(exports, 'DirectiveLocation', {
  enumerable: true,
  get: function () {
    return _index2.DirectiveLocation;
  },
});
Object.defineProperty(exports, 'ExecutableDefinitionsRule', {
  enumerable: true,
  get: function () {
    return _index4.ExecutableDefinitionsRule;
  },
});
Object.defineProperty(exports, 'FieldsOnCorrectTypeRule', {
  enumerable: true,
  get: function () {
    return _index4.FieldsOnCorrectTypeRule;
  },
});
Object.defineProperty(exports, 'FragmentsOnCompositeTypesRule', {
  enumerable: true,
  get: function () {
    return _index4.FragmentsOnCompositeTypesRule;
  },
});
Object.defineProperty(exports, 'GraphQLBoolean', {
  enumerable: true,
  get: function () {
    return _index.GraphQLBoolean;
  },
});
Object.defineProperty(exports, 'GraphQLDeprecatedDirective', {
  enumerable: true,
  get: function () {
    return _index.GraphQLDeprecatedDirective;
  },
});
Object.defineProperty(exports, 'GraphQLDirective', {
  enumerable: true,
  get: function () {
    return _index.GraphQLDirective;
  },
});
Object.defineProperty(exports, 'GraphQLEnumType', {
  enumerable: true,
  get: function () {
    return _index.GraphQLEnumType;
  },
});
Object.defineProperty(exports, 'GraphQLError', {
  enumerable: true,
  get: function () {
    return _index5.GraphQLError;
  },
});
Object.defineProperty(exports, 'GraphQLFloat', {
  enumerable: true,
  get: function () {
    return _index.GraphQLFloat;
  },
});
Object.defineProperty(exports, 'GraphQLID', {
  enumerable: true,
  get: function () {
    return _index.GraphQLID;
  },
});
Object.defineProperty(exports, 'GraphQLIncludeDirective', {
  enumerable: true,
  get: function () {
    return _index.GraphQLIncludeDirective;
  },
});
Object.defineProperty(exports, 'GraphQLInputObjectType', {
  enumerable: true,
  get: function () {
    return _index.GraphQLInputObjectType;
  },
});
Object.defineProperty(exports, 'GraphQLInt', {
  enumerable: true,
  get: function () {
    return _index.GraphQLInt;
  },
});
Object.defineProperty(exports, 'GraphQLInterfaceType', {
  enumerable: true,
  get: function () {
    return _index.GraphQLInterfaceType;
  },
});
Object.defineProperty(exports, 'GraphQLList', {
  enumerable: true,
  get: function () {
    return _index.GraphQLList;
  },
});
Object.defineProperty(exports, 'GraphQLNonNull', {
  enumerable: true,
  get: function () {
    return _index.GraphQLNonNull;
  },
});
Object.defineProperty(exports, 'GraphQLObjectType', {
  enumerable: true,
  get: function () {
    return _index.GraphQLObjectType;
  },
});
Object.defineProperty(exports, 'GraphQLScalarType', {
  enumerable: true,
  get: function () {
    return _index.GraphQLScalarType;
  },
});
Object.defineProperty(exports, 'GraphQLSchema', {
  enumerable: true,
  get: function () {
    return _index.GraphQLSchema;
  },
});
Object.defineProperty(exports, 'GraphQLSkipDirective', {
  enumerable: true,
  get: function () {
    return _index.GraphQLSkipDirective;
  },
});
Object.defineProperty(exports, 'GraphQLSpecifiedByDirective', {
  enumerable: true,
  get: function () {
    return _index.GraphQLSpecifiedByDirective;
  },
});
Object.defineProperty(exports, 'GraphQLString', {
  enumerable: true,
  get: function () {
    return _index.GraphQLString;
  },
});
Object.defineProperty(exports, 'GraphQLUnionType', {
  enumerable: true,
  get: function () {
    return _index.GraphQLUnionType;
  },
});
Object.defineProperty(exports, 'Kind', {
  enumerable: true,
  get: function () {
    return _index2.Kind;
  },
});
Object.defineProperty(exports, 'KnownArgumentNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.KnownArgumentNamesRule;
  },
});
Object.defineProperty(exports, 'KnownDirectivesRule', {
  enumerable: true,
  get: function () {
    return _index4.KnownDirectivesRule;
  },
});
Object.defineProperty(exports, 'KnownFragmentNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.KnownFragmentNamesRule;
  },
});
Object.defineProperty(exports, 'KnownTypeNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.KnownTypeNamesRule;
  },
});
Object.defineProperty(exports, 'Lexer', {
  enumerable: true,
  get: function () {
    return _index2.Lexer;
  },
});
Object.defineProperty(exports, 'Location', {
  enumerable: true,
  get: function () {
    return _index2.Location;
  },
});
Object.defineProperty(exports, 'LoneAnonymousOperationRule', {
  enumerable: true,
  get: function () {
    return _index4.LoneAnonymousOperationRule;
  },
});
Object.defineProperty(exports, 'LoneSchemaDefinitionRule', {
  enumerable: true,
  get: function () {
    return _index4.LoneSchemaDefinitionRule;
  },
});
Object.defineProperty(exports, 'NoDeprecatedCustomRule', {
  enumerable: true,
  get: function () {
    return _index4.NoDeprecatedCustomRule;
  },
});
Object.defineProperty(exports, 'NoFragmentCyclesRule', {
  enumerable: true,
  get: function () {
    return _index4.NoFragmentCyclesRule;
  },
});
Object.defineProperty(exports, 'NoSchemaIntrospectionCustomRule', {
  enumerable: true,
  get: function () {
    return _index4.NoSchemaIntrospectionCustomRule;
  },
});
Object.defineProperty(exports, 'NoUndefinedVariablesRule', {
  enumerable: true,
  get: function () {
    return _index4.NoUndefinedVariablesRule;
  },
});
Object.defineProperty(exports, 'NoUnusedFragmentsRule', {
  enumerable: true,
  get: function () {
    return _index4.NoUnusedFragmentsRule;
  },
});
Object.defineProperty(exports, 'NoUnusedVariablesRule', {
  enumerable: true,
  get: function () {
    return _index4.NoUnusedVariablesRule;
  },
});
Object.defineProperty(exports, 'OperationTypeNode', {
  enumerable: true,
  get: function () {
    return _index2.OperationTypeNode;
  },
});
Object.defineProperty(exports, 'OverlappingFieldsCanBeMergedRule', {
  enumerable: true,
  get: function () {
    return _index4.OverlappingFieldsCanBeMergedRule;
  },
});
Object.defineProperty(exports, 'PossibleFragmentSpreadsRule', {
  enumerable: true,
  get: function () {
    return _index4.PossibleFragmentSpreadsRule;
  },
});
Object.defineProperty(exports, 'PossibleTypeExtensionsRule', {
  enumerable: true,
  get: function () {
    return _index4.PossibleTypeExtensionsRule;
  },
});
Object.defineProperty(exports, 'ProvidedRequiredArgumentsRule', {
  enumerable: true,
  get: function () {
    return _index4.ProvidedRequiredArgumentsRule;
  },
});
Object.defineProperty(exports, 'ScalarLeafsRule', {
  enumerable: true,
  get: function () {
    return _index4.ScalarLeafsRule;
  },
});
Object.defineProperty(exports, 'SchemaMetaFieldDef', {
  enumerable: true,
  get: function () {
    return _index.SchemaMetaFieldDef;
  },
});
Object.defineProperty(exports, 'SingleFieldSubscriptionsRule', {
  enumerable: true,
  get: function () {
    return _index4.SingleFieldSubscriptionsRule;
  },
});
Object.defineProperty(exports, 'Source', {
  enumerable: true,
  get: function () {
    return _index2.Source;
  },
});
Object.defineProperty(exports, 'Token', {
  enumerable: true,
  get: function () {
    return _index2.Token;
  },
});
Object.defineProperty(exports, 'TokenKind', {
  enumerable: true,
  get: function () {
    return _index2.TokenKind;
  },
});
Object.defineProperty(exports, 'TypeInfo', {
  enumerable: true,
  get: function () {
    return _index6.TypeInfo;
  },
});
Object.defineProperty(exports, 'TypeKind', {
  enumerable: true,
  get: function () {
    return _index.TypeKind;
  },
});
Object.defineProperty(exports, 'TypeMetaFieldDef', {
  enumerable: true,
  get: function () {
    return _index.TypeMetaFieldDef;
  },
});
Object.defineProperty(exports, 'TypeNameMetaFieldDef', {
  enumerable: true,
  get: function () {
    return _index.TypeNameMetaFieldDef;
  },
});
Object.defineProperty(exports, 'UniqueArgumentDefinitionNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueArgumentDefinitionNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueArgumentNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueArgumentNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueDirectiveNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueDirectiveNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueDirectivesPerLocationRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueDirectivesPerLocationRule;
  },
});
Object.defineProperty(exports, 'UniqueEnumValueNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueEnumValueNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueFieldDefinitionNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueFieldDefinitionNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueFragmentNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueFragmentNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueInputFieldNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueInputFieldNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueOperationNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueOperationNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueOperationTypesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueOperationTypesRule;
  },
});
Object.defineProperty(exports, 'UniqueTypeNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueTypeNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueVariableNamesRule', {
  enumerable: true,
  get: function () {
    return _index4.UniqueVariableNamesRule;
  },
});
Object.defineProperty(exports, 'ValidationContext', {
  enumerable: true,
  get: function () {
    return _index4.ValidationContext;
  },
});
Object.defineProperty(exports, 'ValuesOfCorrectTypeRule', {
  enumerable: true,
  get: function () {
    return _index4.ValuesOfCorrectTypeRule;
  },
});
Object.defineProperty(exports, 'VariablesAreInputTypesRule', {
  enumerable: true,
  get: function () {
    return _index4.VariablesAreInputTypesRule;
  },
});
Object.defineProperty(exports, 'VariablesInAllowedPositionRule', {
  enumerable: true,
  get: function () {
    return _index4.VariablesInAllowedPositionRule;
  },
});
Object.defineProperty(exports, '__Directive', {
  enumerable: true,
  get: function () {
    return _index.__Directive;
  },
});
Object.defineProperty(exports, '__DirectiveLocation', {
  enumerable: true,
  get: function () {
    return _index.__DirectiveLocation;
  },
});
Object.defineProperty(exports, '__EnumValue', {
  enumerable: true,
  get: function () {
    return _index.__EnumValue;
  },
});
Object.defineProperty(exports, '__Field', {
  enumerable: true,
  get: function () {
    return _index.__Field;
  },
});
Object.defineProperty(exports, '__InputValue', {
  enumerable: true,
  get: function () {
    return _index.__InputValue;
  },
});
Object.defineProperty(exports, '__Schema', {
  enumerable: true,
  get: function () {
    return _index.__Schema;
  },
});
Object.defineProperty(exports, '__Type', {
  enumerable: true,
  get: function () {
    return _index.__Type;
  },
});
Object.defineProperty(exports, '__TypeKind', {
  enumerable: true,
  get: function () {
    return _index.__TypeKind;
  },
});
Object.defineProperty(exports, 'assertAbstractType', {
  enumerable: true,
  get: function () {
    return _index.assertAbstractType;
  },
});
Object.defineProperty(exports, 'assertCompositeType', {
  enumerable: true,
  get: function () {
    return _index.assertCompositeType;
  },
});
Object.defineProperty(exports, 'assertDirective', {
  enumerable: true,
  get: function () {
    return _index.assertDirective;
  },
});
Object.defineProperty(exports, 'assertEnumType', {
  enumerable: true,
  get: function () {
    return _index.assertEnumType;
  },
});
Object.defineProperty(exports, 'assertEnumValueName', {
  enumerable: true,
  get: function () {
    return _index.assertEnumValueName;
  },
});
Object.defineProperty(exports, 'assertInputObjectType', {
  enumerable: true,
  get: function () {
    return _index.assertInputObjectType;
  },
});
Object.defineProperty(exports, 'assertInputType', {
  enumerable: true,
  get: function () {
    return _index.assertInputType;
  },
});
Object.defineProperty(exports, 'assertInterfaceType', {
  enumerable: true,
  get: function () {
    return _index.assertInterfaceType;
  },
});
Object.defineProperty(exports, 'assertLeafType', {
  enumerable: true,
  get: function () {
    return _index.assertLeafType;
  },
});
Object.defineProperty(exports, 'assertListType', {
  enumerable: true,
  get: function () {
    return _index.assertListType;
  },
});
Object.defineProperty(exports, 'assertName', {
  enumerable: true,
  get: function () {
    return _index.assertName;
  },
});
Object.defineProperty(exports, 'assertNamedType', {
  enumerable: true,
  get: function () {
    return _index.assertNamedType;
  },
});
Object.defineProperty(exports, 'assertNonNullType', {
  enumerable: true,
  get: function () {
    return _index.assertNonNullType;
  },
});
Object.defineProperty(exports, 'assertNullableType', {
  enumerable: true,
  get: function () {
    return _index.assertNullableType;
  },
});
Object.defineProperty(exports, 'assertObjectType', {
  enumerable: true,
  get: function () {
    return _index.assertObjectType;
  },
});
Object.defineProperty(exports, 'assertOutputType', {
  enumerable: true,
  get: function () {
    return _index.assertOutputType;
  },
});
Object.defineProperty(exports, 'assertScalarType', {
  enumerable: true,
  get: function () {
    return _index.assertScalarType;
  },
});
Object.defineProperty(exports, 'assertSchema', {
  enumerable: true,
  get: function () {
    return _index.assertSchema;
  },
});
Object.defineProperty(exports, 'assertType', {
  enumerable: true,
  get: function () {
    return _index.assertType;
  },
});
Object.defineProperty(exports, 'assertUnionType', {
  enumerable: true,
  get: function () {
    return _index.assertUnionType;
  },
});
Object.defineProperty(exports, 'assertValidName', {
  enumerable: true,
  get: function () {
    return _index6.assertValidName;
  },
});
Object.defineProperty(exports, 'assertValidSchema', {
  enumerable: true,
  get: function () {
    return _index.assertValidSchema;
  },
});
Object.defineProperty(exports, 'assertWrappingType', {
  enumerable: true,
  get: function () {
    return _index.assertWrappingType;
  },
});
Object.defineProperty(exports, 'astFromValue', {
  enumerable: true,
  get: function () {
    return _index6.astFromValue;
  },
});
Object.defineProperty(exports, 'buildASTSchema', {
  enumerable: true,
  get: function () {
    return _index6.buildASTSchema;
  },
});
Object.defineProperty(exports, 'buildClientSchema', {
  enumerable: true,
  get: function () {
    return _index6.buildClientSchema;
  },
});
Object.defineProperty(exports, 'buildSchema', {
  enumerable: true,
  get: function () {
    return _index6.buildSchema;
  },
});
Object.defineProperty(exports, 'coerceInputValue', {
  enumerable: true,
  get: function () {
    return _index6.coerceInputValue;
  },
});
Object.defineProperty(exports, 'concatAST', {
  enumerable: true,
  get: function () {
    return _index6.concatAST;
  },
});
Object.defineProperty(exports, 'createSourceEventStream', {
  enumerable: true,
  get: function () {
    return _index3.createSourceEventStream;
  },
});
Object.defineProperty(exports, 'defaultFieldResolver', {
  enumerable: true,
  get: function () {
    return _index3.defaultFieldResolver;
  },
});
Object.defineProperty(exports, 'defaultTypeResolver', {
  enumerable: true,
  get: function () {
    return _index3.defaultTypeResolver;
  },
});
Object.defineProperty(exports, 'doTypesOverlap', {
  enumerable: true,
  get: function () {
    return _index6.doTypesOverlap;
  },
});
Object.defineProperty(exports, 'execute', {
  enumerable: true,
  get: function () {
    return _index3.execute;
  },
});
Object.defineProperty(exports, 'executeSync', {
  enumerable: true,
  get: function () {
    return _index3.executeSync;
  },
});
Object.defineProperty(exports, 'extendSchema', {
  enumerable: true,
  get: function () {
    return _index6.extendSchema;
  },
});
Object.defineProperty(exports, 'findBreakingChanges', {
  enumerable: true,
  get: function () {
    return _index6.findBreakingChanges;
  },
});
Object.defineProperty(exports, 'findDangerousChanges', {
  enumerable: true,
  get: function () {
    return _index6.findDangerousChanges;
  },
});
Object.defineProperty(exports, 'formatError', {
  enumerable: true,
  get: function () {
    return _index5.formatError;
  },
});
Object.defineProperty(exports, 'getDirectiveValues', {
  enumerable: true,
  get: function () {
    return _index3.getDirectiveValues;
  },
});
Object.defineProperty(exports, 'getEnterLeaveForKind', {
  enumerable: true,
  get: function () {
    return _index2.getEnterLeaveForKind;
  },
});
Object.defineProperty(exports, 'getIntrospectionQuery', {
  enumerable: true,
  get: function () {
    return _index6.getIntrospectionQuery;
  },
});
Object.defineProperty(exports, 'getLocation', {
  enumerable: true,
  get: function () {
    return _index2.getLocation;
  },
});
Object.defineProperty(exports, 'getNamedType', {
  enumerable: true,
  get: function () {
    return _index.getNamedType;
  },
});
Object.defineProperty(exports, 'getNullableType', {
  enumerable: true,
  get: function () {
    return _index.getNullableType;
  },
});
Object.defineProperty(exports, 'getOperationAST', {
  enumerable: true,
  get: function () {
    return _index6.getOperationAST;
  },
});
Object.defineProperty(exports, 'getOperationRootType', {
  enumerable: true,
  get: function () {
    return _index6.getOperationRootType;
  },
});
Object.defineProperty(exports, 'getVisitFn', {
  enumerable: true,
  get: function () {
    return _index2.getVisitFn;
  },
});
Object.defineProperty(exports, 'graphql', {
  enumerable: true,
  get: function () {
    return _graphql.graphql;
  },
});
Object.defineProperty(exports, 'graphqlSync', {
  enumerable: true,
  get: function () {
    return _graphql.graphqlSync;
  },
});
Object.defineProperty(exports, 'introspectionFromSchema', {
  enumerable: true,
  get: function () {
    return _index6.introspectionFromSchema;
  },
});
Object.defineProperty(exports, 'introspectionTypes', {
  enumerable: true,
  get: function () {
    return _index.introspectionTypes;
  },
});
Object.defineProperty(exports, 'isAbstractType', {
  enumerable: true,
  get: function () {
    return _index.isAbstractType;
  },
});
Object.defineProperty(exports, 'isCompositeType', {
  enumerable: true,
  get: function () {
    return _index.isCompositeType;
  },
});
Object.defineProperty(exports, 'isConstValueNode', {
  enumerable: true,
  get: function () {
    return _index2.isConstValueNode;
  },
});
Object.defineProperty(exports, 'isDefinitionNode', {
  enumerable: true,
  get: function () {
    return _index2.isDefinitionNode;
  },
});
Object.defineProperty(exports, 'isDirective', {
  enumerable: true,
  get: function () {
    return _index.isDirective;
  },
});
Object.defineProperty(exports, 'isEnumType', {
  enumerable: true,
  get: function () {
    return _index.isEnumType;
  },
});
Object.defineProperty(exports, 'isEqualType', {
  enumerable: true,
  get: function () {
    return _index6.isEqualType;
  },
});
Object.defineProperty(exports, 'isExecutableDefinitionNode', {
  enumerable: true,
  get: function () {
    return _index2.isExecutableDefinitionNode;
  },
});
Object.defineProperty(exports, 'isInputObjectType', {
  enumerable: true,
  get: function () {
    return _index.isInputObjectType;
  },
});
Object.defineProperty(exports, 'isInputType', {
  enumerable: true,
  get: function () {
    return _index.isInputType;
  },
});
Object.defineProperty(exports, 'isInterfaceType', {
  enumerable: true,
  get: function () {
    return _index.isInterfaceType;
  },
});
Object.defineProperty(exports, 'isIntrospectionType', {
  enumerable: true,
  get: function () {
    return _index.isIntrospectionType;
  },
});
Object.defineProperty(exports, 'isLeafType', {
  enumerable: true,
  get: function () {
    return _index.isLeafType;
  },
});
Object.defineProperty(exports, 'isListType', {
  enumerable: true,
  get: function () {
    return _index.isListType;
  },
});
Object.defineProperty(exports, 'isNamedType', {
  enumerable: true,
  get: function () {
    return _index.isNamedType;
  },
});
Object.defineProperty(exports, 'isNonNullType', {
  enumerable: true,
  get: function () {
    return _index.isNonNullType;
  },
});
Object.defineProperty(exports, 'isNullableType', {
  enumerable: true,
  get: function () {
    return _index.isNullableType;
  },
});
Object.defineProperty(exports, 'isObjectType', {
  enumerable: true,
  get: function () {
    return _index.isObjectType;
  },
});
Object.defineProperty(exports, 'isOutputType', {
  enumerable: true,
  get: function () {
    return _index.isOutputType;
  },
});
Object.defineProperty(exports, 'isRequiredArgument', {
  enumerable: true,
  get: function () {
    return _index.isRequiredArgument;
  },
});
Object.defineProperty(exports, 'isRequiredInputField', {
  enumerable: true,
  get: function () {
    return _index.isRequiredInputField;
  },
});
Object.defineProperty(exports, 'isScalarType', {
  enumerable: true,
  get: function () {
    return _index.isScalarType;
  },
});
Object.defineProperty(exports, 'isSchema', {
  enumerable: true,
  get: function () {
    return _index.isSchema;
  },
});
Object.defineProperty(exports, 'isSelectionNode', {
  enumerable: true,
  get: function () {
    return _index2.isSelectionNode;
  },
});
Object.defineProperty(exports, 'isSpecifiedDirective', {
  enumerable: true,
  get: function () {
    return _index.isSpecifiedDirective;
  },
});
Object.defineProperty(exports, 'isSpecifiedScalarType', {
  enumerable: true,
  get: function () {
    return _index.isSpecifiedScalarType;
  },
});
Object.defineProperty(exports, 'isType', {
  enumerable: true,
  get: function () {
    return _index.isType;
  },
});
Object.defineProperty(exports, 'isTypeDefinitionNode', {
  enumerable: true,
  get: function () {
    return _index2.isTypeDefinitionNode;
  },
});
Object.defineProperty(exports, 'isTypeExtensionNode', {
  enumerable: true,
  get: function () {
    return _index2.isTypeExtensionNode;
  },
});
Object.defineProperty(exports, 'isTypeNode', {
  enumerable: true,
  get: function () {
    return _index2.isTypeNode;
  },
});
Object.defineProperty(exports, 'isTypeSubTypeOf', {
  enumerable: true,
  get: function () {
    return _index6.isTypeSubTypeOf;
  },
});
Object.defineProperty(exports, 'isTypeSystemDefinitionNode', {
  enumerable: true,
  get: function () {
    return _index2.isTypeSystemDefinitionNode;
  },
});
Object.defineProperty(exports, 'isTypeSystemExtensionNode', {
  enumerable: true,
  get: function () {
    return _index2.isTypeSystemExtensionNode;
  },
});
Object.defineProperty(exports, 'isUnionType', {
  enumerable: true,
  get: function () {
    return _index.isUnionType;
  },
});
Object.defineProperty(exports, 'isValidNameError', {
  enumerable: true,
  get: function () {
    return _index6.isValidNameError;
  },
});
Object.defineProperty(exports, 'isValueNode', {
  enumerable: true,
  get: function () {
    return _index2.isValueNode;
  },
});
Object.defineProperty(exports, 'isWrappingType', {
  enumerable: true,
  get: function () {
    return _index.isWrappingType;
  },
});
Object.defineProperty(exports, 'lexicographicSortSchema', {
  enumerable: true,
  get: function () {
    return _index6.lexicographicSortSchema;
  },
});
Object.defineProperty(exports, 'locatedError', {
  enumerable: true,
  get: function () {
    return _index5.locatedError;
  },
});
Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function () {
    return _index2.parse;
  },
});
Object.defineProperty(exports, 'parseConstValue', {
  enumerable: true,
  get: function () {
    return _index2.parseConstValue;
  },
});
Object.defineProperty(exports, 'parseType', {
  enumerable: true,
  get: function () {
    return _index2.parseType;
  },
});
Object.defineProperty(exports, 'parseValue', {
  enumerable: true,
  get: function () {
    return _index2.parseValue;
  },
});
Object.defineProperty(exports, 'print', {
  enumerable: true,
  get: function () {
    return _index2.print;
  },
});
Object.defineProperty(exports, 'printError', {
  enumerable: true,
  get: function () {
    return _index5.printError;
  },
});
Object.defineProperty(exports, 'printIntrospectionSchema', {
  enumerable: true,
  get: function () {
    return _index6.printIntrospectionSchema;
  },
});
Object.defineProperty(exports, 'printLocation', {
  enumerable: true,
  get: function () {
    return _index2.printLocation;
  },
});
Object.defineProperty(exports, 'printSchema', {
  enumerable: true,
  get: function () {
    return _index6.printSchema;
  },
});
Object.defineProperty(exports, 'printSourceLocation', {
  enumerable: true,
  get: function () {
    return _index2.printSourceLocation;
  },
});
Object.defineProperty(exports, 'printType', {
  enumerable: true,
  get: function () {
    return _index6.printType;
  },
});
Object.defineProperty(exports, 'responsePathAsArray', {
  enumerable: true,
  get: function () {
    return _index3.responsePathAsArray;
  },
});
Object.defineProperty(exports, 'separateOperations', {
  enumerable: true,
  get: function () {
    return _index6.separateOperations;
  },
});
Object.defineProperty(exports, 'specifiedDirectives', {
  enumerable: true,
  get: function () {
    return _index.specifiedDirectives;
  },
});
Object.defineProperty(exports, 'specifiedRules', {
  enumerable: true,
  get: function () {
    return _index4.specifiedRules;
  },
});
Object.defineProperty(exports, 'specifiedScalarTypes', {
  enumerable: true,
  get: function () {
    return _index.specifiedScalarTypes;
  },
});
Object.defineProperty(exports, 'stripIgnoredCharacters', {
  enumerable: true,
  get: function () {
    return _index6.stripIgnoredCharacters;
  },
});
Object.defineProperty(exports, 'subscribe', {
  enumerable: true,
  get: function () {
    return _index3.subscribe;
  },
});
Object.defineProperty(exports, 'syntaxError', {
  enumerable: true,
  get: function () {
    return _index5.syntaxError;
  },
});
Object.defineProperty(exports, 'typeFromAST', {
  enumerable: true,
  get: function () {
    return _index6.typeFromAST;
  },
});
Object.defineProperty(exports, 'validate', {
  enumerable: true,
  get: function () {
    return _index4.validate;
  },
});
Object.defineProperty(exports, 'validateSchema', {
  enumerable: true,
  get: function () {
    return _index.validateSchema;
  },
});
Object.defineProperty(exports, 'valueFromAST', {
  enumerable: true,
  get: function () {
    return _index6.valueFromAST;
  },
});
Object.defineProperty(exports, 'valueFromASTUntyped', {
  enumerable: true,
  get: function () {
    return _index6.valueFromASTUntyped;
  },
});
Object.defineProperty(exports, 'version', {
  enumerable: true,
  get: function () {
    return _version.version;
  },
});
Object.defineProperty(exports, 'versionInfo', {
  enumerable: true,
  get: function () {
    return _version.versionInfo;
  },
});
Object.defineProperty(exports, 'visit', {
  enumerable: true,
  get: function () {
    return _index2.visit;
  },
});
Object.defineProperty(exports, 'visitInParallel', {
  enumerable: true,
  get: function () {
    return _index2.visitInParallel;
  },
});
Object.defineProperty(exports, 'visitWithTypeInfo', {
  enumerable: true,
  get: function () {
    return _index6.visitWithTypeInfo;
  },
});

var _version = require('./version.js');

var _graphql = require('./graphql.js');

var _index = require('./type/index.js');

var _index2 = require('./language/index.js');

var _index3 = require('./execution/index.js');

var _index4 = require('./validation/index.js');

var _index5 = require('./error/index.js');

var _index6 = require('./utilities/index.js');

},{"./error/index.js":36,"./execution/index.js":41,"./graphql.js":45,"./language/index.js":73,"./type/index.js":88,"./utilities/index.js":105,"./validation/index.js":116,"./version.js":155}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.addPath = addPath;
exports.pathToArray = pathToArray;

/**
 * Given a Path and a key, return a new Path containing the new key.
 */
function addPath(prev, key, typename) {
  return {
    prev,
    key,
    typename,
  };
}
/**
 * Given a Path, return an Array of the path keys.
 */

function pathToArray(path) {
  const flattened = [];
  let curr = path;

  while (curr) {
    flattened.push(curr.key);
    curr = curr.prev;
  }

  return flattened.reverse();
}

},{}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.devAssert = devAssert;

function devAssert(condition, message) {
  const booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

  if (!booleanCondition) {
    throw new Error(message);
  }
}

},{}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.didYouMean = didYouMean;
const MAX_SUGGESTIONS = 5;
/**
 * Given [ A, B, C ] return ' Did you mean A, B, or C?'.
 */

function didYouMean(firstArg, secondArg) {
  const [subMessage, suggestionsArg] = secondArg
    ? [firstArg, secondArg]
    : [undefined, firstArg];
  let message = ' Did you mean ';

  if (subMessage) {
    message += subMessage + ' ';
  }

  const suggestions = suggestionsArg.map((x) => `"${x}"`);

  switch (suggestions.length) {
    case 0:
      return '';

    case 1:
      return message + suggestions[0] + '?';

    case 2:
      return message + suggestions[0] + ' or ' + suggestions[1] + '?';
  }

  const selected = suggestions.slice(0, MAX_SUGGESTIONS);
  const lastItem = selected.pop();
  return message + selected.join(', ') + ', or ' + lastItem + '?';
}

},{}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.groupBy = groupBy;

/**
 * Groups array items into a Map, given a function to produce grouping key.
 */
function groupBy(list, keyFn) {
  const result = new Map();

  for (const item of list) {
    const key = keyFn(item);
    const group = result.get(key);

    if (group === undefined) {
      result.set(key, [item]);
    } else {
      group.push(item);
    }
  }

  return result;
}

},{}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.identityFunc = identityFunc;

/**
 * Returns the first argument it receives.
 */
function identityFunc(x) {
  return x;
}

},{}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.inspect = inspect;
const MAX_ARRAY_LENGTH = 10;
const MAX_RECURSIVE_DEPTH = 2;
/**
 * Used to print values in error messages.
 */

function inspect(value) {
  return formatValue(value, []);
}

function formatValue(value, seenValues) {
  switch (typeof value) {
    case 'string':
      return JSON.stringify(value);

    case 'function':
      return value.name ? `[function ${value.name}]` : '[function]';

    case 'object':
      return formatObjectValue(value, seenValues);

    default:
      return String(value);
  }
}

function formatObjectValue(value, previouslySeenValues) {
  if (value === null) {
    return 'null';
  }

  if (previouslySeenValues.includes(value)) {
    return '[Circular]';
  }

  const seenValues = [...previouslySeenValues, value];

  if (isJSONable(value)) {
    const jsonValue = value.toJSON(); // check for infinite recursion

    if (jsonValue !== value) {
      return typeof jsonValue === 'string'
        ? jsonValue
        : formatValue(jsonValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }

  return formatObject(value, seenValues);
}

function isJSONable(value) {
  return typeof value.toJSON === 'function';
}

function formatObject(object, seenValues) {
  const entries = Object.entries(object);

  if (entries.length === 0) {
    return '{}';
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[' + getObjectTag(object) + ']';
  }

  const properties = entries.map(
    ([key, value]) => key + ': ' + formatValue(value, seenValues),
  );
  return '{ ' + properties.join(', ') + ' }';
}

function formatArray(array, seenValues) {
  if (array.length === 0) {
    return '[]';
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[Array]';
  }

  const len = Math.min(MAX_ARRAY_LENGTH, array.length);
  const remaining = array.length - len;
  const items = [];

  for (let i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }

  if (remaining === 1) {
    items.push('... 1 more item');
  } else if (remaining > 1) {
    items.push(`... ${remaining} more items`);
  }

  return '[' + items.join(', ') + ']';
}

function getObjectTag(object) {
  const tag = Object.prototype.toString
    .call(object)
    .replace(/^\[object /, '')
    .replace(/]$/, '');

  if (tag === 'Object' && typeof object.constructor === 'function') {
    const name = object.constructor.name;

    if (typeof name === 'string' && name !== '') {
      return name;
    }
  }

  return tag;
}

},{}],53:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.instanceOf = void 0;

var _inspect = require('./inspect.js');

/**
 * A replacement for instanceof which includes an error warning when multi-realm
 * constructors are detected.
 * See: https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
 * See: https://webpack.js.org/guides/production/
 */
const instanceOf =
  process.env.NODE_ENV === 'production' // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')
    ? function instanceOf(value, constructor) {
        return value instanceof constructor;
      }
    : function instanceOf(value, constructor) {
        if (value instanceof constructor) {
          return true;
        }

        if (typeof value === 'object' && value !== null) {
          var _value$constructor;

          // Prefer Symbol.toStringTag since it is immune to minification.
          const className = constructor.prototype[Symbol.toStringTag];
          const valueClassName = // We still need to support constructor's name to detect conflicts with older versions of this library.
            Symbol.toStringTag in value // @ts-expect-error TS bug see, https://github.com/microsoft/TypeScript/issues/38009
              ? value[Symbol.toStringTag]
              : (_value$constructor = value.constructor) === null ||
                _value$constructor === void 0
              ? void 0
              : _value$constructor.name;

          if (className === valueClassName) {
            const stringifiedValue = (0, _inspect.inspect)(value);
            throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
          }
        }

        return false;
      };
exports.instanceOf = instanceOf;

}).call(this)}).call(this,require('_process'))
},{"./inspect.js":52,"_process":4}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.invariant = invariant;

function invariant(condition, message) {
  const booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

  if (!booleanCondition) {
    throw new Error(
      message != null ? message : 'Unexpected invariant triggered.',
    );
  }
}

},{}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.isAsyncIterable = isAsyncIterable;

/**
 * Returns true if the provided object implements the AsyncIterator protocol via
 * implementing a `Symbol.asyncIterator` method.
 */
function isAsyncIterable(maybeAsyncIterable) {
  return (
    typeof (maybeAsyncIterable === null || maybeAsyncIterable === void 0
      ? void 0
      : maybeAsyncIterable[Symbol.asyncIterator]) === 'function'
  );
}

},{}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.isIterableObject = isIterableObject;

/**
 * Returns true if the provided object is an Object (i.e. not a string literal)
 * and implements the Iterator protocol.
 *
 * This may be used in place of [Array.isArray()][isArray] to determine if
 * an object should be iterated-over e.g. Array, Map, Set, Int8Array,
 * TypedArray, etc. but excludes string literals.
 *
 * @example
 * ```ts
 * isIterableObject([ 1, 2, 3 ]) // true
 * isIterableObject(new Map()) // true
 * isIterableObject('ABC') // false
 * isIterableObject({ key: 'value' }) // false
 * isIterableObject({ length: 1, 0: 'Alpha' }) // false
 * ```
 */
function isIterableObject(maybeIterable) {
  return (
    typeof maybeIterable === 'object' &&
    typeof (maybeIterable === null || maybeIterable === void 0
      ? void 0
      : maybeIterable[Symbol.iterator]) === 'function'
  );
}

},{}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.isObjectLike = isObjectLike;

/**
 * Return true if `value` is object-like. A value is object-like if it's not
 * `null` and has a `typeof` result of "object".
 */
function isObjectLike(value) {
  return typeof value == 'object' && value !== null;
}

},{}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.isPromise = isPromise;

/**
 * Returns true if the value acts like a Promise, i.e. has a "then" function,
 * otherwise returns false.
 */
function isPromise(value) {
  return (
    typeof (value === null || value === void 0 ? void 0 : value.then) ===
    'function'
  );
}

},{}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.keyMap = keyMap;

/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * for each value in the array.
 *
 * This provides a convenient lookup for the array items if the key function
 * produces unique results.
 * ```ts
 * const phoneBook = [
 *   { name: 'Jon', num: '555-1234' },
 *   { name: 'Jenny', num: '867-5309' }
 * ]
 *
 * const entriesByName = keyMap(
 *   phoneBook,
 *   entry => entry.name
 * )
 *
 * // {
 * //   Jon: { name: 'Jon', num: '555-1234' },
 * //   Jenny: { name: 'Jenny', num: '867-5309' }
 * // }
 *
 * const jennyEntry = entriesByName['Jenny']
 *
 * // { name: 'Jenny', num: '857-6309' }
 * ```
 */
function keyMap(list, keyFn) {
  const result = Object.create(null);

  for (const item of list) {
    result[keyFn(item)] = item;
  }

  return result;
}

},{}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.keyValMap = keyValMap;

/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * and a function to produce the values from each item in the array.
 * ```ts
 * const phoneBook = [
 *   { name: 'Jon', num: '555-1234' },
 *   { name: 'Jenny', num: '867-5309' }
 * ]
 *
 * // { Jon: '555-1234', Jenny: '867-5309' }
 * const phonesByName = keyValMap(
 *   phoneBook,
 *   entry => entry.name,
 *   entry => entry.num
 * )
 * ```
 */
function keyValMap(list, keyFn, valFn) {
  const result = Object.create(null);

  for (const item of list) {
    result[keyFn(item)] = valFn(item);
  }

  return result;
}

},{}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.mapValue = mapValue;

/**
 * Creates an object map with the same keys as `map` and values generated by
 * running each value of `map` thru `fn`.
 */
function mapValue(map, fn) {
  const result = Object.create(null);

  for (const [key, value] of Object.entries(map)) {
    result[key] = fn(value, key);
  }

  return result;
}

},{}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.memoize3 = memoize3;

/**
 * Memoizes the provided three-argument function.
 */
function memoize3(fn) {
  let cache0;
  return function memoized(a1, a2, a3) {
    if (cache0 === undefined) {
      cache0 = new WeakMap();
    }

    let cache1 = cache0.get(a1);

    if (cache1 === undefined) {
      cache1 = new WeakMap();
      cache0.set(a1, cache1);
    }

    let cache2 = cache1.get(a2);

    if (cache2 === undefined) {
      cache2 = new WeakMap();
      cache1.set(a2, cache2);
    }

    let fnResult = cache2.get(a3);

    if (fnResult === undefined) {
      fnResult = fn(a1, a2, a3);
      cache2.set(a3, fnResult);
    }

    return fnResult;
  };
}

},{}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.naturalCompare = naturalCompare;

/**
 * Returns a number indicating whether a reference string comes before, or after,
 * or is the same as the given string in natural sort order.
 *
 * See: https://en.wikipedia.org/wiki/Natural_sort_order
 *
 */
function naturalCompare(aStr, bStr) {
  let aIndex = 0;
  let bIndex = 0;

  while (aIndex < aStr.length && bIndex < bStr.length) {
    let aChar = aStr.charCodeAt(aIndex);
    let bChar = bStr.charCodeAt(bIndex);

    if (isDigit(aChar) && isDigit(bChar)) {
      let aNum = 0;

      do {
        ++aIndex;
        aNum = aNum * 10 + aChar - DIGIT_0;
        aChar = aStr.charCodeAt(aIndex);
      } while (isDigit(aChar) && aNum > 0);

      let bNum = 0;

      do {
        ++bIndex;
        bNum = bNum * 10 + bChar - DIGIT_0;
        bChar = bStr.charCodeAt(bIndex);
      } while (isDigit(bChar) && bNum > 0);

      if (aNum < bNum) {
        return -1;
      }

      if (aNum > bNum) {
        return 1;
      }
    } else {
      if (aChar < bChar) {
        return -1;
      }

      if (aChar > bChar) {
        return 1;
      }

      ++aIndex;
      ++bIndex;
    }
  }

  return aStr.length - bStr.length;
}

const DIGIT_0 = 48;
const DIGIT_9 = 57;

function isDigit(code) {
  return !isNaN(code) && DIGIT_0 <= code && code <= DIGIT_9;
}

},{}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.printPathArray = printPathArray;

/**
 * Build a string describing the path.
 */
function printPathArray(path) {
  return path
    .map((key) =>
      typeof key === 'number' ? '[' + key.toString() + ']' : '.' + key,
    )
    .join('');
}

},{}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.promiseForObject = promiseForObject;

/**
 * This function transforms a JS object `ObjMap<Promise<T>>` into
 * a `Promise<ObjMap<T>>`
 *
 * This is akin to bluebird's `Promise.props`, but implemented only using
 * `Promise.all` so it will work with any implementation of ES6 promises.
 */
function promiseForObject(object) {
  return Promise.all(Object.values(object)).then((resolvedValues) => {
    const resolvedObject = Object.create(null);

    for (const [i, key] of Object.keys(object).entries()) {
      resolvedObject[key] = resolvedValues[i];
    }

    return resolvedObject;
  });
}

},{}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.promiseReduce = promiseReduce;

var _isPromise = require('./isPromise.js');

/**
 * Similar to Array.prototype.reduce(), however the reducing callback may return
 * a Promise, in which case reduction will continue after each promise resolves.
 *
 * If the callback does not return a Promise, then this function will also not
 * return a Promise.
 */
function promiseReduce(values, callbackFn, initialValue) {
  let accumulator = initialValue;

  for (const value of values) {
    accumulator = (0, _isPromise.isPromise)(accumulator)
      ? accumulator.then((resolved) => callbackFn(resolved, value))
      : callbackFn(accumulator, value);
  }

  return accumulator;
}

},{"./isPromise.js":58}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.suggestionList = suggestionList;

var _naturalCompare = require('./naturalCompare.js');

/**
 * Given an invalid input string and a list of valid options, returns a filtered
 * list of valid options sorted based on their similarity with the input.
 */
function suggestionList(input, options) {
  const optionsByDistance = Object.create(null);
  const lexicalDistance = new LexicalDistance(input);
  const threshold = Math.floor(input.length * 0.4) + 1;

  for (const option of options) {
    const distance = lexicalDistance.measure(option, threshold);

    if (distance !== undefined) {
      optionsByDistance[option] = distance;
    }
  }

  return Object.keys(optionsByDistance).sort((a, b) => {
    const distanceDiff = optionsByDistance[a] - optionsByDistance[b];
    return distanceDiff !== 0
      ? distanceDiff
      : (0, _naturalCompare.naturalCompare)(a, b);
  });
}
/**
 * Computes the lexical distance between strings A and B.
 *
 * The "distance" between two strings is given by counting the minimum number
 * of edits needed to transform string A into string B. An edit can be an
 * insertion, deletion, or substitution of a single character, or a swap of two
 * adjacent characters.
 *
 * Includes a custom alteration from Damerau-Levenshtein to treat case changes
 * as a single edit which helps identify mis-cased values with an edit distance
 * of 1.
 *
 * This distance can be useful for detecting typos in input or sorting
 */

class LexicalDistance {
  constructor(input) {
    this._input = input;
    this._inputLowerCase = input.toLowerCase();
    this._inputArray = stringToArray(this._inputLowerCase);
    this._rows = [
      new Array(input.length + 1).fill(0),
      new Array(input.length + 1).fill(0),
      new Array(input.length + 1).fill(0),
    ];
  }

  measure(option, threshold) {
    if (this._input === option) {
      return 0;
    }

    const optionLowerCase = option.toLowerCase(); // Any case change counts as a single edit

    if (this._inputLowerCase === optionLowerCase) {
      return 1;
    }

    let a = stringToArray(optionLowerCase);
    let b = this._inputArray;

    if (a.length < b.length) {
      const tmp = a;
      a = b;
      b = tmp;
    }

    const aLength = a.length;
    const bLength = b.length;

    if (aLength - bLength > threshold) {
      return undefined;
    }

    const rows = this._rows;

    for (let j = 0; j <= bLength; j++) {
      rows[0][j] = j;
    }

    for (let i = 1; i <= aLength; i++) {
      const upRow = rows[(i - 1) % 3];
      const currentRow = rows[i % 3];
      let smallestCell = (currentRow[0] = i);

      for (let j = 1; j <= bLength; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let currentCell = Math.min(
          upRow[j] + 1, // delete
          currentRow[j - 1] + 1, // insert
          upRow[j - 1] + cost, // substitute
        );

        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          // transposition
          const doubleDiagonalCell = rows[(i - 2) % 3][j - 2];
          currentCell = Math.min(currentCell, doubleDiagonalCell + 1);
        }

        if (currentCell < smallestCell) {
          smallestCell = currentCell;
        }

        currentRow[j] = currentCell;
      } // Early exit, since distance can't go smaller than smallest element of the previous row.

      if (smallestCell > threshold) {
        return undefined;
      }
    }

    const distance = rows[aLength % 3][bLength];
    return distance <= threshold ? distance : undefined;
  }
}

function stringToArray(str) {
  const strLength = str.length;
  const array = new Array(strLength);

  for (let i = 0; i < strLength; ++i) {
    array[i] = str.charCodeAt(i);
  }

  return array;
}

},{"./naturalCompare.js":63}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.toObjMap = toObjMap;

function toObjMap(obj) {
  if (obj == null) {
    return Object.create(null);
  }

  if (Object.getPrototypeOf(obj) === null) {
    return obj;
  }

  const map = Object.create(null);

  for (const [key, value] of Object.entries(obj)) {
    map[key] = value;
  }

  return map;
}

},{}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.Token =
  exports.QueryDocumentKeys =
  exports.OperationTypeNode =
  exports.Location =
    void 0;
exports.isNode = isNode;

/**
 * Contains a range of UTF-8 character offsets and token references that
 * identify the region of the source from which the AST derived.
 */
class Location {
  /**
   * The character offset at which this Node begins.
   */

  /**
   * The character offset at which this Node ends.
   */

  /**
   * The Token at which this Node begins.
   */

  /**
   * The Token at which this Node ends.
   */

  /**
   * The Source document the AST represents.
   */
  constructor(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }

  get [Symbol.toStringTag]() {
    return 'Location';
  }

  toJSON() {
    return {
      start: this.start,
      end: this.end,
    };
  }
}
/**
 * Represents a range of characters represented by a lexical token
 * within a Source.
 */

exports.Location = Location;

class Token {
  /**
   * The kind of Token.
   */

  /**
   * The character offset at which this Node begins.
   */

  /**
   * The character offset at which this Node ends.
   */

  /**
   * The 1-indexed line number on which this Token appears.
   */

  /**
   * The 1-indexed column number at which this Token begins.
   */

  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   *
   * Note: is undefined for punctuation tokens, but typed as string for
   * convenience in the parser.
   */

  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  constructor(kind, start, end, line, column, value) {
    this.kind = kind;
    this.start = start;
    this.end = end;
    this.line = line;
    this.column = column; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    this.value = value;
    this.prev = null;
    this.next = null;
  }

  get [Symbol.toStringTag]() {
    return 'Token';
  }

  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column,
    };
  }
}
/**
 * The list of all possible AST node types.
 */

exports.Token = Token;

/**
 * @internal
 */
const QueryDocumentKeys = {
  Name: [],
  Document: ['definitions'],
  OperationDefinition: [
    'name',
    'variableDefinitions',
    'directives',
    'selectionSet',
  ],
  VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
  Variable: ['name'],
  SelectionSet: ['selections'],
  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
  Argument: ['name', 'value'],
  FragmentSpread: ['name', 'directives'],
  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
  FragmentDefinition: [
    'name', // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    'variableDefinitions',
    'typeCondition',
    'directives',
    'selectionSet',
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ['values'],
  ObjectValue: ['fields'],
  ObjectField: ['name', 'value'],
  Directive: ['name', 'arguments'],
  NamedType: ['name'],
  ListType: ['type'],
  NonNullType: ['type'],
  SchemaDefinition: ['description', 'directives', 'operationTypes'],
  OperationTypeDefinition: ['type'],
  ScalarTypeDefinition: ['description', 'name', 'directives'],
  ObjectTypeDefinition: [
    'description',
    'name',
    'interfaces',
    'directives',
    'fields',
  ],
  FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
  InputValueDefinition: [
    'description',
    'name',
    'type',
    'defaultValue',
    'directives',
  ],
  InterfaceTypeDefinition: [
    'description',
    'name',
    'interfaces',
    'directives',
    'fields',
  ],
  UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
  EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
  EnumValueDefinition: ['description', 'name', 'directives'],
  InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
  DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
  SchemaExtension: ['directives', 'operationTypes'],
  ScalarTypeExtension: ['name', 'directives'],
  ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  UnionTypeExtension: ['name', 'directives', 'types'],
  EnumTypeExtension: ['name', 'directives', 'values'],
  InputObjectTypeExtension: ['name', 'directives', 'fields'],
};
exports.QueryDocumentKeys = QueryDocumentKeys;
const kindValues = new Set(Object.keys(QueryDocumentKeys));
/**
 * @internal
 */

function isNode(maybeNode) {
  const maybeKind =
    maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
  return typeof maybeKind === 'string' && kindValues.has(maybeKind);
}
/** Name */

let OperationTypeNode;
exports.OperationTypeNode = OperationTypeNode;

(function (OperationTypeNode) {
  OperationTypeNode['QUERY'] = 'query';
  OperationTypeNode['MUTATION'] = 'mutation';
  OperationTypeNode['SUBSCRIPTION'] = 'subscription';
})(OperationTypeNode || (exports.OperationTypeNode = OperationTypeNode = {}));

},{}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dedentBlockStringValue = dedentBlockStringValue;
exports.getBlockStringIndentation = getBlockStringIndentation;
exports.printBlockString = printBlockString;

/**
 * Produces the value of a block string from its parsed raw value, similar to
 * CoffeeScript's block string, Python's docstring trim or Ruby's strip_heredoc.
 *
 * This implements the GraphQL spec's BlockStringValue() static algorithm.
 *
 * @internal
 */
function dedentBlockStringValue(rawString) {
  // Expand a block string's raw value into independent lines.
  const lines = rawString.split(/\r\n|[\n\r]/g); // Remove common indentation from all lines but first.

  const commonIndent = getBlockStringIndentation(rawString);

  if (commonIndent !== 0) {
    for (let i = 1; i < lines.length; i++) {
      lines[i] = lines[i].slice(commonIndent);
    }
  } // Remove leading and trailing blank lines.

  let startLine = 0;

  while (startLine < lines.length && isBlank(lines[startLine])) {
    ++startLine;
  }

  let endLine = lines.length;

  while (endLine > startLine && isBlank(lines[endLine - 1])) {
    --endLine;
  } // Return a string of the lines joined with U+000A.

  return lines.slice(startLine, endLine).join('\n');
}

function isBlank(str) {
  for (const char of str) {
    if (char !== ' ' && char !== '\t') {
      return false;
    }
  }

  return true;
}
/**
 * @internal
 */

function getBlockStringIndentation(value) {
  var _commonIndent;

  let isFirstLine = true;
  let isEmptyLine = true;
  let indent = 0;
  let commonIndent = null;

  for (let i = 0; i < value.length; ++i) {
    switch (value.charCodeAt(i)) {
      case 13:
        //  \r
        if (value.charCodeAt(i + 1) === 10) {
          ++i; // skip \r\n as one symbol
        }

      // falls through

      case 10:
        //  \n
        isFirstLine = false;
        isEmptyLine = true;
        indent = 0;
        break;

      case 9: //   \t

      case 32:
        //  <space>
        ++indent;
        break;

      default:
        if (
          isEmptyLine &&
          !isFirstLine &&
          (commonIndent === null || indent < commonIndent)
        ) {
          commonIndent = indent;
        }

        isEmptyLine = false;
    }
  }

  return (_commonIndent = commonIndent) !== null && _commonIndent !== void 0
    ? _commonIndent
    : 0;
}
/**
 * Print a block string in the indented block form by adding a leading and
 * trailing blank line. However, if a block string starts with whitespace and is
 * a single-line, adding a leading blank line would strip that whitespace.
 *
 * @internal
 */

function printBlockString(value, preferMultipleLines = false) {
  const isSingleLine = !value.includes('\n');
  const hasLeadingSpace = value.startsWith(' ') || value.startsWith('\t');
  const hasTrailingQuote = value.endsWith('"');
  const hasTrailingSlash = value.endsWith('\\');
  const printAsMultipleLines =
    !isSingleLine ||
    hasTrailingQuote ||
    hasTrailingSlash ||
    preferMultipleLines;
  let result = ''; // Format a multi-line block quote to account for leading space.

  if (printAsMultipleLines && !(isSingleLine && hasLeadingSpace)) {
    result += '\n';
  }

  result += value;

  if (printAsMultipleLines) {
    result += '\n';
  }

  return '"""' + result.replace(/"""/g, '\\"""') + '"""';
}

},{}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.isDigit = isDigit;
exports.isLetter = isLetter;
exports.isNameContinue = isNameContinue;
exports.isNameStart = isNameStart;

/**
 * ```
 * Digit :: one of
 *   - `0` `1` `2` `3` `4` `5` `6` `7` `8` `9`
 * ```
 * @internal
 */
function isDigit(code) {
  return code >= 0x0030 && code <= 0x0039;
}
/**
 * ```
 * Letter :: one of
 *   - `A` `B` `C` `D` `E` `F` `G` `H` `I` `J` `K` `L` `M`
 *   - `N` `O` `P` `Q` `R` `S` `T` `U` `V` `W` `X` `Y` `Z`
 *   - `a` `b` `c` `d` `e` `f` `g` `h` `i` `j` `k` `l` `m`
 *   - `n` `o` `p` `q` `r` `s` `t` `u` `v` `w` `x` `y` `z`
 * ```
 * @internal
 */

function isLetter(code) {
  return (
    (code >= 0x0061 && code <= 0x007a) || // A-Z
    (code >= 0x0041 && code <= 0x005a) // a-z
  );
}
/**
 * ```
 * NameStart ::
 *   - Letter
 *   - `_`
 * ```
 * @internal
 */

function isNameStart(code) {
  return isLetter(code) || code === 0x005f;
}
/**
 * ```
 * NameContinue ::
 *   - Letter
 *   - Digit
 *   - `_`
 * ```
 * @internal
 */

function isNameContinue(code) {
  return isLetter(code) || isDigit(code) || code === 0x005f;
}

},{}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.DirectiveLocation = void 0;

/**
 * The set of allowed directive location values.
 */
let DirectiveLocation;
/**
 * The enum type representing the directive location values.
 *
 * @deprecated Please use `DirectiveLocation`. Will be remove in v17.
 */

exports.DirectiveLocation = DirectiveLocation;

(function (DirectiveLocation) {
  DirectiveLocation['QUERY'] = 'QUERY';
  DirectiveLocation['MUTATION'] = 'MUTATION';
  DirectiveLocation['SUBSCRIPTION'] = 'SUBSCRIPTION';
  DirectiveLocation['FIELD'] = 'FIELD';
  DirectiveLocation['FRAGMENT_DEFINITION'] = 'FRAGMENT_DEFINITION';
  DirectiveLocation['FRAGMENT_SPREAD'] = 'FRAGMENT_SPREAD';
  DirectiveLocation['INLINE_FRAGMENT'] = 'INLINE_FRAGMENT';
  DirectiveLocation['VARIABLE_DEFINITION'] = 'VARIABLE_DEFINITION';
  DirectiveLocation['SCHEMA'] = 'SCHEMA';
  DirectiveLocation['SCALAR'] = 'SCALAR';
  DirectiveLocation['OBJECT'] = 'OBJECT';
  DirectiveLocation['FIELD_DEFINITION'] = 'FIELD_DEFINITION';
  DirectiveLocation['ARGUMENT_DEFINITION'] = 'ARGUMENT_DEFINITION';
  DirectiveLocation['INTERFACE'] = 'INTERFACE';
  DirectiveLocation['UNION'] = 'UNION';
  DirectiveLocation['ENUM'] = 'ENUM';
  DirectiveLocation['ENUM_VALUE'] = 'ENUM_VALUE';
  DirectiveLocation['INPUT_OBJECT'] = 'INPUT_OBJECT';
  DirectiveLocation['INPUT_FIELD_DEFINITION'] = 'INPUT_FIELD_DEFINITION';
})(DirectiveLocation || (exports.DirectiveLocation = DirectiveLocation = {}));

},{}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'BREAK', {
  enumerable: true,
  get: function () {
    return _visitor.BREAK;
  },
});
Object.defineProperty(exports, 'DirectiveLocation', {
  enumerable: true,
  get: function () {
    return _directiveLocation.DirectiveLocation;
  },
});
Object.defineProperty(exports, 'Kind', {
  enumerable: true,
  get: function () {
    return _kinds.Kind;
  },
});
Object.defineProperty(exports, 'Lexer', {
  enumerable: true,
  get: function () {
    return _lexer.Lexer;
  },
});
Object.defineProperty(exports, 'Location', {
  enumerable: true,
  get: function () {
    return _ast.Location;
  },
});
Object.defineProperty(exports, 'OperationTypeNode', {
  enumerable: true,
  get: function () {
    return _ast.OperationTypeNode;
  },
});
Object.defineProperty(exports, 'Source', {
  enumerable: true,
  get: function () {
    return _source.Source;
  },
});
Object.defineProperty(exports, 'Token', {
  enumerable: true,
  get: function () {
    return _ast.Token;
  },
});
Object.defineProperty(exports, 'TokenKind', {
  enumerable: true,
  get: function () {
    return _tokenKind.TokenKind;
  },
});
Object.defineProperty(exports, 'getEnterLeaveForKind', {
  enumerable: true,
  get: function () {
    return _visitor.getEnterLeaveForKind;
  },
});
Object.defineProperty(exports, 'getLocation', {
  enumerable: true,
  get: function () {
    return _location.getLocation;
  },
});
Object.defineProperty(exports, 'getVisitFn', {
  enumerable: true,
  get: function () {
    return _visitor.getVisitFn;
  },
});
Object.defineProperty(exports, 'isConstValueNode', {
  enumerable: true,
  get: function () {
    return _predicates.isConstValueNode;
  },
});
Object.defineProperty(exports, 'isDefinitionNode', {
  enumerable: true,
  get: function () {
    return _predicates.isDefinitionNode;
  },
});
Object.defineProperty(exports, 'isExecutableDefinitionNode', {
  enumerable: true,
  get: function () {
    return _predicates.isExecutableDefinitionNode;
  },
});
Object.defineProperty(exports, 'isSelectionNode', {
  enumerable: true,
  get: function () {
    return _predicates.isSelectionNode;
  },
});
Object.defineProperty(exports, 'isTypeDefinitionNode', {
  enumerable: true,
  get: function () {
    return _predicates.isTypeDefinitionNode;
  },
});
Object.defineProperty(exports, 'isTypeExtensionNode', {
  enumerable: true,
  get: function () {
    return _predicates.isTypeExtensionNode;
  },
});
Object.defineProperty(exports, 'isTypeNode', {
  enumerable: true,
  get: function () {
    return _predicates.isTypeNode;
  },
});
Object.defineProperty(exports, 'isTypeSystemDefinitionNode', {
  enumerable: true,
  get: function () {
    return _predicates.isTypeSystemDefinitionNode;
  },
});
Object.defineProperty(exports, 'isTypeSystemExtensionNode', {
  enumerable: true,
  get: function () {
    return _predicates.isTypeSystemExtensionNode;
  },
});
Object.defineProperty(exports, 'isValueNode', {
  enumerable: true,
  get: function () {
    return _predicates.isValueNode;
  },
});
Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function () {
    return _parser.parse;
  },
});
Object.defineProperty(exports, 'parseConstValue', {
  enumerable: true,
  get: function () {
    return _parser.parseConstValue;
  },
});
Object.defineProperty(exports, 'parseType', {
  enumerable: true,
  get: function () {
    return _parser.parseType;
  },
});
Object.defineProperty(exports, 'parseValue', {
  enumerable: true,
  get: function () {
    return _parser.parseValue;
  },
});
Object.defineProperty(exports, 'print', {
  enumerable: true,
  get: function () {
    return _printer.print;
  },
});
Object.defineProperty(exports, 'printLocation', {
  enumerable: true,
  get: function () {
    return _printLocation.printLocation;
  },
});
Object.defineProperty(exports, 'printSourceLocation', {
  enumerable: true,
  get: function () {
    return _printLocation.printSourceLocation;
  },
});
Object.defineProperty(exports, 'visit', {
  enumerable: true,
  get: function () {
    return _visitor.visit;
  },
});
Object.defineProperty(exports, 'visitInParallel', {
  enumerable: true,
  get: function () {
    return _visitor.visitInParallel;
  },
});

var _source = require('./source.js');

var _location = require('./location.js');

var _printLocation = require('./printLocation.js');

var _kinds = require('./kinds.js');

var _tokenKind = require('./tokenKind.js');

var _lexer = require('./lexer.js');

var _parser = require('./parser.js');

var _printer = require('./printer.js');

var _visitor = require('./visitor.js');

var _ast = require('./ast.js');

var _predicates = require('./predicates.js');

var _directiveLocation = require('./directiveLocation.js');

},{"./ast.js":69,"./directiveLocation.js":72,"./kinds.js":74,"./lexer.js":75,"./location.js":76,"./parser.js":77,"./predicates.js":78,"./printLocation.js":79,"./printer.js":81,"./source.js":82,"./tokenKind.js":83,"./visitor.js":84}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.Kind = void 0;

/**
 * The set of allowed kind values for AST nodes.
 */
let Kind;
/**
 * The enum type representing the possible kind values of AST nodes.
 *
 * @deprecated Please use `Kind`. Will be remove in v17.
 */

exports.Kind = Kind;

(function (Kind) {
  Kind['NAME'] = 'Name';
  Kind['DOCUMENT'] = 'Document';
  Kind['OPERATION_DEFINITION'] = 'OperationDefinition';
  Kind['VARIABLE_DEFINITION'] = 'VariableDefinition';
  Kind['SELECTION_SET'] = 'SelectionSet';
  Kind['FIELD'] = 'Field';
  Kind['ARGUMENT'] = 'Argument';
  Kind['FRAGMENT_SPREAD'] = 'FragmentSpread';
  Kind['INLINE_FRAGMENT'] = 'InlineFragment';
  Kind['FRAGMENT_DEFINITION'] = 'FragmentDefinition';
  Kind['VARIABLE'] = 'Variable';
  Kind['INT'] = 'IntValue';
  Kind['FLOAT'] = 'FloatValue';
  Kind['STRING'] = 'StringValue';
  Kind['BOOLEAN'] = 'BooleanValue';
  Kind['NULL'] = 'NullValue';
  Kind['ENUM'] = 'EnumValue';
  Kind['LIST'] = 'ListValue';
  Kind['OBJECT'] = 'ObjectValue';
  Kind['OBJECT_FIELD'] = 'ObjectField';
  Kind['DIRECTIVE'] = 'Directive';
  Kind['NAMED_TYPE'] = 'NamedType';
  Kind['LIST_TYPE'] = 'ListType';
  Kind['NON_NULL_TYPE'] = 'NonNullType';
  Kind['SCHEMA_DEFINITION'] = 'SchemaDefinition';
  Kind['OPERATION_TYPE_DEFINITION'] = 'OperationTypeDefinition';
  Kind['SCALAR_TYPE_DEFINITION'] = 'ScalarTypeDefinition';
  Kind['OBJECT_TYPE_DEFINITION'] = 'ObjectTypeDefinition';
  Kind['FIELD_DEFINITION'] = 'FieldDefinition';
  Kind['INPUT_VALUE_DEFINITION'] = 'InputValueDefinition';
  Kind['INTERFACE_TYPE_DEFINITION'] = 'InterfaceTypeDefinition';
  Kind['UNION_TYPE_DEFINITION'] = 'UnionTypeDefinition';
  Kind['ENUM_TYPE_DEFINITION'] = 'EnumTypeDefinition';
  Kind['ENUM_VALUE_DEFINITION'] = 'EnumValueDefinition';
  Kind['INPUT_OBJECT_TYPE_DEFINITION'] = 'InputObjectTypeDefinition';
  Kind['DIRECTIVE_DEFINITION'] = 'DirectiveDefinition';
  Kind['SCHEMA_EXTENSION'] = 'SchemaExtension';
  Kind['SCALAR_TYPE_EXTENSION'] = 'ScalarTypeExtension';
  Kind['OBJECT_TYPE_EXTENSION'] = 'ObjectTypeExtension';
  Kind['INTERFACE_TYPE_EXTENSION'] = 'InterfaceTypeExtension';
  Kind['UNION_TYPE_EXTENSION'] = 'UnionTypeExtension';
  Kind['ENUM_TYPE_EXTENSION'] = 'EnumTypeExtension';
  Kind['INPUT_OBJECT_TYPE_EXTENSION'] = 'InputObjectTypeExtension';
})(Kind || (exports.Kind = Kind = {}));

},{}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.Lexer = void 0;
exports.isPunctuatorTokenKind = isPunctuatorTokenKind;

var _syntaxError = require('../error/syntaxError.js');

var _ast = require('./ast.js');

var _tokenKind = require('./tokenKind.js');

var _blockString = require('./blockString.js');

var _characterClasses = require('./characterClasses.js');

/**
 * Given a Source object, creates a Lexer for that source.
 * A Lexer is a stateful stream generator in that every time
 * it is advanced, it returns the next token in the Source. Assuming the
 * source lexes, the final Token emitted by the lexer will be of kind
 * EOF, after which the lexer will repeatedly return the same EOF token
 * whenever called.
 */
class Lexer {
  /**
   * The previously focused non-ignored token.
   */

  /**
   * The currently focused non-ignored token.
   */

  /**
   * The (1-indexed) line containing the current token.
   */

  /**
   * The character offset at which the current line begins.
   */
  constructor(source) {
    const startOfFileToken = new _ast.Token(
      _tokenKind.TokenKind.SOF,
      0,
      0,
      0,
      0,
    );
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }

  get [Symbol.toStringTag]() {
    return 'Lexer';
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */

  advance() {
    this.lastToken = this.token;
    const token = (this.token = this.lookahead());
    return token;
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */

  lookahead() {
    let token = this.token;

    if (token.kind !== _tokenKind.TokenKind.EOF) {
      do {
        if (token.next) {
          token = token.next;
        } else {
          // Read the next token and form a link in the token linked-list.
          const nextToken = readNextToken(this, token.end); // @ts-expect-error next is only mutable during parsing.

          token.next = nextToken; // @ts-expect-error prev is only mutable during parsing.

          nextToken.prev = token;
          token = nextToken;
        }
      } while (token.kind === _tokenKind.TokenKind.COMMENT);
    }

    return token;
  }
}
/**
 * @internal
 */

exports.Lexer = Lexer;

function isPunctuatorTokenKind(kind) {
  return (
    kind === _tokenKind.TokenKind.BANG ||
    kind === _tokenKind.TokenKind.DOLLAR ||
    kind === _tokenKind.TokenKind.AMP ||
    kind === _tokenKind.TokenKind.PAREN_L ||
    kind === _tokenKind.TokenKind.PAREN_R ||
    kind === _tokenKind.TokenKind.SPREAD ||
    kind === _tokenKind.TokenKind.COLON ||
    kind === _tokenKind.TokenKind.EQUALS ||
    kind === _tokenKind.TokenKind.AT ||
    kind === _tokenKind.TokenKind.BRACKET_L ||
    kind === _tokenKind.TokenKind.BRACKET_R ||
    kind === _tokenKind.TokenKind.BRACE_L ||
    kind === _tokenKind.TokenKind.PIPE ||
    kind === _tokenKind.TokenKind.BRACE_R
  );
}
/**
 * A Unicode scalar value is any Unicode code point except surrogate code
 * points. In other words, the inclusive ranges of values 0x0000 to 0xD7FF and
 * 0xE000 to 0x10FFFF.
 *
 * SourceCharacter ::
 *   - "Any Unicode scalar value"
 */

function isUnicodeScalarValue(code) {
  return (
    (code >= 0x0000 && code <= 0xd7ff) || (code >= 0xe000 && code <= 0x10ffff)
  );
}
/**
 * The GraphQL specification defines source text as a sequence of unicode scalar
 * values (which Unicode defines to exclude surrogate code points). However
 * JavaScript defines strings as a sequence of UTF-16 code units which may
 * include surrogates. A surrogate pair is a valid source character as it
 * encodes a supplementary code point (above U+FFFF), but unpaired surrogate
 * code points are not valid source characters.
 */

function isSupplementaryCodePoint(body, location) {
  return (
    isLeadingSurrogate(body.charCodeAt(location)) &&
    isTrailingSurrogate(body.charCodeAt(location + 1))
  );
}

function isLeadingSurrogate(code) {
  return code >= 0xd800 && code <= 0xdbff;
}

function isTrailingSurrogate(code) {
  return code >= 0xdc00 && code <= 0xdfff;
}
/**
 * Prints the code point (or end of file reference) at a given location in a
 * source for use in error messages.
 *
 * Printable ASCII is printed quoted, while other points are printed in Unicode
 * code point form (ie. U+1234).
 */

function printCodePointAt(lexer, location) {
  const code = lexer.source.body.codePointAt(location);

  if (code === undefined) {
    return _tokenKind.TokenKind.EOF;
  } else if (code >= 0x0020 && code <= 0x007e) {
    // Printable ASCII
    const char = String.fromCodePoint(code);
    return char === '"' ? "'\"'" : `"${char}"`;
  } // Unicode code point

  return 'U+' + code.toString(16).toUpperCase().padStart(4, '0');
}
/**
 * Create a token with line and column location information.
 */

function createToken(lexer, kind, start, end, value) {
  const line = lexer.line;
  const col = 1 + start - lexer.lineStart;
  return new _ast.Token(kind, start, end, line, col, value);
}
/**
 * Gets the next token from the source starting at the given position.
 *
 * This skips over whitespace until it finds the next lexable token, then lexes
 * punctuators immediately or calls the appropriate helper function for more
 * complicated tokens.
 */

function readNextToken(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start;

  while (position < bodyLength) {
    const code = body.charCodeAt(position); // SourceCharacter

    switch (code) {
      // Ignored ::
      //   - UnicodeBOM
      //   - WhiteSpace
      //   - LineTerminator
      //   - Comment
      //   - Comma
      //
      // UnicodeBOM :: "Byte Order Mark (U+FEFF)"
      //
      // WhiteSpace ::
      //   - "Horizontal Tab (U+0009)"
      //   - "Space (U+0020)"
      //
      // Comma :: ,
      case 0xfeff: // <BOM>

      case 0x0009: // \t

      case 0x0020: // <space>

      case 0x002c:
        // ,
        ++position;
        continue;
      // LineTerminator ::
      //   - "New Line (U+000A)"
      //   - "Carriage Return (U+000D)" [lookahead != "New Line (U+000A)"]
      //   - "Carriage Return (U+000D)" "New Line (U+000A)"

      case 0x000a:
        // \n
        ++position;
        ++lexer.line;
        lexer.lineStart = position;
        continue;

      case 0x000d:
        // \r
        if (body.charCodeAt(position + 1) === 0x000a) {
          position += 2;
        } else {
          ++position;
        }

        ++lexer.line;
        lexer.lineStart = position;
        continue;
      // Comment

      case 0x0023:
        // #
        return readComment(lexer, position);
      // Token ::
      //   - Punctuator
      //   - Name
      //   - IntValue
      //   - FloatValue
      //   - StringValue
      //
      // Punctuator :: one of ! $ & ( ) ... : = @ [ ] { | }

      case 0x0021:
        // !
        return createToken(
          lexer,
          _tokenKind.TokenKind.BANG,
          position,
          position + 1,
        );

      case 0x0024:
        // $
        return createToken(
          lexer,
          _tokenKind.TokenKind.DOLLAR,
          position,
          position + 1,
        );

      case 0x0026:
        // &
        return createToken(
          lexer,
          _tokenKind.TokenKind.AMP,
          position,
          position + 1,
        );

      case 0x0028:
        // (
        return createToken(
          lexer,
          _tokenKind.TokenKind.PAREN_L,
          position,
          position + 1,
        );

      case 0x0029:
        // )
        return createToken(
          lexer,
          _tokenKind.TokenKind.PAREN_R,
          position,
          position + 1,
        );

      case 0x002e:
        // .
        if (
          body.charCodeAt(position + 1) === 0x002e &&
          body.charCodeAt(position + 2) === 0x002e
        ) {
          return createToken(
            lexer,
            _tokenKind.TokenKind.SPREAD,
            position,
            position + 3,
          );
        }

        break;

      case 0x003a:
        // :
        return createToken(
          lexer,
          _tokenKind.TokenKind.COLON,
          position,
          position + 1,
        );

      case 0x003d:
        // =
        return createToken(
          lexer,
          _tokenKind.TokenKind.EQUALS,
          position,
          position + 1,
        );

      case 0x0040:
        // @
        return createToken(
          lexer,
          _tokenKind.TokenKind.AT,
          position,
          position + 1,
        );

      case 0x005b:
        // [
        return createToken(
          lexer,
          _tokenKind.TokenKind.BRACKET_L,
          position,
          position + 1,
        );

      case 0x005d:
        // ]
        return createToken(
          lexer,
          _tokenKind.TokenKind.BRACKET_R,
          position,
          position + 1,
        );

      case 0x007b:
        // {
        return createToken(
          lexer,
          _tokenKind.TokenKind.BRACE_L,
          position,
          position + 1,
        );

      case 0x007c:
        // |
        return createToken(
          lexer,
          _tokenKind.TokenKind.PIPE,
          position,
          position + 1,
        );

      case 0x007d:
        // }
        return createToken(
          lexer,
          _tokenKind.TokenKind.BRACE_R,
          position,
          position + 1,
        );
      // StringValue

      case 0x0022:
        // "
        if (
          body.charCodeAt(position + 1) === 0x0022 &&
          body.charCodeAt(position + 2) === 0x0022
        ) {
          return readBlockString(lexer, position);
        }

        return readString(lexer, position);
    } // IntValue | FloatValue (Digit | -)

    if ((0, _characterClasses.isDigit)(code) || code === 0x002d) {
      return readNumber(lexer, position, code);
    } // Name

    if ((0, _characterClasses.isNameStart)(code)) {
      return readName(lexer, position);
    }

    throw (0, _syntaxError.syntaxError)(
      lexer.source,
      position,
      code === 0x0027
        ? 'Unexpected single quote character (\'), did you mean to use a double quote (")?'
        : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position)
        ? `Unexpected character: ${printCodePointAt(lexer, position)}.`
        : `Invalid character: ${printCodePointAt(lexer, position)}.`,
    );
  }

  return createToken(lexer, _tokenKind.TokenKind.EOF, bodyLength, bodyLength);
}
/**
 * Reads a comment token from the source file.
 *
 * ```
 * Comment :: # CommentChar* [lookahead != CommentChar]
 *
 * CommentChar :: SourceCharacter but not LineTerminator
 * ```
 */

function readComment(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;

  while (position < bodyLength) {
    const code = body.charCodeAt(position); // LineTerminator (\n | \r)

    if (code === 0x000a || code === 0x000d) {
      break;
    } // SourceCharacter

    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      break;
    }
  }

  return createToken(
    lexer,
    _tokenKind.TokenKind.COMMENT,
    start,
    position,
    body.slice(start + 1, position),
  );
}
/**
 * Reads a number token from the source file, either a FloatValue or an IntValue
 * depending on whether a FractionalPart or ExponentPart is encountered.
 *
 * ```
 * IntValue :: IntegerPart [lookahead != {Digit, `.`, NameStart}]
 *
 * IntegerPart ::
 *   - NegativeSign? 0
 *   - NegativeSign? NonZeroDigit Digit*
 *
 * NegativeSign :: -
 *
 * NonZeroDigit :: Digit but not `0`
 *
 * FloatValue ::
 *   - IntegerPart FractionalPart ExponentPart [lookahead != {Digit, `.`, NameStart}]
 *   - IntegerPart FractionalPart [lookahead != {Digit, `.`, NameStart}]
 *   - IntegerPart ExponentPart [lookahead != {Digit, `.`, NameStart}]
 *
 * FractionalPart :: . Digit+
 *
 * ExponentPart :: ExponentIndicator Sign? Digit+
 *
 * ExponentIndicator :: one of `e` `E`
 *
 * Sign :: one of + -
 * ```
 */

function readNumber(lexer, start, firstCode) {
  const body = lexer.source.body;
  let position = start;
  let code = firstCode;
  let isFloat = false; // NegativeSign (-)

  if (code === 0x002d) {
    code = body.charCodeAt(++position);
  } // Zero (0)

  if (code === 0x0030) {
    code = body.charCodeAt(++position);

    if ((0, _characterClasses.isDigit)(code)) {
      throw (0, _syntaxError.syntaxError)(
        lexer.source,
        position,
        `Invalid number, unexpected digit after 0: ${printCodePointAt(
          lexer,
          position,
        )}.`,
      );
    }
  } else {
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  } // Full stop (.)

  if (code === 0x002e) {
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  } // E e

  if (code === 0x0045 || code === 0x0065) {
    isFloat = true;
    code = body.charCodeAt(++position); // + -

    if (code === 0x002b || code === 0x002d) {
      code = body.charCodeAt(++position);
    }

    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  } // Numbers cannot be followed by . or NameStart

  if (code === 0x002e || (0, _characterClasses.isNameStart)(code)) {
    throw (0, _syntaxError.syntaxError)(
      lexer.source,
      position,
      `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        position,
      )}.`,
    );
  }

  return createToken(
    lexer,
    isFloat ? _tokenKind.TokenKind.FLOAT : _tokenKind.TokenKind.INT,
    start,
    position,
    body.slice(start, position),
  );
}
/**
 * Returns the new position in the source after reading one or more digits.
 */

function readDigits(lexer, start, firstCode) {
  if (!(0, _characterClasses.isDigit)(firstCode)) {
    throw (0, _syntaxError.syntaxError)(
      lexer.source,
      start,
      `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        start,
      )}.`,
    );
  }

  const body = lexer.source.body;
  let position = start + 1; // +1 to skip first firstCode

  while ((0, _characterClasses.isDigit)(body.charCodeAt(position))) {
    ++position;
  }

  return position;
}
/**
 * Reads a single-quote string token from the source file.
 *
 * ```
 * StringValue ::
 *   - `""` [lookahead != `"`]
 *   - `"` StringCharacter+ `"`
 *
 * StringCharacter ::
 *   - SourceCharacter but not `"` or `\` or LineTerminator
 *   - `\u` EscapedUnicode
 *   - `\` EscapedCharacter
 *
 * EscapedUnicode ::
 *   - `{` HexDigit+ `}`
 *   - HexDigit HexDigit HexDigit HexDigit
 *
 * EscapedCharacter :: one of `"` `\` `/` `b` `f` `n` `r` `t`
 * ```
 */

function readString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  let chunkStart = position;
  let value = '';

  while (position < bodyLength) {
    const code = body.charCodeAt(position); // Closing Quote (")

    if (code === 0x0022) {
      value += body.slice(chunkStart, position);
      return createToken(
        lexer,
        _tokenKind.TokenKind.STRING,
        start,
        position + 1,
        value,
      );
    } // Escape Sequence (\)

    if (code === 0x005c) {
      value += body.slice(chunkStart, position);
      const escape =
        body.charCodeAt(position + 1) === 0x0075 // u
          ? body.charCodeAt(position + 2) === 0x007b // {
            ? readEscapedUnicodeVariableWidth(lexer, position)
            : readEscapedUnicodeFixedWidth(lexer, position)
          : readEscapedCharacter(lexer, position);
      value += escape.value;
      position += escape.size;
      chunkStart = position;
      continue;
    } // LineTerminator (\n | \r)

    if (code === 0x000a || code === 0x000d) {
      break;
    } // SourceCharacter

    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw (0, _syntaxError.syntaxError)(
        lexer.source,
        position,
        `Invalid character within String: ${printCodePointAt(
          lexer,
          position,
        )}.`,
      );
    }
  }

  throw (0, _syntaxError.syntaxError)(
    lexer.source,
    position,
    'Unterminated string.',
  );
} // The string value and lexed size of an escape sequence.

function readEscapedUnicodeVariableWidth(lexer, position) {
  const body = lexer.source.body;
  let point = 0;
  let size = 3; // Cannot be larger than 12 chars (\u{00000000}).

  while (size < 12) {
    const code = body.charCodeAt(position + size++); // Closing Brace (})

    if (code === 0x007d) {
      // Must be at least 5 chars (\u{0}) and encode a Unicode scalar value.
      if (size < 5 || !isUnicodeScalarValue(point)) {
        break;
      }

      return {
        value: String.fromCodePoint(point),
        size,
      };
    } // Append this hex digit to the code point.

    point = (point << 4) | readHexDigit(code);

    if (point < 0) {
      break;
    }
  }

  throw (0, _syntaxError.syntaxError)(
    lexer.source,
    position,
    `Invalid Unicode escape sequence: "${body.slice(
      position,
      position + size,
    )}".`,
  );
}

function readEscapedUnicodeFixedWidth(lexer, position) {
  const body = lexer.source.body;
  const code = read16BitHexCode(body, position + 2);

  if (isUnicodeScalarValue(code)) {
    return {
      value: String.fromCodePoint(code),
      size: 6,
    };
  } // GraphQL allows JSON-style surrogate pair escape sequences, but only when
  // a valid pair is formed.

  if (isLeadingSurrogate(code)) {
    // \u
    if (
      body.charCodeAt(position + 6) === 0x005c &&
      body.charCodeAt(position + 7) === 0x0075
    ) {
      const trailingCode = read16BitHexCode(body, position + 8);

      if (isTrailingSurrogate(trailingCode)) {
        // JavaScript defines strings as a sequence of UTF-16 code units and
        // encodes Unicode code points above U+FFFF using a surrogate pair of
        // code units. Since this is a surrogate pair escape sequence, just
        // include both codes into the JavaScript string value. Had JavaScript
        // not been internally based on UTF-16, then this surrogate pair would
        // be decoded to retrieve the supplementary code point.
        return {
          value: String.fromCodePoint(code, trailingCode),
          size: 12,
        };
      }
    }
  }

  throw (0, _syntaxError.syntaxError)(
    lexer.source,
    position,
    `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`,
  );
}
/**
 * Reads four hexadecimal characters and returns the positive integer that 16bit
 * hexadecimal string represents. For example, "000f" will return 15, and "dead"
 * will return 57005.
 *
 * Returns a negative number if any char was not a valid hexadecimal digit.
 */

function read16BitHexCode(body, position) {
  // readHexDigit() returns -1 on error. ORing a negative value with any other
  // value always produces a negative value.
  return (
    (readHexDigit(body.charCodeAt(position)) << 12) |
    (readHexDigit(body.charCodeAt(position + 1)) << 8) |
    (readHexDigit(body.charCodeAt(position + 2)) << 4) |
    readHexDigit(body.charCodeAt(position + 3))
  );
}
/**
 * Reads a hexadecimal character and returns its positive integer value (0-15).
 *
 * '0' becomes 0, '9' becomes 9
 * 'A' becomes 10, 'F' becomes 15
 * 'a' becomes 10, 'f' becomes 15
 *
 * Returns -1 if the provided character code was not a valid hexadecimal digit.
 *
 * HexDigit :: one of
 *   - `0` `1` `2` `3` `4` `5` `6` `7` `8` `9`
 *   - `A` `B` `C` `D` `E` `F`
 *   - `a` `b` `c` `d` `e` `f`
 */

function readHexDigit(code) {
  return code >= 0x0030 && code <= 0x0039 // 0-9
    ? code - 0x0030
    : code >= 0x0041 && code <= 0x0046 // A-F
    ? code - 0x0037
    : code >= 0x0061 && code <= 0x0066 // a-f
    ? code - 0x0057
    : -1;
}
/**
 * | Escaped Character | Code Point | Character Name               |
 * | ----------------- | ---------- | ---------------------------- |
 * | `"`               | U+0022     | double quote                 |
 * | `\`               | U+005C     | reverse solidus (back slash) |
 * | `/`               | U+002F     | solidus (forward slash)      |
 * | `b`               | U+0008     | backspace                    |
 * | `f`               | U+000C     | form feed                    |
 * | `n`               | U+000A     | line feed (new line)         |
 * | `r`               | U+000D     | carriage return              |
 * | `t`               | U+0009     | horizontal tab               |
 */

function readEscapedCharacter(lexer, position) {
  const body = lexer.source.body;
  const code = body.charCodeAt(position + 1);

  switch (code) {
    case 0x0022:
      // "
      return {
        value: '\u0022',
        size: 2,
      };

    case 0x005c:
      // \
      return {
        value: '\u005c',
        size: 2,
      };

    case 0x002f:
      // /
      return {
        value: '\u002f',
        size: 2,
      };

    case 0x0062:
      // b
      return {
        value: '\u0008',
        size: 2,
      };

    case 0x0066:
      // f
      return {
        value: '\u000c',
        size: 2,
      };

    case 0x006e:
      // n
      return {
        value: '\u000a',
        size: 2,
      };

    case 0x0072:
      // r
      return {
        value: '\u000d',
        size: 2,
      };

    case 0x0074:
      // t
      return {
        value: '\u0009',
        size: 2,
      };
  }

  throw (0, _syntaxError.syntaxError)(
    lexer.source,
    position,
    `Invalid character escape sequence: "${body.slice(
      position,
      position + 2,
    )}".`,
  );
}
/**
 * Reads a block string token from the source file.
 *
 * ```
 * StringValue ::
 *   - `"""` BlockStringCharacter* `"""`
 *
 * BlockStringCharacter ::
 *   - SourceCharacter but not `"""` or `\"""`
 *   - `\"""`
 * ```
 */

function readBlockString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  const startLine = lexer.line;
  const startColumn = 1 + start - lexer.lineStart;
  let position = start + 3;
  let chunkStart = position;
  let rawValue = '';

  while (position < bodyLength) {
    const code = body.charCodeAt(position); // Closing Triple-Quote (""")

    if (
      code === 0x0022 &&
      body.charCodeAt(position + 1) === 0x0022 &&
      body.charCodeAt(position + 2) === 0x0022
    ) {
      rawValue += body.slice(chunkStart, position);
      return new _ast.Token(
        _tokenKind.TokenKind.BLOCK_STRING,
        start,
        position + 3,
        startLine,
        startColumn,
        (0, _blockString.dedentBlockStringValue)(rawValue),
      );
    } // Escaped Triple-Quote (\""")

    if (
      code === 0x005c &&
      body.charCodeAt(position + 1) === 0x0022 &&
      body.charCodeAt(position + 2) === 0x0022 &&
      body.charCodeAt(position + 3) === 0x0022
    ) {
      rawValue += body.slice(chunkStart, position) + '"""';
      position += 4;
      chunkStart = position;
      continue;
    } // LineTerminator

    if (code === 0x000a || code === 0x000d) {
      if (code === 0x000d && body.charCodeAt(position + 1) === 0x000a) {
        position += 2;
      } else {
        ++position;
      }

      ++lexer.line;
      lexer.lineStart = position;
      continue;
    } // SourceCharacter

    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw (0, _syntaxError.syntaxError)(
        lexer.source,
        position,
        `Invalid character within String: ${printCodePointAt(
          lexer,
          position,
        )}.`,
      );
    }
  }

  throw (0, _syntaxError.syntaxError)(
    lexer.source,
    position,
    'Unterminated string.',
  );
}
/**
 * Reads an alphanumeric + underscore name from the source.
 *
 * ```
 * Name ::
 *   - NameStart NameContinue* [lookahead != NameContinue]
 * ```
 */

function readName(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;

  while (position < bodyLength) {
    const code = body.charCodeAt(position);

    if ((0, _characterClasses.isNameContinue)(code)) {
      ++position;
    } else {
      break;
    }
  }

  return createToken(
    lexer,
    _tokenKind.TokenKind.NAME,
    start,
    position,
    body.slice(start, position),
  );
}

},{"../error/syntaxError.js":38,"./ast.js":69,"./blockString.js":70,"./characterClasses.js":71,"./tokenKind.js":83}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getLocation = getLocation;

var _invariant = require('../jsutils/invariant.js');

const LineRegExp = /\r\n|[\n\r]/g;
/**
 * Represents a location in a Source.
 */

/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */
function getLocation(source, position) {
  let lastLineStart = 0;
  let line = 1;

  for (const match of source.body.matchAll(LineRegExp)) {
    typeof match.index === 'number' || (0, _invariant.invariant)(false);

    if (match.index >= position) {
      break;
    }

    lastLineStart = match.index + match[0].length;
    line += 1;
  }

  return {
    line,
    column: position + 1 - lastLineStart,
  };
}

},{"../jsutils/invariant.js":54}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.Parser = void 0;
exports.parse = parse;
exports.parseConstValue = parseConstValue;
exports.parseType = parseType;
exports.parseValue = parseValue;

var _syntaxError = require('../error/syntaxError.js');

var _kinds = require('./kinds.js');

var _ast = require('./ast.js');

var _tokenKind = require('./tokenKind.js');

var _source = require('./source.js');

var _directiveLocation = require('./directiveLocation.js');

var _lexer = require('./lexer.js');

/**
 * Given a GraphQL source, parses it into a Document.
 * Throws GraphQLError if a syntax error is encountered.
 */
function parse(source, options) {
  const parser = new Parser(source, options);
  return parser.parseDocument();
}
/**
 * Given a string containing a GraphQL value (ex. `[42]`), parse the AST for
 * that value.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Values directly and
 * in isolation of complete GraphQL documents.
 *
 * Consider providing the results to the utility function: valueFromAST().
 */

function parseValue(source, options) {
  const parser = new Parser(source, options);
  parser.expectToken(_tokenKind.TokenKind.SOF);
  const value = parser.parseValueLiteral(false);
  parser.expectToken(_tokenKind.TokenKind.EOF);
  return value;
}
/**
 * Similar to parseValue(), but raises a parse error if it encounters a
 * variable. The return type will be a constant value.
 */

function parseConstValue(source, options) {
  const parser = new Parser(source, options);
  parser.expectToken(_tokenKind.TokenKind.SOF);
  const value = parser.parseConstValueLiteral();
  parser.expectToken(_tokenKind.TokenKind.EOF);
  return value;
}
/**
 * Given a string containing a GraphQL Type (ex. `[Int!]`), parse the AST for
 * that type.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Types directly and
 * in isolation of complete GraphQL documents.
 *
 * Consider providing the results to the utility function: typeFromAST().
 */

function parseType(source, options) {
  const parser = new Parser(source, options);
  parser.expectToken(_tokenKind.TokenKind.SOF);
  const type = parser.parseTypeReference();
  parser.expectToken(_tokenKind.TokenKind.EOF);
  return type;
}
/**
 * This class is exported only to assist people in implementing their own parsers
 * without duplicating too much code and should be used only as last resort for cases
 * such as experimental syntax or if certain features could not be contributed upstream.
 *
 * It is still part of the internal API and is versioned, so any changes to it are never
 * considered breaking changes. If you still need to support multiple versions of the
 * library, please use the `versionInfo` variable for version detection.
 *
 * @internal
 */

class Parser {
  constructor(source, options) {
    const sourceObj = (0, _source.isSource)(source)
      ? source
      : new _source.Source(source);
    this._lexer = new _lexer.Lexer(sourceObj);
    this._options = options;
  }
  /**
   * Converts a name lex token into a name parse node.
   */

  parseName() {
    const token = this.expectToken(_tokenKind.TokenKind.NAME);
    return this.node(token, {
      kind: _kinds.Kind.NAME,
      value: token.value,
    });
  } // Implements the parsing rules in the Document section.

  /**
   * Document : Definition+
   */

  parseDocument() {
    return this.node(this._lexer.token, {
      kind: _kinds.Kind.DOCUMENT,
      definitions: this.many(
        _tokenKind.TokenKind.SOF,
        this.parseDefinition,
        _tokenKind.TokenKind.EOF,
      ),
    });
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   *
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */

  parseDefinition() {
    if (this.peek(_tokenKind.TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    } // Many definitions begin with a description and require a lookahead.

    const hasDescription = this.peekDescription();
    const keywordToken = hasDescription
      ? this._lexer.lookahead()
      : this._lexer.token;

    if (keywordToken.kind === _tokenKind.TokenKind.NAME) {
      switch (keywordToken.value) {
        case 'schema':
          return this.parseSchemaDefinition();

        case 'scalar':
          return this.parseScalarTypeDefinition();

        case 'type':
          return this.parseObjectTypeDefinition();

        case 'interface':
          return this.parseInterfaceTypeDefinition();

        case 'union':
          return this.parseUnionTypeDefinition();

        case 'enum':
          return this.parseEnumTypeDefinition();

        case 'input':
          return this.parseInputObjectTypeDefinition();

        case 'directive':
          return this.parseDirectiveDefinition();
      }

      if (hasDescription) {
        throw (0, _syntaxError.syntaxError)(
          this._lexer.source,
          this._lexer.token.start,
          'Unexpected description, descriptions are supported only on type definitions.',
        );
      }

      switch (keywordToken.value) {
        case 'query':
        case 'mutation':
        case 'subscription':
          return this.parseOperationDefinition();

        case 'fragment':
          return this.parseFragmentDefinition();

        case 'extend':
          return this.parseTypeSystemExtension();
      }
    }

    throw this.unexpected(keywordToken);
  } // Implements the parsing rules in the Operations section.

  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */

  parseOperationDefinition() {
    const start = this._lexer.token;

    if (this.peek(_tokenKind.TokenKind.BRACE_L)) {
      return this.node(start, {
        kind: _kinds.Kind.OPERATION_DEFINITION,
        operation: _ast.OperationTypeNode.QUERY,
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet(),
      });
    }

    const operation = this.parseOperationType();
    let name;

    if (this.peek(_tokenKind.TokenKind.NAME)) {
      name = this.parseName();
    }

    return this.node(start, {
      kind: _kinds.Kind.OPERATION_DEFINITION,
      operation,
      name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
    });
  }
  /**
   * OperationType : one of query mutation subscription
   */

  parseOperationType() {
    const operationToken = this.expectToken(_tokenKind.TokenKind.NAME);

    switch (operationToken.value) {
      case 'query':
        return _ast.OperationTypeNode.QUERY;

      case 'mutation':
        return _ast.OperationTypeNode.MUTATION;

      case 'subscription':
        return _ast.OperationTypeNode.SUBSCRIPTION;
    }

    throw this.unexpected(operationToken);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */

  parseVariableDefinitions() {
    return this.optionalMany(
      _tokenKind.TokenKind.PAREN_L,
      this.parseVariableDefinition,
      _tokenKind.TokenKind.PAREN_R,
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */

  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: _kinds.Kind.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type:
        (this.expectToken(_tokenKind.TokenKind.COLON),
        this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(_tokenKind.TokenKind.EQUALS)
        ? this.parseConstValueLiteral()
        : undefined,
      directives: this.parseConstDirectives(),
    });
  }
  /**
   * Variable : $ Name
   */

  parseVariable() {
    const start = this._lexer.token;
    this.expectToken(_tokenKind.TokenKind.DOLLAR);
    return this.node(start, {
      kind: _kinds.Kind.VARIABLE,
      name: this.parseName(),
    });
  }
  /**
   * ```
   * SelectionSet : { Selection+ }
   * ```
   */

  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: _kinds.Kind.SELECTION_SET,
      selections: this.many(
        _tokenKind.TokenKind.BRACE_L,
        this.parseSelection,
        _tokenKind.TokenKind.BRACE_R,
      ),
    });
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */

  parseSelection() {
    return this.peek(_tokenKind.TokenKind.SPREAD)
      ? this.parseFragment()
      : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */

  parseField() {
    const start = this._lexer.token;
    const nameOrAlias = this.parseName();
    let alias;
    let name;

    if (this.expectOptionalToken(_tokenKind.TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }

    return this.node(start, {
      kind: _kinds.Kind.FIELD,
      alias,
      name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(_tokenKind.TokenKind.BRACE_L)
        ? this.parseSelectionSet()
        : undefined,
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */

  parseArguments(isConst) {
    const item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(
      _tokenKind.TokenKind.PAREN_L,
      item,
      _tokenKind.TokenKind.PAREN_R,
    );
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */

  parseArgument(isConst = false) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(_tokenKind.TokenKind.COLON);
    return this.node(start, {
      kind: _kinds.Kind.ARGUMENT,
      name,
      value: this.parseValueLiteral(isConst),
    });
  }

  parseConstArgument() {
    return this.parseArgument(true);
  } // Implements the parsing rules in the Fragments section.

  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */

  parseFragment() {
    const start = this._lexer.token;
    this.expectToken(_tokenKind.TokenKind.SPREAD);
    const hasTypeCondition = this.expectOptionalKeyword('on');

    if (!hasTypeCondition && this.peek(_tokenKind.TokenKind.NAME)) {
      return this.node(start, {
        kind: _kinds.Kind.FRAGMENT_SPREAD,
        name: this.parseFragmentName(),
        directives: this.parseDirectives(false),
      });
    }

    return this.node(start, {
      kind: _kinds.Kind.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : undefined,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
    });
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */

  parseFragmentDefinition() {
    var _this$_options;

    const start = this._lexer.token;
    this.expectKeyword('fragment'); // Legacy support for defining variables within fragments changes
    // the grammar of FragmentDefinition:
    //   - fragment FragmentName VariableDefinitions? on TypeCondition Directives? SelectionSet

    if (
      ((_this$_options = this._options) === null || _this$_options === void 0
        ? void 0
        : _this$_options.allowLegacyFragmentVariables) === true
    ) {
      return this.node(start, {
        kind: _kinds.Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet(),
      });
    }

    return this.node(start, {
      kind: _kinds.Kind.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
    });
  }
  /**
   * FragmentName : Name but not `on`
   */

  parseFragmentName() {
    if (this._lexer.token.value === 'on') {
      throw this.unexpected();
    }

    return this.parseName();
  } // Implements the parsing rules in the Values section.

  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */

  parseValueLiteral(isConst) {
    const token = this._lexer.token;

    switch (token.kind) {
      case _tokenKind.TokenKind.BRACKET_L:
        return this.parseList(isConst);

      case _tokenKind.TokenKind.BRACE_L:
        return this.parseObject(isConst);

      case _tokenKind.TokenKind.INT:
        this._lexer.advance();

        return this.node(token, {
          kind: _kinds.Kind.INT,
          value: token.value,
        });

      case _tokenKind.TokenKind.FLOAT:
        this._lexer.advance();

        return this.node(token, {
          kind: _kinds.Kind.FLOAT,
          value: token.value,
        });

      case _tokenKind.TokenKind.STRING:
      case _tokenKind.TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();

      case _tokenKind.TokenKind.NAME:
        this._lexer.advance();

        switch (token.value) {
          case 'true':
            return this.node(token, {
              kind: _kinds.Kind.BOOLEAN,
              value: true,
            });

          case 'false':
            return this.node(token, {
              kind: _kinds.Kind.BOOLEAN,
              value: false,
            });

          case 'null':
            return this.node(token, {
              kind: _kinds.Kind.NULL,
            });

          default:
            return this.node(token, {
              kind: _kinds.Kind.ENUM,
              value: token.value,
            });
        }

      case _tokenKind.TokenKind.DOLLAR:
        if (isConst) {
          this.expectToken(_tokenKind.TokenKind.DOLLAR);

          if (this._lexer.token.kind === _tokenKind.TokenKind.NAME) {
            const varName = this._lexer.token.value;
            throw (0, _syntaxError.syntaxError)(
              this._lexer.source,
              token.start,
              `Unexpected variable "$${varName}" in constant value.`,
            );
          } else {
            throw this.unexpected(token);
          }
        }

        return this.parseVariable();
    }

    throw this.unexpected();
  }

  parseConstValueLiteral() {
    return this.parseValueLiteral(true);
  }

  parseStringLiteral() {
    const token = this._lexer.token;

    this._lexer.advance();

    return this.node(token, {
      kind: _kinds.Kind.STRING,
      value: token.value,
      block: token.kind === _tokenKind.TokenKind.BLOCK_STRING,
    });
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */

  parseList(isConst) {
    const item = () => this.parseValueLiteral(isConst);

    return this.node(this._lexer.token, {
      kind: _kinds.Kind.LIST,
      values: this.any(
        _tokenKind.TokenKind.BRACKET_L,
        item,
        _tokenKind.TokenKind.BRACKET_R,
      ),
    });
  }
  /**
   * ```
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   * ```
   */

  parseObject(isConst) {
    const item = () => this.parseObjectField(isConst);

    return this.node(this._lexer.token, {
      kind: _kinds.Kind.OBJECT,
      fields: this.any(
        _tokenKind.TokenKind.BRACE_L,
        item,
        _tokenKind.TokenKind.BRACE_R,
      ),
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */

  parseObjectField(isConst) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(_tokenKind.TokenKind.COLON);
    return this.node(start, {
      kind: _kinds.Kind.OBJECT_FIELD,
      name,
      value: this.parseValueLiteral(isConst),
    });
  } // Implements the parsing rules in the Directives section.

  /**
   * Directives[Const] : Directive[?Const]+
   */

  parseDirectives(isConst) {
    const directives = [];

    while (this.peek(_tokenKind.TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }

    return directives;
  }

  parseConstDirectives() {
    return this.parseDirectives(true);
  }
  /**
   * ```
   * Directive[Const] : @ Name Arguments[?Const]?
   * ```
   */

  parseDirective(isConst) {
    const start = this._lexer.token;
    this.expectToken(_tokenKind.TokenKind.AT);
    return this.node(start, {
      kind: _kinds.Kind.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst),
    });
  } // Implements the parsing rules in the Types section.

  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */

  parseTypeReference() {
    const start = this._lexer.token;
    let type;

    if (this.expectOptionalToken(_tokenKind.TokenKind.BRACKET_L)) {
      const innerType = this.parseTypeReference();
      this.expectToken(_tokenKind.TokenKind.BRACKET_R);
      type = this.node(start, {
        kind: _kinds.Kind.LIST_TYPE,
        type: innerType,
      });
    } else {
      type = this.parseNamedType();
    }

    if (this.expectOptionalToken(_tokenKind.TokenKind.BANG)) {
      return this.node(start, {
        kind: _kinds.Kind.NON_NULL_TYPE,
        type,
      });
    }

    return type;
  }
  /**
   * NamedType : Name
   */

  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: _kinds.Kind.NAMED_TYPE,
      name: this.parseName(),
    });
  } // Implements the parsing rules in the Type Definition section.

  peekDescription() {
    return (
      this.peek(_tokenKind.TokenKind.STRING) ||
      this.peek(_tokenKind.TokenKind.BLOCK_STRING)
    );
  }
  /**
   * Description : StringValue
   */

  parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  }
  /**
   * ```
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   * ```
   */

  parseSchemaDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword('schema');
    const directives = this.parseConstDirectives();
    const operationTypes = this.many(
      _tokenKind.TokenKind.BRACE_L,
      this.parseOperationTypeDefinition,
      _tokenKind.TokenKind.BRACE_R,
    );
    return this.node(start, {
      kind: _kinds.Kind.SCHEMA_DEFINITION,
      description,
      directives,
      operationTypes,
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */

  parseOperationTypeDefinition() {
    const start = this._lexer.token;
    const operation = this.parseOperationType();
    this.expectToken(_tokenKind.TokenKind.COLON);
    const type = this.parseNamedType();
    return this.node(start, {
      kind: _kinds.Kind.OPERATION_TYPE_DEFINITION,
      operation,
      type,
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */

  parseScalarTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword('scalar');
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: _kinds.Kind.SCALAR_TYPE_DEFINITION,
      description,
      name,
      directives,
    });
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */

  parseObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword('type');
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: _kinds.Kind.OBJECT_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields,
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */

  parseImplementsInterfaces() {
    return this.expectOptionalKeyword('implements')
      ? this.delimitedMany(_tokenKind.TokenKind.AMP, this.parseNamedType)
      : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */

  parseFieldsDefinition() {
    return this.optionalMany(
      _tokenKind.TokenKind.BRACE_L,
      this.parseFieldDefinition,
      _tokenKind.TokenKind.BRACE_R,
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */

  parseFieldDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    this.expectToken(_tokenKind.TokenKind.COLON);
    const type = this.parseTypeReference();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: _kinds.Kind.FIELD_DEFINITION,
      description,
      name,
      arguments: args,
      type,
      directives,
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */

  parseArgumentDefs() {
    return this.optionalMany(
      _tokenKind.TokenKind.PAREN_L,
      this.parseInputValueDef,
      _tokenKind.TokenKind.PAREN_R,
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */

  parseInputValueDef() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    this.expectToken(_tokenKind.TokenKind.COLON);
    const type = this.parseTypeReference();
    let defaultValue;

    if (this.expectOptionalToken(_tokenKind.TokenKind.EQUALS)) {
      defaultValue = this.parseConstValueLiteral();
    }

    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: _kinds.Kind.INPUT_VALUE_DEFINITION,
      description,
      name,
      type,
      defaultValue,
      directives,
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */

  parseInterfaceTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword('interface');
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: _kinds.Kind.INTERFACE_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields,
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */

  parseUnionTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword('union');
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    return this.node(start, {
      kind: _kinds.Kind.UNION_TYPE_DEFINITION,
      description,
      name,
      directives,
      types,
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */

  parseUnionMemberTypes() {
    return this.expectOptionalToken(_tokenKind.TokenKind.EQUALS)
      ? this.delimitedMany(_tokenKind.TokenKind.PIPE, this.parseNamedType)
      : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */

  parseEnumTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword('enum');
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    return this.node(start, {
      kind: _kinds.Kind.ENUM_TYPE_DEFINITION,
      description,
      name,
      directives,
      values,
    });
  }
  /**
   * ```
   * EnumValuesDefinition : { EnumValueDefinition+ }
   * ```
   */

  parseEnumValuesDefinition() {
    return this.optionalMany(
      _tokenKind.TokenKind.BRACE_L,
      this.parseEnumValueDefinition,
      _tokenKind.TokenKind.BRACE_R,
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */

  parseEnumValueDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseEnumValueName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: _kinds.Kind.ENUM_VALUE_DEFINITION,
      description,
      name,
      directives,
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */

  parseEnumValueName() {
    if (
      this._lexer.token.value === 'true' ||
      this._lexer.token.value === 'false' ||
      this._lexer.token.value === 'null'
    ) {
      throw (0, _syntaxError.syntaxError)(
        this._lexer.source,
        this._lexer.token.start,
        `${getTokenDesc(
          this._lexer.token,
        )} is reserved and cannot be used for an enum value.`,
      );
    }

    return this.parseName();
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */

  parseInputObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword('input');
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    return this.node(start, {
      kind: _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION,
      description,
      name,
      directives,
      fields,
    });
  }
  /**
   * ```
   * InputFieldsDefinition : { InputValueDefinition+ }
   * ```
   */

  parseInputFieldsDefinition() {
    return this.optionalMany(
      _tokenKind.TokenKind.BRACE_L,
      this.parseInputValueDef,
      _tokenKind.TokenKind.BRACE_R,
    );
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */

  parseTypeSystemExtension() {
    const keywordToken = this._lexer.lookahead();

    if (keywordToken.kind === _tokenKind.TokenKind.NAME) {
      switch (keywordToken.value) {
        case 'schema':
          return this.parseSchemaExtension();

        case 'scalar':
          return this.parseScalarTypeExtension();

        case 'type':
          return this.parseObjectTypeExtension();

        case 'interface':
          return this.parseInterfaceTypeExtension();

        case 'union':
          return this.parseUnionTypeExtension();

        case 'enum':
          return this.parseEnumTypeExtension();

        case 'input':
          return this.parseInputObjectTypeExtension();
      }
    }

    throw this.unexpected(keywordToken);
  }
  /**
   * ```
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   * ```
   */

  parseSchemaExtension() {
    const start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('schema');
    const directives = this.parseConstDirectives();
    const operationTypes = this.optionalMany(
      _tokenKind.TokenKind.BRACE_L,
      this.parseOperationTypeDefinition,
      _tokenKind.TokenKind.BRACE_R,
    );

    if (directives.length === 0 && operationTypes.length === 0) {
      throw this.unexpected();
    }

    return this.node(start, {
      kind: _kinds.Kind.SCHEMA_EXTENSION,
      directives,
      operationTypes,
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */

  parseScalarTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('scalar');
    const name = this.parseName();
    const directives = this.parseConstDirectives();

    if (directives.length === 0) {
      throw this.unexpected();
    }

    return this.node(start, {
      kind: _kinds.Kind.SCALAR_TYPE_EXTENSION,
      name,
      directives,
    });
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */

  parseObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('type');
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();

    if (
      interfaces.length === 0 &&
      directives.length === 0 &&
      fields.length === 0
    ) {
      throw this.unexpected();
    }

    return this.node(start, {
      kind: _kinds.Kind.OBJECT_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields,
    });
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */

  parseInterfaceTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('interface');
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();

    if (
      interfaces.length === 0 &&
      directives.length === 0 &&
      fields.length === 0
    ) {
      throw this.unexpected();
    }

    return this.node(start, {
      kind: _kinds.Kind.INTERFACE_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields,
    });
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */

  parseUnionTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('union');
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();

    if (directives.length === 0 && types.length === 0) {
      throw this.unexpected();
    }

    return this.node(start, {
      kind: _kinds.Kind.UNION_TYPE_EXTENSION,
      name,
      directives,
      types,
    });
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */

  parseEnumTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('enum');
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();

    if (directives.length === 0 && values.length === 0) {
      throw this.unexpected();
    }

    return this.node(start, {
      kind: _kinds.Kind.ENUM_TYPE_EXTENSION,
      name,
      directives,
      values,
    });
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */

  parseInputObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('input');
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();

    if (directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }

    return this.node(start, {
      kind: _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION,
      name,
      directives,
      fields,
    });
  }
  /**
   * ```
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   * ```
   */

  parseDirectiveDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword('directive');
    this.expectToken(_tokenKind.TokenKind.AT);
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    const repeatable = this.expectOptionalKeyword('repeatable');
    this.expectKeyword('on');
    const locations = this.parseDirectiveLocations();
    return this.node(start, {
      kind: _kinds.Kind.DIRECTIVE_DEFINITION,
      description,
      name,
      arguments: args,
      repeatable,
      locations,
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */

  parseDirectiveLocations() {
    return this.delimitedMany(
      _tokenKind.TokenKind.PIPE,
      this.parseDirectiveLocation,
    );
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */

  parseDirectiveLocation() {
    const start = this._lexer.token;
    const name = this.parseName();

    if (
      Object.prototype.hasOwnProperty.call(
        _directiveLocation.DirectiveLocation,
        name.value,
      )
    ) {
      return name;
    }

    throw this.unexpected(start);
  } // Core parsing utility functions

  /**
   * Returns a node that, if configured to do so, sets a "loc" field as a
   * location object, used to identify the place in the source that created a
   * given parsed object.
   */

  node(startToken, node) {
    var _this$_options2;

    if (
      ((_this$_options2 = this._options) === null || _this$_options2 === void 0
        ? void 0
        : _this$_options2.noLocation) !== true
    ) {
      node.loc = new _ast.Location(
        startToken,
        this._lexer.lastToken,
        this._lexer.source,
      );
    }

    return node;
  }
  /**
   * Determines if the next token is of a given kind
   */

  peek(kind) {
    return this._lexer.token.kind === kind;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */

  expectToken(kind) {
    const token = this._lexer.token;

    if (token.kind === kind) {
      this._lexer.advance();

      return token;
    }

    throw (0, _syntaxError.syntaxError)(
      this._lexer.source,
      token.start,
      `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`,
    );
  }
  /**
   * If the next token is of the given kind, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */

  expectOptionalToken(kind) {
    const token = this._lexer.token;

    if (token.kind === kind) {
      this._lexer.advance();

      return true;
    }

    return false;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */

  expectKeyword(value) {
    const token = this._lexer.token;

    if (token.kind === _tokenKind.TokenKind.NAME && token.value === value) {
      this._lexer.advance();
    } else {
      throw (0, _syntaxError.syntaxError)(
        this._lexer.source,
        token.start,
        `Expected "${value}", found ${getTokenDesc(token)}.`,
      );
    }
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */

  expectOptionalKeyword(value) {
    const token = this._lexer.token;

    if (token.kind === _tokenKind.TokenKind.NAME && token.value === value) {
      this._lexer.advance();

      return true;
    }

    return false;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */

  unexpected(atToken) {
    const token =
      atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
    return (0, _syntaxError.syntaxError)(
      this._lexer.source,
      token.start,
      `Unexpected ${getTokenDesc(token)}.`,
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */

  any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];

    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }

    return nodes;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */

  optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      const nodes = [];

      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));

      return nodes;
    }

    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */

  many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];

    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));

    return nodes;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */

  delimitedMany(delimiterKind, parseFn) {
    this.expectOptionalToken(delimiterKind);
    const nodes = [];

    do {
      nodes.push(parseFn.call(this));
    } while (this.expectOptionalToken(delimiterKind));

    return nodes;
  }
}
/**
 * A helper function to describe a token as a string for debugging.
 */

exports.Parser = Parser;

function getTokenDesc(token) {
  const value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : '');
}
/**
 * A helper function to describe a token kind as a string for debugging.
 */

function getTokenKindDesc(kind) {
  return (0, _lexer.isPunctuatorTokenKind)(kind) ? `"${kind}"` : kind;
}

},{"../error/syntaxError.js":38,"./ast.js":69,"./directiveLocation.js":72,"./kinds.js":74,"./lexer.js":75,"./source.js":82,"./tokenKind.js":83}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.isConstValueNode = isConstValueNode;
exports.isDefinitionNode = isDefinitionNode;
exports.isExecutableDefinitionNode = isExecutableDefinitionNode;
exports.isSelectionNode = isSelectionNode;
exports.isTypeDefinitionNode = isTypeDefinitionNode;
exports.isTypeExtensionNode = isTypeExtensionNode;
exports.isTypeNode = isTypeNode;
exports.isTypeSystemDefinitionNode = isTypeSystemDefinitionNode;
exports.isTypeSystemExtensionNode = isTypeSystemExtensionNode;
exports.isValueNode = isValueNode;

var _kinds = require('./kinds.js');

function isDefinitionNode(node) {
  return (
    isExecutableDefinitionNode(node) ||
    isTypeSystemDefinitionNode(node) ||
    isTypeSystemExtensionNode(node)
  );
}

function isExecutableDefinitionNode(node) {
  return (
    node.kind === _kinds.Kind.OPERATION_DEFINITION ||
    node.kind === _kinds.Kind.FRAGMENT_DEFINITION
  );
}

function isSelectionNode(node) {
  return (
    node.kind === _kinds.Kind.FIELD ||
    node.kind === _kinds.Kind.FRAGMENT_SPREAD ||
    node.kind === _kinds.Kind.INLINE_FRAGMENT
  );
}

function isValueNode(node) {
  return (
    node.kind === _kinds.Kind.VARIABLE ||
    node.kind === _kinds.Kind.INT ||
    node.kind === _kinds.Kind.FLOAT ||
    node.kind === _kinds.Kind.STRING ||
    node.kind === _kinds.Kind.BOOLEAN ||
    node.kind === _kinds.Kind.NULL ||
    node.kind === _kinds.Kind.ENUM ||
    node.kind === _kinds.Kind.LIST ||
    node.kind === _kinds.Kind.OBJECT
  );
}

function isConstValueNode(node) {
  return (
    isValueNode(node) &&
    (node.kind === _kinds.Kind.LIST
      ? node.values.some(isConstValueNode)
      : node.kind === _kinds.Kind.OBJECT
      ? node.fields.some((field) => isConstValueNode(field.value))
      : node.kind !== _kinds.Kind.VARIABLE)
  );
}

function isTypeNode(node) {
  return (
    node.kind === _kinds.Kind.NAMED_TYPE ||
    node.kind === _kinds.Kind.LIST_TYPE ||
    node.kind === _kinds.Kind.NON_NULL_TYPE
  );
}

function isTypeSystemDefinitionNode(node) {
  return (
    node.kind === _kinds.Kind.SCHEMA_DEFINITION ||
    isTypeDefinitionNode(node) ||
    node.kind === _kinds.Kind.DIRECTIVE_DEFINITION
  );
}

function isTypeDefinitionNode(node) {
  return (
    node.kind === _kinds.Kind.SCALAR_TYPE_DEFINITION ||
    node.kind === _kinds.Kind.OBJECT_TYPE_DEFINITION ||
    node.kind === _kinds.Kind.INTERFACE_TYPE_DEFINITION ||
    node.kind === _kinds.Kind.UNION_TYPE_DEFINITION ||
    node.kind === _kinds.Kind.ENUM_TYPE_DEFINITION ||
    node.kind === _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION
  );
}

function isTypeSystemExtensionNode(node) {
  return (
    node.kind === _kinds.Kind.SCHEMA_EXTENSION || isTypeExtensionNode(node)
  );
}

function isTypeExtensionNode(node) {
  return (
    node.kind === _kinds.Kind.SCALAR_TYPE_EXTENSION ||
    node.kind === _kinds.Kind.OBJECT_TYPE_EXTENSION ||
    node.kind === _kinds.Kind.INTERFACE_TYPE_EXTENSION ||
    node.kind === _kinds.Kind.UNION_TYPE_EXTENSION ||
    node.kind === _kinds.Kind.ENUM_TYPE_EXTENSION ||
    node.kind === _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION
  );
}

},{"./kinds.js":74}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.printLocation = printLocation;
exports.printSourceLocation = printSourceLocation;

var _location = require('./location.js');

/**
 * Render a helpful description of the location in the GraphQL Source document.
 */
function printLocation(location) {
  return printSourceLocation(
    location.source,
    (0, _location.getLocation)(location.source, location.start),
  );
}
/**
 * Render a helpful description of the location in the GraphQL Source document.
 */

function printSourceLocation(source, sourceLocation) {
  const firstLineColumnOffset = source.locationOffset.column - 1;
  const body = ''.padStart(firstLineColumnOffset) + source.body;
  const lineIndex = sourceLocation.line - 1;
  const lineOffset = source.locationOffset.line - 1;
  const lineNum = sourceLocation.line + lineOffset;
  const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  const columnNum = sourceLocation.column + columnOffset;
  const locationStr = `${source.name}:${lineNum}:${columnNum}\n`;
  const lines = body.split(/\r\n|[\n\r]/g);
  const locationLine = lines[lineIndex]; // Special case for minified documents

  if (locationLine.length > 120) {
    const subLineIndex = Math.floor(columnNum / 80);
    const subLineColumnNum = columnNum % 80;
    const subLines = [];

    for (let i = 0; i < locationLine.length; i += 80) {
      subLines.push(locationLine.slice(i, i + 80));
    }

    return (
      locationStr +
      printPrefixedLines([
        [`${lineNum} |`, subLines[0]],
        ...subLines.slice(1, subLineIndex + 1).map((subLine) => ['|', subLine]),
        ['|', '^'.padStart(subLineColumnNum)],
        ['|', subLines[subLineIndex + 1]],
      ])
    );
  }

  return (
    locationStr +
    printPrefixedLines([
      // Lines specified like this: ["prefix", "string"],
      [`${lineNum - 1} |`, lines[lineIndex - 1]],
      [`${lineNum} |`, locationLine],
      ['|', '^'.padStart(columnNum)],
      [`${lineNum + 1} |`, lines[lineIndex + 1]],
    ])
  );
}

function printPrefixedLines(lines) {
  const existingLines = lines.filter(([_, line]) => line !== undefined);
  const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
  return existingLines
    .map(([prefix, line]) => prefix.padStart(padLen) + (line ? ' ' + line : ''))
    .join('\n');
}

},{"./location.js":76}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.printString = printString;

/**
 * Prints a string as a GraphQL StringValue literal. Replaces control characters
 * and excluded characters (" U+0022 and \\ U+005C) with escape sequences.
 */
function printString(str) {
  return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
} // eslint-disable-next-line no-control-regex

const escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;

function escapedReplacer(str) {
  return escapeSequences[str.charCodeAt(0)];
} // prettier-ignore

const escapeSequences = [
  '\\u0000',
  '\\u0001',
  '\\u0002',
  '\\u0003',
  '\\u0004',
  '\\u0005',
  '\\u0006',
  '\\u0007',
  '\\b',
  '\\t',
  '\\n',
  '\\u000B',
  '\\f',
  '\\r',
  '\\u000E',
  '\\u000F',
  '\\u0010',
  '\\u0011',
  '\\u0012',
  '\\u0013',
  '\\u0014',
  '\\u0015',
  '\\u0016',
  '\\u0017',
  '\\u0018',
  '\\u0019',
  '\\u001A',
  '\\u001B',
  '\\u001C',
  '\\u001D',
  '\\u001E',
  '\\u001F',
  '',
  '',
  '\\"',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 2F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 3F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 4F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '\\\\',
  '',
  '',
  '', // 5F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 6F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '\\u007F',
  '\\u0080',
  '\\u0081',
  '\\u0082',
  '\\u0083',
  '\\u0084',
  '\\u0085',
  '\\u0086',
  '\\u0087',
  '\\u0088',
  '\\u0089',
  '\\u008A',
  '\\u008B',
  '\\u008C',
  '\\u008D',
  '\\u008E',
  '\\u008F',
  '\\u0090',
  '\\u0091',
  '\\u0092',
  '\\u0093',
  '\\u0094',
  '\\u0095',
  '\\u0096',
  '\\u0097',
  '\\u0098',
  '\\u0099',
  '\\u009A',
  '\\u009B',
  '\\u009C',
  '\\u009D',
  '\\u009E',
  '\\u009F',
];

},{}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.print = print;

var _visitor = require('./visitor.js');

var _blockString = require('./blockString.js');

var _printString = require('./printString.js');

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
function print(ast) {
  return (0, _visitor.visit)(ast, printDocASTReducer);
}

const MAX_LINE_LENGTH = 80;
const printDocASTReducer = {
  Name: {
    leave: (node) => node.value,
  },
  Variable: {
    leave: (node) => '$' + node.name,
  },
  // Document
  Document: {
    leave: (node) => join(node.definitions, '\n\n'),
  },
  OperationDefinition: {
    leave(node) {
      const varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
      const prefix = join(
        [
          node.operation,
          join([node.name, varDefs]),
          join(node.directives, ' '),
        ],
        ' ',
      ); // Anonymous queries with no directives or variable definitions can use
      // the query short form.

      return (prefix === 'query' ? '' : prefix + ' ') + node.selectionSet;
    },
  },
  VariableDefinition: {
    leave: ({ variable, type, defaultValue, directives }) =>
      variable +
      ': ' +
      type +
      wrap(' = ', defaultValue) +
      wrap(' ', join(directives, ' ')),
  },
  SelectionSet: {
    leave: ({ selections }) => block(selections),
  },
  Field: {
    leave({ alias, name, arguments: args, directives, selectionSet }) {
      const prefix = wrap('', alias, ': ') + name;
      let argsLine = prefix + wrap('(', join(args, ', '), ')');

      if (argsLine.length > MAX_LINE_LENGTH) {
        argsLine = prefix + wrap('(\n', indent(join(args, '\n')), '\n)');
      }

      return join([argsLine, join(directives, ' '), selectionSet], ' ');
    },
  },
  Argument: {
    leave: ({ name, value }) => name + ': ' + value,
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name, directives }) =>
      '...' + name + wrap(' ', join(directives, ' ')),
  },
  InlineFragment: {
    leave: ({ typeCondition, directives, selectionSet }) =>
      join(
        [
          '...',
          wrap('on ', typeCondition),
          join(directives, ' '),
          selectionSet,
        ],
        ' ',
      ),
  },
  FragmentDefinition: {
    leave: (
      { name, typeCondition, variableDefinitions, directives, selectionSet }, // Note: fragment variable definitions are experimental and may be changed
    ) =>
      // or removed in the future.
      `fragment ${name}${wrap('(', join(variableDefinitions, ', '), ')')} ` +
      `on ${typeCondition} ${wrap('', join(directives, ' '), ' ')}` +
      selectionSet,
  },
  // Value
  IntValue: {
    leave: ({ value }) => value,
  },
  FloatValue: {
    leave: ({ value }) => value,
  },
  StringValue: {
    leave: ({ value, block: isBlockString }) =>
      isBlockString
        ? (0, _blockString.printBlockString)(value)
        : (0, _printString.printString)(value),
  },
  BooleanValue: {
    leave: ({ value }) => (value ? 'true' : 'false'),
  },
  NullValue: {
    leave: () => 'null',
  },
  EnumValue: {
    leave: ({ value }) => value,
  },
  ListValue: {
    leave: ({ values }) => '[' + join(values, ', ') + ']',
  },
  ObjectValue: {
    leave: ({ fields }) => '{' + join(fields, ', ') + '}',
  },
  ObjectField: {
    leave: ({ name, value }) => name + ': ' + value,
  },
  // Directive
  Directive: {
    leave: ({ name, arguments: args }) =>
      '@' + name + wrap('(', join(args, ', '), ')'),
  },
  // Type
  NamedType: {
    leave: ({ name }) => name,
  },
  ListType: {
    leave: ({ type }) => '[' + type + ']',
  },
  NonNullType: {
    leave: ({ type }) => type + '!',
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description, directives, operationTypes }) =>
      wrap('', description, '\n') +
      join(['schema', join(directives, ' '), block(operationTypes)], ' '),
  },
  OperationTypeDefinition: {
    leave: ({ operation, type }) => operation + ': ' + type,
  },
  ScalarTypeDefinition: {
    leave: ({ description, name, directives }) =>
      wrap('', description, '\n') +
      join(['scalar', name, join(directives, ' ')], ' '),
  },
  ObjectTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) =>
      wrap('', description, '\n') +
      join(
        [
          'type',
          name,
          wrap('implements ', join(interfaces, ' & ')),
          join(directives, ' '),
          block(fields),
        ],
        ' ',
      ),
  },
  FieldDefinition: {
    leave: ({ description, name, arguments: args, type, directives }) =>
      wrap('', description, '\n') +
      name +
      (hasMultilineItems(args)
        ? wrap('(\n', indent(join(args, '\n')), '\n)')
        : wrap('(', join(args, ', '), ')')) +
      ': ' +
      type +
      wrap(' ', join(directives, ' ')),
  },
  InputValueDefinition: {
    leave: ({ description, name, type, defaultValue, directives }) =>
      wrap('', description, '\n') +
      join(
        [name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')],
        ' ',
      ),
  },
  InterfaceTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) =>
      wrap('', description, '\n') +
      join(
        [
          'interface',
          name,
          wrap('implements ', join(interfaces, ' & ')),
          join(directives, ' '),
          block(fields),
        ],
        ' ',
      ),
  },
  UnionTypeDefinition: {
    leave: ({ description, name, directives, types }) =>
      wrap('', description, '\n') +
      join(
        ['union', name, join(directives, ' '), wrap('= ', join(types, ' | '))],
        ' ',
      ),
  },
  EnumTypeDefinition: {
    leave: ({ description, name, directives, values }) =>
      wrap('', description, '\n') +
      join(['enum', name, join(directives, ' '), block(values)], ' '),
  },
  EnumValueDefinition: {
    leave: ({ description, name, directives }) =>
      wrap('', description, '\n') + join([name, join(directives, ' ')], ' '),
  },
  InputObjectTypeDefinition: {
    leave: ({ description, name, directives, fields }) =>
      wrap('', description, '\n') +
      join(['input', name, join(directives, ' '), block(fields)], ' '),
  },
  DirectiveDefinition: {
    leave: ({ description, name, arguments: args, repeatable, locations }) =>
      wrap('', description, '\n') +
      'directive @' +
      name +
      (hasMultilineItems(args)
        ? wrap('(\n', indent(join(args, '\n')), '\n)')
        : wrap('(', join(args, ', '), ')')) +
      (repeatable ? ' repeatable' : '') +
      ' on ' +
      join(locations, ' | '),
  },
  SchemaExtension: {
    leave: ({ directives, operationTypes }) =>
      join(
        ['extend schema', join(directives, ' '), block(operationTypes)],
        ' ',
      ),
  },
  ScalarTypeExtension: {
    leave: ({ name, directives }) =>
      join(['extend scalar', name, join(directives, ' ')], ' '),
  },
  ObjectTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) =>
      join(
        [
          'extend type',
          name,
          wrap('implements ', join(interfaces, ' & ')),
          join(directives, ' '),
          block(fields),
        ],
        ' ',
      ),
  },
  InterfaceTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) =>
      join(
        [
          'extend interface',
          name,
          wrap('implements ', join(interfaces, ' & ')),
          join(directives, ' '),
          block(fields),
        ],
        ' ',
      ),
  },
  UnionTypeExtension: {
    leave: ({ name, directives, types }) =>
      join(
        [
          'extend union',
          name,
          join(directives, ' '),
          wrap('= ', join(types, ' | ')),
        ],
        ' ',
      ),
  },
  EnumTypeExtension: {
    leave: ({ name, directives, values }) =>
      join(['extend enum', name, join(directives, ' '), block(values)], ' '),
  },
  InputObjectTypeExtension: {
    leave: ({ name, directives, fields }) =>
      join(['extend input', name, join(directives, ' '), block(fields)], ' '),
  },
};
/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */

function join(maybeArray, separator = '') {
  var _maybeArray$filter$jo;

  return (_maybeArray$filter$jo =
    maybeArray === null || maybeArray === void 0
      ? void 0
      : maybeArray.filter((x) => x).join(separator)) !== null &&
    _maybeArray$filter$jo !== void 0
    ? _maybeArray$filter$jo
    : '';
}
/**
 * Given array, print each item on its own line, wrapped in an indented `{ }` block.
 */

function block(array) {
  return wrap('{\n', indent(join(array, '\n')), '\n}');
}
/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise print an empty string.
 */

function wrap(start, maybeString, end = '') {
  return maybeString != null && maybeString !== ''
    ? start + maybeString + end
    : '';
}

function indent(str) {
  return wrap('  ', str.replace(/\n/g, '\n  '));
}

function hasMultilineItems(maybeArray) {
  var _maybeArray$some;

  // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
  return (_maybeArray$some =
    maybeArray === null || maybeArray === void 0
      ? void 0
      : maybeArray.some((str) => str.includes('\n'))) !== null &&
    _maybeArray$some !== void 0
    ? _maybeArray$some
    : false;
}

},{"./blockString.js":70,"./printString.js":80,"./visitor.js":84}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.Source = void 0;
exports.isSource = isSource;

var _inspect = require('../jsutils/inspect.js');

var _devAssert = require('../jsutils/devAssert.js');

var _instanceOf = require('../jsutils/instanceOf.js');

/**
 * A representation of source input to GraphQL. The `name` and `locationOffset` parameters are
 * optional, but they are useful for clients who store GraphQL documents in source files.
 * For example, if the GraphQL input starts at line 40 in a file named `Foo.graphql`, it might
 * be useful for `name` to be `"Foo.graphql"` and location to be `{ line: 40, column: 1 }`.
 * The `line` and `column` properties in `locationOffset` are 1-indexed.
 */
class Source {
  constructor(
    body,
    name = 'GraphQL request',
    locationOffset = {
      line: 1,
      column: 1,
    },
  ) {
    typeof body === 'string' ||
      (0, _devAssert.devAssert)(
        false,
        `Body must be a string. Received: ${(0, _inspect.inspect)(body)}.`,
      );
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    this.locationOffset.line > 0 ||
      (0, _devAssert.devAssert)(
        false,
        'line in locationOffset is 1-indexed and must be positive.',
      );
    this.locationOffset.column > 0 ||
      (0, _devAssert.devAssert)(
        false,
        'column in locationOffset is 1-indexed and must be positive.',
      );
  }

  get [Symbol.toStringTag]() {
    return 'Source';
  }
}
/**
 * Test if the given value is a Source object.
 *
 * @internal
 */

exports.Source = Source;

function isSource(source) {
  return (0, _instanceOf.instanceOf)(source, Source);
}

},{"../jsutils/devAssert.js":48,"../jsutils/inspect.js":52,"../jsutils/instanceOf.js":53}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.TokenKind = void 0;

/**
 * An exported enum describing the different kinds of tokens that the
 * lexer emits.
 */
let TokenKind;
/**
 * The enum type representing the token kinds values.
 *
 * @deprecated Please use `TokenKind`. Will be remove in v17.
 */

exports.TokenKind = TokenKind;

(function (TokenKind) {
  TokenKind['SOF'] = '<SOF>';
  TokenKind['EOF'] = '<EOF>';
  TokenKind['BANG'] = '!';
  TokenKind['DOLLAR'] = '$';
  TokenKind['AMP'] = '&';
  TokenKind['PAREN_L'] = '(';
  TokenKind['PAREN_R'] = ')';
  TokenKind['SPREAD'] = '...';
  TokenKind['COLON'] = ':';
  TokenKind['EQUALS'] = '=';
  TokenKind['AT'] = '@';
  TokenKind['BRACKET_L'] = '[';
  TokenKind['BRACKET_R'] = ']';
  TokenKind['BRACE_L'] = '{';
  TokenKind['PIPE'] = '|';
  TokenKind['BRACE_R'] = '}';
  TokenKind['NAME'] = 'Name';
  TokenKind['INT'] = 'Int';
  TokenKind['FLOAT'] = 'Float';
  TokenKind['STRING'] = 'String';
  TokenKind['BLOCK_STRING'] = 'BlockString';
  TokenKind['COMMENT'] = 'Comment';
})(TokenKind || (exports.TokenKind = TokenKind = {}));

},{}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.BREAK = void 0;
exports.getEnterLeaveForKind = getEnterLeaveForKind;
exports.getVisitFn = getVisitFn;
exports.visit = visit;
exports.visitInParallel = visitInParallel;

var _inspect = require('../jsutils/inspect.js');

var _devAssert = require('../jsutils/devAssert.js');

var _ast = require('./ast.js');

var _kinds = require('./kinds.js');

const BREAK = Object.freeze({});
/**
 * visit() will walk through an AST using a depth-first traversal, calling
 * the visitor's enter function at each node in the traversal, and calling the
 * leave function after visiting that node and all of its child nodes.
 *
 * By returning different values from the enter and leave functions, the
 * behavior of the visitor can be altered, including skipping over a sub-tree of
 * the AST (by returning false), editing the AST by returning a value or null
 * to remove the value, or to stop the whole traversal by returning BREAK.
 *
 * When using visit() to edit an AST, the original AST will not be modified, and
 * a new version of the AST with the changes applied will be returned from the
 * visit function.
 *
 * ```ts
 * const editedAST = visit(ast, {
 *   enter(node, key, parent, path, ancestors) {
 *     // @return
 *     //   undefined: no action
 *     //   false: skip visiting this node
 *     //   visitor.BREAK: stop visiting altogether
 *     //   null: delete this node
 *     //   any value: replace this node with the returned value
 *   },
 *   leave(node, key, parent, path, ancestors) {
 *     // @return
 *     //   undefined: no action
 *     //   false: no action
 *     //   visitor.BREAK: stop visiting altogether
 *     //   null: delete this node
 *     //   any value: replace this node with the returned value
 *   }
 * });
 * ```
 *
 * Alternatively to providing enter() and leave() functions, a visitor can
 * instead provide functions named the same as the kinds of AST nodes, or
 * enter/leave visitors at a named key, leading to three permutations of the
 * visitor API:
 *
 * 1) Named visitors triggered when entering a node of a specific kind.
 *
 * ```ts
 * visit(ast, {
 *   Kind(node) {
 *     // enter the "Kind" node
 *   }
 * })
 * ```
 *
 * 2) Named visitors that trigger upon entering and leaving a node of a specific kind.
 *
 * ```ts
 * visit(ast, {
 *   Kind: {
 *     enter(node) {
 *       // enter the "Kind" node
 *     }
 *     leave(node) {
 *       // leave the "Kind" node
 *     }
 *   }
 * })
 * ```
 *
 * 3) Generic visitors that trigger upon entering and leaving any node.
 *
 * ```ts
 * visit(ast, {
 *   enter(node) {
 *     // enter any node
 *   },
 *   leave(node) {
 *     // leave any node
 *   }
 * })
 * ```
 */

exports.BREAK = BREAK;

function visit(root, visitor, visitorKeys = _ast.QueryDocumentKeys) {
  const enterLeaveMap = new Map();

  for (const kind of Object.values(_kinds.Kind)) {
    enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
  }
  /* eslint-disable no-undef-init */

  let stack = undefined;
  let inArray = Array.isArray(root);
  let keys = [root];
  let index = -1;
  let edits = [];
  let node = undefined;
  let key = undefined;
  let parent = undefined;
  const path = [];
  const ancestors = [];
  let newRoot = root;
  /* eslint-enable no-undef-init */

  do {
    index++;
    const isLeaving = index === keys.length;
    const isEdited = isLeaving && edits.length !== 0;

    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();

      if (isEdited) {
        if (inArray) {
          node = node.slice();
          let editOffset = 0;

          for (const [editKey, editValue] of edits) {
            const arrayKey = editKey - editOffset;

            if (editValue === null) {
              node.splice(arrayKey, 1);
              editOffset++;
            } else {
              node[arrayKey] = editValue;
            }
          }
        } else {
          node = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(node),
          );

          for (const [editKey, editValue] of edits) {
            node[editKey] = editValue;
          }
        }
      }

      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? (inArray ? index : keys[index]) : undefined;
      node = parent ? parent[key] : newRoot;

      if (node === null || node === undefined) {
        continue;
      }

      if (parent) {
        path.push(key);
      }
    }

    let result;

    if (!Array.isArray(node)) {
      var _enterLeaveMap$get, _enterLeaveMap$get2;

      (0, _ast.isNode)(node) ||
        (0, _devAssert.devAssert)(
          false,
          `Invalid AST Node: ${(0, _inspect.inspect)(node)}.`,
        );
      const visitFn = isLeaving
        ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null ||
          _enterLeaveMap$get === void 0
          ? void 0
          : _enterLeaveMap$get.leave
        : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null ||
          _enterLeaveMap$get2 === void 0
        ? void 0
        : _enterLeaveMap$get2.enter;
      result =
        visitFn === null || visitFn === void 0
          ? void 0
          : visitFn.call(visitor, node, key, parent, path, ancestors);

      if (result === BREAK) {
        break;
      }

      if (result === false) {
        if (!isLeaving) {
          path.pop();
          continue;
        }
      } else if (result !== undefined) {
        edits.push([key, result]);

        if (!isLeaving) {
          if ((0, _ast.isNode)(result)) {
            node = result;
          } else {
            path.pop();
            continue;
          }
        }
      }
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (isLeaving) {
      path.pop();
    } else {
      var _node$kind;

      stack = {
        inArray,
        index,
        keys,
        edits,
        prev: stack,
      };
      inArray = Array.isArray(node);
      keys = inArray
        ? node
        : (_node$kind = visitorKeys[node.kind]) !== null &&
          _node$kind !== void 0
        ? _node$kind
        : [];
      index = -1;
      edits = [];

      if (parent) {
        ancestors.push(parent);
      }

      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }

  return newRoot;
}
/**
 * Creates a new visitor instance which delegates to many visitors to run in
 * parallel. Each visitor will be visited for each node before moving on.
 *
 * If a prior visitor edits a node, no following visitors will see that node.
 */

function visitInParallel(visitors) {
  const skipping = new Array(visitors.length).fill(null);
  const mergedVisitor = Object.create(null);

  for (const kind of Object.values(_kinds.Kind)) {
    let hasVisitor = false;
    const enterList = new Array(visitors.length).fill(undefined);
    const leaveList = new Array(visitors.length).fill(undefined);

    for (let i = 0; i < visitors.length; ++i) {
      const { enter, leave } = getEnterLeaveForKind(visitors[i], kind);
      hasVisitor || (hasVisitor = enter != null || leave != null);
      enterList[i] = enter;
      leaveList[i] = leave;
    }

    if (!hasVisitor) {
      continue;
    }

    const mergedEnterLeave = {
      enter(...args) {
        const node = args[0];

        for (let i = 0; i < visitors.length; i++) {
          if (skipping[i] === null) {
            var _enterList$i;

            const result =
              (_enterList$i = enterList[i]) === null || _enterList$i === void 0
                ? void 0
                : _enterList$i.apply(visitors[i], args);

            if (result === false) {
              skipping[i] = node;
            } else if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== undefined) {
              return result;
            }
          }
        }
      },

      leave(...args) {
        const node = args[0];

        for (let i = 0; i < visitors.length; i++) {
          if (skipping[i] === null) {
            var _leaveList$i;

            const result =
              (_leaveList$i = leaveList[i]) === null || _leaveList$i === void 0
                ? void 0
                : _leaveList$i.apply(visitors[i], args);

            if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== undefined && result !== false) {
              return result;
            }
          } else if (skipping[i] === node) {
            skipping[i] = null;
          }
        }
      },
    };
    mergedVisitor[kind] = mergedEnterLeave;
  }

  return mergedVisitor;
}
/**
 * Given a visitor instance and a node kind, return EnterLeaveVisitor for that kind.
 */

function getEnterLeaveForKind(visitor, kind) {
  const kindVisitor = visitor[kind];

  if (typeof kindVisitor === 'object') {
    // { Kind: { enter() {}, leave() {} } }
    return kindVisitor;
  } else if (typeof kindVisitor === 'function') {
    // { Kind() {} }
    return {
      enter: kindVisitor,
      leave: undefined,
    };
  } // { enter() {}, leave() {} }

  return {
    enter: visitor.enter,
    leave: visitor.leave,
  };
}
/**
 * Given a visitor instance, if it is leaving or not, and a node kind, return
 * the function the visitor runtime should call.
 *
 * @deprecated Please use `getEnterLeaveForKind` instead. Will be removed in v17
 */
// istanbul ignore next (Deprecated code)

function getVisitFn(visitor, kind, isLeaving) {
  const { enter, leave } = getEnterLeaveForKind(visitor, kind);
  return isLeaving ? leave : enter;
}

},{"../jsutils/devAssert.js":48,"../jsutils/inspect.js":52,"./ast.js":69,"./kinds.js":74}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.assertEnumValueName = assertEnumValueName;
exports.assertName = assertName;

var _devAssert = require('../jsutils/devAssert.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _characterClasses = require('../language/characterClasses.js');

/**
 * Upholds the spec rules about naming.
 */
function assertName(name) {
  name != null || (0, _devAssert.devAssert)(false, 'Must provide name.');
  typeof name === 'string' ||
    (0, _devAssert.devAssert)(false, 'Expected name to be a string.');

  if (name.length === 0) {
    throw new _GraphQLError.GraphQLError(
      'Expected name to be a non-empty string.',
    );
  }

  for (let i = 1; i < name.length; ++i) {
    if (!(0, _characterClasses.isNameContinue)(name.charCodeAt(i))) {
      throw new _GraphQLError.GraphQLError(
        `Names must only contain [_a-zA-Z0-9] but "${name}" does not.`,
      );
    }
  }

  if (!(0, _characterClasses.isNameStart)(name.charCodeAt(0))) {
    throw new _GraphQLError.GraphQLError(
      `Names must start with [_a-zA-Z] but "${name}" does not.`,
    );
  }

  return name;
}
/**
 * Upholds the spec rules about naming enum values.
 *
 * @internal
 */

function assertEnumValueName(name) {
  if (name === 'true' || name === 'false' || name === 'null') {
    throw new _GraphQLError.GraphQLError(
      `Enum values cannot be named: ${name}`,
    );
  }

  return assertName(name);
}

},{"../error/GraphQLError.js":35,"../jsutils/devAssert.js":48,"../language/characterClasses.js":71}],86:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.GraphQLUnionType =
  exports.GraphQLScalarType =
  exports.GraphQLObjectType =
  exports.GraphQLNonNull =
  exports.GraphQLList =
  exports.GraphQLInterfaceType =
  exports.GraphQLInputObjectType =
  exports.GraphQLEnumType =
    void 0;
exports.argsToArgsConfig = argsToArgsConfig;
exports.assertAbstractType = assertAbstractType;
exports.assertCompositeType = assertCompositeType;
exports.assertEnumType = assertEnumType;
exports.assertInputObjectType = assertInputObjectType;
exports.assertInputType = assertInputType;
exports.assertInterfaceType = assertInterfaceType;
exports.assertLeafType = assertLeafType;
exports.assertListType = assertListType;
exports.assertNamedType = assertNamedType;
exports.assertNonNullType = assertNonNullType;
exports.assertNullableType = assertNullableType;
exports.assertObjectType = assertObjectType;
exports.assertOutputType = assertOutputType;
exports.assertScalarType = assertScalarType;
exports.assertType = assertType;
exports.assertUnionType = assertUnionType;
exports.assertWrappingType = assertWrappingType;
exports.defineArguments = defineArguments;
exports.getNamedType = getNamedType;
exports.getNullableType = getNullableType;
exports.isAbstractType = isAbstractType;
exports.isCompositeType = isCompositeType;
exports.isEnumType = isEnumType;
exports.isInputObjectType = isInputObjectType;
exports.isInputType = isInputType;
exports.isInterfaceType = isInterfaceType;
exports.isLeafType = isLeafType;
exports.isListType = isListType;
exports.isNamedType = isNamedType;
exports.isNonNullType = isNonNullType;
exports.isNullableType = isNullableType;
exports.isObjectType = isObjectType;
exports.isOutputType = isOutputType;
exports.isRequiredArgument = isRequiredArgument;
exports.isRequiredInputField = isRequiredInputField;
exports.isScalarType = isScalarType;
exports.isType = isType;
exports.isUnionType = isUnionType;
exports.isWrappingType = isWrappingType;

var _inspect = require('../jsutils/inspect.js');

var _keyMap = require('../jsutils/keyMap.js');

var _mapValue = require('../jsutils/mapValue.js');

var _toObjMap = require('../jsutils/toObjMap.js');

var _devAssert = require('../jsutils/devAssert.js');

var _keyValMap = require('../jsutils/keyValMap.js');

var _instanceOf = require('../jsutils/instanceOf.js');

var _didYouMean = require('../jsutils/didYouMean.js');

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _identityFunc = require('../jsutils/identityFunc.js');

var _suggestionList = require('../jsutils/suggestionList.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _kinds = require('../language/kinds.js');

var _printer = require('../language/printer.js');

var _valueFromASTUntyped = require('../utilities/valueFromASTUntyped.js');

var _assertName = require('./assertName.js');

function isType(type) {
  return (
    isScalarType(type) ||
    isObjectType(type) ||
    isInterfaceType(type) ||
    isUnionType(type) ||
    isEnumType(type) ||
    isInputObjectType(type) ||
    isListType(type) ||
    isNonNullType(type)
  );
}

function assertType(type) {
  if (!isType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL type.`,
    );
  }

  return type;
}
/**
 * There are predicates for each kind of GraphQL type.
 */

function isScalarType(type) {
  return (0, _instanceOf.instanceOf)(type, GraphQLScalarType);
}

function assertScalarType(type) {
  if (!isScalarType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL Scalar type.`,
    );
  }

  return type;
}

function isObjectType(type) {
  return (0, _instanceOf.instanceOf)(type, GraphQLObjectType);
}

function assertObjectType(type) {
  if (!isObjectType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL Object type.`,
    );
  }

  return type;
}

function isInterfaceType(type) {
  return (0, _instanceOf.instanceOf)(type, GraphQLInterfaceType);
}

function assertInterfaceType(type) {
  if (!isInterfaceType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL Interface type.`,
    );
  }

  return type;
}

function isUnionType(type) {
  return (0, _instanceOf.instanceOf)(type, GraphQLUnionType);
}

function assertUnionType(type) {
  if (!isUnionType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL Union type.`,
    );
  }

  return type;
}

function isEnumType(type) {
  return (0, _instanceOf.instanceOf)(type, GraphQLEnumType);
}

function assertEnumType(type) {
  if (!isEnumType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL Enum type.`,
    );
  }

  return type;
}

function isInputObjectType(type) {
  return (0, _instanceOf.instanceOf)(type, GraphQLInputObjectType);
}

function assertInputObjectType(type) {
  if (!isInputObjectType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(
        type,
      )} to be a GraphQL Input Object type.`,
    );
  }

  return type;
}

function isListType(type) {
  return (0, _instanceOf.instanceOf)(type, GraphQLList);
}

function assertListType(type) {
  if (!isListType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL List type.`,
    );
  }

  return type;
}

function isNonNullType(type) {
  return (0, _instanceOf.instanceOf)(type, GraphQLNonNull);
}

function assertNonNullType(type) {
  if (!isNonNullType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL Non-Null type.`,
    );
  }

  return type;
}
/**
 * These types may be used as input types for arguments and directives.
 */

function isInputType(type) {
  return (
    isScalarType(type) ||
    isEnumType(type) ||
    isInputObjectType(type) ||
    (isWrappingType(type) && isInputType(type.ofType))
  );
}

function assertInputType(type) {
  if (!isInputType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL input type.`,
    );
  }

  return type;
}
/**
 * These types may be used as output types as the result of fields.
 */

function isOutputType(type) {
  return (
    isScalarType(type) ||
    isObjectType(type) ||
    isInterfaceType(type) ||
    isUnionType(type) ||
    isEnumType(type) ||
    (isWrappingType(type) && isOutputType(type.ofType))
  );
}

function assertOutputType(type) {
  if (!isOutputType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL output type.`,
    );
  }

  return type;
}
/**
 * These types may describe types which may be leaf values.
 */

function isLeafType(type) {
  return isScalarType(type) || isEnumType(type);
}

function assertLeafType(type) {
  if (!isLeafType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL leaf type.`,
    );
  }

  return type;
}
/**
 * These types may describe the parent context of a selection set.
 */

function isCompositeType(type) {
  return isObjectType(type) || isInterfaceType(type) || isUnionType(type);
}

function assertCompositeType(type) {
  if (!isCompositeType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL composite type.`,
    );
  }

  return type;
}
/**
 * These types may describe the parent context of a selection set.
 */

function isAbstractType(type) {
  return isInterfaceType(type) || isUnionType(type);
}

function assertAbstractType(type) {
  if (!isAbstractType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL abstract type.`,
    );
  }

  return type;
}
/**
 * List Type Wrapper
 *
 * A list is a wrapping type which points to another type.
 * Lists are often created within the context of defining the fields of
 * an object type.
 *
 * Example:
 *
 * ```ts
 * const PersonType = new GraphQLObjectType({
 *   name: 'Person',
 *   fields: () => ({
 *     parents: { type: new GraphQLList(PersonType) },
 *     children: { type: new GraphQLList(PersonType) },
 *   })
 * })
 * ```
 */

class GraphQLList {
  constructor(ofType) {
    isType(ofType) ||
      (0, _devAssert.devAssert)(
        false,
        `Expected ${(0, _inspect.inspect)(ofType)} to be a GraphQL type.`,
      );
    this.ofType = ofType;
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLList';
  }

  toString() {
    return '[' + String(this.ofType) + ']';
  }

  toJSON() {
    return this.toString();
  }
}
/**
 * Non-Null Type Wrapper
 *
 * A non-null is a wrapping type which points to another type.
 * Non-null types enforce that their values are never null and can ensure
 * an error is raised if this ever occurs during a request. It is useful for
 * fields which you can make a strong guarantee on non-nullability, for example
 * usually the id field of a database row will never be null.
 *
 * Example:
 *
 * ```ts
 * const RowType = new GraphQLObjectType({
 *   name: 'Row',
 *   fields: () => ({
 *     id: { type: new GraphQLNonNull(GraphQLString) },
 *   })
 * })
 * ```
 * Note: the enforcement of non-nullability occurs within the executor.
 */

exports.GraphQLList = GraphQLList;

class GraphQLNonNull {
  constructor(ofType) {
    isNullableType(ofType) ||
      (0, _devAssert.devAssert)(
        false,
        `Expected ${(0, _inspect.inspect)(
          ofType,
        )} to be a GraphQL nullable type.`,
      );
    this.ofType = ofType;
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLNonNull';
  }

  toString() {
    return String(this.ofType) + '!';
  }

  toJSON() {
    return this.toString();
  }
}
/**
 * These types wrap and modify other types
 */

exports.GraphQLNonNull = GraphQLNonNull;

function isWrappingType(type) {
  return isListType(type) || isNonNullType(type);
}

function assertWrappingType(type) {
  if (!isWrappingType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL wrapping type.`,
    );
  }

  return type;
}
/**
 * These types can all accept null as a value.
 */

function isNullableType(type) {
  return isType(type) && !isNonNullType(type);
}

function assertNullableType(type) {
  if (!isNullableType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL nullable type.`,
    );
  }

  return type;
}

function getNullableType(type) {
  if (type) {
    return isNonNullType(type) ? type.ofType : type;
  }
}
/**
 * These named types do not include modifiers like List or NonNull.
 */

function isNamedType(type) {
  return (
    isScalarType(type) ||
    isObjectType(type) ||
    isInterfaceType(type) ||
    isUnionType(type) ||
    isEnumType(type) ||
    isInputObjectType(type)
  );
}

function assertNamedType(type) {
  if (!isNamedType(type)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(type)} to be a GraphQL named type.`,
    );
  }

  return type;
}

function getNamedType(type) {
  if (type) {
    let unwrappedType = type;

    while (isWrappingType(unwrappedType)) {
      unwrappedType = unwrappedType.ofType;
    }

    return unwrappedType;
  }
}
/**
 * Used while defining GraphQL types to allow for circular references in
 * otherwise immutable type definitions.
 */

function resolveReadonlyArrayThunk(thunk) {
  return typeof thunk === 'function' ? thunk() : thunk;
}

function resolveObjMapThunk(thunk) {
  return typeof thunk === 'function' ? thunk() : thunk;
}
/**
 * Custom extensions
 *
 * @remarks
 * Use a unique identifier name for your extension, for example the name of
 * your library or project. Do not use a shortened identifier as this increases
 * the risk of conflicts. We recommend you add at most one extension field,
 * an object which can contain all the values you need.
 */

/**
 * Scalar Type Definition
 *
 * The leaf values of any request and input values to arguments are
 * Scalars (or Enums) and are defined with a name and a series of functions
 * used to parse input from ast or variables and to ensure validity.
 *
 * If a type's serialize function does not return a value (i.e. it returns
 * `undefined`) then an error will be raised and a `null` value will be returned
 * in the response. If the serialize function returns `null`, then no error will
 * be included in the response.
 *
 * Example:
 *
 * ```ts
 * const OddType = new GraphQLScalarType({
 *   name: 'Odd',
 *   serialize(value) {
 *     if (value % 2 === 1) {
 *       return value;
 *     }
 *   }
 * });
 * ```
 */
class GraphQLScalarType {
  constructor(config) {
    var _config$parseValue,
      _config$serialize,
      _config$parseLiteral,
      _config$extensionASTN;

    const parseValue =
      (_config$parseValue = config.parseValue) !== null &&
      _config$parseValue !== void 0
        ? _config$parseValue
        : _identityFunc.identityFunc;
    this.name = (0, _assertName.assertName)(config.name);
    this.description = config.description;
    this.specifiedByURL = config.specifiedByURL;
    this.serialize =
      (_config$serialize = config.serialize) !== null &&
      _config$serialize !== void 0
        ? _config$serialize
        : _identityFunc.identityFunc;
    this.parseValue = parseValue;
    this.parseLiteral =
      (_config$parseLiteral = config.parseLiteral) !== null &&
      _config$parseLiteral !== void 0
        ? _config$parseLiteral
        : (node, variables) =>
            parseValue(
              (0, _valueFromASTUntyped.valueFromASTUntyped)(node, variables),
            );
    this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes =
      (_config$extensionASTN = config.extensionASTNodes) !== null &&
      _config$extensionASTN !== void 0
        ? _config$extensionASTN
        : [];
    config.specifiedByURL == null ||
      typeof config.specifiedByURL === 'string' ||
      (0, _devAssert.devAssert)(
        false,
        `${this.name} must provide "specifiedByURL" as a string, ` +
          `but got: ${(0, _inspect.inspect)(config.specifiedByURL)}.`,
      );
    config.serialize == null ||
      typeof config.serialize === 'function' ||
      (0, _devAssert.devAssert)(
        false,
        `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`,
      );

    if (config.parseLiteral) {
      (typeof config.parseValue === 'function' &&
        typeof config.parseLiteral === 'function') ||
        (0, _devAssert.devAssert)(
          false,
          `${this.name} must provide both "parseValue" and "parseLiteral" functions.`,
        );
    }
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLScalarType';
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      specifiedByURL: this.specifiedByURL,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  }
}

exports.GraphQLScalarType = GraphQLScalarType;

/**
 * Object Type Definition
 *
 * Almost all of the GraphQL types you define will be object types. Object types
 * have a name, but most importantly describe their fields.
 *
 * Example:
 *
 * ```ts
 * const AddressType = new GraphQLObjectType({
 *   name: 'Address',
 *   fields: {
 *     street: { type: GraphQLString },
 *     number: { type: GraphQLInt },
 *     formatted: {
 *       type: GraphQLString,
 *       resolve(obj) {
 *         return obj.number + ' ' + obj.street
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * When two types need to refer to each other, or a type needs to refer to
 * itself in a field, you can use a function expression (aka a closure or a
 * thunk) to supply the fields lazily.
 *
 * Example:
 *
 * ```ts
 * const PersonType = new GraphQLObjectType({
 *   name: 'Person',
 *   fields: () => ({
 *     name: { type: GraphQLString },
 *     bestFriend: { type: PersonType },
 *   })
 * });
 * ```
 */
class GraphQLObjectType {
  constructor(config) {
    var _config$extensionASTN2;

    this.name = (0, _assertName.assertName)(config.name);
    this.description = config.description;
    this.isTypeOf = config.isTypeOf;
    this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes =
      (_config$extensionASTN2 = config.extensionASTNodes) !== null &&
      _config$extensionASTN2 !== void 0
        ? _config$extensionASTN2
        : [];

    this._fields = () => defineFieldMap(config);

    this._interfaces = () => defineInterfaces(config);

    config.isTypeOf == null ||
      typeof config.isTypeOf === 'function' ||
      (0, _devAssert.devAssert)(
        false,
        `${this.name} must provide "isTypeOf" as a function, ` +
          `but got: ${(0, _inspect.inspect)(config.isTypeOf)}.`,
      );
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLObjectType';
  }

  getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }

    return this._fields;
  }

  getInterfaces() {
    if (typeof this._interfaces === 'function') {
      this._interfaces = this._interfaces();
    }

    return this._interfaces;
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      isTypeOf: this.isTypeOf,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  }
}

exports.GraphQLObjectType = GraphQLObjectType;

function defineInterfaces(config) {
  var _config$interfaces;

  const interfaces = resolveReadonlyArrayThunk(
    (_config$interfaces = config.interfaces) !== null &&
      _config$interfaces !== void 0
      ? _config$interfaces
      : [],
  );
  Array.isArray(interfaces) ||
    (0, _devAssert.devAssert)(
      false,
      `${config.name} interfaces must be an Array or a function which returns an Array.`,
    );
  return interfaces;
}

function defineFieldMap(config) {
  const fieldMap = resolveObjMapThunk(config.fields);
  isPlainObj(fieldMap) ||
    (0, _devAssert.devAssert)(
      false,
      `${config.name} fields must be an object with field names as keys or a function which returns such an object.`,
    );
  return (0, _mapValue.mapValue)(fieldMap, (fieldConfig, fieldName) => {
    var _fieldConfig$args;

    isPlainObj(fieldConfig) ||
      (0, _devAssert.devAssert)(
        false,
        `${config.name}.${fieldName} field config must be an object.`,
      );
    fieldConfig.resolve == null ||
      typeof fieldConfig.resolve === 'function' ||
      (0, _devAssert.devAssert)(
        false,
        `${config.name}.${fieldName} field resolver must be a function if ` +
          `provided, but got: ${(0, _inspect.inspect)(fieldConfig.resolve)}.`,
      );
    const argsConfig =
      (_fieldConfig$args = fieldConfig.args) !== null &&
      _fieldConfig$args !== void 0
        ? _fieldConfig$args
        : {};
    isPlainObj(argsConfig) ||
      (0, _devAssert.devAssert)(
        false,
        `${config.name}.${fieldName} args must be an object with argument names as keys.`,
      );
    return {
      name: (0, _assertName.assertName)(fieldName),
      description: fieldConfig.description,
      type: fieldConfig.type,
      args: defineArguments(argsConfig),
      resolve: fieldConfig.resolve,
      subscribe: fieldConfig.subscribe,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: (0, _toObjMap.toObjMap)(fieldConfig.extensions),
      astNode: fieldConfig.astNode,
    };
  });
}

function defineArguments(config) {
  return Object.entries(config).map(([argName, argConfig]) => ({
    name: (0, _assertName.assertName)(argName),
    description: argConfig.description,
    type: argConfig.type,
    defaultValue: argConfig.defaultValue,
    deprecationReason: argConfig.deprecationReason,
    extensions: (0, _toObjMap.toObjMap)(argConfig.extensions),
    astNode: argConfig.astNode,
  }));
}

function isPlainObj(obj) {
  return (0, _isObjectLike.isObjectLike)(obj) && !Array.isArray(obj);
}

function fieldsToFieldsConfig(fields) {
  return (0, _mapValue.mapValue)(fields, (field) => ({
    description: field.description,
    type: field.type,
    args: argsToArgsConfig(field.args),
    resolve: field.resolve,
    subscribe: field.subscribe,
    deprecationReason: field.deprecationReason,
    extensions: field.extensions,
    astNode: field.astNode,
  }));
}
/**
 * @internal
 */

function argsToArgsConfig(args) {
  return (0, _keyValMap.keyValMap)(
    args,
    (arg) => arg.name,
    (arg) => ({
      description: arg.description,
      type: arg.type,
      defaultValue: arg.defaultValue,
      deprecationReason: arg.deprecationReason,
      extensions: arg.extensions,
      astNode: arg.astNode,
    }),
  );
}

function isRequiredArgument(arg) {
  return isNonNullType(arg.type) && arg.defaultValue === undefined;
}

/**
 * Interface Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Interface type
 * is used to describe what types are possible, what fields are in common across
 * all types, as well as a function to determine which type is actually used
 * when the field is resolved.
 *
 * Example:
 *
 * ```ts
 * const EntityType = new GraphQLInterfaceType({
 *   name: 'Entity',
 *   fields: {
 *     name: { type: GraphQLString }
 *   }
 * });
 * ```
 */
class GraphQLInterfaceType {
  constructor(config) {
    var _config$extensionASTN3;

    this.name = (0, _assertName.assertName)(config.name);
    this.description = config.description;
    this.resolveType = config.resolveType;
    this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes =
      (_config$extensionASTN3 = config.extensionASTNodes) !== null &&
      _config$extensionASTN3 !== void 0
        ? _config$extensionASTN3
        : [];
    this._fields = defineFieldMap.bind(undefined, config);
    this._interfaces = defineInterfaces.bind(undefined, config);
    config.resolveType == null ||
      typeof config.resolveType === 'function' ||
      (0, _devAssert.devAssert)(
        false,
        `${this.name} must provide "resolveType" as a function, ` +
          `but got: ${(0, _inspect.inspect)(config.resolveType)}.`,
      );
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLInterfaceType';
  }

  getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }

    return this._fields;
  }

  getInterfaces() {
    if (typeof this._interfaces === 'function') {
      this._interfaces = this._interfaces();
    }

    return this._interfaces;
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  }
}

exports.GraphQLInterfaceType = GraphQLInterfaceType;

/**
 * Union Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Union type
 * is used to describe what types are possible as well as providing a function
 * to determine which type is actually used when the field is resolved.
 *
 * Example:
 *
 * ```ts
 * const PetType = new GraphQLUnionType({
 *   name: 'Pet',
 *   types: [ DogType, CatType ],
 *   resolveType(value) {
 *     if (value instanceof Dog) {
 *       return DogType;
 *     }
 *     if (value instanceof Cat) {
 *       return CatType;
 *     }
 *   }
 * });
 * ```
 */
class GraphQLUnionType {
  constructor(config) {
    var _config$extensionASTN4;

    this.name = (0, _assertName.assertName)(config.name);
    this.description = config.description;
    this.resolveType = config.resolveType;
    this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes =
      (_config$extensionASTN4 = config.extensionASTNodes) !== null &&
      _config$extensionASTN4 !== void 0
        ? _config$extensionASTN4
        : [];
    this._types = defineTypes.bind(undefined, config);
    config.resolveType == null ||
      typeof config.resolveType === 'function' ||
      (0, _devAssert.devAssert)(
        false,
        `${this.name} must provide "resolveType" as a function, ` +
          `but got: ${(0, _inspect.inspect)(config.resolveType)}.`,
      );
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLUnionType';
  }

  getTypes() {
    if (typeof this._types === 'function') {
      this._types = this._types();
    }

    return this._types;
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      types: this.getTypes(),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  }
}

exports.GraphQLUnionType = GraphQLUnionType;

function defineTypes(config) {
  const types = resolveReadonlyArrayThunk(config.types);
  Array.isArray(types) ||
    (0, _devAssert.devAssert)(
      false,
      `Must provide Array of types or a function which returns such an array for Union ${config.name}.`,
    );
  return types;
}

/**
 * Enum Type Definition
 *
 * Some leaf values of requests and input values are Enums. GraphQL serializes
 * Enum values as strings, however internally Enums can be represented by any
 * kind of type, often integers.
 *
 * Example:
 *
 * ```ts
 * const RGBType = new GraphQLEnumType({
 *   name: 'RGB',
 *   values: {
 *     RED: { value: 0 },
 *     GREEN: { value: 1 },
 *     BLUE: { value: 2 }
 *   }
 * });
 * ```
 *
 * Note: If a value is not provided in a definition, the name of the enum value
 * will be used as its internal value.
 */
class GraphQLEnumType {
  /* <T> */
  constructor(config) {
    var _config$extensionASTN5;

    this.name = (0, _assertName.assertName)(config.name);
    this.description = config.description;
    this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes =
      (_config$extensionASTN5 = config.extensionASTNodes) !== null &&
      _config$extensionASTN5 !== void 0
        ? _config$extensionASTN5
        : [];
    this._values = defineEnumValues(this.name, config.values);
    this._valueLookup = new Map(
      this._values.map((enumValue) => [enumValue.value, enumValue]),
    );
    this._nameLookup = (0, _keyMap.keyMap)(this._values, (value) => value.name);
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLEnumType';
  }

  getValues() {
    return this._values;
  }

  getValue(name) {
    return this._nameLookup[name];
  }

  serialize(outputValue) {
    const enumValue = this._valueLookup.get(outputValue);

    if (enumValue === undefined) {
      throw new _GraphQLError.GraphQLError(
        `Enum "${this.name}" cannot represent value: ${(0, _inspect.inspect)(
          outputValue,
        )}`,
      );
    }

    return enumValue.name;
  }

  parseValue(inputValue) /* T */
  {
    if (typeof inputValue !== 'string') {
      const valueStr = (0, _inspect.inspect)(inputValue);
      throw new _GraphQLError.GraphQLError(
        `Enum "${this.name}" cannot represent non-string value: ${valueStr}.` +
          didYouMeanEnumValue(this, valueStr),
      );
    }

    const enumValue = this.getValue(inputValue);

    if (enumValue == null) {
      throw new _GraphQLError.GraphQLError(
        `Value "${inputValue}" does not exist in "${this.name}" enum.` +
          didYouMeanEnumValue(this, inputValue),
      );
    }

    return enumValue.value;
  }

  parseLiteral(valueNode, _variables) /* T */
  {
    // Note: variables will be resolved to a value before calling this function.
    if (valueNode.kind !== _kinds.Kind.ENUM) {
      const valueStr = (0, _printer.print)(valueNode);
      throw new _GraphQLError.GraphQLError(
        `Enum "${this.name}" cannot represent non-enum value: ${valueStr}.` +
          didYouMeanEnumValue(this, valueStr),
        valueNode,
      );
    }

    const enumValue = this.getValue(valueNode.value);

    if (enumValue == null) {
      const valueStr = (0, _printer.print)(valueNode);
      throw new _GraphQLError.GraphQLError(
        `Value "${valueStr}" does not exist in "${this.name}" enum.` +
          didYouMeanEnumValue(this, valueStr),
        valueNode,
      );
    }

    return enumValue.value;
  }

  toConfig() {
    const values = (0, _keyValMap.keyValMap)(
      this.getValues(),
      (value) => value.name,
      (value) => ({
        description: value.description,
        value: value.value,
        deprecationReason: value.deprecationReason,
        extensions: value.extensions,
        astNode: value.astNode,
      }),
    );
    return {
      name: this.name,
      description: this.description,
      values,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  }
}

exports.GraphQLEnumType = GraphQLEnumType;

function didYouMeanEnumValue(enumType, unknownValueStr) {
  const allNames = enumType.getValues().map((value) => value.name);
  const suggestedValues = (0, _suggestionList.suggestionList)(
    unknownValueStr,
    allNames,
  );
  return (0, _didYouMean.didYouMean)('the enum value', suggestedValues);
}

function defineEnumValues(typeName, valueMap) {
  isPlainObj(valueMap) ||
    (0, _devAssert.devAssert)(
      false,
      `${typeName} values must be an object with value names as keys.`,
    );
  return Object.entries(valueMap).map(([valueName, valueConfig]) => {
    isPlainObj(valueConfig) ||
      (0, _devAssert.devAssert)(
        false,
        `${typeName}.${valueName} must refer to an object with a "value" key ` +
          `representing an internal value but got: ${(0, _inspect.inspect)(
            valueConfig,
          )}.`,
      );
    return {
      name: (0, _assertName.assertEnumValueName)(valueName),
      description: valueConfig.description,
      value: valueConfig.value !== undefined ? valueConfig.value : valueName,
      deprecationReason: valueConfig.deprecationReason,
      extensions: (0, _toObjMap.toObjMap)(valueConfig.extensions),
      astNode: valueConfig.astNode,
    };
  });
}

/**
 * Input Object Type Definition
 *
 * An input object defines a structured collection of fields which may be
 * supplied to a field argument.
 *
 * Using `NonNull` will ensure that a value must be provided by the query
 *
 * Example:
 *
 * ```ts
 * const GeoPoint = new GraphQLInputObjectType({
 *   name: 'GeoPoint',
 *   fields: {
 *     lat: { type: new GraphQLNonNull(GraphQLFloat) },
 *     lon: { type: new GraphQLNonNull(GraphQLFloat) },
 *     alt: { type: GraphQLFloat, defaultValue: 0 },
 *   }
 * });
 * ```
 */
class GraphQLInputObjectType {
  constructor(config) {
    var _config$extensionASTN6;

    this.name = (0, _assertName.assertName)(config.name);
    this.description = config.description;
    this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes =
      (_config$extensionASTN6 = config.extensionASTNodes) !== null &&
      _config$extensionASTN6 !== void 0
        ? _config$extensionASTN6
        : [];
    this._fields = defineInputFieldMap.bind(undefined, config);
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLInputObjectType';
  }

  getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }

    return this._fields;
  }

  toConfig() {
    const fields = (0, _mapValue.mapValue)(this.getFields(), (field) => ({
      description: field.description,
      type: field.type,
      defaultValue: field.defaultValue,
      deprecationReason: field.deprecationReason,
      extensions: field.extensions,
      astNode: field.astNode,
    }));
    return {
      name: this.name,
      description: this.description,
      fields,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  }
}

exports.GraphQLInputObjectType = GraphQLInputObjectType;

function defineInputFieldMap(config) {
  const fieldMap = resolveObjMapThunk(config.fields);
  isPlainObj(fieldMap) ||
    (0, _devAssert.devAssert)(
      false,
      `${config.name} fields must be an object with field names as keys or a function which returns such an object.`,
    );
  return (0, _mapValue.mapValue)(fieldMap, (fieldConfig, fieldName) => {
    !('resolve' in fieldConfig) ||
      (0, _devAssert.devAssert)(
        false,
        `${config.name}.${fieldName} field has a resolve property, but Input Types cannot define resolvers.`,
      );
    return {
      name: (0, _assertName.assertName)(fieldName),
      description: fieldConfig.description,
      type: fieldConfig.type,
      defaultValue: fieldConfig.defaultValue,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: (0, _toObjMap.toObjMap)(fieldConfig.extensions),
      astNode: fieldConfig.astNode,
    };
  });
}

function isRequiredInputField(field) {
  return isNonNullType(field.type) && field.defaultValue === undefined;
}

},{"../error/GraphQLError.js":35,"../jsutils/devAssert.js":48,"../jsutils/didYouMean.js":49,"../jsutils/identityFunc.js":51,"../jsutils/inspect.js":52,"../jsutils/instanceOf.js":53,"../jsutils/isObjectLike.js":57,"../jsutils/keyMap.js":59,"../jsutils/keyValMap.js":60,"../jsutils/mapValue.js":61,"../jsutils/suggestionList.js":67,"../jsutils/toObjMap.js":68,"../language/kinds.js":74,"../language/printer.js":81,"../utilities/valueFromASTUntyped.js":114,"./assertName.js":85}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.GraphQLSpecifiedByDirective =
  exports.GraphQLSkipDirective =
  exports.GraphQLIncludeDirective =
  exports.GraphQLDirective =
  exports.GraphQLDeprecatedDirective =
  exports.DEFAULT_DEPRECATION_REASON =
    void 0;
exports.assertDirective = assertDirective;
exports.isDirective = isDirective;
exports.isSpecifiedDirective = isSpecifiedDirective;
exports.specifiedDirectives = void 0;

var _inspect = require('../jsutils/inspect.js');

var _toObjMap = require('../jsutils/toObjMap.js');

var _devAssert = require('../jsutils/devAssert.js');

var _instanceOf = require('../jsutils/instanceOf.js');

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _directiveLocation = require('../language/directiveLocation.js');

var _assertName = require('./assertName.js');

var _scalars = require('./scalars.js');

var _definition = require('./definition.js');

/**
 * Test if the given value is a GraphQL directive.
 */
function isDirective(directive) {
  return (0, _instanceOf.instanceOf)(directive, GraphQLDirective);
}

function assertDirective(directive) {
  if (!isDirective(directive)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(directive)} to be a GraphQL directive.`,
    );
  }

  return directive;
}
/**
 * Custom extensions
 *
 * @remarks
 * Use a unique identifier name for your extension, for example the name of
 * your library or project. Do not use a shortened identifier as this increases
 * the risk of conflicts. We recommend you add at most one extension field,
 * an object which can contain all the values you need.
 */

/**
 * Directives are used by the GraphQL runtime as a way of modifying execution
 * behavior. Type system creators will usually not create these directly.
 */
class GraphQLDirective {
  constructor(config) {
    var _config$isRepeatable, _config$args;

    this.name = (0, _assertName.assertName)(config.name);
    this.description = config.description;
    this.locations = config.locations;
    this.isRepeatable =
      (_config$isRepeatable = config.isRepeatable) !== null &&
      _config$isRepeatable !== void 0
        ? _config$isRepeatable
        : false;
    this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
    this.astNode = config.astNode;
    Array.isArray(config.locations) ||
      (0, _devAssert.devAssert)(
        false,
        `@${config.name} locations must be an Array.`,
      );
    const args =
      (_config$args = config.args) !== null && _config$args !== void 0
        ? _config$args
        : {};
    ((0, _isObjectLike.isObjectLike)(args) && !Array.isArray(args)) ||
      (0, _devAssert.devAssert)(
        false,
        `@${config.name} args must be an object with argument names as keys.`,
      );
    this.args = (0, _definition.defineArguments)(args);
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLDirective';
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: (0, _definition.argsToArgsConfig)(this.args),
      isRepeatable: this.isRepeatable,
      extensions: this.extensions,
      astNode: this.astNode,
    };
  }

  toString() {
    return '@' + this.name;
  }

  toJSON() {
    return this.toString();
  }
}

exports.GraphQLDirective = GraphQLDirective;

/**
 * Used to conditionally include fields or fragments.
 */
const GraphQLIncludeDirective = new GraphQLDirective({
  name: 'include',
  description:
    'Directs the executor to include this field or fragment only when the `if` argument is true.',
  locations: [
    _directiveLocation.DirectiveLocation.FIELD,
    _directiveLocation.DirectiveLocation.FRAGMENT_SPREAD,
    _directiveLocation.DirectiveLocation.INLINE_FRAGMENT,
  ],
  args: {
    if: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      description: 'Included when true.',
    },
  },
});
/**
 * Used to conditionally skip (exclude) fields or fragments.
 */

exports.GraphQLIncludeDirective = GraphQLIncludeDirective;
const GraphQLSkipDirective = new GraphQLDirective({
  name: 'skip',
  description:
    'Directs the executor to skip this field or fragment when the `if` argument is true.',
  locations: [
    _directiveLocation.DirectiveLocation.FIELD,
    _directiveLocation.DirectiveLocation.FRAGMENT_SPREAD,
    _directiveLocation.DirectiveLocation.INLINE_FRAGMENT,
  ],
  args: {
    if: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      description: 'Skipped when true.',
    },
  },
});
/**
 * Constant string used for default reason for a deprecation.
 */

exports.GraphQLSkipDirective = GraphQLSkipDirective;
const DEFAULT_DEPRECATION_REASON = 'No longer supported';
/**
 * Used to declare element of a GraphQL schema as deprecated.
 */

exports.DEFAULT_DEPRECATION_REASON = DEFAULT_DEPRECATION_REASON;
const GraphQLDeprecatedDirective = new GraphQLDirective({
  name: 'deprecated',
  description: 'Marks an element of a GraphQL schema as no longer supported.',
  locations: [
    _directiveLocation.DirectiveLocation.FIELD_DEFINITION,
    _directiveLocation.DirectiveLocation.ARGUMENT_DEFINITION,
    _directiveLocation.DirectiveLocation.INPUT_FIELD_DEFINITION,
    _directiveLocation.DirectiveLocation.ENUM_VALUE,
  ],
  args: {
    reason: {
      type: _scalars.GraphQLString,
      description:
        'Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).',
      defaultValue: DEFAULT_DEPRECATION_REASON,
    },
  },
});
/**
 * Used to provide a URL for specifying the behaviour of custom scalar definitions.
 */

exports.GraphQLDeprecatedDirective = GraphQLDeprecatedDirective;
const GraphQLSpecifiedByDirective = new GraphQLDirective({
  name: 'specifiedBy',
  description: 'Exposes a URL that specifies the behaviour of this scalar.',
  locations: [_directiveLocation.DirectiveLocation.SCALAR],
  args: {
    url: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
      description: 'The URL that specifies the behaviour of this scalar.',
    },
  },
});
/**
 * The full list of specified directives.
 */

exports.GraphQLSpecifiedByDirective = GraphQLSpecifiedByDirective;
const specifiedDirectives = Object.freeze([
  GraphQLIncludeDirective,
  GraphQLSkipDirective,
  GraphQLDeprecatedDirective,
  GraphQLSpecifiedByDirective,
]);
exports.specifiedDirectives = specifiedDirectives;

function isSpecifiedDirective(directive) {
  return specifiedDirectives.some(({ name }) => name === directive.name);
}

},{"../jsutils/devAssert.js":48,"../jsutils/inspect.js":52,"../jsutils/instanceOf.js":53,"../jsutils/isObjectLike.js":57,"../jsutils/toObjMap.js":68,"../language/directiveLocation.js":72,"./assertName.js":85,"./definition.js":86,"./scalars.js":90}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'DEFAULT_DEPRECATION_REASON', {
  enumerable: true,
  get: function () {
    return _directives.DEFAULT_DEPRECATION_REASON;
  },
});
Object.defineProperty(exports, 'GraphQLBoolean', {
  enumerable: true,
  get: function () {
    return _scalars.GraphQLBoolean;
  },
});
Object.defineProperty(exports, 'GraphQLDeprecatedDirective', {
  enumerable: true,
  get: function () {
    return _directives.GraphQLDeprecatedDirective;
  },
});
Object.defineProperty(exports, 'GraphQLDirective', {
  enumerable: true,
  get: function () {
    return _directives.GraphQLDirective;
  },
});
Object.defineProperty(exports, 'GraphQLEnumType', {
  enumerable: true,
  get: function () {
    return _definition.GraphQLEnumType;
  },
});
Object.defineProperty(exports, 'GraphQLFloat', {
  enumerable: true,
  get: function () {
    return _scalars.GraphQLFloat;
  },
});
Object.defineProperty(exports, 'GraphQLID', {
  enumerable: true,
  get: function () {
    return _scalars.GraphQLID;
  },
});
Object.defineProperty(exports, 'GraphQLIncludeDirective', {
  enumerable: true,
  get: function () {
    return _directives.GraphQLIncludeDirective;
  },
});
Object.defineProperty(exports, 'GraphQLInputObjectType', {
  enumerable: true,
  get: function () {
    return _definition.GraphQLInputObjectType;
  },
});
Object.defineProperty(exports, 'GraphQLInt', {
  enumerable: true,
  get: function () {
    return _scalars.GraphQLInt;
  },
});
Object.defineProperty(exports, 'GraphQLInterfaceType', {
  enumerable: true,
  get: function () {
    return _definition.GraphQLInterfaceType;
  },
});
Object.defineProperty(exports, 'GraphQLList', {
  enumerable: true,
  get: function () {
    return _definition.GraphQLList;
  },
});
Object.defineProperty(exports, 'GraphQLNonNull', {
  enumerable: true,
  get: function () {
    return _definition.GraphQLNonNull;
  },
});
Object.defineProperty(exports, 'GraphQLObjectType', {
  enumerable: true,
  get: function () {
    return _definition.GraphQLObjectType;
  },
});
Object.defineProperty(exports, 'GraphQLScalarType', {
  enumerable: true,
  get: function () {
    return _definition.GraphQLScalarType;
  },
});
Object.defineProperty(exports, 'GraphQLSchema', {
  enumerable: true,
  get: function () {
    return _schema.GraphQLSchema;
  },
});
Object.defineProperty(exports, 'GraphQLSkipDirective', {
  enumerable: true,
  get: function () {
    return _directives.GraphQLSkipDirective;
  },
});
Object.defineProperty(exports, 'GraphQLSpecifiedByDirective', {
  enumerable: true,
  get: function () {
    return _directives.GraphQLSpecifiedByDirective;
  },
});
Object.defineProperty(exports, 'GraphQLString', {
  enumerable: true,
  get: function () {
    return _scalars.GraphQLString;
  },
});
Object.defineProperty(exports, 'GraphQLUnionType', {
  enumerable: true,
  get: function () {
    return _definition.GraphQLUnionType;
  },
});
Object.defineProperty(exports, 'SchemaMetaFieldDef', {
  enumerable: true,
  get: function () {
    return _introspection.SchemaMetaFieldDef;
  },
});
Object.defineProperty(exports, 'TypeKind', {
  enumerable: true,
  get: function () {
    return _introspection.TypeKind;
  },
});
Object.defineProperty(exports, 'TypeMetaFieldDef', {
  enumerable: true,
  get: function () {
    return _introspection.TypeMetaFieldDef;
  },
});
Object.defineProperty(exports, 'TypeNameMetaFieldDef', {
  enumerable: true,
  get: function () {
    return _introspection.TypeNameMetaFieldDef;
  },
});
Object.defineProperty(exports, '__Directive', {
  enumerable: true,
  get: function () {
    return _introspection.__Directive;
  },
});
Object.defineProperty(exports, '__DirectiveLocation', {
  enumerable: true,
  get: function () {
    return _introspection.__DirectiveLocation;
  },
});
Object.defineProperty(exports, '__EnumValue', {
  enumerable: true,
  get: function () {
    return _introspection.__EnumValue;
  },
});
Object.defineProperty(exports, '__Field', {
  enumerable: true,
  get: function () {
    return _introspection.__Field;
  },
});
Object.defineProperty(exports, '__InputValue', {
  enumerable: true,
  get: function () {
    return _introspection.__InputValue;
  },
});
Object.defineProperty(exports, '__Schema', {
  enumerable: true,
  get: function () {
    return _introspection.__Schema;
  },
});
Object.defineProperty(exports, '__Type', {
  enumerable: true,
  get: function () {
    return _introspection.__Type;
  },
});
Object.defineProperty(exports, '__TypeKind', {
  enumerable: true,
  get: function () {
    return _introspection.__TypeKind;
  },
});
Object.defineProperty(exports, 'assertAbstractType', {
  enumerable: true,
  get: function () {
    return _definition.assertAbstractType;
  },
});
Object.defineProperty(exports, 'assertCompositeType', {
  enumerable: true,
  get: function () {
    return _definition.assertCompositeType;
  },
});
Object.defineProperty(exports, 'assertDirective', {
  enumerable: true,
  get: function () {
    return _directives.assertDirective;
  },
});
Object.defineProperty(exports, 'assertEnumType', {
  enumerable: true,
  get: function () {
    return _definition.assertEnumType;
  },
});
Object.defineProperty(exports, 'assertEnumValueName', {
  enumerable: true,
  get: function () {
    return _assertName.assertEnumValueName;
  },
});
Object.defineProperty(exports, 'assertInputObjectType', {
  enumerable: true,
  get: function () {
    return _definition.assertInputObjectType;
  },
});
Object.defineProperty(exports, 'assertInputType', {
  enumerable: true,
  get: function () {
    return _definition.assertInputType;
  },
});
Object.defineProperty(exports, 'assertInterfaceType', {
  enumerable: true,
  get: function () {
    return _definition.assertInterfaceType;
  },
});
Object.defineProperty(exports, 'assertLeafType', {
  enumerable: true,
  get: function () {
    return _definition.assertLeafType;
  },
});
Object.defineProperty(exports, 'assertListType', {
  enumerable: true,
  get: function () {
    return _definition.assertListType;
  },
});
Object.defineProperty(exports, 'assertName', {
  enumerable: true,
  get: function () {
    return _assertName.assertName;
  },
});
Object.defineProperty(exports, 'assertNamedType', {
  enumerable: true,
  get: function () {
    return _definition.assertNamedType;
  },
});
Object.defineProperty(exports, 'assertNonNullType', {
  enumerable: true,
  get: function () {
    return _definition.assertNonNullType;
  },
});
Object.defineProperty(exports, 'assertNullableType', {
  enumerable: true,
  get: function () {
    return _definition.assertNullableType;
  },
});
Object.defineProperty(exports, 'assertObjectType', {
  enumerable: true,
  get: function () {
    return _definition.assertObjectType;
  },
});
Object.defineProperty(exports, 'assertOutputType', {
  enumerable: true,
  get: function () {
    return _definition.assertOutputType;
  },
});
Object.defineProperty(exports, 'assertScalarType', {
  enumerable: true,
  get: function () {
    return _definition.assertScalarType;
  },
});
Object.defineProperty(exports, 'assertSchema', {
  enumerable: true,
  get: function () {
    return _schema.assertSchema;
  },
});
Object.defineProperty(exports, 'assertType', {
  enumerable: true,
  get: function () {
    return _definition.assertType;
  },
});
Object.defineProperty(exports, 'assertUnionType', {
  enumerable: true,
  get: function () {
    return _definition.assertUnionType;
  },
});
Object.defineProperty(exports, 'assertValidSchema', {
  enumerable: true,
  get: function () {
    return _validate.assertValidSchema;
  },
});
Object.defineProperty(exports, 'assertWrappingType', {
  enumerable: true,
  get: function () {
    return _definition.assertWrappingType;
  },
});
Object.defineProperty(exports, 'getNamedType', {
  enumerable: true,
  get: function () {
    return _definition.getNamedType;
  },
});
Object.defineProperty(exports, 'getNullableType', {
  enumerable: true,
  get: function () {
    return _definition.getNullableType;
  },
});
Object.defineProperty(exports, 'introspectionTypes', {
  enumerable: true,
  get: function () {
    return _introspection.introspectionTypes;
  },
});
Object.defineProperty(exports, 'isAbstractType', {
  enumerable: true,
  get: function () {
    return _definition.isAbstractType;
  },
});
Object.defineProperty(exports, 'isCompositeType', {
  enumerable: true,
  get: function () {
    return _definition.isCompositeType;
  },
});
Object.defineProperty(exports, 'isDirective', {
  enumerable: true,
  get: function () {
    return _directives.isDirective;
  },
});
Object.defineProperty(exports, 'isEnumType', {
  enumerable: true,
  get: function () {
    return _definition.isEnumType;
  },
});
Object.defineProperty(exports, 'isInputObjectType', {
  enumerable: true,
  get: function () {
    return _definition.isInputObjectType;
  },
});
Object.defineProperty(exports, 'isInputType', {
  enumerable: true,
  get: function () {
    return _definition.isInputType;
  },
});
Object.defineProperty(exports, 'isInterfaceType', {
  enumerable: true,
  get: function () {
    return _definition.isInterfaceType;
  },
});
Object.defineProperty(exports, 'isIntrospectionType', {
  enumerable: true,
  get: function () {
    return _introspection.isIntrospectionType;
  },
});
Object.defineProperty(exports, 'isLeafType', {
  enumerable: true,
  get: function () {
    return _definition.isLeafType;
  },
});
Object.defineProperty(exports, 'isListType', {
  enumerable: true,
  get: function () {
    return _definition.isListType;
  },
});
Object.defineProperty(exports, 'isNamedType', {
  enumerable: true,
  get: function () {
    return _definition.isNamedType;
  },
});
Object.defineProperty(exports, 'isNonNullType', {
  enumerable: true,
  get: function () {
    return _definition.isNonNullType;
  },
});
Object.defineProperty(exports, 'isNullableType', {
  enumerable: true,
  get: function () {
    return _definition.isNullableType;
  },
});
Object.defineProperty(exports, 'isObjectType', {
  enumerable: true,
  get: function () {
    return _definition.isObjectType;
  },
});
Object.defineProperty(exports, 'isOutputType', {
  enumerable: true,
  get: function () {
    return _definition.isOutputType;
  },
});
Object.defineProperty(exports, 'isRequiredArgument', {
  enumerable: true,
  get: function () {
    return _definition.isRequiredArgument;
  },
});
Object.defineProperty(exports, 'isRequiredInputField', {
  enumerable: true,
  get: function () {
    return _definition.isRequiredInputField;
  },
});
Object.defineProperty(exports, 'isScalarType', {
  enumerable: true,
  get: function () {
    return _definition.isScalarType;
  },
});
Object.defineProperty(exports, 'isSchema', {
  enumerable: true,
  get: function () {
    return _schema.isSchema;
  },
});
Object.defineProperty(exports, 'isSpecifiedDirective', {
  enumerable: true,
  get: function () {
    return _directives.isSpecifiedDirective;
  },
});
Object.defineProperty(exports, 'isSpecifiedScalarType', {
  enumerable: true,
  get: function () {
    return _scalars.isSpecifiedScalarType;
  },
});
Object.defineProperty(exports, 'isType', {
  enumerable: true,
  get: function () {
    return _definition.isType;
  },
});
Object.defineProperty(exports, 'isUnionType', {
  enumerable: true,
  get: function () {
    return _definition.isUnionType;
  },
});
Object.defineProperty(exports, 'isWrappingType', {
  enumerable: true,
  get: function () {
    return _definition.isWrappingType;
  },
});
Object.defineProperty(exports, 'specifiedDirectives', {
  enumerable: true,
  get: function () {
    return _directives.specifiedDirectives;
  },
});
Object.defineProperty(exports, 'specifiedScalarTypes', {
  enumerable: true,
  get: function () {
    return _scalars.specifiedScalarTypes;
  },
});
Object.defineProperty(exports, 'validateSchema', {
  enumerable: true,
  get: function () {
    return _validate.validateSchema;
  },
});

var _schema = require('./schema.js');

var _definition = require('./definition.js');

var _directives = require('./directives.js');

var _scalars = require('./scalars.js');

var _introspection = require('./introspection.js');

var _validate = require('./validate.js');

var _assertName = require('./assertName.js');

},{"./assertName.js":85,"./definition.js":86,"./directives.js":87,"./introspection.js":89,"./scalars.js":90,"./schema.js":91,"./validate.js":92}],89:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.introspectionTypes =
  exports.__TypeKind =
  exports.__Type =
  exports.__Schema =
  exports.__InputValue =
  exports.__Field =
  exports.__EnumValue =
  exports.__DirectiveLocation =
  exports.__Directive =
  exports.TypeNameMetaFieldDef =
  exports.TypeMetaFieldDef =
  exports.TypeKind =
  exports.SchemaMetaFieldDef =
    void 0;
exports.isIntrospectionType = isIntrospectionType;

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _printer = require('../language/printer.js');

var _directiveLocation = require('../language/directiveLocation.js');

var _astFromValue = require('../utilities/astFromValue.js');

var _scalars = require('./scalars.js');

var _definition = require('./definition.js');

const __Schema = new _definition.GraphQLObjectType({
  name: '__Schema',
  description:
    'A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.',
  fields: () => ({
    description: {
      type: _scalars.GraphQLString,
      resolve: (schema) => schema.description,
    },
    types: {
      description: 'A list of all types supported by this server.',
      type: new _definition.GraphQLNonNull(
        new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),
      ),

      resolve(schema) {
        return Object.values(schema.getTypeMap());
      },
    },
    queryType: {
      description: 'The type that query operations will be rooted at.',
      type: new _definition.GraphQLNonNull(__Type),
      resolve: (schema) => schema.getQueryType(),
    },
    mutationType: {
      description:
        'If this server supports mutation, the type that mutation operations will be rooted at.',
      type: __Type,
      resolve: (schema) => schema.getMutationType(),
    },
    subscriptionType: {
      description:
        'If this server support subscription, the type that subscription operations will be rooted at.',
      type: __Type,
      resolve: (schema) => schema.getSubscriptionType(),
    },
    directives: {
      description: 'A list of all directives supported by this server.',
      type: new _definition.GraphQLNonNull(
        new _definition.GraphQLList(
          new _definition.GraphQLNonNull(__Directive),
        ),
      ),
      resolve: (schema) => schema.getDirectives(),
    },
  }),
});

exports.__Schema = __Schema;

const __Directive = new _definition.GraphQLObjectType({
  name: '__Directive',
  description:
    "A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\nIn some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.",
  fields: () => ({
    name: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
      resolve: (directive) => directive.name,
    },
    description: {
      type: _scalars.GraphQLString,
      resolve: (directive) => directive.description,
    },
    isRepeatable: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      resolve: (directive) => directive.isRepeatable,
    },
    locations: {
      type: new _definition.GraphQLNonNull(
        new _definition.GraphQLList(
          new _definition.GraphQLNonNull(__DirectiveLocation),
        ),
      ),
      resolve: (directive) => directive.locations,
    },
    args: {
      type: new _definition.GraphQLNonNull(
        new _definition.GraphQLList(
          new _definition.GraphQLNonNull(__InputValue),
        ),
      ),
      args: {
        includeDeprecated: {
          type: _scalars.GraphQLBoolean,
          defaultValue: false,
        },
      },

      resolve(field, { includeDeprecated }) {
        return includeDeprecated
          ? field.args
          : field.args.filter((arg) => arg.deprecationReason == null);
      },
    },
  }),
});

exports.__Directive = __Directive;

const __DirectiveLocation = new _definition.GraphQLEnumType({
  name: '__DirectiveLocation',
  description:
    'A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.',
  values: {
    QUERY: {
      value: _directiveLocation.DirectiveLocation.QUERY,
      description: 'Location adjacent to a query operation.',
    },
    MUTATION: {
      value: _directiveLocation.DirectiveLocation.MUTATION,
      description: 'Location adjacent to a mutation operation.',
    },
    SUBSCRIPTION: {
      value: _directiveLocation.DirectiveLocation.SUBSCRIPTION,
      description: 'Location adjacent to a subscription operation.',
    },
    FIELD: {
      value: _directiveLocation.DirectiveLocation.FIELD,
      description: 'Location adjacent to a field.',
    },
    FRAGMENT_DEFINITION: {
      value: _directiveLocation.DirectiveLocation.FRAGMENT_DEFINITION,
      description: 'Location adjacent to a fragment definition.',
    },
    FRAGMENT_SPREAD: {
      value: _directiveLocation.DirectiveLocation.FRAGMENT_SPREAD,
      description: 'Location adjacent to a fragment spread.',
    },
    INLINE_FRAGMENT: {
      value: _directiveLocation.DirectiveLocation.INLINE_FRAGMENT,
      description: 'Location adjacent to an inline fragment.',
    },
    VARIABLE_DEFINITION: {
      value: _directiveLocation.DirectiveLocation.VARIABLE_DEFINITION,
      description: 'Location adjacent to a variable definition.',
    },
    SCHEMA: {
      value: _directiveLocation.DirectiveLocation.SCHEMA,
      description: 'Location adjacent to a schema definition.',
    },
    SCALAR: {
      value: _directiveLocation.DirectiveLocation.SCALAR,
      description: 'Location adjacent to a scalar definition.',
    },
    OBJECT: {
      value: _directiveLocation.DirectiveLocation.OBJECT,
      description: 'Location adjacent to an object type definition.',
    },
    FIELD_DEFINITION: {
      value: _directiveLocation.DirectiveLocation.FIELD_DEFINITION,
      description: 'Location adjacent to a field definition.',
    },
    ARGUMENT_DEFINITION: {
      value: _directiveLocation.DirectiveLocation.ARGUMENT_DEFINITION,
      description: 'Location adjacent to an argument definition.',
    },
    INTERFACE: {
      value: _directiveLocation.DirectiveLocation.INTERFACE,
      description: 'Location adjacent to an interface definition.',
    },
    UNION: {
      value: _directiveLocation.DirectiveLocation.UNION,
      description: 'Location adjacent to a union definition.',
    },
    ENUM: {
      value: _directiveLocation.DirectiveLocation.ENUM,
      description: 'Location adjacent to an enum definition.',
    },
    ENUM_VALUE: {
      value: _directiveLocation.DirectiveLocation.ENUM_VALUE,
      description: 'Location adjacent to an enum value definition.',
    },
    INPUT_OBJECT: {
      value: _directiveLocation.DirectiveLocation.INPUT_OBJECT,
      description: 'Location adjacent to an input object type definition.',
    },
    INPUT_FIELD_DEFINITION: {
      value: _directiveLocation.DirectiveLocation.INPUT_FIELD_DEFINITION,
      description: 'Location adjacent to an input object field definition.',
    },
  },
});

exports.__DirectiveLocation = __DirectiveLocation;

const __Type = new _definition.GraphQLObjectType({
  name: '__Type',
  description:
    'The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.',
  fields: () => ({
    kind: {
      type: new _definition.GraphQLNonNull(__TypeKind),

      resolve(type) {
        if ((0, _definition.isScalarType)(type)) {
          return TypeKind.SCALAR;
        }

        if ((0, _definition.isObjectType)(type)) {
          return TypeKind.OBJECT;
        }

        if ((0, _definition.isInterfaceType)(type)) {
          return TypeKind.INTERFACE;
        }

        if ((0, _definition.isUnionType)(type)) {
          return TypeKind.UNION;
        }

        if ((0, _definition.isEnumType)(type)) {
          return TypeKind.ENUM;
        }

        if ((0, _definition.isInputObjectType)(type)) {
          return TypeKind.INPUT_OBJECT;
        }

        if ((0, _definition.isListType)(type)) {
          return TypeKind.LIST;
        } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

        if ((0, _definition.isNonNullType)(type)) {
          return TypeKind.NON_NULL;
        } // istanbul ignore next (Not reachable. All possible types have been considered)

        false ||
          (0, _invariant.invariant)(
            false,
            `Unexpected type: "${(0, _inspect.inspect)(type)}".`,
          );
      },
    },
    name: {
      type: _scalars.GraphQLString,
      resolve: (type) => ('name' in type ? type.name : undefined),
    },
    description: {
      type: _scalars.GraphQLString,
      resolve: (
        type, // istanbul ignore next (FIXME: add test case)
      ) => ('description' in type ? type.description : undefined),
    },
    specifiedByURL: {
      type: _scalars.GraphQLString,
      resolve: (obj) =>
        'specifiedByURL' in obj ? obj.specifiedByURL : undefined,
    },
    fields: {
      type: new _definition.GraphQLList(
        new _definition.GraphQLNonNull(__Field),
      ),
      args: {
        includeDeprecated: {
          type: _scalars.GraphQLBoolean,
          defaultValue: false,
        },
      },

      resolve(type, { includeDeprecated }) {
        if (
          (0, _definition.isObjectType)(type) ||
          (0, _definition.isInterfaceType)(type)
        ) {
          const fields = Object.values(type.getFields());
          return includeDeprecated
            ? fields
            : fields.filter((field) => field.deprecationReason == null);
        }
      },
    },
    interfaces: {
      type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),

      resolve(type) {
        if (
          (0, _definition.isObjectType)(type) ||
          (0, _definition.isInterfaceType)(type)
        ) {
          return type.getInterfaces();
        }
      },
    },
    possibleTypes: {
      type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),

      resolve(type, _args, _context, { schema }) {
        if ((0, _definition.isAbstractType)(type)) {
          return schema.getPossibleTypes(type);
        }
      },
    },
    enumValues: {
      type: new _definition.GraphQLList(
        new _definition.GraphQLNonNull(__EnumValue),
      ),
      args: {
        includeDeprecated: {
          type: _scalars.GraphQLBoolean,
          defaultValue: false,
        },
      },

      resolve(type, { includeDeprecated }) {
        if ((0, _definition.isEnumType)(type)) {
          const values = type.getValues();
          return includeDeprecated
            ? values
            : values.filter((field) => field.deprecationReason == null);
        }
      },
    },
    inputFields: {
      type: new _definition.GraphQLList(
        new _definition.GraphQLNonNull(__InputValue),
      ),
      args: {
        includeDeprecated: {
          type: _scalars.GraphQLBoolean,
          defaultValue: false,
        },
      },

      resolve(type, { includeDeprecated }) {
        if ((0, _definition.isInputObjectType)(type)) {
          const values = Object.values(type.getFields());
          return includeDeprecated
            ? values
            : values.filter((field) => field.deprecationReason == null);
        }
      },
    },
    ofType: {
      type: __Type,
      resolve: (type) => ('ofType' in type ? type.ofType : undefined),
    },
  }),
});

exports.__Type = __Type;

const __Field = new _definition.GraphQLObjectType({
  name: '__Field',
  description:
    'Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.',
  fields: () => ({
    name: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
      resolve: (field) => field.name,
    },
    description: {
      type: _scalars.GraphQLString,
      resolve: (field) => field.description,
    },
    args: {
      type: new _definition.GraphQLNonNull(
        new _definition.GraphQLList(
          new _definition.GraphQLNonNull(__InputValue),
        ),
      ),
      args: {
        includeDeprecated: {
          type: _scalars.GraphQLBoolean,
          defaultValue: false,
        },
      },

      resolve(field, { includeDeprecated }) {
        return includeDeprecated
          ? field.args
          : field.args.filter((arg) => arg.deprecationReason == null);
      },
    },
    type: {
      type: new _definition.GraphQLNonNull(__Type),
      resolve: (field) => field.type,
    },
    isDeprecated: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      resolve: (field) => field.deprecationReason != null,
    },
    deprecationReason: {
      type: _scalars.GraphQLString,
      resolve: (field) => field.deprecationReason,
    },
  }),
});

exports.__Field = __Field;

const __InputValue = new _definition.GraphQLObjectType({
  name: '__InputValue',
  description:
    'Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.',
  fields: () => ({
    name: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
      resolve: (inputValue) => inputValue.name,
    },
    description: {
      type: _scalars.GraphQLString,
      resolve: (inputValue) => inputValue.description,
    },
    type: {
      type: new _definition.GraphQLNonNull(__Type),
      resolve: (inputValue) => inputValue.type,
    },
    defaultValue: {
      type: _scalars.GraphQLString,
      description:
        'A GraphQL-formatted string representing the default value for this input value.',

      resolve(inputValue) {
        const { type, defaultValue } = inputValue;
        const valueAST = (0, _astFromValue.astFromValue)(defaultValue, type);
        return valueAST ? (0, _printer.print)(valueAST) : null;
      },
    },
    isDeprecated: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      resolve: (field) => field.deprecationReason != null,
    },
    deprecationReason: {
      type: _scalars.GraphQLString,
      resolve: (obj) => obj.deprecationReason,
    },
  }),
});

exports.__InputValue = __InputValue;

const __EnumValue = new _definition.GraphQLObjectType({
  name: '__EnumValue',
  description:
    'One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.',
  fields: () => ({
    name: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
      resolve: (enumValue) => enumValue.name,
    },
    description: {
      type: _scalars.GraphQLString,
      resolve: (enumValue) => enumValue.description,
    },
    isDeprecated: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      resolve: (enumValue) => enumValue.deprecationReason != null,
    },
    deprecationReason: {
      type: _scalars.GraphQLString,
      resolve: (enumValue) => enumValue.deprecationReason,
    },
  }),
});

exports.__EnumValue = __EnumValue;
let TypeKind;
exports.TypeKind = TypeKind;

(function (TypeKind) {
  TypeKind['SCALAR'] = 'SCALAR';
  TypeKind['OBJECT'] = 'OBJECT';
  TypeKind['INTERFACE'] = 'INTERFACE';
  TypeKind['UNION'] = 'UNION';
  TypeKind['ENUM'] = 'ENUM';
  TypeKind['INPUT_OBJECT'] = 'INPUT_OBJECT';
  TypeKind['LIST'] = 'LIST';
  TypeKind['NON_NULL'] = 'NON_NULL';
})(TypeKind || (exports.TypeKind = TypeKind = {}));

const __TypeKind = new _definition.GraphQLEnumType({
  name: '__TypeKind',
  description: 'An enum describing what kind of type a given `__Type` is.',
  values: {
    SCALAR: {
      value: TypeKind.SCALAR,
      description: 'Indicates this type is a scalar.',
    },
    OBJECT: {
      value: TypeKind.OBJECT,
      description:
        'Indicates this type is an object. `fields` and `interfaces` are valid fields.',
    },
    INTERFACE: {
      value: TypeKind.INTERFACE,
      description:
        'Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields.',
    },
    UNION: {
      value: TypeKind.UNION,
      description:
        'Indicates this type is a union. `possibleTypes` is a valid field.',
    },
    ENUM: {
      value: TypeKind.ENUM,
      description:
        'Indicates this type is an enum. `enumValues` is a valid field.',
    },
    INPUT_OBJECT: {
      value: TypeKind.INPUT_OBJECT,
      description:
        'Indicates this type is an input object. `inputFields` is a valid field.',
    },
    LIST: {
      value: TypeKind.LIST,
      description: 'Indicates this type is a list. `ofType` is a valid field.',
    },
    NON_NULL: {
      value: TypeKind.NON_NULL,
      description:
        'Indicates this type is a non-null. `ofType` is a valid field.',
    },
  },
});
/**
 * Note that these are GraphQLField and not GraphQLFieldConfig,
 * so the format for args is different.
 */

exports.__TypeKind = __TypeKind;
const SchemaMetaFieldDef = {
  name: '__schema',
  type: new _definition.GraphQLNonNull(__Schema),
  description: 'Access the current type schema of this server.',
  args: [],
  resolve: (_source, _args, _context, { schema }) => schema,
  deprecationReason: undefined,
  extensions: Object.create(null),
  astNode: undefined,
};
exports.SchemaMetaFieldDef = SchemaMetaFieldDef;
const TypeMetaFieldDef = {
  name: '__type',
  type: __Type,
  description: 'Request the type information of a single type.',
  args: [
    {
      name: 'name',
      description: undefined,
      type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
      defaultValue: undefined,
      deprecationReason: undefined,
      extensions: Object.create(null),
      astNode: undefined,
    },
  ],
  resolve: (_source, { name }, _context, { schema }) => schema.getType(name),
  deprecationReason: undefined,
  extensions: Object.create(null),
  astNode: undefined,
};
exports.TypeMetaFieldDef = TypeMetaFieldDef;
const TypeNameMetaFieldDef = {
  name: '__typename',
  type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
  description: 'The name of the current Object type at runtime.',
  args: [],
  resolve: (_source, _args, _context, { parentType }) => parentType.name,
  deprecationReason: undefined,
  extensions: Object.create(null),
  astNode: undefined,
};
exports.TypeNameMetaFieldDef = TypeNameMetaFieldDef;
const introspectionTypes = Object.freeze([
  __Schema,
  __Directive,
  __DirectiveLocation,
  __Type,
  __Field,
  __InputValue,
  __EnumValue,
  __TypeKind,
]);
exports.introspectionTypes = introspectionTypes;

function isIntrospectionType(type) {
  return introspectionTypes.some(({ name }) => type.name === name);
}

},{"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../language/directiveLocation.js":72,"../language/printer.js":81,"../utilities/astFromValue.js":95,"./definition.js":86,"./scalars.js":90}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.GraphQLString =
  exports.GraphQLInt =
  exports.GraphQLID =
  exports.GraphQLFloat =
  exports.GraphQLBoolean =
    void 0;
exports.isSpecifiedScalarType = isSpecifiedScalarType;
exports.specifiedScalarTypes = void 0;

var _inspect = require('../jsutils/inspect.js');

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _kinds = require('../language/kinds.js');

var _printer = require('../language/printer.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _definition = require('./definition.js');

// As per the GraphQL Spec, Integers are only treated as valid when a valid
// 32-bit signed integer, providing the broadest support across platforms.
//
// n.b. JavaScript's integers are safe between -(2^53 - 1) and 2^53 - 1 because
// they are internally represented as IEEE 754 doubles.
const MAX_INT = 2147483647;
const MIN_INT = -2147483648;
const GraphQLInt = new _definition.GraphQLScalarType({
  name: 'Int',
  description:
    'The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.',

  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);

    if (typeof coercedValue === 'boolean') {
      return coercedValue ? 1 : 0;
    }

    let num = coercedValue;

    if (typeof coercedValue === 'string' && coercedValue !== '') {
      num = Number(coercedValue);
    }

    if (typeof num !== 'number' || !Number.isInteger(num)) {
      throw new _GraphQLError.GraphQLError(
        `Int cannot represent non-integer value: ${(0, _inspect.inspect)(
          coercedValue,
        )}`,
      );
    }

    if (num > MAX_INT || num < MIN_INT) {
      throw new _GraphQLError.GraphQLError(
        'Int cannot represent non 32-bit signed integer value: ' +
          (0, _inspect.inspect)(coercedValue),
      );
    }

    return num;
  },

  parseValue(inputValue) {
    if (typeof inputValue !== 'number' || !Number.isInteger(inputValue)) {
      throw new _GraphQLError.GraphQLError(
        `Int cannot represent non-integer value: ${(0, _inspect.inspect)(
          inputValue,
        )}`,
      );
    }

    if (inputValue > MAX_INT || inputValue < MIN_INT) {
      throw new _GraphQLError.GraphQLError(
        `Int cannot represent non 32-bit signed integer value: ${inputValue}`,
      );
    }

    return inputValue;
  },

  parseLiteral(valueNode) {
    if (valueNode.kind !== _kinds.Kind.INT) {
      throw new _GraphQLError.GraphQLError(
        `Int cannot represent non-integer value: ${(0, _printer.print)(
          valueNode,
        )}`,
        valueNode,
      );
    }

    const num = parseInt(valueNode.value, 10);

    if (num > MAX_INT || num < MIN_INT) {
      throw new _GraphQLError.GraphQLError(
        `Int cannot represent non 32-bit signed integer value: ${valueNode.value}`,
        valueNode,
      );
    }

    return num;
  },
});
exports.GraphQLInt = GraphQLInt;
const GraphQLFloat = new _definition.GraphQLScalarType({
  name: 'Float',
  description:
    'The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).',

  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);

    if (typeof coercedValue === 'boolean') {
      return coercedValue ? 1 : 0;
    }

    let num = coercedValue;

    if (typeof coercedValue === 'string' && coercedValue !== '') {
      num = Number(coercedValue);
    }

    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new _GraphQLError.GraphQLError(
        `Float cannot represent non numeric value: ${(0, _inspect.inspect)(
          coercedValue,
        )}`,
      );
    }

    return num;
  },

  parseValue(inputValue) {
    if (typeof inputValue !== 'number' || !Number.isFinite(inputValue)) {
      throw new _GraphQLError.GraphQLError(
        `Float cannot represent non numeric value: ${(0, _inspect.inspect)(
          inputValue,
        )}`,
      );
    }

    return inputValue;
  },

  parseLiteral(valueNode) {
    if (
      valueNode.kind !== _kinds.Kind.FLOAT &&
      valueNode.kind !== _kinds.Kind.INT
    ) {
      throw new _GraphQLError.GraphQLError(
        `Float cannot represent non numeric value: ${(0, _printer.print)(
          valueNode,
        )}`,
        valueNode,
      );
    }

    return parseFloat(valueNode.value);
  },
});
exports.GraphQLFloat = GraphQLFloat;
const GraphQLString = new _definition.GraphQLScalarType({
  name: 'String',
  description:
    'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.',

  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue); // Serialize string, boolean and number values to a string, but do not
    // attempt to coerce object, function, symbol, or other types as strings.

    if (typeof coercedValue === 'string') {
      return coercedValue;
    }

    if (typeof coercedValue === 'boolean') {
      return coercedValue ? 'true' : 'false';
    }

    if (typeof coercedValue === 'number' && Number.isFinite(coercedValue)) {
      return coercedValue.toString();
    }

    throw new _GraphQLError.GraphQLError(
      `String cannot represent value: ${(0, _inspect.inspect)(outputValue)}`,
    );
  },

  parseValue(inputValue) {
    if (typeof inputValue !== 'string') {
      throw new _GraphQLError.GraphQLError(
        `String cannot represent a non string value: ${(0, _inspect.inspect)(
          inputValue,
        )}`,
      );
    }

    return inputValue;
  },

  parseLiteral(valueNode) {
    if (valueNode.kind !== _kinds.Kind.STRING) {
      throw new _GraphQLError.GraphQLError(
        `String cannot represent a non string value: ${(0, _printer.print)(
          valueNode,
        )}`,
        valueNode,
      );
    }

    return valueNode.value;
  },
});
exports.GraphQLString = GraphQLString;
const GraphQLBoolean = new _definition.GraphQLScalarType({
  name: 'Boolean',
  description: 'The `Boolean` scalar type represents `true` or `false`.',

  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);

    if (typeof coercedValue === 'boolean') {
      return coercedValue;
    }

    if (Number.isFinite(coercedValue)) {
      return coercedValue !== 0;
    }

    throw new _GraphQLError.GraphQLError(
      `Boolean cannot represent a non boolean value: ${(0, _inspect.inspect)(
        coercedValue,
      )}`,
    );
  },

  parseValue(inputValue) {
    if (typeof inputValue !== 'boolean') {
      throw new _GraphQLError.GraphQLError(
        `Boolean cannot represent a non boolean value: ${(0, _inspect.inspect)(
          inputValue,
        )}`,
      );
    }

    return inputValue;
  },

  parseLiteral(valueNode) {
    if (valueNode.kind !== _kinds.Kind.BOOLEAN) {
      throw new _GraphQLError.GraphQLError(
        `Boolean cannot represent a non boolean value: ${(0, _printer.print)(
          valueNode,
        )}`,
        valueNode,
      );
    }

    return valueNode.value;
  },
});
exports.GraphQLBoolean = GraphQLBoolean;
const GraphQLID = new _definition.GraphQLScalarType({
  name: 'ID',
  description:
    'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',

  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);

    if (typeof coercedValue === 'string') {
      return coercedValue;
    }

    if (Number.isInteger(coercedValue)) {
      return String(coercedValue);
    }

    throw new _GraphQLError.GraphQLError(
      `ID cannot represent value: ${(0, _inspect.inspect)(outputValue)}`,
    );
  },

  parseValue(inputValue) {
    if (typeof inputValue === 'string') {
      return inputValue;
    }

    if (typeof inputValue === 'number' && Number.isInteger(inputValue)) {
      return inputValue.toString();
    }

    throw new _GraphQLError.GraphQLError(
      `ID cannot represent value: ${(0, _inspect.inspect)(inputValue)}`,
    );
  },

  parseLiteral(valueNode) {
    if (
      valueNode.kind !== _kinds.Kind.STRING &&
      valueNode.kind !== _kinds.Kind.INT
    ) {
      throw new _GraphQLError.GraphQLError(
        'ID cannot represent a non-string and non-integer value: ' +
          (0, _printer.print)(valueNode),
        valueNode,
      );
    }

    return valueNode.value;
  },
});
exports.GraphQLID = GraphQLID;
const specifiedScalarTypes = Object.freeze([
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID,
]);
exports.specifiedScalarTypes = specifiedScalarTypes;

function isSpecifiedScalarType(type) {
  return specifiedScalarTypes.some(({ name }) => type.name === name);
} // Support serializing objects with custom valueOf() or toJSON() functions -
// a common way to represent a complex value which can be represented as
// a string (ex: MongoDB id objects).

function serializeObject(outputValue) {
  if ((0, _isObjectLike.isObjectLike)(outputValue)) {
    if (typeof outputValue.valueOf === 'function') {
      const valueOfResult = outputValue.valueOf();

      if (!(0, _isObjectLike.isObjectLike)(valueOfResult)) {
        return valueOfResult;
      }
    }

    if (typeof outputValue.toJSON === 'function') {
      return outputValue.toJSON();
    }
  }

  return outputValue;
}

},{"../error/GraphQLError.js":35,"../jsutils/inspect.js":52,"../jsutils/isObjectLike.js":57,"../language/kinds.js":74,"../language/printer.js":81,"./definition.js":86}],91:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.GraphQLSchema = void 0;
exports.assertSchema = assertSchema;
exports.isSchema = isSchema;

var _inspect = require('../jsutils/inspect.js');

var _toObjMap = require('../jsutils/toObjMap.js');

var _devAssert = require('../jsutils/devAssert.js');

var _instanceOf = require('../jsutils/instanceOf.js');

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _introspection = require('./introspection.js');

var _directives = require('./directives.js');

var _definition = require('./definition.js');

/**
 * Test if the given value is a GraphQL schema.
 */
function isSchema(schema) {
  return (0, _instanceOf.instanceOf)(schema, GraphQLSchema);
}

function assertSchema(schema) {
  if (!isSchema(schema)) {
    throw new Error(
      `Expected ${(0, _inspect.inspect)(schema)} to be a GraphQL schema.`,
    );
  }

  return schema;
}
/**
 * Custom extensions
 *
 * @remarks
 * Use a unique identifier name for your extension, for example the name of
 * your library or project. Do not use a shortened identifier as this increases
 * the risk of conflicts. We recommend you add at most one extension field,
 * an object which can contain all the values you need.
 */

/**
 * Schema Definition
 *
 * A Schema is created by supplying the root types of each type of operation,
 * query and mutation (optional). A schema definition is then supplied to the
 * validator and executor.
 *
 * Example:
 *
 * ```ts
 * const MyAppSchema = new GraphQLSchema({
 *   query: MyAppQueryRootType,
 *   mutation: MyAppMutationRootType,
 * })
 * ```
 *
 * Note: When the schema is constructed, by default only the types that are
 * reachable by traversing the root types are included, other types must be
 * explicitly referenced.
 *
 * Example:
 *
 * ```ts
 * const characterInterface = new GraphQLInterfaceType({
 *   name: 'Character',
 *   ...
 * });
 *
 * const humanType = new GraphQLObjectType({
 *   name: 'Human',
 *   interfaces: [characterInterface],
 *   ...
 * });
 *
 * const droidType = new GraphQLObjectType({
 *   name: 'Droid',
 *   interfaces: [characterInterface],
 *   ...
 * });
 *
 * const schema = new GraphQLSchema({
 *   query: new GraphQLObjectType({
 *     name: 'Query',
 *     fields: {
 *       hero: { type: characterInterface, ... },
 *     }
 *   }),
 *   ...
 *   // Since this schema references only the `Character` interface it's
 *   // necessary to explicitly list the types that implement it if
 *   // you want them to be included in the final schema.
 *   types: [humanType, droidType],
 * })
 * ```
 *
 * Note: If an array of `directives` are provided to GraphQLSchema, that will be
 * the exact list of directives represented and allowed. If `directives` is not
 * provided then a default set of the specified directives (e.g. `@include` and
 * `@skip`) will be used. If you wish to provide *additional* directives to these
 * specified directives, you must explicitly declare them. Example:
 *
 * ```ts
 * const MyAppSchema = new GraphQLSchema({
 *   ...
 *   directives: specifiedDirectives.concat([ myCustomDirective ]),
 * })
 * ```
 */
class GraphQLSchema {
  // Used as a cache for validateSchema().
  constructor(config) {
    var _config$extensionASTN, _config$directives;

    // If this schema was built from a source known to be valid, then it may be
    // marked with assumeValid to avoid an additional type system validation.
    this.__validationErrors = config.assumeValid === true ? [] : undefined; // Check for common mistakes during construction to produce early errors.

    (0, _isObjectLike.isObjectLike)(config) ||
      (0, _devAssert.devAssert)(false, 'Must provide configuration object.');
    !config.types ||
      Array.isArray(config.types) ||
      (0, _devAssert.devAssert)(
        false,
        `"types" must be Array if provided but got: ${(0, _inspect.inspect)(
          config.types,
        )}.`,
      );
    !config.directives ||
      Array.isArray(config.directives) ||
      (0, _devAssert.devAssert)(
        false,
        '"directives" must be Array if provided but got: ' +
          `${(0, _inspect.inspect)(config.directives)}.`,
      );
    this.description = config.description;
    this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes =
      (_config$extensionASTN = config.extensionASTNodes) !== null &&
      _config$extensionASTN !== void 0
        ? _config$extensionASTN
        : [];
    this._queryType = config.query;
    this._mutationType = config.mutation;
    this._subscriptionType = config.subscription; // Provide specified directives (e.g. @include and @skip) by default.

    this._directives =
      (_config$directives = config.directives) !== null &&
      _config$directives !== void 0
        ? _config$directives
        : _directives.specifiedDirectives; // To preserve order of user-provided types, we add first to add them to
    // the set of "collected" types, so `collectReferencedTypes` ignore them.

    const allReferencedTypes = new Set(config.types);

    if (config.types != null) {
      for (const type of config.types) {
        // When we ready to process this type, we remove it from "collected" types
        // and then add it together with all dependent types in the correct position.
        allReferencedTypes.delete(type);
        collectReferencedTypes(type, allReferencedTypes);
      }
    }

    if (this._queryType != null) {
      collectReferencedTypes(this._queryType, allReferencedTypes);
    }

    if (this._mutationType != null) {
      collectReferencedTypes(this._mutationType, allReferencedTypes);
    }

    if (this._subscriptionType != null) {
      collectReferencedTypes(this._subscriptionType, allReferencedTypes);
    }

    for (const directive of this._directives) {
      // Directives are not validated until validateSchema() is called.
      if ((0, _directives.isDirective)(directive)) {
        for (const arg of directive.args) {
          collectReferencedTypes(arg.type, allReferencedTypes);
        }
      }
    }

    collectReferencedTypes(_introspection.__Schema, allReferencedTypes); // Storing the resulting map for reference by the schema.

    this._typeMap = Object.create(null);
    this._subTypeMap = Object.create(null); // Keep track of all implementations by interface name.

    this._implementationsMap = Object.create(null);

    for (const namedType of allReferencedTypes) {
      if (namedType == null) {
        continue;
      }

      const typeName = namedType.name;
      typeName ||
        (0, _devAssert.devAssert)(
          false,
          'One of the provided types for building the Schema is missing a name.',
        );

      if (this._typeMap[typeName] !== undefined) {
        throw new Error(
          `Schema must contain uniquely named types but contains multiple types named "${typeName}".`,
        );
      }

      this._typeMap[typeName] = namedType;

      if ((0, _definition.isInterfaceType)(namedType)) {
        // Store implementations by interface.
        for (const iface of namedType.getInterfaces()) {
          if ((0, _definition.isInterfaceType)(iface)) {
            let implementations = this._implementationsMap[iface.name];

            if (implementations === undefined) {
              implementations = this._implementationsMap[iface.name] = {
                objects: [],
                interfaces: [],
              };
            }

            implementations.interfaces.push(namedType);
          }
        }
      } else if ((0, _definition.isObjectType)(namedType)) {
        // Store implementations by objects.
        for (const iface of namedType.getInterfaces()) {
          if ((0, _definition.isInterfaceType)(iface)) {
            let implementations = this._implementationsMap[iface.name];

            if (implementations === undefined) {
              implementations = this._implementationsMap[iface.name] = {
                objects: [],
                interfaces: [],
              };
            }

            implementations.objects.push(namedType);
          }
        }
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLSchema';
  }

  getQueryType() {
    return this._queryType;
  }

  getMutationType() {
    return this._mutationType;
  }

  getSubscriptionType() {
    return this._subscriptionType;
  }

  getRootType(operation) {
    switch (operation) {
      case 'query':
        return this.getQueryType();

      case 'mutation':
        return this.getMutationType();

      case 'subscription':
        return this.getSubscriptionType();
    }
  }

  getTypeMap() {
    return this._typeMap;
  }

  getType(name) {
    return this.getTypeMap()[name];
  }

  getPossibleTypes(abstractType) {
    return (0, _definition.isUnionType)(abstractType)
      ? abstractType.getTypes()
      : this.getImplementations(abstractType).objects;
  }

  getImplementations(interfaceType) {
    const implementations = this._implementationsMap[interfaceType.name];
    return implementations !== null && implementations !== void 0
      ? implementations
      : {
          objects: [],
          interfaces: [],
        };
  }

  isSubType(abstractType, maybeSubType) {
    let map = this._subTypeMap[abstractType.name];

    if (map === undefined) {
      map = Object.create(null);

      if ((0, _definition.isUnionType)(abstractType)) {
        for (const type of abstractType.getTypes()) {
          map[type.name] = true;
        }
      } else {
        const implementations = this.getImplementations(abstractType);

        for (const type of implementations.objects) {
          map[type.name] = true;
        }

        for (const type of implementations.interfaces) {
          map[type.name] = true;
        }
      }

      this._subTypeMap[abstractType.name] = map;
    }

    return map[maybeSubType.name] !== undefined;
  }

  getDirectives() {
    return this._directives;
  }

  getDirective(name) {
    return this.getDirectives().find((directive) => directive.name === name);
  }

  toConfig() {
    return {
      description: this.description,
      query: this.getQueryType(),
      mutation: this.getMutationType(),
      subscription: this.getSubscriptionType(),
      types: Object.values(this.getTypeMap()),
      directives: this.getDirectives(),
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      assumeValid: this.__validationErrors !== undefined,
    };
  }
}

exports.GraphQLSchema = GraphQLSchema;

function collectReferencedTypes(type, typeSet) {
  const namedType = (0, _definition.getNamedType)(type);

  if (!typeSet.has(namedType)) {
    typeSet.add(namedType);

    if ((0, _definition.isUnionType)(namedType)) {
      for (const memberType of namedType.getTypes()) {
        collectReferencedTypes(memberType, typeSet);
      }
    } else if (
      (0, _definition.isObjectType)(namedType) ||
      (0, _definition.isInterfaceType)(namedType)
    ) {
      for (const interfaceType of namedType.getInterfaces()) {
        collectReferencedTypes(interfaceType, typeSet);
      }

      for (const field of Object.values(namedType.getFields())) {
        collectReferencedTypes(field.type, typeSet);

        for (const arg of field.args) {
          collectReferencedTypes(arg.type, typeSet);
        }
      }
    } else if ((0, _definition.isInputObjectType)(namedType)) {
      for (const field of Object.values(namedType.getFields())) {
        collectReferencedTypes(field.type, typeSet);
      }
    }
  }

  return typeSet;
}

},{"../jsutils/devAssert.js":48,"../jsutils/inspect.js":52,"../jsutils/instanceOf.js":53,"../jsutils/isObjectLike.js":57,"../jsutils/toObjMap.js":68,"./definition.js":86,"./directives.js":87,"./introspection.js":89}],92:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.assertValidSchema = assertValidSchema;
exports.validateSchema = validateSchema;

var _inspect = require('../jsutils/inspect.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _ast = require('../language/ast.js');

var _typeComparators = require('../utilities/typeComparators.js');

var _schema = require('./schema.js');

var _introspection = require('./introspection.js');

var _directives = require('./directives.js');

var _definition = require('./definition.js');

/**
 * Implements the "Type Validation" sub-sections of the specification's
 * "Type System" section.
 *
 * Validation runs synchronously, returning an array of encountered errors, or
 * an empty array if no errors were encountered and the Schema is valid.
 */
function validateSchema(schema) {
  // First check to ensure the provided value is in fact a GraphQLSchema.
  (0, _schema.assertSchema)(schema); // If this Schema has already been validated, return the previous results.

  if (schema.__validationErrors) {
    return schema.__validationErrors;
  } // Validate the schema, producing a list of errors.

  const context = new SchemaValidationContext(schema);
  validateRootTypes(context);
  validateDirectives(context);
  validateTypes(context); // Persist the results of validation before returning to ensure validation
  // does not run multiple times for this schema.

  const errors = context.getErrors();
  schema.__validationErrors = errors;
  return errors;
}
/**
 * Utility function which asserts a schema is valid by throwing an error if
 * it is invalid.
 */

function assertValidSchema(schema) {
  const errors = validateSchema(schema);

  if (errors.length !== 0) {
    throw new Error(errors.map((error) => error.message).join('\n\n'));
  }
}

class SchemaValidationContext {
  constructor(schema) {
    this._errors = [];
    this.schema = schema;
  }

  reportError(message, nodes) {
    const _nodes = Array.isArray(nodes) ? nodes.filter(Boolean) : nodes;

    this._errors.push(new _GraphQLError.GraphQLError(message, _nodes));
  }

  getErrors() {
    return this._errors;
  }
}

function validateRootTypes(context) {
  const schema = context.schema;
  const queryType = schema.getQueryType();

  if (!queryType) {
    context.reportError('Query root type must be provided.', schema.astNode);
  } else if (!(0, _definition.isObjectType)(queryType)) {
    var _getOperationTypeNode;

    context.reportError(
      `Query root type must be Object type, it cannot be ${(0,
      _inspect.inspect)(queryType)}.`,
      (_getOperationTypeNode = getOperationTypeNode(
        schema,
        _ast.OperationTypeNode.QUERY,
      )) !== null && _getOperationTypeNode !== void 0
        ? _getOperationTypeNode
        : queryType.astNode,
    );
  }

  const mutationType = schema.getMutationType();

  if (mutationType && !(0, _definition.isObjectType)(mutationType)) {
    var _getOperationTypeNode2;

    context.reportError(
      'Mutation root type must be Object type if provided, it cannot be ' +
        `${(0, _inspect.inspect)(mutationType)}.`,
      (_getOperationTypeNode2 = getOperationTypeNode(
        schema,
        _ast.OperationTypeNode.MUTATION,
      )) !== null && _getOperationTypeNode2 !== void 0
        ? _getOperationTypeNode2
        : mutationType.astNode,
    );
  }

  const subscriptionType = schema.getSubscriptionType();

  if (subscriptionType && !(0, _definition.isObjectType)(subscriptionType)) {
    var _getOperationTypeNode3;

    context.reportError(
      'Subscription root type must be Object type if provided, it cannot be ' +
        `${(0, _inspect.inspect)(subscriptionType)}.`,
      (_getOperationTypeNode3 = getOperationTypeNode(
        schema,
        _ast.OperationTypeNode.SUBSCRIPTION,
      )) !== null && _getOperationTypeNode3 !== void 0
        ? _getOperationTypeNode3
        : subscriptionType.astNode,
    );
  }
}

function getOperationTypeNode(schema, operation) {
  var _flatMap$find;

  // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
  return (_flatMap$find = [schema.astNode, ...schema.extensionASTNodes]
    .flatMap((schemaNode) => {
      var _schemaNode$operation;

      return (_schemaNode$operation =
        schemaNode === null || schemaNode === void 0
          ? void 0
          : schemaNode.operationTypes) !== null &&
        _schemaNode$operation !== void 0
        ? _schemaNode$operation
        : [];
    })
    .find((operationNode) => operationNode.operation === operation)) === null ||
    _flatMap$find === void 0
    ? void 0
    : _flatMap$find.type;
}

function validateDirectives(context) {
  for (const directive of context.schema.getDirectives()) {
    // Ensure all directives are in fact GraphQL directives.
    if (!(0, _directives.isDirective)(directive)) {
      context.reportError(
        `Expected directive but got: ${(0, _inspect.inspect)(directive)}.`,
        directive === null || directive === void 0 ? void 0 : directive.astNode,
      );
      continue;
    } // Ensure they are named correctly.

    validateName(context, directive); // TODO: Ensure proper locations.
    // Ensure the arguments are valid.

    for (const arg of directive.args) {
      // Ensure they are named correctly.
      validateName(context, arg); // Ensure the type is an input type.

      if (!(0, _definition.isInputType)(arg.type)) {
        context.reportError(
          `The type of @${directive.name}(${arg.name}:) must be Input Type ` +
            `but got: ${(0, _inspect.inspect)(arg.type)}.`,
          arg.astNode,
        );
      }

      if (
        (0, _definition.isRequiredArgument)(arg) &&
        arg.deprecationReason != null
      ) {
        var _arg$astNode;

        context.reportError(
          `Required argument @${directive.name}(${arg.name}:) cannot be deprecated.`,
          [
            getDeprecatedDirectiveNode(arg.astNode),
            (_arg$astNode = arg.astNode) === null || _arg$astNode === void 0
              ? void 0
              : _arg$astNode.type,
          ],
        );
      }
    }
  }
}

function validateName(context, node) {
  // Ensure names are valid, however introspection types opt out.
  if (node.name.startsWith('__')) {
    context.reportError(
      `Name "${node.name}" must not begin with "__", which is reserved by GraphQL introspection.`,
      node.astNode,
    );
  }
}

function validateTypes(context) {
  const validateInputObjectCircularRefs =
    createInputObjectCircularRefsValidator(context);
  const typeMap = context.schema.getTypeMap();

  for (const type of Object.values(typeMap)) {
    // Ensure all provided types are in fact GraphQL type.
    if (!(0, _definition.isNamedType)(type)) {
      context.reportError(
        `Expected GraphQL named type but got: ${(0, _inspect.inspect)(type)}.`,
        type.astNode,
      );
      continue;
    } // Ensure it is named correctly (excluding introspection types).

    if (!(0, _introspection.isIntrospectionType)(type)) {
      validateName(context, type);
    }

    if ((0, _definition.isObjectType)(type)) {
      // Ensure fields are valid
      validateFields(context, type); // Ensure objects implement the interfaces they claim to.

      validateInterfaces(context, type);
    } else if ((0, _definition.isInterfaceType)(type)) {
      // Ensure fields are valid.
      validateFields(context, type); // Ensure interfaces implement the interfaces they claim to.

      validateInterfaces(context, type);
    } else if ((0, _definition.isUnionType)(type)) {
      // Ensure Unions include valid member types.
      validateUnionMembers(context, type);
    } else if ((0, _definition.isEnumType)(type)) {
      // Ensure Enums have valid values.
      validateEnumValues(context, type);
    } else if ((0, _definition.isInputObjectType)(type)) {
      // Ensure Input Object fields are valid.
      validateInputFields(context, type); // Ensure Input Objects do not contain non-nullable circular references

      validateInputObjectCircularRefs(type);
    }
  }
}

function validateFields(context, type) {
  const fields = Object.values(type.getFields()); // Objects and Interfaces both must define one or more fields.

  if (fields.length === 0) {
    context.reportError(`Type ${type.name} must define one or more fields.`, [
      type.astNode,
      ...type.extensionASTNodes,
    ]);
  }

  for (const field of fields) {
    // Ensure they are named correctly.
    validateName(context, field); // Ensure the type is an output type

    if (!(0, _definition.isOutputType)(field.type)) {
      var _field$astNode;

      context.reportError(
        `The type of ${type.name}.${field.name} must be Output Type ` +
          `but got: ${(0, _inspect.inspect)(field.type)}.`,
        (_field$astNode = field.astNode) === null || _field$astNode === void 0
          ? void 0
          : _field$astNode.type,
      );
    } // Ensure the arguments are valid

    for (const arg of field.args) {
      const argName = arg.name; // Ensure they are named correctly.

      validateName(context, arg); // Ensure the type is an input type

      if (!(0, _definition.isInputType)(arg.type)) {
        var _arg$astNode2;

        context.reportError(
          `The type of ${type.name}.${field.name}(${argName}:) must be Input ` +
            `Type but got: ${(0, _inspect.inspect)(arg.type)}.`,
          (_arg$astNode2 = arg.astNode) === null || _arg$astNode2 === void 0
            ? void 0
            : _arg$astNode2.type,
        );
      }

      if (
        (0, _definition.isRequiredArgument)(arg) &&
        arg.deprecationReason != null
      ) {
        var _arg$astNode3;

        context.reportError(
          `Required argument ${type.name}.${field.name}(${argName}:) cannot be deprecated.`,
          [
            getDeprecatedDirectiveNode(arg.astNode),
            (_arg$astNode3 = arg.astNode) === null || _arg$astNode3 === void 0
              ? void 0
              : _arg$astNode3.type,
          ],
        );
      }
    }
  }
}

function validateInterfaces(context, type) {
  const ifaceTypeNames = Object.create(null);

  for (const iface of type.getInterfaces()) {
    if (!(0, _definition.isInterfaceType)(iface)) {
      context.reportError(
        `Type ${(0, _inspect.inspect)(
          type,
        )} must only implement Interface types, ` +
          `it cannot implement ${(0, _inspect.inspect)(iface)}.`,
        getAllImplementsInterfaceNodes(type, iface),
      );
      continue;
    }

    if (type === iface) {
      context.reportError(
        `Type ${type.name} cannot implement itself because it would create a circular reference.`,
        getAllImplementsInterfaceNodes(type, iface),
      );
      continue;
    }

    if (ifaceTypeNames[iface.name]) {
      context.reportError(
        `Type ${type.name} can only implement ${iface.name} once.`,
        getAllImplementsInterfaceNodes(type, iface),
      );
      continue;
    }

    ifaceTypeNames[iface.name] = true;
    validateTypeImplementsAncestors(context, type, iface);
    validateTypeImplementsInterface(context, type, iface);
  }
}

function validateTypeImplementsInterface(context, type, iface) {
  const typeFieldMap = type.getFields(); // Assert each interface field is implemented.

  for (const ifaceField of Object.values(iface.getFields())) {
    const fieldName = ifaceField.name;
    const typeField = typeFieldMap[fieldName]; // Assert interface field exists on type.

    if (!typeField) {
      context.reportError(
        `Interface field ${iface.name}.${fieldName} expected but ${type.name} does not provide it.`,
        [ifaceField.astNode, type.astNode, ...type.extensionASTNodes],
      );
      continue;
    } // Assert interface field type is satisfied by type field type, by being
    // a valid subtype. (covariant)

    if (
      !(0, _typeComparators.isTypeSubTypeOf)(
        context.schema,
        typeField.type,
        ifaceField.type,
      )
    ) {
      var _ifaceField$astNode, _typeField$astNode;

      context.reportError(
        `Interface field ${iface.name}.${fieldName} expects type ` +
          `${(0, _inspect.inspect)(ifaceField.type)} but ${
            type.name
          }.${fieldName} ` +
          `is type ${(0, _inspect.inspect)(typeField.type)}.`,
        [
          (_ifaceField$astNode = ifaceField.astNode) === null ||
          _ifaceField$astNode === void 0
            ? void 0
            : _ifaceField$astNode.type,
          (_typeField$astNode = typeField.astNode) === null ||
          _typeField$astNode === void 0
            ? void 0
            : _typeField$astNode.type,
        ],
      );
    } // Assert each interface field arg is implemented.

    for (const ifaceArg of ifaceField.args) {
      const argName = ifaceArg.name;
      const typeArg = typeField.args.find((arg) => arg.name === argName); // Assert interface field arg exists on object field.

      if (!typeArg) {
        context.reportError(
          `Interface field argument ${iface.name}.${fieldName}(${argName}:) expected but ${type.name}.${fieldName} does not provide it.`,
          [ifaceArg.astNode, typeField.astNode],
        );
        continue;
      } // Assert interface field arg type matches object field arg type.
      // (invariant)
      // TODO: change to contravariant?

      if (!(0, _typeComparators.isEqualType)(ifaceArg.type, typeArg.type)) {
        var _ifaceArg$astNode, _typeArg$astNode;

        context.reportError(
          `Interface field argument ${iface.name}.${fieldName}(${argName}:) ` +
            `expects type ${(0, _inspect.inspect)(ifaceArg.type)} but ` +
            `${type.name}.${fieldName}(${argName}:) is type ` +
            `${(0, _inspect.inspect)(typeArg.type)}.`,
          [
            // istanbul ignore next (TODO need to write coverage tests)
            (_ifaceArg$astNode = ifaceArg.astNode) === null ||
            _ifaceArg$astNode === void 0
              ? void 0
              : _ifaceArg$astNode.type, // istanbul ignore next (TODO need to write coverage tests)
            (_typeArg$astNode = typeArg.astNode) === null ||
            _typeArg$astNode === void 0
              ? void 0
              : _typeArg$astNode.type,
          ],
        );
      } // TODO: validate default values?
    } // Assert additional arguments must not be required.

    for (const typeArg of typeField.args) {
      const argName = typeArg.name;
      const ifaceArg = ifaceField.args.find((arg) => arg.name === argName);

      if (!ifaceArg && (0, _definition.isRequiredArgument)(typeArg)) {
        context.reportError(
          `Object field ${type.name}.${fieldName} includes required argument ${argName} that is missing from the Interface field ${iface.name}.${fieldName}.`,
          [typeArg.astNode, ifaceField.astNode],
        );
      }
    }
  }
}

function validateTypeImplementsAncestors(context, type, iface) {
  const ifaceInterfaces = type.getInterfaces();

  for (const transitive of iface.getInterfaces()) {
    if (!ifaceInterfaces.includes(transitive)) {
      context.reportError(
        transitive === type
          ? `Type ${type.name} cannot implement ${iface.name} because it would create a circular reference.`
          : `Type ${type.name} must implement ${transitive.name} because it is implemented by ${iface.name}.`,
        [
          ...getAllImplementsInterfaceNodes(iface, transitive),
          ...getAllImplementsInterfaceNodes(type, iface),
        ],
      );
    }
  }
}

function validateUnionMembers(context, union) {
  const memberTypes = union.getTypes();

  if (memberTypes.length === 0) {
    context.reportError(
      `Union type ${union.name} must define one or more member types.`,
      [union.astNode, ...union.extensionASTNodes],
    );
  }

  const includedTypeNames = Object.create(null);

  for (const memberType of memberTypes) {
    if (includedTypeNames[memberType.name]) {
      context.reportError(
        `Union type ${union.name} can only include type ${memberType.name} once.`,
        getUnionMemberTypeNodes(union, memberType.name),
      );
      continue;
    }

    includedTypeNames[memberType.name] = true;

    if (!(0, _definition.isObjectType)(memberType)) {
      context.reportError(
        `Union type ${union.name} can only include Object types, ` +
          `it cannot include ${(0, _inspect.inspect)(memberType)}.`,
        getUnionMemberTypeNodes(union, String(memberType)),
      );
    }
  }
}

function validateEnumValues(context, enumType) {
  const enumValues = enumType.getValues();

  if (enumValues.length === 0) {
    context.reportError(
      `Enum type ${enumType.name} must define one or more values.`,
      [enumType.astNode, ...enumType.extensionASTNodes],
    );
  }

  for (const enumValue of enumValues) {
    // Ensure valid name.
    validateName(context, enumValue);
  }
}

function validateInputFields(context, inputObj) {
  const fields = Object.values(inputObj.getFields());

  if (fields.length === 0) {
    context.reportError(
      `Input Object type ${inputObj.name} must define one or more fields.`,
      [inputObj.astNode, ...inputObj.extensionASTNodes],
    );
  } // Ensure the arguments are valid

  for (const field of fields) {
    // Ensure they are named correctly.
    validateName(context, field); // Ensure the type is an input type

    if (!(0, _definition.isInputType)(field.type)) {
      var _field$astNode2;

      context.reportError(
        `The type of ${inputObj.name}.${field.name} must be Input Type ` +
          `but got: ${(0, _inspect.inspect)(field.type)}.`,
        (_field$astNode2 = field.astNode) === null || _field$astNode2 === void 0
          ? void 0
          : _field$astNode2.type,
      );
    }

    if (
      (0, _definition.isRequiredInputField)(field) &&
      field.deprecationReason != null
    ) {
      var _field$astNode3;

      context.reportError(
        `Required input field ${inputObj.name}.${field.name} cannot be deprecated.`,
        [
          getDeprecatedDirectiveNode(field.astNode), // istanbul ignore next (TODO need to write coverage tests)
          (_field$astNode3 = field.astNode) === null ||
          _field$astNode3 === void 0
            ? void 0
            : _field$astNode3.type,
        ],
      );
    }
  }
}

function createInputObjectCircularRefsValidator(context) {
  // Modified copy of algorithm from 'src/validation/rules/NoFragmentCycles.js'.
  // Tracks already visited types to maintain O(N) and to ensure that cycles
  // are not redundantly reported.
  const visitedTypes = Object.create(null); // Array of types nodes used to produce meaningful errors

  const fieldPath = []; // Position in the type path

  const fieldPathIndexByTypeName = Object.create(null);
  return detectCycleRecursive; // This does a straight-forward DFS to find cycles.
  // It does not terminate when a cycle was found but continues to explore
  // the graph to find all possible cycles.

  function detectCycleRecursive(inputObj) {
    if (visitedTypes[inputObj.name]) {
      return;
    }

    visitedTypes[inputObj.name] = true;
    fieldPathIndexByTypeName[inputObj.name] = fieldPath.length;
    const fields = Object.values(inputObj.getFields());

    for (const field of fields) {
      if (
        (0, _definition.isNonNullType)(field.type) &&
        (0, _definition.isInputObjectType)(field.type.ofType)
      ) {
        const fieldType = field.type.ofType;
        const cycleIndex = fieldPathIndexByTypeName[fieldType.name];
        fieldPath.push(field);

        if (cycleIndex === undefined) {
          detectCycleRecursive(fieldType);
        } else {
          const cyclePath = fieldPath.slice(cycleIndex);
          const pathStr = cyclePath.map((fieldObj) => fieldObj.name).join('.');
          context.reportError(
            `Cannot reference Input Object "${fieldType.name}" within itself through a series of non-null fields: "${pathStr}".`,
            cyclePath.map((fieldObj) => fieldObj.astNode),
          );
        }

        fieldPath.pop();
      }
    }

    fieldPathIndexByTypeName[inputObj.name] = undefined;
  }
}

function getAllImplementsInterfaceNodes(type, iface) {
  const { astNode, extensionASTNodes } = type;
  const nodes =
    astNode != null ? [astNode, ...extensionASTNodes] : extensionASTNodes; // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

  return nodes
    .flatMap((typeNode) => {
      var _typeNode$interfaces;

      return (_typeNode$interfaces = typeNode.interfaces) !== null &&
        _typeNode$interfaces !== void 0
        ? _typeNode$interfaces
        : [];
    })
    .filter((ifaceNode) => ifaceNode.name.value === iface.name);
}

function getUnionMemberTypeNodes(union, typeName) {
  const { astNode, extensionASTNodes } = union;
  const nodes =
    astNode != null ? [astNode, ...extensionASTNodes] : extensionASTNodes; // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

  return nodes
    .flatMap((unionNode) => {
      var _unionNode$types;

      return (_unionNode$types = unionNode.types) !== null &&
        _unionNode$types !== void 0
        ? _unionNode$types
        : [];
    })
    .filter((typeNode) => typeNode.name.value === typeName);
}

function getDeprecatedDirectiveNode(definitionNode) {
  var _definitionNode$direc;

  // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
  return definitionNode === null || definitionNode === void 0
    ? void 0
    : (_definitionNode$direc = definitionNode.directives) === null ||
      _definitionNode$direc === void 0
    ? void 0
    : _definitionNode$direc.find(
        (node) =>
          node.name.value === _directives.GraphQLDeprecatedDirective.name,
      );
}

},{"../error/GraphQLError.js":35,"../jsutils/inspect.js":52,"../language/ast.js":69,"../utilities/typeComparators.js":111,"./definition.js":86,"./directives.js":87,"./introspection.js":89,"./schema.js":91}],93:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.TypeInfo = void 0;
exports.visitWithTypeInfo = visitWithTypeInfo;

var _kinds = require('../language/kinds.js');

var _ast = require('../language/ast.js');

var _visitor = require('../language/visitor.js');

var _definition = require('../type/definition.js');

var _introspection = require('../type/introspection.js');

var _typeFromAST = require('./typeFromAST.js');

/**
 * TypeInfo is a utility class which, given a GraphQL schema, can keep track
 * of the current field and type definitions at any point in a GraphQL document
 * AST during a recursive descent by calling `enter(node)` and `leave(node)`.
 */
class TypeInfo {
  constructor(
    schema,
    /**
     * Initial type may be provided in rare cases to facilitate traversals
     *  beginning somewhere other than documents.
     */
    initialType,
    /** @deprecated will be removed in 17.0.0 */
    getFieldDefFn,
  ) {
    this._schema = schema;
    this._typeStack = [];
    this._parentTypeStack = [];
    this._inputTypeStack = [];
    this._fieldDefStack = [];
    this._defaultValueStack = [];
    this._directive = null;
    this._argument = null;
    this._enumValue = null;
    this._getFieldDef =
      getFieldDefFn !== null && getFieldDefFn !== void 0
        ? getFieldDefFn
        : getFieldDef;

    if (initialType) {
      if ((0, _definition.isInputType)(initialType)) {
        this._inputTypeStack.push(initialType);
      }

      if ((0, _definition.isCompositeType)(initialType)) {
        this._parentTypeStack.push(initialType);
      }

      if ((0, _definition.isOutputType)(initialType)) {
        this._typeStack.push(initialType);
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'TypeInfo';
  }

  getType() {
    if (this._typeStack.length > 0) {
      return this._typeStack[this._typeStack.length - 1];
    }
  }

  getParentType() {
    if (this._parentTypeStack.length > 0) {
      return this._parentTypeStack[this._parentTypeStack.length - 1];
    }
  }

  getInputType() {
    if (this._inputTypeStack.length > 0) {
      return this._inputTypeStack[this._inputTypeStack.length - 1];
    }
  }

  getParentInputType() {
    if (this._inputTypeStack.length > 1) {
      return this._inputTypeStack[this._inputTypeStack.length - 2];
    }
  }

  getFieldDef() {
    if (this._fieldDefStack.length > 0) {
      return this._fieldDefStack[this._fieldDefStack.length - 1];
    }
  }

  getDefaultValue() {
    if (this._defaultValueStack.length > 0) {
      return this._defaultValueStack[this._defaultValueStack.length - 1];
    }
  }

  getDirective() {
    return this._directive;
  }

  getArgument() {
    return this._argument;
  }

  getEnumValue() {
    return this._enumValue;
  }

  enter(node) {
    const schema = this._schema; // Note: many of the types below are explicitly typed as "unknown" to drop
    // any assumptions of a valid schema to ensure runtime types are properly
    // checked before continuing since TypeInfo is used as part of validation
    // which occurs before guarantees of schema and document validity.

    switch (node.kind) {
      case _kinds.Kind.SELECTION_SET: {
        const namedType = (0, _definition.getNamedType)(this.getType());

        this._parentTypeStack.push(
          (0, _definition.isCompositeType)(namedType) ? namedType : undefined,
        );

        break;
      }

      case _kinds.Kind.FIELD: {
        const parentType = this.getParentType();
        let fieldDef;
        let fieldType;

        if (parentType) {
          fieldDef = this._getFieldDef(schema, parentType, node);

          if (fieldDef) {
            fieldType = fieldDef.type;
          }
        }

        this._fieldDefStack.push(fieldDef);

        this._typeStack.push(
          (0, _definition.isOutputType)(fieldType) ? fieldType : undefined,
        );

        break;
      }

      case _kinds.Kind.DIRECTIVE:
        this._directive = schema.getDirective(node.name.value);
        break;

      case _kinds.Kind.OPERATION_DEFINITION: {
        const rootType = schema.getRootType(node.operation);

        this._typeStack.push(
          (0, _definition.isObjectType)(rootType) ? rootType : undefined,
        );

        break;
      }

      case _kinds.Kind.INLINE_FRAGMENT:
      case _kinds.Kind.FRAGMENT_DEFINITION: {
        const typeConditionAST = node.typeCondition;
        const outputType = typeConditionAST
          ? (0, _typeFromAST.typeFromAST)(schema, typeConditionAST)
          : (0, _definition.getNamedType)(this.getType());

        this._typeStack.push(
          (0, _definition.isOutputType)(outputType) ? outputType : undefined,
        );

        break;
      }

      case _kinds.Kind.VARIABLE_DEFINITION: {
        const inputType = (0, _typeFromAST.typeFromAST)(schema, node.type);

        this._inputTypeStack.push(
          (0, _definition.isInputType)(inputType) ? inputType : undefined,
        );

        break;
      }

      case _kinds.Kind.ARGUMENT: {
        var _this$getDirective;

        let argDef;
        let argType;
        const fieldOrDirective =
          (_this$getDirective = this.getDirective()) !== null &&
          _this$getDirective !== void 0
            ? _this$getDirective
            : this.getFieldDef();

        if (fieldOrDirective) {
          argDef = fieldOrDirective.args.find(
            (arg) => arg.name === node.name.value,
          );

          if (argDef) {
            argType = argDef.type;
          }
        }

        this._argument = argDef;

        this._defaultValueStack.push(argDef ? argDef.defaultValue : undefined);

        this._inputTypeStack.push(
          (0, _definition.isInputType)(argType) ? argType : undefined,
        );

        break;
      }

      case _kinds.Kind.LIST: {
        const listType = (0, _definition.getNullableType)(this.getInputType());
        const itemType = (0, _definition.isListType)(listType)
          ? listType.ofType
          : listType; // List positions never have a default value.

        this._defaultValueStack.push(undefined);

        this._inputTypeStack.push(
          (0, _definition.isInputType)(itemType) ? itemType : undefined,
        );

        break;
      }

      case _kinds.Kind.OBJECT_FIELD: {
        const objectType = (0, _definition.getNamedType)(this.getInputType());
        let inputFieldType;
        let inputField;

        if ((0, _definition.isInputObjectType)(objectType)) {
          inputField = objectType.getFields()[node.name.value];

          if (inputField) {
            inputFieldType = inputField.type;
          }
        }

        this._defaultValueStack.push(
          inputField ? inputField.defaultValue : undefined,
        );

        this._inputTypeStack.push(
          (0, _definition.isInputType)(inputFieldType)
            ? inputFieldType
            : undefined,
        );

        break;
      }

      case _kinds.Kind.ENUM: {
        const enumType = (0, _definition.getNamedType)(this.getInputType());
        let enumValue;

        if ((0, _definition.isEnumType)(enumType)) {
          enumValue = enumType.getValue(node.value);
        }

        this._enumValue = enumValue;
        break;
      }
    }
  }

  leave(node) {
    switch (node.kind) {
      case _kinds.Kind.SELECTION_SET:
        this._parentTypeStack.pop();

        break;

      case _kinds.Kind.FIELD:
        this._fieldDefStack.pop();

        this._typeStack.pop();

        break;

      case _kinds.Kind.DIRECTIVE:
        this._directive = null;
        break;

      case _kinds.Kind.OPERATION_DEFINITION:
      case _kinds.Kind.INLINE_FRAGMENT:
      case _kinds.Kind.FRAGMENT_DEFINITION:
        this._typeStack.pop();

        break;

      case _kinds.Kind.VARIABLE_DEFINITION:
        this._inputTypeStack.pop();

        break;

      case _kinds.Kind.ARGUMENT:
        this._argument = null;

        this._defaultValueStack.pop();

        this._inputTypeStack.pop();

        break;

      case _kinds.Kind.LIST:
      case _kinds.Kind.OBJECT_FIELD:
        this._defaultValueStack.pop();

        this._inputTypeStack.pop();

        break;

      case _kinds.Kind.ENUM:
        this._enumValue = null;
        break;
    }
  }
}

exports.TypeInfo = TypeInfo;

/**
 * Not exactly the same as the executor's definition of getFieldDef, in this
 * statically evaluated environment we do not always have an Object type,
 * and need to handle Interface and Union types.
 */
function getFieldDef(schema, parentType, fieldNode) {
  const name = fieldNode.name.value;

  if (
    name === _introspection.SchemaMetaFieldDef.name &&
    schema.getQueryType() === parentType
  ) {
    return _introspection.SchemaMetaFieldDef;
  }

  if (
    name === _introspection.TypeMetaFieldDef.name &&
    schema.getQueryType() === parentType
  ) {
    return _introspection.TypeMetaFieldDef;
  }

  if (
    name === _introspection.TypeNameMetaFieldDef.name &&
    (0, _definition.isCompositeType)(parentType)
  ) {
    return _introspection.TypeNameMetaFieldDef;
  }

  if (
    (0, _definition.isObjectType)(parentType) ||
    (0, _definition.isInterfaceType)(parentType)
  ) {
    return parentType.getFields()[name];
  }
}
/**
 * Creates a new visitor instance which maintains a provided TypeInfo instance
 * along with visiting visitor.
 */

function visitWithTypeInfo(typeInfo, visitor) {
  return {
    enter(...args) {
      const node = args[0];
      typeInfo.enter(node);
      const fn = (0, _visitor.getEnterLeaveForKind)(visitor, node.kind).enter;

      if (fn) {
        const result = fn.apply(visitor, args);

        if (result !== undefined) {
          typeInfo.leave(node);

          if ((0, _ast.isNode)(result)) {
            typeInfo.enter(result);
          }
        }

        return result;
      }
    },

    leave(...args) {
      const node = args[0];
      const fn = (0, _visitor.getEnterLeaveForKind)(visitor, node.kind).leave;
      let result;

      if (fn) {
        result = fn.apply(visitor, args);
      }

      typeInfo.leave(node);
      return result;
    },
  };
}

},{"../language/ast.js":69,"../language/kinds.js":74,"../language/visitor.js":84,"../type/definition.js":86,"../type/introspection.js":89,"./typeFromAST.js":112}],94:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.assertValidName = assertValidName;
exports.isValidNameError = isValidNameError;

var _devAssert = require('../jsutils/devAssert.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _assertName = require('../type/assertName.js');

/**
 * Upholds the spec rules about naming.
 * @deprecated Please use `assertName` instead. Will be removed in v17
 */
// istanbul ignore next (Deprecated code)
function assertValidName(name) {
  const error = isValidNameError(name);

  if (error) {
    throw error;
  }

  return name;
}
/**
 * Returns an Error if a name is invalid.
 * @deprecated Please use `assertName` instead. Will be removed in v17
 */
// istanbul ignore next (Deprecated code)

function isValidNameError(name) {
  typeof name === 'string' ||
    (0, _devAssert.devAssert)(false, 'Expected name to be a string.');

  if (name.startsWith('__')) {
    return new _GraphQLError.GraphQLError(
      `Name "${name}" must not begin with "__", which is reserved by GraphQL introspection.`,
    );
  }

  try {
    (0, _assertName.assertName)(name);
  } catch (error) {
    return error;
  }
}

},{"../error/GraphQLError.js":35,"../jsutils/devAssert.js":48,"../type/assertName.js":85}],95:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.astFromValue = astFromValue;

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _isIterableObject = require('../jsutils/isIterableObject.js');

var _kinds = require('../language/kinds.js');

var _scalars = require('../type/scalars.js');

var _definition = require('../type/definition.js');

/**
 * Produces a GraphQL Value AST given a JavaScript object.
 * Function will match JavaScript/JSON values to GraphQL AST schema format
 * by using suggested GraphQLInputType. For example:
 *
 *     astFromValue("value", GraphQLString)
 *
 * A GraphQL type must be provided, which will be used to interpret different
 * JavaScript values.
 *
 * | JSON Value    | GraphQL Value        |
 * | ------------- | -------------------- |
 * | Object        | Input Object         |
 * | Array         | List                 |
 * | Boolean       | Boolean              |
 * | String        | String / Enum Value  |
 * | Number        | Int / Float          |
 * | Unknown       | Enum Value           |
 * | null          | NullValue            |
 *
 */
function astFromValue(value, type) {
  if ((0, _definition.isNonNullType)(type)) {
    const astValue = astFromValue(value, type.ofType);

    if (
      (astValue === null || astValue === void 0 ? void 0 : astValue.kind) ===
      _kinds.Kind.NULL
    ) {
      return null;
    }

    return astValue;
  } // only explicit null, not undefined, NaN

  if (value === null) {
    return {
      kind: _kinds.Kind.NULL,
    };
  } // undefined

  if (value === undefined) {
    return null;
  } // Convert JavaScript array to GraphQL list. If the GraphQLType is a list, but
  // the value is not an array, convert the value using the list's item type.

  if ((0, _definition.isListType)(type)) {
    const itemType = type.ofType;

    if ((0, _isIterableObject.isIterableObject)(value)) {
      const valuesNodes = [];

      for (const item of value) {
        const itemNode = astFromValue(item, itemType);

        if (itemNode != null) {
          valuesNodes.push(itemNode);
        }
      }

      return {
        kind: _kinds.Kind.LIST,
        values: valuesNodes,
      };
    }

    return astFromValue(value, itemType);
  } // Populate the fields of the input object by creating ASTs from each value
  // in the JavaScript object according to the fields in the input type.

  if ((0, _definition.isInputObjectType)(type)) {
    if (!(0, _isObjectLike.isObjectLike)(value)) {
      return null;
    }

    const fieldNodes = [];

    for (const field of Object.values(type.getFields())) {
      const fieldValue = astFromValue(value[field.name], field.type);

      if (fieldValue) {
        fieldNodes.push({
          kind: _kinds.Kind.OBJECT_FIELD,
          name: {
            kind: _kinds.Kind.NAME,
            value: field.name,
          },
          value: fieldValue,
        });
      }
    }

    return {
      kind: _kinds.Kind.OBJECT,
      fields: fieldNodes,
    };
  } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

  if ((0, _definition.isLeafType)(type)) {
    // Since value is an internally represented value, it must be serialized
    // to an externally represented value before converting into an AST.
    const serialized = type.serialize(value);

    if (serialized == null) {
      return null;
    } // Others serialize based on their corresponding JavaScript scalar types.

    if (typeof serialized === 'boolean') {
      return {
        kind: _kinds.Kind.BOOLEAN,
        value: serialized,
      };
    } // JavaScript numbers can be Int or Float values.

    if (typeof serialized === 'number' && Number.isFinite(serialized)) {
      const stringNum = String(serialized);
      return integerStringRegExp.test(stringNum)
        ? {
            kind: _kinds.Kind.INT,
            value: stringNum,
          }
        : {
            kind: _kinds.Kind.FLOAT,
            value: stringNum,
          };
    }

    if (typeof serialized === 'string') {
      // Enum types use Enum literals.
      if ((0, _definition.isEnumType)(type)) {
        return {
          kind: _kinds.Kind.ENUM,
          value: serialized,
        };
      } // ID types can use Int literals.

      if (type === _scalars.GraphQLID && integerStringRegExp.test(serialized)) {
        return {
          kind: _kinds.Kind.INT,
          value: serialized,
        };
      }

      return {
        kind: _kinds.Kind.STRING,
        value: serialized,
      };
    }

    throw new TypeError(
      `Cannot convert value to AST: ${(0, _inspect.inspect)(serialized)}.`,
    );
  } // istanbul ignore next (Not reachable. All possible input types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected input type: ' + (0, _inspect.inspect)(type),
    );
}
/**
 * IntValue:
 *   - NegativeSign? 0
 *   - NegativeSign? NonZeroDigit ( Digit+ )?
 */

const integerStringRegExp = /^-?(?:0|[1-9][0-9]*)$/;

},{"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../jsutils/isIterableObject.js":56,"../jsutils/isObjectLike.js":57,"../language/kinds.js":74,"../type/definition.js":86,"../type/scalars.js":90}],96:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.buildASTSchema = buildASTSchema;
exports.buildSchema = buildSchema;

var _devAssert = require('../jsutils/devAssert.js');

var _kinds = require('../language/kinds.js');

var _parser = require('../language/parser.js');

var _validate = require('../validation/validate.js');

var _schema = require('../type/schema.js');

var _directives = require('../type/directives.js');

var _extendSchema = require('./extendSchema.js');

/**
 * This takes the ast of a schema document produced by the parse function in
 * src/language/parser.js.
 *
 * If no schema definition is provided, then it will look for types named Query,
 * Mutation and Subscription.
 *
 * Given that AST it constructs a GraphQLSchema. The resulting schema
 * has no resolve methods, so execution will use default resolvers.
 */
function buildASTSchema(documentAST, options) {
  (documentAST != null && documentAST.kind === _kinds.Kind.DOCUMENT) ||
    (0, _devAssert.devAssert)(false, 'Must provide valid Document AST.');

  if (
    (options === null || options === void 0 ? void 0 : options.assumeValid) !==
      true &&
    (options === null || options === void 0
      ? void 0
      : options.assumeValidSDL) !== true
  ) {
    (0, _validate.assertValidSDL)(documentAST);
  }

  const emptySchemaConfig = {
    description: undefined,
    types: [],
    directives: [],
    extensions: Object.create(null),
    extensionASTNodes: [],
    assumeValid: false,
  };
  const config = (0, _extendSchema.extendSchemaImpl)(
    emptySchemaConfig,
    documentAST,
    options,
  );

  if (config.astNode == null) {
    for (const type of config.types) {
      switch (type.name) {
        // Note: While this could make early assertions to get the correctly
        // typed values below, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        case 'Query':
          // @ts-expect-error validated in `validateSchema`
          config.query = type;
          break;

        case 'Mutation':
          // @ts-expect-error validated in `validateSchema`
          config.mutation = type;
          break;

        case 'Subscription':
          // @ts-expect-error validated in `validateSchema`
          config.subscription = type;
          break;
      }
    }
  }

  const directives = [
    ...config.directives, // If specified directives were not explicitly declared, add them.
    ..._directives.specifiedDirectives.filter((stdDirective) =>
      config.directives.every(
        (directive) => directive.name !== stdDirective.name,
      ),
    ),
  ];
  return new _schema.GraphQLSchema({ ...config, directives });
}
/**
 * A helper function to build a GraphQLSchema directly from a source
 * document.
 */

function buildSchema(source, options) {
  const document = (0, _parser.parse)(source, {
    noLocation:
      options === null || options === void 0 ? void 0 : options.noLocation,
    allowLegacyFragmentVariables:
      options === null || options === void 0
        ? void 0
        : options.allowLegacyFragmentVariables,
  });
  return buildASTSchema(document, {
    assumeValidSDL:
      options === null || options === void 0 ? void 0 : options.assumeValidSDL,
    assumeValid:
      options === null || options === void 0 ? void 0 : options.assumeValid,
  });
}

},{"../jsutils/devAssert.js":48,"../language/kinds.js":74,"../language/parser.js":77,"../type/directives.js":87,"../type/schema.js":91,"../validation/validate.js":154,"./extendSchema.js":100}],97:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.buildClientSchema = buildClientSchema;

var _inspect = require('../jsutils/inspect.js');

var _devAssert = require('../jsutils/devAssert.js');

var _keyValMap = require('../jsutils/keyValMap.js');

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _parser = require('../language/parser.js');

var _schema = require('../type/schema.js');

var _directives = require('../type/directives.js');

var _scalars = require('../type/scalars.js');

var _introspection = require('../type/introspection.js');

var _definition = require('../type/definition.js');

var _valueFromAST = require('./valueFromAST.js');

/**
 * Build a GraphQLSchema for use by client tools.
 *
 * Given the result of a client running the introspection query, creates and
 * returns a GraphQLSchema instance which can be then used with all graphql-js
 * tools, but cannot be used to execute a query, as introspection does not
 * represent the "resolver", "parse" or "serialize" functions or any other
 * server-internal mechanisms.
 *
 * This function expects a complete introspection result. Don't forget to check
 * the "errors" field of a server response before calling this function.
 */
function buildClientSchema(introspection, options) {
  ((0, _isObjectLike.isObjectLike)(introspection) &&
    (0, _isObjectLike.isObjectLike)(introspection.__schema)) ||
    (0, _devAssert.devAssert)(
      false,
      `Invalid or incomplete introspection result. Ensure that you are passing "data" property of introspection response and no "errors" was returned alongside: ${(0,
      _inspect.inspect)(introspection)}.`,
    ); // Get the schema from the introspection result.

  const schemaIntrospection = introspection.__schema; // Iterate through all types, getting the type definition for each.

  const typeMap = (0, _keyValMap.keyValMap)(
    schemaIntrospection.types,
    (typeIntrospection) => typeIntrospection.name,
    (typeIntrospection) => buildType(typeIntrospection),
  ); // Include standard types only if they are used.

  for (const stdType of [
    ..._scalars.specifiedScalarTypes,
    ..._introspection.introspectionTypes,
  ]) {
    if (typeMap[stdType.name]) {
      typeMap[stdType.name] = stdType;
    }
  } // Get the root Query, Mutation, and Subscription types.

  const queryType = schemaIntrospection.queryType
    ? getObjectType(schemaIntrospection.queryType)
    : null;
  const mutationType = schemaIntrospection.mutationType
    ? getObjectType(schemaIntrospection.mutationType)
    : null;
  const subscriptionType = schemaIntrospection.subscriptionType
    ? getObjectType(schemaIntrospection.subscriptionType)
    : null; // Get the directives supported by Introspection, assuming empty-set if
  // directives were not queried for.

  const directives = schemaIntrospection.directives
    ? schemaIntrospection.directives.map(buildDirective)
    : []; // Then produce and return a Schema with these types.

  return new _schema.GraphQLSchema({
    description: schemaIntrospection.description,
    query: queryType,
    mutation: mutationType,
    subscription: subscriptionType,
    types: Object.values(typeMap),
    directives,
    assumeValid:
      options === null || options === void 0 ? void 0 : options.assumeValid,
  }); // Given a type reference in introspection, return the GraphQLType instance.
  // preferring cached instances before building new instances.

  function getType(typeRef) {
    if (typeRef.kind === _introspection.TypeKind.LIST) {
      const itemRef = typeRef.ofType;

      if (!itemRef) {
        throw new Error('Decorated type deeper than introspection query.');
      }

      return new _definition.GraphQLList(getType(itemRef));
    }

    if (typeRef.kind === _introspection.TypeKind.NON_NULL) {
      const nullableRef = typeRef.ofType;

      if (!nullableRef) {
        throw new Error('Decorated type deeper than introspection query.');
      }

      const nullableType = getType(nullableRef);
      return new _definition.GraphQLNonNull(
        (0, _definition.assertNullableType)(nullableType),
      );
    }

    return getNamedType(typeRef);
  }

  function getNamedType(typeRef) {
    const typeName = typeRef.name;

    if (!typeName) {
      throw new Error(
        `Unknown type reference: ${(0, _inspect.inspect)(typeRef)}.`,
      );
    }

    const type = typeMap[typeName];

    if (!type) {
      throw new Error(
        `Invalid or incomplete schema, unknown type: ${typeName}. Ensure that a full introspection query is used in order to build a client schema.`,
      );
    }

    return type;
  }

  function getObjectType(typeRef) {
    return (0, _definition.assertObjectType)(getNamedType(typeRef));
  }

  function getInterfaceType(typeRef) {
    return (0, _definition.assertInterfaceType)(getNamedType(typeRef));
  } // Given a type's introspection result, construct the correct
  // GraphQLType instance.

  function buildType(type) {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (type != null && type.name != null && type.kind != null) {
      switch (type.kind) {
        case _introspection.TypeKind.SCALAR:
          return buildScalarDef(type);

        case _introspection.TypeKind.OBJECT:
          return buildObjectDef(type);

        case _introspection.TypeKind.INTERFACE:
          return buildInterfaceDef(type);

        case _introspection.TypeKind.UNION:
          return buildUnionDef(type);

        case _introspection.TypeKind.ENUM:
          return buildEnumDef(type);

        case _introspection.TypeKind.INPUT_OBJECT:
          return buildInputObjectDef(type);
      }
    }

    const typeStr = (0, _inspect.inspect)(type);
    throw new Error(
      `Invalid or incomplete introspection result. Ensure that a full introspection query is used in order to build a client schema: ${typeStr}.`,
    );
  }

  function buildScalarDef(scalarIntrospection) {
    return new _definition.GraphQLScalarType({
      name: scalarIntrospection.name,
      description: scalarIntrospection.description,
      specifiedByURL: scalarIntrospection.specifiedByURL,
    });
  }

  function buildImplementationsList(implementingIntrospection) {
    // TODO: Temporary workaround until GraphQL ecosystem will fully support
    // 'interfaces' on interface types.
    if (
      implementingIntrospection.interfaces === null &&
      implementingIntrospection.kind === _introspection.TypeKind.INTERFACE
    ) {
      return [];
    }

    if (!implementingIntrospection.interfaces) {
      const implementingIntrospectionStr = (0, _inspect.inspect)(
        implementingIntrospection,
      );
      throw new Error(
        `Introspection result missing interfaces: ${implementingIntrospectionStr}.`,
      );
    }

    return implementingIntrospection.interfaces.map(getInterfaceType);
  }

  function buildObjectDef(objectIntrospection) {
    return new _definition.GraphQLObjectType({
      name: objectIntrospection.name,
      description: objectIntrospection.description,
      interfaces: () => buildImplementationsList(objectIntrospection),
      fields: () => buildFieldDefMap(objectIntrospection),
    });
  }

  function buildInterfaceDef(interfaceIntrospection) {
    return new _definition.GraphQLInterfaceType({
      name: interfaceIntrospection.name,
      description: interfaceIntrospection.description,
      interfaces: () => buildImplementationsList(interfaceIntrospection),
      fields: () => buildFieldDefMap(interfaceIntrospection),
    });
  }

  function buildUnionDef(unionIntrospection) {
    if (!unionIntrospection.possibleTypes) {
      const unionIntrospectionStr = (0, _inspect.inspect)(unionIntrospection);
      throw new Error(
        `Introspection result missing possibleTypes: ${unionIntrospectionStr}.`,
      );
    }

    return new _definition.GraphQLUnionType({
      name: unionIntrospection.name,
      description: unionIntrospection.description,
      types: () => unionIntrospection.possibleTypes.map(getObjectType),
    });
  }

  function buildEnumDef(enumIntrospection) {
    if (!enumIntrospection.enumValues) {
      const enumIntrospectionStr = (0, _inspect.inspect)(enumIntrospection);
      throw new Error(
        `Introspection result missing enumValues: ${enumIntrospectionStr}.`,
      );
    }

    return new _definition.GraphQLEnumType({
      name: enumIntrospection.name,
      description: enumIntrospection.description,
      values: (0, _keyValMap.keyValMap)(
        enumIntrospection.enumValues,
        (valueIntrospection) => valueIntrospection.name,
        (valueIntrospection) => ({
          description: valueIntrospection.description,
          deprecationReason: valueIntrospection.deprecationReason,
        }),
      ),
    });
  }

  function buildInputObjectDef(inputObjectIntrospection) {
    if (!inputObjectIntrospection.inputFields) {
      const inputObjectIntrospectionStr = (0, _inspect.inspect)(
        inputObjectIntrospection,
      );
      throw new Error(
        `Introspection result missing inputFields: ${inputObjectIntrospectionStr}.`,
      );
    }

    return new _definition.GraphQLInputObjectType({
      name: inputObjectIntrospection.name,
      description: inputObjectIntrospection.description,
      fields: () => buildInputValueDefMap(inputObjectIntrospection.inputFields),
    });
  }

  function buildFieldDefMap(typeIntrospection) {
    if (!typeIntrospection.fields) {
      throw new Error(
        `Introspection result missing fields: ${(0, _inspect.inspect)(
          typeIntrospection,
        )}.`,
      );
    }

    return (0, _keyValMap.keyValMap)(
      typeIntrospection.fields,
      (fieldIntrospection) => fieldIntrospection.name,
      buildField,
    );
  }

  function buildField(fieldIntrospection) {
    const type = getType(fieldIntrospection.type);

    if (!(0, _definition.isOutputType)(type)) {
      const typeStr = (0, _inspect.inspect)(type);
      throw new Error(
        `Introspection must provide output type for fields, but received: ${typeStr}.`,
      );
    }

    if (!fieldIntrospection.args) {
      const fieldIntrospectionStr = (0, _inspect.inspect)(fieldIntrospection);
      throw new Error(
        `Introspection result missing field args: ${fieldIntrospectionStr}.`,
      );
    }

    return {
      description: fieldIntrospection.description,
      deprecationReason: fieldIntrospection.deprecationReason,
      type,
      args: buildInputValueDefMap(fieldIntrospection.args),
    };
  }

  function buildInputValueDefMap(inputValueIntrospections) {
    return (0, _keyValMap.keyValMap)(
      inputValueIntrospections,
      (inputValue) => inputValue.name,
      buildInputValue,
    );
  }

  function buildInputValue(inputValueIntrospection) {
    const type = getType(inputValueIntrospection.type);

    if (!(0, _definition.isInputType)(type)) {
      const typeStr = (0, _inspect.inspect)(type);
      throw new Error(
        `Introspection must provide input type for arguments, but received: ${typeStr}.`,
      );
    }

    const defaultValue =
      inputValueIntrospection.defaultValue != null
        ? (0, _valueFromAST.valueFromAST)(
            (0, _parser.parseValue)(inputValueIntrospection.defaultValue),
            type,
          )
        : undefined;
    return {
      description: inputValueIntrospection.description,
      type,
      defaultValue,
      deprecationReason: inputValueIntrospection.deprecationReason,
    };
  }

  function buildDirective(directiveIntrospection) {
    if (!directiveIntrospection.args) {
      const directiveIntrospectionStr = (0, _inspect.inspect)(
        directiveIntrospection,
      );
      throw new Error(
        `Introspection result missing directive args: ${directiveIntrospectionStr}.`,
      );
    }

    if (!directiveIntrospection.locations) {
      const directiveIntrospectionStr = (0, _inspect.inspect)(
        directiveIntrospection,
      );
      throw new Error(
        `Introspection result missing directive locations: ${directiveIntrospectionStr}.`,
      );
    }

    return new _directives.GraphQLDirective({
      name: directiveIntrospection.name,
      description: directiveIntrospection.description,
      isRepeatable: directiveIntrospection.isRepeatable,
      locations: directiveIntrospection.locations.slice(),
      args: buildInputValueDefMap(directiveIntrospection.args),
    });
  }
}

},{"../jsutils/devAssert.js":48,"../jsutils/inspect.js":52,"../jsutils/isObjectLike.js":57,"../jsutils/keyValMap.js":60,"../language/parser.js":77,"../type/definition.js":86,"../type/directives.js":87,"../type/introspection.js":89,"../type/scalars.js":90,"../type/schema.js":91,"./valueFromAST.js":113}],98:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.coerceInputValue = coerceInputValue;

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _didYouMean = require('../jsutils/didYouMean.js');

var _isObjectLike = require('../jsutils/isObjectLike.js');

var _suggestionList = require('../jsutils/suggestionList.js');

var _printPathArray = require('../jsutils/printPathArray.js');

var _Path = require('../jsutils/Path.js');

var _isIterableObject = require('../jsutils/isIterableObject.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _definition = require('../type/definition.js');

/**
 * Coerces a JavaScript value given a GraphQL Input Type.
 */
function coerceInputValue(inputValue, type, onError = defaultOnError) {
  return coerceInputValueImpl(inputValue, type, onError, undefined);
}

function defaultOnError(path, invalidValue, error) {
  let errorPrefix = 'Invalid value ' + (0, _inspect.inspect)(invalidValue);

  if (path.length > 0) {
    errorPrefix += ` at "value${(0, _printPathArray.printPathArray)(path)}"`;
  }

  error.message = errorPrefix + ': ' + error.message;
  throw error;
}

function coerceInputValueImpl(inputValue, type, onError, path) {
  if ((0, _definition.isNonNullType)(type)) {
    if (inputValue != null) {
      return coerceInputValueImpl(inputValue, type.ofType, onError, path);
    }

    onError(
      (0, _Path.pathToArray)(path),
      inputValue,
      new _GraphQLError.GraphQLError(
        `Expected non-nullable type "${(0, _inspect.inspect)(
          type,
        )}" not to be null.`,
      ),
    );
    return;
  }

  if (inputValue == null) {
    // Explicitly return the value null.
    return null;
  }

  if ((0, _definition.isListType)(type)) {
    const itemType = type.ofType;

    if ((0, _isIterableObject.isIterableObject)(inputValue)) {
      return Array.from(inputValue, (itemValue, index) => {
        const itemPath = (0, _Path.addPath)(path, index, undefined);
        return coerceInputValueImpl(itemValue, itemType, onError, itemPath);
      });
    } // Lists accept a non-list value as a list of one.

    return [coerceInputValueImpl(inputValue, itemType, onError, path)];
  }

  if ((0, _definition.isInputObjectType)(type)) {
    if (!(0, _isObjectLike.isObjectLike)(inputValue)) {
      onError(
        (0, _Path.pathToArray)(path),
        inputValue,
        new _GraphQLError.GraphQLError(
          `Expected type "${type.name}" to be an object.`,
        ),
      );
      return;
    }

    const coercedValue = {};
    const fieldDefs = type.getFields();

    for (const field of Object.values(fieldDefs)) {
      const fieldValue = inputValue[field.name];

      if (fieldValue === undefined) {
        if (field.defaultValue !== undefined) {
          coercedValue[field.name] = field.defaultValue;
        } else if ((0, _definition.isNonNullType)(field.type)) {
          const typeStr = (0, _inspect.inspect)(field.type);
          onError(
            (0, _Path.pathToArray)(path),
            inputValue,
            new _GraphQLError.GraphQLError(
              `Field "${field.name}" of required type "${typeStr}" was not provided.`,
            ),
          );
        }

        continue;
      }

      coercedValue[field.name] = coerceInputValueImpl(
        fieldValue,
        field.type,
        onError,
        (0, _Path.addPath)(path, field.name, type.name),
      );
    } // Ensure every provided field is defined.

    for (const fieldName of Object.keys(inputValue)) {
      if (!fieldDefs[fieldName]) {
        const suggestions = (0, _suggestionList.suggestionList)(
          fieldName,
          Object.keys(type.getFields()),
        );
        onError(
          (0, _Path.pathToArray)(path),
          inputValue,
          new _GraphQLError.GraphQLError(
            `Field "${fieldName}" is not defined by type "${type.name}".` +
              (0, _didYouMean.didYouMean)(suggestions),
          ),
        );
      }
    }

    return coercedValue;
  } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

  if ((0, _definition.isLeafType)(type)) {
    let parseResult; // Scalars and Enums determine if a input value is valid via parseValue(),
    // which can throw to indicate failure. If it throws, maintain a reference
    // to the original error.

    try {
      parseResult = type.parseValue(inputValue);
    } catch (error) {
      if (error instanceof _GraphQLError.GraphQLError) {
        onError((0, _Path.pathToArray)(path), inputValue, error);
      } else {
        onError(
          (0, _Path.pathToArray)(path),
          inputValue,
          new _GraphQLError.GraphQLError(
            `Expected type "${type.name}". ` + error.message,
            undefined,
            undefined,
            undefined,
            undefined,
            error,
          ),
        );
      }

      return;
    }

    if (parseResult === undefined) {
      onError(
        (0, _Path.pathToArray)(path),
        inputValue,
        new _GraphQLError.GraphQLError(`Expected type "${type.name}".`),
      );
    }

    return parseResult;
  } // istanbul ignore next (Not reachable. All possible input types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected input type: ' + (0, _inspect.inspect)(type),
    );
}

},{"../error/GraphQLError.js":35,"../jsutils/Path.js":47,"../jsutils/didYouMean.js":49,"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../jsutils/isIterableObject.js":56,"../jsutils/isObjectLike.js":57,"../jsutils/printPathArray.js":64,"../jsutils/suggestionList.js":67,"../type/definition.js":86}],99:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.concatAST = concatAST;

var _kinds = require('../language/kinds.js');

/**
 * Provided a collection of ASTs, presumably each from different files,
 * concatenate the ASTs together into batched AST, useful for validating many
 * GraphQL source files which together represent one conceptual application.
 */
function concatAST(documents) {
  const definitions = [];

  for (const doc of documents) {
    definitions.push(...doc.definitions);
  }

  return {
    kind: _kinds.Kind.DOCUMENT,
    definitions,
  };
}

},{"../language/kinds.js":74}],100:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.extendSchema = extendSchema;
exports.extendSchemaImpl = extendSchemaImpl;

var _keyMap = require('../jsutils/keyMap.js');

var _inspect = require('../jsutils/inspect.js');

var _mapValue = require('../jsutils/mapValue.js');

var _invariant = require('../jsutils/invariant.js');

var _devAssert = require('../jsutils/devAssert.js');

var _kinds = require('../language/kinds.js');

var _predicates = require('../language/predicates.js');

var _validate = require('../validation/validate.js');

var _values = require('../execution/values.js');

var _schema = require('../type/schema.js');

var _scalars = require('../type/scalars.js');

var _introspection = require('../type/introspection.js');

var _directives = require('../type/directives.js');

var _definition = require('../type/definition.js');

var _valueFromAST = require('./valueFromAST.js');

/**
 * Produces a new schema given an existing schema and a document which may
 * contain GraphQL type extensions and definitions. The original schema will
 * remain unaltered.
 *
 * Because a schema represents a graph of references, a schema cannot be
 * extended without effectively making an entire copy. We do not know until it's
 * too late if subgraphs remain unchanged.
 *
 * This algorithm copies the provided schema, applying extensions while
 * producing the copy. The original schema remains unaltered.
 */
function extendSchema(schema, documentAST, options) {
  (0, _schema.assertSchema)(schema);
  (documentAST != null && documentAST.kind === _kinds.Kind.DOCUMENT) ||
    (0, _devAssert.devAssert)(false, 'Must provide valid Document AST.');

  if (
    (options === null || options === void 0 ? void 0 : options.assumeValid) !==
      true &&
    (options === null || options === void 0
      ? void 0
      : options.assumeValidSDL) !== true
  ) {
    (0, _validate.assertValidSDLExtension)(documentAST, schema);
  }

  const schemaConfig = schema.toConfig();
  const extendedConfig = extendSchemaImpl(schemaConfig, documentAST, options);
  return schemaConfig === extendedConfig
    ? schema
    : new _schema.GraphQLSchema(extendedConfig);
}
/**
 * @internal
 */

function extendSchemaImpl(schemaConfig, documentAST, options) {
  var _schemaDef, _schemaDef$descriptio, _schemaDef2, _options$assumeValid;

  // Collect the type definitions and extensions found in the document.
  const typeDefs = [];
  const typeExtensionsMap = Object.create(null); // New directives and types are separate because a directives and types can
  // have the same name. For example, a type named "skip".

  const directiveDefs = [];
  let schemaDef; // Schema extensions are collected which may add additional operation types.

  const schemaExtensions = [];

  for (const def of documentAST.definitions) {
    if (def.kind === _kinds.Kind.SCHEMA_DEFINITION) {
      schemaDef = def;
    } else if (def.kind === _kinds.Kind.SCHEMA_EXTENSION) {
      schemaExtensions.push(def);
    } else if ((0, _predicates.isTypeDefinitionNode)(def)) {
      typeDefs.push(def);
    } else if ((0, _predicates.isTypeExtensionNode)(def)) {
      const extendedTypeName = def.name.value;
      const existingTypeExtensions = typeExtensionsMap[extendedTypeName];
      typeExtensionsMap[extendedTypeName] = existingTypeExtensions
        ? existingTypeExtensions.concat([def])
        : [def];
    } else if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
      directiveDefs.push(def);
    }
  } // If this document contains no new types, extensions, or directives then
  // return the same unmodified GraphQLSchema instance.

  if (
    Object.keys(typeExtensionsMap).length === 0 &&
    typeDefs.length === 0 &&
    directiveDefs.length === 0 &&
    schemaExtensions.length === 0 &&
    schemaDef == null
  ) {
    return schemaConfig;
  }

  const typeMap = Object.create(null);

  for (const existingType of schemaConfig.types) {
    typeMap[existingType.name] = extendNamedType(existingType);
  }

  for (const typeNode of typeDefs) {
    var _stdTypeMap$name;

    const name = typeNode.name.value;
    typeMap[name] =
      (_stdTypeMap$name = stdTypeMap[name]) !== null &&
      _stdTypeMap$name !== void 0
        ? _stdTypeMap$name
        : buildType(typeNode);
  }

  const operationTypes = {
    // Get the extended root operation types.
    query: schemaConfig.query && replaceNamedType(schemaConfig.query),
    mutation: schemaConfig.mutation && replaceNamedType(schemaConfig.mutation),
    subscription:
      schemaConfig.subscription && replaceNamedType(schemaConfig.subscription),
    // Then, incorporate schema definition and all schema extensions.
    ...(schemaDef && getOperationTypes([schemaDef])),
    ...getOperationTypes(schemaExtensions),
  }; // Then produce and return a Schema config with these types.

  return {
    description:
      (_schemaDef = schemaDef) === null || _schemaDef === void 0
        ? void 0
        : (_schemaDef$descriptio = _schemaDef.description) === null ||
          _schemaDef$descriptio === void 0
        ? void 0
        : _schemaDef$descriptio.value,
    ...operationTypes,
    types: Object.values(typeMap),
    directives: [
      ...schemaConfig.directives.map(replaceDirective),
      ...directiveDefs.map(buildDirective),
    ],
    extensions: Object.create(null),
    astNode:
      (_schemaDef2 = schemaDef) !== null && _schemaDef2 !== void 0
        ? _schemaDef2
        : schemaConfig.astNode,
    extensionASTNodes: schemaConfig.extensionASTNodes.concat(schemaExtensions),
    assumeValid:
      (_options$assumeValid =
        options === null || options === void 0
          ? void 0
          : options.assumeValid) !== null && _options$assumeValid !== void 0
        ? _options$assumeValid
        : false,
  }; // Below are functions used for producing this schema that have closed over
  // this scope and have access to the schema, cache, and newly defined types.

  function replaceType(type) {
    if ((0, _definition.isListType)(type)) {
      // @ts-expect-error
      return new _definition.GraphQLList(replaceType(type.ofType));
    }

    if ((0, _definition.isNonNullType)(type)) {
      // @ts-expect-error
      return new _definition.GraphQLNonNull(replaceType(type.ofType));
    } // @ts-expect-error FIXME

    return replaceNamedType(type);
  }

  function replaceNamedType(type) {
    // Note: While this could make early assertions to get the correctly
    // typed values, that would throw immediately while type system
    // validation with validateSchema() will produce more actionable results.
    return typeMap[type.name];
  }

  function replaceDirective(directive) {
    const config = directive.toConfig();
    return new _directives.GraphQLDirective({
      ...config,
      args: (0, _mapValue.mapValue)(config.args, extendArg),
    });
  }

  function extendNamedType(type) {
    if (
      (0, _introspection.isIntrospectionType)(type) ||
      (0, _scalars.isSpecifiedScalarType)(type)
    ) {
      // Builtin types are not extended.
      return type;
    }

    if ((0, _definition.isScalarType)(type)) {
      return extendScalarType(type);
    }

    if ((0, _definition.isObjectType)(type)) {
      return extendObjectType(type);
    }

    if ((0, _definition.isInterfaceType)(type)) {
      return extendInterfaceType(type);
    }

    if ((0, _definition.isUnionType)(type)) {
      return extendUnionType(type);
    }

    if ((0, _definition.isEnumType)(type)) {
      return extendEnumType(type);
    } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

    if ((0, _definition.isInputObjectType)(type)) {
      return extendInputObjectType(type);
    } // istanbul ignore next (Not reachable. All possible types have been considered)

    false ||
      (0, _invariant.invariant)(
        false,
        'Unexpected type: ' + (0, _inspect.inspect)(type),
      );
  }

  function extendInputObjectType(type) {
    var _typeExtensionsMap$co;

    const config = type.toConfig();
    const extensions =
      (_typeExtensionsMap$co = typeExtensionsMap[config.name]) !== null &&
      _typeExtensionsMap$co !== void 0
        ? _typeExtensionsMap$co
        : [];
    return new _definition.GraphQLInputObjectType({
      ...config,
      fields: () => ({
        ...(0, _mapValue.mapValue)(config.fields, (field) => ({
          ...field,
          type: replaceType(field.type),
        })),
        ...buildInputFieldMap(extensions),
      }),
      extensionASTNodes: config.extensionASTNodes.concat(extensions),
    });
  }

  function extendEnumType(type) {
    var _typeExtensionsMap$ty;

    const config = type.toConfig();
    const extensions =
      (_typeExtensionsMap$ty = typeExtensionsMap[type.name]) !== null &&
      _typeExtensionsMap$ty !== void 0
        ? _typeExtensionsMap$ty
        : [];
    return new _definition.GraphQLEnumType({
      ...config,
      values: { ...config.values, ...buildEnumValueMap(extensions) },
      extensionASTNodes: config.extensionASTNodes.concat(extensions),
    });
  }

  function extendScalarType(type) {
    var _typeExtensionsMap$co2;

    const config = type.toConfig();
    const extensions =
      (_typeExtensionsMap$co2 = typeExtensionsMap[config.name]) !== null &&
      _typeExtensionsMap$co2 !== void 0
        ? _typeExtensionsMap$co2
        : [];
    let specifiedByURL = config.specifiedByURL;

    for (const extensionNode of extensions) {
      var _getSpecifiedByURL;

      specifiedByURL =
        (_getSpecifiedByURL = getSpecifiedByURL(extensionNode)) !== null &&
        _getSpecifiedByURL !== void 0
          ? _getSpecifiedByURL
          : specifiedByURL;
    }

    return new _definition.GraphQLScalarType({
      ...config,
      specifiedByURL,
      extensionASTNodes: config.extensionASTNodes.concat(extensions),
    });
  }

  function extendObjectType(type) {
    var _typeExtensionsMap$co3;

    const config = type.toConfig();
    const extensions =
      (_typeExtensionsMap$co3 = typeExtensionsMap[config.name]) !== null &&
      _typeExtensionsMap$co3 !== void 0
        ? _typeExtensionsMap$co3
        : [];
    return new _definition.GraphQLObjectType({
      ...config,
      interfaces: () => [
        ...type.getInterfaces().map(replaceNamedType),
        ...buildInterfaces(extensions),
      ],
      fields: () => ({
        ...(0, _mapValue.mapValue)(config.fields, extendField),
        ...buildFieldMap(extensions),
      }),
      extensionASTNodes: config.extensionASTNodes.concat(extensions),
    });
  }

  function extendInterfaceType(type) {
    var _typeExtensionsMap$co4;

    const config = type.toConfig();
    const extensions =
      (_typeExtensionsMap$co4 = typeExtensionsMap[config.name]) !== null &&
      _typeExtensionsMap$co4 !== void 0
        ? _typeExtensionsMap$co4
        : [];
    return new _definition.GraphQLInterfaceType({
      ...config,
      interfaces: () => [
        ...type.getInterfaces().map(replaceNamedType),
        ...buildInterfaces(extensions),
      ],
      fields: () => ({
        ...(0, _mapValue.mapValue)(config.fields, extendField),
        ...buildFieldMap(extensions),
      }),
      extensionASTNodes: config.extensionASTNodes.concat(extensions),
    });
  }

  function extendUnionType(type) {
    var _typeExtensionsMap$co5;

    const config = type.toConfig();
    const extensions =
      (_typeExtensionsMap$co5 = typeExtensionsMap[config.name]) !== null &&
      _typeExtensionsMap$co5 !== void 0
        ? _typeExtensionsMap$co5
        : [];
    return new _definition.GraphQLUnionType({
      ...config,
      types: () => [
        ...type.getTypes().map(replaceNamedType),
        ...buildUnionTypes(extensions),
      ],
      extensionASTNodes: config.extensionASTNodes.concat(extensions),
    });
  }

  function extendField(field) {
    return {
      ...field,
      type: replaceType(field.type),
      args: field.args && (0, _mapValue.mapValue)(field.args, extendArg),
    };
  }

  function extendArg(arg) {
    return { ...arg, type: replaceType(arg.type) };
  }

  function getOperationTypes(nodes) {
    const opTypes = {};

    for (const node of nodes) {
      var _node$operationTypes;

      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      const operationTypesNodes =
        (_node$operationTypes = node.operationTypes) !== null &&
        _node$operationTypes !== void 0
          ? _node$operationTypes
          : [];

      for (const operationType of operationTypesNodes) {
        // Note: While this could make early assertions to get the correctly
        // typed values below, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        // @ts-expect-error
        opTypes[operationType.operation] = getNamedType(operationType.type);
      }
    }

    return opTypes;
  }

  function getNamedType(node) {
    var _stdTypeMap$name2;

    const name = node.name.value;
    const type =
      (_stdTypeMap$name2 = stdTypeMap[name]) !== null &&
      _stdTypeMap$name2 !== void 0
        ? _stdTypeMap$name2
        : typeMap[name];

    if (type === undefined) {
      throw new Error(`Unknown type: "${name}".`);
    }

    return type;
  }

  function getWrappedType(node) {
    if (node.kind === _kinds.Kind.LIST_TYPE) {
      return new _definition.GraphQLList(getWrappedType(node.type));
    }

    if (node.kind === _kinds.Kind.NON_NULL_TYPE) {
      return new _definition.GraphQLNonNull(getWrappedType(node.type));
    }

    return getNamedType(node);
  }

  function buildDirective(node) {
    var _node$description;

    return new _directives.GraphQLDirective({
      name: node.name.value,
      description:
        (_node$description = node.description) === null ||
        _node$description === void 0
          ? void 0
          : _node$description.value,
      // @ts-expect-error
      locations: node.locations.map(({ value }) => value),
      isRepeatable: node.repeatable,
      args: buildArgumentMap(node.arguments),
      astNode: node,
    });
  }

  function buildFieldMap(nodes) {
    const fieldConfigMap = Object.create(null);

    for (const node of nodes) {
      var _node$fields;

      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      const nodeFields =
        (_node$fields = node.fields) !== null && _node$fields !== void 0
          ? _node$fields
          : [];

      for (const field of nodeFields) {
        var _field$description;

        fieldConfigMap[field.name.value] = {
          // Note: While this could make assertions to get the correctly typed
          // value, that would throw immediately while type system validation
          // with validateSchema() will produce more actionable results.
          type: getWrappedType(field.type),
          description:
            (_field$description = field.description) === null ||
            _field$description === void 0
              ? void 0
              : _field$description.value,
          args: buildArgumentMap(field.arguments),
          deprecationReason: getDeprecationReason(field),
          astNode: field,
        };
      }
    }

    return fieldConfigMap;
  }

  function buildArgumentMap(args) {
    // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
    const argsNodes = args !== null && args !== void 0 ? args : [];
    const argConfigMap = Object.create(null);

    for (const arg of argsNodes) {
      var _arg$description;

      // Note: While this could make assertions to get the correctly typed
      // value, that would throw immediately while type system validation
      // with validateSchema() will produce more actionable results.
      const type = getWrappedType(arg.type);
      argConfigMap[arg.name.value] = {
        type,
        description:
          (_arg$description = arg.description) === null ||
          _arg$description === void 0
            ? void 0
            : _arg$description.value,
        defaultValue: (0, _valueFromAST.valueFromAST)(arg.defaultValue, type),
        deprecationReason: getDeprecationReason(arg),
        astNode: arg,
      };
    }

    return argConfigMap;
  }

  function buildInputFieldMap(nodes) {
    const inputFieldMap = Object.create(null);

    for (const node of nodes) {
      var _node$fields2;

      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      const fieldsNodes =
        (_node$fields2 = node.fields) !== null && _node$fields2 !== void 0
          ? _node$fields2
          : [];

      for (const field of fieldsNodes) {
        var _field$description2;

        // Note: While this could make assertions to get the correctly typed
        // value, that would throw immediately while type system validation
        // with validateSchema() will produce more actionable results.
        const type = getWrappedType(field.type);
        inputFieldMap[field.name.value] = {
          type,
          description:
            (_field$description2 = field.description) === null ||
            _field$description2 === void 0
              ? void 0
              : _field$description2.value,
          defaultValue: (0, _valueFromAST.valueFromAST)(
            field.defaultValue,
            type,
          ),
          deprecationReason: getDeprecationReason(field),
          astNode: field,
        };
      }
    }

    return inputFieldMap;
  }

  function buildEnumValueMap(nodes) {
    const enumValueMap = Object.create(null);

    for (const node of nodes) {
      var _node$values;

      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      const valuesNodes =
        (_node$values = node.values) !== null && _node$values !== void 0
          ? _node$values
          : [];

      for (const value of valuesNodes) {
        var _value$description;

        enumValueMap[value.name.value] = {
          description:
            (_value$description = value.description) === null ||
            _value$description === void 0
              ? void 0
              : _value$description.value,
          deprecationReason: getDeprecationReason(value),
          astNode: value,
        };
      }
    }

    return enumValueMap;
  }

  function buildInterfaces(nodes) {
    // Note: While this could make assertions to get the correctly typed
    // values below, that would throw immediately while type system
    // validation with validateSchema() will produce more actionable results.
    // @ts-expect-error
    return nodes.flatMap(
      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      (node) => {
        var _node$interfaces$map, _node$interfaces;

        return (_node$interfaces$map =
          (_node$interfaces = node.interfaces) === null ||
          _node$interfaces === void 0
            ? void 0
            : _node$interfaces.map(getNamedType)) !== null &&
          _node$interfaces$map !== void 0
          ? _node$interfaces$map
          : [];
      },
    );
  }

  function buildUnionTypes(nodes) {
    // Note: While this could make assertions to get the correctly typed
    // values below, that would throw immediately while type system
    // validation with validateSchema() will produce more actionable results.
    // @ts-expect-error
    return nodes.flatMap(
      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      (node) => {
        var _node$types$map, _node$types;

        return (_node$types$map =
          (_node$types = node.types) === null || _node$types === void 0
            ? void 0
            : _node$types.map(getNamedType)) !== null &&
          _node$types$map !== void 0
          ? _node$types$map
          : [];
      },
    );
  }

  function buildType(astNode) {
    var _typeExtensionsMap$na;

    const name = astNode.name.value;
    const extensionASTNodes =
      (_typeExtensionsMap$na = typeExtensionsMap[name]) !== null &&
      _typeExtensionsMap$na !== void 0
        ? _typeExtensionsMap$na
        : [];

    switch (astNode.kind) {
      case _kinds.Kind.OBJECT_TYPE_DEFINITION: {
        var _astNode$description;

        const allNodes = [astNode, ...extensionASTNodes];
        return new _definition.GraphQLObjectType({
          name,
          description:
            (_astNode$description = astNode.description) === null ||
            _astNode$description === void 0
              ? void 0
              : _astNode$description.value,
          interfaces: () => buildInterfaces(allNodes),
          fields: () => buildFieldMap(allNodes),
          astNode,
          extensionASTNodes,
        });
      }

      case _kinds.Kind.INTERFACE_TYPE_DEFINITION: {
        var _astNode$description2;

        const allNodes = [astNode, ...extensionASTNodes];
        return new _definition.GraphQLInterfaceType({
          name,
          description:
            (_astNode$description2 = astNode.description) === null ||
            _astNode$description2 === void 0
              ? void 0
              : _astNode$description2.value,
          interfaces: () => buildInterfaces(allNodes),
          fields: () => buildFieldMap(allNodes),
          astNode,
          extensionASTNodes,
        });
      }

      case _kinds.Kind.ENUM_TYPE_DEFINITION: {
        var _astNode$description3;

        const allNodes = [astNode, ...extensionASTNodes];
        return new _definition.GraphQLEnumType({
          name,
          description:
            (_astNode$description3 = astNode.description) === null ||
            _astNode$description3 === void 0
              ? void 0
              : _astNode$description3.value,
          values: buildEnumValueMap(allNodes),
          astNode,
          extensionASTNodes,
        });
      }

      case _kinds.Kind.UNION_TYPE_DEFINITION: {
        var _astNode$description4;

        const allNodes = [astNode, ...extensionASTNodes];
        return new _definition.GraphQLUnionType({
          name,
          description:
            (_astNode$description4 = astNode.description) === null ||
            _astNode$description4 === void 0
              ? void 0
              : _astNode$description4.value,
          types: () => buildUnionTypes(allNodes),
          astNode,
          extensionASTNodes,
        });
      }

      case _kinds.Kind.SCALAR_TYPE_DEFINITION: {
        var _astNode$description5;

        return new _definition.GraphQLScalarType({
          name,
          description:
            (_astNode$description5 = astNode.description) === null ||
            _astNode$description5 === void 0
              ? void 0
              : _astNode$description5.value,
          specifiedByURL: getSpecifiedByURL(astNode),
          astNode,
          extensionASTNodes,
        });
      }

      case _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION: {
        var _astNode$description6;

        const allNodes = [astNode, ...extensionASTNodes];
        return new _definition.GraphQLInputObjectType({
          name,
          description:
            (_astNode$description6 = astNode.description) === null ||
            _astNode$description6 === void 0
              ? void 0
              : _astNode$description6.value,
          fields: () => buildInputFieldMap(allNodes),
          astNode,
          extensionASTNodes,
        });
      }
    } // istanbul ignore next (Not reachable. All possible type definition nodes have been considered)

    false ||
      (0, _invariant.invariant)(
        false,
        'Unexpected type definition node: ' + (0, _inspect.inspect)(astNode),
      );
  }
}

const stdTypeMap = (0, _keyMap.keyMap)(
  [..._scalars.specifiedScalarTypes, ..._introspection.introspectionTypes],
  (type) => type.name,
);
/**
 * Given a field or enum value node, returns the string value for the
 * deprecation reason.
 */

function getDeprecationReason(node) {
  const deprecated = (0, _values.getDirectiveValues)(
    _directives.GraphQLDeprecatedDirective,
    node,
  ); // @ts-expect-error validated by `getDirectiveValues`

  return deprecated === null || deprecated === void 0
    ? void 0
    : deprecated.reason;
}
/**
 * Given a scalar node, returns the string value for the specifiedByURL.
 */

function getSpecifiedByURL(node) {
  const specifiedBy = (0, _values.getDirectiveValues)(
    _directives.GraphQLSpecifiedByDirective,
    node,
  ); // @ts-expect-error validated by `getDirectiveValues`

  return specifiedBy === null || specifiedBy === void 0
    ? void 0
    : specifiedBy.url;
}

},{"../execution/values.js":44,"../jsutils/devAssert.js":48,"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../jsutils/keyMap.js":59,"../jsutils/mapValue.js":61,"../language/kinds.js":74,"../language/predicates.js":78,"../type/definition.js":86,"../type/directives.js":87,"../type/introspection.js":89,"../type/scalars.js":90,"../type/schema.js":91,"../validation/validate.js":154,"./valueFromAST.js":113}],101:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.DangerousChangeType = exports.BreakingChangeType = void 0;
exports.findBreakingChanges = findBreakingChanges;
exports.findDangerousChanges = findDangerousChanges;

var _keyMap = require('../jsutils/keyMap.js');

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _naturalCompare = require('../jsutils/naturalCompare.js');

var _printer = require('../language/printer.js');

var _visitor = require('../language/visitor.js');

var _scalars = require('../type/scalars.js');

var _definition = require('../type/definition.js');

var _astFromValue = require('./astFromValue.js');

let BreakingChangeType;
exports.BreakingChangeType = BreakingChangeType;

(function (BreakingChangeType) {
  BreakingChangeType['TYPE_REMOVED'] = 'TYPE_REMOVED';
  BreakingChangeType['TYPE_CHANGED_KIND'] = 'TYPE_CHANGED_KIND';
  BreakingChangeType['TYPE_REMOVED_FROM_UNION'] = 'TYPE_REMOVED_FROM_UNION';
  BreakingChangeType['VALUE_REMOVED_FROM_ENUM'] = 'VALUE_REMOVED_FROM_ENUM';
  BreakingChangeType['REQUIRED_INPUT_FIELD_ADDED'] =
    'REQUIRED_INPUT_FIELD_ADDED';
  BreakingChangeType['IMPLEMENTED_INTERFACE_REMOVED'] =
    'IMPLEMENTED_INTERFACE_REMOVED';
  BreakingChangeType['FIELD_REMOVED'] = 'FIELD_REMOVED';
  BreakingChangeType['FIELD_CHANGED_KIND'] = 'FIELD_CHANGED_KIND';
  BreakingChangeType['REQUIRED_ARG_ADDED'] = 'REQUIRED_ARG_ADDED';
  BreakingChangeType['ARG_REMOVED'] = 'ARG_REMOVED';
  BreakingChangeType['ARG_CHANGED_KIND'] = 'ARG_CHANGED_KIND';
  BreakingChangeType['DIRECTIVE_REMOVED'] = 'DIRECTIVE_REMOVED';
  BreakingChangeType['DIRECTIVE_ARG_REMOVED'] = 'DIRECTIVE_ARG_REMOVED';
  BreakingChangeType['REQUIRED_DIRECTIVE_ARG_ADDED'] =
    'REQUIRED_DIRECTIVE_ARG_ADDED';
  BreakingChangeType['DIRECTIVE_REPEATABLE_REMOVED'] =
    'DIRECTIVE_REPEATABLE_REMOVED';
  BreakingChangeType['DIRECTIVE_LOCATION_REMOVED'] =
    'DIRECTIVE_LOCATION_REMOVED';
})(
  BreakingChangeType || (exports.BreakingChangeType = BreakingChangeType = {}),
);

let DangerousChangeType;
exports.DangerousChangeType = DangerousChangeType;

(function (DangerousChangeType) {
  DangerousChangeType['VALUE_ADDED_TO_ENUM'] = 'VALUE_ADDED_TO_ENUM';
  DangerousChangeType['TYPE_ADDED_TO_UNION'] = 'TYPE_ADDED_TO_UNION';
  DangerousChangeType['OPTIONAL_INPUT_FIELD_ADDED'] =
    'OPTIONAL_INPUT_FIELD_ADDED';
  DangerousChangeType['OPTIONAL_ARG_ADDED'] = 'OPTIONAL_ARG_ADDED';
  DangerousChangeType['IMPLEMENTED_INTERFACE_ADDED'] =
    'IMPLEMENTED_INTERFACE_ADDED';
  DangerousChangeType['ARG_DEFAULT_VALUE_CHANGE'] = 'ARG_DEFAULT_VALUE_CHANGE';
})(
  DangerousChangeType ||
    (exports.DangerousChangeType = DangerousChangeType = {}),
);

/**
 * Given two schemas, returns an Array containing descriptions of all the types
 * of breaking changes covered by the other functions down below.
 */
function findBreakingChanges(oldSchema, newSchema) {
  // @ts-expect-error
  return findSchemaChanges(oldSchema, newSchema).filter(
    (change) => change.type in BreakingChangeType,
  );
}
/**
 * Given two schemas, returns an Array containing descriptions of all the types
 * of potentially dangerous changes covered by the other functions down below.
 */

function findDangerousChanges(oldSchema, newSchema) {
  // @ts-expect-error
  return findSchemaChanges(oldSchema, newSchema).filter(
    (change) => change.type in DangerousChangeType,
  );
}

function findSchemaChanges(oldSchema, newSchema) {
  return [
    ...findTypeChanges(oldSchema, newSchema),
    ...findDirectiveChanges(oldSchema, newSchema),
  ];
}

function findDirectiveChanges(oldSchema, newSchema) {
  const schemaChanges = [];
  const directivesDiff = diff(
    oldSchema.getDirectives(),
    newSchema.getDirectives(),
  );

  for (const oldDirective of directivesDiff.removed) {
    schemaChanges.push({
      type: BreakingChangeType.DIRECTIVE_REMOVED,
      description: `${oldDirective.name} was removed.`,
    });
  }

  for (const [oldDirective, newDirective] of directivesDiff.persisted) {
    const argsDiff = diff(oldDirective.args, newDirective.args);

    for (const newArg of argsDiff.added) {
      if ((0, _definition.isRequiredArgument)(newArg)) {
        schemaChanges.push({
          type: BreakingChangeType.REQUIRED_DIRECTIVE_ARG_ADDED,
          description: `A required arg ${newArg.name} on directive ${oldDirective.name} was added.`,
        });
      }
    }

    for (const oldArg of argsDiff.removed) {
      schemaChanges.push({
        type: BreakingChangeType.DIRECTIVE_ARG_REMOVED,
        description: `${oldArg.name} was removed from ${oldDirective.name}.`,
      });
    }

    if (oldDirective.isRepeatable && !newDirective.isRepeatable) {
      schemaChanges.push({
        type: BreakingChangeType.DIRECTIVE_REPEATABLE_REMOVED,
        description: `Repeatable flag was removed from ${oldDirective.name}.`,
      });
    }

    for (const location of oldDirective.locations) {
      if (!newDirective.locations.includes(location)) {
        schemaChanges.push({
          type: BreakingChangeType.DIRECTIVE_LOCATION_REMOVED,
          description: `${location} was removed from ${oldDirective.name}.`,
        });
      }
    }
  }

  return schemaChanges;
}

function findTypeChanges(oldSchema, newSchema) {
  const schemaChanges = [];
  const typesDiff = diff(
    Object.values(oldSchema.getTypeMap()),
    Object.values(newSchema.getTypeMap()),
  );

  for (const oldType of typesDiff.removed) {
    schemaChanges.push({
      type: BreakingChangeType.TYPE_REMOVED,
      description: (0, _scalars.isSpecifiedScalarType)(oldType)
        ? `Standard scalar ${oldType.name} was removed because it is not referenced anymore.`
        : `${oldType.name} was removed.`,
    });
  }

  for (const [oldType, newType] of typesDiff.persisted) {
    if (
      (0, _definition.isEnumType)(oldType) &&
      (0, _definition.isEnumType)(newType)
    ) {
      schemaChanges.push(...findEnumTypeChanges(oldType, newType));
    } else if (
      (0, _definition.isUnionType)(oldType) &&
      (0, _definition.isUnionType)(newType)
    ) {
      schemaChanges.push(...findUnionTypeChanges(oldType, newType));
    } else if (
      (0, _definition.isInputObjectType)(oldType) &&
      (0, _definition.isInputObjectType)(newType)
    ) {
      schemaChanges.push(...findInputObjectTypeChanges(oldType, newType));
    } else if (
      (0, _definition.isObjectType)(oldType) &&
      (0, _definition.isObjectType)(newType)
    ) {
      schemaChanges.push(
        ...findFieldChanges(oldType, newType),
        ...findImplementedInterfacesChanges(oldType, newType),
      );
    } else if (
      (0, _definition.isInterfaceType)(oldType) &&
      (0, _definition.isInterfaceType)(newType)
    ) {
      schemaChanges.push(
        ...findFieldChanges(oldType, newType),
        ...findImplementedInterfacesChanges(oldType, newType),
      );
    } else if (oldType.constructor !== newType.constructor) {
      schemaChanges.push({
        type: BreakingChangeType.TYPE_CHANGED_KIND,
        description:
          `${oldType.name} changed from ` +
          `${typeKindName(oldType)} to ${typeKindName(newType)}.`,
      });
    }
  }

  return schemaChanges;
}

function findInputObjectTypeChanges(oldType, newType) {
  const schemaChanges = [];
  const fieldsDiff = diff(
    Object.values(oldType.getFields()),
    Object.values(newType.getFields()),
  );

  for (const newField of fieldsDiff.added) {
    if ((0, _definition.isRequiredInputField)(newField)) {
      schemaChanges.push({
        type: BreakingChangeType.REQUIRED_INPUT_FIELD_ADDED,
        description: `A required field ${newField.name} on input type ${oldType.name} was added.`,
      });
    } else {
      schemaChanges.push({
        type: DangerousChangeType.OPTIONAL_INPUT_FIELD_ADDED,
        description: `An optional field ${newField.name} on input type ${oldType.name} was added.`,
      });
    }
  }

  for (const oldField of fieldsDiff.removed) {
    schemaChanges.push({
      type: BreakingChangeType.FIELD_REMOVED,
      description: `${oldType.name}.${oldField.name} was removed.`,
    });
  }

  for (const [oldField, newField] of fieldsDiff.persisted) {
    const isSafe = isChangeSafeForInputObjectFieldOrFieldArg(
      oldField.type,
      newField.type,
    );

    if (!isSafe) {
      schemaChanges.push({
        type: BreakingChangeType.FIELD_CHANGED_KIND,
        description:
          `${oldType.name}.${oldField.name} changed type from ` +
          `${String(oldField.type)} to ${String(newField.type)}.`,
      });
    }
  }

  return schemaChanges;
}

function findUnionTypeChanges(oldType, newType) {
  const schemaChanges = [];
  const possibleTypesDiff = diff(oldType.getTypes(), newType.getTypes());

  for (const newPossibleType of possibleTypesDiff.added) {
    schemaChanges.push({
      type: DangerousChangeType.TYPE_ADDED_TO_UNION,
      description: `${newPossibleType.name} was added to union type ${oldType.name}.`,
    });
  }

  for (const oldPossibleType of possibleTypesDiff.removed) {
    schemaChanges.push({
      type: BreakingChangeType.TYPE_REMOVED_FROM_UNION,
      description: `${oldPossibleType.name} was removed from union type ${oldType.name}.`,
    });
  }

  return schemaChanges;
}

function findEnumTypeChanges(oldType, newType) {
  const schemaChanges = [];
  const valuesDiff = diff(oldType.getValues(), newType.getValues());

  for (const newValue of valuesDiff.added) {
    schemaChanges.push({
      type: DangerousChangeType.VALUE_ADDED_TO_ENUM,
      description: `${newValue.name} was added to enum type ${oldType.name}.`,
    });
  }

  for (const oldValue of valuesDiff.removed) {
    schemaChanges.push({
      type: BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
      description: `${oldValue.name} was removed from enum type ${oldType.name}.`,
    });
  }

  return schemaChanges;
}

function findImplementedInterfacesChanges(oldType, newType) {
  const schemaChanges = [];
  const interfacesDiff = diff(oldType.getInterfaces(), newType.getInterfaces());

  for (const newInterface of interfacesDiff.added) {
    schemaChanges.push({
      type: DangerousChangeType.IMPLEMENTED_INTERFACE_ADDED,
      description: `${newInterface.name} added to interfaces implemented by ${oldType.name}.`,
    });
  }

  for (const oldInterface of interfacesDiff.removed) {
    schemaChanges.push({
      type: BreakingChangeType.IMPLEMENTED_INTERFACE_REMOVED,
      description: `${oldType.name} no longer implements interface ${oldInterface.name}.`,
    });
  }

  return schemaChanges;
}

function findFieldChanges(oldType, newType) {
  const schemaChanges = [];
  const fieldsDiff = diff(
    Object.values(oldType.getFields()),
    Object.values(newType.getFields()),
  );

  for (const oldField of fieldsDiff.removed) {
    schemaChanges.push({
      type: BreakingChangeType.FIELD_REMOVED,
      description: `${oldType.name}.${oldField.name} was removed.`,
    });
  }

  for (const [oldField, newField] of fieldsDiff.persisted) {
    schemaChanges.push(...findArgChanges(oldType, oldField, newField));
    const isSafe = isChangeSafeForObjectOrInterfaceField(
      oldField.type,
      newField.type,
    );

    if (!isSafe) {
      schemaChanges.push({
        type: BreakingChangeType.FIELD_CHANGED_KIND,
        description:
          `${oldType.name}.${oldField.name} changed type from ` +
          `${String(oldField.type)} to ${String(newField.type)}.`,
      });
    }
  }

  return schemaChanges;
}

function findArgChanges(oldType, oldField, newField) {
  const schemaChanges = [];
  const argsDiff = diff(oldField.args, newField.args);

  for (const oldArg of argsDiff.removed) {
    schemaChanges.push({
      type: BreakingChangeType.ARG_REMOVED,
      description: `${oldType.name}.${oldField.name} arg ${oldArg.name} was removed.`,
    });
  }

  for (const [oldArg, newArg] of argsDiff.persisted) {
    const isSafe = isChangeSafeForInputObjectFieldOrFieldArg(
      oldArg.type,
      newArg.type,
    );

    if (!isSafe) {
      schemaChanges.push({
        type: BreakingChangeType.ARG_CHANGED_KIND,
        description:
          `${oldType.name}.${oldField.name} arg ${oldArg.name} has changed type from ` +
          `${String(oldArg.type)} to ${String(newArg.type)}.`,
      });
    } else if (oldArg.defaultValue !== undefined) {
      if (newArg.defaultValue === undefined) {
        schemaChanges.push({
          type: DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
          description: `${oldType.name}.${oldField.name} arg ${oldArg.name} defaultValue was removed.`,
        });
      } else {
        // Since we looking only for client's observable changes we should
        // compare default values in the same representation as they are
        // represented inside introspection.
        const oldValueStr = stringifyValue(oldArg.defaultValue, oldArg.type);
        const newValueStr = stringifyValue(newArg.defaultValue, newArg.type);

        if (oldValueStr !== newValueStr) {
          schemaChanges.push({
            type: DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
            description: `${oldType.name}.${oldField.name} arg ${oldArg.name} has changed defaultValue from ${oldValueStr} to ${newValueStr}.`,
          });
        }
      }
    }
  }

  for (const newArg of argsDiff.added) {
    if ((0, _definition.isRequiredArgument)(newArg)) {
      schemaChanges.push({
        type: BreakingChangeType.REQUIRED_ARG_ADDED,
        description: `A required arg ${newArg.name} on ${oldType.name}.${oldField.name} was added.`,
      });
    } else {
      schemaChanges.push({
        type: DangerousChangeType.OPTIONAL_ARG_ADDED,
        description: `An optional arg ${newArg.name} on ${oldType.name}.${oldField.name} was added.`,
      });
    }
  }

  return schemaChanges;
}

function isChangeSafeForObjectOrInterfaceField(oldType, newType) {
  if ((0, _definition.isListType)(oldType)) {
    return (
      // if they're both lists, make sure the underlying types are compatible
      ((0, _definition.isListType)(newType) &&
        isChangeSafeForObjectOrInterfaceField(
          oldType.ofType,
          newType.ofType,
        )) || // moving from nullable to non-null of the same underlying type is safe
      ((0, _definition.isNonNullType)(newType) &&
        isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType))
    );
  }

  if ((0, _definition.isNonNullType)(oldType)) {
    // if they're both non-null, make sure the underlying types are compatible
    return (
      (0, _definition.isNonNullType)(newType) &&
      isChangeSafeForObjectOrInterfaceField(oldType.ofType, newType.ofType)
    );
  }

  return (
    // if they're both named types, see if their names are equivalent
    ((0, _definition.isNamedType)(newType) && oldType.name === newType.name) || // moving from nullable to non-null of the same underlying type is safe
    ((0, _definition.isNonNullType)(newType) &&
      isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType))
  );
}

function isChangeSafeForInputObjectFieldOrFieldArg(oldType, newType) {
  if ((0, _definition.isListType)(oldType)) {
    // if they're both lists, make sure the underlying types are compatible
    return (
      (0, _definition.isListType)(newType) &&
      isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType.ofType)
    );
  }

  if ((0, _definition.isNonNullType)(oldType)) {
    return (
      // if they're both non-null, make sure the underlying types are
      // compatible
      ((0, _definition.isNonNullType)(newType) &&
        isChangeSafeForInputObjectFieldOrFieldArg(
          oldType.ofType,
          newType.ofType,
        )) || // moving from non-null to nullable of the same underlying type is safe
      (!(0, _definition.isNonNullType)(newType) &&
        isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType))
    );
  } // if they're both named types, see if their names are equivalent

  return (0, _definition.isNamedType)(newType) && oldType.name === newType.name;
}

function typeKindName(type) {
  if ((0, _definition.isScalarType)(type)) {
    return 'a Scalar type';
  }

  if ((0, _definition.isObjectType)(type)) {
    return 'an Object type';
  }

  if ((0, _definition.isInterfaceType)(type)) {
    return 'an Interface type';
  }

  if ((0, _definition.isUnionType)(type)) {
    return 'a Union type';
  }

  if ((0, _definition.isEnumType)(type)) {
    return 'an Enum type';
  } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

  if ((0, _definition.isInputObjectType)(type)) {
    return 'an Input type';
  } // istanbul ignore next (Not reachable. All possible named types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected type: ' + (0, _inspect.inspect)(type),
    );
}

function stringifyValue(value, type) {
  const ast = (0, _astFromValue.astFromValue)(value, type);
  ast != null || (0, _invariant.invariant)(false);
  const sortedAST = (0, _visitor.visit)(ast, {
    ObjectValue(objectNode) {
      // Make a copy since sort mutates array
      const fields = [...objectNode.fields];
      fields.sort((fieldA, fieldB) =>
        (0, _naturalCompare.naturalCompare)(
          fieldA.name.value,
          fieldB.name.value,
        ),
      );
      return { ...objectNode, fields };
    },
  });
  return (0, _printer.print)(sortedAST);
}

function diff(oldArray, newArray) {
  const added = [];
  const removed = [];
  const persisted = [];
  const oldMap = (0, _keyMap.keyMap)(oldArray, ({ name }) => name);
  const newMap = (0, _keyMap.keyMap)(newArray, ({ name }) => name);

  for (const oldItem of oldArray) {
    const newItem = newMap[oldItem.name];

    if (newItem === undefined) {
      removed.push(oldItem);
    } else {
      persisted.push([oldItem, newItem]);
    }
  }

  for (const newItem of newArray) {
    if (oldMap[newItem.name] === undefined) {
      added.push(newItem);
    }
  }

  return {
    added,
    persisted,
    removed,
  };
}

},{"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../jsutils/keyMap.js":59,"../jsutils/naturalCompare.js":63,"../language/printer.js":81,"../language/visitor.js":84,"../type/definition.js":86,"../type/scalars.js":90,"./astFromValue.js":95}],102:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getIntrospectionQuery = getIntrospectionQuery;

function getIntrospectionQuery(options) {
  const optionsWithDefault = {
    descriptions: true,
    specifiedByUrl: false,
    directiveIsRepeatable: false,
    schemaDescription: false,
    inputValueDeprecation: false,
    ...options,
  };
  const descriptions = optionsWithDefault.descriptions ? 'description' : '';
  const specifiedByUrl = optionsWithDefault.specifiedByUrl
    ? 'specifiedByURL'
    : '';
  const directiveIsRepeatable = optionsWithDefault.directiveIsRepeatable
    ? 'isRepeatable'
    : '';
  const schemaDescription = optionsWithDefault.schemaDescription
    ? descriptions
    : '';

  function inputDeprecation(str) {
    return optionsWithDefault.inputValueDeprecation ? str : '';
  }

  return `
    query IntrospectionQuery {
      __schema {
        ${schemaDescription}
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
        directives {
          name
          ${descriptions}
          ${directiveIsRepeatable}
          locations
          args${inputDeprecation('(includeDeprecated: true)')} {
            ...InputValue
          }
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      ${descriptions}
      ${specifiedByUrl}
      fields(includeDeprecated: true) {
        name
        ${descriptions}
        args${inputDeprecation('(includeDeprecated: true)')} {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields${inputDeprecation('(includeDeprecated: true)')} {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        ${descriptions}
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      ${descriptions}
      type { ...TypeRef }
      defaultValue
      ${inputDeprecation('isDeprecated')}
      ${inputDeprecation('deprecationReason')}
    }

    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}

},{}],103:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getOperationAST = getOperationAST;

var _kinds = require('../language/kinds.js');

/**
 * Returns an operation AST given a document AST and optionally an operation
 * name. If a name is not provided, an operation is only returned if only one is
 * provided in the document.
 */
function getOperationAST(documentAST, operationName) {
  let operation = null;

  for (const definition of documentAST.definitions) {
    if (definition.kind === _kinds.Kind.OPERATION_DEFINITION) {
      var _definition$name;

      if (operationName == null) {
        // If no operation name was provided, only return an Operation if there
        // is one defined in the document. Upon encountering the second, return
        // null.
        if (operation) {
          return null;
        }

        operation = definition;
      } else if (
        ((_definition$name = definition.name) === null ||
        _definition$name === void 0
          ? void 0
          : _definition$name.value) === operationName
      ) {
        return definition;
      }
    }
  }

  return operation;
}

},{"../language/kinds.js":74}],104:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getOperationRootType = getOperationRootType;

var _GraphQLError = require('../error/GraphQLError.js');

/**
 * Extracts the root type of the operation from the schema.
 *
 * @deprecated Please use `GraphQLSchema.getRootType` instead. Will be removed in v17
 */
function getOperationRootType(schema, operation) {
  if (operation.operation === 'query') {
    const queryType = schema.getQueryType();

    if (!queryType) {
      throw new _GraphQLError.GraphQLError(
        'Schema does not define the required query root type.',
        operation,
      );
    }

    return queryType;
  }

  if (operation.operation === 'mutation') {
    const mutationType = schema.getMutationType();

    if (!mutationType) {
      throw new _GraphQLError.GraphQLError(
        'Schema is not configured for mutations.',
        operation,
      );
    }

    return mutationType;
  }

  if (operation.operation === 'subscription') {
    const subscriptionType = schema.getSubscriptionType();

    if (!subscriptionType) {
      throw new _GraphQLError.GraphQLError(
        'Schema is not configured for subscriptions.',
        operation,
      );
    }

    return subscriptionType;
  }

  throw new _GraphQLError.GraphQLError(
    'Can only have query, mutation and subscription operations.',
    operation,
  );
}

},{"../error/GraphQLError.js":35}],105:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'BreakingChangeType', {
  enumerable: true,
  get: function () {
    return _findBreakingChanges.BreakingChangeType;
  },
});
Object.defineProperty(exports, 'DangerousChangeType', {
  enumerable: true,
  get: function () {
    return _findBreakingChanges.DangerousChangeType;
  },
});
Object.defineProperty(exports, 'TypeInfo', {
  enumerable: true,
  get: function () {
    return _TypeInfo.TypeInfo;
  },
});
Object.defineProperty(exports, 'assertValidName', {
  enumerable: true,
  get: function () {
    return _assertValidName.assertValidName;
  },
});
Object.defineProperty(exports, 'astFromValue', {
  enumerable: true,
  get: function () {
    return _astFromValue.astFromValue;
  },
});
Object.defineProperty(exports, 'buildASTSchema', {
  enumerable: true,
  get: function () {
    return _buildASTSchema.buildASTSchema;
  },
});
Object.defineProperty(exports, 'buildClientSchema', {
  enumerable: true,
  get: function () {
    return _buildClientSchema.buildClientSchema;
  },
});
Object.defineProperty(exports, 'buildSchema', {
  enumerable: true,
  get: function () {
    return _buildASTSchema.buildSchema;
  },
});
Object.defineProperty(exports, 'coerceInputValue', {
  enumerable: true,
  get: function () {
    return _coerceInputValue.coerceInputValue;
  },
});
Object.defineProperty(exports, 'concatAST', {
  enumerable: true,
  get: function () {
    return _concatAST.concatAST;
  },
});
Object.defineProperty(exports, 'doTypesOverlap', {
  enumerable: true,
  get: function () {
    return _typeComparators.doTypesOverlap;
  },
});
Object.defineProperty(exports, 'extendSchema', {
  enumerable: true,
  get: function () {
    return _extendSchema.extendSchema;
  },
});
Object.defineProperty(exports, 'findBreakingChanges', {
  enumerable: true,
  get: function () {
    return _findBreakingChanges.findBreakingChanges;
  },
});
Object.defineProperty(exports, 'findDangerousChanges', {
  enumerable: true,
  get: function () {
    return _findBreakingChanges.findDangerousChanges;
  },
});
Object.defineProperty(exports, 'getIntrospectionQuery', {
  enumerable: true,
  get: function () {
    return _getIntrospectionQuery.getIntrospectionQuery;
  },
});
Object.defineProperty(exports, 'getOperationAST', {
  enumerable: true,
  get: function () {
    return _getOperationAST.getOperationAST;
  },
});
Object.defineProperty(exports, 'getOperationRootType', {
  enumerable: true,
  get: function () {
    return _getOperationRootType.getOperationRootType;
  },
});
Object.defineProperty(exports, 'introspectionFromSchema', {
  enumerable: true,
  get: function () {
    return _introspectionFromSchema.introspectionFromSchema;
  },
});
Object.defineProperty(exports, 'isEqualType', {
  enumerable: true,
  get: function () {
    return _typeComparators.isEqualType;
  },
});
Object.defineProperty(exports, 'isTypeSubTypeOf', {
  enumerable: true,
  get: function () {
    return _typeComparators.isTypeSubTypeOf;
  },
});
Object.defineProperty(exports, 'isValidNameError', {
  enumerable: true,
  get: function () {
    return _assertValidName.isValidNameError;
  },
});
Object.defineProperty(exports, 'lexicographicSortSchema', {
  enumerable: true,
  get: function () {
    return _lexicographicSortSchema.lexicographicSortSchema;
  },
});
Object.defineProperty(exports, 'printIntrospectionSchema', {
  enumerable: true,
  get: function () {
    return _printSchema.printIntrospectionSchema;
  },
});
Object.defineProperty(exports, 'printSchema', {
  enumerable: true,
  get: function () {
    return _printSchema.printSchema;
  },
});
Object.defineProperty(exports, 'printType', {
  enumerable: true,
  get: function () {
    return _printSchema.printType;
  },
});
Object.defineProperty(exports, 'separateOperations', {
  enumerable: true,
  get: function () {
    return _separateOperations.separateOperations;
  },
});
Object.defineProperty(exports, 'stripIgnoredCharacters', {
  enumerable: true,
  get: function () {
    return _stripIgnoredCharacters.stripIgnoredCharacters;
  },
});
Object.defineProperty(exports, 'typeFromAST', {
  enumerable: true,
  get: function () {
    return _typeFromAST.typeFromAST;
  },
});
Object.defineProperty(exports, 'valueFromAST', {
  enumerable: true,
  get: function () {
    return _valueFromAST.valueFromAST;
  },
});
Object.defineProperty(exports, 'valueFromASTUntyped', {
  enumerable: true,
  get: function () {
    return _valueFromASTUntyped.valueFromASTUntyped;
  },
});
Object.defineProperty(exports, 'visitWithTypeInfo', {
  enumerable: true,
  get: function () {
    return _TypeInfo.visitWithTypeInfo;
  },
});

var _getIntrospectionQuery = require('./getIntrospectionQuery.js');

var _getOperationAST = require('./getOperationAST.js');

var _getOperationRootType = require('./getOperationRootType.js');

var _introspectionFromSchema = require('./introspectionFromSchema.js');

var _buildClientSchema = require('./buildClientSchema.js');

var _buildASTSchema = require('./buildASTSchema.js');

var _extendSchema = require('./extendSchema.js');

var _lexicographicSortSchema = require('./lexicographicSortSchema.js');

var _printSchema = require('./printSchema.js');

var _typeFromAST = require('./typeFromAST.js');

var _valueFromAST = require('./valueFromAST.js');

var _valueFromASTUntyped = require('./valueFromASTUntyped.js');

var _astFromValue = require('./astFromValue.js');

var _TypeInfo = require('./TypeInfo.js');

var _coerceInputValue = require('./coerceInputValue.js');

var _concatAST = require('./concatAST.js');

var _separateOperations = require('./separateOperations.js');

var _stripIgnoredCharacters = require('./stripIgnoredCharacters.js');

var _typeComparators = require('./typeComparators.js');

var _assertValidName = require('./assertValidName.js');

var _findBreakingChanges = require('./findBreakingChanges.js');

},{"./TypeInfo.js":93,"./assertValidName.js":94,"./astFromValue.js":95,"./buildASTSchema.js":96,"./buildClientSchema.js":97,"./coerceInputValue.js":98,"./concatAST.js":99,"./extendSchema.js":100,"./findBreakingChanges.js":101,"./getIntrospectionQuery.js":102,"./getOperationAST.js":103,"./getOperationRootType.js":104,"./introspectionFromSchema.js":106,"./lexicographicSortSchema.js":107,"./printSchema.js":108,"./separateOperations.js":109,"./stripIgnoredCharacters.js":110,"./typeComparators.js":111,"./typeFromAST.js":112,"./valueFromAST.js":113,"./valueFromASTUntyped.js":114}],106:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.introspectionFromSchema = introspectionFromSchema;

var _invariant = require('../jsutils/invariant.js');

var _parser = require('../language/parser.js');

var _execute = require('../execution/execute.js');

var _getIntrospectionQuery = require('./getIntrospectionQuery.js');

/**
 * Build an IntrospectionQuery from a GraphQLSchema
 *
 * IntrospectionQuery is useful for utilities that care about type and field
 * relationships, but do not need to traverse through those relationships.
 *
 * This is the inverse of buildClientSchema. The primary use case is outside
 * of the server context, for instance when doing schema comparisons.
 */
function introspectionFromSchema(schema, options) {
  const optionsWithDefaults = {
    specifiedByUrl: true,
    directiveIsRepeatable: true,
    schemaDescription: true,
    inputValueDeprecation: true,
    ...options,
  };
  const document = (0, _parser.parse)(
    (0, _getIntrospectionQuery.getIntrospectionQuery)(optionsWithDefaults),
  );
  const result = (0, _execute.executeSync)({
    schema,
    document,
  });
  (!result.errors && result.data) || (0, _invariant.invariant)(false);
  return result.data;
}

},{"../execution/execute.js":40,"../jsutils/invariant.js":54,"../language/parser.js":77,"./getIntrospectionQuery.js":102}],107:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.lexicographicSortSchema = lexicographicSortSchema;

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _keyValMap = require('../jsutils/keyValMap.js');

var _naturalCompare = require('../jsutils/naturalCompare.js');

var _schema = require('../type/schema.js');

var _directives = require('../type/directives.js');

var _introspection = require('../type/introspection.js');

var _definition = require('../type/definition.js');

/**
 * Sort GraphQLSchema.
 *
 * This function returns a sorted copy of the given GraphQLSchema.
 */
function lexicographicSortSchema(schema) {
  const schemaConfig = schema.toConfig();
  const typeMap = (0, _keyValMap.keyValMap)(
    sortByName(schemaConfig.types),
    (type) => type.name,
    sortNamedType,
  );
  return new _schema.GraphQLSchema({
    ...schemaConfig,
    types: Object.values(typeMap),
    directives: sortByName(schemaConfig.directives).map(sortDirective),
    query: replaceMaybeType(schemaConfig.query),
    mutation: replaceMaybeType(schemaConfig.mutation),
    subscription: replaceMaybeType(schemaConfig.subscription),
  });

  function replaceType(type) {
    if ((0, _definition.isListType)(type)) {
      // @ts-expect-error
      return new _definition.GraphQLList(replaceType(type.ofType));
    } else if ((0, _definition.isNonNullType)(type)) {
      // @ts-expect-error
      return new _definition.GraphQLNonNull(replaceType(type.ofType));
    } // @ts-expect-error FIXME: TS Conversion

    return replaceNamedType(type);
  }

  function replaceNamedType(type) {
    return typeMap[type.name];
  }

  function replaceMaybeType(maybeType) {
    return maybeType && replaceNamedType(maybeType);
  }

  function sortDirective(directive) {
    const config = directive.toConfig();
    return new _directives.GraphQLDirective({
      ...config,
      locations: sortBy(config.locations, (x) => x),
      args: sortArgs(config.args),
    });
  }

  function sortArgs(args) {
    return sortObjMap(args, (arg) => ({ ...arg, type: replaceType(arg.type) }));
  }

  function sortFields(fieldsMap) {
    return sortObjMap(fieldsMap, (field) => ({
      ...field,
      type: replaceType(field.type),
      args: field.args && sortArgs(field.args),
    }));
  }

  function sortInputFields(fieldsMap) {
    return sortObjMap(fieldsMap, (field) => ({
      ...field,
      type: replaceType(field.type),
    }));
  }

  function sortTypes(array) {
    return sortByName(array).map(replaceNamedType);
  }

  function sortNamedType(type) {
    if (
      (0, _definition.isScalarType)(type) ||
      (0, _introspection.isIntrospectionType)(type)
    ) {
      return type;
    }

    if ((0, _definition.isObjectType)(type)) {
      const config = type.toConfig();
      return new _definition.GraphQLObjectType({
        ...config,
        interfaces: () => sortTypes(config.interfaces),
        fields: () => sortFields(config.fields),
      });
    }

    if ((0, _definition.isInterfaceType)(type)) {
      const config = type.toConfig();
      return new _definition.GraphQLInterfaceType({
        ...config,
        interfaces: () => sortTypes(config.interfaces),
        fields: () => sortFields(config.fields),
      });
    }

    if ((0, _definition.isUnionType)(type)) {
      const config = type.toConfig();
      return new _definition.GraphQLUnionType({
        ...config,
        types: () => sortTypes(config.types),
      });
    }

    if ((0, _definition.isEnumType)(type)) {
      const config = type.toConfig();
      return new _definition.GraphQLEnumType({
        ...config,
        values: sortObjMap(config.values, (value) => value),
      });
    } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

    if ((0, _definition.isInputObjectType)(type)) {
      const config = type.toConfig();
      return new _definition.GraphQLInputObjectType({
        ...config,
        fields: () => sortInputFields(config.fields),
      });
    } // istanbul ignore next (Not reachable. All possible types have been considered)

    false ||
      (0, _invariant.invariant)(
        false,
        'Unexpected type: ' + (0, _inspect.inspect)(type),
      );
  }
}

function sortObjMap(map, sortValueFn) {
  const sortedMap = Object.create(null);
  const sortedEntries = sortBy(Object.entries(map), ([key]) => key);

  for (const [key, value] of sortedEntries) {
    sortedMap[key] = sortValueFn(value);
  }

  return sortedMap;
}

function sortByName(array) {
  return sortBy(array, (obj) => obj.name);
}

function sortBy(array, mapToKey) {
  return array.slice().sort((obj1, obj2) => {
    const key1 = mapToKey(obj1);
    const key2 = mapToKey(obj2);
    return (0, _naturalCompare.naturalCompare)(key1, key2);
  });
}

},{"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../jsutils/keyValMap.js":60,"../jsutils/naturalCompare.js":63,"../type/definition.js":86,"../type/directives.js":87,"../type/introspection.js":89,"../type/schema.js":91}],108:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.printIntrospectionSchema = printIntrospectionSchema;
exports.printSchema = printSchema;
exports.printType = printType;

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _kinds = require('../language/kinds.js');

var _printer = require('../language/printer.js');

var _blockString = require('../language/blockString.js');

var _introspection = require('../type/introspection.js');

var _scalars = require('../type/scalars.js');

var _directives = require('../type/directives.js');

var _definition = require('../type/definition.js');

var _astFromValue = require('./astFromValue.js');

function printSchema(schema) {
  return printFilteredSchema(
    schema,
    (n) => !(0, _directives.isSpecifiedDirective)(n),
    isDefinedType,
  );
}

function printIntrospectionSchema(schema) {
  return printFilteredSchema(
    schema,
    _directives.isSpecifiedDirective,
    _introspection.isIntrospectionType,
  );
}

function isDefinedType(type) {
  return (
    !(0, _scalars.isSpecifiedScalarType)(type) &&
    !(0, _introspection.isIntrospectionType)(type)
  );
}

function printFilteredSchema(schema, directiveFilter, typeFilter) {
  const directives = schema.getDirectives().filter(directiveFilter);
  const types = Object.values(schema.getTypeMap()).filter(typeFilter);
  return [
    printSchemaDefinition(schema),
    ...directives.map((directive) => printDirective(directive)),
    ...types.map((type) => printType(type)),
  ]
    .filter(Boolean)
    .join('\n\n');
}

function printSchemaDefinition(schema) {
  if (schema.description == null && isSchemaOfCommonNames(schema)) {
    return;
  }

  const operationTypes = [];
  const queryType = schema.getQueryType();

  if (queryType) {
    operationTypes.push(`  query: ${queryType.name}`);
  }

  const mutationType = schema.getMutationType();

  if (mutationType) {
    operationTypes.push(`  mutation: ${mutationType.name}`);
  }

  const subscriptionType = schema.getSubscriptionType();

  if (subscriptionType) {
    operationTypes.push(`  subscription: ${subscriptionType.name}`);
  }

  return printDescription(schema) + `schema {\n${operationTypes.join('\n')}\n}`;
}
/**
 * GraphQL schema define root types for each type of operation. These types are
 * the same as any other type and can be named in any manner, however there is
 * a common naming convention:
 *
 * ```graphql
 *   schema {
 *     query: Query
 *     mutation: Mutation
 *     subscription: Subscription
 *   }
 * ```
 *
 * When using this naming convention, the schema description can be omitted.
 */

function isSchemaOfCommonNames(schema) {
  const queryType = schema.getQueryType();

  if (queryType && queryType.name !== 'Query') {
    return false;
  }

  const mutationType = schema.getMutationType();

  if (mutationType && mutationType.name !== 'Mutation') {
    return false;
  }

  const subscriptionType = schema.getSubscriptionType();

  if (subscriptionType && subscriptionType.name !== 'Subscription') {
    return false;
  }

  return true;
}

function printType(type) {
  if ((0, _definition.isScalarType)(type)) {
    return printScalar(type);
  }

  if ((0, _definition.isObjectType)(type)) {
    return printObject(type);
  }

  if ((0, _definition.isInterfaceType)(type)) {
    return printInterface(type);
  }

  if ((0, _definition.isUnionType)(type)) {
    return printUnion(type);
  }

  if ((0, _definition.isEnumType)(type)) {
    return printEnum(type);
  } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

  if ((0, _definition.isInputObjectType)(type)) {
    return printInputObject(type);
  } // istanbul ignore next (Not reachable. All possible types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected type: ' + (0, _inspect.inspect)(type),
    );
}

function printScalar(type) {
  return (
    printDescription(type) + `scalar ${type.name}` + printSpecifiedByURL(type)
  );
}

function printImplementedInterfaces(type) {
  const interfaces = type.getInterfaces();
  return interfaces.length
    ? ' implements ' + interfaces.map((i) => i.name).join(' & ')
    : '';
}

function printObject(type) {
  return (
    printDescription(type) +
    `type ${type.name}` +
    printImplementedInterfaces(type) +
    printFields(type)
  );
}

function printInterface(type) {
  return (
    printDescription(type) +
    `interface ${type.name}` +
    printImplementedInterfaces(type) +
    printFields(type)
  );
}

function printUnion(type) {
  const types = type.getTypes();
  const possibleTypes = types.length ? ' = ' + types.join(' | ') : '';
  return printDescription(type) + 'union ' + type.name + possibleTypes;
}

function printEnum(type) {
  const values = type
    .getValues()
    .map(
      (value, i) =>
        printDescription(value, '  ', !i) +
        '  ' +
        value.name +
        printDeprecated(value.deprecationReason),
    );
  return printDescription(type) + `enum ${type.name}` + printBlock(values);
}

function printInputObject(type) {
  const fields = Object.values(type.getFields()).map(
    (f, i) => printDescription(f, '  ', !i) + '  ' + printInputValue(f),
  );
  return printDescription(type) + `input ${type.name}` + printBlock(fields);
}

function printFields(type) {
  const fields = Object.values(type.getFields()).map(
    (f, i) =>
      printDescription(f, '  ', !i) +
      '  ' +
      f.name +
      printArgs(f.args, '  ') +
      ': ' +
      String(f.type) +
      printDeprecated(f.deprecationReason),
  );
  return printBlock(fields);
}

function printBlock(items) {
  return items.length !== 0 ? ' {\n' + items.join('\n') + '\n}' : '';
}

function printArgs(args, indentation = '') {
  if (args.length === 0) {
    return '';
  } // If every arg does not have a description, print them on one line.

  if (args.every((arg) => !arg.description)) {
    return '(' + args.map(printInputValue).join(', ') + ')';
  }

  return (
    '(\n' +
    args
      .map(
        (arg, i) =>
          printDescription(arg, '  ' + indentation, !i) +
          '  ' +
          indentation +
          printInputValue(arg),
      )
      .join('\n') +
    '\n' +
    indentation +
    ')'
  );
}

function printInputValue(arg) {
  const defaultAST = (0, _astFromValue.astFromValue)(
    arg.defaultValue,
    arg.type,
  );
  let argDecl = arg.name + ': ' + String(arg.type);

  if (defaultAST) {
    argDecl += ` = ${(0, _printer.print)(defaultAST)}`;
  }

  return argDecl + printDeprecated(arg.deprecationReason);
}

function printDirective(directive) {
  return (
    printDescription(directive) +
    'directive @' +
    directive.name +
    printArgs(directive.args) +
    (directive.isRepeatable ? ' repeatable' : '') +
    ' on ' +
    directive.locations.join(' | ')
  );
}

function printDeprecated(reason) {
  if (reason == null) {
    return '';
  }

  if (reason !== _directives.DEFAULT_DEPRECATION_REASON) {
    const astValue = (0, _printer.print)({
      kind: _kinds.Kind.STRING,
      value: reason,
    });
    return ` @deprecated(reason: ${astValue})`;
  }

  return ' @deprecated';
}

function printSpecifiedByURL(scalar) {
  if (scalar.specifiedByURL == null) {
    return '';
  }

  const astValue = (0, _printer.print)({
    kind: _kinds.Kind.STRING,
    value: scalar.specifiedByURL,
  });
  return ` @specifiedBy(url: ${astValue})`;
}

function printDescription(def, indentation = '', firstInBlock = true) {
  const { description } = def;

  if (description == null) {
    return '';
  }

  const preferMultipleLines = description.length > 70;
  const blockString = (0, _blockString.printBlockString)(
    description,
    preferMultipleLines,
  );
  const prefix =
    indentation && !firstInBlock ? '\n' + indentation : indentation;
  return prefix + blockString.replace(/\n/g, '\n' + indentation) + '\n';
}

},{"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../language/blockString.js":70,"../language/kinds.js":74,"../language/printer.js":81,"../type/definition.js":86,"../type/directives.js":87,"../type/introspection.js":89,"../type/scalars.js":90,"./astFromValue.js":95}],109:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.separateOperations = separateOperations;

var _kinds = require('../language/kinds.js');

var _visitor = require('../language/visitor.js');

/**
 * separateOperations accepts a single AST document which may contain many
 * operations and fragments and returns a collection of AST documents each of
 * which contains a single operation as well the fragment definitions it
 * refers to.
 */
function separateOperations(documentAST) {
  const operations = [];
  const depGraph = Object.create(null); // Populate metadata and build a dependency graph.

  for (const definitionNode of documentAST.definitions) {
    switch (definitionNode.kind) {
      case _kinds.Kind.OPERATION_DEFINITION:
        operations.push(definitionNode);
        break;

      case _kinds.Kind.FRAGMENT_DEFINITION:
        depGraph[definitionNode.name.value] = collectDependencies(
          definitionNode.selectionSet,
        );
        break;
    }
  } // For each operation, produce a new synthesized AST which includes only what
  // is necessary for completing that operation.

  const separatedDocumentASTs = Object.create(null);

  for (const operation of operations) {
    const dependencies = new Set();

    for (const fragmentName of collectDependencies(operation.selectionSet)) {
      collectTransitiveDependencies(dependencies, depGraph, fragmentName);
    } // Provides the empty string for anonymous operations.

    const operationName = operation.name ? operation.name.value : ''; // The list of definition nodes to be included for this operation, sorted
    // to retain the same order as the original document.

    separatedDocumentASTs[operationName] = {
      kind: _kinds.Kind.DOCUMENT,
      definitions: documentAST.definitions.filter(
        (node) =>
          node === operation ||
          (node.kind === _kinds.Kind.FRAGMENT_DEFINITION &&
            dependencies.has(node.name.value)),
      ),
    };
  }

  return separatedDocumentASTs;
}

// From a dependency graph, collects a list of transitive dependencies by
// recursing through a dependency graph.
function collectTransitiveDependencies(collected, depGraph, fromName) {
  if (!collected.has(fromName)) {
    collected.add(fromName);
    const immediateDeps = depGraph[fromName];

    if (immediateDeps !== undefined) {
      for (const toName of immediateDeps) {
        collectTransitiveDependencies(collected, depGraph, toName);
      }
    }
  }
}

function collectDependencies(selectionSet) {
  const dependencies = [];
  (0, _visitor.visit)(selectionSet, {
    FragmentSpread(node) {
      dependencies.push(node.name.value);
    },
  });
  return dependencies;
}

},{"../language/kinds.js":74,"../language/visitor.js":84}],110:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.stripIgnoredCharacters = stripIgnoredCharacters;

var _source = require('../language/source.js');

var _tokenKind = require('../language/tokenKind.js');

var _lexer = require('../language/lexer.js');

var _blockString = require('../language/blockString.js');

/**
 * Strips characters that are not significant to the validity or execution
 * of a GraphQL document:
 *   - UnicodeBOM
 *   - WhiteSpace
 *   - LineTerminator
 *   - Comment
 *   - Comma
 *   - BlockString indentation
 *
 * Note: It is required to have a delimiter character between neighboring
 * non-punctuator tokens and this function always uses single space as delimiter.
 *
 * It is guaranteed that both input and output documents if parsed would result
 * in the exact same AST except for nodes location.
 *
 * Warning: It is guaranteed that this function will always produce stable results.
 * However, it's not guaranteed that it will stay the same between different
 * releases due to bugfixes or changes in the GraphQL specification.
 *
 * Query example:
 *
 * ```graphql
 * query SomeQuery($foo: String!, $bar: String) {
 *   someField(foo: $foo, bar: $bar) {
 *     a
 *     b {
 *       c
 *       d
 *     }
 *   }
 * }
 * ```
 *
 * Becomes:
 *
 * ```graphql
 * query SomeQuery($foo:String!$bar:String){someField(foo:$foo bar:$bar){a b{c d}}}
 * ```
 *
 * SDL example:
 *
 * ```graphql
 * """
 * Type description
 * """
 * type Foo {
 *   """
 *   Field description
 *   """
 *   bar: String
 * }
 * ```
 *
 * Becomes:
 *
 * ```graphql
 * """Type description""" type Foo{"""Field description""" bar:String}
 * ```
 */
function stripIgnoredCharacters(source) {
  const sourceObj = (0, _source.isSource)(source)
    ? source
    : new _source.Source(source);
  const body = sourceObj.body;
  const lexer = new _lexer.Lexer(sourceObj);
  let strippedBody = '';
  let wasLastAddedTokenNonPunctuator = false;

  while (lexer.advance().kind !== _tokenKind.TokenKind.EOF) {
    const currentToken = lexer.token;
    const tokenKind = currentToken.kind;
    /**
     * Every two non-punctuator tokens should have space between them.
     * Also prevent case of non-punctuator token following by spread resulting
     * in invalid token (e.g. `1...` is invalid Float token).
     */

    const isNonPunctuator = !(0, _lexer.isPunctuatorTokenKind)(
      currentToken.kind,
    );

    if (wasLastAddedTokenNonPunctuator) {
      if (
        isNonPunctuator ||
        currentToken.kind === _tokenKind.TokenKind.SPREAD
      ) {
        strippedBody += ' ';
      }
    }

    const tokenBody = body.slice(currentToken.start, currentToken.end);

    if (tokenKind === _tokenKind.TokenKind.BLOCK_STRING) {
      strippedBody += dedentBlockString(tokenBody);
    } else {
      strippedBody += tokenBody;
    }

    wasLastAddedTokenNonPunctuator = isNonPunctuator;
  }

  return strippedBody;
}

function dedentBlockString(blockStr) {
  // skip leading and trailing triple quotations
  const rawStr = blockStr.slice(3, -3);
  let body = (0, _blockString.dedentBlockStringValue)(rawStr);

  if ((0, _blockString.getBlockStringIndentation)(body) > 0) {
    body = '\n' + body;
  }

  const hasTrailingQuote = body.endsWith('"') && !body.endsWith('\\"""');

  if (hasTrailingQuote || body.endsWith('\\')) {
    body += '\n';
  }

  return '"""' + body + '"""';
}

},{"../language/blockString.js":70,"../language/lexer.js":75,"../language/source.js":82,"../language/tokenKind.js":83}],111:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.doTypesOverlap = doTypesOverlap;
exports.isEqualType = isEqualType;
exports.isTypeSubTypeOf = isTypeSubTypeOf;

var _definition = require('../type/definition.js');

/**
 * Provided two types, return true if the types are equal (invariant).
 */
function isEqualType(typeA, typeB) {
  // Equivalent types are equal.
  if (typeA === typeB) {
    return true;
  } // If either type is non-null, the other must also be non-null.

  if (
    (0, _definition.isNonNullType)(typeA) &&
    (0, _definition.isNonNullType)(typeB)
  ) {
    return isEqualType(typeA.ofType, typeB.ofType);
  } // If either type is a list, the other must also be a list.

  if (
    (0, _definition.isListType)(typeA) &&
    (0, _definition.isListType)(typeB)
  ) {
    return isEqualType(typeA.ofType, typeB.ofType);
  } // Otherwise the types are not equal.

  return false;
}
/**
 * Provided a type and a super type, return true if the first type is either
 * equal or a subset of the second super type (covariant).
 */

function isTypeSubTypeOf(schema, maybeSubType, superType) {
  // Equivalent type is a valid subtype
  if (maybeSubType === superType) {
    return true;
  } // If superType is non-null, maybeSubType must also be non-null.

  if ((0, _definition.isNonNullType)(superType)) {
    if ((0, _definition.isNonNullType)(maybeSubType)) {
      return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
    }

    return false;
  }

  if ((0, _definition.isNonNullType)(maybeSubType)) {
    // If superType is nullable, maybeSubType may be non-null or nullable.
    return isTypeSubTypeOf(schema, maybeSubType.ofType, superType);
  } // If superType type is a list, maybeSubType type must also be a list.

  if ((0, _definition.isListType)(superType)) {
    if ((0, _definition.isListType)(maybeSubType)) {
      return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
    }

    return false;
  }

  if ((0, _definition.isListType)(maybeSubType)) {
    // If superType is not a list, maybeSubType must also be not a list.
    return false;
  } // If superType type is an abstract type, check if it is super type of maybeSubType.
  // Otherwise, the child type is not a valid subtype of the parent type.

  return (
    (0, _definition.isAbstractType)(superType) &&
    ((0, _definition.isInterfaceType)(maybeSubType) ||
      (0, _definition.isObjectType)(maybeSubType)) &&
    schema.isSubType(superType, maybeSubType)
  );
}
/**
 * Provided two composite types, determine if they "overlap". Two composite
 * types overlap when the Sets of possible concrete types for each intersect.
 *
 * This is often used to determine if a fragment of a given type could possibly
 * be visited in a context of another type.
 *
 * This function is commutative.
 */

function doTypesOverlap(schema, typeA, typeB) {
  // Equivalent types overlap
  if (typeA === typeB) {
    return true;
  }

  if ((0, _definition.isAbstractType)(typeA)) {
    if ((0, _definition.isAbstractType)(typeB)) {
      // If both types are abstract, then determine if there is any intersection
      // between possible concrete types of each.
      return schema
        .getPossibleTypes(typeA)
        .some((type) => schema.isSubType(typeB, type));
    } // Determine if the latter type is a possible concrete type of the former.

    return schema.isSubType(typeA, typeB);
  }

  if ((0, _definition.isAbstractType)(typeB)) {
    // Determine if the former type is a possible concrete type of the latter.
    return schema.isSubType(typeB, typeA);
  } // Otherwise the types do not overlap.

  return false;
}

},{"../type/definition.js":86}],112:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.typeFromAST = typeFromAST;

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _kinds = require('../language/kinds.js');

var _definition = require('../type/definition.js');

function typeFromAST(schema, typeNode) {
  let innerType;

  if (typeNode.kind === _kinds.Kind.LIST_TYPE) {
    innerType = typeFromAST(schema, typeNode.type);
    return innerType && new _definition.GraphQLList(innerType);
  }

  if (typeNode.kind === _kinds.Kind.NON_NULL_TYPE) {
    innerType = typeFromAST(schema, typeNode.type);
    return innerType && new _definition.GraphQLNonNull(innerType);
  } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

  if (typeNode.kind === _kinds.Kind.NAMED_TYPE) {
    return schema.getType(typeNode.name.value);
  } // istanbul ignore next (Not reachable. All possible type nodes have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected type node: ' + (0, _inspect.inspect)(typeNode),
    );
}

},{"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../language/kinds.js":74,"../type/definition.js":86}],113:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.valueFromAST = valueFromAST;

var _keyMap = require('../jsutils/keyMap.js');

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _kinds = require('../language/kinds.js');

var _definition = require('../type/definition.js');

/**
 * Produces a JavaScript value given a GraphQL Value AST.
 *
 * A GraphQL type must be provided, which will be used to interpret different
 * GraphQL Value literals.
 *
 * Returns `undefined` when the value could not be validly coerced according to
 * the provided type.
 *
 * | GraphQL Value        | JSON Value    |
 * | -------------------- | ------------- |
 * | Input Object         | Object        |
 * | List                 | Array         |
 * | Boolean              | Boolean       |
 * | String               | String        |
 * | Int / Float          | Number        |
 * | Enum Value           | Unknown       |
 * | NullValue            | null          |
 *
 */
function valueFromAST(valueNode, type, variables) {
  if (!valueNode) {
    // When there is no node, then there is also no value.
    // Importantly, this is different from returning the value null.
    return;
  }

  if (valueNode.kind === _kinds.Kind.VARIABLE) {
    const variableName = valueNode.name.value;

    if (variables == null || variables[variableName] === undefined) {
      // No valid return value.
      return;
    }

    const variableValue = variables[variableName];

    if (variableValue === null && (0, _definition.isNonNullType)(type)) {
      return; // Invalid: intentionally return no value.
    } // Note: This does no further checking that this variable is correct.
    // This assumes that this query has been validated and the variable
    // usage here is of the correct type.

    return variableValue;
  }

  if ((0, _definition.isNonNullType)(type)) {
    if (valueNode.kind === _kinds.Kind.NULL) {
      return; // Invalid: intentionally return no value.
    }

    return valueFromAST(valueNode, type.ofType, variables);
  }

  if (valueNode.kind === _kinds.Kind.NULL) {
    // This is explicitly returning the value null.
    return null;
  }

  if ((0, _definition.isListType)(type)) {
    const itemType = type.ofType;

    if (valueNode.kind === _kinds.Kind.LIST) {
      const coercedValues = [];

      for (const itemNode of valueNode.values) {
        if (isMissingVariable(itemNode, variables)) {
          // If an array contains a missing variable, it is either coerced to
          // null or if the item type is non-null, it considered invalid.
          if ((0, _definition.isNonNullType)(itemType)) {
            return; // Invalid: intentionally return no value.
          }

          coercedValues.push(null);
        } else {
          const itemValue = valueFromAST(itemNode, itemType, variables);

          if (itemValue === undefined) {
            return; // Invalid: intentionally return no value.
          }

          coercedValues.push(itemValue);
        }
      }

      return coercedValues;
    }

    const coercedValue = valueFromAST(valueNode, itemType, variables);

    if (coercedValue === undefined) {
      return; // Invalid: intentionally return no value.
    }

    return [coercedValue];
  }

  if ((0, _definition.isInputObjectType)(type)) {
    if (valueNode.kind !== _kinds.Kind.OBJECT) {
      return; // Invalid: intentionally return no value.
    }

    const coercedObj = Object.create(null);
    const fieldNodes = (0, _keyMap.keyMap)(
      valueNode.fields,
      (field) => field.name.value,
    );

    for (const field of Object.values(type.getFields())) {
      const fieldNode = fieldNodes[field.name];

      if (!fieldNode || isMissingVariable(fieldNode.value, variables)) {
        if (field.defaultValue !== undefined) {
          coercedObj[field.name] = field.defaultValue;
        } else if ((0, _definition.isNonNullType)(field.type)) {
          return; // Invalid: intentionally return no value.
        }

        continue;
      }

      const fieldValue = valueFromAST(fieldNode.value, field.type, variables);

      if (fieldValue === undefined) {
        return; // Invalid: intentionally return no value.
      }

      coercedObj[field.name] = fieldValue;
    }

    return coercedObj;
  } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

  if ((0, _definition.isLeafType)(type)) {
    // Scalars and Enums fulfill parsing a literal value via parseLiteral().
    // Invalid values represent a failure to parse correctly, in which case
    // no value is returned.
    let result;

    try {
      result = type.parseLiteral(valueNode, variables);
    } catch (_error) {
      return; // Invalid: intentionally return no value.
    }

    if (result === undefined) {
      return; // Invalid: intentionally return no value.
    }

    return result;
  } // istanbul ignore next (Not reachable. All possible input types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected input type: ' + (0, _inspect.inspect)(type),
    );
} // Returns true if the provided valueNode is a variable which is not defined
// in the set of variables.

function isMissingVariable(valueNode, variables) {
  return (
    valueNode.kind === _kinds.Kind.VARIABLE &&
    (variables == null || variables[valueNode.name.value] === undefined)
  );
}

},{"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../jsutils/keyMap.js":59,"../language/kinds.js":74,"../type/definition.js":86}],114:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.valueFromASTUntyped = valueFromASTUntyped;

var _inspect = require('../jsutils/inspect.js');

var _invariant = require('../jsutils/invariant.js');

var _keyValMap = require('../jsutils/keyValMap.js');

var _kinds = require('../language/kinds.js');

/**
 * Produces a JavaScript value given a GraphQL Value AST.
 *
 * Unlike `valueFromAST()`, no type is provided. The resulting JavaScript value
 * will reflect the provided GraphQL value AST.
 *
 * | GraphQL Value        | JavaScript Value |
 * | -------------------- | ---------------- |
 * | Input Object         | Object           |
 * | List                 | Array            |
 * | Boolean              | Boolean          |
 * | String / Enum        | String           |
 * | Int / Float          | Number           |
 * | Null                 | null             |
 *
 */
function valueFromASTUntyped(valueNode, variables) {
  switch (valueNode.kind) {
    case _kinds.Kind.NULL:
      return null;

    case _kinds.Kind.INT:
      return parseInt(valueNode.value, 10);

    case _kinds.Kind.FLOAT:
      return parseFloat(valueNode.value);

    case _kinds.Kind.STRING:
    case _kinds.Kind.ENUM:
    case _kinds.Kind.BOOLEAN:
      return valueNode.value;

    case _kinds.Kind.LIST:
      return valueNode.values.map((node) =>
        valueFromASTUntyped(node, variables),
      );

    case _kinds.Kind.OBJECT:
      return (0, _keyValMap.keyValMap)(
        valueNode.fields,
        (field) => field.name.value,
        (field) => valueFromASTUntyped(field.value, variables),
      );

    case _kinds.Kind.VARIABLE:
      return variables === null || variables === void 0
        ? void 0
        : variables[valueNode.name.value];
  } // istanbul ignore next (Not reachable. All possible value nodes have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected value node: ' + (0, _inspect.inspect)(valueNode),
    );
}

},{"../jsutils/inspect.js":52,"../jsutils/invariant.js":54,"../jsutils/keyValMap.js":60,"../language/kinds.js":74}],115:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ValidationContext =
  exports.SDLValidationContext =
  exports.ASTValidationContext =
    void 0;

var _kinds = require('../language/kinds.js');

var _visitor = require('../language/visitor.js');

var _TypeInfo = require('../utilities/TypeInfo.js');

/**
 * An instance of this class is passed as the "this" context to all validators,
 * allowing access to commonly useful contextual information from within a
 * validation rule.
 */
class ASTValidationContext {
  constructor(ast, onError) {
    this._ast = ast;
    this._fragments = undefined;
    this._fragmentSpreads = new Map();
    this._recursivelyReferencedFragments = new Map();
    this._onError = onError;
  }

  get [Symbol.toStringTag]() {
    return 'ASTValidationContext';
  }

  reportError(error) {
    this._onError(error);
  }

  getDocument() {
    return this._ast;
  }

  getFragment(name) {
    let fragments;

    if (this._fragments) {
      fragments = this._fragments;
    } else {
      fragments = Object.create(null);

      for (const defNode of this.getDocument().definitions) {
        if (defNode.kind === _kinds.Kind.FRAGMENT_DEFINITION) {
          fragments[defNode.name.value] = defNode;
        }
      }

      this._fragments = fragments;
    }

    return fragments[name];
  }

  getFragmentSpreads(node) {
    let spreads = this._fragmentSpreads.get(node);

    if (!spreads) {
      spreads = [];
      const setsToVisit = [node];
      let set;

      while ((set = setsToVisit.pop())) {
        for (const selection of set.selections) {
          if (selection.kind === _kinds.Kind.FRAGMENT_SPREAD) {
            spreads.push(selection);
          } else if (selection.selectionSet) {
            setsToVisit.push(selection.selectionSet);
          }
        }
      }

      this._fragmentSpreads.set(node, spreads);
    }

    return spreads;
  }

  getRecursivelyReferencedFragments(operation) {
    let fragments = this._recursivelyReferencedFragments.get(operation);

    if (!fragments) {
      fragments = [];
      const collectedNames = Object.create(null);
      const nodesToVisit = [operation.selectionSet];
      let node;

      while ((node = nodesToVisit.pop())) {
        for (const spread of this.getFragmentSpreads(node)) {
          const fragName = spread.name.value;

          if (collectedNames[fragName] !== true) {
            collectedNames[fragName] = true;
            const fragment = this.getFragment(fragName);

            if (fragment) {
              fragments.push(fragment);
              nodesToVisit.push(fragment.selectionSet);
            }
          }
        }
      }

      this._recursivelyReferencedFragments.set(operation, fragments);
    }

    return fragments;
  }
}

exports.ASTValidationContext = ASTValidationContext;

class SDLValidationContext extends ASTValidationContext {
  constructor(ast, schema, onError) {
    super(ast, onError);
    this._schema = schema;
  }

  get [Symbol.toStringTag]() {
    return 'SDLValidationContext';
  }

  getSchema() {
    return this._schema;
  }
}

exports.SDLValidationContext = SDLValidationContext;

class ValidationContext extends ASTValidationContext {
  constructor(schema, ast, typeInfo, onError) {
    super(ast, onError);
    this._schema = schema;
    this._typeInfo = typeInfo;
    this._variableUsages = new Map();
    this._recursiveVariableUsages = new Map();
  }

  get [Symbol.toStringTag]() {
    return 'ValidationContext';
  }

  getSchema() {
    return this._schema;
  }

  getVariableUsages(node) {
    let usages = this._variableUsages.get(node);

    if (!usages) {
      const newUsages = [];
      const typeInfo = new _TypeInfo.TypeInfo(this._schema);
      (0, _visitor.visit)(
        node,
        (0, _TypeInfo.visitWithTypeInfo)(typeInfo, {
          VariableDefinition: () => false,

          Variable(variable) {
            newUsages.push({
              node: variable,
              type: typeInfo.getInputType(),
              defaultValue: typeInfo.getDefaultValue(),
            });
          },
        }),
      );
      usages = newUsages;

      this._variableUsages.set(node, usages);
    }

    return usages;
  }

  getRecursiveVariableUsages(operation) {
    let usages = this._recursiveVariableUsages.get(operation);

    if (!usages) {
      usages = this.getVariableUsages(operation);

      for (const frag of this.getRecursivelyReferencedFragments(operation)) {
        usages = usages.concat(this.getVariableUsages(frag));
      }

      this._recursiveVariableUsages.set(operation, usages);
    }

    return usages;
  }

  getType() {
    return this._typeInfo.getType();
  }

  getParentType() {
    return this._typeInfo.getParentType();
  }

  getInputType() {
    return this._typeInfo.getInputType();
  }

  getParentInputType() {
    return this._typeInfo.getParentInputType();
  }

  getFieldDef() {
    return this._typeInfo.getFieldDef();
  }

  getDirective() {
    return this._typeInfo.getDirective();
  }

  getArgument() {
    return this._typeInfo.getArgument();
  }

  getEnumValue() {
    return this._typeInfo.getEnumValue();
  }
}

exports.ValidationContext = ValidationContext;

},{"../language/kinds.js":74,"../language/visitor.js":84,"../utilities/TypeInfo.js":93}],116:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'ExecutableDefinitionsRule', {
  enumerable: true,
  get: function () {
    return _ExecutableDefinitionsRule.ExecutableDefinitionsRule;
  },
});
Object.defineProperty(exports, 'FieldsOnCorrectTypeRule', {
  enumerable: true,
  get: function () {
    return _FieldsOnCorrectTypeRule.FieldsOnCorrectTypeRule;
  },
});
Object.defineProperty(exports, 'FragmentsOnCompositeTypesRule', {
  enumerable: true,
  get: function () {
    return _FragmentsOnCompositeTypesRule.FragmentsOnCompositeTypesRule;
  },
});
Object.defineProperty(exports, 'KnownArgumentNamesRule', {
  enumerable: true,
  get: function () {
    return _KnownArgumentNamesRule.KnownArgumentNamesRule;
  },
});
Object.defineProperty(exports, 'KnownDirectivesRule', {
  enumerable: true,
  get: function () {
    return _KnownDirectivesRule.KnownDirectivesRule;
  },
});
Object.defineProperty(exports, 'KnownFragmentNamesRule', {
  enumerable: true,
  get: function () {
    return _KnownFragmentNamesRule.KnownFragmentNamesRule;
  },
});
Object.defineProperty(exports, 'KnownTypeNamesRule', {
  enumerable: true,
  get: function () {
    return _KnownTypeNamesRule.KnownTypeNamesRule;
  },
});
Object.defineProperty(exports, 'LoneAnonymousOperationRule', {
  enumerable: true,
  get: function () {
    return _LoneAnonymousOperationRule.LoneAnonymousOperationRule;
  },
});
Object.defineProperty(exports, 'LoneSchemaDefinitionRule', {
  enumerable: true,
  get: function () {
    return _LoneSchemaDefinitionRule.LoneSchemaDefinitionRule;
  },
});
Object.defineProperty(exports, 'NoDeprecatedCustomRule', {
  enumerable: true,
  get: function () {
    return _NoDeprecatedCustomRule.NoDeprecatedCustomRule;
  },
});
Object.defineProperty(exports, 'NoFragmentCyclesRule', {
  enumerable: true,
  get: function () {
    return _NoFragmentCyclesRule.NoFragmentCyclesRule;
  },
});
Object.defineProperty(exports, 'NoSchemaIntrospectionCustomRule', {
  enumerable: true,
  get: function () {
    return _NoSchemaIntrospectionCustomRule.NoSchemaIntrospectionCustomRule;
  },
});
Object.defineProperty(exports, 'NoUndefinedVariablesRule', {
  enumerable: true,
  get: function () {
    return _NoUndefinedVariablesRule.NoUndefinedVariablesRule;
  },
});
Object.defineProperty(exports, 'NoUnusedFragmentsRule', {
  enumerable: true,
  get: function () {
    return _NoUnusedFragmentsRule.NoUnusedFragmentsRule;
  },
});
Object.defineProperty(exports, 'NoUnusedVariablesRule', {
  enumerable: true,
  get: function () {
    return _NoUnusedVariablesRule.NoUnusedVariablesRule;
  },
});
Object.defineProperty(exports, 'OverlappingFieldsCanBeMergedRule', {
  enumerable: true,
  get: function () {
    return _OverlappingFieldsCanBeMergedRule.OverlappingFieldsCanBeMergedRule;
  },
});
Object.defineProperty(exports, 'PossibleFragmentSpreadsRule', {
  enumerable: true,
  get: function () {
    return _PossibleFragmentSpreadsRule.PossibleFragmentSpreadsRule;
  },
});
Object.defineProperty(exports, 'PossibleTypeExtensionsRule', {
  enumerable: true,
  get: function () {
    return _PossibleTypeExtensionsRule.PossibleTypeExtensionsRule;
  },
});
Object.defineProperty(exports, 'ProvidedRequiredArgumentsRule', {
  enumerable: true,
  get: function () {
    return _ProvidedRequiredArgumentsRule.ProvidedRequiredArgumentsRule;
  },
});
Object.defineProperty(exports, 'ScalarLeafsRule', {
  enumerable: true,
  get: function () {
    return _ScalarLeafsRule.ScalarLeafsRule;
  },
});
Object.defineProperty(exports, 'SingleFieldSubscriptionsRule', {
  enumerable: true,
  get: function () {
    return _SingleFieldSubscriptionsRule.SingleFieldSubscriptionsRule;
  },
});
Object.defineProperty(exports, 'UniqueArgumentDefinitionNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueArgumentDefinitionNamesRule.UniqueArgumentDefinitionNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueArgumentNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueArgumentNamesRule.UniqueArgumentNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueDirectiveNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueDirectiveNamesRule.UniqueDirectiveNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueDirectivesPerLocationRule', {
  enumerable: true,
  get: function () {
    return _UniqueDirectivesPerLocationRule.UniqueDirectivesPerLocationRule;
  },
});
Object.defineProperty(exports, 'UniqueEnumValueNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueEnumValueNamesRule.UniqueEnumValueNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueFieldDefinitionNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueFieldDefinitionNamesRule.UniqueFieldDefinitionNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueFragmentNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueFragmentNamesRule.UniqueFragmentNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueInputFieldNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueInputFieldNamesRule.UniqueInputFieldNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueOperationNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueOperationNamesRule.UniqueOperationNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueOperationTypesRule', {
  enumerable: true,
  get: function () {
    return _UniqueOperationTypesRule.UniqueOperationTypesRule;
  },
});
Object.defineProperty(exports, 'UniqueTypeNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueTypeNamesRule.UniqueTypeNamesRule;
  },
});
Object.defineProperty(exports, 'UniqueVariableNamesRule', {
  enumerable: true,
  get: function () {
    return _UniqueVariableNamesRule.UniqueVariableNamesRule;
  },
});
Object.defineProperty(exports, 'ValidationContext', {
  enumerable: true,
  get: function () {
    return _ValidationContext.ValidationContext;
  },
});
Object.defineProperty(exports, 'ValuesOfCorrectTypeRule', {
  enumerable: true,
  get: function () {
    return _ValuesOfCorrectTypeRule.ValuesOfCorrectTypeRule;
  },
});
Object.defineProperty(exports, 'VariablesAreInputTypesRule', {
  enumerable: true,
  get: function () {
    return _VariablesAreInputTypesRule.VariablesAreInputTypesRule;
  },
});
Object.defineProperty(exports, 'VariablesInAllowedPositionRule', {
  enumerable: true,
  get: function () {
    return _VariablesInAllowedPositionRule.VariablesInAllowedPositionRule;
  },
});
Object.defineProperty(exports, 'specifiedRules', {
  enumerable: true,
  get: function () {
    return _specifiedRules.specifiedRules;
  },
});
Object.defineProperty(exports, 'validate', {
  enumerable: true,
  get: function () {
    return _validate.validate;
  },
});

var _validate = require('./validate.js');

var _ValidationContext = require('./ValidationContext.js');

var _specifiedRules = require('./specifiedRules.js');

var _ExecutableDefinitionsRule = require('./rules/ExecutableDefinitionsRule.js');

var _FieldsOnCorrectTypeRule = require('./rules/FieldsOnCorrectTypeRule.js');

var _FragmentsOnCompositeTypesRule = require('./rules/FragmentsOnCompositeTypesRule.js');

var _KnownArgumentNamesRule = require('./rules/KnownArgumentNamesRule.js');

var _KnownDirectivesRule = require('./rules/KnownDirectivesRule.js');

var _KnownFragmentNamesRule = require('./rules/KnownFragmentNamesRule.js');

var _KnownTypeNamesRule = require('./rules/KnownTypeNamesRule.js');

var _LoneAnonymousOperationRule = require('./rules/LoneAnonymousOperationRule.js');

var _NoFragmentCyclesRule = require('./rules/NoFragmentCyclesRule.js');

var _NoUndefinedVariablesRule = require('./rules/NoUndefinedVariablesRule.js');

var _NoUnusedFragmentsRule = require('./rules/NoUnusedFragmentsRule.js');

var _NoUnusedVariablesRule = require('./rules/NoUnusedVariablesRule.js');

var _OverlappingFieldsCanBeMergedRule = require('./rules/OverlappingFieldsCanBeMergedRule.js');

var _PossibleFragmentSpreadsRule = require('./rules/PossibleFragmentSpreadsRule.js');

var _ProvidedRequiredArgumentsRule = require('./rules/ProvidedRequiredArgumentsRule.js');

var _ScalarLeafsRule = require('./rules/ScalarLeafsRule.js');

var _SingleFieldSubscriptionsRule = require('./rules/SingleFieldSubscriptionsRule.js');

var _UniqueArgumentNamesRule = require('./rules/UniqueArgumentNamesRule.js');

var _UniqueDirectivesPerLocationRule = require('./rules/UniqueDirectivesPerLocationRule.js');

var _UniqueFragmentNamesRule = require('./rules/UniqueFragmentNamesRule.js');

var _UniqueInputFieldNamesRule = require('./rules/UniqueInputFieldNamesRule.js');

var _UniqueOperationNamesRule = require('./rules/UniqueOperationNamesRule.js');

var _UniqueVariableNamesRule = require('./rules/UniqueVariableNamesRule.js');

var _ValuesOfCorrectTypeRule = require('./rules/ValuesOfCorrectTypeRule.js');

var _VariablesAreInputTypesRule = require('./rules/VariablesAreInputTypesRule.js');

var _VariablesInAllowedPositionRule = require('./rules/VariablesInAllowedPositionRule.js');

var _LoneSchemaDefinitionRule = require('./rules/LoneSchemaDefinitionRule.js');

var _UniqueOperationTypesRule = require('./rules/UniqueOperationTypesRule.js');

var _UniqueTypeNamesRule = require('./rules/UniqueTypeNamesRule.js');

var _UniqueEnumValueNamesRule = require('./rules/UniqueEnumValueNamesRule.js');

var _UniqueFieldDefinitionNamesRule = require('./rules/UniqueFieldDefinitionNamesRule.js');

var _UniqueArgumentDefinitionNamesRule = require('./rules/UniqueArgumentDefinitionNamesRule.js');

var _UniqueDirectiveNamesRule = require('./rules/UniqueDirectiveNamesRule.js');

var _PossibleTypeExtensionsRule = require('./rules/PossibleTypeExtensionsRule.js');

var _NoDeprecatedCustomRule = require('./rules/custom/NoDeprecatedCustomRule.js');

var _NoSchemaIntrospectionCustomRule = require('./rules/custom/NoSchemaIntrospectionCustomRule.js');

},{"./ValidationContext.js":115,"./rules/ExecutableDefinitionsRule.js":117,"./rules/FieldsOnCorrectTypeRule.js":118,"./rules/FragmentsOnCompositeTypesRule.js":119,"./rules/KnownArgumentNamesRule.js":120,"./rules/KnownDirectivesRule.js":121,"./rules/KnownFragmentNamesRule.js":122,"./rules/KnownTypeNamesRule.js":123,"./rules/LoneAnonymousOperationRule.js":124,"./rules/LoneSchemaDefinitionRule.js":125,"./rules/NoFragmentCyclesRule.js":126,"./rules/NoUndefinedVariablesRule.js":127,"./rules/NoUnusedFragmentsRule.js":128,"./rules/NoUnusedVariablesRule.js":129,"./rules/OverlappingFieldsCanBeMergedRule.js":130,"./rules/PossibleFragmentSpreadsRule.js":131,"./rules/PossibleTypeExtensionsRule.js":132,"./rules/ProvidedRequiredArgumentsRule.js":133,"./rules/ScalarLeafsRule.js":134,"./rules/SingleFieldSubscriptionsRule.js":135,"./rules/UniqueArgumentDefinitionNamesRule.js":136,"./rules/UniqueArgumentNamesRule.js":137,"./rules/UniqueDirectiveNamesRule.js":138,"./rules/UniqueDirectivesPerLocationRule.js":139,"./rules/UniqueEnumValueNamesRule.js":140,"./rules/UniqueFieldDefinitionNamesRule.js":141,"./rules/UniqueFragmentNamesRule.js":142,"./rules/UniqueInputFieldNamesRule.js":143,"./rules/UniqueOperationNamesRule.js":144,"./rules/UniqueOperationTypesRule.js":145,"./rules/UniqueTypeNamesRule.js":146,"./rules/UniqueVariableNamesRule.js":147,"./rules/ValuesOfCorrectTypeRule.js":148,"./rules/VariablesAreInputTypesRule.js":149,"./rules/VariablesInAllowedPositionRule.js":150,"./rules/custom/NoDeprecatedCustomRule.js":151,"./rules/custom/NoSchemaIntrospectionCustomRule.js":152,"./specifiedRules.js":153,"./validate.js":154}],117:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ExecutableDefinitionsRule = ExecutableDefinitionsRule;

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _predicates = require('../../language/predicates.js');

/**
 * Executable definitions
 *
 * A GraphQL document is only valid for execution if all definitions are either
 * operation or fragment definitions.
 *
 * See https://spec.graphql.org/draft/#sec-Executable-Definitions
 */
function ExecutableDefinitionsRule(context) {
  return {
    Document(node) {
      for (const definition of node.definitions) {
        if (!(0, _predicates.isExecutableDefinitionNode)(definition)) {
          const defName =
            definition.kind === _kinds.Kind.SCHEMA_DEFINITION ||
            definition.kind === _kinds.Kind.SCHEMA_EXTENSION
              ? 'schema'
              : '"' + definition.name.value + '"';
          context.reportError(
            new _GraphQLError.GraphQLError(
              `The ${defName} definition is not executable.`,
              definition,
            ),
          );
        }
      }

      return false;
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../language/kinds.js":74,"../../language/predicates.js":78}],118:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.FieldsOnCorrectTypeRule = FieldsOnCorrectTypeRule;

var _didYouMean = require('../../jsutils/didYouMean.js');

var _suggestionList = require('../../jsutils/suggestionList.js');

var _naturalCompare = require('../../jsutils/naturalCompare.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _definition = require('../../type/definition.js');

/**
 * Fields on correct type
 *
 * A GraphQL document is only valid if all fields selected are defined by the
 * parent type, or are an allowed meta field such as __typename.
 *
 * See https://spec.graphql.org/draft/#sec-Field-Selections
 */
function FieldsOnCorrectTypeRule(context) {
  return {
    Field(node) {
      const type = context.getParentType();

      if (type) {
        const fieldDef = context.getFieldDef();

        if (!fieldDef) {
          // This field doesn't exist, lets look for suggestions.
          const schema = context.getSchema();
          const fieldName = node.name.value; // First determine if there are any suggested types to condition on.

          let suggestion = (0, _didYouMean.didYouMean)(
            'to use an inline fragment on',
            getSuggestedTypeNames(schema, type, fieldName),
          ); // If there are no suggested types, then perhaps this was a typo?

          if (suggestion === '') {
            suggestion = (0, _didYouMean.didYouMean)(
              getSuggestedFieldNames(type, fieldName),
            );
          } // Report an error, including helpful suggestions.

          context.reportError(
            new _GraphQLError.GraphQLError(
              `Cannot query field "${fieldName}" on type "${type.name}".` +
                suggestion,
              node,
            ),
          );
        }
      }
    },
  };
}
/**
 * Go through all of the implementations of type, as well as the interfaces that
 * they implement. If any of those types include the provided field, suggest them,
 * sorted by how often the type is referenced.
 */

function getSuggestedTypeNames(schema, type, fieldName) {
  if (!(0, _definition.isAbstractType)(type)) {
    // Must be an Object type, which does not have possible fields.
    return [];
  }

  const suggestedTypes = new Set();
  const usageCount = Object.create(null);

  for (const possibleType of schema.getPossibleTypes(type)) {
    if (!possibleType.getFields()[fieldName]) {
      continue;
    } // This object type defines this field.

    suggestedTypes.add(possibleType);
    usageCount[possibleType.name] = 1;

    for (const possibleInterface of possibleType.getInterfaces()) {
      var _usageCount$possibleI;

      if (!possibleInterface.getFields()[fieldName]) {
        continue;
      } // This interface type defines this field.

      suggestedTypes.add(possibleInterface);
      usageCount[possibleInterface.name] =
        ((_usageCount$possibleI = usageCount[possibleInterface.name]) !==
          null && _usageCount$possibleI !== void 0
          ? _usageCount$possibleI
          : 0) + 1;
    }
  }

  return [...suggestedTypes]
    .sort((typeA, typeB) => {
      // Suggest both interface and object types based on how common they are.
      const usageCountDiff = usageCount[typeB.name] - usageCount[typeA.name];

      if (usageCountDiff !== 0) {
        return usageCountDiff;
      } // Suggest super types first followed by subtypes

      if (
        (0, _definition.isInterfaceType)(typeA) &&
        schema.isSubType(typeA, typeB)
      ) {
        return -1;
      }

      if (
        (0, _definition.isInterfaceType)(typeB) &&
        schema.isSubType(typeB, typeA)
      ) {
        return 1;
      }

      return (0, _naturalCompare.naturalCompare)(typeA.name, typeB.name);
    })
    .map((x) => x.name);
}
/**
 * For the field name provided, determine if there are any similar field names
 * that may be the result of a typo.
 */

function getSuggestedFieldNames(type, fieldName) {
  if (
    (0, _definition.isObjectType)(type) ||
    (0, _definition.isInterfaceType)(type)
  ) {
    const possibleFieldNames = Object.keys(type.getFields());
    return (0, _suggestionList.suggestionList)(fieldName, possibleFieldNames);
  } // Otherwise, must be a Union type, which does not define fields.

  return [];
}

},{"../../error/GraphQLError.js":35,"../../jsutils/didYouMean.js":49,"../../jsutils/naturalCompare.js":63,"../../jsutils/suggestionList.js":67,"../../type/definition.js":86}],119:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.FragmentsOnCompositeTypesRule = FragmentsOnCompositeTypesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

var _printer = require('../../language/printer.js');

var _definition = require('../../type/definition.js');

var _typeFromAST = require('../../utilities/typeFromAST.js');

/**
 * Fragments on composite type
 *
 * Fragments use a type condition to determine if they apply, since fragments
 * can only be spread into a composite type (object, interface, or union), the
 * type condition must also be a composite type.
 *
 * See https://spec.graphql.org/draft/#sec-Fragments-On-Composite-Types
 */
function FragmentsOnCompositeTypesRule(context) {
  return {
    InlineFragment(node) {
      const typeCondition = node.typeCondition;

      if (typeCondition) {
        const type = (0, _typeFromAST.typeFromAST)(
          context.getSchema(),
          typeCondition,
        );

        if (type && !(0, _definition.isCompositeType)(type)) {
          const typeStr = (0, _printer.print)(typeCondition);
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Fragment cannot condition on non composite type "${typeStr}".`,
              typeCondition,
            ),
          );
        }
      }
    },

    FragmentDefinition(node) {
      const type = (0, _typeFromAST.typeFromAST)(
        context.getSchema(),
        node.typeCondition,
      );

      if (type && !(0, _definition.isCompositeType)(type)) {
        const typeStr = (0, _printer.print)(node.typeCondition);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Fragment "${node.name.value}" cannot condition on non composite type "${typeStr}".`,
            node.typeCondition,
          ),
        );
      }
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../language/printer.js":81,"../../type/definition.js":86,"../../utilities/typeFromAST.js":112}],120:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.KnownArgumentNamesOnDirectivesRule = KnownArgumentNamesOnDirectivesRule;
exports.KnownArgumentNamesRule = KnownArgumentNamesRule;

var _didYouMean = require('../../jsutils/didYouMean.js');

var _suggestionList = require('../../jsutils/suggestionList.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _directives = require('../../type/directives.js');

/**
 * Known argument names
 *
 * A GraphQL field is only valid if all supplied arguments are defined by
 * that field.
 *
 * See https://spec.graphql.org/draft/#sec-Argument-Names
 * See https://spec.graphql.org/draft/#sec-Directives-Are-In-Valid-Locations
 */
function KnownArgumentNamesRule(context) {
  return {
    // eslint-disable-next-line new-cap
    ...KnownArgumentNamesOnDirectivesRule(context),

    Argument(argNode) {
      const argDef = context.getArgument();
      const fieldDef = context.getFieldDef();
      const parentType = context.getParentType();

      if (!argDef && fieldDef && parentType) {
        const argName = argNode.name.value;
        const knownArgsNames = fieldDef.args.map((arg) => arg.name);
        const suggestions = (0, _suggestionList.suggestionList)(
          argName,
          knownArgsNames,
        );
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Unknown argument "${argName}" on field "${parentType.name}.${fieldDef.name}".` +
              (0, _didYouMean.didYouMean)(suggestions),
            argNode,
          ),
        );
      }
    },
  };
}
/**
 * @internal
 */

function KnownArgumentNamesOnDirectivesRule(context) {
  const directiveArgs = Object.create(null);
  const schema = context.getSchema();
  const definedDirectives = schema
    ? schema.getDirectives()
    : _directives.specifiedDirectives;

  for (const directive of definedDirectives) {
    directiveArgs[directive.name] = directive.args.map((arg) => arg.name);
  }

  const astDefinitions = context.getDocument().definitions;

  for (const def of astDefinitions) {
    if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
      var _def$arguments;

      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      const argsNodes =
        (_def$arguments = def.arguments) !== null && _def$arguments !== void 0
          ? _def$arguments
          : [];
      directiveArgs[def.name.value] = argsNodes.map((arg) => arg.name.value);
    }
  }

  return {
    Directive(directiveNode) {
      const directiveName = directiveNode.name.value;
      const knownArgs = directiveArgs[directiveName];

      if (directiveNode.arguments && knownArgs) {
        for (const argNode of directiveNode.arguments) {
          const argName = argNode.name.value;

          if (!knownArgs.includes(argName)) {
            const suggestions = (0, _suggestionList.suggestionList)(
              argName,
              knownArgs,
            );
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Unknown argument "${argName}" on directive "@${directiveName}".` +
                  (0, _didYouMean.didYouMean)(suggestions),
                argNode,
              ),
            );
          }
        }
      }

      return false;
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../jsutils/didYouMean.js":49,"../../jsutils/suggestionList.js":67,"../../language/kinds.js":74,"../../type/directives.js":87}],121:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.KnownDirectivesRule = KnownDirectivesRule;

var _inspect = require('../../jsutils/inspect.js');

var _invariant = require('../../jsutils/invariant.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _ast = require('../../language/ast.js');

var _directiveLocation = require('../../language/directiveLocation.js');

var _directives = require('../../type/directives.js');

/**
 * Known directives
 *
 * A GraphQL document is only valid if all `@directives` are known by the
 * schema and legally positioned.
 *
 * See https://spec.graphql.org/draft/#sec-Directives-Are-Defined
 */
function KnownDirectivesRule(context) {
  const locationsMap = Object.create(null);
  const schema = context.getSchema();
  const definedDirectives = schema
    ? schema.getDirectives()
    : _directives.specifiedDirectives;

  for (const directive of definedDirectives) {
    locationsMap[directive.name] = directive.locations;
  }

  const astDefinitions = context.getDocument().definitions;

  for (const def of astDefinitions) {
    if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
      locationsMap[def.name.value] = def.locations.map((name) => name.value);
    }
  }

  return {
    Directive(node, _key, _parent, _path, ancestors) {
      const name = node.name.value;
      const locations = locationsMap[name];

      if (!locations) {
        context.reportError(
          new _GraphQLError.GraphQLError(`Unknown directive "@${name}".`, node),
        );
        return;
      }

      const candidateLocation = getDirectiveLocationForASTPath(ancestors);

      if (candidateLocation && !locations.includes(candidateLocation)) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Directive "@${name}" may not be used on ${candidateLocation}.`,
            node,
          ),
        );
      }
    },
  };
}

function getDirectiveLocationForASTPath(ancestors) {
  const appliedTo = ancestors[ancestors.length - 1];
  'kind' in appliedTo || (0, _invariant.invariant)(false);

  switch (appliedTo.kind) {
    case _kinds.Kind.OPERATION_DEFINITION:
      return getDirectiveLocationForOperation(appliedTo.operation);

    case _kinds.Kind.FIELD:
      return _directiveLocation.DirectiveLocation.FIELD;

    case _kinds.Kind.FRAGMENT_SPREAD:
      return _directiveLocation.DirectiveLocation.FRAGMENT_SPREAD;

    case _kinds.Kind.INLINE_FRAGMENT:
      return _directiveLocation.DirectiveLocation.INLINE_FRAGMENT;

    case _kinds.Kind.FRAGMENT_DEFINITION:
      return _directiveLocation.DirectiveLocation.FRAGMENT_DEFINITION;

    case _kinds.Kind.VARIABLE_DEFINITION:
      return _directiveLocation.DirectiveLocation.VARIABLE_DEFINITION;

    case _kinds.Kind.SCHEMA_DEFINITION:
    case _kinds.Kind.SCHEMA_EXTENSION:
      return _directiveLocation.DirectiveLocation.SCHEMA;

    case _kinds.Kind.SCALAR_TYPE_DEFINITION:
    case _kinds.Kind.SCALAR_TYPE_EXTENSION:
      return _directiveLocation.DirectiveLocation.SCALAR;

    case _kinds.Kind.OBJECT_TYPE_DEFINITION:
    case _kinds.Kind.OBJECT_TYPE_EXTENSION:
      return _directiveLocation.DirectiveLocation.OBJECT;

    case _kinds.Kind.FIELD_DEFINITION:
      return _directiveLocation.DirectiveLocation.FIELD_DEFINITION;

    case _kinds.Kind.INTERFACE_TYPE_DEFINITION:
    case _kinds.Kind.INTERFACE_TYPE_EXTENSION:
      return _directiveLocation.DirectiveLocation.INTERFACE;

    case _kinds.Kind.UNION_TYPE_DEFINITION:
    case _kinds.Kind.UNION_TYPE_EXTENSION:
      return _directiveLocation.DirectiveLocation.UNION;

    case _kinds.Kind.ENUM_TYPE_DEFINITION:
    case _kinds.Kind.ENUM_TYPE_EXTENSION:
      return _directiveLocation.DirectiveLocation.ENUM;

    case _kinds.Kind.ENUM_VALUE_DEFINITION:
      return _directiveLocation.DirectiveLocation.ENUM_VALUE;

    case _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION:
    case _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return _directiveLocation.DirectiveLocation.INPUT_OBJECT;

    case _kinds.Kind.INPUT_VALUE_DEFINITION: {
      const parentNode = ancestors[ancestors.length - 3];
      'kind' in parentNode || (0, _invariant.invariant)(false);
      return parentNode.kind === _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION
        ? _directiveLocation.DirectiveLocation.INPUT_FIELD_DEFINITION
        : _directiveLocation.DirectiveLocation.ARGUMENT_DEFINITION;
    }
  }
}

function getDirectiveLocationForOperation(operation) {
  switch (operation) {
    case _ast.OperationTypeNode.QUERY:
      return _directiveLocation.DirectiveLocation.QUERY;

    case _ast.OperationTypeNode.MUTATION:
      return _directiveLocation.DirectiveLocation.MUTATION;

    case _ast.OperationTypeNode.SUBSCRIPTION:
      return _directiveLocation.DirectiveLocation.SUBSCRIPTION;
  } // istanbul ignore next (Not reachable. All possible types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected operation: ' + (0, _inspect.inspect)(operation),
    );
}

},{"../../error/GraphQLError.js":35,"../../jsutils/inspect.js":52,"../../jsutils/invariant.js":54,"../../language/ast.js":69,"../../language/directiveLocation.js":72,"../../language/kinds.js":74,"../../type/directives.js":87}],122:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.KnownFragmentNamesRule = KnownFragmentNamesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Known fragment names
 *
 * A GraphQL document is only valid if all `...Fragment` fragment spreads refer
 * to fragments defined in the same document.
 *
 * See https://spec.graphql.org/draft/#sec-Fragment-spread-target-defined
 */
function KnownFragmentNamesRule(context) {
  return {
    FragmentSpread(node) {
      const fragmentName = node.name.value;
      const fragment = context.getFragment(fragmentName);

      if (!fragment) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Unknown fragment "${fragmentName}".`,
            node.name,
          ),
        );
      }
    },
  };
}

},{"../../error/GraphQLError.js":35}],123:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.KnownTypeNamesRule = KnownTypeNamesRule;

var _didYouMean = require('../../jsutils/didYouMean.js');

var _suggestionList = require('../../jsutils/suggestionList.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _predicates = require('../../language/predicates.js');

var _scalars = require('../../type/scalars.js');

var _introspection = require('../../type/introspection.js');

/**
 * Known type names
 *
 * A GraphQL document is only valid if referenced types (specifically
 * variable definitions and fragment conditions) are defined by the type schema.
 *
 * See https://spec.graphql.org/draft/#sec-Fragment-Spread-Type-Existence
 */
function KnownTypeNamesRule(context) {
  const schema = context.getSchema();
  const existingTypesMap = schema ? schema.getTypeMap() : Object.create(null);
  const definedTypes = Object.create(null);

  for (const def of context.getDocument().definitions) {
    if ((0, _predicates.isTypeDefinitionNode)(def)) {
      definedTypes[def.name.value] = true;
    }
  }

  const typeNames = [
    ...Object.keys(existingTypesMap),
    ...Object.keys(definedTypes),
  ];
  return {
    NamedType(node, _1, parent, _2, ancestors) {
      const typeName = node.name.value;

      if (!existingTypesMap[typeName] && !definedTypes[typeName]) {
        var _ancestors$;

        const definitionNode =
          (_ancestors$ = ancestors[2]) !== null && _ancestors$ !== void 0
            ? _ancestors$
            : parent;
        const isSDL = definitionNode != null && isSDLNode(definitionNode);

        if (isSDL && standardTypeNames.includes(typeName)) {
          return;
        }

        const suggestedTypes = (0, _suggestionList.suggestionList)(
          typeName,
          isSDL ? standardTypeNames.concat(typeNames) : typeNames,
        );
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Unknown type "${typeName}".` +
              (0, _didYouMean.didYouMean)(suggestedTypes),
            node,
          ),
        );
      }
    },
  };
}

const standardTypeNames = [
  ..._scalars.specifiedScalarTypes,
  ..._introspection.introspectionTypes,
].map((type) => type.name);

function isSDLNode(value) {
  return (
    'kind' in value &&
    ((0, _predicates.isTypeSystemDefinitionNode)(value) ||
      (0, _predicates.isTypeSystemExtensionNode)(value))
  );
}

},{"../../error/GraphQLError.js":35,"../../jsutils/didYouMean.js":49,"../../jsutils/suggestionList.js":67,"../../language/predicates.js":78,"../../type/introspection.js":89,"../../type/scalars.js":90}],124:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.LoneAnonymousOperationRule = LoneAnonymousOperationRule;

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

/**
 * Lone anonymous operation
 *
 * A GraphQL document is only valid if when it contains an anonymous operation
 * (the query short-hand) that it contains only that one operation definition.
 *
 * See https://spec.graphql.org/draft/#sec-Lone-Anonymous-Operation
 */
function LoneAnonymousOperationRule(context) {
  let operationCount = 0;
  return {
    Document(node) {
      operationCount = node.definitions.filter(
        (definition) => definition.kind === _kinds.Kind.OPERATION_DEFINITION,
      ).length;
    },

    OperationDefinition(node) {
      if (!node.name && operationCount > 1) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            'This anonymous operation must be the only defined operation.',
            node,
          ),
        );
      }
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../language/kinds.js":74}],125:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.LoneSchemaDefinitionRule = LoneSchemaDefinitionRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Lone Schema definition
 *
 * A GraphQL document is only valid if it contains only one schema definition.
 */
function LoneSchemaDefinitionRule(context) {
  var _ref, _ref2, _oldSchema$astNode;

  const oldSchema = context.getSchema();
  const alreadyDefined =
    (_ref =
      (_ref2 =
        (_oldSchema$astNode =
          oldSchema === null || oldSchema === void 0
            ? void 0
            : oldSchema.astNode) !== null && _oldSchema$astNode !== void 0
          ? _oldSchema$astNode
          : oldSchema === null || oldSchema === void 0
          ? void 0
          : oldSchema.getQueryType()) !== null && _ref2 !== void 0
        ? _ref2
        : oldSchema === null || oldSchema === void 0
        ? void 0
        : oldSchema.getMutationType()) !== null && _ref !== void 0
      ? _ref
      : oldSchema === null || oldSchema === void 0
      ? void 0
      : oldSchema.getSubscriptionType();
  let schemaDefinitionsCount = 0;
  return {
    SchemaDefinition(node) {
      if (alreadyDefined) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            'Cannot define a new schema within a schema extension.',
            node,
          ),
        );
        return;
      }

      if (schemaDefinitionsCount > 0) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            'Must provide only one schema definition.',
            node,
          ),
        );
      }

      ++schemaDefinitionsCount;
    },
  };
}

},{"../../error/GraphQLError.js":35}],126:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.NoFragmentCyclesRule = NoFragmentCyclesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * No fragment cycles
 *
 * The graph of fragment spreads must not form any cycles including spreading itself.
 * Otherwise an operation could infinitely spread or infinitely execute on cycles in the underlying data.
 *
 * See https://spec.graphql.org/draft/#sec-Fragment-spreads-must-not-form-cycles
 */
function NoFragmentCyclesRule(context) {
  // Tracks already visited fragments to maintain O(N) and to ensure that cycles
  // are not redundantly reported.
  const visitedFrags = Object.create(null); // Array of AST nodes used to produce meaningful errors

  const spreadPath = []; // Position in the spread path

  const spreadPathIndexByName = Object.create(null);
  return {
    OperationDefinition: () => false,

    FragmentDefinition(node) {
      detectCycleRecursive(node);
      return false;
    },
  }; // This does a straight-forward DFS to find cycles.
  // It does not terminate when a cycle was found but continues to explore
  // the graph to find all possible cycles.

  function detectCycleRecursive(fragment) {
    if (visitedFrags[fragment.name.value]) {
      return;
    }

    const fragmentName = fragment.name.value;
    visitedFrags[fragmentName] = true;
    const spreadNodes = context.getFragmentSpreads(fragment.selectionSet);

    if (spreadNodes.length === 0) {
      return;
    }

    spreadPathIndexByName[fragmentName] = spreadPath.length;

    for (const spreadNode of spreadNodes) {
      const spreadName = spreadNode.name.value;
      const cycleIndex = spreadPathIndexByName[spreadName];
      spreadPath.push(spreadNode);

      if (cycleIndex === undefined) {
        const spreadFragment = context.getFragment(spreadName);

        if (spreadFragment) {
          detectCycleRecursive(spreadFragment);
        }
      } else {
        const cyclePath = spreadPath.slice(cycleIndex);
        const viaPath = cyclePath
          .slice(0, -1)
          .map((s) => '"' + s.name.value + '"')
          .join(', ');
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Cannot spread fragment "${spreadName}" within itself` +
              (viaPath !== '' ? ` via ${viaPath}.` : '.'),
            cyclePath,
          ),
        );
      }

      spreadPath.pop();
    }

    spreadPathIndexByName[fragmentName] = undefined;
  }
}

},{"../../error/GraphQLError.js":35}],127:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.NoUndefinedVariablesRule = NoUndefinedVariablesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * No undefined variables
 *
 * A GraphQL operation is only valid if all variables encountered, both directly
 * and via fragment spreads, are defined by that operation.
 *
 * See https://spec.graphql.org/draft/#sec-All-Variable-Uses-Defined
 */
function NoUndefinedVariablesRule(context) {
  let variableNameDefined = Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        variableNameDefined = Object.create(null);
      },

      leave(operation) {
        const usages = context.getRecursiveVariableUsages(operation);

        for (const { node } of usages) {
          const varName = node.name.value;

          if (variableNameDefined[varName] !== true) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                operation.name
                  ? `Variable "$${varName}" is not defined by operation "${operation.name.value}".`
                  : `Variable "$${varName}" is not defined.`,
                [node, operation],
              ),
            );
          }
        }
      },
    },

    VariableDefinition(node) {
      variableNameDefined[node.variable.name.value] = true;
    },
  };
}

},{"../../error/GraphQLError.js":35}],128:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.NoUnusedFragmentsRule = NoUnusedFragmentsRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * No unused fragments
 *
 * A GraphQL document is only valid if all fragment definitions are spread
 * within operations, or spread within other fragments spread within operations.
 *
 * See https://spec.graphql.org/draft/#sec-Fragments-Must-Be-Used
 */
function NoUnusedFragmentsRule(context) {
  const operationDefs = [];
  const fragmentDefs = [];
  return {
    OperationDefinition(node) {
      operationDefs.push(node);
      return false;
    },

    FragmentDefinition(node) {
      fragmentDefs.push(node);
      return false;
    },

    Document: {
      leave() {
        const fragmentNameUsed = Object.create(null);

        for (const operation of operationDefs) {
          for (const fragment of context.getRecursivelyReferencedFragments(
            operation,
          )) {
            fragmentNameUsed[fragment.name.value] = true;
          }
        }

        for (const fragmentDef of fragmentDefs) {
          const fragName = fragmentDef.name.value;

          if (fragmentNameUsed[fragName] !== true) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Fragment "${fragName}" is never used.`,
                fragmentDef,
              ),
            );
          }
        }
      },
    },
  };
}

},{"../../error/GraphQLError.js":35}],129:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.NoUnusedVariablesRule = NoUnusedVariablesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * No unused variables
 *
 * A GraphQL operation is only valid if all variables defined by an operation
 * are used, either directly or within a spread fragment.
 *
 * See https://spec.graphql.org/draft/#sec-All-Variables-Used
 */
function NoUnusedVariablesRule(context) {
  let variableDefs = [];
  return {
    OperationDefinition: {
      enter() {
        variableDefs = [];
      },

      leave(operation) {
        const variableNameUsed = Object.create(null);
        const usages = context.getRecursiveVariableUsages(operation);

        for (const { node } of usages) {
          variableNameUsed[node.name.value] = true;
        }

        for (const variableDef of variableDefs) {
          const variableName = variableDef.variable.name.value;

          if (variableNameUsed[variableName] !== true) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                operation.name
                  ? `Variable "$${variableName}" is never used in operation "${operation.name.value}".`
                  : `Variable "$${variableName}" is never used.`,
                variableDef,
              ),
            );
          }
        }
      },
    },

    VariableDefinition(def) {
      variableDefs.push(def);
    },
  };
}

},{"../../error/GraphQLError.js":35}],130:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.OverlappingFieldsCanBeMergedRule = OverlappingFieldsCanBeMergedRule;

var _inspect = require('../../jsutils/inspect.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _printer = require('../../language/printer.js');

var _definition = require('../../type/definition.js');

var _typeFromAST = require('../../utilities/typeFromAST.js');

function reasonMessage(reason) {
  if (Array.isArray(reason)) {
    return reason
      .map(
        ([responseName, subReason]) =>
          `subfields "${responseName}" conflict because ` +
          reasonMessage(subReason),
      )
      .join(' and ');
  }

  return reason;
}
/**
 * Overlapping fields can be merged
 *
 * A selection set is only valid if all fields (including spreading any
 * fragments) either correspond to distinct response names or can be merged
 * without ambiguity.
 *
 * See https://spec.graphql.org/draft/#sec-Field-Selection-Merging
 */

function OverlappingFieldsCanBeMergedRule(context) {
  // A memoization for when two fragments are compared "between" each other for
  // conflicts. Two fragments may be compared many times, so memoizing this can
  // dramatically improve the performance of this validator.
  const comparedFragmentPairs = new PairSet(); // A cache for the "field map" and list of fragment names found in any given
  // selection set. Selection sets may be asked for this information multiple
  // times, so this improves the performance of this validator.

  const cachedFieldsAndFragmentNames = new Map();
  return {
    SelectionSet(selectionSet) {
      const conflicts = findConflictsWithinSelectionSet(
        context,
        cachedFieldsAndFragmentNames,
        comparedFragmentPairs,
        context.getParentType(),
        selectionSet,
      );

      for (const [[responseName, reason], fields1, fields2] of conflicts) {
        const reasonMsg = reasonMessage(reason);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Fields "${responseName}" conflict because ${reasonMsg}. Use different aliases on the fields to fetch both if this was intentional.`,
            fields1.concat(fields2),
          ),
        );
      }
    },
  };
}

/**
 * Algorithm:
 *
 * Conflicts occur when two fields exist in a query which will produce the same
 * response name, but represent differing values, thus creating a conflict.
 * The algorithm below finds all conflicts via making a series of comparisons
 * between fields. In order to compare as few fields as possible, this makes
 * a series of comparisons "within" sets of fields and "between" sets of fields.
 *
 * Given any selection set, a collection produces both a set of fields by
 * also including all inline fragments, as well as a list of fragments
 * referenced by fragment spreads.
 *
 * A) Each selection set represented in the document first compares "within" its
 * collected set of fields, finding any conflicts between every pair of
 * overlapping fields.
 * Note: This is the *only time* that a the fields "within" a set are compared
 * to each other. After this only fields "between" sets are compared.
 *
 * B) Also, if any fragment is referenced in a selection set, then a
 * comparison is made "between" the original set of fields and the
 * referenced fragment.
 *
 * C) Also, if multiple fragments are referenced, then comparisons
 * are made "between" each referenced fragment.
 *
 * D) When comparing "between" a set of fields and a referenced fragment, first
 * a comparison is made between each field in the original set of fields and
 * each field in the the referenced set of fields.
 *
 * E) Also, if any fragment is referenced in the referenced selection set,
 * then a comparison is made "between" the original set of fields and the
 * referenced fragment (recursively referring to step D).
 *
 * F) When comparing "between" two fragments, first a comparison is made between
 * each field in the first referenced set of fields and each field in the the
 * second referenced set of fields.
 *
 * G) Also, any fragments referenced by the first must be compared to the
 * second, and any fragments referenced by the second must be compared to the
 * first (recursively referring to step F).
 *
 * H) When comparing two fields, if both have selection sets, then a comparison
 * is made "between" both selection sets, first comparing the set of fields in
 * the first selection set with the set of fields in the second.
 *
 * I) Also, if any fragment is referenced in either selection set, then a
 * comparison is made "between" the other set of fields and the
 * referenced fragment.
 *
 * J) Also, if two fragments are referenced in both selection sets, then a
 * comparison is made "between" the two fragments.
 *
 */
// Find all conflicts found "within" a selection set, including those found
// via spreading in fragments. Called when visiting each SelectionSet in the
// GraphQL Document.
function findConflictsWithinSelectionSet(
  context,
  cachedFieldsAndFragmentNames,
  comparedFragmentPairs,
  parentType,
  selectionSet,
) {
  const conflicts = [];
  const [fieldMap, fragmentNames] = getFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    parentType,
    selectionSet,
  ); // (A) Find find all conflicts "within" the fields of this selection set.
  // Note: this is the *only place* `collectConflictsWithin` is called.

  collectConflictsWithin(
    context,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFragmentPairs,
    fieldMap,
  );

  if (fragmentNames.length !== 0) {
    // (B) Then collect conflicts between these fields and those represented by
    // each spread fragment name found.
    for (let i = 0; i < fragmentNames.length; i++) {
      collectConflictsBetweenFieldsAndFragment(
        context,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFragmentPairs,
        false,
        fieldMap,
        fragmentNames[i],
      ); // (C) Then compare this fragment with all other fragments found in this
      // selection set to collect conflicts between fragments spread together.
      // This compares each item in the list of fragment names to every other
      // item in that same list (except for itself).

      for (let j = i + 1; j < fragmentNames.length; j++) {
        collectConflictsBetweenFragments(
          context,
          conflicts,
          cachedFieldsAndFragmentNames,
          comparedFragmentPairs,
          false,
          fragmentNames[i],
          fragmentNames[j],
        );
      }
    }
  }

  return conflicts;
} // Collect all conflicts found between a set of fields and a fragment reference
// including via spreading in any nested fragments.

function collectConflictsBetweenFieldsAndFragment(
  context,
  conflicts,
  cachedFieldsAndFragmentNames,
  comparedFragmentPairs,
  areMutuallyExclusive,
  fieldMap,
  fragmentName,
) {
  const fragment = context.getFragment(fragmentName);

  if (!fragment) {
    return;
  }

  const [fieldMap2, referencedFragmentNames] =
    getReferencedFieldsAndFragmentNames(
      context,
      cachedFieldsAndFragmentNames,
      fragment,
    ); // Do not compare a fragment's fieldMap to itself.

  if (fieldMap === fieldMap2) {
    return;
  } // (D) First collect any conflicts between the provided collection of fields
  // and the collection of fields represented by the given fragment.

  collectConflictsBetween(
    context,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap,
    fieldMap2,
  ); // (E) Then collect any conflicts between the provided collection of fields
  // and any fragment names found in the given fragment.

  for (const referencedFragmentName of referencedFragmentNames) {
    collectConflictsBetweenFieldsAndFragment(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap,
      referencedFragmentName,
    );
  }
} // Collect all conflicts found between two fragments, including via spreading in
// any nested fragments.

function collectConflictsBetweenFragments(
  context,
  conflicts,
  cachedFieldsAndFragmentNames,
  comparedFragmentPairs,
  areMutuallyExclusive,
  fragmentName1,
  fragmentName2,
) {
  // No need to compare a fragment to itself.
  if (fragmentName1 === fragmentName2) {
    return;
  } // Memoize so two fragments are not compared for conflicts more than once.

  if (
    comparedFragmentPairs.has(
      fragmentName1,
      fragmentName2,
      areMutuallyExclusive,
    )
  ) {
    return;
  }

  comparedFragmentPairs.add(fragmentName1, fragmentName2, areMutuallyExclusive);
  const fragment1 = context.getFragment(fragmentName1);
  const fragment2 = context.getFragment(fragmentName2);

  if (!fragment1 || !fragment2) {
    return;
  }

  const [fieldMap1, referencedFragmentNames1] =
    getReferencedFieldsAndFragmentNames(
      context,
      cachedFieldsAndFragmentNames,
      fragment1,
    );
  const [fieldMap2, referencedFragmentNames2] =
    getReferencedFieldsAndFragmentNames(
      context,
      cachedFieldsAndFragmentNames,
      fragment2,
    ); // (F) First, collect all conflicts between these two collections of fields
  // (not including any nested fragments).

  collectConflictsBetween(
    context,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap1,
    fieldMap2,
  ); // (G) Then collect conflicts between the first fragment and any nested
  // fragments spread in the second fragment.

  for (const referencedFragmentName2 of referencedFragmentNames2) {
    collectConflictsBetweenFragments(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fragmentName1,
      referencedFragmentName2,
    );
  } // (G) Then collect conflicts between the second fragment and any nested
  // fragments spread in the first fragment.

  for (const referencedFragmentName1 of referencedFragmentNames1) {
    collectConflictsBetweenFragments(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFragmentPairs,
      areMutuallyExclusive,
      referencedFragmentName1,
      fragmentName2,
    );
  }
} // Find all conflicts found between two selection sets, including those found
// via spreading in fragments. Called when determining if conflicts exist
// between the sub-fields of two overlapping fields.

function findConflictsBetweenSubSelectionSets(
  context,
  cachedFieldsAndFragmentNames,
  comparedFragmentPairs,
  areMutuallyExclusive,
  parentType1,
  selectionSet1,
  parentType2,
  selectionSet2,
) {
  const conflicts = [];
  const [fieldMap1, fragmentNames1] = getFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    parentType1,
    selectionSet1,
  );
  const [fieldMap2, fragmentNames2] = getFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    parentType2,
    selectionSet2,
  ); // (H) First, collect all conflicts between these two collections of field.

  collectConflictsBetween(
    context,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap1,
    fieldMap2,
  ); // (I) Then collect conflicts between the first collection of fields and
  // those referenced by each fragment name associated with the second.

  for (const fragmentName2 of fragmentNames2) {
    collectConflictsBetweenFieldsAndFragment(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap1,
      fragmentName2,
    );
  } // (I) Then collect conflicts between the second collection of fields and
  // those referenced by each fragment name associated with the first.

  for (const fragmentName1 of fragmentNames1) {
    collectConflictsBetweenFieldsAndFragment(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap2,
      fragmentName1,
    );
  } // (J) Also collect conflicts between any fragment names by the first and
  // fragment names by the second. This compares each item in the first set of
  // names to each item in the second set of names.

  for (const fragmentName1 of fragmentNames1) {
    for (const fragmentName2 of fragmentNames2) {
      collectConflictsBetweenFragments(
        context,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFragmentPairs,
        areMutuallyExclusive,
        fragmentName1,
        fragmentName2,
      );
    }
  }

  return conflicts;
} // Collect all Conflicts "within" one collection of fields.

function collectConflictsWithin(
  context,
  conflicts,
  cachedFieldsAndFragmentNames,
  comparedFragmentPairs,
  fieldMap,
) {
  // A field map is a keyed collection, where each key represents a response
  // name and the value at that key is a list of all fields which provide that
  // response name. For every response name, if there are multiple fields, they
  // must be compared to find a potential conflict.
  for (const [responseName, fields] of Object.entries(fieldMap)) {
    // This compares every field in the list to every other field in this list
    // (except to itself). If the list only has one item, nothing needs to
    // be compared.
    if (fields.length > 1) {
      for (let i = 0; i < fields.length; i++) {
        for (let j = i + 1; j < fields.length; j++) {
          const conflict = findConflict(
            context,
            cachedFieldsAndFragmentNames,
            comparedFragmentPairs,
            false, // within one collection is never mutually exclusive
            responseName,
            fields[i],
            fields[j],
          );

          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  }
} // Collect all Conflicts between two collections of fields. This is similar to,
// but different from the `collectConflictsWithin` function above. This check
// assumes that `collectConflictsWithin` has already been called on each
// provided collection of fields. This is true because this validator traverses
// each individual selection set.

function collectConflictsBetween(
  context,
  conflicts,
  cachedFieldsAndFragmentNames,
  comparedFragmentPairs,
  parentFieldsAreMutuallyExclusive,
  fieldMap1,
  fieldMap2,
) {
  // A field map is a keyed collection, where each key represents a response
  // name and the value at that key is a list of all fields which provide that
  // response name. For any response name which appears in both provided field
  // maps, each field from the first field map must be compared to every field
  // in the second field map to find potential conflicts.
  for (const [responseName, fields1] of Object.entries(fieldMap1)) {
    const fields2 = fieldMap2[responseName];

    if (fields2) {
      for (const field1 of fields1) {
        for (const field2 of fields2) {
          const conflict = findConflict(
            context,
            cachedFieldsAndFragmentNames,
            comparedFragmentPairs,
            parentFieldsAreMutuallyExclusive,
            responseName,
            field1,
            field2,
          );

          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  }
} // Determines if there is a conflict between two particular fields, including
// comparing their sub-fields.

function findConflict(
  context,
  cachedFieldsAndFragmentNames,
  comparedFragmentPairs,
  parentFieldsAreMutuallyExclusive,
  responseName,
  field1,
  field2,
) {
  const [parentType1, node1, def1] = field1;
  const [parentType2, node2, def2] = field2; // If it is known that two fields could not possibly apply at the same
  // time, due to the parent types, then it is safe to permit them to diverge
  // in aliased field or arguments used as they will not present any ambiguity
  // by differing.
  // It is known that two parent types could never overlap if they are
  // different Object types. Interface or Union types might overlap - if not
  // in the current state of the schema, then perhaps in some future version,
  // thus may not safely diverge.

  const areMutuallyExclusive =
    parentFieldsAreMutuallyExclusive ||
    (parentType1 !== parentType2 &&
      (0, _definition.isObjectType)(parentType1) &&
      (0, _definition.isObjectType)(parentType2));

  if (!areMutuallyExclusive) {
    var _node1$arguments, _node2$arguments;

    // Two aliases must refer to the same field.
    const name1 = node1.name.value;
    const name2 = node2.name.value;

    if (name1 !== name2) {
      return [
        [responseName, `"${name1}" and "${name2}" are different fields`],
        [node1],
        [node2],
      ];
    } // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

    const args1 =
      (_node1$arguments = node1.arguments) !== null &&
      _node1$arguments !== void 0
        ? _node1$arguments
        : []; // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

    const args2 =
      (_node2$arguments = node2.arguments) !== null &&
      _node2$arguments !== void 0
        ? _node2$arguments
        : []; // Two field calls must have the same arguments.

    if (!sameArguments(args1, args2)) {
      return [
        [responseName, 'they have differing arguments'],
        [node1],
        [node2],
      ];
    }
  } // The return type for each field.

  const type1 = def1 === null || def1 === void 0 ? void 0 : def1.type;
  const type2 = def2 === null || def2 === void 0 ? void 0 : def2.type;

  if (type1 && type2 && doTypesConflict(type1, type2)) {
    return [
      [
        responseName,
        `they return conflicting types "${(0, _inspect.inspect)(
          type1,
        )}" and "${(0, _inspect.inspect)(type2)}"`,
      ],
      [node1],
      [node2],
    ];
  } // Collect and compare sub-fields. Use the same "visited fragment names" list
  // for both collections so fields in a fragment reference are never
  // compared to themselves.

  const selectionSet1 = node1.selectionSet;
  const selectionSet2 = node2.selectionSet;

  if (selectionSet1 && selectionSet2) {
    const conflicts = findConflictsBetweenSubSelectionSets(
      context,
      cachedFieldsAndFragmentNames,
      comparedFragmentPairs,
      areMutuallyExclusive,
      (0, _definition.getNamedType)(type1),
      selectionSet1,
      (0, _definition.getNamedType)(type2),
      selectionSet2,
    );
    return subfieldConflicts(conflicts, responseName, node1, node2);
  }
}

function sameArguments(arguments1, arguments2) {
  if (arguments1.length !== arguments2.length) {
    return false;
  }

  return arguments1.every((argument1) => {
    const argument2 = arguments2.find(
      (argument) => argument.name.value === argument1.name.value,
    );

    if (!argument2) {
      return false;
    }

    return sameValue(argument1.value, argument2.value);
  });
}

function sameValue(value1, value2) {
  return (0, _printer.print)(value1) === (0, _printer.print)(value2);
} // Two types conflict if both types could not apply to a value simultaneously.
// Composite types are ignored as their individual field types will be compared
// later recursively. However List and Non-Null types must match.

function doTypesConflict(type1, type2) {
  if ((0, _definition.isListType)(type1)) {
    return (0, _definition.isListType)(type2)
      ? doTypesConflict(type1.ofType, type2.ofType)
      : true;
  }

  if ((0, _definition.isListType)(type2)) {
    return true;
  }

  if ((0, _definition.isNonNullType)(type1)) {
    return (0, _definition.isNonNullType)(type2)
      ? doTypesConflict(type1.ofType, type2.ofType)
      : true;
  }

  if ((0, _definition.isNonNullType)(type2)) {
    return true;
  }

  if (
    (0, _definition.isLeafType)(type1) ||
    (0, _definition.isLeafType)(type2)
  ) {
    return type1 !== type2;
  }

  return false;
} // Given a selection set, return the collection of fields (a mapping of response
// name to field nodes and definitions) as well as a list of fragment names
// referenced via fragment spreads.

function getFieldsAndFragmentNames(
  context,
  cachedFieldsAndFragmentNames,
  parentType,
  selectionSet,
) {
  const cached = cachedFieldsAndFragmentNames.get(selectionSet);

  if (cached) {
    return cached;
  }

  const nodeAndDefs = Object.create(null);
  const fragmentNames = Object.create(null);

  _collectFieldsAndFragmentNames(
    context,
    parentType,
    selectionSet,
    nodeAndDefs,
    fragmentNames,
  );

  const result = [nodeAndDefs, Object.keys(fragmentNames)];
  cachedFieldsAndFragmentNames.set(selectionSet, result);
  return result;
} // Given a reference to a fragment, return the represented collection of fields
// as well as a list of nested fragment names referenced via fragment spreads.

function getReferencedFieldsAndFragmentNames(
  context,
  cachedFieldsAndFragmentNames,
  fragment,
) {
  // Short-circuit building a type from the node if possible.
  const cached = cachedFieldsAndFragmentNames.get(fragment.selectionSet);

  if (cached) {
    return cached;
  }

  const fragmentType = (0, _typeFromAST.typeFromAST)(
    context.getSchema(),
    fragment.typeCondition,
  );
  return getFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    fragmentType,
    fragment.selectionSet,
  );
}

function _collectFieldsAndFragmentNames(
  context,
  parentType,
  selectionSet,
  nodeAndDefs,
  fragmentNames,
) {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case _kinds.Kind.FIELD: {
        const fieldName = selection.name.value;
        let fieldDef;

        if (
          (0, _definition.isObjectType)(parentType) ||
          (0, _definition.isInterfaceType)(parentType)
        ) {
          fieldDef = parentType.getFields()[fieldName];
        }

        const responseName = selection.alias
          ? selection.alias.value
          : fieldName;

        if (!nodeAndDefs[responseName]) {
          nodeAndDefs[responseName] = [];
        }

        nodeAndDefs[responseName].push([parentType, selection, fieldDef]);
        break;
      }

      case _kinds.Kind.FRAGMENT_SPREAD:
        fragmentNames[selection.name.value] = true;
        break;

      case _kinds.Kind.INLINE_FRAGMENT: {
        const typeCondition = selection.typeCondition;
        const inlineFragmentType = typeCondition
          ? (0, _typeFromAST.typeFromAST)(context.getSchema(), typeCondition)
          : parentType;

        _collectFieldsAndFragmentNames(
          context,
          inlineFragmentType,
          selection.selectionSet,
          nodeAndDefs,
          fragmentNames,
        );

        break;
      }
    }
  }
} // Given a series of Conflicts which occurred between two sub-fields, generate
// a single Conflict.

function subfieldConflicts(conflicts, responseName, node1, node2) {
  if (conflicts.length > 0) {
    return [
      [responseName, conflicts.map(([reason]) => reason)],
      [node1, ...conflicts.map(([, fields1]) => fields1).flat()],
      [node2, ...conflicts.map(([, , fields2]) => fields2).flat()],
    ];
  }
}
/**
 * A way to keep track of pairs of things when the ordering of the pair does not matter.
 */

class PairSet {
  constructor() {
    this._data = new Map();
  }

  has(a, b, areMutuallyExclusive) {
    var _this$_data$get;

    const [key1, key2] = a < b ? [a, b] : [b, a];
    const result =
      (_this$_data$get = this._data.get(key1)) === null ||
      _this$_data$get === void 0
        ? void 0
        : _this$_data$get.get(key2);

    if (result === undefined) {
      return false;
    } // areMutuallyExclusive being false is a superset of being true, hence if
    // we want to know if this PairSet "has" these two with no exclusivity,
    // we have to ensure it was added as such.

    return areMutuallyExclusive ? true : areMutuallyExclusive === result;
  }

  add(a, b, areMutuallyExclusive) {
    const [key1, key2] = a < b ? [a, b] : [b, a];

    const map = this._data.get(key1);

    if (map === undefined) {
      this._data.set(key1, new Map([[key2, areMutuallyExclusive]]));
    } else {
      map.set(key2, areMutuallyExclusive);
    }
  }
}

},{"../../error/GraphQLError.js":35,"../../jsutils/inspect.js":52,"../../language/kinds.js":74,"../../language/printer.js":81,"../../type/definition.js":86,"../../utilities/typeFromAST.js":112}],131:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.PossibleFragmentSpreadsRule = PossibleFragmentSpreadsRule;

var _inspect = require('../../jsutils/inspect.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _definition = require('../../type/definition.js');

var _typeFromAST = require('../../utilities/typeFromAST.js');

var _typeComparators = require('../../utilities/typeComparators.js');

/**
 * Possible fragment spread
 *
 * A fragment spread is only valid if the type condition could ever possibly
 * be true: if there is a non-empty intersection of the possible parent types,
 * and possible types which pass the type condition.
 */
function PossibleFragmentSpreadsRule(context) {
  return {
    InlineFragment(node) {
      const fragType = context.getType();
      const parentType = context.getParentType();

      if (
        (0, _definition.isCompositeType)(fragType) &&
        (0, _definition.isCompositeType)(parentType) &&
        !(0, _typeComparators.doTypesOverlap)(
          context.getSchema(),
          fragType,
          parentType,
        )
      ) {
        const parentTypeStr = (0, _inspect.inspect)(parentType);
        const fragTypeStr = (0, _inspect.inspect)(fragType);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Fragment cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`,
            node,
          ),
        );
      }
    },

    FragmentSpread(node) {
      const fragName = node.name.value;
      const fragType = getFragmentType(context, fragName);
      const parentType = context.getParentType();

      if (
        fragType &&
        parentType &&
        !(0, _typeComparators.doTypesOverlap)(
          context.getSchema(),
          fragType,
          parentType,
        )
      ) {
        const parentTypeStr = (0, _inspect.inspect)(parentType);
        const fragTypeStr = (0, _inspect.inspect)(fragType);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Fragment "${fragName}" cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`,
            node,
          ),
        );
      }
    },
  };
}

function getFragmentType(context, name) {
  const frag = context.getFragment(name);

  if (frag) {
    const type = (0, _typeFromAST.typeFromAST)(
      context.getSchema(),
      frag.typeCondition,
    );

    if ((0, _definition.isCompositeType)(type)) {
      return type;
    }
  }
}

},{"../../error/GraphQLError.js":35,"../../jsutils/inspect.js":52,"../../type/definition.js":86,"../../utilities/typeComparators.js":111,"../../utilities/typeFromAST.js":112}],132:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.PossibleTypeExtensionsRule = PossibleTypeExtensionsRule;

var _inspect = require('../../jsutils/inspect.js');

var _invariant = require('../../jsutils/invariant.js');

var _didYouMean = require('../../jsutils/didYouMean.js');

var _suggestionList = require('../../jsutils/suggestionList.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _predicates = require('../../language/predicates.js');

var _definition = require('../../type/definition.js');

/**
 * Possible type extension
 *
 * A type extension is only valid if the type is defined and has the same kind.
 */
function PossibleTypeExtensionsRule(context) {
  const schema = context.getSchema();
  const definedTypes = Object.create(null);

  for (const def of context.getDocument().definitions) {
    if ((0, _predicates.isTypeDefinitionNode)(def)) {
      definedTypes[def.name.value] = def;
    }
  }

  return {
    ScalarTypeExtension: checkExtension,
    ObjectTypeExtension: checkExtension,
    InterfaceTypeExtension: checkExtension,
    UnionTypeExtension: checkExtension,
    EnumTypeExtension: checkExtension,
    InputObjectTypeExtension: checkExtension,
  };

  function checkExtension(node) {
    const typeName = node.name.value;
    const defNode = definedTypes[typeName];
    const existingType =
      schema === null || schema === void 0 ? void 0 : schema.getType(typeName);
    let expectedKind;

    if (defNode) {
      expectedKind = defKindToExtKind[defNode.kind];
    } else if (existingType) {
      expectedKind = typeToExtKind(existingType);
    }

    if (expectedKind) {
      if (expectedKind !== node.kind) {
        const kindStr = extensionKindToTypeName(node.kind);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Cannot extend non-${kindStr} type "${typeName}".`,
            defNode ? [defNode, node] : node,
          ),
        );
      }
    } else {
      const allTypeNames = Object.keys({
        ...definedTypes,
        ...(schema === null || schema === void 0
          ? void 0
          : schema.getTypeMap()),
      });
      const suggestedTypes = (0, _suggestionList.suggestionList)(
        typeName,
        allTypeNames,
      );
      context.reportError(
        new _GraphQLError.GraphQLError(
          `Cannot extend type "${typeName}" because it is not defined.` +
            (0, _didYouMean.didYouMean)(suggestedTypes),
          node.name,
        ),
      );
    }
  }
}

const defKindToExtKind = {
  [_kinds.Kind.SCALAR_TYPE_DEFINITION]: _kinds.Kind.SCALAR_TYPE_EXTENSION,
  [_kinds.Kind.OBJECT_TYPE_DEFINITION]: _kinds.Kind.OBJECT_TYPE_EXTENSION,
  [_kinds.Kind.INTERFACE_TYPE_DEFINITION]: _kinds.Kind.INTERFACE_TYPE_EXTENSION,
  [_kinds.Kind.UNION_TYPE_DEFINITION]: _kinds.Kind.UNION_TYPE_EXTENSION,
  [_kinds.Kind.ENUM_TYPE_DEFINITION]: _kinds.Kind.ENUM_TYPE_EXTENSION,
  [_kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION]:
    _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION,
};

function typeToExtKind(type) {
  if ((0, _definition.isScalarType)(type)) {
    return _kinds.Kind.SCALAR_TYPE_EXTENSION;
  }

  if ((0, _definition.isObjectType)(type)) {
    return _kinds.Kind.OBJECT_TYPE_EXTENSION;
  }

  if ((0, _definition.isInterfaceType)(type)) {
    return _kinds.Kind.INTERFACE_TYPE_EXTENSION;
  }

  if ((0, _definition.isUnionType)(type)) {
    return _kinds.Kind.UNION_TYPE_EXTENSION;
  }

  if ((0, _definition.isEnumType)(type)) {
    return _kinds.Kind.ENUM_TYPE_EXTENSION;
  } // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')

  if ((0, _definition.isInputObjectType)(type)) {
    return _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION;
  } // istanbul ignore next (Not reachable. All possible types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected type: ' + (0, _inspect.inspect)(type),
    );
}

function extensionKindToTypeName(kind) {
  switch (kind) {
    case _kinds.Kind.SCALAR_TYPE_EXTENSION:
      return 'scalar';

    case _kinds.Kind.OBJECT_TYPE_EXTENSION:
      return 'object';

    case _kinds.Kind.INTERFACE_TYPE_EXTENSION:
      return 'interface';

    case _kinds.Kind.UNION_TYPE_EXTENSION:
      return 'union';

    case _kinds.Kind.ENUM_TYPE_EXTENSION:
      return 'enum';

    case _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return 'input object';
  } // istanbul ignore next (Not reachable. All possible types have been considered)

  false ||
    (0, _invariant.invariant)(
      false,
      'Unexpected kind: ' + (0, _inspect.inspect)(kind),
    );
}

},{"../../error/GraphQLError.js":35,"../../jsutils/didYouMean.js":49,"../../jsutils/inspect.js":52,"../../jsutils/invariant.js":54,"../../jsutils/suggestionList.js":67,"../../language/kinds.js":74,"../../language/predicates.js":78,"../../type/definition.js":86}],133:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ProvidedRequiredArgumentsOnDirectivesRule =
  ProvidedRequiredArgumentsOnDirectivesRule;
exports.ProvidedRequiredArgumentsRule = ProvidedRequiredArgumentsRule;

var _inspect = require('../../jsutils/inspect.js');

var _keyMap = require('../../jsutils/keyMap.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _printer = require('../../language/printer.js');

var _directives = require('../../type/directives.js');

var _definition = require('../../type/definition.js');

/**
 * Provided required arguments
 *
 * A field or directive is only valid if all required (non-null without a
 * default value) field arguments have been provided.
 */
function ProvidedRequiredArgumentsRule(context) {
  return {
    // eslint-disable-next-line new-cap
    ...ProvidedRequiredArgumentsOnDirectivesRule(context),
    Field: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(fieldNode) {
        var _fieldNode$arguments;

        const fieldDef = context.getFieldDef();

        if (!fieldDef) {
          return false;
        }

        const providedArgs = new Set( // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
          (_fieldNode$arguments = fieldNode.arguments) === null ||
          _fieldNode$arguments === void 0
            ? void 0
            : _fieldNode$arguments.map((arg) => arg.name.value),
        );

        for (const argDef of fieldDef.args) {
          if (
            !providedArgs.has(argDef.name) &&
            (0, _definition.isRequiredArgument)(argDef)
          ) {
            const argTypeStr = (0, _inspect.inspect)(argDef.type);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Field "${fieldDef.name}" argument "${argDef.name}" of type "${argTypeStr}" is required, but it was not provided.`,
                fieldNode,
              ),
            );
          }
        }
      },
    },
  };
}
/**
 * @internal
 */

function ProvidedRequiredArgumentsOnDirectivesRule(context) {
  var _schema$getDirectives;

  const requiredArgsMap = Object.create(null);
  const schema = context.getSchema();
  const definedDirectives =
    (_schema$getDirectives =
      schema === null || schema === void 0
        ? void 0
        : schema.getDirectives()) !== null && _schema$getDirectives !== void 0
      ? _schema$getDirectives
      : _directives.specifiedDirectives;

  for (const directive of definedDirectives) {
    requiredArgsMap[directive.name] = (0, _keyMap.keyMap)(
      directive.args.filter(_definition.isRequiredArgument),
      (arg) => arg.name,
    );
  }

  const astDefinitions = context.getDocument().definitions;

  for (const def of astDefinitions) {
    if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
      var _def$arguments;

      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      const argNodes =
        (_def$arguments = def.arguments) !== null && _def$arguments !== void 0
          ? _def$arguments
          : [];
      requiredArgsMap[def.name.value] = (0, _keyMap.keyMap)(
        argNodes.filter(isRequiredArgumentNode),
        (arg) => arg.name.value,
      );
    }
  }

  return {
    Directive: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(directiveNode) {
        const directiveName = directiveNode.name.value;
        const requiredArgs = requiredArgsMap[directiveName];

        if (requiredArgs) {
          var _directiveNode$argume;

          // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
          const argNodes =
            (_directiveNode$argume = directiveNode.arguments) !== null &&
            _directiveNode$argume !== void 0
              ? _directiveNode$argume
              : [];
          const argNodeMap = new Set(argNodes.map((arg) => arg.name.value));

          for (const [argName, argDef] of Object.entries(requiredArgs)) {
            if (!argNodeMap.has(argName)) {
              const argType = (0, _definition.isType)(argDef.type)
                ? (0, _inspect.inspect)(argDef.type)
                : (0, _printer.print)(argDef.type);
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Directive "@${directiveName}" argument "${argName}" of type "${argType}" is required, but it was not provided.`,
                  directiveNode,
                ),
              );
            }
          }
        }
      },
    },
  };
}

function isRequiredArgumentNode(arg) {
  return (
    arg.type.kind === _kinds.Kind.NON_NULL_TYPE && arg.defaultValue == null
  );
}

},{"../../error/GraphQLError.js":35,"../../jsutils/inspect.js":52,"../../jsutils/keyMap.js":59,"../../language/kinds.js":74,"../../language/printer.js":81,"../../type/definition.js":86,"../../type/directives.js":87}],134:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ScalarLeafsRule = ScalarLeafsRule;

var _inspect = require('../../jsutils/inspect.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _definition = require('../../type/definition.js');

/**
 * Scalar leafs
 *
 * A GraphQL document is valid only if all leaf fields (fields without
 * sub selections) are of scalar or enum types.
 */
function ScalarLeafsRule(context) {
  return {
    Field(node) {
      const type = context.getType();
      const selectionSet = node.selectionSet;

      if (type) {
        if ((0, _definition.isLeafType)((0, _definition.getNamedType)(type))) {
          if (selectionSet) {
            const fieldName = node.name.value;
            const typeStr = (0, _inspect.inspect)(type);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Field "${fieldName}" must not have a selection since type "${typeStr}" has no subfields.`,
                selectionSet,
              ),
            );
          }
        } else if (!selectionSet) {
          const fieldName = node.name.value;
          const typeStr = (0, _inspect.inspect)(type);
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Field "${fieldName}" of type "${typeStr}" must have a selection of subfields. Did you mean "${fieldName} { ... }"?`,
              node,
            ),
          );
        }
      }
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../jsutils/inspect.js":52,"../../type/definition.js":86}],135:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.SingleFieldSubscriptionsRule = SingleFieldSubscriptionsRule;

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _collectFields = require('../../execution/collectFields.js');

/**
 * Subscriptions must only include a non-introspection field.
 *
 * A GraphQL subscription is valid only if it contains a single root field and
 * that root field is not an introspection field.
 *
 * See https://spec.graphql.org/draft/#sec-Single-root-field
 */
function SingleFieldSubscriptionsRule(context) {
  return {
    OperationDefinition(node) {
      if (node.operation === 'subscription') {
        const schema = context.getSchema();
        const subscriptionType = schema.getSubscriptionType();

        if (subscriptionType) {
          const operationName = node.name ? node.name.value : null;
          const variableValues = Object.create(null);
          const document = context.getDocument();
          const fragments = Object.create(null);

          for (const definition of document.definitions) {
            if (definition.kind === _kinds.Kind.FRAGMENT_DEFINITION) {
              fragments[definition.name.value] = definition;
            }
          }

          const fields = (0, _collectFields.collectFields)(
            schema,
            fragments,
            variableValues,
            subscriptionType,
            node.selectionSet,
          );

          if (fields.size > 1) {
            const fieldSelectionLists = [...fields.values()];
            const extraFieldSelectionLists = fieldSelectionLists.slice(1);
            const extraFieldSelections = extraFieldSelectionLists.flat();
            context.reportError(
              new _GraphQLError.GraphQLError(
                operationName != null
                  ? `Subscription "${operationName}" must select only one top level field.`
                  : 'Anonymous Subscription must select only one top level field.',
                extraFieldSelections,
              ),
            );
          }

          for (const fieldNodes of fields.values()) {
            const field = fieldNodes[0];
            const fieldName = field.name.value;

            if (fieldName.startsWith('__')) {
              context.reportError(
                new _GraphQLError.GraphQLError(
                  operationName != null
                    ? `Subscription "${operationName}" must not select an introspection top level field.`
                    : 'Anonymous Subscription must not select an introspection top level field.',
                  fieldNodes,
                ),
              );
            }
          }
        }
      }
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../execution/collectFields.js":39,"../../language/kinds.js":74}],136:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueArgumentDefinitionNamesRule = UniqueArgumentDefinitionNamesRule;

var _groupBy = require('../../jsutils/groupBy.js');

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique argument definition names
 *
 * A GraphQL Object or Interface type is only valid if all its fields have uniquely named arguments.
 * A GraphQL Directive is only valid if all its arguments are uniquely named.
 */
function UniqueArgumentDefinitionNamesRule(context) {
  return {
    DirectiveDefinition(directiveNode) {
      var _directiveNode$argume;

      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      const argumentNodes =
        (_directiveNode$argume = directiveNode.arguments) !== null &&
        _directiveNode$argume !== void 0
          ? _directiveNode$argume
          : [];
      return checkArgUniqueness(`@${directiveNode.name.value}`, argumentNodes);
    },

    InterfaceTypeDefinition: checkArgUniquenessPerField,
    InterfaceTypeExtension: checkArgUniquenessPerField,
    ObjectTypeDefinition: checkArgUniquenessPerField,
    ObjectTypeExtension: checkArgUniquenessPerField,
  };

  function checkArgUniquenessPerField(typeNode) {
    var _typeNode$fields;

    const typeName = typeNode.name.value; // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

    const fieldNodes =
      (_typeNode$fields = typeNode.fields) !== null &&
      _typeNode$fields !== void 0
        ? _typeNode$fields
        : [];

    for (const fieldDef of fieldNodes) {
      var _fieldDef$arguments;

      const fieldName = fieldDef.name.value; // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

      const argumentNodes =
        (_fieldDef$arguments = fieldDef.arguments) !== null &&
        _fieldDef$arguments !== void 0
          ? _fieldDef$arguments
          : [];
      checkArgUniqueness(`${typeName}.${fieldName}`, argumentNodes);
    }

    return false;
  }

  function checkArgUniqueness(parentName, argumentNodes) {
    const seenArgs = (0, _groupBy.groupBy)(
      argumentNodes,
      (arg) => arg.name.value,
    );

    for (const [argName, argNodes] of seenArgs) {
      if (argNodes.length > 1) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Argument "${parentName}(${argName}:)" can only be defined once.`,
            argNodes.map((node) => node.name),
          ),
        );
      }
    }

    return false;
  }
}

},{"../../error/GraphQLError.js":35,"../../jsutils/groupBy.js":50}],137:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueArgumentNamesRule = UniqueArgumentNamesRule;

var _groupBy = require('../../jsutils/groupBy.js');

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique argument names
 *
 * A GraphQL field or directive is only valid if all supplied arguments are
 * uniquely named.
 *
 * See https://spec.graphql.org/draft/#sec-Argument-Names
 */
function UniqueArgumentNamesRule(context) {
  return {
    Field: checkArgUniqueness,
    Directive: checkArgUniqueness,
  };

  function checkArgUniqueness(parentNode) {
    var _parentNode$arguments;

    // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
    const argumentNodes =
      (_parentNode$arguments = parentNode.arguments) !== null &&
      _parentNode$arguments !== void 0
        ? _parentNode$arguments
        : [];
    const seenArgs = (0, _groupBy.groupBy)(
      argumentNodes,
      (arg) => arg.name.value,
    );

    for (const [argName, argNodes] of seenArgs) {
      if (argNodes.length > 1) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `There can be only one argument named "${argName}".`,
            argNodes.map((node) => node.name),
          ),
        );
      }
    }
  }
}

},{"../../error/GraphQLError.js":35,"../../jsutils/groupBy.js":50}],138:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueDirectiveNamesRule = UniqueDirectiveNamesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique directive names
 *
 * A GraphQL document is only valid if all defined directives have unique names.
 */
function UniqueDirectiveNamesRule(context) {
  const knownDirectiveNames = Object.create(null);
  const schema = context.getSchema();
  return {
    DirectiveDefinition(node) {
      const directiveName = node.name.value;

      if (
        schema !== null &&
        schema !== void 0 &&
        schema.getDirective(directiveName)
      ) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Directive "@${directiveName}" already exists in the schema. It cannot be redefined.`,
            node.name,
          ),
        );
        return;
      }

      if (knownDirectiveNames[directiveName]) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `There can be only one directive named "@${directiveName}".`,
            [knownDirectiveNames[directiveName], node.name],
          ),
        );
      } else {
        knownDirectiveNames[directiveName] = node.name;
      }

      return false;
    },
  };
}

},{"../../error/GraphQLError.js":35}],139:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueDirectivesPerLocationRule = UniqueDirectivesPerLocationRule;

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _predicates = require('../../language/predicates.js');

var _directives = require('../../type/directives.js');

/**
 * Unique directive names per location
 *
 * A GraphQL document is only valid if all non-repeatable directives at
 * a given location are uniquely named.
 *
 * See https://spec.graphql.org/draft/#sec-Directives-Are-Unique-Per-Location
 */
function UniqueDirectivesPerLocationRule(context) {
  const uniqueDirectiveMap = Object.create(null);
  const schema = context.getSchema();
  const definedDirectives = schema
    ? schema.getDirectives()
    : _directives.specifiedDirectives;

  for (const directive of definedDirectives) {
    uniqueDirectiveMap[directive.name] = !directive.isRepeatable;
  }

  const astDefinitions = context.getDocument().definitions;

  for (const def of astDefinitions) {
    if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
      uniqueDirectiveMap[def.name.value] = !def.repeatable;
    }
  }

  const schemaDirectives = Object.create(null);
  const typeDirectivesMap = Object.create(null);
  return {
    // Many different AST nodes may contain directives. Rather than listing
    // them all, just listen for entering any node, and check to see if it
    // defines any directives.
    enter(node) {
      if (!('directives' in node) || !node.directives) {
        return;
      }

      let seenDirectives;

      if (
        node.kind === _kinds.Kind.SCHEMA_DEFINITION ||
        node.kind === _kinds.Kind.SCHEMA_EXTENSION
      ) {
        seenDirectives = schemaDirectives;
      } else if (
        (0, _predicates.isTypeDefinitionNode)(node) ||
        (0, _predicates.isTypeExtensionNode)(node)
      ) {
        const typeName = node.name.value;
        seenDirectives = typeDirectivesMap[typeName];

        if (seenDirectives === undefined) {
          typeDirectivesMap[typeName] = seenDirectives = Object.create(null);
        }
      } else {
        seenDirectives = Object.create(null);
      }

      for (const directive of node.directives) {
        const directiveName = directive.name.value;

        if (uniqueDirectiveMap[directiveName]) {
          if (seenDirectives[directiveName]) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `The directive "@${directiveName}" can only be used once at this location.`,
                [seenDirectives[directiveName], directive],
              ),
            );
          } else {
            seenDirectives[directiveName] = directive;
          }
        }
      }
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../language/kinds.js":74,"../../language/predicates.js":78,"../../type/directives.js":87}],140:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueEnumValueNamesRule = UniqueEnumValueNamesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

var _definition = require('../../type/definition.js');

/**
 * Unique enum value names
 *
 * A GraphQL enum type is only valid if all its values are uniquely named.
 */
function UniqueEnumValueNamesRule(context) {
  const schema = context.getSchema();
  const existingTypeMap = schema ? schema.getTypeMap() : Object.create(null);
  const knownValueNames = Object.create(null);
  return {
    EnumTypeDefinition: checkValueUniqueness,
    EnumTypeExtension: checkValueUniqueness,
  };

  function checkValueUniqueness(node) {
    var _node$values;

    const typeName = node.name.value;

    if (!knownValueNames[typeName]) {
      knownValueNames[typeName] = Object.create(null);
    } // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

    const valueNodes =
      (_node$values = node.values) !== null && _node$values !== void 0
        ? _node$values
        : [];
    const valueNames = knownValueNames[typeName];

    for (const valueDef of valueNodes) {
      const valueName = valueDef.name.value;
      const existingType = existingTypeMap[typeName];

      if (
        (0, _definition.isEnumType)(existingType) &&
        existingType.getValue(valueName)
      ) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Enum value "${typeName}.${valueName}" already exists in the schema. It cannot also be defined in this type extension.`,
            valueDef.name,
          ),
        );
      } else if (valueNames[valueName]) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Enum value "${typeName}.${valueName}" can only be defined once.`,
            [valueNames[valueName], valueDef.name],
          ),
        );
      } else {
        valueNames[valueName] = valueDef.name;
      }
    }

    return false;
  }
}

},{"../../error/GraphQLError.js":35,"../../type/definition.js":86}],141:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueFieldDefinitionNamesRule = UniqueFieldDefinitionNamesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

var _definition = require('../../type/definition.js');

/**
 * Unique field definition names
 *
 * A GraphQL complex type is only valid if all its fields are uniquely named.
 */
function UniqueFieldDefinitionNamesRule(context) {
  const schema = context.getSchema();
  const existingTypeMap = schema ? schema.getTypeMap() : Object.create(null);
  const knownFieldNames = Object.create(null);
  return {
    InputObjectTypeDefinition: checkFieldUniqueness,
    InputObjectTypeExtension: checkFieldUniqueness,
    InterfaceTypeDefinition: checkFieldUniqueness,
    InterfaceTypeExtension: checkFieldUniqueness,
    ObjectTypeDefinition: checkFieldUniqueness,
    ObjectTypeExtension: checkFieldUniqueness,
  };

  function checkFieldUniqueness(node) {
    var _node$fields;

    const typeName = node.name.value;

    if (!knownFieldNames[typeName]) {
      knownFieldNames[typeName] = Object.create(null);
    } // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')

    const fieldNodes =
      (_node$fields = node.fields) !== null && _node$fields !== void 0
        ? _node$fields
        : [];
    const fieldNames = knownFieldNames[typeName];

    for (const fieldDef of fieldNodes) {
      const fieldName = fieldDef.name.value;

      if (hasField(existingTypeMap[typeName], fieldName)) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Field "${typeName}.${fieldName}" already exists in the schema. It cannot also be defined in this type extension.`,
            fieldDef.name,
          ),
        );
      } else if (fieldNames[fieldName]) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Field "${typeName}.${fieldName}" can only be defined once.`,
            [fieldNames[fieldName], fieldDef.name],
          ),
        );
      } else {
        fieldNames[fieldName] = fieldDef.name;
      }
    }

    return false;
  }
}

function hasField(type, fieldName) {
  if (
    (0, _definition.isObjectType)(type) ||
    (0, _definition.isInterfaceType)(type) ||
    (0, _definition.isInputObjectType)(type)
  ) {
    return type.getFields()[fieldName] != null;
  }

  return false;
}

},{"../../error/GraphQLError.js":35,"../../type/definition.js":86}],142:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueFragmentNamesRule = UniqueFragmentNamesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique fragment names
 *
 * A GraphQL document is only valid if all defined fragments have unique names.
 *
 * See https://spec.graphql.org/draft/#sec-Fragment-Name-Uniqueness
 */
function UniqueFragmentNamesRule(context) {
  const knownFragmentNames = Object.create(null);
  return {
    OperationDefinition: () => false,

    FragmentDefinition(node) {
      const fragmentName = node.name.value;

      if (knownFragmentNames[fragmentName]) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `There can be only one fragment named "${fragmentName}".`,
            [knownFragmentNames[fragmentName], node.name],
          ),
        );
      } else {
        knownFragmentNames[fragmentName] = node.name;
      }

      return false;
    },
  };
}

},{"../../error/GraphQLError.js":35}],143:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueInputFieldNamesRule = UniqueInputFieldNamesRule;

var _invariant = require('../../jsutils/invariant.js');

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique input field names
 *
 * A GraphQL input object value is only valid if all supplied fields are
 * uniquely named.
 *
 * See https://spec.graphql.org/draft/#sec-Input-Object-Field-Uniqueness
 */
function UniqueInputFieldNamesRule(context) {
  const knownNameStack = [];
  let knownNames = Object.create(null);
  return {
    ObjectValue: {
      enter() {
        knownNameStack.push(knownNames);
        knownNames = Object.create(null);
      },

      leave() {
        const prevKnownNames = knownNameStack.pop();
        prevKnownNames || (0, _invariant.invariant)(false);
        knownNames = prevKnownNames;
      },
    },

    ObjectField(node) {
      const fieldName = node.name.value;

      if (knownNames[fieldName]) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `There can be only one input field named "${fieldName}".`,
            [knownNames[fieldName], node.name],
          ),
        );
      } else {
        knownNames[fieldName] = node.name;
      }
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../jsutils/invariant.js":54}],144:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueOperationNamesRule = UniqueOperationNamesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique operation names
 *
 * A GraphQL document is only valid if all defined operations have unique names.
 *
 * See https://spec.graphql.org/draft/#sec-Operation-Name-Uniqueness
 */
function UniqueOperationNamesRule(context) {
  const knownOperationNames = Object.create(null);
  return {
    OperationDefinition(node) {
      const operationName = node.name;

      if (operationName) {
        if (knownOperationNames[operationName.value]) {
          context.reportError(
            new _GraphQLError.GraphQLError(
              `There can be only one operation named "${operationName.value}".`,
              [knownOperationNames[operationName.value], operationName],
            ),
          );
        } else {
          knownOperationNames[operationName.value] = operationName;
        }
      }

      return false;
    },

    FragmentDefinition: () => false,
  };
}

},{"../../error/GraphQLError.js":35}],145:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueOperationTypesRule = UniqueOperationTypesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique operation types
 *
 * A GraphQL document is only valid if it has only one type per operation.
 */
function UniqueOperationTypesRule(context) {
  const schema = context.getSchema();
  const definedOperationTypes = Object.create(null);
  const existingOperationTypes = schema
    ? {
        query: schema.getQueryType(),
        mutation: schema.getMutationType(),
        subscription: schema.getSubscriptionType(),
      }
    : {};
  return {
    SchemaDefinition: checkOperationTypes,
    SchemaExtension: checkOperationTypes,
  };

  function checkOperationTypes(node) {
    var _node$operationTypes;

    // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
    const operationTypesNodes =
      (_node$operationTypes = node.operationTypes) !== null &&
      _node$operationTypes !== void 0
        ? _node$operationTypes
        : [];

    for (const operationType of operationTypesNodes) {
      const operation = operationType.operation;
      const alreadyDefinedOperationType = definedOperationTypes[operation];

      if (existingOperationTypes[operation]) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Type for ${operation} already defined in the schema. It cannot be redefined.`,
            operationType,
          ),
        );
      } else if (alreadyDefinedOperationType) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `There can be only one ${operation} type in schema.`,
            [alreadyDefinedOperationType, operationType],
          ),
        );
      } else {
        definedOperationTypes[operation] = operationType;
      }
    }

    return false;
  }
}

},{"../../error/GraphQLError.js":35}],146:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueTypeNamesRule = UniqueTypeNamesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique type names
 *
 * A GraphQL document is only valid if all defined types have unique names.
 */
function UniqueTypeNamesRule(context) {
  const knownTypeNames = Object.create(null);
  const schema = context.getSchema();
  return {
    ScalarTypeDefinition: checkTypeName,
    ObjectTypeDefinition: checkTypeName,
    InterfaceTypeDefinition: checkTypeName,
    UnionTypeDefinition: checkTypeName,
    EnumTypeDefinition: checkTypeName,
    InputObjectTypeDefinition: checkTypeName,
  };

  function checkTypeName(node) {
    const typeName = node.name.value;

    if (schema !== null && schema !== void 0 && schema.getType(typeName)) {
      context.reportError(
        new _GraphQLError.GraphQLError(
          `Type "${typeName}" already exists in the schema. It cannot also be defined in this type definition.`,
          node.name,
        ),
      );
      return;
    }

    if (knownTypeNames[typeName]) {
      context.reportError(
        new _GraphQLError.GraphQLError(
          `There can be only one type named "${typeName}".`,
          [knownTypeNames[typeName], node.name],
        ),
      );
    } else {
      knownTypeNames[typeName] = node.name;
    }

    return false;
  }
}

},{"../../error/GraphQLError.js":35}],147:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UniqueVariableNamesRule = UniqueVariableNamesRule;

var _groupBy = require('../../jsutils/groupBy.js');

var _GraphQLError = require('../../error/GraphQLError.js');

/**
 * Unique variable names
 *
 * A GraphQL operation is only valid if all its variables are uniquely named.
 */
function UniqueVariableNamesRule(context) {
  return {
    OperationDefinition(operationNode) {
      var _operationNode$variab;

      // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2203')
      const variableDefinitions =
        (_operationNode$variab = operationNode.variableDefinitions) !== null &&
        _operationNode$variab !== void 0
          ? _operationNode$variab
          : [];
      const seenVariableDefinitions = (0, _groupBy.groupBy)(
        variableDefinitions,
        (node) => node.variable.name.value,
      );

      for (const [variableName, variableNodes] of seenVariableDefinitions) {
        if (variableNodes.length > 1) {
          context.reportError(
            new _GraphQLError.GraphQLError(
              `There can be only one variable named "$${variableName}".`,
              variableNodes.map((node) => node.variable.name),
            ),
          );
        }
      }
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../jsutils/groupBy.js":50}],148:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ValuesOfCorrectTypeRule = ValuesOfCorrectTypeRule;

var _keyMap = require('../../jsutils/keyMap.js');

var _inspect = require('../../jsutils/inspect.js');

var _didYouMean = require('../../jsutils/didYouMean.js');

var _suggestionList = require('../../jsutils/suggestionList.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _printer = require('../../language/printer.js');

var _definition = require('../../type/definition.js');

/**
 * Value literals of correct type
 *
 * A GraphQL document is only valid if all value literals are of the type
 * expected at their position.
 *
 * See https://spec.graphql.org/draft/#sec-Values-of-Correct-Type
 */
function ValuesOfCorrectTypeRule(context) {
  return {
    ListValue(node) {
      // Note: TypeInfo will traverse into a list's item type, so look to the
      // parent input type to check if it is a list.
      const type = (0, _definition.getNullableType)(
        context.getParentInputType(),
      );

      if (!(0, _definition.isListType)(type)) {
        isValidValueNode(context, node);
        return false; // Don't traverse further.
      }
    },

    ObjectValue(node) {
      const type = (0, _definition.getNamedType)(context.getInputType());

      if (!(0, _definition.isInputObjectType)(type)) {
        isValidValueNode(context, node);
        return false; // Don't traverse further.
      } // Ensure every required field exists.

      const fieldNodeMap = (0, _keyMap.keyMap)(
        node.fields,
        (field) => field.name.value,
      );

      for (const fieldDef of Object.values(type.getFields())) {
        const fieldNode = fieldNodeMap[fieldDef.name];

        if (!fieldNode && (0, _definition.isRequiredInputField)(fieldDef)) {
          const typeStr = (0, _inspect.inspect)(fieldDef.type);
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Field "${type.name}.${fieldDef.name}" of required type "${typeStr}" was not provided.`,
              node,
            ),
          );
        }
      }
    },

    ObjectField(node) {
      const parentType = (0, _definition.getNamedType)(
        context.getParentInputType(),
      );
      const fieldType = context.getInputType();

      if (!fieldType && (0, _definition.isInputObjectType)(parentType)) {
        const suggestions = (0, _suggestionList.suggestionList)(
          node.name.value,
          Object.keys(parentType.getFields()),
        );
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Field "${node.name.value}" is not defined by type "${parentType.name}".` +
              (0, _didYouMean.didYouMean)(suggestions),
            node,
          ),
        );
      }
    },

    NullValue(node) {
      const type = context.getInputType();

      if ((0, _definition.isNonNullType)(type)) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Expected value of type "${(0, _inspect.inspect)(
              type,
            )}", found ${(0, _printer.print)(node)}.`,
            node,
          ),
        );
      }
    },

    EnumValue: (node) => isValidValueNode(context, node),
    IntValue: (node) => isValidValueNode(context, node),
    FloatValue: (node) => isValidValueNode(context, node),
    StringValue: (node) => isValidValueNode(context, node),
    BooleanValue: (node) => isValidValueNode(context, node),
  };
}
/**
 * Any value literal may be a valid representation of a Scalar, depending on
 * that scalar type.
 */

function isValidValueNode(context, node) {
  // Report any error at the full type expected by the location.
  const locationType = context.getInputType();

  if (!locationType) {
    return;
  }

  const type = (0, _definition.getNamedType)(locationType);

  if (!(0, _definition.isLeafType)(type)) {
    const typeStr = (0, _inspect.inspect)(locationType);
    context.reportError(
      new _GraphQLError.GraphQLError(
        `Expected value of type "${typeStr}", found ${(0, _printer.print)(
          node,
        )}.`,
        node,
      ),
    );
    return;
  } // Scalars and Enums determine if a literal value is valid via parseLiteral(),
  // which may throw or return an invalid value to indicate failure.

  try {
    const parseResult = type.parseLiteral(
      node,
      undefined,
      /* variables */
    );

    if (parseResult === undefined) {
      const typeStr = (0, _inspect.inspect)(locationType);
      context.reportError(
        new _GraphQLError.GraphQLError(
          `Expected value of type "${typeStr}", found ${(0, _printer.print)(
            node,
          )}.`,
          node,
        ),
      );
    }
  } catch (error) {
    const typeStr = (0, _inspect.inspect)(locationType);

    if (error instanceof _GraphQLError.GraphQLError) {
      context.reportError(error);
    } else {
      context.reportError(
        new _GraphQLError.GraphQLError(
          `Expected value of type "${typeStr}", found ${(0, _printer.print)(
            node,
          )}; ` + error.message,
          node,
          undefined,
          undefined,
          undefined,
          error,
        ),
      );
    }
  }
}

},{"../../error/GraphQLError.js":35,"../../jsutils/didYouMean.js":49,"../../jsutils/inspect.js":52,"../../jsutils/keyMap.js":59,"../../jsutils/suggestionList.js":67,"../../language/printer.js":81,"../../type/definition.js":86}],149:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.VariablesAreInputTypesRule = VariablesAreInputTypesRule;

var _GraphQLError = require('../../error/GraphQLError.js');

var _printer = require('../../language/printer.js');

var _definition = require('../../type/definition.js');

var _typeFromAST = require('../../utilities/typeFromAST.js');

/**
 * Variables are input types
 *
 * A GraphQL operation is only valid if all the variables it defines are of
 * input types (scalar, enum, or input object).
 *
 * See https://spec.graphql.org/draft/#sec-Variables-Are-Input-Types
 */
function VariablesAreInputTypesRule(context) {
  return {
    VariableDefinition(node) {
      const type = (0, _typeFromAST.typeFromAST)(
        context.getSchema(),
        node.type,
      );

      if (type !== undefined && !(0, _definition.isInputType)(type)) {
        const variableName = node.variable.name.value;
        const typeName = (0, _printer.print)(node.type);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Variable "$${variableName}" cannot be non-input type "${typeName}".`,
            node.type,
          ),
        );
      }
    },
  };
}

},{"../../error/GraphQLError.js":35,"../../language/printer.js":81,"../../type/definition.js":86,"../../utilities/typeFromAST.js":112}],150:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.VariablesInAllowedPositionRule = VariablesInAllowedPositionRule;

var _inspect = require('../../jsutils/inspect.js');

var _GraphQLError = require('../../error/GraphQLError.js');

var _kinds = require('../../language/kinds.js');

var _definition = require('../../type/definition.js');

var _typeFromAST = require('../../utilities/typeFromAST.js');

var _typeComparators = require('../../utilities/typeComparators.js');

/**
 * Variables in allowed position
 *
 * Variable usages must be compatible with the arguments they are passed to.
 *
 * See https://spec.graphql.org/draft/#sec-All-Variable-Usages-are-Allowed
 */
function VariablesInAllowedPositionRule(context) {
  let varDefMap = Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        varDefMap = Object.create(null);
      },

      leave(operation) {
        const usages = context.getRecursiveVariableUsages(operation);

        for (const { node, type, defaultValue } of usages) {
          const varName = node.name.value;
          const varDef = varDefMap[varName];

          if (varDef && type) {
            // A var type is allowed if it is the same or more strict (e.g. is
            // a subtype of) than the expected type. It can be more strict if
            // the variable type is non-null when the expected type is nullable.
            // If both are list types, the variable item type can be more strict
            // than the expected item type (contravariant).
            const schema = context.getSchema();
            const varType = (0, _typeFromAST.typeFromAST)(schema, varDef.type);

            if (
              varType &&
              !allowedVariableUsage(
                schema,
                varType,
                varDef.defaultValue,
                type,
                defaultValue,
              )
            ) {
              const varTypeStr = (0, _inspect.inspect)(varType);
              const typeStr = (0, _inspect.inspect)(type);
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Variable "$${varName}" of type "${varTypeStr}" used in position expecting type "${typeStr}".`,
                  [varDef, node],
                ),
              );
            }
          }
        }
      },
    },

    VariableDefinition(node) {
      varDefMap[node.variable.name.value] = node;
    },
  };
}
/**
 * Returns true if the variable is allowed in the location it was found,
 * which includes considering if default values exist for either the variable
 * or the location at which it is located.
 */

function allowedVariableUsage(
  schema,
  varType,
  varDefaultValue,
  locationType,
  locationDefaultValue,
) {
  if (
    (0, _definition.isNonNullType)(locationType) &&
    !(0, _definition.isNonNullType)(varType)
  ) {
    const hasNonNullVariableDefaultValue =
      varDefaultValue != null && varDefaultValue.kind !== _kinds.Kind.NULL;
    const hasLocationDefaultValue = locationDefaultValue !== undefined;

    if (!hasNonNullVariableDefaultValue && !hasLocationDefaultValue) {
      return false;
    }

    const nullableLocationType = locationType.ofType;
    return (0, _typeComparators.isTypeSubTypeOf)(
      schema,
      varType,
      nullableLocationType,
    );
  }

  return (0, _typeComparators.isTypeSubTypeOf)(schema, varType, locationType);
}

},{"../../error/GraphQLError.js":35,"../../jsutils/inspect.js":52,"../../language/kinds.js":74,"../../type/definition.js":86,"../../utilities/typeComparators.js":111,"../../utilities/typeFromAST.js":112}],151:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.NoDeprecatedCustomRule = NoDeprecatedCustomRule;

var _invariant = require('../../../jsutils/invariant.js');

var _GraphQLError = require('../../../error/GraphQLError.js');

var _definition = require('../../../type/definition.js');

/**
 * No deprecated
 *
 * A GraphQL document is only valid if all selected fields and all used enum values have not been
 * deprecated.
 *
 * Note: This rule is optional and is not part of the Validation section of the GraphQL
 * Specification. The main purpose of this rule is detection of deprecated usages and not
 * necessarily to forbid their use when querying a service.
 */
function NoDeprecatedCustomRule(context) {
  return {
    Field(node) {
      const fieldDef = context.getFieldDef();
      const deprecationReason =
        fieldDef === null || fieldDef === void 0
          ? void 0
          : fieldDef.deprecationReason;

      if (fieldDef && deprecationReason != null) {
        const parentType = context.getParentType();
        parentType != null || (0, _invariant.invariant)(false);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `The field ${parentType.name}.${fieldDef.name} is deprecated. ${deprecationReason}`,
            node,
          ),
        );
      }
    },

    Argument(node) {
      const argDef = context.getArgument();
      const deprecationReason =
        argDef === null || argDef === void 0
          ? void 0
          : argDef.deprecationReason;

      if (argDef && deprecationReason != null) {
        const directiveDef = context.getDirective();

        if (directiveDef != null) {
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Directive "@${directiveDef.name}" argument "${argDef.name}" is deprecated. ${deprecationReason}`,
              node,
            ),
          );
        } else {
          const parentType = context.getParentType();
          const fieldDef = context.getFieldDef();
          (parentType != null && fieldDef != null) ||
            (0, _invariant.invariant)(false);
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Field "${parentType.name}.${fieldDef.name}" argument "${argDef.name}" is deprecated. ${deprecationReason}`,
              node,
            ),
          );
        }
      }
    },

    ObjectField(node) {
      const inputObjectDef = (0, _definition.getNamedType)(
        context.getParentInputType(),
      );

      if ((0, _definition.isInputObjectType)(inputObjectDef)) {
        const inputFieldDef = inputObjectDef.getFields()[node.name.value];
        const deprecationReason =
          inputFieldDef === null || inputFieldDef === void 0
            ? void 0
            : inputFieldDef.deprecationReason;

        if (deprecationReason != null) {
          context.reportError(
            new _GraphQLError.GraphQLError(
              `The input field ${inputObjectDef.name}.${inputFieldDef.name} is deprecated. ${deprecationReason}`,
              node,
            ),
          );
        }
      }
    },

    EnumValue(node) {
      const enumValueDef = context.getEnumValue();
      const deprecationReason =
        enumValueDef === null || enumValueDef === void 0
          ? void 0
          : enumValueDef.deprecationReason;

      if (enumValueDef && deprecationReason != null) {
        const enumTypeDef = (0, _definition.getNamedType)(
          context.getInputType(),
        );
        enumTypeDef != null || (0, _invariant.invariant)(false);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `The enum value "${enumTypeDef.name}.${enumValueDef.name}" is deprecated. ${deprecationReason}`,
            node,
          ),
        );
      }
    },
  };
}

},{"../../../error/GraphQLError.js":35,"../../../jsutils/invariant.js":54,"../../../type/definition.js":86}],152:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.NoSchemaIntrospectionCustomRule = NoSchemaIntrospectionCustomRule;

var _GraphQLError = require('../../../error/GraphQLError.js');

var _definition = require('../../../type/definition.js');

var _introspection = require('../../../type/introspection.js');

/**
 * Prohibit introspection queries
 *
 * A GraphQL document is only valid if all fields selected are not fields that
 * return an introspection type.
 *
 * Note: This rule is optional and is not part of the Validation section of the
 * GraphQL Specification. This rule effectively disables introspection, which
 * does not reflect best practices and should only be done if absolutely necessary.
 */
function NoSchemaIntrospectionCustomRule(context) {
  return {
    Field(node) {
      const type = (0, _definition.getNamedType)(context.getType());

      if (type && (0, _introspection.isIntrospectionType)(type)) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `GraphQL introspection has been disabled, but the requested query contained the field "${node.name.value}".`,
            node,
          ),
        );
      }
    },
  };
}

},{"../../../error/GraphQLError.js":35,"../../../type/definition.js":86,"../../../type/introspection.js":89}],153:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.specifiedSDLRules = exports.specifiedRules = void 0;

var _ExecutableDefinitionsRule = require('./rules/ExecutableDefinitionsRule.js');

var _UniqueOperationNamesRule = require('./rules/UniqueOperationNamesRule.js');

var _LoneAnonymousOperationRule = require('./rules/LoneAnonymousOperationRule.js');

var _SingleFieldSubscriptionsRule = require('./rules/SingleFieldSubscriptionsRule.js');

var _KnownTypeNamesRule = require('./rules/KnownTypeNamesRule.js');

var _FragmentsOnCompositeTypesRule = require('./rules/FragmentsOnCompositeTypesRule.js');

var _VariablesAreInputTypesRule = require('./rules/VariablesAreInputTypesRule.js');

var _ScalarLeafsRule = require('./rules/ScalarLeafsRule.js');

var _FieldsOnCorrectTypeRule = require('./rules/FieldsOnCorrectTypeRule.js');

var _UniqueFragmentNamesRule = require('./rules/UniqueFragmentNamesRule.js');

var _KnownFragmentNamesRule = require('./rules/KnownFragmentNamesRule.js');

var _NoUnusedFragmentsRule = require('./rules/NoUnusedFragmentsRule.js');

var _PossibleFragmentSpreadsRule = require('./rules/PossibleFragmentSpreadsRule.js');

var _NoFragmentCyclesRule = require('./rules/NoFragmentCyclesRule.js');

var _UniqueVariableNamesRule = require('./rules/UniqueVariableNamesRule.js');

var _NoUndefinedVariablesRule = require('./rules/NoUndefinedVariablesRule.js');

var _NoUnusedVariablesRule = require('./rules/NoUnusedVariablesRule.js');

var _KnownDirectivesRule = require('./rules/KnownDirectivesRule.js');

var _UniqueDirectivesPerLocationRule = require('./rules/UniqueDirectivesPerLocationRule.js');

var _KnownArgumentNamesRule = require('./rules/KnownArgumentNamesRule.js');

var _UniqueArgumentNamesRule = require('./rules/UniqueArgumentNamesRule.js');

var _ValuesOfCorrectTypeRule = require('./rules/ValuesOfCorrectTypeRule.js');

var _ProvidedRequiredArgumentsRule = require('./rules/ProvidedRequiredArgumentsRule.js');

var _VariablesInAllowedPositionRule = require('./rules/VariablesInAllowedPositionRule.js');

var _OverlappingFieldsCanBeMergedRule = require('./rules/OverlappingFieldsCanBeMergedRule.js');

var _UniqueInputFieldNamesRule = require('./rules/UniqueInputFieldNamesRule.js');

var _LoneSchemaDefinitionRule = require('./rules/LoneSchemaDefinitionRule.js');

var _UniqueOperationTypesRule = require('./rules/UniqueOperationTypesRule.js');

var _UniqueTypeNamesRule = require('./rules/UniqueTypeNamesRule.js');

var _UniqueEnumValueNamesRule = require('./rules/UniqueEnumValueNamesRule.js');

var _UniqueFieldDefinitionNamesRule = require('./rules/UniqueFieldDefinitionNamesRule.js');

var _UniqueArgumentDefinitionNamesRule = require('./rules/UniqueArgumentDefinitionNamesRule.js');

var _UniqueDirectiveNamesRule = require('./rules/UniqueDirectiveNamesRule.js');

var _PossibleTypeExtensionsRule = require('./rules/PossibleTypeExtensionsRule.js');

// Spec Section: "Executable Definitions"
// Spec Section: "Operation Name Uniqueness"
// Spec Section: "Lone Anonymous Operation"
// Spec Section: "Subscriptions with Single Root Field"
// Spec Section: "Fragment Spread Type Existence"
// Spec Section: "Fragments on Composite Types"
// Spec Section: "Variables are Input Types"
// Spec Section: "Leaf Field Selections"
// Spec Section: "Field Selections on Objects, Interfaces, and Unions Types"
// Spec Section: "Fragment Name Uniqueness"
// Spec Section: "Fragment spread target defined"
// Spec Section: "Fragments must be used"
// Spec Section: "Fragment spread is possible"
// Spec Section: "Fragments must not form cycles"
// Spec Section: "Variable Uniqueness"
// Spec Section: "All Variable Used Defined"
// Spec Section: "All Variables Used"
// Spec Section: "Directives Are Defined"
// Spec Section: "Directives Are Unique Per Location"
// Spec Section: "Argument Names"
// Spec Section: "Argument Uniqueness"
// Spec Section: "Value Type Correctness"
// Spec Section: "Argument Optionality"
// Spec Section: "All Variable Usages Are Allowed"
// Spec Section: "Field Selection Merging"
// Spec Section: "Input Object Field Uniqueness"
// SDL-specific validation rules

/**
 * This set includes all validation rules defined by the GraphQL spec.
 *
 * The order of the rules in this list has been adjusted to lead to the
 * most clear output when encountering multiple validation errors.
 */
const specifiedRules = Object.freeze([
  _ExecutableDefinitionsRule.ExecutableDefinitionsRule,
  _UniqueOperationNamesRule.UniqueOperationNamesRule,
  _LoneAnonymousOperationRule.LoneAnonymousOperationRule,
  _SingleFieldSubscriptionsRule.SingleFieldSubscriptionsRule,
  _KnownTypeNamesRule.KnownTypeNamesRule,
  _FragmentsOnCompositeTypesRule.FragmentsOnCompositeTypesRule,
  _VariablesAreInputTypesRule.VariablesAreInputTypesRule,
  _ScalarLeafsRule.ScalarLeafsRule,
  _FieldsOnCorrectTypeRule.FieldsOnCorrectTypeRule,
  _UniqueFragmentNamesRule.UniqueFragmentNamesRule,
  _KnownFragmentNamesRule.KnownFragmentNamesRule,
  _NoUnusedFragmentsRule.NoUnusedFragmentsRule,
  _PossibleFragmentSpreadsRule.PossibleFragmentSpreadsRule,
  _NoFragmentCyclesRule.NoFragmentCyclesRule,
  _UniqueVariableNamesRule.UniqueVariableNamesRule,
  _NoUndefinedVariablesRule.NoUndefinedVariablesRule,
  _NoUnusedVariablesRule.NoUnusedVariablesRule,
  _KnownDirectivesRule.KnownDirectivesRule,
  _UniqueDirectivesPerLocationRule.UniqueDirectivesPerLocationRule,
  _KnownArgumentNamesRule.KnownArgumentNamesRule,
  _UniqueArgumentNamesRule.UniqueArgumentNamesRule,
  _ValuesOfCorrectTypeRule.ValuesOfCorrectTypeRule,
  _ProvidedRequiredArgumentsRule.ProvidedRequiredArgumentsRule,
  _VariablesInAllowedPositionRule.VariablesInAllowedPositionRule,
  _OverlappingFieldsCanBeMergedRule.OverlappingFieldsCanBeMergedRule,
  _UniqueInputFieldNamesRule.UniqueInputFieldNamesRule,
]);
/**
 * @internal
 */

exports.specifiedRules = specifiedRules;
const specifiedSDLRules = Object.freeze([
  _LoneSchemaDefinitionRule.LoneSchemaDefinitionRule,
  _UniqueOperationTypesRule.UniqueOperationTypesRule,
  _UniqueTypeNamesRule.UniqueTypeNamesRule,
  _UniqueEnumValueNamesRule.UniqueEnumValueNamesRule,
  _UniqueFieldDefinitionNamesRule.UniqueFieldDefinitionNamesRule,
  _UniqueArgumentDefinitionNamesRule.UniqueArgumentDefinitionNamesRule,
  _UniqueDirectiveNamesRule.UniqueDirectiveNamesRule,
  _KnownTypeNamesRule.KnownTypeNamesRule,
  _KnownDirectivesRule.KnownDirectivesRule,
  _UniqueDirectivesPerLocationRule.UniqueDirectivesPerLocationRule,
  _PossibleTypeExtensionsRule.PossibleTypeExtensionsRule,
  _KnownArgumentNamesRule.KnownArgumentNamesOnDirectivesRule,
  _UniqueArgumentNamesRule.UniqueArgumentNamesRule,
  _UniqueInputFieldNamesRule.UniqueInputFieldNamesRule,
  _ProvidedRequiredArgumentsRule.ProvidedRequiredArgumentsOnDirectivesRule,
]);
exports.specifiedSDLRules = specifiedSDLRules;

},{"./rules/ExecutableDefinitionsRule.js":117,"./rules/FieldsOnCorrectTypeRule.js":118,"./rules/FragmentsOnCompositeTypesRule.js":119,"./rules/KnownArgumentNamesRule.js":120,"./rules/KnownDirectivesRule.js":121,"./rules/KnownFragmentNamesRule.js":122,"./rules/KnownTypeNamesRule.js":123,"./rules/LoneAnonymousOperationRule.js":124,"./rules/LoneSchemaDefinitionRule.js":125,"./rules/NoFragmentCyclesRule.js":126,"./rules/NoUndefinedVariablesRule.js":127,"./rules/NoUnusedFragmentsRule.js":128,"./rules/NoUnusedVariablesRule.js":129,"./rules/OverlappingFieldsCanBeMergedRule.js":130,"./rules/PossibleFragmentSpreadsRule.js":131,"./rules/PossibleTypeExtensionsRule.js":132,"./rules/ProvidedRequiredArgumentsRule.js":133,"./rules/ScalarLeafsRule.js":134,"./rules/SingleFieldSubscriptionsRule.js":135,"./rules/UniqueArgumentDefinitionNamesRule.js":136,"./rules/UniqueArgumentNamesRule.js":137,"./rules/UniqueDirectiveNamesRule.js":138,"./rules/UniqueDirectivesPerLocationRule.js":139,"./rules/UniqueEnumValueNamesRule.js":140,"./rules/UniqueFieldDefinitionNamesRule.js":141,"./rules/UniqueFragmentNamesRule.js":142,"./rules/UniqueInputFieldNamesRule.js":143,"./rules/UniqueOperationNamesRule.js":144,"./rules/UniqueOperationTypesRule.js":145,"./rules/UniqueTypeNamesRule.js":146,"./rules/UniqueVariableNamesRule.js":147,"./rules/ValuesOfCorrectTypeRule.js":148,"./rules/VariablesAreInputTypesRule.js":149,"./rules/VariablesInAllowedPositionRule.js":150}],154:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.assertValidSDL = assertValidSDL;
exports.assertValidSDLExtension = assertValidSDLExtension;
exports.validate = validate;
exports.validateSDL = validateSDL;

var _devAssert = require('../jsutils/devAssert.js');

var _GraphQLError = require('../error/GraphQLError.js');

var _visitor = require('../language/visitor.js');

var _validate = require('../type/validate.js');

var _TypeInfo = require('../utilities/TypeInfo.js');

var _specifiedRules = require('./specifiedRules.js');

var _ValidationContext = require('./ValidationContext.js');

/**
 * Implements the "Validation" section of the spec.
 *
 * Validation runs synchronously, returning an array of encountered errors, or
 * an empty array if no errors were encountered and the document is valid.
 *
 * A list of specific validation rules may be provided. If not provided, the
 * default list of rules defined by the GraphQL specification will be used.
 *
 * Each validation rules is a function which returns a visitor
 * (see the language/visitor API). Visitor methods are expected to return
 * GraphQLErrors, or Arrays of GraphQLErrors when invalid.
 *
 * Validate will stop validation after a `maxErrors` limit has been reached.
 * Attackers can send pathologically invalid queries to induce a DoS attack,
 * so by default `maxErrors` set to 100 errors.
 *
 * Optionally a custom TypeInfo instance may be provided. If not provided, one
 * will be created from the provided schema.
 */
function validate(
  schema,
  documentAST,
  rules = _specifiedRules.specifiedRules,
  options,
  /** @deprecated will be removed in 17.0.0 */
  typeInfo = new _TypeInfo.TypeInfo(schema),
) {
  var _options$maxErrors;

  const maxErrors =
    (_options$maxErrors =
      options === null || options === void 0 ? void 0 : options.maxErrors) !==
      null && _options$maxErrors !== void 0
      ? _options$maxErrors
      : 100;
  documentAST || (0, _devAssert.devAssert)(false, 'Must provide document.'); // If the schema used for validation is invalid, throw an error.

  (0, _validate.assertValidSchema)(schema);
  const abortObj = Object.freeze({});
  const errors = [];
  const context = new _ValidationContext.ValidationContext(
    schema,
    documentAST,
    typeInfo,
    (error) => {
      if (errors.length >= maxErrors) {
        errors.push(
          new _GraphQLError.GraphQLError(
            'Too many validation errors, error limit reached. Validation aborted.',
          ),
        ); // eslint-disable-next-line @typescript-eslint/no-throw-literal

        throw abortObj;
      }

      errors.push(error);
    },
  ); // This uses a specialized visitor which runs multiple visitors in parallel,
  // while maintaining the visitor skip and break API.

  const visitor = (0, _visitor.visitInParallel)(
    rules.map((rule) => rule(context)),
  ); // Visit the whole document with each instance of all provided rules.

  try {
    (0, _visitor.visit)(
      documentAST,
      (0, _TypeInfo.visitWithTypeInfo)(typeInfo, visitor),
    );
  } catch (e) {
    if (e !== abortObj) {
      throw e;
    }
  }

  return errors;
}
/**
 * @internal
 */

function validateSDL(
  documentAST,
  schemaToExtend,
  rules = _specifiedRules.specifiedSDLRules,
) {
  const errors = [];
  const context = new _ValidationContext.SDLValidationContext(
    documentAST,
    schemaToExtend,
    (error) => {
      errors.push(error);
    },
  );
  const visitors = rules.map((rule) => rule(context));
  (0, _visitor.visit)(documentAST, (0, _visitor.visitInParallel)(visitors));
  return errors;
}
/**
 * Utility function which asserts a SDL document is valid by throwing an error
 * if it is invalid.
 *
 * @internal
 */

function assertValidSDL(documentAST) {
  const errors = validateSDL(documentAST);

  if (errors.length !== 0) {
    throw new Error(errors.map((error) => error.message).join('\n\n'));
  }
}
/**
 * Utility function which asserts a SDL document is valid by throwing an error
 * if it is invalid.
 *
 * @internal
 */

function assertValidSDLExtension(documentAST, schema) {
  const errors = validateSDL(documentAST, schema);

  if (errors.length !== 0) {
    throw new Error(errors.map((error) => error.message).join('\n\n'));
  }
}

},{"../error/GraphQLError.js":35,"../jsutils/devAssert.js":48,"../language/visitor.js":84,"../type/validate.js":92,"../utilities/TypeInfo.js":93,"./ValidationContext.js":115,"./specifiedRules.js":153}],155:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.versionInfo = exports.version = void 0;
// Note: This file is autogenerated using "resources/gen-version.js" script and
// automatically updated by "npm version" command.

/**
 * A string containing the version of the GraphQL.js library
 */
const version = '16.0.1';
/**
 * An object containing the components of the GraphQL.js version string
 */

exports.version = version;
const versionInfo = Object.freeze({
  major: 16,
  minor: 0,
  patch: 1,
  preReleaseTag: null,
});
exports.versionInfo = versionInfo;

},{}],156:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var context = require('@wry/context');

function defaultDispose() { }
var Cache = /** @class */ (function () {
    function Cache(max, dispose) {
        if (max === void 0) { max = Infinity; }
        if (dispose === void 0) { dispose = defaultDispose; }
        this.max = max;
        this.dispose = dispose;
        this.map = new Map();
        this.newest = null;
        this.oldest = null;
    }
    Cache.prototype.has = function (key) {
        return this.map.has(key);
    };
    Cache.prototype.get = function (key) {
        var entry = this.getEntry(key);
        return entry && entry.value;
    };
    Cache.prototype.getEntry = function (key) {
        var entry = this.map.get(key);
        if (entry && entry !== this.newest) {
            var older = entry.older, newer = entry.newer;
            if (newer) {
                newer.older = older;
            }
            if (older) {
                older.newer = newer;
            }
            entry.older = this.newest;
            entry.older.newer = entry;
            entry.newer = null;
            this.newest = entry;
            if (entry === this.oldest) {
                this.oldest = newer;
            }
        }
        return entry;
    };
    Cache.prototype.set = function (key, value) {
        var entry = this.getEntry(key);
        if (entry) {
            return entry.value = value;
        }
        entry = {
            key: key,
            value: value,
            newer: null,
            older: this.newest
        };
        if (this.newest) {
            this.newest.newer = entry;
        }
        this.newest = entry;
        this.oldest = this.oldest || entry;
        this.map.set(key, entry);
        return entry.value;
    };
    Cache.prototype.clean = function () {
        while (this.oldest && this.map.size > this.max) {
            this.delete(this.oldest.key);
        }
    };
    Cache.prototype.delete = function (key) {
        var entry = this.map.get(key);
        if (entry) {
            if (entry === this.newest) {
                this.newest = entry.older;
            }
            if (entry === this.oldest) {
                this.oldest = entry.newer;
            }
            if (entry.newer) {
                entry.newer.older = entry.older;
            }
            if (entry.older) {
                entry.older.newer = entry.newer;
            }
            this.map.delete(key);
            this.dispose(entry.value, key);
            return true;
        }
        return false;
    };
    return Cache;
}());

var parentEntrySlot = new context.Slot();

var reusableEmptyArray = [];
var emptySetPool = [];
var POOL_TARGET_SIZE = 100;
// Since this package might be used browsers, we should avoid using the
// Node built-in assert module.
function assert(condition, optionalMessage) {
    if (!condition) {
        throw new Error(optionalMessage || "assertion failure");
    }
}
function valueIs(a, b) {
    var len = a.length;
    return (
    // Unknown values are not equal to each other.
    len > 0 &&
        // Both values must be ordinary (or both exceptional) to be equal.
        len === b.length &&
        // The underlying value or exception must be the same.
        a[len - 1] === b[len - 1]);
}
function valueGet(value) {
    switch (value.length) {
        case 0: throw new Error("unknown value");
        case 1: return value[0];
        case 2: throw value[1];
    }
}
function valueCopy(value) {
    return value.slice(0);
}
var Entry = /** @class */ (function () {
    function Entry(fn, args) {
        this.fn = fn;
        this.args = args;
        this.parents = new Set();
        this.childValues = new Map();
        // When this Entry has children that are dirty, this property becomes
        // a Set containing other Entry objects, borrowed from emptySetPool.
        // When the set becomes empty, it gets recycled back to emptySetPool.
        this.dirtyChildren = null;
        this.dirty = true;
        this.recomputing = false;
        this.value = [];
        ++Entry.count;
    }
    // This is the most important method of the Entry API, because it
    // determines whether the cached this.value can be returned immediately,
    // or must be recomputed. The overall performance of the caching system
    // depends on the truth of the following observations: (1) this.dirty is
    // usually false, (2) this.dirtyChildren is usually null/empty, and thus
    // (3) valueGet(this.value) is usually returned without recomputation.
    Entry.prototype.recompute = function () {
        assert(!this.recomputing, "already recomputing");
        if (!rememberParent(this) && maybeReportOrphan(this)) {
            // The recipient of the entry.reportOrphan callback decided to dispose
            // of this orphan entry by calling entry.dispose(), so we don't need to
            // (and should not) proceed with the recomputation.
            return void 0;
        }
        return mightBeDirty(this)
            ? reallyRecompute(this)
            : valueGet(this.value);
    };
    Entry.prototype.setDirty = function () {
        if (this.dirty)
            return;
        this.dirty = true;
        this.value.length = 0;
        reportDirty(this);
        // We can go ahead and unsubscribe here, since any further dirty
        // notifications we receive will be redundant, and unsubscribing may
        // free up some resources, e.g. file watchers.
        maybeUnsubscribe(this);
    };
    Entry.prototype.dispose = function () {
        var _this = this;
        forgetChildren(this).forEach(maybeReportOrphan);
        maybeUnsubscribe(this);
        // Because this entry has been kicked out of the cache (in index.js),
        // we've lost the ability to find out if/when this entry becomes dirty,
        // whether that happens through a subscription, because of a direct call
        // to entry.setDirty(), or because one of its children becomes dirty.
        // Because of this loss of future information, we have to assume the
        // worst (that this entry might have become dirty very soon), so we must
        // immediately mark this entry's parents as dirty. Normally we could
        // just call entry.setDirty() rather than calling parent.setDirty() for
        // each parent, but that would leave this entry in parent.childValues
        // and parent.dirtyChildren, which would prevent the child from being
        // truly forgotten.
        this.parents.forEach(function (parent) {
            parent.setDirty();
            forgetChild(parent, _this);
        });
    };
    Entry.count = 0;
    return Entry;
}());
function rememberParent(child) {
    var parent = parentEntrySlot.getValue();
    if (parent) {
        child.parents.add(parent);
        if (!parent.childValues.has(child)) {
            parent.childValues.set(child, []);
        }
        if (mightBeDirty(child)) {
            reportDirtyChild(parent, child);
        }
        else {
            reportCleanChild(parent, child);
        }
        return parent;
    }
}
function reallyRecompute(entry) {
    // Since this recomputation is likely to re-remember some of this
    // entry's children, we forget our children here but do not call
    // maybeReportOrphan until after the recomputation finishes.
    var originalChildren = forgetChildren(entry);
    // Set entry as the parent entry while calling recomputeNewValue(entry).
    parentEntrySlot.withValue(entry, recomputeNewValue, [entry]);
    if (maybeSubscribe(entry)) {
        // If we successfully recomputed entry.value and did not fail to
        // (re)subscribe, then this Entry is no longer explicitly dirty.
        setClean(entry);
    }
    // Now that we've had a chance to re-remember any children that were
    // involved in the recomputation, we can safely report any orphan
    // children that remain.
    originalChildren.forEach(maybeReportOrphan);
    return valueGet(entry.value);
}
function recomputeNewValue(entry) {
    entry.recomputing = true;
    // Set entry.value as unknown.
    entry.value.length = 0;
    try {
        // If entry.fn succeeds, entry.value will become a normal Value.
        entry.value[0] = entry.fn.apply(null, entry.args);
    }
    catch (e) {
        // If entry.fn throws, entry.value will become exceptional.
        entry.value[1] = e;
    }
    // Either way, this line is always reached.
    entry.recomputing = false;
}
function mightBeDirty(entry) {
    return entry.dirty || !!(entry.dirtyChildren && entry.dirtyChildren.size);
}
function setClean(entry) {
    entry.dirty = false;
    if (mightBeDirty(entry)) {
        // This Entry may still have dirty children, in which case we can't
        // let our parents know we're clean just yet.
        return;
    }
    reportClean(entry);
}
function reportDirty(child) {
    child.parents.forEach(function (parent) { return reportDirtyChild(parent, child); });
}
function reportClean(child) {
    child.parents.forEach(function (parent) { return reportCleanChild(parent, child); });
}
// Let a parent Entry know that one of its children may be dirty.
function reportDirtyChild(parent, child) {
    // Must have called rememberParent(child) before calling
    // reportDirtyChild(parent, child).
    assert(parent.childValues.has(child));
    assert(mightBeDirty(child));
    if (!parent.dirtyChildren) {
        parent.dirtyChildren = emptySetPool.pop() || new Set;
    }
    else if (parent.dirtyChildren.has(child)) {
        // If we already know this child is dirty, then we must have already
        // informed our own parents that we are dirty, so we can terminate
        // the recursion early.
        return;
    }
    parent.dirtyChildren.add(child);
    reportDirty(parent);
}
// Let a parent Entry know that one of its children is no longer dirty.
function reportCleanChild(parent, child) {
    // Must have called rememberChild(child) before calling
    // reportCleanChild(parent, child).
    assert(parent.childValues.has(child));
    assert(!mightBeDirty(child));
    var childValue = parent.childValues.get(child);
    if (childValue.length === 0) {
        parent.childValues.set(child, valueCopy(child.value));
    }
    else if (!valueIs(childValue, child.value)) {
        parent.setDirty();
    }
    removeDirtyChild(parent, child);
    if (mightBeDirty(parent)) {
        return;
    }
    reportClean(parent);
}
function removeDirtyChild(parent, child) {
    var dc = parent.dirtyChildren;
    if (dc) {
        dc.delete(child);
        if (dc.size === 0) {
            if (emptySetPool.length < POOL_TARGET_SIZE) {
                emptySetPool.push(dc);
            }
            parent.dirtyChildren = null;
        }
    }
}
// If the given entry has a reportOrphan method, and no remaining parents,
// call entry.reportOrphan and return true iff it returns true. The
// reportOrphan function should return true to indicate entry.dispose()
// has been called, and the entry has been removed from any other caches
// (see index.js for the only current example).
function maybeReportOrphan(entry) {
    return entry.parents.size === 0 &&
        typeof entry.reportOrphan === "function" &&
        entry.reportOrphan() === true;
}
// Removes all children from this entry and returns an array of the
// removed children.
function forgetChildren(parent) {
    var children = reusableEmptyArray;
    if (parent.childValues.size > 0) {
        children = [];
        parent.childValues.forEach(function (_value, child) {
            forgetChild(parent, child);
            children.push(child);
        });
    }
    // After we forget all our children, this.dirtyChildren must be empty
    // and therefore must have been reset to null.
    assert(parent.dirtyChildren === null);
    return children;
}
function forgetChild(parent, child) {
    child.parents.delete(parent);
    parent.childValues.delete(child);
    removeDirtyChild(parent, child);
}
function maybeSubscribe(entry) {
    if (typeof entry.subscribe === "function") {
        try {
            maybeUnsubscribe(entry); // Prevent double subscriptions.
            entry.unsubscribe = entry.subscribe.apply(null, entry.args);
        }
        catch (e) {
            // If this Entry has a subscribe function and it threw an exception
            // (or an unsubscribe function it previously returned now throws),
            // return false to indicate that we were not able to subscribe (or
            // unsubscribe), and this Entry should remain dirty.
            entry.setDirty();
            return false;
        }
    }
    // Returning true indicates either that there was no entry.subscribe
    // function or that it succeeded.
    return true;
}
function maybeUnsubscribe(entry) {
    var unsubscribe = entry.unsubscribe;
    if (typeof unsubscribe === "function") {
        entry.unsubscribe = void 0;
        unsubscribe();
    }
}

// A trie data structure that holds object keys weakly, yet can also hold
// non-object keys, unlike the native `WeakMap`.
var KeyTrie = /** @class */ (function () {
    function KeyTrie(weakness) {
        this.weakness = weakness;
    }
    KeyTrie.prototype.lookup = function () {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i] = arguments[_i];
        }
        return this.lookupArray(array);
    };
    KeyTrie.prototype.lookupArray = function (array) {
        var node = this;
        array.forEach(function (key) { return node = node.getChildTrie(key); });
        return node.data || (node.data = Object.create(null));
    };
    KeyTrie.prototype.getChildTrie = function (key) {
        var map = this.weakness && isObjRef(key)
            ? this.weak || (this.weak = new WeakMap())
            : this.strong || (this.strong = new Map());
        var child = map.get(key);
        if (!child)
            map.set(key, child = new KeyTrie(this.weakness));
        return child;
    };
    return KeyTrie;
}());
function isObjRef(value) {
    switch (typeof value) {
        case "object":
            if (value === null)
                break;
        // Fall through to return true...
        case "function":
            return true;
    }
    return false;
}

// The defaultMakeCacheKey function is remarkably powerful, because it gives
// a unique object for any shallow-identical list of arguments. If you need
// to implement a custom makeCacheKey function, you may find it helpful to
// delegate the final work to defaultMakeCacheKey, which is why we export it
// here. However, you may want to avoid defaultMakeCacheKey if your runtime
// does not support WeakMap, or you have the ability to return a string key.
// In those cases, just write your own custom makeCacheKey functions.
var keyTrie = new KeyTrie(typeof WeakMap === "function");
function defaultMakeCacheKey() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return keyTrie.lookupArray(args);
}
var caches = new Set();
function wrap(originalFunction, options) {
    if (options === void 0) { options = Object.create(null); }
    var cache = new Cache(options.max || Math.pow(2, 16), function (entry) { return entry.dispose(); });
    var disposable = !!options.disposable;
    var makeCacheKey = options.makeCacheKey || defaultMakeCacheKey;
    function optimistic() {
        if (disposable && !parentEntrySlot.hasValue()) {
            // If there's no current parent computation, and this wrapped
            // function is disposable (meaning we don't care about entry.value,
            // just dependency tracking), then we can short-cut everything else
            // in this function, because entry.recompute() is going to recycle
            // the entry object without recomputing anything, anyway.
            return void 0;
        }
        var key = makeCacheKey.apply(null, arguments);
        if (key === void 0) {
            return originalFunction.apply(null, arguments);
        }
        var args = Array.prototype.slice.call(arguments);
        var entry = cache.get(key);
        if (entry) {
            entry.args = args;
        }
        else {
            entry = new Entry(originalFunction, args);
            cache.set(key, entry);
            entry.subscribe = options.subscribe;
            if (disposable) {
                entry.reportOrphan = function () { return cache.delete(key); };
            }
        }
        var value = entry.recompute();
        // Move this entry to the front of the least-recently used queue,
        // since we just finished computing its value.
        cache.set(key, entry);
        caches.add(cache);
        // Clean up any excess entries in the cache, but only if there is no
        // active parent entry, meaning we're not in the middle of a larger
        // computation that might be flummoxed by the cleaning.
        if (!parentEntrySlot.hasValue()) {
            caches.forEach(function (cache) { return cache.clean(); });
            caches.clear();
        }
        // If options.disposable is truthy, the caller of wrap is telling us
        // they don't care about the result of entry.recompute(), so we should
        // avoid returning the value, so it won't be accidentally used.
        return disposable ? void 0 : value;
    }
    optimistic.dirty = function () {
        var key = makeCacheKey.apply(null, arguments);
        var child = key !== void 0 && cache.get(key);
        if (child) {
            child.setDirty();
        }
    };
    return optimistic;
}

Object.defineProperty(exports, 'asyncFromGen', {
  enumerable: true,
  get: function () {
    return context.asyncFromGen;
  }
});
Object.defineProperty(exports, 'bindContext', {
  enumerable: true,
  get: function () {
    return context.bind;
  }
});
Object.defineProperty(exports, 'noContext', {
  enumerable: true,
  get: function () {
    return context.noContext;
  }
});
Object.defineProperty(exports, 'setTimeout', {
  enumerable: true,
  get: function () {
    return context.setTimeout;
  }
});
exports.KeyTrie = KeyTrie;
exports.defaultMakeCacheKey = defaultMakeCacheKey;
exports.wrap = wrap;


},{"@wry/context":6}],157:[function(require,module,exports){
(function (global){(function (){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill.js');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill.js":158}],158:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],159:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');

var genericMessage = "Invariant Violation";
var _a = Object.setPrototypeOf, setPrototypeOf = _a === void 0 ? function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
} : _a;
var InvariantError = /** @class */ (function (_super) {
    tslib.__extends(InvariantError, _super);
    function InvariantError(message) {
        if (message === void 0) { message = genericMessage; }
        var _this = _super.call(this, typeof message === "number"
            ? genericMessage + ": " + message + " (see https://github.com/apollographql/invariant-packages)"
            : message) || this;
        _this.framesToPop = 1;
        _this.name = genericMessage;
        setPrototypeOf(_this, InvariantError.prototype);
        return _this;
    }
    return InvariantError;
}(Error));
function invariant(condition, message) {
    if (!condition) {
        throw new InvariantError(message);
    }
}
function wrapConsoleMethod(method) {
    return function () {
        return console[method].apply(console, arguments);
    };
}
(function (invariant) {
    invariant.warn = wrapConsoleMethod("warn");
    invariant.error = wrapConsoleMethod("error");
})(invariant || (invariant = {}));
// Code that uses ts-invariant with rollup-plugin-invariant may want to
// import this process stub to avoid errors evaluating process.env.NODE_ENV.
// However, because most ESM-to-CJS compilers will rewrite the process import
// as tsInvariant.process, which prevents proper replacement by minifiers, we
// also attempt to define the stub globally when it is not already defined.
exports.process = { env: {} };
if (typeof process === "object") {
    exports.process = process;
}
else
    try {
        // Using Function to evaluate this assignment in global scope also escapes
        // the strict mode of the current module, thereby allowing the assignment.
        // Inspired by https://github.com/facebook/regenerator/pull/369.
        Function("stub", "process = stub")(exports.process);
    }
    catch (atLeastWeTried) {
        // The assignment can fail if a Content Security Policy heavy-handedly
        // forbids Function usage. In those environments, developers should take
        // extra care to replace process.env.NODE_ENV in their production builds,
        // or define an appropriate global.process polyfill.
    }
var invariant$1 = invariant;

exports.default = invariant$1;
exports.InvariantError = InvariantError;
exports.invariant = invariant;


}).call(this)}).call(this,require('_process'))
},{"_process":4,"tslib":160}],160:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],161:[function(require,module,exports){
(function (global){(function (){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],162:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var zenObservable_1 = require("./zenObservable");
tslib_1.__exportStar(require("./zenObservable"), exports);
exports.default = zenObservable_1.Observable;

},{"./zenObservable":163,"tslib":164}],163:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var zen_observable_1 = tslib_1.__importDefault(require("zen-observable"));
exports.Observable = zen_observable_1.default;

},{"tslib":164,"zen-observable":165}],164:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],165:[function(require,module,exports){
module.exports = require('./lib/Observable.js').Observable;

},{"./lib/Observable.js":166}],166:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observable = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// === Symbol Support ===
var hasSymbols = function () {
  return typeof Symbol === 'function';
};

var hasSymbol = function (name) {
  return hasSymbols() && Boolean(Symbol[name]);
};

var getSymbol = function (name) {
  return hasSymbol(name) ? Symbol[name] : '@@' + name;
};

if (hasSymbols() && !hasSymbol('observable')) {
  Symbol.observable = Symbol('observable');
}

var SymbolIterator = getSymbol('iterator');
var SymbolObservable = getSymbol('observable');
var SymbolSpecies = getSymbol('species'); // === Abstract Operations ===

function getMethod(obj, key) {
  var value = obj[key];
  if (value == null) return undefined;
  if (typeof value !== 'function') throw new TypeError(value + ' is not a function');
  return value;
}

function getSpecies(obj) {
  var ctor = obj.constructor;

  if (ctor !== undefined) {
    ctor = ctor[SymbolSpecies];

    if (ctor === null) {
      ctor = undefined;
    }
  }

  return ctor !== undefined ? ctor : Observable;
}

function isObservable(x) {
  return x instanceof Observable; // SPEC: Brand check
}

function hostReportError(e) {
  if (hostReportError.log) {
    hostReportError.log(e);
  } else {
    setTimeout(function () {
      throw e;
    });
  }
}

function enqueue(fn) {
  Promise.resolve().then(function () {
    try {
      fn();
    } catch (e) {
      hostReportError(e);
    }
  });
}

function cleanupSubscription(subscription) {
  var cleanup = subscription._cleanup;
  if (cleanup === undefined) return;
  subscription._cleanup = undefined;

  if (!cleanup) {
    return;
  }

  try {
    if (typeof cleanup === 'function') {
      cleanup();
    } else {
      var unsubscribe = getMethod(cleanup, 'unsubscribe');

      if (unsubscribe) {
        unsubscribe.call(cleanup);
      }
    }
  } catch (e) {
    hostReportError(e);
  }
}

function closeSubscription(subscription) {
  subscription._observer = undefined;
  subscription._queue = undefined;
  subscription._state = 'closed';
}

function flushSubscription(subscription) {
  var queue = subscription._queue;

  if (!queue) {
    return;
  }

  subscription._queue = undefined;
  subscription._state = 'ready';

  for (var i = 0; i < queue.length; ++i) {
    notifySubscription(subscription, queue[i].type, queue[i].value);
    if (subscription._state === 'closed') break;
  }
}

function notifySubscription(subscription, type, value) {
  subscription._state = 'running';
  var observer = subscription._observer;

  try {
    var m = getMethod(observer, type);

    switch (type) {
      case 'next':
        if (m) m.call(observer, value);
        break;

      case 'error':
        closeSubscription(subscription);
        if (m) m.call(observer, value);else throw value;
        break;

      case 'complete':
        closeSubscription(subscription);
        if (m) m.call(observer);
        break;
    }
  } catch (e) {
    hostReportError(e);
  }

  if (subscription._state === 'closed') cleanupSubscription(subscription);else if (subscription._state === 'running') subscription._state = 'ready';
}

function onNotify(subscription, type, value) {
  if (subscription._state === 'closed') return;

  if (subscription._state === 'buffering') {
    subscription._queue.push({
      type: type,
      value: value
    });

    return;
  }

  if (subscription._state !== 'ready') {
    subscription._state = 'buffering';
    subscription._queue = [{
      type: type,
      value: value
    }];
    enqueue(function () {
      return flushSubscription(subscription);
    });
    return;
  }

  notifySubscription(subscription, type, value);
}

var Subscription =
/*#__PURE__*/
function () {
  function Subscription(observer, subscriber) {
    _classCallCheck(this, Subscription);

    // ASSERT: observer is an object
    // ASSERT: subscriber is callable
    this._cleanup = undefined;
    this._observer = observer;
    this._queue = undefined;
    this._state = 'initializing';
    var subscriptionObserver = new SubscriptionObserver(this);

    try {
      this._cleanup = subscriber.call(undefined, subscriptionObserver);
    } catch (e) {
      subscriptionObserver.error(e);
    }

    if (this._state === 'initializing') this._state = 'ready';
  }

  _createClass(Subscription, [{
    key: "unsubscribe",
    value: function unsubscribe() {
      if (this._state !== 'closed') {
        closeSubscription(this);
        cleanupSubscription(this);
      }
    }
  }, {
    key: "closed",
    get: function () {
      return this._state === 'closed';
    }
  }]);

  return Subscription;
}();

var SubscriptionObserver =
/*#__PURE__*/
function () {
  function SubscriptionObserver(subscription) {
    _classCallCheck(this, SubscriptionObserver);

    this._subscription = subscription;
  }

  _createClass(SubscriptionObserver, [{
    key: "next",
    value: function next(value) {
      onNotify(this._subscription, 'next', value);
    }
  }, {
    key: "error",
    value: function error(value) {
      onNotify(this._subscription, 'error', value);
    }
  }, {
    key: "complete",
    value: function complete() {
      onNotify(this._subscription, 'complete');
    }
  }, {
    key: "closed",
    get: function () {
      return this._subscription._state === 'closed';
    }
  }]);

  return SubscriptionObserver;
}();

var Observable =
/*#__PURE__*/
function () {
  function Observable(subscriber) {
    _classCallCheck(this, Observable);

    if (!(this instanceof Observable)) throw new TypeError('Observable cannot be called as a function');
    if (typeof subscriber !== 'function') throw new TypeError('Observable initializer must be a function');
    this._subscriber = subscriber;
  }

  _createClass(Observable, [{
    key: "subscribe",
    value: function subscribe(observer) {
      if (typeof observer !== 'object' || observer === null) {
        observer = {
          next: observer,
          error: arguments[1],
          complete: arguments[2]
        };
      }

      return new Subscription(observer, this._subscriber);
    }
  }, {
    key: "forEach",
    value: function forEach(fn) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (typeof fn !== 'function') {
          reject(new TypeError(fn + ' is not a function'));
          return;
        }

        function done() {
          subscription.unsubscribe();
          resolve();
        }

        var subscription = _this.subscribe({
          next: function (value) {
            try {
              fn(value, done);
            } catch (e) {
              reject(e);
              subscription.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
      });
    }
  }, {
    key: "map",
    value: function map(fn) {
      var _this2 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
      var C = getSpecies(this);
      return new C(function (observer) {
        return _this2.subscribe({
          next: function (value) {
            try {
              value = fn(value);
            } catch (e) {
              return observer.error(e);
            }

            observer.next(value);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            observer.complete();
          }
        });
      });
    }
  }, {
    key: "filter",
    value: function filter(fn) {
      var _this3 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
      var C = getSpecies(this);
      return new C(function (observer) {
        return _this3.subscribe({
          next: function (value) {
            try {
              if (!fn(value)) return;
            } catch (e) {
              return observer.error(e);
            }

            observer.next(value);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            observer.complete();
          }
        });
      });
    }
  }, {
    key: "reduce",
    value: function reduce(fn) {
      var _this4 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
      var C = getSpecies(this);
      var hasSeed = arguments.length > 1;
      var hasValue = false;
      var seed = arguments[1];
      var acc = seed;
      return new C(function (observer) {
        return _this4.subscribe({
          next: function (value) {
            var first = !hasValue;
            hasValue = true;

            if (!first || hasSeed) {
              try {
                acc = fn(acc, value);
              } catch (e) {
                return observer.error(e);
              }
            } else {
              acc = value;
            }
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            if (!hasValue && !hasSeed) return observer.error(new TypeError('Cannot reduce an empty sequence'));
            observer.next(acc);
            observer.complete();
          }
        });
      });
    }
  }, {
    key: "concat",
    value: function concat() {
      var _this5 = this;

      for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
      }

      var C = getSpecies(this);
      return new C(function (observer) {
        var subscription;
        var index = 0;

        function startNext(next) {
          subscription = next.subscribe({
            next: function (v) {
              observer.next(v);
            },
            error: function (e) {
              observer.error(e);
            },
            complete: function () {
              if (index === sources.length) {
                subscription = undefined;
                observer.complete();
              } else {
                startNext(C.from(sources[index++]));
              }
            }
          });
        }

        startNext(_this5);
        return function () {
          if (subscription) {
            subscription.unsubscribe();
            subscription = undefined;
          }
        };
      });
    }
  }, {
    key: "flatMap",
    value: function flatMap(fn) {
      var _this6 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
      var C = getSpecies(this);
      return new C(function (observer) {
        var subscriptions = [];

        var outer = _this6.subscribe({
          next: function (value) {
            if (fn) {
              try {
                value = fn(value);
              } catch (e) {
                return observer.error(e);
              }
            }

            var inner = C.from(value).subscribe({
              next: function (value) {
                observer.next(value);
              },
              error: function (e) {
                observer.error(e);
              },
              complete: function () {
                var i = subscriptions.indexOf(inner);
                if (i >= 0) subscriptions.splice(i, 1);
                completeIfDone();
              }
            });
            subscriptions.push(inner);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            completeIfDone();
          }
        });

        function completeIfDone() {
          if (outer.closed && subscriptions.length === 0) observer.complete();
        }

        return function () {
          subscriptions.forEach(function (s) {
            return s.unsubscribe();
          });
          outer.unsubscribe();
        };
      });
    }
  }, {
    key: SymbolObservable,
    value: function () {
      return this;
    }
  }], [{
    key: "from",
    value: function from(x) {
      var C = typeof this === 'function' ? this : Observable;
      if (x == null) throw new TypeError(x + ' is not an object');
      var method = getMethod(x, SymbolObservable);

      if (method) {
        var observable = method.call(x);
        if (Object(observable) !== observable) throw new TypeError(observable + ' is not an object');
        if (isObservable(observable) && observable.constructor === C) return observable;
        return new C(function (observer) {
          return observable.subscribe(observer);
        });
      }

      if (hasSymbol('iterator')) {
        method = getMethod(x, SymbolIterator);

        if (method) {
          return new C(function (observer) {
            enqueue(function () {
              if (observer.closed) return;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = method.call(x)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var _item = _step.value;
                  observer.next(_item);
                  if (observer.closed) return;
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              observer.complete();
            });
          });
        }
      }

      if (Array.isArray(x)) {
        return new C(function (observer) {
          enqueue(function () {
            if (observer.closed) return;

            for (var i = 0; i < x.length; ++i) {
              observer.next(x[i]);
              if (observer.closed) return;
            }

            observer.complete();
          });
        });
      }

      throw new TypeError(x + ' is not observable');
    }
  }, {
    key: "of",
    value: function of() {
      for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        items[_key2] = arguments[_key2];
      }

      var C = typeof this === 'function' ? this : Observable;
      return new C(function (observer) {
        enqueue(function () {
          if (observer.closed) return;

          for (var i = 0; i < items.length; ++i) {
            observer.next(items[i]);
            if (observer.closed) return;
          }

          observer.complete();
        });
      });
    }
  }, {
    key: SymbolSpecies,
    get: function () {
      return this;
    }
  }]);

  return Observable;
}();

exports.Observable = Observable;

if (hasSymbols()) {
  Object.defineProperty(Observable, Symbol('extensions'), {
    value: {
      symbol: SymbolObservable,
      hostReportError: hostReportError
    },
    configurable: true
  });
}
},{}]},{},[5]);
