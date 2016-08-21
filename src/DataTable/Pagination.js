import isNumber from 'lodash/lang/isNumber';
import isNaN from 'lodash/lang/isNaN';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

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
      <div className={classNames('datagrid-pager', this.props.paginationClassName)}>
        {PageSizeSelector}
        &nbsp;
        <Button disabled={this.props.page === this.props.minPage} onClick={this.handleClickPage.bind(this, 'prev')}><i className="fa fa-caret-left"></i></Button>
        &nbsp;
        <input type="text" className="form-width-xs text-center" ref="pageNoInput" value={this.state.page} onChange={this.handleEnterPage}/>
        &nbsp;
        of <span>{this.props.maxPage}</span>
        &nbsp;
        <Button disabled={this.props.page === this.props.maxPage || this.props.maxPage === 0} onClick={this.handleClickPage.bind(this, 'next')}><i className="fa fa-caret-right"></i></Button>
      </div>
    );
  }
}

Pager.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageSizes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool
  ]),
  dataSourceCount: PropTypes.number.isRequired,
  minPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  paginationClassName: PropTypes.string
};

const Pagination = (props) => {
  const page = (props.offset === 0 ? 1 : Math.ceil(props.offset / props.limit + 1));
  const maxPage = Math.ceil(props.total / props.limit);

  return (
    <Pager
      page={page}
      pageSize={props.limit}
      pageSizes={props.pageSizes}
      dataSourceCount={props.total}
      minPage={1}
      maxPage={maxPage}
      onPageChange={props.onPageChange}
      paginationClassName={props.paginationClassName}
    />
  );
}

Pagination.propTypes = {
  limit: PropTypes.number,
  pageSizes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool
  ]),
  total: PropTypes.number,
  onPageChange: PropTypes.func,
  offset: PropTypes.number,
  paginationClassName: PropTypes.string
};

Pagination.defaultProps = {
  pageSizes: [25, 50, 100]
};

export default Pagination;
