import jwt from 'jsonwebtoken';
import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';

const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        const role = user.role;
        const token = jwt.sign({ userId: user._id, role: role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token, role, user });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

const signUpController = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token, role: newUser.role, newUser });

    } catch (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const checkAuthController = (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).json({ msg: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "Invalid token" });
        }
        return res.status(200).json({ msg: "Authenticated", role: decoded.role });
    });
};


const logoutController = (req, res) => {
    res.status(200).json({ message: "Logout successfully" });
};


export { loginController, logoutController, checkAuthController, signUpController };
