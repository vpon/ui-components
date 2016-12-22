'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _isNumber = require('lodash/lang/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _round = require('lodash/math/round');

var _round2 = _interopRequireDefault(_round);

var _isEmpty = require('lodash/lang/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _map = require('lodash/collection/map');

var _map2 = _interopRequireDefault(_map);

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _compact = require('lodash/array/compact');

var _compact2 = _interopRequireDefault(_compact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getParamByName: function getParamByName(name) {
    var _name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + _name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },
  stringifySort: function stringifySort(orderArr) {
    return (0, _compact2.default)((0, _map2.default)(orderArr, function (obj) {
      if ((0, _isEmpty2.default)(obj)) {
        return null;
      }
      if (obj.dir) {
        var dir = void 0;
        if (obj.dir === 1) {
          dir = 'asc';
        } else if (obj.dir === -1) {
          dir = 'desc';
        } else {
          dir = obj.dir;
        }
        return obj.name + ',' + dir;
      }
    })).join('|');
  },
  arrayifySort: function arrayifySort(orderStr) {
    return (0, _map2.default)(orderStr.split('|'), function (str) {
      var _str$split = str.split(','),
          _str$split2 = _slicedToArray(_str$split, 2),
          name = _str$split2[0],
          dir = _str$split2[1];

      return { name: name, dir: dir };
    });
  },
  numberWithCommas: function numberWithCommas(num) {
    if ((0, _isNumber2.default)(num)) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (num == null) {
      return '0';
    }
    // num is following float format
    if (Number.parseInt(num, 10) !== Number.parseFloat(num)) {
      var _num$split = num.split('.'),
          _num$split2 = _slicedToArray(_num$split, 2),
          int = _num$split2[0],
          decimals = _num$split2[1];

      return this.numberWithCommas(Number.parseInt(int, 10)) + '.' + decimals;
    }

    return num;
  },
  currencyWithSymbol: function currencyWithSymbol(currency) {
    return currency + ' $';
  },
  numberToPercentage: function numberToPercentage(num) {
    if ((0, _isNumber2.default)(num)) {
      return (0, _round2.default)(num * 100, 3).toFixed(3) + '%';
    }
    if (num == null) {
      return '0.000%';
    }
    return num;
  },
  numberToCurrency: function numberToCurrency(num, obj) {
    var currency = this.currencyWithSymbol(obj.currency);
    if ((0, _isNumber2.default)(num)) {
      num = obj.precision ? (0, _round2.default)(num, obj.precision).toFixed(obj.precision) : num.toString();
      var numArr = num.split('.');
      var suffix = numArr[1] ? '.' + numArr[1] : '';
      return currency + numArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
    }
    if (num == null) {
      return currency + '0.00';
    }
    return num;
  },
  filterInt: function filterInt(value) {
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  },
  objArrayStringToInt: function objArrayStringToInt(objArray, key) {
    var _this = this;

    return (0, _map2.default)(objArray, function (obj) {
      var newObj = (0, _assign2.default)({}, obj);
      newObj[key] = _this.filterInt(obj[key], 10) || obj[key];
      return newObj;
    });
  }
};
module.exports = exports['default'];