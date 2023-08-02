var express = require('express');
var router = express.Router();
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
            const data = await users.find({"is_admin":0,"is_delete":0}).exec();
            return res.status(200).json({ success:'Data found', data:data });
    }catch(err){
        return res.status(500).json({ errors: err });
    }
});

router.post('/create', upload.single('image'),
verifyToken,
 async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
    let updateData = { 
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone,
        gender:req.body.gender,
        role:req.body.role,
        address:req.body.address
     };

    if (req.file && req.file.filename) {
        updateData.image = req.file.filename;
    }
    const saveUser = new users(updateData)
  
    await saveUser.save()
    return res.status(200).json({ success: 'User Created'});
    
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }
  
  
});

router.post('/update/:id', upload.single('image'),
verifyToken,
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
    const id = req.params.id;
    const user = await users.findById(id)

    if(!user){
      return res.status(400).json({ errors: "User Not Found" });
    }
    let updateData = { 
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone,
        gender:req.body.gender,
        role:req.body.role,
        address:req.body.address
     };

    if (req.file && req.file.filename) {
        updateData.image = req.file.filename;
    }
    const data = await users.findByIdAndUpdate(id,updateData);
    
     const newdata = await users.findById(id);
     return res.status(200).json({ success:'User Updated',data:newdata });
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }
  
});

router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
      const data = await users.findOne({'_id':dataId}).exec();
      return res.status(200).json({ data:data });
    }catch(err){
    return res.status(500).json({ errors: err });
    }
  });

router.get('/remove/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const user = await users.findByIdAndUpdate(dataId,{"is_delete":1})
    if(!user){
        return res.status(400).json({ errors: "User Not Exits" });
    }
    return res.status(200).json({ success:"User Deleted" });
    }
    catch(err){
    return res.status(500).json({ errors: err });
    }
});

router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const viewDatas= await users.findOne({'_id':dataId}).exec();

        if(viewDatas){
        var statusKey= viewDatas.status;
        var newStatusKey='';
            if(statusKey == 'Active'){
                newStatusKey= 'Deactive';
            }else{
                newStatusKey= 'Active';
            }
            await users.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
        }
        else{
            return res.status(400).json({ errors: "No Data Found" });
        }
        return res.status(200).json({ success:"Status Changed" });
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }

});


module.exports = router;