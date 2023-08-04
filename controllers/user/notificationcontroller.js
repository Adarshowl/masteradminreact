var express = require('express');
var router = express.Router();
var notification= require('../../models/notification');
var notificationtbl= require('../../models/notificationtbl');
var users= require('../../models/users');
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
        
          var data = await notificationtbl.find({'user_id':req.decoded.id}).sort({"createdAt":-1});
          var totalunread =await notificationtbl.find({'user_id':req.decoded.id,'read_status':"UnRead"}).countDocuments();
          return res.status(200).json({ success:'Data found', data:data,totalunread });
    }catch(err){
      return res.status(500).json({ errors: err });
    }
  });
  
  router.get('/show/:id',verifyToken, async function(req, res, next){
   
    try{
       await notification.findOneAndUpdate({'_id':req.params.id.toString()}, {'read_status':"Read"});
       var data = await notificationtbl.findOneAndUpdate({'user_id':req.decoded.id,'notificationid':req.params.id}, {'read_status':"Read"});
      return res.status(200).json({ success:"Status Changed ",data:data });
    }catch(err){
      return res.status(500).json({ errors: err });
    }
  });

module.exports = router;