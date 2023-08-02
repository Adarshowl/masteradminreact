var express = require('express');
var router = express.Router();
var category= require('../../models/category');
var subcategory= require('../../models/subcategory');
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
        const data = await subcategory.find().populate('main_category_id',{'category_name':1}).sort({"createdAt":-1}).exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});
router.post('/create',verifyToken,upload.single('image'), 
body('categoryId').not().isEmpty().withMessage('categoryId Required'),
  async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
            var getData = await subcategory.findOne({'sub_category_name':req.body.sub_category_name}).exec();
            if (getData) {
            return res.status(400).json({ errors: "Sub-Category Name Already Exist " });
          }
            let updateData = { 
              main_category_id:req.body.categoryId,
              sub_category_name:req.body.sub_category_name,
           };
      
            if (req.file && req.file.filename) {
                updateData.image = req.file.filename;
            }
            const add = new subcategory(updateData);
            await add.save()
            return res.status(200).json({ success: 'Sub Category Created'});
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/show/:id',verifyToken, async function(req, res, next){
        let dataId= req.params.id;
  try{
        const data = await subcategory.findOne({'_id':dataId}).exec();
        return res.status(200).json({ data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/update',verifyToken, upload.single('image'),
  async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
      var getData = await subcategory.findOne({'_id':req.body.categoryId}).exec();
      if (!getData) {
      return res.status(400).json({ errors: "sub category Didn't Exist " });
    }
    let updateData = { 
      sub_category_name:req.body.sub_category_name,
   };

    if (req.file && req.file.filename) {
        updateData.image = req.file.filename;
    }

    if (req.file && req.file.filename) {
      updateData.image = req.file.filename;
    }
        const data = await subcategory.findByIdAndUpdate(req.body.categoryId,updateData).exec();
        
        return res.status(200).json({ success:'Sub Category Updated' });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
        let dataId= req.params.id;
  try{
       const viewDatas= await subcategory.findOne({'_id':dataId}).exec();
    if(viewDatas){
      var statusKey= viewDatas.status;
      var newStatusKey='';
      if(statusKey == 'Active'){
        newStatusKey= 'Deactive';
      }else{
        newStatusKey= 'Active';
      }
       await subcategory.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
    }
    return res.status(200).json({ sucess:"Status Changed" });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/subcategoryByCategoryId/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
try{
  const data = await subcategory.find({'main_category_id':dataId}).exec();
  return res.status(200).json({ data:data });
}catch(err){
return res.status(500).json({ errors: err });
}
});

module.exports = router;