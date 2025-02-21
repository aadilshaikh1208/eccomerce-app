import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    discountPercentage:Number,
    rating:Number,
    stock:Number,
    minimumOrderQuantity:Number,
    category:String,
    thumbnail:String
})

const Product = mongoose.model("Products",ProductSchema)

export default Product

