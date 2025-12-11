/**
 * CMS Public API Routes
 * Public endpoints for fetching published content
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  getPageBySlug,
  getTranslations,
  getSupabaseCMS,
} from "../lib/supabase-cms";

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

const cms = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all origins (public API)
cms.use(
  "/*",
  cors({
    origin: "*",
    credentials: false,
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Get page by slug with language support
cms.get("/pages/:slug", async (c) => {
  const slug = c.req.param("slug");
  const lang = c.req.query("lang") || "en";

  try {
    const pageData = await getPageBySlug(
      slug,
      lang,
      c.env?.SUPABASE_URL,
      c.env?.SUPABASE_ANON_KEY
    );

    if (!pageData) {
      return c.json({ error: "Page not found" }, 404);
    }

    return c.json({
      success: true,
      data: pageData,
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return c.json({ error: "Failed to fetch page" }, 500);
  }
});

// Get translations by category
cms.get("/translations", async (c) => {
  const category = c.req.query("category");
  const lang = c.req.query("lang") || "en";

  try {
    const translations = await getTranslations(
      category,
      c.env?.SUPABASE_URL,
      c.env?.SUPABASE_ANON_KEY
    );

    // Transform to simple key-value for requested language
    const transformed = translations.reduce(
      (acc: Record<string, string>, item) => {
        acc[item.key] =
          item.translations[lang] || item.translations["en"] || "";
        return acc;
      },
      {}
    );

    return c.json({
      success: true,
      data: transformed,
      all_languages: translations,
    });
  } catch (error) {
    console.error("Error fetching translations:", error);
    return c.json({ error: "Failed to fetch translations" }, 500);
  }
});

// Get all pages (published only)
cms.get("/pages", async (c) => {
  const lang = c.req.query("lang") || "en";

  try {
    const supabaseCMS = getSupabaseCMS(
      c.env?.SUPABASE_URL,
      c.env?.SUPABASE_ANON_KEY
    );

    const { data: pages, error } = await supabaseCMS
      .from("cms_pages")
      .select("slug, meta_title, meta_description, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      throw error;
    }

    return c.json({
      success: true,
      data: pages || [],
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return c.json({ error: "Failed to fetch pages" }, 500);
  }
});

// Health check
cms.get("/health", (c) => {
  return c.json({
    success: true,
    service: "CMS API",
    timestamp: new Date().toISOString(),
  });
});

export default cms;
