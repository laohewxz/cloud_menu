import {get} from "../../utils/db"
const db = wx.cloud.database()
Page({
  data:{
     menu:[],
     keyword:'',//搜索框
    pageSize:4,
    page:0
  },
  onShow(){//页面加载获取第一页的内容
      this.data.menu=[]
      this.data.page=0;
      let {page,pageSize} = this.data
      this.getList(page,pageSize)

  },
  onReachBottom(){//触底加载更多
     this.data.page += 1;
     var pageSize = this.data.pageSize;
     this.getList(this.data.page,pageSize)
  },
  async getList(page,pageSize){//获取列表数据
    var result = await db.collection("menu").skip(page*pageSize).limit(pageSize).get()
    this.setData({
      menu:this.data.menu.concat(result.data)
    })

  },
  // async onShow(){
  // var res = await get("menu")//读取menu数据库的信息 渲染到页面
  // this.setData({
  //   menu:res.data
  // })
  // },
  toDetail(e){//点击图片跳转到详情页面
    var id = e.currentTarget.id
    console.log(id)
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id='+id,
    })
  },
  //点击图标 --菜谱分类
  toMenuType(){
    wx.navigateTo({
      url: '../typelist/typelist',
    })
  },
  myInput(e){//输入框内的内容
    // console.log(e.detail.value)
    this.data.keyword = e.detail.value
   },
   search(){//点击搜索
    //跳转页面
      wx.navigateTo({
        url: '../recipelist/recipelist?keyword='+this.data.keyword,
      })
   },
   //点击各种菜谱
   async toType(e){
    //  console.log(e.currentTarget.id)
     var data={
       typeName:e.currentTarget.id
     }
     var res = await get("menuType",data)
    //  console.log(res.data[0]._id)
     var id = res.data[0]._id
     wx.navigateTo({
      url: '../recipelist/recipelist?id=' + id,
    })
   }
})