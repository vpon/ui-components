import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import assign from 'lodash/object/assign';
import get from 'lodash/object/get';
import find from 'lodash/collection/find';
import DataTable, { Pagination } from '../DataTable';
import SearchBox from '../SearchBox';
import Helpers from '../utils/Helpers';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import i18n from 'i18next';

class SingleSelector extends Component {
  constructor(props) {
    super(props);

    this.state = assign({},
      props.watchedStore ? props.watchedStore.getState() : {},
      { expanded: false }
    );

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

    this.onChange = () => {
      this.setState(this.props.watchedStore.getState());
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

  componentDidMount() {
    if (this.props.watchedStore) {
      this.props.watchedStore.addChangeListener(this.onChange);
    }
  }

  componentWillUnmount() {
    if (this.props.watchedStore) {
      this.props.watchedStore.removeChangeListener(this.onChange);
    }
  }

  renderSearchBar() {
    const currentState = this.state.query.state;
    const searchBox = (<SearchBox
      handleQueryChange={this.props.dataTableProps.onQueryChange}
      placeholder={this.props.searchBoxPlaceholder}
    />);
    const stateFilter = (
      <Dropdown className="input-group-btn" id="single-selector-state-filter">
        <Dropdown.Toggle title={i18n.t(find(this.props.stateItems, 'key', currentState)['value'])} />
        <Dropdown.Menu onSelect={this.handleStateChange}>
          {this.props.stateItems.map(item => {
            return (
             <MenuItem eventKey={item.key} key={item.key} active={currentState === item.key}>{i18n.t(item.value)}</MenuItem>
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
    const { columns, query, onQueryChange, keyOfDataSource, keyOfTotal, emptyText } = this.props.dataTableProps;
    const total = get(this.state, keyOfTotal);
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
              dataSource={get(this.state, keyOfDataSource)}
              columns={tableColumns}
              sortInfo={Helpers.arrayifySort(query.order)}
              pager={false}
              style={{height: 31 * (total > 6 ? 6 : (total === 0 ? 1 : total)) + 32}}
              emptyText={emptyText}
              scrollbarSize={20}
              resizableColumns={false}
            />
          </div>
          <div className="block-expandable__footer text-right">
            <Pagination
              offset={query.offset}
              limit={query.limit}
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
  watchedStore: PropTypes.object,
  dataTableProps: PropTypes.shape({
    query: PropTypes.shape({
      offset: PropTypes.number,
      limit: PropTypes.number,
      order: PropTypes.string,
      state: PropTypes.string
    }),
    onQueryChange: PropTypes.func.isRequired,
    keyOfTotal: PropTypes.string.isRequired,
    keyOfDataSource: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    emptyText: PropTypes.string
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
