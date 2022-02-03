const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Supply = require('../models/Supply');
const Customer = require('../models/Customer');
const User = require('../models/User');
const CustomerContact = require('../models/CustomerContact')
const moment = require('moment');
const { response } = require('express');
// for search
router.post('/search',fetchuser,[
    body('pickup_city','Pickup city field is required').notEmpty(),
    body('drop_city','Drop city field is required').notEmpty(),
    body('search_date','Search Date field is required').notEmpty().custom((value) => { 
        //custom validator
        if(!(moment(value, "YYYY-MM-DD").isValid())) {
          throw new Error('Search date must be in YYYY-MM-DD format');
        }
        return true;
    }),
],async(req,res)=>{
    let errors = validationResult(req);
    let type = 'error';
    if(!errors.isEmpty()) {
        return res.status(400).json({type, errors: errors.array(),code:400});
    }
    try {
        const customer = await Customer.create({
            pickup_city:req.body.pickup_city,
            drop_city:req.body.drop_city,
            search_date:new Date(req.body.search_date).toISOString(),
            user_id:req.user.id
        })
        const supply = await Supply.find({pickup_city:req.body.pickup_city,drop_city:req.body.drop_city,status:true,available_date:req.body.search_date}).populate("user_id");
        console.log('supply',supply);
        return res.json({type:'success',message:'Customer taxi available',response:supply,code:200,customer_id:customer._id})
    }
    catch(error) {
        res.status(500).json({type,error: error.message,code:500});
    }
})
// for search contact
router.post('/search-contact',fetchuser,[
    body('supplier_id','Supplier id field is required').notEmpty(),
    body('customer_id','Customer id field is required').notEmpty(),
    body('message','Message field is required').notEmpty(),
],async(req,res)=>{
    let errors = validationResult(req);
    let type = 'error';
    if(!errors.isEmpty()) {
        return res.status(400).json({type, errors: errors.array(),code:400});
    }
    try {
        const customerContact = await CustomerContact.create({
            supplier_id:req.body.supplier_id,
            customer_id:req.body.customer_id,
            message:req.body.message
        })
        return res.json({type:'success',message:'Contact sucessfully get back soon',response:[],code:200})
    }
    catch(error) {
        res.status(500).json({type,error: error.message,code:500});
    }
})
// for search list
router.get('/search-list',fetchuser,async(req,res)=>{
    let type = 'error';
    try {
        const customer = await Customer.find().sort({created_at: -1}).populate('user_id');
        res.json({type:'success',message:'Customer search list get sucessfully',response:customer,code:200});
    }
    catch(error) {
        res.status(500).json({type,error: error.message,code:500});
    } 
})
// for search contact list 
router.get('/search-contact-list/:id',fetchuser,async(req,res)=>{
    let type = 'error';
    try {
        const customer = await Customer.findById(req.params.id).populate('user_id',['_id','name','mobile']);
        if(customer) {
            const customerContact = await CustomerContact.find({customer_id:req.params.id}).sort({created_at: -1}).populate({ 
                path: 'supplier_id',
                populate: {
                  path: 'user_id',
                } 
             });
            let response = {};
            response.customer = customer;
            response.customerContact = customerContact;
            res.status(200).json({type:'success',message:'success',response:response,code:200});
        } else {
            res.json({type:'success',message:'Customer nout found',response:[],code:200});
        }
    }
    catch(error) {
        console.log(error.message);
        res.status(500).json({type,error: error.message,code:500});
    } 
})

module.exports = router;