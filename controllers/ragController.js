import supabase from '../db/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import { forwardToPythonUpload } from '../services/ragService.js';

// Upload a DOCX, forward to Python RAG service, store metadata in Supabase
export const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('[ragController] req.file:', req.file ? { originalname: req.file.originalname, size: req.file.size } : null);
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'File is required' });

    const file = req.file; // buffer, originalname
    const filename = file.originalname || 'upload.docx';
    const ragDocumentId = uuidv4();

    // Forward to Python RAG service
    const pythonResp = await forwardToPythonUpload(file.buffer, filename, userId, ragDocumentId);

    // Store metadata in Supabase table `uploaded_documents`
    const { data, error } = await supabase
      .from('uploaded_documents')
      .insert({
        user_id: userId,
        filename,
        upload_date: new Date().toISOString(),
        rag_document_id: ragDocumentId,
        chunks_indexed: pythonResp.chunks || null,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ document: data });
  } catch (err) {
    console.error('RAG upload error:', err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

export const listDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('user_id', userId)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    res.json({ documents: data || [] });
  } catch (err) {
    console.error('List documents error:', err);
    res.status(500).json({ error: 'Failed to list documents' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Ensure document belongs to user
    const { data: doc, error: fetchError } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !doc) return res.status(404).json({ error: 'Document not found' });
    if (doc.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    // TODO: optionally call Python to delete vectors by rag_document_id

    const { error } = await supabase
      .from('uploaded_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Document deleted' });
  } catch (err) {
    console.error('Delete document error:', err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};
