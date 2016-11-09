'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');

var _OverlayTrigger2 = _interopRequireDefault(_OverlayTrigger);

var _Tooltip = require('react-bootstrap/lib/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InvalidWarning = function (_Component) {
  _inherits(InvalidWarning, _Component);

  function InvalidWarning() {
    _classCallCheck(this, InvalidWarning);

    return _possibleConstructorReturn(this, (InvalidWarning.__proto__ || Object.getPrototypeOf(InvalidWarning)).apply(this, arguments));
  }

  _createClass(InvalidWarning, [{
    key: 'render',
    value: function render() {
      var errorMessages = this.props.errorMessages;

      if (errorMessages && (!_lodash2.default.isArray(errorMessages) || errorMessages.length > 0)) {
        return _react2.default.createElement(
          _OverlayTrigger2.default,
          {
            placement: 'right',
            overlay: _react2.default.createElement(
              _Tooltip2.default,
              { id: '1' },
              _lodash2.default.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages
            )
          },
          _react2.default.createElement('i', { className: 'fa fa-exclamation-triangle fa-lg text-danger ' + (this.props.iconClassName || '') })
        );
      }
      return false;
    }
  }]);

  return InvalidWarning;
}(_react.Component);

InvalidWarning.propTypes = {
  errorMessages: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.string), _react.PropTypes.string]),
  iconClassName: _react.PropTypes.string
};

exports.default = InvalidWarning;
module.exports = exports['default'];