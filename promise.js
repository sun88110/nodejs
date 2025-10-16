//promise.js
//pending, fulfilled, rejected / then()/catch()
const promise = new Promise(function (resolve, reject) {
  //resolev = then, reject = catch
  // 정상완료 => 첫번째 매개값으로 받은 함수호출.
  // 에러발생 => 두번째 매개값으로 받은 함수호출.
  try {
    console.log("Promise 시작");
    setTimeout(function () {
      resolve({ retcode: "Susess", retVal: ["hong", "kim", "park"] });
    }, 1000); //1초후에
  } catch (error) {
    reject(new Error("Error !!!"));
  }
});

promise
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.error(error);
  });

fetch("")
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.error(err));
