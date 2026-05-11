import supabase from '../db/supabase.js';

/**
 * Create or update a business profile
 */
export const upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { business_name, industry, business_size, goals, challenges } = req.body;
    console.log(req.body);
    // Validation
    if (!business_name || !industry || !business_size) {
      return res.status(400).json({
        error: 'Business name, industry, and business size are required',
      });
    }

    // Check if profile exists
    const { data: existing } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;

    if (existing) {
      // Update existing profile
      const { data, error } = await supabase
        .from('business_profiles')
        .update({
          business_name: business_name.trim(),
          industry: industry.trim(),
          business_size: business_size.trim(),
          goals: goals?.trim() || null,
          challenges: challenges?.trim() || null,
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('business_profiles')
        .insert({
          user_id: userId,
          business_name: business_name.trim(),
          industry: industry.trim(),
          business_size: business_size.trim(),
          goals: goals?.trim() || null,
          challenges: challenges?.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.status(existing ? 200 : 201).json({
      message: existing ? 'Profile updated' : 'Profile created',
      profile: result,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
};

/**
 * Get a user's business profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const { data: profile, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
