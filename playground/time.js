// let date = new Date();
// console.log(date.getMonth());

const moment = require('moment');

let date = new moment(332);

date.add(10, 'year').subtract(6, 'month')

console.log(date.format('YYYY MMM Do, HH:MM'));