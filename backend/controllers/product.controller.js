import { saveProducts } from '../services/product.service.js';
import Product from '../models/ProductModel.js';
const saveProductsController = async (req, res) => {
    try {
        await saveProducts();
        res.status(200).send("Products saved successfully");
    } catch (err) {
        res.status(500).send("Error saving products");
    }
};

const fetchProductsController = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    }
    catch (err) {
        res.status(500).send("Error fetching products")
    }
}

const fetchOneProductController = async (req, res) => {
    try {
        const productId = req.params.id
        const products = await Product.findOne({ _id: productId })
        res.status(200).json(products)
    }
    catch (err) {
        res.status(500).send("Error fetching products")
    }
}

const addProductController = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).send("Error adding product");
    }
};

const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.updateOne({ _id: id }, {
            $set: {
                title: req.body.title, description: req.body.description, price: req.body.price, discountPercentage: req.body.discountPercentage, rating: req.body.rating,
                stock: req.body.stock, minimumOrderQuantity: req.body.minimumOrderQuantity, category: req.body.category, thumbnail: req.body.thumbnail
            }
        });
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send("Error updating product");
    }
};

const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.deleteOne({ _id: id });
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.status(200).send("Product deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting product");
    }
};

const getProductsByCategoryController = async (req, res) => {
    const { category } = req.params
    try {
        const products = await Product.find({ category })
        res.status(200).json(products)
    }
    catch (error) {
        res.status(500).json({ msg: "Server error" })
    }
}

const getProductCategoriesController = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};


export {
    saveProductsController,
    fetchOneProductController,
    fetchProductsController,
    addProductController,
    updateProductController,
    deleteProductController,
    getProductsByCategoryController,
    getProductCategoriesController
};
