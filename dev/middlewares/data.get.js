import sleep from 'sleep';

import dataStorage  from 'dev/storages/data';
import serverConfig from 'config/server/server.base';


const url = serverConfig.apiURL('/data');

const middleware = (req, res) => {
  sleep.usleep(500000);

  const data = dataStorage.getData();

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ data }));
};

export default [ url, middleware ];
