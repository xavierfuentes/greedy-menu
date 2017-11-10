import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class GreedyMenu extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  };

  COLLAPSE_TEXT = 'LESS';
  EXPAND_TEXT = 'MORE';

  state = {
    isExpanded: true,
    visibleElements: 0,
    elementsList: [],
  };

  checkSizes = () => {
    const { greedyMenuWrapperNode, ellipsisNode, props: { children }, getElementWidth } = this;
    const totalWidth = greedyMenuWrapperNode.offsetWidth;
    const ellipsisWidth = getElementWidth(ellipsisNode);
    const availableWidth = totalWidth - ellipsisWidth;

    let elementsAccumulator = 0;
    let widthAccumulator = 0;
    do {
      elementsAccumulator += 1;
      widthAccumulator += getElementWidth(greedyMenuWrapperNode.childNodes[elementsAccumulator]);
    } while (
      widthAccumulator + getElementWidth(greedyMenuWrapperNode.childNodes[elementsAccumulator + 1]) < availableWidth &&
      elementsAccumulator < Children.count(children)
    );

    return elementsAccumulator;
  };

  /**
   * Get the element width including any horizontal margins
   * Assumes { box-size: border-box } is being used
   * todo: check whether the padding + border should be measured separately
   */
  getElementWidth = element => {
    if (!element) return 0;
    const marginRightStyle = window.getComputedStyle(element).getPropertyValue('margin-right');
    const marginLeftStyle = window.getComputedStyle(element).getPropertyValue('margin-left');
    const marginTotal =
      parseInt(marginRightStyle.substr(0, marginRightStyle.length - 2), 10) +
      parseInt(marginLeftStyle.substr(0, marginLeftStyle.length - 2), 10);

    return Math.ceil(element.offsetWidth + marginTotal);
  };

  /**
   * Decide whether it should render the ellipsis or not
   */
  renderContent = () => {
    return this.renderChildren().concat(this.renderEllipsis());
  };

  renderChildren = () =>
    Children.map(this.props.children, child =>
      cloneElement(child, {
        ...child.props,
        className: cx('greedy-menu__child', child.props.className),
        style: { ...child.props.style },
      })
    );

  renderEllipsis = (text = 'Ellipsis') => (
    <button
      className="greedy-menu__ellipsis"
      ref={button => {
        this.ellipsisNode = button;
      }}
      key="ellipsis"
      onClick={this.toggleEllipsis}
    >
      {text}
    </button>
  );

  componentDidMount() {
    window.addEventListener('load', this.checkSizes);
  }

  componentWillMount() {
    this.setState({ visibleElements: Children.count(this.props.children) });
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.checkSizes);
  }

  render() {
    const { className, style, ...rest } = this.props;
    const GM_WRAPPER_BASE_STYLE = { width: '100%', height: '100%' };

    return (
      <div
        ref={wrapper => {
          this.greedyMenuWrapperNode = wrapper;
        }}
        className={cx('greedy-menu', className)}
        style={{ ...style, ...GM_WRAPPER_BASE_STYLE }}
        {...rest}
      >
        {this.renderContent()}
      </div>
    );
  }
}
