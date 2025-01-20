const { User } = require('../models');

const userController = {
    async createUser(req,res) {
        try {
            const { email, firebase_uid } = req.body;
            if (!email || !firebase_uid) {
                return res.status(400).json({error: "Email and firebase_uid are required"})
            }
            const existingUser = await User.findOne({ firebase_uid });
            if (existingUser) {
                return res.status(409).json({ error: 'User with this firebase_uid already exists' }); // 409 Conflict
            }
            const user = await User.create ({email, firebase_uid});
            res.status(201).json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(400).json({ error: error.message });
        }
        
    },
    
    async getUser(req,res) {
        try {
            const {user_id} = req.params;
            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }
            const user = await User.findOne ({user_id})
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Error getting user:", error);
            res.status(400).json({ error: error.message });
        }
    },

    async deleteUser(req,res) {
        try {
            const {email} = req.params;
            if (!email) {
                return res.status(400).json({ error: 'email is required' });
            }
            const user = await User.destroy({ where: {email: email}});
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
}

module.exports = userController;