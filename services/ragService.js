import axios from 'axios';
import FormData from 'form-data';

const PYTHON_RAG_URL =
  process.env.RAG_SERVICE_URL || 'http://localhost:8000';

/**
 * Upload DOCX to Python RAG service
 */
export async function forwardToPythonUpload(
  buffer,
  filename,
  userId,
  ragDocumentId
) {
  const form = new FormData();

  const lower = (filename || '').toLowerCase();

  const contentType = lower.endsWith('.docx')
    ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : 'application/octet-stream';

  // file
  form.append('file', buffer, {
    filename,
    contentType,
  });

  // metadata
  form.append('user_id', userId);

  if (ragDocumentId) {
    form.append('rag_document_id', ragDocumentId);
  }

  try {
    console.log('[RAG] Uploading file to Python service...');

    const response = await axios.post(
      `${PYTHON_RAG_URL}/api/upload`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },

        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000,
      }
    );

    console.log('[RAG] Upload success');

    return response.data;
  } catch (error) {
    console.error(
      '[RAG] Upload failed:',
      error?.response?.data || error.message
    );

    throw new Error(
      `Python upload failed: ${
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`
    );
  }
}

/**
 * Retrieve top-k chunks from Python RAG
 */
export async function forwardToPythonRetrieve(
  userId,
  query,
  k = 5
) {
  try {
    const response = await axios.post(
      `${PYTHON_RAG_URL}/api/retrieve`,
      {
        user_id: userId,
        query,
        k,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },

        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      '[RAG] Retrieve failed:',
      error?.response?.data || error.message
    );

    throw new Error(
      `Python retrieve failed: ${
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`
    );
  }
}