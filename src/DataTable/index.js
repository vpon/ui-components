import map from 'lodash/collection/map';
import pick from 'lodash/object/pick';
import last from 'lodash/array/last';
import isEqual from 'lodash/lang/isEqual';
import find from 'lodash/collection/find';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import createFragment from 'react-addons-create-fragment';
import DataGrid from 'react-datagrid';
import Helpers from '../utils/Helpers';
import Pagination from './Pagination';

class DataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    // Cache as local variable
    this.columns = props.columns;

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

    this.getSelectorColumn = () => {
      return {
        name: 'index',
        width: 30,
        title: <input type="checkbox" id="select_all" onChange={this.handleCheckAll} checked={this.props.dataSource.length !== 0 && this.props.selectedIds && this.props.selectedIds.length === this.props.dataSource.length}/>,
        sortable: false,
        style: { textAlign: 'center' },
        render: (value, data) => {
          return <input data-record-id={data[this.props.idProperty]} type="checkbox" checked={this.props.selectedIds.indexOf(data[this.props.idProperty]) !== -1} onChange={this.handleCheck.bind(this, data[this.props.idProperty])} />;
        }
      };
    };

    this.handleColumnOrderChange = (index, dropIndex) => {
      if (this.props.selectable) {
        index -= 1;
        dropIndex -= 1;
      }
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
      // nextSortInfo for func onPageChange is a string, e.g. 'id,desc'
      let nextSortInfo = Helpers.stringifySort([_sortInfo]);
      // this.props.sortInfo is an array of object, e.g. [{name: 'id', dir: 'desc'}]
      const preSortInfo = this.props.sortInfo[0];

      // sort dir only need asc and desc
      if (!nextSortInfo && preSortInfo) {
        const dir = preSortInfo.dir === 'asc' ? 'desc' : 'asc';
        nextSortInfo = `${preSortInfo.name},${dir}`;
      }

      this.props.onPageChange({order: nextSortInfo});
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

    this.fixScrollbar = () => {
      const $scope = $(findDOMNode(this));
      const $hScrollbar = $scope.find('.z-horizontal-scrollbar');
      const $hScroller = $scope.find('.z-horizontal-scroller');

      if ($hScrollbar.width() >= $hScroller.outerWidth(true)) {
        $hScrollbar.css({display: 'none'});
      } else {
        $hScrollbar.css({display: ''});
      }

      if (this.props.scrollbarSize === 0) {
        $scope.find('.z-vertical-scrollbar').css({display: 'none'});
      }
    };
  }

  componentDidMount() {
    this.fixScrollbar();
  }

  componentWillReceiveProps(nextProps) {
    const oldColumnNames = map(this.columns, 'name').sort();
    const newColumnNames = map(nextProps.columns, 'name').sort();
    if (isEqual(oldColumnNames, newColumnNames)){
      this.columns = this.columns.map((oldColumn) => {
        return find(nextProps.columns, (column) => {
          return oldColumn.name === column.name;
        });
      });
    } else {
      this.columns = nextProps.columns;
    }
  }

  componentDidUpdate() {
    this.fixScrollbar();
  }

  render() {
    const columns = this.props.selectable ? [this.getSelectorColumn()].concat(this.columns) : this.columns;
    const pager = (
      <Pagination
        offset={this.props.offset}
        limit={this.props.limit}
        total={this.props.total}
        onPageChange={this.props.onPageChange}
        paginationClassName={this.props.paginationClassName}
      />
    );
    const table = (
      <DataGrid
        ref="grid"
        idProperty={this.props.idProperty}
        dataSource={this.props.dataSource}
        columns={columns}
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
    );

    // Append pager
    let components = table;
    if (this.props.pager) {
      if (this.props.pager === 'top') {
        components = createFragment({ pager: pager, table: table });
      } else if (this.props.pager === 'bottom') {
        components = createFragment({ table: table, pager: pager });
      }
    }

    return (
      <div className={classNames('datagrid-wrapper', this.props.wrapperClassName)}>
        {components}
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
  rowHeight: PropTypes.number,
  paginationClassName: PropTypes.string
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

DataTable.Pagination = Pagination;

export default DataTable;
