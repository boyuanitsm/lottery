import staffs from '../staff';
import trophies from '../trophy';

export default {
  template: require('./lottery.html'),
  controller() {
    'ngInject';

    this.staffs = staffs;
    this.trophies = trophies;
  }
};
