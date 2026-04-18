# legalConnect-backend

## Environment Setup

Create a `.env` file (you can copy from `.env.example`) with:

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/legalconnect`
- `JWT_SECRET=<long-random-secret>`
- `JWT_EXPIRES_IN=1h`
- `ADMIN_PASSWORD=<strong-admin-password>`
- `FRONTEND_ORIGIN=http://localhost:8080`
- `SERVICE_PAGE_FORM_RESPONSE_URL=<google-form-response-url>`
- `SERVICE_PAGE_FORM_ENTRY_IDS=<comma-separated-entry-ids>`

Security note:
- Keep all secrets only in `.env`.
- Do not commit real credentials, passwords, tokens, or secrets.

## API Reference

Base URL: `http://localhost:5000`

### Health Route

- `GET /` - API info and endpoint summary

### Auth Routes

- `GET /api/auth/login` - Login usage info
- `POST /api/auth/login` - Login and return token
- `POST /api/auth/logout` - Logout by token

### Legacy Auth Aliases

- `GET /login` - Login usage info
- `POST /login` - Login and return token
- `POST /logout` - Logout by token
- `POST /sign-in` - Login alias
- `POST /log-in` - Login alias
- `POST /sign-out` - Logout alias
- `POST /log-out` - Logout alias

### Admin Routes

- `GET /api/admin` - Admin status (requires admin token)
- `GET /api/lawyers` - List lawyers (requires admin token)
- `POST /api/lawyers` - Create lawyer (requires admin token)
- `GET /api/lawyers/:id` - Get lawyer by id (requires admin token)
- `PUT /api/lawyers/:id` - Update lawyer (requires admin token)
- `PATCH /api/lawyers/:id/status` - Update lawyer status (requires admin token)
- `DELETE /api/lawyers/:id` - Delete lawyer (requires admin token)

### Legacy Admin Aliases

- `GET /admin` - Admin dashboard (requires admin token)
- `GET /admin/lawyers` - List lawyers (requires admin token)
- `POST /admin/lawyers` - Create lawyer (requires admin token)
- `GET /admin/lawyers/:id` - Get lawyer by id (requires admin token)
- `PUT /admin/lawyers/:id` - Update lawyer (requires admin token)
- `PATCH /admin/lawyers/:id/status` - Update lawyer status (requires admin token)
- `DELETE /admin/lawyers/:id` - Delete lawyer (requires admin token)

### Advocate Routes

- `GET /api/advocates` - Public advocates list
- `POST /api/lawyers/register` - Register a new lawyer/advocate
- `POST /api/advocates/register` - Legacy registration alias
- `GET /api/advocates/:id` - Get a single advocate by id

### Booking Routes

- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List all bookings (requires admin token)

### Content Routes

- `GET /api/services` - List services
- `GET /api/services/:slug` - Get service by slug
- `GET /api/testimonials` - List testimonials
- `POST /api/services/form-submit` - Forward service form to configured Google Form
- `POST /api/contact/submit` - Forward contact form to configured Google Form

### Auth Headers

For protected routes, send token in one of these headers:

- `x-auth-token: <token>`
- `Authorization: Bearer <token>`

### Form Config Notes

- Set `SERVICE_PAGE_FORM_RESPONSE_URL` in `.env` to control the submit endpoint for server-side forwarding (Google Forms `formResponse` URL).
- Set `SERVICE_PAGE_FORM_ENTRY_IDS` (comma-separated) to match your Google Form field entry IDs.
- `GET /api/services` and `GET /api/services/:slug` no longer include Google Form URL fields.

### Service Page Form Submission

- `POST /api/services/form-submit` forwards data to your Google Form `formResponse` endpoint.
- Send a JSON body with the Google Form entry IDs as keys:

```json
{
	"entry.642944343": "Shi",
	"entry.1001639118": "sssss",
	"entry.1940470873": "ssssssssss",
	"entry.1021924392": "sssssssss",
	"entry.104519797": "sssssssssss",
	"entry.2107636565": "ssssssssss"
}
```

- You can also nest them under an `entries` object if preferred:

```json
{
	"entries": {
		"entry.642944343": "Shi",
		"entry.1001639118": "sssss",
		"entry.1940470873": "ssssssssss",
		"entry.1021924392": "sssssssss",
		"entry.104519797": "sssssssssss",
		"entry.2107636565": "ssssssssss"
	}
}
```

### Contact Us Form Submission

- `POST /api/contact/submit` forwards Contact Us form data to the configured Google Forms `formResponse` endpoint.
- Request body format is the same as service form submission:

```json
{
	"entry.642944343": "Shi",
	"entry.1001639118": "sssss",
	"entry.1940470873": "ssssssssss",
	"entry.1021924392": "sssssssss",
	"entry.104519797": "sssssssssss",
	"entry.2107636565": "ssssssssss"
}
```
