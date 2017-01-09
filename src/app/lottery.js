import staffs from '../staff';
import trophies from '../trophy';

const LOTTERY_INTERVAL = 10;
const LUCKEY_DOG = 'LUCKEY_DOG';
const TROPHY_ISSUED = 'TROPHY_ISSUED';

export default {
  template : require('./lottery.html'),
  controller($log, $interval, $scope, $cookies) {
    'ngInject';

    const vm = this;
    let interval;

    vm.staffs = staffs;
    vm.trophies = trophies;
    vm.reset = reset;

    initialize();

    function initialize() {
      vm.luckeyDogs = $cookies.get(LUCKEY_DOG)
        ? angular.fromJson($cookies.get(LUCKEY_DOG))
        : [];
      vm.trophyIssued = $cookies.get(TROPHY_ISSUED)
        ? angular.fromJson($cookies.get(TROPHY_ISSUED))
        : {};
    }

    function readyTrophy() {

    }

    function addLuckyDog(name, trophy) {
      vm.luckeyDogs[vm.luckeyDogs.length] = {
        name: name,
        trophy: trophy
      }
      $cookies.put(LUCKEY_DOG, angular.toJson(vm.luckeyDogs));
    }

    function reset() {
      $cookies.remove(LUCKEY_DOG);
      $cookies.remove(TROPHY_ISSUED);
      vm.luckeyDogs = [];
      vm.trophyIssued = {};
    };

    $scope.$watch('$ctrl.inTheLottery', (newValue, oldValue, event) => {
      if (newValue) {
        interval = $interval(() => {
          vm.luckyDog = staffs[random(0, staffs.length)];
        }, LOTTERY_INTERVAL);
      } else {
        if (interval) {
          $interval.cancel(interval)
          addLuckyDog(vm.luckyDog.name, trophies[0].id);
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
