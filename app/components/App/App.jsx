import React, { PropTypes } from 'react';

import Table from '../Table/Table';

import './App.scss';


export default class App extends React.Component {

  static propTypes = {
    apiCall: PropTypes.func.isRequired,
  }


  constructor(props, context) {
    super(props, context);

    this.state = {
      data     : [],
      isLoading: true,
    };
  }


  componentDidMount() {
    ::this._loadData();
  }


  _setIsLoadingState(isLoading) {
    this.setState({ isLoading });
  }


  _loadData(cb) {
    const { apiCall } = this.props;

    apiCall({
      method: 'GET',
      url   : '/data',
    })
      .then(res => {
        this.setState({
          data     : res.data.data,
          isLoading: false,
        }, () => {
          if (cb && typeof cb === 'function') {
            return cb();
          }
        });
      });
  }


  render() {
    const { data, isLoading } = this.state;

    return (
      <Table
        data={data}
        isLoading={isLoading}
        reloadData={::this._loadData}
        setLoadingStateTo={::this._setIsLoadingState}
        {...this.props}
      />
    );
  }

}
