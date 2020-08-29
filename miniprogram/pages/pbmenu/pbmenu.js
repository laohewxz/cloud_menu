// pages/pbmenu/pbmenu.js
const app = getApp()
import { get,add } from "../../utils/db"
Page({
  data: {
    cateList: [],//菜谱分类
    files:[], //多张图片地址
    userInfo:{}//用户信息
  },
  async onLoad() {
    var res = await get('menuType')
    // console.log(res.data)
    this.setData({
      cateList: res.data,
      userInfo:app.globalData.userInfo
    })
  },
  bindselect(e){//点击添加图片
    // console.log(e)
    var tempFilePaths = e.detail.tempFilePaths
    var files = tempFilePaths.map(item=>{
      return {
        url:item
      }
    })
    this.setData({
      files
    })
  },
  async mysubmit(e){//点击提交按钮
   //上传图片
   var arr = []
   this.data.files.forEach(item=>{
     var nowtime = new Date().getTime()
     var ext = item.url.split(".").pop()
     var promise = wx.cloud.uploadFile({
       cloudPath:'img/'+nowtime+'.'+ext,
       filePath:item.url
     })
     arr.push(promise)
   })
   var result = await Promise.all(arr) //多张图片的云存储地址
   var newfiles = result.map(item=>{
     return {
       url:item.fileID
     }
   })
  //  console.log(newfiles)


   var fromInfo = e.detail.value //获取提交表单的信息
   console.log(fromInfo)
   var cateName = fromInfo.recipeTypeid//根据菜谱分类的名称筛选数据获取菜谱分类的id
    // console.log(cateName)
    var res =await get('menuType',{typeName:cateName})
    var typeId = res.data[0]._id //菜谱分类的id
    var data ={
      menuName:fromInfo.menuName,//菜谱名称
      fileIds:newfiles,//菜谱图片
      desc:fromInfo.desc,//菜谱描述
      addtime:new Date().getTime(),//时间
      nickName:this.data.userInfo.nickName,//添加人名字
      avatarUrl:this.data.userInfo.avatarUrl,//添加人头像
      follows:0,//关注数量
      views:0,//访问数量
      typeId:typeId//菜谱分类id
    }
    var res_ = await add("menu",data) //添加数据库
    // console.log(res_)
    wx.showToast({
      title: '发布成功',
    })
    wx.switchTab({//跳转到菜谱页面
      url: '../personal/personal',
    })
  }
})