// pages/recipeDetail/recipeDetail.js
const db = wx.cloud.database();//数据库引用
import { getById, add, get } from "../../utils/db"
Page({
  data: {
    detail: {},//一个菜谱的详细信息
    isLike: false,
    arr: [] ,//按照openid和menuid查找的内容
    id:''
  },
  async onLoad(e) {
    var id = e.id //菜谱id
    console.log(id)
    this.setData({
      id
    })
    var res = await getById("menu", id)
    var openid = res.data._openid //openid
    this.setData({
      detail: res.data
    })
    wx.setNavigationBarTitle({//换title名字
      title: this.data.detail.menuName,
    })
    var data = {
      menuId: id,
      _openid: openid
    }
    var result = await get('follow', data)//按照openid和menuid查找的内容
    // console.log(result.data)
    this.setData({
      arr: result.data
    })
    if (this.data.arr.length != 0) {//已经关注
      this.setData({
        isLike: true
      })
    } else {
      this.setData({//没有关注
        isLike: false
      })
    }
    //收藏自浏览-------------------------------
    const _ = db.command
    db.collection('menu').doc(this.data.id).update({
      data: {
        views: _.inc(1)
      },
      success:async res=>{
        var detail = await getById("menu",this.data.id)//重新渲染页面
        // console.log(detail.data)
        this.setData({
          detail:detail.data
        })
      }
    })//--------------------------------------
  },
  async like() {//点击关注
    this.setData({
      isLike: !this.data.isLike
    })
    if (this.data.isLike == true) {//点击关注
      //收藏自增-------------------------------
      const _ = db.command
      db.collection('menu').doc(this.data.id).update({
        data: {
          follows: _.inc(1)
        },
        success:async res=>{
          var detail = await getById("menu",this.data.id)//重新渲染页面
          // console.log(detail.data)
          this.setData({
            detail:detail.data
          })
        }
      })//--------------------------------------
      console.log("已经关注")
      var menuId = this.data.detail._id
      var data = {
        menuId,
        addtime: new Date().getTime()
      }
      var res = await add('follow', data)//添加到数据库
      // console.log(res)
      wx.showToast({
        title: '关注成功！',
      })
    }
    if (this.data.isLike == false) {//取消关注
      //收藏自增----------------------------------
      const _ = db.command
      db.collection('menu').doc(this.data.id).update({
        data: {
          follows: _.inc(-1)
        },
        success:async res=>{
          var detail = await getById("menu",this.data.id)//重新渲染页面
          console.log(detail.data)
          this.setData({
            detail:detail.data
          })
        }
      })//--------------------------------------
     
      console.log('取消关注')
      wx.cloud.callFunction({//用云函数批量删除
        name: 'del',
        data: {//传参
          a: this.data.detail._id,
          b: this.data.detail._openid
        },
        success: res => {
          wx.showToast({
            title: '已取消关注！',
          })
        }
      })
    }

  }
})
