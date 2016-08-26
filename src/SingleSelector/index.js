import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import find from 'lodash/collection/find';
import DataTable, { Pagination } from '../DataTable';
import SearchBox from '../SearchBox';
import Helpers from '../utils/Helpers';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

class SingleSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };

    this.radioColumn = {
      name: 'radio',
      title: ' ',
      sortable: false,
      width: 35,
      style: { textAlign: 'center' },
      render: (value, data) => {
        return (
          <input
            type="radio"
            value={data.id}
            onChange={this.handleChange}
            checked={this.props.selectedId && (this.props.selectedId.toString() === data.id.toString())}
          />
        );
      }
    };

    this.handleCollapse = () => {
      this.setState({expanded: !this.state.expanded});
    };

    this.handleStateChange = (value) => {
      this.props.dataTableProps.onQueryChange({state: value});
    };

    this.handleChange = e => {
      e.preventDefault();
      this.props.onChange(parseInt(e.target.value, 10));
      this.setState({expanded: false});
    };
  }

  renderSearchBar() {
    const currentState = this.props.dataTableProps.query.state;
    const searchBox = (<SearchBox
      handleQueryChange={this.props.dataTableProps.onQueryChange}
      placeholder={this.props.searchBoxPlaceholder}
    />);
    const stateFilter = (
      <Dropdown className="input-group-btn" id="single-selector-state-filter">
        <Dropdown.Toggle title={Helpers.t(find(this.props.stateItems, 'key', currentState)['value'])} />
        <Dropdown.Menu onSelect={this.handleStateChange}>
          {this.props.stateItems.map(item => {
            return (
             <MenuItem eventKey={item.key} key={item.key} active={currentState === item.key}>{Helpers.t(item.value)}</MenuItem>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );

    if (this.props.filterByState) {
      return (
        <div className="input-group">
          {searchBox}
          {stateFilter}
        </div>
      );
    }
    return searchBox;
  }

  render() {
    const { columns, onQueryChange, dataSource, total, emptyText,  } = this.props.dataTableProps;
    const { offset, limit, order } = this.props.dataTableProps.query;
    const tableColumns = [this.radioColumn].concat(columns);

    return (
      <span>
        <div className={classNames('input-group', 'form-width-md', {'hidden': this.state.expanded})}>
          <span className="input-group-btn">
            <button type="button" className="btn btn-default" disabled={this.props.disabled} onClick={this.handleCollapse}><i className="fa fa-plus"></i></button>
          </span>
          <input className="form-control" type="text" disabled placeholder={this.props.selectedItemLabel} />
        </div>
        <div className={classNames('block', 'block-expandable', 'form-width-md', {'hidden': !this.state.expanded})}>
          <button type="button" className="btn btn-default" onClick={this.handleCollapse}><i className="fa fa-minus"></i></button>
          &nbsp;
          {this.props.title}
          {this.renderSearchBar()}
          {this.props.selectedItemLabel}
          <hr/>
          <div className="table-bordered hack-no-horizontal-scrollbar">
            <DataTable
              onPageChange={onQueryChange}
              selectable={false}
              dataSource={dataSource}
              columns={tableColumns}
              sortInfo={Helpers.arrayifySort(order)}
              pager={false}
              style={{height: 31 * (total > 6 ? 6 : (total === 0 ? 1 : total)) + 28}}
              emptyText={emptyText}
              scrollbarSize={20}
              resizableColumns={false}
            />
          </div>
          <div className="block-expandable__footer text-right">
            <Pagination
              offset={offset}
              limit={limit}
              total={total}
              onPageChange={onQueryChange}
            />
          </div>
        </div>
      </span>
    );
  }
}

SingleSelector.propTypes = {
  disabled: PropTypes.bool,
  selectedId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  searchBoxPlaceholder: PropTypes.string.isRequired,
  filterByState: PropTypes.bool,
  stateItems: PropTypes.array,
  selectedItemLabel: PropTypes.string,
  dataTableProps: PropTypes.shape({
    onQueryChange: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    emptyText: PropTypes.string,
    dataSource: PropTypes.array.isRequired,
    total: PropTypes.total,
    query: PropTypes.shape({
      order: PropTypes.string,
      limit: PropTypes.number,
      offset: PropTypes.number,
      state: PropTypes.string
    })
  })
};

SingleSelector.defaultProps = {
  disabled: false,
  filterByState: false,
  stateItems: [
    {key: '0,1', value: 'common:::state::All'},
    {key: '0', value: 'common:::state::Active'},
    {key: '1', value: 'common:::state::Inactive'}
  ]
};

export default SingleSelector;
