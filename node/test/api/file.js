const express = require("express")
const url = require("url")
const fs = require("fs")
module.exports = ()=>{
    const router = express.Router()
    router.get("/getFileAll",(req,res)=>{
        const data = url.parse(req.url,true).query
        let baseUrl
      if(!data.directoryName){
          console.log("data")
          baseUrl = "./file"
      }
        fs.readdir(baseUrl,(err,data)=>{
            if(err){
                console.log(err)
                return
            }
            const directory={
                isDirectory:[],
                Directory:[]
            };
            (function iterator(i) {
                if (i === data.length) {
                    res.json(directory)
                    return
                }
                fs.stat( baseUrl+"/" + data[i], function (err, file) {
                    console.log( baseUrl+"/" + data[i])
                    if (err) {
                        console.log("出错了")
                        return
                    }
                    if (file.isDirectory()) {
                        directory.Directory.push({
                            name: data[i],
                            size: file.size,
                            mtime: file.mtime
                        })
                    } else {
                        directory.isDirectory.push({
                            name: data[i],
                            size: file.size,
                            mtime: file.mtime
                        })
                    }
                    iterator(i + 1)
                })
            })(0)
            // for (let v of data){
            //     console.log("/file/"+v)
            //     fs.stat("/file/"+v,(err,file)=>{
            //         if (err) {
            //             console.log("出错了")
            //             return
            //         }
            //         if(file.isDirectory()){
            //             directory.Directory.push(v)
            //         }else {
            //             directory.isDirectory.push(v)
            //         }
            //     })
            // }
            console.log(data)
            // res.send(directory)
        })

    })
    router.get("/getName",(req,res)=>{
        const data = url.parse(req.url,true).query
        console.log(data.name)
        res.send("張三")
    })
    return router
}