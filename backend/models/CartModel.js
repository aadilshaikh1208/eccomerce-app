import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [itemSchema],
})



const Cart = mongoose.model('Cart', cartSchema);

export default Cart
