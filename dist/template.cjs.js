'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

/**
 * _pathDel contains de character to delimiter the reference paths.
 * @private
 */
var _pathDel = "/";
/**
 * _pathIndex constant contains a regexp to detect the index of element into a 
 * {@link Path}
 * @private
 */

var _pathIndex = /\[([0-9]+)\]/m;
/**
 * _commentNodeHint constant contains the tag to define a comment element into a 
 * {@link Path}.
 * @private
 */

var _commentNodeHint = "comment()";
/**
 * _textNodeHint constant contains the tag to define a text element into a 
 * {@link Path}.
 * @private
 */

var _textNodeHint = "text()";
/**
 * Path class provide a simple API to uniquely identify any DOM node. Inspired
 * by {@link https://es.wikipedia.org/wiki/XPath|XPath} syntax. 
 * @class Path
 */

var Path = /*#__PURE__*/function () {
  function Path() {
    _classCallCheck(this, Path);
  }

  _createClass(Path, null, [{
    key: "_checkNodeType",

    /**
     * Path._checkNodeType its a void function that raise an {@link TypeError} 
     * if the node provided is undefined or is not a {@link Node}.
     * @private
     * @param {Node} node - Node to check the type.
     */
    value: function _checkNodeType(node) {
      if (!node || node.nodeType === undefined) {
        throw new TypeError("argument provided is not a Node", "path.js");
      }
    }
    /**
     * Path._nodeChildComments function returns the child nodes of the node 
     * provided which are comments.
     * @private
     * @param {Node} node - Parent node to retrieve its childs.
     */

  }, {
    key: "_nodeChildComments",
    value: function _nodeChildComments(node) {
      Path._checkNodeType(node);

      if (node.childNodes === null || !node.hasChildNodes()) return [];
      return _toConsumableArray(node.childNodes).filter(function (child) {
        return child.nodeType === Node.COMMENT_NODE;
      });
    }
    /**
     * Path._nodeChildTexts function returns the child nodes of the node 
     * provided which are text nodes.
     * @private
     * @param {Node} node - Parent node to retrieve its childs.
     */

  }, {
    key: "_nodeChildTexts",
    value: function _nodeChildTexts(node) {
      Path._checkNodeType(node);

      if (node.childNodes === null || !node.hasChildNodes()) return [];
      return _toConsumableArray(node.childNodes).filter(function (child) {
        return child.nodeType === Node.TEXT_NODE;
      });
    }
    /**
     * Path._nodeSiblings function returns the siblings nodes that are of the 
     * same type of the provided one, including itself.
     * @private
     * @param {Node} node - The node to retrieve its siblings.
     */

  }, {
    key: "_nodeSiblings",
    value: function _nodeSiblings(node) {
      Path._checkNodeType(node);

      if (node.parentNode === null) return [];
      return _toConsumableArray(node.parentNode.childNodes).filter(function (sibling) {
        if (node.nodeType === sibling.nodeType) {
          return node.nodeType === Node.ELEMENT_NODE ? node.tagName === sibling.tagName : node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.TEXT_NODE;
        }

        return false;
      });
    }
    /**
     * Path.fromNode returns the unique identifier path of the provided node. 
     * Iterates over all the provided node antecessors and get some of it's 
     * attributes to create a unique path.
     * @param {Node} node - The node to retreive its path.
     * @returns {string} Returns the unique path as a string.
     */

  }, {
    key: "fromNode",
    value: function fromNode(node) {
      Path._checkNodeType(node);

      var path;

      if (node.nodeType === Node.ELEMENT_NODE) {
        path = node.tagName.toLowerCase();
      } else if (node.nodeType === Node.COMMENT_NODE) {
        path = _commentNodeHint;
      } else if (node.nodeType === Node.TEXT_NODE) {
        path = _textNodeHint;
      } else return "";

      if (!node.id || node.id === "") {
        var siblings = Path._nodeSiblings(node);

        if (siblings.length > 1) path += "[".concat(siblings.indexOf(node), "]");
      } else path += "#".concat(node.id);

      if (!node.parentNode) return path;
      return "".concat(Path.fromNode(node.parentNode)).concat(_pathDel).concat(path);
    }
    /**
     * Path.findNode returns the node identified with the path provided. Searches
     * into the root node provided iterating over all nodes of the path to get 
     * the referenced node.
     * @param {string} path - The identifier path of the referenced node.
     * @param {Node} root - The root node where the referenced node will be search.
     */

  }, {
    key: "findNode",
    value: function findNode(path, root) {
      Path._checkNodeType(root);

      var paths = path.split(_pathDel);
      paths.shift(); // Delete root path

      var res = root;
      paths.forEach(function (item) {
        if (res) {
          var index = 0;

          if (_pathIndex.test(item)) {
            index = Array.from(_pathIndex.exec(item))[0][1];
            item = item.replace(_pathIndex, "");
          }

          var parents;

          if (item.includes(_commentNodeHint)) {
            parents = Path._nodeChildComments(res);
          } else if (item.includes(_textNodeHint)) {
            parents = Path._nodeChildTexts(res);
          } else parents = res.querySelectorAll(item);

          res = parents[index];
        }
      });
      return res;
    }
  }]);

  return Path;
}();

/**
 * TNodeField object abstracts a fillable slot of a TNode.
 * @typedef {Object} TNodeField
 * @property {string=} attr - The attribute name, if field is for an 
 * attribute.
 * @property {Node=} nextElem - The following {@link Node} of the fillable 
 * interpolation
 * @property {*} value - The value of the field.
 */

/**
 * TNodeType constant defines the range of types that a TNode can be.
 */

var TNodeType = {
  ATTRIBUTE: "attr",
  INTERPOLATION: "interpolation",
  EMPTY: "empty"
};
/**
 * _attrRe defines the regexp to detect and parse attributes.
 * @private
 */

var _attrRe = /\s(\S+)\=[\"\']<!--slot\(([0-9]+)\)-->[\"\']/gm;
/**
 * _interRe defines the regexp to detect and parse interpolations.
 * @private
 */

var _interRe = /slot\(([0-9]+)\)/gm;
/**
 * _protectedAttrs contains a set of {@link Node} attributes that are protected
 * and can not be changed.
 * @private
 */

var _protectedAttrs = ["id"];
/**
 * TNode class makes a {@link Node} ready to perform updates reactivly.
 * @class TNode
 */

var TNode = /*#__PURE__*/function () {
  /**
   * Creates a {@link TNode} based on the {@link Node} provided as argument.
   * It gets the {@link Path} and the plain HTML content of the source node,
   * checks its type and inits the parsing process. Also creates some empty
   * variables to store internal stuff.
   * @param {Node} node 
   */
  function TNode(node) {
    _classCallCheck(this, TNode);

    if (!node || node.nodeType === undefined) {
      throw new TypeError("argument provided is not a Node", "tnode.js");
    }

    this.path = Path.fromNode(node);
    this.fields = new Map();
    this._node = node;
    this._outer = "";
    this._type = TNodeType.EMPTY;

    this._initParsing();
  }
  /**
   * TNode.hasTNodeFields returns if the current TNode has any {@link TNodeField} 
   * to fill with TValues.
   * @type {boolean}
   */


  _createClass(TNode, [{
    key: "_getOuter",

    /**
     * TNode._getOuter fill the _outer attribute of current {@link TNode} with a
     * empty clone of the current instance {@link Node}.
     * @private
     */
    value: function _getOuter() {
      this._outer = this._node.cloneNode(false).outerHTML;
    }
    /**
     * TNode._getType fill the _type of the current {@link TNode} between 
     * {@link TNodeType} according to the {@link Node.nodeType} of the current
     * instance {@link Node}.
     * @private
     */

  }, {
    key: "_getType",
    value: function _getType() {
      if (this._node.nodeType === Node.COMMENT_NODE) {
        if (_interRe.test(this._node.data)) this._type = TNodeType.INTERPOLATION;
        _interRe.lastIndex = 0;
      } else if (this._node.nodeType === Node.ELEMENT_NODE) {
        if (_attrRe.test(this._outer)) this._type = TNodeType.ATTRIBUTE;
        _attrRe.lastIndex = 0;
      } else this._type = TNodeType.EMPTY;
    }
    /**
     * TNode._initParsing starts the parsing process in base to the 
     * {@link TNode._type}. If the current {@link TNode} is an attribute call 
     * {@link TNode._parseAttr}, else calls {@link TNode._parseInter} if is an 
     * interpolation.
     * @private
     */

  }, {
    key: "_initParsing",
    value: function _initParsing() {
      this._getOuter();

      this._getType();

      if (this.isAttr) this._parseAttr();else if (this.isInterpolation) this._parseInter();
    }
    /**
     * TNode._parseAttr parses all the fillable attributes of the current 
     * {@link Node}. It extracts all of this attributes using regexp and 
     * composes a {@link TNodeField}, then it stores each one into a 
     * {@link Map}.
     * @private
     */

  }, {
    key: "_parseAttr",
    value: function _parseAttr() {
      var _this = this;

      if (!this.isAttr) {
        throw new TypeError("TNode referenced has not any attribute", "tnode.js");
      }

      var res = Array.from(this._outer.matchAll(_attrRe));
      _attrRe.lastIndex = 0;
      res.forEach(function (group) {
        var attr = group[1];
        var index = parseInt(group[2]);

        if (_protectedAttrs.includes(attr)) {
          throw new Error("Node attribute '".concat(attr, "' can not be dynamic"), "tnode.js");
        }

        _this.fields.set(index, {
          attr: attr,
          value: null
        });
      });
    }
    /**
     * TNode._parseAttr parses all the fillable interpolations of the current 
     * {@link Node}. It extracts all of this interpolations using regexp and 
     * composes a field, then it stores each one into a {@link Map}.
     * @private
     */

  }, {
    key: "_parseInter",
    value: function _parseInter() {
      var _this2 = this;

      if (!this.isInterpolation) {
        throw new TypeError("TNode referenced is not an interpolation", "tnode.js");
      }

      var res = Array.from(this._node.data.matchAll(_interRe));
      _interRe.lastIndex = 0;
      res.forEach(function (group) {
        var index = parseInt(group[1]);
        var nextElem = !_this2._node.nextSibling ? null : Path.fromNode(_this2._node.nextSibling);

        _this2.fields.set(index, {
          nextElem: nextElem,
          value: null
        });
      });
    }
    /**
     * TNode._renderAttr update the element attributes of a TNode with its 
     * {@link TNodeField}'s.
     * @param {Node} node - The current state of the {@link Node} to be updated.
     * @private
     */

  }, {
    key: "_renderAttr",
    value: function _renderAttr(node) {
      if (!this.isAttr) throw new TypeError("TNode referenced has not any attribute", "tnode.js");
      this.fields.forEach(function (field) {
        return node.setAttribute(field.attr, field.value);
      });
    }
    /**
     * TNode._renderInter update the element interpolation of a TNode with its 
     * {@link TNodeField}'s.
     * @param {Node} node - The current state of the {@link Node} to be updated.
     * @private
     */

  }, {
    key: "_renderInter",
    value: function _renderInter(node) {
      if (!this.isInterpolation) {
        throw new TypeError("TNode referenced is not an interpolation", "tnode.js");
      }

      var _Array$from$ = _slicedToArray(Array.from(this.fields.entries())[0], 2),
          index = _Array$from$[0],
          field = _Array$from$[1];

      var temp = document.createElement("div");
      temp.innerHTML = field.value;
      var next = field.nextElem ? Path.findNode(field.nextElem, node.getRootNode()) : null;

      this._clearInter(node, next);

      Array.from(temp.childNodes).forEach(function (child) {
        if (next) node.parentNode.insertBefore(child, next);else node.parentNode.appendChild(child);
      });

      if (next) {
        field.nextElem = Path.fromNode(next);
        this.fields.set(index, field);
      }
    }
    /**
     * TNode._clearInter removes all the content of the current {@link TNode} 
     * {@link Node} element before be updated.
     * @param {Node} elem - The current state of the {@link Node} to be cleared.
     * @param {Node} nextElem - The last node to delete to.
     * @private
     */

  }, {
    key: "_clearInter",
    value: function _clearInter(elem, nextElem) {
      if (!elem || elem.nodeType === undefined) {
        throw new TypeError("The argument provided is not a Node", "tnode.js");
      }

      var end = nextElem;
      var next = elem.nextSibling;

      while (next && !next.isEqualNode(end)) {
        var _next = next.nextSibling;
        elem.parentNode.removeChild(next);
        next = _next;
      }
    }
    /**
     * TNode.setFieldValue allows setting the value of the current {@link TNode}.
     * It updates the value of the {@link TNodeField} referenced by the index
     * provided.
     * {@link TNodeField}'s.
     * @param {number} index - The index of the {@link TNodeField} to be set.
     * @param {*} value - The new value of the referenced {@link TNodeField}.
     */

  }, {
    key: "setFieldValue",
    value: function setFieldValue(index, value) {
      var temp = this.fields.get(index);
      temp.value = value;
      this.fields.set(index, temp);
    }
    /**
     * TNode.render function starts the process of renderization of the current
     * {@link Node}, based on the current {@link TNodeType}.
     * @param {Node} container 
     */

  }, {
    key: "render",
    value: function render(container) {
      if (!container || container.nodeType === undefined) {
        throw new TypeError("container provided is not a Node", "tnode.js");
      }

      var elem = Path.findNode(this.path, container);
      if (this.isAttr) this._renderAttr(elem);else if (this.isInterpolation) this._renderInter(elem);
    }
  }, {
    key: "hasTNodeFields",
    get: function get() {
      return this._type !== TNodeType.EMPTY && this.fields.size !== 0;
    }
    /**
     * TNode.isAttr returns if the current TNode is a fillable attribute with
     * TValue.
     * @type {boolean}
     */

  }, {
    key: "isAttr",
    get: function get() {
      return this._type === TNodeType.ATTRIBUTE;
    }
    /**
     * TNode.isAttr returns if the current TNode is a fillable HTML 
     * interpolation with TValue.
     * @type {boolean}
     */

  }, {
    key: "isInterpolation",
    get: function get() {
      return this._type === TNodeType.INTERPOLATION;
    }
  }]);

  return TNode;
}();

/**
 * _pathDel contains de character to delimiter the reference paths.
 * @private
 */
var _pathDel$1 = ".";
/**
 * TValueType constant defines the range of types that a TValue can be.
 */

var TValueType = {
  RAW: "raw",
  REF: "ref"
};
/**
 * TValue class abstracts the value reference of data symbol into an HTML 
 * template. It provides simple API to create a reference to a data value into a 
 * string to retrieve the correct value when the template is rendered. It even 
 * allows storing raw values instead of references.
 * @class TValue
 */

var TValue = /*#__PURE__*/function () {
  /**
   * Creates a TValue object base on initial parameters provided. It checks if 
   * provided value its a raw value or reference value and prepares itself 
   * based on that information.
   * @param {string=} path - The path of value into the source data.
   * @param {*=} value - The raw value of patherenced data.
   */
  function TValue() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, TValue);

    if (path !== null && typeof path !== "string") {
      throw new TypeError("The reference must be an string.", "tvalue.js");
    } else if (path === null && value === null) {
      throw new Error("At least one argument must be provided.", "tvalue.js");
    }

    this._path = path !== null ? path.split(_pathDel$1) : null;
    this._value = value;
    this._type = this._path !== null ? TValueType.REF : TValueType.RAW;
  }
  /**
   * TValue.value returns the current raw value of {@link TValue} object 
   * intanced.
   * @type {*}
   */


  _createClass(TValue, [{
    key: "equalPath",

    /**
     * TValue.equalPath returns if the current {@link TValue} has an equal 
     * path that the path provided as an argument. If the current {@link TValue} 
     * is not a reference {@link TValue} rais an Error.
     * @param {(string|string[]} path - The path to compare with.
     * @returns {boolean} If current reference is equal to the provided one.
     */
    value: function equalPath(path) {
      if (!this.isRef) {
        throw new TypeError("Current TValue is not a reference.", "tvalue.js");
      }

      if (Array.isArray(path)) return this.path === path.join(_pathDel$1);else if (typeof path === "string") return this.path === path;
      throw new TypeError("The reference must be a string or an array.", "tvalue.js");
    }
    /**
     * TValue.fromData searches the value referenced by the current {@link TValue}
     * instance reference into the data object provided as an argument.
     * @param {Object} data - The source data object to search for the reference.
     * @returns {*} The value referenced.
     */

  }, {
    key: "fromData",
    value: function fromData(data) {
      if (!this.isRef) {
        throw new TypeError("The current TValue is not a reference.", "tvalue.js");
      } else if (!data || _typeof(data) !== "object") {
        throw new TypeError("Data provided is null or is not an object.", "tvalue.js");
      } else if (Object.keys(data).length === 0) {
        throw new Error("Data provided is empty.", "tvalue.js");
      }

      var res = data;

      for (var i = 0; i < this._path.length; i++) {
        var prop = this._path[i];
        if (!Object.prototype.hasOwnProperty.call(res, prop) || res[prop] === undefined) return;
        res = res[prop];
      }

      return res;
    }
  }, {
    key: "value",
    get: function get() {
      return this._value;
    }
    /**
     * TValue.path returns the current reference of {@link TValue} object instanced 
     * parsed as string.
     * @type {string}
     */

  }, {
    key: "path",
    get: function get() {
      return this._path.join(_pathDel$1);
    }
    /**
     * TValue.isRef returns if the current {@link TValue} object instance is a 
     * reference value.
     * @type {boolean}
     */

  }, {
    key: "isRef",
    get: function get() {
      return this._type === TValueType.REF;
    }
    /**
     * TValue.isRaw returns if the current {@link TValue} object instance is a raw 
     * value.
     * @type {boolean}
     */

  }, {
    key: "isRaw",
    get: function get() {
      return this._type === TValueType.RAW;
    }
  }]);

  return TValue;
}();

/**
 * TSlot object 
 * @typedef {Object} TSlot
 * @property {number} index - desc
 * @property {TNode} tnode - desc
 * @property {TValue} tvalue - desc
 */

/**
 * _slotIndexHint constant contains the hint to fill the {@link TSlot} marks with the its
 * slot index when it is calculated.
 * @private
 */

var _slotIndexHint = "index";
/**
 * _slotMarkGenerator constant contains a template to create a comment mark into
 * a template.
 * @private
 */

var _slotMarkGenerator = "<!--slot(index)-->";
/**
 * Template class allows to create a reactive template based on a string and 
 * provides a simple API to render and update them.
 * @class Template
 */

var Template = /*#__PURE__*/function () {
  /**
   * Creates the {@link Template}, initializes some internal variables and 
   * starts the building process.
   * @param {strings[]} parts 
   * @param {Object|Array} data 
   */
  function Template(parts) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Template);

    if (!parts || parts.raw === undefined) {
      throw new TypeError("The first arguments must be a string literal parts", "template.js");
    } else if (parts.raw.some(function (part) {
      return typeof part !== "string";
    })) {
      throw new TypeError("The template parts must be strings", "template.js");
    } else if (parts.raw.length !== data.length + 1) {
      throw new Error("The number of data slots mismatches with the number of template parts.", "template.js");
    }

    this._template = document.createElement("template");
    this._parts = _toConsumableArray(parts.raw);
    this._tnodes = [];
    this._tslots = {
      refs: [],
      raw: []
    };
    this._data = data.map(function (value) {
      return value instanceof TValue ? value : new TValue(null, value);
    });

    this._prepareTemplate();
  }
  /**
   * Template._encodeMark returns a computed string to mark a {@link TSlot} It
   * replaces the {@link _slotIndexHint} with the provided index in 
   * {@link _slotMarkGenerator}.
   * @param {number} index - The index number to fill the mark template.
   * @private
   */


  _createClass(Template, [{
    key: "_prepareTemplate",

    /**
     * Template._prepareTemplate performs the template building process. It adds
     * marks between the template parts creating comment {@link Node}s and 
     * iterates over them to create {@link TNode}s assingin its slots.
     * @private
     */
    value: function _prepareTemplate() {
      this._markTemplate();

      this._extractTNodes();

      this._extractTSlots();
    }
    /**
     * Template._markTemplate iterates over the the template parts creating a 
     * comment {@link Node}s adding it to a string. Then injects the computed
     * HTML with the comments between the parts into the created template 
     * {@link Node}.
     * @private
     */

  }, {
    key: "_markTemplate",
    value: function _markTemplate() {
      var _this = this;

      var temp = "";

      this._parts.forEach(function (p, i) {
        var mark = _this._data[i] ? Template._encodeMark(i) : "";
        temp += p + mark;
      });

      this._template.innerHTML = temp;
    }
    /**
     * Template._extractTNodes iterates over all children {@link Node}s of 
     * the current template and transform the dynamics ones into {@link TNode}s. 
     * @private
     */

  }, {
    key: "_extractTNodes",
    value: function _extractTNodes() {
      var iter = document.createNodeIterator(this._template.content, NodeFilter.SHOW_COMMENTS, function (node) {
        return node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.COMMENT_NODE ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      });
      var dataSlots = 0;

      while (iter.nextNode()) {
        var tnode = new TNode(iter.referenceNode);

        if (tnode.hasTNodeFields) {
          dataSlots += tnode.fields.size;

          this._tnodes.push(tnode);
        }
      }

      if (this._data.length !== dataSlots) {
        throw new Error("The number of data slots mismatches with the number of data values provided.", "template.js");
      }
    }
    /**
     * Template._extractTSlots creates the {@link TSlot}s of the current
     * {@link TNode}s and store them.
     * @private
     */

  }, {
    key: "_extractTSlots",
    value: function _extractTSlots() {
      var _this2 = this;

      this._tnodes.forEach(function (tnode) {
        tnode.fields.forEach(function (_, index) {
          var tvalue = _this2._data[index];
          var tslot = {
            index: index,
            tnode: tnode,
            tvalue: tvalue
          };
          if (tvalue.isRef) _this2._tslots.refs.push(tslot);else _this2._tslots.raw.push(tslot);
        });
      });
    }
    /**
     * Template._getSlotValue returns the current value of slot, accoring to the
     * source {@link TNode} type. If is a reference, the value is returned from 
     * the data provided.
     * @param {TSlot} tslot - The {@link TSlot} to get its value.
     * @param {Object} data - The data source to get the value if the 
     * {@link TNode} is a reference.
     * @private
     */

  }, {
    key: "_getSlotValue",
    value: function _getSlotValue(tslot, data) {
      if (tslot.tvalue.isRef) {
        if (!data || _typeof(data) !== "object") {
          throw new TypeError("Data provided is null or is not an object.", "template.js");
        }

        return tslot.tvalue.fromData(data);
      }

      return tslot.tvalue.value;
    }
    /**
     * Template.update function iterates over all the {@link TSlot}s and updates
     * those that have the same reference that the provided. Then, all the 
     * {@link TNode}s with an updated {@link TSlot} are rendered again.
     * @param {Node} container - The parent {@link Node} where it will be 
     * updated into.
     * @param {string|string[]} path - The path of the {@link TNode} to update.
     * @param {*} value - The new value.
     */

  }, {
    key: "update",
    value: function update(container, path) {
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      if (!container || container.nodeType === undefined) {
        throw new TypeError("container provided is not a Node", "template.js");
      } else if (typeof path !== "string" || path === "") {
        throw new TypeError("path provided is not valid string", "template.js");
      } else if (value === undefined) {
        throw new TypeError("no value provided", "template.js");
      }

      var toUpdate = [];

      this._tslots.refs.forEach(function (tslot) {
        if (tslot.tvalue.equalPath(path)) {
          tslot.tnode.setFieldValue(tslot.index, value);
          if (!toUpdate.includes(tslot.tnode)) toUpdate.push(tslot.tnode);
        }
      });

      toUpdate.forEach(function (tnode) {
        return tnode.render(container);
      });
    }
    /**
     * Template.render function performs the rendered process into the 
     * {@link Node} container provided. It inject the created template and sets
     * the initial {@link TSlot}s values.
     * @param {Node} container - The parent {@link Node} to render the template.
     * @param {Object|Array} data - The data source to fill the template.
     */

  }, {
    key: "render",
    value: function render(container, data) {
      var _this3 = this;

      if (!container || container.nodeType === undefined) {
        throw new TypeError("container provided is not a Node", "template.js");
      } else if (!data || _typeof(data) !== "object") {
        throw new TypeError("Data provided is null or is not an object.", "template.js");
      }

      container.innerHTML += this._template.innerHTML;
      this.tslots.forEach(function (tslot) {
        var value = _this3._getSlotValue(tslot, data);

        tslot.tnode.setFieldValue(tslot.index, value);
      });

      this._tnodes.forEach(function (node) {
        return node.render(container);
      });
    }
  }, {
    key: "tslots",

    /**
     * Template.tslots contains a {@link TSlot} array with the raw and 
     * referenced ones.
     * @type {TSlot[]}
     */
    get: function get() {
      return [].concat(_toConsumableArray(this._tslots.raw), _toConsumableArray(this._tslots.refs));
    }
  }], [{
    key: "_encodeMark",
    value: function _encodeMark(index) {
      if (isNaN(index)) throw new TypeError("index must be a number", "template.js");
      return _slotMarkGenerator.replace(_slotIndexHint, index);
    }
  }]);

  return Template;
}();

var html = function html(strings) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  return new Template(strings, values);
};
var val = function val(path) {
  return new TValue(path[0]);
};

exports.default = Template;
exports.html = html;
exports.val = val;
