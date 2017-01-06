import angular from 'angular';
import 'angular-mocks';
import {hello} from './hello';

describe('hello component', () => {
  beforeEach(() => {
    angular
      .module('fountainHello', ['app/hello.html'])
      .component('fountainHello', hello);
    angular.mock.module('fountainHello');
  });
  it('should render hello world', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<fountain-hello>Loading...</fountain-hello>')($rootScope);
    $rootScope.$digest();
    const h1 = element.find('h1');
    expect(h1.html()).toEqual('Hello World!');
  }));
});
