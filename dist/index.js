'use strict';

var _slicedToArray = require("@babel/runtime/helpers/slicedToArray");
var _classCallCheck = require("@babel/runtime/helpers/classCallCheck");
var _createClass = require("@babel/runtime/helpers/createClass");
var _defineProperty = require("@babel/runtime/helpers/defineProperty");
var electron = require('electron');
var tnStorage = require('tn-storage');
var ElectronStorage = require('tn-storage/dist/Storages/ElectronStorage');
var Store = require('tn-storage/dist/Stores/Store');
var tnTimeout = require('tn-timeout');
var EWBPosfix = /*#__PURE__*/function () {
  function EWBPosfix(ew, handleCorner) {
    _classCallCheck(this, EWBPosfix);
    _defineProperty(this, "ew", void 0);
    _defineProperty(this, "handleCorner", void 0);
    this.ew = ew;
    this.handleCorner = handleCorner;
    this.fix();
  }
  _createClass(EWBPosfix, [{
    key: "fix",
    value: function fix() {
      if (this.insideScreen()) return;
      this.ew.states.resetStates();
    }
  }, {
    key: "insideScreen",
    value: function insideScreen() {
      var _this = this;
      var handlebound = this.handleCorner(this.ew.win.getBounds());
      var disps = electron.screen.getAllDisplays();
      return disps.map(function (disp) {
        return _this.insideDisp(disp, handlebound);
      }).includes(true);
    }
  }, {
    key: "insideDisp",
    value: function insideDisp(disp, handleCorner) {
      var b = disp.bounds;
      var dispCorner = [b.x, b.y, b.x + b.width, b.y + b.height];
      var x1 = dispCorner[0],
        y1 = dispCorner[1],
        x2 = dispCorner[2],
        y2 = dispCorner[3];
      var _handleCorner = _slicedToArray(handleCorner, 4),
        a1 = _handleCorner[0],
        b1 = _handleCorner[1],
        a2 = _handleCorner[2],
        b2 = _handleCorner[3];
      if (x1 >= a2 || a1 >= x2) return false;
      if (y2 <= b1 || b2 <= y1) return false;
      return true;
    }
  }]);
  return EWBPosfix;
}();
var EWBStates = /*#__PURE__*/function () {
  function EWBStates(ew, scope) {
    _classCallCheck(this, EWBStates);
    _defineProperty(this, "timeout", new tnTimeout.Timeout(100));
    _defineProperty(this, "states", void 0);
    _defineProperty(this, "ew", void 0);
    this.ew = ew;
    this.states = new tnStorage.CreateStorage(new ElectronStorage.ElectronStorage('@ewb.' + scope), {
      x: new Store.Store(0, 'number'),
      y: new Store.Store(0, 'number'),
      width: new Store.Store(800, 'number'),
      height: new Store.Store(500, 'number'),
      maximized: new Store.Store(true, 'boolean')
    }).states;
    this.applyStates();
  }
  _createClass(EWBStates, [{
    key: "saveStates",
    value: function saveStates() {
      var _this2 = this;
      this.timeout.queue(function () {
        var ismax = _this2.ew.win.isMaximized();
        var bounds = _this2.ew.win.getBounds();
        _this2.states.maximized.set(ismax);
        _this2.states.x.set(ismax ? _this2.states.x.value : bounds.x);
        _this2.states.y.set(ismax ? _this2.states.y.value : bounds.y);
        _this2.states.width.set(ismax ? _this2.states.width.value : bounds.width);
        _this2.states.height.set(ismax ? _this2.states.height.value : bounds.height);
      });
    }
  }, {
    key: "applyStates",
    value: function applyStates() {
      this.ew.win.setBounds({
        x: this.states.x.value,
        y: this.states.y.value,
        width: this.states.width.value,
        height: this.states.height.value
      });
      if (this.states.maximized.value) this.ew.win.maximize();
    }
  }, {
    key: "resetStates",
    value: function resetStates() {
      this.states.x.set(0);
      this.states.y.set(0);
      this.states.width.set(800);
      this.states.height.set(500);
      this.states.maximized.set(true);
      this.applyStates();
    }
  }]);
  return EWBStates;
}();
var ElectronWinbounds = /*#__PURE__*/function () {
  function ElectronWinbounds(win, scope, handleCorner) {
    _classCallCheck(this, ElectronWinbounds);
    _defineProperty(this, "win", void 0);
    _defineProperty(this, "states", void 0);
    _defineProperty(this, "posfix", void 0);
    this.win = win;
    this.states = new EWBStates(this, scope);
    this.posfix = new EWBPosfix(this, handleCorner);
    this.bindEvents();
  }
  _createClass(ElectronWinbounds, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this3 = this;
      this.win.on('moved', function () {
        return _this3.states.saveStates();
      });
      this.win.on('resized', function () {
        return _this3.states.saveStates();
      });
      this.win.on('maximize', function () {
        return _this3.states.saveStates();
      });
      this.win.on('unmaximize', function () {
        return _this3.states.saveStates();
      });
      electron.screen.on('display-added', function () {
        return _this3.posfix.fix();
      });
      electron.screen.on('display-removed', function () {
        return _this3.posfix.fix();
      });
      electron.screen.on('display-metrics-changed', function () {
        return _this3.posfix.fix();
      });
    }
  }]);
  return ElectronWinbounds;
}();
exports.ElectronWinbounds = ElectronWinbounds;
