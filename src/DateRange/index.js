import React, { Component, PropTypes } from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Helpers from './Helpers';
import CustomDialog from './Custom';

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

    this.handleSelect = (e) => {
      const rangeType = (typeof(e) === 'string') ? e : e.target.value;
      if (rangeType === 'custom') {
        this.setState({showModal: true});
      } else {
        const range = Helpers.getUnixOffset({rangeType: rangeType}, this.props.tzName);
        this.props.handleDateRangeChange({
          rangeType: rangeType,
          start_at: range.start_at,
          end_at: range.end_at
        });
      }
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

  renderRangeTypeOptions() {
    const typeOptions = this.props.rangeTypes.map((rangeType) => {
      const humanRangeType = Helpers.humanizeDateRange({rangeType: rangeType}, this.props.tzName, this.props.dateFormat, this.props.optionsText);
      if (this.props.theme === 'select') {
        return <option value={rangeType} key={rangeType}>{humanRangeType}</option>;
      }
      return <MenuItem key={rangeType} eventKey={rangeType} active={this.props.rangeType === rangeType}>{humanRangeType}</MenuItem>;
    });

    if (this.props.theme === 'select' && this.props.rangeType === 'custom' && this.props.start_at && this.props.end_at) {
      const selectTitle = Helpers.humanizeDateRange(
        {rangeType: this.props.rangeType, start_at: this.props.start_at, end_at: this.props.end_at},
        this.props.tzName,
        this.props.dateFormat,
        this.props.optionsText
      );
      return [<option value='custom' disabled>{selectTitle}</option>].concat(typeOptions);
    }
    return typeOptions;
  }

  renderAsSelect() {
    return (
      <select
        value={this.props.rangeType}
        className={this.props.className}
        disabled={this.props.disabled}
        onChange={this.handleSelect}
      >
        {this.renderRangeTypeOptions()}
      </select>
    );
  }

  renderAsDropdown() {
    const value = {
      rangeType: this.props.rangeType,
      start_at: this.props.start_at,
      end_at: this.props.end_at
    };

    return (
      <Dropdown
        pullRight
        id="date-range-type-dropdown"
        bsStyle="default"
        disabled={this.props.disabled}
        className={this.props.className}
        onSelect={this.handleSelect}
      >
        <Dropdown.Toggle
          className={this.props.buttonClassName}
          title={Helpers.humanizeDateRange(value, this.props.tzName, this.props.dateFormat, this.props.optionsText)}
        />
        <Dropdown.Menu>
          {this.renderRangeTypeOptions()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
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
        title={this.props.customTitle}
        applyText={this.props.customApplyText}
      />);
    }
    return (
      <span>
        {this.props.theme === 'select' ? this.renderAsSelect() : this.renderAsDropdown()}
        {customDialog}
      </span>
    );
  }
}

DateRange.propTypes = {
  theme: PropTypes.string,
  utcOffset: PropTypes.number.isRequired,
  tzName: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  rangeType: PropTypes.string.isRequired,
  customTitle: PropTypes.string.isRequired,
  customApplyText: PropTypes.string.isRequired,
  optionsText: PropTypes.object.isRequired,
  rangeTypes: PropTypes.array,
  start_at: PropTypes.number,
  end_at: PropTypes.number,
  handleDateRangeChange: PropTypes.func,
  disabled: PropTypes.bool, // set true will disabled date range
  className: PropTypes.string,
  buttonClassName: PropTypes.string
};

DateRange.defaultProps = {
  theme: 'dropdown',
  rangeTypes: rangeTypes,
  rangeType: 'today',
  tzName: 'GMT',
  dateFormat: 'YYYY/MM/DD',
  disabled: false
};

DateRange.DateHelpers = Helpers;
DateRange.rangeTypes = rangeTypes;

export default DateRange;
