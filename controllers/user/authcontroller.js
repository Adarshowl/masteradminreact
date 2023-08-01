var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { body, validationResult } = require('express-validator');
var users = require('../../models/users');
var verifyToken = require('../../middleware/verifytokenuser');
const usersecretKey='fgjhfgj%4456hjhghj'


router.post('/postsignup', 
  body('name').not().isEmpty().withMessage('name Required'), 
  body('phone').not().isEmpty().withMessage('phone Required'),
  body('email').not().isEmpty().withMessage('email Required'), 
  body('password').not().isEmpty().withMessage('password Required'), 
  async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the email already exists
      const existingUser = await users.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hash = await bcrypt.hashSync(req.body.password, saltRounds);
      const add = new users({
        "name": req.body.name,
        "email": req.body.email,
        "phone": req.body.phone,
        "password": hash,
      });
      await add.save();
      return res.status(200).json({message: 'Registration Successful'});
    } catch (err) {
      return res.status(500).json({ errors: err });
    }
  });

  



// userloin with email verification

  router.post('/postlogin', body('email').not().isEmpty().withMessage('email Required'), body('password').not().isEmpty().withMessage('password Required'), async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }
    let userdata = {
        username: req.body.email,
        password: req.body.password,
    };
    const user = await users.findOne({email:userdata.username}).where({'is_admin':0,'is_delete':0}).exec();
    if(!user){
        res.status(500).json({
            message: 'Account is not registered or deleted by the admin.'
        });
    }
    else{
      const match = await bcrypt.compare(userdata.password, user.password);
       if(match){
            if(user.status =='Active'){
                if(user.email_verified =="true"){
                    let token = jwt.sign({ id: user._id,name: user.name}, global.config.usersecretKey, {
                        algorithm: global.config.algorithm,
                        expiresIn: '7d'
                    });
                    const updateData= await users.findOneAndUpdate({'_id':user._id}, {'remember_token':token,});
                    res.status(200).json({
                        message: 'Login Successful',
                        jwtoken: token,
                        data:user
                    });
                }
                else {
                    res.status(500).json({
                        message: 'Please verify your email address to log in.'
                    });
                }
            } 
            else {
                res.status(500).json({
                    message: 'Your Account is Deactivate Please Contact to Admin'
                });
            }
        }else {
            res.status(500).json({
                message: 'Login Failed, Invalid Password'
            });
        }
    
    }
});

// without email verification
router.post('/login', body('email').not().isEmpty().withMessage('email Required'), body('password').not().isEmpty().withMessage('password Required'), async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }
    let userdata = {
        username: req.body.email,
        password: req.body.password,
    };
    const user = await users.findOne({email:userdata.username}).where({'is_admin':0,'is_delete':0}).exec();
    if(!user){
        res.status(500).json({
            message: 'Account is not registered or deleted by the admin.'
        });
    }
    else{
      const match = await bcrypt.compare(userdata.password, user.password);
       if(match){
        if(user.status =='Active'){
        let token = jwt.sign({ id: user._id,name: user.name}, usersecretKey, {
            // algorithm: global.config.algorithm,
            expiresIn: '7d'
        });
        const updateData= await users.findOneAndUpdate({'_id':user._id}, {'remember_token':token,});
        res.status(200).json({
            message: 'Login Successful',
            jwtoken: token,
            data:user
        });
        // console.log(updateData)
        
     } else {
        res.status(500).json({
            message: 'Your Account is Deactivate Please Contact to Admin'
        });
    }
  } else{
         res.status(500).json({
                message: 'Login Failed, Invalid Password'
            });
        }
    
    }
});

// user get profile api
router.get('/getprofile',verifyToken, async function(req, res, next){
    try{
        const data= await users.findOne({_id:req.decoded.id},{name:1,email:1,phone:1,image:1}).exec();
        
        return res.status(200).json({ success: 'Data Found', data:data });
      }catch(err){
        return res.status(500).json({ errors: err });
      }
});


// user changepassword api
router.post('/changepassword',verifyToken, body('current_password').not().isEmpty().withMessage('current_password Required'),body('new_password').not().isEmpty().withMessage('new_password Required'),body('confirm_password').not().isEmpty().withMessage('confirm_password Required'), async function(req, res, next){
    const errors = validationResult(req);
if (!errors.isEmpty()) {
 return res.status(400).json({ errors: errors.array() });
}
try{
if (req.body.new_password !== req.body.confirm_password ) {
 return res.status(400).json({ errors: "password mimatch" });
}
const data= await users.findOne({_id:req.decoded.id},{name:1,password:1}).exec();
const match = await bcrypt.compare(req.body.current_password, data.password);
if(match){
    const hash =await bcrypt.hashSync(req.body.new_password, saltRounds);
    await users.findByIdAndUpdate(req.decoded.id,{ 'password':hash}).exec();
return res.status(200).json({ success: 'Password Updated' });
}
return res.status(200).json({ error: 'Password mismatch'});
}catch(err){
return res.status(500).json({ errors: err });
}
});

module.exports = router;
