var express = require('express');
var router = express.Router();
var subscription= require('../../models/subscription');
var ticket= require('../../models/ticket');
var ticketreplymessage= require('../../models/ticketreplymessage');
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
        const data = await ticket.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/ticketmessagelist/:id',verifyToken, async function(req, res, next){
    try{
        let dataId= req.params.id;
          const data = await ticketreplymessage.find({'ticketId':dataId}).populate('userId',{name:1,image:1}).exec();
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
    var getUserData = await users.findById({'_id':req.decoded.id}).exec();
    const randomNum = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    const ticketId = 'T-' + randomNum.toString();
            const add = new ticket({
                'ticketId':ticketId,
                'name':getUserData?.name,
                'subject':req.body.subject,
                'email':getUserData?.email,
                'category':req.body.category,
                'description':req.body.description,
                'image':getUserData?.image,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'Ticket created'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/update',verifyToken, body('updateId').not().isEmpty().withMessage('Update Id Required'),
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await ticket.findOne({'_id':req.body.updateId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "Ticket Didn't Exist " });
    }
    let updateData = { 
        'subject':req.body.subject,
        'category':req.body.category,
        'description':req.body.description,
        'userId':req.decoded.id
     };
        const data = await ticket.findByIdAndUpdate(req.body.updateId,updateData).exec();
        
        return res.status(200).json({ success:'Ticket Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
try{
    const data = await ticket.findOne({'_id':dataId}).exec();
    return res.status(200).json({ data:data });
}catch(err){
    return res.status(500).json({ errors: err });
}
});

router.get('/remove/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const user = await ticket.findByIdAndDelete(dataId)
    if(!user){
        return res.status(400).json({ errors: "Ticket Not Exits" });
    }
    return res.status(200).json({ success:"Ticket Deleted" });
    }
    catch(err){
    return res.status(500).json({ errors: err });
    }
});

router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
try{
 const viewDatas= await ticket.findOne({'_id':dataId}).exec();
if(viewDatas){
var statusKey= viewDatas.status;
var newStatusKey='';
if(statusKey == 'Active'){
  newStatusKey= 'Deactive';
}else{
  newStatusKey= 'Active';
}
 await ticket.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
}
return res.status(200).json({ success:"Status Changed" });
}catch(err){
return res.status(500).json({ errors: err });
}
});

router.post('/ticket-reply',verifyToken,
   async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
            const add = new ticketreplymessage({
                'ticketId':req.body.ticketId,
                'message':req.body.message,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'Reply Sent'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
module.exports = router;