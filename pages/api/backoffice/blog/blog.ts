const jwt = require("jsonwebtoken");
import Blog from '@base/src/midleware/models/blog';
import dbConnect from '@base/src/midleware/mongodb'
import { ValidatePagination } from '@base/src/utils/helper/paginationBE';

export default async function handler(req:any, res:any) {
  const { method } = req
    const b = req?.body
  const q = req?.query
  await dbConnect()
  switch (method) {
    case 'GET':
      try {
        const { page, limit } = await ValidatePagination(q)
        const queryExe = {  }
        const total = await Blog.count({})

        let blogs = await Blog.find(queryExe).sort({ createdAt: -1 }).skip(page).limit(limit)

        res.status(200).json({ msg: 'success', blog: blogs, total: total })
      } catch (error) {
          res.status(500).json({ msg: 'internal server err' })    
      }
      break;
    case 'POST':
    try {
        let blog = new Blog({
            title: b?.title,
            Content: b?.content,
            tag: b?.tag?.join(',')
        })

        try {
            blog.save()
            res.status(200).json({  msg:'berhasil menambahkan blog' });
        }catch{
            res.status(500).send({ msg: 'gagal menyimpan data' })
        }
    } catch (error) {
        res.status(400).json({ success: false })
    }
      break
    case 'PUT':
      try {
          await Blog.findOneAndUpdate({ _id: q?._id }, {
              title: b?.title,
              Content: b?.content,
              tag: b?.tag?.join(',')
          },{ useFindAndModify: false })
          res.status(200).send({ msg: 'success' })
      } catch (error) {
          res.status(500).send({ msg: 'gagal mengubah data' })   
      }
      break;
  case 'DELETE':
      try {
          await Blog.deleteOne({ _id: q?._id })
          res.status(200).send({ msg: 'success' })
      } catch (error) {
          res.status(500).send({ msg: 'gagal menghapus data' })   
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}