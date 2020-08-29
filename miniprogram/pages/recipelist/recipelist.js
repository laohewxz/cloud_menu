// pages/recipelist/recipelist.js
import { getById, get } from "../../utils/db"
const db = wx.cloud.database()
Page({
  data: {
    typeName: '',
    menu: [],//id传值得到的菜谱
  },
  async onLoad(e) {
    // console.log(e)
    if (e.id) {//在分类列表里通过id传值渲染页面
      var id = e.id
      var res = await getById("menuType", id) //根据id获取到菜谱分类名称
      var typeName = res.data.typeName //菜谱分类名称
      this.setData({
        typeName
      })
      var typeId = res.data._id //菜谱分类id
      var result = await get("menu", { typeId: typeId })
      this.setData({
        menu: result.data
      })
      wx.setNavigationBarTitle({//换title名字
        title: this.data.typeName,
      })
    }else{//在搜索页面通过keyword传值获取到菜谱名称
      var keyword = e.keyword
      var res_ = await db.collection("menu").where({
        menuName:db.RegExp({
          regexp:keyword,
          options:'i'
        })
      }).get()
      this.setData({
        menu:res_.data
      })
    }

  },
  //点击图片跳转到详情页
  toDetail(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
    })
  }
})