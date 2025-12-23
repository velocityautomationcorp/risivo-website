import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';

const interactions = new Hono();

// Helper function to verify user session
async function verifyUserSession(c: any) {
  const sessionToken = getCookie(c, 'user_session');
  
  if (!sessionToken) {
    return null;
  }
  
  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: session } = await supabase
    .from('user_sessions')
    .select('user_id, expires_at')
    .eq('session_token', sessionToken)
    .single();
  
  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }
  
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user_id)
    .single();
  
  if (!user || user.status !== 'active') {
    return null;
  }
  
  return { user, supabase };
}

// ============================================
// GET /api/updates/:update_id/interactions
// Get likes, dislikes, comments count and user's status
// ============================================
interactions.get('/:update_id/interactions', async (c) => {
  try {
    const updateId = c.req.param('update_id');
    const auth = await verifyUserSession(c);
    
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { user, supabase } = auth;
    
    // Get update stats
    const { data: update } = await supabase
      .from('project_updates')
      .select('likes_count, dislikes_count, comments_count')
      .eq('id', updateId)
      .single();
    
    // Get user's like status
    const { data: userLike } = await supabase
      .from('update_likes')
      .select('like_type')
      .eq('update_id', updateId)
      .eq('user_id', user.id)
      .single();
    
    return c.json({
      success: true,
      likes_count: update?.likes_count || 0,
      dislikes_count: update?.dislikes_count || 0,
      comments_count: update?.comments_count || 0,
      user_like_status: userLike?.like_type || null  // 'like', 'dislike', or null
    });
    
  } catch (error) {
    console.error('[INTERACTIONS] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// POST /api/updates/:update_id/like
// Like or dislike an update
// ============================================
interactions.post('/:update_id/like', async (c) => {
  try {
    const updateId = c.req.param('update_id');
    const auth = await verifyUserSession(c);
    
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { user, supabase } = auth;
    const body = await c.req.json();
    const { type } = body;  // 'like' or 'dislike'
    
    if (!type || !['like', 'dislike'].includes(type)) {
      return c.json({ error: 'Invalid type. Must be "like" or "dislike"' }, 400);
    }
    
    // Check if user already liked/disliked
    const { data: existing } = await supabase
      .from('update_likes')
      .select('*')
      .eq('update_id', updateId)
      .eq('user_id', user.id)
      .single();
    
    if (existing) {
      if (existing.like_type === type) {
        // Remove like/dislike (toggle off)
        await supabase
          .from('update_likes')
          .delete()
          .eq('id', existing.id);
        
        return c.json({ 
          success: true, 
          action: 'removed',
          message: `${type} removed` 
        });
      } else {
        // Change like to dislike or vice versa
        await supabase
          .from('update_likes')
          .update({ like_type: type, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        
        return c.json({ 
          success: true, 
          action: 'changed',
          message: `Changed to ${type}` 
        });
      }
    } else {
      // Add new like/dislike
      await supabase
        .from('update_likes')
        .insert({
          update_id: updateId,
          user_id: user.id,
          like_type: type
        });
      
      return c.json({ 
        success: true, 
        action: 'added',
        message: `${type} added` 
      });
    }
    
  } catch (error) {
    console.error('[LIKE] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// GET /api/updates/:update_id/comments
// Get all comments for an update
// ============================================
interactions.get('/:update_id/comments', async (c) => {
  try {
    const updateId = c.req.param('update_id');
    const auth = await verifyUserSession(c);
    
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { supabase } = auth;
    
    // Get comments first
    const { data: comments, error } = await supabase
      .from('update_comments')
      .select('id, comment_text, is_edited, created_at, updated_at, user_id')
      .eq('update_id', updateId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[COMMENTS] Database error:', error);
      return c.json({ error: 'Failed to fetch comments' }, 500);
    }
    
    // Get user info for each comment separately
    const commentsWithUsers = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: user } = await supabase
          .from('users')
          .select('id, first_name, last_name, email')
          .eq('id', comment.user_id)
          .single();
        
        return {
          ...comment,
          user: user || { id: comment.user_id, first_name: 'Unknown', last_name: 'User', email: '' }
        };
      })
    );
    
    return c.json({
      success: true,
      comments: commentsWithUsers || [],
      count: commentsWithUsers?.length || 0
    });
    
  } catch (error) {
    console.error('[COMMENTS] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// POST /api/updates/:update_id/comments
// Add a comment
// ============================================
interactions.post('/:update_id/comments', async (c) => {
  try {
    const updateId = c.req.param('update_id');
    const auth = await verifyUserSession(c);
    
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { user, supabase } = auth;
    const body = await c.req.json();
    const { comment } = body;
    
    if (!comment || comment.trim().length === 0) {
      return c.json({ error: 'Comment cannot be empty' }, 400);
    }
    
    if (comment.length > 1000) {
      return c.json({ error: 'Comment too long (max 1000 characters)' }, 400);
    }
    
    // Add comment
    const { data: newComment, error } = await supabase
      .from('update_comments')
      .insert({
        update_id: updateId,
        user_id: user.id,
        comment_text: comment.trim()
      })
      .select('id, comment_text, is_edited, created_at, user_id')
      .single();
    
    if (error) {
      console.error('[COMMENT] Database error:', error);
      return c.json({ error: 'Failed to add comment' }, 500);
    }
    
    // Add user info to the comment
    const commentWithUser = {
      ...newComment,
      user: {
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email
      }
    };
    
    return c.json({
      success: true,
      comment: commentWithUser,
      message: 'Comment added successfully'
    });
    
  } catch (error) {
    console.error('[COMMENT] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// DELETE /api/updates/:update_id/comments/:comment_id
// Delete a comment (only own comments)
// ============================================
interactions.delete('/:update_id/comments/:comment_id', async (c) => {
  try {
    const commentId = c.req.param('comment_id');
    const auth = await verifyUserSession(c);
    
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { user, supabase } = auth;
    
    // Check if comment belongs to user
    const { data: comment } = await supabase
      .from('update_comments')
      .select('user_id')
      .eq('id', commentId)
      .single();
    
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404);
    }
    
    if (comment.user_id !== user.id) {
      return c.json({ error: 'Cannot delete other users comments' }, 403);
    }
    
    // Delete comment
    await supabase
      .from('update_comments')
      .delete()
      .eq('id', commentId);
    
    return c.json({
      success: true,
      message: 'Comment deleted successfully'
    });
    
  } catch (error) {
    console.error('[DELETE COMMENT] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default interactions;
