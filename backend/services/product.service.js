import fetch from 'node-fetch';
import Product from '../models/ProductModel.js';

const saveProducts = async () => {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    const products = data.products;

    const filteredProducts = products.map(p => ({
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        minimumOrderQuantity: p.minimumOrderQuantity,
        category:p.category,
        thumbnail: p.thumbnail
    }));

    for (const product of filteredProducts) {
        const newProd = new Product(product);
        try {
            await newProd.save();
            console.log(`Product with ID ${product.id} added`);
        } catch (err) {
            console.error(`Error! Something went wrong with product ID ${product.id}`, err);
        }
    }
};

export { saveProducts };
