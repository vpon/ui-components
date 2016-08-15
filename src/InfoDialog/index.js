import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import i18n from 'i18next';

// dialog for show message
class InfoDialog extends Component{
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} backdrop="static" animation={false} bsSize={this.props.bsSize} dialogClassName={this.props.dialogClassName}>
        <Modal.Header closeButton bsClass={this.props.headerClassName}>
          <Modal.Title bsClass={this.props.titleClassName}>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body bsClass={this.props.bodyClassName} style={this.props.bodyStyle}>
          {this.props.message}
        </Modal.Body>
        <Modal.Footer bsClass={this.props.footerClassName}>
          { this.props.hasCancelButton ? <Button data-dismiss="modal" onClick={this.props.onHide}>{i18n.t('common:::Cancel')}</Button> : null}
          <Button bsStyle="primary" data-dismiss="modal" onClick={this.props.onSubmit}>{i18n.t('common:::OK')}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

InfoDialog.propTypes = {
  show: PropTypes.bool.isRequired, // Trigger
  title: PropTypes.node.isRequired, // Modal title
  message: PropTypes.node.isRequired, // Modal body message
  onHide: PropTypes.func.isRequired, // Function for close dialog
  onSubmit: PropTypes.func.isRequired, // Fuction for dialog submit
  dialogClassName: PropTypes.string, // Modal dialogClassName
  bodyStyle: PropTypes.object, // Modal body style
  hasCancelButton: PropTypes.bool, // Set to false to remove Cancel Button
  headerClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  bsSize: PropTypes.string
};

InfoDialog.defaultProps = {
  hasCancelButton: true,
  dialogClassName: '',
  headerClassName: 'modal-header',
  titleClassName: 'modal-title',
  bodyClassName: 'modal-body',
  footerClassName: 'modal-footer',
  bsSize: 'small'
};

export default InfoDialog;
