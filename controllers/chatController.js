import supabase from '../db/supabase.js';
import { generateCoachingResponse, generateSessionTitle } from '../services/aiService.js';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';
import { forwardToPythonRetrieve } from '../services/ragService.js';

/**
 * Send a message and get AI coaching response
 */
export const chat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let currentSessionId = sessionId;

    // Create new session if needed
    if (!currentSessionId) {
      const title = await generateSessionTitle(message);

      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title,
        })
        .select()
        .single();

      if (error) throw error;
      currentSessionId = session.id;
    }

    // Store user message
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        session_id: currentSessionId,
        role: 'user',
        content: message.trim(),
      });

    if (msgError) throw msgError;

    // Fetch business profile
    const { data: profile } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Fetch previous messages for context (last 20)
    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: true })
      .limit(20);

    // Build system prompt with full context
    // Retrieve relevant documents from RAG service and inject into system prompt
    let retrievedContext = [];
    try {
      const r = await forwardToPythonRetrieve(userId, message, 5);
      const raw = r.context || r.results || [];
      retrievedContext = raw.map((x) => {
        if (typeof x === 'string') return x;
        return x?.text || x?.content || JSON.stringify(x);
      });
    } catch (err) {
      console.warn('RAG retrieve failed, continuing without external context', err.message);
    }

    const systemPrompt = buildSystemPrompt({
      profile,
      history: history || [],
      // The builder can use retrievedContext if desired; we'll append explicitly
    });

    let augmentedSystemPrompt = systemPrompt;
    if (retrievedContext && retrievedContext.length) {
      augmentedSystemPrompt += '\n\nSYSTEM CONTEXT:\n' + retrievedContext.join('\n\n');
    }

    // Generate AI response (inject retrieved context)
    const aiResponse = await generateCoachingResponse(augmentedSystemPrompt, message);

    // Store AI response
    const { error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        session_id: currentSessionId,
        role: 'assistant',
        content: aiResponse,
      });

    if (aiMsgError) throw aiMsgError;

    // Update session summary with latest context
    await supabase
      .from('chat_sessions')
      .update({
        summary: message.substring(0, 150),
      })
      .eq('id', currentSessionId);

   res.json({
  session: {
    id: currentSessionId,
  },

  message: {
    id: Date.now().toString(),
    role: 'assistant',
    content: aiResponse,
    created_at: new Date().toISOString(),
  }
});
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

/**
 * Get all sessions for a user
 */
export const getSessions = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ sessions: sessions || [] });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

/**
 * Get all messages for a session
 */
export const getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

/**
 * Delete a session and its messages
 */
export const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Messages will cascade delete
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;

    res.json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
};
