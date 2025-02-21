import Users from '../models/UserModel.js';

export const getAdminData = async (req, res) => {
    try {
        const admin = await Users.findById(req.params.userId).select('-password');
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};
