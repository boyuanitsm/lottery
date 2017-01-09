# lottery

`unofficial`

抽奖小程序，不需要后台服务，所有中奖结果保存在LocalStorage中

## Screenshot

![home](screenshot/home.png)
![winning](screenshot/winning.png)
![lucky-dog](screenshot/lucky-dog.png)

## Usage & Config

- `src/trophy.json` 奖品
- `src/staff.json` 员工
- `src/lang.json` 语言，可以配置页面的大标题

## Random

抽奖算法使用 Math.random 随机 staff 下标，代码片段如下:

```
import staffs from './src/staff.json'

function random(start, end) {
  const difference = end - start;
  let num = Math.random() * difference + start;
  return parseInt(num, 10);
}

let luckyDog = staffs[random(0, staffs.length)];
```

## Developer

### Requirement Node 6+ && NPM 3+

This generator is targeted to be used with Node >= 6.0.0 and NPM => 3.0.0. You can check your version number with the command
```
$ node --version && npm --version
```
Install node library

```
$ npm install
```

### Run Use NPM scripts

- npm run build to build an optimized version of your application in /dist
- npm run serve to launch a browser sync server on your source files
- npm run serve:dist to launch a server on your optimized application
- npm run test to launch your unit tests with Karma
- npm run test:auto to launch your unit tests with Karma in watch mode
