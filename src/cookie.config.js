// cookie 有效期为七天
export default function($cookiesProvider) {
  'ngInject';

  let now = new Date()
  now.setDate(now.getDate() + 7);

  $cookiesProvider.defaults.expires = now;
}
