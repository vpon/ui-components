import isNumber from 'lodash/lang/isNumber';
import isNaN from 'lodash/lang/isNaN';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';

const NO_BREAK_SPACE = '\u00a0';

class Pager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: props.page
    };

    this.handleClickPage = (dir) => {
      let page;
      if (dir === 'next') {
        page = Math.min(this.props.page + 1, this.props.maxPage);
      } else {
        page = Math.max(this.props.page - 1, this.props.minPage);
      }
      this.changePage({page: page, pageSize: this.props.pageSize});
    };

    this.handleEnterPage = (e) => {
      const page = parseInt(e.target.value, 10);
      if (isNumber(page) && !isNaN(page) && this.props.minPage <= page && page <= this.props.maxPage) {
        this.changePage({page: page, pageSize: this.props.pageSize});
      } else {
        this.setState({page: ''});
      }
    };

    this.handleChangePageSize = (e) => {
      const pageSize = parseInt(e.target.value, 10);
      if (pageSize !== this.props.pageSize) {
        this.changePage({page: this.props.minPage, pageSize: pageSize});
      }
    };

    this.changePage = (pageInfo) => {
      const offset = (pageInfo.page - 1) * pageInfo.pageSize;
      // Update page number field
      this.setState({page: pageInfo.page});
      this.props.onPageChange({limit: pageInfo.pageSize, offset: offset});
    };
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.page !== props.page) {
      this.setState({page: nextProps.page});
    }
  }

  render() {
    let PageSizeSelector;
    if (this.props.pageSizes) {
      PageSizeSelector = (
        <select value={this.props.pageSize} onChange={this.handleChangePageSize}>
          {this.props.pageSizes.map((size) => {
            return (<option key={size} value={size}>{size}</option>);
          })}
        </select>
      );
    }
    return (
      <div className='datagrid-pager text-right'>
        {PageSizeSelector}
        {NO_BREAK_SPACE}
        <Button disabled={this.props.page === this.props.minPage} onClick={this.handleClickPage.bind(this, 'prev')}><i className="fa fa-caret-left"></i></Button>
        {NO_BREAK_SPACE}
        <input type='text' className='form-width-xs text-center' ref='pageNoInput' value={this.state.page} onChange={this.handleEnterPage}/>
        {NO_BREAK_SPACE}
        of <span>{this.props.maxPage}</span>
        {NO_BREAK_SPACE}
        <Button disabled={this.props.page === this.props.maxPage || this.props.maxPage === 0} onClick={this.handleClickPage.bind(this, 'next')}><i className="fa fa-caret-right"></i></Button>
      </div>
    );
  }
}

Pager.propTypes = {
  page: React.PropTypes.number.isRequired,
  pageSize: React.PropTypes.number.isRequired,
  pageSizes: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool
  ]),
  dataSourceCount: React.PropTypes.number.isRequired,
  minPage: React.PropTypes.number.isRequired,
  maxPage: React.PropTypes.number.isRequired,
  onPageChange: React.PropTypes.func.isRequired
};

class Pagination extends Component {
  render() {
    const page = (this.props.offset === 0 ? 1 : Math.ceil(this.props.offset / this.props.limit + 1));
    const maxPage = Math.ceil(this.props.total / this.props.limit);

    return (
      <Pager
        page={page}
        pageSize={this.props.limit}
        pageSizes={this.props.pageSizes}
        dataSourceCount={this.props.total}
        minPage={1}
        maxPage={maxPage}
        onPageChange={this.props.onPageChange}
      />
    );
  }
}

Pagination.propTypes = {
  limit: React.PropTypes.number,
  pageSizes: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool
  ]),
  total: React.PropTypes.number,
  onPageChange: React.PropTypes.func,
  offset: React.PropTypes.number
};

Pagination.defaultProps = {
  pageSizes: [25, 50, 100]
};

export default Pagination;
