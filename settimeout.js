// settimeout.js
// 10 -> 2 -> *2 -> 5 = result
let result = 10;

//promise를 async/await
function delayFunc(delay, operations) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      operations();
      resolve(result);
    }, delay); // +2
  });
}

async function runPromise() {
  try {
    await delayFunc(500, () => {
      result += 2;
    });
    console.log(result); // 출력: 12

    await delayFunc(1000, () => {
      result *= 2;
    });
    console.log(result); // 출력: 24

    await delayFunc(800, () => {
      result += 5;
    });
    console.log(result); // 출력: 29
  } catch (err) {
    console.log(new error("error!!!"));
  }
}
runPromise();
// setTimeout(function () {
//   result += 2;

//   setTimeout(function () {
//     result *= 2;

//     setTimeout(function () {
//       result += 5;
//       console.log(result);
//     }, 800);
//   }, 1000);
// }, 500);

//   promise
//     .then((resp) => {
//       console.log(resp); // 출력: 12
//       return new Promise((resolve, reject) => {
//         setTimeout(function () {
//           result *= 2; // 12 * 2 = 24
//           resolve(result);
//         }, 500); // *2
//       });
//     })
//     .then((resp) => {
//       {
//         console.log(resp);
//         return new Promise((resolve, reject) => {
//           setTimeout(function () {
//             result += 5; //
//             resolve(result);
//           }, 500);
//         }); // +5
//       }
//     })
//     .then((data) => console.log(data))
//     .catch((err) => console.error(err));
