import React, { Component, PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import _ from 'lodash';

class InvalidWarning extends Component {
  render () {
    const { errorMessages } = this.props;
    if (errorMessages && (!_.isArray(errorMessages) || errorMessages.length > 0)) {
      return (
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="1">
              {_.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages}
            </Tooltip>}
        >
          <i className={`fa fa-exclamation-triangle fa-lg text-danger ${this.props.iconClassName || ''}`}/>
        </OverlayTrigger>
      );
    }
    return false;
  }
}

InvalidWarning.propTypes = {
  errorMessages: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]),
  iconClassName: PropTypes.string
};

export default InvalidWarning;
