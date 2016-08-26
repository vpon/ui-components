'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debounce = require('lodash/function/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Horizontal Resizer


var HResizer = function (_Component) {
  _inherits(HResizer, _Component);

  function HResizer(props) {
    _classCallCheck(this, HResizer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HResizer).call(this, props));

    _this.state = {
      dragging: false
    };

    _this.stopPropagation = function (e) {
      e.stopPropagation();
    };

    _this.handleMouseDown = function (e) {
      e.preventDefault();
      _this.setState({ dragging: true });

      (0, _jquery2.default)(document).off('mousemove.' + _this.props.eventScope).on('mousemove.' + _this.props.eventScope, (0, _debounce2.default)(function (event) {
        var $resizer = (0, _jquery2.default)(_this.refs.resizer);
        var offset = event.pageY - $resizer.offset().top - $resizer.height() / 2;
        var topHeight = _this.props.topHeight + offset;
        var bottomHeight = _this.props.bottomHeight - offset;
        if (bottomHeight < _this.props.minBottomHeight) {
          bottomHeight = _this.props.minBottomHeight;
          topHeight = _this.props.topHeight + (_this.props.bottomHeight - _this.props.minBottomHeight);
        }

        if (bottomHeight > _this.props.maxBottomHeight) {
          bottomHeight = _this.props.maxBottomHeight;
          topHeight = _this.props.topHeight + (_this.props.bottomHeight - _this.props.maxBottomHeight);
        }
        _this.props.onResize(topHeight, bottomHeight);
      }, 10));
    };

    _this.handleClick = function (e) {
      var topHeight = void 0;
      var bottomHeight = void 0;
      e.preventDefault();

      if (_this.props.bottomOpened) {
        topHeight = _this.props.topHeight + _this.props.bottomHeight;
        bottomHeight = 0;
      } else {
        topHeight = _this.props.preTopHeight;
        bottomHeight = _this.props.preBottomHeight;
      }
      _this.props.onResize(topHeight, bottomHeight);
    };
    return _this;
  }

  _createClass(HResizer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      (0, _jquery2.default)(document).on('mouseup.' + this.props.eventScope, function () {
        if (_this2.state.dragging) {
          (0, _jquery2.default)(document).off('mousemove.' + _this2.props.eventScope);
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
        { className: 'ui-layout-resizer ui-layout-resizer-horizontal', ref: 'resizer', onMouseDown: this.handleMouseDown },
        _react2.default.createElement('div', { className: 'ui-layout-resizer_toggler', onClick: this.handleClick, onMouseDown: this.stopPropagation })
      );
    }
  }]);

  return HResizer;
}(_react.Component);

HResizer.propTypes = {
  minBottomHeight: _react.PropTypes.number,
  maxBottomHeight: _react.PropTypes.number,
  eventScope: _react.PropTypes.string.isRequired,
  preTopHeight: _react.PropTypes.number.isRequired,
  preBottomHeight: _react.PropTypes.number.isRequired,
  topHeight: _react.PropTypes.number.isRequired,
  bottomHeight: _react.PropTypes.number.isRequired,
  bottomOpened: _react.PropTypes.bool.isRequired,
  onResize: _react.PropTypes.func.isRequired
};

HResizer.defaultProps = {
  minBottomHeight: 0,
  maxBottomHeight: 300
};

exports.default = HResizer;
module.exports = exports['default'];