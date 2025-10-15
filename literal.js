// literal.js
import { getStudentsInfo } from "./data.js";

let name = "홍길동";
console.log("Hello, " + name);
console.log(`Hello, ${name}`);

let n1 = 10;
let n2 = 11;
console.log(`n1 + n2 = ${n1 + n2}`);

console.log(`${getStudentsInfo()}`);

console.log(
  `${getStudentsInfo()
    .map((person) => "친구이름=>" + person)
    .join(" ")}`
);

// 펼침 연산자 (spread operator)
let friends = ["김민수", "박철홍"];
console.log(...friends);
let newAry = [...friends, ...getStudentsInfo()];
console.log(newAry);

// Object Destructuring
const person = { firstName: "Kildong", lastName: "Hong", age: 20 };

// let firstName = person.firstName;
let { firstName: fn, lastName: ln, age } = person;
console.log(fn, ln, age);

// Array Destructuring
let [ary1, ary2, ...ary3] = getStudentsInfo();
console.log(ary1, ary2, ary3);

// default function parameter.
function minus(n1 = 0, n2 = 0) {
  return n1 - n2;
}
console.log(minus(10));
