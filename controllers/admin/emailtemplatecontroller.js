var express = require('express');
var router = express.Router();
var emailtemplate= require('../../models/emailtemplate');
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
        const data = await emailtemplate.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
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
     var getData = await emailtemplate.findOne({'type':req.body.type}).exec();
      if (getData) {
      return res.status(400).json({ errors: "Email Type Already Exist " });
    }
            const add = new emailtemplate({
                'subject':req.body.subject,
                'type':req.body.type,
                'message':req.body.message,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'Email template created'});
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
      var getData = await emailtemplate.findOne({'_id':req.body.updateId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "Email Template Didn't Exist " });
    }
    let updateData = { 
        'subject':req.body.subject,
        'type':req.body.type,
        'message':req.body.message,
        'userId':req.decoded.id
     };
        const data = await emailtemplate.findByIdAndUpdate(req.body.updateId,updateData).exec();
        
        return res.status(200).json({ success:'Email Template Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
try{
    const data = await emailtemplate.findOne({'_id':dataId}).exec();
    return res.status(200).json({ data:data });
}catch(err){
    return res.status(500).json({ errors: err });
}
});

router.get('/remove/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const user = await emailtemplate.findByIdAndDelete(dataId)
    if(!user){
        return res.status(400).json({ errors: "Email Template Not Exits" });
    }
    return res.status(200).json({ success:"Email Template Deleted" });
    }
    catch(err){
    return res.status(500).json({ errors: err });
    }
});

router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
try{
 const viewDatas= await emailtemplate.findOne({'_id':dataId}).exec();
if(viewDatas){
var statusKey= viewDatas.status;
var newStatusKey='';
if(statusKey == 'Active'){
  newStatusKey= 'Deactive';
}else{
  newStatusKey= 'Active';
}
 await emailtemplate.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
}
return res.status(200).json({ success:"Status Changed" });
}catch(err){
return res.status(500).json({ errors: err });
}
});
module.exports = router;