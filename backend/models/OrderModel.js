import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    minimumOrderQuantity: Number,
    category: String,
    thumbnail: String,
    quantity: Number
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    products: [productSchema],
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalPrice:Number,
});

const Orders = mongoose.model("Orders", orderSchema);

export default Orders;
