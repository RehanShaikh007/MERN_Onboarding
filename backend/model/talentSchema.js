import mongoose from 'mongoose';

const talentSchema = new mongoose.Schema({
    id: String,
    name: String,
    city: String,
    categories: [String],  
    skills: [String],     
    style_tags: [String],     
    experience: Number,    
    budgetRange: String,
    experience_years: Number,
    portfolio: [
        {
            title: String,
            tags: [String],
            keywords: [String]
        }
    ],
    pastCredits: [String],      
  },{timestamps: true});
  
const Talent = mongoose.model('Talent', talentSchema);
export default Talent;