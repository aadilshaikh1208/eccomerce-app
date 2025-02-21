import Orders from "../models/OrderModel.js";

const addOrdersController = async (req, res) => {
    const { userId, ordersData,totalPrice } = req.body;
    try {
        const newOrder = new Orders({
            userId,
            products: ordersData.map(item => ({
                title: item.title,
                description: item.description,
                price: item.price,
                discountPercentage: item.discountPercentage,
                rating: item.rating,
                stock: item.stock,
                minimumOrderQuantity: item.minimumOrderQuantity,
                category: item.category,
                thumbnail: item.thumbnail,
                quantity: item.quantity
            })),
            orderDate: new Date(),
            totalPrice:totalPrice
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully!", order: newOrder });
    } catch (error) {
        console.error('Error in addOrdersController:', error);
        res.status(500).json({ message: "Failed to create order", error });
    }
}


const fetchOrdersController = async (req, res) => {
    try {
        const orders = await Orders.find({})
        res.status(200).json({ orders: orders })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });

    }
}

export { addOrdersController, fetchOrdersController };
