import Cart from "../models/CartModel.js";

const updateCartController = async (req, res) => {
    const { userId, cartItems } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
        } else {
            cart = new Cart({
                userId,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            });
        }
        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update cart', error });
    }
};

const getCartController = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });

        if (cart) {
            const cartItems = cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
            res.status(200).json({ cartItems });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error in getCartController:', error);
        res.status(500).json({ message: 'Failed to fetch cart', error });
    }
};

const mergeCartsController = async (req, res) => {
    const { userId, guestCart } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        guestCart.forEach((guestItem) => {
            const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === guestItem.productId);
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += guestItem.quantity;
            } else {
                cart.items.push({
                    productId: guestItem.productId,
                    quantity: guestItem.quantity
                });
            }
        });

        await cart.save();
        res.status(200).json({ message: 'Carts merged successfully', cart });
    } catch (error) {
        console.error('Error in mergeCartsController:', error);
        res.status(500).json({ message: 'Failed to merge carts', error });
    }
};


const removeCartController = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOneAndDelete({ userId });

        if (cart) {
            res.status(200).json({ message: 'Cart removed successfully' });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove cart', error });
    }
};


export { updateCartController, getCartController, mergeCartsController, removeCartController };
