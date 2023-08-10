var express = require('express');
var router = express.Router();
var paymenthistory= require('../../models/paymenthistory');
var withdrawal= require('../../models/withdrawal');
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
        const data = await withdrawal.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.post('/create',verifyToken,
   async function(req, res, next){
        try{
          
            const randomNum = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
            const withdrawal_id = 'WDL-' + randomNum.toString();
            const d = new Date()
            const date = d.toLocaleDateString()
            const admin_pay_to_vendor = req.body.request_amount - (req.body.request_amount *(req.body.admin_commission/100))
              const add = new withdrawal({
                      'withdrawal_id':withdrawal_id,
                      "userId":req.decoded.id,
                      "request_amount":req.body.request_amount,
                      "total_amount":req.body.total_amount,
                      "current_amount":req.body.current_amount ,
                      "admin_commission":req.body.admin_commission,
                      "admin_payto_vendor":admin_pay_to_vendor,
                      "description":req.body.description,
                      "payout_date":date,
                  });
                 await add.save();
            return res.status(200).json({ success: 'Withdrawal created'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});



router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
try{
    const data = await withdrawal.findOne({'_id':dataId}).exec();
    return res.status(200).json({ data:data });
}catch(err){
    return res.status(500).json({ errors: err });
}
});


router.post('/statusUpdate',verifyToken, async function(req, res, next){
    try{
        const updateId = req.body.updateId
          const data = await withdrawal.findOne({'_id':updateId}).exec();
          if(data.status == "Approved" || data.status == "Rejected"){
              return res.status(200).json({ success:"Withdrawal already updated, No longer Update" });
          }else{
            if(req.body.status === 'Approved'){
                const newdata = await withdrawal.findOneAndUpdate({'_id':updateId},{
                    'status':req.body.status,
                    'current_amount':data.current_amount - data.request_amount,
                    payout_date:new Date()
                  }).exec();
            }else{
                const newdata = await withdrawal.findOneAndUpdate({'_id':updateId},{
                    'status':req.body.status,
                    payout_date:new Date()
                  }).exec();
            }
              
          }
          return res.status(200).json({ success:"status updated" });
    }catch(err){
      return res.status(500).json({ errors: err });
    }
  });

module.exports = router;