/**
 * Supabase CMS Client Configuration
 * Separate from CRM - handles CMS database connections only
 * FIXED: Lazy initialization for Cloudflare Workers environment
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase client instance (initialized on first use)
let supabaseCMSInstance: SupabaseClient | null = null;
let supabaseCMSAdminInstance: SupabaseClient | null = null;

// Get or create Supabase CMS client (for public access with RLS)
export function getSupabaseCMS(
  supabaseUrl?: string,
  supabaseAnonKey?: string
): SupabaseClient {
  if (!supabaseCMSInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL || "";
    const key = supabaseAnonKey || process.env.SUPABASE_ANON_KEY || "";

    if (!url || !key) {
      throw new Error(
        "Supabase URL and Anon Key are required. Please configure SUPABASE_URL and SUPABASE_ANON_KEY environment variables."
      );
    }

    supabaseCMSInstance = createClient(url, key);
  }

  return supabaseCMSInstance;
}

// Get or create Supabase CMS Admin client (bypasses RLS with service role key)
export function getSupabaseCMSAdmin(
  supabaseUrl?: string,
  supabaseServiceKey?: string
): SupabaseClient {
  const url = supabaseUrl || process.env.SUPABASE_URL || "";
  const key = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key) {
    throw new Error(
      "Supabase URL and Service Role Key are required for admin operations. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  // Always create a fresh client for admin to ensure proper auth
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Export for backward compatibility (will throw error if called without env vars)
export const supabaseCMS = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    return getSupabaseCMS()[prop as keyof SupabaseClient];
  },
});

// Types for CMS
export interface CMSPage {
  id: string;
  slug: string;
  template: string;
  status: "draft" | "published" | "archived";
  meta_title: Record<string, string>;
  meta_description: Record<string, string>;
  meta_keywords: Record<string, string>;
  layout: string;
  include_header: boolean;
  include_footer: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CMSContentBlock {
  id: string;
  page_id: string;
  block_type: string;
  position: number;
  content: Record<string, any>;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CMSMedia {
  id: string;
  filename: string;
  original_filename: string;
  file_type: "image" | "video" | "document" | "other";
  mime_type: string;
  size_bytes: number;
  url: string;
  storage_path: string;
  width?: number;
  height?: number;
  alt_text: Record<string, string>;
  folder: string;
  tags: string[];
  created_at: string;
}

export interface CMSTranslation {
  id: string;
  key: string;
  translations: Record<string, string>;
  category: string;
  description?: string;
}

// Helper function to get page with blocks
export async function getPageBySlug(
  slug: string,
  lang: string = "en",
  supabaseUrl?: string,
  supabaseAnonKey?: string
) {
  const client = getSupabaseCMS(supabaseUrl, supabaseAnonKey);

  const { data: page, error: pageError } = await client
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (pageError || !page) {
    return null;
  }

  const { data: blocks, error: blocksError } = await client
    .from("cms_content_blocks")
    .select("*")
    .eq("page_id", page.id)
    .order("position");

  if (blocksError) {
    return null;
  }

  return {
    page,
    blocks: blocks || [],
  };
}

// Helper function to get translations
export async function getTranslations(
  category?: string,
  supabaseUrl?: string,
  supabaseAnonKey?: string
) {
  const client = getSupabaseCMS(supabaseUrl, supabaseAnonKey);

  let query = client.from("cms_translations").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  return data || [];
}

// Helper function to get media
export async function getMedia(
  folder?: string,
  supabaseUrl?: string,
  supabaseAnonKey?: string
) {
  const client = getSupabaseCMS(supabaseUrl, supabaseAnonKey);

  let query = client
    .from("cms_media")
    .select("*")
    .order("created_at", { ascending: false });

  if (folder) {
    query = query.eq("folder", folder);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  return data || [];
}
