import mongoose from 'mongoose';

const softSkillsSchema = new mongoose.Schema({
  communication: String,
  punctuality: String,
  collaboration: String,
  initiative: String,
  adaptability: String
}, { _id: false });

const softwareSkillItemSchema = new mongoose.Schema({
  name: String,
  level: Number
}, { _id: false });

const availabilityCalendarSchema = new mongoose.Schema({
  city: String,
  from: String,
  to: String
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  title: String,
  tags: [String],
  keywords: [String]
}, { _id: false });

const talentSchema = new mongoose.Schema({
  id: String,
  name: String,
  city: String,
  hometown: String,
  categories: [String],
  skills: [String],
  style_tags: [String],
  budget_range: String,
  experience_years: Number,
  platforms: [String],
  soft_skills: softSkillsSchema,
  software_skills: [softwareSkillItemSchema],
  languages: [String],
  past_credits: [String],
  endorsements: [String],
  interest_tags: [String],
  availability_calendar: [availabilityCalendarSchema],
  tier_tags: [String],
  portfolio: [portfolioSchema]
}, { timestamps: true });

const Talent = mongoose.model('Talent', talentSchema);
export default Talent;