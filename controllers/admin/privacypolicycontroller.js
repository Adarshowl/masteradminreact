var express = require('express');
var router = express.Router();
var privacypolicy= require('../../models/privacypolicy');
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
        const data = await privacypolicy.findOne().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
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
            const data = await privacypolicy.findOne().exec();
            if(data){
                return res.status(400).json({ errors: "Privacy Policy Already Exists " });
            }
            const add = new privacypolicy({
                'privacy_policy':req.body.privacy_policy,
                'term_and_condition':req.body.term_and_condition,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'Privacy Policy Updated'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/update',verifyToken, body('privacyId').not().isEmpty().withMessage('privacyId Required'),
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await privacypolicy.findOne({'_id':req.body.privacyId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "Privacy Policy Didn't Exist " });
    }
    let updateData = { 
        'privacy_policy':req.body.privacy_policy,
        'term_and_condition':req.body.term_and_condition,
        'userId':req.decoded.id
     };
        const data = await privacypolicy.findByIdAndUpdate(req.body.privacyId,updateData).exec();
        
        return res.status(200).json({ success:'Privacy Policy Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});



module.exports = router;