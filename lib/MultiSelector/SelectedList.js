'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _remove = require('lodash/array/remove');

var _remove2 = _interopRequireDefault(_remove);

var _find = require('lodash/collection/find');

var _find2 = _interopRequireDefault(_find);

var _isEmpty = require('lodash/lang/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _cloneDeep = require('lodash/lang/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _InfoDialog = require('../InfoDialog');

var _InfoDialog2 = _interopRequireDefault(_InfoDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint eqeqeq: "off" */


var SelectedList = function (_Component) {
  _inherits(SelectedList, _Component);

  function SelectedList() {
    _classCallCheck(this, SelectedList);

    var _this = _possibleConstructorReturn(this, (SelectedList.__proto__ || Object.getPrototypeOf(SelectedList)).call(this));

    _this.state = {
      showRemoveAll: false
    };

    _this.handleRemove = function (id, parentId) {
      var selectedItems = (0, _cloneDeep2.default)(_this.props.selectedItems);
      if (parentId) {
        var parentItem = (0, _find2.default)(selectedItems, function (i) {
          return i.id == parentId;
        });
        (0, _remove2.default)(parentItem.children, function (i) {
          return i.id == id;
        });
        if ((0, _isEmpty2.default)(parentItem.children)) {
          var isInherited = (0, _find2.default)(_this.props.inheritedItems, function (i) {
            return i.id == parentId;
          });
          if (isInherited) {
            (0, _remove2.default)(selectedItems, function (i) {
              return i.id == parentId;
            });
          }
        }
      } else {
        (0, _remove2.default)(selectedItems, function (i) {
          return i.id == id;
        });
      }
      _this.props.onChange(selectedItems);
    };

    _this.handleRemoveAll = function () {
      _this.setState({ showRemoveAll: true });
    };

    _this.handleClose = function () {
      _this.setState({ showRemoveAll: false });
    };

    _this.handleSubmit = function () {
      _this.props.onChange([]);
      _this.handleClose();
    };
    return _this;
  }

  _createClass(SelectedList, [{
    key: 'renderRemoveBtn',
    value: function renderRemoveBtn(id, parentId) {
      return _react2.default.createElement(
        'button',
        {
          type: 'button',
          className: 'close',
          'aria-label': 'Delete',
          onClick: this.handleRemove.bind(this, id, parentId)
        },
        _react2.default.createElement(
          'span',
          { 'aria-hidden': 'true' },
          '\xD7'
        )
      );
    }
  }, {
    key: 'renderSubItems',
    value: function renderSubItems(item, inheritedItem) {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'callout-child' },
        item.children.map(function (subItem) {
          var isInherited = inheritedItem ? (0, _find2.default)(inheritedItem.children, function (i) {
            return i.id == subItem.id;
          }) : false;
          return _react2.default.createElement(
            'div',
            { className: 'callout text-hidden callout-success text-success', key: subItem.id },
            isInherited ? null : _this2.renderRemoveBtn(subItem.id, item.id),
            subItem.name
          );
        })
      );
    }
  }, {
    key: 'renderItem',
    value: function renderItem(item, inheritedItem) {
      var hasChildren = !(0, _isEmpty2.default)(item.children);
      var inheritLabel = _react2.default.createElement(
        'span',
        { className: (0, _classnames2.default)('label pull-right', { 'label-success': !hasChildren, 'label-default': hasChildren }) },
        this.props.inheritText
      );

      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('callout text-hidden', { 'callout-success text-success': !hasChildren, 'callout-default': hasChildren }), key: item.id },
        inheritedItem ? inheritLabel : this.renderRemoveBtn(item.id),
        item.name,
        hasChildren && !(inheritedItem && (0, _isEmpty2.default)(inheritedItem.children)) && this.renderSubItems(item, inheritedItem)
      );
    }
  }, {
    key: 'renderItems',
    value: function renderItems(allItems, inheritedItems) {
      var _this3 = this;

      return allItems.map(function (item) {
        var inheritedItem = (0, _find2.default)(inheritedItems, { 'id': item.id });
        return _this3.renderItem(item, inheritedItem);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'panel panel-default pick-panel col-xs-6' },
        _react2.default.createElement(
          'div',
          { className: 'panel-heading' },
          (0, _isEmpty2.default)(this.props.selectedItems) ? null : _react2.default.createElement(
            'button',
            { type: 'button', className: 'btn btn-default btn-sm pull-right', onClick: this.handleRemoveAll },
            this.props.removeAllLabel
          ),
          _react2.default.createElement(
            'strong',
            null,
            this.props.title
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'picked-items picked-items__height-' + (this.props.showBreadCrumb ? 'breadcrumb' : 'default') },
          this.renderItems(this.props.allSelectedItems, this.props.inheritedItems)
        ),
        _react2.default.createElement(_InfoDialog2.default, {
          show: this.state.showRemoveAll,
          title: _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement('i', { className: 'fa fa-exclamation-triangle' }),
            '\xA0',
            this.props.removeAllWarningTitle
          ),
          message: _react2.default.createElement(
            'span',
            { className: 'text-warning' },
            this.props.removeAllWarningMessage
          ),
          dialogClassName: 'modal-warning',
          onHide: this.handleClose,
          onSubmit: this.handleSubmit,
          submitText: this.props.removeAllWaringSubmitText,
          cancelText: this.props.removeAllWaringCancelText,
          submitStyle: 'default'
        }),
        this.state.showRemoveAll ? _react2.default.createElement('div', { className: 'modal-backdrop in' }) : null
      );
    }
  }]);

  return SelectedList;
}(_react.Component);

SelectedList.propTypes = {
  showBreadCrumb: _react.PropTypes.bool,
  title: _react.PropTypes.string.isRequired,
  removeAllLabel: _react.PropTypes.string.isRequired,
  selectedItems: _react.PropTypes.array.isRequired,
  onChange: _react.PropTypes.func.isRequired,
  removeAllWarningTitle: _react.PropTypes.string,
  removeAllWarningMessage: _react.PropTypes.node,
  removeAllWaringSubmitText: _react.PropTypes.string,
  removeAllWaringCancelText: _react.PropTypes.string,
  inheritedItems: _react.PropTypes.array,
  inheritable: _react.PropTypes.bool,
  inheritText: _react.PropTypes.string,
  allSelectedItems: _react.PropTypes.array
};

SelectedList.defaultProps = {
  inheritedItems: [],
  inheritText: 'Placement Group-Level Setting',
  removeAllWarningTitle: 'Warning!',
  removeAllWarningMessage: 'Are you sure you want to remove all selected items?',
  removeAllWaringSubmitText: 'OK'
};

exports.default = SelectedList;
module.exports = exports['default'];