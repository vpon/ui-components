import React, { Component } from 'react';
import Link from 'react-router/lib/Link';

const BreadcrumbItem = (props) => (
  <li {...props}>{props.children}</li>
);

const Breadcrumb = (props) => (
  <ol className='breadcrumb'>
    <BreadcrumbItem className='bc__home'>
      <Link to='/'><i className="fa fa-home"></i></Link>
    </BreadcrumbItem>
    {props.children}
  </ol>
);

Breadcrumb.BreadcrumbItem = BreadcrumbItem;

export default Breadcrumb;
