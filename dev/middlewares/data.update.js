import sleep from 'sleep';

import dataStorage  from 'dev/storages/data';
import serverConfig from 'config/server/server.base';


const url = serverConfig.apiURL('/data/:year/:month');

const middleware = (req, res) => {
  sleep.usleep(500000);

  dataStorage.updateStorage(storage => {

    const year   = parseInt(req.params.year, 10);
    const month  = req.params.month;
    const datum  = storage.findDatum(year);

    datum[month] = parseInt(req.body.value, 10);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ datum }));

  });
};

export default [ url, middleware ];
