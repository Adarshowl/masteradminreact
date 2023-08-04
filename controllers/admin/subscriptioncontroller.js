var express = require('express');
var router = express.Router();
var subscription= require('../../models/subscription');
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
        const data = await subscription.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
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
     var getData = await subscription.findOne({'title':req.body.title}).exec();
      if (getData) {
      return res.status(400).json({ errors: "Subscription Already Exist " });
    }
            const add = new subscription({
                'title':req.body.title,
                'description':req.body.description,
                'offer_name':req.body.offer_name,
                'popular_status':req.body.popular_status,
                'amount':req.body.amount,
                'currency':req.body.currency,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'Subscription created'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/update',verifyToken, body('subscriptionId').not().isEmpty().withMessage('Subscription Id Required'),
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await subscription.findOne({'_id':req.body.subscriptionId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "Subscription Didn't Exist " });
    }
    let updateData = { 
        'title':req.body.title,
        'description':req.body.description,
        'offer_name':req.body.offer_name,
        'popular_status':req.body.popular_status,
        'amount':req.body.amount,
        'currency':req.body.currency,
        'userId':req.decoded.id
     };
        const data = await subscription.findByIdAndUpdate(req.body.subscriptionId,updateData).exec();
        
        return res.status(200).json({ success:'Subscription Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
try{
    const data = await subscription.findOne({'_id':dataId}).exec();
    return res.status(200).json({ data:data });
}catch(err){
    return res.status(500).json({ errors: err });
}
});

router.get('/remove/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const user = await subscription.findByIdAndDelete(dataId)
    if(!user){
        return res.status(400).json({ errors: "Subscription Not Exits" });
    }
    return res.status(200).json({ success:"Subscription Deleted" });
    }
    catch(err){
    return res.status(500).json({ errors: err });
    }
});

module.exports = router;