const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const keys = require('/Users/kartikeya/Documents/Web-Development/Rest-Shop/config/keys')


const User = require('../models/user')

router.post('/signup', (req,res,next)=>{
    User.find({
        email : req.body.email
    }).exec().then((user)=>{
        if(user.length >=1){
            return res.status(409).json({
                message : 'Email exists.'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err,hash)=>{
                if(err){
                    return res.status(500).json({
                        message : 'An error occurred.',
                        error : err
                    });
                }else{
                    const user = new User({
                        _id : mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    });
                    user.save().then((result)=>{
                        console.log(result);
                        res.status(201).json({
                            message : 'User created.'
                        })
                    }).catch((err)=>{
                        console.log(err);
                        res.status(500).json({
                            error : err,
                            message : 'An error occured in the creation of the user.'
                        })
                    })
                }
            })
        }
    })
})

router.post('/login', (req,res,next)=>{
    User.find({
        email : req.body.email
    }).exec().then((user)=>{
        if(user.length < 1){
            return res.status(401).json({
                message : 'Auth failed.'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err,result)=>{
            if(err){
                return res.status(401).json({
                    message : 'Auth failed.'
                })
            }
            if(result){
                const token = jwt.sign({
                    email : user[0].email,
                    userID : user[0]._id
                }, keys.privateKey.jwtKEY, {
                    expiresIn : "1h"
                })
                return res.status(200).json({
                    message : 'Auth successful.',
                    token : token
                })
            }
            res.status(401).json({
                message : 'Auth failed.'
            })
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            message : 'An error occured.',
            error : err
        })
    })
})


router.delete('/:userId', (req,res,next)=>{
    const id = req.params.userId;
    User.remove({
        _id : id
    }).exec().then((result)=>{
        res.status(200).json({
            message : 'User successfully deleted.'
        })
    }).catch((err)=>{
        res.status(500).json({
            error : err
        })
    })
})





module.exports = router;