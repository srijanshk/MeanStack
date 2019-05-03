const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check');

const config = require('../../../config/env_config/config');
const userModel = require('../../../models/user');


const register = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    let { username, password, role } = req.body;

    let isUsernameExists = await userModel.findOne({"username" : username});

    if(isUsernameExists){
        return res.status(409).json({
            "errors" : [{
                "msg" : "username already exists"
            }]
        })
    }

    let hashedPassword = await bcrypt.hash(password, 8);

    try{
        let user = await userModel.create({
            username : username,
            password : hashedPassword,
            role: role
        });
    
        if(!user){
            throw new error();
        }
    
        return res.status(201).json({
            "success" : [{
                "msg" : "user registered successfully"
            }]
        });
    }catch(error){
        console.log(error);
        return res.status(500).json(
            { 
                "errors" : [{
                    "msg": "there was a problem registering a user."   
                }]
            }
        );
    }
    

}

const login = async (req,res,next) => {

    const errors = validationResult(req);

   



    let { username, password } = req.body

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        let isUserExists = await userModel.findOne({"username" : username});

        let isPasswordValid = await bcrypt.compare(password, isUserExists.password);

        if(!isUserExists || !isPasswordValid){
            return res.status(401).json({
                "errors" : [{
                    "msg" : "username/password is wrong"
                }]
            })
        }

        let token = jwt.sign({ id: isUserExists._id }, config.secret, { expiresIn: 86400 });


        res.status(200).json({
            "success" : [{
                "msg" : "user login successfully",
                "username" : username,
                  "role" : isUserExists.role,
                "token" : token
            }]
        })
    }catch(error){
        console.log(error);
        return res.status(500).json(
            { 
                "errors" : [{
                    "msg": "there was a problem login a user."   
                }]
            }
        );
    }
    
}

module.exports = {
    register : register,
    login : login
}