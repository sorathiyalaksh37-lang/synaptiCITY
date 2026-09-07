import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase, supabaseAdmin } from '../config/supabase';

/**
 * Get all public networks with filtering and pagination
 */
export const getNetworks = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'recent', // 'recent', 'popular', 'liked'
      tags,
      q, // search query
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('networks')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `, { count: 'exact' })
      .eq('is_public', true)
      .range(offset, offset + limitNum - 1);

    // Apply sorting
    if (sort === 'popular') {
      query = query.order('likes_count', { ascending: false });
    } else if (sort === 'liked') {
      query = query.order('downloads_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply tag filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query = query.overlaps('tags', tagArray);
    }

    // Apply search filter
    if (q) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get networks error:', error);
    res.status(500).json({
      error: 'Failed to fetch networks',
      message: error.message,
    });
  }
};

/**
 * Get a single network by ID
 */
export const getNetwork = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('networks')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        error: 'Network not found',
      });
    }

    // Check if user has access
    if (!data.is_public && data.user_id !== req.user?.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This network is private',
      });
    }

    // Increment view count
    await supabase
      .from('networks')
      .update({ views_count: data.views_count + 1 })
      .eq('id', id);

    res.json({ data });
  } catch (error: any) {
    console.error('Get network error:', error);
    res.status(500).json({
      error: 'Failed to fetch network',
      message: error.message,
    });
  }
};

/**
 * Create a new network
 */
export const createNetwork = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const {
      name,
      description,
      vocabulary,
      weights,
      learning_rate,
      learning_rule,
      is_public = true,
      allow_derivatives = true,
      tags = [],
    } = req.body;

    const { data, error } = await supabase
      .from('networks')
      .insert({
        user_id: req.user.id,
        name,
        description,
        vocabulary,
        weights,
        learning_rate,
        learning_rule,
        is_public,
        allow_derivatives,
        tags,
      })
      .select()
      .single();

    if (error) throw error;

    // Update user's network count
    await supabase.rpc('increment', {
      table_name: 'profiles',
      column_name: 'networks_created',
      row_id: req.user.id,
    });

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: req.user.id,
      action: 'create_network',
      resource_type: 'network',
      resource_id: data.id,
    });

    res.status(201).json({ data });
  } catch (error: any) {
    console.error('Create network error:', error);
    res.status(500).json({
      error: 'Failed to create network',
      message: error.message,
    });
  }
};

/**
 * Update a network
 */
export const updateNetwork = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check ownership
    const { data: existing } = await supabase
      .from('networks')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own networks',
      });
    }

    const { data, error } = await supabase
      .from('networks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ data });
  } catch (error: any) {
    console.error('Update network error:', error);
    res.status(500).json({
      error: 'Failed to update network',
      message: error.message,
    });
  }
};

/**
 * Delete a network
 */
export const deleteNetwork = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    // Check ownership
    const { data: existing } = await supabase
      .from('networks')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own networks',
      });
    }

    const { error } = await supabase
      .from('networks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Network deleted successfully' });
  } catch (error: any) {
    console.error('Delete network error:', error);
    res.status(500).json({
      error: 'Failed to delete network',
      message: error.message,
    });
  }
};

/**
 * Like a network
 */
export const likeNetwork = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    // Check if already liked
    const { data: existing } = await supabase
      .from('network_likes')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('network_id', id)
      .single();

    if (existing) {
      return res.status(400).json({
        error: 'Already liked',
        message: 'You have already liked this network',
      });
    }

    const { error } = await supabase
      .from('network_likes')
      .insert({
        user_id: req.user.id,
        network_id: id,
      });

    if (error) throw error;

    res.json({ message: 'Network liked successfully' });
  } catch (error: any) {
    console.error('Like network error:', error);
    res.status(500).json({
      error: 'Failed to like network',
      message: error.message,
    });
  }
};

/**
 * Unlike a network
 */
export const unlikeNetwork = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('network_likes')
      .delete()
      .eq('user_id', req.user.id)
      .eq('network_id', id);

    if (error) throw error;

    res.json({ message: 'Network unliked successfully' });
  } catch (error: any) {
    console.error('Unlike network error:', error);
    res.status(500).json({
      error: 'Failed to unlike network',
      message: error.message,
    });
  }
};

/**
 * Get user's own networks
 */
export const getMyNetworks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data, error } = await supabase
      .from('networks')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (error: any) {
    console.error('Get my networks error:', error);
    res.status(500).json({
      error: 'Failed to fetch your networks',
      message: error.message,
    });
  }
};
