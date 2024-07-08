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
  let arr = new Array(128).fill(undefined);  // Initialize an array with 128 undefined elements
  const dateNow = Date.now();  // Current timestamp
  let content = '';

  const dataURL = "placeholder";
  const meta = {
    content: content
  };

  const image_data = {
    height: 50,
    width: 65,
    data: data.data,
  };

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
  };

  const nodeList = {
    image: {
      src: "https://rabbitstream.net/images/image.png?v=0.1.4",
      height: 50,
      width: 65,
      complete: true,
    },
    context2d: {},
    length: 1,
  };

  let script_url = "https://rabbitstream.net/v2/embed-4/z1AOmWCJVgcy?z=";

  /**
   * Get an element from the array by index.
   * @param {number} index - The index of the element.
   * @returns {any} - The element at the given index.
   */
  function get(index) {
    return arr[index];
  }

  arr.push(undefined, null, true, false);  // Push additional elements into the array

  let size = 0;
  let memoryBuff;

  /**
   * Get the memory buffer from WASM.
   * @returns {Uint8Array} - The memory buffer.
   */
  function getMemBuff() {
    return memoryBuff = memoryBuff && memoryBuff.byteLength !== 0 ? memoryBuff : new Uint8Array(wasm.memory.buffer);
  }

  const encoder = new TextEncoder();

  /**
   * Encode text into the given array.
   * @param {string} text - The text to encode.
   * @param {Uint8Array} array - The array to encode into.
   * @returns {TextEncoder} - The encoder instance.
   */
  const encode = function (text, array) {
    return encoder.encodeInto(text, array);
  };

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
    return test === null;
  }

  /**
   * Get the 32-bit integer array from WASM memory.
   * @returns {Int32Array} - The 32-bit integer array.
   */
  function getArr32() {
    return arr32 = arr32 && arr32.byteLength !== 0 ? arr32 : new Int32Array(wasm.memory.buffer);
  }

  let pointer = arr.length;

  /**
   * Shift function for the array.
   * @param {number} QP - The value to shift.
   */
  function shift(QP) {
    if (QP >= 132) {
      arr[QP] = pointer;
      pointer = QP;
    }
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
    return decoder.decode(getMemBuff().subarray(index >>> 0, (index >>> 0) + offset));
  }

  /**
   * Add an item to the stack.
   * @param {any} item - The item to add.
   * @returns {number} - The index of the added item.
   */
  function addToStack(item) {
    if (pointer === arr.length) {
      arr.push(arr.length + 1);
    }
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
    };
    QP = (...Qw) => {
      Qx.cnt++;
      try {
        return func(Qx.a, Qx.b, ...Qw);
      } finally {
        if (--Qx.cnt === 0) {
          wasm.__wbindgen_export_2.get(Qx.dtor)(Qx.a, Qx.b);
          Qx.a = 0;
        }
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
    if ('function' === typeof Response && QP instanceof Response) {
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
          return org.cnt-- === 1 && !(org.a = 0);
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
          return 'boolean' === typeof bool ? bool ? 1 : 0 : 2;
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
          let target = get(index).target;
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
          }, arguments);
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
          return true;
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
          }, arguments);
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
          }, arguments);
        },
        '__wbg_global_f56b013ed9bcf359': function () {
          return applyToWindow(function () {
            return addToStack(fake_window);
          }, arguments);
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
          }, arguments);
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
          return test;
        },
        '__wbindgen_closure_wrapper99': function (Qn, QT) {
          return addToStack(args(Qn, QT, 2, export5));
        },
        '__wbindgen_closure_wrapper101': function (Qn, QT) {
          return;
        }
      }
    };
    return wasmObj;
  }

  /**
   * Assign the WASM exports to the global wasm variable.
   * @param {Object} resp - The response object containing exports.
   */
  function assignWasm(resp) {
    wasm = resp.exports;
    arr32 = null;
    memoryBuff = null;
    wasm;
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
  };

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
  };

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
  };

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
  };

  /**
   * Fetch meta information from the given URL.
   * @param {string} url - The URL to fetch meta information from.
   */
  const getMeta = async (url) => {
    let resp = await fetch(url, {
      "headers": {
        "User-Agent": user_agent,
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
  };

  /**
   * Send a new request to fetch video sources and captions.
   * @param {string} xrax - The unique identifier for the resource.
   * @returns {Promise<Object>} - An object containing video sources and caption sources.
   */
  const newReq = async (xrax) => {
    try {
      await getMeta(embed_url + xrax + "?z=");
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

    let str = Buffer.from(num).toString('base64');
    var real = Z(encrypted, str);

    resp_json.sources = real;
    return resp_json;
  };

  var ans = await newReq(xrax);
  return { videoSources: ans.sources, captionSources: ans.tracks };
};

module.exports = main;



