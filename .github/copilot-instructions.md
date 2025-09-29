# AI Coding Agent Instructions for BiomassX Web API

## Project Architecture
This is a Go-based REST API with vanilla HTML/CSS/JS frontend, designed for a biomass trading platform. The project evolves from a simple user CRUD demo toward a complex trading dashboard.

### Backend (Go + chi + pgx)
- **Entry point**: `backend/main.go` - single-file monolith with embedded API struct
- **Database**: PostgreSQL via pgx/v5 connection pooling (`*pgxpool.Pool`)
- **Router**: go-chi/chi/v5 with CORS middleware pre-configured for `localhost:8080`
- **Static serving**: Backend serves frontend files from `../web/` directory
- **Database schema**: `backend/database/schema.sql` with users table + sample data

### Frontend (Vanilla Web)
- **Structure**: Classic HTML/CSS/JS in `web/` directory
- **API calls**: Vanilla fetch() with centralized `apiRequest()` utility in `script.js`
- **UI patterns**: Grid-based user cards, inline forms, message notifications
- **Styling**: Green gradient theme (`#c2fb34` to `#8bc34a`) with hover animations

## Development Workflow

### Running the application
```bash
cd backend
go run main.go  # Serves on :8080, includes frontend static files
```

### Database setup
1. Create PostgreSQL database named `testdb`
2. Run `backend/database/schema.sql` to create tables
3. Set `DATABASE_URL` environment variable or use default connection string

### Dependencies
- Core: `go-chi/chi/v5`, `go-chi/cors`, `jackc/pgx/v5`, `joho/godotenv`
- Vendor directory included with full dependency tree

## Project-Specific Patterns

### API Structure
- All endpoints under `/api` prefix (e.g., `/api/users`)
- RESTful CRUD: GET, POST, PUT, DELETE with proper HTTP status codes
- JSON request/response bodies with proper Content-Type headers
- Error handling via HTTP status codes and plain text messages

### Database Patterns
- Use pgx/v5 `QueryRow()`, `Query()`, and `Exec()` methods
- Context-aware database calls (`context.Background()`)
- Prepared statement style with `$1`, `$2` placeholders
- Connection pooling via `pgxpool.Pool`

### Frontend Patterns
- **API integration**: Use `apiRequest()` utility function from `script.js`
- **UI updates**: Direct DOM manipulation with `getElementById()` and `innerHTML`
- **Message system**: Use `showMessage(message, type)` for user feedback
- **Security**: HTML escaping via `escapeHtml()` function to prevent XSS

### Styling Conventions
- **Color scheme**: Primary green gradients (`#c2fb34`, `#8bc34a`) for brand
- **Layout**: Card-based design with hover animations and shadows
- **Responsive**: CSS Grid with `repeat(auto-fill, minmax(300px, 1fr))`
- **Forms**: Inline layout with flex-wrap for mobile adaptation

## Future Evolution Context
The `docs/` directory contains extensive requirements for a biomass trading platform with:
- **User roles**: Buyers, Sellers, Managers, Admins with different priorities
- **Core features**: Real-time charts, market maps, order search, alerts, cost estimation
- **UI themes**: Dark dashboard mode and light theme alternatives planned
- **Color palette**: Green-blue theme with specific hex codes defined in `docs/ui/color-pallet.txt`

When extending this codebase:
1. **Database**: Add tables following the existing schema pattern with timestamps
2. **API**: Follow the `/api` prefix and embed new handlers in the `API` struct
3. **Frontend**: Extend the card-grid pattern and use established color variables
4. **CORS**: Update allowed origins for production deployment to `https://biomassx.com`

## Key Files
- `backend/main.go` - Complete backend implementation
- `web/js/script.js` - Frontend API client and DOM manipulation
- `web/css/style.css` - Complete styling system with responsive grid
- `backend/database/schema.sql` - Database structure and sample data
- `docs/user-story/user-story.txt` - Detailed feature requirements and priorities