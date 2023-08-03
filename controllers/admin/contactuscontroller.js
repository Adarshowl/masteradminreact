var express = require('express');
var router = express.Router();
var contactus= require('../../models/contactus');
var verifyToken = require('../../middleware/verifytokenadmin');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
// multer start

const multer = require("multer");
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
// multer end

router.get('/list',verifyToken, async function(req, res, next){
  try{
        const data = await contactus.findOne().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.post('/create',verifyToken,
   async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const data = await contactus.findOne().exec();
    if(data){
        return res.status(400).json({ errors: "Contact Us Already Exists " });
    }
            const add = new contactus({
                'contact_us':req.body.contact_us,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'ContactUs Updated'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/update',verifyToken, body('contactUsId').not().isEmpty().withMessage('contactUsId Required'),
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await contactus.findOne({'_id':req.body.contactUsId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "Contact Us Didn't Exist " });
    }
    let updateData = { 
        'contact_us':req.body.contact_us,
        'userId':req.decoded.id
     };
        const data = await contactus.findByIdAndUpdate(req.body.contactUsId,updateData).exec();
        
        return res.status(200).json({ success:'Contact Us Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});



module.exports = router;