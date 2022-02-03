const express = require('express');
const User = require('../models/User');
const Supply = require('../models/Supply');
const Customer = require('../models/Customer');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harryisgoodb$oy';
const fetchuser = require('../middleware/fetchuser');

// Route 1: create user using post : '/api/auth/createuser' . no login required
router.post('/createuser',[
    body('name','Name must be valid').isLength({min:3}),
    body('mobile','Mobile must be 10 digits').isLength({min:10,max:10}).custom(value => {
        return User.findOne({mobile:value}).then(user => {
          if (user) {
            return Promise.reject('Mobile already exits');
          }
        });
    }),
    body('password','Password atleast 5 char').isLength({min:5}),
    body('cpassword','Cpassword feild is required').notEmpty().custom((value, {req}) => { 
        //custom validator
        if(value!==req.body.password) {
          throw new Error('Password doesn\'t match');
        }
        return true;
    }),
    body('role','Role field is required').notEmpty(),

], async (req,res)=>{
    let type = 'error';
    // return validation error
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({type, errors: errors.array(),code:400});
    }
    try {
        // create user
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password,salt);
        
        user = await User.create({
            name: req.body.name,
            mobile: req.body.mobile,
            password: securePass,
            role:req.body.role,
        });
        res.json({type:'success',message:'user created sucessfully',code:200});
    } catch(error) {
        console.log(error.message);
        res.status(500).json({type,error: error.message,code:500});
    }
})

// Route 2: login user using post : '/api/auth/login' . no login required
router.post('/login',[
    body('mobile','Mobile must be 10 digits').isLength({min:10,max:10}),
    body('password','Password is required').notEmpty(),
], async (req,res)=>{
    // return validation error
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({type:'error',errors: errors.array(),code:400});
    }

    const {mobile,password} = req.body;
    try {
        let user = await User.findOne({mobile:mobile});
        if(!user) {
            const errData = [{value:'',msg:'Please enter correct mobile',param:'mobile',location:'body'}]
            return res.status(400).json({type:'error',errors:errData,code:400})
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare) {
            const errData = [{value:'',msg:'Please enter correct password',param:'password',location:'body'}]
            return res.status(400).json({type:'error',errors:errData,code:400})
        }
        const data = {
            user: {
                id:user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);
        res.json({type:'success',message:'login sucessfully',code:200,authtoken:authtoken,response:user});

    } catch(error) {
        res.status(500).json({type:'error',error: error.message,code:500});
    }
})

router.get('/listuser',fetchuser,async(req,res)=>{
    let type = 'error';
    try {
        let postSearchCount = [];
        const user = await User.find().sort({created_at: -1})
        user.forEach(data => {
            postSearchCount.push(getPostSearchCount(data));
        });
        Promise.all(postSearchCount).then((values) => {
            //console.log('values = ',values);
            res.json({type:'success',message:'User List get sucessfully',response:values,code:200});
        });
    }
    catch(error) {
        res.status(500).json({type,error: error.message,code:500});
    } 
})
async function getPostSearchCount(data) {
    let total_post = await Supply.find({user_id:data._id}).count();
    let total_search = await Customer.find({user_id:data._id}).count();
    let dataNew = {_id:data._id, name:data.name,mobile:data.mobile,passowrd:data.password,role:data.role,created_at:data.created_at,total_post:total_post,total_search:total_search};
    return dataNew; 
}

module.exports = router;