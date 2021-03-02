<template>
  <div class="height-100-per width-100-per overflow-hidden  padding-10-px">
    <div class="height-100-per width-100-per overflow-hidden  padding-10-px">
      <a-dropdown>
        <a-button icon="upload">上传</a-button>
        <a-menu slot="overlay">
          <a-menu-item>

            <a-upload action="http://localhost:3000/api/file/upload"
                      :data="{url}"
                      @change="uploadSuccess"
                      method="post">
              上传文件
            </a-upload>
          </a-menu-item>
          <a-menu-item>
            <a-upload action="http://localhost:3000/api/file/upload"
                      :data="{url}"
                      directory
                      @change="uploadSuccess"

                      method="post">
              上传文件夹
            </a-upload>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-button @click="goback" icon="rollback" :disabled="url==='./file/'">返回上一级</a-button>
      <a-button @click="qwe" icon="rollback" :disabled="url==='./file/'">转换</a-button>
      <a-button @click="addFiles" icon="plus">新建文件夹</a-button>
      <div v-if="addFolderState" style="width: 100%" class="layout-left-top">
        <div class="layout-left-center" style="width: 100%;height:50px;cursor: pointer">
          <a-icon type="folder-open" style="height: 100%;width: 50px;font-size: 24px;" class="layout-center"></a-icon>
          <a-input v-model="addFolderName" style="width: 20%"></a-input>
          <a-icon type="close" style="height: 100%;width: 50px;font-size: 24px;" @click="cancelAddFolder" class="layout-center"></a-icon>
          <a-icon type="check" style="height: 100%;width: 50px;font-size: 24px;" @click="addFolder" class="layout-center"></a-icon>
        </div>
      </div>
      <div style="width: 100%" class="layout-left-top">
        <div class="layout-left-center" style="width: 100%;height:50px;cursor: pointer" v-for="(v,index) of Directory" @click="next(v)" :key="index" >
          <a-icon type="folder-open" style="height: 100%;width: 50px;font-size: 24px;" class="layout-center"></a-icon>
          <p style="text-align: center;">{{v}}</p>
        </div>
      </div>
      <div style="width: 100%" class="layout-left-top">
        <div class="layout-left-center" style="width: 100%;height:50px;cursor: pointer" v-for="(v,index) of unDirectory" :key="index">
          <a-icon type="file" style="height: 100%;width: 50px;font-size: 24px;" class="layout-center"></a-icon>
          <p style="text-align: center;">{{v}}</p>
        </div>
      </div>
      <a-empty v-if="Directory.length===0&&unDirectory.length==0" class="height-100-per layout-center-top" style="margin-top: 25%" >
        <span slot="description">暂无文件！</span>
      </a-empty>
    </div>
  </div>
</template>

<script>
  import {Icon,Button,Dropdown,Menu,Input,message,Empty,Upload} from "ant-design-vue"
  export default {
    name: "Index",
    components:{
      AUpload:Upload,
      AIcon:Icon,
      AEmpty:Empty,
      AInput:Input,
      AButton:Button,
      ADropdown:Dropdown,
      AMenu:Menu,
      AMenuItem:Menu.Item,
    },
    data(){
      return{
        Directory:[],
        unDirectory:[],
        url:"",
        uplodFile:{},
        addFolderName:"",
        httpUrl:"localhost:3000",
        addFolderState:false
      }
    },
    mounted(){
      this.getFileAll()
    },
    methods:{
      //新建文件夹
      addFiles(){
        this.addFolderState = true
      },
      //取消新建文件夹
      cancelAddFolder(){
        this.addFolderState = false
      },
      //确认新建文件夹
      addFolder(){
        this.addFolderState = false
        const url = this.url+"/"+this.addFolderName
        this.axios.post("http://" + this.httpUrl + "/api/file/addFolder",{url}).then((res) => {
          if(res.status===200){
            message.success(res.data)
          }else {
            message.error(res.data)
          }
          this.switchFloder(this.url,"layer")
        })
      },
      //返回上一级
      goback(){
        const url = this.url
        let state = "pre"
        this.switchFloder(url,state)
      },
      //下一级
      next(name){
        let state = "next"
        const url = name
        console.log(url)
        this.switchFloder(url,state)
      },
      qwe(){
        this.axios.get(`http://${this.httpUrl}/api/file/wordToPdf`)
      },
      //跳转文件夹
      switchFloder(url,state){
        this.axios.get(`http://${this.httpUrl}/api/file/getFileAllNext/?url=${url}&state=${state}`).then(res=>{
          console.log(res)
          this.Directory = res.data.Directory
          this.unDirectory = res.data.unDirectory
          this.url=res.data.url
          this.uplodFile=JSON.stringify({url:res.data.url})
        })
      },
      getFileAll(){
        this.axios.get(`http://${this.httpUrl}/api/file/getFileAll`).then((res) => {
          this.Directory = res.data.Directory
          this.unDirectory = res.data.unDirectory
          this.url=res.data.url
          this.uplodFile=JSON.stringify({url:res.data.url})
        }).catch((error) => {
          console.log(error);
        })
      },
      uploadSuccess(data){
        if(data.file){
          if(data.file.status==='done'){
            this.switchFloder(this.url,"layer")
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>
