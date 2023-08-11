var express = require('express');
var router = express.Router();
var users= require('../../models/users');
var invoice= require('../../models/invoice');
var invoiceproduct= require('../../models/invoiceproduct');
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
            const data = await invoice.find().populate('productId').sort({"createdAt":-1}).exec();
            return res.status(200).json({ success:'Data found', data:data });
    }catch(err){
        return res.status(500).json({ errors: err });
    }
});

router.post('/create',
verifyToken,
 async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        console.log(req.body)

    if (!Array.isArray(req.body.product)) {
        return res.status(400).json({ errors:"product not an Array" });
    }
    let subtotal = 0
    req.body.product.map((item) => {
        subtotal += item.product_price * item.product_quantity;
      })

    let productId = []
    for (let i = 0; i < req.body.product.length; i++){
        const add = new invoiceproduct(req.body.product[i])
        productId.push(add._id)
        await add.save()
    }

    // console.log('product id')
    // console.log(productId)
    const d = new Date()
    const date = d.toLocaleDateString()
    const currentYear = new Date().getFullYear().toString();
    const randomNum = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
    const invoiceId = '#' + currentYear + '-' + randomNum.toString();
    let data = {
        invoiceId:invoiceId,
        company_name:req.body.company_name,
        company_email:req.body.company_email,
        company_phone:req.body.company_phone,
        company_address:req.body.company_address,
        client_name:req.body.client_name,
        client_email:req.body.client_email,
        client_phone:req.body.client_phone,
        client_address:req.body.client_address,
        invoice_date:date,
        payment_type:req.body.payment_type,
        payment_status:req.body.payment_status,
        currency:req.body.currency,
        template:req.body.template,
        productId:productId,
        subtotal:subtotal
    }
    if(req.body.company_logo){
        data.company_logo = req.body.company_logo
    }
    const createInvoice = new invoice(data)
    await createInvoice.save()
    return res.status(200).json({ success: 'Invoice Created'});
    
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }
  
  
});

router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
      const data = await invoice.findOne({'_id':dataId}).populate('productId').exec();
      return res.status(200).json({ data:data });
    }catch(err){
    return res.status(500).json({ errors: err });
    }
  });

router.get('/remove/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const user = await invoice.findByIdAndDelete(dataId)
    if(!user){
        return res.status(400).json({ errors: "Invoice Not Exits" });
    }
    return res.status(200).json({ success:"Invoice Deleted" });
    }
    catch(err){
    return res.status(500).json({ errors: err });
    }
});



module.exports = router;