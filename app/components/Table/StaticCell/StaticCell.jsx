import React, { PropTypes } from 'react';

import styles from './StaticCell.scss';


export default class StaticCell extends React.Component {

  static propTypes = {
    value: PropTypes.number.isRequired,
  }

  render() {
    const { value } = this.props;

    return (
      <span className={styles.staticCell}>
        {value}
      </span>
    );
  }

}
