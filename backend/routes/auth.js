const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const User = mongoose.model("User");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRIP_API} = require('../config/keys')

// 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


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRIP_API
    }
}))

router.get('/protected', requireLogin, (req, res)=> {
    res.send("hello user")
})

router.post('/signup', (req, res) => {
    const {name,email,password,pic} = req.body;
    if(!name || !email || !password) {
     return res.status(422).json({error: 'Please fill in all the fields.'})
    }
User.findOne({email:email})
.then((savedUser)=> {
    if(savedUser) {
    return res.status(422).json({
        error: 'User already exists with that email'
    })
    }
    bcrypt.hash(password,12)
    .then(hashedPassword => {
        const user  = new User({
            email,
            password:hashedPassword,
            name,
            pic
        })

        user.save()
        .then(user=>{
            transporter.sendMail({
                to:user.email,
                from:"vishal.bhushan18@gmail.com",
            subject:"signed up successfully",
            html: "<h2>Welcome to Vishal's Instagram!</h2>"
            })
            res.json({message:"saved the user successfully"})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    
})
.catch(err=>{
    console.log(err)
})
})

router.post('/signin', (req,res) =>{
    const{email, password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please enter email and password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
         return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{
            if(domatch) {
            // res.json({message:"Successfully signed in!"})
        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
        const {_id,name,email,followers,following,pic} = savedUser
        res.json({token, user:{_id,name,email,followers,following,pic}})
    }
        else{
      return res.status(422).json({error:"Invalid email or password"})
        }
        })
        .catch(err => {
            console.log(err)
        })
    })
})


// router.post('reset-password',(req,res)=> {
//  crypto.random
// })

module.exports = router;