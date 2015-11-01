import React, { PropTypes } from 'react';

import css from './Spinner.scss';


export default class Spinner extends React.Component {

  static propTypes = {
    color: PropTypes.string,
    size : PropTypes.string,
    width: PropTypes.string,
  }


  constructor(props, context) {
    super(props, context);
  }


  render() {

    const color = this.props.color || '#29d';
    const size  = this.props.size  || 30;
    const width = this.props.width || 2;

    const sizePx  = `${size}px`;
    const widthPx = `${width}px`;

    const sizeStyle = {
      width : sizePx,
      height: sizePx,
    };

    const cutStyle = {
      width : `${size / 2}px`,
      height: sizePx,
    };

    const donutStyle = {
      width            : sizePx,
      height           : sizePx,
      border           : `${widthPx} solid ${color}`,
      borderRadius     : '50%',
      borderLeftColor  : 'transparent',
      borderBottomColor: 'transparent',
    };

    return (
      <div className={css.container}>
        <div className={css.wrapper} style={sizeStyle}>
          <div className={css.icon} style={sizeStyle}>
            <div className={css.cut} style={cutStyle}>
              <div className={css.donut} style={donutStyle} />
            </div>
          </div>
        </div>
      </div>
    );

  }


}
