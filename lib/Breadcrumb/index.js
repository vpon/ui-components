'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Link = require('react-router/lib/Link');

var _Link2 = _interopRequireDefault(_Link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BreadcrumbItem = function BreadcrumbItem(props) {
  return _react2.default.createElement(
    'li',
    props,
    props.children
  );
};

var Breadcrumb = function Breadcrumb(props) {
  return _react2.default.createElement(
    'ol',
    { className: 'breadcrumb' },
    _react2.default.createElement(
      BreadcrumbItem,
      { className: 'bc__home' },
      _react2.default.createElement(
        _Link2.default,
        { to: '/' },
        _react2.default.createElement('i', { className: 'fa fa-home' })
      )
    ),
    props.children
  );
};

Breadcrumb.BreadcrumbItem = BreadcrumbItem;

exports.default = Breadcrumb;
module.exports = exports['default'];