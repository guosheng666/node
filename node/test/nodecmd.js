let express = require("express")
const url = require("url")

const mysql= require('mysql');

const router = require("./api/file")
//跨域
const cros = require("cors")
let app = express()
app.use(cros())
app.use(router())


let connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'node'
});
connection.connect();
connection.query('SELECT * FROM USER', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

connection.end();

console.log(__dirname)
app.use(express.static(__dirname+"\\file"))
// app.get("/getName",(req,res)=>{
//     const data = url.parse(req.url,true).query
//     console.log(data.name)
//     res.send("張三")
// })
console.log("启动成功")
app.listen(3000)
