import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';

const uploadRoute = new Hono();

// Helper function to verify admin session
async function verifyAdminSession(c: any) {
  const sessionToken = getCookie(c, 'admin_session');
  
  if (!sessionToken) {
    return null;
  }
  
  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: session, error: sessionError } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single();
  
  if (sessionError || !session) {
    return null;
  }
  
  if (new Date(session.expires_at) < new Date()) {
    return null;
  }
  
  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', session.admin_user_id)
    .single();
  
  if (adminError || !admin) {
    return null;
  }
  
  const isActive = typeof admin.is_active === 'boolean' 
    ? admin.is_active 
    : (admin.status === 'active');
  
  if (!isActive) {
    return null;
  }
  
  return { admin, supabase };
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `${timestamp}-${random}.${extension}`;
}

// ============================================
// POST /api/upload/image - Upload single image
// ============================================
uploadRoute.post('/image', async (c) => {
  try {
    const auth = await verifyAdminSession(c);
    
    if (!auth) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }
    
    const { supabase } = auth;
    
    // Parse multipart form data
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'updates';
    
    if (!file) {
      return c.json({ 
        success: false, 
        error: 'No file provided' 
      }, 400);
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ 
        success: false, 
        error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' 
      }, 400);
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ 
        success: false, 
        error: 'File too large. Maximum size is 5MB' 
      }, 400);
    }
    
    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const filePath = `${folder}/${filename}`;
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (error) {
      console.error('[UPLOAD] Storage error:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to upload file',
        details: error.message
      }, 500);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return c.json({ 
      success: true, 
      url: urlData.publicUrl,
      filename: filename,
      path: filePath
    });
    
  } catch (error) {
    console.error('[UPLOAD] Error:', error);
    return c.json({ 
      success: false, 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// ============================================
// POST /api/upload/gallery - Upload multiple images
// ============================================
uploadRoute.post('/gallery', async (c) => {
  try {
    const auth = await verifyAdminSession(c);
    
    if (!auth) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }
    
    const { supabase } = auth;
    
    // Parse multipart form data
    const formData = await c.req.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'gallery';
    
    if (!files || files.length === 0) {
      return c.json({ 
        success: false, 
        error: 'No files provided' 
      }, 400);
    }
    
    // Limit number of files
    if (files.length > 10) {
      return c.json({ 
        success: false, 
        error: 'Maximum 10 images allowed per upload' 
      }, 400);
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    const uploadedImages: { url: string; filename: string; path: string }[] = [];
    const errors: string[] = [];
    
    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
        continue;
      }
      
      // Validate file size
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large`);
        continue;
      }
      
      // Generate unique filename
      const filename = generateUniqueFilename(file.name);
      const filePath = `${folder}/${filename}`;
      
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false
        });
      
      if (error) {
        errors.push(`${file.name}: ${error.message}`);
        continue;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      uploadedImages.push({
        url: urlData.publicUrl,
        filename: filename,
        path: filePath
      });
    }
    
    return c.json({ 
      success: true, 
      images: uploadedImages,
      uploaded: uploadedImages.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('[GALLERY UPLOAD] Error:', error);
    return c.json({ 
      success: false, 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// ============================================
// DELETE /api/upload/image - Delete image
// ============================================
uploadRoute.delete('/image', async (c) => {
  try {
    const auth = await verifyAdminSession(c);
    
    if (!auth) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }
    
    const { supabase } = auth;
    const body = await c.req.json();
    const { path } = body;
    
    if (!path) {
      return c.json({ 
        success: false, 
        error: 'No path provided' 
      }, 400);
    }
    
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);
    
    if (error) {
      console.error('[DELETE IMAGE] Error:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to delete image',
        details: error.message
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
    
  } catch (error) {
    console.error('[DELETE IMAGE] Error:', error);
    return c.json({ 
      success: false, 
      error: 'Delete failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default uploadRoute;
