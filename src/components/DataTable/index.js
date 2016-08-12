import $ from 'jquery';
import map from 'lodash/collection/map';
import pick from 'lodash/object/pick';
import last from 'lodash/array/last';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import DataGrid from 'react-datagrid';
import Helpers from '../../utils/Helpers';
import Pagination from './Pagination';

class DataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    this.handleCheckAll = (e) => {
      if (props.onCheckAll) {
        props.onCheckAll(e);
      }
    };

    this.handleCheck = (id, e) => {
      if (props.onCheck) {
        props.onCheck(id, e);
      }
    };

    this.getSelectorColumn = _props => {
      return {
        name: 'index',
        width: 35,
        title: <input type="checkbox" id="select_all" onChange={this.handleCheckAll} checked={_props.dataSource.length !== 0 && _props.selectedIds && _props.selectedIds.length === _props.dataSource.length}/>,
        sortable: false,
        style: { textAlign: 'center' },
        render: (value, data) => {
          return <input data-record-id={data[_props.idProperty]} type="checkbox" checked={_props.selectedIds.indexOf(data[_props.idProperty]) !== -1} onChange={this.handleCheck.bind(this, data[_props.idProperty])} />;
        }
      };
    };

    this.columns = (props.selectable ? [this.getSelectorColumn(props)].concat(props.columns) : props.columns);

    this.resetColumns = newProps => {
      this.columns = (newProps.selectable ? [this.getSelectorColumn(newProps)].concat(newProps.columns) : newProps.columns);
    };

    this.handleColumnOrderChange = (index, dropIndex) => {
      const col = this.columns[index];
      this.columns.splice(index, 1); // delete from index, 1 item
      this.columns.splice(dropIndex, 0, col);
      this.setState({});
      // Send out new column info
      if (this.props.onStatusChange) {
        const newColumns = map(this.columns, (column) => {
          return pick(column, 'name', 'width');
        });
        this.props.onStatusChange({columns: newColumns});
      }
    };

    this.handleSortChange = (sortInfo) => {
      const _sortInfo = last(sortInfo) || {};
      this.props.onPageChange({order: Helpers.stringifySort([_sortInfo])});
      // Send out new sort info
      if (this.props.onStatusChange) {
        this.props.onStatusChange({sort: _sortInfo});
      }
    };

    this.onColumnResize = (firstCol, firstSize) => {
      firstCol.width = firstSize;
      this.setState({});

      // Send out new column info
      if (this.props.onStatusChange) {
        const newColumns = map(this.columns, (column) => {
          const _column = (column.name === firstCol.name ? firstCol : column);
          return pick(_column, 'name', 'width');
        });
        this.props.onStatusChange({columns: newColumns});
      }
    };

    this.onSelectionChange = (newSelectedId) => {
      this.setState({selected: newSelectedId});
    };
  }

  componentWillReceiveProps(nextProps) {
    this.resetColumns(nextProps);
  }

  componentDidUpdate() {
    const $scope = $(findDOMNode(this));
    const $hScrollbar = $scope.find('.z-horizontal-scrollbar');
    const $hScroller = $scope.find('.z-horizontal-scroller');
    const $vScrollbar = $scope.find('.z-vertical-scrollbar');
    const $vScroller = $scope.find('.z-vertical-scroller');

    if ($hScrollbar.outerWidth(true) >= $hScroller.outerWidth(true)) {
      $hScrollbar.css({display: 'none'});
    }
    if ($vScrollbar.outerHeight(true) >= $vScroller.outerHeight(true)) {
      const $contentWrapper = $scope.find('.z-content-wrapper-fix');
      const $lastCell = $contentWrapper.find('.z-last');

      $vScrollbar.css({display: 'none'});
      $contentWrapper.css('max-width', '100%');
      $lastCell.css({width: $lastCell.width() + (this.props.scrollbarSize || 20)});
    }
  }

  render() {
    const pager = (<Pagination
      offset={this.props.offset}
      limit={this.props.limit}
      total={this.props.total}
      onPageChange={this.props.onPageChange}
    />);
    let components = [
      <DataGrid
        idProperty={this.props.idProperty}
        dataSource={this.props.dataSource}
        columns={this.columns}
        style={this.props.style}
        rowStyle={this.props.rowStyle}
        rowClassName={this.props.rowClassName}
        sortInfo={this.props.sortInfo}
        emptyText={this.props.emptyText}
        withColumnMenu={false}
        defaultPageSize={25}
        selected={this.state.selected}
        onSelectionChange={this.onSelectionChange}
        onColumnOrderChange={this.handleColumnOrderChange}
        onSortChange={this.handleSortChange}
        onColumnResize={this.onColumnResize}
        resizableColumns={this.props.resizableColumns}
        scrollbarSize={this.props.scrollbarSize}
        rowHeight={this.props.rowHeight}
      />
    ];
    // Append pager
    if (this.props.pager) {
      if (this.props.pager === 'top') {
        components.unshift(pager);
      } else if (this.props.pager === 'bottom') {
        components.push(pager);
      }
    }

    return (
      <div className={`datagrid-wrapper ${this.props.wrapperClassName}`}>
        {components[0]}
        {components[1]}
      </div>
    );
  }
}

DataTable.propTypes = {
  offset: PropTypes.number, // Offset params for calculate pagination staffs.
  limit: PropTypes.number, // Page size
  total: PropTypes.number, // Total count for data
  dataSource: PropTypes.array.isRequired, // Data
  columns: PropTypes.array.isRequired, // Columns
  style: PropTypes.object, // Global style, like width, height, etc.
  rowStyle: PropTypes.oneOfType([ // Row style
    PropTypes.object,
    PropTypes.func
  ]),
  rowClassName: PropTypes.oneOfType([ // Row className
    PropTypes.object,
    PropTypes.func
  ]),
  sortInfo: PropTypes.array, // Sort info
  selectable: PropTypes.bool, // Set to true to add select all column
  resizableColumns: PropTypes.bool, // Set to true to make columns can be resized
  pager: PropTypes.oneOfType([ // Pagination: 'top', 'bottom' and false
    PropTypes.string,
    PropTypes.bool
  ]),
  onPageChange: PropTypes.func, // Interface for send out new page info.
  // Send out new grid status when
  // 1. column's order/width/visibility changed
  // 2. sort info changed
  onStatusChange: PropTypes.func,
  onCheckAll: PropTypes.func,
  onCheck: PropTypes.func,
  selectedIds: PropTypes.array,
  idProperty: PropTypes.string,
  wrapperClassName: PropTypes.string, // div wrapper className
  emptyText: PropTypes.string, // set empty text
  scrollbarSize: PropTypes.number, // set vertical scroll bar width
  rowHeight: PropTypes.number
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
  emptyText: 'No records'
};

DataTable.Pagination = Pagination;

export default DataTable;
