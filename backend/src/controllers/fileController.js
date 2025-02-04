const { File } = require('../models');

const fileController = {
    async createFile(req,res) {
        try {
            const { file_name, firebase_url, mime_type } = req.body;
            if (!file_name || !firebase_url) {
                return res.status(400).json({error: "File name and firebase URL are required"})
            }
            const file = await File.create ({ file_name, firebase_url, mime_type });
            res.status(201).json(file);
        } catch (error) {
            console.error("Error creating file:", error);
            res.status(400).json({ error: error.message });
        }
    },
    //get 1 file by id
    async getFile(req,res) {
        try {
            const {file_id} = req.params;
            if (!file_id) {
                return res.status(400).json({ error: 'file_id is required' });
            }
            const file = await File.findOne({file_id});
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }
            res.status(200).json(file);
        } catch (error) {
            console.error("Error getting file:", error);
            res.status(400).json({ error: error.message });
        }
    },

    async getAllFile(req,res) {
        try {
            const {file_id} = req.params;
            if (!file_id) {
                return res.status(400).json({ error: 'file_id is required' });
            }
            const file = await File.findAll({file_id});
            if (!file) {
                return res.status(404).json({ error: 'No file found' });
            }
            res.status(200).json(file);
        } catch (error) {
            console.error("Error getting file:", error);
            res.status(400).json({ error: error.message });
        }
    },

    async updateFile(req,res) {
        try {
            const {file_id} = req.params;
            if (!file_id) {
                return res.status(400).json({ error: 'file_id is required' });
            }
            const updateData = req.body;
            const [rowsAffected, [updatedFile]] = await File.put(
                updateData,
                {
                    where: { file_id },
                    returning: true
                }
            );
            if (rowsAffected === 0) {
                return res.status(404).json({ error: 'File not found' });
            }
            return res.status(200).json(updatedFile);
        } catch (error) {
            console.error('Error updating file:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteFile(req,res) {
        try {
            const {file_id} = req.params;
            if (!file_id) {
                return res.status(400).json({ error: 'file_id is required' });
            }
            const file = await File.destroy({ where: {file_id}});
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            res.status(500).json({ error: 'Failed to delete file' });
        }
    }
}
module.exports = fileController;