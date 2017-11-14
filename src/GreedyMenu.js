import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export function throttle(callback, wait, context = this) {
  let timeout = null;
  let callbackArgs = null;

  const later = () => {
    callback.apply(context, callbackArgs);
    timeout = null;
  };

  return function() {
    if (!timeout) {
      callbackArgs = arguments;
      timeout = setTimeout(later, wait);
    }
  };
}

export default class GreedyMenu extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  };

  COLLAPSE_TEXT = 'LESS';
  EXPAND_TEXT = 'MORE';

  state = {
    isCollapsed: false,
    isCollapsible: true,
    visibleElements: 0,
  };

  check = () => {
    const { getMaxElements, props: { children } } = this;
    const maxElements = getMaxElements();
    const state =
      maxElements < Children.count(children)
        ? { visibleElements: maxElements, isCollapsed: true, isCollapsible: true }
        : { visibleElements: Children.count(children), isCollapsed: false, isCollapsible: false };

    this.setState(state);
  };

  onResize = () => {
    const { getMaxElements, state: { isCollapsed } } = this;
    isCollapsed && this.setState({ visibleElements: getMaxElements() });
  };

  getMaxElements = () => {
    const { greedyMenuWrapperNode, ellipsisNode, getElementWidth } = this;
    const elements = [];

    ellipsisNode.innerText = this.EXPAND_TEXT;

    let totalWidth = greedyMenuWrapperNode.offsetWidth;
    let ellipsisWidth = getElementWidth(ellipsisNode);
    let menuNodes = greedyMenuWrapperNode.childNodes;
    let elementsAccumulator = 0;
    let widthAccumulator = 0;
    let currentElementWidth = 0;
    let nextElementWidth = 0;
    let currentElement = null;

    do {
      currentElement = menuNodes[elementsAccumulator];
      currentElementWidth = getElementWidth(currentElement);
      nextElementWidth = getElementWidth(menuNodes[elementsAccumulator + 1]);
      elements.push({
        node: currentElement,
        width: currentElementWidth,
      });
      widthAccumulator += currentElementWidth;
      elementsAccumulator += 1;
    } while (currentElement !== ellipsisNode && widthAccumulator + nextElementWidth < totalWidth);

    if (elementsAccumulator < Children.count(this.props.children)) {
      do {
        widthAccumulator -= elements[elementsAccumulator - 1].width;
        elementsAccumulator -= 1;
      } while (widthAccumulator + ellipsisWidth > totalWidth);
    }

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
    const { getMaxElements, props: { children } } = this;

    event.target.hidden = true;

    this.setState(prevState => ({
      visibleElements: prevState.isCollapsed ? Children.count(children) : getMaxElements(),
      isCollapsed: !prevState.isCollapsed,
    }));

    event.target.hidden = false;
  };

  /**
   * Decide whether it should render the ellipsis or not
   */
  renderContent = () => {
    return this.renderChildren().concat(this.renderEllipsis());
  };

  renderChildren = () => {
    const { visibleElements } = this.state;
    const { children } = this.props;
    const isHidden = i => i + 1 > visibleElements;

    return Children.map(children, (child, index) => {
      const newStyle = isHidden(index) ? { display: 'none' } : {};
      return cloneElement(child, {
        className: cx('greedy-menu__child', { 'greedy-menu__child--hidden': isHidden(index) }, child.props.className),
        style: newStyle,
      });
    });
  };

  renderEllipsis = (text = 'Ellipsis') => {
    const { COLLAPSE_TEXT, EXPAND_TEXT, state: { isCollapsed, isCollapsible } } = this;
    const ellipsisStyle = isCollapsible ? {} : { display: 'none' };

    return (
      <button
        className="greedy-menu__ellipsis"
        ref={button => {
          this.ellipsisNode = button;
        }}
        key="ellipsis"
        onClick={this.handleEllipsisClick}
        style={ellipsisStyle}
      >
        {isCollapsed ? EXPAND_TEXT : COLLAPSE_TEXT}
      </button>
    );
  };

  componentDidMount() {
    window.addEventListener('load', this.check);
    window.addEventListener('resize', throttle(this.onResize, 100));
  }

  componentWillMount() {
    this.setState({ visibleElements: Children.count(this.props.children) });
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.check);
    window.removeEventListener('resize', throttle(this.onResize, 100));
  }

  render() {
    const { className, style, ...rest } = this.props;
    const { isCollapsed } = this.state;

    return (
      <div
        ref={wrapper => {
          this.greedyMenuWrapperNode = wrapper;
        }}
        className={cx('greedy-menu', { 'greedy-menu--collapsed': isCollapsed }, className)}
        style={{ ...style, width: '100%', height: '100%' }}
        {...rest}
      >
        {this.renderContent()}
      </div>
    );
  }
}
