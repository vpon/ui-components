'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isUndefined = require('lodash/lang/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _debounce = require('lodash/function/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchBox = function (_Component) {
  _inherits(SearchBox, _Component);

  function SearchBox(props) {
    _classCallCheck(this, SearchBox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SearchBox).call(this, props));

    _this.state = {
      keyword: props.keyword || undefined
    };

    _this.clearKeywordField = function () {
      _this.setState({ keyword: undefined });
      _this.props.handleQueryChange({ keyword: undefined });
    };

    _this.handleChange = function (e) {
      _this.setState({ keyword: e.target.value });
    };
    return _this;
  }

  _createClass(SearchBox, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      $(this.refs.keywordField).off('keyup').on('keyup', (0, _debounce2.default)(function (e) {
        _this2.props.handleQueryChange({ keyword: e.target.value });
      }, 1000));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _isUndefined2.default)(nextProps.keyword) && nextProps.keyword !== this.state.keyword) {
        this.setState({ keyword: nextProps.keyword });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      $(this.refs.keywordField).off('keyup');
    }
  }, {
    key: 'render',
    value: function render() {
      var closeButtonStyle = { display: this.state.keyword ? 'block' : 'none' };
      return _react2.default.createElement(
        'div',
        { className: 'has-feedback form-group' },
        _react2.default.createElement('input', {
          ref: 'keywordField',
          type: 'search',
          className: 'form-control',
          placeholder: this.props.placeholder,
          onChange: this.handleChange,
          value: this.state.keyword
        }),
        _react2.default.createElement(
          'button',
          { type: 'button', className: 'btn form-control-feedback', onClick: this.clearKeywordField, style: closeButtonStyle },
          _react2.default.createElement('i', { className: 'fa fa-times' })
        )
      );
    }
  }]);

  return SearchBox;
}(_react.Component);

SearchBox.propTypes = {
  handleQueryChange: _react.PropTypes.func.isRequired,
  placeholder: _react.PropTypes.string.isRequired,
  keyword: _react.PropTypes.string
};

exports.default = SearchBox;
module.exports = exports['default'];