import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import find from 'lodash/collection/find';
import DataTable from '../DataTable';
import SearchBox from '../SearchBox';
import Helpers from '../utils/Helpers';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Button from 'react-bootstrap/lib/Button';

class SingleSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: props.expanded };

    this.radioColumn = {
      name: 'radio',
      title: ' ',
      sortable: false,
      width: 30,
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
      keyword={this.props.dataTableProps.query.keyword}
    />);
    const stateFilter = (
      <Dropdown className="input-group-btn" id="single-selector-state-filter">
        <Dropdown.Toggle title={find(this.props.stateItems, 'key', currentState)['value']} />
        <Dropdown.Menu onSelect={this.handleStateChange}>
          {this.props.stateItems.map(item => {
            return (
             <MenuItem eventKey={item.key} key={item.key} active={currentState === item.key}>{item.value}</MenuItem>
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

  renderSelectedItemLabel() {
    if (this.props.selectedItemLabel) {
      return (
        <p><span className="small">{this.props.selectedItemLabel}</span></p>
      );
    }
    return false;
  }

  render() {
    const { columns, onQueryChange, dataSource, total, emptyText,  } = this.props.dataTableProps;
    const { order } = this.props.dataTableProps.query;
    const tableColumns = [this.radioColumn].concat(columns);
    const { warpperClassName } = this.props;

    return (
      <span>
        <div className={classNames('input-group', warpperClassName, {'hidden': this.state.expanded})}>
          <span className="input-group-btn">
            <Button disabled={this.props.disabled} onClick={this.handleCollapse}><i className="fa fa-plus"></i></Button>
          </span>
          <input className="form-control" type="text" disabled placeholder={this.props.inputPlaceholder || this.props.selectedItemLabel} />
        </div>
        <div className={classNames('block', 'block-expandable', warpperClassName, {'hidden': !this.state.expanded})}>
          <Button onClick={this.handleCollapse}><i className="fa fa-minus"></i></Button>
          &nbsp;
          {this.props.title}
          {this.renderSearchBar()}
          {this.renderSelectedItemLabel()}
          <div className="table-bordered hack-no-horizontal-scrollbar">
            <DataTable
              onPageChange={onQueryChange}
              selectable={false}
              dataSource={dataSource}
              columns={tableColumns}
              sortInfo={Helpers.arrayifySort(order)}
              pager={false}
              style={{height: 30 * (total > 10 ? 10 : (total === 0 ? 1 : total)) + 30}}
              emptyText={emptyText}
              scrollbarSize={20}
              resizableColumns={false}
            />
          </div>
          {this.props.children}
        </div>
      </span>
    );
  }
}

SingleSelector.propTypes = {
  warpperClassName: PropTypes.string,
  expanded: PropTypes.bool,
  disabled: PropTypes.bool,
  selectedId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  searchBoxPlaceholder: PropTypes.string.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
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
      state: PropTypes.string,
      keyword: PropTypes.string
    })
  })
};

SingleSelector.defaultProps = {
  warpperClassName: 'form-width-md',
  expanded: false,
  disabled: false,
  filterByState: false,
  stateItems: [
    {key: '0,1', value: 'All'},
    {key: '0', value: 'Active'},
    {key: '1', value: 'Inactive'}
  ]
};

export default SingleSelector;
