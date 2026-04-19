require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./backend/routes/authRoutes");
const adminRoutes = require("./backend/routes/adminRoutes");
const advocateRoutes = require("./backend/routes/advocateRoutes");
const bookingRoutes = require("./backend/routes/bookingRoutes");
const contentRoutes = require("./backend/routes/contentRoutes");
const connectDB = require("./backend/config/db");
const app = express();
const PORT = process.env.PORT || 5000;
const API_URL = process.env.VITE_API_URL || `http://localhost:${PORT}`;

const allowedOrigins = [
	process.env.FRONTEND_ORIGIN,
	"http://localhost:8080",
	"https://legal-connect-frontend-lemon.vercel.app",
].filter(Boolean);

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"));
		},
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	res.json({
		message: "LegalConnect backend API is running.",
		apiUrl: API_URL,
		endpoints: {
			login: "POST /api/auth/login",
			logout: "POST /api/auth/logout",
			adminStatus: "GET /api/admin",
			registerLawyer: "POST /api/lawyers/register",
			registerLawyerLegacy: "POST /api/advocates/register",
			listAdvocates: "GET /api/advocates",
			createBooking: "POST /api/bookings",
			listBookingsAdmin: "GET /api/bookings",
			listServices: "GET /api/services",
			getServiceBySlug: "GET /api/services/:slug",
			submitServiceForm: "POST /api/services/form-submit",
			submitContactForm: "POST /api/contact/submit",
			listTestimonials: "GET /api/testimonials",
		},
	});
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(advocateRoutes);
app.use(bookingRoutes);
app.use(contentRoutes);

app.use((err, req, res, next) => {
	if (err && err.message === "Not allowed by CORS") {
		return res.status(403).json({ message: "CORS error: origin not allowed." });
	}

	return next(err);
});

app.use((err, req, res, next) => {
	console.error("Unhandled error:", err.message);
	return res.status(500).json({ message: "Internal server error." });
});

async function startServer() {
	try {
		await connectDB();

		//binding to 0.0.0.0 for production(For Nginx Reverse Proxy)
		app.listen(PORT, "0.0.0.0", () => {
  			console.log(`Running on port ${PORT}`);
		});

	} catch (error) {
		console.error("Server failed to start:", error.message);
		process.exit(1);
	}
}

startServer();