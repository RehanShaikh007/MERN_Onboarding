# BreadButter Talent Matchmaking API

A comprehensive backend system for talent matchmaking that connects clients with creative professionals based on project requirements, skills, location, and budget.

## Features

- **Advanced Matchmaking Algorithm**: Rule-based scoring system that considers multiple factors
- **Client Request Management**: Create and manage project briefs
- **Talent Database**: Comprehensive talent profiles with skills, experience, and portfolio
- **Smart Filtering**: Search and filter talents by various criteria
- **Ranked Recommendations**: Get top matches with detailed scoring and explanations

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **ES6+** JavaScript modules

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/breadbutter_talent
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Client Requests
- `POST /api/clients/requests` - Create a new client request
- `GET /api/clients/requests` - Get all client requests
- `GET /api/clients/requests/:id` - Get specific client request
- `PUT /api/clients/requests/:id` - Update client request
- `DELETE /api/clients/requests/:id` - Delete client request
- `GET /api/clients/requests/:id/matches` - Get talent matches for a request
- `GET /api/clients/requests/:id/top-matches` - Get top 3 matches

### Talents
- `POST /api/talents` - Create a new talent profile
- `GET /api/talents` - Get all talents with filtering
- `GET /api/talents/:id` - Get specific talent
- `PUT /api/talents/:id` - Update talent profile
- `DELETE /api/talents/:id` - Delete talent profile
- `GET /api/talents/search/advanced` - Advanced talent search
- `GET /api/talents/category/:category` - Get talents by category
- `GET /api/talents/location/:city` - Get talents by location

## Matchmaking Algorithm

The system uses a sophisticated scoring algorithm that considers:

### Scoring Weights
- **Location Match**: 2 points
- **Budget Compatibility**: 3 points
- **Skills Match**: 5 points
- **Categories Match**: 4 points
- **Experience Level**: 3 points
- **Availability**: 2 points
- **Rating**: 2 points
- **Portfolio Keywords**: 3 points
- **Style Preferences**: 2 points
- **Response Time**: 1 point

### Scoring Logic
1. **Location**: Exact city match, preferred location, or same region
2. **Budget**: Perfect fit, within tolerance, or over budget but acceptable
3. **Skills**: Percentage match of required skills
4. **Categories**: Percentage match of required categories
5. **Experience**: Based on project scale requirements
6. **Availability**: Current availability status
7. **Rating**: Normalized rating score
8. **Portfolio**: Keyword matches in portfolio items
9. **Style**: Style preference matches
10. **Response Time**: Based on typical response time

## Sample Data

The system automatically seeds sample data including:
- 3 sample client requests (fashion, tech, wedding)
- 5 sample talents with diverse skills and locations

## Example Usage

### Create a Client Request
```bash
curl -X POST http://localhost:5000/api/clients/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "project_title": "Product Photography",
    "project_description": "Need professional product photography",
    "city": "mumbai",
    "budget_min": 50000,
    "budget_max": 75000,
    "required_skills": ["photography", "product photography"],
    "required_categories": ["photography"],
    "duration_days": 2
  }'
```

### Get Matches for a Request
```bash
curl http://localhost:5000/api/clients/requests/{requestId}/top-matches
```

### Search Talents
```bash
curl "http://localhost:5000/api/talents/search/advanced?query=photography&location=mumbai&minRating=4.0"
```

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Development

### Project Structure
```
backend/
├── model/
│   ├── clientSchema.js
│   └── talentSchema.js
├── routes/
│   ├── clientRoutes.js
│   └── talentRoutes.js
├── services/
│   └── matchmakingService.js
├── utils/
│   └── seedData.js
├── index.js
└── package.json
```

### Adding New Features
1. Create new routes in the `routes/` directory
2. Add business logic in the `services/` directory
3. Update models in the `model/` directory if needed
4. Test with sample data

## Testing the Matchmaking

1. Start the server
2. Create a client request using the API
3. Get matches for the request
4. Review the scoring breakdown and explanations

The system will automatically match the best talents based on the comprehensive scoring algorithm and provide detailed explanations for each match. 