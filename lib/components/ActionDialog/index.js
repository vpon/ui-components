'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _sortByOrder = require('lodash/collection/sortByOrder');

var _sortByOrder2 = _interopRequireDefault(_sortByOrder);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Modal = require('react-bootstrap/lib/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Helpers = require('../../utils/Helpers');

var _Helpers2 = _interopRequireDefault(_Helpers);

var _DataTable = require('../DataTable');

var _DataTable2 = _interopRequireDefault(_DataTable);

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// dialog for action, contain datatable
var ActionDialog = function (_Component) {
  _inherits(ActionDialog, _Component);

  function ActionDialog(props) {
    _classCallCheck(this, ActionDialog);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ActionDialog).call(this, props));

    _this.state = {
      offset: props.offset,
      limit: props.limit,
      order: props.order
    };

    _this.handlePageChange = function (newQuery) {
      var query = (0, _assign2.default)({}, _this.state, newQuery);
      _this.setState(query);
    };

    _this.getData = function (offset, limit, orderStr) {
      var order = _Helpers2.default.arrayifySort(orderStr)[0];
      return (0, _sortByOrder2.default)(_this.props.dataSource, order.name, order.dir).slice(offset, offset + limit);
    };
    return _this;
  }

  // 15*2: modal body padding
  // 45: head 25+10*2(padding)
  // 33: table head 32 + 1
  // 58: table pagination 56 + 2
  // 20: table margin bottom
  // 57: Warning 42 + 15 padding


  _createClass(ActionDialog, [{
    key: 'render',
    value: function render() {
      var pageDataSource = this.getData(this.state.offset, this.state.limit, this.state.order);
      var maxHeight = 15 * 2 + 45 + 33 + (this.props.rowHeight || 31) * pageDataSource.length + 58 + 20;
      if (this.props.warning) {
        maxHeight += 57;
      }
      return _react2.default.createElement(
        _Modal2.default,
        {
          show: this.props.show,
          onHide: this.props.onHide,
          backdrop: 'static',
          animation: false,
          bsSize: this.props.bsSize,
          dialogClassName: this.props.dialogClassName
        },
        _react2.default.createElement(
          _Modal2.default.Header,
          { closeButton: true, modalClassName: this.props.headerClassName },
          _react2.default.createElement(
            _Modal2.default.Title,
            { modalClassName: this.props.titleClassName },
            this.props.title
          )
        ),
        _react2.default.createElement(
          _Modal2.default.Body,
          { modalClassName: this.props.bodyClassName, style: (0, _assign2.default)({}, this.props.bodyStyle, { maxHeight: maxHeight }) },
          this.props.warning,
          _react2.default.createElement(
            'div',
            { className: 'panel panel-default' },
            _react2.default.createElement(_DataTable2.default, {
              offset: this.state.offset,
              limit: this.state.limit,
              total: this.props.dataSource.length,
              dataSource: pageDataSource,
              onPageChange: this.handlePageChange,
              columns: this.props.columns,
              sortInfo: _Helpers2.default.arrayifySort(this.state.order),
              selectable: false,
              resizableColumns: false,
              pager: false,
              style: { height: (this.props.rowHeight || 31) * pageDataSource.length + 32 },
              scrollbarSize: 2,
              rowHeight: this.props.rowHeight
            }),
            _react2.default.createElement(
              'div',
              { className: 'panel-footer text-right' },
              _react2.default.createElement(_DataTable.Pagination, {
                offset: this.state.offset,
                limit: this.state.limit,
                total: this.props.dataSource.length,
                onPageChange: this.handlePageChange,
                pageSizes: false
              })
            )
          )
        ),
        _react2.default.createElement(
          _Modal2.default.Footer,
          { modalClassName: this.props.footerClassName },
          this.props.hasCancelButton ? _react2.default.createElement(
            _Button2.default,
            { 'data-dismiss': 'modal', onClick: this.props.onHide },
            _i18next2.default.t('common:::Cancel')
          ) : null,
          _react2.default.createElement(
            _Button2.default,
            { bsStyle: 'primary', 'data-dismiss': 'modal', onClick: this.props.onSubmit },
            _i18next2.default.t('common:::OK')
          )
        )
      );
    }
  }]);

  return ActionDialog;
}(_react.Component);

ActionDialog.propTypes = {
  show: _react.PropTypes.bool.isRequired, // Trigger
  offset: _react.PropTypes.number, // Offset params for calculate pagination staffs.
  limit: _react.PropTypes.number, // Page size
  order: _react.PropTypes.string, // Sort info
  title: _react.PropTypes.node.isRequired, // Modal title
  warning: _react.PropTypes.node, // Modal warning
  columns: _react.PropTypes.array.isRequired, // Columns
  dataSource: _react.PropTypes.array.isRequired, // Data
  onHide: _react.PropTypes.func.isRequired, // Function for close dialog
  onSubmit: _react.PropTypes.func.isRequired, // Function for click OK button
  dialogClassName: _react.PropTypes.string, // Modal dialogClassName
  bodyStyle: _react.PropTypes.object, // Modal body style
  hasCancelButton: _react.PropTypes.bool, // Set to false to remove Cancel Button
  headerClassName: _react.PropTypes.string,
  titleClassName: _react.PropTypes.string,
  bodyClassName: _react.PropTypes.string,
  footerClassName: _react.PropTypes.string,
  bsSize: _react.PropTypes.string,
  rowHeight: _react.PropTypes.number
};

ActionDialog.defaultProps = {
  offset: 0,
  limit: 10,
  order: 'id,desc',
  warning: '',
  hasCancelButton: true,
  dialogClassName: '',
  headerClassName: 'modal-header',
  titleClassName: 'modal-title',
  bodyClassName: 'modal-body',
  footerClassName: 'modal-footer',
  bsSize: 'medium',
  bodyStyle: {}
};

exports.default = ActionDialog;
module.exports = exports['default'];