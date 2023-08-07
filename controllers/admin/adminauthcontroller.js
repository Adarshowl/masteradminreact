var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { body, validationResult } = require('express-validator');
var users = require('../../models/users');
var role = require('../../models/role');
let verifyToken = require('../../middleware/verifytokenadmin');
const adminsecretKey='fgjhfgj%4456hjhghj'

router.post("/postlogin", body('email').not().isEmpty().withMessage('email Required'), body('password').not().isEmpty().withMessage('password Required'), async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }
    let userdata = {
    username: req.body.email,
    password: req.body.password,
    };
    const user = await users.findOne({email:userdata.username}).exec();
    if(!user){
        res.status(500).json({
        message: 'Login Failed, Invalid Email or Invalid Password'
        });
    }else{
    // const match = await bcrypt.compare(userdata.password, user.password);
    // if(match){
        if(user.status =='Active'){
            const roledata =await role.find({role_name:user.role})
           
            let token = jwt.sign({ id: user._id,name: user.name},adminsecretKey, {
            // algorithm: global.config.algorithm,
            expiresIn: '7d'
            });
            const updateData= await users.findOneAndUpdate({'_id':user._id}, {'remember_token':token,});
            res.status(200).json({
            message: 'Login Successful',
            jwtoken: token,
            data:user,
            role:roledata
            });
           }   else {
                res.status(500).json({
                message: 'Login Failed, User Blocked'
                });
        }
    // }
    // else {
    // res.status(500).json({
    // message: 'Login Failed, Invalid Password'
    // });
    // }
}
 });








 module.exports = router;