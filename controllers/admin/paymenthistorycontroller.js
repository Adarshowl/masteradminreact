var express = require('express');
var router = express.Router();
var paymenthistory= require('../../models/paymenthistory');
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
        const data = await paymenthistory.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
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
            const add = new paymenthistory({
                'username':req.body.username,
                'payment_type':req.body.payment_type,
                'payment_method':req.body.payment_method,
                'transaction_id':req.body.transaction_id,
                'country':req.body.country,
                'currency':req.body.currency,
                'amount':req.body.amount,
                'last4digit':req.body.last4digit,
                'exp_month':req.body.exp_month,
                'exp_year':req.body.exp_year,
                'payment_receipt':req.body.payment_receipt,
                'payment_status':req.body.payment_status,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'Payment history created'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});



router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
try{
    const data = await paymenthistory.findOne({'_id':dataId}).exec();
    return res.status(200).json({ data:data });
}catch(err){
    return res.status(500).json({ errors: err });
}
});


module.exports = router;