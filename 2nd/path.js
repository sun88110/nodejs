const path = require("path");
const url = require("url");

console.log(__filename);
console.log(path.basename(__filename));
console.log(path.basename(__filename, ".js"));

console.log(path.delimiter);

console.log(process.env.PATH);
process.env.PATH.split(path.delimiter);

console.log(__filename);
console.log(path.dirname(__filename));

console.log("foo\\bar\\baz".split(path.sep));
console.log(path.format({ root: "d:/Dev/", name: "sample", ext: "txt" }));

path.parse("/home/user/dir/file.txt");

console.log(path.parse("/home/user/dir/file.txt"));

const myURL = new URL(
  "https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash"
);
console.log(myURL);

console.log(
  url.parse("https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash")
);
