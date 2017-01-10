import staffs from '../staff';
import trophies from '../trophy';
import lang from '../lang';
import unofficial from '../unofficial';

// 抽奖间隔 ms
const LOTTERY_INTERVAL = 10;
// cookie keys
const LUCKY_DOG = 'LUCKY_DOG';
const TROPHY_ISSUED = 'TROPHY_ISSUED';

export default {
  template : require('./lottery.html'),
  controller($log, $interval, $scope, $window, $state, localStorageService) {
    'ngInject';

    const vm = this;
    let interval;

    vm.lang = lang;
    vm.staffs = staffs;
    vm.trophies = trophies;
    vm.reset = reset;
    vm.restart = restart;
    vm.openLuckyDog = openLuckyDog;
    vm.luckyDogs, vm.trophyIssued, vm.throphy, vm.theLastOneThrophy, vm.winning;

    initialize();

    function initialize() {
      // 从 cookie 中获取幸运儿
      vm.luckyDogs = localStorageService.get(LUCKY_DOG)
        ? angular.fromJson(localStorageService.get(LUCKY_DOG))
        : [];
      // 从 cookie 中获取已颁发的奖品
      vm.trophyIssued = localStorageService.get(TROPHY_ISSUED)
        ? angular.fromJson(localStorageService.get(TROPHY_ISSUED))
        : {};

      for (let i in vm.trophies) {
        let trophy = vm.trophies[i];

        if (vm.trophyIssued[trophy.id]) {
          trophy.count -= vm.trophyIssued[trophy.id];
        }
      }
      readyTrophy();
      removeLuckyDogFromStaffs();
    }

    // 把幸运儿从员工数据中删除，防止二次中奖
    function removeLuckyDogFromStaffs() {
      for (let i in vm.luckyDogs) {
        let luckyDog = vm.luckyDogs[i];

        for (let j in vm.staffs) {
          let staff = vm.staffs[j];
          if (luckyDog.name === staff.name) {
            vm.staffs.splice(j, 1);
            break;
          }
        }
      }
    }

    // 把这个幸运儿从员工数据中删除，防止二次中奖
    function removeThisLuckyDogFromStaffs(name) {
      for (let j in vm.staffs) {
        let staff = vm.staffs[j];
        if (name === staff.name) {
          vm.staffs.splice(j, 1);
          break;
        }
      }
    }

    // 准备奖池
    function readyTrophy() {
      let readyTrophy;
      for (let i in vm.trophies) {
        let trophy = vm.trophies[i];

        if (trophy.count <= 0) {
          continue;
        }

        readyTrophy = trophy;
        if (i == (vm.trophies.length - 1)) {
          vm.theLastOneThrophy = true;
        }
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
    }

    function openLuckyDog() {
      window.open($state.href('lucky-dog'), '_blank');
    }

    // 添加一个幸运儿
    function addLuckyDog(name, trophy, trophyId) {
      vm.luckyDogs[vm.luckyDogs.length] = {
        name: name,
        trophy: trophy,
        trophyId: trophyId,
        time: new Date()
      };
      localStorageService.set(LUCKY_DOG, angular.toJson(vm.luckyDogs));

      if (!vm.trophyIssued[trophyId]) {
        vm.trophyIssued[trophyId] = 0;
      }

      vm.trophyIssued[trophyId] += 1;
      localStorageService.set(TROPHY_ISSUED, angular.toJson(vm.trophyIssued));

      issueTrophy(trophyId);
    }

    // 覆盖上一个幸运儿 (人不在，重新抽)
    function coverLastLuckyDog(name, trophy) {
      vm.luckyDogs[vm.luckyDogs.length - 1].name = name;
      vm.luckyDogs[vm.luckyDogs.length - 1].time = new Date();
      localStorageService.set(LUCKY_DOG, angular.toJson(vm.luckyDogs));
      vm.cover = false;
    }

    // 人不在，重新抽
    function restart() {
      vm.cover = true;
      vm.inTheLottery = true;
    }

    // 重置所有数据
    function reset() {
      localStorageService.remove(LUCKY_DOG);
      localStorageService.remove(TROPHY_ISSUED);
      $window.location.reload();
    };

    // 内定逻辑
    function unofficially(trophyId) {
      let unofficialStaffs = unofficial[trophyId];
      if (unofficialStaffs) {
        for (let i in unofficialStaffs) {
          let staffName = unofficialStaffs[i];
          if (!isLuckeyDog(staffName)) {
            vm.luckyDog = {
              name: staffName
            };
            break;
          }
        }
      } else {
        // 防止内定的人抽中其他奖项
        while(isUnofficially(vm.luckyDog.name)) {
          vm.luckyDog = staffs[random(0, staffs.length)];
        }
      }
    }

    // 这个人是否已是内定
    function isUnofficially(staffName) {
      for (let i in unofficial) {
        let unofficialStaffs = unofficial[i];
        for (let j in unofficialStaffs) {
          let staff = unofficialStaffs[j];
          if (staffName === staff) {
            return true;
          }
        }
      }
      return false;
    }

    // 这个人是否已是幸运儿
    function isLuckeyDog(staffName) {
      for (let i in vm.luckyDogs) {
        let luckyDog = vm.luckyDogs[i];
        if (staffName === luckyDog.name) {
          return true;
        }
      }
      return false;
    }

    // 监听是否开始抽奖
    $scope.$watch('$ctrl.inTheLottery', (newValue, oldValue, event) => {
      if (newValue) {
        // 准备下一个奖品
        readyTrophy();
        interval = $interval(() => {
          vm.luckyDog = staffs[random(0, staffs.length)];
        }, LOTTERY_INTERVAL);
      } else {
        if (interval) {
          $interval.cancel(interval);
          // 是否覆盖幸运儿
          if (vm.cover) {
            coverLastLuckyDog(vm.luckyDog.name);
          } else {
            unofficially(vm.trophy.id);
            addLuckyDog(vm.luckyDog.name, vm.trophy.name, vm.trophy.id);
          }
          removeThisLuckyDogFromStaffs(vm.luckyDog.name);
          vm.winning = true;
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
