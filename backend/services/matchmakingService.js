import Talent from '../model/talentSchema.js';
import ClientRequest from '../model/clientSchema.js';

class MatchmakingService {
    constructor() {
        this.scoringWeights = {
            location: 2,
            skills: 5,
            categories: 4,
            experience: 3,
            stylePreferences: 2,
            portfolioKeywords: 3,
            languages: 1
        };
    }

    // Calculate location match score
    calculateLocationScore(clientRequest, talent) {
        const clientCity = clientRequest.city?.toLowerCase();
        const talentCity = talent.city?.toLowerCase();
        if (clientCity && talentCity && clientCity === talentCity) {
            return this.scoringWeights.location;
        }
        return 0;
    }

    // Calculate skills match score
    calculateSkillsScore(clientRequest, talent) {
        // No required_skills in new client schema, so just check overlap with style_preferences and skills
        const clientStyles = clientRequest.style_preferences || [];
        const talentSkills = talent.skills || [];
        if (clientStyles.length === 0) return 0;
        const matching = clientStyles.filter(style => talentSkills.some(skill => skill.toLowerCase().includes(style.toLowerCase()) || style.toLowerCase().includes(skill.toLowerCase())));
        return this.scoringWeights.skills * (matching.length / clientStyles.length);
    }

    // Calculate categories match score
    calculateCategoriesScore(clientRequest, talent) {
        // No required_categories in new client schema, so just check overlap with categories and style_preferences
        const clientStyles = clientRequest.style_preferences || [];
        const talentCategories = talent.categories || [];
        if (clientStyles.length === 0) return 0;
        const matching = clientStyles.filter(style => talentCategories.some(cat => cat.toLowerCase().includes(style.toLowerCase()) || style.toLowerCase().includes(cat.toLowerCase())));
        return this.scoringWeights.categories * (matching.length / clientStyles.length);
    }

    // Calculate experience match score
    calculateExperienceScore(clientRequest, talent) {
        // No project scale, so just use experience_years
        const years = talent.experience_years || 0;
        if (years >= 8) return this.scoringWeights.experience;
        if (years >= 5) return this.scoringWeights.experience * 0.7;
        if (years >= 2) return this.scoringWeights.experience * 0.4;
        return 0;
    }

    // Calculate style preferences match score
    calculateStylePreferencesScore(clientRequest, talent) {
        const clientStyles = clientRequest.style_preferences || [];
        const talentStyles = talent.style_tags || [];
        if (clientStyles.length === 0) return 0;
        const matching = clientStyles.filter(style => talentStyles.some(tag => tag.toLowerCase().includes(style.toLowerCase()) || style.toLowerCase().includes(tag.toLowerCase())));
        return this.scoringWeights.stylePreferences * (matching.length / clientStyles.length);
    }

    // Calculate portfolio keywords match score
    calculatePortfolioKeywordsScore(clientRequest, talent) {
        const clientStyles = (clientRequest.style_preferences || []).map(s => s.toLowerCase());
        let keywordMatches = 0;
        let totalKeywords = 0;
        (talent.portfolio || []).forEach(item => {
            const allKeywords = [...(item.keywords || []), ...(item.tags || [])];
            totalKeywords += allKeywords.length;
            allKeywords.forEach(keyword => {
                if (clientStyles.some(style => keyword.toLowerCase().includes(style) || style.includes(keyword.toLowerCase()))) {
                    keywordMatches++;
                }
            });
        });
        if (totalKeywords === 0) return 0;
        return this.scoringWeights.portfolioKeywords * (keywordMatches / totalKeywords);
    }

    // Calculate languages match score
    calculateLanguagesScore(clientRequest, talent) {
        // Not in client schema, so always 0
        return 0;
    }

    // Generate explanation for match score
    generateExplanation(clientRequest, talent, scores) {
        const explanations = [];
        if (scores.location > 0) explanations.push(`Location match: ${talent.city}`);
        if (scores.skills > 0) explanations.push(`Skills/style overlap`);
        if (scores.categories > 0) explanations.push(`Category/style overlap`);
        if (scores.experience > 0) explanations.push(`Experience: ${talent.experience_years} years`);
        if (scores.stylePreferences > 0) explanations.push(`Style tags match`);
        if (scores.portfolioKeywords > 0) explanations.push(`Portfolio keywords match`);
        return explanations.join('. ');
    }

    // Main matchmaking function
    async findMatches(clientRequestId, limit = 10) {
        try {
            const clientRequest = await ClientRequest.findById(clientRequestId);
            if (!clientRequest) throw new Error('Client request not found');
            const talents = await Talent.find();
            const matches = [];
            for (const talent of talents) {
                const scores = {
                    location: this.calculateLocationScore(clientRequest, talent),
                    skills: this.calculateSkillsScore(clientRequest, talent),
                    categories: this.calculateCategoriesScore(clientRequest, talent),
                    experience: this.calculateExperienceScore(clientRequest, talent),
                    stylePreferences: this.calculateStylePreferencesScore(clientRequest, talent),
                    portfolioKeywords: this.calculatePortfolioKeywordsScore(clientRequest, talent),
                    languages: this.calculateLanguagesScore(clientRequest, talent)
                };
                const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
                if (totalScore > 0) {
                    const explanation = this.generateExplanation(clientRequest, talent, scores);
                    matches.push({
                        talent: {
                            id: talent._id,
                            name: talent.name,
                            city: talent.city,
                            categories: talent.categories,
                            skills: talent.skills,
                            experience_years: talent.experience_years,
                            style_tags: talent.style_tags,
                            portfolio: talent.portfolio
                        },
                        scores,
                        totalScore,
                        explanation
                    });
                }
            }
            matches.sort((a, b) => b.totalScore - a.totalScore);
            return matches.slice(0, limit).map((match, index) => ({ ...match, rank: index + 1 }));
        } catch (error) {
            throw new Error(`Matchmaking failed: ${error.message}`);
        }
    }
}

export default new MatchmakingService(); 