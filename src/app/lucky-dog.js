import lang from '../lang';

// cookie keys
const LUCKY_DOG = 'LUCKY_DOG';

export default {
  template: require('./lucky-dog.html'),
  controller(localStorageService) {
    'ngInject';

    const vm = this;

    vm.lang = lang;
    refresh();

    function refresh() {
      vm.luckyDogs = localStorageService.get(LUCKY_DOG)
        ? angular.fromJson(localStorageService.get(LUCKY_DOG))
        : [];
    }
  }
}
