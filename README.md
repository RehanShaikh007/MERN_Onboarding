# 🎨 BreadButter Talent Matchmaking System

A comprehensive talent matchmaking platform that connects clients with creative professionals using an advanced AI-powered algorithm. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🌟 Features

### Advanced Matchmaking Algorithm
- **Multi-factor Scoring**: Location, budget, skills, experience, availability, and more
- **Intelligent Ranking**: Top 3 matches with detailed explanations
- **Portfolio Analysis**: Keyword matching in portfolio items
- **Style Preferences**: Matching artistic and communication styles

### Client Management
- Create detailed project briefs
- Specify budget ranges and timelines
- Define required skills and categories
- Set style preferences and urgency levels

### Talent Database
- Comprehensive talent profiles
- Skills, experience, and portfolio management
- Availability status tracking
- Rating and review system

### Modern UI/UX
- Beautiful, responsive design
- Real-time matchmaking results
- Interactive forms and dashboards
- Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd MERN_Onboarding
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/breadbutter_talent
   NODE_ENV=development
   ```

5. **Start the backend server**
```bash
cd backend
npm start
```

6. **Start the frontend development server**
```bash
cd frontend
npm run dev
```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📊 Matchmaking Algorithm

The system uses a sophisticated scoring algorithm that considers multiple factors:

### Scoring Weights
| Factor | Weight | Description |
|--------|--------|-------------|
| Location Match | 2 points | Exact city, preferred location, or same region |
| Budget Compatibility | 3 points | Perfect fit, within tolerance, or acceptable range |
| Skills Match | 5 points | Percentage match of required skills |
| Categories Match | 4 points | Percentage match of required categories |
| Experience Level | 3 points | Based on project scale requirements |
| Availability | 2 points | Current availability status |
| Rating | 2 points | Normalized rating score |
| Portfolio Keywords | 3 points | Keyword matches in portfolio items |
| Style Preferences | 2 points | Style preference matches |
| Response Time | 1 point | Based on typical response time |

### Example Match Calculation
For a photography project in Goa with ₹75k budget:
- **Priya Sharma** (Goa photographer): 25.3 points
  - Location: 2.0 (exact match)
  - Budget: 3.0 (perfect fit)
  - Skills: 5.0 (100% match)
  - Categories: 4.0 (100% match)
  - Experience: 3.0 (adequate for medium project)
  - Availability: 2.0 (available)
  - Rating: 1.9 (4.8/5 stars)
  - Portfolio: 2.7 (keyword matches)
  - Style: 2.0 (pastel tones match)
  - Response: 0.7 (2-hour response time)

## 🛠️ API Endpoints

### Client Requests
- `POST /api/clients/requests` - Create new request
- `GET /api/clients/requests` - Get all requests
- `GET /api/clients/requests/:id` - Get specific request
- `PUT /api/clients/requests/:id` - Update request
- `DELETE /api/clients/requests/:id` - Delete request
- `GET /api/clients/requests/:id/matches` - Get all matches
- `GET /api/clients/requests/:id/top-matches` - Get top 3 matches

### Talents
- `POST /api/talents` - Create new talent
- `GET /api/talents` - Get all talents with filtering
- `GET /api/talents/:id` - Get specific talent
- `PUT /api/talents/:id` - Update talent
- `DELETE /api/talents/:id` - Delete talent
- `GET /api/talents/search/advanced` - Advanced search
- `GET /api/talents/category/:category` - Get by category
- `GET /api/talents/location/:city` - Get by location

## 📁 Project Structure

```
MERN_Onboarding/
├── backend/
│   ├── model/
│   │   ├── clientSchema.js      # Client request data model
│   │   └── talentSchema.js      # Talent profile data model
│   ├── routes/
│   │   ├── clientRoutes.js      # Client request API routes
│   │   └── talentRoutes.js      # Talent management API routes
│   ├── services/
│   │   └── matchmakingService.js # Core matchmaking algorithm
│   ├── utils/
│   │   └── seedData.js          # Sample data seeding
│   ├── index.js                 # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── App.css              # Styling
│   │   └── main.jsx             # React entry point
│   └── package.json
└── README.md
```

## 🎯 Sample Data

The system automatically seeds sample data including:

### Sample Client Requests
1. **EcoFashion Brand** - Sustainable fashion photoshoot in Goa
2. **Tech Startup** - Product launch video in Bangalore
3. **Wedding Couple** - Traditional wedding photography in Mumbai

### Sample Talents
1. **Priya Sharma** - Travel & fashion photographer (Goa)
2. **Rahul Verma** - Corporate videographer (Bangalore)
3. **Anjali Patel** - Wedding photographer (Mumbai)
4. **Vikram Singh** - Documentary photographer (Delhi)
5. **Meera Iyer** - Creative videographer (Chennai)

## 🧪 Testing the System

1. **Start both servers** (backend and frontend)
2. **Navigate to the frontend** at http://localhost:5173
3. **View sample data** in the "Client Requests" and "Talents" tabs
4. **Test matchmaking** by clicking "Find Matches" on any client request
5. **Create new requests** using the "New Request" form
6. **Add new talents** using the "Add Talent" form

### Example Test Case
Create a client request for:
- **Project**: Travel photography in Goa
- **Budget**: ₹50,000 - ₹75,000
- **Skills**: photography, travel photography
- **Duration**: 3 days

Expected top match: **Priya Sharma** with high scores for location, skills, and portfolio keywords.

## 🔧 Customization

### Adding New Scoring Factors
1. Update `scoringWeights` in `matchmakingService.js`
2. Add calculation method for the new factor
3. Include in the main `findMatches` function
4. Update explanation generation

### Extending Data Models
1. Modify schemas in `model/` directory
2. Update API routes to handle new fields
3. Modify frontend forms and displays
4. Update sample data seeding

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or other cloud database
2. Update environment variables
3. Deploy to Heroku, Railway, or similar platform

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
1. Check the API documentation in `backend/README.md`
2. Review the sample data and test cases
3. Open an issue in the repository

---

**Built with ❤️ for connecting creative talent with amazing opportunities** 
