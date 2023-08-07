var express = require('express');
var router = express.Router();
var subscription= require('../../models/subscription');
var role= require('../../models/role');
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

router.get('/rolelist',verifyToken, async function(req, res, next){
    try{

        const data = await role.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
        
        return res.status(200).json({ success:'Data found', data:newdata });
    }catch(err){
      return res.status(500).json({ errors: err });
    }
});

router.get('/rolelistbyname/:id',verifyToken, async function(req, res, next){
    try{
        let dataId= req.params.id;
        const data = await role.find({'role_name':dataId}).exec();
        return res.status(200).json({ data:data });
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
     var getData = await role.findOne({'role_name':req.body.role_name,'module':req.body.module}).exec();
      if (getData) {
      return res.status(400).json({ errors: "Module Already Exist " });
    }
            const add = new role({
                'role_name':req.body.role_name,
                'module':req.body.module,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'Module created'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});


router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
    
    try{
        let dataId= req.params.id;
    console.log(dataId)
    const viewDatas= await role.findOne({'_id':dataId}).exec();
    console.log(viewDatas)
        if(viewDatas){
        var statusKey= viewDatas.status;
        var newStatusKey='';
            if(statusKey == 'Active'){
                newStatusKey= 'Deactive';
            }else{
                newStatusKey= 'Active';
            }
            const update = await role.findByIdAndUpdate({'_id':dataId}, {'status':newStatusKey});
            console.log(update)
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

router.get('/createstatusUpdate/:id',verifyToken, async function(req, res, next){
    
    try{
        let dataId= req.params.id;
    console.log(dataId)
    const viewDatas= await role.findOne({'_id':dataId}).exec();
    console.log(viewDatas)
        if(viewDatas){
        var statusKey= viewDatas.create;
        var newStatusKey='';
            if(statusKey == 'Active'){
                newStatusKey= 'Deactive';
            }else{
                newStatusKey= 'Active';
            }
            const update = await role.findByIdAndUpdate({'_id':dataId}, {'create':newStatusKey});
            console.log(update)
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

router.get('/readstatusUpdate/:id',verifyToken, async function(req, res, next){
    
    try{
        let dataId= req.params.id;
    console.log(dataId)
    const viewDatas= await role.findOne({'_id':dataId}).exec();
    console.log(viewDatas)
        if(viewDatas){
        var statusKey= viewDatas.read;
        var newStatusKey='';
            if(statusKey == 'Active'){
                newStatusKey= 'Deactive';
            }else{
                newStatusKey= 'Active';
            }
            const update = await role.findByIdAndUpdate({'_id':dataId}, {'read':newStatusKey});
            console.log(update)
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

router.get('/updatestatusUpdate/:id',verifyToken, async function(req, res, next){
    
    try{
        let dataId= req.params.id;
    console.log(dataId)
    const viewDatas= await role.findOne({'_id':dataId}).exec();
    console.log(viewDatas)
        if(viewDatas){
        var statusKey= viewDatas.update;
        var newStatusKey='';
            if(statusKey == 'Active'){
                newStatusKey= 'Deactive';
            }else{
                newStatusKey= 'Active';
            }
            const update = await role.findByIdAndUpdate({'_id':dataId}, {'update':newStatusKey});
            console.log(update)
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

router.get('/deletestatusUpdate/:id',verifyToken, async function(req, res, next){
    
    try{
        let dataId= req.params.id;
    console.log(dataId)
    const viewDatas= await role.findOne({'_id':dataId}).exec();
    console.log(viewDatas)
        if(viewDatas){
        var statusKey= viewDatas.delete;
        var newStatusKey='';
            if(statusKey == 'Active'){
                newStatusKey= 'Deactive';
            }else{
                newStatusKey= 'Active';
            }
            const update = await role.findByIdAndUpdate({'_id':dataId}, {'delete':newStatusKey});
            console.log(update)
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