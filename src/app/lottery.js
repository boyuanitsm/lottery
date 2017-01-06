import staffs from '../staff';
import trophies from '../trophy';

export default {
  template: require('./lottery.html'),
  controller($log, $interval, $scope) {
    'ngInject';

    this.staffs = staffs;
    this.trophies = trophies;
    let timeout = 0;
    let interval;

    $scope.$watch('$ctrl.inTheLottery', (newValue, oldValue, event) => {
      if (newValue) {
        interval = $interval(() => {
          timeout++;
          this.luckyDog = staffs[timeout % staffs.length];
        }, 100);
      } else {
        $interval.cancel(interval)
      }
      return newValue;
    });

    $scope.$on('$destroy', function() {
      $interval.cancel(interval);
    });
  }
};
