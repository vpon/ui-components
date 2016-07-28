'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Dropdown = require('react-bootstrap/lib/Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _MenuItem = require('react-bootstrap/lib/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Helpers = require('./Helpers');

var _Helpers2 = _interopRequireDefault(_Helpers);

var _Custom = require('./Custom');

var _Custom2 = _interopRequireDefault(_Custom);

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rangeTypes = ['custom', 'today', 'yesterday', 'this_week', 'last_week', 'last7', 'last14', 'this_month', 'last_month', 'all_time'];

var DateRange = function (_Component) {
  _inherits(DateRange, _Component);

  function DateRange() {
    _classCallCheck(this, DateRange);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DateRange).call(this));

    _this.state = {
      showModal: false
    };

    _this.handleSelect = function (e, value) {
      var target = e.currentTarget.target;
      var range = _Helpers2.default.getUnixOffset({ rangeType: target }, _this.props.tzName);
      _this.props.handleDateRangeChange({
        rangeType: target,
        start_at: range.start_at,
        end_at: range.end_at
      });
    };

    _this.handleSelectCustom = function (e) {
      _this.setState({ showModal: true });
    };

    _this.handleCustomCallback = function (rangeType, start_at, end_at) {
      _this.props.handleDateRangeChange({
        rangeType: rangeType,
        start_at: start_at,
        end_at: end_at
      });
      _this.setState({ showModal: false });
    };

    _this.handleDialogClose = function () {
      _this.setState({ showModal: false });
    };
    return _this;
  }

  _createClass(DateRange, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var value = {
        rangeType: this.props.rangeType,
        start_at: this.props.start_at,
        end_at: this.props.end_at
      };
      var title = _Helpers2.default.humanizeDateRange(value, this.props.tzName, this.props.dateFormat);

      var options = this.props.rangeTypes.map(function (rangeType, i) {
        if (rangeType === 'custom') {
          return _react2.default.createElement(
            _MenuItem2.default,
            {
              key: i,
              eventKey: i,
              target: rangeType,
              active: _this2.props.rangeType === rangeType,
              onSelect: _this2.handleSelectCustom
            },
            _i18next2.default.t('common:::dateRange::Custom')
          );
        }
        return _react2.default.createElement(
          _MenuItem2.default,
          {
            key: i,
            eventKey: i,
            target: rangeType,
            active: _this2.props.rangeType === rangeType,
            onSelect: _this2.handleSelect
          },
          _Helpers2.default.humanizeDateRange({ rangeType: rangeType }, _this2.props.tzName, _this2.props.dateFormat)
        );
      });

      var customDialog = false;
      if (this.state.showModal) {
        customDialog = _react2.default.createElement(_Custom2.default, {
          utcOffset: this.props.utcOffset,
          tzName: this.props.tzName,
          dateFormat: this.props.dateFormat,
          show: this.state.showModal,
          onHide: this.handleDialogClose,
          onSubmit: this.handleCustomCallback,
          start_at: this.props.rangeType === 'custom' ? this.props.start_at : undefined,
          end_at: this.props.rangeType === 'custom' ? this.props.end_at : undefined
        });
      }
      return _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _Dropdown2.default,
          {
            pullRight: true,
            id: 'date-range-type-dropdown',
            bsStyle: 'default',
            ref: 'dropdownButton',
            key: 0,
            className: this.props.className
          },
          _react2.default.createElement(
            _Dropdown2.default.Toggle,
            {
              className: this.props.buttonClassName,
              disabled: this.props.disabled
            },
            title
          ),
          _react2.default.createElement(
            _Dropdown2.default.Menu,
            null,
            options
          )
        ),
        customDialog
      );
    }
  }]);

  return DateRange;
}(_react.Component);

DateRange.propTypes = {
  utcOffset: _react.PropTypes.number.isRequired,
  tzName: _react.PropTypes.string.isRequired,
  dateFormat: _react.PropTypes.string.isRequired,
  rangeType: _react.PropTypes.string.isRequired,
  rangeTypes: _react.PropTypes.array,
  start_at: _react.PropTypes.number,
  end_at: _react.PropTypes.number,
  handleDateRangeChange: _react.PropTypes.func,
  disabled: _react.PropTypes.bool, // set true will disabled date range
  className: _react.PropTypes.string,
  buttonClassName: _react.PropTypes.string
};

DateRange.defaultProps = {
  rangeTypes: rangeTypes,
  rangeType: 'today',
  tzName: 'GMT',
  dateFormat: 'YYYY/MM/DD',
  disabled: false
};

DateRange.DateHelpers = _Helpers2.default;
DateRange.rangeTypes = rangeTypes;

exports.default = DateRange;
module.exports = exports['default'];