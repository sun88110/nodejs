// timer.js
// setTimeout. setInterval
const fs = require("fs");
const process = require("process");
const os = require("os");

console.log(process.env.USERNAME);
console.log(os.arch());
console.log(os.cpus());
// process.exit();

setTimeout(() => {
  console.log("한번만 실행.");
}, 1000);

fs.readFile("./sample.txt1111", "utf-8", (err, data) => {
  //1111 지우면 작동함

  if (err) {
    return;
  }

  let cnt = 0;
  let max = data.length;

  let job = setInterval(() => {
    console.clear();
    console.log(data.substring(0, cnt++));
    if (cnt == max) {
      clearInterval(job);
    }
  }, 200);
});

// let job = setInterval(() => {
//   console.log("반복실행.");
// }, 1000);

// setTimeout(() => {
//   clearInterval(job); //실행하는 job을 종료
// }, 10000);
