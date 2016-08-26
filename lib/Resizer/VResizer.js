'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debounce = require('lodash/function/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Vertical Resizer


var VResizer = function (_Component) {
  _inherits(VResizer, _Component);

  function VResizer(props) {
    _classCallCheck(this, VResizer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VResizer).call(this, props));

    _this.state = {
      dragging: false
    };

    _this.stopPropagation = function (e) {
      e.stopPropagation();
    };

    _this.handleMouseDown = function (e) {
      e.preventDefault();
      _this.setState({ dragging: true });

      $(document).off('mousemove.' + _this.props.eventScope).on('mousemove.' + _this.props.eventScope, (0, _debounce2.default)(function (event) {
        var $resizer = $(_this.refs.resizer);
        var offset = event.pageX - $resizer.offset().left - $resizer.width() / 2;
        var leftWidth = _this.props.leftWidth + offset;
        var rightWidth = _this.props.rightWidth - offset;
        if (leftWidth < _this.props.minLeftWidth) {
          leftWidth = _this.props.minLeftWidth;
          rightWidth = _this.props.rightWidth + (_this.props.leftWidth - _this.props.minLeftWidth);
        }
        if (leftWidth > _this.props.maxLeftWidth) {
          leftWidth = _this.props.maxLeftWidth;
          rightWidth = _this.props.rightWidth + (_this.props.leftWidth - _this.props.maxLeftWidth);
        }
        _this.props.onResize(leftWidth, rightWidth);
      }, 10));
    };

    _this.handleClick = function (e) {
      var leftWidth = void 0;
      var rightWidth = void 0;
      e.preventDefault();

      if (_this.props.leftOpened) {
        leftWidth = 0;
        rightWidth = _this.props.leftWidth + _this.props.rightWidth;
      } else {
        leftWidth = _this.props.preLeftWidth;
        rightWidth = _this.props.preRightWidth;
      }
      _this.props.onResize(leftWidth, rightWidth);
    };
    return _this;
  }

  _createClass(VResizer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      $(document).on('mouseup.' + this.props.eventScope, function () {
        if (_this2.state.dragging) {
          $(document).off('mousemove.' + _this2.props.eventScope);
          _this2.setState({ dragging: false });
        }
      });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'ui-layout-resizer ui-layout-resizer-vertical', ref: 'resizer', onMouseDown: this.handleMouseDown, style: { 'float': 'left', width: '0.3%' } },
        _react2.default.createElement('div', { className: 'ui-layout-resizer_toggler', onClick: this.handleClick, onMouseDown: this.stopPropagation })
      );
    }
  }]);

  return VResizer;
}(_react.Component);

VResizer.propTypes = {
  minLeftWidth: _react2.default.PropTypes.number,
  maxLeftWidth: _react2.default.PropTypes.number,
  eventScope: _react2.default.PropTypes.string.isRequired,
  preLeftWidth: _react2.default.PropTypes.number.isRequired,
  preRightWidth: _react2.default.PropTypes.number.isRequired,
  leftWidth: _react2.default.PropTypes.number.isRequired,
  rightWidth: _react2.default.PropTypes.number.isRequired,
  leftOpened: _react2.default.PropTypes.bool.isRequired,
  onResize: _react2.default.PropTypes.func.isRequired
};

VResizer.defaultProps = {
  minLeftWidth: 0,
  maxLeftWidth: 550
};

exports.default = VResizer;
module.exports = exports['default'];