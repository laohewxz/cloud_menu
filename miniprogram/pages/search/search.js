// pages/search/search.js
import {get} from "../../utils/db"
const db = wx.cloud.database()
Page({
 data:{
    keyword:'',//搜索框里的内容
    menu:[],//降序后的内容
    arr:[]//本地存储的内容
 },
 async onLoad(){
   //热卖搜索
   var res = await db.collection("menu").orderBy("views","desc").limit(9).get() //将menu里的数据按views降序排列
   if(res.data.length > 6){//如果长度大于4  截掉后面的
     res.data.splice(5)
   }
   this.setData({
      menu:res.data
   })
   //近期搜索
 },
 onShow(){
  var arr = wx.getStorageSync('keyword') || []
  // console.log(arr)
  this.setData({
   arr
  })
 },
 toDetail(e){//点击去详情页
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id='+id,
    })
 },
 myInput(e){//输入框内的内容
  // console.log(e.detail.value)
  this.data.keyword = e.detail.value
 },
 search(){//点击搜索
  //在本地存储存输入内容
  var keyword = this.data.keyword
  var arr = wx.getStorageSync('keyword') || []
  var index = arr.findIndex(item=>{
    return item == keyword
  })
  if(index!=-1){
    arr.splice(index,1)
  }
  arr.unshift(keyword)
  wx.setStorageSync('keyword', arr)
  //跳转页面
    wx.navigateTo({
      url: '../recipelist/recipelist?keyword='+this.data.keyword,
    })
 },
 //点击近期搜索
 toList(e){
   var keyword = e.currentTarget.id
   wx.navigateTo({
    url: '../recipelist/recipelist?keyword='+keyword,
  })
 }
})