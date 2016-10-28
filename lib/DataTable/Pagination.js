'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isNumber = require('lodash/lang/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _isNaN = require('lodash/lang/isNaN');

var _isNaN2 = _interopRequireDefault(_isNaN);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pager = function (_Component) {
  _inherits(Pager, _Component);

  function Pager(props) {
    _classCallCheck(this, Pager);

    var _this = _possibleConstructorReturn(this, (Pager.__proto__ || Object.getPrototypeOf(Pager)).call(this, props));

    _this.state = {
      page: props.page
    };

    _this.handleClickPage = function (dir) {
      var page = void 0;
      if (dir === 'next') {
        page = Math.min(_this.props.page + 1, _this.props.maxPage);
      } else {
        page = Math.max(_this.props.page - 1, _this.props.minPage);
      }
      _this.changePage({ page: page, pageSize: _this.props.pageSize });
    };

    _this.handleEnterPage = function (e) {
      var page = parseInt(e.target.value, 10);
      if ((0, _isNumber2.default)(page) && !(0, _isNaN2.default)(page) && _this.props.minPage <= page && page <= _this.props.maxPage) {
        _this.changePage({ page: page, pageSize: _this.props.pageSize });
      } else {
        _this.setState({ page: '' });
      }
    };

    _this.handleChangePageSize = function (e) {
      var pageSize = parseInt(e.target.value, 10);
      if (pageSize !== _this.props.pageSize) {
        _this.changePage({ page: _this.props.minPage, pageSize: pageSize });
      }
    };

    _this.changePage = function (pageInfo) {
      var offset = (pageInfo.page - 1) * pageInfo.pageSize;
      // Update page number field
      _this.setState({ page: pageInfo.page });
      _this.props.onPageChange({ limit: pageInfo.pageSize, offset: offset });
    };
    return _this;
  }

  _createClass(Pager, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, props) {
      if (nextProps.page !== props.page) {
        this.setState({ page: nextProps.page });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var PageSizeSelector = void 0;
      if (this.props.pageSizes) {
        PageSizeSelector = _react2.default.createElement(
          'select',
          { value: this.props.pageSize, onChange: this.handleChangePageSize },
          this.props.pageSizes.map(function (size) {
            return _react2.default.createElement(
              'option',
              { key: size, value: size },
              size
            );
          })
        );
      }
      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('datagrid-pager', this.props.paginationClassName) },
        PageSizeSelector,
        '\xA0',
        _react2.default.createElement(
          _Button2.default,
          { disabled: this.props.page === this.props.minPage, onClick: this.handleClickPage.bind(this, 'prev') },
          _react2.default.createElement('i', { className: 'fa fa-caret-left' })
        ),
        '\xA0',
        _react2.default.createElement('input', { type: 'text', className: 'form-width-xs text-center', ref: 'pageNoInput', value: this.state.page, onChange: this.handleEnterPage }),
        '\xA0 of ',
        _react2.default.createElement(
          'span',
          null,
          this.props.maxPage
        ),
        '\xA0',
        _react2.default.createElement(
          _Button2.default,
          { disabled: this.props.page === this.props.maxPage || this.props.maxPage === 0, onClick: this.handleClickPage.bind(this, 'next') },
          _react2.default.createElement('i', { className: 'fa fa-caret-right' })
        )
      );
    }
  }]);

  return Pager;
}(_react.Component);

Pager.propTypes = {
  page: _react.PropTypes.number.isRequired,
  pageSize: _react.PropTypes.number.isRequired,
  pageSizes: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.bool]),
  dataSourceCount: _react.PropTypes.number.isRequired,
  minPage: _react.PropTypes.number.isRequired,
  maxPage: _react.PropTypes.number.isRequired,
  onPageChange: _react.PropTypes.func.isRequired,
  paginationClassName: _react.PropTypes.string
};

var Pagination = function Pagination(props) {
  var page = props.offset === 0 ? 1 : Math.ceil(props.offset / props.limit + 1);
  var maxPage = Math.ceil(props.total / props.limit);

  return _react2.default.createElement(Pager, {
    page: page,
    pageSize: props.limit,
    pageSizes: props.pageSizes,
    dataSourceCount: props.total,
    minPage: 1,
    maxPage: maxPage,
    onPageChange: props.onPageChange,
    paginationClassName: props.paginationClassName
  });
};

Pagination.propTypes = {
  limit: _react.PropTypes.number,
  pageSizes: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.bool]),
  total: _react.PropTypes.number,
  onPageChange: _react.PropTypes.func,
  offset: _react.PropTypes.number,
  paginationClassName: _react.PropTypes.string
};

Pagination.defaultProps = {
  pageSizes: [25, 50, 100]
};

exports.default = Pagination;
module.exports = exports['default'];