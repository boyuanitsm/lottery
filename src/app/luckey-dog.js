// cookie keys
const LUCKEY_DOG = 'LUCKEY_DOG';

export default {
  template: require('./luckey-dog.html'),
  controller($cookies) {
    'ngInject';

    const vm = this;

    refresh();

    function refresh() {
      vm.luckeyDogs = $cookies.get(LUCKEY_DOG)
        ? angular.fromJson($cookies.get(LUCKEY_DOG))
        : [];
    }
  }
}
