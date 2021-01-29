let express = require("express")
const url = require("url")

const router = require("./api/file")
//跨域
const cros = require("cors")
let app = express()
app.use(cros())
app.use(router())
app.use(express.static("./file/img"))
// app.get("/getName",(req,res)=>{
//     const data = url.parse(req.url,true).query
//     console.log(data.name)
//     res.send("張三")
// })
console.log("启动成功")
app.listen(3000)