'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _map = require('lodash/collection/map');

var _map2 = _interopRequireDefault(_map);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

var _last = require('lodash/array/last');

var _last2 = _interopRequireDefault(_last);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactAddonsCreateFragment = require('react-addons-create-fragment');

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

var _reactDatagrid = require('react-datagrid');

var _reactDatagrid2 = _interopRequireDefault(_reactDatagrid);

var _Helpers = require('../../utils/Helpers');

var _Helpers2 = _interopRequireDefault(_Helpers);

var _Pagination = require('./Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTable = function (_Component) {
  _inherits(DataTable, _Component);

  function DataTable(props) {
    _classCallCheck(this, DataTable);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataTable).call(this, props));

    _this.state = {
      selected: null
    };

    _this.handleCheckAll = function (e) {
      if (props.onCheckAll) {
        props.onCheckAll(e);
      }
    };

    _this.handleCheck = function (id, e) {
      if (props.onCheck) {
        props.onCheck(id, e);
      }
    };

    _this.getSelectorColumn = function (_props) {
      return {
        name: 'index',
        width: 35,
        title: _react2.default.createElement('input', { type: 'checkbox', id: 'select_all', onChange: _this.handleCheckAll, checked: _props.dataSource.length !== 0 && _props.selectedIds && _props.selectedIds.length === _props.dataSource.length }),
        sortable: false,
        style: { textAlign: 'center' },
        render: function render(value, data) {
          return _react2.default.createElement('input', { 'data-record-id': data[_props.idProperty], type: 'checkbox', checked: _props.selectedIds.indexOf(data[_props.idProperty]) !== -1, onChange: _this.handleCheck.bind(_this, data[_props.idProperty]) });
        }
      };
    };

    _this.columns = props.selectable ? [_this.getSelectorColumn(props)].concat(props.columns) : props.columns;

    _this.resetColumns = function (newProps) {
      _this.columns = newProps.selectable ? [_this.getSelectorColumn(newProps)].concat(newProps.columns) : newProps.columns;
    };

    _this.handleColumnOrderChange = function (index, dropIndex) {
      var col = _this.columns[index];
      _this.columns.splice(index, 1); // delete from index, 1 item
      _this.columns.splice(dropIndex, 0, col);
      _this.setState({});
      // Send out new column info
      if (_this.props.onStatusChange) {
        var newColumns = (0, _map2.default)(_this.columns, function (column) {
          return (0, _pick2.default)(column, 'name', 'width');
        });
        _this.props.onStatusChange({ columns: newColumns });
      }
    };

    _this.handleSortChange = function (sortInfo) {
      var _sortInfo = (0, _last2.default)(sortInfo) || {};
      _this.props.onPageChange({ order: _Helpers2.default.stringifySort([_sortInfo]) });
      // Send out new sort info
      if (_this.props.onStatusChange) {
        _this.props.onStatusChange({ sort: _sortInfo });
      }
    };

    _this.onColumnResize = function (firstCol, firstSize) {
      firstCol.width = firstSize;
      _this.setState({});

      // Send out new column info
      if (_this.props.onStatusChange) {
        var newColumns = (0, _map2.default)(_this.columns, function (column) {
          var _column = column.name === firstCol.name ? firstCol : column;
          return (0, _pick2.default)(_column, 'name', 'width');
        });
        _this.props.onStatusChange({ columns: newColumns });
      }
    };

    _this.onSelectionChange = function (newSelectedId) {
      _this.setState({ selected: newSelectedId });
    };
    return _this;
  }

  _createClass(DataTable, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.resetColumns(nextProps);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var $scope = (0, _jquery2.default)((0, _reactDom.findDOMNode)(this));
      var $hScrollbar = $scope.find('.z-horizontal-scrollbar');
      var $hScroller = $scope.find('.z-horizontal-scroller');

      if ($hScrollbar.width() >= $hScroller.outerWidth(true)) {
        $hScrollbar.css({ display: 'none' });
      } else {
        $hScrollbar.css({ display: '' });
      }

      // const $vScrollbar = $scope.find('.z-vertical-scrollbar');
      // const $vScroller = $scope.find('.z-vertical-scroller');
      // const $contentWrapper = $scope.find('.z-content-wrapper-fix');
      // const $lastCell = $contentWrapper.find('.z-last');
      // if ($vScrollbar.outerHeight(true) >= $vScroller.outerHeight(true)) {
      //   $vScrollbar.css({display: 'none'});
      //   $contentWrapper.css('max-width', '100%');
      //   $lastCell.css({width: $lastCell.width() + this.props.scrollbarSize});
      // } else {
      //   $vScrollbar.css({display: 'block'});
      //   $contentWrapper.css('max-width', '100%');
      //   $lastCell.css({width: $lastCell.width() + this.props.scrollbarSize});
      // }
    }
  }, {
    key: 'render',
    value: function render() {
      var pager = _react2.default.createElement(_Pagination2.default, {
        offset: this.props.offset,
        limit: this.props.limit,
        total: this.props.total,
        onPageChange: this.props.onPageChange
      });
      var table = _react2.default.createElement(_reactDatagrid2.default, {
        idProperty: this.props.idProperty,
        dataSource: this.props.dataSource,
        columns: this.columns,
        style: this.props.style,
        rowStyle: this.props.rowStyle,
        rowClassName: this.props.rowClassName,
        sortInfo: this.props.sortInfo,
        emptyText: this.props.emptyText,
        withColumnMenu: false,
        defaultPageSize: 25,
        selected: this.state.selected,
        onSelectionChange: this.onSelectionChange,
        onColumnOrderChange: this.handleColumnOrderChange,
        onSortChange: this.handleSortChange,
        onColumnResize: this.onColumnResize,
        resizableColumns: this.props.resizableColumns,
        scrollbarSize: this.props.scrollbarSize,
        rowHeight: this.props.rowHeight
      });

      // Append pager
      var components = table;
      if (this.props.pager) {
        if (this.props.pager === 'top') {
          components = (0, _reactAddonsCreateFragment2.default)({ pager: pager, table: table });
        } else if (this.props.pager === 'bottom') {
          components = (0, _reactAddonsCreateFragment2.default)({ table: table, pager: pager });
        }
      }

      return _react2.default.createElement(
        'div',
        { className: 'datagrid-wrapper ' + this.props.wrapperClassName },
        components
      );
    }
  }]);

  return DataTable;
}(_react.Component);

DataTable.propTypes = {
  offset: _react.PropTypes.number, // Offset params for calculate pagination staffs.
  limit: _react.PropTypes.number, // Page size
  total: _react.PropTypes.number, // Total count for data
  dataSource: _react.PropTypes.array.isRequired, // Data
  columns: _react.PropTypes.array.isRequired, // Columns
  style: _react.PropTypes.object, // Global style, like width, height, etc.
  rowStyle: _react.PropTypes.oneOfType([// Row style
  _react.PropTypes.object, _react.PropTypes.func]),
  rowClassName: _react.PropTypes.oneOfType([// Row className
  _react.PropTypes.object, _react.PropTypes.func]),
  sortInfo: _react.PropTypes.array, // Sort info
  selectable: _react.PropTypes.bool, // Set to true to add select all column
  resizableColumns: _react.PropTypes.bool, // Set to true to make columns can be resized
  pager: _react.PropTypes.oneOfType([// Pagination: 'top', 'bottom' and false
  _react.PropTypes.string, _react.PropTypes.bool]),
  onPageChange: _react.PropTypes.func, // Interface for send out new page info.
  // Send out new grid status when
  // 1. column's order/width/visibility changed
  // 2. sort info changed
  onStatusChange: _react.PropTypes.func,
  onCheckAll: _react.PropTypes.func,
  onCheck: _react.PropTypes.func,
  selectedIds: _react.PropTypes.array,
  idProperty: _react.PropTypes.string,
  wrapperClassName: _react.PropTypes.string, // div wrapper className
  emptyText: _react.PropTypes.string, // set empty text
  scrollbarSize: _react.PropTypes.number, // set vertical scroll bar width
  rowHeight: _react.PropTypes.number
};

DataTable.defaultProps = {
  selectable: true, // Set to true to add select all column
  resizableColumns: true, // Columns can be resized
  pager: 'top', // Set default pager position is top right.
  style: {
    height: 300
  },
  wrapperClassName: '',
  idProperty: 'id',
  emptyText: 'No records',
  scrollbarSize: 20
};

DataTable.Pagination = _Pagination2.default;

exports.default = DataTable;
module.exports = exports['default'];