const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Supply = require('../models/Supply');
const moment = require('moment');

router.post('/create',fetchuser,[
    body('taxi_type','Taxi type field is required').notEmpty(),
    body('pickup_city','Pickup city field is required').notEmpty(),
    body('drop_city','Drop city field is required').notEmpty(),
    body('fare','Fare minium 100').isNumeric(),
    body('available_date','Avialable date field is required').notEmpty().custom((value) => { 
        //custom validator
        if(!(moment(value, "YYYY-MM-DD").isValid())) {
          throw new Error('Available date must be in YYYY-MM-DD format');
        }
        return true;
    }),
    body('available_time','Avialable date field is required').notEmpty()
],async(req,res)=>{
    let errors = validationResult(req);
    let type = 'error';
    if(!errors.isEmpty()) {
        return res.status(400).json({type, errors: errors.array(),code:400});
    }
    try {
        supply = await Supply.create({
            taxi_type:req.body.taxi_type,
            pickup_city:req.body.pickup_city,
            drop_city:req.body.drop_city,
            fare:req.body.fare,
            commission:req.body.commission,
            available_date:new Date(req.body.available_date).toISOString(),
            //available_time:req.body.available_time,
            available_time:new Date(req.body.available_date).toISOString(),
            user_id:req.user.id
        })
        return res.status(200).json({type:'success',message:'Supply created successfully',code:200,response:supply})
    }
    catch(error) {
        res.status(500).json({type,error: error.message,code:500});
    }
})
router.get('/list',fetchuser,async(req,res)=>{
    let type = 'error';
    try {
        userId = req.user.id;
        if(userId == '61c2ff213b5efa7af77d85ba') {
            supply = await Supply.find().sort({created_at: -1}).populate('user_id');
        } else {
            supply = await Supply.find({user_id:userId}).sort({created_at: -1});
        }
        return res.json({type:'success',message:'Supply created successfully',code:200,response:supply})
    }
    catch(error) {
        console.log(error);
        res.status(500).json({type,error: error.message,code:500});
    }
})

router.post('/update/:id',fetchuser,[
    body('taxi_type','Taxi type field is required').notEmpty(),
    body('pickup_city','Pickup city field is required').notEmpty(),
    body('drop_city','Drop city field is required').notEmpty(),
    body('fare','Fare minium 100').isNumeric(),
    body('available_date','Avialable date field is required').notEmpty().custom((value) => { 
        //custom validator
        if(!(moment(value, "YYYY-MM-DD").isValid())) {
          throw new Error('Available date must be in YYYY-MM-DD format');
        }
        return true;
    }),
    body('available_time','Avialable date field is required').notEmpty()
],async(req,res)=>{
    let errors = validationResult(req);
    let type = 'error';
    if(!errors.isEmpty()) {
        return res.status(400).json({type, errors: errors.array(),code:400});
    }
    try {
        // check updating supply is exits by id
        let supply = await Supply.findById(req.params.id);
        if(!supply) {
            return res.status(202).json({ type,error:'supply not found',code:202});
        }
        // check updating supply is created by loggedin user
        if(supply.user_id.toString() != req.user.id) {
            return res.status(202).json({ type,error:'you not have permission to update this supply',code:202});
        }
        //const {taxi_type,pickup_city,drop_city,fare,commission,available_date,available_time} = req.body;
        // update supply
        const newSupply = req.body;
        newSupply.available_date =new Date(req.body.available_date).toISOString(),
        newSupply.available_time = new Date(req.body.available_date).toISOString(),
        note = await Supply.findByIdAndUpdate(req.params.id,{$set:newSupply},{new:true});
        return res.status(200).json({type:'success',message:'node sucessfully updated',code:200,response:[]})
    }
    catch(error) {
        res.status(500).json({type,error: error.message,code:500});
    }
})

router.delete('/delete/:id',fetchuser, async (req,res)=>{
    let type = 'error';
    try {
        // check deleting supply is exits by id
        let supply = await Supply.findById(req.params.id);
        if(!supply) {
            return res.status(202).json({type:'error',message:'Supply not found',code:202})    
        }
        // check deleting supply is creating by logged in user
        if(supply.user_id.toString() != req.user.id) {
            return res.status(401).json({type:'error',message:'You have not permission to delete this supply',code:401})
        }
        // delete the supply
        supply = await Supply.findByIdAndDelete(req.params.id);
        res.json({type:'success',message:'supply sucessfully deleted',code:200,response:[]});
    }    
    catch(error) {
        res.status(500).json({type,error: error.message,code:500});
    }
})
module.exports = router;