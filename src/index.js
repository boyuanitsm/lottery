import angular from 'angular';

import lottery from './app/lottery';
import 'angular-ui-router';
import 'angular-cookies';
import routesConfig from './routes';
import cookieConfig from './cookie.config';

import './index.scss';

export const app = 'app';

angular
  .module(app, ['ui.router', 'ngCookies'])
  .config(routesConfig)
  .config(cookieConfig)
  .component('app', lottery);
