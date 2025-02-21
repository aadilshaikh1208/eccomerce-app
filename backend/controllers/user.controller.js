import Users from '../models/UserModel.js';

const getUsers = async (req, res) => {
    try {
        const users = await Users.find({ role: 'user' });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

const addUserController = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password,
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};


const getUserByIdController = async (req, res) => {
    const id = req.params.id
    try {
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }

}


export { getUsers, getUserByIdController, addUserController }