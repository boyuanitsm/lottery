import staffs from '../staff';
import trophies from '../trophy';

// 抽奖间隔 ms
const LOTTERY_INTERVAL = 10;
// cookie keys
const LUCKEY_DOG = 'LUCKEY_DOG';
const TROPHY_ISSUED = 'TROPHY_ISSUED';

export default {
  template : require('./lottery.html'),
  controller($log, $interval, $scope, $cookies, $window) {
    'ngInject';

    const vm = this;
    let interval;

    vm.staffs = staffs;
    vm.trophies = trophies;
    vm.reset = reset;
    vm.restart = restart;

    initialize();
    readyTrophy();

    function initialize() {
      // 从 cookie 中获取幸运儿
      vm.luckeyDogs = $cookies.get(LUCKEY_DOG)
        ? angular.fromJson($cookies.get(LUCKEY_DOG))
        : [];
      // 从 cookie 中获取已颁发的奖品
      vm.trophyIssued = $cookies.get(TROPHY_ISSUED)
        ? angular.fromJson($cookies.get(TROPHY_ISSUED))
        : {};

      for (let i in vm.trophies) {
        let trophy = vm.trophies[i];

        if (vm.trophyIssued[trophy.id]) {
          trophy.count -= vm.trophyIssued[trophy.id];
        }
      }
      readyTrophy();
    }

    // 准备下一个奖品
    function readyTrophy() {
      let readyTrophy;
      for (let i in vm.trophies) {
        let trophy = vm.trophies[i];

        if (trophy.count <= 0) {
          continue;
        }

        readyTrophy = trophy;
        break;
      }

      if (readyTrophy) {
        vm.trophy = readyTrophy;
      } else {
        vm.trophy = null;
      }
    }

    // 颁发奖品
    function issueTrophy(trophyId) {
      for (let i in vm.trophies) {
        let trophy = vm.trophies[i];

        if (trophy.id === trophyId) {
          trophy.count -= 1;
        }
      }
      readyTrophy();
    }

    // 添加一个幸运儿
    function addLuckyDog(name, trophy, trophyId) {
      vm.luckeyDogs[vm.luckeyDogs.length] = {
        name: name,
        trophy: trophy
      };
      $cookies.put(LUCKEY_DOG, angular.toJson(vm.luckeyDogs));

      if (!vm.trophyIssued[trophyId]) {
        vm.trophyIssued[trophyId] = 0;
      }

      vm.trophyIssued[trophyId] += 1;
      $cookies.put(TROPHY_ISSUED, angular.toJson(vm.trophyIssued));

      issueTrophy(trophyId);
    }

    // 覆盖上一个幸运儿 (人不在，重新抽)
    function coverLastLuckyDog(name, trophy) {
      vm.luckeyDogs[vm.luckeyDogs.length - 1].name = name;
      $cookies.put(LUCKEY_DOG, angular.toJson(vm.luckeyDogs));
      vm.cover = false; 
    }

    // 人不在，重新抽
    function restart() {
      vm.cover = true;
      vm.inTheLottery = true;
    }

    // 重置所有数据
    function reset() {
      $cookies.remove(LUCKEY_DOG);
      $cookies.remove(TROPHY_ISSUED);
      $window.location.reload();
    };

    // 监听是否开始抽奖
    $scope.$watch('$ctrl.inTheLottery', (newValue, oldValue, event) => {
      if (newValue) {
        interval = $interval(() => {
          vm.luckyDog = staffs[random(0, staffs.length)];
        }, LOTTERY_INTERVAL);
      } else {
        if (interval) {
          $interval.cancel(interval)
          // 是否覆盖幸运儿
          if (vm.cover) {
            coverLastLuckyDog(vm.luckyDog.name);
          } else {
            addLuckyDog(vm.luckyDog.name, vm.trophy.name, vm.trophy.id);
          }
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
