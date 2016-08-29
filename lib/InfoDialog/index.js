'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Modal = require('react-bootstrap/lib/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Helpers = require('../utils/Helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// dialog for show message
var InfoDialog = function (_Component) {
  _inherits(InfoDialog, _Component);

  function InfoDialog() {
    _classCallCheck(this, InfoDialog);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(InfoDialog).apply(this, arguments));
  }

  _createClass(InfoDialog, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _Modal2.default,
        { show: this.props.show, onHide: this.props.onHide, backdrop: 'static', animation: false, bsSize: this.props.bsSize, dialogClassName: this.props.dialogClassName },
        _react2.default.createElement(
          _Modal2.default.Header,
          { closeButton: true, bsClass: this.props.headerClassName },
          _react2.default.createElement(
            _Modal2.default.Title,
            { bsClass: this.props.titleClassName },
            this.props.title
          )
        ),
        _react2.default.createElement(
          _Modal2.default.Body,
          { bsClass: this.props.bodyClassName, style: this.props.bodyStyle },
          this.props.message
        ),
        _react2.default.createElement(
          _Modal2.default.Footer,
          { bsClass: this.props.footerClassName },
          this.props.hasCancelButton ? _react2.default.createElement(
            _Button2.default,
            { 'data-dismiss': 'modal', onClick: this.props.onHide },
            (0, _Helpers.t)('common:::Cancel')
          ) : null,
          _react2.default.createElement(
            _Button2.default,
            { bsStyle: 'primary', 'data-dismiss': 'modal', onClick: this.props.onSubmit },
            (0, _Helpers.t)('common:::OK')
          )
        )
      );
    }
  }]);

  return InfoDialog;
}(_react.Component);

InfoDialog.propTypes = {
  show: _react.PropTypes.bool.isRequired, // Trigger
  title: _react.PropTypes.node.isRequired, // Modal title
  message: _react.PropTypes.node.isRequired, // Modal body message
  onHide: _react.PropTypes.func.isRequired, // Function for close dialog
  onSubmit: _react.PropTypes.func.isRequired, // Fuction for dialog submit
  dialogClassName: _react.PropTypes.string, // Modal dialogClassName
  bodyStyle: _react.PropTypes.object, // Modal body style
  hasCancelButton: _react.PropTypes.bool, // Set to false to remove Cancel Button
  headerClassName: _react.PropTypes.string,
  titleClassName: _react.PropTypes.string,
  bodyClassName: _react.PropTypes.string,
  footerClassName: _react.PropTypes.string,
  bsSize: _react.PropTypes.string
};

InfoDialog.defaultProps = {
  hasCancelButton: true,
  dialogClassName: '',
  headerClassName: 'modal-header',
  titleClassName: 'modal-title',
  bodyClassName: 'modal-body',
  footerClassName: 'modal-footer',
  bsSize: 'small'
};

exports.default = InfoDialog;
module.exports = exports['default'];