const { Router } = require("express");
const app=Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const JWT_SECRET=process.env.JWT_SECRET



app.post('/mentor/signin',async (req,res)=>{

    const {email,password}=req.body

    if(!email || !password){
        res.json({
            success:false,
            msg:"Send All Fields"
        })
    }

    try {
        const user=await prisma.teacher.findUnique({
            where:{
                email:email
            }
        })

        if(!user){
            return res.json({
                success:false,
                msg:"User Not Found"
            })
        }

        const isMatch=(password==user.password)

        if(!isMatch){
            return res.json({
                success:false,
                msg:"Incorrect Password"
            })
        }

        // valid user
        const token=jwt.sign({id:user.id},JWT_SECRET)
        res.json({
            success:true,
            msg:"Login Success",
            token:token
        })


    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }


})

app.post('/mentor/signup',async (req,res)=>{
    const {name,email,password}=req.body

    if(!name || !email || !password ){
        res.json({
            success:false,
            msg:"Send All Fields"
        })
    }

    try {
        const user=await prisma.teacher.create({
            data:{
                name:name,
                email:email,
                password:password,
            }
        })

        const token=jwt.sign({id:user.id},JWT_SECRET)
        res.json({
            success:true,
            msg:"Signup Success",
            token:token
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })
    }

})

app.post('/student/signin',async (req,res)=>{
  
    const {email,password}=req.body

    if(!email || !password){
        res.json({
            success:false,
            msg:"Send All Fields"
        })
    }

    try {
        const user=await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(!user){
            return res.json({
                success:false,
                msg:"User Not Found"
            })
        }

        const isMatch=(password==user.password)
        
        if(!isMatch){
            return res.json({
                success:false,
                msg:"Incorrect Password"
            })
        }

        // valid user
        const token=jwt.sign({id:user.id},JWT_SECRET)
        res.json({
            success:true,
            msg:"Login Success",
            token:token
        })


    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            msg:"Something went wrong"
        })   
    }

})

app.post('/student/signup',async (req,res)=>{
  
    const {name,email,password}=req.body

    if(!name || !email || !password){
        res.json({
            success:false,
            msg:"Send All Fields"
        })
    }

    try {
        const user=await prisma.user.create({
            data:{
                name:name,
                email:email,
                password:password
            }
        })

        const token=jwt.sign({id:user.id},JWT_SECRET)
        res.json({
            success:true,
            msg:"Signup Success",
            token:token
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