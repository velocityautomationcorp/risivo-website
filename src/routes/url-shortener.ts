import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { getCookie } from 'hono/cookie';

type Bindings = {
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
};

const urlShortenerRoute = new Hono<{ Bindings: Bindings }>();

// Generate a random short code
function generateShortCode(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Create a short URL
urlShortenerRoute.post('/create', async (c) => {
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        return c.json({ error: 'Database not configured' }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
        const body = await c.req.json();
        const { original_url, title, update_type, update_id } = body;
        
        if (!original_url) {
            return c.json({ error: 'Original URL is required' }, 400);
        }
        
        // Generate unique short code
        let shortCode = generateShortCode();
        let attempts = 0;
        const maxAttempts = 10;
        
        // Check for uniqueness
        while (attempts < maxAttempts) {
            const { data: existing } = await supabase
                .from('short_urls')
                .select('id')
                .eq('short_code', shortCode)
                .single();
            
            if (!existing) break;
            
            shortCode = generateShortCode();
            attempts++;
        }
        
        if (attempts >= maxAttempts) {
            return c.json({ error: 'Failed to generate unique short code' }, 500);
        }
        
        // Create short URL record
        const { data, error } = await supabase
            .from('short_urls')
            .insert({
                short_code: shortCode,
                original_url,
                title,
                update_type,
                update_id
            })
            .select()
            .single();
        
        if (error) throw error;
        
        // Return the short URL
        const shortUrl = `https://risivo.com/s/${shortCode}`;
        
        return c.json({
            success: true,
            short_url: shortUrl,
            short_code: shortCode,
            data
        });
    } catch (error) {
        console.error('Create short URL error:', error);
        return c.json({ error: 'Failed to create short URL' }, 500);
    }
});

// Get short URL stats
urlShortenerRoute.get('/stats/:code', async (c) => {
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        return c.json({ error: 'Database not configured' }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const shortCode = c.req.param('code');
    
    try {
        const { data: shortUrl, error } = await supabase
            .from('short_urls')
            .select('*')
            .eq('short_code', shortCode)
            .single();
        
        if (error || !shortUrl) {
            return c.json({ error: 'Short URL not found' }, 404);
        }
        
        // Get click analytics
        const { data: clicks } = await supabase
            .from('url_clicks')
            .select('*')
            .eq('short_url_id', shortUrl.id)
            .order('clicked_at', { ascending: false })
            .limit(100);
        
        // Get click summary
        const { count: totalClicks } = await supabase
            .from('url_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('short_url_id', shortUrl.id);
        
        return c.json({
            short_url: shortUrl,
            total_clicks: totalClicks || 0,
            recent_clicks: clicks || []
        });
    } catch (error) {
        console.error('Get short URL stats error:', error);
        return c.json({ error: 'Failed to get stats' }, 500);
    }
});

// List all short URLs (admin)
urlShortenerRoute.get('/list', async (c) => {
    const sessionToken = getCookie(c, 'admin_session');
    if (!sessionToken) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        return c.json({ error: 'Database not configured' }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
        const { data, error } = await supabase
            .from('short_urls')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        return c.json({ urls: data || [] });
    } catch (error) {
        console.error('List short URLs error:', error);
        return c.json({ error: 'Failed to list URLs' }, 500);
    }
});

// Delete short URL
urlShortenerRoute.delete('/:code', async (c) => {
    const sessionToken = getCookie(c, 'admin_session');
    if (!sessionToken) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        return c.json({ error: 'Database not configured' }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const shortCode = c.req.param('code');
    
    try {
        const { error } = await supabase
            .from('short_urls')
            .delete()
            .eq('short_code', shortCode);
        
        if (error) throw error;
        
        return c.json({ success: true });
    } catch (error) {
        console.error('Delete short URL error:', error);
        return c.json({ error: 'Failed to delete URL' }, 500);
    }
});

export default urlShortenerRoute;
