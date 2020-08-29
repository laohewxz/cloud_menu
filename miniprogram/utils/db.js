const db = wx.cloud.database();//数据库引用
//添加数据库
async function add(_collection="",_data={}){
  return await db.collection(_collection).add({
        data:_data
  })
}
//条件查询
async function get(_collection="",_where={}){
  var result = await db.collection(_collection).where(_where).get()
  return result
}
//根据id查询
async function getById(_collection,id){
  return await db.collection(_collection).doc(id).get()
}
//修改
async function modify(id,newname){
  return await db.collection('menuType').doc(id).update({
    data:{
      typeName:newname,
      addime:new Date().getTime()
    }
  })
}
//删除
async function dele(_collection,id){
  return await db.collection(_collection).doc(id).remove()
}

//文件上传到云存储
async function upload(_filePath){
  var ext = _filePath.split(".").pop()
  var filename = new Date().getTime();
  return await wx.cloud.uploadFile({
    cloudPath: filename + "." + ext,
    filePath:_filePath
  })

}

export {add,upload,get,getById,modify,dele}