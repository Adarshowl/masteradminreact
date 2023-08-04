const express = require("express");
const router = express.Router();
var users= require('../../models/users');
const { body, validationResult } = require('express-validator');
let verifyToken = require('../../middleware/verifytokenadmin');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require("multer");
require('dotenv').config();

// console.log(crypto)





const storage = multer.diskStorage({
  destination:(req,file,callback)=>{
      callback(null,"./uploads")
  },
  filename:(req,file,callback)=>{
      const filename = `image-${Date.now()}.${file.originalname}`
      callback(null,filename)
  }
});
const upload = multer({
  storage,
});

// console.log(upload)

// multer end

// admin get profile
router.get('/getprofile', verifyToken,  async (req, res) => {
    try{
        const data= await users.findOne({_id:req.decoded.id},{name:1,email:1,phone:1,address:1,image:1}).exec();
        return res.status(200).json({ success: 'Data Found', data:data });
      }catch(err){
        return res.status(500).json({ errors: err });
      }
});


// admin update profile
router.post("/updateprofile", verifyToken, upload.single('image'), 
body('name').not().isEmpty().withMessage('name Required'),
body('address').not().isEmpty().withMessage('address Required'),
 body('phone').not().isEmpty().withMessage('phone Required'), async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      let data = {
        name:req.body.name ,
        address:req.body.address,
        phone:parseInt(req.body.phone),
      }
      if (req.body.image) {
        data.image = req.body.image;
      }
     
        const res1=  await users.findByIdAndUpdate(req.decoded.id,data).exec();
        return res.status(200).json({ success: 'Profile Updated' });
    }catch(err){
        return res.status(500).json({ errors: err });
    }
});


// admin change password

router.post("/changepassword", verifyToken, body('current_password').not().isEmpty().withMessage('current_password Required'),body('new_password').not().isEmpty().withMessage('new_password Required'),body('confirm_password').not().isEmpty().withMessage('confirm_password Required'), async (req, res, next) => {
    const errors = validationResult(req);
if (!errors.isEmpty()) {
 return res.status(400).json({ errors: errors.array() });
}
try{
if (req.body.new_password !== req.body.confirm_password ) {
 return res.status(400).json({ errors: "password mimatch" });
}
const data= await users.findOne({_id:req.decoded.id},{name:1,password:1}).exec();
const match = await bcrypt.compare(req.body.current_password, data.password);
if(match){
    const hash =await bcrypt.hashSync(req.body.new_password, saltRounds);
    await users.findByIdAndUpdate(req.decoded.id,{ 'password':hash}).exec();
return res.status(200).json({ success: 'Password Updated' });
}
return res.status(200).json({ error: 'Password mismatch'});
}catch(err){
return res.status(500).json({ errors: err });
}
});

module.exports = router;