'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('./jquery.ui.datepicker.js');

var _uniq = require('lodash/array/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _Modal = require('react-bootstrap/lib/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomDialog = function (_Component) {
  _inherits(CustomDialog, _Component);

  function CustomDialog(props) {
    _classCallCheck(this, CustomDialog);

    var _this = _possibleConstructorReturn(this, (CustomDialog.__proto__ || Object.getPrototypeOf(CustomDialog)).call(this, props));

    _this.state = {
      focusOn: 'start',
      startText: _momentTimezone2.default.tz(props.start_at, props.tzName).format(props.dateFormat) || '',
      endText: props.end_at && _momentTimezone2.default.tz(props.end_at, props.tzName).format(props.dateFormat) || ''
      // defaultDate: moment.tz(props.start_at, props.tzName).format(props.dateFormat)
    };

    _this.handleChangeDate = function (date) {
      var startText = void 0;
      var endText = void 0;
      var focusOn = _this.state.focusOn;
      if (_this.state.focusOn === 'start') {
        endText = _this.state.endText;
        if (!endText || date <= endText) {
          startText = date;
          focusOn = 'end';
        } else {
          startText = date;
          endText = '';
          focusOn = 'end';
        }
      } else if (_this.state.focusOn === 'end') {
        startText = _this.state.startText;
        if (!startText || date >= startText) {
          endText = date;
        } else {
          endText = '';
        }
      }
      _this.setState({
        startText: startText,
        endText: endText,
        focusOn: focusOn
      });
    };

    _this.handleFocusChange = function (e) {
      var input = e.target;
      if (_this.state.focusOn !== input.name) {
        _this.setState({
          focusOn: input.name
          // defaultDate: input.value
        });
      }
    };

    _this.handleInputChange = function (e) {
      var input = e.currentTarget;
      var newState = {};
      newState[input.name + 'Text'] = input.value;
      // if (moment(input.value, this.props.dateFormat, true).isValid()) {
      //   newState['defaultDate'] = input.value;
      // }
      _this.setState(newState);
    };

    _this.handleInputBlur = function (e) {
      var input = e.currentTarget;
      var date = input.value;
      var isValid = (0, _momentTimezone2.default)(date, _this.props.dateFormat, true).isValid();
      if (isValid) {
        _this.handleChangeDate(date);
      } else {
        var newState = {};
        newState[input.name] = null;
        newState[input.name + 'Text'] = '';
        _this.setState(newState);
        $((0, _reactDom.findDOMNode)(_this)).find('#date_range_datepicker').datepicker('setDate', null);
      }
    };

    _this.handleApply = function () {
      _this.props.onHide();
      var start = _momentTimezone2.default.tz(_this.state.startText, _this.props.dateFormat, _this.props.tzName).startOf('day').valueOf();
      var end = _momentTimezone2.default.tz(_this.state.endText, _this.props.dateFormat, _this.props.tzName).endOf('day').valueOf();

      _this.props.onSubmit('custom', start, end);
    };

    _this.setupDatepicker = function () {
      var self = _this;
      var $dialog = $('#date_range_custom_dialog');
      var $datepicker = $dialog.find('#date_range_datepicker');

      // Foucs input
      $dialog.find('input[name="' + _this.state.focusOn + '"]').trigger('focus');
      // Reset datepicker
      $datepicker.datepicker('destroy');
      $datepicker.datepicker({
        numberOfMonths: 3,
        dateFormat: 'yy/mm/dd',
        showButtonPanel: false,
        utcOffset: self.props.utcOffset,
        //defaultDate: self.state.defaultDate,
        beforeShowDay: function beforeShowDay(date) {
          var cssClasses = [];
          var selectedDate = $.datepicker.formatDate('yy/mm/dd', date);

          if (selectedDate === self.state.startText) {
            cssClasses.push('day-in-range');
            cssClasses.push('day-start');
          }
          if (self.state.startText <= selectedDate && self.state.endText > selectedDate) {
            cssClasses.push('day-in-range');
          } else if (self.state.endText === selectedDate) {
            cssClasses.push('day-in-range');
            cssClasses.push('day-end');
          }
          return [true, (0, _uniq2.default)(cssClasses).join(' ')];
        },
        onSelect: function onSelect(date) {
          self.handleChangeDate(date);
          return false;
        }
      });
    };
    return _this;
  }

  _createClass(CustomDialog, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.setupDatepicker();
      $('#date_range_custom_dialog').on('change', 'input', function (e) {
        _this2.handleInputBlur(e);
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setupDatepicker();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      $((0, _reactDom.findDOMNode)(this)).find('#date_range_datepicker').datepicker('destroy');
    }
  }, {
    key: 'render',
    value: function render() {
      var disableSubmit = this.state.startText && this.state.endText ? false : true;
      return _react2.default.createElement(
        _Modal2.default,
        { show: this.props.show, onHide: this.props.onHide, bsSize: 'large', id: 'date_range_custom_dialog', backdrop: 'static', animation: false },
        _react2.default.createElement(
          _Modal2.default.Header,
          { closeButton: true },
          _react2.default.createElement(
            _Modal2.default.Title,
            null,
            this.props.title
          )
        ),
        _react2.default.createElement(
          _Modal2.default.Body,
          null,
          _react2.default.createElement(
            'div',
            { className: 'form-group text-center' },
            _react2.default.createElement('input', {
              type: 'text',
              name: 'start',
              id: 'start',
              value: this.state.startText,
              onFocus: this.handleFocusChange,
              onChange: this.handleInputChange,
              placeholder: this.props.dateFormat
            }),
            '\xA0\uFF5E\xA0',
            _react2.default.createElement('input', {
              type: 'text',
              name: 'end',
              id: 'end',
              value: this.state.endText,
              onFocus: this.handleFocusChange,
              onChange: this.handleInputChange,
              placeholder: this.props.dateFormat
            })
          ),
          _react2.default.createElement('div', { id: 'date_range_datepicker' })
        ),
        _react2.default.createElement(
          _Modal2.default.Footer,
          null,
          _react2.default.createElement(
            _Button2.default,
            { bsStyle: 'primary', onClick: this.handleApply, disabled: disableSubmit },
            this.props.applyText
          )
        )
      );
    }
  }]);

  return CustomDialog;
}(_react.Component);

CustomDialog.propTypes = {
  utcOffset: _react.PropTypes.number.isRequired,
  tzName: _react.PropTypes.string.isRequired,
  dateFormat: _react.PropTypes.string.isRequired,
  show: _react.PropTypes.bool.isRequired,
  onHide: _react.PropTypes.func.isRequired,
  onSubmit: _react.PropTypes.func.isRequired,
  title: _react.PropTypes.string.isRequired,
  applyText: _react.PropTypes.string.isRequired,
  start_at: _react.PropTypes.number,
  end_at: _react.PropTypes.number
};

exports.default = CustomDialog;
module.exports = exports['default'];