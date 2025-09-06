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

app.get('/',(req,res)=>{
    res.json({
        success:true,
        msg:"Welcome From User"
    })
})

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

        // First, create or find expertise records
        const expertiseRecords = []
        for (const tagName of expertise_tags) {
            let expertise = await prisma.teacherExpertise.findUnique({
                where: { name: tagName }
            })
            
            if (!expertise) {
                expertise = await prisma.teacherExpertise.create({
                    data: { name: tagName }
                })
            }
            expertiseRecords.push({ id: expertise.id })
        }

        // Update teacher profile with bio and sebi_id, and connect expertise tags
        const updatedUser = await prisma.teacher.update({
            where: {
                id: decoded.id
            },
            data: {
                bio: bio,
                sebi_id: sebi_id,
                expertises: {
                    set: [], // Clear existing connections
                    connect: expertiseRecords // Connect new ones
                }
            },
            include: {
                expertises: true // Include expertise data in response
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

        const session=await prisma.liveSession.create({
            data:{
                title:title,
                description:description,
                startTime:new Date(startTime),
                endTime:new Date(endTime),
                teacherId:decoded.id
            }
        })

        res.json({
            success:true,
            msg:"Session Created Successfully",
            session:session
        })

    } catch (error) {
        console.log("Live session creation error:", error)
        res.json({
            success:false,
            msg:"Something went wrong: " + error.message
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
            },
            include:{
                student: {
                    select: {
                        name: true,
                        email: true
                    }
                }
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

// get mentor name
app.get('/name/:token',async (req,res)=>{

    const {token}=req.params

    if(!token){
        return res.json({
            success:false,
            msg:"Send Token"
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

        const user=await prisma.teacher.findUnique({
            where:{
                id:decoded.id
            }
        })

        res.json({
            success:true,
            msg:"User Fetched Successfully",
            user:user
        })
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }

})

// Get all mentors with their expertise tags
app.get('/all', async (req, res) => {
    try {
        const mentors = await prisma.teacher.findMany({
            include: {
                expertises: true
            },
            where: {
                bio: {
                    not: null
                },
                sebi_id: {
                    not: null
                }
            }
        })

        res.json({
            success: true,
            msg: "Mentors fetched successfully",
            mentors: mentors
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Something went wrong"
        })
    }
})

// Get mentors by expertise tags
app.get('/by-tags/:tags', async (req, res) => {
    try {
        const { tags } = req.params
        const tagArray = tags.split(',')

        const mentors = await prisma.teacher.findMany({
            include: {
                expertises: true
            },
            where: {
                bio: {
                    not: null
                },
                sebi_id: {
                    not: null
                },
                expertises: {
                    some: {
                        name: {
                            in: tagArray
                        }
                    }
                }
            }
        })

        res.json({
            success: true,
            msg: "Mentors fetched successfully",
            mentors: mentors
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Something went wrong"
        })
    }
})

// Get sessions for a specific mentor
app.get('/sessions/:id', async (req, res) => {
    try {
        const { id } = req.params

        const sessions = await prisma.liveSession.findMany({
            where: {
                teacherId: id,
                startTime: {
                    gte: new Date() // Only future sessions
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        })

        res.json({
            success: true,
            msg: "Sessions fetched successfully",
            sessions: sessions
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Something went wrong"
        })
    }
})

// Get mentor by ID
app.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const mentor = await prisma.teacher.findUnique({
            where: {
                id: id
            },
            include: {
                expertises: true
            }
        })

        if (!mentor) {
            return res.json({
                success: false,
                msg: "Mentor not found"
            })
        }

        res.json({
            success: true,
            msg: "Mentor fetched successfully",
            mentor: mentor
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Something went wrong"
        })
    }
})

module.exports=app