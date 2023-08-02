var express = require('express');
var router = express.Router();
var category= require('../../models/category');
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
        const data = await category.find().populate('userId',{name:1}).sort({"createdAt":-1}).exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.post('/create',verifyToken,upload.single('image'), body('category_name').not().isEmpty().withMessage('category_name Required'),  async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    
    var getData = await category.findOne({'category_name':req.body.category_name}).exec();
      if (getData) {
      return res.status(400).json({ errors: "Category Name Already Exist " });
    }
            const img= req.file.filename;
            const add = new category({
                'category_name':req.body.category_name,
                'image':img,
                'userId':req.decoded.id
            });
            await add.save()
            return res.status(200).json({ success: 'Category Created'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.get('/show/:id',verifyToken, async function(req, res, next){
        let dataId= req.params.id;
  try{
        const data = await category.findOne({'_id':dataId}).exec();
        return res.status(200).json({ data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.post('/update',verifyToken, upload.single('image'), body('categoryId').not().isEmpty().withMessage('categoryId Required'),body('category_name').not().isEmpty().withMessage('category_name Required'), async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await category.findOne({'_id':req.body.categoryId},{_id: 1,banner: 1}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "category Didn't Exist " });
    }
    let updateData = { 'category_name': req.body.category_name };

    if (req.file && req.file.filename) {
      updateData.image = req.file.filename;
    }
        const data = await category.findByIdAndUpdate(req.body.categoryId,updateData).exec();
        
        return res.status(200).json({ success:'Category Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
        let dataId= req.params.id;
  try{
       const viewDatas= await category.findOne({'_id':dataId}).exec();
    if(viewDatas){
      var statusKey= viewDatas.status;
      var newStatusKey='';
      if(statusKey == 'Active'){
        newStatusKey= 'Deactive';
      }else{
        newStatusKey= 'Active';
      }
       await category.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
    }
    return res.status(200).json({ sucess:"Status Changed" });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});


module.exports = router;