import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './GreedyMenu.css';

export default class GreedyMenu extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  };

  COLLAPSE_TEXT = 'LESS';
  EXPAND_TEXT = 'MORE';

  state = {
    isCollapsed: false,
    visibleElements: 0,
  };

  onLoad = () => {
    const { getMaxElements, shouldCollapse } = this;

    shouldCollapse() && this.setState({ visibleElements: getMaxElements(), isCollapsed: true });
  };

  shouldCollapse = () => {
    const { getMaxElements, props: { children } } = this;
    const maxElements = getMaxElements();

    return maxElements !== Children.count(children);
  };

  getMaxElements = () => {
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
    // const { isCollapsed } = this.state;
    // return isCollapsed ? this.renderChildren().concat(this.renderEllipsis()) : this.renderChildren();
    return this.renderChildren().concat(this.renderEllipsis());
  };

  renderChildren = () => {
    return Children.map(this.props.children, (child, index) => {
      return cloneElement(child, {
        ...child.props,
        className: cx(
          'greedy-menu__child',
          { 'greedy-menu__child--hidden': index + 1 > this.state.visibleElements },
          child.props.className
        ),
        style: { ...child.props.style },
      });
    });
  };

  renderEllipsis = (text = 'Ellipsis') => {
    // const { isCollapsed } = this.state;
    const { COLLAPSE_TEXT, EXPAND_TEXT, state: { isCollapsed } } = this;

    return (
      <button
        className="greedy-menu__ellipsis"
        ref={button => {
          this.ellipsisNode = button;
        }}
        key="ellipsis"
        onClick={this.toggleEllipsis}
      >
        {isCollapsed ? EXPAND_TEXT : COLLAPSE_TEXT}
      </button>
    );
  };

  componentDidMount() {
    window.addEventListener('load', this.onLoad);
  }

  componentWillMount() {
    this.setState({ visibleElements: Children.count(this.props.children) });
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.onLoad);
  }

  render() {
    const { className, ...rest } = this.props;
    const { isCollapsed } = this.state;

    return (
      <div
        ref={wrapper => {
          this.greedyMenuWrapperNode = wrapper;
        }}
        className={cx('greedy-menu', { 'greedy-menu--collapsed': isCollapsed }, className)}
        {...rest}
      >
        {this.renderContent()}
      </div>
    );
  }
}
