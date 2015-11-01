import data from 'dev/data/data.json';


export default {

  getData() {
    return data;
  },

  updateStorage(updater) {
    return updater(this);
  },

  findDatum(year) {
    return (
      data.find(datum => datum.year === year)
    );
  },

}
