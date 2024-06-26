const data = require('./decodedpng.js');
const cryptoJs = require('crypto-js');
const embed_url = "https://rabbitstream.net/v2/embed-4/";
const referrer = "https://flixhq.to/";
const user_agent = "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0";

/**
 * Main function to handle the WebAssembly (WASM) processing and fetching of video sources.
 * @param {string} xrax - The unique identifier for the resource.
 * @returns {Promise<Object>} - An object containing video sources and caption sources.
 */
const main = async (xrax) => {
  let wasm;  // Declare WASM variable
  let arr = new Array(128).fill(void 0);  // Initialize an array with 128 undefined elements
  const dateNow = Date.now();  // Current timestamp
  let content = '';

  const dataURL = "data:image/png;base64,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AAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEECAQGcMIIAAAgggIECAQBfQREpAAAEEEEDg/wHoLKy4poZUMgAAAABJRU5ErkJggg==";

  const meta = {
    content: content
  }

  const image_data = {
    height: 50,
    width: 65,
    data: data.data,
  }

  // Fake window object to simulate a browser environment
  const fake_window = {
    localStorage: {
      setItem: function (item, value) {
        fake_window.localStorage[item] = value;
      }
    },
    navigator: {
      webdriver: false,
      userAgent: user_agent,
    },
    length: 0,
    document: {
      cookie: "",
    },
    origin: "https://rabbitstream.net",
    location: {
      href: "https://rabbitstream.net/v2/embed-4/mcAWNPptFcOb?z=",
      origin: "https://rabbitstream.net",
    },
    performance: {
      timeOrigin: dateNow,
    },
    xrax: ''
  };

  const canvas = {
    baseUrl: "https://rabbitstream.net/v2/embed-4/mcAWNPptFcOb?z=",
    width: 0,
    height: 0,
    style: {
      style: {
        display: "inline",
      },
    }
  }

  const nodeList = {
    image: {
      src: "https://rabbitstream.net/images/image.png?v=0.1.4",
      height: 50,
      width: 65,
      complete: true,
    },
    context2d: {},
    length: 1,
  }

  let script_url = "https://rabbitstream.net/v2/embed-4/z1AOmWCJVgcy?z=";

  /**
   * Get an element from the array by index.
   * @param {number} index - The index of the element.
   * @returns {any} - The element at the given index.
   */
  function get(index) {
    return arr[index];
  }

  arr.push(void 0, null, true, false);  // Push additional elements into the array

  let size = 0;
  let memoryBuff;

  /**
   * Get the memory buffer from WASM.
   * @returns {Uint8Array} - The memory buffer.
   */
  function getMemBuff() {
    return memoryBuff = null !== memoryBuff && 0 !== memoryBuff.byteLength ? memoryBuff : new Uint8Array(wasm.memory.buffer);
  }

  const encoder = new TextEncoder();

  /**
   * Encode text into the given array.
   * @param {string} text - The text to encode.
   * @param {Uint8Array} array - The array to encode into.
   * @returns {TextEncoder} - The encoder instance.
   */
  const encode = function (text, array) {
    return encoder.encodeInto(text, array)
  }

  /**
   * Parse text and encode it into the memory buffer.
   * @param {string} text - The text to parse.
   * @param {Function} func - The function to call for parsing.
   * @param {Function} [func2] - Optional second function for parsing.
   * @returns {number} - The parsed length.
   */
  function parse(text, func, func2) {
    if (void 0 === func2) {
      var encoded = encoder.encode(text);
      const parsedIndex = func(encoded.length, 1) >>> 0;
      getMemBuff().subarray(parsedIndex, parsedIndex + encoded.length).set(encoded);
      size = encoded.length;
      return parsedIndex;
    }
    let len = text.length;
    let parsedLen = func(len, 1) >>> 0;
    var new_arr = getMemBuff();
    let i = 0;
    for (; i < len; i++) {
      var char = text.charCodeAt(i);
      if (127 < char) {
        break;
      }
      new_arr[parsedLen + i] = char;
    }
    if (i !== len) {
      if (i !== 0) {
        text = text.slice(i);
      }
      parsedLen = func2(parsedLen, len, len = i + 3 * text.length, 1) >>> 0;
      const encoded = getMemBuff().subarray(parsedLen + i, parsedLen + len);
      i += encode(text, encoded).written;
      parsedLen = func2(parsedLen, len, i, 1) >>> 0;
    }
    size = i;
    return parsedLen;
  }

  let arr32;

  /**
   * Check if a value is null.
   * @param {any} test - The value to check.
   * @returns {boolean} - True if the value is null, false otherwise.
   */
  function isNull(test) {
    return null == test;
  }

  /**
   * Get the 32-bit integer array from WASM memory.
   * @returns {Int32Array} - The 32-bit integer array.
   */
  function getArr32() {
    return arr32 = null !== arr32 && 0 !== arr32.byteLength ? arr32 : new Int32Array(wasm.memory.buffer);
  }

  let pointer = arr.length;

  /**
   * Shift function for the array.
   * @param {number} QP - The value to shift.
   */
  function shift(QP) {
    QP < 132 || (arr[QP] = pointer, pointer = QP);
  }

  /**
   * Get and shift function.
   * @param {number} QP - The value to get and shift.
   * @returns {any} - The shifted value.
   */
  function shiftGet(QP) {
    var Qn = get(QP);
    shift(QP);
    return Qn;
  }

  const decoder = new TextDecoder("utf-8", {
    fatal: true,
    ignoreBOM: true,
  });

  /**
   * Decode a subarray of the memory buffer.
   * @param {number} index - The starting index.
   * @param {number} offset - The offset length.
   * @returns {string} - The decoded string.
   */
  function decodeSub(index, offset) {
    index >>>= 0;
    return decoder.decode(getMemBuff().subarray(index, index + offset));
  }

  /**
   * Add an item to the stack.
   * @param {any} item - The item to add.
   * @returns {number} - The index of the added item.
   */
  function addToStack(item) {
    pointer === arr.length && arr.push(arr.length + 1);
    var Qn = pointer;
    pointer = arr[Qn];
    arr[Qn] = item;
    return Qn;
  }

  /**
   * Handle arguments and wrapping for WASM calls.
   * @param {number} QP - The first argument.
   * @param {number} Qn - The second argument.
   * @param {number} QT - The destructor index.
   * @param {Function} func - The function to wrap.
   * @returns {Function} - The wrapped function.
   */
  function args(QP, Qn, QT, func) {
    const Qx = {
      'a': QP,
      'b': Qn,
      'cnt': 1,
      'dtor': QT
    }
    QP = (...Qw) => {
      Qx.cnt++;
      try {
        return func(Qx.a, Qx.b, ...Qw);
      } finally {
        0 == --Qx.cnt && (wasm.__wbindgen_export_2.get(Qx.dtor)(Qx.a, Qx.b), Qx.a = 0);
      }
    };
    QP.original = Qx;
    return QP;
  }

  /**
   * Export function 3 for WASM.
   * @param {number} QP - The first argument.
   * @param {number} Qn - The second argument.
   */
  function export3(QP, Qn) {
    wasm.__wbindgen_export_3(QP, Qn);
  }

  /**
   * Export function 4 for WASM.
   * @param {number} QP - The first argument.
   * @param {number} Qn - The second argument.
   * @returns {any} - The shifted value.
   */
  function export4(QP, Qn) {
    return shiftGet(wasm.__wbindgen_export_4(QP, Qn));
  }

  /**
   * Export function 5 for WASM.
   * @param {number} QP - The first argument.
   * @param {number} Qn - The second argument.
   * @param {any} QT - The value to add to the stack.
   */
  function export5(QP, Qn, QT) {
    wasm.__wbindgen_export_5(QP, Qn, addToStack(QT));
  }

  /**
   * Apply a function to the fake window object.
   * @param {Function} func - The function to apply.
   * @param {Array} args - The arguments to apply with.
   * @returns {any} - The result of the function application.
   */
  function applyToWindow(func, args) {
    try {
      return func.apply(fake_window, args);
    } catch (error) {
      wasm.__wbindgen_export_6(addToStack(error));
    }
  }

  /**
   * Encode a query to the memory buffer.
   * @param {Uint8Array} QP - The query array.
   * @param {Function} Qn - The function to encode with.
   * @returns {number} - The encoded length.
   */
  function Qj(QP, Qn) {
    Qn = Qn(+QP.length, 1) >>> 0;
    getMemBuff().set(QP, Qn);
    size = QP.length;
    return Qn;
  }

  /**
   * Initialize WebAssembly (WASM) with given response.
   * @param {Object} QP - The response object containing exports.
   * @param {Object} Qn - The WebAssembly import object.
   * @returns {Promise<any>} - The initialized WebAssembly instance.
   */
  async function QN(QP, Qn) {
    let QT, Qt;
    if ('function' == typeof Response && QP instanceof Response) {
      QT = await QP.arrayBuffer();
      Qt = await WebAssembly.instantiate(QT, Qn);
      return Object.assign(Qt, { 'bytes': QT });
    } else {
      Qt = await WebAssembly.instantiate(QP, Qn);
      return Qt instanceof WebAssembly.Instance ? { 'instance': Qt, 'module': QP } : Qt;
    }
  }

  /**
   * Initialize the WebAssembly (WASM) object.
   * @returns {Object} - The initialized WebAssembly object.
   */
  function initWasm() {
    const wasmObj = {
      'wbg': {
        '__wbindgen_string_get': function (offset, index) {
          let str = get(index);
          let val = parse(str, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          getArr32()[offset / 4 + 1] = size;
          getArr32()[offset / 4 + 0] = val;
        },
        '__wbindgen_object_drop_ref': function (index) {
          shiftGet(index);
        },
        '__wbindgen_cb_drop': function (index) {
          let org = shiftGet(index).original;
          return 1 == org.cnt-- && !(org.a = 0);
        },
        '__wbindgen_string_new': function (index, offset) {
          return addToStack(decodeSub(index, offset));
        },
        '__wbindgen_is_null': function (index) {
          return null === get(index);
        },
        '__wbindgen_is_undefined': function (index) {
          return void 0 === get(index);
        },
        '__wbindgen_boolean_get': function (index) {
          let bool = get(index);
          return 'boolean' == typeof bool ? bool ? 1 : 0 : 2;
        },
        '__wbg_instanceof_CanvasRenderingContext2d_4ec30ddd3f29f8f9': function () {
          return true;
        },
        '__wbg_setfillStyle_59f426135f52910f': function () { },
        '__wbg_setshadowBlur_229c56539d02f401': function () { },
        '__wbg_setshadowColor_340d5290cdc4ae9d': function () { },
        '__wbg_setfont_16d6e31e06a420a5': function () { },
        '__wbg_settextBaseline_c3266d3bd4a6695c': function () { },
        '__wbg_drawImage_cb13768a1bdc04bd': function () { },
        '__wbg_getImageData_66269d289f37d3c7': function () {
          return applyToWindow(function () {
            return addToStack(image_data);
          }, arguments);
        },
        '__wbg_rect_2fa1df87ef638738': function () { },
        '__wbg_fillRect_4dd28e628381d240': function () { },
        '__wbg_fillText_07e5da9e41652f20': function () { },
        '__wbg_setProperty_5144ddce66bbde41': function () { },
        '__wbg_createElement_03cf347ddad1c8c0': function () {
          return applyToWindow(function (index, decodeIndex, decodeIndexOffset) {
            return addToStack(canvas);
          }, arguments);
        },
        '__wbg_querySelector_118a0639aa1f51cd': function () {
          return applyToWindow(function (index, decodeIndex, decodeOffset) {
            //let item = get(index).querySelector(decodeSub(decodeIndex, decodeOffset));
            //return isNull(item) ? 0 : addToStack(item);
            return addToStack(meta);
          }, arguments);
        },
        '__wbg_querySelectorAll_50c79cd4f7573825': function () {
          return applyToWindow(function () {
            return addToStack(nodeList);
          }, arguments);
        },
        '__wbg_getAttribute_706ae88bd37410fa': function (offset, index, decodeIndex, decodeOffset) {
          let attr = meta.content;
          let todo = isNull(attr) ? 0 : parse(attr, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          getArr32()[offset / 4 + 1] = size;
          getArr32()[offset / 4 + 0] = todo;
        },
        '__wbg_target_6795373f170fd786': function (index) {
          let target = get(index).target
          return isNull(target) ? 0 : addToStack(target);
        },
        '__wbg_addEventListener_f984e99465a6a7f4': function () { },
        '__wbg_instanceof_HtmlCanvasElement_1e81f71f630e46bc': function () {
          return true;
        },
        '__wbg_setwidth_233645b297bb3318': function (index, set) {
          get(index).width = set >>> 0;
        },
        '__wbg_setheight_fcb491cf54e3527c': function (index, set) {
          get(index).height = set >>> 0;
        },
        '__wbg_getContext_dfc91ab0837db1d1': function () {
          return applyToWindow(function (index) {
            return addToStack(get(index).context2d);
          }, arguments);
        },
        '__wbg_toDataURL_97b108dd1a4b7454': function () {
          return applyToWindow(function (offset) {
            let _dataUrl = parse(dataURL, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            getArr32()[offset / 4 + 1] = size;
            getArr32()[offset / 4 + 0] = _dataUrl;
          }, arguments);
        },
        '__wbg_instanceof_HtmlDocument_1100f8a983ca79f9': function () {
          return true;
        },
        '__wbg_cookie_0ad89e781441fb95': function () {
          return applyToWindow(function (offset, index) {
            let _cookie = parse(get(index).cookie, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            getArr32()[offset / 4 + 1] = size;
            getArr32()[offset / 4 + 0] = _cookie;
          }, arguments);
        },
        '__wbg_style_ca229e3326b3c3fb': function (index) {
          addToStack(get(index).style);
        },
        '__wbg_instanceof_HtmlImageElement_9c82d4e3651a8533': function () {
          return true;
        },
        '__wbg_src_87a0e38af6229364': function (offset, index) {
          let _src = parse(get(index).src, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          getArr32()[offset / 4 + 1] = size;
          getArr32()[offset / 4 + 0] = _src;
        },
        '__wbg_width_e1a38bdd483e1283': function (index) {
          return get(index).width;
        },
        '__wbg_height_e4cc2294187313c9': function (index) {
          return get(index).height;
        },
        '__wbg_complete_1162c2697406af11': function (index) {
          return get(index).complete;
        },
        '__wbg_data_d34dc554f90b8652': function (offset, index) {
          var _data = Qj(get(index).data, wasm.__wbindgen_export_0);
          getArr32()[offset / 4 + 1] = size;
          getArr32()[offset / 4 + 0] = _data;
        },
        '__wbg_origin_305402044aa148ce': function () {
          return applyToWindow(function (offset, index) {
            let _origin = parse(get(index).origin, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            getArr32()[offset / 4 + 1] = size;
            getArr32()[offset / 4 + 0] = _origin;
          }, arguments)
        },
        '__wbg_length_8a9352f7b7360c37': function (index) {
          return get(index).length;
        },
        '__wbg_get_c30ae0782d86747f': function (index) {
          let _image = get(index).image;
          return isNull(_image) ? 0 : addToStack(_image);
        },
        '__wbg_timeOrigin_f462952854d802ec': function (index) {
          return get(index).timeOrigin;
        },
        '__wbg_instanceof_Window_cee7a886d55e7df5': function () {
          return true
        },
        '__wbg_document_eb7fd66bde3ee213': function (index) {
          let _document = get(index).document;
          return isNull(_document) ? 0 : addToStack(_document);
        },
        '__wbg_location_b17760ac7977a47a': function (index) {
          return addToStack(get(index).location);
        },
        '__wbg_performance_4ca1873776fdb3d2': function (index) {
          let _performance = get(index).performance;
          return isNull(_performance) ? 0 : addToStack(_performance);
        },
        '__wbg_origin_e1f8acdeb3a39a2b': function (offset, index) {
          let _origin = parse(get(index).origin, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          getArr32()[offset / 4 + 1] = size;
          getArr32()[offset / 4 + 0] = _origin;
        },
        '__wbg_get_8986951b1ee310e0': function (index) {
          let _xrax = get(index).xrax;
          return isNull(_xrax) ? 0 : addToStack(_xrax);
        },
        '__wbg_setTimeout_6ed7182ebad5d297': function () {
          return applyToWindow(function () {
            return 10;
          }, arguments)
        },
        '__wbg_self_05040bd9523805b9': function () {
          return applyToWindow(function () {
            return addToStack(fake_window);
          }, arguments);
        },
        '__wbg_window_adc720039f2cb14f': function () {
          return applyToWindow(function () {
            return addToStack(fake_window);
          }, arguments);
        },
        '__wbg_globalThis_622105db80c1457d': function () {
          return applyToWindow(function () {
            return addToStack(fake_window);
          }, arguments)
        },
        '__wbg_global_f56b013ed9bcf359': function () {
          return applyToWindow(function () {
            return addToStack(fake_window);
          }, arguments)
        },
        '__wbg_newnoargs_cfecb3965268594c': function (index, offset) {
          return addToStack(new Function(decodeSub(index, offset)));
        },
        '__wbindgen_object_clone_ref': function (index) {
          return addToStack(get(index));
        },
        '__wbg_eval_c824e170787ad184': function () {
          return applyToWindow(function (index, offset) {
            let fake_str = "fake_" + decodeSub(index, offset);
            let ev = eval(fake_str);
            return addToStack(ev);
          }, arguments)
        },
        '__wbg_call_3f093dd26d5569f8': function () {
          return applyToWindow(function (index, index2) {
            return addToStack(get(index).call(get(index2)));
          }, arguments);
        },
        '__wbg_set_961700853a212a39': function () {
          return applyToWindow(function (index, index2, index3) {
            return Reflect.set(get(index), get(index2), get(index3));
          }, arguments);
        },
        '__wbg_buffer_b914fb8b50ebbc3e': function (index) {
          return addToStack(get(index).buffer);
        },
        '__wbg_newwithbyteoffsetandlength_0de9ee56e9f6ee6e': function (index, val, val2) {
          return addToStack(new Uint8Array(get(index), val >>> 0, val2 >>> 0));
        },
        '__wbg_new_b1f2d6842d615181': function (index) {
          return addToStack(new Uint8Array(get(index)));
        },
        '__wbg_buffer_67e624f5a0ab2319': function (index) {
          return addToStack(get(index).buffer);
        },
        '__wbg_length_21c4b0ae73cba59d': function (index) {
          return get(index).length;
        },
        '__wbg_set_7d988c98e6ced92d': function (index, index2, val) {
          get(index).set(get(index2), val >>> 0);
        },
        '__wbindgen_debug_string': function () { },
        '__wbindgen_throw': function (index, offset) {
          throw new Error(decodeSub(index, offset));
        },
        '__wbindgen_memory': function () {
          return addToStack(wasm.memory);
        },
        '__wbindgen_closure_wrapper93': function (Qn, QT) {
          return addToStack(args(Qn, QT, 2, export3));
        },
        '__wbindgen_closure_wrapper95': function (Qn, QT) {
          return addToStack(args(Qn, QT, 2, export4));
        },
        '__wbindgen_closure_wrapper97': function (Qn, QT) {
          let test = addToStack(args(Qn, QT, 2, export4));
          return test
        },
        '__wbindgen_closure_wrapper99': function (Qn, QT) {
          return addToStack(args(Qn, QT, 2, export5));
        },
        '__wbindgen_closure_wrapper101': function (Qn, QT) {
          return;
        }
      }
    }
    return wasmObj;
  }

  /**
   * Assign the WASM exports to the global wasm variable.
   * @param {Object} resp - The response object containing exports.
   */
  function assignWasm(resp) {
    wasm = resp.exports;
    arr32 = null, memoryBuff = null, wasm;
  }

  /**
   * Initialize and load WebAssembly (WASM) from URL.
   * @param {string} QP - The WebAssembly module or URL.
   * @returns {Object} - The initialized WebAssembly instance.
   */
  function QZ(QP) {
    let Qn;
    return void 0 !== wasm ? wasm : (Qn = initWasm(), QP instanceof WebAssembly.Module || (QP = new WebAssembly.Module(QP)), assignWasm(new WebAssembly.Instance(QP, Qn)));
  }

  // TODO: Implement the following function
  /**
   * Load WebAssembly (WASM) from the given URL.
   * @param {string} url - The URL to fetch the WASM from.
   * @returns {Promise<any>} - The loaded WASM module and instance.
   */
  async function loadWasm(url) {
    let mod, buffer;
    return void 0 !== wasm ? wasm : (mod = initWasm(), {
      instance: url,
      module: mod,
      bytes: buffer
    } = (url = fetch(url), void 0, await QN(await url, mod)), assignWasm(url), buffer);
  }

  const greetLoader = {
    greet: function () {
      wasm.greet();
    }
  }

  let wasmLoader = Object.assign(loadWasm, { 'initSync': QZ }, greetLoader);

  /**
   * Decrypt the given string with the provided key.
   * @param {string} z - The encrypted string.
   * @param {string} Q0 - The decryption key.
   * @returns {Array} - The decrypted array.
   */
  const Z = (z, Q0) => {
    try {
      var Q1 = cryptoJs.AES.decrypt(z, Q0);
      return JSON.parse(Q1.toString(cryptoJs.enc.Utf8));
    } catch (Q2) {
    }
    return [];
  }

  /**
   * XOR encode the given array with the key.
   * @param {Uint8Array} z - The array to encode.
   * @param {Array<number>} Q0 - The key array.
   * @returns {Uint8Array} - The encoded array.
   */
  const R = (z, Q0) => {
    try {
      for (let Q1 = 0; Q1 < z.length; Q1++) {
        z[Q1] = z[Q1] ^ Q0[Q1 % Q0.length];
      }
    } catch (Q2) {
      return null;
    }
  }

  /**
   * Convert a 32-bit integer to an array of bytes.
   * @param {number} z - The 32-bit integer.
   * @returns {Array<number>} - The array of bytes.
   */
  function r(z) {
    return [
      (4278190080 & z) >> 24,
      (16711680 & z) >> 16,
      (65280 & z) >> 8,
      255 & z
    ];
  }

  /**
   * Load keys required for the request.
   * @returns {Promise<Uint8Array>} - The loaded keys.
   */
  const V = async () => {
    let Q0 = await wasmLoader('https://rabbitstream.net/images/loading.png?v=0.6');
    try {
      wasmLoader.greet();
    } catch (error) {
      console.log(error);
    }
    fake_window.jwt_plugin(Q0);
    let test = new Uint8Array(fake_window.clipboard());
    return test;
  }

  /**
   * Fetch meta information from the given URL.
   * @param {string} url - The URL to fetch meta information from.
   */
  const getMeta = async (url) => {
    let resp = await fetch(url, {
      "headers": {
        "UserAgent": user_agent,
        "Referrer": referrer,
      }
    });
    let txt = await resp.text();
    let regx = /name="fyq" content="[A-Za-z0-9]*/g;
    let matches = txt.match(regx);
    if (matches && matches.length) {
      let match = matches[0];
      let content = match.slice(match.lastIndexOf('"') + 1);
      meta.content = content;
    }
  }

  /**
   * Send a new request to fetch video sources and captions.
   * @param {string} xrax - The unique identifier for the resource.
   * @returns {Promise<Object>} - An object containing video sources and caption sources.
   */
  const newReq = async (xrax) => {
    try {
      await getMeta((embed_url + xrax + "?z="));
    } catch (error) {
      throw error;
    }
    fake_window.xrax = xrax;
    let keys = await V();
    let getSourcesUrl = "https://rabbitstream.net/ajax/v2/embed-4/getSources?id=" + xrax + "&v=" + fake_window.localStorage.kversion + "&h=" + fake_window.localStorage.kid + "&b=1676800512";
    let resp_json = await (await fetch(getSourcesUrl, {
      "headers": {
        "User-Agent": user_agent,
      },
      "method": "GET",
      "mode": "cors"
    })).json();
    let encrypted = resp_json.sources;
    var Q3 = fake_window.localStorage.kversion;
    let tostr = '';
    tostr += Q3;
    var Q1 = r(parseInt(tostr));
    let Q8 = (R(keys, Q1), keys);

    let num = [];

    Q8.forEach(e => {
      num.push(e);
    });

    let str = btoa(String.fromCharCode.apply(null, num));
    var real = Z(encrypted, str);

    resp_json.sources = real;
    return resp_json;
  }

  var ans = await newReq(xrax);
  return { videoSources: ans.sources, captionSources: ans.tracks };
}

module.exports = main;