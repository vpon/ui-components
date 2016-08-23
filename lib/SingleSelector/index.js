'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _find = require('lodash/collection/find');

var _find2 = _interopRequireDefault(_find);

var _DataTable = require('../DataTable');

var _DataTable2 = _interopRequireDefault(_DataTable);

var _SearchBox = require('../SearchBox');

var _SearchBox2 = _interopRequireDefault(_SearchBox);

var _Helpers = require('../utils/Helpers');

var _Helpers2 = _interopRequireDefault(_Helpers);

var _Dropdown = require('react-bootstrap/lib/Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _MenuItem = require('react-bootstrap/lib/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleSelector = function (_Component) {
  _inherits(SingleSelector, _Component);

  function SingleSelector(props) {
    _classCallCheck(this, SingleSelector);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SingleSelector).call(this, props));

    _this.state = { expanded: false };

    _this.radioColumn = {
      name: 'radio',
      title: ' ',
      sortable: false,
      width: 35,
      style: { textAlign: 'center' },
      render: function render(value, data) {
        return _react2.default.createElement('input', {
          type: 'radio',
          value: data.id,
          onChange: _this.handleChange,
          checked: _this.props.selectedId && _this.props.selectedId.toString() === data.id.toString()
        });
      }
    };

    _this.handleCollapse = function () {
      _this.setState({ expanded: !_this.state.expanded });
    };

    _this.handleStateChange = function (value) {
      _this.props.dataTableProps.onQueryChange({ state: value });
    };

    _this.handleChange = function (e) {
      e.preventDefault();
      _this.props.onChange(parseInt(e.target.value, 10));
      _this.setState({ expanded: false });
    };
    return _this;
  }

  _createClass(SingleSelector, [{
    key: 'renderSearchBar',
    value: function renderSearchBar() {
      var currentState = this.props.dataTableProps.query.state;
      var searchBox = _react2.default.createElement(_SearchBox2.default, {
        handleQueryChange: this.props.dataTableProps.onQueryChange,
        placeholder: this.props.searchBoxPlaceholder
      });
      var stateFilter = _react2.default.createElement(
        _Dropdown2.default,
        { className: 'input-group-btn', id: 'single-selector-state-filter' },
        _react2.default.createElement(_Dropdown2.default.Toggle, { title: _i18next2.default.t((0, _find2.default)(this.props.stateItems, 'key', currentState)['value']) }),
        _react2.default.createElement(
          _Dropdown2.default.Menu,
          { onSelect: this.handleStateChange },
          this.props.stateItems.map(function (item) {
            return _react2.default.createElement(
              _MenuItem2.default,
              { eventKey: item.key, key: item.key, active: currentState === item.key },
              _i18next2.default.t(item.value)
            );
          })
        )
      );

      if (this.props.filterByState) {
        return _react2.default.createElement(
          'div',
          { className: 'input-group' },
          searchBox,
          stateFilter
        );
      }
      return searchBox;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$dataTableProps = this.props.dataTableProps;
      var columns = _props$dataTableProps.columns;
      var onQueryChange = _props$dataTableProps.onQueryChange;
      var dataSource = _props$dataTableProps.dataSource;
      var total = _props$dataTableProps.total;
      var emptyText = _props$dataTableProps.emptyText;
      var _props$dataTableProps2 = this.props.dataTableProps.query;
      var offset = _props$dataTableProps2.offset;
      var limit = _props$dataTableProps2.limit;
      var order = _props$dataTableProps2.order;

      var tableColumns = [this.radioColumn].concat(columns);

      return _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          'div',
          { className: (0, _classnames2.default)('input-group', 'form-width-md', { 'hidden': this.state.expanded }) },
          _react2.default.createElement(
            'span',
            { className: 'input-group-btn' },
            _react2.default.createElement(
              'button',
              { type: 'button', className: 'btn btn-default', disabled: this.props.disabled, onClick: this.handleCollapse },
              _react2.default.createElement('i', { className: 'fa fa-plus' })
            )
          ),
          _react2.default.createElement('input', { className: 'form-control', type: 'text', disabled: true, placeholder: this.props.selectedItemLabel })
        ),
        _react2.default.createElement(
          'div',
          { className: (0, _classnames2.default)('block', 'block-expandable', 'form-width-md', { 'hidden': !this.state.expanded }) },
          _react2.default.createElement(
            'button',
            { type: 'button', className: 'btn btn-default', onClick: this.handleCollapse },
            _react2.default.createElement('i', { className: 'fa fa-minus' })
          ),
          ' ',
          this.props.title,
          this.renderSearchBar(),
          this.props.selectedItemLabel,
          _react2.default.createElement('hr', null),
          _react2.default.createElement(
            'div',
            { className: 'table-bordered hack-no-horizontal-scrollbar' },
            _react2.default.createElement(_DataTable2.default, {
              onPageChange: onQueryChange,
              selectable: false,
              dataSource: dataSource,
              columns: tableColumns,
              sortInfo: _Helpers2.default.arrayifySort(order),
              pager: false,
              style: { height: 31 * (total > 6 ? 6 : total === 0 ? 1 : total) + 28 },
              emptyText: emptyText,
              scrollbarSize: 20,
              resizableColumns: false
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'block-expandable__footer text-right' },
            _react2.default.createElement(_DataTable.Pagination, {
              offset: offset,
              limit: limit,
              total: total,
              onPageChange: onQueryChange
            })
          )
        )
      );
    }
  }]);

  return SingleSelector;
}(_react.Component);

SingleSelector.propTypes = {
  disabled: _react.PropTypes.bool,
  selectedId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  onChange: _react.PropTypes.func.isRequired,
  title: _react.PropTypes.string.isRequired,
  searchBoxPlaceholder: _react.PropTypes.string.isRequired,
  filterByState: _react.PropTypes.bool,
  stateItems: _react.PropTypes.array,
  selectedItemLabel: _react.PropTypes.string,
  dataTableProps: _react.PropTypes.shape({
    onQueryChange: _react.PropTypes.func.isRequired,
    columns: _react.PropTypes.array.isRequired,
    emptyText: _react.PropTypes.string,
    dataSource: _react.PropTypes.array.isRequired,
    total: _react.PropTypes.total,
    query: _react.PropTypes.shape({
      order: _react.PropTypes.string,
      limit: _react.PropTypes.number,
      offset: _react.PropTypes.number,
      state: _react.PropTypes.string
    })
  })
};

SingleSelector.defaultProps = {
  disabled: false,
  filterByState: false,
  stateItems: [{ key: '0,1', value: 'common:::state::All' }, { key: '0', value: 'common:::state::Active' }, { key: '1', value: 'common:::state::Inactive' }]
};

exports.default = SingleSelector;
module.exports = exports['default'];