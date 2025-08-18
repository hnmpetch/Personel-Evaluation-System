/*
API Authentication & User Management
POST    /api/auth/login                  - เข้าสู่ระบบ (JWT)
POST    /api/auth/logout                 - ออกจากระบบ
POST    /api/auth/refresh                - รีเฟรช token
GET     /api/auth/me                     - ข้อมูลผู้ใช้ปัจจุบัน
*/

const { User } = require("../model/users");
const { User_roles } = require('./../model/user_roles.js');
const { Roles } = require("./../model/roles.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secure = process.env.JWT
salt_round = 10


async function login(req, res) {
    const {email, password} = req.body;

    if (!email || !password){
        return res.status(400).json({"message": "Missing info"});
    }

    try {
        const user = User.findOne({
            where:  {
                email: email
            }
        });

        const user_role = await User_roles.findOne({
            where: {
                user_id: user.id
            }
        });

        const role = await Roles.findOne({
            where:  {
                id: user_role.role_id
            }
        });

        if (!user) {
            return res.status(400).json({"message": "username or password not correct"});
        };
        
        try{
            User.update({
                active: "active"
            })
        }  catch (err){
            return res.status(400).json({
                "message" : "Login Failed database not update.",
            });
        }

        try {


            const token = jwt.sign({
                username: user.username,
                email: user.email,
                role: role.name
            }, secure, {expiresIn: '30d'});

            return res.json({
                "message" : "Success",
                "token": token,
            });
            
        } catch (err) {
            return res.status(400).json({"message": "fail to load token"});
        }


    } catch (err) {
        return res.status(400).json({"message": "Fail to login"});
    }
}


async function logout(req, res) {
    const { token } = req.body;

    
    if (!token){
        return res.status(401).json({"message": "Unauthor"});
    }
    
    try {
        
        var decoded = jwt.verify(token, secure);

        const user = await User.findOne({
            where:  {
                email: decoded.email
            }
        });

        if (!user) {
            return res.status(400).json({"message": "Unauth"});
        };

        try {
            User.update({
                active: "inactive"
            })
            
            return res.json({
                "message" : "Success"
            });
            
        } catch (err) {
            return res.status(400).json({"message": "fail to update database"});
        }


    } catch (err) {
        return res.status(400).json({"message": "Fail to logout"});
    }
}


async function refresh(req, res) {
    const { token } = req.body;

    if (!token){
        return res.status(401).json({"message": "Unauthor"});
    }

    try{
        var decoded = jwt.verify(token, secure);
    }  catch (err) {
        return res.status(401).json({"message": "Unauthor"});
    }
    

    try {
        const token = jwt.sign({
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        }, secure, {expiresIn: '30d'});

        return res.json({
            "message" : "Success",
            "token": token,
        });
        
    } catch (err) {
        return res.status(400).json({"message": "fail to load token"});
    }
}

async function me(req, res) {

    const token = req.get("Authorization");

    
    if (!token){
        return res.status(401).json({"message": "Unauthor"});
    }


    try{
        var decoded = jwt.verify(token, secure);

        const user = await User.findOne({
            where:  {
                email: decoded.email
            }
        });

        const user_role = await User_roles.findOne({
            where: {
                user_id: user.id
            }
        });

        const role = await Roles.findOne({
            where:  {
                id: user_role.role_id
            }
        });

        try {
            var data = {
                "user_id": user.id,
                "user_name": user.user_name,
                "role": role.name,
                "full_name": user.full_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
            };

            return res.json(data);

        } catch(err){

        }
    } catch (err) {
        return res.status(401).json({"message": "Unauthor"});
    }

    
}

module.exports = {
    login,
    logout,
    refresh,
    me
}