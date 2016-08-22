'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _get = require('lodash/object/get');

var _get2 = _interopRequireDefault(_get);

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

    _this.state = (0, _assign2.default)({}, props.watchedStore ? props.watchedStore.getState() : {}, { expanded: false });

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

    _this.onChange = function () {
      _this.setState(_this.props.watchedStore.getState());
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
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.watchedStore) {
        this.props.watchedStore.addChangeListener(this.onChange);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.watchedStore) {
        this.props.watchedStore.removeChangeListener(this.onChange);
      }
    }
  }, {
    key: 'renderSearchBar',
    value: function renderSearchBar() {
      var currentState = this.state.query.state;
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
      var query = _props$dataTableProps.query;
      var onQueryChange = _props$dataTableProps.onQueryChange;
      var keyOfDataSource = _props$dataTableProps.keyOfDataSource;
      var keyOfTotal = _props$dataTableProps.keyOfTotal;
      var emptyText = _props$dataTableProps.emptyText;

      var total = (0, _get2.default)(this.state, keyOfTotal);
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
              dataSource: (0, _get2.default)(this.state, keyOfDataSource),
              columns: tableColumns,
              sortInfo: _Helpers2.default.arrayifySort(query.order),
              pager: false,
              style: { height: 31 * (total > 6 ? 6 : total === 0 ? 1 : total) + 32 },
              emptyText: emptyText,
              scrollbarSize: 20,
              resizableColumns: false
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'block-expandable__footer text-right' },
            _react2.default.createElement(_DataTable.Pagination, {
              offset: query.offset,
              limit: query.limit,
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
  watchedStore: _react.PropTypes.object,
  dataTableProps: _react.PropTypes.shape({
    query: _react.PropTypes.shape({
      offset: _react.PropTypes.number,
      limit: _react.PropTypes.number,
      order: _react.PropTypes.string,
      state: _react.PropTypes.string
    }),
    onQueryChange: _react.PropTypes.func.isRequired,
    keyOfTotal: _react.PropTypes.string.isRequired,
    keyOfDataSource: _react.PropTypes.string.isRequired,
    columns: _react.PropTypes.array.isRequired,
    emptyText: _react.PropTypes.string
  })
};

SingleSelector.defaultProps = {
  disabled: false,
  filterByState: false,
  stateItems: [{ key: '0,1', value: 'common:::state::All' }, { key: '0', value: 'common:::state::Active' }, { key: '1', value: 'common:::state::Inactive' }]
};

exports.default = SingleSelector;
module.exports = exports['default'];