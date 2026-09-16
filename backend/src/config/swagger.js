export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "INAVIST — India • Travel • Tourism Central REST API",
    version: "2.1.0",
    description: "Production-ready backend API documentation for INAVIST: India • Travel • Tourism platform with JWT Authentication, 170+ Destinations, Smart Budget Calculator, SOS Emergency Real-Time Network, and Crisis Re-routing Engine.",
    contact: {
      name: "INAVIST Developer Team",
      email: "support@inavist.travel"
    }
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local Development Server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "Health Check",
        responses: {
          200: {
            description: "Server is healthy and online."
          }
        }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  phone: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "User registered" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login with email & password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Logged in successfully" } }
      }
    },
    "/destinations": {
      get: {
        summary: "List all destinations with pagination & filters",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "state", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "isHiddenGem", in: "query", schema: { type: "boolean" } }
        ],
        responses: { 200: { description: "List of destinations" } }
      }
    },
    "/destinations/{id}": {
      get: {
        summary: "Get destination by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Destination details" } }
      }
    },
    "/budget/calculate": {
      post: {
        summary: "Calculate detailed trip expense breakdown",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  budget: { type: "number", example: 10000 },
                  travelers: { type: "number", example: 2 },
                  durationDays: { type: "number", example: 3 },
                  travelStyle: { type: "string", example: "moderate" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Budget breakdown" } }
      }
    },
    "/budget/recommend": {
      post: {
        summary: "Recommend destinations matching user budget",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  budget: { type: "number", example: 15000 },
                  travelers: { type: "number", example: 2 },
                  durationDays: { type: "number", example: 4 }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Recommended destinations list" } }
      }
    },
    "/emergency/sos": {
      post: {
        summary: "Trigger Real-time Emergency SOS broadcast",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  location: {
                    type: "object",
                    properties: {
                      lat: { type: "number" },
                      lng: { type: "number" },
                      address: { type: "string" }
                    }
                  },
                  message: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "SOS broadcast recorded" } }
      }
    },
    "/search": {
      get: {
        summary: "Universal search across destinations, hotels, and companion groups",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Search results" } }
      }
    }
  }
};
