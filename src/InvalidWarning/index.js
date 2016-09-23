import React, { Component, PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

class InvalidWarning extends Component {
  render () {
    if (this.props.errorMessages && this.props.errorMessages.length > 0) {
      return (
        <OverlayTrigger placement="right" overlay={<Tooltip id="1">{this.props.errorMessages.join(', ')}</Tooltip>}>
          <i className={`fa fa-exclamation-triangle fa-lg text-danger ${this.props.iconClassName || ''}`}/>
        </OverlayTrigger>
      );
    }
    return false;
  }
}

InvalidWarning.propTypes = {
  errorMessages: PropTypes.arrayOf(PropTypes.string),
  iconClassName: PropTypes.string
};

export default InvalidWarning;
