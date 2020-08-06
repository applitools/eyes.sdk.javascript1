/* @applitools/dom-snapshot@4.0.3 */

function __processPageAndSerializeForIE() {
  var processPageAndSerializeForIE = (function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var check = function check(it) {
    return it && it.Math == Math && it;
  }; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


  var global_1 = // eslint-disable-next-line no-undef
  check((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) == 'object' && globalThis) || check((typeof window === "undefined" ? "undefined" : _typeof(window)) == 'object' && window) || check((typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self) || check(_typeof(global$1) == 'object' && global$1) || // eslint-disable-next-line no-new-func
  Function('return this')();

  var fails = function fails(exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var descriptors = !fails(function () {
    return Object.defineProperty({}, 1, {
      get: function get() {
        return 7;
      }
    })[1] != 7;
  });

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
    1: 2
  }, 1); // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

  var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;
  var objectPropertyIsEnumerable = {
    f: f
  };

  var createPropertyDescriptor = function createPropertyDescriptor(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw = function classofRaw(it) {
    return toString.call(it).slice(8, -1);
  };

  var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function requireObjectCoercible(it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  var toIndexedObject = function toIndexedObject(it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var isObject = function isObject(it) {
    return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
  };

  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string

  var toPrimitive = function toPrimitive(input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function has(it, key) {
    return hasOwnProperty.call(it, key);
  };

  var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

  var EXISTS = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function documentCreateElement(it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function get() {
        return 7;
      }
    }).a != 7;
  });

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

  var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor(O, P);
    } catch (error) {
      /* empty */
    }
    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };
  var objectGetOwnPropertyDescriptor = {
    f: f$1
  };

  var anObject = function anObject(it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    }

    return it;
  };

  var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty

  var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) {
      /* empty */
    }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };
  var objectDefineProperty = {
    f: f$2
  };

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function setGlobal(key, value) {
    try {
      createNonEnumerableProperty(global_1, key, value);
    } catch (error) {
      global_1[key] = value;
    }

    return value;
  };

  var SHARED = '__core-js_shared__';
  var store = global_1[SHARED] || setGlobal(SHARED, {});
  var sharedStore = store;

  var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

  if (typeof sharedStore.inspectSource != 'function') {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap$1 = global_1.WeakMap;
  var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

  var isPure = false;

  var shared = createCommonjsModule(function (module) {
    (module.exports = function (key, value) {
      return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
    })('versions', []).push({
      version: '3.6.5',
      mode: 'global',
      copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
    });
  });

  var id$1 = 0;
  var postfix = Math.random();

  var uid = function uid(key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id$1 + postfix).toString(36);
  };

  var keys = shared('keys');

  var sharedKey = function sharedKey(key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys = {};

  var WeakMap$2 = global_1.WeakMap;
  var set$1, get, has$1;

  var enforce = function enforce(it) {
    return has$1(it) ? get(it) : set$1(it, {});
  };

  var getterFor = function getterFor(TYPE) {
    return function (it) {
      var state;

      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      }

      return state;
    };
  };

  if (nativeWeakMap) {
    var store$1 = new WeakMap$2();
    var wmget = store$1.get;
    var wmhas = store$1.has;
    var wmset = store$1.set;

    set$1 = function set(it, metadata) {
      wmset.call(store$1, it, metadata);
      return metadata;
    };

    get = function get(it) {
      return wmget.call(store$1, it) || {};
    };

    has$1 = function has$$1(it) {
      return wmhas.call(store$1, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys[STATE] = true;

    set$1 = function set(it, metadata) {
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };

    get = function get(it) {
      return has(it, STATE) ? it[STATE] : {};
    };

    has$1 = function has$$1(it) {
      return has(it, STATE);
    };
  }

  var internalState = {
    set: set$1,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor
  };

  var redefine = createCommonjsModule(function (module) {
    var getInternalState = internalState.get;
    var enforceInternalState = internalState.enforce;
    var TEMPLATE = String(String).split('String');
    (module.exports = function (O, key, value, options) {
      var unsafe = options ? !!options.unsafe : false;
      var simple = options ? !!options.enumerable : false;
      var noTargetGet = options ? !!options.noTargetGet : false;

      if (typeof value == 'function') {
        if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
        enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
      }

      if (O === global_1) {
        if (simple) O[key] = value;else setGlobal(key, value);
        return;
      } else if (!unsafe) {
        delete O[key];
      } else if (!noTargetGet && O[key]) {
        simple = true;
      }

      if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, 'toString', function toString() {
      return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
    });
  });

  var path = global_1;

  var aFunction = function aFunction(variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function getBuiltIn(namespace, method) {
    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
  };

  var ceil = Math.ceil;
  var floor = Math.floor; // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger

  var toInteger = function toInteger(argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  var min = Math.min; // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength

  var toLength = function toLength(argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min; // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

  var toAbsoluteIndex = function toAbsoluteIndex(index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  var createMethod = function createMethod(IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value; // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare

      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++]; // eslint-disable-next-line no-self-compare

        if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
      } else for (; length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      }
      return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var indexOf = arrayIncludes.indexOf;

  var objectKeysInternal = function objectKeysInternal(object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;

    for (key in O) {
      !has(hiddenKeys, key) && has(O, key) && result.push(key);
    } // Don't enum bug & hidden keys


    while (names.length > i) {
      if (has(O, key = names[i++])) {
        ~indexOf(result, key) || result.push(key);
      }
    }

    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames

  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  var objectGetOwnPropertyNames = {
    f: f$3
  };

  var f$4 = Object.getOwnPropertySymbols;
  var objectGetOwnPropertySymbols = {
    f: f$4
  };

  var ownKeys$1 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function copyConstructorProperties(target, source) {
    var keys = ownKeys$1(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function isForced(feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';
  var isForced_1 = isForced;

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */

  var _export = function _export(options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;

    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
    }

    if (target) for (key in source) {
      sourceProperty = source[key];

      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];

      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

      if (!FORCED && targetProperty !== undefined) {
        if (_typeof(sourceProperty) === _typeof(targetProperty)) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      } // add a flag to not completely full polyfills


      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty(sourceProperty, 'sham', true);
      } // extend global


      redefine(target, key, sourceProperty, options);
    }
  };

  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
    // Chrome 38 Symbol has incorrect toString conversion
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  var useSymbolAsUid = nativeSymbol // eslint-disable-next-line no-undef
  && !Symbol.sham // eslint-disable-next-line no-undef
  && _typeof(Symbol.iterator) == 'symbol';

  // https://tc39.github.io/ecma262/#sec-isarray

  var isArray = Array.isArray || function isArray(arg) {
    return classofRaw(arg) == 'Array';
  };

  // https://tc39.github.io/ecma262/#sec-toobject

  var toObject = function toObject(argument) {
    return Object(requireObjectCoercible(argument));
  };

  // https://tc39.github.io/ecma262/#sec-object.keys

  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  // https://tc39.github.io/ecma262/#sec-object.defineproperties

  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;

    while (length > index) {
      objectDefineProperty.f(O, key = keys[index++], Properties[key]);
    }

    return O;
  };

  var html = getBuiltIn('document', 'documentElement');

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO = sharedKey('IE_PROTO');

  var EmptyConstructor = function EmptyConstructor() {
    /* empty */
  };

  var scriptTag = function scriptTag(content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  }; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


  var NullProtoObjectViaActiveX = function NullProtoObjectViaActiveX(activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak

    return temp;
  }; // Create object with fake `null` prototype: use iframe Object with cleared prototype


  var NullProtoObjectViaIFrame = function NullProtoObjectViaIFrame() {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  }; // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug


  var activeXDocument;

  var _NullProtoObject = function NullProtoObject() {
    try {
      /* global ActiveXObject */
      activeXDocument = document.domain && new ActiveXObject('htmlfile');
    } catch (error) {
      /* ignore */
    }

    _NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
    var length = enumBugKeys.length;

    while (length--) {
      delete _NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    }

    return _NullProtoObject();
  };

  hiddenKeys[IE_PROTO] = true; // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create

  var objectCreate = Object.create || function create(O, Properties) {
    var result;

    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

      result[IE_PROTO] = O;
    } else result = _NullProtoObject();

    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;
  var toString$1 = {}.toString;
  var windowNames = (typeof window === "undefined" ? "undefined" : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function getWindowNames(it) {
    try {
      return nativeGetOwnPropertyNames(it);
    } catch (error) {
      return windowNames.slice();
    }
  }; // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window


  var f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : nativeGetOwnPropertyNames(toIndexedObject(it));
  };

  var objectGetOwnPropertyNamesExternal = {
    f: f$5
  };

  var WellKnownSymbolsStore = shared('wks');
  var _Symbol = global_1.Symbol;
  var createWellKnownSymbol = useSymbolAsUid ? _Symbol : _Symbol && _Symbol.withoutSetter || uid;

  var wellKnownSymbol = function wellKnownSymbol(name) {
    if (!has(WellKnownSymbolsStore, name)) {
      if (nativeSymbol && has(_Symbol, name)) WellKnownSymbolsStore[name] = _Symbol[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }

    return WellKnownSymbolsStore[name];
  };

  var f$6 = wellKnownSymbol;
  var wellKnownSymbolWrapped = {
    f: f$6
  };

  var defineProperty = objectDefineProperty.f;

  var defineWellKnownSymbol = function defineWellKnownSymbol(NAME) {
    var _Symbol = path.Symbol || (path.Symbol = {});

    if (!has(_Symbol, NAME)) defineProperty(_Symbol, NAME, {
      value: wellKnownSymbolWrapped.f(NAME)
    });
  };

  var defineProperty$1 = objectDefineProperty.f;
  var TO_STRING_TAG = wellKnownSymbol('toStringTag');

  var setToStringTag = function setToStringTag(it, TAG, STATIC) {
    if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
      defineProperty$1(it, TO_STRING_TAG, {
        configurable: true,
        value: TAG
      });
    }
  };

  var aFunction$1 = function aFunction(it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    }

    return it;
  };

  var functionBindContext = function functionBindContext(fn, that, length) {
    aFunction$1(fn);
    if (that === undefined) return fn;

    switch (length) {
      case 0:
        return function () {
          return fn.call(that);
        };

      case 1:
        return function (a) {
          return fn.call(that, a);
        };

      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };

      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }

    return function ()
    /* ...args */
    {
      return fn.apply(that, arguments);
    };
  };

  var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate

  var arraySpeciesCreate = function arraySpeciesCreate(originalArray, length) {
    var C;

    if (isArray(originalArray)) {
      C = originalArray.constructor; // cross-realm fallback

      if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    }

    return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  var push = [].push; // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation

  var createMethod$1 = function createMethod(TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this);
      var self = indexedObject(O);
      var boundFunction = functionBindContext(callbackfn, that, 3);
      var length = toLength(self.length);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate;
      var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var value, result;

      for (; length > index; index++) {
        if (NO_HOLES || index in self) {
          value = self[index];
          result = boundFunction(value, index, O);

          if (TYPE) {
            if (IS_MAP) target[index] = result; // map
            else if (result) switch (TYPE) {
                case 3:
                  return true;
                // some

                case 5:
                  return value;
                // find

                case 6:
                  return index;
                // findIndex

                case 2:
                  push.call(target, value);
                // filter
              } else if (IS_EVERY) return false; // every
          }
        }
      }

      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$1(0),
    // `Array.prototype.map` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.map
    map: createMethod$1(1),
    // `Array.prototype.filter` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
    filter: createMethod$1(2),
    // `Array.prototype.some` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.some
    some: createMethod$1(3),
    // `Array.prototype.every` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.every
    every: createMethod$1(4),
    // `Array.prototype.find` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    find: createMethod$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1(6)
  };

  var $forEach = arrayIteration.forEach;
  var HIDDEN = sharedKey('hidden');
  var SYMBOL = 'Symbol';
  var PROTOTYPE$1 = 'prototype';
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  var setInternalState = internalState.set;
  var getInternalState = internalState.getterFor(SYMBOL);
  var ObjectPrototype = Object[PROTOTYPE$1];
  var $Symbol = global_1.Symbol;
  var $stringify = getBuiltIn('JSON', 'stringify');
  var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
  var nativeDefineProperty$1 = objectDefineProperty.f;
  var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
  var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
  var AllSymbols = shared('symbols');
  var ObjectPrototypeSymbols = shared('op-symbols');
  var StringToSymbolRegistry = shared('string-to-symbol-registry');
  var SymbolToStringRegistry = shared('symbol-to-string-registry');
  var WellKnownSymbolsStore$1 = shared('wks');
  var QObject = global_1.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

  var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

  var setSymbolDescriptor = descriptors && fails(function () {
    return objectCreate(nativeDefineProperty$1({}, 'a', {
      get: function get() {
        return nativeDefineProperty$1(this, 'a', {
          value: 7
        }).a;
      }
    })).a != 7;
  }) ? function (O, P, Attributes) {
    var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
    if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
    nativeDefineProperty$1(O, P, Attributes);

    if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
      nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
    }
  } : nativeDefineProperty$1;

  var wrap = function wrap(tag, description) {
    var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
    setInternalState(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description
    });
    if (!descriptors) symbol.description = description;
    return symbol;
  };

  var isSymbol = useSymbolAsUid ? function (it) {
    return _typeof(it) == 'symbol';
  } : function (it) {
    return Object(it) instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject(O);
    var key = toPrimitive(P, true);
    anObject(Attributes);

    if (has(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
        O[HIDDEN][key] = true;
      } else {
        if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
        Attributes = objectCreate(Attributes, {
          enumerable: createPropertyDescriptor(0, false)
        });
      }

      return setSymbolDescriptor(O, key, Attributes);
    }

    return nativeDefineProperty$1(O, key, Attributes);
  };

  var $defineProperties = function defineProperties(O, Properties) {
    anObject(O);
    var properties = toIndexedObject(Properties);
    var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
    $forEach(keys, function (key) {
      if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
    });
    return O;
  };

  var $create = function create(O, Properties) {
    return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    var P = toPrimitive(V, true);
    var enumerable = nativePropertyIsEnumerable$1.call(this, P);
    if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
    return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject(O);
    var key = toPrimitive(P, true);
    if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
    var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);

    if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
      descriptor.enumerable = true;
    }

    return descriptor;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
    var result = [];
    $forEach(names, function (key) {
      if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
    });
    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
    var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
    var result = [];
    $forEach(names, function (key) {
      if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
        result.push(AllSymbols[key]);
      }
    });
    return result;
  }; // `Symbol` constructor
  // https://tc39.github.io/ecma262/#sec-symbol-constructor


  if (!nativeSymbol) {
    $Symbol = function _Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
      var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
      var tag = uid(description);

      var setter = function setter(value) {
        if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
        if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
      };

      if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, {
        configurable: true,
        set: setter
      });
      return wrap(tag, description);
    };

    redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return getInternalState(this).tag;
    });
    redefine($Symbol, 'withoutSetter', function (description) {
      return wrap(uid(description), description);
    });
    objectPropertyIsEnumerable.f = $propertyIsEnumerable;
    objectDefineProperty.f = $defineProperty;
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

    wellKnownSymbolWrapped.f = function (name) {
      return wrap(wellKnownSymbol(name), name);
    };

    if (descriptors) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
        configurable: true,
        get: function description() {
          return getInternalState(this).description;
        }
      });

      if (!isPure) {
        redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, {
          unsafe: true
        });
      }
    }
  }

  _export({
    global: true,
    wrap: true,
    forced: !nativeSymbol,
    sham: !nativeSymbol
  }, {
    Symbol: $Symbol
  });
  $forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
    defineWellKnownSymbol(name);
  });
  _export({
    target: SYMBOL,
    stat: true,
    forced: !nativeSymbol
  }, {
    // `Symbol.for` method
    // https://tc39.github.io/ecma262/#sec-symbol.for
    'for': function _for(key) {
      var string = String(key);
      if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
      var symbol = $Symbol(string);
      StringToSymbolRegistry[string] = symbol;
      SymbolToStringRegistry[symbol] = string;
      return symbol;
    },
    // `Symbol.keyFor` method
    // https://tc39.github.io/ecma262/#sec-symbol.keyfor
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
      if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
    },
    useSetter: function useSetter() {
      USE_SETTER = true;
    },
    useSimple: function useSimple() {
      USE_SETTER = false;
    }
  });
  _export({
    target: 'Object',
    stat: true,
    forced: !nativeSymbol,
    sham: !descriptors
  }, {
    // `Object.create` method
    // https://tc39.github.io/ecma262/#sec-object.create
    create: $create,
    // `Object.defineProperty` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperty
    defineProperty: $defineProperty,
    // `Object.defineProperties` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperties
    defineProperties: $defineProperties,
    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor
  });
  _export({
    target: 'Object',
    stat: true,
    forced: !nativeSymbol
  }, {
    // `Object.getOwnPropertyNames` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: $getOwnPropertyNames,
    // `Object.getOwnPropertySymbols` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
    getOwnPropertySymbols: $getOwnPropertySymbols
  }); // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443

  _export({
    target: 'Object',
    stat: true,
    forced: fails(function () {
      objectGetOwnPropertySymbols.f(1);
    })
  }, {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      return objectGetOwnPropertySymbols.f(toObject(it));
    }
  }); // `JSON.stringify` method behavior with symbols
  // https://tc39.github.io/ecma262/#sec-json.stringify

  if ($stringify) {
    var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
      var symbol = $Symbol(); // MS Edge converts symbol values to JSON as {}

      return $stringify([symbol]) != '[null]' // WebKit converts symbol values to JSON as null
      || $stringify({
        a: symbol
      }) != '{}' // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
    });
    _export({
      target: 'JSON',
      stat: true,
      forced: FORCED_JSON_STRINGIFY
    }, {
      // eslint-disable-next-line no-unused-vars
      stringify: function stringify(it, replacer, space) {
        var args = [it];
        var index = 1;
        var $replacer;

        while (arguments.length > index) {
          args.push(arguments[index++]);
        }

        $replacer = replacer;
        if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

        if (!isArray(replacer)) replacer = function replacer(key, value) {
          if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
          if (!isSymbol(value)) return value;
        };
        args[1] = replacer;
        return $stringify.apply(null, args);
      }
    });
  } // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive


  if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
    createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
  } // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag


  setToStringTag($Symbol, SYMBOL);
  hiddenKeys[HIDDEN] = true;

  // https://tc39.github.io/ecma262/#sec-symbol.asynciterator

  defineWellKnownSymbol('asyncIterator');

  var defineProperty$2 = objectDefineProperty.f;
  var NativeSymbol = global_1.Symbol;

  if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) || // Safari 12 bug
  NativeSymbol().description !== undefined)) {
    var EmptyStringDescriptionStore = {}; // wrap Symbol constructor for correct work with undefined description

    var SymbolWrapper = function _Symbol() {
      var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
      var result = this instanceof SymbolWrapper ? new NativeSymbol(description) // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
      if (description === '') EmptyStringDescriptionStore[result] = true;
      return result;
    };

    copyConstructorProperties(SymbolWrapper, NativeSymbol);
    var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
    symbolPrototype.constructor = SymbolWrapper;
    var symbolToString = symbolPrototype.toString;
    var native = String(NativeSymbol('test')) == 'Symbol(test)';
    var regexp = /^Symbol\((.*)\)[^)]+$/;
    defineProperty$2(symbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        var symbol = isObject(this) ? this.valueOf() : this;
        var string = symbolToString.call(symbol);
        if (has(EmptyStringDescriptionStore, symbol)) return '';
        var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
        return desc === '' ? undefined : desc;
      }
    });
    _export({
      global: true,
      forced: true
    }, {
      Symbol: SymbolWrapper
    });
  }

  // https://tc39.github.io/ecma262/#sec-symbol.hasinstance

  defineWellKnownSymbol('hasInstance');

  // https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable

  defineWellKnownSymbol('isConcatSpreadable');

  // https://tc39.github.io/ecma262/#sec-symbol.iterator

  defineWellKnownSymbol('iterator');

  // https://tc39.github.io/ecma262/#sec-symbol.match

  defineWellKnownSymbol('match');

  defineWellKnownSymbol('matchAll');

  // https://tc39.github.io/ecma262/#sec-symbol.replace

  defineWellKnownSymbol('replace');

  // https://tc39.github.io/ecma262/#sec-symbol.search

  defineWellKnownSymbol('search');

  // https://tc39.github.io/ecma262/#sec-symbol.species

  defineWellKnownSymbol('species');

  // https://tc39.github.io/ecma262/#sec-symbol.split

  defineWellKnownSymbol('split');

  // https://tc39.github.io/ecma262/#sec-symbol.toprimitive

  defineWellKnownSymbol('toPrimitive');

  // https://tc39.github.io/ecma262/#sec-symbol.tostringtag

  defineWellKnownSymbol('toStringTag');

  // https://tc39.github.io/ecma262/#sec-symbol.unscopables

  defineWellKnownSymbol('unscopables');

  var nativeAssign = Object.assign;
  var defineProperty$3 = Object.defineProperty; // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign

  var objectAssign = !nativeAssign || fails(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors && nativeAssign({
      b: 1
    }, nativeAssign(defineProperty$3({}, 'a', {
      enumerable: true,
      get: function get() {
        defineProperty$3(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), {
      b: 2
    })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

    var A = {};
    var B = {}; // eslint-disable-next-line no-undef

    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) {
      B[chr] = chr;
    });
    return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars
    var T = toObject(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable.f;

    while (argumentsLength > index) {
      var S = indexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;

      while (length > j) {
        key = keys[j++];
        if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
      }
    }

    return T;
  } : nativeAssign;

  // https://tc39.github.io/ecma262/#sec-object.assign

  _export({
    target: 'Object',
    stat: true,
    forced: Object.assign !== objectAssign
  }, {
    assign: objectAssign
  });

  // https://tc39.github.io/ecma262/#sec-object.create

  _export({
    target: 'Object',
    stat: true,
    sham: !descriptors
  }, {
    create: objectCreate
  });

  // https://tc39.github.io/ecma262/#sec-object.defineproperty

  _export({
    target: 'Object',
    stat: true,
    forced: !descriptors,
    sham: !descriptors
  }, {
    defineProperty: objectDefineProperty.f
  });

  // https://tc39.github.io/ecma262/#sec-object.defineproperties

  _export({
    target: 'Object',
    stat: true,
    forced: !descriptors,
    sham: !descriptors
  }, {
    defineProperties: objectDefineProperties
  });

  var propertyIsEnumerable = objectPropertyIsEnumerable.f; // `Object.{ entries, values }` methods implementation

  var createMethod$2 = function createMethod(TO_ENTRIES) {
    return function (it) {
      var O = toIndexedObject(it);
      var keys = objectKeys(O);
      var length = keys.length;
      var i = 0;
      var result = [];
      var key;

      while (length > i) {
        key = keys[i++];

        if (!descriptors || propertyIsEnumerable.call(O, key)) {
          result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
        }
      }

      return result;
    };
  };

  var objectToArray = {
    // `Object.entries` method
    // https://tc39.github.io/ecma262/#sec-object.entries
    entries: createMethod$2(true),
    // `Object.values` method
    // https://tc39.github.io/ecma262/#sec-object.values
    values: createMethod$2(false)
  };

  var $entries = objectToArray.entries; // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries

  _export({
    target: 'Object',
    stat: true
  }, {
    entries: function entries(O) {
      return $entries(O);
    }
  });

  var freezing = !fails(function () {
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var internalMetadata = createCommonjsModule(function (module) {
    var defineProperty = objectDefineProperty.f;
    var METADATA = uid('meta');
    var id = 0;

    var isExtensible = Object.isExtensible || function () {
      return true;
    };

    var setMetadata = function setMetadata(it) {
      defineProperty(it, METADATA, {
        value: {
          objectID: 'O' + ++id,
          // object ID
          weakData: {} // weak collections IDs

        }
      });
    };

    var fastKey = function fastKey(it, create) {
      // return a primitive with prefix
      if (!isObject(it)) return _typeof(it) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;

      if (!has(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return 'F'; // not necessary to add metadata

        if (!create) return 'E'; // add missing metadata

        setMetadata(it); // return object ID
      }

      return it[METADATA].objectID;
    };

    var getWeakData = function getWeakData(it, create) {
      if (!has(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return true; // not necessary to add metadata

        if (!create) return false; // add missing metadata

        setMetadata(it); // return the store of weak collections IDs
      }

      return it[METADATA].weakData;
    }; // add metadata on freeze-family methods calling


    var onFreeze = function onFreeze(it) {
      if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
      return it;
    };

    var meta = module.exports = {
      REQUIRED: false,
      fastKey: fastKey,
      getWeakData: getWeakData,
      onFreeze: onFreeze
    };
    hiddenKeys[METADATA] = true;
  });
  var internalMetadata_1 = internalMetadata.REQUIRED;
  var internalMetadata_2 = internalMetadata.fastKey;
  var internalMetadata_3 = internalMetadata.getWeakData;
  var internalMetadata_4 = internalMetadata.onFreeze;

  var onFreeze = internalMetadata.onFreeze;
  var nativeFreeze = Object.freeze;
  var FAILS_ON_PRIMITIVES = fails(function () {
    nativeFreeze(1);
  }); // `Object.freeze` method
  // https://tc39.github.io/ecma262/#sec-object.freeze

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES,
    sham: !freezing
  }, {
    freeze: function freeze(it) {
      return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
    }
  });

  var iterators = {};

  var ITERATOR = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype; // check on default Array iterator

  var isArrayIteratorMethod = function isArrayIteratorMethod(it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
  };

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  var test = {};
  test[TO_STRING_TAG$1] = 'z';
  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag'); // ES3 wrong here

  var CORRECT_ARGUMENTS = classofRaw(function () {
    return arguments;
  }()) == 'Arguments'; // fallback for IE11 Script Access Denied error

  var tryGet = function tryGet(it, key) {
    try {
      return it[key];
    } catch (error) {
      /* empty */
    }
  }; // getting tag from ES6+ `Object.prototype.toString`


  var classof = toStringTagSupport ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR$1 = wellKnownSymbol('iterator');

  var getIteratorMethod = function getIteratorMethod(it) {
    if (it != undefined) return it[ITERATOR$1] || it['@@iterator'] || iterators[classof(it)];
  };

  var callWithSafeIterationClosing = function callWithSafeIterationClosing(iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator['return'];
      if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
      throw error;
    }
  };

  var iterate_1 = createCommonjsModule(function (module) {
    var Result = function Result(stopped, result) {
      this.stopped = stopped;
      this.result = result;
    };

    var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
      var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
      var iterator, iterFn, index, length, result, next, step;

      if (IS_ITERATOR) {
        iterator = iterable;
      } else {
        iterFn = getIteratorMethod(iterable);
        if (typeof iterFn != 'function') throw TypeError('Target is not iterable'); // optimisation for array iterators

        if (isArrayIteratorMethod(iterFn)) {
          for (index = 0, length = toLength(iterable.length); length > index; index++) {
            result = AS_ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
            if (result && result instanceof Result) return result;
          }

          return new Result(false);
        }

        iterator = iterFn.call(iterable);
      }

      next = iterator.next;

      while (!(step = next.call(iterator)).done) {
        result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
        if (_typeof(result) == 'object' && result && result instanceof Result) return result;
      }

      return new Result(false);
    };

    iterate.stop = function (result) {
      return new Result(true, result);
    };
  });

  var createProperty = function createProperty(object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
  };

  // https://github.com/tc39/proposal-object-from-entries

  _export({
    target: 'Object',
    stat: true
  }, {
    fromEntries: function fromEntries(iterable) {
      var obj = {};
      iterate_1(iterable, function (k, v) {
        createProperty(obj, k, v);
      }, undefined, true);
      return obj;
    }
  });

  var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
  var FAILS_ON_PRIMITIVES$1 = fails(function () {
    nativeGetOwnPropertyDescriptor$2(1);
  });
  var FORCED = !descriptors || FAILS_ON_PRIMITIVES$1; // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

  _export({
    target: 'Object',
    stat: true,
    forced: FORCED,
    sham: !descriptors
  }, {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
      return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
    }
  });

  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors

  _export({
    target: 'Object',
    stat: true,
    sham: !descriptors
  }, {
    getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
      var O = toIndexedObject(object);
      var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
      var keys = ownKeys$1(O);
      var result = {};
      var index = 0;
      var key, descriptor;

      while (keys.length > index) {
        descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
        if (descriptor !== undefined) createProperty(result, key, descriptor);
      }

      return result;
    }
  });

  var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;
  var FAILS_ON_PRIMITIVES$2 = fails(function () {
    return !Object.getOwnPropertyNames(1);
  }); // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES$2
  }, {
    getOwnPropertyNames: nativeGetOwnPropertyNames$2
  });

  var correctPrototypeGetter = !fails(function () {
    function F() {
      /* empty */
    }

    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO$1 = sharedKey('IE_PROTO');
  var ObjectPrototype$1 = Object.prototype; // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof

  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];

    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    }

    return O instanceof Object ? ObjectPrototype$1 : null;
  };

  var FAILS_ON_PRIMITIVES$3 = fails(function () {
    objectGetPrototypeOf(1);
  }); // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES$3,
    sham: !correctPrototypeGetter
  }, {
    getPrototypeOf: function getPrototypeOf(it) {
      return objectGetPrototypeOf(toObject(it));
    }
  });

  // `SameValue` abstract operation
  // https://tc39.github.io/ecma262/#sec-samevalue
  var sameValue = Object.is || function is(x, y) {
    // eslint-disable-next-line no-self-compare
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };

  // https://tc39.github.io/ecma262/#sec-object.is

  _export({
    target: 'Object',
    stat: true
  }, {
    is: sameValue
  });

  var nativeIsExtensible = Object.isExtensible;
  var FAILS_ON_PRIMITIVES$4 = fails(function () {
  }); // `Object.isExtensible` method
  // https://tc39.github.io/ecma262/#sec-object.isextensible

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES$4
  }, {
    isExtensible: function isExtensible(it) {
      return isObject(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
    }
  });

  var nativeIsFrozen = Object.isFrozen;
  var FAILS_ON_PRIMITIVES$5 = fails(function () {
  }); // `Object.isFrozen` method
  // https://tc39.github.io/ecma262/#sec-object.isfrozen

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES$5
  }, {
    isFrozen: function isFrozen(it) {
      return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
    }
  });

  var nativeIsSealed = Object.isSealed;
  var FAILS_ON_PRIMITIVES$6 = fails(function () {
  }); // `Object.isSealed` method
  // https://tc39.github.io/ecma262/#sec-object.issealed

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES$6
  }, {
    isSealed: function isSealed(it) {
      return isObject(it) ? nativeIsSealed ? nativeIsSealed(it) : false : true;
    }
  });

  var FAILS_ON_PRIMITIVES$7 = fails(function () {
    objectKeys(1);
  }); // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES$7
  }, {
    keys: function keys(it) {
      return objectKeys(toObject(it));
    }
  });

  var onFreeze$1 = internalMetadata.onFreeze;
  var nativePreventExtensions = Object.preventExtensions;
  var FAILS_ON_PRIMITIVES$8 = fails(function () {
    nativePreventExtensions(1);
  }); // `Object.preventExtensions` method
  // https://tc39.github.io/ecma262/#sec-object.preventextensions

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES$8,
    sham: !freezing
  }, {
    preventExtensions: function preventExtensions(it) {
      return nativePreventExtensions && isObject(it) ? nativePreventExtensions(onFreeze$1(it)) : it;
    }
  });

  var onFreeze$2 = internalMetadata.onFreeze;
  var nativeSeal = Object.seal;
  var FAILS_ON_PRIMITIVES$9 = fails(function () {
    nativeSeal(1);
  }); // `Object.seal` method
  // https://tc39.github.io/ecma262/#sec-object.seal

  _export({
    target: 'Object',
    stat: true,
    forced: FAILS_ON_PRIMITIVES$9,
    sham: !freezing
  }, {
    seal: function seal(it) {
      return nativeSeal && isObject(it) ? nativeSeal(onFreeze$2(it)) : it;
    }
  });

  var aPossiblePrototype = function aPossiblePrototype(it) {
    if (!isObject(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    }

    return it;
  };

  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.

  /* eslint-disable no-proto */

  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;

    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) {
      /* empty */
    }

    return function setPrototypeOf(O, proto) {
      anObject(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter.call(O, proto);else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  // https://tc39.github.io/ecma262/#sec-object.setprototypeof

  _export({
    target: 'Object',
    stat: true
  }, {
    setPrototypeOf: objectSetPrototypeOf
  });

  var $values = objectToArray.values; // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values

  _export({
    target: 'Object',
    stat: true
  }, {
    values: function values(O) {
      return $values(O);
    }
  });

  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring


  var objectToString = toStringTagSupport ? {}.toString : function toString() {
    return '[object ' + classof(this) + ']';
  };

  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring

  if (!toStringTagSupport) {
    redefine(Object.prototype, 'toString', objectToString, {
      unsafe: true
    });
  }

  var objectPrototypeAccessorsForced = isPure || !fails(function () {
    var key = Math.random(); // In FF throws only define methods
    // eslint-disable-next-line no-undef, no-useless-call

    __defineSetter__.call(null, key, function () {
      /* empty */
    });

    delete global_1[key];
  });

  // https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__


  if (descriptors) {
    _export({
      target: 'Object',
      proto: true,
      forced: objectPrototypeAccessorsForced
    }, {
      __defineGetter__: function __defineGetter__(P, getter) {
        objectDefineProperty.f(toObject(this), P, {
          get: aFunction$1(getter),
          enumerable: true,
          configurable: true
        });
      }
    });
  }

  // https://tc39.github.io/ecma262/#sec-object.prototype.__defineSetter__


  if (descriptors) {
    _export({
      target: 'Object',
      proto: true,
      forced: objectPrototypeAccessorsForced
    }, {
      __defineSetter__: function __defineSetter__(P, setter) {
        objectDefineProperty.f(toObject(this), P, {
          set: aFunction$1(setter),
          enumerable: true,
          configurable: true
        });
      }
    });
  }

  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f; // `Object.prototype.__lookupGetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__lookupGetter__

  if (descriptors) {
    _export({
      target: 'Object',
      proto: true,
      forced: objectPrototypeAccessorsForced
    }, {
      __lookupGetter__: function __lookupGetter__(P) {
        var O = toObject(this);
        var key = toPrimitive(P, true);
        var desc;

        do {
          if (desc = getOwnPropertyDescriptor$2(O, key)) return desc.get;
        } while (O = objectGetPrototypeOf(O));
      }
    });
  }

  var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f; // `Object.prototype.__lookupSetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__lookupSetter__

  if (descriptors) {
    _export({
      target: 'Object',
      proto: true,
      forced: objectPrototypeAccessorsForced
    }, {
      __lookupSetter__: function __lookupSetter__(P) {
        var O = toObject(this);
        var key = toPrimitive(P, true);
        var desc;

        do {
          if (desc = getOwnPropertyDescriptor$3(O, key)) return desc.set;
        } while (O = objectGetPrototypeOf(O));
      }
    });
  }

  var slice = [].slice;
  var factories = {};

  var construct = function construct(C, argsLength, args) {
    if (!(argsLength in factories)) {
      for (var list = [], i = 0; i < argsLength; i++) {
        list[i] = 'a[' + i + ']';
      } // eslint-disable-next-line no-new-func


      factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
    }

    return factories[argsLength](C, args);
  }; // `Function.prototype.bind` method implementation
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind


  var functionBind = Function.bind || function bind(that
  /* , ...args */
  ) {
    var fn = aFunction$1(this);
    var partArgs = slice.call(arguments, 1);

    var boundFunction = function bound()
    /* args... */
    {
      var args = partArgs.concat(slice.call(arguments));
      return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
    };

    if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
    return boundFunction;
  };

  // https://tc39.github.io/ecma262/#sec-function.prototype.bind

  _export({
    target: 'Function',
    proto: true
  }, {
    bind: functionBind
  });

  var defineProperty$4 = objectDefineProperty.f;
  var FunctionPrototype = Function.prototype;
  var FunctionPrototypeToString = FunctionPrototype.toString;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name'; // Function instances `.name` property
  // https://tc39.github.io/ecma262/#sec-function-instances-name

  if (descriptors && !(NAME in FunctionPrototype)) {
    defineProperty$4(FunctionPrototype, NAME, {
      configurable: true,
      get: function get() {
        try {
          return FunctionPrototypeToString.call(this).match(nameRE)[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  var HAS_INSTANCE = wellKnownSymbol('hasInstance');
  var FunctionPrototype$1 = Function.prototype; // `Function.prototype[@@hasInstance]` method
  // https://tc39.github.io/ecma262/#sec-function.prototype-@@hasinstance

  if (!(HAS_INSTANCE in FunctionPrototype$1)) {
    objectDefineProperty.f(FunctionPrototype$1, HAS_INSTANCE, {
      value: function value(O) {
        if (typeof this != 'function' || !isObject(O)) return false;
        if (!isObject(this.prototype)) return O instanceof this; // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:

        while (O = objectGetPrototypeOf(O)) {
          if (this.prototype === O) return true;
        }

        return false;
      }
    });
  }

  // https://github.com/tc39/proposal-global

  _export({
    global: true
  }, {
    globalThis: global_1
  });

  // https://tc39.github.io/ecma262/#sec-array.from


  var arrayFrom = function from(arrayLike
  /* , mapfn = undefined, thisArg = undefined */
  ) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2); // if the target is not iterable or it's an array with the default iterator - use a simple case

    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      result = new C();

      for (; !(step = next.call(iterator)).done; index++) {
        value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
        createProperty(result, index, value);
      }
    } else {
      length = toLength(O.length);
      result = new C(length);

      for (; length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty(result, index, value);
      }
    }

    result.length = index;
    return result;
  };

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var SAFE_CLOSING = false;

  var checkCorrectnessOfIteration = function checkCorrectnessOfIteration(exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;

    try {
      var object = {};

      object[ITERATOR$2] = function () {
        return {
          next: function next() {
            return {
              done: ITERATION_SUPPORT = true
            };
          }
        };
      };

      exec(object);
    } catch (error) {
      /* empty */
    }

    return ITERATION_SUPPORT;
  };

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  }); // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from

  _export({
    target: 'Array',
    stat: true,
    forced: INCORRECT_ITERATION
  }, {
    from: arrayFrom
  });

  // https://tc39.github.io/ecma262/#sec-array.isarray

  _export({
    target: 'Array',
    stat: true
  }, {
    isArray: isArray
  });

  var ISNT_GENERIC = fails(function () {
    function F() {
      /* empty */
    }

    return !(Array.of.call(F) instanceof F);
  }); // `Array.of` method
  // https://tc39.github.io/ecma262/#sec-array.of
  // WebKit Array.of isn't generic

  _export({
    target: 'Array',
    stat: true,
    forced: ISNT_GENERIC
  }, {
    of: function of()
    /* ...args */
    {
      var index = 0;
      var argumentsLength = arguments.length;
      var result = new (typeof this == 'function' ? this : Array)(argumentsLength);

      while (argumentsLength > index) {
        createProperty(result, index, arguments[index++]);
      }

      result.length = argumentsLength;
      return result;
    }
  });

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var process = global_1.process;
  var versions = process && process.versions;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] + match[1];
  } else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);

    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  var engineV8Version = version && +version;

  var SPECIES$1 = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport = function arrayMethodHasSpeciesSupport(METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return engineV8Version >= 51 || !fails(function () {
      var array = [];
      var constructor = array.constructor = {};

      constructor[SPECIES$1] = function () {
        return {
          foo: 1
        };
      };

      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded'; // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679

  var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });
  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

  var isConcatSpreadable = function isConcatSpreadable(O) {
    if (!isObject(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray(O);
  };

  var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species

  _export({
    target: 'Array',
    proto: true,
    forced: FORCED$1
  }, {
    concat: function concat(arg) {
      // eslint-disable-line no-unused-vars
      var O = toObject(this);
      var A = arraySpeciesCreate(O, 0);
      var n = 0;
      var i, k, length, len, E;

      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];

        if (isConcatSpreadable(E)) {
          len = toLength(E.length);
          if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

          for (k = 0; k < len; k++, n++) {
            if (k in E) createProperty(A, n, E[k]);
          }
        } else {
          if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      }

      A.length = n;
      return A;
    }
  });

  var min$2 = Math.min; // `Array.prototype.copyWithin` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin

  var arrayCopyWithin = [].copyWithin || function copyWithin(target
  /* = 0 */
  , start
  /* = 0, end = @length */
  ) {
    var O = toObject(this);
    var len = toLength(O.length);
    var to = toAbsoluteIndex(target, len);
    var from = toAbsoluteIndex(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = min$2((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
    var inc = 1;

    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }

    while (count-- > 0) {
      if (from in O) O[to] = O[from];else delete O[to];
      to += inc;
      from += inc;
    }

    return O;
  };

  var UNSCOPABLES = wellKnownSymbol('unscopables');
  var ArrayPrototype$1 = Array.prototype; // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
    objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null)
    });
  } // add a key to Array.prototype[@@unscopables]


  var addToUnscopables = function addToUnscopables(key) {
    ArrayPrototype$1[UNSCOPABLES][key] = true;
  };

  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin

  _export({
    target: 'Array',
    proto: true
  }, {
    copyWithin: arrayCopyWithin
  }); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables('copyWithin');

  var arrayMethodIsStrict = function arrayMethodIsStrict(METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal
      method.call(null, argument || function () {
        throw 1;
      }, 1);
    });
  };

  var defineProperty$5 = Object.defineProperty;
  var cache = {};

  var thrower = function thrower(it) {
    throw it;
  };

  var arrayMethodUsesToLength = function arrayMethodUsesToLength(METHOD_NAME, options) {
    if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
    if (!options) options = {};
    var method = [][METHOD_NAME];
    var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
    var argument0 = has(options, 0) ? options[0] : thrower;
    var argument1 = has(options, 1) ? options[1] : undefined;
    return cache[METHOD_NAME] = !!method && !fails(function () {
      if (ACCESSORS && !descriptors) return true;
      var O = {
        length: -1
      };
      if (ACCESSORS) defineProperty$5(O, 1, {
        enumerable: true,
        get: thrower
      });else O[1] = 1;
      method.call(O, argument0, argument1);
    });
  };

  var $every = arrayIteration.every;
  var STRICT_METHOD = arrayMethodIsStrict('every');
  var USES_TO_LENGTH = arrayMethodUsesToLength('every'); // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every

  _export({
    target: 'Array',
    proto: true,
    forced: !STRICT_METHOD || !USES_TO_LENGTH
  }, {
    every: function every(callbackfn
    /* , thisArg */
    ) {
      return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype.fill


  var arrayFill = function fill(value
  /* , start = 0, end = @length */
  ) {
    var O = toObject(this);
    var length = toLength(O.length);
    var argumentsLength = arguments.length;
    var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
    var end = argumentsLength > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : toAbsoluteIndex(end, length);

    while (endPos > index) {
      O[index++] = value;
    }

    return O;
  };

  // https://tc39.github.io/ecma262/#sec-array.prototype.fill

  _export({
    target: 'Array',
    proto: true
  }, {
    fill: arrayFill
  }); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables('fill');

  var $filter = arrayIteration.filter;
  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter'); // Edge 14- issue

  var USES_TO_LENGTH$1 = arrayMethodUsesToLength('filter'); // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // with adding support of @@species

  _export({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1
  }, {
    filter: function filter(callbackfn
    /* , thisArg */
    ) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $find = arrayIteration.find;
  var FIND = 'find';
  var SKIPS_HOLES = true;
  var USES_TO_LENGTH$2 = arrayMethodUsesToLength(FIND); // Shouldn't skip holes

  if (FIND in []) Array(1)[FIND](function () {
    SKIPS_HOLES = false;
  }); // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find

  _export({
    target: 'Array',
    proto: true,
    forced: SKIPS_HOLES || !USES_TO_LENGTH$2
  }, {
    find: function find(callbackfn
    /* , that = undefined */
    ) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  }); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables(FIND);

  var $findIndex = arrayIteration.findIndex;
  var FIND_INDEX = 'findIndex';
  var SKIPS_HOLES$1 = true;
  var USES_TO_LENGTH$3 = arrayMethodUsesToLength(FIND_INDEX); // Shouldn't skip holes

  if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () {
    SKIPS_HOLES$1 = false;
  }); // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findindex

  _export({
    target: 'Array',
    proto: true,
    forced: SKIPS_HOLES$1 || !USES_TO_LENGTH$3
  }, {
    findIndex: function findIndex(callbackfn
    /* , that = undefined */
    ) {
      return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  }); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables(FIND_INDEX);

  // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray


  var flattenIntoArray = function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
    var targetIndex = start;
    var sourceIndex = 0;
    var mapFn = mapper ? functionBindContext(mapper, thisArg, 3) : false;
    var element;

    while (sourceIndex < sourceLen) {
      if (sourceIndex in source) {
        element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

        if (depth > 0 && isArray(element)) {
          targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
        } else {
          if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
          target[targetIndex] = element;
        }

        targetIndex++;
      }

      sourceIndex++;
    }

    return targetIndex;
  };

  var flattenIntoArray_1 = flattenIntoArray;

  // https://github.com/tc39/proposal-flatMap


  _export({
    target: 'Array',
    proto: true
  }, {
    flat: function flat()
    /* depthArg = 1 */
    {
      var depthArg = arguments.length ? arguments[0] : undefined;
      var O = toObject(this);
      var sourceLen = toLength(O.length);
      var A = arraySpeciesCreate(O, 0);
      A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
      return A;
    }
  });

  // https://github.com/tc39/proposal-flatMap


  _export({
    target: 'Array',
    proto: true
  }, {
    flatMap: function flatMap(callbackfn
    /* , thisArg */
    ) {
      var O = toObject(this);
      var sourceLen = toLength(O.length);
      var A;
      aFunction$1(callbackfn);
      A = arraySpeciesCreate(O, 0);
      A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      return A;
    }
  });

  var $forEach$1 = arrayIteration.forEach;
  var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');
  var USES_TO_LENGTH$4 = arrayMethodUsesToLength('forEach'); // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach

  var arrayForEach = !STRICT_METHOD$1 || !USES_TO_LENGTH$4 ? function forEach(callbackfn
  /* , thisArg */
  ) {
    return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  } : [].forEach;

  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach


  _export({
    target: 'Array',
    proto: true,
    forced: [].forEach != arrayForEach
  }, {
    forEach: arrayForEach
  });

  var $includes = arrayIncludes.includes;
  var USES_TO_LENGTH$5 = arrayMethodUsesToLength('indexOf', {
    ACCESSORS: true,
    1: 0
  }); // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes

  _export({
    target: 'Array',
    proto: true,
    forced: !USES_TO_LENGTH$5
  }, {
    includes: function includes(el
    /* , fromIndex = 0 */
    ) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  }); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables('includes');

  var $indexOf = arrayIncludes.indexOf;
  var nativeIndexOf = [].indexOf;
  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
  var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');
  var USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', {
    ACCESSORS: true,
    1: 0
  }); // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof

  _export({
    target: 'Array',
    proto: true,
    forced: NEGATIVE_ZERO || !STRICT_METHOD$2 || !USES_TO_LENGTH$6
  }, {
    indexOf: function indexOf(searchElement
    /* , fromIndex = 0 */
    ) {
      return NEGATIVE_ZERO // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var nativeJoin = [].join;
  var ES3_STRINGS = indexedObject != Object;
  var STRICT_METHOD$3 = arrayMethodIsStrict('join', ','); // `Array.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.join

  _export({
    target: 'Array',
    proto: true,
    forced: ES3_STRINGS || !STRICT_METHOD$3
  }, {
    join: function join(separator) {
      return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
    }
  });

  var min$3 = Math.min;
  var nativeLastIndexOf = [].lastIndexOf;
  var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
  var STRICT_METHOD$4 = arrayMethodIsStrict('lastIndexOf'); // For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method

  var USES_TO_LENGTH$7 = arrayMethodUsesToLength('indexOf', {
    ACCESSORS: true,
    1: 0
  });
  var FORCED$2 = NEGATIVE_ZERO$1 || !STRICT_METHOD$4 || !USES_TO_LENGTH$7; // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof

  var arrayLastIndexOf = FORCED$2 ? function lastIndexOf(searchElement
  /* , fromIndex = @[*-1] */
  ) {
    // convert -0 to +0
    if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = min$3(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;

    for (; index >= 0; index--) {
      if (index in O && O[index] === searchElement) return index || 0;
    }

    return -1;
  } : nativeLastIndexOf;

  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof

  _export({
    target: 'Array',
    proto: true,
    forced: arrayLastIndexOf !== [].lastIndexOf
  }, {
    lastIndexOf: arrayLastIndexOf
  });

  var $map = arrayIteration.map;
  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map'); // FF49- issue

  var USES_TO_LENGTH$8 = arrayMethodUsesToLength('map'); // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // with adding support of @@species

  _export({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$8
  }, {
    map: function map(callbackfn
    /* , thisArg */
    ) {
      return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var createMethod$3 = function createMethod(IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aFunction$1(callbackfn);
      var O = toObject(that);
      var self = indexedObject(O);
      var length = toLength(O.length);
      var index = IS_RIGHT ? length - 1 : 0;
      var i = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2) while (true) {
        if (index in self) {
          memo = self[index];
          index += i;
          break;
        }

        index += i;

        if (IS_RIGHT ? index < 0 : length <= index) {
          throw TypeError('Reduce of empty array with no initial value');
        }
      }

      for (; IS_RIGHT ? index >= 0 : length > index; index += i) {
        if (index in self) {
          memo = callbackfn(memo, self[index], index, O);
        }
      }

      return memo;
    };
  };

  var arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
    left: createMethod$3(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
    right: createMethod$3(true)
  };

  var $reduce = arrayReduce.left;
  var STRICT_METHOD$5 = arrayMethodIsStrict('reduce');
  var USES_TO_LENGTH$9 = arrayMethodUsesToLength('reduce', {
    1: 0
  }); // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce

  _export({
    target: 'Array',
    proto: true,
    forced: !STRICT_METHOD$5 || !USES_TO_LENGTH$9
  }, {
    reduce: function reduce(callbackfn
    /* , initialValue */
    ) {
      return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $reduceRight = arrayReduce.right;
  var STRICT_METHOD$6 = arrayMethodIsStrict('reduceRight'); // For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method

  var USES_TO_LENGTH$a = arrayMethodUsesToLength('reduce', {
    1: 0
  }); // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright

  _export({
    target: 'Array',
    proto: true,
    forced: !STRICT_METHOD$6 || !USES_TO_LENGTH$a
  }, {
    reduceRight: function reduceRight(callbackfn
    /* , initialValue */
    ) {
      return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var nativeReverse = [].reverse;
  var test$1 = [1, 2]; // `Array.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reverse
  // fix for Safari 12.0 bug
  // https://bugs.webkit.org/show_bug.cgi?id=188794

  _export({
    target: 'Array',
    proto: true,
    forced: String(test$1) === String(test$1.reverse())
  }, {
    reverse: function reverse() {
      // eslint-disable-next-line no-self-assign
      if (isArray(this)) this.length = this.length;
      return nativeReverse.call(this);
    }
  });

  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');
  var USES_TO_LENGTH$b = arrayMethodUsesToLength('slice', {
    ACCESSORS: true,
    0: 0,
    1: 2
  });
  var SPECIES$2 = wellKnownSymbol('species');
  var nativeSlice = [].slice;
  var max$1 = Math.max; // `Array.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects

  _export({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$b
  }, {
    slice: function slice(start, end) {
      var O = toIndexedObject(this);
      var length = toLength(O.length);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length); // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible

      var Constructor, result, n;

      if (isArray(O)) {
        Constructor = O.constructor; // cross-realm fallback

        if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
          Constructor = undefined;
        } else if (isObject(Constructor)) {
          Constructor = Constructor[SPECIES$2];
          if (Constructor === null) Constructor = undefined;
        }

        if (Constructor === Array || Constructor === undefined) {
          return nativeSlice.call(O, k, fin);
        }
      }

      result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));

      for (n = 0; k < fin; k++, n++) {
        if (k in O) createProperty(result, n, O[k]);
      }

      result.length = n;
      return result;
    }
  });

  var $some = arrayIteration.some;
  var STRICT_METHOD$7 = arrayMethodIsStrict('some');
  var USES_TO_LENGTH$c = arrayMethodUsesToLength('some'); // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some

  _export({
    target: 'Array',
    proto: true,
    forced: !STRICT_METHOD$7 || !USES_TO_LENGTH$c
  }, {
    some: function some(callbackfn
    /* , thisArg */
    ) {
      return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var test$2 = [];
  var nativeSort = test$2.sort; // IE8-

  var FAILS_ON_UNDEFINED = fails(function () {
    test$2.sort(undefined);
  }); // V8 bug

  var FAILS_ON_NULL = fails(function () {
    test$2.sort(null);
  }); // Old WebKit

  var STRICT_METHOD$8 = arrayMethodIsStrict('sort');
  var FORCED$3 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$8; // `Array.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.sort

  _export({
    target: 'Array',
    proto: true,
    forced: FORCED$3
  }, {
    sort: function sort(comparefn) {
      return comparefn === undefined ? nativeSort.call(toObject(this)) : nativeSort.call(toObject(this), aFunction$1(comparefn));
    }
  });

  var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');
  var USES_TO_LENGTH$d = arrayMethodUsesToLength('splice', {
    ACCESSORS: true,
    0: 0,
    1: 2
  });
  var max$2 = Math.max;
  var min$4 = Math.min;
  var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.splice
  // with adding support of @@species

  _export({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$d
  }, {
    splice: function splice(start, deleteCount
    /* , ...items */
    ) {
      var O = toObject(this);
      var len = toLength(O.length);
      var actualStart = toAbsoluteIndex(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;

      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min$4(max$2(toInteger(deleteCount), 0), len - actualStart);
      }

      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
        throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }

      A = arraySpeciesCreate(O, actualDeleteCount);

      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty(A, k, O[from]);
      }

      A.length = actualDeleteCount;

      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];else delete O[to];
        }

        for (k = len; k > len - actualDeleteCount + insertCount; k--) {
          delete O[k - 1];
        }
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];else delete O[to];
        }
      }

      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }

      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  var SPECIES$3 = wellKnownSymbol('species');

  var setSpecies = function setSpecies(CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$3]) {
      defineProperty(Constructor, SPECIES$3, {
        configurable: true,
        get: function get() {
          return this;
        }
      });
    }
  };

  // https://tc39.github.io/ecma262/#sec-get-array-@@species

  setSpecies('Array');

  // in popular engines, so it's moved to a separate module

  addToUnscopables('flat');

  // in popular engines, so it's moved to a separate module

  addToUnscopables('flatMap');

  var ITERATOR$3 = wellKnownSymbol('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  var returnThis = function returnThis() {
    return this;
  }; // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object


  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

  if (!has(IteratorPrototype, ITERATOR$3)) {
    createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

  var returnThis$1 = function returnThis() {
    return this;
  };

  var createIteratorConstructor = function createIteratorConstructor(IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
      next: createPropertyDescriptor(1, next)
    });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$4 = wellKnownSymbol('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis$2 = function returnThis() {
    return this;
  };

  var defineIterator = function defineIterator(Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function getIterationMethod(KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];

      switch (KIND) {
        case KEYS:
          return function keys() {
            return new IteratorConstructor(this, KIND);
          };

        case VALUES:
          return function values() {
            return new IteratorConstructor(this, KIND);
          };

        case ENTRIES:
          return function entries() {
            return new IteratorConstructor(this, KIND);
          };
      }

      return function () {
        return new IteratorConstructor(this);
      };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$4] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY; // fix native

    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));

      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
            createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
          }
        } // Set @@toStringTag to native iterators


        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      }
    } // fix Array#{values, @@iterator}.name in V8 / FF


    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;

      defaultIterator = function values() {
        return nativeIterator.call(this);
      };
    } // define iterator


    if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
      createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
    }

    iterators[NAME] = defaultIterator; // export additional methods

    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export({
        target: NAME,
        proto: true,
        forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME
      }, methods);
    }

    return methods;
  };

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$1 = internalState.set;
  var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR); // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator

  var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState$1(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated),
      // target
      index: 0,
      // next index
      kind: kind // kind

    }); // `%ArrayIteratorPrototype%.next` method
    // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;

    if (!target || index >= target.length) {
      state.target = undefined;
      return {
        value: undefined,
        done: true
      };
    }

    if (kind == 'keys') return {
      value: index,
      done: false
    };
    if (kind == 'values') return {
      value: target[index],
      done: false
    };
    return {
      value: [index, target[index]],
      done: false
    };
  }, 'values'); // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject

  iterators.Arguments = iterators.Array; // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  var fromCharCode = String.fromCharCode;
  var nativeFromCodePoint = String.fromCodePoint; // length should be 1, old FF problem

  var INCORRECT_LENGTH = !!nativeFromCodePoint && nativeFromCodePoint.length != 1; // `String.fromCodePoint` method
  // https://tc39.github.io/ecma262/#sec-string.fromcodepoint

  _export({
    target: 'String',
    stat: true,
    forced: INCORRECT_LENGTH
  }, {
    fromCodePoint: function fromCodePoint(x) {
      // eslint-disable-line no-unused-vars
      var elements = [];
      var length = arguments.length;
      var i = 0;
      var code;

      while (length > i) {
        code = +arguments[i++];
        if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
        elements.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00));
      }

      return elements.join('');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.raw

  _export({
    target: 'String',
    stat: true
  }, {
    raw: function raw(template) {
      var rawTemplate = toIndexedObject(template.raw);
      var literalSegments = toLength(rawTemplate.length);
      var argumentsLength = arguments.length;
      var elements = [];
      var i = 0;

      while (literalSegments > i) {
        elements.push(String(rawTemplate[i++]));
        if (i < argumentsLength) elements.push(String(arguments[i]));
      }

      return elements.join('');
    }
  });

  var createMethod$4 = function createMethod(CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible($this));
      var position = toInteger(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$4(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$4(true)
  };

  var codeAt = stringMultibyte.codeAt; // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat

  _export({
    target: 'String',
    proto: true
  }, {
    codePointAt: function codePointAt(pos) {
      return codeAt(this, pos);
    }
  });

  var MATCH = wellKnownSymbol('match'); // `IsRegExp` abstract operation
  // https://tc39.github.io/ecma262/#sec-isregexp

  var isRegexp = function isRegexp(it) {
    var isRegExp;
    return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
  };

  var notARegexp = function notARegexp(it) {
    if (isRegexp(it)) {
      throw TypeError("The method doesn't accept regular expressions");
    }

    return it;
  };

  var MATCH$1 = wellKnownSymbol('match');

  var correctIsRegexpLogic = function correctIsRegexpLogic(METHOD_NAME) {
    var regexp = /./;

    try {
      '/./'[METHOD_NAME](regexp);
    } catch (e) {
      try {
        regexp[MATCH$1] = false;
        return '/./'[METHOD_NAME](regexp);
      } catch (f) {
        /* empty */
      }
    }

    return false;
  };

  var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;
  var nativeEndsWith = ''.endsWith;
  var min$5 = Math.min;
  var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('endsWith'); // https://github.com/zloirock/core-js/pull/702

  var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
    var descriptor = getOwnPropertyDescriptor$4(String.prototype, 'endsWith');
    return descriptor && !descriptor.writable;
  }(); // `String.prototype.endsWith` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.endswith

  _export({
    target: 'String',
    proto: true,
    forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC
  }, {
    endsWith: function endsWith(searchString
    /* , endPosition = @length */
    ) {
      var that = String(requireObjectCoercible(this));
      notARegexp(searchString);
      var endPosition = arguments.length > 1 ? arguments[1] : undefined;
      var len = toLength(that.length);
      var end = endPosition === undefined ? len : min$5(toLength(endPosition), len);
      var search = String(searchString);
      return nativeEndsWith ? nativeEndsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.includes


  _export({
    target: 'String',
    proto: true,
    forced: !correctIsRegexpLogic('includes')
  }, {
    includes: function includes(searchString
    /* , position = 0 */
    ) {
      return !!~String(requireObjectCoercible(this)).indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags


  var regexpFlags = function regexpFlags() {
    var that = anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // so we use an intermediate function.


  function RE(s, f) {
    return RegExp(s, f);
  }

  var UNSUPPORTED_Y = fails(function () {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var re = RE('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') != null;
  });
  var BROKEN_CARET = fails(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = RE('^r', 'gy');
    re.lastIndex = 2;
    return re.exec('str') != null;
  });
  var regexpStickyHelpers = {
    UNSUPPORTED_Y: UNSUPPORTED_Y,
    BROKEN_CARET: BROKEN_CARET
  };

  var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.

  var nativeReplace = String.prototype.replace;
  var patchedExec = nativeExec;

  var UPDATES_LAST_INDEX_WRONG = function () {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  }();

  var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;
      var sticky = UNSUPPORTED_Y$1 && re.sticky;
      var flags = regexpFlags.call(re);
      var source = re.source;
      var charsAdded = 0;
      var strCopy = str;

      if (sticky) {
        flags = flags.replace('y', '');

        if (flags.indexOf('g') === -1) {
          flags += 'g';
        }

        strCopy = String(str).slice(re.lastIndex); // Support anchored sticky behavior.

        if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
          source = '(?: ' + source + ')';
          strCopy = ' ' + strCopy;
          charsAdded++;
        } // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.


        reCopy = new RegExp('^(?:' + source + ')', flags);
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
      }

      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
      match = nativeExec.call(sticky ? reCopy : re, strCopy);

      if (sticky) {
        if (match) {
          match.input = match.input.slice(charsAdded);
          match[0] = match[0].slice(charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }

      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var regexpExec = patchedExec;

  _export({
    target: 'RegExp',
    proto: true,
    forced: /./.exec !== regexpExec
  }, {
    exec: regexpExec
  });

  var SPECIES$4 = wellKnownSymbol('species');
  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;

    re.exec = function () {
      var result = [];
      result.groups = {
        a: '7'
      };
      return result;
    };

    return ''.replace(re, '$<a>') !== '7';
  }); // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0

  var REPLACE_KEEPS_$0 = function () {
    return 'a'.replace(/./, '$0') === '$0';
  }();

  var REPLACE = wellKnownSymbol('replace'); // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string

  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }

    return false;
  }(); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper


  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
    var re = /(?:)/;
    var originalExec = re.exec;

    re.exec = function () {
      return originalExec.apply(this, arguments);
    };

    var result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  var fixRegexpWellKnownSymbolLogic = function fixRegexpWellKnownSymbolLogic(KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol(KEY);
    var DELEGATES_TO_SYMBOL = !fails(function () {
      // String methods call symbol-named RegEp methods
      var O = {};

      O[SYMBOL] = function () {
        return 7;
      };

      return ''[KEY](O) != 7;
    });
    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;

      if (KEY === 'split') {
        // We can't use real regex here since it causes deoptimization
        // and serious performance degradation in V8
        // https://github.com/zloirock/core-js/issues/306
        re = {}; // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.

        re.constructor = {};

        re.constructor[SPECIES$4] = function () {
          return re;
        };

        re.flags = '';
        re[SYMBOL] = /./[SYMBOL];
      }

      re.exec = function () {
        execCalled = true;
        return null;
      };

      re[SYMBOL]('');
      return !execCalled;
    });

    if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return {
              done: true,
              value: nativeRegExpMethod.call(regexp, str, arg2)
            };
          }

          return {
            done: true,
            value: nativeMethod.call(str, regexp, arg2)
          };
        }

        return {
          done: false
        };
      }, {
        REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
        REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
      });
      var stringMethod = methods[0];
      var regexMethod = methods[1];
      redefine(String.prototype, KEY, stringMethod);
      redefine(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) {
        return regexMethod.call(string, this, arg);
      } // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) {
        return regexMethod.call(string, this);
      });
    }

    if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
  };

  var charAt = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex

  var advanceStringIndex = function advanceStringIndex(S, index, unicode) {
    return index + (unicode ? charAt(S, index).length : 1);
  };

  // https://tc39.github.io/ecma262/#sec-regexpexec

  var regexpExecAbstract = function regexpExecAbstract(R, S) {
    var exec = R.exec;

    if (typeof exec === 'function') {
      var result = exec.call(R, S);

      if (_typeof(result) !== 'object') {
        throw TypeError('RegExp exec method returned something other than an Object or null');
      }

      return result;
    }

    if (classofRaw(R) !== 'RegExp') {
      throw TypeError('RegExp#exec called on incompatible receiver');
    }

    return regexpExec.call(R, S);
  };

  fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
    return [// `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    }, // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regexpExecAbstract(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;

      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }

      return n === 0 ? null : A;
    }];
  });

  var SPECIES$5 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor

  var speciesConstructor = function speciesConstructor(O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction$1(S);
  };

  var MATCH_ALL = wellKnownSymbol('matchAll');
  var REGEXP_STRING = 'RegExp String';
  var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
  var setInternalState$2 = internalState.set;
  var getInternalState$2 = internalState.getterFor(REGEXP_STRING_ITERATOR);
  var RegExpPrototype = RegExp.prototype;
  var regExpBuiltinExec = RegExpPrototype.exec;
  var nativeMatchAll = ''.matchAll;
  var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
    'a'.matchAll(/./);
  });

  var regExpExec = function regExpExec(R, S) {
    var exec = R.exec;
    var result;

    if (typeof exec == 'function') {
      result = exec.call(R, S);
      if (_typeof(result) != 'object') throw TypeError('Incorrect exec result');
      return result;
    }

    return regExpBuiltinExec.call(R, S);
  }; // eslint-disable-next-line max-len


  var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, global, fullUnicode) {
    setInternalState$2(this, {
      type: REGEXP_STRING_ITERATOR,
      regexp: regexp,
      string: string,
      global: global,
      unicode: fullUnicode,
      done: false
    });
  }, REGEXP_STRING, function next() {
    var state = getInternalState$2(this);
    if (state.done) return {
      value: undefined,
      done: true
    };
    var R = state.regexp;
    var S = state.string;
    var match = regExpExec(R, S);
    if (match === null) return {
      value: undefined,
      done: state.done = true
    };

    if (state.global) {
      if (String(match[0]) == '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
      return {
        value: match,
        done: false
      };
    }

    state.done = true;
    return {
      value: match,
      done: false
    };
  });

  var $matchAll = function $matchAll(string) {
    var R = anObject(this);
    var S = String(string);
    var C, flagsValue, flags, matcher, global, fullUnicode;
    C = speciesConstructor(R, RegExp);
    flagsValue = R.flags;

    if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype)) {
      flagsValue = regexpFlags.call(R);
    }

    flags = flagsValue === undefined ? '' : String(flagsValue);
    matcher = new C(C === RegExp ? R.source : R, flags);
    global = !!~flags.indexOf('g');
    fullUnicode = !!~flags.indexOf('u');
    matcher.lastIndex = toLength(R.lastIndex);
    return new $RegExpStringIterator(matcher, S, global, fullUnicode);
  }; // `String.prototype.matchAll` method
  // https://github.com/tc39/proposal-string-matchall


  _export({
    target: 'String',
    proto: true,
    forced: WORKS_WITH_NON_GLOBAL_REGEX
  }, {
    matchAll: function matchAll(regexp) {
      var O = requireObjectCoercible(this);
      var flags, S, matcher, rx;

      if (regexp != null) {
        if (isRegexp(regexp)) {
          flags = String(requireObjectCoercible('flags' in RegExpPrototype ? regexp.flags : regexpFlags.call(regexp)));
          if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes');
        }

        if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
        matcher = regexp[MATCH_ALL];
        if (matcher === undefined && isPure && classofRaw(regexp) == 'RegExp') matcher = $matchAll;
        if (matcher != null) return aFunction$1(matcher).call(regexp, O);
      } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);

      S = String(O);
      rx = new RegExp(regexp, 'g');
      return rx[MATCH_ALL](S);
    }
  });
  MATCH_ALL in RegExpPrototype || createNonEnumerableProperty(RegExpPrototype, MATCH_ALL, $matchAll);

  // https://tc39.github.io/ecma262/#sec-string.prototype.repeat


  var stringRepeat = ''.repeat || function repeat(count) {
    var str = String(requireObjectCoercible(this));
    var result = '';
    var n = toInteger(count);
    if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');

    for (; n > 0; (n >>>= 1) && (str += str)) {
      if (n & 1) result += str;
    }

    return result;
  };

  var ceil$1 = Math.ceil; // `String.prototype.{ padStart, padEnd }` methods implementation

  var createMethod$5 = function createMethod(IS_END) {
    return function ($this, maxLength, fillString) {
      var S = String(requireObjectCoercible($this));
      var stringLength = S.length;
      var fillStr = fillString === undefined ? ' ' : String(fillString);
      var intMaxLength = toLength(maxLength);
      var fillLen, stringFiller;
      if (intMaxLength <= stringLength || fillStr == '') return S;
      fillLen = intMaxLength - stringLength;
      stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
      if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
      return IS_END ? S + stringFiller : stringFiller + S;
    };
  };

  var stringPad = {
    // `String.prototype.padStart` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
    start: createMethod$5(false),
    // `String.prototype.padEnd` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padend
    end: createMethod$5(true)
  };

  // eslint-disable-next-line unicorn/no-unsafe-regex

  var stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(engineUserAgent);

  var $padEnd = stringPad.end; // `String.prototype.padEnd` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padend

  _export({
    target: 'String',
    proto: true,
    forced: stringPadWebkitBug
  }, {
    padEnd: function padEnd(maxLength
    /* , fillString = ' ' */
    ) {
      return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $padStart = stringPad.start; // `String.prototype.padStart` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart

  _export({
    target: 'String',
    proto: true,
    forced: stringPadWebkitBug
  }, {
    padStart: function padStart(maxLength
    /* , fillString = ' ' */
    ) {
      return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.repeat

  _export({
    target: 'String',
    proto: true
  }, {
    repeat: stringRepeat
  });

  var max$3 = Math.max;
  var min$6 = Math.min;
  var floor$1 = Math.floor;
  var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

  var maybeToString = function maybeToString(it) {
    return it === undefined ? it : String(it);
  }; // @@replace logic


  fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
    var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
    return [// `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined ? replacer.call(searchValue, O, replaceValue) : nativeReplace.call(String(O), searchValue, replaceValue);
    }, // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0 || typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;

      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }

      var results = [];

      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;

      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max$3(min$6(toInteger(result.index), S.length), 0);
        var captures = []; // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

        for (var j = 1; j < result.length; j++) {
          captures.push(maybeToString(result[j]));
        }

        var namedCaptures = result.groups;

        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }

        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }

      return accumulatedResult + S.slice(nextSourcePosition);
    }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

      if (namedCaptures !== undefined) {
        namedCaptures = toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }

      return nativeReplace.call(replacement, symbols, function (match, ch) {
        var capture;

        switch (ch.charAt(0)) {
          case '$':
            return '$';

          case '&':
            return matched;

          case '`':
            return str.slice(0, position);

          case "'":
            return str.slice(tailPos);

          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;

          default:
            // \d\d?
            var n = +ch;
            if (n === 0) return match;

            if (n > m) {
              var f = floor$1(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }

            capture = captures[n - 1];
        }

        return capture === undefined ? '' : capture;
      });
    }
  });

  fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
    return [// `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    }, // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative(nativeSearch, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regexpExecAbstract(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }];
  });

  var arrayPush = [].push;
  var min$7 = Math.min;
  var MAX_UINT32 = 0xFFFFFFFF; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

  var SUPPORTS_Y = !fails(function () {
    return !RegExp(MAX_UINT32, 'y');
  }); // @@split logic

  fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;

    if ('abbc'.split(/(b)*/)[1] == 'c' || 'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function internalSplit(separator, limit) {
        var string = String(requireObjectCoercible(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

        if (!isRegexp(separator)) {
          return nativeSplit.call(string, separator, lim);
        }

        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
        var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;

        while (match = regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;

          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }

          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }

        if (lastLastIndex === string.length) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));

        return output.length > lim ? output.slice(0, lim) : output;
      }; // Chakra, V8

    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function internalSplit(separator, limit) {
        return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
      };
    } else internalSplit = nativeSplit;

    return [// `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
    }, // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);
      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.

      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];

      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;

        if (z === null || (e = min$7(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;

          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }

          q = p = e;
        }
      }

      A.push(S.slice(p));
      return A;
    }];
  }, !SUPPORTS_Y);

  var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;
  var nativeStartsWith = ''.startsWith;
  var min$8 = Math.min;
  var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegexpLogic('startsWith'); // https://github.com/zloirock/core-js/pull/702

  var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
    var descriptor = getOwnPropertyDescriptor$5(String.prototype, 'startsWith');
    return descriptor && !descriptor.writable;
  }(); // `String.prototype.startsWith` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.startswith

  _export({
    target: 'String',
    proto: true,
    forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1
  }, {
    startsWith: function startsWith(searchString
    /* , position = 0 */
    ) {
      var that = String(requireObjectCoercible(this));
      notARegexp(searchString);
      var index = toLength(min$8(arguments.length > 1 ? arguments[1] : undefined, that.length));
      var search = String(searchString);
      return nativeStartsWith ? nativeStartsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
    }
  });

  // a string of all valid unicode whitespaces
  // eslint-disable-next-line max-len
  var whitespaces = "\t\n\x0B\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";

  var whitespace = '[' + whitespaces + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$'); // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation

  var createMethod$6 = function createMethod(TYPE) {
    return function ($this) {
      var string = String(requireObjectCoercible($this));
      if (TYPE & 1) string = string.replace(ltrim, '');
      if (TYPE & 2) string = string.replace(rtrim, '');
      return string;
    };
  };

  var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
    start: createMethod$6(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
    end: createMethod$6(2),
    // `String.prototype.trim` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.trim
    trim: createMethod$6(3)
  };

  var non = "\u200B\x85\u180E"; // check that a method works with the correct list
  // of whitespaces and has a correct name

  var stringTrimForced = function stringTrimForced(METHOD_NAME) {
    return fails(function () {
      return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
    });
  };

  var $trim = stringTrim.trim; // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim

  _export({
    target: 'String',
    proto: true,
    forced: stringTrimForced('trim')
  }, {
    trim: function trim() {
      return $trim(this);
    }
  });

  var $trimStart = stringTrim.start;
  var FORCED$4 = stringTrimForced('trimStart');
  var trimStart = FORCED$4 ? function trimStart() {
    return $trimStart(this);
  } : ''.trimStart; // `String.prototype.{ trimStart, trimLeft }` methods
  // https://github.com/tc39/ecmascript-string-left-right-trim

  _export({
    target: 'String',
    proto: true,
    forced: FORCED$4
  }, {
    trimStart: trimStart,
    trimLeft: trimStart
  });

  var $trimEnd = stringTrim.end;
  var FORCED$5 = stringTrimForced('trimEnd');
  var trimEnd = FORCED$5 ? function trimEnd() {
    return $trimEnd(this);
  } : ''.trimEnd; // `String.prototype.{ trimEnd, trimRight }` methods
  // https://github.com/tc39/ecmascript-string-left-right-trim

  _export({
    target: 'String',
    proto: true,
    forced: FORCED$5
  }, {
    trimEnd: trimEnd,
    trimRight: trimEnd
  });

  var charAt$1 = stringMultibyte.charAt;
  var STRING_ITERATOR = 'String Iterator';
  var setInternalState$3 = internalState.set;
  var getInternalState$3 = internalState.getterFor(STRING_ITERATOR); // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator

  defineIterator(String, 'String', function (iterated) {
    setInternalState$3(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    }); // `%StringIteratorPrototype%.next` method
    // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState$3(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return {
      value: undefined,
      done: true
    };
    point = charAt$1(string, index);
    state.index += point.length;
    return {
      value: point,
      done: false
    };
  });

  var quot = /"/g; // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
  // https://tc39.github.io/ecma262/#sec-createhtml

  var createHtml = function createHtml(string, tag, attribute, value) {
    var S = String(requireObjectCoercible(string));
    var p1 = '<' + tag;
    if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
    return p1 + '>' + S + '</' + tag + '>';
  };

  // of a tag and escaping quotes in arguments

  var stringHtmlForced = function stringHtmlForced(METHOD_NAME) {
    return fails(function () {
      var test = ''[METHOD_NAME]('"');
      return test !== test.toLowerCase() || test.split('"').length > 3;
    });
  };

  // https://tc39.github.io/ecma262/#sec-string.prototype.anchor


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('anchor')
  }, {
    anchor: function anchor(name) {
      return createHtml(this, 'a', 'name', name);
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.big


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('big')
  }, {
    big: function big() {
      return createHtml(this, 'big', '', '');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.blink


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('blink')
  }, {
    blink: function blink() {
      return createHtml(this, 'blink', '', '');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.bold


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('bold')
  }, {
    bold: function bold() {
      return createHtml(this, 'b', '', '');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.fixed


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('fixed')
  }, {
    fixed: function fixed() {
      return createHtml(this, 'tt', '', '');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.fontcolor


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('fontcolor')
  }, {
    fontcolor: function fontcolor(color) {
      return createHtml(this, 'font', 'color', color);
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.fontsize


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('fontsize')
  }, {
    fontsize: function fontsize(size) {
      return createHtml(this, 'font', 'size', size);
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.italics


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('italics')
  }, {
    italics: function italics() {
      return createHtml(this, 'i', '', '');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.link


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('link')
  }, {
    link: function link(url) {
      return createHtml(this, 'a', 'href', url);
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.small


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('small')
  }, {
    small: function small() {
      return createHtml(this, 'small', '', '');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.strike


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('strike')
  }, {
    strike: function strike() {
      return createHtml(this, 'strike', '', '');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.sub


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('sub')
  }, {
    sub: function sub() {
      return createHtml(this, 'sub', '', '');
    }
  });

  // https://tc39.github.io/ecma262/#sec-string.prototype.sup


  _export({
    target: 'String',
    proto: true,
    forced: stringHtmlForced('sup')
  }, {
    sup: function sup() {
      return createHtml(this, 'sup', '', '');
    }
  });

  var inheritIfRequired = function inheritIfRequired($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if ( // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  var defineProperty$6 = objectDefineProperty.f;
  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var setInternalState$4 = internalState.set;
  var MATCH$2 = wellKnownSymbol('match');
  var NativeRegExp = global_1.RegExp;
  var RegExpPrototype$1 = NativeRegExp.prototype;
  var re1 = /a/g;
  var re2 = /a/g; // "new" should create a new object, old webkit bug

  var CORRECT_NEW = new NativeRegExp(re1) !== re1;
  var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;
  var FORCED$6 = descriptors && isForced_1('RegExp', !CORRECT_NEW || UNSUPPORTED_Y$2 || fails(function () {
    re2[MATCH$2] = false; // RegExp constructor can alter flags and IsRegExp works correct with @@match

    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  })); // `RegExp` constructor
  // https://tc39.github.io/ecma262/#sec-regexp-constructor

  if (FORCED$6) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = this instanceof RegExpWrapper;
      var patternIsRegExp = isRegexp(pattern);
      var flagsAreUndefined = flags === undefined;
      var sticky;

      if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
        return pattern;
      }

      if (CORRECT_NEW) {
        if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
      } else if (pattern instanceof RegExpWrapper) {
        if (flagsAreUndefined) flags = regexpFlags.call(pattern);
        pattern = pattern.source;
      }

      if (UNSUPPORTED_Y$2) {
        sticky = !!flags && flags.indexOf('y') > -1;
        if (sticky) flags = flags.replace(/y/g, '');
      }

      var result = inheritIfRequired(CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);
      if (UNSUPPORTED_Y$2 && sticky) setInternalState$4(result, {
        sticky: sticky
      });
      return result;
    };

    var proxy = function proxy(key) {
      key in RegExpWrapper || defineProperty$6(RegExpWrapper, key, {
        configurable: true,
        get: function get() {
          return NativeRegExp[key];
        },
        set: function set(it) {
          NativeRegExp[key] = it;
        }
      });
    };

    var keys$1 = getOwnPropertyNames(NativeRegExp);
    var index = 0;

    while (keys$1.length > index) {
      proxy(keys$1[index++]);
    }

    RegExpPrototype$1.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype$1;
    redefine(global_1, 'RegExp', RegExpWrapper);
  } // https://tc39.github.io/ecma262/#sec-get-regexp-@@species


  setSpecies('RegExp');

  var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y; // `RegExp.prototype.flags` getter
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags

  if (descriptors && (/./g.flags != 'g' || UNSUPPORTED_Y$3)) {
    objectDefineProperty.f(RegExp.prototype, 'flags', {
      configurable: true,
      get: regexpFlags
    });
  }

  var UNSUPPORTED_Y$4 = regexpStickyHelpers.UNSUPPORTED_Y;
  var defineProperty$7 = objectDefineProperty.f;
  var getInternalState$4 = internalState.get;
  var RegExpPrototype$2 = RegExp.prototype; // `RegExp.prototype.sticky` getter

  if (descriptors && UNSUPPORTED_Y$4) {
    defineProperty$7(RegExp.prototype, 'sticky', {
      configurable: true,
      get: function get() {
        if (this === RegExpPrototype$2) return undefined; // We can't use InternalStateModule.getterFor because
        // we don't add metadata for regexps created by a literal.

        if (this instanceof RegExp) {
          return !!getInternalState$4(this).sticky;
        }

        throw TypeError('Incompatible receiver, RegExp required');
      }
    });
  }

  var DELEGATES_TO_EXEC = function () {
    var execCalled = false;
    var re = /[ac]/;

    re.exec = function () {
      execCalled = true;
      return /./.exec.apply(this, arguments);
    };

    return re.test('abc') === true && execCalled;
  }();

  var nativeTest = /./.test;
  _export({
    target: 'RegExp',
    proto: true,
    forced: !DELEGATES_TO_EXEC
  }, {
    test: function test(str) {
      if (typeof this.exec !== 'function') {
        return nativeTest.call(this, str);
      }

      var result = this.exec(str);

      if (result !== null && !isObject(result)) {
        throw new Error('RegExp exec method returned something other than an Object or null');
      }

      return !!result;
    }
  });

  var TO_STRING = 'toString';
  var RegExpPrototype$3 = RegExp.prototype;
  var nativeToString = RegExpPrototype$3[TO_STRING];
  var NOT_GENERIC = fails(function () {
    return nativeToString.call({
      source: 'a',
      flags: 'b'
    }) != '/a/b';
  }); // FF44- RegExp#toString has a wrong name

  var INCORRECT_NAME = nativeToString.name != TO_STRING; // `RegExp.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring

  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine(RegExp.prototype, TO_STRING, function toString() {
      var R = anObject(this);
      var p = String(R.source);
      var rf = R.flags;
      var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$3) ? regexpFlags.call(R) : rf);
      return '/' + p + '/' + f;
    }, {
      unsafe: true
    });
  }

  var trim = stringTrim.trim;
  var $parseInt = global_1.parseInt;
  var hex = /^[+-]?0[Xx]/;
  var FORCED$7 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22; // `parseInt` method
  // https://tc39.github.io/ecma262/#sec-parseint-string-radix

  var numberParseInt = FORCED$7 ? function parseInt(string, radix) {
    var S = trim(String(string));
    return $parseInt(S, radix >>> 0 || (hex.test(S) ? 16 : 10));
  } : $parseInt;

  // https://tc39.github.io/ecma262/#sec-parseint-string-radix

  _export({
    global: true,
    forced: parseInt != numberParseInt
  }, {
    parseInt: numberParseInt
  });

  var trim$1 = stringTrim.trim;
  var $parseFloat = global_1.parseFloat;
  var FORCED$8 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity; // `parseFloat` method
  // https://tc39.github.io/ecma262/#sec-parsefloat-string

  var numberParseFloat = FORCED$8 ? function parseFloat(string) {
    var trimmedString = trim$1(String(string));
    var result = $parseFloat(trimmedString);
    return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
  } : $parseFloat;

  // https://tc39.github.io/ecma262/#sec-parsefloat-string

  _export({
    global: true,
    forced: parseFloat != numberParseFloat
  }, {
    parseFloat: numberParseFloat
  });

  var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
  var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;
  var defineProperty$8 = objectDefineProperty.f;
  var trim$2 = stringTrim.trim;
  var NUMBER = 'Number';
  var NativeNumber = global_1[NUMBER];
  var NumberPrototype = NativeNumber.prototype; // Opera ~12 has broken Object#toString

  var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER; // `ToNumber` abstract operation
  // https://tc39.github.io/ecma262/#sec-tonumber

  var toNumber = function toNumber(argument) {
    var it = toPrimitive(argument, false);
    var first, third, radix, maxCode, digits, length, index, code;

    if (typeof it == 'string' && it.length > 2) {
      it = trim$2(it);
      first = it.charCodeAt(0);

      if (first === 43 || first === 45) {
        third = it.charCodeAt(2);
        if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (it.charCodeAt(1)) {
          case 66:
          case 98:
            radix = 2;
            maxCode = 49;
            break;
          // fast equal of /^0b[01]+$/i

          case 79:
          case 111:
            radix = 8;
            maxCode = 55;
            break;
          // fast equal of /^0o[0-7]+$/i

          default:
            return +it;
        }

        digits = it.slice(2);
        length = digits.length;

        for (index = 0; index < length; index++) {
          code = digits.charCodeAt(index); // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols

          if (code < 48 || code > maxCode) return NaN;
        }

        return parseInt(digits, radix);
      }
    }

    return +it;
  }; // `Number` constructor
  // https://tc39.github.io/ecma262/#sec-number-constructor


  if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
    var NumberWrapper = function Number(value) {
      var it = arguments.length < 1 ? 0 : value;
      var dummy = this;
      return dummy instanceof NumberWrapper // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () {
        NumberPrototype.valueOf.call(dummy);
      }) : classofRaw(dummy) != NUMBER) ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
    };

    for (var keys$2 = descriptors ? getOwnPropertyNames$1(NativeNumber) : ( // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' + // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), j = 0, key; keys$2.length > j; j++) {
      if (has(NativeNumber, key = keys$2[j]) && !has(NumberWrapper, key)) {
        defineProperty$8(NumberWrapper, key, getOwnPropertyDescriptor$6(NativeNumber, key));
      }
    }

    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine(global_1, NUMBER, NumberWrapper);
  }

  // https://tc39.github.io/ecma262/#sec-number.epsilon

  _export({
    target: 'Number',
    stat: true
  }, {
    EPSILON: Math.pow(2, -52)
  });

  var globalIsFinite = global_1.isFinite; // `Number.isFinite` method
  // https://tc39.github.io/ecma262/#sec-number.isfinite

  var numberIsFinite = Number.isFinite || function isFinite(it) {
    return typeof it == 'number' && globalIsFinite(it);
  };

  // https://tc39.github.io/ecma262/#sec-number.isfinite

  _export({
    target: 'Number',
    stat: true
  }, {
    isFinite: numberIsFinite
  });

  var floor$2 = Math.floor; // `Number.isInteger` method implementation
  // https://tc39.github.io/ecma262/#sec-number.isinteger

  var isInteger = function isInteger(it) {
    return !isObject(it) && isFinite(it) && floor$2(it) === it;
  };

  // https://tc39.github.io/ecma262/#sec-number.isinteger

  _export({
    target: 'Number',
    stat: true
  }, {
    isInteger: isInteger
  });

  // https://tc39.github.io/ecma262/#sec-number.isnan

  _export({
    target: 'Number',
    stat: true
  }, {
    isNaN: function isNaN(number) {
      // eslint-disable-next-line no-self-compare
      return number != number;
    }
  });

  var abs = Math.abs; // `Number.isSafeInteger` method
  // https://tc39.github.io/ecma262/#sec-number.issafeinteger

  _export({
    target: 'Number',
    stat: true
  }, {
    isSafeInteger: function isSafeInteger(number) {
      return isInteger(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
    }
  });

  // https://tc39.github.io/ecma262/#sec-number.max_safe_integer

  _export({
    target: 'Number',
    stat: true
  }, {
    MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
  });

  // https://tc39.github.io/ecma262/#sec-number.min_safe_integer

  _export({
    target: 'Number',
    stat: true
  }, {
    MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
  });

  // https://tc39.github.io/ecma262/#sec-number.parseFloat

  _export({
    target: 'Number',
    stat: true,
    forced: Number.parseFloat != numberParseFloat
  }, {
    parseFloat: numberParseFloat
  });

  // https://tc39.github.io/ecma262/#sec-number.parseint

  _export({
    target: 'Number',
    stat: true,
    forced: Number.parseInt != numberParseInt
  }, {
    parseInt: numberParseInt
  });

  // https://tc39.github.io/ecma262/#sec-thisnumbervalue

  var thisNumberValue = function thisNumberValue(value) {
    if (typeof value != 'number' && classofRaw(value) != 'Number') {
      throw TypeError('Incorrect invocation');
    }

    return +value;
  };

  var nativeToFixed = 1.0.toFixed;
  var floor$3 = Math.floor;

  var pow = function pow(x, n, acc) {
    return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
  };

  var log = function log(x) {
    var n = 0;
    var x2 = x;

    while (x2 >= 4096) {
      n += 12;
      x2 /= 4096;
    }

    while (x2 >= 2) {
      n += 1;
      x2 /= 2;
    }

    return n;
  };

  var FORCED$9 = nativeToFixed && (0.00008.toFixed(3) !== '0.000' || 0.9.toFixed(0) !== '1' || 1.255.toFixed(2) !== '1.25' || 1000000000000000128.0.toFixed(0) !== '1000000000000000128') || !fails(function () {
    // V8 ~ Android 4.3-
    nativeToFixed.call({});
  }); // `Number.prototype.toFixed` method
  // https://tc39.github.io/ecma262/#sec-number.prototype.tofixed

  _export({
    target: 'Number',
    proto: true,
    forced: FORCED$9
  }, {
    // eslint-disable-next-line max-statements
    toFixed: function toFixed(fractionDigits) {
      var number = thisNumberValue(this);
      var fractDigits = toInteger(fractionDigits);
      var data = [0, 0, 0, 0, 0, 0];
      var sign = '';
      var result = '0';
      var e, z, j, k;

      var multiply = function multiply(n, c) {
        var index = -1;
        var c2 = c;

        while (++index < 6) {
          c2 += n * data[index];
          data[index] = c2 % 1e7;
          c2 = floor$3(c2 / 1e7);
        }
      };

      var divide = function divide(n) {
        var index = 6;
        var c = 0;

        while (--index >= 0) {
          c += data[index];
          data[index] = floor$3(c / n);
          c = c % n * 1e7;
        }
      };

      var dataToString = function dataToString() {
        var index = 6;
        var s = '';

        while (--index >= 0) {
          if (s !== '' || index === 0 || data[index] !== 0) {
            var t = String(data[index]);
            s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
          }
        }

        return s;
      };

      if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits'); // eslint-disable-next-line no-self-compare

      if (number != number) return 'NaN';
      if (number <= -1e21 || number >= 1e21) return String(number);

      if (number < 0) {
        sign = '-';
        number = -number;
      }

      if (number > 1e-21) {
        e = log(number * pow(2, 69, 1)) - 69;
        z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
        z *= 0x10000000000000;
        e = 52 - e;

        if (e > 0) {
          multiply(0, z);
          j = fractDigits;

          while (j >= 7) {
            multiply(1e7, 0);
            j -= 7;
          }

          multiply(pow(10, j, 1), 0);
          j = e - 1;

          while (j >= 23) {
            divide(1 << 23);
            j -= 23;
          }

          divide(1 << j);
          multiply(1, 1);
          divide(2);
          result = dataToString();
        } else {
          multiply(0, z);
          multiply(1 << -e, 0);
          result = dataToString() + stringRepeat.call('0', fractDigits);
        }
      }

      if (fractDigits > 0) {
        k = result.length;
        result = sign + (k <= fractDigits ? '0.' + stringRepeat.call('0', fractDigits - k) + result : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
      } else {
        result = sign + result;
      }

      return result;
    }
  });

  var nativeToPrecision = 1.0.toPrecision;
  var FORCED$a = fails(function () {
    // IE7-
    return nativeToPrecision.call(1, undefined) !== '1';
  }) || !fails(function () {
    // V8 ~ Android 4.3-
    nativeToPrecision.call({});
  }); // `Number.prototype.toPrecision` method
  // https://tc39.github.io/ecma262/#sec-number.prototype.toprecision

  _export({
    target: 'Number',
    proto: true,
    forced: FORCED$a
  }, {
    toPrecision: function toPrecision(precision) {
      return precision === undefined ? nativeToPrecision.call(thisNumberValue(this)) : nativeToPrecision.call(thisNumberValue(this), precision);
    }
  });

  var log$1 = Math.log; // `Math.log1p` method implementation
  // https://tc39.github.io/ecma262/#sec-math.log1p

  var mathLog1p = Math.log1p || function log1p(x) {
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log$1(1 + x);
  };

  var nativeAcosh = Math.acosh;
  var log$2 = Math.log;
  var sqrt = Math.sqrt;
  var LN2 = Math.LN2;
  var FORCED$b = !nativeAcosh // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  || Math.floor(nativeAcosh(Number.MAX_VALUE)) != 710 // Tor Browser bug: Math.acosh(Infinity) -> NaN
  || nativeAcosh(Infinity) != Infinity; // `Math.acosh` method
  // https://tc39.github.io/ecma262/#sec-math.acosh

  _export({
    target: 'Math',
    stat: true,
    forced: FORCED$b
  }, {
    acosh: function acosh(x) {
      return (x = +x) < 1 ? NaN : x > 94906265.62425156 ? log$2(x) + LN2 : mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
    }
  });

  var nativeAsinh = Math.asinh;
  var log$3 = Math.log;
  var sqrt$1 = Math.sqrt;

  function asinh(x) {
    return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log$3(x + sqrt$1(x * x + 1));
  } // `Math.asinh` method
  // https://tc39.github.io/ecma262/#sec-math.asinh
  // Tor Browser bug: Math.asinh(0) -> -0


  _export({
    target: 'Math',
    stat: true,
    forced: !(nativeAsinh && 1 / nativeAsinh(0) > 0)
  }, {
    asinh: asinh
  });

  var nativeAtanh = Math.atanh;
  var log$4 = Math.log; // `Math.atanh` method
  // https://tc39.github.io/ecma262/#sec-math.atanh
  // Tor Browser bug: Math.atanh(-0) -> 0

  _export({
    target: 'Math',
    stat: true,
    forced: !(nativeAtanh && 1 / nativeAtanh(-0) < 0)
  }, {
    atanh: function atanh(x) {
      return (x = +x) == 0 ? x : log$4((1 + x) / (1 - x)) / 2;
    }
  });

  // `Math.sign` method implementation
  // https://tc39.github.io/ecma262/#sec-math.sign
  var mathSign = Math.sign || function sign(x) {
    // eslint-disable-next-line no-self-compare
    return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
  };

  var abs$1 = Math.abs;
  var pow$1 = Math.pow; // `Math.cbrt` method
  // https://tc39.github.io/ecma262/#sec-math.cbrt

  _export({
    target: 'Math',
    stat: true
  }, {
    cbrt: function cbrt(x) {
      return mathSign(x = +x) * pow$1(abs$1(x), 1 / 3);
    }
  });

  var floor$4 = Math.floor;
  var log$5 = Math.log;
  var LOG2E = Math.LOG2E; // `Math.clz32` method
  // https://tc39.github.io/ecma262/#sec-math.clz32

  _export({
    target: 'Math',
    stat: true
  }, {
    clz32: function clz32(x) {
      return (x >>>= 0) ? 31 - floor$4(log$5(x + 0.5) * LOG2E) : 32;
    }
  });

  var nativeExpm1 = Math.expm1;
  var exp = Math.exp; // `Math.expm1` method implementation
  // https://tc39.github.io/ecma262/#sec-math.expm1

  var mathExpm1 = !nativeExpm1 // Old FF bug
  || nativeExpm1(10) > 22025.465794806719 || nativeExpm1(10) < 22025.4657948067165168 // Tor Browser bug
  || nativeExpm1(-2e-17) != -2e-17 ? function expm1(x) {
    return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
  } : nativeExpm1;

  var nativeCosh = Math.cosh;
  var abs$2 = Math.abs;
  var E = Math.E; // `Math.cosh` method
  // https://tc39.github.io/ecma262/#sec-math.cosh

  _export({
    target: 'Math',
    stat: true,
    forced: !nativeCosh || nativeCosh(710) === Infinity
  }, {
    cosh: function cosh(x) {
      var t = mathExpm1(abs$2(x) - 1) + 1;
      return (t + 1 / (t * E * E)) * (E / 2);
    }
  });

  // https://tc39.github.io/ecma262/#sec-math.expm1

  _export({
    target: 'Math',
    stat: true,
    forced: mathExpm1 != Math.expm1
  }, {
    expm1: mathExpm1
  });

  var abs$3 = Math.abs;
  var pow$2 = Math.pow;
  var EPSILON = pow$2(2, -52);
  var EPSILON32 = pow$2(2, -23);
  var MAX32 = pow$2(2, 127) * (2 - EPSILON32);
  var MIN32 = pow$2(2, -126);

  var roundTiesToEven = function roundTiesToEven(n) {
    return n + 1 / EPSILON - 1 / EPSILON;
  }; // `Math.fround` method implementation
  // https://tc39.github.io/ecma262/#sec-math.fround


  var mathFround = Math.fround || function fround(x) {
    var $abs = abs$3(x);
    var $sign = mathSign(x);
    var a, result;
    if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs); // eslint-disable-next-line no-self-compare

    if (result > MAX32 || result != result) return $sign * Infinity;
    return $sign * result;
  };

  // https://tc39.github.io/ecma262/#sec-math.fround

  _export({
    target: 'Math',
    stat: true
  }, {
    fround: mathFround
  });

  var $hypot = Math.hypot;
  var abs$4 = Math.abs;
  var sqrt$2 = Math.sqrt; // Chrome 77 bug
  // https://bugs.chromium.org/p/v8/issues/detail?id=9546

  var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity; // `Math.hypot` method
  // https://tc39.github.io/ecma262/#sec-math.hypot

  _export({
    target: 'Math',
    stat: true,
    forced: BUGGY
  }, {
    hypot: function hypot(value1, value2) {
      // eslint-disable-line no-unused-vars
      var sum = 0;
      var i = 0;
      var aLen = arguments.length;
      var larg = 0;
      var arg, div;

      while (i < aLen) {
        arg = abs$4(arguments[i++]);

        if (larg < arg) {
          div = larg / arg;
          sum = sum * div * div + 1;
          larg = arg;
        } else if (arg > 0) {
          div = arg / larg;
          sum += div * div;
        } else sum += arg;
      }

      return larg === Infinity ? Infinity : larg * sqrt$2(sum);
    }
  });

  var nativeImul = Math.imul;
  var FORCED$c = fails(function () {
    return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
  }); // `Math.imul` method
  // https://tc39.github.io/ecma262/#sec-math.imul
  // some WebKit versions fails with big numbers, some has wrong arity

  _export({
    target: 'Math',
    stat: true,
    forced: FORCED$c
  }, {
    imul: function imul(x, y) {
      var UINT16 = 0xFFFF;
      var xn = +x;
      var yn = +y;
      var xl = UINT16 & xn;
      var yl = UINT16 & yn;
      return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
    }
  });

  var log$6 = Math.log;
  var LOG10E = Math.LOG10E; // `Math.log10` method
  // https://tc39.github.io/ecma262/#sec-math.log10

  _export({
    target: 'Math',
    stat: true
  }, {
    log10: function log10(x) {
      return log$6(x) * LOG10E;
    }
  });

  // https://tc39.github.io/ecma262/#sec-math.log1p

  _export({
    target: 'Math',
    stat: true
  }, {
    log1p: mathLog1p
  });

  var log$7 = Math.log;
  var LN2$1 = Math.LN2; // `Math.log2` method
  // https://tc39.github.io/ecma262/#sec-math.log2

  _export({
    target: 'Math',
    stat: true
  }, {
    log2: function log2(x) {
      return log$7(x) / LN2$1;
    }
  });

  // https://tc39.github.io/ecma262/#sec-math.sign

  _export({
    target: 'Math',
    stat: true
  }, {
    sign: mathSign
  });

  var abs$5 = Math.abs;
  var exp$1 = Math.exp;
  var E$1 = Math.E;
  var FORCED$d = fails(function () {
    return Math.sinh(-2e-17) != -2e-17;
  }); // `Math.sinh` method
  // https://tc39.github.io/ecma262/#sec-math.sinh
  // V8 near Chromium 38 has a problem with very small numbers

  _export({
    target: 'Math',
    stat: true,
    forced: FORCED$d
  }, {
    sinh: function sinh(x) {
      return abs$5(x = +x) < 1 ? (mathExpm1(x) - mathExpm1(-x)) / 2 : (exp$1(x - 1) - exp$1(-x - 1)) * (E$1 / 2);
    }
  });

  var exp$2 = Math.exp; // `Math.tanh` method
  // https://tc39.github.io/ecma262/#sec-math.tanh

  _export({
    target: 'Math',
    stat: true
  }, {
    tanh: function tanh(x) {
      var a = mathExpm1(x = +x);
      var b = mathExpm1(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
    }
  });

  // https://tc39.github.io/ecma262/#sec-math-@@tostringtag

  setToStringTag(Math, 'Math', true);

  var ceil$2 = Math.ceil;
  var floor$5 = Math.floor; // `Math.trunc` method
  // https://tc39.github.io/ecma262/#sec-math.trunc

  _export({
    target: 'Math',
    stat: true
  }, {
    trunc: function trunc(it) {
      return (it > 0 ? floor$5 : ceil$2)(it);
    }
  });

  // https://tc39.github.io/ecma262/#sec-date.now

  _export({
    target: 'Date',
    stat: true
  }, {
    now: function now() {
      return new Date().getTime();
    }
  });

  var FORCED$e = fails(function () {
    return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({
      toISOString: function toISOString() {
        return 1;
      }
    }) !== 1;
  }); // `Date.prototype.toJSON` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.tojson

  _export({
    target: 'Date',
    proto: true,
    forced: FORCED$e
  }, {
    // eslint-disable-next-line no-unused-vars
    toJSON: function toJSON(key) {
      var O = toObject(this);
      var pv = toPrimitive(O);
      return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
    }
  });

  var padStart = stringPad.start;
  var abs$6 = Math.abs;
  var DatePrototype = Date.prototype;
  var getTime = DatePrototype.getTime;
  var nativeDateToISOString = DatePrototype.toISOString; // `Date.prototype.toISOString` method implementation
  // https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
  // PhantomJS / old WebKit fails here:

  var dateToIsoString = fails(function () {
    return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
  }) || !fails(function () {
    nativeDateToISOString.call(new Date(NaN));
  }) ? function toISOString() {
    if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
    var date = this;
    var year = date.getUTCFullYear();
    var milliseconds = date.getUTCMilliseconds();
    var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
    return sign + padStart(abs$6(year), sign ? 6 : 4, 0) + '-' + padStart(date.getUTCMonth() + 1, 2, 0) + '-' + padStart(date.getUTCDate(), 2, 0) + 'T' + padStart(date.getUTCHours(), 2, 0) + ':' + padStart(date.getUTCMinutes(), 2, 0) + ':' + padStart(date.getUTCSeconds(), 2, 0) + '.' + padStart(milliseconds, 3, 0) + 'Z';
  } : nativeDateToISOString;

  // https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
  // PhantomJS / old WebKit has a broken implementations

  _export({
    target: 'Date',
    proto: true,
    forced: Date.prototype.toISOString !== dateToIsoString
  }, {
    toISOString: dateToIsoString
  });

  var DatePrototype$1 = Date.prototype;
  var INVALID_DATE = 'Invalid Date';
  var TO_STRING$1 = 'toString';
  var nativeDateToString = DatePrototype$1[TO_STRING$1];
  var getTime$1 = DatePrototype$1.getTime; // `Date.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.tostring

  if (new Date(NaN) + '' != INVALID_DATE) {
    redefine(DatePrototype$1, TO_STRING$1, function toString() {
      var value = getTime$1.call(this); // eslint-disable-next-line no-self-compare

      return value === value ? nativeDateToString.call(this) : INVALID_DATE;
    });
  }

  var dateToPrimitive = function dateToPrimitive(hint) {
    if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
      throw TypeError('Incorrect hint');
    }

    return toPrimitive(anObject(this), hint !== 'number');
  };

  var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');
  var DatePrototype$2 = Date.prototype; // `Date.prototype[@@toPrimitive]` method
  // https://tc39.github.io/ecma262/#sec-date.prototype-@@toprimitive

  if (!(TO_PRIMITIVE$1 in DatePrototype$2)) {
    createNonEnumerableProperty(DatePrototype$2, TO_PRIMITIVE$1, dateToPrimitive);
  }

  var $stringify$1 = getBuiltIn('JSON', 'stringify');
  var re = /[\uD800-\uDFFF]/g;
  var low = /^[\uD800-\uDBFF]$/;
  var hi = /^[\uDC00-\uDFFF]$/;

  var fix = function fix(match, offset, string) {
    var prev = string.charAt(offset - 1);
    var next = string.charAt(offset + 1);

    if (low.test(match) && !hi.test(next) || hi.test(match) && !low.test(prev)) {
      return "\\u" + match.charCodeAt(0).toString(16);
    }

    return match;
  };

  var FORCED$f = fails(function () {
    return $stringify$1("\uDF06\uD834") !== "\"\\udf06\\ud834\"" || $stringify$1("\uDEAD") !== "\"\\udead\"";
  });

  if ($stringify$1) {
    // https://github.com/tc39/proposal-well-formed-stringify
    _export({
      target: 'JSON',
      stat: true,
      forced: FORCED$f
    }, {
      // eslint-disable-next-line no-unused-vars
      stringify: function stringify(it, replacer, space) {
        var result = $stringify$1.apply(null, arguments);
        return typeof result == 'string' ? result.replace(re, fix) : result;
      }
    });
  }

  // https://tc39.github.io/ecma262/#sec-json-@@tostringtag

  setToStringTag(global_1.JSON, 'JSON', true);

  var nativePromiseConstructor = global_1.Promise;

  var redefineAll = function redefineAll(target, src, options) {
    for (var key in src) {
      redefine(target, key, src[key], options);
    }

    return target;
  };

  var anInstance = function anInstance(it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    }

    return it;
  };

  var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

  var location = global_1.location;
  var set$2 = global_1.setImmediate;
  var clear = global_1.clearImmediate;
  var process$1 = global_1.process;
  var MessageChannel = global_1.MessageChannel;
  var Dispatch = global_1.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run = function run(id) {
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };

  var runner = function runner(id) {
    return function () {
      run(id);
    };
  };

  var listener = function listener(event) {
    run(event.data);
  };

  var post = function post(id) {
    // old engines have not location.origin
    global_1.postMessage(id + '', location.protocol + '//' + location.host);
  }; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


  if (!set$2 || !clear) {
    set$2 = function setImmediate(fn) {
      var args = [];
      var i = 1;

      while (arguments.length > i) {
        args.push(arguments[i++]);
      }

      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
      };

      defer(counter);
      return counter;
    };

    clear = function clearImmediate(id) {
      delete queue[id];
    }; // Node.js 0.8-


    if (classofRaw(process$1) == 'process') {
      defer = function defer(id) {
        process$1.nextTick(runner(id));
      }; // Sphere (JS game engine) Dispatch API

    } else if (Dispatch && Dispatch.now) {
      defer = function defer(id) {
        Dispatch.now(runner(id));
      }; // Browsers with MessageChannel, includes WebWorkers
      // except iOS - https://github.com/zloirock/core-js/issues/624

    } else if (MessageChannel && !engineIsIos) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = functionBindContext(port.postMessage, port, 1); // Browsers with postMessage, skip WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post) && location.protocol !== 'file:') {
      defer = post;
      global_1.addEventListener('message', listener, false); // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
      defer = function defer(id) {
        html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      }; // Rest old browsers

    } else {
      defer = function defer(id) {
        setTimeout(runner(id), 0);
      };
    }
  }

  var task = {
    set: set$2,
    clear: clear
  };

  var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor.f;
  var macrotask = task.set;
  var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
  var process$2 = global_1.process;
  var Promise$1 = global_1.Promise;
  var IS_NODE = classofRaw(process$2) == 'process'; // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`

  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$7(global_1, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
  var flush, head, last, notify, toggle, node, promise, then; // modern engines have queueMicrotask method

  if (!queueMicrotask) {
    flush = function flush() {
      var parent, fn;
      if (IS_NODE && (parent = process$2.domain)) parent.exit();

      while (head) {
        fn = head.fn;
        head = head.next;

        try {
          fn();
        } catch (error) {
          if (head) notify();else last = undefined;
          throw error;
        }
      }

      last = undefined;
      if (parent) parent.enter();
    }; // Node.js


    if (IS_NODE) {
      notify = function notify() {
        process$2.nextTick(flush);
      }; // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339

    } else if (MutationObserver && !engineIsIos) {
      toggle = true;
      node = document.createTextNode('');
      new MutationObserver(flush).observe(node, {
        characterData: true
      });

      notify = function notify() {
        node.data = toggle = !toggle;
      }; // environments with maybe non-completely correct, but existent Promise

    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      then = promise.then;

      notify = function notify() {
        then.call(promise, flush);
      }; // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessag
      // - onreadystatechange
      // - setTimeout

    } else {
      notify = function notify() {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global_1, flush);
      };
    }
  }

  var microtask = queueMicrotask || function (fn) {
    var task$$1 = {
      fn: fn,
      next: undefined
    };
    if (last) last.next = task$$1;

    if (!head) {
      head = task$$1;
      notify();
    }

    last = task$$1;
  };

  var PromiseCapability = function PromiseCapability(C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction$1(resolve);
    this.reject = aFunction$1(reject);
  }; // 25.4.1.5 NewPromiseCapability(C)


  var f$7 = function f(C) {
    return new PromiseCapability(C);
  };

  var newPromiseCapability = {
    f: f$7
  };

  var promiseResolve = function promiseResolve(C, x) {
    anObject(C);
    if (isObject(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var hostReportErrors = function hostReportErrors(a, b) {
    var console = global_1.console;

    if (console && console.error) {
      arguments.length === 1 ? console.error(a) : console.error(a, b);
    }
  };

  var perform = function perform(exec) {
    try {
      return {
        error: false,
        value: exec()
      };
    } catch (error) {
      return {
        error: true,
        value: error
      };
    }
  };

  var task$1 = task.set;
  var SPECIES$6 = wellKnownSymbol('species');
  var PROMISE = 'Promise';
  var getInternalState$5 = internalState.get;
  var setInternalState$5 = internalState.set;
  var getInternalPromiseState = internalState.getterFor(PROMISE);
  var PromiseConstructor = nativePromiseConstructor;
  var TypeError$1 = global_1.TypeError;
  var document$2 = global_1.document;
  var process$3 = global_1.process;
  var $fetch = getBuiltIn('fetch');
  var newPromiseCapability$1 = newPromiseCapability.f;
  var newGenericPromiseCapability = newPromiseCapability$1;
  var IS_NODE$1 = classofRaw(process$3) == 'process';
  var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;
  var FORCED$g = isForced_1(PROMISE, function () {
    var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);

    if (!GLOBAL_CORE_JS_PROMISE) {
      // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // We can't detect it synchronously, so just check versions
      if (engineV8Version === 66) return true; // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test

      if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
    } // We need Promise#finally in the pure version for preventing prototype pollution
    // deoptimization and performance degradation
    // https://github.com/zloirock/core-js/issues/679

    if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false; // Detect correctness of subclassing with @@species support

    var promise = PromiseConstructor.resolve(1);

    var FakePromise = function FakePromise(exec) {
      exec(function () {
        /* empty */
      }, function () {
        /* empty */
      });
    };

    var constructor = promise.constructor = {};
    constructor[SPECIES$6] = FakePromise;
    return !(promise.then(function () {
      /* empty */
    }) instanceof FakePromise);
  });
  var INCORRECT_ITERATION$1 = FORCED$g || !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () {
      /* empty */
    });
  }); // helpers

  var isThenable = function isThenable(it) {
    var then;
    return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };

  var notify$1 = function notify(promise, state, isReject) {
    if (state.notified) return;
    state.notified = true;
    var chain = state.reactions;
    microtask(function () {
      var value = state.value;
      var ok = state.state == FULFILLED;
      var index = 0; // variable length - can't use forEach

      while (chain.length > index) {
        var reaction = chain[index++];
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;

        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
              state.rejection = HANDLED;
            }

            if (handler === true) result = value;else {
              if (domain) domain.enter();
              result = handler(value); // can throw

              if (domain) {
                domain.exit();
                exited = true;
              }
            }

            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (error) {
          if (domain && !exited) domain.exit();
          reject(error);
        }
      }

      state.reactions = [];
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(promise, state);
    });
  };

  var dispatchEvent = function dispatchEvent(name, promise, reason) {
    var event, handler;

    if (DISPATCH_EVENT) {
      event = document$2.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global_1.dispatchEvent(event);
    } else event = {
      promise: promise,
      reason: reason
    };

    if (handler = global_1['on' + name]) handler(event);else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function onUnhandled(promise, state) {
    task$1.call(global_1, function () {
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;

      if (IS_UNHANDLED) {
        result = perform(function () {
          if (IS_NODE$1) {
            process$3.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

        state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function isUnhandled(state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function onHandleUnhandled(promise, state) {
    task$1.call(global_1, function () {
      if (IS_NODE$1) {
        process$3.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind = function bind(fn, promise, state, unwrap) {
    return function (value) {
      fn(promise, state, value, unwrap);
    };
  };

  var internalReject = function internalReject(promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify$1(promise, state, true);
  };

  var internalResolve = function internalResolve(promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;

    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);

      if (then) {
        microtask(function () {
          var wrapper = {
            done: false
          };

          try {
            then.call(value, bind(internalResolve, promise, wrapper, state), bind(internalReject, promise, wrapper, state));
          } catch (error) {
            internalReject(promise, wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify$1(promise, state, false);
      }
    } catch (error) {
      internalReject(promise, {
        done: false
      }, error, state);
    }
  }; // constructor polyfill


  if (FORCED$g) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromiseConstructor, PROMISE);
      aFunction$1(executor);
      Internal.call(this);
      var state = getInternalState$5(this);

      try {
        executor(bind(internalResolve, this, state), bind(internalReject, this, state));
      } catch (error) {
        internalReject(this, state, error);
      }
    }; // eslint-disable-next-line no-unused-vars


    Internal = function Promise(executor) {
      setInternalState$5(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: [],
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };

    Internal.prototype = redefineAll(PromiseConstructor.prototype, {
      // `Promise.prototype.then` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.then
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
        state.parent = true;
        state.reactions.push(reaction);
        if (state.state != PENDING) notify$1(this, state, false);
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
      'catch': function _catch(onRejected) {
        return this.then(undefined, onRejected);
      }
    });

    OwnPromiseCapability = function OwnPromiseCapability() {
      var promise = new Internal();
      var state = getInternalState$5(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, promise, state);
      this.reject = bind(internalReject, promise, state);
    };

    newPromiseCapability.f = newPromiseCapability$1 = function newPromiseCapability$$1(C) {
      return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
    };

    if (typeof nativePromiseConstructor == 'function') {
      nativeThen = nativePromiseConstructor.prototype.then; // wrap native Promise#then for native async functions

      redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          nativeThen.call(that, resolve, reject);
        }).then(onFulfilled, onRejected); // https://github.com/zloirock/core-js/issues/640
      }, {
        unsafe: true
      }); // wrap fetch result

      if (typeof $fetch == 'function') _export({
        global: true,
        enumerable: true,
        forced: true
      }, {
        // eslint-disable-next-line no-unused-vars
        fetch: function fetch(input
        /* , init */
        ) {
          return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
        }
      });
    }
  }

  _export({
    global: true,
    wrap: true,
    forced: FORCED$g
  }, {
    Promise: PromiseConstructor
  });
  setToStringTag(PromiseConstructor, PROMISE, false, true);
  setSpecies(PROMISE);
  PromiseWrapper = getBuiltIn(PROMISE); // statics

  _export({
    target: PROMISE,
    stat: true,
    forced: FORCED$g
  }, {
    // `Promise.reject` method
    // https://tc39.github.io/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability$1(this);
      capability.reject.call(undefined, r);
      return capability.promise;
    }
  });
  _export({
    target: PROMISE,
    stat: true,
    forced: FORCED$g
  }, {
    // `Promise.resolve` method
    // https://tc39.github.io/ecma262/#sec-promise.resolve
    resolve: function resolve(x) {
      return promiseResolve(this, x);
    }
  });
  _export({
    target: PROMISE,
    stat: true,
    forced: INCORRECT_ITERATION$1
  }, {
    // `Promise.all` method
    // https://tc39.github.io/ecma262/#sec-promise.all
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction$1(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate_1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          $promiseResolve.call(C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    },
    // `Promise.race` method
    // https://tc39.github.io/ecma262/#sec-promise.race
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction$1(C.resolve);
        iterate_1(iterable, function (promise) {
          $promiseResolve.call(C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  // https://github.com/tc39/proposal-promise-allSettled


  _export({
    target: 'Promise',
    stat: true
  }, {
    allSettled: function allSettled(iterable) {
      var C = this;
      var capability = newPromiseCapability.f(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var promiseResolve = aFunction$1(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate_1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          promiseResolve.call(C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = {
              status: 'fulfilled',
              value: value
            };
            --remaining || resolve(values);
          }, function (e) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = {
              status: 'rejected',
              reason: e
            };
            --remaining || resolve(values);
          });
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  var NON_GENERIC = !!nativePromiseConstructor && fails(function () {
    nativePromiseConstructor.prototype['finally'].call({
      then: function then() {
        /* empty */
      }
    }, function () {
      /* empty */
    });
  }); // `Promise.prototype.finally` method
  // https://tc39.github.io/ecma262/#sec-promise.prototype.finally

  _export({
    target: 'Promise',
    proto: true,
    real: true,
    forced: NON_GENERIC
  }, {
    'finally': function _finally(onFinally) {
      var C = speciesConstructor(this, getBuiltIn('Promise'));
      var isFunction = typeof onFinally == 'function';
      return this.then(isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () {
          return x;
        });
      } : onFinally, isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () {
          throw e;
        });
      } : onFinally);
    }
  }); // patch native Promise.prototype for native async functions

  if (typeof nativePromiseConstructor == 'function' && !nativePromiseConstructor.prototype['finally']) {
    redefine(nativePromiseConstructor.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
  }

  var collection = function collection(CONSTRUCTOR_NAME, wrapper, common) {
    var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
    var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
    var ADDER = IS_MAP ? 'set' : 'add';
    var NativeConstructor = global_1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var Constructor = NativeConstructor;
    var exported = {};

    var fixMethod = function fixMethod(KEY) {
      var nativeMethod = NativePrototype[KEY];
      redefine(NativePrototype, KEY, KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      });
    }; // eslint-disable-next-line max-len


    if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    })))) {
      // create collection constructor
      Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
      internalMetadata.REQUIRED = true;
    } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
      var instance = new Constructor(); // early implementations not supports chaining

      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance; // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false

      var THROWS_ON_PRIMITIVES = fails(function () {
        instance.has(1);
      }); // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new

      var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) {
        new NativeConstructor(iterable);
      }); // for early implementations -0 and +0 not the same

      var BUGGY_ZERO = !IS_WEAK && fails(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new NativeConstructor();
        var index = 5;

        while (index--) {
          $instance[ADDER](index, index);
        }

        return !$instance.has(-0);
      });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper(function (dummy, iterable) {
          anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
          var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
          if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
          return that;
        });
        Constructor.prototype = NativePrototype;
        NativePrototype.constructor = Constructor;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER); // weak collections should not contains .clear method

      if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
    }

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export({
      global: true,
      forced: Constructor != NativeConstructor
    }, exported);
    setToStringTag(Constructor, CONSTRUCTOR_NAME);
    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
    return Constructor;
  };

  var defineProperty$9 = objectDefineProperty.f;
  var fastKey = internalMetadata.fastKey;
  var setInternalState$6 = internalState.set;
  var internalStateGetterFor = internalState.getterFor;
  var collectionStrong = {
    getConstructor: function getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$6(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0
        });
        if (!descriptors) that.size = 0;
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
      });
      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      var define = function define(that, key, value) {
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        var previous, index; // change existing entry

        if (entry) {
          entry.value = value; // create new entry
        } else {
          state.last = entry = {
            index: index = fastKey(key, true),
            key: key,
            value: value,
            previous: previous = state.last,
            next: undefined,
            removed: false
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (descriptors) state.size++;else that.size++; // add to index

          if (index !== 'F') state.index[index] = entry;
        }

        return that;
      };

      var getEntry = function getEntry(that, key) {
        var state = getInternalState(that); // fast case

        var index = fastKey(key);
        var entry;
        if (index !== 'F') return state.index[index]; // frozen object case

        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          var that = this;
          var state = getInternalState(that);
          var data = state.index;
          var entry = state.first;

          while (entry) {
            entry.removed = true;
            if (entry.previous) entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }

          state.first = state.last = undefined;
          if (descriptors) state.size = 0;else that.size = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function _delete(key) {
          var that = this;
          var state = getInternalState(that);
          var entry = getEntry(that, key);

          if (entry) {
            var next = entry.next;
            var prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (descriptors) state.size--;else that.size--;
          }

          return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn
        /* , that = undefined */
        ) {
          var state = getInternalState(this);
          var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
          var entry;

          while (entry = entry ? entry.next : state.first) {
            boundFunction(entry.value, entry.key, this); // revert to the last existing entry

            while (entry && entry.removed) {
              entry = entry.previous;
            }
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });
      redefineAll(C.prototype, IS_MAP ? {
        // 23.1.3.6 Map.prototype.get(key)
        get: function get(key) {
          var entry = getEntry(this, key);
          return entry && entry.value;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key === 0 ? 0 : key, value);
        }
      } : {
        // 23.2.3.1 Set.prototype.add(value)
        add: function add(value) {
          return define(this, value = value === 0 ? 0 : value, value);
        }
      });
      if (descriptors) defineProperty$9(C.prototype, 'size', {
        get: function get() {
          return getInternalState(this).size;
        }
      });
      return C;
    },
    setStrong: function setStrong(C, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
      var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME); // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11

      defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
        setInternalState$6(this, {
          type: ITERATOR_NAME,
          target: iterated,
          state: getInternalCollectionState(iterated),
          kind: kind,
          last: undefined
        });
      }, function () {
        var state = getInternalIteratorState(this);
        var kind = state.kind;
        var entry = state.last; // revert to the last existing entry

        while (entry && entry.removed) {
          entry = entry.previous;
        } // get next entry


        if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
          // or finish the iteration
          state.target = undefined;
          return {
            value: undefined,
            done: true
          };
        } // return step by kind


        if (kind == 'keys') return {
          value: entry.key,
          done: false
        };
        if (kind == 'values') return {
          value: entry.value,
          done: false
        };
        return {
          value: [entry.key, entry.value],
          done: false
        };
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true); // add [@@species], 23.1.2.2, 23.2.2.2

      setSpecies(CONSTRUCTOR_NAME);
    }
  };

  // https://tc39.github.io/ecma262/#sec-map-objects


  var es_map = collection('Map', function (init) {
    return function Map() {
      return init(this, arguments.length ? arguments[0] : undefined);
    };
  }, collectionStrong);

  // https://tc39.github.io/ecma262/#sec-set-objects


  var es_set = collection('Set', function (init) {
    return function Set() {
      return init(this, arguments.length ? arguments[0] : undefined);
    };
  }, collectionStrong);

  var getWeakData = internalMetadata.getWeakData;
  var setInternalState$7 = internalState.set;
  var internalStateGetterFor$1 = internalState.getterFor;
  var find = arrayIteration.find;
  var findIndex = arrayIteration.findIndex;
  var id$2 = 0; // fallback for uncaught frozen keys

  var uncaughtFrozenStore = function uncaughtFrozenStore(store) {
    return store.frozen || (store.frozen = new UncaughtFrozenStore());
  };

  var UncaughtFrozenStore = function UncaughtFrozenStore() {
    this.entries = [];
  };

  var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
    return find(store.entries, function (it) {
      return it[0] === key;
    });
  };

  UncaughtFrozenStore.prototype = {
    get: function get(key) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) return entry[1];
    },
    has: function has$$1(key) {
      return !!findUncaughtFrozen(this, key);
    },
    set: function set(key, value) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) entry[1] = value;else this.entries.push([key, value]);
    },
    'delete': function _delete(key) {
      var index = findIndex(this.entries, function (it) {
        return it[0] === key;
      });
      if (~index) this.entries.splice(index, 1);
      return !!~index;
    }
  };
  var collectionWeak = {
    getConstructor: function getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$7(that, {
          type: CONSTRUCTOR_NAME,
          id: id$2++,
          frozen: undefined
        });
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
      });
      var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

      var define = function define(that, key, value) {
        var state = getInternalState(that);
        var data = getWeakData(anObject(key), true);
        if (data === true) uncaughtFrozenStore(state).set(key, value);else data[state.id] = value;
        return that;
      };

      redefineAll(C.prototype, {
        // 23.3.3.2 WeakMap.prototype.delete(key)
        // 23.4.3.3 WeakSet.prototype.delete(value)
        'delete': function _delete(key) {
          var state = getInternalState(this);
          if (!isObject(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state)['delete'](key);
          return data && has(data, state.id) && delete data[state.id];
        },
        // 23.3.3.4 WeakMap.prototype.has(key)
        // 23.4.3.4 WeakSet.prototype.has(value)
        has: function has$$1(key) {
          var state = getInternalState(this);
          if (!isObject(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).has(key);
          return data && has(data, state.id);
        }
      });
      redefineAll(C.prototype, IS_MAP ? {
        // 23.3.3.3 WeakMap.prototype.get(key)
        get: function get(key) {
          var state = getInternalState(this);

          if (isObject(key)) {
            var data = getWeakData(key);
            if (data === true) return uncaughtFrozenStore(state).get(key);
            return data ? data[state.id] : undefined;
          }
        },
        // 23.3.3.5 WeakMap.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key, value);
        }
      } : {
        // 23.4.3.1 WeakSet.prototype.add(value)
        add: function add(value) {
          return define(this, value, true);
        }
      });
      return C;
    }
  };

  var es_weakMap = createCommonjsModule(function (module) {

    var enforceIternalState = internalState.enforce;
    var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
    var isExtensible = Object.isExtensible;
    var InternalWeakMap;

    var wrapper = function wrapper(init) {
      return function WeakMap() {
        return init(this, arguments.length ? arguments[0] : undefined);
      };
    }; // `WeakMap` constructor
    // https://tc39.github.io/ecma262/#sec-weakmap-constructor


    var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak); // IE11 WeakMap frozen keys fix
    // We can't use feature detection because it crash some old IE builds
    // https://github.com/zloirock/core-js/issues/485

    if (nativeWeakMap && IS_IE11) {
      InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
      internalMetadata.REQUIRED = true;
      var WeakMapPrototype = $WeakMap.prototype;
      var nativeDelete = WeakMapPrototype['delete'];
      var nativeHas = WeakMapPrototype.has;
      var nativeGet = WeakMapPrototype.get;
      var nativeSet = WeakMapPrototype.set;
      redefineAll(WeakMapPrototype, {
        'delete': function _delete(key) {
          if (isObject(key) && !isExtensible(key)) {
            var state = enforceIternalState(this);
            if (!state.frozen) state.frozen = new InternalWeakMap();
            return nativeDelete.call(this, key) || state.frozen['delete'](key);
          }

          return nativeDelete.call(this, key);
        },
        has: function has(key) {
          if (isObject(key) && !isExtensible(key)) {
            var state = enforceIternalState(this);
            if (!state.frozen) state.frozen = new InternalWeakMap();
            return nativeHas.call(this, key) || state.frozen.has(key);
          }

          return nativeHas.call(this, key);
        },
        get: function get(key) {
          if (isObject(key) && !isExtensible(key)) {
            var state = enforceIternalState(this);
            if (!state.frozen) state.frozen = new InternalWeakMap();
            return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
          }

          return nativeGet.call(this, key);
        },
        set: function set(key, value) {
          if (isObject(key) && !isExtensible(key)) {
            var state = enforceIternalState(this);
            if (!state.frozen) state.frozen = new InternalWeakMap();
            nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
          } else nativeSet.call(this, key, value);

          return this;
        }
      });
    }
  });

  // https://tc39.github.io/ecma262/#sec-weakset-constructor


  collection('WeakSet', function (init) {
    return function WeakSet() {
      return init(this, arguments.length ? arguments[0] : undefined);
    };
  }, collectionWeak);

  var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

  // https://tc39.github.io/ecma262/#sec-toindex

  var toIndex = function toIndex(it) {
    if (it === undefined) return 0;
    var number = toInteger(it);
    var length = toLength(number);
    if (number !== length) throw RangeError('Wrong length or index');
    return length;
  };

  // IEEE754 conversions based on https://github.com/feross/ieee754
  // eslint-disable-next-line no-shadow-restricted-names
  var Infinity$1 = 1 / 0;
  var abs$7 = Math.abs;
  var pow$3 = Math.pow;
  var floor$6 = Math.floor;
  var log$8 = Math.log;
  var LN2$2 = Math.LN2;

  var pack = function pack(number, mantissaLength, bytes) {
    var buffer = new Array(bytes);
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var rt = mantissaLength === 23 ? pow$3(2, -24) - pow$3(2, -77) : 0;
    var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
    var index = 0;
    var exponent, mantissa, c;
    number = abs$7(number); // eslint-disable-next-line no-self-compare

    if (number != number || number === Infinity$1) {
      // eslint-disable-next-line no-self-compare
      mantissa = number != number ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = floor$6(log$8(number) / LN2$2);

      if (number * (c = pow$3(2, -exponent)) < 1) {
        exponent--;
        c *= 2;
      }

      if (exponent + eBias >= 1) {
        number += rt / c;
      } else {
        number += rt * pow$3(2, 1 - eBias);
      }

      if (number * c >= 2) {
        exponent++;
        c /= 2;
      }

      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * pow$3(2, mantissaLength);
        exponent = exponent + eBias;
      } else {
        mantissa = number * pow$3(2, eBias - 1) * pow$3(2, mantissaLength);
        exponent = 0;
      }
    }

    for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8) {
    }

    exponent = exponent << mantissaLength | mantissa;
    exponentLength += mantissaLength;

    for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8) {
    }

    buffer[--index] |= sign * 128;
    return buffer;
  };

  var unpack = function unpack(buffer, mantissaLength) {
    var bytes = buffer.length;
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var nBits = exponentLength - 7;
    var index = bytes - 1;
    var sign = buffer[index--];
    var exponent = sign & 127;
    var mantissa;
    sign >>= 7;

    for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8) {
    }

    mantissa = exponent & (1 << -nBits) - 1;
    exponent >>= -nBits;
    nBits += mantissaLength;

    for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8) {
    }

    if (exponent === 0) {
      exponent = 1 - eBias;
    } else if (exponent === eMax) {
      return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
    } else {
      mantissa = mantissa + pow$3(2, mantissaLength);
      exponent = exponent - eBias;
    }

    return (sign ? -1 : 1) * mantissa * pow$3(2, exponent - mantissaLength);
  };

  var ieee754 = {
    pack: pack,
    unpack: unpack
  };

  var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
  var defineProperty$a = objectDefineProperty.f;
  var getInternalState$6 = internalState.get;
  var setInternalState$8 = internalState.set;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var DATA_VIEW = 'DataView';
  var PROTOTYPE$2 = 'prototype';
  var WRONG_LENGTH = 'Wrong length';
  var WRONG_INDEX = 'Wrong index';
  var NativeArrayBuffer = global_1[ARRAY_BUFFER];
  var $ArrayBuffer = NativeArrayBuffer;
  var $DataView = global_1[DATA_VIEW];
  var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$2];
  var ObjectPrototype$2 = Object.prototype;
  var RangeError$1 = global_1.RangeError;
  var packIEEE754 = ieee754.pack;
  var unpackIEEE754 = ieee754.unpack;

  var packInt8 = function packInt8(number) {
    return [number & 0xFF];
  };

  var packInt16 = function packInt16(number) {
    return [number & 0xFF, number >> 8 & 0xFF];
  };

  var packInt32 = function packInt32(number) {
    return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
  };

  var unpackInt32 = function unpackInt32(buffer) {
    return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
  };

  var packFloat32 = function packFloat32(number) {
    return packIEEE754(number, 23, 4);
  };

  var packFloat64 = function packFloat64(number) {
    return packIEEE754(number, 52, 8);
  };

  var addGetter = function addGetter(Constructor, key) {
    defineProperty$a(Constructor[PROTOTYPE$2], key, {
      get: function get() {
        return getInternalState$6(this)[key];
      }
    });
  };

  var get$1 = function get(view, count, index, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState$6(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState$6(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = bytes.slice(start, start + count);
    return isLittleEndian ? pack : pack.reverse();
  };

  var set$3 = function set(view, count, index, conversion, value, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState$6(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState$6(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = conversion(+value);

    for (var i = 0; i < count; i++) {
      bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
    }
  };

  if (!arrayBufferNative) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
      var byteLength = toIndex(length);
      setInternalState$8(this, {
        bytes: arrayFill.call(new Array(byteLength), 0),
        byteLength: byteLength
      });
      if (!descriptors) this.byteLength = byteLength;
    };

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance(this, $DataView, DATA_VIEW);
      anInstance(buffer, $ArrayBuffer, DATA_VIEW);
      var bufferLength = getInternalState$6(buffer).byteLength;
      var offset = toInteger(byteOffset);
      if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
      byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
      setInternalState$8(this, {
        buffer: buffer,
        byteLength: byteLength,
        byteOffset: offset
      });

      if (!descriptors) {
        this.buffer = buffer;
        this.byteLength = byteLength;
        this.byteOffset = offset;
      }
    };

    if (descriptors) {
      addGetter($ArrayBuffer, 'byteLength');
      addGetter($DataView, 'buffer');
      addGetter($DataView, 'byteLength');
      addGetter($DataView, 'byteOffset');
    }

    redefineAll($DataView[PROTOTYPE$2], {
      getInt8: function getInt8(byteOffset) {
        return get$1(this, 1, byteOffset)[0] << 24 >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get$1(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset
      /* , littleEndian */
      ) {
        var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
      },
      getUint16: function getUint16(byteOffset
      /* , littleEndian */
      ) {
        var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return bytes[1] << 8 | bytes[0];
      },
      getInt32: function getInt32(byteOffset
      /* , littleEndian */
      ) {
        return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
      },
      getUint32: function getUint32(byteOffset
      /* , littleEndian */
      ) {
        return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
      },
      getFloat32: function getFloat32(byteOffset
      /* , littleEndian */
      ) {
        return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
      },
      getFloat64: function getFloat64(byteOffset
      /* , littleEndian */
      ) {
        return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
      },
      setInt8: function setInt8(byteOffset, value) {
        set$3(this, 1, byteOffset, packInt8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set$3(this, 1, byteOffset, packInt8, value);
      },
      setInt16: function setInt16(byteOffset, value
      /* , littleEndian */
      ) {
        set$3(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint16: function setUint16(byteOffset, value
      /* , littleEndian */
      ) {
        set$3(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setInt32: function setInt32(byteOffset, value
      /* , littleEndian */
      ) {
        set$3(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint32: function setUint32(byteOffset, value
      /* , littleEndian */
      ) {
        set$3(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat32: function setFloat32(byteOffset, value
      /* , littleEndian */
      ) {
        set$3(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat64: function setFloat64(byteOffset, value
      /* , littleEndian */
      ) {
        set$3(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
      }
    });
  } else {
    if (!fails(function () {
      NativeArrayBuffer(1);
    }) || !fails(function () {
      new NativeArrayBuffer(-1); // eslint-disable-line no-new
    }) || fails(function () {
      new NativeArrayBuffer(); // eslint-disable-line no-new

      new NativeArrayBuffer(1.5); // eslint-disable-line no-new

      new NativeArrayBuffer(NaN); // eslint-disable-line no-new

      return NativeArrayBuffer.name != ARRAY_BUFFER;
    })) {
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer);
        return new NativeArrayBuffer(toIndex(length));
      };

      var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$2] = NativeArrayBuffer[PROTOTYPE$2];

      for (var keys$3 = getOwnPropertyNames$2(NativeArrayBuffer), j$1 = 0, key$1; keys$3.length > j$1;) {
        if (!((key$1 = keys$3[j$1++]) in $ArrayBuffer)) {
          createNonEnumerableProperty($ArrayBuffer, key$1, NativeArrayBuffer[key$1]);
        }
      }

      ArrayBufferPrototype.constructor = $ArrayBuffer;
    } // WebKit bug - the same parent prototype for typed arrays and data view


    if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$2) {
      objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$2);
    } // iOS Safari 7.x bug


    var testView = new $DataView(new $ArrayBuffer(2));
    var nativeSetInt8 = $DataViewPrototype.setInt8;
    testView.setInt8(0, 2147483648);
    testView.setInt8(1, 2147483649);
    if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
      setInt8: function setInt8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      },
      setUint8: function setUint8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      }
    }, {
      unsafe: true
    });
  }

  setToStringTag($ArrayBuffer, ARRAY_BUFFER);
  setToStringTag($DataView, DATA_VIEW);
  var arrayBuffer = {
    ArrayBuffer: $ArrayBuffer,
    DataView: $DataView
  };

  var ARRAY_BUFFER$1 = 'ArrayBuffer';
  var ArrayBuffer$1 = arrayBuffer[ARRAY_BUFFER$1];
  var NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1]; // `ArrayBuffer` constructor
  // https://tc39.github.io/ecma262/#sec-arraybuffer-constructor

  _export({
    global: true,
    forced: NativeArrayBuffer$1 !== ArrayBuffer$1
  }, {
    ArrayBuffer: ArrayBuffer$1
  });
  setSpecies(ARRAY_BUFFER$1);

  var defineProperty$b = objectDefineProperty.f;
  var Int8Array$1 = global_1.Int8Array;
  var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
  var Uint8ClampedArray = global_1.Uint8ClampedArray;
  var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
  var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
  var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
  var ObjectPrototype$3 = Object.prototype;
  var isPrototypeOf = ObjectPrototype$3.isPrototypeOf;
  var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
  var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG'); // Fixing native typed arrays in Opera Presto crashes the browser, see #595

  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
  var TYPED_ARRAY_TAG_REQIRED = false;
  var NAME$1;
  var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8
  };

  var isView = function isView(it) {
    var klass = classof(it);
    return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
  };

  var isTypedArray = function isTypedArray(it) {
    return isObject(it) && has(TypedArrayConstructorsList, classof(it));
  };

  var aTypedArray = function aTypedArray(it) {
    if (isTypedArray(it)) return it;
    throw TypeError('Target is not a typed array');
  };

  var aTypedArrayConstructor = function aTypedArrayConstructor(C) {
    if (objectSetPrototypeOf) {
      if (isPrototypeOf.call(TypedArray, C)) return C;
    } else for (var ARRAY in TypedArrayConstructorsList) {
      if (has(TypedArrayConstructorsList, NAME$1)) {
        var TypedArrayConstructor = global_1[ARRAY];

        if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
          return C;
        }
      }
    }

    throw TypeError('Target is not a typed array constructor');
  };

  var exportTypedArrayMethod = function exportTypedArrayMethod(KEY, property, forced) {
    if (!descriptors) return;
    if (forced) for (var ARRAY in TypedArrayConstructorsList) {
      var TypedArrayConstructor = global_1[ARRAY];

      if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
        delete TypedArrayConstructor.prototype[KEY];
      }
    }

    if (!TypedArrayPrototype[KEY] || forced) {
      redefine(TypedArrayPrototype, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
    }
  };

  var exportTypedArrayStaticMethod = function exportTypedArrayStaticMethod(KEY, property, forced) {
    var ARRAY, TypedArrayConstructor;
    if (!descriptors) return;

    if (objectSetPrototypeOf) {
      if (forced) for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global_1[ARRAY];

        if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
          delete TypedArrayConstructor[KEY];
        }
      }

      if (!TypedArray[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
        } catch (error) {
          /* empty */
        }
      } else return;
    }

    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY];

      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine(TypedArrayConstructor, KEY, property);
      }
    }
  };

  for (NAME$1 in TypedArrayConstructorsList) {
    if (!global_1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
  } // WebKit bug - typed arrays constructors prototype is Object.prototype


  if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
    // eslint-disable-next-line no-shadow
    TypedArray = function TypedArray() {
      throw TypeError('Incorrect invocation');
    };

    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1], TypedArray);
    }
  }

  if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$3) {
    TypedArrayPrototype = TypedArray.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype);
    }
  } // WebKit bug - one more object in Uint8ClampedArray prototype chain


  if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
    objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
  }

  if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
    TYPED_ARRAY_TAG_REQIRED = true;
    defineProperty$b(TypedArrayPrototype, TO_STRING_TAG$3, {
      get: function get() {
        return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
      }
    });

    for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1[NAME$1]) {
        createNonEnumerableProperty(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
      }
    }
  }

  var arrayBufferViewCore = {
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
    aTypedArray: aTypedArray,
    aTypedArrayConstructor: aTypedArrayConstructor,
    exportTypedArrayMethod: exportTypedArrayMethod,
    exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
    isView: isView,
    isTypedArray: isTypedArray,
    TypedArray: TypedArray,
    TypedArrayPrototype: TypedArrayPrototype
  };

  var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS; // `ArrayBuffer.isView` method
  // https://tc39.github.io/ecma262/#sec-arraybuffer.isview

  _export({
    target: 'ArrayBuffer',
    stat: true,
    forced: !NATIVE_ARRAY_BUFFER_VIEWS$1
  }, {
    isView: arrayBufferViewCore.isView
  });

  var ArrayBuffer$2 = arrayBuffer.ArrayBuffer;
  var DataView$1 = arrayBuffer.DataView;
  var nativeArrayBufferSlice = ArrayBuffer$2.prototype.slice;
  var INCORRECT_SLICE = fails(function () {
    return !new ArrayBuffer$2(2).slice(1, undefined).byteLength;
  }); // `ArrayBuffer.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice

  _export({
    target: 'ArrayBuffer',
    proto: true,
    unsafe: true,
    forced: INCORRECT_SLICE
  }, {
    slice: function slice(start, end) {
      if (nativeArrayBufferSlice !== undefined && end === undefined) {
        return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
      }

      var length = anObject(this).byteLength;
      var first = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      var result = new (speciesConstructor(this, ArrayBuffer$2))(toLength(fin - first));
      var viewSource = new DataView$1(this);
      var viewTarget = new DataView$1(result);
      var index = 0;

      while (first < fin) {
        viewTarget.setUint8(index++, viewSource.getUint8(first++));
      }

      return result;
    }
  });

  // https://tc39.github.io/ecma262/#sec-dataview-constructor

  _export({
    global: true,
    forced: !arrayBufferNative
  }, {
    DataView: arrayBuffer.DataView
  });

  /* eslint-disable no-new */

  var NATIVE_ARRAY_BUFFER_VIEWS$2 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
  var ArrayBuffer$3 = global_1.ArrayBuffer;
  var Int8Array$2 = global_1.Int8Array;
  var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$2 || !fails(function () {
    Int8Array$2(1);
  }) || !fails(function () {
    new Int8Array$2(-1);
  }) || !checkCorrectnessOfIteration(function (iterable) {
    new Int8Array$2();
    new Int8Array$2(null);
    new Int8Array$2(1.5);
    new Int8Array$2(iterable);
  }, true) || fails(function () {
    // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
    return new Int8Array$2(new ArrayBuffer$3(2), 1, undefined).length !== 1;
  });

  var toPositiveInteger = function toPositiveInteger(it) {
    var result = toInteger(it);
    if (result < 0) throw RangeError("The argument can't be less than 0");
    return result;
  };

  var toOffset = function toOffset(it, BYTES) {
    var offset = toPositiveInteger(it);
    if (offset % BYTES) throw RangeError('Wrong offset');
    return offset;
  };

  var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

  var typedArrayFrom = function from(source
  /* , mapfn, thisArg */
  ) {
    var O = toObject(source);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var i, length, result, step, iterator, next;

    if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      O = [];

      while (!(step = next.call(iterator)).done) {
        O.push(step.value);
      }
    }

    if (mapping && argumentsLength > 2) {
      mapfn = functionBindContext(mapfn, arguments[2], 2);
    }

    length = toLength(O.length);
    result = new (aTypedArrayConstructor$1(this))(length);

    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }

    return result;
  };

  var typedArrayConstructor = createCommonjsModule(function (module) {

    var getOwnPropertyNames = objectGetOwnPropertyNames.f;
    var forEach = arrayIteration.forEach;
    var getInternalState = internalState.get;
    var setInternalState = internalState.set;
    var nativeDefineProperty = objectDefineProperty.f;
    var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var round = Math.round;
    var RangeError = global_1.RangeError;
    var ArrayBuffer = arrayBuffer.ArrayBuffer;
    var DataView = arrayBuffer.DataView;
    var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
    var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
    var TypedArray = arrayBufferViewCore.TypedArray;
    var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
    var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
    var isTypedArray = arrayBufferViewCore.isTypedArray;
    var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
    var WRONG_LENGTH = 'Wrong length';

    var fromList = function fromList(C, list) {
      var index = 0;
      var length = list.length;
      var result = new (aTypedArrayConstructor(C))(length);

      while (length > index) {
        result[index] = list[index++];
      }

      return result;
    };

    var addGetter = function addGetter(it, key) {
      nativeDefineProperty(it, key, {
        get: function get() {
          return getInternalState(this)[key];
        }
      });
    };

    var isArrayBuffer = function isArrayBuffer(it) {
      var klass;
      return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
    };

    var isTypedArrayIndex = function isTypedArrayIndex(target, key) {
      return isTypedArray(target) && _typeof(key) != 'symbol' && key in target && String(+key) == String(key);
    };

    var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
      return isTypedArrayIndex(target, key = toPrimitive(key, true)) ? createPropertyDescriptor(2, target[key]) : nativeGetOwnPropertyDescriptor(target, key);
    };

    var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
      if (isTypedArrayIndex(target, key = toPrimitive(key, true)) && isObject(descriptor) && has(descriptor, 'value') && !has(descriptor, 'get') && !has(descriptor, 'set') // TODO: add validation descriptor w/o calling accessors
      && !descriptor.configurable && (!has(descriptor, 'writable') || descriptor.writable) && (!has(descriptor, 'enumerable') || descriptor.enumerable)) {
        target[key] = descriptor.value;
        return target;
      }

      return nativeDefineProperty(target, key, descriptor);
    };

    if (descriptors) {
      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
        objectDefineProperty.f = wrappedDefineProperty;
        addGetter(TypedArrayPrototype, 'buffer');
        addGetter(TypedArrayPrototype, 'byteOffset');
        addGetter(TypedArrayPrototype, 'byteLength');
        addGetter(TypedArrayPrototype, 'length');
      }

      _export({
        target: 'Object',
        stat: true,
        forced: !NATIVE_ARRAY_BUFFER_VIEWS
      }, {
        getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
        defineProperty: wrappedDefineProperty
      });

      module.exports = function (TYPE, wrapper, CLAMPED) {
        var BYTES = TYPE.match(/\d+$/)[0] / 8;
        var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
        var GETTER = 'get' + TYPE;
        var SETTER = 'set' + TYPE;
        var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
        var TypedArrayConstructor = NativeTypedArrayConstructor;
        var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
        var exported = {};

        var getter = function getter(that, index) {
          var data = getInternalState(that);
          return data.view[GETTER](index * BYTES + data.byteOffset, true);
        };

        var setter = function setter(that, index, value) {
          var data = getInternalState(that);
          if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
          data.view[SETTER](index * BYTES + data.byteOffset, value, true);
        };

        var addElement = function addElement(that, index) {
          nativeDefineProperty(that, index, {
            get: function get() {
              return getter(this, index);
            },
            set: function set(value) {
              return setter(this, index, value);
            },
            enumerable: true
          });
        };

        if (!NATIVE_ARRAY_BUFFER_VIEWS) {
          TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
            anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
            var index = 0;
            var byteOffset = 0;
            var buffer, byteLength, length;

            if (!isObject(data)) {
              length = toIndex(data);
              byteLength = length * BYTES;
              buffer = new ArrayBuffer(byteLength);
            } else if (isArrayBuffer(data)) {
              buffer = data;
              byteOffset = toOffset(offset, BYTES);
              var $len = data.byteLength;

              if ($length === undefined) {
                if ($len % BYTES) throw RangeError(WRONG_LENGTH);
                byteLength = $len - byteOffset;
                if (byteLength < 0) throw RangeError(WRONG_LENGTH);
              } else {
                byteLength = toLength($length) * BYTES;
                if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
              }

              length = byteLength / BYTES;
            } else if (isTypedArray(data)) {
              return fromList(TypedArrayConstructor, data);
            } else {
              return typedArrayFrom.call(TypedArrayConstructor, data);
            }

            setInternalState(that, {
              buffer: buffer,
              byteOffset: byteOffset,
              byteLength: byteLength,
              length: length,
              view: new DataView(buffer)
            });

            while (index < length) {
              addElement(that, index++);
            }
          });
          if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
          TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
        } else if (typedArrayConstructorsRequireWrappers) {
          TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
            anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
            return inheritIfRequired(function () {
              if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
              if (isArrayBuffer(data)) return $length !== undefined ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length) : typedArrayOffset !== undefined ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES)) : new NativeTypedArrayConstructor(data);
              if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
              return typedArrayFrom.call(TypedArrayConstructor, data);
            }(), dummy, TypedArrayConstructor);
          });
          if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
          forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
            if (!(key in TypedArrayConstructor)) {
              createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
            }
          });
          TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
        }

        if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
          createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
        }

        if (TYPED_ARRAY_TAG) {
          createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
        }

        exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;
        _export({
          global: true,
          forced: TypedArrayConstructor != NativeTypedArrayConstructor,
          sham: !NATIVE_ARRAY_BUFFER_VIEWS
        }, exported);

        if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
        }

        if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
          createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
        }

        setSpecies(CONSTRUCTOR_NAME);
      };
    } else module.exports = function () {
      /* empty */
    };
  });

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Int8', function (init) {
    return function Int8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Uint8', function (init) {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Uint8', function (init) {
    return function Uint8ClampedArray(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  }, true);

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Int16', function (init) {
    return function Int16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Uint16', function (init) {
    return function Uint16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Int32', function (init) {
    return function Int32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Uint32', function (init) {
    return function Uint32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Float32', function (init) {
    return function Float32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  typedArrayConstructor('Float64', function (init) {
    return function Float64Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod; // `%TypedArray%.from` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.from

  exportTypedArrayStaticMethod$1('from', typedArrayFrom, typedArrayConstructorsRequireWrappers);

  var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayStaticMethod$2 = arrayBufferViewCore.exportTypedArrayStaticMethod; // `%TypedArray%.of` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.of

  exportTypedArrayStaticMethod$2('of', function of()
  /* ...items */
  {
    var index = 0;
    var length = arguments.length;
    var result = new (aTypedArrayConstructor$2(this))(length);

    while (length > index) {
      result[index] = arguments[index++];
    }

    return result;
  }, typedArrayConstructorsRequireWrappers);

  var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin

  exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start
  /* , end */
  ) {
    return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
  });

  var $every$1 = arrayIteration.every;
  var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every

  exportTypedArrayMethod$2('every', function every(callbackfn
  /* , thisArg */
  ) {
    return $every$1(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.fill` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
  // eslint-disable-next-line no-unused-vars

  exportTypedArrayMethod$3('fill', function fill(value
  /* , start, end */
  ) {
    return arrayFill.apply(aTypedArray$3(this), arguments);
  });

  var $filter$1 = arrayIteration.filter;
  var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter

  exportTypedArrayMethod$4('filter', function filter(callbackfn
  /* , thisArg */
  ) {
    var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$3(C))(length);

    while (length > index) {
      result[index] = list[index++];
    }

    return result;
  });

  var $find$1 = arrayIteration.find;
  var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find

  exportTypedArrayMethod$5('find', function find(predicate
  /* , thisArg */
  ) {
    return $find$1(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $findIndex$1 = arrayIteration.findIndex;
  var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex

  exportTypedArrayMethod$6('findIndex', function findIndex(predicate
  /* , thisArg */
  ) {
    return $findIndex$1(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $forEach$2 = arrayIteration.forEach;
  var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach

  exportTypedArrayMethod$7('forEach', function forEach(callbackfn
  /* , thisArg */
  ) {
    $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $includes$1 = arrayIncludes.includes;
  var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes

  exportTypedArrayMethod$8('includes', function includes(searchElement
  /* , fromIndex */
  ) {
    return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $indexOf$1 = arrayIncludes.indexOf;
  var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof

  exportTypedArrayMethod$9('indexOf', function indexOf(searchElement
  /* , fromIndex */
  ) {
    return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ITERATOR$5 = wellKnownSymbol('iterator');
  var Uint8Array$1 = global_1.Uint8Array;
  var arrayValues = es_array_iterator.values;
  var arrayKeys = es_array_iterator.keys;
  var arrayEntries = es_array_iterator.entries;
  var aTypedArray$a = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
  var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$5];
  var CORRECT_ITER_NAME = !!nativeTypedArrayIterator && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

  var typedArrayValues = function values() {
    return arrayValues.call(aTypedArray$a(this));
  }; // `%TypedArray%.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries


  exportTypedArrayMethod$a('entries', function entries() {
    return arrayEntries.call(aTypedArray$a(this));
  }); // `%TypedArray%.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys

  exportTypedArrayMethod$a('keys', function keys() {
    return arrayKeys.call(aTypedArray$a(this));
  }); // `%TypedArray%.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values

  exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME); // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator

  exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

  var aTypedArray$b = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
  var $join = [].join; // `%TypedArray%.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
  // eslint-disable-next-line no-unused-vars

  exportTypedArrayMethod$b('join', function join(separator) {
    return $join.apply(aTypedArray$b(this), arguments);
  });

  var aTypedArray$c = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
  // eslint-disable-next-line no-unused-vars

  exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement
  /* , fromIndex */
  ) {
    return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
  });

  var $map$1 = arrayIteration.map;
  var aTypedArray$d = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map

  exportTypedArrayMethod$d('map', function map(mapfn
  /* , thisArg */
  ) {
    return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
      return new (aTypedArrayConstructor$4(speciesConstructor(O, O.constructor)))(length);
    });
  });

  var $reduce$1 = arrayReduce.left;
  var aTypedArray$e = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce

  exportTypedArrayMethod$e('reduce', function reduce(callbackfn
  /* , initialValue */
  ) {
    return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $reduceRight$1 = arrayReduce.right;
  var aTypedArray$f = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright

  exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn
  /* , initialValue */
  ) {
    return $reduceRight$1(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$g = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
  var floor$7 = Math.floor; // `%TypedArray%.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse

  exportTypedArrayMethod$g('reverse', function reverse() {
    var that = this;
    var length = aTypedArray$g(that).length;
    var middle = floor$7(length / 2);
    var index = 0;
    var value;

    while (index < middle) {
      value = that[index];
      that[index++] = that[--length];
      that[length] = value;
    }

    return that;
  });

  var aTypedArray$h = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;
  var FORCED$h = fails(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).set({});
  }); // `%TypedArray%.prototype.set` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set

  exportTypedArrayMethod$h('set', function set(arrayLike
  /* , offset */
  ) {
    aTypedArray$h(this);
    var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError('Wrong length');

    while (index < len) {
      this[offset + index] = src[index++];
    }
  }, FORCED$h);

  var aTypedArray$i = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$5 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
  var $slice = [].slice;
  var FORCED$i = fails(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).slice();
  }); // `%TypedArray%.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice

  exportTypedArrayMethod$i('slice', function slice(start, end) {
    var list = $slice.call(aTypedArray$i(this), start, end);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$5(C))(length);

    while (length > index) {
      result[index] = list[index++];
    }

    return result;
  }, FORCED$i);

  var $some$1 = arrayIteration.some;
  var aTypedArray$j = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some

  exportTypedArrayMethod$j('some', function some(callbackfn
  /* , thisArg */
  ) {
    return $some$1(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$k = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
  var $sort = [].sort; // `%TypedArray%.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort

  exportTypedArrayMethod$k('sort', function sort(comparefn) {
    return $sort.call(aTypedArray$k(this), comparefn);
  });

  var aTypedArray$l = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod; // `%TypedArray%.prototype.subarray` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray

  exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
    var O = aTypedArray$l(this);
    var length = O.length;
    var beginIndex = toAbsoluteIndex(begin, length);
    return new (speciesConstructor(O, O.constructor))(O.buffer, O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex));
  });

  var Int8Array$3 = global_1.Int8Array;
  var aTypedArray$m = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
  var $toLocaleString = [].toLocaleString;
  var $slice$1 = [].slice; // iOS Safari 6.x fails here

  var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
    $toLocaleString.call(new Int8Array$3(1));
  });
  var FORCED$j = fails(function () {
    return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
  }) || !fails(function () {
    Int8Array$3.prototype.toLocaleString.call([1, 2]);
  }); // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring

  exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
    return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
  }, FORCED$j);

  var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;
  var Uint8Array$2 = global_1.Uint8Array;
  var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype || {};
  var arrayToString = [].toString;
  var arrayJoin = [].join;

  if (fails(function () {
    arrayToString.call({});
  })) {
    arrayToString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString; // `%TypedArray%.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring

  exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

  var nativeApply = getBuiltIn('Reflect', 'apply');
  var functionApply = Function.apply; // MS Edge argumentsList argument is optional

  var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
    nativeApply(function () {
      /* empty */
    });
  }); // `Reflect.apply` method
  // https://tc39.github.io/ecma262/#sec-reflect.apply

  _export({
    target: 'Reflect',
    stat: true,
    forced: OPTIONAL_ARGUMENTS_LIST
  }, {
    apply: function apply(target, thisArgument, argumentsList) {
      aFunction$1(target);
      anObject(argumentsList);
      return nativeApply ? nativeApply(target, thisArgument, argumentsList) : functionApply.call(target, thisArgument, argumentsList);
    }
  });

  var nativeConstruct = getBuiltIn('Reflect', 'construct'); // `Reflect.construct` method
  // https://tc39.github.io/ecma262/#sec-reflect.construct
  // MS Edge supports only 2 arguments and argumentsList argument is optional
  // FF Nightly sets third argument as `new.target`, but does not create `this` from it

  var NEW_TARGET_BUG = fails(function () {
    function F() {
      /* empty */
    }

    return !(nativeConstruct(function () {
      /* empty */
    }, [], F) instanceof F);
  });
  var ARGS_BUG = !fails(function () {
    nativeConstruct(function () {
      /* empty */
    });
  });
  var FORCED$k = NEW_TARGET_BUG || ARGS_BUG;
  _export({
    target: 'Reflect',
    stat: true,
    forced: FORCED$k,
    sham: FORCED$k
  }, {
    construct: function construct(Target, args
    /* , newTarget */
    ) {
      aFunction$1(Target);
      anObject(args);
      var newTarget = arguments.length < 3 ? Target : aFunction$1(arguments[2]);
      if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);

      if (Target == newTarget) {
        // w/o altered newTarget, optimization for 0-4 arguments
        switch (args.length) {
          case 0:
            return new Target();

          case 1:
            return new Target(args[0]);

          case 2:
            return new Target(args[0], args[1]);

          case 3:
            return new Target(args[0], args[1], args[2]);

          case 4:
            return new Target(args[0], args[1], args[2], args[3]);
        } // w/o altered newTarget, lot of arguments case


        var $args = [null];
        $args.push.apply($args, args);
        return new (functionBind.apply(Target, $args))();
      } // with altered newTarget, not support built-in constructors


      var proto = newTarget.prototype;
      var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
      var result = Function.apply.call(Target, instance, args);
      return isObject(result) ? result : instance;
    }
  });

  var ERROR_INSTEAD_OF_FALSE = fails(function () {
    // eslint-disable-next-line no-undef
    Reflect.defineProperty(objectDefineProperty.f({}, 1, {
      value: 1
    }), 1, {
      value: 2
    });
  }); // `Reflect.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-reflect.defineproperty

  _export({
    target: 'Reflect',
    stat: true,
    forced: ERROR_INSTEAD_OF_FALSE,
    sham: !descriptors
  }, {
    defineProperty: function defineProperty(target, propertyKey, attributes) {
      anObject(target);
      var key = toPrimitive(propertyKey, true);
      anObject(attributes);

      try {
        objectDefineProperty.f(target, key, attributes);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  var getOwnPropertyDescriptor$8 = objectGetOwnPropertyDescriptor.f; // `Reflect.deleteProperty` method
  // https://tc39.github.io/ecma262/#sec-reflect.deleteproperty

  _export({
    target: 'Reflect',
    stat: true
  }, {
    deleteProperty: function deleteProperty(target, propertyKey) {
      var descriptor = getOwnPropertyDescriptor$8(anObject(target), propertyKey);
      return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
    }
  });

  // https://tc39.github.io/ecma262/#sec-reflect.get

  function get$2(target, propertyKey
  /* , receiver */
  ) {
    var receiver = arguments.length < 3 ? target : arguments[2];
    var descriptor, prototype;
    if (anObject(target) === receiver) return target[propertyKey];
    if (descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey)) return has(descriptor, 'value') ? descriptor.value : descriptor.get === undefined ? undefined : descriptor.get.call(receiver);
    if (isObject(prototype = objectGetPrototypeOf(target))) return get$2(prototype, propertyKey, receiver);
  }

  _export({
    target: 'Reflect',
    stat: true
  }, {
    get: get$2
  });

  // https://tc39.github.io/ecma262/#sec-reflect.getownpropertydescriptor

  _export({
    target: 'Reflect',
    stat: true,
    sham: !descriptors
  }, {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
      return objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
    }
  });

  // https://tc39.github.io/ecma262/#sec-reflect.getprototypeof

  _export({
    target: 'Reflect',
    stat: true,
    sham: !correctPrototypeGetter
  }, {
    getPrototypeOf: function getPrototypeOf(target) {
      return objectGetPrototypeOf(anObject(target));
    }
  });

  // https://tc39.github.io/ecma262/#sec-reflect.has

  _export({
    target: 'Reflect',
    stat: true
  }, {
    has: function has(target, propertyKey) {
      return propertyKey in target;
    }
  });

  var objectIsExtensible = Object.isExtensible; // `Reflect.isExtensible` method
  // https://tc39.github.io/ecma262/#sec-reflect.isextensible

  _export({
    target: 'Reflect',
    stat: true
  }, {
    isExtensible: function isExtensible(target) {
      anObject(target);
      return objectIsExtensible ? objectIsExtensible(target) : true;
    }
  });

  // https://tc39.github.io/ecma262/#sec-reflect.ownkeys

  _export({
    target: 'Reflect',
    stat: true
  }, {
    ownKeys: ownKeys$1
  });

  // https://tc39.github.io/ecma262/#sec-reflect.preventextensions

  _export({
    target: 'Reflect',
    stat: true,
    sham: !freezing
  }, {
    preventExtensions: function preventExtensions(target) {
      anObject(target);

      try {
        var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
        if (objectPreventExtensions) objectPreventExtensions(target);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  // https://tc39.github.io/ecma262/#sec-reflect.set

  function set$4(target, propertyKey, V
  /* , receiver */
  ) {
    var receiver = arguments.length < 4 ? target : arguments[3];
    var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
    var existingDescriptor, prototype;

    if (!ownDescriptor) {
      if (isObject(prototype = objectGetPrototypeOf(target))) {
        return set$4(prototype, propertyKey, V, receiver);
      }

      ownDescriptor = createPropertyDescriptor(0);
    }

    if (has(ownDescriptor, 'value')) {
      if (ownDescriptor.writable === false || !isObject(receiver)) return false;

      if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
        if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
        existingDescriptor.value = V;
        objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
      } else objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V));

      return true;
    }

    return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
  } // MS Edge 17-18 Reflect.set allows setting the property to object
  // with non-writable property on the prototype


  var MS_EDGE_BUG = fails(function () {
    var object = objectDefineProperty.f({}, 'a', {
      configurable: true
    }); // eslint-disable-next-line no-undef

    return Reflect.set(objectGetPrototypeOf(object), 'a', 1, object) !== false;
  });
  _export({
    target: 'Reflect',
    stat: true,
    forced: MS_EDGE_BUG
  }, {
    set: set$4
  });

  // https://tc39.github.io/ecma262/#sec-reflect.setprototypeof

  if (objectSetPrototypeOf) _export({
    target: 'Reflect',
    stat: true
  }, {
    setPrototypeOf: function setPrototypeOf(target, proto) {
      anObject(target);
      aPossiblePrototype(proto);

      try {
        objectSetPrototypeOf(target, proto);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  for (var COLLECTION_NAME in domIterables) {
    var Collection = global_1[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype; // some Chrome versions have non-configurable methods on DOMTokenList

    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
      createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
    } catch (error) {
      CollectionPrototype.forEach = arrayForEach;
    }
  }

  var ITERATOR$6 = wellKnownSymbol('iterator');
  var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
  var ArrayValues = es_array_iterator.values;

  for (var COLLECTION_NAME$1 in domIterables) {
    var Collection$1 = global_1[COLLECTION_NAME$1];
    var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;

    if (CollectionPrototype$1) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1[ITERATOR$6] !== ArrayValues) try {
        createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$6, ArrayValues);
      } catch (error) {
        CollectionPrototype$1[ITERATOR$6] = ArrayValues;
      }

      if (!CollectionPrototype$1[TO_STRING_TAG$4]) {
        createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$4, COLLECTION_NAME$1);
      }

      if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
          createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
        }
      }
    }
  }

  var FORCED$l = !global_1.setImmediate || !global_1.clearImmediate; // http://w3c.github.io/setImmediate/

  _export({
    global: true,
    bind: true,
    enumerable: true,
    forced: FORCED$l
  }, {
    // `setImmediate` method
    // http://w3c.github.io/setImmediate/#si-setImmediate
    setImmediate: task.set,
    // `clearImmediate` method
    // http://w3c.github.io/setImmediate/#si-clearImmediate
    clearImmediate: task.clear
  });

  var process$4 = global_1.process;
  var isNode = classofRaw(process$4) == 'process'; // `queueMicrotask` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask

  _export({
    global: true,
    enumerable: true,
    noTargetGet: true
  }, {
    queueMicrotask: function queueMicrotask(fn) {
      var domain = isNode && process$4.domain;
      microtask(domain ? domain.bind(fn) : fn);
    }
  });

  var slice$1 = [].slice;
  var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

  var wrap$1 = function wrap(scheduler) {
    return function (handler, timeout
    /* , ...arguments */
    ) {
      var boundArgs = arguments.length > 2;
      var args = boundArgs ? slice$1.call(arguments, 2) : undefined;
      return scheduler(boundArgs ? function () {
        // eslint-disable-next-line no-new-func
        (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
      } : handler, timeout);
    };
  }; // ie9- setTimeout & setInterval additional parameters fix
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers


  _export({
    global: true,
    bind: true,
    forced: MSIE
  }, {
    // `setTimeout` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
    setTimeout: wrap$1(global_1.setTimeout),
    // `setInterval` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
    setInterval: wrap$1(global_1.setInterval)
  });

  var ITERATOR$7 = wellKnownSymbol('iterator');
  var nativeUrl = !fails(function () {
    var url = new URL('b?a=1&b=2&c=3', 'http://a');
    var searchParams = url.searchParams;
    var result = '';
    url.pathname = 'c%20d';
    searchParams.forEach(function (value, key) {
      searchParams['delete']('b');
      result += key + value;
    });
    return !searchParams.sort || url.href !== 'http://a/c%20d?a=1&c=3' || searchParams.get('c') !== '3' || String(new URLSearchParams('?a=1')) !== 'a=1' || !searchParams[ITERATOR$7] // throws in Edge
    || new URL('https://a@b').username !== 'a' || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b' // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc' // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1' // fails in Chrome 66-
    || result !== 'a1c3' // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
  });

  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80

  var delimiter = '-'; // '\x2D'

  var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars

  var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

  var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
  var baseMinusTMin = base - tMin;
  var floor$8 = Math.floor;
  var stringFromCharCode = String.fromCharCode;
  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   */

  var ucs2decode = function ucs2decode(string) {
    var output = [];
    var counter = 0;
    var length = string.length;

    while (counter < length) {
      var value = string.charCodeAt(counter++);

      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // It's a high surrogate, and there is a next character.
        var extra = string.charCodeAt(counter++);

        if ((extra & 0xFC00) == 0xDC00) {
          // Low surrogate.
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }

    return output;
  };
  /**
   * Converts a digit/integer into a basic code point.
   */


  var digitToBasic = function digitToBasic(digit) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26);
  };
  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   */


  var adapt = function adapt(delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor$8(delta / damp) : delta >> 1;
    delta += floor$8(delta / numPoints);

    for (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor$8(delta / baseMinusTMin);
    }

    return floor$8(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };
  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   */
  // eslint-disable-next-line  max-statements


  var encode = function encode(input) {
    var output = []; // Convert the input in UCS-2 to an array of Unicode code points.

    input = ucs2decode(input); // Cache the length.

    var inputLength = input.length; // Initialize the state.

    var n = initialN;
    var delta = 0;
    var bias = initialBias;
    var i, currentValue; // Handle the basic code points.

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];

      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }

    var basicLength = output.length; // number of basic code points.

    var handledCPCount = basicLength; // number of code points that have been handled;
    // Finish the basic string with a delimiter unless it's empty.

    if (basicLength) {
      output.push(delimiter);
    } // Main encoding loop:


    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next larger one:
      var m = maxInt;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];

        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.


      var handledCPCountPlusOne = handledCPCount + 1;

      if (m - n > floor$8((maxInt - delta) / handledCPCountPlusOne)) {
        throw RangeError(OVERFLOW_ERROR);
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];

        if (currentValue < n && ++delta > maxInt) {
          throw RangeError(OVERFLOW_ERROR);
        }

        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer.
          var q = delta;

          for (var k = base;;
          /* no condition */
          k += base) {
            var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (q < t) break;
            var qMinusT = q - t;
            var baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
            q = floor$8(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode(digitToBasic(q)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }

    return output.join('');
  };

  var stringPunycodeToAscii = function stringPunycodeToAscii(input) {
    var encoded = [];
    var labels = input.toLowerCase().replace(regexSeparators, ".").split('.');
    var i, label;

    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
    }

    return encoded.join('.');
  };

  var getIterator = function getIterator(it) {
    var iteratorMethod = getIteratorMethod(it);

    if (typeof iteratorMethod != 'function') {
      throw TypeError(String(it) + ' is not iterable');
    }

    return anObject(iteratorMethod.call(it));
  };

  var $fetch$1 = getBuiltIn('fetch');
  var Headers = getBuiltIn('Headers');
  var ITERATOR$8 = wellKnownSymbol('iterator');
  var URL_SEARCH_PARAMS = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
  var setInternalState$9 = internalState.set;
  var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
  var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);
  var plus = /\+/g;
  var sequences = Array(4);

  var percentSequence = function percentSequence(bytes) {
    return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
  };

  var percentDecode = function percentDecode(sequence) {
    try {
      return decodeURIComponent(sequence);
    } catch (error) {
      return sequence;
    }
  };

  var deserialize = function deserialize(it) {
    var result = it.replace(plus, ' ');
    var bytes = 4;

    try {
      return decodeURIComponent(result);
    } catch (error) {
      while (bytes) {
        result = result.replace(percentSequence(bytes--), percentDecode);
      }

      return result;
    }
  };

  var find$1 = /[!'()~]|%20/g;
  var replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+'
  };

  var replacer = function replacer(match) {
    return replace[match];
  };

  var serialize = function serialize(it) {
    return encodeURIComponent(it).replace(find$1, replacer);
  };

  var parseSearchParams = function parseSearchParams(result, query) {
    if (query) {
      var attributes = query.split('&');
      var index = 0;
      var attribute, entry;

      while (index < attributes.length) {
        attribute = attributes[index++];

        if (attribute.length) {
          entry = attribute.split('=');
          result.push({
            key: deserialize(entry.shift()),
            value: deserialize(entry.join('='))
          });
        }
      }
    }
  };

  var updateSearchParams = function updateSearchParams(query) {
    this.entries.length = 0;
    parseSearchParams(this.entries, query);
  };

  var validateArgumentsLength = function validateArgumentsLength(passed, required) {
    if (passed < required) throw TypeError('Not enough arguments');
  };

  var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
    setInternalState$9(this, {
      type: URL_SEARCH_PARAMS_ITERATOR,
      iterator: getIterator(getInternalParamsState(params).entries),
      kind: kind
    });
  }, 'Iterator', function next() {
    var state = getInternalIteratorState(this);
    var kind = state.kind;
    var step = state.iterator.next();
    var entry = step.value;

    if (!step.done) {
      step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
    }

    return step;
  }); // `URLSearchParams` constructor
  // https://url.spec.whatwg.org/#interface-urlsearchparams

  var URLSearchParamsConstructor = function URLSearchParams()
  /* init */
  {
    anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
    var init = arguments.length > 0 ? arguments[0] : undefined;
    var that = this;
    var entries = [];
    var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;
    setInternalState$9(that, {
      type: URL_SEARCH_PARAMS,
      entries: entries,
      updateURL: function updateURL() {
        /* empty */
      },
      updateSearchParams: updateSearchParams
    });

    if (init !== undefined) {
      if (isObject(init)) {
        iteratorMethod = getIteratorMethod(init);

        if (typeof iteratorMethod === 'function') {
          iterator = iteratorMethod.call(init);
          next = iterator.next;

          while (!(step = next.call(iterator)).done) {
            entryIterator = getIterator(anObject(step.value));
            entryNext = entryIterator.next;
            if ((first = entryNext.call(entryIterator)).done || (second = entryNext.call(entryIterator)).done || !entryNext.call(entryIterator).done) throw TypeError('Expected sequence with length 2');
            entries.push({
              key: first.value + '',
              value: second.value + ''
            });
          }
        } else for (key in init) {
          if (has(init, key)) entries.push({
            key: key,
            value: init[key] + ''
          });
        }
      } else {
        parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
      }
    }
  };

  var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;
  redefineAll(URLSearchParamsPrototype, {
    // `URLSearchParams.prototype.appent` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-append
    append: function append(name, value) {
      validateArgumentsLength(arguments.length, 2);
      var state = getInternalParamsState(this);
      state.entries.push({
        key: name + '',
        value: value + ''
      });
      state.updateURL();
    },
    // `URLSearchParams.prototype.delete` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
    'delete': function _delete(name) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var key = name + '';
      var index = 0;

      while (index < entries.length) {
        if (entries[index].key === key) entries.splice(index, 1);else index++;
      }

      state.updateURL();
    },
    // `URLSearchParams.prototype.get` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-get
    get: function get(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;

      for (; index < entries.length; index++) {
        if (entries[index].key === key) return entries[index].value;
      }

      return null;
    },
    // `URLSearchParams.prototype.getAll` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
    getAll: function getAll(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var result = [];
      var index = 0;

      for (; index < entries.length; index++) {
        if (entries[index].key === key) result.push(entries[index].value);
      }

      return result;
    },
    // `URLSearchParams.prototype.has` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-has
    has: function has$$1(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;

      while (index < entries.length) {
        if (entries[index++].key === key) return true;
      }

      return false;
    },
    // `URLSearchParams.prototype.set` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-set
    set: function set(name, value) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var found = false;
      var key = name + '';
      var val = value + '';
      var index = 0;
      var entry;

      for (; index < entries.length; index++) {
        entry = entries[index];

        if (entry.key === key) {
          if (found) entries.splice(index--, 1);else {
            found = true;
            entry.value = val;
          }
        }
      }

      if (!found) entries.push({
        key: key,
        value: val
      });
      state.updateURL();
    },
    // `URLSearchParams.prototype.sort` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
    sort: function sort() {
      var state = getInternalParamsState(this);
      var entries = state.entries; // Array#sort is not stable in some engines

      var slice = entries.slice();
      var entry, entriesIndex, sliceIndex;
      entries.length = 0;

      for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
        entry = slice[sliceIndex];

        for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
          if (entries[entriesIndex].key > entry.key) {
            entries.splice(entriesIndex, 0, entry);
            break;
          }
        }

        if (entriesIndex === sliceIndex) entries.push(entry);
      }

      state.updateURL();
    },
    // `URLSearchParams.prototype.forEach` method
    forEach: function forEach(callback
    /* , thisArg */
    ) {
      var entries = getInternalParamsState(this).entries;
      var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
      var index = 0;
      var entry;

      while (index < entries.length) {
        entry = entries[index++];
        boundFunction(entry.value, entry.key, this);
      }
    },
    // `URLSearchParams.prototype.keys` method
    keys: function keys() {
      return new URLSearchParamsIterator(this, 'keys');
    },
    // `URLSearchParams.prototype.values` method
    values: function values() {
      return new URLSearchParamsIterator(this, 'values');
    },
    // `URLSearchParams.prototype.entries` method
    entries: function entries() {
      return new URLSearchParamsIterator(this, 'entries');
    }
  }, {
    enumerable: true
  }); // `URLSearchParams.prototype[@@iterator]` method

  redefine(URLSearchParamsPrototype, ITERATOR$8, URLSearchParamsPrototype.entries); // `URLSearchParams.prototype.toString` method
  // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior

  redefine(URLSearchParamsPrototype, 'toString', function toString() {
    var entries = getInternalParamsState(this).entries;
    var result = [];
    var index = 0;
    var entry;

    while (index < entries.length) {
      entry = entries[index++];
      result.push(serialize(entry.key) + '=' + serialize(entry.value));
    }

    return result.join('&');
  }, {
    enumerable: true
  });
  setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  _export({
    global: true,
    forced: !nativeUrl
  }, {
    URLSearchParams: URLSearchParamsConstructor
  }); // Wrap `fetch` for correct work with polyfilled `URLSearchParams`
  // https://github.com/zloirock/core-js/issues/674

  if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
    _export({
      global: true,
      enumerable: true,
      forced: true
    }, {
      fetch: function fetch(input
      /* , init */
      ) {
        var args = [input];
        var init, body, headers;

        if (arguments.length > 1) {
          init = arguments[1];

          if (isObject(init)) {
            body = init.body;

            if (classof(body) === URL_SEARCH_PARAMS) {
              headers = init.headers ? new Headers(init.headers) : new Headers();

              if (!headers.has('content-type')) {
                headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
              }

              init = objectCreate(init, {
                body: createPropertyDescriptor(0, String(body)),
                headers: createPropertyDescriptor(0, headers)
              });
            }
          }

          args.push(init);
        }

        return $fetch$1.apply(this, args);
      }
    });
  }

  var web_urlSearchParams = {
    URLSearchParams: URLSearchParamsConstructor,
    getState: getInternalParamsState
  };

  var codeAt$1 = stringMultibyte.codeAt;
  var NativeURL = global_1.URL;
  var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
  var getInternalSearchParamsState = web_urlSearchParams.getState;
  var setInternalState$a = internalState.set;
  var getInternalURLState = internalState.getterFor('URL');
  var floor$9 = Math.floor;
  var pow$4 = Math.pow;
  var INVALID_AUTHORITY = 'Invalid authority';
  var INVALID_SCHEME = 'Invalid scheme';
  var INVALID_HOST = 'Invalid host';
  var INVALID_PORT = 'Invalid port';
  var ALPHA = /[A-Za-z]/;
  var ALPHANUMERIC = /[\d+-.A-Za-z]/;
  var DIGIT = /\d/;
  var HEX_START = /^(0x|0X)/;
  var OCT = /^[0-7]+$/;
  var DEC = /^\d+$/;
  var HEX = /^[\dA-Fa-f]+$/; // eslint-disable-next-line no-control-regex

  var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/; // eslint-disable-next-line no-control-regex

  var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/; // eslint-disable-next-line no-control-regex

  var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g; // eslint-disable-next-line no-control-regex

  var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
  var EOF;

  var parseHost = function parseHost(url, input) {
    var result, codePoints, index;

    if (input.charAt(0) == '[') {
      if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
      result = parseIPv6(input.slice(1, -1));
      if (!result) return INVALID_HOST;
      url.host = result; // opaque host
    } else if (!isSpecial(url)) {
      if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);

      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }

      url.host = result;
    } else {
      input = stringPunycodeToAscii(input);
      if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
      result = parseIPv4(input);
      if (result === null) return INVALID_HOST;
      url.host = result;
    }
  };

  var parseIPv4 = function parseIPv4(input) {
    var parts = input.split('.');
    var partsLength, numbers, index, part, radix, number, ipv4;

    if (parts.length && parts[parts.length - 1] == '') {
      parts.pop();
    }

    partsLength = parts.length;
    if (partsLength > 4) return input;
    numbers = [];

    for (index = 0; index < partsLength; index++) {
      part = parts[index];
      if (part == '') return input;
      radix = 10;

      if (part.length > 1 && part.charAt(0) == '0') {
        radix = HEX_START.test(part) ? 16 : 8;
        part = part.slice(radix == 8 ? 1 : 2);
      }

      if (part === '') {
        number = 0;
      } else {
        if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
        number = parseInt(part, radix);
      }

      numbers.push(number);
    }

    for (index = 0; index < partsLength; index++) {
      number = numbers[index];

      if (index == partsLength - 1) {
        if (number >= pow$4(256, 5 - partsLength)) return null;
      } else if (number > 255) return null;
    }

    ipv4 = numbers.pop();

    for (index = 0; index < numbers.length; index++) {
      ipv4 += numbers[index] * pow$4(256, 3 - index);
    }

    return ipv4;
  }; // eslint-disable-next-line max-statements


  var parseIPv6 = function parseIPv6(input) {
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var pointer = 0;
    var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

    var char = function char() {
      return input.charAt(pointer);
    };

    if (char() == ':') {
      if (input.charAt(1) != ':') return;
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }

    while (char()) {
      if (pieceIndex == 8) return;

      if (char() == ':') {
        if (compress !== null) return;
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }

      value = length = 0;

      while (length < 4 && HEX.test(char())) {
        value = value * 16 + parseInt(char(), 16);
        pointer++;
        length++;
      }

      if (char() == '.') {
        if (length == 0) return;
        pointer -= length;
        if (pieceIndex > 6) return;
        numbersSeen = 0;

        while (char()) {
          ipv4Piece = null;

          if (numbersSeen > 0) {
            if (char() == '.' && numbersSeen < 4) pointer++;else return;
          }

          if (!DIGIT.test(char())) return;

          while (DIGIT.test(char())) {
            number = parseInt(char(), 10);
            if (ipv4Piece === null) ipv4Piece = number;else if (ipv4Piece == 0) return;else ipv4Piece = ipv4Piece * 10 + number;
            if (ipv4Piece > 255) return;
            pointer++;
          }

          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
        }

        if (numbersSeen != 4) return;
        break;
      } else if (char() == ':') {
        pointer++;
        if (!char()) return;
      } else if (char()) return;

      address[pieceIndex++] = value;
    }

    if (compress !== null) {
      swaps = pieceIndex - compress;
      pieceIndex = 7;

      while (pieceIndex != 0 && swaps > 0) {
        swap = address[pieceIndex];
        address[pieceIndex--] = address[compress + swaps - 1];
        address[compress + --swaps] = swap;
      }
    } else if (pieceIndex != 8) return;

    return address;
  };

  var findLongestZeroSequence = function findLongestZeroSequence(ipv6) {
    var maxIndex = null;
    var maxLength = 1;
    var currStart = null;
    var currLength = 0;
    var index = 0;

    for (; index < 8; index++) {
      if (ipv6[index] !== 0) {
        if (currLength > maxLength) {
          maxIndex = currStart;
          maxLength = currLength;
        }

        currStart = null;
        currLength = 0;
      } else {
        if (currStart === null) currStart = index;
        ++currLength;
      }
    }

    if (currLength > maxLength) {
      maxIndex = currStart;
      maxLength = currLength;
    }

    return maxIndex;
  };

  var serializeHost = function serializeHost(host) {
    var result, index, compress, ignore0; // ipv4

    if (typeof host == 'number') {
      result = [];

      for (index = 0; index < 4; index++) {
        result.unshift(host % 256);
        host = floor$9(host / 256);
      }

      return result.join('.'); // ipv6
    } else if (_typeof(host) == 'object') {
      result = '';
      compress = findLongestZeroSequence(host);

      for (index = 0; index < 8; index++) {
        if (ignore0 && host[index] === 0) continue;
        if (ignore0) ignore0 = false;

        if (compress === index) {
          result += index ? ':' : '::';
          ignore0 = true;
        } else {
          result += host[index].toString(16);
          if (index < 7) result += ':';
        }
      }

      return '[' + result + ']';
    }

    return host;
  };

  var C0ControlPercentEncodeSet = {};
  var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
    ' ': 1,
    '"': 1,
    '<': 1,
    '>': 1,
    '`': 1
  });
  var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
    '#': 1,
    '?': 1,
    '{': 1,
    '}': 1
  });
  var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
    '/': 1,
    ':': 1,
    ';': 1,
    '=': 1,
    '@': 1,
    '[': 1,
    '\\': 1,
    ']': 1,
    '^': 1,
    '|': 1
  });

  var percentEncode = function percentEncode(char, set) {
    var code = codeAt$1(char, 0);
    return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
  };

  var specialSchemes = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };

  var isSpecial = function isSpecial(url) {
    return has(specialSchemes, url.scheme);
  };

  var includesCredentials = function includesCredentials(url) {
    return url.username != '' || url.password != '';
  };

  var cannotHaveUsernamePasswordPort = function cannotHaveUsernamePasswordPort(url) {
    return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
  };

  var isWindowsDriveLetter = function isWindowsDriveLetter(string, normalized) {
    var second;
    return string.length == 2 && ALPHA.test(string.charAt(0)) && ((second = string.charAt(1)) == ':' || !normalized && second == '|');
  };

  var startsWithWindowsDriveLetter = function startsWithWindowsDriveLetter(string) {
    var third;
    return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (string.length == 2 || (third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#');
  };

  var shortenURLsPath = function shortenURLsPath(url) {
    var path = url.path;
    var pathSize = path.length;

    if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
      path.pop();
    }
  };

  var isSingleDot = function isSingleDot(segment) {
    return segment === '.' || segment.toLowerCase() === '%2e';
  };

  var isDoubleDot = function isDoubleDot(segment) {
    segment = segment.toLowerCase();
    return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
  }; // States:


  var SCHEME_START = {};
  var SCHEME = {};
  var NO_SCHEME = {};
  var SPECIAL_RELATIVE_OR_AUTHORITY = {};
  var PATH_OR_AUTHORITY = {};
  var RELATIVE = {};
  var RELATIVE_SLASH = {};
  var SPECIAL_AUTHORITY_SLASHES = {};
  var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
  var AUTHORITY = {};
  var HOST = {};
  var HOSTNAME = {};
  var PORT = {};
  var FILE = {};
  var FILE_SLASH = {};
  var FILE_HOST = {};
  var PATH_START = {};
  var PATH = {};
  var CANNOT_BE_A_BASE_URL_PATH = {};
  var QUERY = {};
  var FRAGMENT = {}; // eslint-disable-next-line max-statements

  var parseURL = function parseURL(url, input, stateOverride, base) {
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, char, bufferCodePoints, failure;

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
    }

    input = input.replace(TAB_AND_NEW_LINE, '');
    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      char = codePoints[pointer];

      switch (state) {
        case SCHEME_START:
          if (char && ALPHA.test(char)) {
            buffer += char.toLowerCase();
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;

          break;

        case SCHEME:
          if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
            buffer += char.toLowerCase();
          } else if (char == ':') {
            if (stateOverride && (isSpecial(url) != has(specialSchemes, buffer) || buffer == 'file' && (includesCredentials(url) || url.port !== null) || url.scheme == 'file' && !url.host)) return;
            url.scheme = buffer;

            if (stateOverride) {
              if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
              return;
            }

            buffer = '';

            if (url.scheme == 'file') {
              state = FILE;
            } else if (isSpecial(url) && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (isSpecial(url)) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              url.path.push('');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;

          break;

        case NO_SCHEME:
          if (!base || base.cannotBeABaseURL && char != '#') return INVALID_SCHEME;

          if (base.cannotBeABaseURL && char == '#') {
            url.scheme = base.scheme;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }

          state = base.scheme == 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (char == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          }

          break;

        case PATH_OR_AUTHORITY:
          if (char == '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;

          if (char == EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '/' || char == '\\' && isSpecial(url)) {
            state = RELATIVE_SLASH;
          } else if (char == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.path.pop();
            state = PATH;
            continue;
          }

          break;

        case RELATIVE_SLASH:
          if (isSpecial(url) && (char == '/' || char == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (char == '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          }

          break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (char != '/' && char != '\\') {
            state = AUTHORITY;
            continue;
          }

          break;

        case AUTHORITY:
          if (char == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);

            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];

              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }

              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;else url.username += encodedCodePoints;
            }

            buffer = '';
          } else if (char == EOF || char == '/' || char == '?' || char == '#' || char == '\\' && isSpecial(url)) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += char;

          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST;
            continue;
          } else if (char == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
            if (stateOverride == HOSTNAME) return;
          } else if (char == EOF || char == '/' || char == '?' || char == '#' || char == '\\' && isSpecial(url)) {
            if (isSpecial(url) && buffer == '') return INVALID_HOST;
            if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (char == '[') seenBracket = true;else if (char == ']') seenBracket = false;
            buffer += char;
          }

          break;

        case PORT:
          if (DIGIT.test(char)) {
            buffer += char;
          } else if (char == EOF || char == '/' || char == '?' || char == '#' || char == '\\' && isSpecial(url) || stateOverride) {
            if (buffer != '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = isSpecial(url) && port === specialSchemes[url.scheme] ? null : port;
              buffer = '';
            }

            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;

          break;

        case FILE:
          url.scheme = 'file';
          if (char == '/' || char == '\\') state = FILE_SLASH;else if (base && base.scheme == 'file') {
            if (char == EOF) {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
            } else if (char == '?') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
                url.host = base.host;
                url.path = base.path.slice();
                shortenURLsPath(url);
              }

              state = PATH;
              continue;
            }
          } else {
            state = PATH;
            continue;
          }
          break;

        case FILE_SLASH:
          if (char == '/' || char == '\\') {
            state = FILE_HOST;
            break;
          }

          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
            if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);else url.host = base.host;
          }

          state = PATH;
          continue;

        case FILE_HOST:
          if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = parseHost(url, buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            }

            continue;
          } else buffer += char;

          break;

        case PATH_START:
          if (isSpecial(url)) {
            state = PATH;
            if (char != '/' && char != '\\') continue;
          } else if (!stateOverride && char == '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            state = PATH;
            if (char != '/') continue;
          }

          break;

        case PATH:
          if (char == EOF || char == '/' || char == '\\' && isSpecial(url) || !stateOverride && (char == '?' || char == '#')) {
            if (isDoubleDot(buffer)) {
              shortenURLsPath(url);

              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else if (isSingleDot(buffer)) {
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                if (url.host) url.host = '';
                buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
              }

              url.path.push(buffer);
            }

            buffer = '';

            if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                url.path.shift();
              }
            }

            if (char == '?') {
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += percentEncode(char, pathPercentEncodeSet);
          }

          break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
          }

          break;

        case QUERY:
          if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            if (char == "'" && isSpecial(url)) url.query += '%27';else if (char == '#') url.query += '%23';else url.query += percentEncode(char, C0ControlPercentEncodeSet);
          }

          break;

        case FRAGMENT:
          if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  }; // `URL` constructor
  // https://url.spec.whatwg.org/#url-class


  var URLConstructor = function URL(url
  /* , base */
  ) {
    var that = anInstance(this, URLConstructor, 'URL');
    var base = arguments.length > 1 ? arguments[1] : undefined;
    var urlString = String(url);
    var state = setInternalState$a(that, {
      type: 'URL'
    });
    var baseState, failure;

    if (base !== undefined) {
      if (base instanceof URLConstructor) baseState = getInternalURLState(base);else {
        failure = parseURL(baseState = {}, String(base));
        if (failure) throw TypeError(failure);
      }
    }

    failure = parseURL(state, urlString, null, baseState);
    if (failure) throw TypeError(failure);
    var searchParams = state.searchParams = new URLSearchParams$1();
    var searchParamsState = getInternalSearchParamsState(searchParams);
    searchParamsState.updateSearchParams(state.query);

    searchParamsState.updateURL = function () {
      state.query = String(searchParams) || null;
    };

    if (!descriptors) {
      that.href = serializeURL.call(that);
      that.origin = getOrigin.call(that);
      that.protocol = getProtocol.call(that);
      that.username = getUsername.call(that);
      that.password = getPassword.call(that);
      that.host = getHost.call(that);
      that.hostname = getHostname.call(that);
      that.port = getPort.call(that);
      that.pathname = getPathname.call(that);
      that.search = getSearch.call(that);
      that.searchParams = getSearchParams.call(that);
      that.hash = getHash.call(that);
    }
  };

  var URLPrototype = URLConstructor.prototype;

  var serializeURL = function serializeURL() {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';

    if (host !== null) {
      output += '//';

      if (includesCredentials(url)) {
        output += username + (password ? ':' + password : '') + '@';
      }

      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';

    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  };

  var getOrigin = function getOrigin() {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var port = url.port;
    if (scheme == 'blob') try {
      return new URL(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !isSpecial(url)) return 'null';
    return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
  };

  var getProtocol = function getProtocol() {
    return getInternalURLState(this).scheme + ':';
  };

  var getUsername = function getUsername() {
    return getInternalURLState(this).username;
  };

  var getPassword = function getPassword() {
    return getInternalURLState(this).password;
  };

  var getHost = function getHost() {
    var url = getInternalURLState(this);
    var host = url.host;
    var port = url.port;
    return host === null ? '' : port === null ? serializeHost(host) : serializeHost(host) + ':' + port;
  };

  var getHostname = function getHostname() {
    var host = getInternalURLState(this).host;
    return host === null ? '' : serializeHost(host);
  };

  var getPort = function getPort() {
    var port = getInternalURLState(this).port;
    return port === null ? '' : String(port);
  };

  var getPathname = function getPathname() {
    var url = getInternalURLState(this);
    var path = url.path;
    return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  };

  var getSearch = function getSearch() {
    var query = getInternalURLState(this).query;
    return query ? '?' + query : '';
  };

  var getSearchParams = function getSearchParams() {
    return getInternalURLState(this).searchParams;
  };

  var getHash = function getHash() {
    var fragment = getInternalURLState(this).fragment;
    return fragment ? '#' + fragment : '';
  };

  var accessorDescriptor = function accessorDescriptor(getter, setter) {
    return {
      get: getter,
      set: setter,
      configurable: true,
      enumerable: true
    };
  };

  if (descriptors) {
    objectDefineProperties(URLPrototype, {
      // `URL.prototype.href` accessors pair
      // https://url.spec.whatwg.org/#dom-url-href
      href: accessorDescriptor(serializeURL, function (href) {
        var url = getInternalURLState(this);
        var urlString = String(href);
        var failure = parseURL(url, urlString);
        if (failure) throw TypeError(failure);
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.origin` getter
      // https://url.spec.whatwg.org/#dom-url-origin
      origin: accessorDescriptor(getOrigin),
      // `URL.prototype.protocol` accessors pair
      // https://url.spec.whatwg.org/#dom-url-protocol
      protocol: accessorDescriptor(getProtocol, function (protocol) {
        var url = getInternalURLState(this);
        parseURL(url, String(protocol) + ':', SCHEME_START);
      }),
      // `URL.prototype.username` accessors pair
      // https://url.spec.whatwg.org/#dom-url-username
      username: accessorDescriptor(getUsername, function (username) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(username));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.username = '';

        for (var i = 0; i < codePoints.length; i++) {
          url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.password` accessors pair
      // https://url.spec.whatwg.org/#dom-url-password
      password: accessorDescriptor(getPassword, function (password) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(password));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.password = '';

        for (var i = 0; i < codePoints.length; i++) {
          url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.host` accessors pair
      // https://url.spec.whatwg.org/#dom-url-host
      host: accessorDescriptor(getHost, function (host) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(host), HOST);
      }),
      // `URL.prototype.hostname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hostname
      hostname: accessorDescriptor(getHostname, function (hostname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(hostname), HOSTNAME);
      }),
      // `URL.prototype.port` accessors pair
      // https://url.spec.whatwg.org/#dom-url-port
      port: accessorDescriptor(getPort, function (port) {
        var url = getInternalURLState(this);
        if (cannotHaveUsernamePasswordPort(url)) return;
        port = String(port);
        if (port == '') url.port = null;else parseURL(url, port, PORT);
      }),
      // `URL.prototype.pathname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-pathname
      pathname: accessorDescriptor(getPathname, function (pathname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        url.path = [];
        parseURL(url, pathname + '', PATH_START);
      }),
      // `URL.prototype.search` accessors pair
      // https://url.spec.whatwg.org/#dom-url-search
      search: accessorDescriptor(getSearch, function (search) {
        var url = getInternalURLState(this);
        search = String(search);

        if (search == '') {
          url.query = null;
        } else {
          if ('?' == search.charAt(0)) search = search.slice(1);
          url.query = '';
          parseURL(url, search, QUERY);
        }

        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.searchParams` getter
      // https://url.spec.whatwg.org/#dom-url-searchparams
      searchParams: accessorDescriptor(getSearchParams),
      // `URL.prototype.hash` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hash
      hash: accessorDescriptor(getHash, function (hash) {
        var url = getInternalURLState(this);
        hash = String(hash);

        if (hash == '') {
          url.fragment = null;
          return;
        }

        if ('#' == hash.charAt(0)) hash = hash.slice(1);
        url.fragment = '';
        parseURL(url, hash, FRAGMENT);
      })
    });
  } // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson


  redefine(URLPrototype, 'toJSON', function toJSON() {
    return serializeURL.call(this);
  }, {
    enumerable: true
  }); // `URL.prototype.toString` method
  // https://url.spec.whatwg.org/#URL-stringification-behavior

  redefine(URLPrototype, 'toString', function toString() {
    return serializeURL.call(this);
  }, {
    enumerable: true
  });

  if (NativeURL) {
    var nativeCreateObjectURL = NativeURL.createObjectURL;
    var nativeRevokeObjectURL = NativeURL.revokeObjectURL; // `URL.createObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    // eslint-disable-next-line no-unused-vars

    if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
      return nativeCreateObjectURL.apply(NativeURL, arguments);
    }); // `URL.revokeObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    // eslint-disable-next-line no-unused-vars

    if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
      return nativeRevokeObjectURL.apply(NativeURL, arguments);
    });
  }

  setToStringTag(URLConstructor, 'URL');
  _export({
    global: true,
    forced: !nativeUrl,
    sham: !descriptors
  }, {
    URL: URLConstructor
  });

  // https://url.spec.whatwg.org/#dom-url-tojson


  _export({
    target: 'URL',
    proto: true,
    enumerable: true
  }, {
    toJSON: function toJSON() {
      return URL.prototype.toString.call(this);
    }
  });

  (function (global) {
    /**
     * Polyfill URLSearchParams
     *
     * Inspired from : https://github.com/WebReflection/url-search-params/blob/master/src/url-search-params.js
     */
    var checkIfIteratorIsSupported = function checkIfIteratorIsSupported() {
      try {
        return !!Symbol.iterator;
      } catch (error) {
        return false;
      }
    };

    var iteratorSupported = checkIfIteratorIsSupported();

    var createIterator = function createIterator(items) {
      var iterator = {
        next: function next() {
          var value = items.shift();
          return {
            done: value === void 0,
            value: value
          };
        }
      };

      if (iteratorSupported) {
        iterator[Symbol.iterator] = function () {
          return iterator;
        };
      }

      return iterator;
    };
    /**
     * Search param name and values should be encoded according to https://url.spec.whatwg.org/#urlencoded-serializing
     * encodeURIComponent() produces the same result except encoding spaces as `%20` instead of `+`.
     */


    var serializeParam = function serializeParam(value) {
      return encodeURIComponent(value).replace(/%20/g, '+');
    };

    var deserializeParam = function deserializeParam(value) {
      return decodeURIComponent(String(value).replace(/\+/g, ' '));
    };

    var polyfillURLSearchParams = function polyfillURLSearchParams() {
      var URLSearchParams = function URLSearchParams(searchString) {
        Object.defineProperty(this, '_entries', {
          writable: true,
          value: {}
        });

        var typeofSearchString = _typeof(searchString);

        if (typeofSearchString === 'undefined') ; else if (typeofSearchString === 'string') {
          if (searchString !== '') {
            this._fromString(searchString);
          }
        } else if (searchString instanceof URLSearchParams) {
          var _this = this;

          searchString.forEach(function (value, name) {
            _this.append(name, value);
          });
        } else if (searchString !== null && typeofSearchString === 'object') {
          if (Object.prototype.toString.call(searchString) === '[object Array]') {
            for (var i = 0; i < searchString.length; i++) {
              var entry = searchString[i];

              if (Object.prototype.toString.call(entry) === '[object Array]' || entry.length !== 2) {
                this.append(entry[0], entry[1]);
              } else {
                throw new TypeError('Expected [string, any] as entry at index ' + i + ' of URLSearchParams\'s input');
              }
            }
          } else {
            for (var key in searchString) {
              if (searchString.hasOwnProperty(key)) {
                this.append(key, searchString[key]);
              }
            }
          }
        } else {
          throw new TypeError('Unsupported input\'s type for URLSearchParams');
        }
      };

      var proto = URLSearchParams.prototype;

      proto.append = function (name, value) {
        if (name in this._entries) {
          this._entries[name].push(String(value));
        } else {
          this._entries[name] = [String(value)];
        }
      };

      proto.delete = function (name) {
        delete this._entries[name];
      };

      proto.get = function (name) {
        return name in this._entries ? this._entries[name][0] : null;
      };

      proto.getAll = function (name) {
        return name in this._entries ? this._entries[name].slice(0) : [];
      };

      proto.has = function (name) {
        return name in this._entries;
      };

      proto.set = function (name, value) {
        this._entries[name] = [String(value)];
      };

      proto.forEach = function (callback, thisArg) {
        var entries;

        for (var name in this._entries) {
          if (this._entries.hasOwnProperty(name)) {
            entries = this._entries[name];

            for (var i = 0; i < entries.length; i++) {
              callback.call(thisArg, entries[i], name, this);
            }
          }
        }
      };

      proto.keys = function () {
        var items = [];
        this.forEach(function (value, name) {
          items.push(name);
        });
        return createIterator(items);
      };

      proto.values = function () {
        var items = [];
        this.forEach(function (value) {
          items.push(value);
        });
        return createIterator(items);
      };

      proto.entries = function () {
        var items = [];
        this.forEach(function (value, name) {
          items.push([name, value]);
        });
        return createIterator(items);
      };

      if (iteratorSupported) {
        proto[Symbol.iterator] = proto.entries;
      }

      proto.toString = function () {
        var searchArray = [];
        this.forEach(function (value, name) {
          searchArray.push(serializeParam(name) + '=' + serializeParam(value));
        });
        return searchArray.join('&');
      };

      global.URLSearchParams = URLSearchParams;
    };

    var checkIfURLSearchParamsSupported = function checkIfURLSearchParamsSupported() {
      try {
        var URLSearchParams = global.URLSearchParams;
        return new URLSearchParams('?a=1').toString() === 'a=1' && typeof URLSearchParams.prototype.set === 'function' && typeof URLSearchParams.prototype.entries === 'function';
      } catch (e) {
        return false;
      }
    };

    if (!checkIfURLSearchParamsSupported()) {
      polyfillURLSearchParams();
    }

    var proto = global.URLSearchParams.prototype;

    if (typeof proto.sort !== 'function') {
      proto.sort = function () {
        var _this = this;

        var items = [];
        this.forEach(function (value, name) {
          items.push([name, value]);

          if (!_this._entries) {
            _this.delete(name);
          }
        });
        items.sort(function (a, b) {
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] > b[0]) {
            return +1;
          } else {
            return 0;
          }
        });

        if (_this._entries) {
          // force reset because IE keeps keys index
          _this._entries = {};
        }

        for (var i = 0; i < items.length; i++) {
          this.append(items[i][0], items[i][1]);
        }
      };
    }

    if (typeof proto._fromString !== 'function') {
      Object.defineProperty(proto, '_fromString', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function value(searchString) {
          if (this._entries) {
            this._entries = {};
          } else {
            var keys = [];
            this.forEach(function (value, name) {
              keys.push(name);
            });

            for (var i = 0; i < keys.length; i++) {
              this.delete(keys[i]);
            }
          }

          searchString = searchString.replace(/^\?/, '');
          var attributes = searchString.split('&');
          var attribute;

          for (var i = 0; i < attributes.length; i++) {
            attribute = attributes[i].split('=');
            this.append(deserializeParam(attribute[0]), attribute.length > 1 ? deserializeParam(attribute[1]) : '');
          }
        }
      });
    } // HTMLAnchorElement

  })(typeof global$1 !== 'undefined' ? global$1 : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : undefined);

  (function (global) {
    /**
     * Polyfill URL
     *
     * Inspired from : https://github.com/arv/DOM-URL-Polyfill/blob/master/src/url.js
     */
    var checkIfURLIsSupported = function checkIfURLIsSupported() {
      try {
        var u = new global.URL('b', 'http://a');
        u.pathname = 'c d';
        return u.href === 'http://a/c%20d' && u.searchParams;
      } catch (e) {
        return false;
      }
    };

    var polyfillURL = function polyfillURL() {
      var _URL = global.URL;

      var URL = function URL(url, base) {
        if (typeof url !== 'string') url = String(url); // Only create another document if the base is different from current location.

        var doc = document,
            baseElement;

        if (base && (global.location === void 0 || base !== global.location.href)) {
          doc = document.implementation.createHTMLDocument('');
          baseElement = doc.createElement('base');
          baseElement.href = base;
          doc.head.appendChild(baseElement);

          try {
            if (baseElement.href.indexOf(base) !== 0) throw new Error(baseElement.href);
          } catch (err) {
            throw new Error('URL unable to set base ' + base + ' due to ' + err);
          }
        }

        var anchorElement = doc.createElement('a');
        anchorElement.href = url;

        if (baseElement) {
          doc.body.appendChild(anchorElement);
          anchorElement.href = anchorElement.href; // force href to refresh
        }

        var inputElement = doc.createElement('input');
        inputElement.type = 'url';
        inputElement.value = url;

        if (anchorElement.protocol === ':' || !/:/.test(anchorElement.href) || !inputElement.checkValidity() && !base) {
          throw new TypeError('Invalid URL');
        }

        Object.defineProperty(this, '_anchorElement', {
          value: anchorElement
        }); // create a linked searchParams which reflect its changes on URL

        var searchParams = new global.URLSearchParams(this.search);
        var enableSearchUpdate = true;
        var enableSearchParamsUpdate = true;

        var _this = this;

        ['append', 'delete', 'set'].forEach(function (methodName) {
          var method = searchParams[methodName];

          searchParams[methodName] = function () {
            method.apply(searchParams, arguments);

            if (enableSearchUpdate) {
              enableSearchParamsUpdate = false;
              _this.search = searchParams.toString();
              enableSearchParamsUpdate = true;
            }
          };
        });
        Object.defineProperty(this, 'searchParams', {
          value: searchParams,
          enumerable: true
        });
        var search = void 0;
        Object.defineProperty(this, '_updateSearchParams', {
          enumerable: false,
          configurable: false,
          writable: false,
          value: function value() {
            if (this.search !== search) {
              search = this.search;

              if (enableSearchParamsUpdate) {
                enableSearchUpdate = false;

                this.searchParams._fromString(this.search);

                enableSearchUpdate = true;
              }
            }
          }
        });
      };

      var proto = URL.prototype;

      var linkURLWithAnchorAttribute = function linkURLWithAnchorAttribute(attributeName) {
        Object.defineProperty(proto, attributeName, {
          get: function get() {
            return this._anchorElement[attributeName];
          },
          set: function set(value) {
            this._anchorElement[attributeName] = value;
          },
          enumerable: true
        });
      };

      ['hash', 'host', 'hostname', 'port', 'protocol'].forEach(function (attributeName) {
        linkURLWithAnchorAttribute(attributeName);
      });
      Object.defineProperty(proto, 'search', {
        get: function get() {
          return this._anchorElement['search'];
        },
        set: function set(value) {
          this._anchorElement['search'] = value;

          this._updateSearchParams();
        },
        enumerable: true
      });
      Object.defineProperties(proto, {
        'toString': {
          get: function get() {
            var _this = this;

            return function () {
              return _this.href;
            };
          }
        },
        'href': {
          get: function get() {
            return this._anchorElement.href.replace(/\?$/, '');
          },
          set: function set(value) {
            this._anchorElement.href = value;

            this._updateSearchParams();
          },
          enumerable: true
        },
        'pathname': {
          get: function get() {
            return this._anchorElement.pathname.replace(/(^\/?)/, '/');
          },
          set: function set(value) {
            this._anchorElement.pathname = value;
          },
          enumerable: true
        },
        'origin': {
          get: function get() {
            // get expected port from protocol
            var expectedPort = {
              'http:': 80,
              'https:': 443,
              'ftp:': 21
            }[this._anchorElement.protocol]; // add port to origin if, expected port is different than actual port
            // and it is not empty f.e http://foo:8080
            // 8080 != 80 && 8080 != ''

            var addPortToOrigin = this._anchorElement.port != expectedPort && this._anchorElement.port !== '';
            return this._anchorElement.protocol + '//' + this._anchorElement.hostname + (addPortToOrigin ? ':' + this._anchorElement.port : '');
          },
          enumerable: true
        },
        'password': {
          // TODO
          get: function get() {
            return '';
          },
          set: function set(value) {},
          enumerable: true
        },
        'username': {
          // TODO
          get: function get() {
            return '';
          },
          set: function set(value) {},
          enumerable: true
        }
      });

      URL.createObjectURL = function (blob) {
        return _URL.createObjectURL.apply(_URL, arguments);
      };

      URL.revokeObjectURL = function (url) {
        return _URL.revokeObjectURL.apply(_URL, arguments);
      };

      global.URL = URL;
    };

    if (!checkIfURLIsSupported()) {
      polyfillURL();
    }

    if (global.location !== void 0 && !('origin' in global.location)) {
      var getOrigin = function getOrigin() {
        return global.location.protocol + '//' + global.location.hostname + (global.location.port ? ':' + global.location.port : '');
      };

      try {
        Object.defineProperty(global.location, 'origin', {
          get: getOrigin,
          enumerable: true
        });
      } catch (e) {
        setInterval(function () {
          global.location.origin = getOrigin();
        }, 100);
      }
    }
  })(typeof global$1 !== 'undefined' ? global$1 : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : undefined);

  var global$2 = function (self) {
    return self; // eslint-disable-next-line no-invalid-this
  }(typeof self !== 'undefined' ? self : undefined);

  var support = {
    searchParams: 'URLSearchParams' in global$2,
    iterable: 'Symbol' in global$2 && 'iterator' in Symbol,
    blob: 'FileReader' in global$2 && 'Blob' in global$2 && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in global$2,
    arrayBuffer: 'ArrayBuffer' in global$2
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj);
  }

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }

    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
      throw new TypeError('Invalid character in header field name');
    }

    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }

    return value;
  } // Build a destructive iterator for the value list


  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return {
          done: value === undefined,
          value: value
        };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers$1(headers) {
    this.map = {};

    if (headers instanceof Headers$1) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers$1.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers$1.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers$1.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers$1.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers$1.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers$1.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers$1.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers$1.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers$1.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers$1.prototype[Symbol.iterator] = Headers$1.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }

    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };

      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }

    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      /*
        fetch-mock wraps the Response object in an ES6 Proxy to
        provide useful test harness features such as flush. However, on
        ES5 browsers without fetch or Proxy support pollyfills must be used;
        the proxy-pollyfill is unable to proxy an attribute unless it exists
        on the object before the Proxy is created. This change ensures
        Response.bodyUsed exists on the instance, while maintaining the
        semantic of setting Request.bodyUsed in the constructor before
        _initBody is called.
      */
      this.bodyUsed = this.bodyUsed;
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
        this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

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
      this.blob = function () {
        var rejected = consumed(this);

        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);

      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  } // HTTP methods whose capitalization should be normalized


  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }

      this.url = input.url;
      this.credentials = input.credentials;

      if (!options.headers) {
        this.headers = new Headers$1(input.headers);
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
      this.headers = new Headers$1(options.headers);
    }

    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }

    this._initBody(body);

    if (this.method === 'GET' || this.method === 'HEAD') {
      if (options.cache === 'no-store' || options.cache === 'no-cache') {
        // Search for a '_' parameter in the query string
        var reParamSearch = /([?&])_=[^&]*/;

        if (reParamSearch.test(this.url)) {
          // If it already exists then set the value with the current time
          this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
        } else {
          // Otherwise add a new '_' parameter to the end with the current time
          var reQueryString = /\?/;
          this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
        }
      }
    }
  }

  Request.prototype.clone = function () {
    return new Request(this, {
      body: this._bodyInit
    });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers$1(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2

    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();

      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);
  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : '';
    this.headers = new Headers$1(options.headers);
    this.url = options.url || '';

    this._initBody(bodyInit);
  }
  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers$1(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, {
      status: 0,
      statusText: ''
    });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, {
      status: status,
      headers: {
        location: url
      }
    });
  };

  var DOMException = global$2.DOMException;

  if (typeof DOMException !== 'function') {
    DOMException = function DOMException(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };

    DOMException.prototype = Object.create(Error.prototype);
    DOMException.prototype.constructor = DOMException;
  }

  function fetch(input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        setTimeout(function () {
          resolve(new Response(body, options));
        }, 0);
      };

      xhr.onerror = function () {
        setTimeout(function () {
          reject(new TypeError('Network request failed'));
        }, 0);
      };

      xhr.ontimeout = function () {
        setTimeout(function () {
          reject(new TypeError('Network request failed'));
        }, 0);
      };

      xhr.onabort = function () {
        setTimeout(function () {
          reject(new DOMException('Aborted', 'AbortError'));
        }, 0);
      };

      function fixUrl(url) {
        try {
          return url === '' && global$2.location.href ? global$2.location.href : url;
        } catch (e) {
          return url;
        }
      }

      xhr.open(request.method, fixUrl(request.url), true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr) {
        if (support.blob) {
          xhr.responseType = 'blob';
        } else if (support.arrayBuffer && request.headers.get('Content-Type') && request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1) {
          xhr.responseType = 'arraybuffer';
        }
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function () {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  }
  fetch.polyfill = true;

  if (!global$2.fetch) {
    global$2.fetch = fetch;
    global$2.Headers = Headers$1;
    global$2.Request = Request;
    global$2.Response = Response;
  }

  // License: https://github.com/beatgammit/base64-js/blob/bf68aaa277d9de7007cc0c58279c411bb10670ac/LICENSE

  function arrayBufferToBase64(ab) {
    var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    var uint8 = new Uint8Array(ab);
    var len = uint8.length;
    var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

    var parts = [];
    var maxChunkLength = 16383; // must be multiple of 3

    var tmp; // go through the array every three bytes, we'll deal with trailing stuff later

    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    } // pad the end with zeros, but make sure to not forget the extra bytes


    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3f] + '==');
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1];
      parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3f] + lookup[tmp << 2 & 0x3f] + '=');
    }

    return parts.join('');

    function tripletToBase64(num) {
      return lookup[num >> 18 & 0x3f] + lookup[num >> 12 & 0x3f] + lookup[num >> 6 & 0x3f] + lookup[num & 0x3f];
    }

    function encodeChunk(start, end) {
      var tmp;
      var output = [];

      for (var _i = start; _i < end; _i += 3) {
        tmp = (uint8[_i] << 16 & 0xff0000) + (uint8[_i + 1] << 8 & 0xff00) + (uint8[_i + 2] & 0xff);
        output.push(tripletToBase64(tmp));
      }

      return output.join('');
    }
  }

  var arrayBufferToBase64_1 = arrayBufferToBase64;

  function uuid() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  var uuid_1 = uuid;

  function isInlineFrame(frame) {
    return !/^https?:.+/.test(frame.src) || frame.contentDocument && frame.contentDocument.location && ['about:blank', 'about:srcdoc'].includes(frame.contentDocument.location.href);
  }

  var isInlineFrame_1 = isInlineFrame;

  function isAccessibleFrame(frame) {
    try {
      var doc = frame.contentDocument;
      return Boolean(doc && doc.defaultView && doc.defaultView.frameElement);
    } catch (err) {// for CORS frames
    }
  }

  var isAccessibleFrame_1 = isAccessibleFrame;

  function absolutizeUrl(url, absoluteUrl) {
    return new URL(url, absoluteUrl).href;
  }

  var absolutizeUrl_1 = absolutizeUrl;

  //
  //                              list
  //                            ┌──────┐
  //             ┌──────────────┼─head │
  //             │              │ tail─┼──────────────┐
  //             │              └──────┘              │
  //             ▼                                    ▼
  //            item        item        item        item
  //          ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
  //  null ◀──┼─prev │◀───┼─prev │◀───┼─prev │◀───┼─prev │
  //          │ next─┼───▶│ next─┼───▶│ next─┼───▶│ next─┼──▶ null
  //          ├──────┤    ├──────┤    ├──────┤    ├──────┤
  //          │ data │    │ data │    │ data │    │ data │
  //          └──────┘    └──────┘    └──────┘    └──────┘
  //
  function createItem(data) {
    return {
      prev: null,
      next: null,
      data: data
    };
  }

  function allocateCursor(node, prev, next) {
    var cursor;

    if (cursors !== null) {
      cursor = cursors;
      cursors = cursors.cursor;
      cursor.prev = prev;
      cursor.next = next;
      cursor.cursor = node.cursor;
    } else {
      cursor = {
        prev: prev,
        next: next,
        cursor: node.cursor
      };
    }

    node.cursor = cursor;
    return cursor;
  }

  function releaseCursor(node) {
    var cursor = node.cursor;
    node.cursor = cursor.cursor;
    cursor.prev = null;
    cursor.next = null;
    cursor.cursor = cursors;
    cursors = cursor;
  }

  var cursors = null;

  var List = function List() {
    this.cursor = null;
    this.head = null;
    this.tail = null;
  };

  List.createItem = createItem;
  List.prototype.createItem = createItem;

  List.prototype.updateCursors = function (prevOld, prevNew, nextOld, nextNew) {
    var cursor = this.cursor;

    while (cursor !== null) {
      if (cursor.prev === prevOld) {
        cursor.prev = prevNew;
      }

      if (cursor.next === nextOld) {
        cursor.next = nextNew;
      }

      cursor = cursor.cursor;
    }
  };

  List.prototype.getSize = function () {
    var size = 0;
    var cursor = this.head;

    while (cursor) {
      size++;
      cursor = cursor.next;
    }

    return size;
  };

  List.prototype.fromArray = function (array) {
    var cursor = null;
    this.head = null;

    for (var i = 0; i < array.length; i++) {
      var item = createItem(array[i]);

      if (cursor !== null) {
        cursor.next = item;
      } else {
        this.head = item;
      }

      item.prev = cursor;
      cursor = item;
    }

    this.tail = cursor;
    return this;
  };

  List.prototype.toArray = function () {
    var cursor = this.head;
    var result = [];

    while (cursor) {
      result.push(cursor.data);
      cursor = cursor.next;
    }

    return result;
  };

  List.prototype.toJSON = List.prototype.toArray;

  List.prototype.isEmpty = function () {
    return this.head === null;
  };

  List.prototype.first = function () {
    return this.head && this.head.data;
  };

  List.prototype.last = function () {
    return this.tail && this.tail.data;
  };

  List.prototype.each = function (fn, context) {
    var item;

    if (context === undefined) {
      context = this;
    } // push cursor


    var cursor = allocateCursor(this, null, this.head);

    while (cursor.next !== null) {
      item = cursor.next;
      cursor.next = item.next;
      fn.call(context, item.data, item, this);
    } // pop cursor


    releaseCursor(this);
  };

  List.prototype.forEach = List.prototype.each;

  List.prototype.eachRight = function (fn, context) {
    var item;

    if (context === undefined) {
      context = this;
    } // push cursor


    var cursor = allocateCursor(this, this.tail, null);

    while (cursor.prev !== null) {
      item = cursor.prev;
      cursor.prev = item.prev;
      fn.call(context, item.data, item, this);
    } // pop cursor


    releaseCursor(this);
  };

  List.prototype.forEachRight = List.prototype.eachRight;

  List.prototype.nextUntil = function (start, fn, context) {
    if (start === null) {
      return;
    }

    var item;

    if (context === undefined) {
      context = this;
    } // push cursor


    var cursor = allocateCursor(this, null, start);

    while (cursor.next !== null) {
      item = cursor.next;
      cursor.next = item.next;

      if (fn.call(context, item.data, item, this)) {
        break;
      }
    } // pop cursor


    releaseCursor(this);
  };

  List.prototype.prevUntil = function (start, fn, context) {
    if (start === null) {
      return;
    }

    var item;

    if (context === undefined) {
      context = this;
    } // push cursor


    var cursor = allocateCursor(this, start, null);

    while (cursor.prev !== null) {
      item = cursor.prev;
      cursor.prev = item.prev;

      if (fn.call(context, item.data, item, this)) {
        break;
      }
    } // pop cursor


    releaseCursor(this);
  };

  List.prototype.some = function (fn, context) {
    var cursor = this.head;

    if (context === undefined) {
      context = this;
    }

    while (cursor !== null) {
      if (fn.call(context, cursor.data, cursor, this)) {
        return true;
      }

      cursor = cursor.next;
    }

    return false;
  };

  List.prototype.map = function (fn, context) {
    var result = new List();
    var cursor = this.head;

    if (context === undefined) {
      context = this;
    }

    while (cursor !== null) {
      result.appendData(fn.call(context, cursor.data, cursor, this));
      cursor = cursor.next;
    }

    return result;
  };

  List.prototype.filter = function (fn, context) {
    var result = new List();
    var cursor = this.head;

    if (context === undefined) {
      context = this;
    }

    while (cursor !== null) {
      if (fn.call(context, cursor.data, cursor, this)) {
        result.appendData(cursor.data);
      }

      cursor = cursor.next;
    }

    return result;
  };

  List.prototype.clear = function () {
    this.head = null;
    this.tail = null;
  };

  List.prototype.copy = function () {
    var result = new List();
    var cursor = this.head;

    while (cursor !== null) {
      result.insert(createItem(cursor.data));
      cursor = cursor.next;
    }

    return result;
  };

  List.prototype.prepend = function (item) {
    //      head
    //    ^
    // item
    this.updateCursors(null, item, this.head, item); // insert to the beginning of the list

    if (this.head !== null) {
      // new item <- first item
      this.head.prev = item; // new item -> first item

      item.next = this.head;
    } else {
      // if list has no head, then it also has no tail
      // in this case tail points to the new item
      this.tail = item;
    } // head always points to new item


    this.head = item;
    return this;
  };

  List.prototype.prependData = function (data) {
    return this.prepend(createItem(data));
  };

  List.prototype.append = function (item) {
    return this.insert(item);
  };

  List.prototype.appendData = function (data) {
    return this.insert(createItem(data));
  };

  List.prototype.insert = function (item, before) {
    if (before !== undefined && before !== null) {
      // prev   before
      //      ^
      //     item
      this.updateCursors(before.prev, item, before, item);

      if (before.prev === null) {
        // insert to the beginning of list
        if (this.head !== before) {
          throw new Error('before doesn\'t belong to list');
        } // since head points to before therefore list doesn't empty
        // no need to check tail


        this.head = item;
        before.prev = item;
        item.next = before;
        this.updateCursors(null, item);
      } else {
        // insert between two items
        before.prev.next = item;
        item.prev = before.prev;
        before.prev = item;
        item.next = before;
      }
    } else {
      // tail
      //      ^
      //      item
      this.updateCursors(this.tail, item, null, item); // insert to the ending of the list

      if (this.tail !== null) {
        // last item -> new item
        this.tail.next = item; // last item <- new item

        item.prev = this.tail;
      } else {
        // if list has no tail, then it also has no head
        // in this case head points to new item
        this.head = item;
      } // tail always points to new item


      this.tail = item;
    }

    return this;
  };

  List.prototype.insertData = function (data, before) {
    return this.insert(createItem(data), before);
  };

  List.prototype.remove = function (item) {
    //      item
    //       ^
    // prev     next
    this.updateCursors(item, item.prev, item, item.next);

    if (item.prev !== null) {
      item.prev.next = item.next;
    } else {
      if (this.head !== item) {
        throw new Error('item doesn\'t belong to list');
      }

      this.head = item.next;
    }

    if (item.next !== null) {
      item.next.prev = item.prev;
    } else {
      if (this.tail !== item) {
        throw new Error('item doesn\'t belong to list');
      }

      this.tail = item.prev;
    }

    item.prev = null;
    item.next = null;
    return item;
  };

  List.prototype.push = function (data) {
    this.insert(createItem(data));
  };

  List.prototype.pop = function () {
    if (this.tail !== null) {
      return this.remove(this.tail);
    }
  };

  List.prototype.unshift = function (data) {
    this.prepend(createItem(data));
  };

  List.prototype.shift = function () {
    if (this.head !== null) {
      return this.remove(this.head);
    }
  };

  List.prototype.prependList = function (list) {
    return this.insertList(list, this.head);
  };

  List.prototype.appendList = function (list) {
    return this.insertList(list);
  };

  List.prototype.insertList = function (list, before) {
    // ignore empty lists
    if (list.head === null) {
      return this;
    }

    if (before !== undefined && before !== null) {
      this.updateCursors(before.prev, list.tail, before, list.head); // insert in the middle of dist list

      if (before.prev !== null) {
        // before.prev <-> list.head
        before.prev.next = list.head;
        list.head.prev = before.prev;
      } else {
        this.head = list.head;
      }

      before.prev = list.tail;
      list.tail.next = before;
    } else {
      this.updateCursors(this.tail, list.tail, null, list.head); // insert to end of the list

      if (this.tail !== null) {
        // if destination list has a tail, then it also has a head,
        // but head doesn't change
        // dest tail -> source head
        this.tail.next = list.head; // dest tail <- source head

        list.head.prev = this.tail;
      } else {
        // if list has no a tail, then it also has no a head
        // in this case points head to new item
        this.head = list.head;
      } // tail always start point to new item


      this.tail = list.tail;
    }

    list.head = null;
    list.tail = null;
    return this;
  };

  List.prototype.replace = function (oldItem, newItemOrList) {
    if ('head' in newItemOrList) {
      this.insertList(newItemOrList, oldItem);
    } else {
      this.insert(newItemOrList, oldItem);
    }

    this.remove(oldItem);
  };

  var List_1 = List;

  var createCustomError = function createCustomError(name, message) {
    // use Object.create(), because some VMs prevent setting line/column otherwise
    // (iOS Safari 10 even throws an exception)
    var error = Object.create(SyntaxError.prototype);
    var errorStack = new Error();
    error.name = name;
    error.message = message;
    Object.defineProperty(error, 'stack', {
      get: function get() {
        return (errorStack.stack || '').replace(/^(.+\n){1,3}/, name + ': ' + message + '\n');
      }
    });
    return error;
  };

  var MAX_LINE_LENGTH = 100;
  var OFFSET_CORRECTION = 60;
  var TAB_REPLACEMENT = '    ';

  function sourceFragment(error, extraLines) {
    function processLines(start, end) {
      return lines.slice(start, end).map(function (line, idx) {
        var num = String(start + idx + 1);

        while (num.length < maxNumLength) {
          num = ' ' + num;
        }

        return num + ' |' + line;
      }).join('\n');
    }

    var lines = error.source.split(/\r\n?|\n|\f/);
    var line = error.line;
    var column = error.column;
    var startLine = Math.max(1, line - extraLines) - 1;
    var endLine = Math.min(line + extraLines, lines.length + 1);
    var maxNumLength = Math.max(4, String(endLine).length) + 1;
    var cutLeft = 0; // column correction according to replaced tab before column

    column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;

    if (column > MAX_LINE_LENGTH) {
      cutLeft = column - OFFSET_CORRECTION + 3;
      column = OFFSET_CORRECTION - 2;
    }

    for (var i = startLine; i <= endLine; i++) {
      if (i >= 0 && i < lines.length) {
        lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
        lines[i] = (cutLeft > 0 && lines[i].length > cutLeft ? "\u2026" : '') + lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) + (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? "\u2026" : '');
      }
    }

    return [processLines(startLine, line), new Array(column + maxNumLength + 2).join('-') + '^', processLines(line, endLine)].filter(Boolean).join('\n');
  }

  var SyntaxError$1 = function SyntaxError(message, source, offset, line, column) {
    var error = createCustomError('SyntaxError', message);
    error.source = source;
    error.offset = offset;
    error.line = line;
    error.column = column;

    error.sourceFragment = function (extraLines) {
      return sourceFragment(error, isNaN(extraLines) ? 0 : extraLines);
    };

    Object.defineProperty(error, 'formattedMessage', {
      get: function get() {
        return 'Parse error: ' + error.message + '\n' + sourceFragment(error, 2);
      }
    }); // for backward capability

    error.parseError = {
      offset: offset,
      line: line,
      column: column
    };
    return error;
  };

  var _SyntaxError = SyntaxError$1;

  // CSS Syntax Module Level 3
  // https://www.w3.org/TR/css-syntax-3/
  var TYPE = {
    EOF: 0,
    // <EOF-token>
    Ident: 1,
    // <ident-token>
    Function: 2,
    // <function-token>
    AtKeyword: 3,
    // <at-keyword-token>
    Hash: 4,
    // <hash-token>
    String: 5,
    // <string-token>
    BadString: 6,
    // <bad-string-token>
    Url: 7,
    // <url-token>
    BadUrl: 8,
    // <bad-url-token>
    Delim: 9,
    // <delim-token>
    Number: 10,
    // <number-token>
    Percentage: 11,
    // <percentage-token>
    Dimension: 12,
    // <dimension-token>
    WhiteSpace: 13,
    // <whitespace-token>
    CDO: 14,
    // <CDO-token>
    CDC: 15,
    // <CDC-token>
    Colon: 16,
    // <colon-token>     :
    Semicolon: 17,
    // <semicolon-token> ;
    Comma: 18,
    // <comma-token>     ,
    LeftSquareBracket: 19,
    // <[-token>
    RightSquareBracket: 20,
    // <]-token>
    LeftParenthesis: 21,
    // <(-token>
    RightParenthesis: 22,
    // <)-token>
    LeftCurlyBracket: 23,
    // <{-token>
    RightCurlyBracket: 24,
    // <}-token>
    Comment: 25
  };
  var NAME$2 = Object.keys(TYPE).reduce(function (result, key) {
    result[TYPE[key]] = key;
    return result;
  }, {});
  var _const = {
    TYPE: TYPE,
    NAME: NAME$2
  };

  var EOF$1 = 0; // https://drafts.csswg.org/css-syntax-3/
  // § 4.2. Definitions
  // digit
  // A code point between U+0030 DIGIT ZERO (0) and U+0039 DIGIT NINE (9).

  function isDigit(code) {
    return code >= 0x0030 && code <= 0x0039;
  } // hex digit
  // A digit, or a code point between U+0041 LATIN CAPITAL LETTER A (A) and U+0046 LATIN CAPITAL LETTER F (F),
  // or a code point between U+0061 LATIN SMALL LETTER A (a) and U+0066 LATIN SMALL LETTER F (f).


  function isHexDigit(code) {
    return isDigit(code) || // 0 .. 9
    code >= 0x0041 && code <= 0x0046 || // A .. F
    code >= 0x0061 && code <= 0x0066 // a .. f
    ;
  } // uppercase letter
  // A code point between U+0041 LATIN CAPITAL LETTER A (A) and U+005A LATIN CAPITAL LETTER Z (Z).


  function isUppercaseLetter(code) {
    return code >= 0x0041 && code <= 0x005A;
  } // lowercase letter
  // A code point between U+0061 LATIN SMALL LETTER A (a) and U+007A LATIN SMALL LETTER Z (z).


  function isLowercaseLetter(code) {
    return code >= 0x0061 && code <= 0x007A;
  } // letter
  // An uppercase letter or a lowercase letter.


  function isLetter(code) {
    return isUppercaseLetter(code) || isLowercaseLetter(code);
  } // non-ASCII code point
  // A code point with a value equal to or greater than U+0080 <control>.


  function isNonAscii(code) {
    return code >= 0x0080;
  } // name-start code point
  // A letter, a non-ASCII code point, or U+005F LOW LINE (_).


  function isNameStart(code) {
    return isLetter(code) || isNonAscii(code) || code === 0x005F;
  } // name code point
  // A name-start code point, a digit, or U+002D HYPHEN-MINUS (-).


  function isName(code) {
    return isNameStart(code) || isDigit(code) || code === 0x002D;
  } // non-printable code point
  // A code point between U+0000 NULL and U+0008 BACKSPACE, or U+000B LINE TABULATION,
  // or a code point between U+000E SHIFT OUT and U+001F INFORMATION SEPARATOR ONE, or U+007F DELETE.


  function isNonPrintable(code) {
    return code >= 0x0000 && code <= 0x0008 || code === 0x000B || code >= 0x000E && code <= 0x001F || code === 0x007F;
  } // newline
  // U+000A LINE FEED. Note that U+000D CARRIAGE RETURN and U+000C FORM FEED are not included in this definition,
  // as they are converted to U+000A LINE FEED during preprocessing.
  // TODO: we doesn't do a preprocessing, so check a code point for U+000D CARRIAGE RETURN and U+000C FORM FEED


  function isNewline(code) {
    return code === 0x000A || code === 0x000D || code === 0x000C;
  } // whitespace
  // A newline, U+0009 CHARACTER TABULATION, or U+0020 SPACE.


  function isWhiteSpace(code) {
    return isNewline(code) || code === 0x0020 || code === 0x0009;
  } // § 4.3.8. Check if two code points are a valid escape


  function isValidEscape(first, second) {
    // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
    if (first !== 0x005C) {
      return false;
    } // Otherwise, if the second code point is a newline or EOF, return false.


    if (isNewline(second) || second === EOF$1) {
      return false;
    } // Otherwise, return true.


    return true;
  } // § 4.3.9. Check if three code points would start an identifier


  function isIdentifierStart(first, second, third) {
    // Look at the first code point:
    // U+002D HYPHEN-MINUS
    if (first === 0x002D) {
      // If the second code point is a name-start code point or a U+002D HYPHEN-MINUS,
      // or the second and third code points are a valid escape, return true. Otherwise, return false.
      return isNameStart(second) || second === 0x002D || isValidEscape(second, third);
    } // name-start code point


    if (isNameStart(first)) {
      // Return true.
      return true;
    } // U+005C REVERSE SOLIDUS (\)


    if (first === 0x005C) {
      // If the first and second code points are a valid escape, return true. Otherwise, return false.
      return isValidEscape(first, second);
    } // anything else
    // Return false.


    return false;
  } // § 4.3.10. Check if three code points would start a number


  function isNumberStart(first, second, third) {
    // Look at the first code point:
    // U+002B PLUS SIGN (+)
    // U+002D HYPHEN-MINUS (-)
    if (first === 0x002B || first === 0x002D) {
      // If the second code point is a digit, return true.
      if (isDigit(second)) {
        return 2;
      } // Otherwise, if the second code point is a U+002E FULL STOP (.)
      // and the third code point is a digit, return true.
      // Otherwise, return false.


      return second === 0x002E && isDigit(third) ? 3 : 0;
    } // U+002E FULL STOP (.)


    if (first === 0x002E) {
      // If the second code point is a digit, return true. Otherwise, return false.
      return isDigit(second) ? 2 : 0;
    } // digit


    if (isDigit(first)) {
      // Return true.
      return 1;
    } // anything else
    // Return false.


    return 0;
  } //
  // Misc
  //
  // detect BOM (https://en.wikipedia.org/wiki/Byte_order_mark)


  function isBOM(code) {
    // UTF-16BE
    if (code === 0xFEFF) {
      return 1;
    } // UTF-16LE


    if (code === 0xFFFE) {
      return 1;
    }

    return 0;
  } // Fast code category
  //
  // https://drafts.csswg.org/css-syntax/#tokenizer-definitions
  // > non-ASCII code point
  // >   A code point with a value equal to or greater than U+0080 <control>
  // > name-start code point
  // >   A letter, a non-ASCII code point, or U+005F LOW LINE (_).
  // > name code point
  // >   A name-start code point, a digit, or U+002D HYPHEN-MINUS (-)
  // That means only ASCII code points has a special meaning and we define a maps for 0..127 codes only


  var CATEGORY = new Array(0x80);
  charCodeCategory.Eof = 0x80;
  charCodeCategory.WhiteSpace = 0x82;
  charCodeCategory.Digit = 0x83;
  charCodeCategory.NameStart = 0x84;
  charCodeCategory.NonPrintable = 0x85;

  for (var i = 0; i < CATEGORY.length; i++) {
    switch (true) {
      case isWhiteSpace(i):
        CATEGORY[i] = charCodeCategory.WhiteSpace;
        break;

      case isDigit(i):
        CATEGORY[i] = charCodeCategory.Digit;
        break;

      case isNameStart(i):
        CATEGORY[i] = charCodeCategory.NameStart;
        break;

      case isNonPrintable(i):
        CATEGORY[i] = charCodeCategory.NonPrintable;
        break;

      default:
        CATEGORY[i] = i || charCodeCategory.Eof;
    }
  }

  function charCodeCategory(code) {
    return code < 0x80 ? CATEGORY[code] : charCodeCategory.NameStart;
  }
  var charCodeDefinitions = {
    isDigit: isDigit,
    isHexDigit: isHexDigit,
    isUppercaseLetter: isUppercaseLetter,
    isLowercaseLetter: isLowercaseLetter,
    isLetter: isLetter,
    isNonAscii: isNonAscii,
    isNameStart: isNameStart,
    isName: isName,
    isNonPrintable: isNonPrintable,
    isNewline: isNewline,
    isWhiteSpace: isWhiteSpace,
    isValidEscape: isValidEscape,
    isIdentifierStart: isIdentifierStart,
    isNumberStart: isNumberStart,
    isBOM: isBOM,
    charCodeCategory: charCodeCategory
  };

  var isDigit$1 = charCodeDefinitions.isDigit;
  var isHexDigit$1 = charCodeDefinitions.isHexDigit;
  var isUppercaseLetter$1 = charCodeDefinitions.isUppercaseLetter;
  var isName$1 = charCodeDefinitions.isName;
  var isWhiteSpace$1 = charCodeDefinitions.isWhiteSpace;
  var isValidEscape$1 = charCodeDefinitions.isValidEscape;

  function getCharCode(source, offset) {
    return offset < source.length ? source.charCodeAt(offset) : 0;
  }

  function getNewlineLength(source, offset, code) {
    if (code === 13
    /* \r */
    && getCharCode(source, offset + 1) === 10
    /* \n */
    ) {
        return 2;
      }

    return 1;
  }

  function cmpChar(testStr, offset, referenceCode) {
    var code = testStr.charCodeAt(offset); // code.toLowerCase() for A..Z

    if (isUppercaseLetter$1(code)) {
      code = code | 32;
    }

    return code === referenceCode;
  }

  function cmpStr(testStr, start, end, referenceStr) {
    if (end - start !== referenceStr.length) {
      return false;
    }

    if (start < 0 || end > testStr.length) {
      return false;
    }

    for (var i = start; i < end; i++) {
      var testCode = testStr.charCodeAt(i);
      var referenceCode = referenceStr.charCodeAt(i - start); // testCode.toLowerCase() for A..Z

      if (isUppercaseLetter$1(testCode)) {
        testCode = testCode | 32;
      }

      if (testCode !== referenceCode) {
        return false;
      }
    }

    return true;
  }

  function findWhiteSpaceStart(source, offset) {
    for (; offset >= 0; offset--) {
      if (!isWhiteSpace$1(source.charCodeAt(offset))) {
        break;
      }
    }

    return offset + 1;
  }

  function findWhiteSpaceEnd(source, offset) {
    for (; offset < source.length; offset++) {
      if (!isWhiteSpace$1(source.charCodeAt(offset))) {
        break;
      }
    }

    return offset;
  }

  function findDecimalNumberEnd(source, offset) {
    for (; offset < source.length; offset++) {
      if (!isDigit$1(source.charCodeAt(offset))) {
        break;
      }
    }

    return offset;
  } // § 4.3.7. Consume an escaped code point


  function consumeEscaped(source, offset) {
    // It assumes that the U+005C REVERSE SOLIDUS (\) has already been consumed and
    // that the next input code point has already been verified to be part of a valid escape.
    offset += 2; // hex digit

    if (isHexDigit$1(getCharCode(source, offset - 1))) {
      // Consume as many hex digits as possible, but no more than 5.
      // Note that this means 1-6 hex digits have been consumed in total.
      for (var maxOffset = Math.min(source.length, offset + 5); offset < maxOffset; offset++) {
        if (!isHexDigit$1(getCharCode(source, offset))) {
          break;
        }
      } // If the next input code point is whitespace, consume it as well.


      var code = getCharCode(source, offset);

      if (isWhiteSpace$1(code)) {
        offset += getNewlineLength(source, offset, code);
      }
    }

    return offset;
  } // §4.3.11. Consume a name
  // Note: This algorithm does not do the verification of the first few code points that are necessary
  // to ensure the returned code points would constitute an <ident-token>. If that is the intended use,
  // ensure that the stream starts with an identifier before calling this algorithm.


  function consumeName(source, offset) {
    // Let result initially be an empty string.
    // Repeatedly consume the next input code point from the stream:
    for (; offset < source.length; offset++) {
      var code = source.charCodeAt(offset); // name code point

      if (isName$1(code)) {
        // Append the code point to result.
        continue;
      } // the stream starts with a valid escape


      if (isValidEscape$1(code, getCharCode(source, offset + 1))) {
        // Consume an escaped code point. Append the returned code point to result.
        offset = consumeEscaped(source, offset) - 1;
        continue;
      } // anything else
      // Reconsume the current input code point. Return result.


      break;
    }

    return offset;
  } // §4.3.12. Consume a number


  function consumeNumber(source, offset) {
    var code = source.charCodeAt(offset); // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-),
    // consume it and append it to repr.

    if (code === 0x002B || code === 0x002D) {
      code = source.charCodeAt(offset += 1);
    } // 3. While the next input code point is a digit, consume it and append it to repr.


    if (isDigit$1(code)) {
      offset = findDecimalNumberEnd(source, offset + 1);
      code = source.charCodeAt(offset);
    } // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:


    if (code === 0x002E && isDigit$1(source.charCodeAt(offset + 1))) {
      // 4.1 Consume them.
      // 4.2 Append them to repr.
      code = source.charCodeAt(offset += 2); // 4.3 Set type to "number".
      // TODO
      // 4.4 While the next input code point is a digit, consume it and append it to repr.

      offset = findDecimalNumberEnd(source, offset);
    } // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
    // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:


    if (cmpChar(source, offset, 101
    /* e */
    )) {
      var sign = 0;
      code = source.charCodeAt(offset + 1); // ... optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+) ...

      if (code === 0x002D || code === 0x002B) {
        sign = 1;
        code = source.charCodeAt(offset + 2);
      } // ... followed by a digit


      if (isDigit$1(code)) {
        // 5.1 Consume them.
        // 5.2 Append them to repr.
        // 5.3 Set type to "number".
        // TODO
        // 5.4 While the next input code point is a digit, consume it and append it to repr.
        offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
      }
    }

    return offset;
  } // § 4.3.14. Consume the remnants of a bad url
  // ... its sole use is to consume enough of the input stream to reach a recovery point
  // where normal tokenizing can resume.


  function consumeBadUrlRemnants(source, offset) {
    // Repeatedly consume the next input code point from the stream:
    for (; offset < source.length; offset++) {
      var code = source.charCodeAt(offset); // U+0029 RIGHT PARENTHESIS ())
      // EOF

      if (code === 0x0029) {
        // Return.
        offset++;
        break;
      }

      if (isValidEscape$1(code, getCharCode(source, offset + 1))) {
        // Consume an escaped code point.
        // Note: This allows an escaped right parenthesis ("\)") to be encountered
        // without ending the <bad-url-token>. This is otherwise identical to
        // the "anything else" clause.
        offset = consumeEscaped(source, offset);
      }
    }

    return offset;
  }

  var utils = {
    consumeEscaped: consumeEscaped,
    consumeName: consumeName,
    consumeNumber: consumeNumber,
    consumeBadUrlRemnants: consumeBadUrlRemnants,
    cmpChar: cmpChar,
    cmpStr: cmpStr,
    getNewlineLength: getNewlineLength,
    findWhiteSpaceStart: findWhiteSpaceStart,
    findWhiteSpaceEnd: findWhiteSpaceEnd
  };

  var TYPE$1 = _const.TYPE;
  var NAME$3 = _const.NAME;
  var cmpStr$1 = utils.cmpStr;
  var EOF$2 = TYPE$1.EOF;
  var WHITESPACE = TYPE$1.WhiteSpace;
  var COMMENT = TYPE$1.Comment;
  var OFFSET_MASK = 0x00FFFFFF;
  var TYPE_SHIFT = 24;

  var TokenStream = function TokenStream() {
    this.offsetAndType = null;
    this.balance = null;
    this.reset();
  };

  TokenStream.prototype = {
    reset: function reset() {
      this.eof = false;
      this.tokenIndex = -1;
      this.tokenType = 0;
      this.tokenStart = this.firstCharOffset;
      this.tokenEnd = this.firstCharOffset;
    },
    lookupType: function lookupType(offset) {
      offset += this.tokenIndex;

      if (offset < this.tokenCount) {
        return this.offsetAndType[offset] >> TYPE_SHIFT;
      }

      return EOF$2;
    },
    lookupOffset: function lookupOffset(offset) {
      offset += this.tokenIndex;

      if (offset < this.tokenCount) {
        return this.offsetAndType[offset - 1] & OFFSET_MASK;
      }

      return this.source.length;
    },
    lookupValue: function lookupValue(offset, referenceStr) {
      offset += this.tokenIndex;

      if (offset < this.tokenCount) {
        return cmpStr$1(this.source, this.offsetAndType[offset - 1] & OFFSET_MASK, this.offsetAndType[offset] & OFFSET_MASK, referenceStr);
      }

      return false;
    },
    getTokenStart: function getTokenStart(tokenIndex) {
      if (tokenIndex === this.tokenIndex) {
        return this.tokenStart;
      }

      if (tokenIndex > 0) {
        return tokenIndex < this.tokenCount ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
      }

      return this.firstCharOffset;
    },
    // TODO: -> skipUntilBalanced
    getRawLength: function getRawLength(startToken, mode) {
      var cursor = startToken;
      var balanceEnd;
      var offset = this.offsetAndType[Math.max(cursor - 1, 0)] & OFFSET_MASK;
      var type;

      loop: for (; cursor < this.tokenCount; cursor++) {
        balanceEnd = this.balance[cursor]; // stop scanning on balance edge that points to offset before start token

        if (balanceEnd < startToken) {
          break loop;
        }

        type = this.offsetAndType[cursor] >> TYPE_SHIFT; // check token is stop type

        switch (mode(type, this.source, offset)) {
          case 1:
            break loop;

          case 2:
            cursor++;
            break loop;

          default:
            offset = this.offsetAndType[cursor] & OFFSET_MASK; // fast forward to the end of balanced block

            if (this.balance[balanceEnd] === cursor) {
              cursor = balanceEnd;
            }

        }
      }

      return cursor - this.tokenIndex;
    },
    isBalanceEdge: function isBalanceEdge(pos) {
      return this.balance[this.tokenIndex] < pos;
    },
    isDelim: function isDelim(code, offset) {
      if (offset) {
        return this.lookupType(offset) === TYPE$1.Delim && this.source.charCodeAt(this.lookupOffset(offset)) === code;
      }

      return this.tokenType === TYPE$1.Delim && this.source.charCodeAt(this.tokenStart) === code;
    },
    getTokenValue: function getTokenValue() {
      return this.source.substring(this.tokenStart, this.tokenEnd);
    },
    getTokenLength: function getTokenLength() {
      return this.tokenEnd - this.tokenStart;
    },
    substrToCursor: function substrToCursor(start) {
      return this.source.substring(start, this.tokenStart);
    },
    skipWS: function skipWS() {
      for (var i = this.tokenIndex, skipTokenCount = 0; i < this.tokenCount; i++, skipTokenCount++) {
        if (this.offsetAndType[i] >> TYPE_SHIFT !== WHITESPACE) {
          break;
        }
      }

      if (skipTokenCount > 0) {
        this.skip(skipTokenCount);
      }
    },
    skipSC: function skipSC() {
      while (this.tokenType === WHITESPACE || this.tokenType === COMMENT) {
        this.next();
      }
    },
    skip: function skip(tokenCount) {
      var next = this.tokenIndex + tokenCount;

      if (next < this.tokenCount) {
        this.tokenIndex = next;
        this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
        next = this.offsetAndType[next];
        this.tokenType = next >> TYPE_SHIFT;
        this.tokenEnd = next & OFFSET_MASK;
      } else {
        this.tokenIndex = this.tokenCount;
        this.next();
      }
    },
    next: function next() {
      var next = this.tokenIndex + 1;

      if (next < this.tokenCount) {
        this.tokenIndex = next;
        this.tokenStart = this.tokenEnd;
        next = this.offsetAndType[next];
        this.tokenType = next >> TYPE_SHIFT;
        this.tokenEnd = next & OFFSET_MASK;
      } else {
        this.tokenIndex = this.tokenCount;
        this.eof = true;
        this.tokenType = EOF$2;
        this.tokenStart = this.tokenEnd = this.source.length;
      }
    },
    dump: function dump() {
      var offset = this.firstCharOffset;
      return Array.prototype.slice.call(this.offsetAndType, 0, this.tokenCount).map(function (item, idx) {
        var start = offset;
        var end = item & OFFSET_MASK;
        offset = end;
        return {
          idx: idx,
          type: NAME$3[item >> TYPE_SHIFT],
          chunk: this.source.substring(start, end),
          balance: this.balance[idx]
        };
      }, this);
    }
  };
  var TokenStream_1 = TokenStream;

  function noop(value) {
    return value;
  }

  function generateMultiplier(multiplier) {
    if (multiplier.min === 0 && multiplier.max === 0) {
      return '*';
    }

    if (multiplier.min === 0 && multiplier.max === 1) {
      return '?';
    }

    if (multiplier.min === 1 && multiplier.max === 0) {
      return multiplier.comma ? '#' : '+';
    }

    if (multiplier.min === 1 && multiplier.max === 1) {
      return '';
    }

    return (multiplier.comma ? '#' : '') + (multiplier.min === multiplier.max ? '{' + multiplier.min + '}' : '{' + multiplier.min + ',' + (multiplier.max !== 0 ? multiplier.max : '') + '}');
  }

  function generateTypeOpts(node) {
    switch (node.type) {
      case 'Range':
        return ' [' + (node.min === null ? '-∞' : node.min) + ',' + (node.max === null ? '∞' : node.max) + ']';

      default:
        throw new Error('Unknown node type `' + node.type + '`');
    }
  }

  function generateSequence(node, decorate, forceBraces, compact) {
    var combinator = node.combinator === ' ' || compact ? node.combinator : ' ' + node.combinator + ' ';
    var result = node.terms.map(function (term) {
      return generate(term, decorate, forceBraces, compact);
    }).join(combinator);

    if (node.explicit || forceBraces) {
      result = (compact || result[0] === ',' ? '[' : '[ ') + result + (compact ? ']' : ' ]');
    }

    return result;
  }

  function generate(node, decorate, forceBraces, compact) {
    var result;

    switch (node.type) {
      case 'Group':
        result = generateSequence(node, decorate, forceBraces, compact) + (node.disallowEmpty ? '!' : '');
        break;

      case 'Multiplier':
        // return since node is a composition
        return generate(node.term, decorate, forceBraces, compact) + decorate(generateMultiplier(node), node);

      case 'Type':
        result = '<' + node.name + (node.opts ? decorate(generateTypeOpts(node.opts), node.opts) : '') + '>';
        break;

      case 'Property':
        result = '<\'' + node.name + '\'>';
        break;

      case 'Keyword':
        result = node.name;
        break;

      case 'AtKeyword':
        result = '@' + node.name;
        break;

      case 'Function':
        result = node.name + '(';
        break;

      case 'String':
      case 'Token':
        result = node.value;
        break;

      case 'Comma':
        result = ',';
        break;

      default:
        throw new Error('Unknown node type `' + node.type + '`');
    }

    return decorate(result, node);
  }

  var generate_1 = function generate_1(node, options) {
    var decorate = noop;
    var forceBraces = false;
    var compact = false;

    if (typeof options === 'function') {
      decorate = options;
    } else if (options) {
      forceBraces = Boolean(options.forceBraces);
      compact = Boolean(options.compact);

      if (typeof options.decorate === 'function') {
        decorate = options.decorate;
      }
    }

    return generate(node, decorate, forceBraces, compact);
  };

  function fromMatchResult(matchResult) {
    var tokens = matchResult.tokens;
    var longestMatch = matchResult.longestMatch;
    var node = longestMatch < tokens.length ? tokens[longestMatch].node : null;
    var mismatchOffset = -1;
    var entries = 0;
    var css = '';

    for (var i = 0; i < tokens.length; i++) {
      if (i === longestMatch) {
        mismatchOffset = css.length;
      }

      if (node !== null && tokens[i].node === node) {
        if (i <= longestMatch) {
          entries++;
        } else {
          entries = 0;
        }
      }

      css += tokens[i].value;
    }

    return {
      node: node,
      css: css,
      mismatchOffset: mismatchOffset === -1 ? css.length : mismatchOffset,
      last: node === null || entries > 1
    };
  }

  function getLocation(node, point) {
    var loc = node && node.loc && node.loc[point];

    if (loc) {
      return {
        offset: loc.offset,
        line: loc.line,
        column: loc.column
      };
    }

    return null;
  }

  var SyntaxReferenceError = function SyntaxReferenceError(type, referenceName) {
    var error = createCustomError('SyntaxReferenceError', type + (referenceName ? ' `' + referenceName + '`' : ''));
    error.reference = referenceName;
    return error;
  };

  var MatchError = function MatchError(message, syntax, node, matchResult) {
    var error = createCustomError('SyntaxMatchError', message);
    var details = fromMatchResult(matchResult);
    var mismatchOffset = details.mismatchOffset || 0;
    var badNode = details.node || node;
    var end = getLocation(badNode, 'end');
    var start = details.last ? end : getLocation(badNode, 'start');
    var css = details.css;
    error.rawMessage = message;
    error.syntax = syntax ? generate_1(syntax) : '<generic>';
    error.css = css;
    error.mismatchOffset = mismatchOffset;
    error.loc = {
      source: badNode && badNode.loc && badNode.loc.source || '<unknown>',
      start: start,
      end: end
    };
    error.line = start ? start.line : undefined;
    error.column = start ? start.column : undefined;
    error.offset = start ? start.offset : undefined;
    error.message = message + '\n' + '  syntax: ' + error.syntax + '\n' + '   value: ' + (error.css || '<empty string>') + '\n' + '  --------' + new Array(error.mismatchOffset + 1).join('-') + '^';
    return error;
  };

  var error = {
    SyntaxReferenceError: SyntaxReferenceError,
    MatchError: MatchError
  };

  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var keywords = Object.create(null);
  var properties = Object.create(null);
  var HYPHENMINUS = 45; // '-'.charCodeAt()

  function isCustomProperty(str, offset) {
    offset = offset || 0;
    return str.length - offset >= 2 && str.charCodeAt(offset) === HYPHENMINUS && str.charCodeAt(offset + 1) === HYPHENMINUS;
  }

  function getVendorPrefix(str, offset) {
    offset = offset || 0; // verdor prefix should be at least 3 chars length

    if (str.length - offset >= 3) {
      // vendor prefix starts with hyper minus following non-hyper minus
      if (str.charCodeAt(offset) === HYPHENMINUS && str.charCodeAt(offset + 1) !== HYPHENMINUS) {
        // vendor prefix should contain a hyper minus at the ending
        var secondDashIndex = str.indexOf('-', offset + 2);

        if (secondDashIndex !== -1) {
          return str.substring(offset, secondDashIndex + 1);
        }
      }
    }

    return '';
  }

  function getKeywordDescriptor(keyword) {
    if (hasOwnProperty$1.call(keywords, keyword)) {
      return keywords[keyword];
    }

    var name = keyword.toLowerCase();

    if (hasOwnProperty$1.call(keywords, name)) {
      return keywords[keyword] = keywords[name];
    }

    var custom = isCustomProperty(name, 0);
    var vendor = !custom ? getVendorPrefix(name, 0) : '';
    return keywords[keyword] = Object.freeze({
      basename: name.substr(vendor.length),
      name: name,
      vendor: vendor,
      prefix: vendor,
      custom: custom
    });
  }

  function getPropertyDescriptor(property) {
    if (hasOwnProperty$1.call(properties, property)) {
      return properties[property];
    }

    var name = property;
    var hack = property[0];

    if (hack === '/') {
      hack = property[1] === '/' ? '//' : '/';
    } else if (hack !== '_' && hack !== '*' && hack !== '$' && hack !== '#' && hack !== '+' && hack !== '&') {
      hack = '';
    }

    var custom = isCustomProperty(name, hack.length); // re-use result when possible (the same as for lower case)

    if (!custom) {
      name = name.toLowerCase();

      if (hasOwnProperty$1.call(properties, name)) {
        return properties[property] = properties[name];
      }
    }

    var vendor = !custom ? getVendorPrefix(name, hack.length) : '';
    var prefix = name.substr(0, hack.length + vendor.length);
    return properties[property] = Object.freeze({
      basename: name.substr(prefix.length),
      name: name.substr(hack.length),
      hack: hack,
      vendor: vendor,
      prefix: prefix,
      custom: custom
    });
  }

  var names = {
    keyword: getKeywordDescriptor,
    property: getPropertyDescriptor,
    isCustomProperty: isCustomProperty,
    vendorPrefix: getVendorPrefix
  };

  var MIN_SIZE = 16 * 1024;
  var SafeUint32Array = typeof Uint32Array !== 'undefined' ? Uint32Array : Array; // fallback on Array when TypedArray is not supported

  var adoptBuffer = function adoptBuffer(buffer, size) {
    if (buffer === null || buffer.length < size) {
      return new SafeUint32Array(Math.max(size + 1024, MIN_SIZE));
    }

    return buffer;
  };

  var TYPE$2 = _const.TYPE;
  var isNewline$1 = charCodeDefinitions.isNewline;
  var isName$2 = charCodeDefinitions.isName;
  var isValidEscape$2 = charCodeDefinitions.isValidEscape;
  var isNumberStart$1 = charCodeDefinitions.isNumberStart;
  var isIdentifierStart$1 = charCodeDefinitions.isIdentifierStart;
  var charCodeCategory$1 = charCodeDefinitions.charCodeCategory;
  var isBOM$1 = charCodeDefinitions.isBOM;
  var cmpStr$2 = utils.cmpStr;
  var getNewlineLength$1 = utils.getNewlineLength;
  var findWhiteSpaceEnd$1 = utils.findWhiteSpaceEnd;
  var consumeEscaped$1 = utils.consumeEscaped;
  var consumeName$1 = utils.consumeName;
  var consumeNumber$1 = utils.consumeNumber;
  var consumeBadUrlRemnants$1 = utils.consumeBadUrlRemnants;
  var OFFSET_MASK$1 = 0x00FFFFFF;
  var TYPE_SHIFT$1 = 24;

  function tokenize(source, stream) {
    function getCharCode(offset) {
      return offset < sourceLength ? source.charCodeAt(offset) : 0;
    } // § 4.3.3. Consume a numeric token


    function consumeNumericToken() {
      // Consume a number and let number be the result.
      offset = consumeNumber$1(source, offset); // If the next 3 input code points would start an identifier, then:

      if (isIdentifierStart$1(getCharCode(offset), getCharCode(offset + 1), getCharCode(offset + 2))) {
        // Create a <dimension-token> with the same value and type flag as number, and a unit set initially to the empty string.
        // Consume a name. Set the <dimension-token>’s unit to the returned value.
        // Return the <dimension-token>.
        type = TYPE$2.Dimension;
        offset = consumeName$1(source, offset);
        return;
      } // Otherwise, if the next input code point is U+0025 PERCENTAGE SIGN (%), consume it.


      if (getCharCode(offset) === 0x0025) {
        // Create a <percentage-token> with the same value as number, and return it.
        type = TYPE$2.Percentage;
        offset++;
        return;
      } // Otherwise, create a <number-token> with the same value and type flag as number, and return it.


      type = TYPE$2.Number;
    } // § 4.3.4. Consume an ident-like token


    function consumeIdentLikeToken() {
      var nameStartOffset = offset; // Consume a name, and let string be the result.

      offset = consumeName$1(source, offset); // If string’s value is an ASCII case-insensitive match for "url",
      // and the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.

      if (cmpStr$2(source, nameStartOffset, offset, 'url') && getCharCode(offset) === 0x0028) {
        // While the next two input code points are whitespace, consume the next input code point.
        offset = findWhiteSpaceEnd$1(source, offset + 1); // If the next one or two input code points are U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE ('),
        // or whitespace followed by U+0022 QUOTATION MARK (") or U+0027 APOSTROPHE ('),
        // then create a <function-token> with its value set to string and return it.

        if (getCharCode(offset) === 0x0022 || getCharCode(offset) === 0x0027) {
          type = TYPE$2.Function;
          offset = nameStartOffset + 4;
          return;
        } // Otherwise, consume a url token, and return it.


        consumeUrlToken();
        return;
      } // Otherwise, if the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
      // Create a <function-token> with its value set to string and return it.


      if (getCharCode(offset) === 0x0028) {
        type = TYPE$2.Function;
        offset++;
        return;
      } // Otherwise, create an <ident-token> with its value set to string and return it.


      type = TYPE$2.Ident;
    } // § 4.3.5. Consume a string token


    function consumeStringToken(endingCodePoint) {
      // This algorithm may be called with an ending code point, which denotes the code point
      // that ends the string. If an ending code point is not specified,
      // the current input code point is used.
      if (!endingCodePoint) {
        endingCodePoint = getCharCode(offset++);
      } // Initially create a <string-token> with its value set to the empty string.


      type = TYPE$2.String; // Repeatedly consume the next input code point from the stream:

      for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        switch (charCodeCategory$1(code)) {
          // ending code point
          case endingCodePoint:
            // Return the <string-token>.
            offset++;
            return;
          // EOF

          case charCodeCategory$1.Eof:
            // This is a parse error. Return the <string-token>.
            return;
          // newline

          case charCodeCategory$1.WhiteSpace:
            if (isNewline$1(code)) {
              // This is a parse error. Reconsume the current input code point,
              // create a <bad-string-token>, and return it.
              offset += getNewlineLength$1(source, offset, code);
              type = TYPE$2.BadString;
              return;
            }

            break;
          // U+005C REVERSE SOLIDUS (\)

          case 0x005C:
            // If the next input code point is EOF, do nothing.
            if (offset === source.length - 1) {
              break;
            }

            var nextCode = getCharCode(offset + 1); // Otherwise, if the next input code point is a newline, consume it.

            if (isNewline$1(nextCode)) {
              offset += getNewlineLength$1(source, offset + 1, nextCode);
            } else if (isValidEscape$2(code, nextCode)) {
              // Otherwise, (the stream starts with a valid escape) consume
              // an escaped code point and append the returned code point to
              // the <string-token>’s value.
              offset = consumeEscaped$1(source, offset) - 1;
            }

            break;
          // anything else
          // Append the current input code point to the <string-token>’s value.
        }
      }
    } // § 4.3.6. Consume a url token
    // Note: This algorithm assumes that the initial "url(" has already been consumed.
    // This algorithm also assumes that it’s being called to consume an "unquoted" value, like url(foo).
    // A quoted value, like url("foo"), is parsed as a <function-token>. Consume an ident-like token
    // automatically handles this distinction; this algorithm shouldn’t be called directly otherwise.


    function consumeUrlToken() {
      // Initially create a <url-token> with its value set to the empty string.
      type = TYPE$2.Url; // Consume as much whitespace as possible.

      offset = findWhiteSpaceEnd$1(source, offset); // Repeatedly consume the next input code point from the stream:

      for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        switch (charCodeCategory$1(code)) {
          // U+0029 RIGHT PARENTHESIS ())
          case 0x0029:
            // Return the <url-token>.
            offset++;
            return;
          // EOF

          case charCodeCategory$1.Eof:
            // This is a parse error. Return the <url-token>.
            return;
          // whitespace

          case charCodeCategory$1.WhiteSpace:
            // Consume as much whitespace as possible.
            offset = findWhiteSpaceEnd$1(source, offset); // If the next input code point is U+0029 RIGHT PARENTHESIS ()) or EOF,
            // consume it and return the <url-token>
            // (if EOF was encountered, this is a parse error);

            if (getCharCode(offset) === 0x0029 || offset >= source.length) {
              if (offset < source.length) {
                offset++;
              }

              return;
            } // otherwise, consume the remnants of a bad url, create a <bad-url-token>,
            // and return it.


            offset = consumeBadUrlRemnants$1(source, offset);
            type = TYPE$2.BadUrl;
            return;
          // U+0022 QUOTATION MARK (")
          // U+0027 APOSTROPHE (')
          // U+0028 LEFT PARENTHESIS (()
          // non-printable code point

          case 0x0022:
          case 0x0027:
          case 0x0028:
          case charCodeCategory$1.NonPrintable:
            // This is a parse error. Consume the remnants of a bad url,
            // create a <bad-url-token>, and return it.
            offset = consumeBadUrlRemnants$1(source, offset);
            type = TYPE$2.BadUrl;
            return;
          // U+005C REVERSE SOLIDUS (\)

          case 0x005C:
            // If the stream starts with a valid escape, consume an escaped code point and
            // append the returned code point to the <url-token>’s value.
            if (isValidEscape$2(code, getCharCode(offset + 1))) {
              offset = consumeEscaped$1(source, offset) - 1;
              break;
            } // Otherwise, this is a parse error. Consume the remnants of a bad url,
            // create a <bad-url-token>, and return it.


            offset = consumeBadUrlRemnants$1(source, offset);
            type = TYPE$2.BadUrl;
            return;
          // anything else
          // Append the current input code point to the <url-token>’s value.
        }
      }
    }

    if (!stream) {
      stream = new TokenStream_1();
    } // ensure source is a string


    source = String(source || '');
    var sourceLength = source.length;
    var offsetAndType = adoptBuffer(stream.offsetAndType, sourceLength + 1); // +1 because of eof-token

    var balance = adoptBuffer(stream.balance, sourceLength + 1);
    var tokenCount = 0;
    var start = isBOM$1(getCharCode(0));
    var offset = start;
    var balanceCloseType = 0;
    var balanceStart = 0;
    var balancePrev = 0; // https://drafts.csswg.org/css-syntax-3/#consume-token
    // § 4.3.1. Consume a token

    while (offset < sourceLength) {
      var code = source.charCodeAt(offset);
      var type = 0;
      balance[tokenCount] = sourceLength;

      switch (charCodeCategory$1(code)) {
        // whitespace
        case charCodeCategory$1.WhiteSpace:
          // Consume as much whitespace as possible. Return a <whitespace-token>.
          type = TYPE$2.WhiteSpace;
          offset = findWhiteSpaceEnd$1(source, offset + 1);
          break;
        // U+0022 QUOTATION MARK (")

        case 0x0022:
          // Consume a string token and return it.
          consumeStringToken();
          break;
        // U+0023 NUMBER SIGN (#)

        case 0x0023:
          // If the next input code point is a name code point or the next two input code points are a valid escape, then:
          if (isName$2(getCharCode(offset + 1)) || isValidEscape$2(getCharCode(offset + 1), getCharCode(offset + 2))) {
            // Create a <hash-token>.
            type = TYPE$2.Hash; // If the next 3 input code points would start an identifier, set the <hash-token>’s type flag to "id".
            // if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
            //     // TODO: set id flag
            // }
            // Consume a name, and set the <hash-token>’s value to the returned string.

            offset = consumeName$1(source, offset + 1); // Return the <hash-token>.
          } else {
            // Otherwise, return a <delim-token> with its value set to the current input code point.
            type = TYPE$2.Delim;
            offset++;
          }

          break;
        // U+0027 APOSTROPHE (')

        case 0x0027:
          // Consume a string token and return it.
          consumeStringToken();
          break;
        // U+0028 LEFT PARENTHESIS (()

        case 0x0028:
          // Return a <(-token>.
          type = TYPE$2.LeftParenthesis;
          offset++;
          break;
        // U+0029 RIGHT PARENTHESIS ())

        case 0x0029:
          // Return a <)-token>.
          type = TYPE$2.RightParenthesis;
          offset++;
          break;
        // U+002B PLUS SIGN (+)

        case 0x002B:
          // If the input stream starts with a number, ...
          if (isNumberStart$1(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
            // ... reconsume the current input code point, consume a numeric token, and return it.
            consumeNumericToken();
          } else {
            // Otherwise, return a <delim-token> with its value set to the current input code point.
            type = TYPE$2.Delim;
            offset++;
          }

          break;
        // U+002C COMMA (,)

        case 0x002C:
          // Return a <comma-token>.
          type = TYPE$2.Comma;
          offset++;
          break;
        // U+002D HYPHEN-MINUS (-)

        case 0x002D:
          // If the input stream starts with a number, reconsume the current input code point, consume a numeric token, and return it.
          if (isNumberStart$1(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
            consumeNumericToken();
          } else {
            // Otherwise, if the next 2 input code points are U+002D HYPHEN-MINUS U+003E GREATER-THAN SIGN (->), consume them and return a <CDC-token>.
            if (getCharCode(offset + 1) === 0x002D && getCharCode(offset + 2) === 0x003E) {
              type = TYPE$2.CDC;
              offset = offset + 3;
            } else {
              // Otherwise, if the input stream starts with an identifier, ...
              if (isIdentifierStart$1(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                // ... reconsume the current input code point, consume an ident-like token, and return it.
                consumeIdentLikeToken();
              } else {
                // Otherwise, return a <delim-token> with its value set to the current input code point.
                type = TYPE$2.Delim;
                offset++;
              }
            }
          }

          break;
        // U+002E FULL STOP (.)

        case 0x002E:
          // If the input stream starts with a number, ...
          if (isNumberStart$1(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
            // ... reconsume the current input code point, consume a numeric token, and return it.
            consumeNumericToken();
          } else {
            // Otherwise, return a <delim-token> with its value set to the current input code point.
            type = TYPE$2.Delim;
            offset++;
          }

          break;
        // U+002F SOLIDUS (/)

        case 0x002F:
          // If the next two input code point are U+002F SOLIDUS (/) followed by a U+002A ASTERISK (*),
          if (getCharCode(offset + 1) === 0x002A) {
            // ... consume them and all following code points up to and including the first U+002A ASTERISK (*)
            // followed by a U+002F SOLIDUS (/), or up to an EOF code point.
            type = TYPE$2.Comment;
            offset = source.indexOf('*/', offset + 2) + 2;

            if (offset === 1) {
              offset = source.length;
            }
          } else {
            type = TYPE$2.Delim;
            offset++;
          }

          break;
        // U+003A COLON (:)

        case 0x003A:
          // Return a <colon-token>.
          type = TYPE$2.Colon;
          offset++;
          break;
        // U+003B SEMICOLON (;)

        case 0x003B:
          // Return a <semicolon-token>.
          type = TYPE$2.Semicolon;
          offset++;
          break;
        // U+003C LESS-THAN SIGN (<)

        case 0x003C:
          // If the next 3 input code points are U+0021 EXCLAMATION MARK U+002D HYPHEN-MINUS U+002D HYPHEN-MINUS (!--), ...
          if (getCharCode(offset + 1) === 0x0021 && getCharCode(offset + 2) === 0x002D && getCharCode(offset + 3) === 0x002D) {
            // ... consume them and return a <CDO-token>.
            type = TYPE$2.CDO;
            offset = offset + 4;
          } else {
            // Otherwise, return a <delim-token> with its value set to the current input code point.
            type = TYPE$2.Delim;
            offset++;
          }

          break;
        // U+0040 COMMERCIAL AT (@)

        case 0x0040:
          // If the next 3 input code points would start an identifier, ...
          if (isIdentifierStart$1(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
            // ... consume a name, create an <at-keyword-token> with its value set to the returned value, and return it.
            type = TYPE$2.AtKeyword;
            offset = consumeName$1(source, offset + 1);
          } else {
            // Otherwise, return a <delim-token> with its value set to the current input code point.
            type = TYPE$2.Delim;
            offset++;
          }

          break;
        // U+005B LEFT SQUARE BRACKET ([)

        case 0x005B:
          // Return a <[-token>.
          type = TYPE$2.LeftSquareBracket;
          offset++;
          break;
        // U+005C REVERSE SOLIDUS (\)

        case 0x005C:
          // If the input stream starts with a valid escape, ...
          if (isValidEscape$2(code, getCharCode(offset + 1))) {
            // ... reconsume the current input code point, consume an ident-like token, and return it.
            consumeIdentLikeToken();
          } else {
            // Otherwise, this is a parse error. Return a <delim-token> with its value set to the current input code point.
            type = TYPE$2.Delim;
            offset++;
          }

          break;
        // U+005D RIGHT SQUARE BRACKET (])

        case 0x005D:
          // Return a <]-token>.
          type = TYPE$2.RightSquareBracket;
          offset++;
          break;
        // U+007B LEFT CURLY BRACKET ({)

        case 0x007B:
          // Return a <{-token>.
          type = TYPE$2.LeftCurlyBracket;
          offset++;
          break;
        // U+007D RIGHT CURLY BRACKET (})

        case 0x007D:
          // Return a <}-token>.
          type = TYPE$2.RightCurlyBracket;
          offset++;
          break;
        // digit

        case charCodeCategory$1.Digit:
          // Reconsume the current input code point, consume a numeric token, and return it.
          consumeNumericToken();
          break;
        // name-start code point

        case charCodeCategory$1.NameStart:
          // Reconsume the current input code point, consume an ident-like token, and return it.
          consumeIdentLikeToken();
          break;
        // EOF

        case charCodeCategory$1.Eof:
          // Return an <EOF-token>.
          break;
        // anything else

        default:
          // Return a <delim-token> with its value set to the current input code point.
          type = TYPE$2.Delim;
          offset++;
      }

      switch (type) {
        case balanceCloseType:
          balancePrev = balanceStart & OFFSET_MASK$1;
          balanceStart = balance[balancePrev];
          balanceCloseType = balanceStart >> TYPE_SHIFT$1;
          balance[tokenCount] = balancePrev;
          balance[balancePrev++] = tokenCount;

          for (; balancePrev < tokenCount; balancePrev++) {
            if (balance[balancePrev] === sourceLength) {
              balance[balancePrev] = tokenCount;
            }
          }

          break;

        case TYPE$2.LeftParenthesis:
        case TYPE$2.Function:
          balance[tokenCount] = balanceStart;
          balanceCloseType = TYPE$2.RightParenthesis;
          balanceStart = balanceCloseType << TYPE_SHIFT$1 | tokenCount;
          break;

        case TYPE$2.LeftSquareBracket:
          balance[tokenCount] = balanceStart;
          balanceCloseType = TYPE$2.RightSquareBracket;
          balanceStart = balanceCloseType << TYPE_SHIFT$1 | tokenCount;
          break;

        case TYPE$2.LeftCurlyBracket:
          balance[tokenCount] = balanceStart;
          balanceCloseType = TYPE$2.RightCurlyBracket;
          balanceStart = balanceCloseType << TYPE_SHIFT$1 | tokenCount;
          break;
      }

      offsetAndType[tokenCount++] = type << TYPE_SHIFT$1 | offset;
    } // finalize buffers


    offsetAndType[tokenCount] = TYPE$2.EOF << TYPE_SHIFT$1 | offset; // <EOF-token>

    balance[tokenCount] = sourceLength;
    balance[sourceLength] = sourceLength; // prevents false positive balance match with any token

    while (balanceStart !== 0) {
      balancePrev = balanceStart & OFFSET_MASK$1;
      balanceStart = balance[balancePrev];
      balance[balancePrev] = sourceLength;
    } // update stream


    stream.source = source;
    stream.firstCharOffset = start;
    stream.offsetAndType = offsetAndType;
    stream.tokenCount = tokenCount;
    stream.balance = balance;
    stream.reset();
    stream.next();
    return stream;
  } // extend tokenizer with constants


  Object.keys(_const).forEach(function (key) {
    tokenize[key] = _const[key];
  }); // extend tokenizer with static methods from utils

  Object.keys(charCodeDefinitions).forEach(function (key) {
    tokenize[key] = charCodeDefinitions[key];
  });
  Object.keys(utils).forEach(function (key) {
    tokenize[key] = utils[key];
  });
  var tokenizer = tokenize;

  var isDigit$2 = tokenizer.isDigit;
  var cmpChar$1 = tokenizer.cmpChar;
  var TYPE$3 = tokenizer.TYPE;
  var DELIM = TYPE$3.Delim;
  var WHITESPACE$1 = TYPE$3.WhiteSpace;
  var COMMENT$1 = TYPE$3.Comment;
  var IDENT = TYPE$3.Ident;
  var NUMBER$1 = TYPE$3.Number;
  var DIMENSION = TYPE$3.Dimension;
  var PLUSSIGN = 0x002B; // U+002B PLUS SIGN (+)

  var HYPHENMINUS$1 = 0x002D; // U+002D HYPHEN-MINUS (-)

  var N = 0x006E; // U+006E LATIN SMALL LETTER N (n)

  var DISALLOW_SIGN = true;
  var ALLOW_SIGN = false;

  function isDelim(token, code) {
    return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
  }

  function skipSC(token, offset, getNextToken) {
    while (token !== null && (token.type === WHITESPACE$1 || token.type === COMMENT$1)) {
      token = getNextToken(++offset);
    }

    return offset;
  }

  function checkInteger(token, valueOffset, disallowSign, offset) {
    if (!token) {
      return 0;
    }

    var code = token.value.charCodeAt(valueOffset);

    if (code === PLUSSIGN || code === HYPHENMINUS$1) {
      if (disallowSign) {
        // Number sign is not allowed
        return 0;
      }

      valueOffset++;
    }

    for (; valueOffset < token.value.length; valueOffset++) {
      if (!isDigit$2(token.value.charCodeAt(valueOffset))) {
        // Integer is expected
        return 0;
      }
    }

    return offset + 1;
  } // ... <signed-integer>
  // ... ['+' | '-'] <signless-integer>


  function consumeB(token, offset_, getNextToken) {
    var sign = false;
    var offset = skipSC(token, offset_, getNextToken);
    token = getNextToken(offset);

    if (token === null) {
      return offset_;
    }

    if (token.type !== NUMBER$1) {
      if (isDelim(token, PLUSSIGN) || isDelim(token, HYPHENMINUS$1)) {
        sign = true;
        offset = skipSC(getNextToken(++offset), offset, getNextToken);
        token = getNextToken(offset);

        if (token === null && token.type !== NUMBER$1) {
          return 0;
        }
      } else {
        return offset_;
      }
    }

    if (!sign) {
      var code = token.value.charCodeAt(0);

      if (code !== PLUSSIGN && code !== HYPHENMINUS$1) {
        // Number sign is expected
        return 0;
      }
    }

    return checkInteger(token, sign ? 0 : 1, sign, offset);
  } // An+B microsyntax https://www.w3.org/TR/css-syntax-3/#anb


  var genericAnPlusB = function anPlusB(token, getNextToken) {
    /* eslint-disable brace-style*/
    var offset = 0;

    if (!token) {
      return 0;
    } // <integer>


    if (token.type === NUMBER$1) {
      return checkInteger(token, 0, ALLOW_SIGN, offset); // b
    } // -n
    // -n <signed-integer>
    // -n ['+' | '-'] <signless-integer>
    // -n- <signless-integer>
    // <dashndashdigit-ident>
    else if (token.type === IDENT && token.value.charCodeAt(0) === HYPHENMINUS$1) {
        // expect 1st char is N
        if (!cmpChar$1(token.value, 1, N)) {
          return 0;
        }

        switch (token.value.length) {
          // -n
          // -n <signed-integer>
          // -n ['+' | '-'] <signless-integer>
          case 2:
            return consumeB(getNextToken(++offset), offset, getNextToken);
          // -n- <signless-integer>

          case 3:
            if (token.value.charCodeAt(2) !== HYPHENMINUS$1) {
              return 0;
            }

            offset = skipSC(getNextToken(++offset), offset, getNextToken);
            token = getNextToken(offset);
            return checkInteger(token, 0, DISALLOW_SIGN, offset);
          // <dashndashdigit-ident>

          default:
            if (token.value.charCodeAt(2) !== HYPHENMINUS$1) {
              return 0;
            }

            return checkInteger(token, 3, DISALLOW_SIGN, offset);
        }
      } // '+'? n
      // '+'? n <signed-integer>
      // '+'? n ['+' | '-'] <signless-integer>
      // '+'? n- <signless-integer>
      // '+'? <ndashdigit-ident>
      else if (token.type === IDENT || isDelim(token, PLUSSIGN) && getNextToken(offset + 1).type === IDENT) {
          // just ignore a plus
          if (token.type !== IDENT) {
            token = getNextToken(++offset);
          }

          if (token === null || !cmpChar$1(token.value, 0, N)) {
            return 0;
          }

          switch (token.value.length) {
            // '+'? n
            // '+'? n <signed-integer>
            // '+'? n ['+' | '-'] <signless-integer>
            case 1:
              return consumeB(getNextToken(++offset), offset, getNextToken);
            // '+'? n- <signless-integer>

            case 2:
              if (token.value.charCodeAt(1) !== HYPHENMINUS$1) {
                return 0;
              }

              offset = skipSC(getNextToken(++offset), offset, getNextToken);
              token = getNextToken(offset);
              return checkInteger(token, 0, DISALLOW_SIGN, offset);
            // '+'? <ndashdigit-ident>

            default:
              if (token.value.charCodeAt(1) !== HYPHENMINUS$1) {
                return 0;
              }

              return checkInteger(token, 2, DISALLOW_SIGN, offset);
          }
        } // <ndashdigit-dimension>
        // <ndash-dimension> <signless-integer>
        // <n-dimension>
        // <n-dimension> <signed-integer>
        // <n-dimension> ['+' | '-'] <signless-integer>
        else if (token.type === DIMENSION) {
            var code = token.value.charCodeAt(0);
            var sign = code === PLUSSIGN || code === HYPHENMINUS$1 ? 1 : 0;

            for (var i = sign; i < token.value.length; i++) {
              if (!isDigit$2(token.value.charCodeAt(i))) {
                break;
              }
            }

            if (i === sign) {
              // Integer is expected
              return 0;
            }

            if (!cmpChar$1(token.value, i, N)) {
              return 0;
            } // <n-dimension>
            // <n-dimension> <signed-integer>
            // <n-dimension> ['+' | '-'] <signless-integer>


            if (i + 1 === token.value.length) {
              return consumeB(getNextToken(++offset), offset, getNextToken);
            } else {
              if (token.value.charCodeAt(i + 1) !== HYPHENMINUS$1) {
                return 0;
              } // <ndash-dimension> <signless-integer>


              if (i + 2 === token.value.length) {
                offset = skipSC(getNextToken(++offset), offset, getNextToken);
                token = getNextToken(offset);
                return checkInteger(token, 0, DISALLOW_SIGN, offset);
              } // <ndashdigit-dimension>
              else {
                  return checkInteger(token, i + 2, DISALLOW_SIGN, offset);
                }
            }
          }

    return 0;
  };

  var isHexDigit$2 = tokenizer.isHexDigit;
  var cmpChar$2 = tokenizer.cmpChar;
  var TYPE$4 = tokenizer.TYPE;
  var IDENT$1 = TYPE$4.Ident;
  var DELIM$1 = TYPE$4.Delim;
  var NUMBER$2 = TYPE$4.Number;
  var DIMENSION$1 = TYPE$4.Dimension;
  var PLUSSIGN$1 = 0x002B; // U+002B PLUS SIGN (+)

  var HYPHENMINUS$2 = 0x002D; // U+002D HYPHEN-MINUS (-)

  var QUESTIONMARK = 0x003F; // U+003F QUESTION MARK (?)

  var U = 0x0075; // U+0075 LATIN SMALL LETTER U (u)

  function isDelim$1(token, code) {
    return token !== null && token.type === DELIM$1 && token.value.charCodeAt(0) === code;
  }

  function startsWith(token, code) {
    return token.value.charCodeAt(0) === code;
  }

  function hexSequence(token, offset, allowDash) {
    for (var pos = offset, hexlen = 0; pos < token.value.length; pos++) {
      var code = token.value.charCodeAt(pos);

      if (code === HYPHENMINUS$2 && allowDash && hexlen !== 0) {
        if (hexSequence(token, offset + hexlen + 1, false) > 0) {
          return 6; // dissallow following question marks
        }

        return 0; // dash at the ending of a hex sequence is not allowed
      }

      if (!isHexDigit$2(code)) {
        return 0; // not a hex digit
      }

      if (++hexlen > 6) {
        return 0; // too many hex digits
      }
    }

    return hexlen;
  }

  function withQuestionMarkSequence(consumed, length, getNextToken) {
    if (!consumed) {
      return 0; // nothing consumed
    }

    while (isDelim$1(getNextToken(length), QUESTIONMARK)) {
      if (++consumed > 6) {
        return 0; // too many question marks
      }

      length++;
    }

    return length;
  } // https://drafts.csswg.org/css-syntax/#urange
  // Informally, the <urange> production has three forms:
  // U+0001
  //      Defines a range consisting of a single code point, in this case the code point "1".
  // U+0001-00ff
  //      Defines a range of codepoints between the first and the second value, in this case
  //      the range between "1" and "ff" (255 in decimal) inclusive.
  // U+00??
  //      Defines a range of codepoints where the "?" characters range over all hex digits,
  //      in this case defining the same as the value U+0000-00ff.
  // In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
  //
  // <urange> =
  //   u '+' <ident-token> '?'* |
  //   u <dimension-token> '?'* |
  //   u <number-token> '?'* |
  //   u <number-token> <dimension-token> |
  //   u <number-token> <number-token> |
  //   u '+' '?'+


  var genericUrange = function urange(token, getNextToken) {
    var length = 0; // should start with `u` or `U`

    if (token === null || token.type !== IDENT$1 || !cmpChar$2(token.value, 0, U)) {
      return 0;
    }

    token = getNextToken(++length);

    if (token === null) {
      return 0;
    } // u '+' <ident-token> '?'*
    // u '+' '?'+


    if (isDelim$1(token, PLUSSIGN$1)) {
      token = getNextToken(++length);

      if (token === null) {
        return 0;
      }

      if (token.type === IDENT$1) {
        // u '+' <ident-token> '?'*
        return withQuestionMarkSequence(hexSequence(token, 0, true), ++length, getNextToken);
      }

      if (isDelim$1(token, QUESTIONMARK)) {
        // u '+' '?'+
        return withQuestionMarkSequence(1, ++length, getNextToken);
      } // Hex digit or question mark is expected


      return 0;
    } // u <number-token> '?'*
    // u <number-token> <dimension-token>
    // u <number-token> <number-token>


    if (token.type === NUMBER$2) {
      if (!startsWith(token, PLUSSIGN$1)) {
        return 0;
      }

      var consumedHexLength = hexSequence(token, 1, true);

      if (consumedHexLength === 0) {
        return 0;
      }

      token = getNextToken(++length);

      if (token === null) {
        // u <number-token> <eof>
        return length;
      }

      if (token.type === DIMENSION$1 || token.type === NUMBER$2) {
        // u <number-token> <dimension-token>
        // u <number-token> <number-token>
        if (!startsWith(token, HYPHENMINUS$2) || !hexSequence(token, 1, false)) {
          return 0;
        }

        return length + 1;
      } // u <number-token> '?'*


      return withQuestionMarkSequence(consumedHexLength, length, getNextToken);
    } // u <dimension-token> '?'*


    if (token.type === DIMENSION$1) {
      if (!startsWith(token, PLUSSIGN$1)) {
        return 0;
      }

      return withQuestionMarkSequence(hexSequence(token, 1, true), ++length, getNextToken);
    }

    return 0;
  };

  var isIdentifierStart$2 = tokenizer.isIdentifierStart;
  var isHexDigit$3 = tokenizer.isHexDigit;
  var isDigit$3 = tokenizer.isDigit;
  var cmpStr$3 = tokenizer.cmpStr;
  var consumeNumber$2 = tokenizer.consumeNumber;
  var TYPE$5 = tokenizer.TYPE;
  var cssWideKeywords = ['unset', 'initial', 'inherit'];
  var calcFunctionNames = ['calc(', '-moz-calc(', '-webkit-calc(']; // https://www.w3.org/TR/css-values-3/#lengths

  var LENGTH = {
    // absolute length units
    'px': true,
    'mm': true,
    'cm': true,
    'in': true,
    'pt': true,
    'pc': true,
    'q': true,
    // relative length units
    'em': true,
    'ex': true,
    'ch': true,
    'rem': true,
    // viewport-percentage lengths
    'vh': true,
    'vw': true,
    'vmin': true,
    'vmax': true,
    'vm': true
  };
  var ANGLE = {
    'deg': true,
    'grad': true,
    'rad': true,
    'turn': true
  };
  var TIME = {
    's': true,
    'ms': true
  };
  var FREQUENCY = {
    'hz': true,
    'khz': true
  }; // https://www.w3.org/TR/css-values-3/#resolution (https://drafts.csswg.org/css-values/#resolution)

  var RESOLUTION = {
    'dpi': true,
    'dpcm': true,
    'dppx': true,
    'x': true // https://github.com/w3c/csswg-drafts/issues/461

  }; // https://drafts.csswg.org/css-grid/#fr-unit

  var FLEX = {
    'fr': true
  }; // https://www.w3.org/TR/css3-speech/#mixing-props-voice-volume

  var DECIBEL = {
    'db': true
  }; // https://www.w3.org/TR/css3-speech/#voice-props-voice-pitch

  var SEMITONES = {
    'st': true
  }; // safe char code getter

  function charCode(str, index) {
    return index < str.length ? str.charCodeAt(index) : 0;
  }

  function eqStr(actual, expected) {
    return cmpStr$3(actual, 0, actual.length, expected);
  }

  function eqStrAny(actual, expected) {
    for (var i = 0; i < expected.length; i++) {
      if (eqStr(actual, expected[i])) {
        return true;
      }
    }

    return false;
  } // IE postfix hack, i.e. 123\0 or 123px\9


  function isPostfixIeHack(str, offset) {
    if (offset !== str.length - 2) {
      return false;
    }

    return str.charCodeAt(offset) === 0x005C && // U+005C REVERSE SOLIDUS (\)
    isDigit$3(str.charCodeAt(offset + 1));
  }

  function outOfRange(opts, value, numEnd) {
    if (opts && opts.type === 'Range') {
      var num = Number(numEnd !== undefined && numEnd !== value.length ? value.substr(0, numEnd) : value);

      if (isNaN(num)) {
        return true;
      }

      if (opts.min !== null && num < opts.min) {
        return true;
      }

      if (opts.max !== null && num > opts.max) {
        return true;
      }
    }

    return false;
  }

  function consumeFunction(token, getNextToken) {
    var startIdx = token.index;
    var length = 0; // balanced token consuming

    do {
      length++;

      if (token.balance <= startIdx) {
        break;
      }
    } while (token = getNextToken(length));

    return length;
  } // TODO: implement
  // can be used wherever <length>, <frequency>, <angle>, <time>, <percentage>, <number>, or <integer> values are allowed
  // https://drafts.csswg.org/css-values/#calc-notation


  function calc(next) {
    return function (token, getNextToken, opts) {
      if (token === null) {
        return 0;
      }

      if (token.type === TYPE$5.Function && eqStrAny(token.value, calcFunctionNames)) {
        return consumeFunction(token, getNextToken);
      }

      return next(token, getNextToken, opts);
    };
  }

  function tokenType(expectedTokenType) {
    return function (token) {
      if (token === null || token.type !== expectedTokenType) {
        return 0;
      }

      return 1;
    };
  }

  function func(name) {
    name = name + '(';
    return function (token, getNextToken) {
      if (token !== null && eqStr(token.value, name)) {
        return consumeFunction(token, getNextToken);
      }

      return 0;
    };
  } // =========================
  // Complex types
  //
  // https://drafts.csswg.org/css-values-4/#custom-idents
  // 4.2. Author-defined Identifiers: the <custom-ident> type
  // Some properties accept arbitrary author-defined identifiers as a component value.
  // This generic data type is denoted by <custom-ident>, and represents any valid CSS identifier
  // that would not be misinterpreted as a pre-defined keyword in that property’s value definition.
  //
  // See also: https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident


  function customIdent(token) {
    if (token === null || token.type !== TYPE$5.Ident) {
      return 0;
    }

    var name = token.value.toLowerCase(); // The CSS-wide keywords are not valid <custom-ident>s

    if (eqStrAny(name, cssWideKeywords)) {
      return 0;
    } // The default keyword is reserved and is also not a valid <custom-ident>


    if (eqStr(name, 'default')) {
      return 0;
    } // TODO: ignore property specific keywords (as described https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident)
    // Specifications using <custom-ident> must specify clearly what other keywords
    // are excluded from <custom-ident>, if any—for example by saying that any pre-defined keywords
    // in that property’s value definition are excluded. Excluded keywords are excluded
    // in all ASCII case permutations.


    return 1;
  } // https://drafts.csswg.org/css-variables/#typedef-custom-property-name
  // A custom property is any property whose name starts with two dashes (U+002D HYPHEN-MINUS), like --foo.
  // The <custom-property-name> production corresponds to this: it’s defined as any valid identifier
  // that starts with two dashes, except -- itself, which is reserved for future use by CSS.
  // NOTE: Current implementation treat `--` as a valid name since most (all?) major browsers treat it as valid.


  function customPropertyName(token) {
    // ... defined as any valid identifier
    if (token === null || token.type !== TYPE$5.Ident) {
      return 0;
    } // ... that starts with two dashes (U+002D HYPHEN-MINUS)


    if (charCode(token.value, 0) !== 0x002D || charCode(token.value, 1) !== 0x002D) {
      return 0;
    }

    return 1;
  } // https://drafts.csswg.org/css-color-4/#hex-notation
  // The syntax of a <hex-color> is a <hash-token> token whose value consists of 3, 4, 6, or 8 hexadecimal digits.
  // In other words, a hex color is written as a hash character, "#", followed by some number of digits 0-9 or
  // letters a-f (the case of the letters doesn’t matter - #00ff00 is identical to #00FF00).


  function hexColor(token) {
    if (token === null || token.type !== TYPE$5.Hash) {
      return 0;
    }

    var length = token.value.length; // valid values (length): #rgb (4), #rgba (5), #rrggbb (7), #rrggbbaa (9)

    if (length !== 4 && length !== 5 && length !== 7 && length !== 9) {
      return 0;
    }

    for (var i = 1; i < length; i++) {
      if (!isHexDigit$3(token.value.charCodeAt(i))) {
        return 0;
      }
    }

    return 1;
  }

  function idSelector(token) {
    if (token === null || token.type !== TYPE$5.Hash) {
      return 0;
    }

    if (!isIdentifierStart$2(charCode(token.value, 1), charCode(token.value, 2), charCode(token.value, 3))) {
      return 0;
    }

    return 1;
  } // https://drafts.csswg.org/css-syntax/#any-value
  // It represents the entirety of what a valid declaration can have as its value.


  function declarationValue(token, getNextToken) {
    if (!token) {
      return 0;
    }

    var length = 0;
    var level = 0;
    var startIdx = token.index; // The <declaration-value> production matches any sequence of one or more tokens,
    // so long as the sequence ...

    scan: do {
      switch (token.type) {
        // ... does not contain <bad-string-token>, <bad-url-token>,
        case TYPE$5.BadString:
        case TYPE$5.BadUrl:
          break scan;
        // ... unmatched <)-token>, <]-token>, or <}-token>,

        case TYPE$5.RightCurlyBracket:
        case TYPE$5.RightParenthesis:
        case TYPE$5.RightSquareBracket:
          if (token.balance > token.index || token.balance < startIdx) {
            break scan;
          }

          level--;
          break;
        // ... or top-level <semicolon-token> tokens

        case TYPE$5.Semicolon:
          if (level === 0) {
            break scan;
          }

          break;
        // ... or <delim-token> tokens with a value of "!"

        case TYPE$5.Delim:
          if (token.value === '!' && level === 0) {
            break scan;
          }

          break;

        case TYPE$5.Function:
        case TYPE$5.LeftParenthesis:
        case TYPE$5.LeftSquareBracket:
        case TYPE$5.LeftCurlyBracket:
          level++;
          break;
      }

      length++; // until balance closing

      if (token.balance <= startIdx) {
        break;
      }
    } while (token = getNextToken(length));

    return length;
  } // https://drafts.csswg.org/css-syntax/#any-value
  // The <any-value> production is identical to <declaration-value>, but also
  // allows top-level <semicolon-token> tokens and <delim-token> tokens
  // with a value of "!". It represents the entirety of what valid CSS can be in any context.


  function anyValue(token, getNextToken) {
    if (!token) {
      return 0;
    }

    var startIdx = token.index;
    var length = 0; // The <any-value> production matches any sequence of one or more tokens,
    // so long as the sequence ...

    scan: do {
      switch (token.type) {
        // ... does not contain <bad-string-token>, <bad-url-token>,
        case TYPE$5.BadString:
        case TYPE$5.BadUrl:
          break scan;
        // ... unmatched <)-token>, <]-token>, or <}-token>,

        case TYPE$5.RightCurlyBracket:
        case TYPE$5.RightParenthesis:
        case TYPE$5.RightSquareBracket:
          if (token.balance > token.index || token.balance < startIdx) {
            break scan;
          }

          break;
      }

      length++; // until balance closing

      if (token.balance <= startIdx) {
        break;
      }
    } while (token = getNextToken(length));

    return length;
  } // =========================
  // Dimensions
  //


  function dimension(type) {
    return function (token, getNextToken, opts) {
      if (token === null || token.type !== TYPE$5.Dimension) {
        return 0;
      }

      var numberEnd = consumeNumber$2(token.value, 0); // check unit

      if (type !== null) {
        // check for IE postfix hack, i.e. 123px\0 or 123px\9
        var reverseSolidusOffset = token.value.indexOf('\\', numberEnd);
        var unit = reverseSolidusOffset === -1 || !isPostfixIeHack(token.value, reverseSolidusOffset) ? token.value.substr(numberEnd) : token.value.substring(numberEnd, reverseSolidusOffset);

        if (type.hasOwnProperty(unit.toLowerCase()) === false) {
          return 0;
        }
      } // check range if specified


      if (outOfRange(opts, token.value, numberEnd)) {
        return 0;
      }

      return 1;
    };
  } // =========================
  // Percentage
  //
  // §5.5. Percentages: the <percentage> type
  // https://drafts.csswg.org/css-values-4/#percentages


  function percentage(token, getNextToken, opts) {
    // ... corresponds to the <percentage-token> production
    if (token === null || token.type !== TYPE$5.Percentage) {
      return 0;
    } // check range if specified


    if (outOfRange(opts, token.value, token.value.length - 1)) {
      return 0;
    }

    return 1;
  } // =========================
  // Numeric
  //
  // https://drafts.csswg.org/css-values-4/#numbers
  // The value <zero> represents a literal number with the value 0. Expressions that merely
  // evaluate to a <number> with the value 0 (for example, calc(0)) do not match <zero>;
  // only literal <number-token>s do.


  function zero(next) {
    if (typeof next !== 'function') {
      next = function next() {
        return 0;
      };
    }

    return function (token, getNextToken, opts) {
      if (token !== null && token.type === TYPE$5.Number) {
        if (Number(token.value) === 0) {
          return 1;
        }
      }

      return next(token, getNextToken, opts);
    };
  } // § 5.3. Real Numbers: the <number> type
  // https://drafts.csswg.org/css-values-4/#numbers
  // Number values are denoted by <number>, and represent real numbers, possibly with a fractional component.
  // ... It corresponds to the <number-token> production


  function number(token, getNextToken, opts) {
    if (token === null) {
      return 0;
    }

    var numberEnd = consumeNumber$2(token.value, 0);
    var isNumber = numberEnd === token.value.length;

    if (!isNumber && !isPostfixIeHack(token.value, numberEnd)) {
      return 0;
    } // check range if specified


    if (outOfRange(opts, token.value, numberEnd)) {
      return 0;
    }

    return 1;
  } // §5.2. Integers: the <integer> type
  // https://drafts.csswg.org/css-values-4/#integers


  function integer(token, getNextToken, opts) {
    // ... corresponds to a subset of the <number-token> production
    if (token === null || token.type !== TYPE$5.Number) {
      return 0;
    } // The first digit of an integer may be immediately preceded by `-` or `+` to indicate the integer’s sign.


    var i = token.value.charCodeAt(0) === 0x002B || // U+002B PLUS SIGN (+)
    token.value.charCodeAt(0) === 0x002D ? 1 : 0; // U+002D HYPHEN-MINUS (-)
    // When written literally, an integer is one or more decimal digits 0 through 9 ...

    for (; i < token.value.length; i++) {
      if (!isDigit$3(token.value.charCodeAt(i))) {
        return 0;
      }
    } // check range if specified


    if (outOfRange(opts, token.value, i)) {
      return 0;
    }

    return 1;
  }

  var generic = {
    // token types
    'ident-token': tokenType(TYPE$5.Ident),
    'function-token': tokenType(TYPE$5.Function),
    'at-keyword-token': tokenType(TYPE$5.AtKeyword),
    'hash-token': tokenType(TYPE$5.Hash),
    'string-token': tokenType(TYPE$5.String),
    'bad-string-token': tokenType(TYPE$5.BadString),
    'url-token': tokenType(TYPE$5.Url),
    'bad-url-token': tokenType(TYPE$5.BadUrl),
    'delim-token': tokenType(TYPE$5.Delim),
    'number-token': tokenType(TYPE$5.Number),
    'percentage-token': tokenType(TYPE$5.Percentage),
    'dimension-token': tokenType(TYPE$5.Dimension),
    'whitespace-token': tokenType(TYPE$5.WhiteSpace),
    'CDO-token': tokenType(TYPE$5.CDO),
    'CDC-token': tokenType(TYPE$5.CDC),
    'colon-token': tokenType(TYPE$5.Colon),
    'semicolon-token': tokenType(TYPE$5.Semicolon),
    'comma-token': tokenType(TYPE$5.Comma),
    '[-token': tokenType(TYPE$5.LeftSquareBracket),
    ']-token': tokenType(TYPE$5.RightSquareBracket),
    '(-token': tokenType(TYPE$5.LeftParenthesis),
    ')-token': tokenType(TYPE$5.RightParenthesis),
    '{-token': tokenType(TYPE$5.LeftCurlyBracket),
    '}-token': tokenType(TYPE$5.RightCurlyBracket),
    // token type aliases
    'string': tokenType(TYPE$5.String),
    'ident': tokenType(TYPE$5.Ident),
    // complex types
    'custom-ident': customIdent,
    'custom-property-name': customPropertyName,
    'hex-color': hexColor,
    'id-selector': idSelector,
    // element( <id-selector> )
    'an-plus-b': genericAnPlusB,
    'urange': genericUrange,
    'declaration-value': declarationValue,
    'any-value': anyValue,
    // dimensions
    'dimension': calc(dimension(null)),
    'angle': calc(dimension(ANGLE)),
    'decibel': calc(dimension(DECIBEL)),
    'frequency': calc(dimension(FREQUENCY)),
    'flex': calc(dimension(FLEX)),
    'length': calc(zero(dimension(LENGTH))),
    'resolution': calc(dimension(RESOLUTION)),
    'semitones': calc(dimension(SEMITONES)),
    'time': calc(dimension(TIME)),
    // percentage
    'percentage': calc(percentage),
    // numeric
    'zero': zero(),
    'number': calc(number),
    'integer': calc(integer),
    // old IE stuff
    '-ms-legacy-expression': func('expression')
  };

  var _SyntaxError$1 = function SyntaxError(message, input, offset) {
    var error = createCustomError('SyntaxError', message);
    error.input = input;
    error.offset = offset;
    error.rawMessage = message;
    error.message = error.rawMessage + '\n' + '  ' + error.input + '\n' + '--' + new Array((error.offset || error.input.length) + 1).join('-') + '^';
    return error;
  };

  var TAB = 9;
  var N$1 = 10;
  var F = 12;
  var R = 13;
  var SPACE = 32;

  var Tokenizer = function Tokenizer(str) {
    this.str = str;
    this.pos = 0;
  };

  Tokenizer.prototype = {
    charCodeAt: function charCodeAt(pos) {
      return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
    },
    charCode: function charCode() {
      return this.charCodeAt(this.pos);
    },
    nextCharCode: function nextCharCode() {
      return this.charCodeAt(this.pos + 1);
    },
    nextNonWsCode: function nextNonWsCode(pos) {
      return this.charCodeAt(this.findWsEnd(pos));
    },
    findWsEnd: function findWsEnd(pos) {
      for (; pos < this.str.length; pos++) {
        var code = this.str.charCodeAt(pos);

        if (code !== R && code !== N$1 && code !== F && code !== SPACE && code !== TAB) {
          break;
        }
      }

      return pos;
    },
    substringToPos: function substringToPos(end) {
      return this.str.substring(this.pos, this.pos = end);
    },
    eat: function eat(code) {
      if (this.charCode() !== code) {
        this.error('Expect `' + String.fromCharCode(code) + '`');
      }

      this.pos++;
    },
    peek: function peek() {
      return this.pos < this.str.length ? this.str.charAt(this.pos++) : '';
    },
    error: function error(message) {
      throw new _SyntaxError$1(message, this.str, this.pos);
    }
  };
  var tokenizer$1 = Tokenizer;

  var TAB$1 = 9;
  var N$2 = 10;
  var F$1 = 12;
  var R$1 = 13;
  var SPACE$1 = 32;
  var EXCLAMATIONMARK = 33; // !

  var NUMBERSIGN = 35; // #

  var AMPERSAND = 38; // &

  var APOSTROPHE = 39; // '

  var LEFTPARENTHESIS = 40; // (

  var RIGHTPARENTHESIS = 41; // )

  var ASTERISK = 42; // *

  var PLUSSIGN$2 = 43; // +

  var COMMA = 44; // ,

  var HYPERMINUS = 45; // -

  var LESSTHANSIGN = 60; // <

  var GREATERTHANSIGN = 62; // >

  var QUESTIONMARK$1 = 63; // ?

  var COMMERCIALAT = 64; // @

  var LEFTSQUAREBRACKET = 91; // [

  var RIGHTSQUAREBRACKET = 93; // ]

  var LEFTCURLYBRACKET = 123; // {

  var VERTICALLINE = 124; // |

  var RIGHTCURLYBRACKET = 125; // }

  var INFINITY = 8734; // ∞

  var NAME_CHAR = createCharMap(function (ch) {
    return /[a-zA-Z0-9\-]/.test(ch);
  });
  var COMBINATOR_PRECEDENCE = {
    ' ': 1,
    '&&': 2,
    '||': 3,
    '|': 4
  };

  function createCharMap(fn) {
    var array = typeof Uint32Array === 'function' ? new Uint32Array(128) : new Array(128);

    for (var i = 0; i < 128; i++) {
      array[i] = fn(String.fromCharCode(i)) ? 1 : 0;
    }

    return array;
  }

  function scanSpaces(tokenizer) {
    return tokenizer.substringToPos(tokenizer.findWsEnd(tokenizer.pos));
  }

  function scanWord(tokenizer) {
    var end = tokenizer.pos;

    for (; end < tokenizer.str.length; end++) {
      var code = tokenizer.str.charCodeAt(end);

      if (code >= 128 || NAME_CHAR[code] === 0) {
        break;
      }
    }

    if (tokenizer.pos === end) {
      tokenizer.error('Expect a keyword');
    }

    return tokenizer.substringToPos(end);
  }

  function scanNumber(tokenizer) {
    var end = tokenizer.pos;

    for (; end < tokenizer.str.length; end++) {
      var code = tokenizer.str.charCodeAt(end);

      if (code < 48 || code > 57) {
        break;
      }
    }

    if (tokenizer.pos === end) {
      tokenizer.error('Expect a number');
    }

    return tokenizer.substringToPos(end);
  }

  function scanString(tokenizer) {
    var end = tokenizer.str.indexOf('\'', tokenizer.pos + 1);

    if (end === -1) {
      tokenizer.pos = tokenizer.str.length;
      tokenizer.error('Expect an apostrophe');
    }

    return tokenizer.substringToPos(end + 1);
  }

  function readMultiplierRange(tokenizer) {
    var min = null;
    var max = null;
    tokenizer.eat(LEFTCURLYBRACKET);
    min = scanNumber(tokenizer);

    if (tokenizer.charCode() === COMMA) {
      tokenizer.pos++;

      if (tokenizer.charCode() !== RIGHTCURLYBRACKET) {
        max = scanNumber(tokenizer);
      }
    } else {
      max = min;
    }

    tokenizer.eat(RIGHTCURLYBRACKET);
    return {
      min: Number(min),
      max: max ? Number(max) : 0
    };
  }

  function readMultiplier(tokenizer) {
    var range = null;
    var comma = false;

    switch (tokenizer.charCode()) {
      case ASTERISK:
        tokenizer.pos++;
        range = {
          min: 0,
          max: 0
        };
        break;

      case PLUSSIGN$2:
        tokenizer.pos++;
        range = {
          min: 1,
          max: 0
        };
        break;

      case QUESTIONMARK$1:
        tokenizer.pos++;
        range = {
          min: 0,
          max: 1
        };
        break;

      case NUMBERSIGN:
        tokenizer.pos++;
        comma = true;

        if (tokenizer.charCode() === LEFTCURLYBRACKET) {
          range = readMultiplierRange(tokenizer);
        } else {
          range = {
            min: 1,
            max: 0
          };
        }

        break;

      case LEFTCURLYBRACKET:
        range = readMultiplierRange(tokenizer);
        break;

      default:
        return null;
    }

    return {
      type: 'Multiplier',
      comma: comma,
      min: range.min,
      max: range.max,
      term: null
    };
  }

  function maybeMultiplied(tokenizer, node) {
    var multiplier = readMultiplier(tokenizer);

    if (multiplier !== null) {
      multiplier.term = node;
      return multiplier;
    }

    return node;
  }

  function maybeToken(tokenizer) {
    var ch = tokenizer.peek();

    if (ch === '') {
      return null;
    }

    return {
      type: 'Token',
      value: ch
    };
  }

  function readProperty(tokenizer) {
    var name;
    tokenizer.eat(LESSTHANSIGN);
    tokenizer.eat(APOSTROPHE);
    name = scanWord(tokenizer);
    tokenizer.eat(APOSTROPHE);
    tokenizer.eat(GREATERTHANSIGN);
    return maybeMultiplied(tokenizer, {
      type: 'Property',
      name: name
    });
  } // https://drafts.csswg.org/css-values-3/#numeric-ranges
  // 4.1. Range Restrictions and Range Definition Notation
  //
  // Range restrictions can be annotated in the numeric type notation using CSS bracketed
  // range notation—[min,max]—within the angle brackets, after the identifying keyword,
  // indicating a closed range between (and including) min and max.
  // For example, <integer [0, 10]> indicates an integer between 0 and 10, inclusive.


  function readTypeRange(tokenizer) {
    // use null for Infinity to make AST format JSON serializable/deserializable
    var min = null; // -Infinity

    var max = null; // Infinity

    var sign = 1;
    tokenizer.eat(LEFTSQUAREBRACKET);

    if (tokenizer.charCode() === HYPERMINUS) {
      tokenizer.peek();
      sign = -1;
    }

    if (sign == -1 && tokenizer.charCode() === INFINITY) {
      tokenizer.peek();
    } else {
      min = sign * Number(scanNumber(tokenizer));
    }

    scanSpaces(tokenizer);
    tokenizer.eat(COMMA);
    scanSpaces(tokenizer);

    if (tokenizer.charCode() === INFINITY) {
      tokenizer.peek();
    } else {
      sign = 1;

      if (tokenizer.charCode() === HYPERMINUS) {
        tokenizer.peek();
        sign = -1;
      }

      max = sign * Number(scanNumber(tokenizer));
    }

    tokenizer.eat(RIGHTSQUAREBRACKET); // If no range is indicated, either by using the bracketed range notation
    // or in the property description, then [−∞,∞] is assumed.

    if (min === null && max === null) {
      return null;
    }

    return {
      type: 'Range',
      min: min,
      max: max
    };
  }

  function readType(tokenizer) {
    var name;
    var opts = null;
    tokenizer.eat(LESSTHANSIGN);
    name = scanWord(tokenizer);

    if (tokenizer.charCode() === LEFTPARENTHESIS && tokenizer.nextCharCode() === RIGHTPARENTHESIS) {
      tokenizer.pos += 2;
      name += '()';
    }

    if (tokenizer.charCodeAt(tokenizer.findWsEnd(tokenizer.pos)) === LEFTSQUAREBRACKET) {
      scanSpaces(tokenizer);
      opts = readTypeRange(tokenizer);
    }

    tokenizer.eat(GREATERTHANSIGN);
    return maybeMultiplied(tokenizer, {
      type: 'Type',
      name: name,
      opts: opts
    });
  }

  function readKeywordOrFunction(tokenizer) {
    var name;
    name = scanWord(tokenizer);

    if (tokenizer.charCode() === LEFTPARENTHESIS) {
      tokenizer.pos++;
      return {
        type: 'Function',
        name: name
      };
    }

    return maybeMultiplied(tokenizer, {
      type: 'Keyword',
      name: name
    });
  }

  function regroupTerms(terms, combinators) {
    function createGroup(terms, combinator) {
      return {
        type: 'Group',
        terms: terms,
        combinator: combinator,
        disallowEmpty: false,
        explicit: false
      };
    }

    combinators = Object.keys(combinators).sort(function (a, b) {
      return COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b];
    });

    while (combinators.length > 0) {
      var combinator = combinators.shift();

      for (var i = 0, subgroupStart = 0; i < terms.length; i++) {
        var term = terms[i];

        if (term.type === 'Combinator') {
          if (term.value === combinator) {
            if (subgroupStart === -1) {
              subgroupStart = i - 1;
            }

            terms.splice(i, 1);
            i--;
          } else {
            if (subgroupStart !== -1 && i - subgroupStart > 1) {
              terms.splice(subgroupStart, i - subgroupStart, createGroup(terms.slice(subgroupStart, i), combinator));
              i = subgroupStart + 1;
            }

            subgroupStart = -1;
          }
        }
      }

      if (subgroupStart !== -1 && combinators.length) {
        terms.splice(subgroupStart, i - subgroupStart, createGroup(terms.slice(subgroupStart, i), combinator));
      }
    }

    return combinator;
  }

  function readImplicitGroup(tokenizer) {
    var terms = [];
    var combinators = {};
    var token;
    var prevToken = null;
    var prevTokenPos = tokenizer.pos;

    while (token = peek(tokenizer)) {
      if (token.type !== 'Spaces') {
        if (token.type === 'Combinator') {
          // check for combinator in group beginning and double combinator sequence
          if (prevToken === null || prevToken.type === 'Combinator') {
            tokenizer.pos = prevTokenPos;
            tokenizer.error('Unexpected combinator');
          }

          combinators[token.value] = true;
        } else if (prevToken !== null && prevToken.type !== 'Combinator') {
          combinators[' '] = true; // a b

          terms.push({
            type: 'Combinator',
            value: ' '
          });
        }

        terms.push(token);
        prevToken = token;
        prevTokenPos = tokenizer.pos;
      }
    } // check for combinator in group ending


    if (prevToken !== null && prevToken.type === 'Combinator') {
      tokenizer.pos -= prevTokenPos;
      tokenizer.error('Unexpected combinator');
    }

    return {
      type: 'Group',
      terms: terms,
      combinator: regroupTerms(terms, combinators) || ' ',
      disallowEmpty: false,
      explicit: false
    };
  }

  function readGroup(tokenizer) {
    var result;
    tokenizer.eat(LEFTSQUAREBRACKET);
    result = readImplicitGroup(tokenizer);
    tokenizer.eat(RIGHTSQUAREBRACKET);
    result.explicit = true;

    if (tokenizer.charCode() === EXCLAMATIONMARK) {
      tokenizer.pos++;
      result.disallowEmpty = true;
    }

    return result;
  }

  function peek(tokenizer) {
    var code = tokenizer.charCode();

    if (code < 128 && NAME_CHAR[code] === 1) {
      return readKeywordOrFunction(tokenizer);
    }

    switch (code) {
      case RIGHTSQUAREBRACKET:
        // don't eat, stop scan a group
        break;

      case LEFTSQUAREBRACKET:
        return maybeMultiplied(tokenizer, readGroup(tokenizer));

      case LESSTHANSIGN:
        return tokenizer.nextCharCode() === APOSTROPHE ? readProperty(tokenizer) : readType(tokenizer);

      case VERTICALLINE:
        return {
          type: 'Combinator',
          value: tokenizer.substringToPos(tokenizer.nextCharCode() === VERTICALLINE ? tokenizer.pos + 2 : tokenizer.pos + 1)
        };

      case AMPERSAND:
        tokenizer.pos++;
        tokenizer.eat(AMPERSAND);
        return {
          type: 'Combinator',
          value: '&&'
        };

      case COMMA:
        tokenizer.pos++;
        return {
          type: 'Comma'
        };

      case APOSTROPHE:
        return maybeMultiplied(tokenizer, {
          type: 'String',
          value: scanString(tokenizer)
        });

      case SPACE$1:
      case TAB$1:
      case N$2:
      case R$1:
      case F$1:
        return {
          type: 'Spaces',
          value: scanSpaces(tokenizer)
        };

      case COMMERCIALAT:
        code = tokenizer.nextCharCode();

        if (code < 128 && NAME_CHAR[code] === 1) {
          tokenizer.pos++;
          return {
            type: 'AtKeyword',
            name: scanWord(tokenizer)
          };
        }

        return maybeToken(tokenizer);

      case ASTERISK:
      case PLUSSIGN$2:
      case QUESTIONMARK$1:
      case NUMBERSIGN:
      case EXCLAMATIONMARK:
        // prohibited tokens (used as a multiplier start)
        break;

      case LEFTCURLYBRACKET:
        // LEFTCURLYBRACKET is allowed since mdn/data uses it w/o quoting
        // check next char isn't a number, because it's likely a disjoined multiplier
        code = tokenizer.nextCharCode();

        if (code < 48 || code > 57) {
          return maybeToken(tokenizer);
        }

        break;

      default:
        return maybeToken(tokenizer);
    }
  }

  function parse(source) {
    var tokenizer = new tokenizer$1(source);
    var result = readImplicitGroup(tokenizer);

    if (tokenizer.pos !== source.length) {
      tokenizer.error('Unexpected input');
    } // reduce redundant groups with single group term


    if (result.terms.length === 1 && result.terms[0].type === 'Group') {
      result = result.terms[0];
    }

    return result;
  } // warm up parse to elimitate code branches that never execute
  // fix soft deoptimizations (insufficient type feedback)


  parse('[a&&<b>#|<\'c\'>*||e() f{2} /,(% g#{1,2} h{2,})]!');
  var parse_1 = parse;

  var noop$1 = function noop() {};

  function ensureFunction(value) {
    return typeof value === 'function' ? value : noop$1;
  }

  var walk = function walk(node, options, context) {
    function walk(node) {
      enter.call(context, node);

      switch (node.type) {
        case 'Group':
          node.terms.forEach(walk);
          break;

        case 'Multiplier':
          walk(node.term);
          break;

        case 'Type':
        case 'Property':
        case 'Keyword':
        case 'AtKeyword':
        case 'Function':
        case 'String':
        case 'Token':
        case 'Comma':
          break;

        default:
          throw new Error('Unknown type: ' + node.type);
      }

      leave.call(context, node);
    }

    var enter = noop$1;
    var leave = noop$1;

    if (typeof options === 'function') {
      enter = options;
    } else if (options) {
      enter = ensureFunction(options.enter);
      leave = ensureFunction(options.leave);
    }

    if (enter === noop$1 && leave === noop$1) {
      throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
    }

    walk(node, context);
  };

  var tokenStream = new TokenStream_1();
  var astToTokens = {
    decorator: function decorator(handlers) {
      var curNode = null;
      var prev = {
        len: 0,
        node: null
      };
      var nodes = [prev];
      var buffer = '';
      return {
        children: handlers.children,
        node: function node(_node) {
          var tmp = curNode;
          curNode = _node;
          handlers.node.call(this, _node);
          curNode = tmp;
        },
        chunk: function chunk(_chunk) {
          buffer += _chunk;

          if (prev.node !== curNode) {
            nodes.push({
              len: _chunk.length,
              node: curNode
            });
          } else {
            prev.len += _chunk.length;
          }
        },
        result: function result() {
          return prepareTokens(buffer, nodes);
        }
      };
    }
  };

  function prepareTokens(str, nodes) {
    var tokens = [];
    var nodesOffset = 0;
    var nodesIndex = 0;
    var currentNode = nodes ? nodes[nodesIndex].node : null;
    tokenizer(str, tokenStream);

    while (!tokenStream.eof) {
      if (nodes) {
        while (nodesIndex < nodes.length && nodesOffset + nodes[nodesIndex].len <= tokenStream.tokenStart) {
          nodesOffset += nodes[nodesIndex++].len;
          currentNode = nodes[nodesIndex].node;
        }
      }

      tokens.push({
        type: tokenStream.tokenType,
        value: tokenStream.getTokenValue(),
        index: tokenStream.tokenIndex,
        // TODO: remove it, temporary solution
        balance: tokenStream.balance[tokenStream.tokenIndex],
        // TODO: remove it, temporary solution
        node: currentNode
      });
      tokenStream.next(); // console.log({ ...tokens[tokens.length - 1], node: undefined });
    }

    return tokens;
  }

  var prepareTokens_1 = function prepareTokens_1(value, syntax) {
    if (typeof value === 'string') {
      return prepareTokens(value, null);
    }

    return syntax.generate(value, astToTokens);
  };

  var MATCH$3 = {
    type: 'Match'
  };
  var MISMATCH = {
    type: 'Mismatch'
  };
  var DISALLOW_EMPTY = {
    type: 'DisallowEmpty'
  };
  var LEFTPARENTHESIS$1 = 40; // (

  var RIGHTPARENTHESIS$1 = 41; // )

  function createCondition(match, thenBranch, elseBranch) {
    // reduce node count
    if (thenBranch === MATCH$3 && elseBranch === MISMATCH) {
      return match;
    }

    if (match === MATCH$3 && thenBranch === MATCH$3 && elseBranch === MATCH$3) {
      return match;
    }

    if (match.type === 'If' && match.else === MISMATCH && thenBranch === MATCH$3) {
      thenBranch = match.then;
      match = match.match;
    }

    return {
      type: 'If',
      match: match,
      then: thenBranch,
      else: elseBranch
    };
  }

  function isFunctionType(name) {
    return name.length > 2 && name.charCodeAt(name.length - 2) === LEFTPARENTHESIS$1 && name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS$1;
  }

  function isEnumCapatible(term) {
    return term.type === 'Keyword' || term.type === 'AtKeyword' || term.type === 'Function' || term.type === 'Type' && isFunctionType(term.name);
  }

  function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
    switch (combinator) {
      case ' ':
        // Juxtaposing components means that all of them must occur, in the given order.
        //
        // a b c
        // =
        // match a
        //   then match b
        //     then match c
        //       then MATCH
        //       else MISMATCH
        //     else MISMATCH
        //   else MISMATCH
        var result = MATCH$3;

        for (var i = terms.length - 1; i >= 0; i--) {
          var term = terms[i];
          result = createCondition(term, result, MISMATCH);
        }
        return result;

      case '|':
        // A bar (|) separates two or more alternatives: exactly one of them must occur.
        //
        // a | b | c
        // =
        // match a
        //   then MATCH
        //   else match b
        //     then MATCH
        //     else match c
        //       then MATCH
        //       else MISMATCH
        var result = MISMATCH;
        var map = null;

        for (var i = terms.length - 1; i >= 0; i--) {
          var term = terms[i]; // reduce sequence of keywords into a Enum

          if (isEnumCapatible(term)) {
            if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
              map = Object.create(null);
              result = createCondition({
                type: 'Enum',
                map: map
              }, MATCH$3, result);
            }

            if (map !== null) {
              var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();

              if (key in map === false) {
                map[key] = term;
                continue;
              }
            }
          }

          map = null; // create a new conditonal node

          result = createCondition(term, MATCH$3, result);
        }
        return result;

      case '&&':
        // A double ampersand (&&) separates two or more components,
        // all of which must occur, in any order.
        // Use MatchOnce for groups with a large number of terms,
        // since &&-groups produces at least N!-node trees
        if (terms.length > 5) {
          return {
            type: 'MatchOnce',
            terms: terms,
            all: true
          };
        } // Use a combination tree for groups with small number of terms
        //
        // a && b && c
        // =
        // match a
        //   then [b && c]
        //   else match b
        //     then [a && c]
        //     else match c
        //       then [a && b]
        //       else MISMATCH
        //
        // a && b
        // =
        // match a
        //   then match b
        //     then MATCH
        //     else MISMATCH
        //   else match b
        //     then match a
        //       then MATCH
        //       else MISMATCH
        //     else MISMATCH


        var result = MISMATCH;

        for (var i = terms.length - 1; i >= 0; i--) {
          var term = terms[i];
          var thenClause;

          if (terms.length > 1) {
            thenClause = buildGroupMatchGraph(combinator, terms.filter(function (newGroupTerm) {
              return newGroupTerm !== term;
            }), false);
          } else {
            thenClause = MATCH$3;
          }

          result = createCondition(term, thenClause, result);
        }
        return result;

      case '||':
        // A double bar (||) separates two or more options:
        // one or more of them must occur, in any order.
        // Use MatchOnce for groups with a large number of terms,
        // since ||-groups produces at least N!-node trees
        if (terms.length > 5) {
          return {
            type: 'MatchOnce',
            terms: terms,
            all: false
          };
        } // Use a combination tree for groups with small number of terms
        //
        // a || b || c
        // =
        // match a
        //   then [b || c]
        //   else match b
        //     then [a || c]
        //     else match c
        //       then [a || b]
        //       else MISMATCH
        //
        // a || b
        // =
        // match a
        //   then match b
        //     then MATCH
        //     else MATCH
        //   else match b
        //     then match a
        //       then MATCH
        //       else MATCH
        //     else MISMATCH


        var result = atLeastOneTermMatched ? MATCH$3 : MISMATCH;

        for (var i = terms.length - 1; i >= 0; i--) {
          var term = terms[i];
          var thenClause;

          if (terms.length > 1) {
            thenClause = buildGroupMatchGraph(combinator, terms.filter(function (newGroupTerm) {
              return newGroupTerm !== term;
            }), true);
          } else {
            thenClause = MATCH$3;
          }

          result = createCondition(term, thenClause, result);
        }
        return result;
    }
  }

  function buildMultiplierMatchGraph(node) {
    var result = MATCH$3;

    var matchTerm = _buildMatchGraph(node.term);

    if (node.max === 0) {
      // disable repeating of empty match to prevent infinite loop
      matchTerm = createCondition(matchTerm, DISALLOW_EMPTY, MISMATCH); // an occurrence count is not limited, make a cycle;
      // to collect more terms on each following matching mismatch

      result = createCondition(matchTerm, null, // will be a loop
      MISMATCH);
      result.then = createCondition(MATCH$3, MATCH$3, result // make a loop
      );

      if (node.comma) {
        result.then.else = createCondition({
          type: 'Comma',
          syntax: node
        }, result, MISMATCH);
      }
    } else {
      // create a match node chain for [min .. max] interval with optional matches
      for (var i = node.min || 1; i <= node.max; i++) {
        if (node.comma && result !== MATCH$3) {
          result = createCondition({
            type: 'Comma',
            syntax: node
          }, result, MISMATCH);
        }

        result = createCondition(matchTerm, createCondition(MATCH$3, MATCH$3, result), MISMATCH);
      }
    }

    if (node.min === 0) {
      // allow zero match
      result = createCondition(MATCH$3, MATCH$3, result);
    } else {
      // create a match node chain to collect [0 ... min - 1] required matches
      for (var i = 0; i < node.min - 1; i++) {
        if (node.comma && result !== MATCH$3) {
          result = createCondition({
            type: 'Comma',
            syntax: node
          }, result, MISMATCH);
        }

        result = createCondition(matchTerm, result, MISMATCH);
      }
    }

    return result;
  }

  function _buildMatchGraph(node) {
    if (typeof node === 'function') {
      return {
        type: 'Generic',
        fn: node
      };
    }

    switch (node.type) {
      case 'Group':
        var result = buildGroupMatchGraph(node.combinator, node.terms.map(_buildMatchGraph), false);

        if (node.disallowEmpty) {
          result = createCondition(result, DISALLOW_EMPTY, MISMATCH);
        }

        return result;

      case 'Multiplier':
        return buildMultiplierMatchGraph(node);

      case 'Type':
      case 'Property':
        return {
          type: node.type,
          name: node.name,
          syntax: node
        };

      case 'Keyword':
        return {
          type: node.type,
          name: node.name.toLowerCase(),
          syntax: node
        };

      case 'AtKeyword':
        return {
          type: node.type,
          name: '@' + node.name.toLowerCase(),
          syntax: node
        };

      case 'Function':
        return {
          type: node.type,
          name: node.name.toLowerCase() + '(',
          syntax: node
        };

      case 'String':
        // convert a one char length String to a Token
        if (node.value.length === 3) {
          return {
            type: 'Token',
            value: node.value.charAt(1),
            syntax: node
          };
        } // otherwise use it as is


        return {
          type: node.type,
          value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, '\''),
          syntax: node
        };

      case 'Token':
        return {
          type: node.type,
          value: node.value,
          syntax: node
        };

      case 'Comma':
        return {
          type: node.type,
          syntax: node
        };

      default:
        throw new Error('Unknown node type:', node.type);
    }
  }

  var matchGraph = {
    MATCH: MATCH$3,
    MISMATCH: MISMATCH,
    DISALLOW_EMPTY: DISALLOW_EMPTY,
    buildMatchGraph: function buildMatchGraph(syntaxTree, ref) {
      if (typeof syntaxTree === 'string') {
        syntaxTree = parse_1(syntaxTree);
      }

      return {
        type: 'MatchGraph',
        match: _buildMatchGraph(syntaxTree),
        syntax: ref || null,
        source: syntaxTree
      };
    }
  };

  var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  var MATCH$4 = matchGraph.MATCH;
  var MISMATCH$1 = matchGraph.MISMATCH;
  var DISALLOW_EMPTY$1 = matchGraph.DISALLOW_EMPTY;
  var TYPE$6 = _const.TYPE;
  var STUB = 0;
  var TOKEN = 1;
  var OPEN_SYNTAX = 2;
  var CLOSE_SYNTAX = 3;
  var EXIT_REASON_MATCH = 'Match';
  var EXIT_REASON_MISMATCH = 'Mismatch';
  var EXIT_REASON_ITERATION_LIMIT = 'Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)';
  var ITERATION_LIMIT = 15000;
  var totalIterationCount = 0;

  function reverseList(list) {
    var prev = null;
    var next = null;
    var item = list;

    while (item !== null) {
      next = item.prev;
      item.prev = prev;
      prev = item;
      item = next;
    }

    return prev;
  }

  function areStringsEqualCaseInsensitive(testStr, referenceStr) {
    if (testStr.length !== referenceStr.length) {
      return false;
    }

    for (var i = 0; i < testStr.length; i++) {
      var testCode = testStr.charCodeAt(i);
      var referenceCode = referenceStr.charCodeAt(i); // testCode.toLowerCase() for U+0041 LATIN CAPITAL LETTER A (A) .. U+005A LATIN CAPITAL LETTER Z (Z).

      if (testCode >= 0x0041 && testCode <= 0x005A) {
        testCode = testCode | 32;
      }

      if (testCode !== referenceCode) {
        return false;
      }
    }

    return true;
  }

  function isCommaContextStart(token) {
    if (token === null) {
      return true;
    }

    return token.type === TYPE$6.Comma || token.type === TYPE$6.Function || token.type === TYPE$6.LeftParenthesis || token.type === TYPE$6.LeftSquareBracket || token.type === TYPE$6.LeftCurlyBracket || token.type === TYPE$6.Delim;
  }

  function isCommaContextEnd(token) {
    if (token === null) {
      return true;
    }

    return token.type === TYPE$6.RightParenthesis || token.type === TYPE$6.RightSquareBracket || token.type === TYPE$6.RightCurlyBracket || token.type === TYPE$6.Delim;
  }

  function internalMatch(tokens, state, syntaxes) {
    function moveToNextToken() {
      do {
        tokenIndex++;
        token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
      } while (token !== null && (token.type === TYPE$6.WhiteSpace || token.type === TYPE$6.Comment));
    }

    function getNextToken(offset) {
      var nextIndex = tokenIndex + offset;
      return nextIndex < tokens.length ? tokens[nextIndex] : null;
    }

    function stateSnapshotFromSyntax(nextState, prev) {
      return {
        nextState: nextState,
        matchStack: matchStack,
        syntaxStack: syntaxStack,
        thenStack: thenStack,
        tokenIndex: tokenIndex,
        prev: prev
      };
    }

    function pushThenStack(nextState) {
      thenStack = {
        nextState: nextState,
        matchStack: matchStack,
        syntaxStack: syntaxStack,
        prev: thenStack
      };
    }

    function pushElseStack(nextState) {
      elseStack = stateSnapshotFromSyntax(nextState, elseStack);
    }

    function addTokenToMatch() {
      matchStack = {
        type: TOKEN,
        syntax: state.syntax,
        token: token,
        prev: matchStack
      };
      moveToNextToken();
      syntaxStash = null;

      if (tokenIndex > longestMatch) {
        longestMatch = tokenIndex;
      }
    }

    function openSyntax() {
      syntaxStack = {
        syntax: state.syntax,
        opts: state.syntax.opts || syntaxStack !== null && syntaxStack.opts || null,
        prev: syntaxStack
      };
      matchStack = {
        type: OPEN_SYNTAX,
        syntax: state.syntax,
        token: matchStack.token,
        prev: matchStack
      };
    }

    function closeSyntax() {
      if (matchStack.type === OPEN_SYNTAX) {
        matchStack = matchStack.prev;
      } else {
        matchStack = {
          type: CLOSE_SYNTAX,
          syntax: syntaxStack.syntax,
          token: matchStack.token,
          prev: matchStack
        };
      }

      syntaxStack = syntaxStack.prev;
    }

    var syntaxStack = null;
    var thenStack = null;
    var elseStack = null; // null – stashing allowed, nothing stashed
    // false – stashing disabled, nothing stashed
    // anithing else – fail stashable syntaxes, some syntax stashed

    var syntaxStash = null;
    var iterationCount = 0; // count iterations and prevent infinite loop

    var exitReason = null;
    var token = null;
    var tokenIndex = -1;
    var longestMatch = 0;
    var matchStack = {
      type: STUB,
      syntax: null,
      token: null,
      prev: null
    };
    moveToNextToken();

    while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
      // function mapList(list, fn) {
      //     var result = [];
      //     while (list) {
      //         result.unshift(fn(list));
      //         list = list.prev;
      //     }
      //     return result;
      // }
      // console.log('--\n',
      //     '#' + iterationCount,
      //     require('util').inspect({
      //         match: mapList(matchStack, x => x.type === TOKEN ? x.token && x.token.value : x.syntax ? ({ [OPEN_SYNTAX]: '<', [CLOSE_SYNTAX]: '</' }[x.type] || x.type) + '!' + x.syntax.name : null),
      //         token: token && token.value,
      //         tokenIndex,
      //         syntax: syntax.type + (syntax.id ? ' #' + syntax.id : '')
      //     }, { depth: null })
      // );
      switch (state.type) {
        case 'Match':
          if (thenStack === null) {
            // turn to MISMATCH when some tokens left unmatched
            if (token !== null) {
              // doesn't mismatch if just one token left and it's an IE hack
              if (tokenIndex !== tokens.length - 1 || token.value !== '\\0' && token.value !== '\\9') {
                state = MISMATCH$1;
                break;
              }
            } // break the main loop, return a result - MATCH


            exitReason = EXIT_REASON_MATCH;
            break;
          } // go to next syntax (`then` branch)


          state = thenStack.nextState; // check match is not empty

          if (state === DISALLOW_EMPTY$1) {
            if (thenStack.matchStack === matchStack) {
              state = MISMATCH$1;
              break;
            } else {
              state = MATCH$4;
            }
          } // close syntax if needed


          while (thenStack.syntaxStack !== syntaxStack) {
            closeSyntax();
          } // pop stack


          thenStack = thenStack.prev;
          break;

        case 'Mismatch':
          // when some syntax is stashed
          if (syntaxStash !== null && syntaxStash !== false) {
            // there is no else branches or a branch reduce match stack
            if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
              // restore state from the stash
              elseStack = syntaxStash;
              syntaxStash = false; // disable stashing
            }
          } else if (elseStack === null) {
            // no else branches -> break the main loop
            // return a result - MISMATCH
            exitReason = EXIT_REASON_MISMATCH;
            break;
          } // go to next syntax (`else` branch)


          state = elseStack.nextState; // restore all the rest stack states

          thenStack = elseStack.thenStack;
          syntaxStack = elseStack.syntaxStack;
          matchStack = elseStack.matchStack;
          tokenIndex = elseStack.tokenIndex;
          token = tokenIndex < tokens.length ? tokens[tokenIndex] : null; // pop stack

          elseStack = elseStack.prev;
          break;

        case 'MatchGraph':
          state = state.match;
          break;

        case 'If':
          // IMPORTANT: else stack push must go first,
          // since it stores the state of thenStack before changes
          if (state.else !== MISMATCH$1) {
            pushElseStack(state.else);
          }

          if (state.then !== MATCH$4) {
            pushThenStack(state.then);
          }

          state = state.match;
          break;

        case 'MatchOnce':
          state = {
            type: 'MatchOnceBuffer',
            syntax: state,
            index: 0,
            mask: 0
          };
          break;

        case 'MatchOnceBuffer':
          var terms = state.syntax.terms;

          if (state.index === terms.length) {
            // no matches at all or it's required all terms to be matched
            if (state.mask === 0 || state.syntax.all) {
              state = MISMATCH$1;
              break;
            } // a partial match is ok


            state = MATCH$4;
            break;
          } // all terms are matched


          if (state.mask === (1 << terms.length) - 1) {
            state = MATCH$4;
            break;
          }

          for (; state.index < terms.length; state.index++) {
            var matchFlag = 1 << state.index;

            if ((state.mask & matchFlag) === 0) {
              // IMPORTANT: else stack push must go first,
              // since it stores the state of thenStack before changes
              pushElseStack(state);
              pushThenStack({
                type: 'AddMatchOnce',
                syntax: state.syntax,
                mask: state.mask | matchFlag
              }); // match

              state = terms[state.index++];
              break;
            }
          }

          break;

        case 'AddMatchOnce':
          state = {
            type: 'MatchOnceBuffer',
            syntax: state.syntax,
            index: 0,
            mask: state.mask
          };
          break;

        case 'Enum':
          if (token !== null) {
            var name = token.value.toLowerCase(); // drop \0 and \9 hack from keyword name

            if (name.indexOf('\\') !== -1) {
              name = name.replace(/\\[09].*$/, '');
            }

            if (hasOwnProperty$2.call(state.map, name)) {
              state = state.map[name];
              break;
            }
          }

          state = MISMATCH$1;
          break;

        case 'Generic':
          var opts = syntaxStack !== null ? syntaxStack.opts : null;
          var lastTokenIndex = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));

          if (!isNaN(lastTokenIndex) && lastTokenIndex > tokenIndex) {
            while (tokenIndex < lastTokenIndex) {
              addTokenToMatch();
            }

            state = MATCH$4;
          } else {
            state = MISMATCH$1;
          }

          break;

        case 'Type':
        case 'Property':
          var syntaxDict = state.type === 'Type' ? 'types' : 'properties';
          var dictSyntax = hasOwnProperty$2.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;

          if (!dictSyntax || !dictSyntax.match) {
            throw new Error('Bad syntax reference: ' + (state.type === 'Type' ? '<' + state.name + '>' : '<\'' + state.name + '\'>'));
          } // stash a syntax for types with low priority


          if (syntaxStash !== false && token !== null && state.type === 'Type') {
            var lowPriorityMatching = // https://drafts.csswg.org/css-values-4/#custom-idents
            // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
            // can only claim the keyword if no other unfulfilled production can claim it.
            state.name === 'custom-ident' && token.type === TYPE$6.Ident || // https://drafts.csswg.org/css-values-4/#lengths
            // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
            // it must parse as a <number>
            state.name === 'length' && token.value === '0';

            if (lowPriorityMatching) {
              if (syntaxStash === null) {
                syntaxStash = stateSnapshotFromSyntax(state, elseStack);
              }

              state = MISMATCH$1;
              break;
            }
          }

          openSyntax();
          state = dictSyntax.match;
          break;

        case 'Keyword':
          var name = state.name;

          if (token !== null) {
            var keywordName = token.value; // drop \0 and \9 hack from keyword name

            if (keywordName.indexOf('\\') !== -1) {
              keywordName = keywordName.replace(/\\[09].*$/, '');
            }

            if (areStringsEqualCaseInsensitive(keywordName, name)) {
              addTokenToMatch();
              state = MATCH$4;
              break;
            }
          }

          state = MISMATCH$1;
          break;

        case 'AtKeyword':
        case 'Function':
          if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
            addTokenToMatch();
            state = MATCH$4;
            break;
          }

          state = MISMATCH$1;
          break;

        case 'Token':
          if (token !== null && token.value === state.value) {
            addTokenToMatch();
            state = MATCH$4;
            break;
          }

          state = MISMATCH$1;
          break;

        case 'Comma':
          if (token !== null && token.type === TYPE$6.Comma) {
            if (isCommaContextStart(matchStack.token)) {
              state = MISMATCH$1;
            } else {
              addTokenToMatch();
              state = isCommaContextEnd(token) ? MISMATCH$1 : MATCH$4;
            }
          } else {
            state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH$4 : MISMATCH$1;
          }

          break;

        case 'String':
          var string = '';

          for (var lastTokenIndex = tokenIndex; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
            string += tokens[lastTokenIndex].value;
          }

          if (areStringsEqualCaseInsensitive(string, state.value)) {
            while (tokenIndex < lastTokenIndex) {
              addTokenToMatch();
            }

            state = MATCH$4;
          } else {
            state = MISMATCH$1;
          }

          break;

        default:
          throw new Error('Unknown node type: ' + state.type);
      }
    }

    totalIterationCount += iterationCount;

    switch (exitReason) {
      case null:
        console.warn('[csstree-match] BREAK after ' + ITERATION_LIMIT + ' iterations');
        exitReason = EXIT_REASON_ITERATION_LIMIT;
        matchStack = null;
        break;

      case EXIT_REASON_MATCH:
        while (syntaxStack !== null) {
          closeSyntax();
        }

        break;

      default:
        matchStack = null;
    }

    return {
      tokens: tokens,
      reason: exitReason,
      iterations: iterationCount,
      match: matchStack,
      longestMatch: longestMatch
    };
  }

  function matchAsList(tokens, matchGraph$$1, syntaxes) {
    var matchResult = internalMatch(tokens, matchGraph$$1, syntaxes || {});

    if (matchResult.match !== null) {
      var item = reverseList(matchResult.match).prev;
      matchResult.match = [];

      while (item !== null) {
        switch (item.type) {
          case STUB:
            break;

          case OPEN_SYNTAX:
          case CLOSE_SYNTAX:
            matchResult.match.push({
              type: item.type,
              syntax: item.syntax
            });
            break;

          default:
            matchResult.match.push({
              token: item.token.value,
              node: item.token.node
            });
            break;
        }

        item = item.prev;
      }
    }

    return matchResult;
  }

  function matchAsTree(tokens, matchGraph$$1, syntaxes) {
    var matchResult = internalMatch(tokens, matchGraph$$1, syntaxes || {});

    if (matchResult.match === null) {
      return matchResult;
    }

    var item = matchResult.match;
    var host = matchResult.match = {
      syntax: matchGraph$$1.syntax || null,
      match: []
    };
    var hostStack = [host]; // revert a list and start with 2nd item since 1st is a stub item

    item = reverseList(item).prev; // build a tree

    while (item !== null) {
      switch (item.type) {
        case OPEN_SYNTAX:
          host.match.push(host = {
            syntax: item.syntax,
            match: []
          });
          hostStack.push(host);
          break;

        case CLOSE_SYNTAX:
          hostStack.pop();
          host = hostStack[hostStack.length - 1];
          break;

        default:
          host.match.push({
            syntax: item.syntax || null,
            token: item.token.value,
            node: item.token.node
          });
      }

      item = item.prev;
    }

    return matchResult;
  }

  var match$1 = {
    matchAsList: matchAsList,
    matchAsTree: matchAsTree,
    getTotalIterationCount: function getTotalIterationCount() {
      return totalIterationCount;
    }
  };

  function getTrace(node) {
    function shouldPutToTrace(syntax) {
      if (syntax === null) {
        return false;
      }

      return syntax.type === 'Type' || syntax.type === 'Property' || syntax.type === 'Keyword';
    }

    function hasMatch(matchNode) {
      if (Array.isArray(matchNode.match)) {
        // use for-loop for better perfomance
        for (var i = 0; i < matchNode.match.length; i++) {
          if (hasMatch(matchNode.match[i])) {
            if (shouldPutToTrace(matchNode.syntax)) {
              result.unshift(matchNode.syntax);
            }

            return true;
          }
        }
      } else if (matchNode.node === node) {
        result = shouldPutToTrace(matchNode.syntax) ? [matchNode.syntax] : [];
        return true;
      }

      return false;
    }

    var result = null;

    if (this.matched !== null) {
      hasMatch(this.matched);
    }

    return result;
  }

  function testNode(match, node, fn) {
    var trace = getTrace.call(match, node);

    if (trace === null) {
      return false;
    }

    return trace.some(fn);
  }

  function isType(node, type) {
    return testNode(this, node, function (matchNode) {
      return matchNode.type === 'Type' && matchNode.name === type;
    });
  }

  function isProperty(node, property) {
    return testNode(this, node, function (matchNode) {
      return matchNode.type === 'Property' && matchNode.name === property;
    });
  }

  function isKeyword(node) {
    return testNode(this, node, function (matchNode) {
      return matchNode.type === 'Keyword';
    });
  }

  var trace = {
    getTrace: getTrace,
    isType: isType,
    isProperty: isProperty,
    isKeyword: isKeyword
  };

  function getFirstMatchNode(matchNode) {
    if ('node' in matchNode) {
      return matchNode.node;
    }

    return getFirstMatchNode(matchNode.match[0]);
  }

  function getLastMatchNode(matchNode) {
    if ('node' in matchNode) {
      return matchNode.node;
    }

    return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
  }

  function matchFragments(lexer, ast, match, type, name) {
    function findFragments(matchNode) {
      if (matchNode.syntax !== null && matchNode.syntax.type === type && matchNode.syntax.name === name) {
        var start = getFirstMatchNode(matchNode);
        var end = getLastMatchNode(matchNode);
        lexer.syntax.walk(ast, function (node, item, list) {
          if (node === start) {
            var nodes = new List_1();

            do {
              nodes.appendData(item.data);

              if (item.data === end) {
                break;
              }

              item = item.next;
            } while (item !== null);

            fragments.push({
              parent: list,
              nodes: nodes
            });
          }
        });
      }

      if (Array.isArray(matchNode.match)) {
        matchNode.match.forEach(findFragments);
      }
    }

    var fragments = [];

    if (match.matched !== null) {
      findFragments(match.matched);
    }

    return fragments;
  }

  var search = {
    matchFragments: matchFragments
  };

  var hasOwnProperty$3 = Object.prototype.hasOwnProperty;

  function isValidNumber(value) {
    // Number.isInteger(value) && value >= 0
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value && value >= 0;
  }

  function isValidLocation(loc) {
    return Boolean(loc) && isValidNumber(loc.offset) && isValidNumber(loc.line) && isValidNumber(loc.column);
  }

  function createNodeStructureChecker(type, fields) {
    return function checkNode(node, warn) {
      if (!node || node.constructor !== Object) {
        return warn(node, 'Type of node should be an Object');
      }

      for (var key in node) {
        var valid = true;

        if (hasOwnProperty$3.call(node, key) === false) {
          continue;
        }

        if (key === 'type') {
          if (node.type !== type) {
            warn(node, 'Wrong node type `' + node.type + '`, expected `' + type + '`');
          }
        } else if (key === 'loc') {
          if (node.loc === null) {
            continue;
          } else if (node.loc && node.loc.constructor === Object) {
            if (typeof node.loc.source !== 'string') {
              key += '.source';
            } else if (!isValidLocation(node.loc.start)) {
              key += '.start';
            } else if (!isValidLocation(node.loc.end)) {
              key += '.end';
            } else {
              continue;
            }
          }

          valid = false;
        } else if (fields.hasOwnProperty(key)) {
          for (var i = 0, valid = false; !valid && i < fields[key].length; i++) {
            var fieldType = fields[key][i];

            switch (fieldType) {
              case String:
                valid = typeof node[key] === 'string';
                break;

              case Boolean:
                valid = typeof node[key] === 'boolean';
                break;

              case null:
                valid = node[key] === null;
                break;

              default:
                if (typeof fieldType === 'string') {
                  valid = node[key] && node[key].type === fieldType;
                } else if (Array.isArray(fieldType)) {
                  valid = node[key] instanceof List_1;
                }

            }
          }
        } else {
          warn(node, 'Unknown field `' + key + '` for ' + type + ' node type');
        }

        if (!valid) {
          warn(node, 'Bad value for `' + type + '.' + key + '`');
        }
      }

      for (var key in fields) {
        if (hasOwnProperty$3.call(fields, key) && hasOwnProperty$3.call(node, key) === false) {
          warn(node, 'Field `' + type + '.' + key + '` is missed');
        }
      }
    };
  }

  function processStructure(name, nodeType) {
    var structure = nodeType.structure;
    var fields = {
      type: String,
      loc: true
    };
    var docs = {
      type: '"' + name + '"'
    };

    for (var key in structure) {
      if (hasOwnProperty$3.call(structure, key) === false) {
        continue;
      }

      var docsTypes = [];
      var fieldTypes = fields[key] = Array.isArray(structure[key]) ? structure[key].slice() : [structure[key]];

      for (var i = 0; i < fieldTypes.length; i++) {
        var fieldType = fieldTypes[i];

        if (fieldType === String || fieldType === Boolean) {
          docsTypes.push(fieldType.name);
        } else if (fieldType === null) {
          docsTypes.push('null');
        } else if (typeof fieldType === 'string') {
          docsTypes.push('<' + fieldType + '>');
        } else if (Array.isArray(fieldType)) {
          docsTypes.push('List'); // TODO: use type enum
        } else {
          throw new Error('Wrong value `' + fieldType + '` in `' + name + '.' + key + '` structure definition');
        }
      }

      docs[key] = docsTypes.join(' | ');
    }

    return {
      docs: docs,
      check: createNodeStructureChecker(name, fields)
    };
  }

  var structure = {
    getStructureFromConfig: function getStructureFromConfig(config) {
      var structure = {};

      if (config.node) {
        for (var name in config.node) {
          if (hasOwnProperty$3.call(config.node, name)) {
            var nodeType = config.node[name];

            if (nodeType.structure) {
              structure[name] = processStructure(name, nodeType);
            } else {
              throw new Error('Missed `structure` field in `' + name + '` node type definition');
            }
          }
        }
      }

      return structure;
    }
  };

  var SyntaxReferenceError$1 = error.SyntaxReferenceError;
  var MatchError$1 = error.MatchError;
  var buildMatchGraph = matchGraph.buildMatchGraph;
  var matchAsTree$1 = match$1.matchAsTree;
  var getStructureFromConfig = structure.getStructureFromConfig;
  var cssWideKeywords$1 = buildMatchGraph('inherit | initial | unset');
  var cssWideKeywordsWithExpression = buildMatchGraph('inherit | initial | unset | <-ms-legacy-expression>');

  function dumpMapSyntax(map, compact, syntaxAsAst) {
    var result = {};

    for (var name in map) {
      if (map[name].syntax) {
        result[name] = syntaxAsAst ? map[name].syntax : generate_1(map[name].syntax, {
          compact: compact
        });
      }
    }

    return result;
  }

  function valueHasVar(tokens) {
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].value.toLowerCase() === 'var(') {
        return true;
      }
    }

    return false;
  }

  function buildMatchResult(match, error$$1, iterations) {
    return {
      matched: match,
      iterations: iterations,
      error: error$$1,
      getTrace: trace.getTrace,
      isType: trace.isType,
      isProperty: trace.isProperty,
      isKeyword: trace.isKeyword
    };
  }

  function matchSyntax(lexer, syntax, value, useCommon) {
    var tokens = prepareTokens_1(value, lexer.syntax);
    var result;

    if (valueHasVar(tokens)) {
      return buildMatchResult(null, new Error('Matching for a tree with var() is not supported'));
    }

    if (useCommon) {
      result = matchAsTree$1(tokens, lexer.valueCommonSyntax, lexer);
    }

    if (!useCommon || !result.match) {
      result = matchAsTree$1(tokens, syntax.match, lexer);

      if (!result.match) {
        return buildMatchResult(null, new MatchError$1(result.reason, syntax.syntax, value, result), result.iterations);
      }
    }

    return buildMatchResult(result.match, null, result.iterations);
  }

  var Lexer = function Lexer(config, syntax, structure$$1) {
    this.valueCommonSyntax = cssWideKeywords$1;
    this.syntax = syntax;
    this.generic = false;
    this.atrules = {};
    this.properties = {};
    this.types = {};
    this.structure = structure$$1 || getStructureFromConfig(config);

    if (config) {
      if (config.types) {
        for (var name in config.types) {
          this.addType_(name, config.types[name]);
        }
      }

      if (config.generic) {
        this.generic = true;

        for (var name in generic) {
          this.addType_(name, generic[name]);
        }
      }

      if (config.atrules) {
        for (var name in config.atrules) {
          this.addAtrule_(name, config.atrules[name]);
        }
      }

      if (config.properties) {
        for (var name in config.properties) {
          this.addProperty_(name, config.properties[name]);
        }
      }
    }
  };

  Lexer.prototype = {
    structure: {},
    checkStructure: function checkStructure(ast) {
      function collectWarning(node, message) {
        warns.push({
          node: node,
          message: message
        });
      }

      var structure$$1 = this.structure;
      var warns = [];
      this.syntax.walk(ast, function (node) {
        if (structure$$1.hasOwnProperty(node.type)) {
          structure$$1[node.type].check(node, collectWarning);
        } else {
          collectWarning(node, 'Unknown node type `' + node.type + '`');
        }
      });
      return warns.length ? warns : false;
    },
    createDescriptor: function createDescriptor(syntax, type, name) {
      var ref = {
        type: type,
        name: name
      };
      var descriptor = {
        type: type,
        name: name,
        syntax: null,
        match: null
      };

      if (typeof syntax === 'function') {
        descriptor.match = buildMatchGraph(syntax, ref);
      } else {
        if (typeof syntax === 'string') {
          // lazy parsing on first access
          Object.defineProperty(descriptor, 'syntax', {
            get: function get() {
              Object.defineProperty(descriptor, 'syntax', {
                value: parse_1(syntax)
              });
              return descriptor.syntax;
            }
          });
        } else {
          descriptor.syntax = syntax;
        } // lazy graph build on first access


        Object.defineProperty(descriptor, 'match', {
          get: function get() {
            Object.defineProperty(descriptor, 'match', {
              value: buildMatchGraph(descriptor.syntax, ref)
            });
            return descriptor.match;
          }
        });
      }

      return descriptor;
    },
    addAtrule_: function addAtrule_(name, syntax) {
      var _this = this;

      this.atrules[name] = {
        prelude: syntax.prelude ? this.createDescriptor(syntax.prelude, 'AtrulePrelude', name) : null,
        descriptors: syntax.descriptors ? Object.keys(syntax.descriptors).reduce(function (res, name) {
          res[name] = _this.createDescriptor(syntax.descriptors[name], 'AtruleDescriptor', name);
          return res;
        }, {}) : null
      };
    },
    addProperty_: function addProperty_(name, syntax) {
      this.properties[name] = this.createDescriptor(syntax, 'Property', name);
    },
    addType_: function addType_(name, syntax) {
      this.types[name] = this.createDescriptor(syntax, 'Type', name);

      if (syntax === generic['-ms-legacy-expression']) {
        this.valueCommonSyntax = cssWideKeywordsWithExpression;
      }
    },
    matchAtrulePrelude: function matchAtrulePrelude(atruleName, prelude) {
      var atrule = names.keyword(atruleName);
      var atrulePreludeSyntax = atrule.vendor ? this.getAtrulePrelude(atrule.name) || this.getAtrulePrelude(atrule.basename) : this.getAtrulePrelude(atrule.name);

      if (!atrulePreludeSyntax) {
        if (atrule.basename in this.atrules) {
          return buildMatchResult(null, new Error('At-rule `' + atruleName + '` should not contain a prelude'));
        }

        return buildMatchResult(null, new SyntaxReferenceError$1('Unknown at-rule', atruleName));
      }

      return matchSyntax(this, atrulePreludeSyntax, prelude, true);
    },
    matchAtruleDescriptor: function matchAtruleDescriptor(atruleName, descriptorName, value) {
      var atrule = names.keyword(atruleName);
      var descriptor = names.keyword(descriptorName);
      var atruleEntry = atrule.vendor ? this.atrules[atrule.name] || this.atrules[atrule.basename] : this.atrules[atrule.name];

      if (!atruleEntry) {
        return buildMatchResult(null, new SyntaxReferenceError$1('Unknown at-rule', atruleName));
      }

      if (!atruleEntry.descriptors) {
        return buildMatchResult(null, new Error('At-rule `' + atruleName + '` has no known descriptors'));
      }

      var atruleDescriptorSyntax = descriptor.vendor ? atruleEntry.descriptors[descriptor.name] || atruleEntry.descriptors[descriptor.basename] : atruleEntry.descriptors[descriptor.name];

      if (!atruleDescriptorSyntax) {
        return buildMatchResult(null, new SyntaxReferenceError$1('Unknown at-rule descriptor', descriptorName));
      }

      return matchSyntax(this, atruleDescriptorSyntax, value, true);
    },
    matchDeclaration: function matchDeclaration(node) {
      if (node.type !== 'Declaration') {
        return buildMatchResult(null, new Error('Not a Declaration node'));
      }

      return this.matchProperty(node.property, node.value);
    },
    matchProperty: function matchProperty(propertyName, value) {
      var property = names.property(propertyName); // don't match syntax for a custom property

      if (property.custom) {
        return buildMatchResult(null, new Error('Lexer matching doesn\'t applicable for custom properties'));
      }

      var propertySyntax = property.vendor ? this.getProperty(property.name) || this.getProperty(property.basename) : this.getProperty(property.name);

      if (!propertySyntax) {
        return buildMatchResult(null, new SyntaxReferenceError$1('Unknown property', propertyName));
      }

      return matchSyntax(this, propertySyntax, value, true);
    },
    matchType: function matchType(typeName, value) {
      var typeSyntax = this.getType(typeName);

      if (!typeSyntax) {
        return buildMatchResult(null, new SyntaxReferenceError$1('Unknown type', typeName));
      }

      return matchSyntax(this, typeSyntax, value, false);
    },
    match: function match(syntax, value) {
      if (typeof syntax !== 'string' && (!syntax || !syntax.type)) {
        return buildMatchResult(null, new SyntaxReferenceError$1('Bad syntax'));
      }

      if (typeof syntax === 'string' || !syntax.match) {
        syntax = this.createDescriptor(syntax, 'Type', 'anonymous');
      }

      return matchSyntax(this, syntax, value, false);
    },
    findValueFragments: function findValueFragments(propertyName, value, type, name) {
      return search.matchFragments(this, value, this.matchProperty(propertyName, value), type, name);
    },
    findDeclarationValueFragments: function findDeclarationValueFragments(declaration, type, name) {
      return search.matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name);
    },
    findAllFragments: function findAllFragments(ast, type, name) {
      var result = [];
      this.syntax.walk(ast, {
        visit: 'Declaration',
        enter: function (declaration) {
          result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name));
        }.bind(this)
      });
      return result;
    },
    getAtrulePrelude: function getAtrulePrelude(atruleName) {
      return this.atrules.hasOwnProperty(atruleName) ? this.atrules[atruleName].prelude : null;
    },
    getAtruleDescriptor: function getAtruleDescriptor(atruleName, name) {
      return this.atrules.hasOwnProperty(atruleName) && this.atrules.declarators ? this.atrules[atruleName].declarators[name] || null : null;
    },
    getProperty: function getProperty(name) {
      return this.properties.hasOwnProperty(name) ? this.properties[name] : null;
    },
    getType: function getType(name) {
      return this.types.hasOwnProperty(name) ? this.types[name] : null;
    },
    validate: function validate() {
      function validate(syntax, name, broken, descriptor) {
        if (broken.hasOwnProperty(name)) {
          return broken[name];
        }

        broken[name] = false;

        if (descriptor.syntax !== null) {
          walk(descriptor.syntax, function (node) {
            if (node.type !== 'Type' && node.type !== 'Property') {
              return;
            }

            var map = node.type === 'Type' ? syntax.types : syntax.properties;
            var brokenMap = node.type === 'Type' ? brokenTypes : brokenProperties;

            if (!map.hasOwnProperty(node.name) || validate(syntax, node.name, brokenMap, map[node.name])) {
              broken[name] = true;
            }
          }, this);
        }
      }

      var brokenTypes = {};
      var brokenProperties = {};

      for (var key in this.types) {
        validate(this, key, brokenTypes, this.types[key]);
      }

      for (var key in this.properties) {
        validate(this, key, brokenProperties, this.properties[key]);
      }

      brokenTypes = Object.keys(brokenTypes).filter(function (name) {
        return brokenTypes[name];
      });
      brokenProperties = Object.keys(brokenProperties).filter(function (name) {
        return brokenProperties[name];
      });

      if (brokenTypes.length || brokenProperties.length) {
        return {
          types: brokenTypes,
          properties: brokenProperties
        };
      }

      return null;
    },
    dump: function dump(syntaxAsAst, pretty) {
      return {
        generic: this.generic,
        types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
        properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst)
      };
    },
    toString: function toString() {
      return JSON.stringify(this.dump());
    }
  };
  var Lexer_1 = Lexer;

  var definitionSyntax = {
    SyntaxError: _SyntaxError$1,
    parse: parse_1,
    generate: generate_1,
    walk: walk
  };

  var isBOM$2 = tokenizer.isBOM;
  var N$3 = 10;
  var F$2 = 12;
  var R$2 = 13;

  function computeLinesAndColumns(host, source) {
    var sourceLength = source.length;
    var lines = adoptBuffer(host.lines, sourceLength); // +1

    var line = host.startLine;
    var columns = adoptBuffer(host.columns, sourceLength);
    var column = host.startColumn;
    var startOffset = source.length > 0 ? isBOM$2(source.charCodeAt(0)) : 0;

    for (var i = startOffset; i < sourceLength; i++) {
      // -1
      var code = source.charCodeAt(i);
      lines[i] = line;
      columns[i] = column++;

      if (code === N$3 || code === R$2 || code === F$2) {
        if (code === R$2 && i + 1 < sourceLength && source.charCodeAt(i + 1) === N$3) {
          i++;
          lines[i] = line;
          columns[i] = column;
        }

        line++;
        column = 1;
      }
    }

    lines[i] = line;
    columns[i] = column;
    host.lines = lines;
    host.columns = columns;
  }

  var OffsetToLocation = function OffsetToLocation() {
    this.lines = null;
    this.columns = null;
    this.linesAndColumnsComputed = false;
  };

  OffsetToLocation.prototype = {
    setSource: function setSource(source, startOffset, startLine, startColumn) {
      this.source = source;
      this.startOffset = typeof startOffset === 'undefined' ? 0 : startOffset;
      this.startLine = typeof startLine === 'undefined' ? 1 : startLine;
      this.startColumn = typeof startColumn === 'undefined' ? 1 : startColumn;
      this.linesAndColumnsComputed = false;
    },
    ensureLinesAndColumnsComputed: function ensureLinesAndColumnsComputed() {
      if (!this.linesAndColumnsComputed) {
        computeLinesAndColumns(this, this.source);
        this.linesAndColumnsComputed = true;
      }
    },
    getLocation: function getLocation(offset, filename) {
      this.ensureLinesAndColumnsComputed();
      return {
        source: filename,
        offset: this.startOffset + offset,
        line: this.lines[offset],
        column: this.columns[offset]
      };
    },
    getLocationRange: function getLocationRange(start, end, filename) {
      this.ensureLinesAndColumnsComputed();
      return {
        source: filename,
        start: {
          offset: this.startOffset + start,
          line: this.lines[start],
          column: this.columns[start]
        },
        end: {
          offset: this.startOffset + end,
          line: this.lines[end],
          column: this.columns[end]
        }
      };
    }
  };
  var OffsetToLocation_1 = OffsetToLocation;

  var TYPE$7 = tokenizer.TYPE;
  var WHITESPACE$2 = TYPE$7.WhiteSpace;
  var COMMENT$2 = TYPE$7.Comment;

  var sequence = function readSequence(recognizer) {
    var children = this.createList();
    var child = null;
    var context = {
      recognizer: recognizer,
      space: null,
      ignoreWS: false,
      ignoreWSAfter: false
    };
    this.scanner.skipSC();

    while (!this.scanner.eof) {
      switch (this.scanner.tokenType) {
        case COMMENT$2:
          this.scanner.next();
          continue;

        case WHITESPACE$2:
          if (context.ignoreWS) {
            this.scanner.next();
          } else {
            context.space = this.WhiteSpace();
          }

          continue;
      }

      child = recognizer.getNode.call(this, context);

      if (child === undefined) {
        break;
      }

      if (context.space !== null) {
        children.push(context.space);
        context.space = null;
      }

      children.push(child);

      if (context.ignoreWSAfter) {
        context.ignoreWSAfter = false;
        context.ignoreWS = true;
      } else {
        context.ignoreWS = false;
      }
    }

    return children;
  };

  var findWhiteSpaceStart$1 = utils.findWhiteSpaceStart;

  var noop$2 = function noop() {};

  var TYPE$8 = _const.TYPE;
  var NAME$4 = _const.NAME;
  var WHITESPACE$3 = TYPE$8.WhiteSpace;
  var IDENT$2 = TYPE$8.Ident;
  var FUNCTION = TYPE$8.Function;
  var URL$1 = TYPE$8.Url;
  var HASH = TYPE$8.Hash;
  var PERCENTAGE = TYPE$8.Percentage;
  var NUMBER$3 = TYPE$8.Number;
  var NUMBERSIGN$1 = 0x0023; // U+0023 NUMBER SIGN (#)

  var NULL = 0;

  function createParseContext(name) {
    return function () {
      return this[name]();
    };
  }

  function processConfig(config) {
    var parserConfig = {
      context: {},
      scope: {},
      atrule: {},
      pseudo: {}
    };

    if (config.parseContext) {
      for (var name in config.parseContext) {
        switch (_typeof(config.parseContext[name])) {
          case 'function':
            parserConfig.context[name] = config.parseContext[name];
            break;

          case 'string':
            parserConfig.context[name] = createParseContext(config.parseContext[name]);
            break;
        }
      }
    }

    if (config.scope) {
      for (var name in config.scope) {
        parserConfig.scope[name] = config.scope[name];
      }
    }

    if (config.atrule) {
      for (var name in config.atrule) {
        var atrule = config.atrule[name];

        if (atrule.parse) {
          parserConfig.atrule[name] = atrule.parse;
        }
      }
    }

    if (config.pseudo) {
      for (var name in config.pseudo) {
        var pseudo = config.pseudo[name];

        if (pseudo.parse) {
          parserConfig.pseudo[name] = pseudo.parse;
        }
      }
    }

    if (config.node) {
      for (var name in config.node) {
        parserConfig[name] = config.node[name].parse;
      }
    }

    return parserConfig;
  }

  var create = function createParser(config) {
    var parser = {
      scanner: new TokenStream_1(),
      locationMap: new OffsetToLocation_1(),
      filename: '<unknown>',
      needPositions: false,
      onParseError: noop$2,
      onParseErrorThrow: false,
      parseAtrulePrelude: true,
      parseRulePrelude: true,
      parseValue: true,
      parseCustomProperty: false,
      readSequence: sequence,
      createList: function createList() {
        return new List_1();
      },
      createSingleNodeList: function createSingleNodeList(node) {
        return new List_1().appendData(node);
      },
      getFirstListNode: function getFirstListNode(list) {
        return list && list.first();
      },
      getLastListNode: function getLastListNode(list) {
        return list.last();
      },
      parseWithFallback: function parseWithFallback(consumer, fallback) {
        var startToken = this.scanner.tokenIndex;

        try {
          return consumer.call(this);
        } catch (e) {
          if (this.onParseErrorThrow) {
            throw e;
          }

          var fallbackNode = fallback.call(this, startToken);
          this.onParseErrorThrow = true;
          this.onParseError(e, fallbackNode);
          this.onParseErrorThrow = false;
          return fallbackNode;
        }
      },
      lookupNonWSType: function lookupNonWSType(offset) {
        do {
          var type = this.scanner.lookupType(offset++);

          if (type !== WHITESPACE$3) {
            return type;
          }
        } while (type !== NULL);

        return NULL;
      },
      eat: function eat(tokenType) {
        if (this.scanner.tokenType !== tokenType) {
          var offset = this.scanner.tokenStart;
          var message = NAME$4[tokenType] + ' is expected'; // tweak message and offset

          switch (tokenType) {
            case IDENT$2:
              // when identifier is expected but there is a function or url
              if (this.scanner.tokenType === FUNCTION || this.scanner.tokenType === URL$1) {
                offset = this.scanner.tokenEnd - 1;
                message = 'Identifier is expected but function found';
              } else {
                message = 'Identifier is expected';
              }

              break;

            case HASH:
              if (this.scanner.isDelim(NUMBERSIGN$1)) {
                this.scanner.next();
                offset++;
                message = 'Name is expected';
              }

              break;

            case PERCENTAGE:
              if (this.scanner.tokenType === NUMBER$3) {
                offset = this.scanner.tokenEnd;
                message = 'Percent sign is expected';
              }

              break;

            default:
              // when test type is part of another token show error for current position + 1
              // e.g. eat(HYPHENMINUS) will fail on "-foo", but pointing on "-" is odd
              if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === tokenType) {
                offset = offset + 1;
              }

          }

          this.error(message, offset);
        }

        this.scanner.next();
      },
      consume: function consume(tokenType) {
        var value = this.scanner.getTokenValue();
        this.eat(tokenType);
        return value;
      },
      consumeFunctionName: function consumeFunctionName() {
        var name = this.scanner.source.substring(this.scanner.tokenStart, this.scanner.tokenEnd - 1);
        this.eat(FUNCTION);
        return name;
      },
      getLocation: function getLocation(start, end) {
        if (this.needPositions) {
          return this.locationMap.getLocationRange(start, end, this.filename);
        }

        return null;
      },
      getLocationFromList: function getLocationFromList(list) {
        if (this.needPositions) {
          var head = this.getFirstListNode(list);
          var tail = this.getLastListNode(list);
          return this.locationMap.getLocationRange(head !== null ? head.loc.start.offset - this.locationMap.startOffset : this.scanner.tokenStart, tail !== null ? tail.loc.end.offset - this.locationMap.startOffset : this.scanner.tokenStart, this.filename);
        }

        return null;
      },
      error: function error(message, offset) {
        var location = typeof offset !== 'undefined' && offset < this.scanner.source.length ? this.locationMap.getLocation(offset) : this.scanner.eof ? this.locationMap.getLocation(findWhiteSpaceStart$1(this.scanner.source, this.scanner.source.length - 1)) : this.locationMap.getLocation(this.scanner.tokenStart);
        throw new _SyntaxError(message || 'Unexpected input', this.scanner.source, location.offset, location.line, location.column);
      }
    };
    config = processConfig(config || {});

    for (var key in config) {
      parser[key] = config[key];
    }

    return function (source, options) {
      options = options || {};
      var context = options.context || 'default';
      var ast;
      tokenizer(source, parser.scanner);
      parser.locationMap.setSource(source, options.offset, options.line, options.column);
      parser.filename = options.filename || '<unknown>';
      parser.needPositions = Boolean(options.positions);
      parser.onParseError = typeof options.onParseError === 'function' ? options.onParseError : noop$2;
      parser.onParseErrorThrow = false;
      parser.parseAtrulePrelude = 'parseAtrulePrelude' in options ? Boolean(options.parseAtrulePrelude) : true;
      parser.parseRulePrelude = 'parseRulePrelude' in options ? Boolean(options.parseRulePrelude) : true;
      parser.parseValue = 'parseValue' in options ? Boolean(options.parseValue) : true;
      parser.parseCustomProperty = 'parseCustomProperty' in options ? Boolean(options.parseCustomProperty) : false;

      if (!parser.context.hasOwnProperty(context)) {
        throw new Error('Unknown context `' + context + '`');
      }

      ast = parser.context[context].call(parser, options);

      if (!parser.scanner.eof) {
        parser.error();
      }

      return ast;
    };
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */
  var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */

  var encode$1 = function encode(number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }

    throw new TypeError("Must be between 0 and 63: " + number);
  };
  /**
   * Decode a single base 64 character code digit to an integer. Returns -1 on
   * failure.
   */


  var decode$1 = function decode(charCode) {
    var bigA = 65; // 'A'

    var bigZ = 90; // 'Z'

    var littleA = 97; // 'a'

    var littleZ = 122; // 'z'

    var zero = 48; // '0'

    var nine = 57; // '9'

    var plus = 43; // '+'

    var slash = 47; // '/'

    var littleOffset = 26;
    var numberOffset = 52; // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ

    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    } // 26 - 51: abcdefghijklmnopqrstuvwxyz


    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    } // 52 - 61: 0123456789


    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    } // 62: +


    if (charCode == plus) {
      return 62;
    } // 63: /


    if (charCode == slash) {
      return 63;
    } // Invalid base64 digit.


    return -1;
  };

  var base64 = {
    encode: encode$1,
    decode: decode$1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   *
   * Based on the Base 64 VLQ implementation in Closure Compiler:
   * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
   *
   * Copyright 2011 The Closure Compiler Authors. All rights reserved.
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are
   * met:
   *
   *  * Redistributions of source code must retain the above copyright
   *    notice, this list of conditions and the following disclaimer.
   *  * Redistributions in binary form must reproduce the above
   *    copyright notice, this list of conditions and the following
   *    disclaimer in the documentation and/or other materials provided
   *    with the distribution.
   *  * Neither the name of Google Inc. nor the names of its
   *    contributors may be used to endorse or promote products derived
   *    from this software without specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
   * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
   * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
   * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
   * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5; // binary: 100000

  var VLQ_BASE = 1 << VLQ_BASE_SHIFT; // binary: 011111

  var VLQ_BASE_MASK = VLQ_BASE - 1; // binary: 100000

  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  /**
   * Converts from a two-complement value to a value where the sign bit is
   * placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */

  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  /**
   * Converts to a two-complement value from a value where the sign bit is
   * placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */


  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  /**
   * Returns the base 64 VLQ encoded value.
   */


  var encode$2 = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;

      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
      }

      encoded += base64.encode(digit);
    } while (vlq > 0);

    return encoded;
  };
  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string via the out parameter.
   */


  var decode$2 = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }

      digit = base64.decode(aStr.charCodeAt(aIndex++));

      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }

      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);

    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };

  var base64Vlq = {
    encode: encode$2,
    decode: decode$2
  };

  var util = createCommonjsModule(function (module, exports) {
    /* -*- Mode: js; js-indent-level: 2; -*- */

    /*
     * Copyright 2011 Mozilla Foundation and contributors
     * Licensed under the New BSD license. See LICENSE or:
     * http://opensource.org/licenses/BSD-3-Clause
     */

    /**
     * This is a helper function for getting values from parameter/options
     * objects.
     *
     * @param args The object we are extracting values from
     * @param name The name of the property we are getting.
     * @param defaultValue An optional value to return if the property is missing
     * from the object. If this is not specified and the property is missing, an
     * error will be thrown.
     */
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      } else {
        throw new Error('"' + aName + '" is a required argument.');
      }
    }

    exports.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;

    function urlParse(aUrl) {
      var match = aUrl.match(urlRegexp);

      if (!match) {
        return null;
      }

      return {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      };
    }

    exports.urlParse = urlParse;

    function urlGenerate(aParsedUrl) {
      var url = '';

      if (aParsedUrl.scheme) {
        url += aParsedUrl.scheme + ':';
      }

      url += '//';

      if (aParsedUrl.auth) {
        url += aParsedUrl.auth + '@';
      }

      if (aParsedUrl.host) {
        url += aParsedUrl.host;
      }

      if (aParsedUrl.port) {
        url += ":" + aParsedUrl.port;
      }

      if (aParsedUrl.path) {
        url += aParsedUrl.path;
      }

      return url;
    }

    exports.urlGenerate = urlGenerate;
    /**
     * Normalizes a path, or the path portion of a URL:
     *
     * - Replaces consecutive slashes with one slash.
     * - Removes unnecessary '.' parts.
     * - Removes unnecessary '<dir>/..' parts.
     *
     * Based on code in the Node.js 'path' core module.
     *
     * @param aPath The path or url to normalize.
     */

    function normalize(aPath) {
      var path = aPath;
      var url = urlParse(aPath);

      if (url) {
        if (!url.path) {
          return aPath;
        }

        path = url.path;
      }

      var isAbsolute = exports.isAbsolute(path);
      var parts = path.split(/\/+/);

      for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
        part = parts[i];

        if (part === '.') {
          parts.splice(i, 1);
        } else if (part === '..') {
          up++;
        } else if (up > 0) {
          if (part === '') {
            // The first part is blank if the path is absolute. Trying to go
            // above the root is a no-op. Therefore we can remove all '..' parts
            // directly after the root.
            parts.splice(i + 1, up);
            up = 0;
          } else {
            parts.splice(i, 2);
            up--;
          }
        }
      }

      path = parts.join('/');

      if (path === '') {
        path = isAbsolute ? '/' : '.';
      }

      if (url) {
        url.path = path;
        return urlGenerate(url);
      }

      return path;
    }

    exports.normalize = normalize;
    /**
     * Joins two paths/URLs.
     *
     * @param aRoot The root path or URL.
     * @param aPath The path or URL to be joined with the root.
     *
     * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
     *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
     *   first.
     * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
     *   is updated with the result and aRoot is returned. Otherwise the result
     *   is returned.
     *   - If aPath is absolute, the result is aPath.
     *   - Otherwise the two paths are joined with a slash.
     * - Joining for example 'http://' and 'www.example.com' is also supported.
     */

    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }

      if (aPath === "") {
        aPath = ".";
      }

      var aPathUrl = urlParse(aPath);
      var aRootUrl = urlParse(aRoot);

      if (aRootUrl) {
        aRoot = aRootUrl.path || '/';
      } // `join(foo, '//www.example.org')`


      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }

        return urlGenerate(aPathUrl);
      }

      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      } // `join('http://', 'www.example.com')`


      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }

      var joined = aPath.charAt(0) === '/' ? aPath : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }

      return joined;
    }

    exports.join = join;

    exports.isAbsolute = function (aPath) {
      return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
    };
    /**
     * Make a path relative to a URL or another path.
     *
     * @param aRoot The root path or URL.
     * @param aPath The path or URL to be made relative to aRoot.
     */


    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }

      aRoot = aRoot.replace(/\/$/, ''); // It is possible for the path to be above the root. In this case, simply
      // checking whether the root is a prefix of the path won't work. Instead, we
      // need to remove components from the root one by one, until either we find
      // a prefix that fits, or we run out of components to remove.

      var level = 0;

      while (aPath.indexOf(aRoot + '/') !== 0) {
        var index = aRoot.lastIndexOf("/");

        if (index < 0) {
          return aPath;
        } // If the only part of the root that is left is the scheme (i.e. http://,
        // file:///, etc.), one or more slashes (/), or simply nothing at all, we
        // have exhausted all components, so the path is not relative to the root.


        aRoot = aRoot.slice(0, index);

        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }

        ++level;
      } // Make sure we add a "../" for each component we removed from the root.


      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }

    exports.relative = relative;

    var supportsNullProto = function () {
      var obj = Object.create(null);
      return !('__proto__' in obj);
    }();

    function identity(s) {
      return s;
    }
    /**
     * Because behavior goes wacky when you set `__proto__` on objects, we
     * have to prefix all the strings in our set with an arbitrary character.
     *
     * See https://github.com/mozilla/source-map/pull/31 and
     * https://github.com/mozilla/source-map/issues/30
     *
     * @param String aStr
     */


    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return '$' + aStr;
      }

      return aStr;
    }

    exports.toSetString = supportsNullProto ? identity : toSetString;

    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }

      return aStr;
    }

    exports.fromSetString = supportsNullProto ? identity : fromSetString;

    function isProtoString(s) {
      if (!s) {
        return false;
      }

      var length = s.length;

      if (length < 9
      /* "__proto__".length */
      ) {
          return false;
        }

      if (s.charCodeAt(length - 1) !== 95
      /* '_' */
      || s.charCodeAt(length - 2) !== 95
      /* '_' */
      || s.charCodeAt(length - 3) !== 111
      /* 'o' */
      || s.charCodeAt(length - 4) !== 116
      /* 't' */
      || s.charCodeAt(length - 5) !== 111
      /* 'o' */
      || s.charCodeAt(length - 6) !== 114
      /* 'r' */
      || s.charCodeAt(length - 7) !== 112
      /* 'p' */
      || s.charCodeAt(length - 8) !== 95
      /* '_' */
      || s.charCodeAt(length - 9) !== 95
      /* '_' */
      ) {
          return false;
        }

      for (var i = length - 10; i >= 0; i--) {
        if (s.charCodeAt(i) !== 36
        /* '$' */
        ) {
            return false;
          }
      }

      return true;
    }
    /**
     * Comparator between two mappings where the original positions are compared.
     *
     * Optionally pass in `true` as `onlyCompareGenerated` to consider two
     * mappings with the same original source/line/column, but different generated
     * line and column the same. Useful when searching for a mapping with a
     * stubbed out mapping.
     */


    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = strcmp(mappingA.source, mappingB.source);

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.originalLine - mappingB.originalLine;

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.originalColumn - mappingB.originalColumn;

      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }

      cmp = mappingA.generatedColumn - mappingB.generatedColumn;

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.generatedLine - mappingB.generatedLine;

      if (cmp !== 0) {
        return cmp;
      }

      return strcmp(mappingA.name, mappingB.name);
    }

    exports.compareByOriginalPositions = compareByOriginalPositions;
    /**
     * Comparator between two mappings with deflated source and name indices where
     * the generated positions are compared.
     *
     * Optionally pass in `true` as `onlyCompareGenerated` to consider two
     * mappings with the same generated line and column, but different
     * source/name/original line and column the same. Useful when searching for a
     * mapping with a stubbed out mapping.
     */

    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.generatedColumn - mappingB.generatedColumn;

      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }

      cmp = strcmp(mappingA.source, mappingB.source);

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.originalLine - mappingB.originalLine;

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.originalColumn - mappingB.originalColumn;

      if (cmp !== 0) {
        return cmp;
      }

      return strcmp(mappingA.name, mappingB.name);
    }

    exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }

      if (aStr1 === null) {
        return 1; // aStr2 !== null
      }

      if (aStr2 === null) {
        return -1; // aStr1 !== null
      }

      if (aStr1 > aStr2) {
        return 1;
      }

      return -1;
    }
    /**
     * Comparator between two mappings with inflated source and name strings where
     * the generated positions are compared.
     */


    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.generatedColumn - mappingB.generatedColumn;

      if (cmp !== 0) {
        return cmp;
      }

      cmp = strcmp(mappingA.source, mappingB.source);

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.originalLine - mappingB.originalLine;

      if (cmp !== 0) {
        return cmp;
      }

      cmp = mappingA.originalColumn - mappingB.originalColumn;

      if (cmp !== 0) {
        return cmp;
      }

      return strcmp(mappingA.name, mappingB.name);
    }

    exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    /**
     * Strip any JSON XSSI avoidance prefix from the string (as documented
     * in the source maps specification), and then parse the string as
     * JSON.
     */

    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
    }

    exports.parseSourceMapInput = parseSourceMapInput;
    /**
     * Compute the URL of a source given the the source root, the source's
     * URL, and the source map's URL.
     */

    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      sourceURL = sourceURL || '';

      if (sourceRoot) {
        // This follows what Chrome does.
        if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
          sourceRoot += '/';
        } // The spec says:
        //   Line 4: An optional source root, useful for relocating source
        //   files on a server or removing repeated values in the
        //   “sources” entry.  This value is prepended to the individual
        //   entries in the “source” field.


        sourceURL = sourceRoot + sourceURL;
      } // Historically, SourceMapConsumer did not take the sourceMapURL as
      // a parameter.  This mode is still somewhat supported, which is why
      // this code block is conditional.  However, it's preferable to pass
      // the source map URL to SourceMapConsumer, so that this function
      // can implement the source URL resolution algorithm as outlined in
      // the spec.  This block is basically the equivalent of:
      //    new URL(sourceURL, sourceMapURL).toString()
      // ... except it avoids using URL, which wasn't available in the
      // older releases of node still supported by this library.
      //
      // The spec says:
      //   If the sources are not absolute URLs after prepending of the
      //   “sourceRoot”, the sources are resolved relative to the
      //   SourceMap (like resolving script src in a html document).


      if (sourceMapURL) {
        var parsed = urlParse(sourceMapURL);

        if (!parsed) {
          throw new Error("sourceMapURL could not be parsed");
        }

        if (parsed.path) {
          // Strip the last path component, but keep the "/".
          var index = parsed.path.lastIndexOf('/');

          if (index >= 0) {
            parsed.path = parsed.path.substring(0, index + 1);
          }
        }

        sourceURL = join(urlGenerate(parsed), sourceURL);
      }

      return normalize(sourceURL);
    }

    exports.computeSourceURL = computeSourceURL;
  });
  var util_1 = util.getArg;
  var util_2 = util.urlParse;
  var util_3 = util.urlGenerate;
  var util_4 = util.normalize;
  var util_5 = util.join;
  var util_6 = util.isAbsolute;
  var util_7 = util.relative;
  var util_8 = util.toSetString;
  var util_9 = util.fromSetString;
  var util_10 = util.compareByOriginalPositions;
  var util_11 = util.compareByGeneratedPositionsDeflated;
  var util_12 = util.compareByGeneratedPositionsInflated;
  var util_13 = util.parseSourceMapInput;
  var util_14 = util.computeSourceURL;

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  var has$2 = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */

  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? new Map() : Object.create(null);
  }
  /**
   * Static method for creating ArraySet instances from an existing array.
   */


  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();

    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }

    return set;
  };
  /**
   * Return how many unique items are in this ArraySet. If duplicates have been
   * added, than those do not count towards the size.
   *
   * @returns Number
   */


  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */


  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has$2.call(this._set, sStr);
    var idx = this._array.length;

    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }

    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */


  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util.toSetString(aStr);
      return has$2.call(this._set, sStr);
    }
  };
  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */


  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);

      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util.toSetString(aStr);

      if (has$2.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }

    throw new Error('"' + aStr + '" is not in the set.');
  };
  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */


  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }

    throw new Error('No element indexed by ' + aIdx);
  };
  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */


  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };

  var ArraySet_1 = ArraySet;
  var arraySet = {
    ArraySet: ArraySet_1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2014 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  /**
   * Determine whether mappingB is after mappingA with respect to generated
   * position.
   */

  function generatedPositionAfter(mappingA, mappingB) {
    // Optimized for most common case
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  /**
   * A data structure to provide a sorted view of accumulated mappings in a
   * performance conscious manner. It trades a neglibable overhead in general
   * case for a large speedup in case of mappings being added in order.
   */


  function MappingList() {
    this._array = [];
    this._sorted = true; // Serves as infimum

    this._last = {
      generatedLine: -1,
      generatedColumn: 0
    };
  }
  /**
   * Iterate through internal items. This method takes the same arguments that
   * `Array.prototype.forEach` takes.
   *
   * NOTE: The order of the mappings is NOT guaranteed.
   */


  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  /**
   * Add the given source mapping.
   *
   * @param Object aMapping
   */


  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;

      this._array.push(aMapping);
    } else {
      this._sorted = false;

      this._array.push(aMapping);
    }
  };
  /**
   * Returns the flat, sorted array of mappings. The mappings are sorted by
   * generated position.
   *
   * WARNING: This method returns internal data without copying, for
   * performance. The return value must NOT be mutated, and should be treated as
   * an immutable borrow. If you want to take ownership, you must make your own
   * copy.
   */


  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);

      this._sorted = true;
    }

    return this._array;
  };

  var MappingList_1 = MappingList;
  var mappingList = {
    MappingList: MappingList_1
  };

  /* -*- Mode: js; js-indent-level: 2; -*- */

  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  var ArraySet$1 = arraySet.ArraySet;
  var MappingList$1 = mappingList.MappingList;
  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. You may pass an object with the following
   * properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: A root for all relative URLs in this source map.
   */

  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }

    this._file = util.getArg(aArgs, 'file', null);
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
    this._sources = new ArraySet$1();
    this._names = new ArraySet$1();
    this._mappings = new MappingList$1();
    this._sourcesContents = null;
  }

  SourceMapGenerator.prototype._version = 3;
  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */

  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;

        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;

      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);

      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };
  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */


  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);

      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);

      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };
  /**
   * Set the source content for a source file.
   */


  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;

    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }

      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];

      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   * @param aSourceMapPath Optional. The dirname of the path to the source map
   *        to be applied. If relative, it is relative to the SourceMapConsumer.
   *        This parameter is needed when the two source maps aren't in the same
   *        directory, and the source map to be applied contains relative source
   *        paths. If so, those relative source paths need to be rewritten
   *        relative to the SourceMapGenerator.
   */


  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile; // If aSourceFile is omitted, we will use the file property of the SourceMap

    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' + 'or the source map\'s "file" property. Both were omitted.');
      }

      sourceFile = aSourceMapConsumer.file;
    }

    var sourceRoot = this._sourceRoot; // Make "sourceFile" relative if an absolute Url is passed.

    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    } // Applying the SourceMap can add and remove items from the sources and
    // the names array.


    var newSources = new ArraySet$1();
    var newNames = new ArraySet$1(); // Find mappings for the "sourceFile"

    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });

        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;

          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source);
          }

          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }

          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;

          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;

      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;

      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }
    }, this);

    this._sources = newSources;
    this._names = newNames; // Copy sourcesContents of applied map.

    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);

      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }

        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }

        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };
  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */


  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
      throw new Error('original.line and original.column are not numbers -- you probably meant to omit ' + 'the original mapping entirely and only map the generated position. If so, pass ' + 'null for the original mapping instead of an object with empty or null values.');
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    } else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated && aOriginal && 'line' in aOriginal && 'column' in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      // Cases 2 and 3.
      return;
    } else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };
  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */


  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();

    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = '';

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;

        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }

          next += ',';
        }
      }

      next += base64Vlq.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64Vlq.encode(sourceIdx - previousSource);
        previousSource = sourceIdx; // lines are stored 0-based in SourceMap spec version 3

        next += base64Vlq.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64Vlq.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64Vlq.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }

      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }

      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
    }, this);
  };
  /**
   * Externalize the source map.
   */


  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };

    if (this._file != null) {
      map.file = this._file;
    }

    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }

    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };
  /**
   * Render the source map being generated to a string.
   */


  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

  var SourceMapGenerator_1 = SourceMapGenerator;
  var sourceMapGenerator = {
    SourceMapGenerator: SourceMapGenerator_1
  };

  var SourceMapGenerator$1 = sourceMapGenerator.SourceMapGenerator;
  var trackNodes = {
    Atrule: true,
    Selector: true,
    Declaration: true
  };

  var sourceMap = function generateSourceMap(handlers) {
    var map = new SourceMapGenerator$1();
    var line = 1;
    var column = 0;
    var generated = {
      line: 1,
      column: 0
    };
    var original = {
      line: 0,
      // should be zero to add first mapping
      column: 0
    };
    var sourceMappingActive = false;
    var activatedGenerated = {
      line: 1,
      column: 0
    };
    var activatedMapping = {
      generated: activatedGenerated
    };
    var handlersNode = handlers.node;

    handlers.node = function (node) {
      if (node.loc && node.loc.start && trackNodes.hasOwnProperty(node.type)) {
        var nodeLine = node.loc.start.line;
        var nodeColumn = node.loc.start.column - 1;

        if (original.line !== nodeLine || original.column !== nodeColumn) {
          original.line = nodeLine;
          original.column = nodeColumn;
          generated.line = line;
          generated.column = column;

          if (sourceMappingActive) {
            sourceMappingActive = false;

            if (generated.line !== activatedGenerated.line || generated.column !== activatedGenerated.column) {
              map.addMapping(activatedMapping);
            }
          }

          sourceMappingActive = true;
          map.addMapping({
            source: node.loc.source,
            original: original,
            generated: generated
          });
        }
      }

      handlersNode.call(this, node);

      if (sourceMappingActive && trackNodes.hasOwnProperty(node.type)) {
        activatedGenerated.line = line;
        activatedGenerated.column = column;
      }
    };

    var handlersChunk = handlers.chunk;

    handlers.chunk = function (chunk) {
      for (var i = 0; i < chunk.length; i++) {
        if (chunk.charCodeAt(i) === 10) {
          // \n
          line++;
          column = 0;
        } else {
          column++;
        }
      }

      handlersChunk(chunk);
    };

    var handlersResult = handlers.result;

    handlers.result = function () {
      if (sourceMappingActive) {
        map.addMapping(activatedMapping);
      }

      return {
        css: handlersResult(),
        map: map
      };
    };

    return handlers;
  };

  var hasOwnProperty$4 = Object.prototype.hasOwnProperty;

  function processChildren(node, delimeter) {
    var list = node.children;
    var prev = null;

    if (typeof delimeter !== 'function') {
      list.forEach(this.node, this);
    } else {
      list.forEach(function (node) {
        if (prev !== null) {
          delimeter.call(this, prev);
        }

        this.node(node);
        prev = node;
      }, this);
    }
  }

  var create$1 = function createGenerator(config) {
    function processNode(node) {
      if (hasOwnProperty$4.call(types, node.type)) {
        types[node.type].call(this, node);
      } else {
        throw new Error('Unknown node type: ' + node.type);
      }
    }

    var types = {};

    if (config.node) {
      for (var name in config.node) {
        types[name] = config.node[name].generate;
      }
    }

    return function (node, options) {
      var buffer = '';
      var handlers = {
        children: processChildren,
        node: processNode,
        chunk: function chunk(_chunk) {
          buffer += _chunk;
        },
        result: function result() {
          return buffer;
        }
      };

      if (options) {
        if (typeof options.decorator === 'function') {
          handlers = options.decorator(handlers);
        }

        if (options.sourceMap) {
          handlers = sourceMap(handlers);
        }
      }

      handlers.node(node);
      return handlers.result();
    };
  };

  var create$2 = function createConvertors(walk) {
    return {
      fromPlainObject: function fromPlainObject(ast) {
        walk(ast, {
          enter: function enter(node) {
            if (node.children && node.children instanceof List_1 === false) {
              node.children = new List_1().fromArray(node.children);
            }
          }
        });
        return ast;
      },
      toPlainObject: function toPlainObject(ast) {
        walk(ast, {
          leave: function leave(node) {
            if (node.children && node.children instanceof List_1) {
              node.children = node.children.toArray();
            }
          }
        });
        return ast;
      }
    };
  };

  var hasOwnProperty$5 = Object.prototype.hasOwnProperty;

  var noop$3 = function noop() {};

  function ensureFunction$1(value) {
    return typeof value === 'function' ? value : noop$3;
  }

  function invokeForType(fn, type) {
    return function (node, item, list) {
      if (node.type === type) {
        fn.call(this, node, item, list);
      }
    };
  }

  function getWalkersFromStructure(name, nodeType) {
    var structure = nodeType.structure;
    var walkers = [];

    for (var key in structure) {
      if (hasOwnProperty$5.call(structure, key) === false) {
        continue;
      }

      var fieldTypes = structure[key];
      var walker = {
        name: key,
        type: false,
        nullable: false
      };

      if (!Array.isArray(structure[key])) {
        fieldTypes = [structure[key]];
      }

      for (var i = 0; i < fieldTypes.length; i++) {
        var fieldType = fieldTypes[i];

        if (fieldType === null) {
          walker.nullable = true;
        } else if (typeof fieldType === 'string') {
          walker.type = 'node';
        } else if (Array.isArray(fieldType)) {
          walker.type = 'list';
        }
      }

      if (walker.type) {
        walkers.push(walker);
      }
    }

    if (walkers.length) {
      return {
        context: nodeType.walkContext,
        fields: walkers
      };
    }

    return null;
  }

  function getTypesFromConfig(config) {
    var types = {};

    for (var name in config.node) {
      if (hasOwnProperty$5.call(config.node, name)) {
        var nodeType = config.node[name];

        if (!nodeType.structure) {
          throw new Error('Missed `structure` field in `' + name + '` node type definition');
        }

        types[name] = getWalkersFromStructure(name, nodeType);
      }
    }

    return types;
  }

  function createTypeIterator(config, reverse) {
    var fields = config.fields.slice();
    var contextName = config.context;
    var useContext = typeof contextName === 'string';

    if (reverse) {
      fields.reverse();
    }

    return function (node, context, walk) {
      var prevContextValue;

      if (useContext) {
        prevContextValue = context[contextName];
        context[contextName] = node;
      }

      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var ref = node[field.name];

        if (!field.nullable || ref) {
          if (field.type === 'list') {
            if (reverse) {
              ref.forEachRight(walk);
            } else {
              ref.forEach(walk);
            }
          } else {
            walk(ref);
          }
        }
      }

      if (useContext) {
        context[contextName] = prevContextValue;
      }
    };
  }

  function createFastTraveralMap(iterators) {
    return {
      Atrule: {
        StyleSheet: iterators.StyleSheet,
        Atrule: iterators.Atrule,
        Rule: iterators.Rule,
        Block: iterators.Block
      },
      Rule: {
        StyleSheet: iterators.StyleSheet,
        Atrule: iterators.Atrule,
        Rule: iterators.Rule,
        Block: iterators.Block
      },
      Declaration: {
        StyleSheet: iterators.StyleSheet,
        Atrule: iterators.Atrule,
        Rule: iterators.Rule,
        Block: iterators.Block,
        DeclarationList: iterators.DeclarationList
      }
    };
  }

  var create$3 = function createWalker(config) {
    var types = getTypesFromConfig(config);
    var iteratorsNatural = {};
    var iteratorsReverse = {};

    for (var name in types) {
      if (hasOwnProperty$5.call(types, name) && types[name] !== null) {
        iteratorsNatural[name] = createTypeIterator(types[name], false);
        iteratorsReverse[name] = createTypeIterator(types[name], true);
      }
    }

    var fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
    var fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);

    var walk = function walk(root, options) {
      function walkNode(node, item, list) {
        enter.call(context, node, item, list);

        if (iterators.hasOwnProperty(node.type)) {
          iterators[node.type](node, context, walkNode);
        }

        leave.call(context, node, item, list);
      }

      var enter = noop$3;
      var leave = noop$3;
      var iterators = iteratorsNatural;
      var context = {
        root: root,
        stylesheet: null,
        atrule: null,
        atrulePrelude: null,
        rule: null,
        selector: null,
        block: null,
        declaration: null,
        function: null
      };

      if (typeof options === 'function') {
        enter = options;
      } else if (options) {
        enter = ensureFunction$1(options.enter);
        leave = ensureFunction$1(options.leave);

        if (options.reverse) {
          iterators = iteratorsReverse;
        }

        if (options.visit) {
          if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
            iterators = options.reverse ? fastTraversalIteratorsReverse[options.visit] : fastTraversalIteratorsNatural[options.visit];
          } else if (!types.hasOwnProperty(options.visit)) {
            throw new Error('Bad value `' + options.visit + '` for `visit` option (should be: ' + Object.keys(types).join(', ') + ')');
          }

          enter = invokeForType(enter, options.visit);
          leave = invokeForType(leave, options.visit);
        }
      }

      if (enter === noop$3 && leave === noop$3) {
        throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
      } // swap handlers in reverse mode to invert visit order


      if (options.reverse) {
        var tmp = enter;
        enter = leave;
        leave = tmp;
      }

      walkNode(root);
    };

    walk.find = function (ast, fn) {
      var found = null;
      walk(ast, function (node, item, list) {
        if (found === null && fn.call(this, node, item, list)) {
          found = node;
        }
      });
      return found;
    };

    walk.findLast = function (ast, fn) {
      var found = null;
      walk(ast, {
        reverse: true,
        enter: function enter(node, item, list) {
          if (found === null && fn.call(this, node, item, list)) {
            found = node;
          }
        }
      });
      return found;
    };

    walk.findAll = function (ast, fn) {
      var found = [];
      walk(ast, function (node, item, list) {
        if (fn.call(this, node, item, list)) {
          found.push(node);
        }
      });
      return found;
    };

    return walk;
  };

  var clone = function clone(node) {
    var result = {};

    for (var key in node) {
      var value = node[key];

      if (value) {
        if (Array.isArray(value) || value instanceof List_1) {
          value = value.map(clone);
        } else if (value.constructor === Object) {
          value = clone(value);
        }
      }

      result[key] = value;
    }

    return result;
  };

  var hasOwnProperty$6 = Object.prototype.hasOwnProperty;
  var shape = {
    generic: true,
    types: {},
    atrules: {},
    properties: {},
    parseContext: {},
    scope: {},
    atrule: ['parse'],
    pseudo: ['parse'],
    node: ['name', 'structure', 'parse', 'generate', 'walkContext']
  };

  function isObject$1(value) {
    return value && value.constructor === Object;
  }

  function copy(value) {
    if (isObject$1(value)) {
      return Object.assign({}, value);
    } else {
      return value;
    }
  }

  function extend(dest, src) {
    for (var key in src) {
      if (hasOwnProperty$6.call(src, key)) {
        if (isObject$1(dest[key])) {
          extend(dest[key], copy(src[key]));
        } else {
          dest[key] = copy(src[key]);
        }
      }
    }
  }

  function mix(dest, src, shape) {
    for (var key in shape) {
      if (hasOwnProperty$6.call(shape, key) === false) {
        continue;
      }

      if (shape[key] === true) {
        if (key in src) {
          if (hasOwnProperty$6.call(src, key)) {
            dest[key] = copy(src[key]);
          }
        }
      } else if (shape[key]) {
        if (isObject$1(shape[key])) {
          var res = {};
          extend(res, dest[key]);
          extend(res, src[key]);
          dest[key] = res;
        } else if (Array.isArray(shape[key])) {
          var res = {};
          var innerShape = shape[key].reduce(function (s, k) {
            s[k] = true;
            return s;
          }, {});

          for (var name in dest[key]) {
            if (hasOwnProperty$6.call(dest[key], name)) {
              res[name] = {};

              if (dest[key] && dest[key][name]) {
                mix(res[name], dest[key][name], innerShape);
              }
            }
          }

          for (var name in src[key]) {
            if (hasOwnProperty$6.call(src[key], name)) {
              if (!res[name]) {
                res[name] = {};
              }

              if (src[key] && src[key][name]) {
                mix(res[name], src[key][name], innerShape);
              }
            }
          }

          dest[key] = res;
        }
      }
    }

    return dest;
  }

  var mix_1 = function mix_1(dest, src) {
    return mix(dest, src, shape);
  };

  function _createSyntax(config) {
    var parse = create(config);
    var walk = create$3(config);
    var generate = create$1(config);
    var convert = create$2(walk);
    var syntax = {
      List: List_1,
      SyntaxError: _SyntaxError,
      TokenStream: TokenStream_1,
      Lexer: Lexer_1,
      vendorPrefix: names.vendorPrefix,
      keyword: names.keyword,
      property: names.property,
      isCustomProperty: names.isCustomProperty,
      definitionSyntax: definitionSyntax,
      lexer: null,
      createLexer: function createLexer(config) {
        return new Lexer_1(config, syntax, syntax.lexer.structure);
      },
      tokenize: tokenizer,
      parse: parse,
      walk: walk,
      generate: generate,
      find: walk.find,
      findLast: walk.findLast,
      findAll: walk.findAll,
      clone: clone,
      fromPlainObject: convert.fromPlainObject,
      toPlainObject: convert.toPlainObject,
      createSyntax: function createSyntax(config) {
        return _createSyntax(mix_1({}, config));
      },
      fork: function fork(extension) {
        var base = mix_1({}, config); // copy of config

        return _createSyntax(typeof extension === 'function' ? extension(base, Object.assign) : mix_1(base, extension));
      }
    };
    syntax.lexer = new Lexer_1({
      generic: true,
      types: config.types,
      atrules: config.atrules,
      properties: config.properties,
      node: config.node
    }, syntax);
    return syntax;
  }

  var create_1 = function create_1(config) {
    return _createSyntax(mix_1({}, config));
  };

  var create$4 = {
    create: create_1
  };

  var generic$1 = true;
  var types = {
  	"absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large",
  	"alpha-value": "<number>|<percentage>",
  	"angle-percentage": "<angle>|<percentage>",
  	"angular-color-hint": "<angle-percentage>",
  	"angular-color-stop": "<color>&&<color-stop-angle>?",
  	"angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
  	"animateable-feature": "scroll-position|contents|<custom-ident>",
  	attachment: "scroll|fixed|local",
  	"attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
  	"attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
  	"attr-modifier": "i|s",
  	"attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
  	"auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
  	"auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
  	"baseline-position": "[first|last]? baseline",
  	"basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>",
  	"bg-image": "none|<image>",
  	"bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
  	"bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
  	"bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
  	"blur()": "blur( <length> )",
  	"blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
  	box: "border-box|padding-box|content-box",
  	"brightness()": "brightness( <number-percentage> )",
  	"calc()": "calc( <calc-sum> )",
  	"calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
  	"calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
  	"calc-value": "<number>|<dimension>|<percentage>|( <calc-sum> )",
  	"cf-final-image": "<image>|<color>",
  	"cf-mixing-image": "<percentage>?&&<image>",
  	"circle()": "circle( [<shape-radius>]? [at <position>]? )",
  	"clamp()": "clamp( <calc-sum>#{3} )",
  	"class-selector": "'.' <ident-token>",
  	"clip-source": "<url>",
  	color: "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>",
  	"color-stop": "<color-stop-length>|<color-stop-angle>",
  	"color-stop-angle": "<angle-percentage>{1,2}",
  	"color-stop-length": "<length-percentage>{1,2}",
  	"color-stop-list": "[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>",
  	combinator: "'>'|'+'|'~'|['||']",
  	"common-lig-values": "[common-ligatures|no-common-ligatures]",
  	compat: "searchfield|textarea|push-button|button-bevel|slider-horizontal|checkbox|radio|square-button|menulist|menulist-button|listbox|meter|progress-bar",
  	"composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
  	"compositing-operator": "add|subtract|intersect|exclude",
  	"compound-selector": "[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!",
  	"compound-selector-list": "<compound-selector>#",
  	"complex-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
  	"complex-selector-list": "<complex-selector>#",
  	"conic-gradient()": "conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
  	"contextual-alt-values": "[contextual|no-contextual]",
  	"content-distribution": "space-between|space-around|space-evenly|stretch",
  	"content-list": "[<string>|contents|<url>|<quote>|<attr()>|counter( <ident> , <'list-style-type'>? )]+",
  	"content-position": "center|start|end|flex-start|flex-end",
  	"content-replacement": "<image>",
  	"contrast()": "contrast( [<number-percentage>] )",
  	"counter()": "counter( <custom-ident> , [<counter-style>|none]? )",
  	"counter-style": "<counter-style-name>|symbols( )",
  	"counter-style-name": "<custom-ident>",
  	"counters()": "counters( <custom-ident> , <string> , [<counter-style>|none]? )",
  	"cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
  	"cubic-bezier-timing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number> , <number> , <number> , <number> )",
  	"deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
  	"discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
  	"display-box": "contents|none",
  	"display-inside": "flow|flow-root|table|flex|grid|ruby",
  	"display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
  	"display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
  	"display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
  	"display-outside": "block|inline|run-in",
  	"drop-shadow()": "drop-shadow( <length>{2,3} <color>? )",
  	"east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
  	"east-asian-width-values": "[full-width|proportional-width]",
  	"element()": "element( <id-selector> )",
  	"ellipse()": "ellipse( [<shape-radius>{2}]? [at <position>]? )",
  	"ending-shape": "circle|ellipse",
  	"env()": "env( <custom-ident> , <declaration-value>? )",
  	"explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
  	"family-name": "<string>|<custom-ident>+",
  	"feature-tag-value": "<string> [<integer>|on|off]?",
  	"feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
  	"feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
  	"feature-value-block-list": "<feature-value-block>+",
  	"feature-value-declaration": "<custom-ident> : <integer>+ ;",
  	"feature-value-declaration-list": "<feature-value-declaration>",
  	"feature-value-name": "<custom-ident>",
  	"fill-rule": "nonzero|evenodd",
  	"filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
  	"filter-function-list": "[<filter-function>|<url>]+",
  	"final-bg-layer": "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
  	"fit-content()": "fit-content( [<length>|<percentage>] )",
  	"fixed-breadth": "<length-percentage>",
  	"fixed-repeat": "repeat( [<positive-integer>] , [<line-names>? <fixed-size>]+ <line-names>? )",
  	"fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
  	"font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
  	"font-variant-css21": "[normal|small-caps]",
  	"font-weight-absolute": "normal|bold|<number>",
  	"frequency-percentage": "<frequency>|<percentage>",
  	"general-enclosed": "[<function-token> <any-value> )]|( <ident> <any-value> )",
  	"generic-family": "serif|sans-serif|cursive|fantasy|monospace|-apple-system",
  	"generic-name": "serif|sans-serif|cursive|fantasy|monospace",
  	"geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
  	gradient: "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<-legacy-gradient>",
  	"grayscale()": "grayscale( <number-percentage> )",
  	"grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
  	"historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
  	"hsl()": "hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )",
  	"hsla()": "hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )",
  	hue: "<number>|<angle>",
  	"hue-rotate()": "hue-rotate( <angle> )",
  	image: "<url>|<image()>|<image-set()>|<element()>|<cross-fade()>|<gradient>",
  	"image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
  	"image-set()": "image-set( <image-set-option># )",
  	"image-set-option": "[<image>|<string>] <resolution>",
  	"image-src": "<url>|<string>",
  	"image-tags": "ltr|rtl",
  	"inflexible-breadth": "<length>|<percentage>|min-content|max-content|auto",
  	"inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
  	"invert()": "invert( <number-percentage> )",
  	"keyframes-name": "<custom-ident>|<string>",
  	"keyframe-block": "<keyframe-selector># { <declaration-list> }",
  	"keyframe-block-list": "<keyframe-block>+",
  	"keyframe-selector": "from|to|<percentage>",
  	"leader()": "leader( <leader-type> )",
  	"leader-type": "dotted|solid|space|<string>",
  	"length-percentage": "<length>|<percentage>",
  	"line-names": "'[' <custom-ident>* ']'",
  	"line-name-list": "[<line-names>|<name-repeat>]+",
  	"line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
  	"line-width": "<length>|thin|medium|thick",
  	"linear-color-hint": "<length-percentage>",
  	"linear-color-stop": "<color> <color-stop-length>?",
  	"linear-gradient()": "linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
  	"mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
  	"mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
  	"mask-reference": "none|<image>|<mask-source>",
  	"mask-source": "<url>",
  	"masking-mode": "alpha|luminance|match-source",
  	"matrix()": "matrix( <number>#{6} )",
  	"matrix3d()": "matrix3d( <number>#{16} )",
  	"max()": "max( <calc-sum># )",
  	"media-and": "<media-in-parens> [and <media-in-parens>]+",
  	"media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
  	"media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
  	"media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
  	"media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
  	"media-not": "not <media-in-parens>",
  	"media-or": "<media-in-parens> [or <media-in-parens>]+",
  	"media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
  	"media-query-list": "<media-query>#",
  	"media-type": "<ident>",
  	"mf-boolean": "<mf-name>",
  	"mf-name": "<ident>",
  	"mf-plain": "<mf-name> : <mf-value>",
  	"mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
  	"mf-value": "<number>|<dimension>|<ident>|<ratio>",
  	"min()": "min( <calc-sum># )",
  	"minmax()": "minmax( [<length>|<percentage>|<flex>|min-content|max-content|auto] , [<length>|<percentage>|<flex>|min-content|max-content|auto] )",
  	"named-color": "transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>",
  	"namespace-prefix": "<ident>",
  	"ns-prefix": "[<ident-token>|'*']? '|'",
  	"number-percentage": "<number>|<percentage>",
  	"numeric-figure-values": "[lining-nums|oldstyle-nums]",
  	"numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
  	"numeric-spacing-values": "[proportional-nums|tabular-nums]",
  	nth: "<an-plus-b>|even|odd",
  	"opacity()": "opacity( [<number-percentage>] )",
  	"overflow-position": "unsafe|safe",
  	"outline-radius": "<length>|<percentage>",
  	"page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
  	"page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
  	"page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
  	"page-selector-list": "[<page-selector>#]?",
  	"page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
  	"perspective()": "perspective( <length> )",
  	"polygon()": "polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )",
  	position: "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
  	"pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
  	"pseudo-element-selector": "':' <pseudo-class-selector>",
  	"pseudo-page": ": [left|right|first|blank]",
  	quote: "open-quote|close-quote|no-open-quote|no-close-quote",
  	"radial-gradient()": "radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
  	"relative-selector": "<combinator>? <complex-selector>",
  	"relative-selector-list": "<relative-selector>#",
  	"relative-size": "larger|smaller",
  	"repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
  	"repeating-linear-gradient()": "repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
  	"repeating-radial-gradient()": "repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
  	"rgb()": "rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )",
  	"rgba()": "rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )",
  	"rotate()": "rotate( [<angle>|<zero>] )",
  	"rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
  	"rotateX()": "rotateX( [<angle>|<zero>] )",
  	"rotateY()": "rotateY( [<angle>|<zero>] )",
  	"rotateZ()": "rotateZ( [<angle>|<zero>] )",
  	"saturate()": "saturate( <number-percentage> )",
  	"scale()": "scale( <number> , <number>? )",
  	"scale3d()": "scale3d( <number> , <number> , <number> )",
  	"scaleX()": "scaleX( <number> )",
  	"scaleY()": "scaleY( <number> )",
  	"scaleZ()": "scaleZ( <number> )",
  	"self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
  	"shape-radius": "<length-percentage>|closest-side|farthest-side",
  	"skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
  	"skewX()": "skewX( [<angle>|<zero>] )",
  	"skewY()": "skewY( [<angle>|<zero>] )",
  	"sepia()": "sepia( <number-percentage> )",
  	shadow: "inset?&&<length>{2,4}&&<color>?",
  	"shadow-t": "[<length>{2,3}&&<color>?]",
  	shape: "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
  	"shape-box": "<box>|margin-box",
  	"side-or-corner": "[left|right]||[top|bottom]",
  	"single-animation": "<time>||<timing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]",
  	"single-animation-direction": "normal|reverse|alternate|alternate-reverse",
  	"single-animation-fill-mode": "none|forwards|backwards|both",
  	"single-animation-iteration-count": "infinite|<number>",
  	"single-animation-play-state": "running|paused",
  	"single-transition": "[none|<single-transition-property>]||<time>||<timing-function>||<time>",
  	"single-transition-property": "all|<custom-ident>",
  	size: "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
  	"step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
  	"step-timing-function": "step-start|step-end|steps( <integer> [, <step-position>]? )",
  	"subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
  	"supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
  	"supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
  	"supports-feature": "<supports-decl>|<supports-selector-fn>",
  	"supports-decl": "( <declaration> )",
  	"supports-selector-fn": "selector( <complex-selector> )",
  	symbol: "<string>|<image>|<custom-ident>",
  	target: "<target-counter()>|<target-counters()>|<target-text()>",
  	"target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
  	"target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
  	"target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
  	"time-percentage": "<time>|<percentage>",
  	"timing-function": "linear|<cubic-bezier-timing-function>|<step-timing-function>",
  	"track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
  	"track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
  	"track-repeat": "repeat( [<positive-integer>] , [<line-names>? <track-size>]+ <line-names>? )",
  	"track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( [<length>|<percentage>] )",
  	"transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
  	"transform-list": "<transform-function>+",
  	"translate()": "translate( <length-percentage> , <length-percentage>? )",
  	"translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
  	"translateX()": "translateX( <length-percentage> )",
  	"translateY()": "translateY( <length-percentage> )",
  	"translateZ()": "translateZ( <length> )",
  	"type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
  	"type-selector": "<wq-name>|<ns-prefix>? '*'",
  	"var()": "var( <custom-property-name> , <declaration-value>? )",
  	"viewport-length": "auto|<length-percentage>",
  	"wq-name": "<ns-prefix>? <ident-token>",
  	"-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
  	"-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
  	"-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
  	"-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
  	"-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
  	"-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
  	"-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
  	"-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
  	"-legacy-radial-gradient-shape": "circle|ellipse",
  	"-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
  	"-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
  	"-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
  	"-non-standard-overflow": "-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
  	"-non-standard-width": "min-intrinsic|intrinsic|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content",
  	"-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
  	"-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
  	"-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
  	"-webkit-gradient-radius": "<length>|<percentage>",
  	"-webkit-gradient-type": "linear|radial",
  	"-webkit-mask-box-repeat": "repeat|stretch|round",
  	"-webkit-mask-clip-style": "border|border-box|padding|padding-box|content|content-box|text",
  	"-ms-filter-function-list": "<-ms-filter-function>+",
  	"-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
  	"-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
  	"-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
  	"-ms-filter": "<string>",
  	age: "child|young|old",
  	"attr-name": "<wq-name>",
  	"attr-fallback": "<any-value>",
  	"border-radius": "<length-percentage>{1,2}",
  	bottom: "<length>|auto",
  	"generic-voice": "[<age>? <gender> <integer>?]",
  	gender: "male|female|neutral",
  	left: "<length>|auto",
  	"mask-image": "<mask-reference>#",
  	"name-repeat": "repeat( [<positive-integer>|auto-fill] , <line-names>+ )",
  	paint: "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
  	"path()": "path( <string> )",
  	ratio: "<integer> / <integer>",
  	right: "<length>|auto",
  	"svg-length": "<percentage>|<length>|<number>",
  	"svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
  	top: "<length>|auto",
  	"track-group": "'(' [<string>* <track-minmax> <string>*]+ ')' ['[' <positive-integer> ']']?|<track-minmax>",
  	"track-list-v0": "[<string>* <track-group> <string>*]+|none",
  	"track-minmax": "minmax( <track-breadth> , <track-breadth> )|auto|<track-breadth>|fit-content",
  	x: "<number>",
  	y: "<number>",
  	declaration: "<ident-token> : <declaration-value>? ['!' important]?",
  	"declaration-list": "[<declaration>? ';']* <declaration>?",
  	url: "url( <string> <url-modifier>* )|<url-token>",
  	"url-modifier": "<ident>|<function-token> <any-value> )",
  	"number-zero-one": "<number [0,1]>",
  	"number-one-or-greater": "<number [1,∞]>",
  	"positive-integer": "<integer [0,∞]>"
  };
  var properties$1 = {
  	"--*": "<declaration-value>",
  	"-ms-accelerator": "false|true",
  	"-ms-block-progression": "tb|rl|bt|lr",
  	"-ms-content-zoom-chaining": "none|chained",
  	"-ms-content-zooming": "none|zoom",
  	"-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
  	"-ms-content-zoom-limit-max": "<percentage>",
  	"-ms-content-zoom-limit-min": "<percentage>",
  	"-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
  	"-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
  	"-ms-content-zoom-snap-type": "none|proximity|mandatory",
  	"-ms-filter": "<string>",
  	"-ms-flow-from": "[none|<custom-ident>]#",
  	"-ms-flow-into": "[none|<custom-ident>]#",
  	"-ms-high-contrast-adjust": "auto|none",
  	"-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
  	"-ms-hyphenate-limit-lines": "no-limit|<integer>",
  	"-ms-hyphenate-limit-zone": "<percentage>|<length>",
  	"-ms-ime-align": "auto|after",
  	"-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
  	"-ms-scrollbar-3dlight-color": "<color>",
  	"-ms-scrollbar-arrow-color": "<color>",
  	"-ms-scrollbar-base-color": "<color>",
  	"-ms-scrollbar-darkshadow-color": "<color>",
  	"-ms-scrollbar-face-color": "<color>",
  	"-ms-scrollbar-highlight-color": "<color>",
  	"-ms-scrollbar-shadow-color": "<color>",
  	"-ms-scrollbar-track-color": "<color>",
  	"-ms-scroll-chaining": "chained|none",
  	"-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
  	"-ms-scroll-limit-x-max": "auto|<length>",
  	"-ms-scroll-limit-x-min": "<length>",
  	"-ms-scroll-limit-y-max": "auto|<length>",
  	"-ms-scroll-limit-y-min": "<length>",
  	"-ms-scroll-rails": "none|railed",
  	"-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
  	"-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
  	"-ms-scroll-snap-type": "none|proximity|mandatory",
  	"-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
  	"-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
  	"-ms-scroll-translation": "none|vertical-to-horizontal",
  	"-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
  	"-ms-touch-select": "grippers|none",
  	"-ms-user-select": "none|element|text",
  	"-ms-wrap-flow": "auto|both|start|end|maximum|clear",
  	"-ms-wrap-margin": "<length>",
  	"-ms-wrap-through": "wrap|none",
  	"-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
  	"-moz-binding": "<url>|none",
  	"-moz-border-bottom-colors": "<color>+|none",
  	"-moz-border-left-colors": "<color>+|none",
  	"-moz-border-right-colors": "<color>+|none",
  	"-moz-border-top-colors": "<color>+|none",
  	"-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
  	"-moz-float-edge": "border-box|content-box|margin-box|padding-box",
  	"-moz-force-broken-image-icon": "<integer>",
  	"-moz-image-region": "<shape>|auto",
  	"-moz-orient": "inline|block|horizontal|vertical",
  	"-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
  	"-moz-outline-radius-bottomleft": "<outline-radius>",
  	"-moz-outline-radius-bottomright": "<outline-radius>",
  	"-moz-outline-radius-topleft": "<outline-radius>",
  	"-moz-outline-radius-topright": "<outline-radius>",
  	"-moz-stack-sizing": "ignore|stretch-to-fit",
  	"-moz-text-blink": "none|blink",
  	"-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
  	"-moz-user-input": "auto|none|enabled|disabled",
  	"-moz-user-modify": "read-only|read-write|write-only",
  	"-moz-window-dragging": "drag|no-drag",
  	"-moz-window-shadow": "default|menu|tooltip|sheet|none",
  	"-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|listbox|listitem|media-fullscreen-button|media-mute-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield",
  	"-webkit-border-before": "<'border-width'>||<'border-style'>||<'color'>",
  	"-webkit-border-before-color": "<'color'>",
  	"-webkit-border-before-style": "<'border-style'>",
  	"-webkit-border-before-width": "<'border-width'>",
  	"-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
  	"-webkit-line-clamp": "none|<integer>",
  	"-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#",
  	"-webkit-mask-attachment": "<attachment>#",
  	"-webkit-mask-clip": "[<box>|border|padding|content|text]#",
  	"-webkit-mask-composite": "<composite-style>#",
  	"-webkit-mask-image": "<mask-reference>#",
  	"-webkit-mask-origin": "[<box>|border|padding|content]#",
  	"-webkit-mask-position": "<position>#",
  	"-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
  	"-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
  	"-webkit-mask-repeat": "<repeat-style>#",
  	"-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
  	"-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
  	"-webkit-mask-size": "<bg-size>#",
  	"-webkit-overflow-scrolling": "auto|touch",
  	"-webkit-tap-highlight-color": "<color>",
  	"-webkit-text-fill-color": "<color>",
  	"-webkit-text-stroke": "<length>||<color>",
  	"-webkit-text-stroke-color": "<color>",
  	"-webkit-text-stroke-width": "<length>",
  	"-webkit-touch-callout": "default|none",
  	"-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
  	"align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
  	"align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]",
  	"align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",
  	all: "initial|inherit|unset|revert",
  	animation: "<single-animation>#",
  	"animation-delay": "<time>#",
  	"animation-direction": "<single-animation-direction>#",
  	"animation-duration": "<time>#",
  	"animation-fill-mode": "<single-animation-fill-mode>#",
  	"animation-iteration-count": "<single-animation-iteration-count>#",
  	"animation-name": "[none|<keyframes-name>]#",
  	"animation-play-state": "<single-animation-play-state>#",
  	"animation-timing-function": "<timing-function>#",
  	appearance: "none|auto|button|textfield|<compat>",
  	azimuth: "<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards",
  	"backdrop-filter": "none|<filter-function-list>",
  	"backface-visibility": "visible|hidden",
  	background: "[<bg-layer> ,]* <final-bg-layer>",
  	"background-attachment": "<attachment>#",
  	"background-blend-mode": "<blend-mode>#",
  	"background-clip": "<box>#",
  	"background-color": "<color>",
  	"background-image": "<bg-image>#",
  	"background-origin": "<box>#",
  	"background-position": "<bg-position>#",
  	"background-position-x": "[center|[left|right|x-start|x-end]? <length-percentage>?]#",
  	"background-position-y": "[center|[top|bottom|y-start|y-end]? <length-percentage>?]#",
  	"background-repeat": "<repeat-style>#",
  	"background-size": "<bg-size>#",
  	"block-overflow": "clip|ellipsis|<string>",
  	"block-size": "<'width'>",
  	border: "<line-width>||<line-style>||<color>",
  	"border-block": "<'border-top-width'>||<'border-top-style'>||<'color'>",
  	"border-block-color": "<'border-top-color'>{1,2}",
  	"border-block-style": "<'border-top-style'>",
  	"border-block-width": "<'border-top-width'>",
  	"border-block-end": "<'border-top-width'>||<'border-top-style'>||<'color'>",
  	"border-block-end-color": "<'border-top-color'>",
  	"border-block-end-style": "<'border-top-style'>",
  	"border-block-end-width": "<'border-top-width'>",
  	"border-block-start": "<'border-top-width'>||<'border-top-style'>||<'color'>",
  	"border-block-start-color": "<'border-top-color'>",
  	"border-block-start-style": "<'border-top-style'>",
  	"border-block-start-width": "<'border-top-width'>",
  	"border-bottom": "<line-width>||<line-style>||<color>",
  	"border-bottom-color": "<'border-top-color'>",
  	"border-bottom-left-radius": "<length-percentage>{1,2}",
  	"border-bottom-right-radius": "<length-percentage>{1,2}",
  	"border-bottom-style": "<line-style>",
  	"border-bottom-width": "<line-width>",
  	"border-collapse": "collapse|separate",
  	"border-color": "<color>{1,4}",
  	"border-end-end-radius": "<length-percentage>{1,2}",
  	"border-end-start-radius": "<length-percentage>{1,2}",
  	"border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
  	"border-image-outset": "[<length>|<number>]{1,4}",
  	"border-image-repeat": "[stretch|repeat|round|space]{1,2}",
  	"border-image-slice": "<number-percentage>{1,4}&&fill?",
  	"border-image-source": "none|<image>",
  	"border-image-width": "[<length-percentage>|<number>|auto]{1,4}",
  	"border-inline": "<'border-top-width'>||<'border-top-style'>||<'color'>",
  	"border-inline-end": "<'border-top-width'>||<'border-top-style'>||<'color'>",
  	"border-inline-color": "<'border-top-color'>{1,2}",
  	"border-inline-style": "<'border-top-style'>",
  	"border-inline-width": "<'border-top-width'>",
  	"border-inline-end-color": "<'border-top-color'>",
  	"border-inline-end-style": "<'border-top-style'>",
  	"border-inline-end-width": "<'border-top-width'>",
  	"border-inline-start": "<'border-top-width'>||<'border-top-style'>||<'color'>",
  	"border-inline-start-color": "<'border-top-color'>",
  	"border-inline-start-style": "<'border-top-style'>",
  	"border-inline-start-width": "<'border-top-width'>",
  	"border-left": "<line-width>||<line-style>||<color>",
  	"border-left-color": "<color>",
  	"border-left-style": "<line-style>",
  	"border-left-width": "<line-width>",
  	"border-radius": "<length-percentage>{1,4} [/ <length-percentage>{1,4}]?",
  	"border-right": "<line-width>||<line-style>||<color>",
  	"border-right-color": "<color>",
  	"border-right-style": "<line-style>",
  	"border-right-width": "<line-width>",
  	"border-spacing": "<length> <length>?",
  	"border-start-end-radius": "<length-percentage>{1,2}",
  	"border-start-start-radius": "<length-percentage>{1,2}",
  	"border-style": "<line-style>{1,4}",
  	"border-top": "<line-width>||<line-style>||<color>",
  	"border-top-color": "<color>",
  	"border-top-left-radius": "<length-percentage>{1,2}",
  	"border-top-right-radius": "<length-percentage>{1,2}",
  	"border-top-style": "<line-style>",
  	"border-top-width": "<line-width>",
  	"border-width": "<line-width>{1,4}",
  	bottom: "<length>|<percentage>|auto",
  	"box-align": "start|center|end|baseline|stretch",
  	"box-decoration-break": "slice|clone",
  	"box-direction": "normal|reverse|inherit",
  	"box-flex": "<number>",
  	"box-flex-group": "<integer>",
  	"box-lines": "single|multiple",
  	"box-ordinal-group": "<integer>",
  	"box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
  	"box-pack": "start|center|end|justify",
  	"box-shadow": "none|<shadow>#",
  	"box-sizing": "content-box|border-box",
  	"break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
  	"break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
  	"break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
  	"caption-side": "top|bottom|block-start|block-end|inline-start|inline-end",
  	"caret-color": "auto|<color>",
  	clear: "none|left|right|both|inline-start|inline-end",
  	clip: "<shape>|auto",
  	"clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
  	color: "<color>",
  	"color-adjust": "economy|exact",
  	"column-count": "<integer>|auto",
  	"column-fill": "auto|balance|balance-all",
  	"column-gap": "normal|<length-percentage>",
  	"column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
  	"column-rule-color": "<color>",
  	"column-rule-style": "<'border-style'>",
  	"column-rule-width": "<'border-width'>",
  	"column-span": "none|all",
  	"column-width": "<length>|auto",
  	columns: "<'column-width'>||<'column-count'>",
  	contain: "none|strict|content|[size||layout||style||paint]",
  	content: "normal|none|[<content-replacement>|<content-list>] [/ <string>]?",
  	"counter-increment": "[<custom-ident> <integer>?]+|none",
  	"counter-reset": "[<custom-ident> <integer>?]+|none",
  	"counter-set": "[<custom-ident> <integer>?]+|none",
  	cursor: "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
  	direction: "ltr|rtl",
  	display: "block|contents|flex|flow|flow-root|grid|inline|inline-block|inline-flex|inline-grid|inline-list-item|inline-table|list-item|none|ruby|ruby-base|ruby-base-container|ruby-text|ruby-text-container|run-in|table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|-ms-flexbox|-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box",
  	"empty-cells": "show|hide",
  	filter: "none|<filter-function-list>|<-ms-filter-function-list>",
  	flex: "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
  	"flex-basis": "content|<'width'>",
  	"flex-direction": "row|row-reverse|column|column-reverse",
  	"flex-flow": "<'flex-direction'>||<'flex-wrap'>",
  	"flex-grow": "<number>",
  	"flex-shrink": "<number>",
  	"flex-wrap": "nowrap|wrap|wrap-reverse",
  	float: "left|right|none|inline-start|inline-end",
  	font: "[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar",
  	"font-family": "[<family-name>|<generic-family>]#",
  	"font-feature-settings": "normal|<feature-tag-value>#",
  	"font-kerning": "auto|normal|none",
  	"font-language-override": "normal|<string>",
  	"font-optical-sizing": "auto|none",
  	"font-variation-settings": "normal|[<string> <number>]#",
  	"font-size": "<absolute-size>|<relative-size>|<length-percentage>",
  	"font-size-adjust": "none|<number>",
  	"font-stretch": "<font-stretch-absolute>",
  	"font-style": "normal|italic|oblique <angle>?",
  	"font-synthesis": "none|[weight||style]",
  	"font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
  	"font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
  	"font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
  	"font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
  	"font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
  	"font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
  	"font-variant-position": "normal|sub|super",
  	"font-weight": "<font-weight-absolute>|bolder|lighter",
  	gap: "<'row-gap'> <'column-gap'>?",
  	grid: "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
  	"grid-area": "<grid-line> [/ <grid-line>]{0,3}",
  	"grid-auto-columns": "<track-size>+",
  	"grid-auto-flow": "[row|column]||dense",
  	"grid-auto-rows": "<track-size>+",
  	"grid-column": "<grid-line> [/ <grid-line>]?",
  	"grid-column-end": "<grid-line>",
  	"grid-column-gap": "<length-percentage>",
  	"grid-column-start": "<grid-line>",
  	"grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
  	"grid-row": "<grid-line> [/ <grid-line>]?",
  	"grid-row-end": "<grid-line>",
  	"grid-row-gap": "<length-percentage>",
  	"grid-row-start": "<grid-line>",
  	"grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
  	"grid-template-areas": "none|<string>+",
  	"grid-template-columns": "none|<track-list>|<auto-track-list>",
  	"grid-template-rows": "none|<track-list>|<auto-track-list>",
  	"hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
  	height: "[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto",
  	hyphens: "none|manual|auto",
  	"image-orientation": "from-image|<angle>|[<angle>? flip]",
  	"image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
  	"image-resolution": "[from-image||<resolution>]&&snap?",
  	"ime-mode": "auto|normal|active|inactive|disabled",
  	"initial-letter": "normal|[<number> <integer>?]",
  	"initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
  	"inline-size": "<'width'>",
  	inset: "<'top'>{1,4}",
  	"inset-block": "<'top'>{1,2}",
  	"inset-block-end": "<'top'>",
  	"inset-block-start": "<'top'>",
  	"inset-inline": "<'top'>{1,2}",
  	"inset-inline-end": "<'top'>",
  	"inset-inline-start": "<'top'>",
  	isolation: "auto|isolate",
  	"justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
  	"justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
  	"justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
  	left: "<length>|<percentage>|auto",
  	"letter-spacing": "normal|<length-percentage>",
  	"line-break": "auto|loose|normal|strict",
  	"line-clamp": "none|<integer>",
  	"line-height": "normal|<number>|<length>|<percentage>",
  	"line-height-step": "<length>",
  	"list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
  	"list-style-image": "<url>|none",
  	"list-style-position": "inside|outside",
  	"list-style-type": "<counter-style>|<string>|none",
  	margin: "[<length>|<percentage>|auto]{1,4}",
  	"margin-block": "<'margin-left'>{1,2}",
  	"margin-block-end": "<'margin-left'>",
  	"margin-block-start": "<'margin-left'>",
  	"margin-bottom": "<length>|<percentage>|auto",
  	"margin-inline": "<'margin-left'>{1,2}",
  	"margin-inline-end": "<'margin-left'>",
  	"margin-inline-start": "<'margin-left'>",
  	"margin-left": "<length>|<percentage>|auto",
  	"margin-right": "<length>|<percentage>|auto",
  	"margin-top": "<length>|<percentage>|auto",
  	mask: "<mask-layer>#",
  	"mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
  	"mask-border-mode": "luminance|alpha",
  	"mask-border-outset": "[<length>|<number>]{1,4}",
  	"mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
  	"mask-border-slice": "<number-percentage>{1,4} fill?",
  	"mask-border-source": "none|<image>",
  	"mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
  	"mask-clip": "[<geometry-box>|no-clip]#",
  	"mask-composite": "<compositing-operator>#",
  	"mask-image": "<mask-reference>#",
  	"mask-mode": "<masking-mode>#",
  	"mask-origin": "<geometry-box>#",
  	"mask-position": "<position>#",
  	"mask-repeat": "<repeat-style>#",
  	"mask-size": "<bg-size>#",
  	"mask-type": "luminance|alpha",
  	"max-block-size": "<'max-width'>",
  	"max-height": "<length>|<percentage>|none|max-content|min-content|fit-content|fill-available",
  	"max-inline-size": "<'max-width'>",
  	"max-lines": "none|<integer>",
  	"max-width": "<length>|<percentage>|none|max-content|min-content|fit-content|fill-available|<-non-standard-width>",
  	"min-block-size": "<'min-width'>",
  	"min-height": "<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available",
  	"min-inline-size": "<'min-width'>",
  	"min-width": "<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available|<-non-standard-width>",
  	"mix-blend-mode": "<blend-mode>",
  	"object-fit": "fill|contain|cover|none|scale-down",
  	"object-position": "<position>",
  	offset: "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
  	"offset-anchor": "auto|<position>",
  	"offset-distance": "<length-percentage>",
  	"offset-path": "none|ray( [<angle>&&<size>?&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]",
  	"offset-position": "auto|<position>",
  	"offset-rotate": "[auto|reverse]||<angle>",
  	opacity: "<number-zero-one>",
  	order: "<integer>",
  	orphans: "<integer>",
  	outline: "[<'outline-color'>||<'outline-style'>||<'outline-width'>]",
  	"outline-color": "<color>|invert",
  	"outline-offset": "<length>",
  	"outline-style": "auto|<'border-style'>",
  	"outline-width": "<line-width>",
  	overflow: "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
  	"overflow-anchor": "auto|none",
  	"overflow-block": "visible|hidden|clip|scroll|auto",
  	"overflow-clip-box": "padding-box|content-box",
  	"overflow-inline": "visible|hidden|clip|scroll|auto",
  	"overflow-wrap": "normal|break-word|anywhere",
  	"overflow-x": "visible|hidden|clip|scroll|auto",
  	"overflow-y": "visible|hidden|clip|scroll|auto",
  	"overscroll-behavior": "[contain|none|auto]{1,2}",
  	"overscroll-behavior-x": "contain|none|auto",
  	"overscroll-behavior-y": "contain|none|auto",
  	padding: "[<length>|<percentage>]{1,4}",
  	"padding-block": "<'padding-left'>{1,2}",
  	"padding-block-end": "<'padding-left'>",
  	"padding-block-start": "<'padding-left'>",
  	"padding-bottom": "<length>|<percentage>",
  	"padding-inline": "<'padding-left'>{1,2}",
  	"padding-inline-end": "<'padding-left'>",
  	"padding-inline-start": "<'padding-left'>",
  	"padding-left": "<length>|<percentage>",
  	"padding-right": "<length>|<percentage>",
  	"padding-top": "<length>|<percentage>",
  	"page-break-after": "auto|always|avoid|left|right|recto|verso",
  	"page-break-before": "auto|always|avoid|left|right|recto|verso",
  	"page-break-inside": "auto|avoid",
  	"paint-order": "normal|[fill||stroke||markers]",
  	perspective: "none|<length>",
  	"perspective-origin": "<position>",
  	"place-content": "<'align-content'> <'justify-content'>?",
  	"place-items": "<'align-items'> <'justify-items'>?",
  	"place-self": "<'align-self'> <'justify-self'>?",
  	"pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
  	position: "static|relative|absolute|sticky|fixed|-webkit-sticky",
  	quotes: "none|[<string> <string>]+",
  	resize: "none|both|horizontal|vertical|block|inline",
  	right: "<length>|<percentage>|auto",
  	rotate: "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
  	"row-gap": "normal|<length-percentage>",
  	"ruby-align": "start|center|space-between|space-around",
  	"ruby-merge": "separate|collapse|auto",
  	"ruby-position": "over|under|inter-character",
  	scale: "none|<number>{1,3}",
  	"scrollbar-color": "auto|dark|light|<color>{2}",
  	"scrollbar-width": "auto|thin|none",
  	"scroll-behavior": "auto|smooth",
  	"scroll-margin": "<length>{1,4}",
  	"scroll-margin-block": "<length>{1,2}",
  	"scroll-margin-block-start": "<length>",
  	"scroll-margin-block-end": "<length>",
  	"scroll-margin-bottom": "<length>",
  	"scroll-margin-inline": "<length>{1,2}",
  	"scroll-margin-inline-start": "<length>",
  	"scroll-margin-inline-end": "<length>",
  	"scroll-margin-left": "<length>",
  	"scroll-margin-right": "<length>",
  	"scroll-margin-top": "<length>",
  	"scroll-padding": "[auto|<length-percentage>]{1,4}",
  	"scroll-padding-block": "[auto|<length-percentage>]{1,2}",
  	"scroll-padding-block-start": "auto|<length-percentage>",
  	"scroll-padding-block-end": "auto|<length-percentage>",
  	"scroll-padding-bottom": "auto|<length-percentage>",
  	"scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
  	"scroll-padding-inline-start": "auto|<length-percentage>",
  	"scroll-padding-inline-end": "auto|<length-percentage>",
  	"scroll-padding-left": "auto|<length-percentage>",
  	"scroll-padding-right": "auto|<length-percentage>",
  	"scroll-padding-top": "auto|<length-percentage>",
  	"scroll-snap-align": "[none|start|end|center]{1,2}",
  	"scroll-snap-coordinate": "none|<position>#",
  	"scroll-snap-destination": "<position>",
  	"scroll-snap-points-x": "none|repeat( <length-percentage> )",
  	"scroll-snap-points-y": "none|repeat( <length-percentage> )",
  	"scroll-snap-stop": "normal|always",
  	"scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
  	"scroll-snap-type-x": "none|mandatory|proximity",
  	"scroll-snap-type-y": "none|mandatory|proximity",
  	"shape-image-threshold": "<number>",
  	"shape-margin": "<length-percentage>",
  	"shape-outside": "none|<shape-box>||<basic-shape>|<image>",
  	"tab-size": "<integer>|<length>",
  	"table-layout": "auto|fixed",
  	"text-align": "start|end|left|right|center|justify|match-parent",
  	"text-align-last": "auto|start|end|left|right|center|justify",
  	"text-combine-upright": "none|all|[digits <integer>?]",
  	"text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>",
  	"text-decoration-color": "<color>",
  	"text-decoration-line": "none|[underline||overline||line-through||blink]",
  	"text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
  	"text-decoration-skip-ink": "auto|none",
  	"text-decoration-style": "solid|double|dotted|dashed|wavy",
  	"text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
  	"text-emphasis-color": "<color>",
  	"text-emphasis-position": "[over|under]&&[right|left]",
  	"text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
  	"text-indent": "<length-percentage>&&hanging?&&each-line?",
  	"text-justify": "auto|inter-character|inter-word|none",
  	"text-orientation": "mixed|upright|sideways",
  	"text-overflow": "[clip|ellipsis|<string>]{1,2}",
  	"text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
  	"text-shadow": "none|<shadow-t>#",
  	"text-size-adjust": "none|auto|<percentage>",
  	"text-transform": "none|capitalize|uppercase|lowercase|full-width|full-size-kana",
  	"text-underline-position": "auto|[under||[left|right]]",
  	top: "<length>|<percentage>|auto",
  	"touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
  	transform: "none|<transform-list>",
  	"transform-box": "border-box|fill-box|view-box",
  	"transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
  	"transform-style": "flat|preserve-3d",
  	transition: "<single-transition>#",
  	"transition-delay": "<time>#",
  	"transition-duration": "<time>#",
  	"transition-property": "none|<single-transition-property>#",
  	"transition-timing-function": "<timing-function>#",
  	translate: "none|<length-percentage> [<length-percentage> <length>?]?",
  	"unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate",
  	"user-select": "auto|text|none|contain|all",
  	"vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
  	visibility: "visible|hidden|collapse",
  	"white-space": "normal|pre|nowrap|pre-wrap|pre-line",
  	widows: "<integer>",
  	width: "[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto",
  	"will-change": "auto|<animateable-feature>#",
  	"word-break": "normal|break-all|keep-all|break-word",
  	"word-spacing": "normal|<length-percentage>",
  	"word-wrap": "normal|break-word",
  	"writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
  	"z-index": "auto|<integer>",
  	zoom: "normal|reset|<number>|<percentage>",
  	"-moz-background-clip": "padding|border",
  	"-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
  	"-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
  	"-moz-border-radius-topleft": "<'border-top-left-radius'>",
  	"-moz-border-radius-topright": "<'border-bottom-right-radius'>",
  	"-moz-control-character-visibility": "visible|hidden",
  	"-moz-osx-font-smoothing": "auto|grayscale",
  	"-moz-user-select": "none|text|all|-moz-none",
  	"-ms-flex-align": "start|end|center|baseline|stretch",
  	"-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
  	"-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
  	"-ms-flex-negative": "<'flex-shrink'>",
  	"-ms-flex-pack": "start|end|center|justify|distribute",
  	"-ms-flex-order": "<integer>",
  	"-ms-flex-positive": "<'flex-grow'>",
  	"-ms-flex-preferred-size": "<'flex-basis'>",
  	"-ms-interpolation-mode": "nearest-neighbor|bicubic",
  	"-ms-grid-column-align": "start|end|center|stretch",
  	"-ms-grid-columns": "<track-list-v0>",
  	"-ms-grid-row-align": "start|end|center|stretch",
  	"-ms-grid-rows": "<track-list-v0>",
  	"-ms-hyphenate-limit-last": "none|always|column|page|spread",
  	"-webkit-background-clip": "[<box>|border|padding|content|text]#",
  	"-webkit-column-break-after": "always|auto|avoid",
  	"-webkit-column-break-before": "always|auto|avoid",
  	"-webkit-column-break-inside": "always|auto|avoid",
  	"-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
  	"-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
  	"-webkit-print-color-adjust": "economy|exact",
  	"-webkit-text-security": "none|circle|disc|square",
  	"-webkit-user-drag": "none|element|auto",
  	"-webkit-user-select": "auto|none|text|all",
  	"alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
  	"baseline-shift": "baseline|sub|super|<svg-length>",
  	behavior: "<url>+",
  	"clip-rule": "nonzero|evenodd",
  	cue: "<'cue-before'> <'cue-after'>?",
  	"cue-after": "<url> <decibel>?|none",
  	"cue-before": "<url> <decibel>?|none",
  	"dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
  	fill: "<paint>",
  	"fill-opacity": "<number-zero-one>",
  	"fill-rule": "nonzero|evenodd",
  	"glyph-orientation-horizontal": "<angle>",
  	"glyph-orientation-vertical": "<angle>",
  	kerning: "auto|<svg-length>",
  	marker: "none|<url>",
  	"marker-end": "none|<url>",
  	"marker-mid": "none|<url>",
  	"marker-start": "none|<url>",
  	pause: "<'pause-before'> <'pause-after'>?",
  	"pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
  	"pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
  	rest: "<'rest-before'> <'rest-after'>?",
  	"rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
  	"rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
  	"shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
  	src: "[<url> [format( <string># )]?|local( <family-name> )]#",
  	speak: "auto|none|normal",
  	"speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
  	stroke: "<paint>",
  	"stroke-dasharray": "none|[<svg-length>+]#",
  	"stroke-dashoffset": "<svg-length>",
  	"stroke-linecap": "butt|round|square",
  	"stroke-linejoin": "miter|round|bevel",
  	"stroke-miterlimit": "<number-one-or-greater>",
  	"stroke-opacity": "<number-zero-one>",
  	"stroke-width": "<svg-length>",
  	"text-anchor": "start|middle|end",
  	"unicode-range": "<urange>#",
  	"voice-balance": "<number>|left|center|right|leftwards|rightwards",
  	"voice-duration": "auto|<time>",
  	"voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
  	"voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
  	"voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
  	"voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
  	"voice-stress": "normal|strong|moderate|none|reduced",
  	"voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]"
  };
  var defaultSyntax = {
  	generic: generic$1,
  	types: types,
  	properties: properties$1
  };

  var defaultSyntax$1 = /*#__PURE__*/Object.freeze({
    generic: generic$1,
    types: types,
    properties: properties$1,
    default: defaultSyntax
  });

  var cmpChar$3 = tokenizer.cmpChar;
  var isDigit$4 = tokenizer.isDigit;
  var TYPE$9 = tokenizer.TYPE;
  var WHITESPACE$4 = TYPE$9.WhiteSpace;
  var COMMENT$3 = TYPE$9.Comment;
  var IDENT$3 = TYPE$9.Ident;
  var NUMBER$4 = TYPE$9.Number;
  var DIMENSION$2 = TYPE$9.Dimension;
  var PLUSSIGN$3 = 0x002B; // U+002B PLUS SIGN (+)

  var HYPHENMINUS$3 = 0x002D; // U+002D HYPHEN-MINUS (-)

  var N$4 = 0x006E; // U+006E LATIN SMALL LETTER N (n)

  var DISALLOW_SIGN$1 = true;
  var ALLOW_SIGN$1 = false;

  function checkInteger$1(offset, disallowSign) {
    var pos = this.scanner.tokenStart + offset;
    var code = this.scanner.source.charCodeAt(pos);

    if (code === PLUSSIGN$3 || code === HYPHENMINUS$3) {
      if (disallowSign) {
        this.error('Number sign is not allowed');
      }

      pos++;
    }

    for (; pos < this.scanner.tokenEnd; pos++) {
      if (!isDigit$4(this.scanner.source.charCodeAt(pos))) {
        this.error('Integer is expected', pos);
      }
    }
  }

  function checkTokenIsInteger(disallowSign) {
    return checkInteger$1.call(this, 0, disallowSign);
  }

  function expectCharCode(offset, code) {
    if (!cmpChar$3(this.scanner.source, this.scanner.tokenStart + offset, code)) {
      var msg = '';

      switch (code) {
        case N$4:
          msg = 'N is expected';
          break;

        case HYPHENMINUS$3:
          msg = 'HyphenMinus is expected';
          break;
      }

      this.error(msg, this.scanner.tokenStart + offset);
    }
  } // ... <signed-integer>
  // ... ['+' | '-'] <signless-integer>


  function consumeB$1() {
    var offset = 0;
    var sign = 0;
    var type = this.scanner.tokenType;

    while (type === WHITESPACE$4 || type === COMMENT$3) {
      type = this.scanner.lookupType(++offset);
    }

    if (type !== NUMBER$4) {
      if (this.scanner.isDelim(PLUSSIGN$3, offset) || this.scanner.isDelim(HYPHENMINUS$3, offset)) {
        sign = this.scanner.isDelim(PLUSSIGN$3, offset) ? PLUSSIGN$3 : HYPHENMINUS$3;

        do {
          type = this.scanner.lookupType(++offset);
        } while (type === WHITESPACE$4 || type === COMMENT$3);

        if (type !== NUMBER$4) {
          this.scanner.skip(offset);
          checkTokenIsInteger.call(this, DISALLOW_SIGN$1);
        }
      } else {
        return null;
      }
    }

    if (offset > 0) {
      this.scanner.skip(offset);
    }

    if (sign === 0) {
      type = this.scanner.source.charCodeAt(this.scanner.tokenStart);

      if (type !== PLUSSIGN$3 && type !== HYPHENMINUS$3) {
        this.error('Number sign is expected');
      }
    }

    checkTokenIsInteger.call(this, sign !== 0);
    return sign === HYPHENMINUS$3 ? '-' + this.consume(NUMBER$4) : this.consume(NUMBER$4);
  } // An+B microsyntax https://www.w3.org/TR/css-syntax-3/#anb


  var AnPlusB = {
    name: 'AnPlusB',
    structure: {
      a: [String, null],
      b: [String, null]
    },
    parse: function parse() {
      /* eslint-disable brace-style*/
      var start = this.scanner.tokenStart;
      var a = null;
      var b = null; // <integer>

      if (this.scanner.tokenType === NUMBER$4) {
        checkTokenIsInteger.call(this, ALLOW_SIGN$1);
        b = this.consume(NUMBER$4);
      } // -n
      // -n <signed-integer>
      // -n ['+' | '-'] <signless-integer>
      // -n- <signless-integer>
      // <dashndashdigit-ident>
      else if (this.scanner.tokenType === IDENT$3 && cmpChar$3(this.scanner.source, this.scanner.tokenStart, HYPHENMINUS$3)) {
          a = '-1';
          expectCharCode.call(this, 1, N$4);

          switch (this.scanner.getTokenLength()) {
            // -n
            // -n <signed-integer>
            // -n ['+' | '-'] <signless-integer>
            case 2:
              this.scanner.next();
              b = consumeB$1.call(this);
              break;
            // -n- <signless-integer>

            case 3:
              expectCharCode.call(this, 2, HYPHENMINUS$3);
              this.scanner.next();
              this.scanner.skipSC();
              checkTokenIsInteger.call(this, DISALLOW_SIGN$1);
              b = '-' + this.consume(NUMBER$4);
              break;
            // <dashndashdigit-ident>

            default:
              expectCharCode.call(this, 2, HYPHENMINUS$3);
              checkInteger$1.call(this, 3, DISALLOW_SIGN$1);
              this.scanner.next();
              b = this.scanner.substrToCursor(start + 2);
          }
        } // '+'? n
        // '+'? n <signed-integer>
        // '+'? n ['+' | '-'] <signless-integer>
        // '+'? n- <signless-integer>
        // '+'? <ndashdigit-ident>
        else if (this.scanner.tokenType === IDENT$3 || this.scanner.isDelim(PLUSSIGN$3) && this.scanner.lookupType(1) === IDENT$3) {
            var sign = 0;
            a = '1'; // just ignore a plus

            if (this.scanner.isDelim(PLUSSIGN$3)) {
              sign = 1;
              this.scanner.next();
            }

            expectCharCode.call(this, 0, N$4);

            switch (this.scanner.getTokenLength()) {
              // '+'? n
              // '+'? n <signed-integer>
              // '+'? n ['+' | '-'] <signless-integer>
              case 1:
                this.scanner.next();
                b = consumeB$1.call(this);
                break;
              // '+'? n- <signless-integer>

              case 2:
                expectCharCode.call(this, 1, HYPHENMINUS$3);
                this.scanner.next();
                this.scanner.skipSC();
                checkTokenIsInteger.call(this, DISALLOW_SIGN$1);
                b = '-' + this.consume(NUMBER$4);
                break;
              // '+'? <ndashdigit-ident>

              default:
                expectCharCode.call(this, 1, HYPHENMINUS$3);
                checkInteger$1.call(this, 2, DISALLOW_SIGN$1);
                this.scanner.next();
                b = this.scanner.substrToCursor(start + sign + 1);
            }
          } // <ndashdigit-dimension>
          // <ndash-dimension> <signless-integer>
          // <n-dimension>
          // <n-dimension> <signed-integer>
          // <n-dimension> ['+' | '-'] <signless-integer>
          else if (this.scanner.tokenType === DIMENSION$2) {
              var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
              var sign = code === PLUSSIGN$3 || code === HYPHENMINUS$3;

              for (var i = this.scanner.tokenStart + sign; i < this.scanner.tokenEnd; i++) {
                if (!isDigit$4(this.scanner.source.charCodeAt(i))) {
                  break;
                }
              }

              if (i === this.scanner.tokenStart + sign) {
                this.error('Integer is expected', this.scanner.tokenStart + sign);
              }

              expectCharCode.call(this, i - this.scanner.tokenStart, N$4);
              a = this.scanner.source.substring(start, i); // <n-dimension>
              // <n-dimension> <signed-integer>
              // <n-dimension> ['+' | '-'] <signless-integer>

              if (i + 1 === this.scanner.tokenEnd) {
                this.scanner.next();
                b = consumeB$1.call(this);
              } else {
                expectCharCode.call(this, i - this.scanner.tokenStart + 1, HYPHENMINUS$3); // <ndash-dimension> <signless-integer>

                if (i + 2 === this.scanner.tokenEnd) {
                  this.scanner.next();
                  this.scanner.skipSC();
                  checkTokenIsInteger.call(this, DISALLOW_SIGN$1);
                  b = '-' + this.consume(NUMBER$4);
                } // <ndashdigit-dimension>
                else {
                    checkInteger$1.call(this, i - this.scanner.tokenStart + 2, DISALLOW_SIGN$1);
                    this.scanner.next();
                    b = this.scanner.substrToCursor(i + 1);
                  }
              }
            } else {
              this.error();
            }

      if (a !== null && a.charCodeAt(0) === PLUSSIGN$3) {
        a = a.substr(1);
      }

      if (b !== null && b.charCodeAt(0) === PLUSSIGN$3) {
        b = b.substr(1);
      }

      return {
        type: 'AnPlusB',
        loc: this.getLocation(start, this.scanner.tokenStart),
        a: a,
        b: b
      };
    },
    generate: function generate(node) {
      var a = node.a !== null && node.a !== undefined;
      var b = node.b !== null && node.b !== undefined;

      if (a) {
        this.chunk(node.a === '+1' ? '+n' : // eslint-disable-line operator-linebreak, indent
        node.a === '1' ? 'n' : // eslint-disable-line operator-linebreak, indent
        node.a === '-1' ? '-n' : // eslint-disable-line operator-linebreak, indent
        node.a + 'n' // eslint-disable-line operator-linebreak, indent
        );

        if (b) {
          b = String(node.b);

          if (b.charAt(0) === '-' || b.charAt(0) === '+') {
            this.chunk(b.charAt(0));
            this.chunk(b.substr(1));
          } else {
            this.chunk('+');
            this.chunk(b);
          }
        }
      } else {
        this.chunk(String(node.b));
      }
    }
  };

  var TYPE$a = tokenizer.TYPE;
  var WhiteSpace = TYPE$a.WhiteSpace;
  var Semicolon = TYPE$a.Semicolon;
  var LeftCurlyBracket = TYPE$a.LeftCurlyBracket;
  var Delim = TYPE$a.Delim;
  var EXCLAMATIONMARK$1 = 0x0021; // U+0021 EXCLAMATION MARK (!)

  function getOffsetExcludeWS() {
    if (this.scanner.tokenIndex > 0) {
      if (this.scanner.lookupType(-1) === WhiteSpace) {
        return this.scanner.tokenIndex > 1 ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1) : this.scanner.firstCharOffset;
      }
    }

    return this.scanner.tokenStart;
  } // 0, 0, false


  function balanceEnd() {
    return 0;
  } // LEFTCURLYBRACKET, 0, false


  function leftCurlyBracket(tokenType) {
    return tokenType === LeftCurlyBracket ? 1 : 0;
  } // LEFTCURLYBRACKET, SEMICOLON, false


  function leftCurlyBracketOrSemicolon(tokenType) {
    return tokenType === LeftCurlyBracket || tokenType === Semicolon ? 1 : 0;
  } // EXCLAMATIONMARK, SEMICOLON, false


  function exclamationMarkOrSemicolon(tokenType, source, offset) {
    if (tokenType === Delim && source.charCodeAt(offset) === EXCLAMATIONMARK$1) {
      return 1;
    }

    return tokenType === Semicolon ? 1 : 0;
  } // 0, SEMICOLON, true


  function semicolonIncluded(tokenType) {
    return tokenType === Semicolon ? 2 : 0;
  }

  var Raw = {
    name: 'Raw',
    structure: {
      value: String
    },
    parse: function parse(startToken, mode, excludeWhiteSpace) {
      var startOffset = this.scanner.getTokenStart(startToken);
      var endOffset;
      this.scanner.skip(this.scanner.getRawLength(startToken, mode || balanceEnd));

      if (excludeWhiteSpace && this.scanner.tokenStart > startOffset) {
        endOffset = getOffsetExcludeWS.call(this);
      } else {
        endOffset = this.scanner.tokenStart;
      }

      return {
        type: 'Raw',
        loc: this.getLocation(startOffset, endOffset),
        value: this.scanner.source.substring(startOffset, endOffset)
      };
    },
    generate: function generate(node) {
      this.chunk(node.value);
    },
    mode: {
      default: balanceEnd,
      leftCurlyBracket: leftCurlyBracket,
      leftCurlyBracketOrSemicolon: leftCurlyBracketOrSemicolon,
      exclamationMarkOrSemicolon: exclamationMarkOrSemicolon,
      semicolonIncluded: semicolonIncluded
    }
  };

  var TYPE$b = tokenizer.TYPE;
  var rawMode = Raw.mode;
  var ATKEYWORD = TYPE$b.AtKeyword;
  var SEMICOLON = TYPE$b.Semicolon;
  var LEFTCURLYBRACKET$1 = TYPE$b.LeftCurlyBracket;
  var RIGHTCURLYBRACKET$1 = TYPE$b.RightCurlyBracket;

  function consumeRaw(startToken) {
    return this.Raw(startToken, rawMode.leftCurlyBracketOrSemicolon, true);
  }

  function isDeclarationBlockAtrule() {
    for (var offset = 1, type; type = this.scanner.lookupType(offset); offset++) {
      if (type === RIGHTCURLYBRACKET$1) {
        return true;
      }

      if (type === LEFTCURLYBRACKET$1 || type === ATKEYWORD) {
        return false;
      }
    }

    return false;
  }

  var Atrule = {
    name: 'Atrule',
    structure: {
      name: String,
      prelude: ['AtrulePrelude', 'Raw', null],
      block: ['Block', null]
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var name;
      var nameLowerCase;
      var prelude = null;
      var block = null;
      this.eat(ATKEYWORD);
      name = this.scanner.substrToCursor(start + 1);
      nameLowerCase = name.toLowerCase();
      this.scanner.skipSC(); // parse prelude

      if (this.scanner.eof === false && this.scanner.tokenType !== LEFTCURLYBRACKET$1 && this.scanner.tokenType !== SEMICOLON) {
        if (this.parseAtrulePrelude) {
          prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name), consumeRaw); // turn empty AtrulePrelude into null

          if (prelude.type === 'AtrulePrelude' && prelude.children.head === null) {
            prelude = null;
          }
        } else {
          prelude = consumeRaw.call(this, this.scanner.tokenIndex);
        }

        this.scanner.skipSC();
      }

      switch (this.scanner.tokenType) {
        case SEMICOLON:
          this.scanner.next();
          break;

        case LEFTCURLYBRACKET$1:
          if (this.atrule.hasOwnProperty(nameLowerCase) && typeof this.atrule[nameLowerCase].block === 'function') {
            block = this.atrule[nameLowerCase].block.call(this);
          } else {
            // TODO: should consume block content as Raw?
            block = this.Block(isDeclarationBlockAtrule.call(this));
          }

          break;
      }

      return {
        type: 'Atrule',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: name,
        prelude: prelude,
        block: block
      };
    },
    generate: function generate(node) {
      this.chunk('@');
      this.chunk(node.name);

      if (node.prelude !== null) {
        this.chunk(' ');
        this.node(node.prelude);
      }

      if (node.block) {
        this.node(node.block);
      } else {
        this.chunk(';');
      }
    },
    walkContext: 'atrule'
  };

  var TYPE$c = tokenizer.TYPE;
  var SEMICOLON$1 = TYPE$c.Semicolon;
  var LEFTCURLYBRACKET$2 = TYPE$c.LeftCurlyBracket;
  var AtrulePrelude = {
    name: 'AtrulePrelude',
    structure: {
      children: [[]]
    },
    parse: function parse(name) {
      var children = null;

      if (name !== null) {
        name = name.toLowerCase();
      }

      this.scanner.skipSC();

      if (this.atrule.hasOwnProperty(name) && typeof this.atrule[name].prelude === 'function') {
        // custom consumer
        children = this.atrule[name].prelude.call(this);
      } else {
        // default consumer
        children = this.readSequence(this.scope.AtrulePrelude);
      }

      this.scanner.skipSC();

      if (this.scanner.eof !== true && this.scanner.tokenType !== LEFTCURLYBRACKET$2 && this.scanner.tokenType !== SEMICOLON$1) {
        this.error('Semicolon or block is expected');
      }

      if (children === null) {
        children = this.createList();
      }

      return {
        type: 'AtrulePrelude',
        loc: this.getLocationFromList(children),
        children: children
      };
    },
    generate: function generate(node) {
      this.children(node);
    },
    walkContext: 'atrulePrelude'
  };

  var TYPE$d = tokenizer.TYPE;
  var IDENT$4 = TYPE$d.Ident;
  var STRING = TYPE$d.String;
  var COLON = TYPE$d.Colon;
  var LEFTSQUAREBRACKET$1 = TYPE$d.LeftSquareBracket;
  var RIGHTSQUAREBRACKET$1 = TYPE$d.RightSquareBracket;
  var DOLLARSIGN = 0x0024; // U+0024 DOLLAR SIGN ($)

  var ASTERISK$1 = 0x002A; // U+002A ASTERISK (*)

  var EQUALSSIGN = 0x003D; // U+003D EQUALS SIGN (=)

  var CIRCUMFLEXACCENT = 0x005E; // U+005E (^)

  var VERTICALLINE$1 = 0x007C; // U+007C VERTICAL LINE (|)

  var TILDE = 0x007E; // U+007E TILDE (~)

  function getAttributeName() {
    if (this.scanner.eof) {
      this.error('Unexpected end of input');
    }

    var start = this.scanner.tokenStart;
    var expectIdent = false;
    var checkColon = true;

    if (this.scanner.isDelim(ASTERISK$1)) {
      expectIdent = true;
      checkColon = false;
      this.scanner.next();
    } else if (!this.scanner.isDelim(VERTICALLINE$1)) {
      this.eat(IDENT$4);
    }

    if (this.scanner.isDelim(VERTICALLINE$1)) {
      if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) !== EQUALSSIGN) {
        this.scanner.next();
        this.eat(IDENT$4);
      } else if (expectIdent) {
        this.error('Identifier is expected', this.scanner.tokenEnd);
      }
    } else if (expectIdent) {
      this.error('Vertical line is expected');
    }

    if (checkColon && this.scanner.tokenType === COLON) {
      this.scanner.next();
      this.eat(IDENT$4);
    }

    return {
      type: 'Identifier',
      loc: this.getLocation(start, this.scanner.tokenStart),
      name: this.scanner.substrToCursor(start)
    };
  }

  function getOperator() {
    var start = this.scanner.tokenStart;
    var code = this.scanner.source.charCodeAt(start);

    if (code !== EQUALSSIGN && // =
    code !== TILDE && // ~=
    code !== CIRCUMFLEXACCENT && // ^=
    code !== DOLLARSIGN && // $=
    code !== ASTERISK$1 && // *=
    code !== VERTICALLINE$1 // |=
    ) {
        this.error('Attribute selector (=, ~=, ^=, $=, *=, |=) is expected');
      }

    this.scanner.next();

    if (code !== EQUALSSIGN) {
      if (!this.scanner.isDelim(EQUALSSIGN)) {
        this.error('Equal sign is expected');
      }

      this.scanner.next();
    }

    return this.scanner.substrToCursor(start);
  } // '[' <wq-name> ']'
  // '[' <wq-name> <attr-matcher> [ <string-token> | <ident-token> ] <attr-modifier>? ']'


  var AttributeSelector = {
    name: 'AttributeSelector',
    structure: {
      name: 'Identifier',
      matcher: [String, null],
      value: ['String', 'Identifier', null],
      flags: [String, null]
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var name;
      var matcher = null;
      var value = null;
      var flags = null;
      this.eat(LEFTSQUAREBRACKET$1);
      this.scanner.skipSC();
      name = getAttributeName.call(this);
      this.scanner.skipSC();

      if (this.scanner.tokenType !== RIGHTSQUAREBRACKET$1) {
        // avoid case `[name i]`
        if (this.scanner.tokenType !== IDENT$4) {
          matcher = getOperator.call(this);
          this.scanner.skipSC();
          value = this.scanner.tokenType === STRING ? this.String() : this.Identifier();
          this.scanner.skipSC();
        } // attribute flags


        if (this.scanner.tokenType === IDENT$4) {
          flags = this.scanner.getTokenValue();
          this.scanner.next();
          this.scanner.skipSC();
        }
      }

      this.eat(RIGHTSQUAREBRACKET$1);
      return {
        type: 'AttributeSelector',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: name,
        matcher: matcher,
        value: value,
        flags: flags
      };
    },
    generate: function generate(node) {
      var flagsPrefix = ' ';
      this.chunk('[');
      this.node(node.name);

      if (node.matcher !== null) {
        this.chunk(node.matcher);

        if (node.value !== null) {
          this.node(node.value); // space between string and flags is not required

          if (node.value.type === 'String') {
            flagsPrefix = '';
          }
        }
      }

      if (node.flags !== null) {
        this.chunk(flagsPrefix);
        this.chunk(node.flags);
      }

      this.chunk(']');
    }
  };

  var TYPE$e = tokenizer.TYPE;
  var rawMode$1 = Raw.mode;
  var WHITESPACE$5 = TYPE$e.WhiteSpace;
  var COMMENT$4 = TYPE$e.Comment;
  var SEMICOLON$2 = TYPE$e.Semicolon;
  var ATKEYWORD$1 = TYPE$e.AtKeyword;
  var LEFTCURLYBRACKET$3 = TYPE$e.LeftCurlyBracket;
  var RIGHTCURLYBRACKET$2 = TYPE$e.RightCurlyBracket;

  function consumeRaw$1(startToken) {
    return this.Raw(startToken, null, true);
  }

  function consumeRule() {
    return this.parseWithFallback(this.Rule, consumeRaw$1);
  }

  function consumeRawDeclaration(startToken) {
    return this.Raw(startToken, rawMode$1.semicolonIncluded, true);
  }

  function consumeDeclaration() {
    if (this.scanner.tokenType === SEMICOLON$2) {
      return consumeRawDeclaration.call(this, this.scanner.tokenIndex);
    }

    var node = this.parseWithFallback(this.Declaration, consumeRawDeclaration);

    if (this.scanner.tokenType === SEMICOLON$2) {
      this.scanner.next();
    }

    return node;
  }

  var Block = {
    name: 'Block',
    structure: {
      children: [['Atrule', 'Rule', 'Declaration']]
    },
    parse: function parse(isDeclaration) {
      var consumer = isDeclaration ? consumeDeclaration : consumeRule;
      var start = this.scanner.tokenStart;
      var children = this.createList();
      this.eat(LEFTCURLYBRACKET$3);

      scan: while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
          case RIGHTCURLYBRACKET$2:
            break scan;

          case WHITESPACE$5:
          case COMMENT$4:
            this.scanner.next();
            break;

          case ATKEYWORD$1:
            children.push(this.parseWithFallback(this.Atrule, consumeRaw$1));
            break;

          default:
            children.push(consumer.call(this));
        }
      }

      if (!this.scanner.eof) {
        this.eat(RIGHTCURLYBRACKET$2);
      }

      return {
        type: 'Block',
        loc: this.getLocation(start, this.scanner.tokenStart),
        children: children
      };
    },
    generate: function generate(node) {
      this.chunk('{');
      this.children(node, function (prev) {
        if (prev.type === 'Declaration') {
          this.chunk(';');
        }
      });
      this.chunk('}');
    },
    walkContext: 'block'
  };

  var TYPE$f = tokenizer.TYPE;
  var LEFTSQUAREBRACKET$2 = TYPE$f.LeftSquareBracket;
  var RIGHTSQUAREBRACKET$2 = TYPE$f.RightSquareBracket;
  var Brackets = {
    name: 'Brackets',
    structure: {
      children: [[]]
    },
    parse: function parse(readSequence, recognizer) {
      var start = this.scanner.tokenStart;
      var children = null;
      this.eat(LEFTSQUAREBRACKET$2);
      children = readSequence.call(this, recognizer);

      if (!this.scanner.eof) {
        this.eat(RIGHTSQUAREBRACKET$2);
      }

      return {
        type: 'Brackets',
        loc: this.getLocation(start, this.scanner.tokenStart),
        children: children
      };
    },
    generate: function generate(node) {
      this.chunk('[');
      this.children(node);
      this.chunk(']');
    }
  };

  var CDC = tokenizer.TYPE.CDC;
  var CDC_1 = {
    name: 'CDC',
    structure: [],
    parse: function parse() {
      var start = this.scanner.tokenStart;
      this.eat(CDC); // -->

      return {
        type: 'CDC',
        loc: this.getLocation(start, this.scanner.tokenStart)
      };
    },
    generate: function generate() {
      this.chunk('-->');
    }
  };

  var CDO = tokenizer.TYPE.CDO;
  var CDO_1 = {
    name: 'CDO',
    structure: [],
    parse: function parse() {
      var start = this.scanner.tokenStart;
      this.eat(CDO); // <!--

      return {
        type: 'CDO',
        loc: this.getLocation(start, this.scanner.tokenStart)
      };
    },
    generate: function generate() {
      this.chunk('<!--');
    }
  };

  var TYPE$g = tokenizer.TYPE;
  var IDENT$5 = TYPE$g.Ident;
  var FULLSTOP = 0x002E; // U+002E FULL STOP (.)
  // '.' ident

  var ClassSelector = {
    name: 'ClassSelector',
    structure: {
      name: String
    },
    parse: function parse() {
      if (!this.scanner.isDelim(FULLSTOP)) {
        this.error('Full stop is expected');
      }

      this.scanner.next();
      return {
        type: 'ClassSelector',
        loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
        name: this.consume(IDENT$5)
      };
    },
    generate: function generate(node) {
      this.chunk('.');
      this.chunk(node.name);
    }
  };

  var TYPE$h = tokenizer.TYPE;
  var IDENT$6 = TYPE$h.Ident;
  var PLUSSIGN$4 = 0x002B; // U+002B PLUS SIGN (+)

  var SOLIDUS = 0x002F; // U+002F SOLIDUS (/)

  var GREATERTHANSIGN$1 = 0x003E; // U+003E GREATER-THAN SIGN (>)

  var TILDE$1 = 0x007E; // U+007E TILDE (~)
  // + | > | ~ | /deep/

  var Combinator = {
    name: 'Combinator',
    structure: {
      name: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

      switch (code) {
        case GREATERTHANSIGN$1:
        case PLUSSIGN$4:
        case TILDE$1:
          this.scanner.next();
          break;

        case SOLIDUS:
          this.scanner.next();

          if (this.scanner.tokenType !== IDENT$6 || this.scanner.lookupValue(0, 'deep') === false) {
            this.error('Identifier `deep` is expected');
          }

          this.scanner.next();

          if (!this.scanner.isDelim(SOLIDUS)) {
            this.error('Solidus is expected');
          }

          this.scanner.next();
          break;

        default:
          this.error('Combinator is expected');
      }

      return {
        type: 'Combinator',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start)
      };
    },
    generate: function generate(node) {
      this.chunk(node.name);
    }
  };

  var TYPE$i = tokenizer.TYPE;
  var COMMENT$5 = TYPE$i.Comment;
  var ASTERISK$2 = 0x002A; // U+002A ASTERISK (*)

  var SOLIDUS$1 = 0x002F; // U+002F SOLIDUS (/)
  // '/*' .* '*/'

  var Comment = {
    name: 'Comment',
    structure: {
      value: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var end = this.scanner.tokenEnd;
      this.eat(COMMENT$5);

      if (end - start + 2 >= 2 && this.scanner.source.charCodeAt(end - 2) === ASTERISK$2 && this.scanner.source.charCodeAt(end - 1) === SOLIDUS$1) {
        end -= 2;
      }

      return {
        type: 'Comment',
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.source.substring(start + 2, end)
      };
    },
    generate: function generate(node) {
      this.chunk('/*');
      this.chunk(node.value);
      this.chunk('*/');
    }
  };

  var isCustomProperty$1 = names.isCustomProperty;
  var TYPE$j = tokenizer.TYPE;
  var rawMode$2 = Raw.mode;
  var IDENT$7 = TYPE$j.Ident;
  var HASH$1 = TYPE$j.Hash;
  var COLON$1 = TYPE$j.Colon;
  var SEMICOLON$3 = TYPE$j.Semicolon;
  var DELIM$2 = TYPE$j.Delim;
  var EXCLAMATIONMARK$2 = 0x0021; // U+0021 EXCLAMATION MARK (!)

  var NUMBERSIGN$2 = 0x0023; // U+0023 NUMBER SIGN (#)

  var DOLLARSIGN$1 = 0x0024; // U+0024 DOLLAR SIGN ($)

  var AMPERSAND$1 = 0x0026; // U+0026 ANPERSAND (&)

  var ASTERISK$3 = 0x002A; // U+002A ASTERISK (*)

  var PLUSSIGN$5 = 0x002B; // U+002B PLUS SIGN (+)

  var SOLIDUS$2 = 0x002F; // U+002F SOLIDUS (/)

  function consumeValueRaw(startToken) {
    return this.Raw(startToken, rawMode$2.exclamationMarkOrSemicolon, true);
  }

  function consumeCustomPropertyRaw(startToken) {
    return this.Raw(startToken, rawMode$2.exclamationMarkOrSemicolon, false);
  }

  function consumeValue() {
    var startValueToken = this.scanner.tokenIndex;
    var value = this.Value();

    if (value.type !== 'Raw' && this.scanner.eof === false && this.scanner.tokenType !== SEMICOLON$3 && this.scanner.isDelim(EXCLAMATIONMARK$2) === false && this.scanner.isBalanceEdge(startValueToken) === false) {
      this.error();
    }

    return value;
  }

  var Declaration = {
    name: 'Declaration',
    structure: {
      important: [Boolean, String],
      property: String,
      value: ['Value', 'Raw']
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var startToken = this.scanner.tokenIndex;
      var property = readProperty$1.call(this);
      var customProperty = isCustomProperty$1(property);
      var parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
      var consumeRaw = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
      var important = false;
      var value;
      this.scanner.skipSC();
      this.eat(COLON$1);

      if (!customProperty) {
        this.scanner.skipSC();
      }

      if (parseValue) {
        value = this.parseWithFallback(consumeValue, consumeRaw);
      } else {
        value = consumeRaw.call(this, this.scanner.tokenIndex);
      }

      if (this.scanner.isDelim(EXCLAMATIONMARK$2)) {
        important = getImportant.call(this);
        this.scanner.skipSC();
      } // Do not include semicolon to range per spec
      // https://drafts.csswg.org/css-syntax/#declaration-diagram


      if (this.scanner.eof === false && this.scanner.tokenType !== SEMICOLON$3 && this.scanner.isBalanceEdge(startToken) === false) {
        this.error();
      }

      return {
        type: 'Declaration',
        loc: this.getLocation(start, this.scanner.tokenStart),
        important: important,
        property: property,
        value: value
      };
    },
    generate: function generate(node) {
      this.chunk(node.property);
      this.chunk(':');
      this.node(node.value);

      if (node.important) {
        this.chunk(node.important === true ? '!important' : '!' + node.important);
      }
    },
    walkContext: 'declaration'
  };

  function readProperty$1() {
    var start = this.scanner.tokenStart;

    if (this.scanner.tokenType === DELIM$2) {
      switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
        case ASTERISK$3:
        case DOLLARSIGN$1:
        case PLUSSIGN$5:
        case NUMBERSIGN$2:
        case AMPERSAND$1:
          this.scanner.next();
          break;
        // TODO: not sure we should support this hack

        case SOLIDUS$2:
          this.scanner.next();

          if (this.scanner.isDelim(SOLIDUS$2)) {
            this.scanner.next();
          }

          break;
      }
    }

    if (this.scanner.tokenType === HASH$1) {
      this.eat(HASH$1);
    } else {
      this.eat(IDENT$7);
    }

    return this.scanner.substrToCursor(start);
  } // ! ws* important


  function getImportant() {
    this.eat(DELIM$2);
    this.scanner.skipSC();
    var important = this.consume(IDENT$7); // store original value in case it differ from `important`
    // for better original source restoring and hacks like `!ie` support

    return important === 'important' ? true : important;
  }

  var TYPE$k = tokenizer.TYPE;
  var rawMode$3 = Raw.mode;
  var WHITESPACE$6 = TYPE$k.WhiteSpace;
  var COMMENT$6 = TYPE$k.Comment;
  var SEMICOLON$4 = TYPE$k.Semicolon;

  function consumeRaw$2(startToken) {
    return this.Raw(startToken, rawMode$3.semicolonIncluded, true);
  }

  var DeclarationList = {
    name: 'DeclarationList',
    structure: {
      children: [['Declaration']]
    },
    parse: function parse() {
      var children = this.createList();

      scan: while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
          case WHITESPACE$6:
          case COMMENT$6:
          case SEMICOLON$4:
            this.scanner.next();
            break;

          default:
            children.push(this.parseWithFallback(this.Declaration, consumeRaw$2));
        }
      }

      return {
        type: 'DeclarationList',
        loc: this.getLocationFromList(children),
        children: children
      };
    },
    generate: function generate(node) {
      this.children(node, function (prev) {
        if (prev.type === 'Declaration') {
          this.chunk(';');
        }
      });
    }
  };

  var consumeNumber$3 = utils.consumeNumber;
  var TYPE$l = tokenizer.TYPE;
  var DIMENSION$3 = TYPE$l.Dimension;
  var Dimension = {
    name: 'Dimension',
    structure: {
      value: String,
      unit: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var numberEnd = consumeNumber$3(this.scanner.source, start);
      this.eat(DIMENSION$3);
      return {
        type: 'Dimension',
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.source.substring(start, numberEnd),
        unit: this.scanner.source.substring(numberEnd, this.scanner.tokenStart)
      };
    },
    generate: function generate(node) {
      this.chunk(node.value);
      this.chunk(node.unit);
    }
  };

  var TYPE$m = tokenizer.TYPE;
  var RIGHTPARENTHESIS$2 = TYPE$m.RightParenthesis; // <function-token> <sequence> )

  var _Function = {
    name: 'Function',
    structure: {
      name: String,
      children: [[]]
    },
    parse: function parse(readSequence, recognizer) {
      var start = this.scanner.tokenStart;
      var name = this.consumeFunctionName();
      var nameLowerCase = name.toLowerCase();
      var children;
      children = recognizer.hasOwnProperty(nameLowerCase) ? recognizer[nameLowerCase].call(this, recognizer) : readSequence.call(this, recognizer);

      if (!this.scanner.eof) {
        this.eat(RIGHTPARENTHESIS$2);
      }

      return {
        type: 'Function',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: name,
        children: children
      };
    },
    generate: function generate(node) {
      this.chunk(node.name);
      this.chunk('(');
      this.children(node);
      this.chunk(')');
    },
    walkContext: 'function'
  };

  var TYPE$n = tokenizer.TYPE;
  var HASH$2 = TYPE$n.Hash; // '#' ident

  var HexColor = {
    name: 'HexColor',
    structure: {
      value: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      this.eat(HASH$2);
      return {
        type: 'HexColor',
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.substrToCursor(start + 1)
      };
    },
    generate: function generate(node) {
      this.chunk('#');
      this.chunk(node.value);
    }
  };

  var TYPE$o = tokenizer.TYPE;
  var IDENT$8 = TYPE$o.Ident;
  var Identifier = {
    name: 'Identifier',
    structure: {
      name: String
    },
    parse: function parse() {
      return {
        type: 'Identifier',
        loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
        name: this.consume(IDENT$8)
      };
    },
    generate: function generate(node) {
      this.chunk(node.name);
    }
  };

  var TYPE$p = tokenizer.TYPE;
  var HASH$3 = TYPE$p.Hash; // <hash-token>

  var IdSelector = {
    name: 'IdSelector',
    structure: {
      name: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart; // TODO: check value is an ident

      this.eat(HASH$3);
      return {
        type: 'IdSelector',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start + 1)
      };
    },
    generate: function generate(node) {
      this.chunk('#');
      this.chunk(node.name);
    }
  };

  var TYPE$q = tokenizer.TYPE;
  var IDENT$9 = TYPE$q.Ident;
  var NUMBER$5 = TYPE$q.Number;
  var DIMENSION$4 = TYPE$q.Dimension;
  var LEFTPARENTHESIS$2 = TYPE$q.LeftParenthesis;
  var RIGHTPARENTHESIS$3 = TYPE$q.RightParenthesis;
  var COLON$2 = TYPE$q.Colon;
  var DELIM$3 = TYPE$q.Delim;
  var MediaFeature = {
    name: 'MediaFeature',
    structure: {
      name: String,
      value: ['Identifier', 'Number', 'Dimension', 'Ratio', null]
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var name;
      var value = null;
      this.eat(LEFTPARENTHESIS$2);
      this.scanner.skipSC();
      name = this.consume(IDENT$9);
      this.scanner.skipSC();

      if (this.scanner.tokenType !== RIGHTPARENTHESIS$3) {
        this.eat(COLON$2);
        this.scanner.skipSC();

        switch (this.scanner.tokenType) {
          case NUMBER$5:
            if (this.lookupNonWSType(1) === DELIM$3) {
              value = this.Ratio();
            } else {
              value = this.Number();
            }

            break;

          case DIMENSION$4:
            value = this.Dimension();
            break;

          case IDENT$9:
            value = this.Identifier();
            break;

          default:
            this.error('Number, dimension, ratio or identifier is expected');
        }

        this.scanner.skipSC();
      }

      this.eat(RIGHTPARENTHESIS$3);
      return {
        type: 'MediaFeature',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: name,
        value: value
      };
    },
    generate: function generate(node) {
      this.chunk('(');
      this.chunk(node.name);

      if (node.value !== null) {
        this.chunk(':');
        this.node(node.value);
      }

      this.chunk(')');
    }
  };

  var TYPE$r = tokenizer.TYPE;
  var WHITESPACE$7 = TYPE$r.WhiteSpace;
  var COMMENT$7 = TYPE$r.Comment;
  var IDENT$a = TYPE$r.Ident;
  var LEFTPARENTHESIS$3 = TYPE$r.LeftParenthesis;
  var MediaQuery = {
    name: 'MediaQuery',
    structure: {
      children: [['Identifier', 'MediaFeature', 'WhiteSpace']]
    },
    parse: function parse() {
      this.scanner.skipSC();
      var children = this.createList();
      var child = null;
      var space = null;

      scan: while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
          case COMMENT$7:
            this.scanner.next();
            continue;

          case WHITESPACE$7:
            space = this.WhiteSpace();
            continue;

          case IDENT$a:
            child = this.Identifier();
            break;

          case LEFTPARENTHESIS$3:
            child = this.MediaFeature();
            break;

          default:
            break scan;
        }

        if (space !== null) {
          children.push(space);
          space = null;
        }

        children.push(child);
      }

      if (child === null) {
        this.error('Identifier or parenthesis is expected');
      }

      return {
        type: 'MediaQuery',
        loc: this.getLocationFromList(children),
        children: children
      };
    },
    generate: function generate(node) {
      this.children(node);
    }
  };

  var COMMA$1 = tokenizer.TYPE.Comma;
  var MediaQueryList = {
    name: 'MediaQueryList',
    structure: {
      children: [['MediaQuery']]
    },
    parse: function parse(relative) {
      var children = this.createList();
      this.scanner.skipSC();

      while (!this.scanner.eof) {
        children.push(this.MediaQuery(relative));

        if (this.scanner.tokenType !== COMMA$1) {
          break;
        }

        this.scanner.next();
      }

      return {
        type: 'MediaQueryList',
        loc: this.getLocationFromList(children),
        children: children
      };
    },
    generate: function generate(node) {
      this.children(node, function () {
        this.chunk(',');
      });
    }
  };

  var Nth = {
    name: 'Nth',
    structure: {
      nth: ['AnPlusB', 'Identifier'],
      selector: ['SelectorList', null]
    },
    parse: function parse(allowOfClause) {
      this.scanner.skipSC();
      var start = this.scanner.tokenStart;
      var end = start;
      var selector = null;
      var query;

      if (this.scanner.lookupValue(0, 'odd') || this.scanner.lookupValue(0, 'even')) {
        query = this.Identifier();
      } else {
        query = this.AnPlusB();
      }

      this.scanner.skipSC();

      if (allowOfClause && this.scanner.lookupValue(0, 'of')) {
        this.scanner.next();
        selector = this.SelectorList();

        if (this.needPositions) {
          end = this.getLastListNode(selector.children).loc.end.offset;
        }
      } else {
        if (this.needPositions) {
          end = query.loc.end.offset;
        }
      }

      return {
        type: 'Nth',
        loc: this.getLocation(start, end),
        nth: query,
        selector: selector
      };
    },
    generate: function generate(node) {
      this.node(node.nth);

      if (node.selector !== null) {
        this.chunk(' of ');
        this.node(node.selector);
      }
    }
  };

  var NUMBER$6 = tokenizer.TYPE.Number;
  var _Number = {
    name: 'Number',
    structure: {
      value: String
    },
    parse: function parse() {
      return {
        type: 'Number',
        loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
        value: this.consume(NUMBER$6)
      };
    },
    generate: function generate(node) {
      this.chunk(node.value);
    }
  };

  // '/' | '*' | ',' | ':' | '+' | '-'
  var Operator = {
    name: 'Operator',
    structure: {
      value: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      this.scanner.next();
      return {
        type: 'Operator',
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.substrToCursor(start)
      };
    },
    generate: function generate(node) {
      this.chunk(node.value);
    }
  };

  var TYPE$s = tokenizer.TYPE;
  var LEFTPARENTHESIS$4 = TYPE$s.LeftParenthesis;
  var RIGHTPARENTHESIS$4 = TYPE$s.RightParenthesis;
  var Parentheses = {
    name: 'Parentheses',
    structure: {
      children: [[]]
    },
    parse: function parse(readSequence, recognizer) {
      var start = this.scanner.tokenStart;
      var children = null;
      this.eat(LEFTPARENTHESIS$4);
      children = readSequence.call(this, recognizer);

      if (!this.scanner.eof) {
        this.eat(RIGHTPARENTHESIS$4);
      }

      return {
        type: 'Parentheses',
        loc: this.getLocation(start, this.scanner.tokenStart),
        children: children
      };
    },
    generate: function generate(node) {
      this.chunk('(');
      this.children(node);
      this.chunk(')');
    }
  };

  var consumeNumber$4 = utils.consumeNumber;
  var TYPE$t = tokenizer.TYPE;
  var PERCENTAGE$1 = TYPE$t.Percentage;
  var Percentage = {
    name: 'Percentage',
    structure: {
      value: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var numberEnd = consumeNumber$4(this.scanner.source, start);
      this.eat(PERCENTAGE$1);
      return {
        type: 'Percentage',
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.source.substring(start, numberEnd)
      };
    },
    generate: function generate(node) {
      this.chunk(node.value);
      this.chunk('%');
    }
  };

  var TYPE$u = tokenizer.TYPE;
  var IDENT$b = TYPE$u.Ident;
  var FUNCTION$1 = TYPE$u.Function;
  var COLON$3 = TYPE$u.Colon;
  var RIGHTPARENTHESIS$5 = TYPE$u.RightParenthesis; // : [ <ident> | <function-token> <any-value>? ) ]

  var PseudoClassSelector = {
    name: 'PseudoClassSelector',
    structure: {
      name: String,
      children: [['Raw'], null]
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var children = null;
      var name;
      var nameLowerCase;
      this.eat(COLON$3);

      if (this.scanner.tokenType === FUNCTION$1) {
        name = this.consumeFunctionName();
        nameLowerCase = name.toLowerCase();

        if (this.pseudo.hasOwnProperty(nameLowerCase)) {
          this.scanner.skipSC();
          children = this.pseudo[nameLowerCase].call(this);
          this.scanner.skipSC();
        } else {
          children = this.createList();
          children.push(this.Raw(this.scanner.tokenIndex, null, false));
        }

        this.eat(RIGHTPARENTHESIS$5);
      } else {
        name = this.consume(IDENT$b);
      }

      return {
        type: 'PseudoClassSelector',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: name,
        children: children
      };
    },
    generate: function generate(node) {
      this.chunk(':');
      this.chunk(node.name);

      if (node.children !== null) {
        this.chunk('(');
        this.children(node);
        this.chunk(')');
      }
    },
    walkContext: 'function'
  };

  var TYPE$v = tokenizer.TYPE;
  var IDENT$c = TYPE$v.Ident;
  var FUNCTION$2 = TYPE$v.Function;
  var COLON$4 = TYPE$v.Colon;
  var RIGHTPARENTHESIS$6 = TYPE$v.RightParenthesis; // :: [ <ident> | <function-token> <any-value>? ) ]

  var PseudoElementSelector = {
    name: 'PseudoElementSelector',
    structure: {
      name: String,
      children: [['Raw'], null]
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var children = null;
      var name;
      var nameLowerCase;
      this.eat(COLON$4);
      this.eat(COLON$4);

      if (this.scanner.tokenType === FUNCTION$2) {
        name = this.consumeFunctionName();
        nameLowerCase = name.toLowerCase();

        if (this.pseudo.hasOwnProperty(nameLowerCase)) {
          this.scanner.skipSC();
          children = this.pseudo[nameLowerCase].call(this);
          this.scanner.skipSC();
        } else {
          children = this.createList();
          children.push(this.Raw(this.scanner.tokenIndex, null, false));
        }

        this.eat(RIGHTPARENTHESIS$6);
      } else {
        name = this.consume(IDENT$c);
      }

      return {
        type: 'PseudoElementSelector',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: name,
        children: children
      };
    },
    generate: function generate(node) {
      this.chunk('::');
      this.chunk(node.name);

      if (node.children !== null) {
        this.chunk('(');
        this.children(node);
        this.chunk(')');
      }
    },
    walkContext: 'function'
  };

  var isDigit$5 = tokenizer.isDigit;
  var TYPE$w = tokenizer.TYPE;
  var NUMBER$7 = TYPE$w.Number;
  var DELIM$4 = TYPE$w.Delim;
  var SOLIDUS$3 = 0x002F; // U+002F SOLIDUS (/)

  var FULLSTOP$1 = 0x002E; // U+002E FULL STOP (.)
  // Terms of <ratio> should be a positive numbers (not zero or negative)
  // (see https://drafts.csswg.org/mediaqueries-3/#values)
  // However, -o-min-device-pixel-ratio takes fractional values as a ratio's term
  // and this is using by various sites. Therefore we relax checking on parse
  // to test a term is unsigned number without an exponent part.
  // Additional checking may be applied on lexer validation.

  function consumeNumber$5() {
    this.scanner.skipWS();
    var value = this.consume(NUMBER$7);

    for (var i = 0; i < value.length; i++) {
      var code = value.charCodeAt(i);

      if (!isDigit$5(code) && code !== FULLSTOP$1) {
        this.error('Unsigned number is expected', this.scanner.tokenStart - value.length + i);
      }
    }

    if (Number(value) === 0) {
      this.error('Zero number is not allowed', this.scanner.tokenStart - value.length);
    }

    return value;
  } // <positive-integer> S* '/' S* <positive-integer>


  var Ratio = {
    name: 'Ratio',
    structure: {
      left: String,
      right: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var left = consumeNumber$5.call(this);
      var right;
      this.scanner.skipWS();

      if (!this.scanner.isDelim(SOLIDUS$3)) {
        this.error('Solidus is expected');
      }

      this.eat(DELIM$4);
      right = consumeNumber$5.call(this);
      return {
        type: 'Ratio',
        loc: this.getLocation(start, this.scanner.tokenStart),
        left: left,
        right: right
      };
    },
    generate: function generate(node) {
      this.chunk(node.left);
      this.chunk('/');
      this.chunk(node.right);
    }
  };

  var TYPE$x = tokenizer.TYPE;
  var rawMode$4 = Raw.mode;
  var LEFTCURLYBRACKET$4 = TYPE$x.LeftCurlyBracket;

  function consumeRaw$3(startToken) {
    return this.Raw(startToken, rawMode$4.leftCurlyBracket, true);
  }

  function consumePrelude() {
    var prelude = this.SelectorList();

    if (prelude.type !== 'Raw' && this.scanner.eof === false && this.scanner.tokenType !== LEFTCURLYBRACKET$4) {
      this.error();
    }

    return prelude;
  }

  var Rule = {
    name: 'Rule',
    structure: {
      prelude: ['SelectorList', 'Raw'],
      block: ['Block']
    },
    parse: function parse() {
      var startToken = this.scanner.tokenIndex;
      var startOffset = this.scanner.tokenStart;
      var prelude;
      var block;

      if (this.parseRulePrelude) {
        prelude = this.parseWithFallback(consumePrelude, consumeRaw$3);
      } else {
        prelude = consumeRaw$3.call(this, startToken);
      }

      block = this.Block(true);
      return {
        type: 'Rule',
        loc: this.getLocation(startOffset, this.scanner.tokenStart),
        prelude: prelude,
        block: block
      };
    },
    generate: function generate(node) {
      this.node(node.prelude);
      this.node(node.block);
    },
    walkContext: 'rule'
  };

  var Selector = {
    name: 'Selector',
    structure: {
      children: [['TypeSelector', 'IdSelector', 'ClassSelector', 'AttributeSelector', 'PseudoClassSelector', 'PseudoElementSelector', 'Combinator', 'WhiteSpace']]
    },
    parse: function parse() {
      var children = this.readSequence(this.scope.Selector); // nothing were consumed

      if (this.getFirstListNode(children) === null) {
        this.error('Selector is expected');
      }

      return {
        type: 'Selector',
        loc: this.getLocationFromList(children),
        children: children
      };
    },
    generate: function generate(node) {
      this.children(node);
    }
  };

  var TYPE$y = tokenizer.TYPE;
  var COMMA$2 = TYPE$y.Comma;
  var SelectorList = {
    name: 'SelectorList',
    structure: {
      children: [['Selector', 'Raw']]
    },
    parse: function parse() {
      var children = this.createList();

      while (!this.scanner.eof) {
        children.push(this.Selector());

        if (this.scanner.tokenType === COMMA$2) {
          this.scanner.next();
          continue;
        }

        break;
      }

      return {
        type: 'SelectorList',
        loc: this.getLocationFromList(children),
        children: children
      };
    },
    generate: function generate(node) {
      this.children(node, function () {
        this.chunk(',');
      });
    },
    walkContext: 'selector'
  };

  var STRING$1 = tokenizer.TYPE.String;
  var _String = {
    name: 'String',
    structure: {
      value: String
    },
    parse: function parse() {
      return {
        type: 'String',
        loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
        value: this.consume(STRING$1)
      };
    },
    generate: function generate(node) {
      this.chunk(node.value);
    }
  };

  var TYPE$z = tokenizer.TYPE;
  var WHITESPACE$8 = TYPE$z.WhiteSpace;
  var COMMENT$8 = TYPE$z.Comment;
  var ATKEYWORD$2 = TYPE$z.AtKeyword;
  var CDO$1 = TYPE$z.CDO;
  var CDC$1 = TYPE$z.CDC;
  var EXCLAMATIONMARK$3 = 0x0021; // U+0021 EXCLAMATION MARK (!)

  function consumeRaw$4(startToken) {
    return this.Raw(startToken, null, false);
  }

  var StyleSheet = {
    name: 'StyleSheet',
    structure: {
      children: [['Comment', 'CDO', 'CDC', 'Atrule', 'Rule', 'Raw']]
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var children = this.createList();
      var child;

      scan: while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
          case WHITESPACE$8:
            this.scanner.next();
            continue;

          case COMMENT$8:
            // ignore comments except exclamation comments (i.e. /*! .. */) on top level
            if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK$3) {
              this.scanner.next();
              continue;
            }

            child = this.Comment();
            break;

          case CDO$1:
            // <!--
            child = this.CDO();
            break;

          case CDC$1:
            // -->
            child = this.CDC();
            break;
          // CSS Syntax Module Level 3
          // §2.2 Error handling
          // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.

          case ATKEYWORD$2:
            child = this.parseWithFallback(this.Atrule, consumeRaw$4);
            break;
          // Anything else starts a qualified rule ...

          default:
            child = this.parseWithFallback(this.Rule, consumeRaw$4);
        }

        children.push(child);
      }

      return {
        type: 'StyleSheet',
        loc: this.getLocation(start, this.scanner.tokenStart),
        children: children
      };
    },
    generate: function generate(node) {
      this.children(node);
    },
    walkContext: 'stylesheet'
  };

  var TYPE$A = tokenizer.TYPE;
  var IDENT$d = TYPE$A.Ident;
  var ASTERISK$4 = 0x002A; // U+002A ASTERISK (*)

  var VERTICALLINE$2 = 0x007C; // U+007C VERTICAL LINE (|)

  function eatIdentifierOrAsterisk() {
    if (this.scanner.tokenType !== IDENT$d && this.scanner.isDelim(ASTERISK$4) === false) {
      this.error('Identifier or asterisk is expected');
    }

    this.scanner.next();
  } // ident
  // ident|ident
  // ident|*
  // *
  // *|ident
  // *|*
  // |ident
  // |*


  var TypeSelector = {
    name: 'TypeSelector',
    structure: {
      name: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;

      if (this.scanner.isDelim(VERTICALLINE$2)) {
        this.scanner.next();
        eatIdentifierOrAsterisk.call(this);
      } else {
        eatIdentifierOrAsterisk.call(this);

        if (this.scanner.isDelim(VERTICALLINE$2)) {
          this.scanner.next();
          eatIdentifierOrAsterisk.call(this);
        }
      }

      return {
        type: 'TypeSelector',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start)
      };
    },
    generate: function generate(node) {
      this.chunk(node.name);
    }
  };

  var isHexDigit$4 = tokenizer.isHexDigit;
  var cmpChar$4 = tokenizer.cmpChar;
  var TYPE$B = tokenizer.TYPE;
  var NAME$5 = tokenizer.NAME;
  var IDENT$e = TYPE$B.Ident;
  var NUMBER$8 = TYPE$B.Number;
  var DIMENSION$5 = TYPE$B.Dimension;
  var PLUSSIGN$6 = 0x002B; // U+002B PLUS SIGN (+)

  var HYPHENMINUS$4 = 0x002D; // U+002D HYPHEN-MINUS (-)

  var QUESTIONMARK$2 = 0x003F; // U+003F QUESTION MARK (?)

  var U$1 = 0x0075; // U+0075 LATIN SMALL LETTER U (u)

  function eatHexSequence(offset, allowDash) {
    for (var pos = this.scanner.tokenStart + offset, len = 0; pos < this.scanner.tokenEnd; pos++) {
      var code = this.scanner.source.charCodeAt(pos);

      if (code === HYPHENMINUS$4 && allowDash && len !== 0) {
        if (eatHexSequence.call(this, offset + len + 1, false) === 0) {
          this.error();
        }

        return -1;
      }

      if (!isHexDigit$4(code)) {
        this.error(allowDash && len !== 0 ? 'HyphenMinus' + (len < 6 ? ' or hex digit' : '') + ' is expected' : len < 6 ? 'Hex digit is expected' : 'Unexpected input', pos);
      }

      if (++len > 6) {
        this.error('Too many hex digits', pos);
      }
    }

    this.scanner.next();
    return len;
  }

  function eatQuestionMarkSequence(max) {
    var count = 0;

    while (this.scanner.isDelim(QUESTIONMARK$2)) {
      if (++count > max) {
        this.error('Too many question marks');
      }

      this.scanner.next();
    }
  }

  function startsWith$1(code) {
    if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code) {
      this.error(NAME$5[code] + ' is expected');
    }
  } // https://drafts.csswg.org/css-syntax/#urange
  // Informally, the <urange> production has three forms:
  // U+0001
  //      Defines a range consisting of a single code point, in this case the code point "1".
  // U+0001-00ff
  //      Defines a range of codepoints between the first and the second value, in this case
  //      the range between "1" and "ff" (255 in decimal) inclusive.
  // U+00??
  //      Defines a range of codepoints where the "?" characters range over all hex digits,
  //      in this case defining the same as the value U+0000-00ff.
  // In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
  //
  // <urange> =
  //   u '+' <ident-token> '?'* |
  //   u <dimension-token> '?'* |
  //   u <number-token> '?'* |
  //   u <number-token> <dimension-token> |
  //   u <number-token> <number-token> |
  //   u '+' '?'+


  function scanUnicodeRange() {
    var hexLength = 0; // u '+' <ident-token> '?'*
    // u '+' '?'+

    if (this.scanner.isDelim(PLUSSIGN$6)) {
      this.scanner.next();

      if (this.scanner.tokenType === IDENT$e) {
        hexLength = eatHexSequence.call(this, 0, true);

        if (hexLength > 0) {
          eatQuestionMarkSequence.call(this, 6 - hexLength);
        }

        return;
      }

      if (this.scanner.isDelim(QUESTIONMARK$2)) {
        this.scanner.next();
        eatQuestionMarkSequence.call(this, 5);
        return;
      }

      this.error('Hex digit or question mark is expected');
      return;
    } // u <number-token> '?'*
    // u <number-token> <dimension-token>
    // u <number-token> <number-token>


    if (this.scanner.tokenType === NUMBER$8) {
      startsWith$1.call(this, PLUSSIGN$6);
      hexLength = eatHexSequence.call(this, 1, true);

      if (this.scanner.isDelim(QUESTIONMARK$2)) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
        return;
      }

      if (this.scanner.tokenType === DIMENSION$5 || this.scanner.tokenType === NUMBER$8) {
        startsWith$1.call(this, HYPHENMINUS$4);
        eatHexSequence.call(this, 1, false);
        return;
      }

      return;
    } // u <dimension-token> '?'*


    if (this.scanner.tokenType === DIMENSION$5) {
      startsWith$1.call(this, PLUSSIGN$6);
      hexLength = eatHexSequence.call(this, 1, true);

      if (hexLength > 0) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
      }

      return;
    }

    this.error();
  }

  var UnicodeRange = {
    name: 'UnicodeRange',
    structure: {
      value: String
    },
    parse: function parse() {
      var start = this.scanner.tokenStart; // U or u

      if (!cmpChar$4(this.scanner.source, start, U$1)) {
        this.error('U is expected');
      }

      if (!cmpChar$4(this.scanner.source, start + 1, PLUSSIGN$6)) {
        this.error('Plus sign is expected');
      }

      this.scanner.next();
      scanUnicodeRange.call(this);
      return {
        type: 'UnicodeRange',
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.substrToCursor(start)
      };
    },
    generate: function generate(node) {
      this.chunk(node.value);
    }
  };

  var isWhiteSpace$2 = tokenizer.isWhiteSpace;
  var cmpStr$4 = tokenizer.cmpStr;
  var TYPE$C = tokenizer.TYPE;
  var FUNCTION$3 = TYPE$C.Function;
  var URL$2 = TYPE$C.Url;
  var RIGHTPARENTHESIS$7 = TYPE$C.RightParenthesis; // <url-token> | <function-token> <string> )

  var Url = {
    name: 'Url',
    structure: {
      value: ['String', 'Raw']
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var value;

      switch (this.scanner.tokenType) {
        case URL$2:
          var rawStart = start + 4;
          var rawEnd = this.scanner.tokenEnd - 1;

          while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawStart))) {
            rawStart++;
          }

          while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawEnd - 1))) {
            rawEnd--;
          }

          value = {
            type: 'Raw',
            loc: this.getLocation(rawStart, rawEnd),
            value: this.scanner.source.substring(rawStart, rawEnd)
          };
          this.eat(URL$2);
          break;

        case FUNCTION$3:
          if (!cmpStr$4(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(')) {
            this.error('Function name must be `url`');
          }

          this.eat(FUNCTION$3);
          this.scanner.skipSC();
          value = this.String();
          this.scanner.skipSC();
          this.eat(RIGHTPARENTHESIS$7);
          break;

        default:
          this.error('Url or Function is expected');
      }

      return {
        type: 'Url',
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: value
      };
    },
    generate: function generate(node) {
      this.chunk('url');
      this.chunk('(');
      this.node(node.value);
      this.chunk(')');
    }
  };

  var Value = {
    name: 'Value',
    structure: {
      children: [[]]
    },
    parse: function parse() {
      var start = this.scanner.tokenStart;
      var children = this.readSequence(this.scope.Value);
      return {
        type: 'Value',
        loc: this.getLocation(start, this.scanner.tokenStart),
        children: children
      };
    },
    generate: function generate(node) {
      this.children(node);
    }
  };

  var WHITESPACE$9 = tokenizer.TYPE.WhiteSpace;
  var SPACE$2 = Object.freeze({
    type: 'WhiteSpace',
    loc: null,
    value: ' '
  });
  var WhiteSpace$1 = {
    name: 'WhiteSpace',
    structure: {
      value: String
    },
    parse: function parse() {
      this.eat(WHITESPACE$9);
      return SPACE$2; // return {
      //     type: 'WhiteSpace',
      //     loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
      //     value: this.consume(WHITESPACE)
      // };
    },
    generate: function generate(node) {
      this.chunk(node.value);
    }
  };

  var node$1 = {
    AnPlusB: AnPlusB,
    Atrule: Atrule,
    AtrulePrelude: AtrulePrelude,
    AttributeSelector: AttributeSelector,
    Block: Block,
    Brackets: Brackets,
    CDC: CDC_1,
    CDO: CDO_1,
    ClassSelector: ClassSelector,
    Combinator: Combinator,
    Comment: Comment,
    Declaration: Declaration,
    DeclarationList: DeclarationList,
    Dimension: Dimension,
    Function: _Function,
    HexColor: HexColor,
    Identifier: Identifier,
    IdSelector: IdSelector,
    MediaFeature: MediaFeature,
    MediaQuery: MediaQuery,
    MediaQueryList: MediaQueryList,
    Nth: Nth,
    Number: _Number,
    Operator: Operator,
    Parentheses: Parentheses,
    Percentage: Percentage,
    PseudoClassSelector: PseudoClassSelector,
    PseudoElementSelector: PseudoElementSelector,
    Ratio: Ratio,
    Raw: Raw,
    Rule: Rule,
    Selector: Selector,
    SelectorList: SelectorList,
    String: _String,
    StyleSheet: StyleSheet,
    TypeSelector: TypeSelector,
    UnicodeRange: UnicodeRange,
    Url: Url,
    Value: Value,
    WhiteSpace: WhiteSpace$1
  };

  var data$1 = getCjsExportFromNamespace(defaultSyntax$1);

  var lexer = {
    generic: true,
    types: data$1.types,
    atrules: data$1.atrules,
    properties: data$1.properties,
    node: node$1
  };

  var cmpChar$5 = tokenizer.cmpChar;
  var cmpStr$5 = tokenizer.cmpStr;
  var TYPE$D = tokenizer.TYPE;
  var IDENT$f = TYPE$D.Ident;
  var STRING$2 = TYPE$D.String;
  var NUMBER$9 = TYPE$D.Number;
  var FUNCTION$4 = TYPE$D.Function;
  var URL$3 = TYPE$D.Url;
  var HASH$4 = TYPE$D.Hash;
  var DIMENSION$6 = TYPE$D.Dimension;
  var PERCENTAGE$2 = TYPE$D.Percentage;
  var LEFTPARENTHESIS$5 = TYPE$D.LeftParenthesis;
  var LEFTSQUAREBRACKET$3 = TYPE$D.LeftSquareBracket;
  var COMMA$3 = TYPE$D.Comma;
  var DELIM$5 = TYPE$D.Delim;
  var NUMBERSIGN$3 = 0x0023; // U+0023 NUMBER SIGN (#)

  var ASTERISK$5 = 0x002A; // U+002A ASTERISK (*)

  var PLUSSIGN$7 = 0x002B; // U+002B PLUS SIGN (+)

  var HYPHENMINUS$5 = 0x002D; // U+002D HYPHEN-MINUS (-)

  var SOLIDUS$4 = 0x002F; // U+002F SOLIDUS (/)

  var U$2 = 0x0075; // U+0075 LATIN SMALL LETTER U (u)

  var _default = function defaultRecognizer(context) {
    switch (this.scanner.tokenType) {
      case HASH$4:
        return this.HexColor();

      case COMMA$3:
        context.space = null;
        context.ignoreWSAfter = true;
        return this.Operator();

      case LEFTPARENTHESIS$5:
        return this.Parentheses(this.readSequence, context.recognizer);

      case LEFTSQUAREBRACKET$3:
        return this.Brackets(this.readSequence, context.recognizer);

      case STRING$2:
        return this.String();

      case DIMENSION$6:
        return this.Dimension();

      case PERCENTAGE$2:
        return this.Percentage();

      case NUMBER$9:
        return this.Number();

      case FUNCTION$4:
        return cmpStr$5(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(') ? this.Url() : this.Function(this.readSequence, context.recognizer);

      case URL$3:
        return this.Url();

      case IDENT$f:
        // check for unicode range, it should start with u+ or U+
        if (cmpChar$5(this.scanner.source, this.scanner.tokenStart, U$2) && cmpChar$5(this.scanner.source, this.scanner.tokenStart + 1, PLUSSIGN$7)) {
          return this.UnicodeRange();
        } else {
          return this.Identifier();
        }

      case DELIM$5:
        var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

        if (code === SOLIDUS$4 || code === ASTERISK$5 || code === PLUSSIGN$7 || code === HYPHENMINUS$5) {
          return this.Operator(); // TODO: replace with Delim
        } // TODO: produce a node with Delim node type


        if (code === NUMBERSIGN$3) {
          this.error('Hex or identifier is expected', this.scanner.tokenStart + 1);
        }

        break;
    }
  };

  var atrulePrelude = {
    getNode: _default
  };

  var TYPE$E = tokenizer.TYPE;
  var DELIM$6 = TYPE$E.Delim;
  var IDENT$g = TYPE$E.Ident;
  var DIMENSION$7 = TYPE$E.Dimension;
  var PERCENTAGE$3 = TYPE$E.Percentage;
  var NUMBER$a = TYPE$E.Number;
  var HASH$5 = TYPE$E.Hash;
  var COLON$5 = TYPE$E.Colon;
  var LEFTSQUAREBRACKET$4 = TYPE$E.LeftSquareBracket;
  var NUMBERSIGN$4 = 0x0023; // U+0023 NUMBER SIGN (#)

  var ASTERISK$6 = 0x002A; // U+002A ASTERISK (*)

  var PLUSSIGN$8 = 0x002B; // U+002B PLUS SIGN (+)

  var SOLIDUS$5 = 0x002F; // U+002F SOLIDUS (/)

  var FULLSTOP$2 = 0x002E; // U+002E FULL STOP (.)

  var GREATERTHANSIGN$2 = 0x003E; // U+003E GREATER-THAN SIGN (>)

  var VERTICALLINE$3 = 0x007C; // U+007C VERTICAL LINE (|)

  var TILDE$2 = 0x007E; // U+007E TILDE (~)

  function getNode(context) {
    switch (this.scanner.tokenType) {
      case LEFTSQUAREBRACKET$4:
        return this.AttributeSelector();

      case HASH$5:
        return this.IdSelector();

      case COLON$5:
        if (this.scanner.lookupType(1) === COLON$5) {
          return this.PseudoElementSelector();
        } else {
          return this.PseudoClassSelector();
        }

      case IDENT$g:
        return this.TypeSelector();

      case NUMBER$a:
      case PERCENTAGE$3:
        return this.Percentage();

      case DIMENSION$7:
        // throws when .123ident
        if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === FULLSTOP$2) {
          this.error('Identifier is expected', this.scanner.tokenStart + 1);
        }

        break;

      case DELIM$6:
        var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

        switch (code) {
          case PLUSSIGN$8:
          case GREATERTHANSIGN$2:
          case TILDE$2:
            context.space = null;
            context.ignoreWSAfter = true;
            return this.Combinator();

          case SOLIDUS$5:
            // /deep/
            return this.Combinator();

          case FULLSTOP$2:
            return this.ClassSelector();

          case ASTERISK$6:
          case VERTICALLINE$3:
            return this.TypeSelector();

          case NUMBERSIGN$4:
            return this.IdSelector();
        }

        break;
    }
  }
  var selector = {
    getNode: getNode
  };

  // https://drafts.csswg.org/css-images-4/#element-notation
  // https://developer.mozilla.org/en-US/docs/Web/CSS/element
  var element = function element() {
    this.scanner.skipSC();
    var children = this.createSingleNodeList(this.IdSelector());
    this.scanner.skipSC();
    return children;
  };

  // legacy IE function
  // expression( <any-value> )
  var expression = function expression() {
    return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, false));
  };

  var TYPE$F = tokenizer.TYPE;
  var rawMode$5 = Raw.mode;
  var COMMA$4 = TYPE$F.Comma; // var( <ident> , <value>? )

  var _var = function _var() {
    var children = this.createList();
    this.scanner.skipSC(); // NOTE: Don't check more than a first argument is an ident, rest checks are for lexer

    children.push(this.Identifier());
    this.scanner.skipSC();

    if (this.scanner.tokenType === COMMA$4) {
      children.push(this.Operator());
      children.push(this.parseCustomProperty ? this.Value(null) : this.Raw(this.scanner.tokenIndex, rawMode$5.exclamationMarkOrSemicolon, false));
    }

    return children;
  };

  var value = {
    getNode: _default,
    '-moz-element': element,
    'element': element,
    'expression': expression,
    'var': _var
  };

  var scope = {
    AtrulePrelude: atrulePrelude,
    Selector: selector,
    Value: value
  };

  var fontFace = {
    parse: {
      prelude: null,
      block: function block() {
        return this.Block(true);
      }
    }
  };

  var TYPE$G = tokenizer.TYPE;
  var STRING$3 = TYPE$G.String;
  var IDENT$h = TYPE$G.Ident;
  var URL$4 = TYPE$G.Url;
  var FUNCTION$5 = TYPE$G.Function;
  var LEFTPARENTHESIS$6 = TYPE$G.LeftParenthesis;
  var _import = {
    parse: {
      prelude: function prelude() {
        var children = this.createList();
        this.scanner.skipSC();

        switch (this.scanner.tokenType) {
          case STRING$3:
            children.push(this.String());
            break;

          case URL$4:
          case FUNCTION$5:
            children.push(this.Url());
            break;

          default:
            this.error('String or url() is expected');
        }

        if (this.lookupNonWSType(0) === IDENT$h || this.lookupNonWSType(0) === LEFTPARENTHESIS$6) {
          children.push(this.WhiteSpace());
          children.push(this.MediaQueryList());
        }

        return children;
      },
      block: null
    }
  };

  var media = {
    parse: {
      prelude: function prelude() {
        return this.createSingleNodeList(this.MediaQueryList());
      },
      block: function block() {
        return this.Block(false);
      }
    }
  };

  var page = {
    parse: {
      prelude: function prelude() {
        return this.createSingleNodeList(this.SelectorList());
      },
      block: function block() {
        return this.Block(true);
      }
    }
  };

  var TYPE$H = tokenizer.TYPE;
  var WHITESPACE$a = TYPE$H.WhiteSpace;
  var COMMENT$9 = TYPE$H.Comment;
  var IDENT$i = TYPE$H.Ident;
  var FUNCTION$6 = TYPE$H.Function;
  var COLON$6 = TYPE$H.Colon;
  var LEFTPARENTHESIS$7 = TYPE$H.LeftParenthesis;

  function consumeRaw$5() {
    return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, false));
  }

  function parentheses() {
    this.scanner.skipSC();

    if (this.scanner.tokenType === IDENT$i && this.lookupNonWSType(1) === COLON$6) {
      return this.createSingleNodeList(this.Declaration());
    }

    return readSequence.call(this);
  }

  function readSequence() {
    var children = this.createList();
    var space = null;
    var child;
    this.scanner.skipSC();

    scan: while (!this.scanner.eof) {
      switch (this.scanner.tokenType) {
        case WHITESPACE$a:
          space = this.WhiteSpace();
          continue;

        case COMMENT$9:
          this.scanner.next();
          continue;

        case FUNCTION$6:
          child = this.Function(consumeRaw$5, this.scope.AtrulePrelude);
          break;

        case IDENT$i:
          child = this.Identifier();
          break;

        case LEFTPARENTHESIS$7:
          child = this.Parentheses(parentheses, this.scope.AtrulePrelude);
          break;

        default:
          break scan;
      }

      if (space !== null) {
        children.push(space);
        space = null;
      }

      children.push(child);
    }

    return children;
  }

  var supports = {
    parse: {
      prelude: function prelude() {
        var children = readSequence.call(this);

        if (this.getFirstListNode(children) === null) {
          this.error('Condition is expected');
        }

        return children;
      },
      block: function block() {
        return this.Block(false);
      }
    }
  };

  var atrule = {
    'font-face': fontFace,
    'import': _import,
    'media': media,
    'page': page,
    'supports': supports
  };

  var dir = {
    parse: function parse() {
      return this.createSingleNodeList(this.Identifier());
    }
  };

  var has$3 = {
    parse: function parse() {
      return this.createSingleNodeList(this.SelectorList());
    }
  };

  var lang = {
    parse: function parse() {
      return this.createSingleNodeList(this.Identifier());
    }
  };

  var selectorList = {
    parse: function selectorList() {
      return this.createSingleNodeList(this.SelectorList());
    }
  };

  var matches = selectorList;

  var not = selectorList;

  var ALLOW_OF_CLAUSE = true;
  var nthWithOfClause = {
    parse: function nthWithOfClause() {
      return this.createSingleNodeList(this.Nth(ALLOW_OF_CLAUSE));
    }
  };

  var nthChild = nthWithOfClause;

  var nthLastChild = nthWithOfClause;

  var DISALLOW_OF_CLAUSE = false;
  var nth = {
    parse: function nth() {
      return this.createSingleNodeList(this.Nth(DISALLOW_OF_CLAUSE));
    }
  };

  var nthLastOfType = nth;

  var nthOfType = nth;

  var slotted = {
    parse: function compoundSelector() {
      return this.createSingleNodeList(this.Selector());
    }
  };

  var pseudo = {
    'dir': dir,
    'has': has$3,
    'lang': lang,
    'matches': matches,
    'not': not,
    'nth-child': nthChild,
    'nth-last-child': nthLastChild,
    'nth-last-of-type': nthLastOfType,
    'nth-of-type': nthOfType,
    'slotted': slotted
  };

  var parser = {
    parseContext: {
      default: 'StyleSheet',
      stylesheet: 'StyleSheet',
      atrule: 'Atrule',
      atrulePrelude: function atrulePrelude(options) {
        return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
      },
      mediaQueryList: 'MediaQueryList',
      mediaQuery: 'MediaQuery',
      rule: 'Rule',
      selectorList: 'SelectorList',
      selector: 'Selector',
      block: function block() {
        return this.Block(true);
      },
      declarationList: 'DeclarationList',
      declaration: 'Declaration',
      value: 'Value'
    },
    scope: scope,
    atrule: atrule,
    pseudo: pseudo,
    node: node$1
  };

  var walker = {
    node: node$1
  };

  function merge() {
    var dest = {};

    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i];

      for (var key in src) {
        dest[key] = src[key];
      }
    }

    return dest;
  }

  var syntax = create$4.create(merge(lexer, parser, walker));

  var lib = syntax;

  var shorthandProperties = new Map([['background', new Set(['background-color', 'background-position', 'background-position-x', 'background-position-y', 'background-size', 'background-repeat', 'background-repeat-x', 'background-repeat-y', 'background-clip', 'background-origin', 'background-attachment', 'background-image'])], ['background-position', new Set(['background-position-x', 'background-position-y'])], ['background-repeat', new Set(['background-repeat-x', 'background-repeat-y'])], ['font', new Set(['font-style', 'font-variant-caps', 'font-weight', 'font-stretch', 'font-size', 'line-height', 'font-family', 'font-size-adjust', 'font-kerning', 'font-optical-sizing', 'font-variant-alternates', 'font-variant-east-asian', 'font-variant-ligatures', 'font-variant-numeric', 'font-variant-position', 'font-language-override', 'font-feature-settings', 'font-variation-settings'])], ['font-variant', new Set(['font-variant-caps', 'font-variant-numeric', 'font-variant-alternates', 'font-variant-ligatures', 'font-variant-east-asian'])], ['outline', new Set(['outline-width', 'outline-style', 'outline-color'])], ['border', new Set(['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset', 'border-image-repeat'])], ['border-width', new Set(['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'])], ['border-style', new Set(['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'])], ['border-color', new Set(['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'])], ['border-block', new Set(['border-block-start-width', 'border-block-end-width', 'border-block-start-style', 'border-block-end-style', 'border-block-start-color', 'border-block-end-color'])], ['border-block-start', new Set(['border-block-start-width', 'border-block-start-style', 'border-block-start-color'])], ['border-block-end', new Set(['border-block-end-width', 'border-block-end-style', 'border-block-end-color'])], ['border-inline', new Set(['border-inline-start-width', 'border-inline-end-width', 'border-inline-start-style', 'border-inline-end-style', 'border-inline-start-color', 'border-inline-end-color'])], ['border-inline-start', new Set(['border-inline-start-width', 'border-inline-start-style', 'border-inline-start-color'])], ['border-inline-end', new Set(['border-inline-end-width', 'border-inline-end-style', 'border-inline-end-color'])], ['border-image', new Set(['border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset', 'border-image-repeat'])], ['border-radius', new Set(['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'])], ['padding', new Set(['padding-top', 'padding-right', 'padding-bottom', 'padding-left'])], ['padding-block', new Set(['padding-block-start', 'padding-block-end'])], ['padding-inline', new Set(['padding-inline-start', 'padding-inline-end'])], ['margin', new Set(['margin-top', 'margin-right', 'margin-bottom', 'margin-left'])], ['margin-block', new Set(['margin-block-start', 'margin-block-end'])], ['margin-inline', new Set(['margin-inline-start', 'margin-inline-end'])], ['inset', new Set(['top', 'right', 'bottom', 'left'])], ['inset-block', new Set(['inset-block-start', 'inset-block-end'])], ['inset-inline', new Set(['inset-inline-start', 'inset-inline-end'])], ['flex', new Set(['flex-grow', 'flex-shrink', 'flex-basis'])], ['flex-flow', new Set(['flex-direction', 'flex-wrap'])], ['gap', new Set(['row-gap', 'column-gap'])], ['transition', new Set(['transition-duration', 'transition-timing-function', 'transition-delay', 'transition-property'])], ['grid', new Set(['grid-template-rows', 'grid-template-columns', 'grid-template-areas', 'grid-auto-flow', 'grid-auto-columns', 'grid-auto-rows'])], ['grid-template', new Set(['grid-template-rows', 'grid-template-columns', 'grid-template-areas'])], ['grid-row', new Set(['grid-row-start', 'grid-row-end'])], ['grid-column', new Set(['grid-column-start', 'grid-column-end'])], ['grid-gap', new Set(['grid-row-gap', 'grid-column-gap'])], ['place-content', new Set(['align-content', 'justify-content'])], ['place-items', new Set(['align-items', 'justify-items'])], ['place-self', new Set(['align-self', 'justify-self'])], ['columns', new Set(['column-width', 'column-count'])], ['column-rule', new Set(['column-rule-width', 'column-rule-style', 'column-rule-color'])], ['list-style', new Set(['list-style-type', 'list-style-position', 'list-style-image'])], ['offset', new Set(['offset-position', 'offset-path', 'offset-distance', 'offset-rotate', 'offset-anchor'])], ['overflow', new Set(['overflow-x', 'overflow-y'])], ['overscroll-behavior', new Set(['overscroll-behavior-x', 'overscroll-behavior-y'])], ['scroll-margin', new Set(['scroll-margin-top', 'scroll-margin-right', 'scroll-margin-bottom', 'scroll-margin-left'])], ['scroll-padding', new Set(['scroll-padding-top', 'scroll-padding-right', 'scroll-padding-bottom', 'scroll-padding-left'])], ['text-decaration', new Set(['text-decoration-line', 'text-decoration-style', 'text-decoration-color'])], ['text-stroke', new Set(['text-stroke-color', 'text-stroke-width'])], ['animation', new Set(['animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode', 'animation-play-state', 'animation-name'])], ['mask', new Set(['mask-image', 'mask-mode', 'mask-repeat-x', 'mask-repeat-y', 'mask-position-x', 'mask-position-y', 'mask-clip', 'mask-origin', 'mask-size', 'mask-composite'])], ['mask-repeat', new Set(['mask-repeat-x', 'mask-repeat-y'])], ['mask-position', new Set(['mask-position-x', 'mask-position-y'])], ['perspective-origin', new Set(['perspective-origin-x', 'perspective-origin-y'])], ['transform-origin', new Set(['transform-origin-x', 'transform-origin-y', 'transform-origin-z'])]]);
  var mozShorthandProperties = new Map([withVendor('animation', 'moz'), withVendor('border-image', 'moz'), withVendor('mask', 'moz'), withVendor('transition', 'moz'), withVendor('columns', 'moz'), withVendor('text-stroke', 'moz'), withVendor('column-rule', 'moz'), ['-moz-border-end', new Set(['-moz-border-end-color', '-moz-border-end-style', '-moz-border-end-width'])], ['-moz-border-start', new Set(['-moz-border-start-color', '-moz-border-start-style', '-moz-border-start-width'])], ['-moz-outline-radius', new Set(['-moz-outline-radius-topleft', '-moz-outline-radius-topright', '-moz-outline-radius-bottomright', '-moz-outline-radius-bottomleft'])]]);
  var webkitShorthandProperties = new Map([withVendor('animation', 'webkit'), withVendor('border-radius', 'webkit'), withVendor('column-rule', 'webkit'), withVendor('columns', 'webkit'), withVendor('flex', 'webkit'), withVendor('flex-flow', 'webkit'), withVendor('mask', 'webkit'), withVendor('text-stroke', 'webkit'), withVendor('perspective-origin', 'webkit'), withVendor('transform-origin', 'webkit'), withVendor('transition', 'webkit'), ['-webkit-border-start', new Set(['-webkit-border-start-color', '-webkit-border-start-style', '-webkit-border-start-width'])], ['-webkit-border-before', new Set(['-webkit-border-before-color', '-webkit-border-before-style', '-webkit-border-before-width'])], ['-webkit-border-end', new Set(['-webkit-border-end-color', '-webkit-border-end-style', '-webkit-border-end-width'])], ['-webkit-border-after', new Set(['-webkit-border-after-color', '-webkit-border-after-style', '-webkit-border-after-width'])]]);
  var experimentalLonghandProperties = new Map([['background-position-x', 'background-position'], ['background-position-y', 'background-position'], ['background-repeat-x', 'background-repeat'], ['background-repeat-y', 'background-repeat']]);
  mozShorthandProperties.forEach(function (longhandSet, shorthand) {
    return shorthandProperties.set(shorthand, longhandSet);
  });
  webkitShorthandProperties.forEach(function (longhandSet, shorthand) {
    return shorthandProperties.set(shorthand, longhandSet);
  });
  var longhandProperties = new Set(Array.from(shorthandProperties.values()).reduce(function (longhandProperties, longhandSet) {
    return longhandProperties.concat(Array.from(longhandSet));
  }, []));

  function withVendor(shorthand, vendor) {
    var longhands = shorthandProperties.get(shorthand);

    if (longhands) {
      return ["-".concat(vendor, "-").concat(shorthand), new Set(Array.from(longhands, function (longhand) {
        return "-".concat(vendor, "-").concat(longhand);
      }))];
    }
  }

  function isShorthandFor(shorthand, longhand) {
    var longhands = shorthandProperties.get(shorthand);
    return longhands ? longhands.has(longhand) : false;
  }

  function hasShorthand(longhand) {
    return longhandProperties.has(longhand);
  }

  function hasShorthandWithin(longhand, shorthands) {
    return shorthands.some(function (shorthand) {
      return isShorthandFor(shorthand, longhand);
    });
  }

  function preferredShorthand(longhand) {
    return experimentalLonghandProperties.get(longhand);
  }

  var isShorthandFor_1 = isShorthandFor;
  var hasShorthand_1 = hasShorthand;
  var hasShorthandWithin_1 = hasShorthandWithin;
  var preferredShorthand_1 = preferredShorthand;
  var styleProperties = {
    isShorthandFor: isShorthandFor_1,
    hasShorthand: hasShorthand_1,
    hasShorthandWithin: hasShorthandWithin_1,
    preferredShorthand: preferredShorthand_1
  };

  var _RULE_PROPS;

  var preferredShorthand$1 = styleProperties.preferredShorthand;
  var CSSOM_TYPES = {
    UNKNOWN_RULE: 0,
    STYLE_RULE: 1,
    CHARSET_RULE: 2,
    IMPORT_RULE: 3,
    MEDIA_RULE: 4,
    FONT_FACE_RULE: 5,
    PAGE_RULE: 6,
    KEYFRAMES_RULE: 7,
    KEYFRAME_RULE: 8,
    NAMESPACE_RULE: 10,
    COUNTER_STYLE_RULE: 11,
    SUPPORTS_RULE: 12,
    DOCUMENT_RULE: 13,
    FONT_FEATURE_VALUES_RULE: 14,
    VIEWPORT_RULE: 15,
    REGION_STYLE_RULE: 16
  };
  var RULE_PROPS = (_RULE_PROPS = {}, _defineProperty(_RULE_PROPS, CSSOM_TYPES.CHARSET_RULE, {
    atrule: 'charset',
    prelude: 'charset'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.IMPORT_RULE, {
    atrule: 'import',
    prelude: 'import'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.NAMESPACE_RULE, {
    atrule: 'namespace',
    prelude: 'namespace'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.STYLE_RULE, {
    prelude: 'selector',
    block: 'style'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.KEYFRAME_RULE, {
    prelude: 'key',
    block: 'style'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.PAGE_RULE, {
    atrule: 'page',
    prelude: 'selector',
    block: 'style'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.FONT_FACE_RULE, {
    atrule: 'font-face',
    block: 'style'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.MEDIA_RULE, {
    atrule: 'media',
    prelude: 'condition',
    block: 'nested'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.SUPPORTS_RULE, {
    atrule: 'supports',
    prelude: 'condition',
    block: 'nested'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.DOCUMENT_RULE, {
    atrule: 'document',
    prelude: 'condition',
    block: 'nested'
  }), _defineProperty(_RULE_PROPS, CSSOM_TYPES.KEYFRAMES_RULE, {
    atrule: 'keyframes',
    prelude: 'name',
    block: 'nested'
  }), _RULE_PROPS);

  function createAstFromCssom(cssomRules) {
    return Array.from(cssomRules, function (cssomRule) {
      var props = RULE_PROPS[cssomRule.type];
      var rule = {};

      if (props.atrule) {
        rule.type = 'Atrule';

        var _cssomRule$cssText$ma = cssomRule.cssText.match(new RegExp("^@(-\\w+-)?".concat(props.atrule))),
            _cssomRule$cssText$ma2 = _slicedToArray(_cssomRule$cssText$ma, 2),
            _ = _cssomRule$cssText$ma2[0],
            vendor = _cssomRule$cssText$ma2[1];

        rule.name = vendor ? vendor + props.atrule : props.atrule;
      } else {
        rule.type = 'Rule';
      }

      var cssomPrelude;

      if (props.prelude === 'selector') {
        cssomPrelude = cssomRule.selectorText;
      } else if (props.prelude === 'key') {
        cssomPrelude = cssomRule.keyText;
      } else if (props.prelude === 'condition') {
        cssomPrelude = cssomRule.conditionText;
      } else if (props.prelude === 'name') {
        cssomPrelude = cssomRule.name;
      } else if (props.prelude === 'import') {
        cssomPrelude = "url(\"".concat(cssomRule.href, "\") ").concat(cssomRule.media.mediaText);
      } else if (props.prelude === 'namespace') {
        cssomPrelude = "".concat(cssomRule.prefix, " url(\"").concat(cssomRule.namespaceURI, "\")");
      } else if (props.prelude === 'charset') {
        cssomPrelude = "\"".concat(cssomRule.encoding, "\"");
      }

      if (cssomPrelude) {
        var parseOptions = props.atrule ? {
          context: 'atrulePrelude',
          atrule: props.atrule
        } : {
          context: 'selectorList'
        };
        rule.prelude = lib.toPlainObject(lib.parse(cssomPrelude, parseOptions));
      } else {
        rule.prelude = null;
      }

      if (props.block === 'style') {
        var children = Array.from(cssomRule.style).reduce(function (children, longhand) {
          var property = preferredShorthand$1(longhand) || longhand;
          children.set(property, {
            type: 'Declaration',
            important: Boolean(cssomRule.style.getPropertyPriority(property)),
            property: property,
            value: {
              type: 'Raw',
              value: cssomRule.style.getPropertyValue(property)
            }
          });
          return children;
        }, new Map());
        rule.block = {
          type: 'Block',
          children: Array.from(children.values())
        };
      } else if (props.block === 'nested') {
        rule.block = {
          type: 'Block',
          children: createAstFromCssom(cssomRule.cssRules)
        };
      } else {
        rule.block = null;
      }

      return rule;
    });
  }

  var createAstFromCssom_1 = createAstFromCssom;

  function createAstFromTextContent(textContent) {
    var textAst = lib.parse(textContent, {
      context: 'stylesheet',
      parseAtrulePrelude: true,
      parseRulePrelude: true,
      parseValue: false,
      parseCustomProperty: false
    }); // replace keyframe's key aliases

    lib.walk(textAst, {
      visit: 'TypeSelector',
      enter: function enter(node, item) {
        if (node.name === 'from') {
          item.data = {
            type: 'Percentage',
            value: '0'
          };
        } else if (node.name === 'to') {
          item.data = {
            type: 'Percentage',
            value: '100'
          };
        }
      }
    }); // unify urls in atrules

    lib.walk(textAst, {
      visit: 'AtrulePrelude',
      enter: function enter(node) {
        if (['import', 'namespace'].includes(this.atrule.name)) {
          var children = node.children.toArray();
          var urlIndex = node.name === 'import' ? 0 : children.length - 1;
          var url = children[urlIndex];
          var value;

          if (url.type === 'String') {
            value = url.value.slice(1, -1);
          } else if (url.type === 'Url') {
            if (url.value.type === 'String') {
              value = url.value.value.slice(1, -1);
            } else if (url.value.type === 'Raw') {
              value = url.value.value;
            }
          }

          if (value) {
            children[urlIndex] = {
              type: 'Url',
              value: {
                type: 'String',
                value: "\"".concat(value, "\"")
              }
            };
            node.children.fromArray(children);
          }
        }
      }
    });
    return lib.toPlainObject(textAst);
  }

  var createAstFromTextContent_1 = createAstFromTextContent;

  var isShorthandFor$1 = styleProperties.isShorthandFor,
      hasShorthandWithin$1 = styleProperties.hasShorthandWithin;
  var PROPERTY_ALIASES = {
    'word-wrap': 'overflow-wrap',
    clip: 'clip-path'
  };

  function mergeRules(textRules, cssomRules) {
    var cursor = 0;
    var mergedRules = [];
    textRules.forEach(function (textRule) {
      var rule = {};
      rule.type = textRule.type;
      rule.name = textRule.name;
      rule.prelude = textRule.prelude;
      rule.block = textRule.block;
      var index = findRule(cssomRules, cursor, textRule);

      if (index > cursor) {
        forEach(cssomRules, cursor, index, function (cssomRule) {
          return mergedRules.push(cssomRule);
        });
      }

      if (index >= 0) {
        cursor = index + 1;

        if (isNestedRule(textRule)) {
          rule.block = {
            type: 'Block',
            children: mergeRules(textRule.block.children, cssomRules[index].block.children)
          };
        } else if (isStyleRule(textRule)) {
          rule.block = {
            type: 'Block',
            children: mergeStyles(textRule.block.children, cssomRules[index].block.children)
          };
        }
      }

      mergedRules.push(rule);
    }, []);

    if (cursor < cssomRules.length) {
      forEach(cssomRules, cursor, cssomRules.length, function (cssomRule) {
        return mergedRules.push(cssomRule);
      });
    }

    return mergedRules;
  }

  function mergeStyles(textDeclarations, cssomDeclarations) {
    var mergedProperties = new Map();
    textDeclarations.forEach(function (_ref) {
      var type = _ref.type,
          property = _ref.property,
          important = _ref.important,
          _ref$value = _ref.value;
      _ref$value = _ref$value === void 0 ? {} : _ref$value;
      var value = _ref$value.value;
      if (type !== 'Declaration') return;
      var values = mergedProperties.get(property);

      if (!values) {
        values = new Map();
        mergedProperties.set(property, values);
      }

      values.set(value, important);
    });
    cssomDeclarations.forEach(function (_ref2) {
      var type = _ref2.type,
          property = _ref2.property,
          important = _ref2.important,
          _ref2$value = _ref2.value;
      _ref2$value = _ref2$value === void 0 ? {} : _ref2$value;
      var value = _ref2$value.value;
      if (type !== 'Declaration') return;
      if (hasShorthandWithin$1(property, Array.from(mergedProperties.keys()))) return;
      var values = mergedProperties.get(property);

      if (!values) {
        values = new Map();
        mergedProperties.set(property, values);
      } else if (!values.has(value)) {
        values.clear();
      } else if (values.get(value) !== important) {
        values.forEach(function (_, value) {
          return values.set(value, important);
        });
      }

      values.set(value, important);
    });
    var mergedDeclarations = [];
    mergedProperties.forEach(function (values, property) {
      values.forEach(function (important, value) {
        return mergedDeclarations.push({
          type: 'Declaration',
          property: property,
          value: {
            type: 'Raw',
            value: value
          },
          important: important
        });
      });
    });
    return mergedDeclarations;
  }

  function comparePreludes(leftPrelude, rightPrelude) {
    return !leftPrelude && !rightPrelude || leftPrelude.type === rightPrelude.type && compareChildren(leftPrelude.children, rightPrelude.children);
  }

  function compareChildren(leftChildren, rightChildren) {
    if (!Array.isArray(leftChildren) && !Array.isArray(rightChildren)) {
      return true;
    } else {
      return Array.isArray(leftChildren) && Array.isArray(rightChildren) && leftChildren.length === rightChildren.length && leftChildren.every(function (leftChild, index) {
        var rightChild = rightChildren[index];
        return leftChild.type === rightChild.type && leftChild.name === rightChild.name && (leftChild.value === rightChild.value || leftChild.value.type === rightChild.value.type && leftChild.value.value === rightChild.value.value) && compareChildren(leftChild.children, rightChild.children);
      });
    }
  }

  function compareStyles(leftStyles, rightStyles) {
    var relevantPropsCount = rightStyles.reduce(function (relevantPropsCount, rightDeclaration) {
      var matched = rightDeclaration.type === 'Declaration' && (isVendorProperty(rightDeclaration.property) || leftStyles.some(function (leftDeclaration) {
        return compareProperties(leftDeclaration.property, rightDeclaration.property);
      }));
      return relevantPropsCount + (matched ? 1 : 0);
    }, 0);
    return relevantPropsCount >= rightStyles.length;
  }

  function compareProperties(leftProperty, rightProperty) {
    var explicifiedLeftProperty = PROPERTY_ALIASES[leftProperty] || leftProperty;
    var explicifiedRightProperty = PROPERTY_ALIASES[rightProperty] || rightProperty;
    return explicifiedLeftProperty === explicifiedRightProperty || isShorthandFor$1(explicifiedRightProperty, explicifiedLeftProperty) || isShorthandFor$1(explicifiedLeftProperty, explicifiedRightProperty);
  }

  function findRule(ruleSet, cursor, baseRule) {
    return findIndex$1(ruleSet, cursor, function (rule) {
      return rule.type === baseRule.type && rule.name === baseRule.name && comparePreludes(rule.prelude, baseRule.prelude) && (!isStyleRule(baseRule) || compareStyles(rule.block.children, baseRule.block.children));
    });
  }

  function isVendorProperty(property) {
    return /^(-\w+-)/.test(property);
  }

  function isStyleRule(rule) {
    return rule.type === 'Rule' || /^(-\w+-)?(page|font-face)$/.test(rule.name);
  }

  function isNestedRule(rule) {
    return rule.type === 'Atrule' && /^(-\w+-)?(media|supports|document|keyframes)$/.test(rule.name);
  }

  function findIndex$1(array, startIndex, comparator) {
    for (var index = startIndex; index < array.length; ++index) {
      if (comparator(array[index], index, array)) {
        return index;
      }
    }

    return -1;
  }

  function forEach(array, indexFrom, indexTo, callback) {
    for (var index = indexFrom; index < indexTo; ++index) {
      callback(array[index], index, array);
    }
  }

  var mergeRules_1 = mergeRules;

  var noop$4 = function noop() {};

  function getElementAttrSelector(el) {
    var attrString = Array.from(el.attributes).map(function (attr) {
      if (attr.name === 'id') {
        return "#".concat(attr.value);
      } else if (attr.name === 'class') {
        return Array.from(el.classList).map(function (c) {
          return ".".concat(c);
        }).join('');
      } else {
        return "[".concat(attr.name, "=\"").concat(attr.value, "\"]");
      }
    }).join('');
    return "".concat(el.nodeName).concat(attrString);
  }

  var getElementAttrSelector_1 = getElementAttrSelector;

  function processInlineCss(styleNode) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$4;
    log('[processInlineCss] processing inline css for', getElementAttrSelector_1(styleNode));

    try {
      var textContentAst = createAstFromTextContent_1(styleNode.textContent);
      log('[processInlineCss] created AST for textContent');
      var cssomAst = createAstFromCssom_1(styleNode.sheet.cssRules);
      log('[processInlineCss] created AST for CSSOM');
      var mergedRules = mergeRules_1(textContentAst.children, cssomAst);
      log('[processInlineCss] merged AST');
      var cssText = lib.generate(lib.fromPlainObject({
        type: 'StyleSheet',
        children: mergedRules
      }));
      log('[processInlineCss] generated cssText of length', cssText.length);
      return cssText;
    } catch (err) {
      log('[processInlineCss] error while processing inline css:', err.message, err);
      return styleNode.textContent;
    }
  }

  var processInlineCss_1 = processInlineCss;

  function getUrlFromCssText(cssText) {
    var re = /url\((?!['"]?:)['"]?([^'")]*)['"]?\)/g;
    var ret = [];
    var result;

    while ((result = re.exec(cssText)) !== null) {
      ret.push(result[1]);
    }

    return ret;
  }

  var getUrlFromCssText_1 = getUrlFromCssText;

  function extractResourceUrlsFromStyleAttrs(el) {
    var style = el.getAttribute('style');
    if (style) return getUrlFromCssText_1(style);
  }

  var extractResourceUrlsFromStyleAttrs_1 = extractResourceUrlsFromStyleAttrs;

  var srcsetRegexp = /(\S+)(?:\s+[\d.]+[wx])?(?:,|$)/g;

  function extractLinksFromElement(el) {
    var matches = (el.matches || el.msMatchesSelector).bind(el);
    var urls = []; // srcset urls

    if (matches('img[srcset],source[srcset]')) {
      urls = urls.concat(execAll(srcsetRegexp, el.getAttribute('srcset'), function (match) {
        return match[1];
      }));
    } // src urls


    if (matches('img[src],source[src],input[type="image"][src],audio[src],video[src]')) {
      urls.push(el.getAttribute('src'));
    } // image urls


    if (matches('image,use')) {
      var href = el.getAttribute('href') || el.getAttribute('xlink:href');

      if (href && href[0] !== '#') {
        urls.push(href);
      }
    } // object urls


    if (matches('object') && el.getAttribute('data')) {
      urls.push(el.getAttribute('data'));
    } // css urls


    if (matches('link[rel~="stylesheet"], link[as="stylesheet"]')) {
      urls.push(el.getAttribute('href'));
    } // video poster urls


    if (matches('video[poster]')) {
      urls.push(el.getAttribute('poster'));
    } // style attribute urls


    var styleAttrUrls = extractResourceUrlsFromStyleAttrs_1(el);

    if (styleAttrUrls) {
      urls = urls.concat(styleAttrUrls);
    }

    return urls; // can be replaced with matchAll once Safari supports it

    function execAll(regexp, string, mapper) {
      var matches = [];
      var clonedRegexp = new RegExp(regexp.source, regexp.flags);
      var isGlobal = clonedRegexp.global;
      var match;

      while (match = clonedRegexp.exec(string)) {
        matches.push(mapper(match));
        if (!isGlobal) break;
      }

      return matches;
    }
  }

  var extractLinksFromElement_1 = extractLinksFromElement;

  function styleSheetToCssText(sheet) {
    var cssomAst = createAstFromCssom_1(sheet.cssRules);
    return lib.generate(lib.fromPlainObject({
      type: 'StyleSheet',
      children: cssomAst
    }));
  }

  var styleSheetToCssText_1 = styleSheetToCssText;

  var NEED_MAP_INPUT_TYPES = new Set(['date', 'datetime-local', 'email', 'month', 'number', 'password', 'search', 'tel', 'text', 'time', 'url', 'week']);
  var ON_EVENT_REGEX = /^on[a-z]+$/;

  function domNodesToCdt(docNode, baseUrl) {
    var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop$4;
    var cdt = [{
      nodeType: Node.DOCUMENT_NODE
    }];
    var docRoots = [docNode];
    var canvasElements = [];
    var inlineFrames = [];
    var linkUrls = [];
    cdt[0].childNodeIndexes = childrenFactory(cdt, docNode.childNodes);

    if (docNode.adoptedStyleSheets && docNode.adoptedStyleSheets.length > 0) {
      cdt[0].exp_adoptedStyleSheets = getAdoptedStyleSheets(docNode);
    }

    return {
      cdt: cdt,
      docRoots: docRoots,
      canvasElements: canvasElements,
      inlineFrames: inlineFrames,
      linkUrls: linkUrls
    };

    function childrenFactory(cdt, elementNodes) {
      if (!elementNodes || elementNodes.length === 0) return null;
      var childIndexes = [];
      Array.prototype.forEach.call(elementNodes, function (elementNode) {
        var index = elementNodeFactory(cdt, elementNode);

        if (index !== null) {
          childIndexes.push(index);
        }
      });
      return childIndexes;
    }

    function elementNodeFactory(cdt, elementNode) {
      var node, manualChildNodeIndexes, dummyUrl;
      var nodeType = elementNode.nodeType;

      if ([Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(nodeType)) {
        if (elementNode.nodeName !== 'SCRIPT') {
          if (elementNode.nodeName === 'STYLE' && elementNode.sheet && elementNode.sheet.cssRules.length) {
            cdt.push(getCssRulesNode(elementNode, log));
            manualChildNodeIndexes = [cdt.length - 1];
          }

          if (elementNode.tagName === 'TEXTAREA' && elementNode.value !== elementNode.textContent) {
            cdt.push(getTextContentNode(elementNode));
            manualChildNodeIndexes = [cdt.length - 1];
          }

          node = getBasicNode(elementNode);
          node.childNodeIndexes = manualChildNodeIndexes || (elementNode.childNodes.length ? childrenFactory(cdt, elementNode.childNodes) : []);

          if (elementNode.shadowRoot) {
            if (typeof window === 'undefined' || typeof elementNode.attachShadow === 'function' && /native code/.test(elementNode.attachShadow.toString())) {
              node.shadowRootIndex = elementNodeFactory(cdt, elementNode.shadowRoot);
              docRoots.push(elementNode.shadowRoot);
            } else {
              node.childNodeIndexes = node.childNodeIndexes.concat(childrenFactory(cdt, elementNode.shadowRoot.childNodes));
            }
          }

          if (elementNode.nodeName === 'CANVAS') {
            dummyUrl = absolutizeUrl_1("applitools-canvas-".concat(uuid_1(), ".png"), baseUrl);
            node.attributes.push({
              name: 'data-applitools-src',
              value: dummyUrl
            });
            canvasElements.push({
              element: elementNode,
              url: dummyUrl
            });
          }

          if (elementNode.nodeName === 'IFRAME' && isAccessibleFrame_1(elementNode) && isInlineFrame_1(elementNode)) {
            dummyUrl = absolutizeUrl_1("?applitools-iframe=".concat(uuid_1()), baseUrl);
            node.attributes.push({
              name: 'data-applitools-src',
              value: dummyUrl
            });
            inlineFrames.push({
              element: elementNode,
              url: dummyUrl
            });
          }

          if (elementNode.adoptedStyleSheets && elementNode.adoptedStyleSheets.length > 0) {
            node.exp_adoptedStyleSheets = getAdoptedStyleSheets(elementNode);
          }
        } else {
          node = getScriptNode(elementNode);
        }
      } else if (nodeType === Node.TEXT_NODE) {
        node = getTextNode(elementNode);
      } else if (nodeType === Node.DOCUMENT_TYPE_NODE) {
        node = getDocNode(elementNode);
      }

      if (node) {
        if (nodeType === Node.ELEMENT_NODE) {
          var linkUrlsFromElement = extractLinksFromElement_1(elementNode);

          if (linkUrlsFromElement.length > 0) {
            linkUrls = linkUrls.concat(linkUrlsFromElement);
          }
        }

        cdt.push(node);
        return cdt.length - 1;
      } else {
        return null;
      }
    }
  }

  function nodeAttributes(_ref) {
    var _ref$attributes = _ref.attributes,
        attributes = _ref$attributes === void 0 ? {} : _ref$attributes;
    return Object.keys(attributes).filter(function (k) {
      return attributes[k] && attributes[k].name;
    });
  }

  function getCssRulesNode(elementNode, log) {
    return {
      nodeType: Node.TEXT_NODE,
      nodeValue: processInlineCss_1(elementNode, log)
    };
  }

  function getTextContentNode(elementNode) {
    return {
      nodeType: Node.TEXT_NODE,
      nodeValue: elementNode.value
    };
  }

  function getBasicNode(elementNode) {
    var node = {
      nodeType: elementNode.nodeType,
      nodeName: elementNode.nodeName,
      attributes: nodeAttributes(elementNode).map(function (key) {
        var value = elementNode.attributes[key].value;
        var name = elementNode.attributes[key].name;

        if (/^blob:/.test(value)) {
          value = value.replace(/^blob:/, '');
        } else if (ON_EVENT_REGEX.test(name)) {
          value = '';
        } else if (elementNode.nodeName === 'IFRAME' && isAccessibleFrame_1(elementNode) && name === 'src' && elementNode.contentDocument.location.href !== 'about:blank' && elementNode.contentDocument.location.href !== absolutizeUrl_1(value, elementNode.ownerDocument.location.href)) {
          value = elementNode.contentDocument.location.href;
        }

        return {
          name: name,
          value: value
        };
      })
    };

    if (elementNode.tagName === 'INPUT' && ['checkbox', 'radio'].includes(elementNode.type)) {
      if (elementNode.attributes.checked && !elementNode.checked) {
        var idx = node.attributes.findIndex(function (a) {
          return a.name === 'checked';
        });
        node.attributes.splice(idx, 1);
      }

      if (!elementNode.attributes.checked && elementNode.checked) {
        node.attributes.push({
          name: 'checked'
        });
      }
    }

    if (elementNode.tagName === 'INPUT' && NEED_MAP_INPUT_TYPES.has(elementNode.type) && (elementNode.attributes.value && elementNode.attributes.value.value) !== elementNode.value) {
      addOrUpdateAttribute(node.attributes, 'value', elementNode.value);
    }

    if (elementNode.tagName === 'OPTION' && elementNode.parentElement.selectedOptions && Array.from(elementNode.parentElement.selectedOptions).indexOf(elementNode) > -1) {
      addOrUpdateAttribute(node.attributes, 'selected', '');
    }

    if (elementNode.tagName === 'STYLE' && elementNode.sheet && elementNode.sheet.disabled) {
      node.attributes.push({
        name: 'data-applitools-disabled',
        value: ''
      });
    }

    if (elementNode.tagName === 'LINK' && elementNode.type === 'text/css' && elementNode.sheet && elementNode.sheet.disabled) {
      addOrUpdateAttribute(node.attributes, 'disabled', '');
    }

    return node;
  }

  function addOrUpdateAttribute(attributes, name, value) {
    var nodeAttr = attributes.find(function (a) {
      return a.name === name;
    });

    if (nodeAttr) {
      nodeAttr.value = value;
    } else {
      attributes.push({
        name: name,
        value: value
      });
    }
  }

  function getScriptNode(elementNode) {
    return {
      nodeType: Node.ELEMENT_NODE,
      nodeName: 'SCRIPT',
      attributes: nodeAttributes(elementNode).map(function (key) {
        var name = elementNode.attributes[key].name;
        var value = ON_EVENT_REGEX.test(name) ? '' : elementNode.attributes[key].value;
        return {
          name: name,
          value: value
        };
      }).filter(function (attr) {
        return attr.name !== 'src';
      }),
      childNodeIndexes: []
    };
  }

  function getTextNode(elementNode) {
    return {
      nodeType: Node.TEXT_NODE,
      nodeValue: elementNode.nodeValue
    };
  }

  function getDocNode(elementNode) {
    return {
      nodeType: Node.DOCUMENT_TYPE_NODE,
      nodeName: elementNode.nodeName
    };
  }

  function getAdoptedStyleSheets(node) {
    return Array.from(node.adoptedStyleSheets).map(styleSheetToCssText_1);
  }

  var domNodesToCdt_1 = domNodesToCdt;

  function uniq(arr) {
    var result = [];
    new Set(arr).forEach(function (v) {
      return v && result.push(v);
    });
    return result;
  }

  var uniq_1 = uniq;

  function aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr) {
    return resourceUrlsAndBlobsArr.reduce(function (_ref, _ref2) {
      var allResourceUrls = _ref.resourceUrls,
          allBlobsObj = _ref.blobsObj;
      var resourceUrls = _ref2.resourceUrls,
          blobsObj = _ref2.blobsObj;
      return {
        resourceUrls: uniq_1(allResourceUrls.concat(resourceUrls)),
        blobsObj: Object.assign(allBlobsObj, blobsObj)
      };
    }, {
      resourceUrls: [],
      blobsObj: {}
    });
  }

  var aggregateResourceUrlsAndBlobs_1 = aggregateResourceUrlsAndBlobs;

  function makeGetResourceUrlsAndBlobs(_ref) {
    var processResource = _ref.processResource,
        aggregateResourceUrlsAndBlobs = _ref.aggregateResourceUrlsAndBlobs;
    return function getResourceUrlsAndBlobs(_ref2) {
      var documents = _ref2.documents,
          urls = _ref2.urls,
          _ref2$forceCreateStyl = _ref2.forceCreateStyle,
          forceCreateStyle = _ref2$forceCreateStyl === void 0 ? false : _ref2$forceCreateStyl,
          skipResources = _ref2.skipResources;
      return Promise.all(urls.map(function (url) {
        return processResource({
          url: url,
          documents: documents,
          getResourceUrlsAndBlobs: getResourceUrlsAndBlobs,
          forceCreateStyle: forceCreateStyle,
          skipResources: skipResources
        });
      })).then(function (resourceUrlsAndBlobsArr) {
        return aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr);
      });
    };
  }

  var getResourceUrlsAndBlobs = makeGetResourceUrlsAndBlobs;

  function filterInlineUrl(absoluteUrl) {
    return /^(blob|https?):/.test(absoluteUrl);
  }

  var filterInlineUrl_1 = filterInlineUrl;

  function toUnAnchoredUri(url) {
    var m = url && url.match(/(^[^#]*)/);
    var res = m && m[1] || url;
    return res && res.replace(/\?\s*$/, '?') || url;
  }

  var toUnAnchoredUri_1 = toUnAnchoredUri;

  function flat(arr) {
    return arr.reduce(function (flatArr, item) {
      return flatArr.concat(item);
    }, []);
  }

  var flat_1 = flat;

  function makeProcessResource(_ref) {
    var fetchUrl = _ref.fetchUrl,
        findStyleSheetByUrl = _ref.findStyleSheetByUrl,
        getCorsFreeStyleSheet = _ref.getCorsFreeStyleSheet,
        extractResourcesFromStyleSheet = _ref.extractResourcesFromStyleSheet,
        extractResourcesFromSvg = _ref.extractResourcesFromSvg,
        sessionCache = _ref.sessionCache,
        _ref$cache = _ref.cache,
        cache = _ref$cache === void 0 ? {} : _ref$cache,
        _ref$log = _ref.log,
        log = _ref$log === void 0 ? noop$4 : _ref$log;
    return function processResource(_ref2) {
      var url = _ref2.url,
          documents = _ref2.documents,
          getResourceUrlsAndBlobs = _ref2.getResourceUrlsAndBlobs,
          _ref2$forceCreateStyl = _ref2.forceCreateStyle,
          forceCreateStyle = _ref2$forceCreateStyl === void 0 ? false : _ref2$forceCreateStyl,
          skipResources = _ref2.skipResources;

      if (!cache[url]) {
        if (sessionCache && sessionCache.getItem(url)) {
          var resourceUrls = getDependencies(url);
          log('doProcessResource from sessionStorage', url, 'deps:', resourceUrls.slice(1));
          cache[url] = Promise.resolve({
            resourceUrls: resourceUrls
          });
        } else if (skipResources && skipResources.indexOf(url) > -1 || /https:\/\/fonts.googleapis.com/.test(url)) {
          log('not processing resource from skip list (or google font):', url);
          cache[url] = Promise.resolve({
            resourceUrls: [url]
          });
        } else {
          var now = Date.now();
          cache[url] = doProcessResource(url).then(function (result) {
            log('doProcessResource', "[".concat(Date.now() - now, "ms]"), url);
            return result;
          });
        }
      }

      return cache[url];

      function doProcessResource(url) {
        log('fetching', url);
        var now = Date.now();
        return fetchUrl(url).catch(function (e) {
          if (probablyCORS(e)) {
            return {
              probablyCORS: true,
              url: url
            };
          } else if (e.isTimeout) {
            return {
              isTimeout: true,
              url: url
            };
          } else {
            throw e;
          }
        }).then(function (_ref3) {
          var url = _ref3.url,
              type = _ref3.type,
              value = _ref3.value,
              probablyCORS = _ref3.probablyCORS,
              errorStatusCode = _ref3.errorStatusCode,
              isTimeout = _ref3.isTimeout;

          if (probablyCORS) {
            log('not fetched due to CORS', "[".concat(Date.now() - now, "ms]"), url);
            sessionCache && sessionCache.setItem(url, []);
            return {
              resourceUrls: [url]
            };
          }

          if (errorStatusCode) {
            var blobsObj = _defineProperty({}, url, {
              errorStatusCode: errorStatusCode
            });

            sessionCache && sessionCache.setItem(url, []);
            return {
              blobsObj: blobsObj
            };
          }

          if (isTimeout) {
            log('not fetched due to timeout, returning error status code 504 (Gateway timeout)');
            sessionCache && sessionCache.setItem(url, []);
            return {
              blobsObj: _defineProperty({}, url, {
                errorStatusCode: 504
              })
            };
          }

          log("fetched [".concat(Date.now() - now, "ms] ").concat(url, " bytes: ").concat(value.byteLength));

          var thisBlob = _defineProperty({}, url, {
            type: type,
            value: value
          });

          var dependentUrls;

          if (/text\/css/.test(type)) {
            var styleSheet = findStyleSheetByUrl(url, documents);

            if (styleSheet || forceCreateStyle) {
              var _getCorsFreeStyleShee = getCorsFreeStyleSheet(value, styleSheet),
                  corsFreeStyleSheet = _getCorsFreeStyleShee.corsFreeStyleSheet,
                  cleanStyleSheet = _getCorsFreeStyleShee.cleanStyleSheet;

              dependentUrls = extractResourcesFromStyleSheet(corsFreeStyleSheet);
              cleanStyleSheet();
            }
          } else if (/image\/svg/.test(type)) {
            try {
              dependentUrls = extractResourcesFromSvg(value);
              forceCreateStyle = !!dependentUrls;
            } catch (e) {
              log('could not parse svg content', e);
            }
          }

          if (dependentUrls) {
            var absoluteDependentUrls = dependentUrls.map(function (resourceUrl) {
              return absolutizeUrl_1(resourceUrl, url.replace(/^blob:/, ''));
            }).map(toUnAnchoredUri_1).filter(filterInlineUrl_1);
            sessionCache && sessionCache.setItem(url, absoluteDependentUrls);
            return getResourceUrlsAndBlobs({
              documents: documents,
              urls: absoluteDependentUrls,
              forceCreateStyle: forceCreateStyle,
              skipResources: skipResources
            }).then(function (_ref4) {
              var resourceUrls = _ref4.resourceUrls,
                  blobsObj = _ref4.blobsObj;
              return {
                resourceUrls: resourceUrls,
                blobsObj: Object.assign(blobsObj, thisBlob)
              };
            });
          } else {
            sessionCache && sessionCache.setItem(url, []);
            return {
              blobsObj: thisBlob
            };
          }
        }).catch(function (err) {
          log('error while fetching', url, err, err ? "message=".concat(err.message, " | name=").concat(err.name) : '');
          sessionCache && clearFromSessionStorage();
          return {};
        });
      }

      function probablyCORS(err) {
        var msg = err.message && (err.message.includes('Failed to fetch') || err.message.includes('Network request failed'));
        var name = err.name && err.name.includes('TypeError');
        return msg && name;
      }

      function getDependencies(url) {
        var dependentUrls = sessionCache.getItem(url);
        return [url].concat(dependentUrls ? uniq_1(flat_1(dependentUrls.map(getDependencies))) : []);
      }

      function clearFromSessionStorage() {
        log('clearing from sessionStorage:', url);
        sessionCache.keys().forEach(function (key) {
          var dependentUrls = sessionCache.getItem(key);
          sessionCache.setItem(key, dependentUrls.filter(function (dep) {
            return dep !== url;
          }));
        });
        log('cleared from sessionStorage:', url);
      }
    };
  }

  var processResource = makeProcessResource;

  function makeExtractResourcesFromSvg(_ref) {
    var parser = _ref.parser,
        decoder = _ref.decoder,
        extractResourceUrlsFromStyleTags = _ref.extractResourceUrlsFromStyleTags;
    return function (svgArrayBuffer) {
      var decooder = decoder || new TextDecoder('utf-8');
      var svgStr = decooder.decode(svgArrayBuffer);
      var domparser = parser || new DOMParser();
      var doc = domparser.parseFromString(svgStr, 'image/svg+xml');
      var srcsetUrls = Array.from(doc.querySelectorAll('img[srcset]')).map(function (srcsetEl) {
        return srcsetEl.getAttribute('srcset').split(', ').map(function (str) {
          return str.trim().split(/\s+/)[0];
        });
      }).reduce(function (acc, urls) {
        return acc.concat(urls);
      }, []);
      var srcUrls = Array.from(doc.querySelectorAll('img[src]')).map(function (srcEl) {
        return srcEl.getAttribute('src');
      });
      var fromHref = Array.from(doc.querySelectorAll('image,use,link[rel="stylesheet"]')).map(function (e) {
        return e.getAttribute('href') || e.getAttribute('xlink:href');
      });
      var fromObjects = Array.from(doc.getElementsByTagName('object')).map(function (e) {
        return e.getAttribute('data');
      });
      var fromStyleTags = extractResourceUrlsFromStyleTags(doc, false);
      var fromStyleAttrs = urlsFromStyleAttrOfDoc(doc);
      return srcsetUrls.concat(srcUrls).concat(fromHref).concat(fromObjects).concat(fromStyleTags).concat(fromStyleAttrs).filter(function (u) {
        return u[0] !== '#';
      });
    };
  }

  function urlsFromStyleAttrOfDoc(doc) {
    return flat_1(Array.from(doc.querySelectorAll('*[style]')).map(function (e) {
      return e.style.cssText;
    }).map(getUrlFromCssText_1).filter(Boolean));
  }

  var makeExtractResourcesFromSvg_1 = makeExtractResourcesFromSvg;

  function makeFetchUrl(_ref) {
    var _ref$fetch = _ref.fetch,
        fetch = _ref$fetch === void 0 ? window.fetch : _ref$fetch,
        _ref$AbortController = _ref.AbortController,
        AbortController = _ref$AbortController === void 0 ? window.AbortController : _ref$AbortController,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? 10000 : _ref$timeout;
    return function fetchUrl(url) {
      // Why return a `new Promise` like this? Because people like Atlassian do horrible things.
      // They monkey patched window.fetch, and made it so it throws a synchronous exception if the route is not well known.
      // Returning a new Promise guarantees that `fetchUrl` is the async function that it declares to be.
      return new Promise(function (resolve, reject) {
        var controller = new AbortController();
        var timeoutId = setTimeout(function () {
          var err = new Error('fetchUrl timeout reached');
          err.isTimeout = true;
          reject(err);
          controller.abort();
        }, timeout);
        return fetch(url, {
          cache: 'force-cache',
          credentials: 'same-origin',
          signal: controller.signal
        }).then(function (resp) {
          clearTimeout(timeoutId);

          if (resp.status === 200) {
            return resp.arrayBuffer().then(function (buff) {
              return {
                url: url,
                type: resp.headers.get('Content-Type'),
                value: buff
              };
            });
          } else {
            return {
              url: url,
              errorStatusCode: resp.status
            };
          }
        }).then(resolve).catch(function (err) {
          return reject(err);
        });
      });
    };
  }

  var fetchUrl = makeFetchUrl;

  function sanitizeAuthUrl(urlStr) {
    var url = new URL(urlStr);

    if (url.username) {
      url.username = '';
    }

    if (url.password) {
      url.password = '';
    }

    return url.href;
  }

  var sanitizeAuthUrl_1 = sanitizeAuthUrl;

  function makeFindStyleSheetByUrl(_ref) {
    var styleSheetCache = _ref.styleSheetCache;
    return function findStyleSheetByUrl(url, documents) {
      var allStylesheets = flat_1(documents.map(function (d) {
        try {
          return Array.from(d.styleSheets);
        } catch (_e) {
          // A 'fake' documnetFragment doesn't have styleSheets
          return [];
        }
      }));
      return styleSheetCache[url] || allStylesheets.find(function (styleSheet) {
        var styleUrl = styleSheet.href && toUnAnchoredUri_1(styleSheet.href);
        return styleUrl && sanitizeAuthUrl_1(styleUrl) === url;
      });
    };
  }

  var findStyleSheetByUrl = makeFindStyleSheetByUrl;

  function makeExtractResourcesFromStyleSheet(_ref) {
    var styleSheetCache = _ref.styleSheetCache,
        _ref$CSSRule = _ref.CSSRule,
        CSSRule = _ref$CSSRule === void 0 ? window.CSSRule : _ref$CSSRule;
    return function extractResourcesFromStyleSheet(styleSheet) {
      var urls = uniq_1(Array.from(styleSheet.cssRules || []).reduce(function (acc, rule) {
        var _CSSRule$IMPORT_RULE$;

        var getRuleUrls = (_CSSRule$IMPORT_RULE$ = {}, _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.IMPORT_RULE, function () {
          if (rule.styleSheet) {
            styleSheetCache[rule.styleSheet.href] = rule.styleSheet;
          }

          return rule.href;
        }), _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.FONT_FACE_RULE, function () {
          return getUrlFromCssText_1(rule.cssText);
        }), _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.SUPPORTS_RULE, function () {
          return extractResourcesFromStyleSheet(rule);
        }), _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.MEDIA_RULE, function () {
          return extractResourcesFromStyleSheet(rule);
        }), _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.STYLE_RULE, function () {
          var rv = [];

          for (var i = 0, ii = rule.style.length; i < ii; i++) {
            var property = rule.style[i];
            var propertyValue = rule.style.getPropertyValue(property);

            if (/^\s*var\s*\(/.test(propertyValue) || /^--/.test(property)) {
              propertyValue = unescapeCss(propertyValue);
            }

            var _urls = getUrlFromCssText_1(propertyValue);

            rv = rv.concat(_urls);
          }

          return rv;
        }), _CSSRule$IMPORT_RULE$)[rule.type];
        var urls = getRuleUrls && getRuleUrls() || [];
        return acc.concat(urls);
      }, []));
      return urls.filter(function (u) {
        return u[0] !== '#';
      });
    };
  } // copied from https://github.com/applitools/mono/commit/512ed8b805ab0ee6701ee04301e982afb382a7f0#diff-4d4bb24a63912943219ab77a43b29ee3R99


  function unescapeCss(text) {
    return text.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, function (original) {
      return String.fromCodePoint(parseInt(original.substr(1).trim(), 16));
    }).replace(/\\([^0-9a-fA-F])/g, '$1');
  }

  var extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet;

  function makeExtractResourceUrlsFromStyleTags(extractResourcesFromStyleSheet) {
    return function extractResourceUrlsFromStyleTags(doc) {
      var onlyDocStylesheet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return uniq_1(Array.from(doc.querySelectorAll('style')).reduce(function (resourceUrls, styleEl) {
        var styleSheet = onlyDocStylesheet ? Array.from(doc.styleSheets).find(function (styleSheet) {
          return styleSheet.ownerNode === styleEl;
        }) : styleEl.sheet;
        return styleSheet ? resourceUrls.concat(extractResourcesFromStyleSheet(styleSheet)) : resourceUrls;
      }, []));
    };
  }

  var extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags;

  function createTempStylsheet(cssArrayBuffer) {
    var cssText = new TextDecoder('utf-8').decode(cssArrayBuffer);
    var head = document.head || document.querySelectorAll('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('data-desc', 'Applitools tmp variable created by DOM SNAPSHOT');
    head.appendChild(style); // This is required for IE8 and below.

    if (style.styleSheet) {
      style.styleSheet.cssText = cssText;
    } else {
      style.appendChild(document.createTextNode(cssText));
    }

    return style.sheet;
  }

  var createTempStyleSheet = createTempStylsheet;

  function getCorsFreeStyleSheet(cssArrayBuffer, styleSheet) {
    var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop$4;
    var corsFreeStyleSheet;

    if (styleSheet) {
      try {
        styleSheet.cssRules;
        corsFreeStyleSheet = styleSheet;
      } catch (e) {
        log("[dom-snapshot] could not access cssRules for ".concat(styleSheet.href, " ").concat(e, "\ncreating temp style for access."));
        corsFreeStyleSheet = createTempStyleSheet(cssArrayBuffer);
      }
    } else {
      corsFreeStyleSheet = createTempStyleSheet(cssArrayBuffer);
    }

    return {
      corsFreeStyleSheet: corsFreeStyleSheet,
      cleanStyleSheet: cleanStyleSheet
    };

    function cleanStyleSheet() {
      if (corsFreeStyleSheet !== styleSheet) {
        corsFreeStyleSheet.ownerNode.parentNode.removeChild(corsFreeStyleSheet.ownerNode);
      }
    }
  }

  var getCorsFreeStyleSheet_1 = getCorsFreeStyleSheet;

  function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
  }

  var base64ToArrayBuffer_1 = base64ToArrayBuffer;

  function buildCanvasBlobs(canvasElements) {
    return canvasElements.map(function (_ref) {
      var url = _ref.url,
          element = _ref.element;
      var data = element.toDataURL('image/png');
      var value = base64ToArrayBuffer_1(data.split(',')[1]);
      return {
        url: url,
        type: 'image/png',
        value: value
      };
    });
  }

  var buildCanvasBlobs_1 = buildCanvasBlobs;

  function extractFrames() {
    var documents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [document];
    var iframes = flat_1(documents.map(function (d) {
      return Array.from(d.querySelectorAll('iframe[src]:not([src=""]),iframe[srcdoc]:not([srcdoc=""])'));
    }));
    return iframes.filter(function (f) {
      return isAccessibleFrame_1(f) && !isInlineFrame_1(f);
    }).map(function (f) {
      return f.contentDocument;
    });
  }

  var extractFrames_1 = extractFrames;

  var getBaesUrl = function getBaesUrl(doc) {
    var baseUrl = doc.querySelectorAll('base')[0] && doc.querySelectorAll('base')[0].href;

    if (baseUrl && isUrl(baseUrl)) {
      return baseUrl;
    }
  };

  function isUrl(url) {
    return url && !/^(about:blank|javascript:void|blob:)/.test(url);
  }

  var getBaseUrl = getBaesUrl;

  function toUriEncoding(url) {
    var result = url && url.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, function (s) {
      var int = parseInt(s.substr(1).trim(), 16);
      return String.fromCodePoint(int);
    }) || url;
    return result;
  }

  var toUriEncoding_1 = toUriEncoding;

  function makeLog(referenceTime) {
    return function log() {
      var args = ['[dom-snapshot]', "[+".concat(Date.now() - referenceTime, "ms]")].concat(Array.from(arguments));
      console.log.apply(console, args);
    };
  }

  var log$9 = makeLog;

  var RESOURCE_STORAGE_KEY = '__process_resource';

  function makeSessionCache(_ref) {
    var log = _ref.log,
        sessionStorage = _ref.sessionStorage;
    var sessionStorageCache;

    try {
      sessionStorage = sessionStorage || window.sessionStorage;
      var sessionStorageCacheStr = sessionStorage.getItem(RESOURCE_STORAGE_KEY);
      sessionStorageCache = sessionStorageCacheStr ? JSON.parse(sessionStorageCacheStr) : {};
    } catch (ex) {
      log('error creating session cache', ex);
    }

    return {
      getItem: getItem,
      setItem: setItem,
      keys: keys,
      persist: persist
    };

    function getItem(key) {
      if (sessionStorageCache) {
        return sessionStorageCache[key];
      }
    }

    function setItem(key, value) {
      if (sessionStorageCache) {
        log('saving to in-memory sessionStorage, key:', key, 'value:', value);
        sessionStorageCache[key] = value;
      }
    }

    function keys() {
      if (sessionStorageCache) {
        return Object.keys(sessionStorageCache);
      } else {
        return [];
      }
    }

    function persist() {
      if (sessionStorageCache) {
        sessionStorage.setItem(RESOURCE_STORAGE_KEY, JSON.stringify(sessionStorageCache));
      }
    }
  }

  var sessionCache = makeSessionCache;

  function processPage() {
    var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        showLogs = _ref.showLogs,
        useSessionCache = _ref.useSessionCache,
        dontFetchResources = _ref.dontFetchResources,
        fetchTimeout = _ref.fetchTimeout,
        skipResources = _ref.skipResources;

    /* MARKER FOR TEST - DO NOT DELETE */
    var log = showLogs ? log$9(Date.now()) : noop$4;
    log('processPage start');
    log("skipResources length: ".concat(skipResources && skipResources.length));
    var sessionCache$$1 = useSessionCache && sessionCache({
      log: log
    });
    var styleSheetCache = {};
    var extractResourcesFromStyleSheet$$1 = extractResourcesFromStyleSheet({
      styleSheetCache: styleSheetCache
    });
    var findStyleSheetByUrl$$1 = findStyleSheetByUrl({
      styleSheetCache: styleSheetCache
    });
    var extractResourceUrlsFromStyleTags$$1 = extractResourceUrlsFromStyleTags(extractResourcesFromStyleSheet$$1);
    var extractResourcesFromSvg = makeExtractResourcesFromSvg_1({
      extractResourceUrlsFromStyleTags: extractResourceUrlsFromStyleTags$$1
    });
    var fetchUrl$$1 = fetchUrl({
      timeout: fetchTimeout
    });
    var processResource$$1 = processResource({
      fetchUrl: fetchUrl$$1,
      findStyleSheetByUrl: findStyleSheetByUrl$$1,
      getCorsFreeStyleSheet: getCorsFreeStyleSheet_1,
      extractResourcesFromStyleSheet: extractResourcesFromStyleSheet$$1,
      extractResourcesFromSvg: extractResourcesFromSvg,
      absolutizeUrl: absolutizeUrl_1,
      log: log,
      sessionCache: sessionCache$$1
    });
    var getResourceUrlsAndBlobs$$1 = getResourceUrlsAndBlobs({
      processResource: processResource$$1,
      aggregateResourceUrlsAndBlobs: aggregateResourceUrlsAndBlobs_1
    });
    return doProcessPage(doc).then(function (result) {
      log('processPage end');
      result.scriptVersion = '4.0.3';
      return result;
    });

    function doProcessPage(doc) {
      var pageUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : doc.location.href;
      var baseUrl = getBaseUrl(doc) || pageUrl;

      var _domNodesToCdt = domNodesToCdt_1(doc, baseUrl, log),
          cdt = _domNodesToCdt.cdt,
          docRoots = _domNodesToCdt.docRoots,
          canvasElements = _domNodesToCdt.canvasElements,
          inlineFrames = _domNodesToCdt.inlineFrames,
          linkUrls = _domNodesToCdt.linkUrls;

      var styleTagUrls = flat_1(docRoots.map(function (docRoot) {
        return extractResourceUrlsFromStyleTags$$1(docRoot);
      }));
      var absolutizeThisUrl = getAbsolutizeByUrl(baseUrl);
      var urls = uniq_1(Array.from(linkUrls).concat(Array.from(styleTagUrls))).map(toUriEncoding_1).map(absolutizeThisUrl).map(toUnAnchoredUri_1).filter(filterInlineUrlsIfExisting);
      var resourceUrlsAndBlobsPromise = dontFetchResources ? Promise.resolve({
        resourceUrls: urls,
        blobsObj: {}
      }) : getResourceUrlsAndBlobs$$1({
        documents: docRoots,
        urls: urls,
        skipResources: skipResources
      }).then(function (result) {
        sessionCache$$1 && sessionCache$$1.persist();
        return result;
      });
      var canvasBlobs = buildCanvasBlobs_1(canvasElements);
      var frameDocs = extractFrames_1(docRoots);
      var processFramesPromise = frameDocs.map(function (f) {
        return doProcessPage(f);
      });
      var processInlineFramesPromise = inlineFrames.map(function (_ref2) {
        var element = _ref2.element,
            url = _ref2.url;
        return doProcessPage(element.contentDocument, url);
      });
      var srcAttr = doc.defaultView && doc.defaultView.frameElement && doc.defaultView.frameElement.getAttribute('src');
      return Promise.all([resourceUrlsAndBlobsPromise].concat(processFramesPromise).concat(processInlineFramesPromise)).then(function (resultsWithFrameResults) {
        var _resultsWithFrameResu = resultsWithFrameResults[0],
            resourceUrls = _resultsWithFrameResu.resourceUrls,
            blobsObj = _resultsWithFrameResu.blobsObj;
        var framesResults = resultsWithFrameResults.slice(1);
        return {
          cdt: cdt,
          url: pageUrl,
          srcAttr: srcAttr,
          resourceUrls: resourceUrls.map(function (url) {
            return url.replace(/^blob:/, '');
          }),
          blobs: blobsObjToArray(blobsObj).concat(canvasBlobs),
          frames: framesResults
        };
      });
    }
  }

  function getAbsolutizeByUrl(url) {
    return function (someUrl) {
      try {
        return absolutizeUrl_1(someUrl, url);
      } catch (err) {// can't do anything with a non-absolute url
      }
    };
  }

  function blobsObjToArray(blobsObj) {
    return Object.keys(blobsObj).map(function (blobUrl) {
      return Object.assign({
        url: blobUrl.replace(/^blob:/, '')
      }, blobsObj[blobUrl]);
    });
  }

  function filterInlineUrlsIfExisting(absoluteUrl) {
    return absoluteUrl && filterInlineUrl_1(absoluteUrl);
  }

  var processPage_1 = processPage;

  function processPageAndSerialize() {
    return processPage_1.apply(this, arguments).then(serializeFrame);
  }

  function serializeFrame(frame) {
    frame.blobs = frame.blobs.map(function (blob) {
      return blob.value ? Object.assign(blob, {
        value: arrayBufferToBase64_1(blob.value)
      }) : blob;
    });
    frame.frames.forEach(serializeFrame);
    return frame;
  }

  var processPageAndSerialize_1 = processPageAndSerialize;

  return processPageAndSerialize_1;

}());

  return processPageAndSerializeForIE.apply(this, arguments);
}