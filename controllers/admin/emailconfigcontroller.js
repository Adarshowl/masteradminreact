var express = require('express');
var router = express.Router();
var rolename= require('../../models/rolename');
var emailconfig= require('../../models/emailconfig');
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
        const data = await emailconfig.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/create',verifyToken,
  async function(req, res, next){
  try{
    var getData = await emailconfig.findOne({'email':req.body.email}).exec();
      if (getData) {
      return res.status(400).json({ errors: "Email Already Exist" });
    }
    let updateData = { 
      'email': req.body.email,
      'smtp_server': req.body.smtp_server,
      'smtp_port': req.body.smtp_port,
      'username': req.body.username,
      'userId':req.decoded.id
     };
            const add = new emailconfig(updateData);
            await add.save()
            return res.status(200).json({ success: 'Email Setup Created'});
  }catch(err){
    return res.status(500).json({ errors: err });
    
  }
});
router.get('/show/:id',verifyToken, async function(req, res, next){
        let dataId= req.params.id;
  try{
        const data = await emailconfig.findOne({'_id':dataId}).exec();
        return res.status(200).json({ data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.post('/update',verifyToken,
 body('updateId').not().isEmpty().withMessage('updateId Required'),
  async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await emailconfig.findOne({'_id':req.body.updateId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "Data Not Found" });
    }
    let updateData = { 
      'email': req.body.email,
      'smtp_server': req.body.smtp_server,
      'smtp_port': req.body.smtp_port,
      'username': req.body.username,
      'userId':req.decoded.id
    };
        const data = await emailconfig.findByIdAndUpdate(req.body.updateId,updateData).exec();
        
        return res.status(200).json({ success:'Email Setup Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/remove/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
  try{
  const user = await emailconfig.findByIdAndDelete(dataId)
  if(!user){
      return res.status(400).json({ errors: "Data Not Found" });
  }
  return res.status(200).json({ success:"Email Setup Deleted" });
  }
  catch(err){
  return res.status(500).json({ errors: err });
  }
});

router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
        let dataId= req.params.id;
  try{
       const viewDatas= await emailconfig.findOne({'_id':dataId}).exec();
    if(viewDatas){
      var statusKey= viewDatas.status;
      var newStatusKey='';
      if(statusKey == 'Active'){
        newStatusKey= 'Deactive';
      }else{
        newStatusKey= 'Active';
      }
       await emailconfig.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
    }
    return res.status(200).json({ success:"Status Changed" });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});


module.exports = router;