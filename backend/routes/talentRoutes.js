import express from 'express';
import Talent from '../model/talentSchema.js';

const router = express.Router();

// Create a new talent
router.post('/', async (req, res) => {
    try {
        const talent = new Talent(req.body);
        const savedTalent = await talent.save();
        
        res.status(201).json({
            success: true,
            message: 'Talent created successfully',
            data: savedTalent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create talent',
            error: error.message
        });
    }
});

// Get all talents with optional filtering
router.get('/', async (req, res) => {
    try {
        const { city, category, skill, limit = 20, page = 1 } = req.query;
        
        let query = {};
        
        // Apply filters
        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }
        
        if (category) {
            query.categories = { $regex: category, $options: 'i' };
        }
        
        if (skill) {
            query.skills = { $regex: skill, $options: 'i' };
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const talents = await Talent.find(query)
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Talent.countDocuments(query);
        
        res.status(200).json({
            success: true,
            data: {
                talents,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalTalents: total,
                    hasNext: skip + talents.length < total,
                    hasPrev: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch talents',
            error: error.message
        });
    }
});

// Get a specific talent
router.get('/:id', async (req, res) => {
    try {
        const talent = await Talent.findById(req.params.id);
        if (!talent) {
            return res.status(404).json({
                success: false,
                message: 'Talent not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: talent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch talent',
            error: error.message
        });
    }
});

// Update a talent
router.put('/:id', async (req, res) => {
    try {
        const updatedTalent = await Talent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedTalent) {
            return res.status(404).json({
                success: false,
                message: 'Talent not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Talent updated successfully',
            data: updatedTalent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update talent',
            error: error.message
        });
    }
});

// Delete a talent
router.delete('/:id', async (req, res) => {
    try {
        const deletedTalent = await Talent.findByIdAndDelete(req.params.id);
        
        if (!deletedTalent) {
            return res.status(404).json({
                success: false,
                message: 'Talent not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Talent deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete talent',
            error: error.message
        });
    }
});

// Search talents by multiple criteria
router.get('/search/advanced', async (req, res) => {
    try {
        const { 
            query, 
            categories, 
            skills, 
            minExperience, 
            maxExperience,
            languages,
            city
        } = req.query;
        
        let searchQuery = {};
        
        // Text search across multiple fields
        if (query) {
            searchQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { skills: { $regex: query, $options: 'i' } },
                { categories: { $regex: query, $options: 'i' } },
                { style_tags: { $regex: query, $options: 'i' } }
            ];
        }
        
        // Category filter
        if (categories) {
            const categoryArray = categories.split(',').map(cat => cat.trim());
            searchQuery.categories = { $in: categoryArray.map(cat => new RegExp(cat, 'i')) };
        }
        
        // Skills filter
        if (skills) {
            const skillArray = skills.split(',').map(skill => skill.trim());
            searchQuery.skills = { $in: skillArray.map(skill => new RegExp(skill, 'i')) };
        }
        
        // Experience range filter
        if (minExperience || maxExperience) {
            searchQuery.experience_years = {};
            if (minExperience) searchQuery.experience_years.$gte = parseInt(minExperience);
            if (maxExperience) searchQuery.experience_years.$lte = parseInt(maxExperience);
        }
        
        // Languages filter
        if (languages) {
            const langArray = languages.split(',').map(l => l.trim());
            searchQuery.languages = { $in: langArray.map(l => new RegExp(l, 'i')) };
        }
        // City filter
        if (city) {
            searchQuery.city = { $regex: city, $options: 'i' };
        }
        
        const talents = await Talent.find(searchQuery)
            .limit(50);
            
        res.status(200).json({
            success: true,
            data: {
                talents,
                totalResults: talents.length,
                searchCriteria: req.query
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
});

// Get talents by category
router.get('/category/:category', async (req, res) => {
    try {
        const talents = await Talent.find({
            categories: { $regex: req.params.category, $options: 'i' }
        });
        
        res.status(200).json({
            success: true,
            data: {
                category: req.params.category,
                talents,
                totalResults: talents.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch talents by category',
            error: error.message
        });
    }
});

// Get talents by location
router.get('/location/:city', async (req, res) => {
    try {
        const talents = await Talent.find({
            city: { $regex: req.params.city, $options: 'i' }
        });
        
        res.status(200).json({
            success: true,
            data: {
                location: req.params.city,
                talents,
                totalResults: talents.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch talents by location',
            error: error.message
        });
    }
});

export default router; 