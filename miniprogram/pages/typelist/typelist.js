// pages/typelist/typelist.js
import {get} from "../../utils/db"
Page({
  data:{
      menuType:[]
  },
 async onLoad(){
    var res = await get("menuType")
    // console.log(res.data)
    this.setData({
      menuType:res.data
    })
  },
  toLook(e){
    console.log(e.currentTarget.id )
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipelist/recipelist?id=' + id,
    })
  }
})