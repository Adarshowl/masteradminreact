var express = require('express');
var router = express.Router();
var users= require('../../models/users');
var verifyToken = require('../../middleware/verifytokenadmin');


router.get('/list',verifyToken, async function(req, res, next){
  try{
        const data = await users.find({'is_admin':0}).sort({"createdAt":-1}).exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/view/:id',verifyToken, async function(req, res, next){
        let dataId= req.params.id;
  try{
        const data = await users.findOne({'_id':dataId},{'name':1,'email':1,'phone':1,'createdAt':1,'status':1}).exec();
        return res.status(200).json({ data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/update/:id',verifyToken, async function(req, res, next){
        let dataId= req.params.id;
  try{
       const viewDatas= await users.findOne({'_id':dataId},{'status':1}).exec();
    if(viewDatas){
      var statusKey= viewDatas.status;
      var newStatusKey='';
      if(statusKey == 'Active'){
        newStatusKey= 'Deactive';
      }else{
        newStatusKey= 'Active';
      }
       await users.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey,'remember_token':"Status changed"});
    }
    return res.status(200).json({ sucess:"Status Changed" });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});


router.get('/delete/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id
//   console.log(dataId)
  try{
//   const deleteUser = users.findOneAndUpdate({'_id':dataId}, {'is_delete':1})
const deleteUser = users.findByIdAndRemove({'_id':dataId})
   .catch(err => {
    return res.status(500).json({ errors: err });
   
 });
return res.status(200).json({ success:'User Deleted' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});



module.exports = router;