const jwt = require("jsonwebtoken");
import Tags from '@base/src/midleware/models/tags';
import dbConnect from '@base/src/midleware/mongodb'
import { IsIncludes } from '@base/src/utils/helper/containBE';
import { ValidatePagination } from '@base/src/utils/helper/paginationBE';

export default async function handler(req:any, res:any) {
  const { method } = req
    const b = req?.body
    const q = req?.query

  await dbConnect()
  switch (method) {
    case 'GET' :
        try {
            const { page, limit } = await ValidatePagination(q)
            const queryExe = { tag: IsIncludes(q?.tag) }
            const total = await Tags.count({})
    
            let tags = await Tags.find(queryExe).sort({ createdAt: -1 }).skip(page).limit(limit)
    
            res.status(200).json({ msg: 'success', tag: tags, total: total })
        } catch (error) {
            res.status(500).json({ msg: 'internal server err' })    
        }

        break
    case 'POST':
    try {
        let tag_modals = new Tags({
            tag: b?.tag,
        })

        try {
            tag_modals.save()
            res.status(200).json({  msg:'berhasil menambahkan tags' });
        } catch (error) {
            res.status(500).send({ msg: 'gagal menyimpan data' })
        }

    } catch (error) {
        res.status(400).json({ success: false })
    }
      break
    case 'PUT':
        try {
            await Tags.findOneAndUpdate({ _id: q?._id }, {
                tag: b?.tag
            },{ useFindAndModify: false })
            res.status(200).send({ msg: 'success' })
        } catch (error) {
            res.status(500).send({ msg: 'gagal mengubah data' })   
        }
        break;
    case 'DELETE':
        try {
            await Tags.deleteOne({ _id: q?._id })
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