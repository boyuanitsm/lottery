// cookie keys
const LUCKY_DOG = 'LUCKY_DOG';

export default {
  template: require('./lucky-dog.html'),
  controller($cookies) {
    'ngInject';

    const vm = this;

    refresh();

    function refresh() {
      vm.luckyDogs = $cookies.get(LUCKY_DOG)
        ? angular.fromJson($cookies.get(LUCKY_DOG))
        : [];
    }
  }
}
