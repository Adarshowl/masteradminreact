var express = require('express');
var router = express.Router();
var aboutus= require('../../models/aboutus');
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
        const data = await aboutus.findOne().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
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
    const data = await aboutus.findOne().exec();
    if(data){
        return res.status(400).json({ errors: "About Us Already Exists " });
    }
            const add = new aboutus({
                'about_us':req.body.about_us,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'About Us Updated'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/update',verifyToken, body('aboutUsId').not().isEmpty().withMessage('aboutUsId Required'),
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await aboutus.findOne({'_id':req.body.aboutUsId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "About Us Didn't Exist " });
    }
    let updateData = { 
        'about_us':req.body.about_us,
        'userId':req.decoded.id
     };
        const data = await aboutus.findByIdAndUpdate(req.body.aboutUsId,updateData).exec();
        
        return res.status(200).json({ success:'About Us Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});



module.exports = router;