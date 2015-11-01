import React, { PropTypes } from 'react';

import styles from './EditableCell.scss';


export default class EditableCell extends React.Component {

  static propTypes = {
    value  : PropTypes.number.isRequired,
    actions: PropTypes.shape({
      getStateValue      : PropTypes.func.isRequired,
      setStateValue      : PropTypes.func.isRequired,
      removeStateValue   : PropTypes.func.isRequired,
      saveStateValue     : PropTypes.func.isRequired,
      getEditableStatus  : PropTypes.func.isRequired,
      setEditableStatus  : PropTypes.func.isRequired,
      getProcessingStatus: PropTypes.func.isRequired,
    }).isRequired,
  }


  constructor(props, context) {
    super(props, context);
  }


  _makeEditable() {
    const { actions } = this.props;

    actions.setEditableStatus(true, () => {
      const { input } = this.refs;
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    });
  }


  _handleValueChange(e) {
    const { value } = e.target;
    const { actions } = this.props;

    actions.setStateValue(value);
  }


  _handleSubmit(e) {
    e.preventDefault();
    const { actions } = this.props;

    actions.saveStateValue();
  }


  _handleCancelEdit() {
    const { actions } = this.props;

    actions.setEditableStatus(false);
    actions.removeStateValue();
  }


  _renderStaticCell() {
    const { value } = this.props;

    return (
      <span className={styles.staticCell} onClick={::this._makeEditable}>
        {value}
      </span>
    );
  }


  _renderEditableCell() {
    const { value, actions } = this.props;
    const inputValue = actions.getStateValue() || value;
    const isDisabled = actions.getProcessingStatus();

    return (
      <form className={styles.form} onSubmit={::this._handleSubmit}>
        <div className={styles.input}>
          <input
            ref="input"
            type="text"
            value={inputValue}
            disabled={isDisabled}
            onChange={::this._handleValueChange}
          />
        </div>
        <div className={styles.buttons}>
          <button disabled={isDisabled} />
          <span onClick={::this._handleCancelEdit} />
        </div>
      </form>
    )
  }


  render() {
    const isEditable = this.props.actions.getEditableStatus();

    return (
      isEditable ? ::this._renderEditableCell() : ::this._renderStaticCell()
    );
  }

}
