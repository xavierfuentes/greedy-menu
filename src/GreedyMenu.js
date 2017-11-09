import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class GreedyMenu extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {};

  render() {
    const { className, ...rest } = this.props;
    const classes = cx(className, 'greedy-menu', {});

    return (
      <div className={classes} {...rest}>
        {this.props.children}
      </div>
    );
  }
}
