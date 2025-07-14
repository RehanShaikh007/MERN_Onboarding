import express from 'express';
import ClientRequest from '../model/clientSchema.js';
import matchmakingService from '../services/matchmakingService.js';

const router = express.Router();

// Create a new client request
router.post('/requests', async (req, res) => {
    try {
        const clientRequest = new ClientRequest(req.body);
        const savedRequest = await clientRequest.save();
        
        res.status(201).json({
            success: true,
            message: 'Client request created successfully',
            data: savedRequest
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create client request',
            error: error.message
        });
    }
});

// Get all client requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await ClientRequest.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch client requests',
            error: error.message
        });
    }
});

// Get a specific client request
router.get('/requests/:id', async (req, res) => {
    try {
        const request = await ClientRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Client request not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch client request',
            error: error.message
        });
    }
});

// Update a client request
router.put('/requests/:id', async (req, res) => {
    try {
        const updatedRequest = await ClientRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Client request not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Client request updated successfully',
            data: updatedRequest
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update client request',
            error: error.message
        });
    }
});

// Delete a client request
router.delete('/requests/:id', async (req, res) => {
    try {
        const deletedRequest = await ClientRequest.findByIdAndDelete(req.params.id);
        
        if (!deletedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Client request not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Client request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete client request',
            error: error.message
        });
    }
});

// Get talent matches for a client request
router.get('/requests/:id/matches', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const matches = await matchmakingService.findMatches(req.params.id, limit);
        
        res.status(200).json({
            success: true,
            data: {
                requestId: req.params.id,
                totalMatches: matches.length,
                matches: matches
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to find matches',
            error: error.message
        });
    }
});

// Get top 3 matches for a client request
router.get('/requests/:id/top-matches', async (req, res) => {
    try {
        const matches = await matchmakingService.findMatches(req.params.id, 3);
        
        res.status(200).json({
            success: true,
            data: {
                requestId: req.params.id,
                topMatches: matches
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to find top matches',
            error: error.message
        });
    }
});

export default router; 