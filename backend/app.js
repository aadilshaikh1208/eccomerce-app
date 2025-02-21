import express from 'express';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js'
import userRoutes from './routes/user.routes.js'
import orderRoutes from './routes/order.routes.js'
import cartRoutes from './routes/cart.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authenticate from './middlewares/auth.middleware.js';

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://my-eccomerce-frontend.vercel.app'
    ],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/users', userRoutes)
app.use('/api/orders/', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/payment', paymentRoutes)


export default app;
