var express = require('express');
var router = express.Router();
var subscription= require('../../models/subscription');
var paymentcredential= require('../../models/paymentcredential');
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
        const data = await paymentcredential.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
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
     var getData = await paymentcredential.findOne({'payment_method_name':req.body.payment_method_name}).exec();
      if (getData) {

      let updateData = { 
        'payment_method_name':req.body.payment_method_name,
        'environment':req.body.environment,
        'test_key':req.body.test_key,
        'test_secret':req.body.test_secret,
        'live_key':req.body.live_key,
        'live_secret':req.body.live_secret,
        'userId':req.decoded.id
     }
     const data = await paymentcredential.findOneAndUpdate({'payment_method_name':req.body.payment_method_name},updateData).exec();
    }
    else{
        const add = new paymentcredential({
            'payment_method_name':req.body.payment_method_name,
            'environment':req.body.environment,
            'test_key':req.body.test_key,
            'test_secret':req.body.test_secret,
            'live_key':req.body.live_key,
            'live_secret':req.body.live_secret,
            'userId':req.decoded.id
        });
        await add.save()
    }
           
        return res.status(200).json({ success: 'Payment credential updated'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/update',verifyToken, body('updateId').not().isEmpty().withMessage('update Id Required'),
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await paymentcredential.findOne({'_id':req.body.updateId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "Payment Credential Didn't Exist " });
    }
    let updateData = { 
        'payment_method_name':req.body.payment_method_name,
        'environment':req.body.environment,
        'test_key':req.body.test_key,
        'test_secret':req.body.test_secret,
        'live_key':req.body.live_key,
        'live_secret':req.body.live_secret,
        'userId':req.decoded.id
     };
        const data = await paymentcredential.findByIdAndUpdate(req.body.updateId,updateData).exec();
        
        return res.status(200).json({ success:'Payment Credential Updated' });
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