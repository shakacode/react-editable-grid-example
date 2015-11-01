import React, { PropTypes }           from 'react';
import { Map as $$Map }               from 'immutable';
import { Table as DataTable, Column } from 'fixed-data-table';

import StaticCell   from './StaticCell/StaticCell';
import EditableCell from './EditableCell/EditableCell';
import Spinner      from '../Spinner/Spinner';

import styles from './Table.scss';


export default class Table extends React.Component {

  static propTypes = {
    data             : PropTypes.array.isRequired,
    apiCall          : PropTypes.func.isRequired,
    reloadData       : PropTypes.func.isRequired,
    setLoadingStateTo: PropTypes.func.isRequired,
    isLoading        : PropTypes.bool.isRequired,
  }


  constructor(props, context) {
    super(props, context);

    this.months = [
      'Jan',
      'Feb',
      'Mar',
    ];

    this.state = {
      $$formState   : new $$Map({ /* year: { month: string } */ }),
      $$isEditable  : new $$Map({ /* year: { month: bool   } */ }),
      $$isProcessing: new $$Map({ /* year: { month: bool   } */ }),
    };
  }


  _getStateValue(year, month) {
    const { $$formState } = this.state;
    const $$yearState = $$formState.get(year);

    if (!$$yearState) return null;

    return $$yearState.get(month) || null;
  }


  _getEditableStatus(year, month) {
    const { $$isEditable } = this.state;
    const $$yearState = $$isEditable.get(year);

    if (!$$yearState) return false;

    return $$yearState.get(month) || false;
  }


  _getProcessingStatus(year, month) {
    const { $$isProcessing } = this.state;
    const $$yearState = $$isProcessing.get(year);

    if (!$$yearState) return false;

    return $$yearState.get(month) || false;
  }


  _setStateValue(year, month, value) {
    const { $$formState } = this.state;

    this.setState({
      $$formState: $$formState.setIn([year, month], value),
    });
  }


  _setEditableStatus(year, month, isEditable, cb) {
    const { $$isEditable } = this.state;

    this.setState({
      $$isEditable: $$isEditable.setIn([year, month], isEditable),
    }, cb);
  }


  _setProcessingStatus(year, month, isProcessing) {
    const { $$isProcessing } = this.state;

    this.setState({
      $$isProcessing: $$isProcessing.setIn([year, month], isProcessing),
    });
  }


  _removeStateValue(year, month) {
    const { $$formState } = this.state;

    this.setState({
      $$formState: $$formState.deleteIn([year, month]),
    });
  }


  _saveStateValue(year, month) {
    const { apiCall } = this.props;
    const { $$formState } = this.state;
    const value = $$formState.getIn([year, month]);

    if (value) {
      ::this._setProcessingStatus(year, month, true);

      apiCall({
        method: 'PATCH',
        url   : `/data/${year}/${month}`,
        data  : { value },
      })
        .then(() => {
          const { setLoadingStateTo, reloadData } = this.props;

          setLoadingStateTo(true);
          reloadData(() => {
            ::this._setEditableStatus(year, month, false);
            ::this._removeStateValue(year, month);
            ::this._setProcessingStatus(year, month, false);
            setLoadingStateTo(false);
          });
        })
        .catch(() => {
          ::this._setProcessingStatus(year, month, false);
          // Handle...
        });
    } else {
      ::this._setEditableStatus(year, month, false);
    }
  }


  _renderSpinner() {
    const { isLoading } = this.props;

    return (
      <div id="spinner-section-wrapper" className={styles.spinnerSection}>
        {isLoading && <Spinner size="20" />}
      </div>
    );
  }


  _renderStaticCell(value) {
    return (
      <StaticCell {...{ value }} />
    );
  }


  _renderEditableCell(value, month, { year }) {
    const actions = {
      getStateValue      : this._getStateValue.bind(this, year, month),
      setStateValue      : this._setStateValue.bind(this, year, month),
      removeStateValue   : this._removeStateValue.bind(this, year, month),
      saveStateValue     : this._saveStateValue.bind(this, year, month),
      getEditableStatus  : this._getEditableStatus.bind(this, year, month),
      setEditableStatus  : this._setEditableStatus.bind(this, year, month),
      getProcessingStatus: this._getProcessingStatus.bind(this, year, month),
    };

    return (
      <EditableCell {...{ value, actions }} />
    );
  }


  render() {
    const { data } = this.props;

    return (
      <section className={styles.tableSection}>
        {::this._renderSpinner()}
        <DataTable
          rowHeight={50}
          rowGetter={key => data[key]}
          rowsCount={data.length}
          width={800}
          maxHeight={300}
          headerHeight={50}
        >
          <Column
            label="Year"
            width={200}
            dataKey="year"
            cellRenderer={::this._renderStaticCell}
          />
          {
            this.months.map(month => (
              <Column
                key={month}
                label={month}
                width={200}
                dataKey={month.toLowerCase()}
                cellRenderer={::this._renderEditableCell}
              />
            ))
          }
        </DataTable>
      </section>
    );
  }

}
