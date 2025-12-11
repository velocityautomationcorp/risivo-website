import { Hono } from "hono";
// import { HomepageStep6 } from "./pages/homepage-step6";
// import { ContactPageSimple } from "./pages/contact-simple";
// import { FeaturesPage } from "./pages/features";
// import { PricingPage } from "./pages/pricing";
import contactRoute from "./routes/contact";
import newsletterRoute from "./routes/newsletter";
import registerRoute from "./routes/register";
import cmsRoute from "./routes/cms";
import cmsAdminRoute from "./routes/cms-admin";

type Bindings = {
  WEBHOOK_URL?: string;
  ENABLE_FULL_SITE?: string;
  ENVIRONMENT?: string;
  DATABASE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Global CORS middleware - applies to all routes
app.use("*", async (c, next) => {
  const origin = c.req.header("origin") || "";

  if (
    origin === "http://localhost:3001" ||
    origin === "http://localhost:3000"
  ) {
    c.header("Access-Control-Allow-Origin", origin);
    c.header("Access-Control-Allow-Credentials", "true");
  }

  c.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, authorization"
  );

  if (c.req.method === "OPTIONS") {
    return c.text("", 204);
  }

  await next();
});

// Mount API routes
app.route("/api/contact", contactRoute);
app.route("/api/newsletter", newsletterRoute);
app.route("/api/register", registerRoute);
app.route("/api/cms", cmsRoute);
app.route("/api/cms/admin", cmsAdminRoute);

// Debug endpoint to check configuration
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    cors: "enabled",
    supabase_url: c.env?.SUPABASE_URL ? "configured" : "missing",
    supabase_key: c.env?.SUPABASE_ANON_KEY ? "configured" : "missing",
    timestamp: new Date().toISOString(),
  });
});

// Temporary simple homepage
app.get("/", (c) => {
  return c.html(`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1>Risivo - CMS API Active</h1>
        <p>CMS Admin Panel: <a href="http://localhost:3001">http://localhost:3001</a></p>
        <p>API Health: <a href="/api/health">/api/health</a></p>
      </body>
    </html>
  `);
});

// Temporary pages
app.get("/contact", (c) => {
  return c.html("<h1>Contact Page</h1>");
});

app.get("/features", (c) => {
  return c.html("<h1>Features Page</h1>");
});

app.get("/pricing", (c) => {
  return c.html("<h1>Pricing Page</h1>");
});

export default app;
