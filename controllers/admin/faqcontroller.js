var express = require('express');
var router = express.Router();
var faq= require('../../models/faq');
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
        const data = await faq.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
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
     var getData = await faq.findOne({'question':req.body.question}).exec();
      if (getData) {
      return res.status(400).json({ errors: "FAQ Already Exist " });
    }
            const add = new faq({
                'question':req.body.question,
                'answer':req.body.answer,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'FAQ created'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/update',verifyToken, body('faqId').not().isEmpty().withMessage('FAQ Id Required'),
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await faq.findOne({'_id':req.body.faqId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "FAQ Didn't Exist " });
    }
    let updateData = { 
        'question':req.body.question,
        'answer':req.body.answer,
        'userId':req.decoded.id
     };
        const data = await faq.findByIdAndUpdate(req.body.faqId,updateData).exec();
        
        return res.status(200).json({ success:'FAQ Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
try{
    const data = await faq.findOne({'_id':dataId}).exec();
    return res.status(200).json({ data:data });
}catch(err){
return res.status(500).json({ errors: err });
}
});

router.get('/remove/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const user = await faq.findByIdAndDelete(dataId)
    if(!user){
        return res.status(400).json({ errors: "FAQ Not Exits" });
    }
    return res.status(200).json({ success:"FAQ Deleted" });
    }
    catch(err){
    return res.status(500).json({ errors: err });
    }
});

module.exports = router;