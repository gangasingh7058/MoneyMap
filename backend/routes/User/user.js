const { Router } = require("express");
const app=Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const JWT_SECRET=process.env.JWT_SECRET

app.get('/get_mentors',async (req,res)=>{

    const {token,expertise_tags}=req.headers

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

        const mentors=await prisma.teacher.findMany({
            where:{
                expertise_tags:expertise_tags
            }
        })

        res.json({
            success:true,
            msg:"Mentors Fetched Successfully",
            mentors:mentors
        })

    } catch (error) {
        console.log(error)  
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }
})

app.get('/mentor/:id',async (req,res)=>{
    
    const mentorid=res.params.id


    try {
        
        const mentor=await prisma.teacher.findUnique({
            where:{
                id:mentorid
            },
            include:{
                // name,expertise_tags,sebi_id,bio,upcoming livesession,intro video
                name:true,
                expertise_tags:true,
                sebi_id:true,
                bio:true,
                upcoming_livesession:true,
                intro_video:true
            }
        })

        res.json({
            success:true,
            msg:"Mentor Fetched Successfully",
            mentor:mentor
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }

})


app.post('/booking/:id',async (req,res)=>{
  
  const mentor_id=req.params.id
  const {token,session_date}=req.body
  
  if(!token || !session_date){
    return res.json({
      success:false,
      msg:"Send All Fields"
    })
  }

  try {
    
    const decoded=jwt.verify(token,JWT_SECRET)

    if(!decoded){
        res.json({
            success:false,
            msg:"Invalid User"
        })
    }

    const user=await prisma.user.findUnique({
        where:{
            id:decoded.id
        }
    })

    if(!user){
        return res.json({
            success:false,
            msg:"User Not Found"
        })
    }

    const booking=await prisma.booking.create({
        data:{
            studentId:user.id,
            teacherId:mentor_id,
            sessionDate:session_date
        }
    })

    res.json({
        success:true,
        msg:"Booking Created Successfully",
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