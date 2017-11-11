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
  EXPAND_TEXT = 'SUPER MORE AND SOME';

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

    ellipsisNode.innerText = this.EXPAND_TEXT;

    let totalWidth = greedyMenuWrapperNode.offsetWidth;
    let menuNodes = greedyMenuWrapperNode.childNodes;
    let ellipsisWidth = getElementWidth(ellipsisNode);
    let availableWidth = totalWidth - ellipsisWidth;
    let elementsAccumulator = 0;
    let widthAccumulator = 0;

    do {
      elementsAccumulator += 1;
      widthAccumulator += getElementWidth(menuNodes[elementsAccumulator]);
    } while (
      widthAccumulator + getElementWidth(menuNodes[elementsAccumulator + 1]) < availableWidth &&
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

  handleEllipsisClick = event => {
    const { getMaxElements } = this;

    this.setState(prevState => ({ visibleElements: getMaxElements(), isCollapsed: !prevState.isCollapsed }));
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
    const { visibleElements } = this.state;
    const { children } = this.props;

    return Children.map(children, (child, index) => {
      return cloneElement(child, {
        ...child.props,
        className: cx(
          'greedy-menu__child',
          { 'greedy-menu__child--hidden': index + 1 > visibleElements },
          child.props.className
        ),
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
        onClick={this.handleEllipsisClick}
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
