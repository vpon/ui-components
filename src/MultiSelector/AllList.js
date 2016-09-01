/* eslint eqeqeq: "off" */
import find from 'lodash/collection/find';
import findIndex from 'lodash/array/findIndex';
import get from 'lodash/object/get';
import cloneDeep from 'lodash/lang/cloneDeep';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import DataTable, { Pagination } from 'ui-components/lib/DataTable';
import SearchBox from '../SearchBox';
import Helpers from '../utils/Helpers';

class AllList extends Component {
  constructor(props) {
    super(props);

    this.getOut = e => {
      e.preventDefault();
      this.props.dataTableProps.onQueryChange({parent_id: null, offset: 0, keyword: null});
    };

    this.handleSelect = item => {
      // if it's inherited, do nothing.
      if (find(this.props.inheritedItems, c => { return c.id == item.id; })) {
        return false;
      }
      let selectedItems = cloneDeep(this.props.selectedItems);
      if (item.parent_id) {
        const parentItem = find(selectedItems, i => { return i.id == item.parent_id; });
        if (parentItem) {
          const subIndex = findIndex(parentItem.children, i => { return i.id == item.id; });
          if (subIndex !== -1) {
            parentItem.children.splice(subIndex, 1);
          } else {
            parentItem.children.push({id: item.id, name: item.name});
          }
        } else {
          const parentItem = find(this.props.allItems, i => { return i.id == item.parent_id; });
          selectedItems.push({
            id: parentItem.id,
            name: parentItem.name,
            children: [{id: item.id, name: item.name}]
          });
        }
      } else {
        const parentIndex = findIndex(selectedItems, i => { return i.id == item.id; });
        if (parentIndex !== -1) {
          selectedItems.splice(parentIndex, 1);
        } else {
          let _item = cloneDeep(item);
          _item.children = [];
          selectedItems.push(_item);
        }
      }
      this.props.onChange(selectedItems);
    };

    this.selectorColumn = {
      name: 'flag',
      title: <i className='fa fa-check-circle fa-lg text-success' />,
      width: 40,
      sortable: false,
      style: { textAlign: 'center' },
      render: (value, data) => {
        const checked = find(this.props.selectedItems, c => { return (c.id == data.id) || find(c.children, i => { return i.id == data.id }); });
        return <i onClick={this.handleSelect.bind(this, data)} className={classNames('fa', 'fa-check-circle', 'fa-lg', {'text-success': checked})}/>;
      }
    };
  }

  renderBreadcrumb() {
    const parentId = this.props.dataTableProps.query.parent_id;
    if (!parentId) {
      return (
        <ol className="breadcrumb">
          <li className="active bc__home" title="home">
            <i className="fa fa-home"></i>
          </li>
        </ol>
      );
    }

    const parentName = get(find(this.props.allItem, i =>{ return i.id == parentId }), 'parent_name')
    return (
      <ol className="breadcrumb">
        <li className="active bc__home" title="home">
          <a onClick={this.getOut}><i className="fa fa-home"></i></a>
        </li>
        <li className="active" title={parentName}>{parentName}</li>
      </ol>
    );

  }

  render() {
    const { onQueryChange, columns, total, query } = this.props.dataTableProps;
    const allColumns = this.props.dataTableProps.parent_id ? columns : [this.selectorColumn].concat(columns);

    return (
      <div className="panel panel-default pick-panel col-xs-6">
        <div className="panel-heading"><strong>{this.props.title}</strong></div>
        <div className="panel-body">
          <SearchBox handleQueryChange={onQueryChange} placeholder={this.props.searchBoxPlaceholder} />
        </div>
        {this.renderBreadcrumb()}
        <div className="items-to-pick">
          <DataTable
            dataSource={this.props.listingItems}
            columns={allColumns}
            sortInfo={Helpers.arrayifySort(query.order)}
            pager={false}
            onPageChange={onQueryChange}
            selectable={false}
            resizableColumns={false}
            style={{height: 30 * 10 + 28}}
            wrapperClassName="table-bordered"
          />
        </div>
        <div className="panel-footer text-right">
          <Pagination
            offset={query.offset}
            limit={query.limit}
            total={total}
            onPageChange={onQueryChange}
            pageSizes={false}
          />
        </div>
      </div>
    );
  }
}

AllList.propTypes = {
  title: PropTypes.string.isRequired,
  searchBoxPlaceholder: PropTypes.string.isRequired,
  listingItems: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  allItems: PropTypes.array.isRequired,
  inheritedItems: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  dataTableProps: PropTypes.shape({
    onQueryChange: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    total: PropTypes.total,
    query: PropTypes.object.isRequired
  })
};

export default AllList;
