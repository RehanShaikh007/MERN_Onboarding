import ClientRequest from '../model/clientSchema.js';
import Talent from '../model/talentSchema.js';

export const seedSampleData = async () => {
    try {
        // Check if data already exists
        const existingTalents = await Talent.countDocuments();
        const existingRequests = await ClientRequest.countDocuments();
        
        if (existingTalents > 0 && existingRequests > 0) {
            console.log('Sample data already exists, skipping seeding');
            return;
        }

        // Sample Client Requests
        const sampleClientRequests = [
            {
                id: "cli_001",
                name: "Parker LLC",
                type: "Creator",
                industry: "Weddings",
                city: "Kolkata",
                style_preferences: ["Youthful", "Vibrant"],
                communication_style: "casual",
                client_tier: "first-timer"
            },
            {
                id: "cli_002",
                name: "Ortiz-Scott",
                type: "Individual",
                industry: "Real Estate",
                city: "Goa",
                style_preferences: ["Vibrant", "Boho"],
                communication_style: "detailed",
                client_tier: "high-volume"
            }
        ];

        // Sample Talents
        const sampleTalents = [
            {
                id: "tal_001",
                name: "Tyler Baker",
                city: "Delhi",
                hometown: "Delhi",
                categories: ["Director", "Photographer"],
                skills: ["Fashion Shoots", "Corporate Shoots", "Weddings"],
                style_tags: ["documentary", "vibrant", "cinematic"],
                budget_range: "₹33546–₹66470",
                experience_years: 8,
                platforms: ["Personal Website", "Behance"],
                soft_skills: {
                    communication: "good",
                    punctuality: "good",
                    collaboration: "good",
                    initiative: "excellent",
                    adaptability: "good"
                },
                software_skills: [
                    { name: "ChatGPT", level: 5 },
                    { name: "Premiere Pro", level: 4 },
                    { name: "Adobe Photoshop", level: 5 },
                    { name: "Final Cut Pro", level: 7 }
                ],
                languages: ["Tamil", "Marathi"],
                past_credits: ["Baxter-Peterson", "Salazar, Craig and Saunders", "Campbell-Strickland"],
                endorsements: ["Andre Maldonado", "Nathaniel White"],
                interest_tags: ["sports", "music", "lifestyle"],
                availability_calendar: [
                    { city: "Mumbai", from: "2025-09-24", to: "2025-11-09" }
                ],
                tier_tags: ["intermediate", "potential backup"],
                portfolio: [
                    {
                        title: "Branding Portfolio 1",
                        tags: ["vibrant", "minimal"],
                        keywords: ["mood", "natural light", "portrait"]
                    },
                    {
                        title: "Documentaries Portfolio 2",
                        tags: ["documentary", "classic"],
                        keywords: ["mood", "outdoor", "natural light"]
                    },
                    {
                        title: "Weddings Portfolio 3",
                        tags: ["vibrant", "minimal"],
                        keywords: ["portrait", "outdoor", "natural light"]
                    },
                    {
                        title: "Corporate Shoots Portfolio 4",
                        tags: ["editorial", "bold"],
                        keywords: ["portrait", "motion", "natural light"]
                    }
                ]
            }
        ];

        // Insert sample data
        if (existingRequests === 0) {
            await ClientRequest.insertMany(sampleClientRequests);
            console.log('Sample client requests created');
        }

        if (existingTalents === 0) {
            await Talent.insertMany(sampleTalents);
            console.log('Sample talents created');
        }

        console.log('Sample data seeding completed successfully');
    } catch (error) {
        console.error('Error seeding sample data:', error);
        throw error;
    }
}; 