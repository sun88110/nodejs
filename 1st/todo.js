// todo.js
import { jsonString } from "./data.js";
let jsonObj = JSON.parse(jsonString);

console.table(jsonObj);
// reduce 출력: Female => id, fullName, email, ip_address
const resultAry = jsonObj.reduce((acc, elem) => {
  if (elem.id % 2 === 0) {
    acc.push({
      id: elem.id,
      fullName: `${elem.first_name} ${elem.last_name}`,
      email: elem.email,
      ip_address: elem.ip_address,
    });
  }
  return acc; // 반드시 반환해야 reduce가 동작함
}, []);

console.table(resultAry);

//성별에 따른 이름 배열에 넣기
const resultgender = jsonObj.reduce(
  (acc, elem) => {
    let female = [];
    let male = [];
    if (elem.gender == "Female") {
      acc.female.push(elem.first_name);
    } else if (elem.gender == "Male") {
      acc.male.push(elem.first_name);
    }
    return acc;
  },
  { female: [], male: [] }
);

console.table(resultgender);

let resultAry2 = jsonObj.reduce((acc, elem) => {
  const key = elem["gender"];
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(elem.first_name);
  return acc;
}, {});
console.table(resultAry2);
