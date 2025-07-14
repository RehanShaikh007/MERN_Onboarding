import mongoose from 'mongoose';

const clientRequestSchema = new mongoose.Schema({
    id: String,
    name: String,
    type: String,
    industry: String,      
    city: String,          
    style_preferences: [String],
    communication_style: String, 
    client_tier: String  
  },{timestamps: true});

  const ClientRequest = mongoose.model('ClientRequest', clientRequestSchema);
  export default ClientRequest;