// pages/pbmenutype/pbmenutype.js
import { add, get, getById, modify, dele } from "../../utils/db"
Page({
  data: {
    showAdd: false,
    showchange: false,
    addmenu: '',//添加分类名称
    changemenu: '',//修改分类名称
    allCate: [],//数据库所有的信息
    oneId: ''
  },
  async onShow() {
    var result = await get('menuType')
    this.setData({
      allCate: result.data
    })
  },
  addbtn() {//点击添加按钮出现添加
    this.setData({
      showAdd: true,
      showchange: false
    })
  },
  async addInfo() {//点击添加
    var data = {
      typeName: this.data.addmenu,
      addime: new Date().getTime()
    }
    var res = await add('menuType', data)//添加数据库
    wx.showToast({
      title: '添加成功',
    })
    var result = await get('menuType')//读取数据库
    this.setData({
      allCate: result.data,
      showAdd: false
    })
  },
  async changeInfo(e) {//点击修改
    this.setData({
      showAdd: false,
      showchange: true
    })
    console.log(e.currentTarget.id)
    var _id = e.currentTarget.id
    var res = await getById("menuType", _id)//根据id查询
    this.setData({
      oneId: res.data._id
    })

  },
  async changeName() {//点击了下方的修改按钮
    var result = await modify(this.data.oneId, this.data.changemenu)
    var result = await get('menuType')//读取数据库 重新渲染页面
    this.setData({
      allCate: result.data,
      showchange: false
    })
    wx.showToast({
      title: '修改成功',
    })
  },
  async delInfo(e) {//点击删除
    var id = e.currentTarget.id
    var res = await dele("menuType", id)
    var result = await get('menuType')//读取数据库 重新渲染页面
    this.setData({
      allCate: result.data,
      showchange: false
    })
    wx.showToast({
      title: '删除成功',
    })
  }
})