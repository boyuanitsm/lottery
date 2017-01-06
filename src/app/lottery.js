import staffs from '../staff';
import trophies from '../trophy';

const LOTTERY_INTERVAL = 10;

export default {
  template : require('./lottery.html'),
  controller($log, $interval, $scope) {
    'ngInject';

    this.staffs = staffs;
    this.trophies = trophies;
    let interval;

    $scope.$watch('$ctrl.inTheLottery', (newValue, oldValue, event) => {
      if (newValue) {
        interval = $interval(() => {
          this.luckyDog = staffs[random(0, staffs.length)];
        }, LOTTERY_INTERVAL);
      } else {
        if (interval) {
          $interval.cancel(interval)
          // const luckDogIndex = random(0, staffs.length);
          // this.luckyDog = staffs[luckDogIndex];
        }
      }
      return newValue;
    });

    $scope.$on('$destroy', function() {
      $interval.cancel(interval);
    });
  }
};

/** 随机数生成器，含头不含尾 */
function random(start, end) {
  const difference = end - start;
  let num = Math.random() * difference + start;
  return parseInt(num, 10);
}
