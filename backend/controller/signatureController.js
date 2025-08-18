/* 
# API การเซ็นและยกเลิกเซ็น (Signatures)
POST    /api/signatures                   - เซ็นประเมิน (กรรมการ)
DELETE  /api/signatures/{id}               - ยกเลิกการเซ็น
*/

const { Signatures } = require("./../model/signature.js");
const multer = require('multer'); //รับไฟล์
const path = require('path'); //กำหนด path
const fs = require('fs'); //สร้างpath
const jwt = require("jsonwebtoken");
const { User } = require("../model/users.js");


const secure = process.env.JWT

const signatureDir = "Signature";
if(!fs.existsSync(signatureDir)) fs.mkdirSync(signatureDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, signatureDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = "signature-" + Math.round(Math.random() * 1e9);
        ch(null, uniqueSuffix, path.extname("Signature-" + Math.round(Math.random() * 1e9)));
    }
})

const signature_file = multer({ storage });

async function uploadSignature(req, res) {
    const file = req.file;
    const token = req.get("Authorization");
    const { reason } = req.body;

    if(!token){
        return res.status(401).json({"message": "Unauthor"});
    };

    try{
        var decoded = jwt.verify(token, secure);
        if (!decoded){
            return res.status(401).json({"message": "Unauthor"});
        }
    }  catch (err) {
        return res.status(401).json({"message": "Unauthor"});
    };

    if(!file){
        return res.status(404).json({
            "message": "No file upload"
        })

    };

    
    try{
        const users = await User.findOne({
            where:{
                username: decoded.username
            }
        });


        const filepath = file.path;
        const file_name = file.originalname;
        try {
            await Signatures.create({
                assessment_id: users.username,
                signer_id: users.username,
                signature_path: filepath,
                status: "active",
                reason: reason
            })


            return res.json({
                "message": "success",
                filepath,
                file_name,
                "status": "active"
            })
        }catch(err){
            return res.status(401).json({"message": "Error while trying to save"});
        }
    } catch (err){
        return res.status(401).json({"message": "Error while trying to save"});
    }

}

async function unSign(req, res) {
    const token = req.get("Authorization");
    const { reason } = req.body;

    if(!token){
        return res.status(401).json({"message": "Unauthor"});
    };

    try{
        var decoded = jwt.verify(token, secure);
        if (!decoded){
            return res.status(401).json({"message": "Unauthor"});
        }
    }  catch (err) {
        return res.status(401).json({"message": "Unauthor"});
    };

    try{
        const users = await User.findOne({
            where:{
                username: decoded.username
            }
        });

        const sign = await Signatures.findOne({
            where: {
                assessment_id: users.id,
                status: "active"
            }
        })

        await sign.update({
            status: "revoke"
        })

        return res.json({
            "message": "success",
            filepath,
            file_name,
            "status": "revoke"
        })
    } catch (err){
        return res.status(401).json({"message": "Unauthor"});
    }
    
}

