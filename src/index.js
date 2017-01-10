import angular from 'angular';

import lottery from './app/lottery';
import 'angular-ui-router';
import 'angular-local-storage';
import routesConfig from './routes';
import luckyDog from './app/lucky-dog';

import './index.scss';

export const app = 'app';

angular
  .module(app, ['ui.router', 'LocalStorageModule'])
  .config(routesConfig)
  .component('app', lottery)
  .component('luckyDog', luckyDog);
