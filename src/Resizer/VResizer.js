// Vertical Resizer
import $ from 'jquery';
import React, { Component } from 'react';
import debounce from 'lodash/function/debounce';

class VResizer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dragging: false
    };

    this.stopPropagation = (e) => {
      e.stopPropagation();
    };

    this.handleMouseDown = (e) => {
      e.preventDefault();
      this.setState({dragging: true});

      $(document).off(`mousemove.${this.props.eventScope}`).on(`mousemove.${this.props.eventScope}`, debounce((event) => {
        const $resizer = $(this.refs.resizer);
        const offset = event.pageX - $resizer.offset().left - $resizer.width() / 2;
        let leftWidth = this.props.leftWidth + offset;
        let rightWidth = this.props.rightWidth - offset;
        if (leftWidth < this.props.minLeftWidth) {
          leftWidth = this.props.minLeftWidth;
          rightWidth = this.props.rightWidth + (this.props.leftWidth - this.props.minLeftWidth);
        }
        if (leftWidth > this.props.maxLeftWidth) {
          leftWidth = this.props.maxLeftWidth;
          rightWidth = this.props.rightWidth + (this.props.leftWidth - this.props.maxLeftWidth);
        }
        this.props.onResize(leftWidth, rightWidth);
      }, 10));
    };

    this.handleClick = (e) => {
      let leftWidth;
      let rightWidth;
      e.preventDefault();

      if (this.props.leftOpened) {
        leftWidth = 0;
        rightWidth = this.props.leftWidth + this.props.rightWidth;
      } else {
        leftWidth = this.props.preLeftWidth;
        rightWidth = this.props.preRightWidth;
      }
      this.props.onResize(leftWidth, rightWidth);
    };
  }

  componentDidMount() {
    $(document).on(`mouseup.${this.props.eventScope}`, () => {
      if (this.state.dragging) {
        $(document).off(`mousemove.${this.props.eventScope}`);
        this.setState({dragging: false});
      }
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="ui-layout-resizer ui-layout-resizer-vertical" ref="resizer" onMouseDown={this.handleMouseDown} style={{'float': 'left', width: '0.3%'}}>
        <div className="ui-layout-resizer_toggler" onClick={this.handleClick} onMouseDown={this.stopPropagation}></div>
      </div>
    );
  }
}

VResizer.propTypes = {
  minLeftWidth: React.PropTypes.number,
  maxLeftWidth: React.PropTypes.number,
  eventScope: React.PropTypes.string.isRequired,
  preLeftWidth: React.PropTypes.number.isRequired,
  preRightWidth: React.PropTypes.number.isRequired,
  leftWidth: React.PropTypes.number.isRequired,
  rightWidth: React.PropTypes.number.isRequired,
  leftOpened: React.PropTypes.bool.isRequired,
  onResize: React.PropTypes.func.isRequired
};

VResizer.defaultProps = {
  minLeftWidth: 0,
  maxLeftWidth: 550
};

export default VResizer;
