import React    from 'react';
import ReactDOM from 'react-dom';

import apiCall from '../shared/utils/apiCall';
import App     from '../components/App/App';

ReactDOM.render(<App apiCall={apiCall} />, document.getElementById('app'));
