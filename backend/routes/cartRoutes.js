const express = require("express") 
const Cart= require("../models/Cart")
const {protect} = require("../middleware/authMiddleware")
const router=express.Router() 
router.post("/add",protect,async (req,res)=>{
    try{
        const {productId}=req.body
        let cart=await Cart.findOne({userId:req.user.id})
        if(!cart){
            cart=await Cart.create({
                userId:req.user.id,
                item:[{productId,quantity:1}]
            })
            console.log("if block",cart)
        }else{
            console.log("from else",cart)
            const itemIndex=cart.item.find(item=>item.productId.toString()==productId)
            if(itemIndex>-1){
                cart.item[itemIndex].quantity+=1
            }
            else{
                cart.item.push({productId,quantity:1})
            }
            
        }
        await cart.save()
        return res.status(201).json({message:"Added to cart"}) 
    }
    catch(err){
        return res.status(500).json({message:`error from cart ${err}`})
    }
})

router.get("/",protect,async(req,res)=>{
    try{
        const cart=await Cart.findOne({userId:req.user.id}).populate("item.productId")
        console.log(cart)
        return res.status(200).json(cart)
    }
    catch(err){
        return res.status(500).json({message:`error from cart get route ${err}`})
    }
})
module.exports=router