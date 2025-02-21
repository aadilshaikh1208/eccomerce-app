import express from 'express';
import { saveProductsController, fetchProductsController, fetchOneProductController, updateProductController, addProductController, deleteProductController, getProductsByCategoryController, getProductCategoriesController } from '../controllers/product.controller.js';


const router = express.Router();

router.get('/save-products', saveProductsController);
router.get('/', fetchProductsController)
router.get('/:id', fetchOneProductController)
router.post('/', addProductController);
router.put('/:id', updateProductController);
router.delete('/:id', deleteProductController);
router.get('/category/:category', getProductsByCategoryController);
router.get('/categories/all', getProductCategoriesController);




export default router;
