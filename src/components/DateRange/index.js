import React, { Component, PropTypes } from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Helpers from './Helpers';
import CustomDialog from './Custom';
import i18n from 'i18next';

const rangeTypes = [
  'custom',
  'today',
  'yesterday',
  'this_week',
  'last_week',
  'last7',
  'last14',
  'this_month',
  'last_month',
  'all_time'
];

class DateRange extends Component{
  constructor() {
    super();
    this.state = {
      showModal: false
    };

    this.handleSelect = (e, value) => {
      const target = e.currentTarget.target;
      const range = Helpers.getUnixOffset({rangeType: target}, this.props.tzName);
      this.props.handleDateRangeChange({
        rangeType: target,
        start_at: range.start_at,
        end_at: range.end_at
      });
    };

    this.handleSelectCustom = (e) => {
      this.setState({showModal: true});
    };

    this.handleCustomCallback = (rangeType, start_at, end_at) => {
      this.props.handleDateRangeChange({
        rangeType: rangeType,
        start_at: start_at,
        end_at: end_at
      });
      this.setState({showModal: false});
    };

    this.handleDialogClose = () => {
      this.setState({showModal: false});
    };
  }

  render() {
    const value = {
      rangeType: this.props.rangeType,
      start_at: this.props.start_at,
      end_at: this.props.end_at
    };
    const title = Helpers.humanizeDateRange(value, this.props.tzName, this.props.dateFormat);

    const options = this.props.rangeTypes.map((rangeType, i) => {
      if (rangeType === 'custom') {
        return (
          <MenuItem
            key={i}
            eventKey={i}
            target={rangeType}
            active={this.props.rangeType === rangeType}
            onSelect={this.handleSelectCustom}
          >
            {i18n.t('common:::dateRange::Custom')}
          </MenuItem>
        );
      }
      return (
        <MenuItem
          key={i}
          eventKey={i}
          target={rangeType}
          active={this.props.rangeType === rangeType}
          onSelect={this.handleSelect}
        >
          { Helpers.humanizeDateRange({rangeType: rangeType}, this.props.tzName, this.props.dateFormat) }
        </MenuItem>
      );
    });

    let customDialog = false;
    if (this.state.showModal) {
      customDialog = (<CustomDialog
        utcOffset={this.props.utcOffset}
        tzName={this.props.tzName}
        dateFormat={this.props.dateFormat}
        show={this.state.showModal}
        onHide={this.handleDialogClose}
        onSubmit={this.handleCustomCallback}
        start_at={this.props.rangeType === 'custom' ? this.props.start_at : undefined}
        end_at={this.props.rangeType === 'custom' ? this.props.end_at : undefined}
      />);
    }
    return (
      <span>
        <Dropdown
          pullRight
          id='date-range-type-dropdown'
          bsStyle='default'
          ref='dropdownButton'
          key={0}
          className={this.props.className}
        >
          <Dropdown.Toggle
            className={this.props.buttonClassName}
            disabled={this.props.disabled}
          >
            {title}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {options}
          </Dropdown.Menu>
        </Dropdown>
        {customDialog}
      </span>
    );
  }
}

DateRange.propTypes = {
  utcOffset: PropTypes.number.isRequired,
  tzName: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  rangeType: PropTypes.string.isRequired,
  rangeTypes: PropTypes.array,
  start_at: PropTypes.number,
  end_at: PropTypes.number,
  handleDateRangeChange: PropTypes.func,
  disabled: PropTypes.bool, // set true will disabled date range
  className: PropTypes.string,
  buttonClassName: PropTypes.string
};

DateRange.defaultProps = {
  rangeTypes: rangeTypes,
  rangeType: 'today',
  tzName: 'GMT',
  dateFormat: 'YYYY/MM/DD',
  disabled: false
};

DateRange.DateHelpers = Helpers;
DateRange.rangeTypes = rangeTypes;

export default DateRange;
