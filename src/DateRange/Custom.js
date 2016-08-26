import $ from 'jquery';
import './jquery.ui.datepicker.js';
import uniq from 'lodash/array/uniq';
import React, { Component, PropTypes} from 'react';
import { findDOMNode } from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import moment from 'moment-timezone';
import i18n from 'i18next';

const NO_BREAK_SPACE = '\u00a0';

class CustomDialog extends Component{
  constructor(props) {
    super(props);

    this.state = {
      focusOn: 'start',
      startText: moment.tz(props.start_at, props.tzName).format(props.dateFormat) || '',
      endText: (props.end_at && moment.tz(props.end_at, props.tzName).format(props.dateFormat)) || '',
      defaultDate: moment.tz(props.start_at, props.tzName).format(props.dateFormat)
    };

    this.handleChangeDate = (date) => {
      let startText;
      let endText;
      let focusOn = this.state.focusOn;
      if (this.state.focusOn === 'start') {
        endText = this.state.endText;
        if (!endText || date <= endText) {
          startText = date;
          focusOn = 'end';
        } else {
          startText = '';
        }
      } else if (this.state.focusOn === 'end') {
        startText = this.state.startText;
        if (!startText || date >= startText) {
          endText = date;
        } else {
          endText = '';
        }
      }
      this.setState({
        startText: startText,
        endText: endText,
        focusOn: focusOn
      });
    };

    this.handleFocusChange = (e) => {
      const input = e.target;
      if (this.state.focusOn !== input.name) {
        this.setState({
          focusOn: input.name,
          defaultDate: input.value
        });
      }
    };

    this.handleInputChange = (e) => {
      const input = e.currentTarget;
      let newState = {};
      newState[`${input.name}Text`] = input.value;
      if (moment(input.value, this.props.dateFormat, true).isValid()) {
        newState['defaultDate'] = input.value;
      }
      this.setState(newState);
    };

    this.handleInputBlur = (e) => {
      const input = e.currentTarget;
      const date = input.value;
      const isValid = moment(date, this.props.dateFormat, true).isValid();
      if (isValid) {
        this.handleChangeDate(date);
      } else {
        let newState = {};
        newState[input.name] = null;
        newState[`${input.name}Text`] = '';
        this.setState(newState);
        $(findDOMNode(this)).find('#date_range_datepicker').datepicker('setDate', null);
      }
    };

    this.handleApply = () => {
      this.props.onHide();
      const start = moment.tz(this.state.startText, this.props.dateFormat, this.props.tzName).startOf('day').valueOf();
      const end = moment.tz(this.state.endText, this.props.dateFormat, this.props.tzName).endOf('day').valueOf();

      this.props.onSubmit('custom', start, end);
    };

    this.setupDatepicker = () => {
      const self = this;
      const $dialog = $('#date_range_custom_dialog');
      const $datepicker = $dialog.find('#date_range_datepicker');

      // Foucs input
      $dialog.find(`input[name="${this.state.focusOn}"]`).trigger('focus');
      // Reset datepicker
      $datepicker.datepicker('destroy');
      $datepicker.datepicker({
        numberOfMonths: 3,
        dateFormat: 'yy/mm/dd',
        showButtonPanel: false,
        utcOffset: self.props.utcOffset,
        defaultDate: self.state.defaultDate,
        beforeShowDay(date) {
          let cssClasses = [];
          const selectedDate = $.datepicker.formatDate('yy/mm/dd', date);

          if (selectedDate === self.state.startText) {
            cssClasses.push('day-in-range');
            cssClasses.push('day-start');
          }
          if (self.state.startText <= selectedDate && self.state.endText > selectedDate) {
            cssClasses.push('day-in-range');
          } else if (self.state.endText === selectedDate) {
            cssClasses.push('day-in-range');
            cssClasses.push('day-end');
          }
          return [true, uniq(cssClasses).join(' ')];
        },
        onSelect(date) {
          self.handleChangeDate(date);
          return false;
        }
      });
    };
  }

  componentDidMount() {
    this.setupDatepicker();
    $('#date_range_custom_dialog').on('change', 'input', (e) => {
      this.handleInputBlur(e);
    });
  }

  componentDidUpdate() {
    this.setupDatepicker();
  }

  componentWillUnmount() {
    $(findDOMNode(this)).find('#date_range_datepicker').datepicker('destroy');
  }

  render() {
    const disableSubmit = (this.state.startText && this.state.endText) ? false : true;
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} bsSize="large" id="date_range_custom_dialog" backdrop="static" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.t('common:::dateRange::Custom Date Range')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group text-center">
            <input
              type="text"
              name="start"
              id="start"
              value={this.state.startText}
              onFocus={this.handleFocusChange}
              onChange={this.handleInputChange}
              placeholder={this.props.dateFormat}
            />
            {NO_BREAK_SPACE}～{NO_BREAK_SPACE}
            <input
              type="text"
              name="end"
              id="end"
              value={this.state.endText}
              onFocus={this.handleFocusChange}
              onChange={this.handleInputChange}
              placeholder={this.props.dateFormat}
            />
          </div>
          <div id="date_range_datepicker" />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.handleApply} disabled={disableSubmit}>{i18n.t('common:::Apply')}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CustomDialog.propTypes = {
  utcOffset: PropTypes.number.isRequired,
  tzName: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  start_at: PropTypes.number,
  end_at: PropTypes.number
};

export default CustomDialog;
