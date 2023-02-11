import User from '@base/src/midleware/models/user'
const jwt = require("jsonwebtoken");
import dbConnect from '@base/src/midleware/mongodb'

export default async function handler(req:any, res:any) {
  const { method } = req

  await dbConnect()
  switch (method) {
    case 'POST':
      try {
        let user:any = await User.find({
          username: req.body.username,
          password: req.body.password,
        }); // check ke mongodb

          if (!user || user.length < 1) {
            return res.status(404).json({msg:'user unknow' , login: false});
          };
          
          const token = jwt.sign(
                { id: user?.[0]?._id, username: user?.[0]?.username },
                process.env.NEXT_PUBLIC_JWTTOKEN
            );
            res.status(200).json({ login: true, msg:'success', token: token, username: user?.[0].username, user_id:user[0]._id, profile_picture: user?.[0]?.profile_picture });
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}