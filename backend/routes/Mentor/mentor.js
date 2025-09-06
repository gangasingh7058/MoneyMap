const { Router } = require("express");
const app=Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const JWT_SECRET=process.env.JWT_SECRET
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");


// // Ensure uploads folder exists
// const uploadDir = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Configure multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       const uniqueName = Date.now() + "-" + file.originalname;
//       cb(null, uniqueName);
//     }
//   });
  
//   const upload = multer({ storage });


// Profile Creation

app.post('/profile',async (req,res)=>{

    const {token,bio,expertise_tags,sebi_id}=req.body

    if(!token || !bio || !expertise_tags || !sebi_id){
        res.json({
            success:false,
            msg:"Send All Fields"
        })
    }

    try {
        const decoded=jwt.verify(token,JWT_SECRET)
        const user=await prisma.teacher.findUnique({
            where:{
                id:decoded.id
            }
        })

        if(!user){
            return res.json({
                success:false,
                msg:"Invalid User"
            })
        }

        const updatedUser=await prisma.teacher.update({
            where:{
                id:decoded.id
            },
            data:{
                bio:bio,
                expertise_tags:expertise_tags,
                sebi_id:sebi_id
            }
        })

        res.json({
            success:true,
            msg:"Profile Created Successfully",
            user:updatedUser
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }

})

// app.post('/intro_video',async (req,res)=>{
//     upload.single("intro_video")

//     const {token}=req.body

//     if(!token){
//         return res.json({
//             success:false,
//             msg:"Send Token"
//         })
//     }

//     try {
//         const decoded=jwt.verify(token,JWT_SECRET)
//         const user=await prisma.teacher.findUnique({
//             where:{
//                 id:decoded.id
//             }
//         })

//         if(!user){
//             return res.json({
//                 success:false,
//                 msg:"Invalid User"
//             })
//         }

//         const updatedUser=await prisma.teacher.update({
//             where:{
//                 id:decoded.id
//             },
//             data:{
//                 intro_video:req.file.filename
//             }
//         })

//         res.json({
//             success:true,
//             msg:"Intro Video Updated Successfully",
//         })
        
//     } catch (error) {
//         console.log(error)
//         res.json({
//             success:false,
//             msg:"Something went wrong"
//         })
//     }

// })


// Live Session Schedule

app.post('/live-session',async (req,res)=>{

    const {token,title,description,startTime,endTime}=req.body

    if(!token || !title || !description || !startTime || !endTime){
        return res.json({
            success:false,
            msg:"Send All Fields"
        })
    }

    try {
        
        const decoded=jwt.verify(token,JWT_SECRET)

        if(!decoded){
            return res.json({
                success:false,
                msg:"Invalid User"
            })
        }

        // register session to database

        const session=await prisma.session.create({
            data:{
                title:title,
                description:description,
                startTime:startTime,
                endTime:endTime,
                teacherId:decoded.id
            }
        })

        res.json({
            success:true,
            msg:"Session Created Successfully",
            session:session
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }

})


// One to One session booking

// get all bookings
app.get('/booking',async (req,res)=>{
    
    const {token}=req.headers

    if(!token){
        res.json({
            success:false,
            msg:"Send Token"
        })
    }

    try {
        
        const decode=jwt.verify(token,JWT_SECRET)

        if(!decode){
            return res.json({
                success:false,
                msg:"Invalid User"
            })
        }

        const bookings=await prisma.booking.findMany({
            where:{
                teacherId:decode.id
            }
        })

        res.json({
            success:true,
            msg:"Bookings Fetched Successfully",
            bookings:bookings
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }

})

// acknowledgw booking

app.post('/acknowledge',async (req,res)=>{
  
    const {token,bookingId,booking_verdict}=req.body

    if(!token || !bookingId || !booking_verdict){
        return res.json({
            success:false,
            msg:"Send All Fields"
        })
    }

    try {
        
        const decode=jwt.verify(token,JWT_SECRET)

        if(!decode){
            return res.json({
                success:false,
                msg:"Invalid User"
            })
        }

        const booking=await prisma.booking.findUnique({
            where:{
                id:bookingId
            },
            update:{
                status:booking_verdict
            }
        })

        res.json({
            success:true,
            msg:"Booking Acknowledged Successfully",
            booking:booking
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }
    

})

module.exports=app