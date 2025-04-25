require("dotenv").config(); // Load environment variables from .env file
const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === "development") {
      // Allow all origins in development
      callback(null, true);
    } else {
      // Check if the origin is in the allowed origins list
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
module.exports = corsOptions;

// This code defines CORS options for an Express.js application.
// It allows all origins in development mode and restricts to specific origins in production.
// The `origin` function checks if the request's origin is in the allowed origins list.
// If it is, it allows the request; otherwise, it throws an error.
// The `allowedOrigins` list is imported from another module.
// This is useful for security and ensuring that only trusted domains can access the API.
// In development, it allows all origins for convenience.
// In production, it restricts access to specific domains to prevent unauthorized access.
// This is important for securing APIs and preventing cross-origin attacks.
// The `corsOptions` object is then exported for use in the application.
