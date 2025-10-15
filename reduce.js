// Array.prototype.reduce();
// reduce(function() {...})
import { studentsAry, PI } from "./data.js";
console.log(PI);

const evenAry = function (acc, elem, idx, ary) {
  console.log(`acc:${acc}, elem: ${elem}`);
  if (idx % 2 == 0) {
    acc.push(elem); // [1,3]
  }
  return acc;
};
//누적합
const sumAry = (acc, elem) => {
  return acc + elem;
};

let result = [1, 2, 3, 4, 5].reduce(sumAry, 0);

console.log(`결과: ${result}`);

result = [23, 11, 56, 33, 47].reduce(function (acc, elem, idx) {
  // acc , elem  큰 값을 반환
  console.log(idx, acc, elem);
  return acc < elem ? acc : elem;
}, 100);
console.log(`최소값: ${result}`);

result = studentsAry.reduce(function (acc, elem) {
  if (elem.score >= 60) {
    acc.push(elem);
  }
  return acc;
}, []);

console.table(result);

const numAry = [23, 12, 45, 87, 12, 45];
result = numAry.reduce(function (acc, elem) {
  let exists = acc.reduce(function (acc2, elem2) {
    return acc2 || elem2 == elem;
  }, false);

  //중복된 값을 제거.
  //   console.log(elem);
  //   if (acc.indexOf(elem) === -1) {
  //     acc.push(elem);
  //   }
  if (!acc.includes(elem)) {
    acc.push(elem);
  }
  return acc;
}, []);
