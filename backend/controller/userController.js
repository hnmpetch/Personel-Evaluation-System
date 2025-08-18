/*
API User (Admin / ผู้รับการประเมิน / กรรมการ)
GET     /api/users/                      - ดึงรายชื่อผู้ใช้ทั้งหมด (Admin)
POST    /api/users/register              - เพิ่มผู้ใช้ใหม่
GET     /api/users/{id}                  - ดึงข้อมูลผู้ใช้ตาม ID
PUT     /api/users/{id}                  - แก้ไขข้อมูลผู้ใช้
DELETE  /api/users/{id}                  - ลบผู้ใช้
*/


const { where } = require('sequelize');
const { User } = require('../model/users.js');
const { Roles } =require("./../model/roles.js");
const { User_roles } =require("./../model/user_roles.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secure = process.env.JWT
salt_round = 10


async function register(req, res) {

    const {user_name, password, full_name, last_name, email, phone, role, department, position } = req.body;

    if (!user_name || !full_name || !last_name || !password || !email || !phone || !role || !department || !position){
        return res.status(400).json({"message": "Missing info"});
    }


    const pass = await bcrypt.hash(password, salt_round);

    try {
        const exitUser = await User.findOne({ where: {username : user_name}})

        if(exitUser){
            return res.status(400).json({"message": "user already register"})
        }

        console.log(exitUser)
        
        

        console.log(`pass : ${pass}`)

        const roles = await Roles.findOne({where:{name: role}})

        const newUser = await User.create({
            username: user_name,
            password_hash: pass,
            full_name: full_name,
            last_name: last_name,
            email: email,
            phone: phone,
        })

        const newUserRoles = await User_roles.create({
            user_id: newUser.isSoftDeleted,
            role_id: roles.id
        })


        return res.json({"message": "success", newUser, newUserRoles})


    } catch (err) {
        console.log("Fail to register user,  err: ", err)
        return res.status(400).json({"message": `Fail to register error ${err} `})
    }

}

async function getAllUsers(req, res) {

    const token = req.get("Authorization");

    
    if (!token){
        return res.status(401).json({"message": "Unauthor"});
    }

    var decoded = jwt.verify(token, secure);

    if(decoded.role != 'admin'){
        return res.status(401).json({"message": "Unauthor"});
    }

    try {
        
        const users = await User.findAll();
        return res.json(users)
        
    } catch {
        return res.status(400).json({"message": "Fail to get user"})
    }
}

async function getUser(req, res) {
    const id = req.params.id;

    if (!id || id == ''){
        return  res.send(404).json({
            "message": "No id"
        })
    }

    try {
        const user = await User.findAll({
            where:{
                id: id
            }
        })

        if (!user){
            return res.send(404).json({
                "message": "User not found"
            })
        }

        return res.json({
            user
        })
    } catch (err) {
        return res.send(404).json({
            "message": "User not found"
        })
    }
}

async function update_user(req, res) {

    const token = req.get("Authorization");

    try{
        var decoded = jwt.verify(token, secure);
        if (!decoded){
            return res.status(401).json({"message": "Unauthor"});
        }
    }  catch (err) {
        return res.status(401).json({"message": "Unauthor"});
    }

    
    if (!token){
        return res.status(401).json({"message": "Unauthor"});
    }

    const {user_name, full_name, last_name, email, phone} = req.body;

    if (!user_name || !full_name || !last_name || !password || !email || !phone){
        return res.status(400).json({"message": "Missing info"});
    }

    try {
        const old_user = await User.findOne({
            where: {
                username: decoded.username
            }
        })

        const new_user = await old_user.changed({
            username: user_name,
            full_name: full_name,
            last_name: last_name,
            email: email,
            phone: phone,

        })

        if(!new_user){
            return res.status(400).json({
                "message": "Fail to update"
            })
        }
    } catch (err){
        console.log("Fail to update user infom, error: ",  err)

        return res.status(400).json({
            "message": "Fail to update"
        })
    }


}


async function deleteUser(req, res) {

    const token = req.get("Authorization");
    const { id } = req.body;

    
    if (!token){
        return res.status(401).json({"message": "Unauthor"});
    }

    var decoded = jwt.verify(token, secure);

    if (!decoded){
        return res.status(401).json({"message": "Unauthor"});
    }

    try{
        await User.destroy({
            where:  {
                id: id
            }
        })

        return res.json({
            "message": "fail to delete user"
        })
    } catch(err){
        console.log("Fail to delete user, error: ", err)
        return res.status(400).json({
            "message": "fail to delete user"
        })
    }
    
}


module.exports = {
    register,
    getAllUsers,
    update_user,
    deleteUser
}