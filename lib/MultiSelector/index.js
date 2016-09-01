'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AllList = require('./AllList');

var _AllList2 = _interopRequireDefault(_AllList);

var _SelectedList = require('./SelectedList');

var _SelectedList2 = _interopRequireDefault(_SelectedList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MultiSelector = function MultiSelector(props) {
  return _react2.default.createElement(
    'div',
    { className: 'row-gapless' },
    _react2.default.createElement(_AllList2.default, {
      title: props.allListTitle,
      searchBoxPlaceholder: props.searchBoxPlaceholder,
      inheritable: props.inheritable,
      listingItems: props.listingItems,
      selectedItems: props.selectedItems,
      allItems: props.allItems,
      inheritedItems: props.inheritedItems,
      dataTableProps: props.dataTableProps,
      onChange: props.onChange
    }),
    _react2.default.createElement(_SelectedList2.default, {
      title: props.selectedListTitle,
      inheritable: props.inheritable,
      selectedItems: props.selectedItems,
      inheritedItems: props.inheritedItems,
      onChange: props.onChange
    })
  );
};

MultiSelector.propTypes = {
  // All list props
  allListTitle: _react.PropTypes.string.isRequired,
  searchBoxPlaceholder: _react.PropTypes.string.isRequired,
  listingItems: _react.PropTypes.array.isRequired,
  allItems: _react.PropTypes.array.isRequired,
  dataTableProps: _react.PropTypes.shape({
    onQueryChange: _react.PropTypes.func.isRequired,
    columns: _react.PropTypes.array.isRequired,
    total: _react.PropTypes.total,
    query: _react.PropTypes.object.isRequired
  }),
  // Selected list props
  selectedListTitle: _react.PropTypes.string.isRequired,
  // Common props
  inheritable: _react.PropTypes.bool,
  selectedItems: _react.PropTypes.array.isRequired,
  onChange: _react.PropTypes.func.isRequired,
  inheritedItems: _react.PropTypes.array
};

MultiSelector.defaultProps = {
  inheritable: false
};

exports.default = MultiSelector;
module.exports = exports['default'];