!(function (a, b) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? b(exports, require('shamos-hoey'))
    : typeof define === 'function' && define.amd
    ? define(['exports', 'shamos-hoey'], b)
    : b((a.geojsonBuffer = {}), a.isSimple)
})(this, function (c, e) {
  'use strict'
  e = e && e.hasOwnProperty('default') ? e['default'] : e
  function f (a) {
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? (f = function (a) {
          return typeof a
        })
      : (f = function (a) {
          return a &&
            typeof Symbol === 'function' &&
            a.constructor === Symbol &&
            a !== Symbol.prototype
            ? 'symbol'
            : typeof a
        })
    return f(a)
  }
  function g (a, b) {
    if (!(a instanceof b)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }
  function h (a, b) {
    for (var c = 0; c < b.length; c++) {
      var d = b[c]
      d.enumerable = d.enumerable || !1
      d.configurable = !0
      'value' in d && (d.writable = !0)
      Object.defineProperty(a, d.key, d)
    }
  }
  function j (a, b, c) {
    b && h(a.prototype, b)
    c && h(a, c)
    return a
  }
  var k = 6371008.8,
    l = {
      centimeters: k * 100,
      centimetres: k * 100,
      degrees: 180 / Math.PI,
      feet: k * 3.28084,
      inches: k * 39.37,
      kilometers: k / 1000,
      kilometres: k / 1000,
      meters: k,
      metres: k,
      miles: k / 1609.344,
      millimeters: k * 1000,
      millimetres: k * 1000,
      nauticalmiles: k / 1852,
      radians: 1,
      yards: k / 1.0936
    }
  function m (a, b, c) {
    c = C(c)
    var d = { type: 'Feature' }
    ;(c.id === 0 || c.id) && (d.id = c.id)
    c.bbox && (d.bbox = c.bbox)
    d.properties = b || {}
    d.geometry = a
    return d
  }
  function o (a, b, c) {
    c = C(c)
    var d = { type: 'Point', coordinates: a }
    return m(d, b, c)
  }
  function p (a, b, c) {
    c = C(c)
    var d = !0,
      e = !1,
      f = undefined
    try {
      for (
        var g = a[Symbol.iterator](), h;
        !(d = (h = g.next()).done);
        d = !0
      ) {
        var i = h.value
        if (i.length < 4) {
          throw new Error(
            'Each LinearRing of a Polygon must have 4 or more Positions.'
          )
        }
        for (var j = 0; j < i[i.length - 1].length; j++) {
          if (i[i.length - 1][j] !== i[0][j]) {
            throw new Error('First and last Position are not equivalent.')
          }
        }
      }
    } catch (a) {
      ;(e = !0), (f = a)
    } finally {
      try {
        !d && g.return != null && g.return()
      } finally {
        if (e) {
          throw f
        }
      }
    }
    var k = { type: 'Polygon', coordinates: a }
    return m(k, b, c)
  }
  function q (a, b, c) {
    c = C(c)
    if (a.length < 2) {
      throw new Error('coordinates must be an array of two or more positions')
    }
    var d = { type: 'LineString', coordinates: a }
    return m(d, b, c)
  }
  function r (a, b, c) {
    c = C(c)
    var d = { type: 'MultiPolygon', coordinates: a }
    return m(d, b, c)
  }
  function s (a, b) {
    if (a === undefined || a === null) throw new Error('distance is required')
    if (b && typeof b !== 'string') throw new Error('units must be a string')
    var c = l[b || 'kilometers']
    if (!c) {
      throw new Error(b + ' units is invalid')
    }
    return a / c
  }
  function u (a, b) {
    b === null && (b = 'kilometers')
    return z(s(a, b))
  }
  function w (a) {
    if (a === null || a === undefined) throw new Error('bearing is required')
    var b = a % 360
    b < 0 && (b += 360)
    return b
  }
  function z (a) {
    if (a === null || a === undefined) throw new Error('radians is required')
    var b = a % (2 * Math.PI)
    return (b * 180) / Math.PI
  }
  function A (a) {
    if (a === null || a === undefined) throw new Error('degrees is required')
    var b = a % 360
    return (b * Math.PI) / 180
  }
  function B (a) {
    return !!a && a.constructor === Object
  }
  function C (a) {
    a = a || {}
    if (!B(a)) throw new Error('options is invalid')
    return a
  }
  function D (a, b, c) {
    if (a === null) return
    var d,
      e,
      f,
      g,
      h,
      i,
      j,
      k = 0,
      l = 0,
      m,
      n = a.type,
      o = n === 'FeatureCollection',
      p = n === 'Feature',
      q = o ? a.features.length : 1
    for (var r = 0; r < q; r++) {
      j = o ? a.features[r].geometry : p ? a.geometry : a
      m = j ? j.type === 'GeometryCollection' : !1
      h = m ? j.geometries.length : 1
      for (var s = 0; s < h; s++) {
        var t = 0,
          u = 0
        g = m ? j.geometries[s] : j
        if (g === null) continue
        i = g.coordinates
        var v = g.type
        k = c && (v === 'Polygon' || v === 'MultiPolygon') ? 1 : 0
        switch (v) {
          case null:
            break
          case 'Point':
            if (b(i, l, r, t, u) === !1) return !1
            l++
            t++
            break
          case 'LineString':
          case 'MultiPoint':
            for (d = 0; d < i.length; d++) {
              if (b(i[d], l, r, t, u) === !1) return !1
              l++
              v === 'MultiPoint' && t++
            }
            v === 'LineString' && t++
            break
          case 'Polygon':
          case 'MultiLineString':
            for (d = 0; d < i.length; d++) {
              for (e = 0; e < i[d].length - k; e++) {
                if (b(i[d][e], l, r, t, u) === !1) return !1
                l++
              }
              v === 'MultiLineString' && t++
              v === 'Polygon' && u++
            }
            v === 'Polygon' && t++
            break
          case 'MultiPolygon':
            for (d = 0; d < i.length; d++) {
              u = 0
              for (e = 0; e < i[d].length; e++) {
                for (f = 0; f < i[d][e].length - k; f++) {
                  if (b(i[d][e][f], l, r, t, u) === !1) return !1
                  l++
                }
                u++
              }
              t++
            }
            break
          case 'GeometryCollection':
            for (d = 0; d < g.geometries.length; d++) {
              if (D(g.geometries[d], b, c) === !1) return !1
            }
            break
          default:
            throw new Error('Unknown Geometry Type')
        }
      }
    }
  }
  function E (a, b) {
    var c,
      d,
      e,
      f,
      g,
      h,
      i,
      j,
      k,
      l,
      m = 0,
      n = a.type === 'FeatureCollection',
      o = a.type === 'Feature',
      p = n ? a.features.length : 1
    for (c = 0; c < p; c++) {
      h = n ? a.features[c].geometry : o ? a.geometry : a
      j = n ? a.features[c].properties : o ? a.properties : {}
      k = n ? a.features[c].bbox : o ? a.bbox : undefined
      l = n ? a.features[c].id : o ? a.id : undefined
      i = h ? h.type === 'GeometryCollection' : !1
      g = i ? h.geometries.length : 1
      for (e = 0; e < g; e++) {
        f = i ? h.geometries[e] : h
        if (f === null) {
          if (b(null, m, j, k, l) === !1) return !1
          continue
        }
        switch (f.type) {
          case 'Point':
          case 'LineString':
          case 'MultiPoint':
          case 'Polygon':
          case 'MultiLineString':
          case 'MultiPolygon': {
            if (b(f, m, j, k, l) === !1) return !1
            break
          }
          case 'GeometryCollection': {
            for (d = 0; d < f.geometries.length; d++) {
              if (b(f.geometries[d], m, j, k, l) === !1) return !1
            }
            break
          }
          default:
            throw new Error('Unknown Geometry Type')
        }
      }
      m++
    }
  }
  function F (a, b) {
    E(a, function (a, c, d, e, f) {
      var g = a === null ? null : a.type
      switch (g) {
        case null:
        case 'Point':
        case 'LineString':
        case 'Polygon':
          if (b(m(a, d, { bbox: e, id: f }), c, 0) === !1) return !1
          return
      }
      var h
      switch (g) {
        case 'MultiPoint':
          h = 'Point'
          break
        case 'MultiLineString':
          h = 'LineString'
          break
        case 'MultiPolygon':
          h = 'Polygon'
          break
      }
      for (var i = 0; i < a.coordinates.length; i++) {
        var j = a.coordinates[i],
          k = { type: h, coordinates: j }
        if (b(m(k, d), c, i) === !1) return !1
      }
    })
  }
  function G (a, b) {
    if (!a) throw new Error('geojson is required')
    F(a, function (a, c, d) {
      if (a.geometry === null) return
      var e = a.geometry.type,
        f = a.geometry.coordinates
      switch (e) {
        case 'LineString':
          if (b(a, c, d, 0, 0) === !1) return !1
          break
        case 'Polygon':
          for (var g = 0; g < f.length; g++) {
            if (b(q(f[g], a.properties), c, d, g) === !1) return !1
          }
          break
      }
    })
  }
  function H (a) {
    if (!a) {
      throw new Error('coord is required')
    }
    if (!Array.isArray(a)) {
      if (
        a.type === 'Feature' &&
        a.geometry !== null &&
        a.geometry.type === 'Point'
      ) {
        return a.geometry.coordinates
      }
      if (a.type === 'Point') {
        return a.coordinates
      }
    }
    if (
      Array.isArray(a) &&
      a.length >= 2 &&
      !Array.isArray(a[0]) &&
      !Array.isArray(a[1])
    ) {
      return a
    }
    throw new Error('coord must be GeoJSON Point or an Array of numbers')
  }
  function I (a) {
    if (Array.isArray(a)) {
      return a
    }
    if (a.type === 'Feature') {
      if (a.geometry !== null) {
        return a.geometry.coordinates
      }
    } else {
      if (a.coordinates) {
        return a.coordinates
      }
    }
    throw new Error(
      'coords must be GeoJSON Feature, Geometry Object or an Array'
    )
  }
  var J =
    typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : typeof self !== 'undefined'
      ? self
      : {}
  function K (a) {
    return a &&
      a.__esModule &&
      Object.prototype.hasOwnProperty.call(a, 'default')
      ? a['default']
      : a
  }
  function L (a, b) {
    return (b = { exports: {} }), a(b, b.exports), b.exports
  }
  var M = L(function (a, b) {
    !(function d (b, c) {
      a.exports = c()
    })(typeof self !== 'undefined' ? self : J, function () {
      return (function (c) {
        var d = {}
        function e (a) {
          if (d[a]) {
            return d[a].exports
          }
          var b = (d[a] = { i: a, l: !1, exports: {} })
          c[a].call(b.exports, b, b.exports, e)
          b.l = !0
          return b.exports
        }
        e.m = c
        e.c = d
        e.d = function (a, b, c) {
          e.o(a, b) || Object.defineProperty(a, b, { enumerable: !0, get: c })
        }
        e.r = function (a) {
          typeof Symbol !== 'undefined' &&
            Symbol.toStringTag &&
            Object.defineProperty(a, Symbol.toStringTag, { value: 'Module' })
          Object.defineProperty(a, '__esModule', { value: !0 })
        }
        e.t = function (a, b) {
          b & 1 && (a = e(a))
          if (b & 8) return a
          if (b & 4 && f(a) === 'object' && a && a.__esModule) return a
          var c = Object.create(null)
          e.r(c)
          Object.defineProperty(c, 'default', { enumerable: !0, value: a })
          if (b & 2 && typeof a != 'string')
            for (var d in a)
              e.d(
                c,
                d,
                function (b) {
                  return a[b]
                }.bind(null, d)
              )
          return c
        }
        e.n = function (a) {
          var b =
            a && a.__esModule
              ? function b () {
                  return a['default']
                }
              : function b () {
                  return a
                }
          e.d(b, 'a', b)
          return b
        }
        e.o = function (a, b) {
          return Object.prototype.hasOwnProperty.call(a, b)
        }
        e.p = ''
        return e((e.s = './src/index.js'))
      })({
        './node_modules/splaytree/index.js': function d (a, b, c) {
          eval(
            "\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/* follows \"An implementation of top-down splaying\"\n * by D. Sleator <sleator@cs.cmu.edu> March 1992\n */\n\n/**\n * @typedef {*} Key\n */\n\n/**\n * @typedef {*} Value\n */\n\n/**\n * @typedef {function(node:Node):void} Visitor\n */\n\n/**\n * @typedef {function(a:Key, b:Key):number} Comparator\n */\n\n/**\n * @param {function(node:Node):string} NodePrinter\n */\n\n/**\n * @typedef {Object}  Node\n * @property {Key}    Key\n * @property {Value=} data\n * @property {Node}   left\n * @property {Node}   right\n */\n\nvar Node = function Node(key, data) {\n  _classCallCheck(this, Node);\n\n  this.key = key;\n  this.data = data;\n  this.left = null;\n  this.right = null;\n};\n\nfunction DEFAULT_COMPARE(a, b) {\n  return a > b ? 1 : a < b ? -1 : 0;\n}\n\n/**\n * Simple top down splay, not requiring i to be in the tree t.\n * @param {Key} i\n * @param {Node?} t\n * @param {Comparator} comparator\n */\nfunction splay(i, t, comparator) {\n  if (t === null) return t;\n  var l = void 0,\n      r = void 0,\n      y = void 0;\n  var N = new Node();\n  l = r = N;\n\n  while (true) {\n    var cmp = comparator(i, t.key);\n    //if (i < t.key) {\n    if (cmp < 0) {\n      if (t.left === null) break;\n      //if (i < t.left.key) {\n      if (comparator(i, t.left.key) < 0) {\n        y = t.left; /* rotate right */\n        t.left = y.right;\n        y.right = t;\n        t = y;\n        if (t.left === null) break;\n      }\n      r.left = t; /* link right */\n      r = t;\n      t = t.left;\n      //} else if (i > t.key) {\n    } else if (cmp > 0) {\n      if (t.right === null) break;\n      //if (i > t.right.key) {\n      if (comparator(i, t.right.key) > 0) {\n        y = t.right; /* rotate left */\n        t.right = y.left;\n        y.left = t;\n        t = y;\n        if (t.right === null) break;\n      }\n      l.right = t; /* link left */\n      l = t;\n      t = t.right;\n    } else {\n      break;\n    }\n  }\n  /* assemble */\n  l.right = t.left;\n  r.left = t.right;\n  t.left = N.right;\n  t.right = N.left;\n  return t;\n}\n\n/**\n * @param  {Key}        i\n * @param  {Value}      data\n * @param  {Comparator} comparator\n * @param  {Tree}       tree\n * @return {Node}      root\n */\nfunction _insert(i, data, t, comparator, tree) {\n  var node = new Node(i, data);\n\n  tree._size++;\n\n  if (t === null) {\n    node.left = node.right = null;\n    return node;\n  }\n\n  t = splay(i, t, comparator);\n  var cmp = comparator(i, t.key);\n  if (cmp < 0) {\n    node.left = t.left;\n    node.right = t;\n    t.left = null;\n  } else if (cmp >= 0) {\n    node.right = t.right;\n    node.left = t;\n    t.right = null;\n  }\n  return node;\n}\n\n/**\n * Insert i into the tree t, unless it's already there.\n * @param  {Key}        i\n * @param  {Value}      data\n * @param  {Comparator} comparator\n * @param  {Tree}       tree\n * @return {Node}       root\n */\nfunction _add(i, data, t, comparator, tree) {\n  var node = new Node(i, data);\n\n  if (t === null) {\n    node.left = node.right = null;\n    tree._size++;\n    return node;\n  }\n\n  t = splay(i, t, comparator);\n  var cmp = comparator(i, t.key);\n  if (cmp === 0) return t;else {\n    if (cmp < 0) {\n      node.left = t.left;\n      node.right = t;\n      t.left = null;\n    } else if (cmp > 0) {\n      node.right = t.right;\n      node.left = t;\n      t.right = null;\n    }\n    tree._size++;\n    return node;\n  }\n}\n\n/**\n * Deletes i from the tree if it's there\n * @param {Key}        i\n * @param {Tree}       tree\n * @param {Comparator} comparator\n * @param {Tree}       tree\n * @return {Node}      new root\n */\nfunction _remove(i, t, comparator, tree) {\n  var x = void 0;\n  if (t === null) return null;\n  t = splay(i, t, comparator);\n  var cmp = comparator(i, t.key);\n  if (cmp === 0) {\n    /* found it */\n    if (t.left === null) {\n      x = t.right;\n    } else {\n      x = splay(i, t.left, comparator);\n      x.right = t.right;\n    }\n    tree._size--;\n    return x;\n  }\n  return t; /* It wasn't there */\n}\n\nfunction _split(key, v, comparator) {\n  var left = void 0,\n      right = void 0;\n  if (v === null) {\n    left = right = null;\n  } else {\n    v = splay(key, v, comparator);\n\n    var cmp = comparator(v.key, key);\n    if (cmp === 0) {\n      left = v.left;\n      right = v.right;\n    } else if (cmp < 0) {\n      right = v.right;\n      v.right = null;\n      left = v;\n    } else {\n      left = v.left;\n      v.left = null;\n      right = v;\n    }\n  }\n  return { left: left, right: right };\n}\n\nfunction merge(left, right, comparator) {\n  if (right === null) return left;\n  if (left === null) return right;\n\n  right = splay(left.key, right, comparator);\n  right.left = left;\n  return right;\n}\n\n/**\n * Prints level of the tree\n * @param  {Node}                        root\n * @param  {String}                      prefix\n * @param  {Boolean}                     isTail\n * @param  {Array<string>}               out\n * @param  {Function(node:Node):String}  printNode\n */\nfunction printRow(root, prefix, isTail, out, printNode) {\n  if (root) {\n    out('' + prefix + (isTail ? '└── ' : '├── ') + printNode(root) + '\\n');\n    var indent = prefix + (isTail ? '    ' : '│   ');\n    if (root.left) printRow(root.left, indent, false, out, printNode);\n    if (root.right) printRow(root.right, indent, true, out, printNode);\n  }\n}\n\nvar Tree = function () {\n  function Tree() {\n    var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_COMPARE;\n\n    _classCallCheck(this, Tree);\n\n    this._comparator = comparator;\n    this._root = null;\n    this._size = 0;\n  }\n\n  /**\n   * Inserts a key, allows duplicates\n   * @param  {Key}    key\n   * @param  {Value=} data\n   * @return {Node|null}\n   */\n\n\n  _createClass(Tree, [{\n    key: 'insert',\n    value: function insert(key, data) {\n      return this._root = _insert(key, data, this._root, this._comparator, this);\n    }\n\n    /**\n     * Adds a key, if it is not present in the tree\n     * @param  {Key}    key\n     * @param  {Value=} data\n     * @return {Node|null}\n     */\n\n  }, {\n    key: 'add',\n    value: function add(key, data) {\n      return this._root = _add(key, data, this._root, this._comparator, this);\n    }\n\n    /**\n     * @param  {Key} key\n     * @return {Node|null}\n     */\n\n  }, {\n    key: 'remove',\n    value: function remove(key) {\n      this._root = _remove(key, this._root, this._comparator, this);\n    }\n\n    /**\n     * Removes and returns the node with smallest key\n     * @return {?Node}\n     */\n\n  }, {\n    key: 'pop',\n    value: function pop() {\n      var node = this._root;\n      if (node) {\n        while (node.left) {\n          node = node.left;\n        }this._root = splay(node.key, this._root, this._comparator);\n        this._root = _remove(node.key, this._root, this._comparator, this);\n        return { key: node.key, data: node.data };\n      }\n      return null;\n    }\n\n    /**\n     * @param  {Key} key\n     * @return {Node|null}\n     */\n\n  }, {\n    key: 'findStatic',\n    value: function findStatic(key) {\n      var current = this._root;\n      var compare = this._comparator;\n      while (current) {\n        var cmp = compare(key, current.key);\n        if (cmp === 0) return current;else if (cmp < 0) current = current.left;else current = current.right;\n      }\n      return null;\n    }\n\n    /**\n     * @param  {Key} key\n     * @return {Node|null}\n     */\n\n  }, {\n    key: 'find',\n    value: function find(key) {\n      if (this._root) {\n        this._root = splay(key, this._root, this._comparator);\n        if (this._comparator(key, this._root.key) !== 0) return null;\n      }\n      return this._root;\n    }\n\n    /**\n     * @param  {Key} key\n     * @return {Boolean}\n     */\n\n  }, {\n    key: 'contains',\n    value: function contains(key) {\n      var current = this._root;\n      var compare = this._comparator;\n      while (current) {\n        var cmp = compare(key, current.key);\n        if (cmp === 0) return true;else if (cmp < 0) current = current.left;else current = current.right;\n      }\n      return false;\n    }\n\n    /**\n     * @param  {Visitor} visitor\n     * @param  {*=}      ctx\n     * @return {SplayTree}\n     */\n\n  }, {\n    key: 'forEach',\n    value: function forEach(visitor, ctx) {\n      var current = this._root;\n      var Q = []; /* Initialize stack s */\n      var done = false;\n\n      while (!done) {\n        if (current !== null) {\n          Q.push(current);\n          current = current.left;\n        } else {\n          if (Q.length !== 0) {\n            current = Q.pop();\n            visitor.call(ctx, current);\n\n            current = current.right;\n          } else done = true;\n        }\n      }\n      return this;\n    }\n\n    /**\n     * Walk key range from `low` to `high`. Stops if `fn` returns a value.\n     * @param  {Key}      low\n     * @param  {Key}      high\n     * @param  {Function} fn\n     * @param  {*?}       ctx\n     * @return {SplayTree}\n     */\n\n  }, {\n    key: 'range',\n    value: function range(low, high, fn, ctx) {\n      var Q = [];\n      var compare = this._comparator;\n      var node = this._root,\n          cmp = void 0;\n\n      while (Q.length !== 0 || node) {\n        if (node) {\n          Q.push(node);\n          node = node.left;\n        } else {\n          node = Q.pop();\n          cmp = compare(node.key, high);\n          if (cmp > 0) {\n            break;\n          } else if (compare(node.key, low) >= 0) {\n            if (fn.call(ctx, node)) return this; // stop if smth is returned\n          }\n          node = node.right;\n        }\n      }\n      return this;\n    }\n\n    /**\n     * Returns array of keys\n     * @return {Array<Key>}\n     */\n\n  }, {\n    key: 'keys',\n    value: function keys() {\n      var keys = [];\n      this.forEach(function (_ref) {\n        var key = _ref.key;\n        return keys.push(key);\n      });\n      return keys;\n    }\n\n    /**\n     * Returns array of all the data in the nodes\n     * @return {Array<Value>}\n     */\n\n  }, {\n    key: 'values',\n    value: function values() {\n      var values = [];\n      this.forEach(function (_ref2) {\n        var data = _ref2.data;\n        return values.push(data);\n      });\n      return values;\n    }\n\n    /**\n     * @return {Key|null}\n     */\n\n  }, {\n    key: 'min',\n    value: function min() {\n      if (this._root) return this.minNode(this._root).key;\n      return null;\n    }\n\n    /**\n     * @return {Key|null}\n     */\n\n  }, {\n    key: 'max',\n    value: function max() {\n      if (this._root) return this.maxNode(this._root).key;\n      return null;\n    }\n\n    /**\n     * @return {Node|null}\n     */\n\n  }, {\n    key: 'minNode',\n    value: function minNode() {\n      var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._root;\n\n      if (t) while (t.left) {\n        t = t.left;\n      }return t;\n    }\n\n    /**\n     * @return {Node|null}\n     */\n\n  }, {\n    key: 'maxNode',\n    value: function maxNode() {\n      var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._root;\n\n      if (t) while (t.right) {\n        t = t.right;\n      }return t;\n    }\n\n    /**\n     * Returns node at given index\n     * @param  {number} index\n     * @return {?Node}\n     */\n\n  }, {\n    key: 'at',\n    value: function at(index) {\n      var current = this._root,\n          done = false,\n          i = 0;\n      var Q = [];\n\n      while (!done) {\n        if (current) {\n          Q.push(current);\n          current = current.left;\n        } else {\n          if (Q.length > 0) {\n            current = Q.pop();\n            if (i === index) return current;\n            i++;\n            current = current.right;\n          } else done = true;\n        }\n      }\n      return null;\n    }\n\n    /**\n     * @param  {Node}   d\n     * @return {Node|null}\n     */\n\n  }, {\n    key: 'next',\n    value: function next(d) {\n      var root = this._root;\n      var successor = null;\n\n      if (d.right) {\n        successor = d.right;\n        while (successor.left) {\n          successor = successor.left;\n        }return successor;\n      }\n\n      var comparator = this._comparator;\n      while (root) {\n        var cmp = comparator(d.key, root.key);\n        if (cmp === 0) break;else if (cmp < 0) {\n          successor = root;\n          root = root.left;\n        } else root = root.right;\n      }\n\n      return successor;\n    }\n\n    /**\n     * @param  {Node} d\n     * @return {Node|null}\n     */\n\n  }, {\n    key: 'prev',\n    value: function prev(d) {\n      var root = this._root;\n      var predecessor = null;\n\n      if (d.left !== null) {\n        predecessor = d.left;\n        while (predecessor.right) {\n          predecessor = predecessor.right;\n        }return predecessor;\n      }\n\n      var comparator = this._comparator;\n      while (root) {\n        var cmp = comparator(d.key, root.key);\n        if (cmp === 0) break;else if (cmp < 0) root = root.left;else {\n          predecessor = root;\n          root = root.right;\n        }\n      }\n      return predecessor;\n    }\n\n    /**\n     * @return {SplayTree}\n     */\n\n  }, {\n    key: 'clear',\n    value: function clear() {\n      this._root = null;\n      this._size = 0;\n      return this;\n    }\n\n    /**\n     * @return {NodeList}\n     */\n\n  }, {\n    key: 'toList',\n    value: function toList() {\n      return _toList(this._root);\n    }\n\n    /**\n     * Bulk-load items. Both array have to be same size\n     * @param  {Array<Key>}    keys\n     * @param  {Array<Value>}  [values]\n     * @param  {Boolean}       [presort=false] Pre-sort keys and values, using\n     *                                         tree's comparator. Sorting is done\n     *                                         in-place\n     * @return {AVLTree}\n     */\n\n  }, {\n    key: 'load',\n    value: function load() {\n      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n      var presort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n\n      var size = keys.length;\n      var comparator = this._comparator;\n\n      // sort if needed\n      if (presort) sort(keys, values, 0, size - 1, comparator);\n\n      if (this._root === null) {\n        // empty tree\n        this._root = loadRecursive(this._root, keys, values, 0, size);\n        this._size = size;\n      } else {\n        // that re-builds the whole tree from two in-order traversals\n        var mergedList = mergeLists(this.toList(), createList(keys, values), comparator);\n        size = this._size + size;\n        this._root = sortedListToBST({ head: mergedList }, 0, size);\n      }\n      return this;\n    }\n\n    /**\n     * @return {Boolean}\n     */\n\n  }, {\n    key: 'isEmpty',\n    value: function isEmpty() {\n      return this._root === null;\n    }\n  }, {\n    key: 'toString',\n\n\n    /**\n     * @param  {NodePrinter=} printNode\n     * @return {String}\n     */\n    value: function toString() {\n      var printNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (n) {\n        return n.key;\n      };\n\n      var out = [];\n      printRow(this._root, '', true, function (v) {\n        return out.push(v);\n      }, printNode);\n      return out.join('');\n    }\n  }, {\n    key: 'update',\n    value: function update(key, newKey, newData) {\n      var comparator = this._comparator;\n\n      var _split2 = _split(key, this._root, comparator),\n          left = _split2.left,\n          right = _split2.right;\n\n      this._size--;\n      if (comparator(key, newKey) < 0) {\n        right = _insert(newKey, newData, right, comparator, this);\n      } else {\n        left = _insert(newKey, newData, left, comparator, this);\n      }\n      this._root = merge(left, right, comparator);\n    }\n  }, {\n    key: 'split',\n    value: function split(key) {\n      return _split(key, this._root, this._comparator);\n    }\n  }, {\n    key: 'size',\n    get: function get() {\n      return this._size;\n    }\n  }]);\n\n  return Tree;\n}();\n\nexports.default = Tree;\n\n\nfunction loadRecursive(parent, keys, values, start, end) {\n  var size = end - start;\n  if (size > 0) {\n    var middle = start + Math.floor(size / 2);\n    var key = keys[middle];\n    var data = values[middle];\n    var node = { key: key, data: data, parent: parent };\n    node.left = loadRecursive(node, keys, values, start, middle);\n    node.right = loadRecursive(node, keys, values, middle + 1, end);\n    return node;\n  }\n  return null;\n}\n\nfunction createList(keys, values) {\n  var head = { next: null };\n  var p = head;\n  for (var i = 0; i < keys.length; i++) {\n    p = p.next = { key: keys[i], data: values[i] };\n  }\n  p.next = null;\n  return head.next;\n}\n\nfunction _toList(root) {\n  var current = root;\n  var Q = [],\n      done = false;\n\n  var head = { next: null };\n  var p = head;\n\n  while (!done) {\n    if (current) {\n      Q.push(current);\n      current = current.left;\n    } else {\n      if (Q.length > 0) {\n        current = p = p.next = Q.pop();\n        current = current.right;\n      } else done = true;\n    }\n  }\n  p.next = null; // that'll work even if the tree was empty\n  return head.next;\n}\n\nfunction sortedListToBST(list, start, end) {\n  var size = end - start;\n  if (size > 0) {\n    var middle = start + Math.floor(size / 2);\n    var left = sortedListToBST(list, start, middle);\n\n    var root = list.head;\n    root.left = left;\n\n    list.head = list.head.next;\n\n    root.right = sortedListToBST(list, middle + 1, end);\n    return root;\n  }\n  return null;\n}\n\nfunction mergeLists(l1, l2) {\n  var compare = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (a, b) {\n    return a - b;\n  };\n\n  var head = {}; // dummy\n  var p = head;\n\n  var p1 = l1;\n  var p2 = l2;\n\n  while (p1 !== null && p2 !== null) {\n    if (compare(p1.key, p2.key) < 0) {\n      p.next = p1;\n      p1 = p1.next;\n    } else {\n      p.next = p2;\n      p2 = p2.next;\n    }\n    p = p.next;\n  }\n\n  if (p1 !== null) p.next = p1;else if (p2 !== null) p.next = p2;\n\n  return head.next;\n}\n\nfunction sort(keys, values, left, right, compare) {\n  if (left >= right) return;\n\n  var pivot = keys[left + right >> 1];\n  var i = left - 1;\n  var j = right + 1;\n\n  while (true) {\n    do {\n      i++;\n    } while (compare(keys[i], pivot) < 0);\n    do {\n      j--;\n    } while (compare(keys[j], pivot) > 0);\n    if (i >= j) break;\n\n    var tmp = keys[i];\n    keys[i] = keys[j];\n    keys[j] = tmp;\n\n    tmp = values[i];\n    values[i] = values[j];\n    values[j] = tmp;\n  }\n\n  sort(keys, values, left, j, compare);\n  sort(keys, values, j + 1, right, compare);\n}\nmodule.exports = exports.default;\n\n//# sourceURL=webpack://polygon-clipping/./node_modules/splaytree/index.js?"
          )
        },
        './src/bbox.js': function d (a, b, c) {
          eval(
            '\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.getBboxOverlap = exports.touchesBbox = exports.isInBbox = undefined;\n\nvar _flp = __webpack_require__(/*! ./flp */ "./src/flp.js");\n\n/**\n * A bounding box has the format:\n *\n *  { ll: { x: xmin, y: ymin }, ur: { x: xmax, y: ymax } }\n *\n */\n\nvar isInBbox = exports.isInBbox = function isInBbox(bbox, point) {\n  return (0, _flp.cmp)(bbox.ll.x, point.x) <= 0 && (0, _flp.cmp)(point.x, bbox.ur.x) <= 0 && (0, _flp.cmp)(bbox.ll.y, point.y) <= 0 && (0, _flp.cmp)(point.y, bbox.ur.y) <= 0;\n};\n\n/* Greedy comparison with a bbox. A point is defined to \'touch\'\n * a bbox if:\n *  - it is inside the bbox\n *  - it \'touches\' one of the sides (another greedy comparison) */\nvar touchesBbox = exports.touchesBbox = function touchesBbox(bbox, point) {\n  return ((0, _flp.cmp)(bbox.ll.x, point.x) <= 0 || (0, _flp.touch)(bbox.ll.x, point.x)) && ((0, _flp.cmp)(point.x, bbox.ur.x) <= 0 || (0, _flp.touch)(point.x, bbox.ur.x)) && ((0, _flp.cmp)(bbox.ll.y, point.y) <= 0 || (0, _flp.touch)(bbox.ll.y, point.y)) && ((0, _flp.cmp)(point.y, bbox.ur.y) <= 0 || (0, _flp.touch)(point.y, bbox.ur.y));\n};\n\n/* Returns either null, or a bbox (aka an ordered pair of points)\n * If there is only one point of overlap, a bbox with identical points\n * will be returned */\nvar getBboxOverlap = exports.getBboxOverlap = function getBboxOverlap(b1, b2) {\n  // check if the bboxes overlap at all\n  if ((0, _flp.cmp)(b2.ur.x, b1.ll.x) < 0 || (0, _flp.cmp)(b1.ur.x, b2.ll.x) < 0 || (0, _flp.cmp)(b2.ur.y, b1.ll.y) < 0 || (0, _flp.cmp)(b1.ur.y, b2.ll.y) < 0) return null;\n\n  // find the middle two X values\n  var lowerX = b1.ll.x < b2.ll.x ? b2.ll.x : b1.ll.x;\n  var upperX = b1.ur.x < b2.ur.x ? b1.ur.x : b2.ur.x;\n\n  // find the middle two Y values\n  var lowerY = b1.ll.y < b2.ll.y ? b2.ll.y : b1.ll.y;\n  var upperY = b1.ur.y < b2.ur.y ? b1.ur.y : b2.ur.y;\n\n  // put those middle values together to get the overlap\n  return { ll: { x: lowerX, y: lowerY }, ur: { x: upperX, y: upperY } };\n};\n\n//# sourceURL=webpack://polygon-clipping/./src/bbox.js?'
          )
        },
        './src/clean-input.js': function d (a, b, c) {
          eval(
            "\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.cleanRing = exports.cleanMultiPoly = exports.forceMultiPoly = exports.pointsAsObjects = undefined;\n\nvar _flp = __webpack_require__(/*! ./flp */ \"./src/flp.js\");\n\nvar _vector = __webpack_require__(/*! ./vector */ \"./src/vector.js\");\n\n/* Given input geometry as a standard array-of-arrays geojson-style\n * geometry, return one that uses objects as points, for better perf */\nvar pointsAsObjects = exports.pointsAsObjects = function pointsAsObjects(geom) {\n  // we can handle well-formed multipolys and polys\n  var output = [];\n  if (!Array.isArray(geom)) {\n    throw new Error('Input is not a Polygon or MultiPolygon');\n  }\n  for (var i = 0, iMax = geom.length; i < iMax; i++) {\n    if (!Array.isArray(geom[i]) || geom[i].length == 0) {\n      throw new Error('Input is not a Polygon or MultiPolygon');\n    }\n    output.push([]);\n    for (var j = 0, jMax = geom[i].length; j < jMax; j++) {\n      if (!Array.isArray(geom[i][j]) || geom[i][j].length == 0) {\n        throw new Error('Input is not a Polygon or MultiPolygon');\n      }\n      if (Array.isArray(geom[i][j][0])) {\n        // multipolygon\n        output[i].push([]);\n        for (var k = 0, kMax = geom[i][j].length; k < kMax; k++) {\n          if (!Array.isArray(geom[i][j][k]) || geom[i][j][k].length < 2) {\n            throw new Error('Input is not a Polygon or MultiPolygon');\n          }\n          if (geom[i][j][k].length > 2) {\n            throw new Error('Input has more than two coordinates. ' + 'Only 2-dimensional polygons supported.');\n          }\n          output[i][j].push({ x: geom[i][j][k][0], y: geom[i][j][k][1] });\n        }\n      } else {\n        // polygon\n        if (geom[i][j].length < 2) {\n          throw new Error('Input is not a Polygon or MultiPolygon');\n        }\n        if (geom[i][j].length > 2) {\n          throw new Error('Input has more than two coordinates. ' + 'Only 2-dimensional polygons supported.');\n        }\n        output[i].push({ x: geom[i][j][0], y: geom[i][j][1] });\n      }\n    }\n  }\n  return output;\n};\n\n/* WARN: input modified directly */\nvar forceMultiPoly = exports.forceMultiPoly = function forceMultiPoly(geom) {\n  if (Array.isArray(geom)) {\n    if (geom.length === 0) return; // allow empty multipolys\n\n    if (Array.isArray(geom[0])) {\n      if (Array.isArray(geom[0][0])) {\n        if (typeof geom[0][0][0].x === 'number' && typeof geom[0][0][0].y === 'number') {\n          // multipolygon\n          return;\n        }\n      }\n      if (typeof geom[0][0].x === 'number' && typeof geom[0][0].y === 'number') {\n        // polygon\n        geom.unshift(geom.splice(0));\n        return;\n      }\n    }\n  }\n  throw new Error('Unrecognized input - not a polygon nor multipolygon');\n};\n\n/* WARN: input modified directly */\nvar cleanMultiPoly = exports.cleanMultiPoly = function cleanMultiPoly(multipoly) {\n  var i = 0;\n  while (i < multipoly.length) {\n    var poly = multipoly[i];\n    if (poly.length === 0) {\n      multipoly.splice(i, 1);\n      continue;\n    }\n\n    var exteriorRing = poly[0];\n    cleanRing(exteriorRing);\n    // poly is dropped if exteriorRing is degenerate\n    if (exteriorRing.length === 0) {\n      multipoly.splice(i, 1);\n      continue;\n    }\n\n    var j = 1;\n    while (j < poly.length) {\n      var interiorRing = poly[j];\n      cleanRing(interiorRing);\n      if (interiorRing.length === 0) poly.splice(j, 1);else j++;\n    }\n\n    i++;\n  }\n};\n\n/* Clean ring:\n *  - remove duplicate points\n *  - remove colinear points\n *  - remove rings with no area (less than 3 distinct points)\n *  - un-close rings (last point should not repeat first)\n *\n * WARN: input modified directly */\nvar cleanRing = exports.cleanRing = function cleanRing(ring) {\n  if (ring.length === 0) return;\n  if ((0, _flp.cmpPoints)(ring[0], ring[ring.length - 1]) === 0) ring.pop();\n\n  var isPointUncessary = function isPointUncessary(prevPt, pt, nextPt) {\n    return (0, _flp.cmpPoints)(prevPt, pt) === 0 || (0, _flp.cmpPoints)(pt, nextPt) === 0 || (0, _vector.compareVectorAngles)(pt, prevPt, nextPt) === 0;\n  };\n\n  var i = 0;\n  var prevPt = void 0,\n      nextPt = void 0;\n  while (i < ring.length) {\n    prevPt = i === 0 ? ring[ring.length - 1] : ring[i - 1];\n    nextPt = i === ring.length - 1 ? ring[0] : ring[i + 1];\n    if (isPointUncessary(prevPt, ring[i], nextPt)) ring.splice(i, 1);else i++;\n  }\n\n  // if our ring has less than 3 distinct points now (so is degenerate)\n  // shrink it down to the empty array to communicate to our caller to\n  // drop it\n  while (ring.length < 3 && ring.length > 0) {\n    ring.pop();\n  }\n};\n\n//# sourceURL=webpack://polygon-clipping/./src/clean-input.js?"
          )
        },
        './src/flp.js': function d (a, b, c) {
          eval(
            "\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n/* Javascript doesn't do integer math. Everything is\n * floating point with percision Number.EPSILON.\n *\n * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON\n */\n\nvar epsilon = Number.EPSILON;\n\n// IE Polyfill\nif (epsilon === undefined) epsilon = Math.pow(2, -52);\n\nvar EPSILON_SQ = epsilon * epsilon;\n\n/* FLP comparator */\nvar cmp = exports.cmp = function cmp(a, b) {\n  // check if they're both 0\n  if (-epsilon < a && a < epsilon) {\n    if (-epsilon < b && b < epsilon) {\n      return 0;\n    }\n  }\n\n  // check if they're flp equal\n  if ((a - b) * (a - b) < EPSILON_SQ * a * b) {\n    return 0;\n  }\n\n  // normal comparison\n  return a < b ? -1 : 1;\n};\n\n/* FLP point comparator, favors point encountered first by sweep line */\nvar cmpPoints = exports.cmpPoints = function cmpPoints(aPt, bPt) {\n  if (aPt === bPt) return 0;\n\n  // fist compare X, then compare Y\n  var a = aPt.x;\n  var b = bPt.x;\n\n  // inlined version of cmp() for performance boost\n  if (a <= -epsilon || epsilon <= a || b <= -epsilon || epsilon <= b) {\n    var diff = a - b;\n    if (diff * diff >= EPSILON_SQ * a * b) {\n      return a < b ? -1 : 1;\n    }\n  }\n\n  a = aPt.y;\n  b = bPt.y;\n\n  // inlined version of cmp() for performance boost\n  if (a <= -epsilon || epsilon <= a || b <= -epsilon || epsilon <= b) {\n    var _diff = a - b;\n    if (_diff * _diff >= EPSILON_SQ * a * b) {\n      return a < b ? -1 : 1;\n    }\n  }\n\n  // they're the same\n  return 0;\n};\n\n/* Greedy comparison. Two numbers are defined to touch\n * if their midpoint is indistinguishable from either. */\nvar touch = exports.touch = function touch(a, b) {\n  var m = (a + b) / 2;\n  return cmp(m, a) === 0 || cmp(m, b) === 0;\n};\n\n/* Greedy comparison. Two points are defined to touch\n * if their midpoint is indistinguishable from either. */\nvar touchPoints = exports.touchPoints = function touchPoints(aPt, bPt) {\n  var mPt = { x: (aPt.x + bPt.x) / 2, y: (aPt.y + bPt.y) / 2 };\n  return cmpPoints(mPt, aPt) === 0 || cmpPoints(mPt, bPt) === 0;\n};\n\n//# sourceURL=webpack://polygon-clipping/./src/flp.js?"
          )
        },
        './src/geom-in.js': function d (a, b, c) {
          eval(
            '\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.MultiPolyIn = exports.PolyIn = exports.RingIn = undefined;\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _segment = __webpack_require__(/*! ./segment */ "./src/segment.js");\n\nvar _segment2 = _interopRequireDefault(_segment);\n\nvar _sweepEvent = __webpack_require__(/*! ./sweep-event */ "./src/sweep-event.js");\n\nvar _sweepEvent2 = _interopRequireDefault(_sweepEvent);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nvar RingIn = exports.RingIn = function () {\n  function RingIn(geomRing, poly, isExterior) {\n    _classCallCheck(this, RingIn);\n\n    this.poly = poly;\n    this.isExterior = isExterior;\n    this.segments = [];\n\n    var prevPoint = geomRing[0];\n    for (var i = 1, iMax = geomRing.length; i < iMax; i++) {\n      var point = geomRing[i];\n      this.segments.push(_segment2.default.fromRing(prevPoint, point, this));\n      prevPoint = point;\n    }\n    this.segments.push(_segment2.default.fromRing(prevPoint, geomRing[0], this));\n  }\n\n  _createClass(RingIn, [{\n    key: \'getSweepEvents\',\n    value: function getSweepEvents() {\n      var sweepEvents = [];\n      for (var i = 0, iMax = this.segments.length; i < iMax; i++) {\n        var segment = this.segments[i];\n        sweepEvents.push(segment.leftSE);\n        sweepEvents.push(segment.rightSE);\n      }\n      return sweepEvents;\n    }\n  }]);\n\n  return RingIn;\n}();\n\nvar PolyIn = exports.PolyIn = function () {\n  function PolyIn(geomPoly, multiPoly) {\n    _classCallCheck(this, PolyIn);\n\n    this.exteriorRing = new RingIn(geomPoly[0], this, true);\n    this.interiorRings = [];\n    for (var i = 1, iMax = geomPoly.length; i < iMax; i++) {\n      this.interiorRings.push(new RingIn(geomPoly[i], this, false));\n    }\n    this.multiPoly = multiPoly;\n  }\n\n  _createClass(PolyIn, [{\n    key: \'getSweepEvents\',\n    value: function getSweepEvents() {\n      var sweepEvents = this.exteriorRing.getSweepEvents();\n      for (var i = 0, iMax = this.interiorRings.length; i < iMax; i++) {\n        var ringSweepEvents = this.interiorRings[i].getSweepEvents();\n        for (var j = 0, jMax = ringSweepEvents.length; j < jMax; j++) {\n          sweepEvents.push(ringSweepEvents[j]);\n        }\n      }\n      return sweepEvents;\n    }\n  }]);\n\n  return PolyIn;\n}();\n\nvar MultiPolyIn = exports.MultiPolyIn = function () {\n  function MultiPolyIn(geomMultiPoly) {\n    _classCallCheck(this, MultiPolyIn);\n\n    this.polys = [];\n    for (var i = 0, iMax = geomMultiPoly.length; i < iMax; i++) {\n      this.polys.push(new PolyIn(geomMultiPoly[i], this));\n    }\n    this.isSubject = false;\n  }\n\n  _createClass(MultiPolyIn, [{\n    key: \'markAsSubject\',\n    value: function markAsSubject() {\n      this.isSubject = true;\n    }\n  }, {\n    key: \'getSweepEvents\',\n    value: function getSweepEvents() {\n      var sweepEvents = [];\n      for (var i = 0, iMax = this.polys.length; i < iMax; i++) {\n        var polySweepEvents = this.polys[i].getSweepEvents();\n        for (var j = 0, jMax = polySweepEvents.length; j < jMax; j++) {\n          sweepEvents.push(polySweepEvents[j]);\n        }\n      }\n      return sweepEvents;\n    }\n  }]);\n\n  return MultiPolyIn;\n}();\n\n//# sourceURL=webpack://polygon-clipping/./src/geom-in.js?'
          )
        },
        './src/geom-out.js': function d (a, b, c) {
          eval(
            "\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.MultiPolyOut = exports.PolyOut = exports.RingOut = undefined;\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _vector = __webpack_require__(/*! ./vector */ \"./src/vector.js\");\n\nvar _sweepEvent = __webpack_require__(/*! ./sweep-event */ \"./src/sweep-event.js\");\n\nvar _sweepEvent2 = _interopRequireDefault(_sweepEvent);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar RingOut = exports.RingOut = function () {\n  _createClass(RingOut, null, [{\n    key: 'factory',\n\n    /* Given the segments from the sweep line pass, compute & return a series\n     * of closed rings from all the segments marked to be part of the result */\n    value: function factory(allSegments) {\n      var ringsOut = [];\n\n      for (var i = 0, iMax = allSegments.length; i < iMax; i++) {\n        var segment = allSegments[i];\n        if (!segment.isInResult() || segment.ringOut) continue;\n\n        var prevEvent = null;\n        var event = segment.leftSE;\n        var nextEvent = segment.rightSE;\n        var events = [event];\n\n        var startingPoint = event.point;\n        var intersectionLEs = [];\n\n        /* Walk the chain of linked events to form a closed ring */\n        while (true) {\n          prevEvent = event;\n          event = nextEvent;\n          events.push(event);\n\n          /* Is the ring complete? */\n          if (event.point === startingPoint) break;\n\n          while (true) {\n            var availableLEs = event.getAvailableLinkedEvents();\n\n            /* Did we hit a dead end? This shouldn't happen. Indicates some earlier\n             * part of the algorithm malfunctioned... please file a bug report. */\n            if (availableLEs.length === 0) {\n              var firstPt = events[0].point;\n              var lastPt = events[events.length - 1].point;\n              throw new Error('Unable to complete output ring starting at [' + firstPt.x + ',' + (' ' + firstPt.y + ']. Last matching segment found ends at') + (' [' + lastPt.x + ', ' + lastPt.y + '].'));\n            }\n\n            /* Only one way to go, so cotinue on the path */\n            if (availableLEs.length === 1) {\n              nextEvent = availableLEs[0].otherSE;\n              break;\n            }\n\n            /* We must have an intersection. Check for a completed loop */\n            var indexLE = null;\n            for (var j = 0, jMax = intersectionLEs.length; j < jMax; j++) {\n              if (intersectionLEs[j].point === event.point) {\n                indexLE = j;\n                break;\n              }\n            }\n            /* Found a completed loop. Cut that off and make a ring */\n            if (indexLE !== null) {\n              var intersectionLE = intersectionLEs.splice(indexLE)[0];\n              var ringEvents = events.splice(intersectionLE.index);\n              ringEvents.unshift(ringEvents[0].otherSE);\n              ringsOut.push(new RingOut(ringEvents.reverse()));\n              continue;\n            }\n            /* register the intersection */\n            intersectionLEs.push({\n              index: events.length,\n              point: event.point\n            });\n            /* Choose the left-most option to continue the walk */\n            var comparator = event.getLeftmostComparator(prevEvent);\n            nextEvent = availableLEs.sort(comparator)[0].otherSE;\n            break;\n          }\n        }\n\n        ringsOut.push(new RingOut(events));\n      }\n      return ringsOut;\n    }\n  }]);\n\n  function RingOut(events) {\n    _classCallCheck(this, RingOut);\n\n    this.events = events;\n    for (var i = 0, iMax = events.length; i < iMax; i++) {\n      events[i].segment.ringOut = this;\n    }\n    this.poly = null;\n  }\n\n  _createClass(RingOut, [{\n    key: 'getGeom',\n    value: function getGeom() {\n      // Remove superfluous points (ie extra points along a straight line),\n      var prevPt = this.events[0].point;\n      var points = [prevPt];\n      for (var i = 1, iMax = this.events.length - 1; i < iMax; i++) {\n        var _pt = this.events[i].point;\n        var _nextPt = this.events[i + 1].point;\n        if ((0, _vector.compareVectorAngles)(_pt, prevPt, _nextPt) === 0) continue;\n        points.push(_pt);\n        prevPt = _pt;\n      }\n\n      // ring was all (within rounding error of angle calc) colinear points\n      if (points.length === 1) return null;\n\n      // check if the starting point is necessary\n      var pt = points[0];\n      var nextPt = points[1];\n      if ((0, _vector.compareVectorAngles)(pt, prevPt, nextPt) === 0) points.shift();\n\n      points.push(points[0]);\n      var step = this.isExteriorRing() ? 1 : -1;\n      var iStart = this.isExteriorRing() ? 0 : points.length - 1;\n      var iEnd = this.isExteriorRing() ? points.length : -1;\n      var orderedPoints = [];\n      for (var _i = iStart; _i != iEnd; _i += step) {\n        orderedPoints.push([points[_i].x, points[_i].y]);\n      }return orderedPoints;\n    }\n  }, {\n    key: 'isExteriorRing',\n    value: function isExteriorRing() {\n      if (this._isExteriorRing === undefined) {\n        var enclosing = this.enclosingRing();\n        this._isExteriorRing = enclosing ? !enclosing.isExteriorRing() : true;\n      }\n      return this._isExteriorRing;\n    }\n  }, {\n    key: 'enclosingRing',\n    value: function enclosingRing() {\n      if (this._enclosingRing === undefined) {\n        this._enclosingRing = this._calcEnclosingRing();\n      }\n      return this._enclosingRing;\n    }\n\n    /* Returns the ring that encloses this one, if any */\n\n  }, {\n    key: '_calcEnclosingRing',\n    value: function _calcEnclosingRing() {\n      // start with the ealier sweep line event so that the prevSeg\n      // chain doesn't lead us inside of a loop of ours\n      var leftMostEvt = this.events[0];\n      for (var i = 1, iMax = this.events.length; i < iMax; i++) {\n        var evt = this.events[i];\n        if (_sweepEvent2.default.compare(leftMostEvt, evt) > 0) leftMostEvt = evt;\n      }\n\n      var prevSeg = leftMostEvt.segment.prevInResult();\n      var prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;\n\n      while (true) {\n        // no segment found, thus no ring can enclose us\n        if (!prevSeg) return null;\n\n        // no segments below prev segment found, thus the ring of the prev\n        // segment must loop back around and enclose us\n        if (!prevPrevSeg) return prevSeg.ringOut;\n\n        // if the two segments are of different rings, the ring of the prev\n        // segment must either loop around us or the ring of the prev prev\n        // seg, which would make us and the ring of the prev peers\n        if (prevPrevSeg.ringOut !== prevSeg.ringOut) {\n          if (prevPrevSeg.ringOut.enclosingRing() !== prevSeg.ringOut) {\n            return prevSeg.ringOut;\n          } else return prevSeg.ringOut.enclosingRing();\n        }\n\n        // two segments are from the same ring, so this was a penisula\n        // of that ring. iterate downward, keep searching\n        prevSeg = prevPrevSeg.prevInResult();\n        prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;\n      }\n    }\n  }]);\n\n  return RingOut;\n}();\n\nvar PolyOut = exports.PolyOut = function () {\n  function PolyOut(exteriorRing) {\n    _classCallCheck(this, PolyOut);\n\n    this.exteriorRing = exteriorRing;\n    exteriorRing.poly = this;\n    this.interiorRings = [];\n  }\n\n  _createClass(PolyOut, [{\n    key: 'addInterior',\n    value: function addInterior(ring) {\n      this.interiorRings.push(ring);\n      ring.poly = this;\n    }\n  }, {\n    key: 'getGeom',\n    value: function getGeom() {\n      var geom = [this.exteriorRing.getGeom()];\n      // exterior ring was all (within rounding error of angle calc) colinear points\n      if (geom[0] === null) return null;\n      for (var i = 0, iMax = this.interiorRings.length; i < iMax; i++) {\n        var ringGeom = this.interiorRings[i].getGeom();\n        // interior ring was all (within rounding error of angle calc) colinear points\n        if (ringGeom === null) continue;\n        geom.push(ringGeom);\n      }\n      return geom;\n    }\n  }]);\n\n  return PolyOut;\n}();\n\nvar MultiPolyOut = exports.MultiPolyOut = function () {\n  function MultiPolyOut(rings) {\n    _classCallCheck(this, MultiPolyOut);\n\n    this.rings = rings;\n    this.polys = this._composePolys(rings);\n  }\n\n  _createClass(MultiPolyOut, [{\n    key: 'getGeom',\n    value: function getGeom() {\n      var geom = [];\n      for (var i = 0, iMax = this.polys.length; i < iMax; i++) {\n        var polyGeom = this.polys[i].getGeom();\n        // exterior ring was all (within rounding error of angle calc) colinear points\n        if (polyGeom === null) continue;\n        geom.push(polyGeom);\n      }\n      return geom;\n    }\n  }, {\n    key: '_composePolys',\n    value: function _composePolys(rings) {\n      var polys = [];\n      for (var i = 0, iMax = rings.length; i < iMax; i++) {\n        var ring = rings[i];\n        if (ring.poly) continue;\n        if (ring.isExteriorRing()) polys.push(new PolyOut(ring));else {\n          var enclosingRing = ring.enclosingRing();\n          if (!enclosingRing.poly) polys.push(new PolyOut(enclosingRing));\n          enclosingRing.poly.addInterior(ring);\n        }\n      }\n      return polys;\n    }\n  }]);\n\n  return MultiPolyOut;\n}();\n\n//# sourceURL=webpack://polygon-clipping/./src/geom-out.js?"
          )
        },
        './src/index.js': function d (a, b, c) {
          eval(
            "\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _operation = __webpack_require__(/*! ./operation */ \"./src/operation.js\");\n\nvar _operation2 = _interopRequireDefault(_operation);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar union = function union(geom) {\n  for (var _len = arguments.length, moreGeoms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    moreGeoms[_key - 1] = arguments[_key];\n  }\n\n  return _operation2.default.run('union', geom, moreGeoms);\n};\n\nvar intersection = function intersection(geom) {\n  for (var _len2 = arguments.length, moreGeoms = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {\n    moreGeoms[_key2 - 1] = arguments[_key2];\n  }\n\n  return _operation2.default.run('intersection', geom, moreGeoms);\n};\n\nvar xor = function xor(geom) {\n  for (var _len3 = arguments.length, moreGeoms = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {\n    moreGeoms[_key3 - 1] = arguments[_key3];\n  }\n\n  return _operation2.default.run('xor', geom, moreGeoms);\n};\n\nvar difference = function difference(subjectGeom) {\n  for (var _len4 = arguments.length, clippingGeoms = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {\n    clippingGeoms[_key4 - 1] = arguments[_key4];\n  }\n\n  return _operation2.default.run('difference', subjectGeom, clippingGeoms);\n};\n\nexports.default = {\n  union: union,\n  intersection: intersection,\n  xor: xor,\n  difference: difference\n};\nmodule.exports = exports.default;\n\n//# sourceURL=webpack://polygon-clipping/./src/index.js?"
          )
        },
        './src/operation.js': function d (a, b, c) {
          eval(
            '\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.Operation = undefined;\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _splaytree = __webpack_require__(/*! splaytree */ "./node_modules/splaytree/index.js");\n\nvar _splaytree2 = _interopRequireDefault(_splaytree);\n\nvar _cleanInput = __webpack_require__(/*! ./clean-input */ "./src/clean-input.js");\n\nvar cleanInput = _interopRequireWildcard(_cleanInput);\n\nvar _geomIn = __webpack_require__(/*! ./geom-in */ "./src/geom-in.js");\n\nvar geomIn = _interopRequireWildcard(_geomIn);\n\nvar _geomOut = __webpack_require__(/*! ./geom-out */ "./src/geom-out.js");\n\nvar geomOut = _interopRequireWildcard(_geomOut);\n\nvar _sweepEvent = __webpack_require__(/*! ./sweep-event */ "./src/sweep-event.js");\n\nvar _sweepEvent2 = _interopRequireDefault(_sweepEvent);\n\nvar _sweepLine = __webpack_require__(/*! ./sweep-line */ "./src/sweep-line.js");\n\nvar _sweepLine2 = _interopRequireDefault(_sweepLine);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nvar Operation = exports.Operation = function () {\n  function Operation() {\n    _classCallCheck(this, Operation);\n  }\n\n  _createClass(Operation, [{\n    key: \'run\',\n    value: function run(type, geom, moreGeoms) {\n      operation.type = type;\n\n      /* Make a copy of the input geometry with points as objects, for perf */\n      var geoms = [cleanInput.pointsAsObjects(geom)];\n      for (var i = 0, iMax = moreGeoms.length; i < iMax; i++) {\n        geoms.push(cleanInput.pointsAsObjects(moreGeoms[i]));\n      }\n\n      /* Clean inputs */\n      for (var _i = 0, _iMax = geoms.length; _i < _iMax; _i++) {\n        cleanInput.forceMultiPoly(geoms[_i]);\n        cleanInput.cleanMultiPoly(geoms[_i]);\n      }\n\n      /* Convert inputs to MultiPoly objects, mark subject */\n      var multipolys = [];\n      for (var _i2 = 0, _iMax2 = geoms.length; _i2 < _iMax2; _i2++) {\n        multipolys.push(new geomIn.MultiPolyIn(geoms[_i2]));\n      }\n      multipolys[0].markAsSubject();\n      operation.numMultiPolys = multipolys.length;\n\n      /* Put segment endpoints in a priority queue */\n      var queue = new _splaytree2.default(_sweepEvent2.default.compare);\n      for (var _i3 = 0, _iMax3 = multipolys.length; _i3 < _iMax3; _i3++) {\n        var sweepEvents = multipolys[_i3].getSweepEvents();\n        for (var j = 0, jMax = sweepEvents.length; j < jMax; j++) {\n          queue.insert(sweepEvents[j]);\n        }\n      }\n\n      /* Pass the sweep line over those endpoints */\n      var sweepLine = new _sweepLine2.default(queue);\n      var node = void 0;\n      var prevQueueSize = queue.size;\n      while (node = queue.pop()) {\n        var evt = node.key;\n        if (queue.size === prevQueueSize) {\n          // prevents an infinite loop, an otherwise common manifestation of bugs\n          throw new Error(\'Unable to pop() SweepEvent #\' + evt.id + \' [\' + evt.point.x + \', \' + evt.point.y + \'] \' + \'from queue. Please file a bug report.\');\n        }\n        var newEvents = sweepLine.process(evt);\n        for (var _i4 = 0, _iMax4 = newEvents.length; _i4 < _iMax4; _i4++) {\n          queue.insert(newEvents[_i4]);\n        }\n        prevQueueSize = queue.size;\n      }\n\n      /* Collect and compile segments we\'re keeping into a multipolygon */\n      var ringsOut = geomOut.RingOut.factory(sweepLine.segments);\n      var result = new geomOut.MultiPolyOut(ringsOut);\n      return result.getGeom();\n    }\n  }]);\n\n  return Operation;\n}();\n\n// singleton available by import\n\n\nvar operation = new Operation();\n\nexports.default = operation;\n\n//# sourceURL=webpack://polygon-clipping/./src/operation.js?'
          )
        },
        './src/segment.js': function d (a, b, c) {
          eval(
            "\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _operation = __webpack_require__(/*! ./operation */ \"./src/operation.js\");\n\nvar _operation2 = _interopRequireDefault(_operation);\n\nvar _sweepEvent = __webpack_require__(/*! ./sweep-event */ \"./src/sweep-event.js\");\n\nvar _sweepEvent2 = _interopRequireDefault(_sweepEvent);\n\nvar _bbox = __webpack_require__(/*! ./bbox */ \"./src/bbox.js\");\n\nvar _flp = __webpack_require__(/*! ./flp */ \"./src/flp.js\");\n\nvar _vector = __webpack_require__(/*! ./vector */ \"./src/vector.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Segment = function () {\n  _createClass(Segment, null, [{\n    key: 'compare',\n    value: function compare(a, b) {\n\n      var alx = a.leftSE.point.x;\n      var aly = a.leftSE.point.y;\n      var blx = b.leftSE.point.x;\n      var bly = b.leftSE.point.y;\n      var arx = a.rightSE.point.x;\n      var brx = b.rightSE.point.x;\n\n      // check if they're even in the same vertical plane\n      if ((0, _flp.cmp)(brx, alx) < 0) return 1;\n      if ((0, _flp.cmp)(arx, blx) < 0) return -1;\n\n      // check for a consumption relationship. if present,\n      // avoid the segment angle calculations (can yield\n      // inconsistent results after splitting)\n      var aConsumedBy = a;\n      var bConsumedBy = b;\n      while (aConsumedBy.consumedBy) {\n        aConsumedBy = aConsumedBy.consumedBy;\n      }while (bConsumedBy.consumedBy) {\n        bConsumedBy = bConsumedBy.consumedBy;\n      } // for segment angle comparisons\n      var aCmpBLeft = void 0,\n          aCmpBRight = void 0,\n          bCmpALeft = void 0,\n          bCmpARight = void 0;\n\n      if (aConsumedBy === bConsumedBy) {\n        // are they identical?\n        if (a === b) return 0;\n\n        // colinear segments with matching left-endpoints, fall back\n        // on creation order of left sweep events as a tie-breaker\n        var aId = a.leftSE.id;\n        var bId = b.leftSE.id;\n        if (aId < bId) return -1;\n        if (aId > bId) return 1;\n      } else if (\n      // are a and b colinear?\n      (aCmpBLeft = a.comparePoint(b.leftSE.point)) === 0 && (aCmpBRight = a.comparePoint(b.rightSE.point)) === 0 && (bCmpALeft = b.comparePoint(a.leftSE.point)) === 0 && (bCmpARight = b.comparePoint(a.rightSE.point)) === 0) {\n        // a & b are colinear\n\n        // colinear segments with non-matching left-endpoints, consider\n        // the more-left endpoint to be earlier\n        var cmpLX = (0, _flp.cmp)(alx, blx);\n        if (cmpLX !== 0) return cmpLX;\n\n        // NOTE: we do not use segment length to break a tie here, because\n        //       when segments are split their length changes\n\n        // colinear segments with matching left-endpoints, fall back\n        // on creation order of left sweep events as a tie-breaker\n        var _aId = a.leftSE.id;\n        var _bId = b.leftSE.id;\n        if (_aId < _bId) return -1;\n        if (_aId > _bId) return 1;\n      } else {\n        // a & b are not colinear\n\n        var _cmpLX = (0, _flp.cmp)(alx, blx);\n        // if the left endpoints are not in the same vertical line,\n        // consider the placement of the left event of the right-more segment\n        // with respect to the left-more segment.\n        if (_cmpLX < 0) {\n          if (aCmpBLeft > 0) return -1;\n          if (aCmpBLeft < 0) return 1;\n          // NOTE: fall-through is necessary here. why? Can that be avoided?\n        }\n        if (_cmpLX > 0) {\n          if (bCmpALeft === undefined) bCmpALeft = b.comparePoint(a.leftSE.point);\n          if (bCmpALeft !== 0) return bCmpALeft;\n          // NOTE: fall-through is necessary here. why? Can that be avoided?\n        }\n\n        var cmpLY = (0, _flp.cmp)(aly, bly);\n        // if left endpoints are in the same vertical line, lower means ealier\n        if (cmpLY !== 0) return cmpLY;\n        // left endpoints match exactly\n\n        // special case verticals due to rounding errors\n        // part of https://github.com/mfogel/polygon-clipping/issues/29\n        var aVert = a.isVertical();\n        if (aVert !== b.isVertical()) return aVert ? 1 : -1;\n\n        // sometimes, because one segment is longer than the other,\n        // one of these comparisons will return 0 and the other won't\n        if (aCmpBRight === undefined) aCmpBRight = a.comparePoint(b.rightSE.point);\n        if (aCmpBRight > 0) return -1;\n        if (aCmpBRight < 0) return 1;\n        if (bCmpARight === undefined) bCmpARight = b.comparePoint(a.rightSE.point);\n        if (bCmpARight !== 0) return bCmpARight;\n      }\n\n      throw new Error('Segment comparison of ' + ('[' + a.leftSE.point.x + ', ' + a.leftSE.point.y + '] -> [' + a.rightSE.point.x + ', ' + a.rightSE.point.y + '] ') + 'against ' + ('[' + b.leftSE.point.x + ', ' + b.leftSE.point.y + '] -> [' + b.rightSE.point.x + ', ' + b.rightSE.point.y + '] ') + 'failed. Please submit a bug report.');\n    }\n\n    /* Warning: a reference to ringsIn input will be stored,\n     *  and possibly will be later modified */\n\n  }]);\n\n  function Segment(leftSE, rightSE, ringsIn) {\n    _classCallCheck(this, Segment);\n\n    this.leftSE = leftSE;\n    leftSE.segment = this;\n    leftSE.otherSE = rightSE;\n    this.rightSE = rightSE;\n    rightSE.segment = this;\n    rightSE.otherSE = leftSE;\n    this.ringsIn = ringsIn;\n    this._cache = {};\n    // left unset for performance, set later in algorithm\n    // this.ringOut, this.consumedBy, this.prev\n  }\n\n  _createClass(Segment, [{\n    key: 'replaceRightSE',\n\n\n    /* When a segment is split, the rightSE is replaced with a new sweep event */\n    value: function replaceRightSE(newRightSE) {\n      this.rightSE = newRightSE;\n      this.rightSE.segment = this;\n      this.rightSE.otherSE = this.leftSE;\n      this.leftSE.otherSE = this.rightSE;\n    }\n  }, {\n    key: 'bbox',\n    value: function bbox() {\n      var y1 = this.leftSE.point.y;\n      var y2 = this.rightSE.point.y;\n      return {\n        ll: { x: this.leftSE.point.x, y: y1 < y2 ? y1 : y2 },\n        ur: { x: this.rightSE.point.x, y: y1 > y2 ? y1 : y2 }\n      };\n    }\n\n    /* A vector from the left point to the right */\n\n  }, {\n    key: 'vector',\n    value: function vector() {\n      return {\n        x: this.rightSE.point.x - this.leftSE.point.x,\n        y: this.rightSE.point.y - this.leftSE.point.y\n      };\n    }\n  }, {\n    key: 'isVertical',\n    value: function isVertical() {\n      return (0, _flp.cmp)(this.leftSE.point.x, this.rightSE.point.x) === 0;\n    }\n  }, {\n    key: 'isAnEndpoint',\n    value: function isAnEndpoint(point) {\n      return (0, _flp.cmpPoints)(point, this.leftSE.point) === 0 || (0, _flp.cmpPoints)(point, this.rightSE.point) === 0;\n    }\n\n    /* Compare this segment with a point. Return value indicates:\n     *     1: point lies above or to the left of segment\n     *     0: point is colinear to segment\n     *    -1: point is below or to the right of segment */\n\n  }, {\n    key: 'comparePoint',\n    value: function comparePoint(point) {\n      if (this.isAnEndpoint(point)) return 0;\n      var interPt = (0, _vector.closestPoint)(this.leftSE.point, this.vector(), point);\n\n      var cmpY = (0, _flp.cmp)(point.y, interPt.y);\n      if (cmpY !== 0) return cmpY;\n\n      var cmpX = (0, _flp.cmp)(point.x, interPt.x);\n      var segCmpX = (0, _flp.cmp)(this.leftSE.point.y, this.rightSE.point.y);\n\n      // depending on if our segment angles up or down,\n      // the x coord comparison means oppposite things\n      if (cmpX > 0) return segCmpX;\n      if (cmpX < 0) {\n        if (segCmpX > 0) return -1;\n        if (segCmpX < 0) return 1;\n      }\n      return 0;\n    }\n\n    /* Compare point vertically with segment.\n     *    1: point is below segment\n     *    0: segment appears to be vertical\n     *   -1: point is above segment */\n\n  }, {\n    key: 'compareVertically',\n    value: function compareVertically(point) {\n      if (this.isAnEndpoint(point)) return 0;\n      var interPt = (0, _vector.verticalIntersection)(this.leftSE.point, this.vector(), point.x);\n\n      // Trying to be as exact as possible here, hence not using flp comparisons\n      if (interPt !== null) {\n        if (point.y < interPt.y) return -1;\n        if (point.y > interPt.y) return 1;\n      }\n      return 0;\n    }\n\n    /* Does the point in question touch the given segment?\n     * Greedy - essentially a 2 * Number.EPSILON comparison.\n     * If it's not possible to add an independent point between the\n     * point and the segment, we say the point 'touches' the segment. */\n\n  }, {\n    key: 'touches',\n    value: function touches(point) {\n      if (!(0, _bbox.touchesBbox)(this.bbox(), point)) return false;\n      var cPt = (0, _vector.closestPoint)(this.leftSE.point, this.vector(), point);\n      var avgPt = { x: (cPt.x + point.x) / 2, y: (cPt.y + point.y) / 2 };\n      return (0, _flp.touchPoints)(avgPt, cPt) || (0, _flp.touchPoints)(avgPt, point);\n    }\n\n    /**\n     * Given another segment, returns the first non-trivial intersection\n     * between the two segments (in terms of sweep line ordering), if it exists.\n     *\n     * A 'non-trivial' intersection is one that will cause one or both of the\n     * segments to be split(). As such, 'trivial' vs. 'non-trivial' intersection:\n     *\n     *   * endpoint of segA with endpoint of segB --> trivial\n     *   * endpoint of segA with point along segB --> non-trivial\n     *   * endpoint of segB with point along segA --> non-trivial\n     *   * point along segA with point along segB --> non-trivial\n     *\n     * If no non-trivial intersection exists, return null\n     * Else, return null.\n     */\n\n  }, {\n    key: 'getIntersection',\n    value: function getIntersection(other) {\n      // If bboxes don't overlap, there can't be any intersections\n      var bboxOverlap = (0, _bbox.getBboxOverlap)(this.bbox(), other.bbox());\n      if (bboxOverlap === null) return null;\n\n      // We first check to see if the endpoints can be considered intersections.\n      // This will 'snap' intersections to endpoints if possible, and will\n      // handle cases of colinearity.\n\n      // does each endpoint touch the other segment?\n      var touchesOtherLSE = this.touches(other.leftSE.point);\n      var touchesThisLSE = other.touches(this.leftSE.point);\n      var touchesOtherRSE = this.touches(other.rightSE.point);\n      var touchesThisRSE = other.touches(this.rightSE.point);\n\n      // do left endpoints match?\n      if (touchesThisLSE && touchesOtherLSE) {\n        // these two cases are for colinear segments with matching left\n        // endpoints, and one segment being longer than the other\n        if (touchesThisRSE && !touchesOtherRSE) return this.rightSE.point;\n        if (!touchesThisRSE && touchesOtherRSE) return other.rightSE.point;\n        // either the two segments match exactly (two trival intersections)\n        // or just on their left endpoint (one trivial intersection\n        return null;\n      }\n\n      // does this left endpoint matches (other doesn't)\n      if (touchesThisLSE) {\n        // check for segments that just intersect on opposing endpoints\n        if (touchesOtherRSE && (0, _flp.cmpPoints)(this.leftSE.point, other.rightSE.point) === 0) return null;\n        // t-intersection on left endpoint\n        return this.leftSE.point;\n      }\n\n      // does other left endpoint matches (this doesn't)\n      if (touchesOtherLSE) {\n        // check for segments that just intersect on opposing endpoints\n        if (touchesThisRSE && (0, _flp.cmpPoints)(this.rightSE.point, other.leftSE.point) === 0) return null;\n        // t-intersection on left endpoint\n        return other.leftSE.point;\n      }\n\n      // trivial intersection on right endpoints\n      if (touchesThisRSE && touchesOtherRSE) return null;\n\n      // t-intersections on just one right endpoint\n      if (touchesThisRSE) return this.rightSE.point;\n      if (touchesOtherRSE) return other.rightSE.point;\n\n      // None of our endpoints intersect. Look for a general intersection between\n      // infinite lines laid over the segments\n      var pt = (0, _vector.intersection)(this.leftSE.point, this.vector(), other.leftSE.point, other.vector());\n\n      // are the segments parrallel? Note that if they were colinear with overlap,\n      // they would have an endpoint intersection and that case was already handled above\n      if (pt === null) return null;\n\n      // is the intersection found between the lines not on the segments?\n      if (!(0, _bbox.isInBbox)(bboxOverlap, pt)) return null;\n\n      // We don't need to check if we need to 'snap' to an endpoint,\n      // because the endpoint cmps we did eariler were greedy\n      return pt;\n    }\n\n    /**\n     * Split the given segment into multiple segments on the given points.\n     *  * Each existing segment will retain its leftSE and a new rightSE will be\n     *    generated for it.\n     *  * A new segment will be generated which will adopt the original segment's\n     *    rightSE, and a new leftSE will be generated for it.\n     *  * If there are more than two points given to split on, new segments\n     *    in the middle will be generated with new leftSE and rightSE's.\n     *  * An array of the newly generated SweepEvents will be returned.\n     *\n     * Warning: input array of points is modified\n     */\n\n  }, {\n    key: 'split',\n    value: function split(points) {\n      // sort the points in sweep line order\n      points.sort(_flp.cmpPoints);\n\n      var prevSeg = this;\n      var prevPoint = null;\n\n      var newEvents = [];\n      for (var i = 0, iMax = points.length; i < iMax; i++) {\n        var point = points[i];\n        // skip repeated points\n        if (prevPoint && (0, _flp.cmpPoints)(prevPoint, point) === 0) continue;\n        var alreadyLinked = point.events !== undefined;\n\n        var newLeftSE = new _sweepEvent2.default(point, true);\n        var newRightSE = new _sweepEvent2.default(point, false);\n        var oldRightSE = prevSeg.rightSE;\n        prevSeg.replaceRightSE(newRightSE);\n        newEvents.push(newRightSE);\n        newEvents.push(newLeftSE);\n\n        prevSeg = new Segment(newLeftSE, oldRightSE, prevSeg.ringsIn.slice());\n\n        // in the point we just used to create new sweep events with was already\n        // linked to other events, we need to check if either of the affected\n        // segments should be consumed\n        if (alreadyLinked) {\n          newLeftSE.segment.checkForConsuming();\n          newRightSE.segment.checkForConsuming();\n        }\n\n        prevPoint = point;\n      }\n\n      return newEvents;\n    }\n\n    /* Do a pass over the linked events and to see if any segments\n     * should be consumed. If so, do it. */\n\n  }, {\n    key: 'checkForConsuming',\n    value: function checkForConsuming() {\n      if (this.leftSE.point.events.length === 1) return;\n      if (this.rightSE.point.events.length === 1) return;\n      for (var i = 0, iMax = this.leftSE.point.events.length; i < iMax; i++) {\n        var le = this.leftSE.point.events[i];\n        if (le === this.leftSE) continue;\n        for (var j = 0, jMax = this.rightSE.point.events.length; j < jMax; j++) {\n          var re = this.rightSE.point.events[j];\n          if (re === this.rightSE) continue;\n          if (le.segment === re.segment) this.consume(le.segment);\n        }\n      }\n    }\n\n    /* Consume another segment. We take their ringsIn under our wing\n     * and mark them as consumed. Use for perfectly overlapping segments */\n\n  }, {\n    key: 'consume',\n    value: function consume(other) {\n      var consumer = this;\n      var consumee = other;\n      while (consumer.consumedBy) {\n        consumer = consumer.consumedBy;\n      }while (consumee.consumedBy) {\n        consumee = consumee.consumedBy;\n      }var cmp = Segment.compare(consumer, consumee);\n      if (cmp === 0) return; // already consumed\n      // the winner of the consumption is the earlier segment\n      // according to sweep line ordering\n      if (cmp > 0) {\n        var tmp = consumer;\n        consumer = consumee;\n        consumee = tmp;\n      }\n\n      for (var i = 0, iMax = consumee.ringsIn.length; i < iMax; i++) {\n        consumer.ringsIn.push(consumee.ringsIn[i]);\n      }\n      consumee.ringsIn = null;\n      consumee.consumedBy = consumer;\n\n      // mark sweep events consumed as to maintain ordering in sweep event queue\n      consumee.leftSE.consumedBy = consumer.leftSE;\n      consumee.rightSE.consumedBy = consumer.rightSE;\n    }\n\n    /* The first segment previous segment chain that is in the result */\n\n  }, {\n    key: 'prevInResult',\n    value: function prevInResult() {\n      var key = 'prevInResult';\n      if (this._cache[key] === undefined) this._cache[key] = this['_' + key]();\n      return this._cache[key];\n    }\n  }, {\n    key: '_prevInResult',\n    value: function _prevInResult() {\n      if (!this.prev) return null;\n      if (this.prev.isInResult()) return this.prev;\n      return this.prev.prevInResult();\n    }\n  }, {\n    key: 'ringsBefore',\n    value: function ringsBefore() {\n      var key = 'ringsBefore';\n      if (this._cache[key] === undefined) this._cache[key] = this['_' + key]();\n      return this._cache[key];\n    }\n  }, {\n    key: '_ringsBefore',\n    value: function _ringsBefore() {\n      if (!this.prev) return [];\n      return (this.prev.consumedBy || this.prev).ringsAfter();\n    }\n  }, {\n    key: 'ringsAfter',\n    value: function ringsAfter() {\n      var key = 'ringsAfter';\n      if (this._cache[key] === undefined) this._cache[key] = this['_' + key]();\n      return this._cache[key];\n    }\n  }, {\n    key: '_ringsAfter',\n    value: function _ringsAfter() {\n      var rings = this.ringsBefore().slice(0);\n      for (var i = 0, iMax = this.ringsIn.length; i < iMax; i++) {\n        var ring = this.ringsIn[i];\n        var index = rings.indexOf(ring);\n        if (index === -1) rings.push(ring);else rings.splice(index, 1);\n      }\n      return rings;\n    }\n  }, {\n    key: 'multiPolysBefore',\n    value: function multiPolysBefore() {\n      var key = 'multiPolysBefore';\n      if (this._cache[key] === undefined) this._cache[key] = this['_' + key]();\n      return this._cache[key];\n    }\n  }, {\n    key: '_multiPolysBefore',\n    value: function _multiPolysBefore() {\n      if (!this.prev) return [];\n      return (this.prev.consumedBy || this.prev).multiPolysAfter();\n    }\n  }, {\n    key: 'multiPolysAfter',\n    value: function multiPolysAfter() {\n      var key = 'multiPolysAfter';\n      if (this._cache[key] === undefined) this._cache[key] = this['_' + key]();\n      return this._cache[key];\n    }\n  }, {\n    key: '_multiPolysAfter',\n    value: function _multiPolysAfter() {\n      // first calcualte our polysAfter\n      var polysAfter = [];\n      var polysExclude = [];\n      var ringsAfter = this.ringsAfter();\n      for (var i = 0, iMax = ringsAfter.length; i < iMax; i++) {\n        var ring = ringsAfter[i];\n        var poly = ring.poly;\n        if (polysExclude.indexOf(poly) !== -1) continue;\n        if (ring.isExterior) polysAfter.push(poly);else {\n          if (!(polysExclude.indexOf(poly) !== -1)) polysExclude.push(poly);\n          var index = polysAfter.indexOf(ring.poly);\n          if (index !== -1) polysAfter.splice(index, 1);\n        }\n      }\n      // now calculate our multiPolysAfter\n      var mps = [];\n      for (var _i = 0, _iMax = polysAfter.length; _i < _iMax; _i++) {\n        var mp = polysAfter[_i].multiPoly;\n        if (!(mps.indexOf(mp) !== -1)) mps.push(mp);\n      }\n      return mps;\n    }\n\n    /* Is this segment part of the final result? */\n\n  }, {\n    key: 'isInResult',\n    value: function isInResult() {\n      var key = 'isInResult';\n      if (this._cache[key] === undefined) this._cache[key] = this['_' + key]();\n      return this._cache[key];\n    }\n  }, {\n    key: '_isInResult',\n    value: function _isInResult() {\n      // if we've been consumed, we're not in the result\n      if (this.consumedBy) return false;\n\n      var mpsBefore = this.multiPolysBefore();\n      var mpsAfter = this.multiPolysAfter();\n\n      switch (_operation2.default.type) {\n        case 'union':\n          // UNION - included iff:\n          //  * On one side of us there is 0 poly interiors AND\n          //  * On the other side there is 1 or more.\n          var noBefores = mpsBefore.length === 0;\n          var noAfters = mpsAfter.length === 0;\n          return noBefores !== noAfters;\n\n        case 'intersection':\n          // INTERSECTION - included iff:\n          //  * on one side of us all multipolys are rep. with poly interiors AND\n          //  * on the other side of us, not all multipolys are repsented\n          //    with poly interiors\n          var least = void 0;\n          var most = void 0;\n          if (mpsBefore.length < mpsAfter.length) {\n            least = mpsBefore.length;\n            most = mpsAfter.length;\n          } else {\n            least = mpsAfter.length;\n            most = mpsBefore.length;\n          }\n          return most === _operation2.default.numMultiPolys && least < most;\n\n        case 'xor':\n          // XOR - included iff:\n          //  * the difference between the number of multipolys represented\n          //    with poly interiors on our two sides is an odd number\n          var diff = Math.abs(mpsBefore.length - mpsAfter.length);\n          return diff % 2 === 1;\n\n        case 'difference':\n          // DIFFERENCE included iff:\n          //  * on exactly one side, we have just the subject\n          var isJustSubject = function isJustSubject(mps) {\n            return mps.length === 1 && mps[0].isSubject;\n          };\n          return isJustSubject(mpsBefore) !== isJustSubject(mpsAfter);\n\n        default:\n          throw new Error('Unrecognized operation type found ' + _operation2.default.type);\n      }\n    }\n  }], [{\n    key: 'fromRing',\n    value: function fromRing(point1, point2, ring) {\n      var leftSE = void 0,\n          rightSE = void 0;\n      var ptCmp = (0, _flp.cmpPoints)(point1, point2);\n      if (ptCmp < 0) {\n        leftSE = new _sweepEvent2.default(point1, true);\n        rightSE = new _sweepEvent2.default(point2, false);\n      } else if (ptCmp > 0) {\n        leftSE = new _sweepEvent2.default(point2, true);\n        rightSE = new _sweepEvent2.default(point1, false);\n      } else {\n        throw new Error('Tried to create degenerate segment at [' + point1.x + ', ' + point2.y + ']');\n      }\n      return new Segment(leftSE, rightSE, [ring]);\n    }\n  }]);\n\n  return Segment;\n}();\n\nexports.default = Segment;\nmodule.exports = exports.default;\n\n//# sourceURL=webpack://polygon-clipping/./src/segment.js?"
          )
        },
        './src/sweep-event.js': function d (a, b, c) {
          eval(
            "\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _flp = __webpack_require__(/*! ./flp */ \"./src/flp.js\");\n\nvar _vector = __webpack_require__(/*! ./vector */ \"./src/vector.js\");\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n// Give sweep events unique ID's to get consistent sorting of\n// segments and sweep events when all else is identical\nvar sweepEventId = 0;\n\nvar SweepEvent = function () {\n  _createClass(SweepEvent, null, [{\n    key: 'compare',\n    value: function compare(a, b) {\n\n      // if the events are already linked, then we know the points are equal\n      if (a.point !== b.point) {\n\n        // favor event with a point that the sweep line hits first\n        var cmpX = (0, _flp.cmp)(a.point.x, b.point.x);\n        if (cmpX !== 0) return cmpX;\n\n        var cmpY = (0, _flp.cmp)(a.point.y, b.point.y);\n        if (cmpY !== 0) return cmpY;\n\n        // Points are equal, so go ahead and link these events.\n        a.link(b);\n      }\n\n      // favor right events over left\n      if (a.isLeft !== b.isLeft) return a.isLeft ? 1 : -1;\n\n      // are they identical?\n      if (a === b) return 0;\n\n      // The calcuations of relative segment angle below can give different\n      // results after segment splitting due to rounding errors.\n      // To maintain sweep event queue ordering, we thus skip these calculations\n      // if we already know the segements to be colinear (one of the requirements\n      // of the 'consumedBy' relationship).\n      var aConsumedBy = a;\n      var bConsumedBy = b;\n      while (aConsumedBy.consumedBy) {\n        aConsumedBy = aConsumedBy.consumedBy;\n      }while (bConsumedBy.consumedBy) {\n        bConsumedBy = bConsumedBy.consumedBy;\n      }if (aConsumedBy !== bConsumedBy) {\n\n        // favor vertical segments for left events, and non-vertical for right\n        // https://github.com/mfogel/polygon-clipping/issues/29\n        var aVert = a.segment.isVertical();\n        var bVert = b.segment.isVertical();\n        if (aVert && !bVert) return a.isLeft ? 1 : -1;\n        if (!aVert && bVert) return a.isLeft ? -1 : 1;\n\n        // Favor events where the line segment is lower.\n        // Sometimes, because one segment is longer than the other,\n        // one of these comparisons will return 0 and the other won't.\n        var pointSegCmp = a.segment.compareVertically(b.otherSE.point);\n        if (pointSegCmp === 1) return -1;\n        if (pointSegCmp === -1) return 1;\n        var otherPointSegCmp = b.segment.compareVertically(a.otherSE.point);\n        if (otherPointSegCmp !== 0) return otherPointSegCmp;\n\n        // NOTE:  We don't sort on segment length because that changes\n        //        as segments are divided.\n      }\n\n      // as a tie-breaker, favor lower creation id\n      if (a.id < b.id) return -1;\n      if (a.id > b.id) return 1;\n\n      throw new Error('SweepEvent comparison failed at [' + a.point.x + ', ' + a.point.y + ']');\n    }\n\n    // Warning: 'point' input will be modified and re-used (for performance)\n\n  }]);\n\n  function SweepEvent(point, isLeft) {\n    _classCallCheck(this, SweepEvent);\n\n    if (point.events === undefined) point.events = [this];else point.events.push(this);\n    this.point = point;\n    this.isLeft = isLeft;\n    this.id = ++sweepEventId;\n    // this.segment, this.otherSE set by factory\n  }\n\n  _createClass(SweepEvent, [{\n    key: 'link',\n    value: function link(other) {\n      if (other.point === this.point) {\n        throw new Error('Tried to link already linked events');\n      }\n      var numOriginalEvents = this.point.events.length;\n      var otherEvents = other.point.events;\n      for (var i = 0, iMax = otherEvents.length; i < iMax; i++) {\n        var evt = otherEvents[i];\n        this.point.events.push(evt);\n        evt.point = this.point;\n      }\n      this.segment.checkForConsuming();\n      other.segment.checkForConsuming();\n    }\n  }, {\n    key: 'getAvailableLinkedEvents',\n    value: function getAvailableLinkedEvents() {\n      // point.events is always of length 2 or greater\n      var events = [];\n      for (var i = 0, iMax = this.point.events.length; i < iMax; i++) {\n        var evt = this.point.events[i];\n        if (evt !== this && !evt.segment.ringOut && evt.segment.isInResult()) {\n          events.push(evt);\n        }\n      }\n      return events;\n    }\n\n    /**\n     * Returns a comparator function for sorting linked events that will\n     * favor the event that will give us the smallest left-side angle.\n     * All ring construction starts as low as possible heading to the right,\n     * so by always turning left as sharp as possible we'll get polygons\n     * without uncessary loops & holes.\n     *\n     * The comparator function has a compute cache such that it avoids\n     * re-computing already-computed values.\n     */\n\n  }, {\n    key: 'getLeftmostComparator',\n    value: function getLeftmostComparator(baseEvent) {\n      var _this = this;\n\n      var cache = new Map();\n\n      var fillCache = function fillCache(linkedEvent) {\n        var nextEvent = linkedEvent.otherSE;\n        cache.set(linkedEvent, {\n          sine: (0, _vector.sineOfAngle)(_this.point, baseEvent.point, nextEvent.point),\n          cosine: (0, _vector.cosineOfAngle)(_this.point, baseEvent.point, nextEvent.point)\n        });\n      };\n\n      return function (a, b) {\n        if (!cache.has(a)) fillCache(a);\n        if (!cache.has(b)) fillCache(b);\n\n        var _cache$get = cache.get(a),\n            asine = _cache$get.sine,\n            acosine = _cache$get.cosine;\n\n        var _cache$get2 = cache.get(b),\n            bsine = _cache$get2.sine,\n            bcosine = _cache$get2.cosine;\n\n        var cmpZeroASine = (0, _flp.cmp)(asine, 0);\n        var cmpZeroBSine = (0, _flp.cmp)(bsine, 0);\n\n        if (cmpZeroASine >= 0 && cmpZeroBSine >= 0) return (0, _flp.cmp)(bcosine, acosine);\n        if (cmpZeroASine < 0 && cmpZeroBSine < 0) return (0, _flp.cmp)(acosine, bcosine);\n        return (0, _flp.cmp)(bsine, asine);\n      };\n    }\n  }]);\n\n  return SweepEvent;\n}();\n\nexports.default = SweepEvent;\nmodule.exports = exports.default;\n\n//# sourceURL=webpack://polygon-clipping/./src/sweep-event.js?"
          )
        },
        './src/sweep-line.js': function d (a, b, c) {
          eval(
            "\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _splaytree = __webpack_require__(/*! splaytree */ \"./node_modules/splaytree/index.js\");\n\nvar _splaytree2 = _interopRequireDefault(_splaytree);\n\nvar _segment = __webpack_require__(/*! ./segment */ \"./src/segment.js\");\n\nvar _segment2 = _interopRequireDefault(_segment);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * NOTE:  We must be careful not to change any segments while\n *        they are in the SplayTree. AFAIK, there's no way to tell\n *        the tree to rebalance itself - thus before splitting\n *        a segment that's in the tree, we remove it from the tree,\n *        do the split, then re-insert it. (Even though splitting a\n *        segment *shouldn't* change its correct position in the\n *        sweep line tree, the reality is because of rounding errors,\n *        it sometimes does.)\n */\n\nvar SweepLine = function () {\n  function SweepLine(queue) {\n    var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _segment2.default.compare;\n\n    _classCallCheck(this, SweepLine);\n\n    this.queue = queue;\n    this.tree = new _splaytree2.default(comparator);\n    this.segments = [];\n  }\n\n  _createClass(SweepLine, [{\n    key: 'process',\n    value: function process(event) {\n      var segment = event.segment;\n      var newEvents = [];\n\n      // if we've already been consumed by another segment,\n      // clean up our body parts and get out\n      if (event.consumedBy) {\n        if (!event.isLeft) this.tree.remove(segment);\n        return newEvents;\n      }\n\n      var node = event.isLeft ? this.tree.insert(segment) : this.tree.find(segment);\n\n      if (!node) throw new Error('Unable to find segment ' + ('#' + segment.leftSE.id + ' [' + segment.leftSE.point.x + ', ' + segment.leftSE.point.y + '] -> ') + ('#' + segment.rightSE.id + ' [' + segment.rightSE.point.x + ', ' + segment.rightSE.point.y + '] ') + 'in SweepLine tree. Please submit a bug report.');\n\n      var prevNode = this.tree.prev(node);\n      var prevSeg = prevNode ? prevNode.key : null;\n\n      var nextNode = this.tree.next(node);\n      var nextSeg = nextNode ? nextNode.key : null;\n\n      if (event.isLeft) {\n        // TODO: would it make sense to just stop and bail out at the first time we're split?\n        //       rather than split ourselves multiple times?\n        var mySplitters = [];\n\n        // Check for intersections against the previous segment in the sweep line\n        if (prevSeg) {\n          var prevInter = prevSeg.getIntersection(segment);\n          if (prevInter !== null) {\n            if (!segment.isAnEndpoint(prevInter)) mySplitters.push(prevInter);\n            if (!prevSeg.isAnEndpoint(prevInter)) {\n              var newEventsFromSplit = this._splitSafely(prevSeg, prevInter);\n              for (var i = 0, iMax = newEventsFromSplit.length; i < iMax; i++) {\n                newEvents.push(newEventsFromSplit[i]);\n              }\n            }\n          }\n        }\n\n        // Check for intersections against the next segment in the sweep line\n        if (nextSeg) {\n          var nextInter = nextSeg.getIntersection(segment);\n          if (nextInter !== null) {\n            if (!segment.isAnEndpoint(nextInter)) mySplitters.push(nextInter);\n            if (!nextSeg.isAnEndpoint(nextInter)) {\n              var _newEventsFromSplit = this._splitSafely(nextSeg, nextInter);\n              for (var _i = 0, _iMax = _newEventsFromSplit.length; _i < _iMax; _i++) {\n                newEvents.push(_newEventsFromSplit[_i]);\n              }\n            }\n          }\n        }\n\n        // did we get some intersections? split ourselves if need be\n        if (newEvents.length > 0 || mySplitters.length > 0) {\n\n          // Rounding errors can cause changes in ordering,\n          // so remove afected segments and right sweep events before splitting\n          this.tree.remove(segment);\n          this.queue.remove(segment.rightSE);\n          newEvents.push(segment.rightSE);\n\n          if (mySplitters.length > 0) {\n            var _newEventsFromSplit2 = segment.split(mySplitters);\n            for (var _i2 = 0, _iMax2 = _newEventsFromSplit2.length; _i2 < _iMax2; _i2++) {\n              newEvents.push(_newEventsFromSplit2[_i2]);\n            }\n          }\n\n          // Make sure sweep line ordering is totally consistent for later\n          // use with the segment 'prev' pointers - re-do the current event.\n          newEvents.push(event);\n        } else {\n          // done with left event\n          this.segments.push(segment);\n          segment.prev = prevSeg;\n        }\n      } else {\n        // event.isRight\n\n        // since we're about to be removed from the sweep line, check for\n        // intersections between our previous and next segments\n        if (prevSeg && nextSeg) {\n          var inter = prevSeg.getIntersection(nextSeg);\n          if (inter !== null) {\n            if (!prevSeg.isAnEndpoint(inter)) {\n              var _newEventsFromSplit3 = this._splitSafely(prevSeg, inter);\n              for (var _i3 = 0, _iMax3 = _newEventsFromSplit3.length; _i3 < _iMax3; _i3++) {\n                newEvents.push(_newEventsFromSplit3[_i3]);\n              }\n            }\n            if (!nextSeg.isAnEndpoint(inter)) {\n              var _newEventsFromSplit4 = this._splitSafely(nextSeg, inter);\n              for (var _i4 = 0, _iMax4 = _newEventsFromSplit4.length; _i4 < _iMax4; _i4++) {\n                newEvents.push(_newEventsFromSplit4[_i4]);\n              }\n            }\n          }\n        }\n\n        this.tree.remove(segment);\n      }\n\n      return newEvents;\n    }\n\n    /* Safely split a segment that is currently in the datastructures\n     * IE - a segment other than the one that is currently being processed. */\n\n  }, {\n    key: '_splitSafely',\n    value: function _splitSafely(segment, pt) {\n      // Since we're not proactively purging consumed segments from the tree,\n      // we have to avoid splitting a dead segment.\n      // Instead, split the one that consumed it.\n      var seg = segment;\n      while (seg.consumedBy) {\n        seg = seg.consumedBy;\n      } // Rounding errors can cause changes in ordering,\n      // so remove afected segments and right sweep events before splitting\n      // removeNode() doesn't work, so have re-find the seg\n      // https://github.com/w8r/splay-tree/pull/5\n      this.tree.remove(seg);\n      var rightSE = seg.rightSE;\n      this.queue.remove(rightSE);\n      var newEvents = seg.split([pt]);\n      newEvents.push(rightSE);\n      this.tree.insert(seg);\n      return newEvents;\n    }\n  }]);\n\n  return SweepLine;\n}();\n\nexports.default = SweepLine;\nmodule.exports = exports.default;\n\n//# sourceURL=webpack://polygon-clipping/./src/sweep-line.js?"
          )
        },
        './src/vector.js': function d (a, b, c) {
          eval(
            '\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.perpendicular = exports.intersection = exports.verticalIntersection = exports.horizontalIntersection = exports.closestPoint = exports.cosineOfAngle = exports.sineOfAngle = exports.length = exports.compareVectorAngles = exports.dotProduct = exports.crossProduct = undefined;\n\nvar _flp = __webpack_require__(/*! ./flp */ "./src/flp.js");\n\n/* Cross Product of two vectors with first point at origin */\nvar crossProduct = exports.crossProduct = function crossProduct(a, b) {\n  return a.x * b.y - a.y * b.x;\n};\n\n/* Dot Product of two vectors with first point at origin */\nvar dotProduct = exports.dotProduct = function dotProduct(a, b) {\n  return a.x * b.x + a.y * b.y;\n};\n\n/* Comparator for two vectors with same starting point */\nvar compareVectorAngles = exports.compareVectorAngles = function compareVectorAngles(basePt, endPt1, endPt2) {\n  var v1 = { x: endPt1.x - basePt.x, y: endPt1.y - basePt.y };\n  var v2 = { x: endPt2.x - basePt.x, y: endPt2.y - basePt.y };\n  var kross = crossProduct(v1, v2);\n  return (0, _flp.cmp)(kross, 0);\n};\n\nvar length = exports.length = function length(v) {\n  return Math.sqrt(dotProduct(v, v));\n};\n\n/* Get the sine of the angle from pShared -> pAngle to pShaed -> pBase */\nvar sineOfAngle = exports.sineOfAngle = function sineOfAngle(pShared, pBase, pAngle) {\n  var vBase = { x: pBase.x - pShared.x, y: pBase.y - pShared.y };\n  var vAngle = { x: pAngle.x - pShared.x, y: pAngle.y - pShared.y };\n  return crossProduct(vAngle, vBase) / length(vAngle) / length(vBase);\n};\n\n/* Get the cosine of the angle from pShared -> pAngle to pShaed -> pBase */\nvar cosineOfAngle = exports.cosineOfAngle = function cosineOfAngle(pShared, pBase, pAngle) {\n  var vBase = { x: pBase.x - pShared.x, y: pBase.y - pShared.y };\n  var vAngle = { x: pAngle.x - pShared.x, y: pAngle.y - pShared.y };\n  return dotProduct(vAngle, vBase) / length(vAngle) / length(vBase);\n};\n\n/* Get the closest point on an line (defined by a point and a vector)\n * to another point. */\nvar closestPoint = exports.closestPoint = function closestPoint(pt1, v1, pt2) {\n  if (v1.x === 0) return { x: pt1.x, y: pt2.y // vertical vector\n  };if (v1.y === 0) return { x: pt2.x, y: pt1.y // horizontal vector\n  };var v2 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };\n  var dist = dotProduct(v1, v2) / dotProduct(v1, v1);\n  return { x: pt1.x + dist * v1.x, y: pt1.y + dist * v1.y };\n};\n\n/* Get the x coordinate where the given line (defined by a point and vector)\n * crosses the horizontal line with the given y coordiante.\n * In the case of parrallel lines (including overlapping ones) returns null. */\nvar horizontalIntersection = exports.horizontalIntersection = function horizontalIntersection(pt, v, y) {\n  if (v.y === 0) return null;\n  return { x: pt.x + v.x / v.y * (y - pt.y), y: y };\n};\n\n/* Get the y coordinate where the given line (defined by a point and vector)\n * crosses the vertical line with the given x coordiante.\n * In the case of parrallel lines (including overlapping ones) returns null. */\nvar verticalIntersection = exports.verticalIntersection = function verticalIntersection(pt, v, x) {\n  if (v.x === 0) return null;\n  return { x: x, y: pt.y + v.y / v.x * (x - pt.x) };\n};\n\n/* Get the intersection of two lines, each defined by a base point and a vector.\n * In the case of parrallel lines (including overlapping ones) returns null. */\nvar intersection = exports.intersection = function intersection(pt1, v1, pt2, v2) {\n  // take some shortcuts for vertical and horizontal lines\n  // this also ensures we don\'t calculate an intersection and then discover\n  // it\'s actually outside the bounding box of the line\n  if (v1.x === 0) return verticalIntersection(pt2, v2, pt1.x);\n  if (v2.x === 0) return verticalIntersection(pt1, v1, pt2.x);\n  if (v1.y === 0) return horizontalIntersection(pt2, v2, pt1.y);\n  if (v2.y === 0) return horizontalIntersection(pt1, v1, pt2.y);\n\n  // General case for non-overlapping segments.\n  // This algorithm is based on Schneider and Eberly.\n  // http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf - pg 244\n\n  var kross = crossProduct(v1, v2);\n  if (kross == 0) return null;\n\n  var ve = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };\n  var d1 = crossProduct(ve, v1) / kross;\n  var d2 = crossProduct(ve, v2) / kross;\n\n  // take the average of the two calculations to minimize rounding error\n  var x1 = pt1.x + d2 * v1.x,\n      x2 = pt2.x + d1 * v2.x;\n  var y1 = pt1.y + d2 * v1.y,\n      y2 = pt2.y + d1 * v2.y;\n  var x = (x1 + x2) / 2;\n  var y = (y1 + y2) / 2;\n  return { x: x, y: y };\n};\n\n/* Given a vector, return one that is perpendicular */\nvar perpendicular = exports.perpendicular = function perpendicular(v) {\n  return { x: -v.y, y: v.x };\n};\n\n//# sourceURL=webpack://polygon-clipping/./src/vector.js?'
          )
        }
      })
    })
  })
  K(M)
  function N (a, b, c, d) {
    d = C(d)
    var e = H(a),
      f = A(e[0]),
      g = A(e[1]),
      h = A(c),
      i = s(b, d.units),
      j = Math.asin(
        Math.sin(g) * Math.cos(i) + Math.cos(g) * Math.sin(i) * Math.cos(h)
      ),
      k =
        f +
        Math.atan2(
          Math.sin(h) * Math.sin(i) * Math.cos(g),
          Math.cos(i) - Math.sin(g) * Math.sin(j)
        ),
      l = z(k),
      m = z(j)
    return o([l, m], d.properties)
  }
  function O (a, b, c) {
    c = C(c)
    var d = c.steps || 64,
      e = c.properties
        ? c.properties
        : !Array.isArray(a) && a.type === 'Feature' && a.properties
        ? a.properties
        : {},
      f = []
    for (var g = 0; g < d; g++)
      f.push(N(a, b, (g * -360) / d, c).geometry.coordinates)
    f.push(f[0])
    return p([f], e)
  }
  function P (a, b, c) {
    c = C(c)
    if (c.final === !0) {
      return Q(a, b)
    }
    var d = H(a),
      e = H(b),
      f = A(d[0]),
      g = A(e[0]),
      h = A(d[1]),
      i = A(e[1]),
      j = Math.sin(g - f) * Math.cos(i),
      k =
        Math.cos(h) * Math.sin(i) - Math.sin(h) * Math.cos(i) * Math.cos(g - f)
    return z(Math.atan2(j, k))
  }
  function Q (a, b) {
    var c = P(b, a)
    c = (c + 180) % 360
    return c
  }
  var T = L(function (a, b) {
    b = a.exports = typeof Object.keys === 'function' ? Object.keys : c
    b.shim = c
    function c (a) {
      var b = []
      for (var c in a) b.push(c)
      return b
    }
  })
  function ab (a) {
    var b = I(a),
      c = 0,
      d = 1,
      e,
      f
    while (d < b.length)
      (e = f || b[0]), (f = b[d]), (c += (f[0] - e[0]) * (f[1] + e[1])), d++
    return c > 0
  }
  var ac = {
      eudist: function d (a, b, c) {
        var e = a.length,
          f = 0
        for (var g = 0; g < e; g++) {
          var h = (a[g] || 0) - (b[g] || 0)
          f += h * h
        }
        return c ? Math.sqrt(f) : f
      },
      mandist: function d (a, b, c) {
        var e = a.length,
          f = 0
        for (var g = 0; g < e; g++) f += Math.abs((a[g] || 0) - (b[g] || 0))
        return c ? Math.sqrt(f) : f
      },
      dist: function d (a, b, c) {
        var e = Math.abs(a - b)
        return c ? e : e * e
      }
    },
    ad = ac.eudist,
    ae = ac.mandist,
    af = ac.dist,
    ag = Object.freeze({
      default: ac,
      __moduleExports: ac,
      eudist: ad,
      mandist: ae,
      dist: af
    }),
    ah = (ag && ac) || ag,
    aj = ah.dist,
    aK = Number.EPSILON
  aK === undefined && (aK = Math.pow(2, -52))
  function br (a, b, c) {
    var d = Math.sqrt(
        (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])
      ),
      e = a[0] + (c * (b[1] - a[1])) / d,
      f = b[0] + (c * (b[1] - a[1])) / d,
      g = a[1] + (c * (a[0] - b[0])) / d,
      h = b[1] + (c * (a[0] - b[0])) / d
    return [[e, g], [f, h]]
  }
  function bs (a, b, c, d, e, f, g, h) {
    var i, j, k, l, m, n
    n = { x: null, y: null, onLine1: !1, onLine2: !1 }
    i = (h - f) * (c - a) - (g - e) * (d - b)
    if (i === 0) return n
    j = b - f
    k = a - e
    l = (g - e) * j - (h - f) * k
    m = (c - a) * j - (d - b) * k
    j = l / i
    k = m / i
    n.x = a + j * (c - a)
    n.y = b + j * (d - b)
    j > 0 && j < 1 && (n.onLine1 = !0)
    return n
  }
  function bt (a) {
    return a > 0 ? -Math.abs(a) : Math.abs(a)
  }
  function bu (a, b, c, d, e, f) {
    switch (a) {
      case 'round':
        return bw(b, c, d, e, f)
    }
  }
  function bv (a, b, c, d, e, f) {
    switch (a) {
      case 'round':
        return bw(b, c, d, e, f)
      case 'square':
        return by()
      case 'flat':
        return bz(b)
    }
  }
  function bw (a, b, c, d, e) {
    return bx(
      a,
      b,
      N(a, b, d - 90).geometry.coordinates,
      N(a, b, c + 90).geometry.coordinates,
      e,
      !1
    )
  }
  function bx (a, b, c, d, e, f) {
    var g = [],
      h = Math.PI * 2,
      i = Math.atan2(c[1] - a[1], c[0] - a[0]),
      j = Math.atan2(d[1] - a[1], d[0] - a[0])
    i < 0 && (i += h)
    j < 0 && (j += h)
    var k = i > j ? i - j : i + h - j,
      l = (h - k) / e
    for (var m = 1; m < e + 1; ++m)
      (k = i + l * m), g.push([a[0] + Math.cos(k) * b, a[1] + Math.sin(k) * b])
    return g
  }
  function by () {
    return []
  }
  function bz (a) {
    return []
  }
  function bA (a, b, c, d, e) {
    var f = [[]],
      g = a.type
    if (g === 'MultiLineString') {
      for (var h = 1; h < a.coordinates.length; h++) f.push([])
    }
    G(a, function (a, d, e, g) {
      f[e].push(bB(a, b, c))
    })
    return f.length === 1 ? p(f[0]) : r(f)
  }
  function bB (a, b, c) {
    var d = I(a),
      e = [],
      f = [],
      g = null,
      h = d[1],
      i = null
    D(a, function (a, j) {
      if (j === 0) {
        var k = P(o(a), o(h)),
          l = bv('round', a, b, k, k, c)
        e = e.concat(l)
      } else if (j === d.length - 1) {
        g = d[j - 1]
        var m = P(o(a), o(g))
        i = bv('round', a, b, m, m, c)
      } else {
        g = d[j - 1]
        h = d[j + 1]
        var n = P(o(a), o(g)),
          p = P(o(a), o(h)),
          q = w(w(p) - w(n))
        if (q < 180) {
          var r = bu('round', a, b, p, n, c)
          e = e.concat(r)
          var s = br(a, h, -Math.abs(b)),
            t = br(g, a, -Math.abs(b)),
            u = bs(
              s[0][0],
              s[0][1],
              s[1][0],
              s[1][1],
              t[0][0],
              t[0][1],
              t[1][0],
              t[1][1]
            )
          f.push([u.x, u.y])
        } else {
          var v = br(a, h, b),
            x = br(g, a, b),
            y = bs(
              v[0][0],
              v[0][1],
              v[1][0],
              v[1][1],
              x[0][0],
              x[0][1],
              x[1][0],
              x[1][1]
            )
          e.push([y.x, y.y])
          var z = bu('round', a, b, n, p, c)
          f = f.concat(z.reverse())
        }
      }
    })
    e = e.concat(i)
    e = e.concat(f.reverse())
    e.push(e[0])
    return e
  }
  function bC (a, b, c) {
    var d = [],
      e = a.type,
      f = e === 'Polygon' ? [a.coordinates] : a.coordinates
    for (var g = 0; g < f.length; g++) {
      var h = []
      for (var i = 0; i < f[g].length; i++) {
        var j = f[g][i],
          k = i === 0,
          l = k ? b : bt(b),
          m = ab({ type: 'LineString', coordinates: j })
        h.push(bD(j, l, c, k, m))
      }
      d.push(h)
    }
    return d.length === 1 ? p(d[0]) : r(d)
  }
  function bD (a, b, c, d, e) {
    var f = a,
      g = [],
      h = d && !e
    if (h) {
      for (var i = 1; i < f.length; i++) {
        var j = f[i],
          k = f[i - 1],
          l = i === f.length - 1 ? f[1] : f[i + 1]
        g = bE(j, k, l, b, c, g)
      }
    } else {
      for (var m = f.length - 2; m >= 0; m--) {
        var n = f[m],
          o = f[m + 1],
          p = m === 0 ? f[f.length - 2] : f[m - 1]
        g = bE(n, o, p, b, c, g)
      }
    }
    g.push(g[0])
    return g
  }
  function bE (a, b, c, d, e, f) {
    var g = P(o(a), o(b)),
      h = P(o(a), o(c)),
      i = w(w(h) - w(g))
    if (i < 180 && d > 0) {
      var j = bu('round', a, d, h, g, e)
      f = f.concat(j)
    } else {
      var k = br(a, c, d),
        l = br(b, a, d),
        m = bs(
          k[0][0],
          k[0][1],
          k[1][0],
          k[1][1],
          l[0][0],
          l[0][1],
          l[1][0],
          l[1][1]
        )
      f.push([m.x, m.y])
    }
    return f
  }
  function bF (a, b, c) {
    return O(a, b, { steps: c, units: 'degrees' })
  }
  var bG = function c (a, b) {
    g(this, c)
    this.key = a
    this.data = b
    this.left = null
    this.right = null
  }
  function bH (a, b) {
    return a > b ? 1 : a < b ? -1 : 0
  }
  function bI (a, b, c) {
    if (b === null) return b
    var d,
      e,
      f,
      g = new bG()
    d = e = g
    while (!0) {
      var h = c(a, b.key)
      if (h < 0) {
        if (b.left === null) break
        if (c(a, b.left.key) < 0) {
          f = b.left
          b.left = f.right
          f.right = b
          b = f
          if (b.left === null) break
        }
        e.left = b
        e = b
        b = b.left
      } else if (h > 0) {
        if (b.right === null) break
        if (c(a, b.right.key) > 0) {
          f = b.right
          b.right = f.left
          f.left = b
          b = f
          if (b.right === null) break
        }
        d.right = b
        d = b
        b = b.right
      } else {
        break
      }
    }
    d.right = b.left
    e.left = b.right
    b.left = g.right
    b.right = g.left
    return b
  }
  function bJ (a, b, c, d, e) {
    var f = new bG(a, b)
    e._size++
    if (c === null) {
      f.left = f.right = null
      return f
    }
    c = bI(a, c, d)
    var g = d(a, c.key)
    g < 0
      ? ((f.left = c.left), (f.right = c), (c.left = null))
      : g >= 0 && ((f.right = c.right), (f.left = c), (c.right = null))
    return f
  }
  function bK (a, b, c, d, e) {
    var f = new bG(a, b)
    if (c === null) {
      f.left = f.right = null
      e._size++
      return f
    }
    c = bI(a, c, d)
    var g = d(a, c.key)
    if (g === 0) return c
    else {
      g < 0
        ? ((f.left = c.left), (f.right = c), (c.left = null))
        : g > 0 && ((f.right = c.right), (f.left = c), (c.right = null))
      e._size++
      return f
    }
  }
  function bL (a, b, c, d) {
    var e
    if (b === null) return null
    b = bI(a, b, c)
    var f = c(a, b.key)
    if (f === 0) {
      b.left === null
        ? (e = b.right)
        : ((e = bI(a, b.left, c)), (e.right = b.right))
      d._size--
      return e
    }
    return b
  }
  function bM (a, b, c) {
    var d, e
    if (b === null) d = e = null
    else {
      b = bI(a, b, c)
      var f = c(b.key, a)
      f === 0
        ? ((d = b.left), (e = b.right))
        : f < 0
        ? ((e = b.right), (b.right = null), (d = b))
        : ((d = b.left), (b.left = null), (e = b))
    }
    return { left: d, right: e }
  }
  function bN (a, b, c) {
    if (b === null) return a
    if (a === null) return b
    b = bI(a.key, b, c)
    b.left = a
    return b
  }
  function bO (a, b, c, d, e) {
    if (a) {
      d(
        ''
          .concat(b)
          .concat(c ? '└── ' : '├── ')
          .concat(e(a), '\n')
      )
      var f = b + (c ? '    ' : '│   ')
      a.left && bO(a.left, f, !1, d, e)
      a.right && bO(a.right, f, !0, d, e)
    }
  }
  var bP = (function () {
    function a () {
      var b =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : bH
      g(this, a)
      this._comparator = b
      this._root = null
      this._size = 0
    }
    j(a, [
      {
        key: 'insert',
        value: function c (a, b) {
          return (this._root = bJ(a, b, this._root, this._comparator, this))
        }
      },
      {
        key: 'add',
        value: function c (a, b) {
          return (this._root = bK(a, b, this._root, this._comparator, this))
        }
      },
      {
        key: 'remove',
        value: function b (a) {
          this._root = bL(a, this._root, this._comparator, this)
        }
      },
      {
        key: 'pop',
        value: function a () {
          var b = this._root
          if (b) {
            while (b.left) b = b.left
            this._root = bI(b.key, this._root, this._comparator)
            this._root = bL(b.key, this._root, this._comparator, this)
            return { key: b.key, data: b.data }
          }
          return null
        }
      },
      {
        key: 'findStatic',
        value: function b (a) {
          var c = this._root,
            d = this._comparator
          while (c) {
            var e = d(a, c.key)
            if (e === 0) return c
            else e < 0 ? (c = c.left) : (c = c.right)
          }
          return null
        }
      },
      {
        key: 'find',
        value: function b (a) {
          if (this._root) {
            this._root = bI(a, this._root, this._comparator)
            if (this._comparator(a, this._root.key) !== 0) return null
          }
          return this._root
        }
      },
      {
        key: 'contains',
        value: function b (a) {
          var c = this._root,
            d = this._comparator
          while (c) {
            var e = d(a, c.key)
            if (e === 0) return !0
            else e < 0 ? (c = c.left) : (c = c.right)
          }
          return !1
        }
      },
      {
        key: 'forEach',
        value: function c (a, b) {
          var d = this._root,
            e = [],
            f = !1
          while (!f)
            d !== null
              ? (e.push(d), (d = d.left))
              : e.length !== 0
              ? ((d = e.pop()), a.call(b, d), (d = d.right))
              : (f = !0)
          return this
        }
      },
      {
        key: 'range',
        value: function e (a, b, c, d) {
          var f = [],
            g = this._comparator,
            h = this._root,
            i
          while (f.length !== 0 || h) {
            if (h) f.push(h), (h = h.left)
            else {
              h = f.pop()
              i = g(h.key, b)
              if (i > 0) {
                break
              } else if (g(h.key, a) >= 0) {
                if (c.call(d, h)) return this
              }
              h = h.right
            }
          }
          return this
        }
      },
      {
        key: 'keys',
        value: function () {
          var a = []
          this.forEach(function (b) {
            var c = b.key
            return a.push(c)
          })
          return a
        }
      },
      {
        key: 'values',
        value: function () {
          var a = []
          this.forEach(function (b) {
            var c = b.data
            return a.push(c)
          })
          return a
        }
      },
      {
        key: 'min',
        value: function a () {
          if (this._root) return this.minNode(this._root).key
          return null
        }
      },
      {
        key: 'max',
        value: function a () {
          if (this._root) return this.maxNode(this._root).key
          return null
        }
      },
      {
        key: 'minNode',
        value: function a () {
          var b =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : this._root
          if (b) while (b.left) b = b.left
          return b
        }
      },
      {
        key: 'maxNode',
        value: function a () {
          var b =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : this._root
          if (b) while (b.right) b = b.right
          return b
        }
      },
      {
        key: 'at',
        value: function b (a) {
          var c = this._root,
            d = !1,
            e = 0,
            f = []
          while (!d) {
            if (c) f.push(c), (c = c.left)
            else {
              if (f.length > 0) {
                c = f.pop()
                if (e === a) return c
                e++
                c = c.right
              } else d = !0
            }
          }
          return null
        }
      },
      {
        key: 'next',
        value: function b (a) {
          var c = this._root,
            d = null
          if (a.right) {
            d = a.right
            while (d.left) d = d.left
            return d
          }
          var e = this._comparator
          while (c) {
            var f = e(a.key, c.key)
            if (f === 0) break
            else f < 0 ? ((d = c), (c = c.left)) : (c = c.right)
          }
          return d
        }
      },
      {
        key: 'prev',
        value: function b (a) {
          var c = this._root,
            d = null
          if (a.left !== null) {
            d = a.left
            while (d.right) d = d.right
            return d
          }
          var e = this._comparator
          while (c) {
            var f = e(a.key, c.key)
            if (f === 0) break
            else f < 0 ? (c = c.left) : ((d = c), (c = c.right))
          }
          return d
        }
      },
      {
        key: 'clear',
        value: function a () {
          this._root = null
          this._size = 0
          return this
        }
      },
      {
        key: 'toList',
        value: function a () {
          return bS(this._root)
        }
      },
      {
        key: 'load',
        value: function a () {
          var b =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : [],
            c =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : [],
            d =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : !1,
            e = b.length,
            f = this._comparator
          d && bV(b, c, 0, e - 1, f)
          if (this._root === null)
            (this._root = bQ(this._root, b, c, 0, e)), (this._size = e)
          else {
            var g = bU(this.toList(), bR(b, c), f)
            e = this._size + e
            this._root = bT({ head: g }, 0, e)
          }
          return this
        }
      },
      {
        key: 'isEmpty',
        value: function a () {
          return this._root === null
        }
      },
      {
        key: 'toString',
        value: function a () {
          var b =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : function (a) {
                    return a.key
                  },
            c = []
          bO(
            this._root,
            '',
            !0,
            function (a) {
              return c.push(a)
            },
            b
          )
          return c.join('')
        }
      },
      {
        key: 'update',
        value: function d (a, b, c) {
          var e = this._comparator,
            f = bM(a, this._root, e),
            g = f.left,
            h = f.right
          this._size--
          e(a, b) < 0 ? (h = bJ(b, c, h, e, this)) : (g = bJ(b, c, g, e, this))
          this._root = bN(g, h, e)
        }
      },
      {
        key: 'split',
        value: function b (a) {
          return bM(a, this._root, this._comparator)
        }
      },
      {
        key: 'size',
        get: function a () {
          return this._size
        }
      }
    ])
    return a
  })()
  function bQ (a, b, c, d, e) {
    var f = e - d
    if (f > 0) {
      var g = d + Math.floor(f / 2),
        h = b[g],
        i = c[g],
        j = { key: h, data: i, parent: a }
      j.left = bQ(j, b, c, d, g)
      j.right = bQ(j, b, c, g + 1, e)
      return j
    }
    return null
  }
  function bR (a, b) {
    var c = { next: null },
      d = c
    for (var e = 0; e < a.length; e++) d = d.next = { key: a[e], data: b[e] }
    d.next = null
    return c.next
  }
  function bS (a) {
    var b = a,
      c = [],
      d = !1,
      e = { next: null },
      f = e
    while (!d)
      b
        ? (c.push(b), (b = b.left))
        : c.length > 0
        ? ((b = f = f.next = c.pop()), (b = b.right))
        : (d = !0)
    f.next = null
    return e.next
  }
  function bT (a, b, c) {
    var d = c - b
    if (d > 0) {
      var e = b + Math.floor(d / 2),
        f = bT(a, b, e),
        g = a.head
      g.left = f
      a.head = a.head.next
      g.right = bT(a, e + 1, c)
      return g
    }
    return null
  }
  function bU (c, d) {
    var e =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : function (a, b) {
              return a - b
            },
      f = {},
      g = f,
      h = c,
      i = d
    while (h !== null && i !== null)
      e(h.key, i.key) < 0
        ? ((g.next = h), (h = h.next))
        : ((g.next = i), (i = i.next)),
        (g = g.next)
    h !== null ? (g.next = h) : i !== null && (g.next = i)
    return f.next
  }
  function bV (a, b, c, d, e) {
    if (c >= d) return
    var f = a[(c + d) >> 1],
      g = c - 1,
      h = d + 1
    while (!0) {
      do {
        g++
      } while (e(a[g], f) < 0)
      do {
        h--
      } while (e(a[h], f) > 0)
      if (g >= h) break
      var i = a[g]
      a[g] = a[h]
      a[h] = i
      i = b[g]
      b[g] = b[h]
      b[h] = i
    }
    bV(a, b, c, h, e)
    bV(a, b, h + 1, d, e)
  }
  function bW (a, b) {
    if (!(a instanceof b)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }
  function bX (a, b) {
    for (var c = 0; c < b.length; c++) {
      var d = b[c]
      d.enumerable = d.enumerable || !1
      d.configurable = !0
      'value' in d && (d.writable = !0)
      Object.defineProperty(a, d.key, d)
    }
  }
  function bY (a, b, c) {
    b && bX(a.prototype, b)
    c && bX(a, c)
    return a
  }
  var bZ = Number.EPSILON
  bZ === undefined && (bZ = Math.pow(2, -52))
  var b_ = bZ * bZ,
    b$ = function c (a, b) {
      if (-bZ < a && a < bZ) {
        if (-bZ < b && b < bZ) {
          return 0
        }
      }
      if ((a - b) * (a - b) < b_ * a * b) {
        return 0
      }
      return a < b ? -1 : 1
    },
    ca = function c (a, b) {
      if (a === b) return 0
      var d = a.x,
        e = b.x
      if (d <= -bZ || bZ <= d || e <= -bZ || bZ <= e) {
        var f = d - e
        if (f * f >= b_ * d * e) {
          return d < e ? -1 : 1
        }
      }
      d = a.y
      e = b.y
      if (d <= -bZ || bZ <= d || e <= -bZ || bZ <= e) {
        var g = d - e
        if (g * g >= b_ * d * e) {
          return d < e ? -1 : 1
        }
      }
      return 0
    },
    cb = function c (a, b) {
      var d = (a + b) / 2
      return b$(d, a) === 0 || b$(d, b) === 0
    },
    cc = function c (a, b) {
      var d = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      return ca(d, a) === 0 || ca(d, b) === 0
    },
    cd = function c (a, b) {
      return a.x * b.y - a.y * b.x
    },
    ce = function c (a, b) {
      return a.x * b.x + a.y * b.y
    },
    cf = function d (a, b, c) {
      var e = { x: b.x - a.x, y: b.y - a.y },
        f = { x: c.x - a.x, y: c.y - a.y },
        g = cd(e, f)
      return b$(g, 0)
    },
    cg = function b (a) {
      return Math.sqrt(ce(a, a))
    },
    ch = function d (a, b, c) {
      var e = { x: b.x - a.x, y: b.y - a.y },
        f = { x: c.x - a.x, y: c.y - a.y }
      return cd(f, e) / cg(f) / cg(e)
    },
    ci = function d (a, b, c) {
      var e = { x: b.x - a.x, y: b.y - a.y },
        f = { x: c.x - a.x, y: c.y - a.y }
      return ce(f, e) / cg(f) / cg(e)
    },
    cj = function d (a, b, c) {
      if (b.x === 0) return { x: a.x, y: c.y }
      if (b.y === 0) return { x: c.x, y: a.y }
      var e = { x: c.x - a.x, y: c.y - a.y },
        f = ce(b, e) / ce(b, b)
      return { x: a.x + f * b.x, y: a.y + f * b.y }
    },
    ck = function d (a, b, c) {
      if (b.y === 0) return null
      return { x: a.x + (b.x / b.y) * (c - a.y), y: c }
    },
    cl = function d (a, b, c) {
      if (b.x === 0) return null
      return { x: c, y: a.y + (b.y / b.x) * (c - a.x) }
    },
    cm = function e (a, b, c, d) {
      if (b.x === 0) return cl(c, d, a.x)
      if (d.x === 0) return cl(a, b, c.x)
      if (b.y === 0) return ck(c, d, a.y)
      if (d.y === 0) return ck(a, b, c.y)
      var f = cd(b, d)
      if (f == 0) return null
      var g = { x: c.x - a.x, y: c.y - a.y },
        h = cd(g, b) / f,
        i = cd(g, d) / f,
        j = a.x + i * b.x,
        k = c.x + h * d.x,
        l = a.y + i * b.y,
        m = c.y + h * d.y,
        n = (j + k) / 2,
        o = (l + m) / 2
      return { x: n, y: o }
    },
    cn = function b (a) {
      var c = []
      if (!Array.isArray(a)) {
        throw new Error('Input is not a Polygon or MultiPolygon')
      }
      for (var d = 0, e = a.length; d < e; d++) {
        if (!Array.isArray(a[d]) || a[d].length == 0) {
          throw new Error('Input is not a Polygon or MultiPolygon')
        }
        c.push([])
        for (var f = 0, g = a[d].length; f < g; f++) {
          if (!Array.isArray(a[d][f]) || a[d][f].length == 0) {
            throw new Error('Input is not a Polygon or MultiPolygon')
          }
          if (Array.isArray(a[d][f][0])) {
            c[d].push([])
            for (var h = 0, i = a[d][f].length; h < i; h++) {
              if (!Array.isArray(a[d][f][h]) || a[d][f][h].length < 2) {
                throw new Error('Input is not a Polygon or MultiPolygon')
              }
              if (a[d][f][h].length > 2) {
                throw new Error(
                  'Input has more than two coordinates. Only 2-dimensional polygons supported.'
                )
              }
              c[d][f].push({ x: a[d][f][h][0], y: a[d][f][h][1] })
            }
          } else {
            if (a[d][f].length < 2) {
              throw new Error('Input is not a Polygon or MultiPolygon')
            }
            if (a[d][f].length > 2) {
              throw new Error(
                'Input has more than two coordinates. Only 2-dimensional polygons supported.'
              )
            }
            c[d].push({ x: a[d][f][0], y: a[d][f][1] })
          }
        }
      }
      return c
    },
    co = function b (a) {
      if (Array.isArray(a)) {
        if (a.length === 0) return
        if (Array.isArray(a[0])) {
          if (Array.isArray(a[0][0])) {
            if (
              typeof a[0][0][0].x === 'number' &&
              typeof a[0][0][0].y === 'number'
            ) {
              return
            }
          }
          if (typeof a[0][0].x === 'number' && typeof a[0][0].y === 'number') {
            a.unshift(a.splice(0))
            return
          }
        }
      }
      throw new Error('Unrecognized input - not a polygon nor multipolygon')
    },
    cp = function b (a) {
      var c = 0
      while (c < a.length) {
        var d = a[c]
        if (d.length === 0) {
          a.splice(c, 1)
          continue
        }
        var e = d[0]
        cq(e)
        if (e.length === 0) {
          a.splice(c, 1)
          continue
        }
        var f = 1
        while (f < d.length) {
          var g = d[f]
          cq(g)
          g.length === 0 ? d.splice(f, 1) : f++
        }
        c++
      }
    },
    cq = function b (a) {
      if (a.length === 0) return
      ca(a[0], a[a.length - 1]) === 0 && a.pop()
      var c = function d (a, b, c) {
          return ca(a, b) === 0 || ca(b, c) === 0 || cf(b, a, c) === 0
        },
        d = 0,
        e,
        f
      while (d < a.length)
        (e = d === 0 ? a[a.length - 1] : a[d - 1]),
          (f = d === a.length - 1 ? a[0] : a[d + 1]),
          c(e, a[d], f) ? a.splice(d, 1) : d++
      while (a.length < 3 && a.length > 0) a.pop()
    },
    cr = 0,
    cs = (function () {
      bY(c, null, [
        {
          key: 'compare',
          value: function c (a, b) {
            if (a.point !== b.point) {
              var d = b$(a.point.x, b.point.x)
              if (d !== 0) return d
              var e = b$(a.point.y, b.point.y)
              if (e !== 0) return e
              a.link(b)
            }
            if (a.isLeft !== b.isLeft) return a.isLeft ? 1 : -1
            if (a === b) return 0
            var f = a,
              g = b
            while (f.consumedBy) f = f.consumedBy
            while (g.consumedBy) g = g.consumedBy
            if (f !== g) {
              var h = a.segment.isVertical(),
                i = b.segment.isVertical()
              if (h && !i) return a.isLeft ? 1 : -1
              if (!h && i) return a.isLeft ? -1 : 1
              var j = a.segment.compareVertically(b.otherSE.point)
              if (j === 1) return -1
              if (j === -1) return 1
              var k = b.segment.compareVertically(a.otherSE.point)
              if (k !== 0) return k
            }
            if (a.id < b.id) return -1
            if (a.id > b.id) return 1
            throw new Error(
              'SweepEvent comparison failed at ['
                .concat(a.point.x, ', ')
                .concat(a.point.y, ']')
            )
          }
        }
      ])
      function c (a, b) {
        bW(this, c)
        a.events === undefined ? (a.events = [this]) : a.events.push(this)
        this.point = a
        this.isLeft = b
        this.id = ++cr
      }
      bY(c, [
        {
          key: 'link',
          value: function b (a) {
            if (a.point === this.point) {
              throw new Error('Tried to link already linked events')
            }
            var c = a.point.events
            for (var d = 0, e = c.length; d < e; d++) {
              var f = c[d]
              this.point.events.push(f)
              f.point = this.point
            }
            this.segment.checkForConsuming()
            a.segment.checkForConsuming()
          }
        },
        {
          key: 'getAvailableLinkedEvents',
          value: function a () {
            var b = []
            for (var c = 0, d = this.point.events.length; c < d; c++) {
              var e = this.point.events[c]
              e !== this &&
                !e.segment.ringOut &&
                e.segment.isInResult() &&
                b.push(e)
            }
            return b
          }
        },
        {
          key: 'getLeftmostComparator',
          value: function d (c) {
            var e = this,
              f = new Map(),
              g = function b (a) {
                var d = a.otherSE
                f.set(a, {
                  sine: ch(e.point, c.point, d.point),
                  cosine: ci(e.point, c.point, d.point)
                })
              }
            return function (a, b) {
              f.has(a) || g(a)
              f.has(b) || g(b)
              var c = f.get(a),
                d = c.sine,
                e = c.cosine,
                h = f.get(b),
                i = h.sine,
                j = h.cosine,
                k = b$(d, 0),
                l = b$(i, 0)
              if (k >= 0 && l >= 0) return b$(j, e)
              if (k < 0 && l < 0) return b$(e, j)
              return b$(i, d)
            }
          }
        }
      ])
      return c
    })(),
    ct = function c (a, b) {
      return (
        b$(a.ll.x, b.x) <= 0 &&
        b$(b.x, a.ur.x) <= 0 &&
        b$(a.ll.y, b.y) <= 0 &&
        b$(b.y, a.ur.y) <= 0
      )
    },
    cu = function c (a, b) {
      return (
        (b$(a.ll.x, b.x) <= 0 || cb(a.ll.x, b.x)) &&
        (b$(b.x, a.ur.x) <= 0 || cb(b.x, a.ur.x)) &&
        (b$(a.ll.y, b.y) <= 0 || cb(a.ll.y, b.y)) &&
        (b$(b.y, a.ur.y) <= 0 || cb(b.y, a.ur.y))
      )
    },
    cv = function c (a, b) {
      if (
        b$(b.ur.x, a.ll.x) < 0 ||
        b$(a.ur.x, b.ll.x) < 0 ||
        b$(b.ur.y, a.ll.y) < 0 ||
        b$(a.ur.y, b.ll.y) < 0
      )
        return null
      var d = a.ll.x < b.ll.x ? b.ll.x : a.ll.x,
        e = a.ur.x < b.ur.x ? a.ur.x : b.ur.x,
        f = a.ll.y < b.ll.y ? b.ll.y : a.ll.y,
        g = a.ur.y < b.ur.y ? a.ur.y : b.ur.y
      return { ll: { x: d, y: f }, ur: { x: e, y: g } }
    },
    cw = (function () {
      bY(c, null, [
        {
          key: 'compare',
          value: function c (a, b) {
            var d = a.leftSE.point.x,
              e = a.leftSE.point.y,
              f = b.leftSE.point.x,
              g = b.leftSE.point.y,
              h = a.rightSE.point.x,
              i = b.rightSE.point.x
            if (b$(i, d) < 0) return 1
            if (b$(h, f) < 0) return -1
            var j = a,
              k = b
            while (j.consumedBy) j = j.consumedBy
            while (k.consumedBy) k = k.consumedBy
            var l, m, n, o
            if (j === k) {
              if (a === b) return 0
              var p = a.leftSE.id,
                q = b.leftSE.id
              if (p < q) return -1
              if (p > q) return 1
            } else if (
              (l = a.comparePoint(b.leftSE.point)) === 0 &&
              (m = a.comparePoint(b.rightSE.point)) === 0 &&
              (n = b.comparePoint(a.leftSE.point)) === 0 &&
              (o = b.comparePoint(a.rightSE.point)) === 0
            ) {
              var r = b$(d, f)
              if (r !== 0) return r
              var s = a.leftSE.id,
                t = b.leftSE.id
              if (s < t) return -1
              if (s > t) return 1
            } else {
              var u = b$(d, f)
              if (u < 0) {
                if (l > 0) return -1
                if (l < 0) return 1
              }
              if (u > 0) {
                n === undefined && (n = b.comparePoint(a.leftSE.point))
                if (n !== 0) return n
              }
              var v = b$(e, g)
              if (v !== 0) return v
              var w = a.isVertical()
              if (w !== b.isVertical()) return w ? 1 : -1
              m === undefined && (m = a.comparePoint(b.rightSE.point))
              if (m > 0) return -1
              if (m < 0) return 1
              o === undefined && (o = b.comparePoint(a.rightSE.point))
              if (o !== 0) return o
            }
            throw new Error(
              'Segment comparison of ' +
                '['
                  .concat(a.leftSE.point.x, ', ')
                  .concat(a.leftSE.point.y, '] -> [')
                  .concat(a.rightSE.point.x, ', ')
                  .concat(a.rightSE.point.y, '] ') +
                'against ' +
                '['
                  .concat(b.leftSE.point.x, ', ')
                  .concat(b.leftSE.point.y, '] -> [')
                  .concat(b.rightSE.point.x, ', ')
                  .concat(b.rightSE.point.y, '] ') +
                'failed. Please submit a bug report.'
            )
          }
        }
      ])
      function c (a, b, d) {
        bW(this, c)
        this.leftSE = a
        a.segment = this
        a.otherSE = b
        this.rightSE = b
        b.segment = this
        b.otherSE = a
        this.ringsIn = d
        this._cache = {}
      }
      bY(
        c,
        [
          {
            key: 'replaceRightSE',
            value: function b (a) {
              this.rightSE = a
              this.rightSE.segment = this
              this.rightSE.otherSE = this.leftSE
              this.leftSE.otherSE = this.rightSE
            }
          },
          {
            key: 'bbox',
            value: function a () {
              var b = this.leftSE.point.y,
                c = this.rightSE.point.y
              return {
                ll: { x: this.leftSE.point.x, y: b < c ? b : c },
                ur: { x: this.rightSE.point.x, y: b > c ? b : c }
              }
            }
          },
          {
            key: 'vector',
            value: function a () {
              return {
                x: this.rightSE.point.x - this.leftSE.point.x,
                y: this.rightSE.point.y - this.leftSE.point.y
              }
            }
          },
          {
            key: 'isVertical',
            value: function a () {
              return b$(this.leftSE.point.x, this.rightSE.point.x) === 0
            }
          },
          {
            key: 'isAnEndpoint',
            value: function b (a) {
              return (
                ca(a, this.leftSE.point) === 0 ||
                ca(a, this.rightSE.point) === 0
              )
            }
          },
          {
            key: 'comparePoint',
            value: function b (a) {
              if (this.isAnEndpoint(a)) return 0
              var c = cj(this.leftSE.point, this.vector(), a),
                d = b$(a.y, c.y)
              if (d !== 0) return d
              var e = b$(a.x, c.x),
                f = b$(this.leftSE.point.y, this.rightSE.point.y)
              if (e > 0) return f
              if (e < 0) {
                if (f > 0) return -1
                if (f < 0) return 1
              }
              return 0
            }
          },
          {
            key: 'compareVertically',
            value: function b (a) {
              if (this.isAnEndpoint(a)) return 0
              var c = cl(this.leftSE.point, this.vector(), a.x)
              if (c !== null) {
                if (a.y < c.y) return -1
                if (a.y > c.y) return 1
              }
              return 0
            }
          },
          {
            key: 'touches',
            value: function b (a) {
              if (!cu(this.bbox(), a)) return !1
              var c = cj(this.leftSE.point, this.vector(), a),
                d = { x: (c.x + a.x) / 2, y: (c.y + a.y) / 2 }
              return cc(d, c) || cc(d, a)
            }
          },
          {
            key: 'getIntersection',
            value: function b (a) {
              var c = cv(this.bbox(), a.bbox())
              if (c === null) return null
              var d = this.touches(a.leftSE.point),
                e = a.touches(this.leftSE.point),
                f = this.touches(a.rightSE.point),
                g = a.touches(this.rightSE.point)
              if (e && d) {
                if (g && !f) return this.rightSE.point
                if (!g && f) return a.rightSE.point
                return null
              }
              if (e) {
                if (f && ca(this.leftSE.point, a.rightSE.point) === 0)
                  return null
                return this.leftSE.point
              }
              if (d) {
                if (g && ca(this.rightSE.point, a.leftSE.point) === 0)
                  return null
                return a.leftSE.point
              }
              if (g && f) return null
              if (g) return this.rightSE.point
              if (f) return a.rightSE.point
              var h = cm(
                this.leftSE.point,
                this.vector(),
                a.leftSE.point,
                a.vector()
              )
              if (h === null) return null
              if (!ct(c, h)) return null
              return h
            }
          },
          {
            key: 'split',
            value: function b (a) {
              a.sort(ca)
              var d = this,
                e = null,
                f = []
              for (var g = 0, h = a.length; g < h; g++) {
                var i = a[g]
                if (e && ca(e, i) === 0) continue
                var j = i.events !== undefined,
                  k = new cs(i, !0),
                  l = new cs(i, !1),
                  m = d.rightSE
                d.replaceRightSE(l)
                f.push(l)
                f.push(k)
                d = new c(k, m, d.ringsIn.slice())
                j &&
                  (k.segment.checkForConsuming(), l.segment.checkForConsuming())
                e = i
              }
              return f
            }
          },
          {
            key: 'checkForConsuming',
            value: function a () {
              if (this.leftSE.point.events.length === 1) return
              if (this.rightSE.point.events.length === 1) return
              for (var b = 0, c = this.leftSE.point.events.length; b < c; b++) {
                var d = this.leftSE.point.events[b]
                if (d === this.leftSE) continue
                for (
                  var e = 0, f = this.rightSE.point.events.length;
                  e < f;
                  e++
                ) {
                  var g = this.rightSE.point.events[e]
                  if (g === this.rightSE) continue
                  d.segment === g.segment && this.consume(d.segment)
                }
              }
            }
          },
          {
            key: 'consume',
            value: function b (a) {
              var d = this,
                e = a
              while (d.consumedBy) d = d.consumedBy
              while (e.consumedBy) e = e.consumedBy
              var f = c.compare(d, e)
              if (f === 0) return
              if (f > 0) {
                var g = d
                d = e
                e = g
              }
              if (d.prev === e) {
                var h = d
                d = e
                e = h
              }
              for (var i = 0, j = e.ringsIn.length; i < j; i++)
                d.ringsIn.push(e.ringsIn[i])
              e.ringsIn = null
              e.consumedBy = d
              e.leftSE.consumedBy = d.leftSE
              e.rightSE.consumedBy = d.rightSE
            }
          },
          {
            key: 'prevInResult',
            value: function a () {
              var b = 'prevInResult'
              this._cache[b] === undefined &&
                (this._cache[b] = this['_'.concat(b)]())
              return this._cache[b]
            }
          },
          {
            key: '_prevInResult',
            value: function a () {
              if (!this.prev) return null
              if (this.prev.isInResult()) return this.prev
              return this.prev.prevInResult()
            }
          },
          {
            key: 'ringsBefore',
            value: function a () {
              var b = 'ringsBefore'
              this._cache[b] === undefined &&
                (this._cache[b] = this['_'.concat(b)]())
              return this._cache[b]
            }
          },
          {
            key: '_ringsBefore',
            value: function a () {
              if (!this.prev) return []
              return (this.prev.consumedBy || this.prev).ringsAfter()
            }
          },
          {
            key: 'ringsAfter',
            value: function a () {
              var b = 'ringsAfter'
              this._cache[b] === undefined &&
                (this._cache[b] = this['_'.concat(b)]())
              return this._cache[b]
            }
          },
          {
            key: '_ringsAfter',
            value: function a () {
              var b = this.ringsBefore().slice(0)
              for (var c = 0, d = this.ringsIn.length; c < d; c++) {
                var e = this.ringsIn[c],
                  f = b.indexOf(e)
                f === -1 ? b.push(e) : b.splice(f, 1)
              }
              return b
            }
          },
          {
            key: 'multiPolysBefore',
            value: function a () {
              var b = 'multiPolysBefore'
              this._cache[b] === undefined &&
                (this._cache[b] = this['_'.concat(b)]())
              return this._cache[b]
            }
          },
          {
            key: '_multiPolysBefore',
            value: function a () {
              if (!this.prev) return []
              return (this.prev.consumedBy || this.prev).multiPolysAfter()
            }
          },
          {
            key: 'multiPolysAfter',
            value: function a () {
              var b = 'multiPolysAfter'
              this._cache[b] === undefined &&
                (this._cache[b] = this['_'.concat(b)]())
              return this._cache[b]
            }
          },
          {
            key: '_multiPolysAfter',
            value: function a () {
              var b = [],
                c = [],
                d = this.ringsAfter()
              for (var e = 0, f = d.length; e < f; e++) {
                var g = d[e],
                  h = g.poly
                if (c.indexOf(h) !== -1) continue
                if (g.isExterior) b.push(h)
                else {
                  c.indexOf(h) === -1 && c.push(h)
                  var i = b.indexOf(g.poly)
                  i !== -1 && b.splice(i, 1)
                }
              }
              var j = []
              for (var k = 0, l = b.length; k < l; k++) {
                var m = b[k].multiPoly
                j.indexOf(m) === -1 && j.push(m)
              }
              return j
            }
          },
          {
            key: 'isInResult',
            value: function a () {
              var b = 'isInResult'
              this._cache[b] === undefined &&
                (this._cache[b] = this['_'.concat(b)]())
              return this._cache[b]
            }
          },
          {
            key: '_isInResult',
            value: function a () {
              if (this.consumedBy) return !1
              var b = this.multiPolysBefore(),
                c = this.multiPolysAfter()
              switch (cF.type) {
                case 'union': {
                  var h = b.length === 0,
                    i = c.length === 0
                  return h !== i
                }
                case 'intersection': {
                  var f, g
                  b.length < c.length
                    ? ((f = b.length), (g = c.length))
                    : ((f = c.length), (g = b.length))
                  return g === cF.numMultiPolys && f < g
                }
                case 'xor': {
                  var e = Math.abs(b.length - c.length)
                  return e % 2 === 1
                }
                case 'difference': {
                  var d = function b (a) {
                    return a.length === 1 && a[0].isSubject
                  }
                  return d(b) !== d(c)
                }
                default:
                  throw new Error(
                    'Unrecognized operation type found '.concat(cF.type)
                  )
              }
            }
          }
        ],
        [
          {
            key: 'fromRing',
            value: function e (a, b, d) {
              var f,
                g,
                h = ca(a, b)
              if (h < 0) (f = new cs(a, !0)), (g = new cs(b, !1))
              else if (h > 0) (f = new cs(b, !0)), (g = new cs(a, !1))
              else {
                throw new Error(
                  'Tried to create degenerate segment at ['
                    .concat(a.x, ', ')
                    .concat(b.y, ']')
                )
              }
              return new c(f, g, [d])
            }
          }
        ]
      )
      return c
    })(),
    cx = (function () {
      function a (b, c, d) {
        bW(this, a)
        this.poly = c
        this.isExterior = d
        this.segments = []
        var e = b[0]
        for (var f = 1, g = b.length; f < g; f++) {
          var h = b[f]
          this.segments.push(cw.fromRing(e, h, this))
          e = h
        }
        this.segments.push(cw.fromRing(e, b[0], this))
      }
      bY(a, [
        {
          key: 'getSweepEvents',
          value: function a () {
            var b = []
            for (var c = 0, d = this.segments.length; c < d; c++) {
              var e = this.segments[c]
              b.push(e.leftSE)
              b.push(e.rightSE)
            }
            return b
          }
        }
      ])
      return a
    })(),
    cy = (function () {
      function a (b, c) {
        bW(this, a)
        this.exteriorRing = new cx(b[0], this, !0)
        this.interiorRings = []
        for (var d = 1, e = b.length; d < e; d++)
          this.interiorRings.push(new cx(b[d], this, !1))
        this.multiPoly = c
      }
      bY(a, [
        {
          key: 'getSweepEvents',
          value: function a () {
            var b = this.exteriorRing.getSweepEvents()
            for (var c = 0, d = this.interiorRings.length; c < d; c++) {
              var e = this.interiorRings[c].getSweepEvents()
              for (var f = 0, g = e.length; f < g; f++) b.push(e[f])
            }
            return b
          }
        }
      ])
      return a
    })(),
    cz = (function () {
      function a (b) {
        bW(this, a)
        this.polys = []
        for (var c = 0, d = b.length; c < d; c++)
          this.polys.push(new cy(b[c], this))
        this.isSubject = !1
      }
      bY(a, [
        {
          key: 'markAsSubject',
          value: function a () {
            this.isSubject = !0
          }
        },
        {
          key: 'getSweepEvents',
          value: function a () {
            var b = []
            for (var c = 0, d = this.polys.length; c < d; c++) {
              var e = this.polys[c].getSweepEvents()
              for (var f = 0, g = e.length; f < g; f++) b.push(e[f])
            }
            return b
          }
        }
      ])
      return a
    })(),
    cA = (function () {
      bY(a, null, [
        {
          key: 'factory',
          value: function c (b) {
            var d = []
            for (var e = 0, f = b.length; e < f; e++) {
              var g = b[e]
              if (!g.isInResult() || g.ringOut) continue
              var h = null,
                i = g.leftSE,
                j = g.rightSE,
                k = [i],
                l = i.point,
                m = []
              while (!0) {
                h = i
                i = j
                k.push(i)
                if (i.point === l) break
                while (!0) {
                  var n = i.getAvailableLinkedEvents()
                  if (n.length === 0) {
                    var o = k[0].point,
                      p = k[k.length - 1].point
                    throw new Error(
                      'Unable to complete output ring starting at ['.concat(
                        o.x,
                        ','
                      ) +
                        ' '.concat(
                          o.y,
                          ']. Last matching segment found ends at'
                        ) +
                        ' ['.concat(p.x, ', ').concat(p.y, '].')
                    )
                  }
                  if (n.length === 1) {
                    j = n[0].otherSE
                    break
                  }
                  var q = null
                  for (var r = 0, s = m.length; r < s; r++) {
                    if (m[r].point === i.point) {
                      q = r
                      break
                    }
                  }
                  if (q !== null) {
                    var t = m.splice(q)[0],
                      u = k.splice(t.index)
                    u.unshift(u[0].otherSE)
                    d.push(new a(u.reverse()))
                    continue
                  }
                  m.push({ index: k.length, point: i.point })
                  var v = i.getLeftmostComparator(h)
                  j = n.sort(v)[0].otherSE
                  break
                }
              }
              d.push(new a(k))
            }
            return d
          }
        }
      ])
      function a (b) {
        bW(this, a)
        this.events = b
        for (var c = 0, d = b.length; c < d; c++) b[c].segment.ringOut = this
        this.poly = null
      }
      bY(a, [
        {
          key: 'getGeom',
          value: function a () {
            var b = this.events[0].point,
              c = [b]
            for (var d = 1, e = this.events.length - 1; d < e; d++) {
              var f = this.events[d].point,
                g = this.events[d + 1].point
              if (cf(f, b, g) === 0) continue
              c.push(f)
              b = f
            }
            if (c.length === 1) return null
            var h = c[0],
              i = c[1]
            cf(h, b, i) === 0 && c.shift()
            c.push(c[0])
            var j = this.isExteriorRing() ? 1 : -1,
              k = this.isExteriorRing() ? 0 : c.length - 1,
              l = this.isExteriorRing() ? c.length : -1,
              m = []
            for (var n = k; n != l; n += j) m.push([c[n].x, c[n].y])
            return m
          }
        },
        {
          key: 'isExteriorRing',
          value: function a () {
            if (this._isExteriorRing === undefined) {
              var b = this.enclosingRing()
              this._isExteriorRing = b ? !b.isExteriorRing() : !0
            }
            return this._isExteriorRing
          }
        },
        {
          key: 'enclosingRing',
          value: function a () {
            this._enclosingRing === undefined &&
              (this._enclosingRing = this._calcEnclosingRing())
            return this._enclosingRing
          }
        },
        {
          key: '_calcEnclosingRing',
          value: function a () {
            var b = this.events[0]
            for (var c = 1, d = this.events.length; c < d; c++) {
              var e = this.events[c]
              cs.compare(b, e) > 0 && (b = e)
            }
            var f = b.segment.prevInResult(),
              g = f ? f.prevInResult() : null
            while (!0) {
              if (!f) return null
              if (!g) return f.ringOut
              if (g.ringOut !== f.ringOut) {
                if (g.ringOut.enclosingRing() !== f.ringOut) {
                  return f.ringOut
                } else return f.ringOut.enclosingRing()
              }
              f = g.prevInResult()
              g = f ? f.prevInResult() : null
            }
          }
        }
      ])
      return a
    })(),
    cB = (function () {
      function a (b) {
        bW(this, a)
        this.exteriorRing = b
        b.poly = this
        this.interiorRings = []
      }
      bY(a, [
        {
          key: 'addInterior',
          value: function b (a) {
            this.interiorRings.push(a)
            a.poly = this
          }
        },
        {
          key: 'getGeom',
          value: function a () {
            var b = [this.exteriorRing.getGeom()]
            if (b[0] === null) return null
            for (var c = 0, d = this.interiorRings.length; c < d; c++) {
              var e = this.interiorRings[c].getGeom()
              if (e === null) continue
              b.push(e)
            }
            return b
          }
        }
      ])
      return a
    })(),
    cC = (function () {
      function a (b) {
        bW(this, a)
        this.rings = b
        this.polys = this._composePolys(b)
      }
      bY(a, [
        {
          key: 'getGeom',
          value: function a () {
            var b = []
            for (var c = 0, d = this.polys.length; c < d; c++) {
              var e = this.polys[c].getGeom()
              if (e === null) continue
              b.push(e)
            }
            return b
          }
        },
        {
          key: '_composePolys',
          value: function b (a) {
            var c = []
            for (var d = 0, e = a.length; d < e; d++) {
              var f = a[d]
              if (f.poly) continue
              if (f.isExteriorRing()) c.push(new cB(f))
              else {
                var g = f.enclosingRing()
                g.poly || c.push(new cB(g))
                g.poly.addInterior(f)
              }
            }
            return c
          }
        }
      ])
      return a
    })(),
    cD = (function () {
      function a (b) {
        var c =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : cw.compare
        bW(this, a)
        this.queue = b
        this.tree = new bP(c)
        this.segments = []
      }
      bY(a, [
        {
          key: 'process',
          value: function b (a) {
            var c = a.segment,
              d = []
            if (a.consumedBy) {
              a.isLeft || this.tree.remove(c)
              return d
            }
            var e = a.isLeft ? this.tree.insert(c) : this.tree.find(c)
            if (!e)
              throw new Error(
                'Unable to find segment ' +
                  '#'
                    .concat(c.leftSE.id, ' [')
                    .concat(c.leftSE.point.x, ', ')
                    .concat(c.leftSE.point.y, '] -> ') +
                  '#'
                    .concat(c.rightSE.id, ' [')
                    .concat(c.rightSE.point.x, ', ')
                    .concat(c.rightSE.point.y, '] ') +
                  'in SweepLine tree. Please submit a bug report.'
              )
            var f = e,
              g = e,
              h = undefined,
              i = undefined
            while (h === undefined)
              (f = this.tree.prev(f)),
                f === null
                  ? (h = null)
                  : f.key.consumedBy === undefined && (h = f.key)
            while (i === undefined)
              (g = this.tree.next(g)),
                g === null
                  ? (i = null)
                  : g.key.consumedBy === undefined && (i = g.key)
            if (a.isLeft) {
              var j = []
              if (h) {
                var k = h.getIntersection(c)
                if (k !== null) {
                  c.isAnEndpoint(k) || j.push(k)
                  if (!h.isAnEndpoint(k)) {
                    var l = this._splitSafely(h, k)
                    for (var m = 0, n = l.length; m < n; m++) d.push(l[m])
                  }
                }
              }
              if (i) {
                var o = i.getIntersection(c)
                if (o !== null) {
                  c.isAnEndpoint(o) || j.push(o)
                  if (!i.isAnEndpoint(o)) {
                    var p = this._splitSafely(i, o)
                    for (var q = 0, r = p.length; q < r; q++) d.push(p[q])
                  }
                }
              }
              if (d.length > 0 || j.length > 0) {
                this.tree.remove(c)
                this.queue.remove(c.rightSE)
                d.push(c.rightSE)
                if (j.length > 0) {
                  var s = c.split(j)
                  for (var t = 0, u = s.length; t < u; t++) d.push(s[t])
                }
                d.push(a)
              } else this.segments.push(c), (c.prev = h)
            } else {
              if (h && i) {
                var v = h.getIntersection(i)
                if (v !== null) {
                  if (!h.isAnEndpoint(v)) {
                    var w = this._splitSafely(h, v)
                    for (var x = 0, y = w.length; x < y; x++) d.push(w[x])
                  }
                  if (!i.isAnEndpoint(v)) {
                    var z = this._splitSafely(i, v)
                    for (var A = 0, B = z.length; A < B; A++) d.push(z[A])
                  }
                }
              }
              this.tree.remove(c)
            }
            return d
          }
        },
        {
          key: '_splitSafely',
          value: function c (a, b) {
            this.tree.remove(a)
            var d = a.rightSE
            this.queue.remove(d)
            var e = a.split([b])
            e.push(d)
            this.tree.insert(a)
            return e
          }
        }
      ])
      return a
    })(),
    cE = (function () {
      function a () {
        bW(this, a)
      }
      bY(a, [
        {
          key: 'run',
          value: function d (a, b, c) {
            cF.type = a
            var e = [cn(b)]
            for (var f = 0, g = c.length; f < g; f++) e.push(cn(c[f]))
            for (var h = 0, i = e.length; h < i; h++) co(e[h]), cp(e[h])
            var j = []
            for (var k = 0, l = e.length; k < l; k++) j.push(new cz(e[k]))
            j[0].markAsSubject()
            cF.numMultiPolys = j.length
            var m = new bP(cs.compare)
            for (var n = 0, o = j.length; n < o; n++) {
              var p = j[n].getSweepEvents()
              for (var q = 0, r = p.length; q < r; q++) m.insert(p[q])
            }
            var s = new cD(m),
              t = m.size,
              u = m.pop()
            while (u) {
              var v = u.key
              if (m.size === t) {
                throw new Error(
                  'Unable to pop() SweepEvent #'
                    .concat(v.id, ' [')
                    .concat(v.point.x, ', ')
                    .concat(v.point.y, '] ') +
                    'from queue. Please file a bug report.'
                )
              }
              var w = s.process(v)
              for (var x = 0, y = w.length; x < y; x++) m.insert(w[x])
              t = m.size
              u = m.pop()
            }
            var z = cA.factory(s.segments),
              A = new cC(z)
            return A.getGeom()
          }
        }
      ])
      return a
    })(),
    cF = new cE(),
    cG = function b (a) {
      for (
        var c = arguments.length, d = new Array(c > 1 ? c - 1 : 0), e = 1;
        e < c;
        e++
      )
        d[e - 1] = arguments[e]
      return cF.run('union', a, d)
    },
    cH = function b (a) {
      for (
        var c = arguments.length, d = new Array(c > 1 ? c - 1 : 0), e = 1;
        e < c;
        e++
      )
        d[e - 1] = arguments[e]
      return cF.run('intersection', a, d)
    },
    cI = function b (a) {
      for (
        var c = arguments.length, d = new Array(c > 1 ? c - 1 : 0), e = 1;
        e < c;
        e++
      )
        d[e - 1] = arguments[e]
      return cF.run('xor', a, d)
    },
    cJ = function b (a) {
      for (
        var c = arguments.length, d = new Array(c > 1 ? c - 1 : 0), e = 1;
        e < c;
        e++
      )
        d[e - 1] = arguments[e]
      return cF.run('difference', a, d)
    },
    cK = { union: cG, intersection: cH, xor: cI, difference: cJ }
  function cL (a, b, c, d) {
    console.log(cK)
    if (!a) throw new Error('geojson-buffer: Feature is required')
    if (b === undefined || b === null || isNaN(b))
      throw new Error('dgeojson-buffer: Distance is required')
    var f = a.type === 'Feature' ? a.geometry : a
    if (
      (f.type === 'Point' ||
        f.type === 'MultiPoint' ||
        f.type === 'LineString' ||
        f.type === 'MultiLineString') &&
      b < 0
    ) {
      throw new Error(
        'geojson-buffer: If offsetting a point or linestring the distance must be positive'
      )
    }
    var g = d || 64,
      h = a.properties || {},
      i = u(b, c),
      j = null
    switch (f.type) {
      case 'Polygon':
      case 'MultiPolygon':
        j = bC(f, i, g)
        e(j) ||
          ((j = cK.union(j.geometry.coordinates)),
          (j = j.length === 1 ? p(j[0]) : r(j)))
        break
      case 'LineString':
      case 'MultiLineString':
        j = bA(f, i, g)
        e(j) ||
          ((j = cK.union(j.geometry.coordinates)),
          (j = j.length === 1 ? p(j[0]) : r(j)))
        break
      case 'Point':
        j = bF(f, i, g)
    }
    j.properties = h
    return j
  }
  c.bufferGeoJSON = cL
  Object.defineProperty(c, '__esModule', { value: !0 })
})
