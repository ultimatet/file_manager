const { File } = require('../models');

const fileController = {
    async createFile(req, res) {
        try {
            const { file_name, firebase_url, mime_type } = req.body;
            console.log("POST /api/file hit!"); // ✅ Logs the API call
            console.log("Request Body:", req.body); // ✅ Logs the request body

            if (!file_name || !firebase_url) {
                return res.status(400).json({ 
                    error: "File name and firebase URL are required" 
                });
            }

            const file = await File.create({ 
                file_name, 
                firebase_url, 
                mime_type 
            });

            res.status(201).json(file);
        } catch (error) {
            console.error("Error creating file:", error);
            res.status(500).json({ 
                error: "Failed to create file",
                details: error.message 
            });
        }
    },

    async getFile(req, res) {
        try {
            const { file_id } = req.params;
            console.log("POST /api/user hit!"); // ✅ Logs the API call
            console.log("Request Body:", req.body); // ✅ Logs the request body
            if (!file_id) {
                return res.status(400).json({ 
                    error: 'File ID is required' 
                });
            }

            const file = await File.findOne({ 
                where: { file_id } 
            });

            if (!file) {
                return res.status(404).json({ 
                    error: 'File not found' 
                });
            }

            res.status(200).json(file);
        } catch (error) {
            console.error("Error retrieving file:", error);
            res.status(500).json({ 
                error: "Failed to retrieve file",
                details: error.message 
            });
        }
    },

    async getAllFile(req, res) {  // renamed from getAllFile
        try {
            const files = await File.findAll();
            

            if (files.length === 0) {
                return res.status(204).json([]); // No Content
            }

            res.status(200).json(files);
        } catch (error) {
            console.error("Error retrieving files:", error);
            res.status(500).json({ 
                error: "Failed to retrieve files",
                details: error.message 
            });
        }
    },

    async updateFile(req, res) {
        try {
            const { file_id } = req.params;
            
            if (!file_id) {
                return res.status(400).json({ 
                    error: 'File ID is required' 
                });
            }

            const updateData = req.body;

            // First check if file exists
            const existingFile = await File.findOne({ 
                where: { file_id } 
            });

            if (!existingFile) {
                return res.status(404).json({ 
                    error: 'File not found' 
                });
            }

            // Perform update
            await File.update(updateData, {
                where: { file_id }
            });

            // Fetch and return updated file
            const updatedFile = await File.findOne({ 
                where: { file_id } 
            });

            res.status(200).json(updatedFile);
        } catch (error) {
            console.error('Error updating file:', error);
            res.status(500).json({ 
                error: 'Failed to update file',
                details: error.message 
            });
        }
    },

    async deleteFile(req, res) {
        try {
            const { file_id } = req.params;
            
            if (!file_id) {
                return res.status(400).json({ 
                    error: 'File ID is required' 
                });
            }

            const deletedCount = await File.destroy({ 
                where: { file_id } 
            });

            if (deletedCount === 0) {
                return res.status(404).json({ 
                    error: 'File not found' 
                });
            }

            res.status(200).json({ 
                message: 'File deleted successfully',
                file_id 
            });
        } catch (error) {
            console.error("Error deleting file:", error);
            res.status(500).json({ 
                error: 'Failed to delete file',
                details: error.message 
            });
        }
    }
};

module.exports = fileController;