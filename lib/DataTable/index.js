'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = require('lodash/collection/map');

var _map2 = _interopRequireDefault(_map);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

var _last = require('lodash/array/last');

var _last2 = _interopRequireDefault(_last);

var _isEqual = require('lodash/lang/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _find = require('lodash/collection/find');

var _find2 = _interopRequireDefault(_find);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactAddonsCreateFragment = require('react-addons-create-fragment');

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

var _reactDatagrid = require('react-datagrid');

var _reactDatagrid2 = _interopRequireDefault(_reactDatagrid);

var _Helpers = require('../utils/Helpers');

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

    var _this = _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).call(this, props));

    _this.state = {
      selected: null
    };

    // Cache as local variable
    _this.columns = props.columns;

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

    _this.getSelectorColumn = function () {
      return {
        name: 'index',
        width: 30,
        title: _react2.default.createElement('input', { type: 'checkbox', id: 'select_all', onChange: _this.handleCheckAll, checked: _this.props.dataSource.length !== 0 && _this.props.selectedIds && _this.props.selectedIds.length === _this.props.dataSource.length }),
        sortable: false,
        style: { textAlign: 'center' },
        render: function render(value, data) {
          return _react2.default.createElement('input', { 'data-record-id': data[_this.props.idProperty], type: 'checkbox', checked: _this.props.selectedIds.indexOf(data[_this.props.idProperty]) !== -1, onChange: _this.handleCheck.bind(_this, data[_this.props.idProperty]) });
        }
      };
    };

    _this.handleColumnOrderChange = function (index, dropIndex) {
      if (_this.props.selectable) {
        index -= 1;
        dropIndex -= 1;
      }
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
      // nextSortInfo for func onPageChange is a string, e.g. 'id,desc'
      var nextSortInfo = _Helpers2.default.stringifySort([_sortInfo]);
      // this.props.sortInfo is an array of object, e.g. [{name: 'id', dir: 'desc'}]
      var preSortInfo = _this.props.sortInfo[0];

      // sort dir only need asc and desc
      if (!nextSortInfo && preSortInfo) {
        var dir = preSortInfo.dir === 'asc' ? 'desc' : 'asc';
        nextSortInfo = preSortInfo.name + ',' + dir;
      }

      _this.props.onPageChange({ order: nextSortInfo });
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

    _this.fixScrollbar = function () {
      var $scope = $((0, _reactDom.findDOMNode)(_this));
      var $hScrollbar = $scope.find('.z-horizontal-scrollbar');
      var $hScroller = $scope.find('.z-horizontal-scroller');

      if ($hScrollbar.width() >= $hScroller.outerWidth(true)) {
        $hScrollbar.css({ display: 'none' });
      } else {
        $hScrollbar.css({ display: '' });
      }

      if (_this.props.scrollbarSize === 0) {
        $scope.find('.z-vertical-scrollbar').css({ display: 'none' });
      }
    };
    return _this;
  }

  _createClass(DataTable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fixScrollbar();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var oldColumnNames = (0, _map2.default)(this.columns, 'name').sort();
      var newColumnNames = (0, _map2.default)(nextProps.columns, 'name').sort();
      if ((0, _isEqual2.default)(oldColumnNames, newColumnNames)) {
        this.columns = this.columns.map(function (oldColumn) {
          return (0, _find2.default)(nextProps.columns, function (column) {
            return oldColumn.name === column.name;
          });
        });
      } else {
        this.columns = nextProps.columns;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.fixScrollbar();
    }
  }, {
    key: 'render',
    value: function render() {
      var columns = this.props.selectable ? [this.getSelectorColumn()].concat(this.columns) : this.columns;
      var pager = _react2.default.createElement(_Pagination2.default, {
        offset: this.props.offset,
        limit: this.props.limit,
        total: this.props.total,
        onPageChange: this.props.onPageChange,
        paginationClassName: this.props.paginationClassName
      });
      var table = _react2.default.createElement(_reactDatagrid2.default, {
        ref: 'grid',
        idProperty: this.props.idProperty,
        dataSource: this.props.dataSource,
        columns: columns,
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
        { className: (0, _classnames2.default)('datagrid-wrapper', this.props.wrapperClassName) },
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
  rowHeight: _react.PropTypes.number,
  paginationClassName: _react.PropTypes.string
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
  scrollbarSize: 20,
  rowHeight: 30
};

DataTable.Pagination = _Pagination2.default;

exports.default = DataTable;
module.exports = exports['default'];