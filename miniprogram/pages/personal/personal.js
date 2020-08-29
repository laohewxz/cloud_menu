// pages/personal/personal.js
const app = getApp();
import { add, upload, get, dele, getById } from "../../utils/db.js"
const db=wx.cloud.database()
console.log(app)
Page({
  data: {
    loginInfo: '',//用户登录信息
    isLogin: false,
    userimg: '',//用户头像
    isshow: false,
    arr: ['菜单', '分类', '关注'],
    id: 0,
    cateList: [],//分类列表
    menu: [],//菜谱
    likeMenu:[]//关注的菜谱
  },
  async getLike(){//============获取关注数据===============
    var _openid=wx.getStorageSync('openid')
    var res = await get("follow",{_openid:_openid})
    var arr = res.data;
    var menuidArr= arr.map(item => {
      return item.menuId
    })
    var result = await get("menu",{//获取到menu里  所关注的信息
      _id:db.command.in(menuidArr)
    })
    this.setData({//渲染
    likeMenu:result.data
    })
  }
  ,
  async onLoad() {
    if (app.globalData.userInfo != null) {
      //如果有用户信息，直接渲染用户信息
      var loginInfo = app.globalData.userInfo;
      this.setData({
        loginInfo,
        isLogin: true
      })
    } else {
      //没有用户信息 回到app里拿信息
      app.userInfoReadyCallback = res => {
        this.setData({
          loginInfo: res.userInfo,
          isLogin: true
        })
      }
    }
    //============获取关注数据===============
    // this.getLike()
  },
  async onShow() {
    this.getLike() //获取关注数据
    var res = await get("menuType")
    this.setData({
      cateList: res.data
    })
    var openid = wx.getStorageSync("openid")
    var res = await get("menu", { _openid: openid })//读取menu数据库的信息 渲染到页面
    this.setData({
      menu: res.data
    })
  },
  todetail(e) {//点击bar切换页面
    var id = e.currentTarget.id
    this.setData({
      id
    })
  },
  toCate() {//点击头像跳到分类页面
    wx.navigateTo({
      url: '../pbmenutype/pbmenutype',
    })
  },
  addMenu() {//点击添加菜单按钮跳转页面
    wx.navigateTo({
      url: '../pbmenu/pbmenu',
    })
  },
  async myInfo(e) {
    app.globalData.userInfo = e.detail.userInfo;
    //点击登录获取用户信息
    this.setData({
      loginInfo: e.detail.userInfo,
      isLogin: true
    })
    var data = {
      nickName: this.data.loginInfo.nickName,
      avatarUrl: this.data.loginInfo.avatarUrl,
      openid: app.globalData.openid,
    }
    //添加数据库
    var res = await add("user", data)
  },
  toDetail(e) {//点击图片跳转到详情页
    var id = e.currentTarget.id
    console.log(id)
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
    })
  },
  async delMenu(e) {//点击删除按钮
    console.log(e)
    let { id, index } = e.currentTarget.dataset
    var info = await getById("menu",id)//获取具体的数据 找到云存储图片地址数组
    console.log(info.data.fileIds)
    var arr = info.data.fileIds.map(item=>{
      return item.url
    })
    wx.showModal({
      title: '你确定要删除吗？',
      success: res => {
        if (res.confirm) {
          // console.log(id)
          dele('menu', id)//先删除数据
          wx.cloud.deleteFile({//再删除图片地址
            fileList:arr
          }).then(res => {
            console.log(res.fileList)
          })
          //删除页面中的数据
          this.data.menu.splice(index, 1)
          this.setData({
            menu: this.data.menu
          })
          this.getLike() //获取关注数据,渲染关注的页面
        }
      }
    })
  },

  //=================分类列表=====================
  //点击查看
  toLook(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipelist/recipelist?id=' + id,
    })
  }

})
