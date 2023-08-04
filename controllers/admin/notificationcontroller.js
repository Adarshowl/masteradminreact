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

router.post("/create", verifyToken,upload.single('image'), 
 body('module').not().isEmpty().withMessage('module Required'),
 body('message').not().isEmpty().withMessage('message Required'),
 body('type').not().isEmpty().withMessage('type Required'), async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
   
        if(req.body.type == "Individual"){
        let noti = {
            user_id:req.body.id,
            user_type:"User",
            notificationtype:req.body.type,
            module:req.body.module,
            message:req.body.message,
            notification_on:"Admin_Push",
        }
          if (req.file && req.file.filename) {
            noti.image = req.file.filename;
          }
        const add = new notification(noti);
        const notificationid =  await add.save();
        let noti2 = {
            user_id:req.body.id,
            notificationid:notificationid._id,
            user_type:"User",
            notificationtype:req.body.type,
            module:req.body.module,
            message:req.body.message,
            notification_on:"Admin_Push",
        }
        if (req.file && req.file.filename) {
            noti2.image = req.file.filename;
          }
        const add2 = new notificationtbl(noti2);
            await add2.save();
            
        }
        else{
            const data = await users.find({'is_admin':0}).distinct('_id').exec();
            if(data){
                let noti = {
                    user_id:"all",
                    user_type:"User",
                    notificationtype:req.body.type,
                    module:req.body.module,
                    message:req.body.message,
                    notification_on:"Admin_Push",
                }
                  if (req.file && req.file.filename) {
                    noti.image = req.file.filename;
                  }
            const add = new notification(noti);
            const notificationid =  await add.save();
            // let noti2 = {
            //     user_id:data[i],
            //     notificationid:notificationid._id,
            //     user_type:"User",
            //     notificationtype:req.body.type,
            //     module:req.body.module,
            //     message:req.body.message,
            //     notification_on:"Admin_Push",
            // }
            // if (req.file && req.file.filename) {
            //     noti2.image = req.file.filename;
            //   }
                for (let i = 0; i < data.length; i++) {
                const add2 = new notificationtbl({
                    'user_id':data[i],
                    'notificationid':notificationid._id,
                    'user_type':"User",
                    'notificationtype':req.body.type,
                    'module':req.body.module,
                    'message':req.body.message,
                    'notification_on':"Admin_Push",
                    'image':(req.file && req.file.filename) ? req.file.filename : ''
                });
                await add2.save();
                }
            }

        }
        return res.status(200).json({ success:'Notification created'});
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }
});
router.get('/list',verifyToken, async function(req, res, next){
    try{
        var data = await notification.find().sort({"createdAt":-1});
        var totalunread =await notification.find({'admin_read_status':"UnRead"}).countDocuments();
        return res.status(200).json({ success:'Data found', data:data,totalunread });
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }

});

router.get('/show/:id',verifyToken, async function(req, res, next){
    try{
        var data = await notification.findOneAndUpdate({'_id':req.params.id}, {'admin_read_status':"Read"});

        return res.status(200).json({ success:'Data found', data:data });
    }catch(err){
        return res.status(500).json({ errors: err });
    }

});

router.get('/activity/list',verifyToken, async function(req, res, next){
    try{
       var data = await notification.find({'notification_on':"Activity"}).sort({"createdAt":-1});
          var totalunread =await notification.find({'admin_read_status':"UnRead",'notification_on':"Activity"}).countDocuments();
          return res.status(200).json({ success:'Data found', data:data,totalunread });
  }catch(err){
   return res.status(500).json({ errors: err });
  }
   
  });
  router.get('/activity/show/:id',verifyToken, async function(req, res, next){
    try{
      var data = await notification.findOneAndUpdate({'_id':req.params.id}, {'admin_read_status':"Read"});
      const newdata = await notification.findOne({'_id':req.params.id});
          return res.status(200).json({ success:'Data found', data:newdata });
  }catch(err){
   return res.status(500).json({ errors: err });
  }
   
  });

router.get('/Admin_Push/list',verifyToken, async function(req, res, next){
    try{
        var data = await notification.find({'notification_on':"Admin_Push"}).sort({"createdAt":-1});
        var totalunread =await notification.find({'admin_read_status':"UnRead",'notification_on':"Admin_Push"}).countDocuments();
        return res.status(200).json({ success:'Data found', data:data,totalunread });
    }catch(err){
        return res.status(500).json({ errors: err });
    }

});

router.get('/Admin_Push/show/:id',verifyToken, async function(req, res, next){
    try{
        var data = await notification.findOneAndUpdate({'_id':req.params.id}, {'admin_read_status':"Read"});

        return res.status(200).json({ success:'Data found', data:data });
    }catch(err){
        return res.status(500).json({ errors: err });
    }

});

module.exports = router;