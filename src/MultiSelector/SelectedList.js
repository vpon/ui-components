/* eslint eqeqeq: "off" */
import remove from 'lodash/array/remove';
import find from 'lodash/collection/find';
import isEmpty from 'lodash/lang/isEmpty';
import cloneDeep from 'lodash/lang/cloneDeep';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import InfoDialog from '../InfoDialog';

class SelectedList extends Component {
  constructor() {
    super();

    this.state = {
      showRemoveAll: false
    };

    this.handleRemove = (id, parentId) => {
      let selectedItems = cloneDeep(this.props.selectedItems);
      if (parentId) {
        const parentItem = find(selectedItems, i => { return i.id == parentId; });
        remove(parentItem.children, i => { return i.id == id; });
        if (isEmpty(parentItem.children)) {
          const isInherited = find(this.props.inheritedItems, i => { return i.id == parentId });
          if (isInherited) {
            remove(selectedItems, i => { return i.id == parentId; });
          }
        }
      } else {
        remove(selectedItems, i => { return i.id == id; });
      }
      this.props.onChange(selectedItems);
    };

    this.handleRemoveAll = () => {
      this.setState({showRemoveAll: true});
    };

    this.handleClose = () => {
      this.setState({showRemoveAll: false});
    };

    this.handleSubmit = () => {
      this.props.onChange([]);
      this.handleClose();
    };
  }

  renderRemoveBtn(id, parentId) {
    return (
      <button
        type="button"
        className="close"
        aria-label="Delete"
        onClick={this.handleRemove.bind(this, id, parentId)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    );
  }

  renderSubItems(item, inheritedItem) {
    return (
      <div className="callout-child">
        {item.children.map(subItem => {
          const isInherited = inheritedItem ? find(inheritedItem.children, i => { return i.id == subItem.id }) : false;
          return (
            <div className="callout text-hidden callout-success text-success" key={subItem.id}>
              {isInherited ? null : this.renderRemoveBtn(subItem.id, item.id)}
              {subItem.name}
            </div>
          );
        })}
      </div>
    );
  }

  renderItem(item, inheritedItem) {
    const hasChildren = !isEmpty(item.children);
    const inheritLabel = <span className={classNames('label pull-right', {'label-success': !hasChildren, 'label-default': hasChildren})}>{this.props.inheritText}</span>;

    return (
      <div className={classNames('callout text-hidden', {'callout-success text-success': !hasChildren, 'callout-default': hasChildren })} key={item.id}>
        {inheritedItem ? inheritLabel : this.renderRemoveBtn(item.id)}
        {item.name}
        {hasChildren && !(inheritedItem && isEmpty(inheritedItem.children)) && this.renderSubItems(item, inheritedItem)}
      </div>
    );
  }

  renderItems(allItems, inheritedItems) {
    return allItems.map(item => {
      const inheritedItem = find(inheritedItems, { 'id': item.id });
      return this.renderItem(item, inheritedItem);
    });
  }

  render() {
    return (
      <div className="panel panel-default pick-panel col-xs-6">
        <div className="panel-heading">
          {
            isEmpty(this.props.selectedItems) ?
            null :
            <button type="button" className="btn btn-default btn-sm pull-right" onClick={this.handleRemoveAll}>
              {this.props.removeAllLabel}
            </button>
          }
          <strong>{this.props.title}</strong>
        </div>
        <div className={`picked-items picked-items__height-${this.props.showBreadCrumb ? 'breadcrumb' : 'default'}`}>
          {this.renderItems(this.props.allSelectedItems, this.props.inheritedItems)}
        </div>
        <InfoDialog
          show={this.state.showRemoveAll}
          title={<span>
                  <i className="fa fa-exclamation-triangle"></i>&nbsp;{this.props.removeAllWarningTitle}
                </span>}
          message={<span className="text-warning">{this.props.removeAllWarningMessage}</span>}
          dialogClassName="modal-warning"
          onHide={this.handleClose}
          onSubmit={this.handleSubmit}
          submitText={this.props.removeAllWaringSubmitText}
          submitStyle="default"
        />
      </div>
    );
  }
}

SelectedList.propTypes = {
  showBreadCrumb: PropTypes.bool,
  title: PropTypes.string.isRequired,
  removeAllLabel: PropTypes.string.isRequired,
  selectedItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  removeAllWarningTitle: PropTypes.string,
  removeAllWarningMessage: PropTypes.node,
  removeAllWaringSubmitText: PropTypes.string,
  inheritedItems: PropTypes.array,
  inheritable: PropTypes.bool,
  inheritText: PropTypes.string,
  allSelectedItems: PropTypes.array
};

SelectedList.defaultProps = {
  inheritedItems: [],
  inheritText: 'Placement Group-Level Setting',
  removeAllWarningTitle: 'Warning!',
  removeAllWarningMessage: 'Are you sure you want to remove all selected items?',
  removeAllWaringSubmitText: 'OK'
};

export default SelectedList;
