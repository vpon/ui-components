// Horizontal Resizer
import React, { Component, PropTypes } from 'react';
import debounce from 'lodash/function/debounce';

class HResizer extends Component {
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
        const offset = event.pageY - $resizer.offset().top - $resizer.height() / 2;
        let topHeight = this.props.topHeight + offset;
        let bottomHeight = this.props.bottomHeight - offset;
        if (bottomHeight < this.props.minBottomHeight) {
          bottomHeight = this.props.minBottomHeight;
          topHeight = this.props.topHeight + (this.props.bottomHeight - this.props.minBottomHeight);
        }

        if (bottomHeight > this.props.maxBottomHeight) {
          bottomHeight = this.props.maxBottomHeight;
          topHeight = this.props.topHeight + (this.props.bottomHeight - this.props.maxBottomHeight);
        }
        this.props.onResize(topHeight, bottomHeight);
      }, 10));
    };

    this.handleClick = (e) => {
      let topHeight;
      let bottomHeight;
      e.preventDefault();

      if (this.props.bottomOpened) {
        topHeight = this.props.topHeight + this.props.bottomHeight;
        bottomHeight = 0;
      } else {
        topHeight = this.props.preTopHeight;
        bottomHeight = this.props.preBottomHeight;
      }
      this.props.onResize(topHeight, bottomHeight);
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
      <div className="ui-layout-resizer ui-layout-resizer-horizontal" ref="resizer" onMouseDown={this.handleMouseDown}>
        <div className="ui-layout-resizer_toggler" onClick={this.handleClick} onMouseDown={this.stopPropagation}></div>
      </div>
    );
  }
}

HResizer.propTypes = {
  minBottomHeight: PropTypes.number,
  maxBottomHeight: PropTypes.number,
  eventScope: PropTypes.string.isRequired,
  preTopHeight: PropTypes.number.isRequired,
  preBottomHeight: PropTypes.number.isRequired,
  topHeight: PropTypes.number.isRequired,
  bottomHeight: PropTypes.number.isRequired,
  bottomOpened: PropTypes.bool.isRequired,
  onResize: PropTypes.func.isRequired
};

HResizer.defaultProps = {
  minBottomHeight: 0,
  maxBottomHeight: 300
};


export default HResizer;
