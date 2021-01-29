<template>
  <div>
    <img src="http://localhost:3000/top1.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    this.axios.get("getFileAll").then(res=>{
      console.log(res)
    })
    this.axios.get("getName?name={name:zhangsan}").then(res=>{
      console.log(res)
    })
  }
}
</script>

