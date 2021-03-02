const express = require("express")
const url = require("url")
const fs = require("fs")
const path = require('path');
const  formidable= require("formidable")
let addressFile = "./node/test/file"
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
    router.get("/api/file/getFileAll",(req,res)=>{
        fs.readdir(`./node/test/file`,function (err,files) {
            if(err){
                console.log("未找到文件")
            }else {
                let Directory = [];
                let unDirectory = [];
                (function iterator(i) {
                    if(i===files.length){
                        let data={
                            Directory,
                            unDirectory,
                            url:"./file"
                        }
                        res.json(data)
                        return
                    }
                    fs.stat("./node/test/file/"+files[i],function (err,file) {
                        if(err){
                            console.log("出错了")
                            return
                        }
                        if(file.isDirectory()){
                            Directory.push(files[i])
                        }else {
                            unDirectory.push(files[i])
                        }
                        iterator(i+1)
                    })

                })(0)

                // res.json(files)

            }

        })
    })
    router.get("/api/file/getFileAllNext",(req,res)=>{
        const data = url.parse(req.url,true).query
        let address="./node/test/file/"
        if(data.state==="pre"){
            address =path.dirname(data.url)
        }else if(data.state==="next"){
            address = address+data.url
        }else if(data.state==="layer"){
            address =data.url
        }
        console.log(address)
        fs.readdir(address,function (err,files) {
            if(err){
                console.log("未找到文件")
            }else {
                let Directory = [];
                let unDirectory = [];
                (function iterator(i) {
                    if(i===files.length){
                        addressFile=address
                        let data={
                            Directory:Directory,
                            unDirectory:unDirectory,
                            url:address
                        }
                        res.json(data)
                        return
                    }
                    console.log("./file/"+files[i])
                    fs.stat(address+"/"+files[i],function (err,file) {
                        if(err){
                            console.log("出错了")
                            return
                        }
                        console.log(file.isDirectory())
                        if(file.isDirectory()){
                            Directory.push(files[i])
                        }else {
                            unDirectory.push(files[i])
                        }
                        iterator(i+1)
                    })

                })(0)
            }

        })
    })
    router.post("/api/file/upload",(req,res)=>{
        const form = formidable({ multiples: true });
        form.multiples=true;
        form.keepExtensions=true;
        form.uploadDir="./node/test/file"
        form.parse(req, (err, fields, files) => {
            if(err)(
              console.log("出错了喔")
            )
            res.json("成功了")
        });
        form.on("file",(filename,file)=>{
            // const name = file.name.substring(file.name.indexOf("/")+1,file.name.length)
            const arr = file.name.split("/")
            console.log(arr);
            let str2 = "./file"
            let str = ""
            let count =0
            const arr2 = addressFile.split("/")
            for (let i in arr2){
                if(i>0){
                    str+="\\"+arr2[i]
                }
            }
            for (let i in arr){
                count++
                str+="\\"+arr[i]
                str2+="/"+arr[i]
                if(i!=arr.length-1){
                    // console.log(str2)
                    console.log(process.cwd()+str)
                    console.log(fs.existsSync(process.cwd()+str))
                    if(!fs.existsSync(process.cwd()+str)){
                        fs.mkdir(process.cwd()+str,{ recursive: true },function (err) {
                            if(err){
                                console.log("新建文件夹出错了")
                            }
                        })
                    }
                }
            }
            if(count===arr.length){
                console.log("str")
                console.log(str)
                console.log(file.path)
                console.log("str")
                fs.renameSync(process.cwd()+"\\"+file.path,process.cwd()+str,(err,data)=>{
                    console.log(err);
                })
            }
        });
    })
    return router
}
