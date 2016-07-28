import isUndefined from 'lodash/lang/isUndefined';
import debounce from 'lodash/function/debounce';

export default {
  handleResizeH(topHeight, bottomHeight) {
    this.setState({
      preTopHeight: this.state.topHeight,
      preBottomHeight: this.state.bottomHeight,
      topHeight: topHeight,
      bottomHeight: bottomHeight,
      bottomOpened: bottomHeight > 0
    });
  },

  handleToggleH(visible) {
    let topHeight = this.initTopHeight, bottomHeight = 0;
    if (visible) {
      if (this.state.bottomHeight > 0) {
        bottomHeight = this.state.bottomHeight;
        topHeight = this.initTopHeight - this.state.bottomHeight;
      } else {
        bottomHeight = this.initbottomHeight;
        topHeight = this.initTopHeight - this.initbottomHeight;
      }
    }
    this.handleResizeH(topHeight, bottomHeight);
  },

  handleResizeV(leftWidth, rightWidth) {
    this.setState({
      preLeftWidth: this.state.leftWidth,
      preRightWidth: this.state.rightWidth,
      leftWidth: leftWidth,
      rightWidth: rightWidth,
      leftOpened: leftWidth > 0
    });
  },

  handleToggleV(visible) {
    this.setState({
      preLeftWidth: this.state.leftWidth,
      preRightWidth: this.state.rightWidth,
      leftWidth: visible ? this.initLeftWidth : 0,
      rightWidth: visible ? this.initRightWidth : (this.initLeftWidth + this.initRightWidth),
      leftOpened: visible
    });
  },

  bindWindowResizeHEvent(eventScope) {
    $(window).off(`resize.${eventScope}`).on(`resize.${eventScope}`, debounce(() => {
      // Update height with new DOM height
      this.initTopHeight = this.getInitTopHeight();
      this.initBottomHeight = this.getInitBottomHeight();
      this.handleToggleH(this.state.bottomOpened);
    }, 88));
  },

  bindWindowResizeVEvent(eventScope) {
    $(window).off(`resize.${eventScope}`).on(`resize.${eventScope}`, debounce(() => {
      // Update width with new DOM width
      this.initLeftWidth = this.getInitLeftWidth();
      this.initRightWidth = this.getInitRightWidth();
      this.handleToggleV(true);
    }, 88));
  },

  unBindWindowResizeEvent(eventScope) {
    $(window).off(`resize.${eventScope}`);
  }
};
