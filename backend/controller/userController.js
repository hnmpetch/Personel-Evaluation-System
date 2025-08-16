const { where } = require('sequelize');
const { User } = require('../model/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secure = process.env.JWT
salt_round = 10


async function register(req, res) {

    const { name, lastname, password, email, phone, age, role, discription, profile, signature, country, city, work_role } = req.body;
    
    if (!name || !lastname || !password || !email || !phone || !age || !role || !discription || !profile || !signature || !country || !city || !work_role){
        return res.status(400).json({"message": "Missing info"});
    }
    const pass = await bcrypt.hash(password, salt_round);

    try {
        const exitUser = await User.findOne({ where: {username : name}})

        if(exitUser){
            return res.status(400).json({"message": "user has registed"})
        }

        console.log(exitUser)
        
        

        console.log(`pass : ${pass}`)


        const newUser = await User.create({
            username: name,
            password: pass,
            name: name,
            lastname: lastname,
            email: email,
            phone: phone,
            age: age,
            role: role,
            discription: discription,
            profile: profile,
            signature: signature,
            country: country,
            city: city,
            work_role: work_role
        })


        return res.json({"message": "success", newUser})


    } catch (err) {
        return res.status(400).json({"message": `Fail to register error ${err} `})
    }

}

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

        if (!user) {
            return res.status(400).json({"message": "username or password not correct"});
        };

        try {
            const token = jwt.sign({
                id: user.id,
                username: user.username,
                role: user.role
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

async function get_Users(req, res) {
    try {
        
        const users = await User.findAll();
        return res.json(users)
        
    } catch {
        return res.status(400).json({"message": "Fail to get user"})
    }
}


module.exports = {
    register,
    login,
    get_Users
}