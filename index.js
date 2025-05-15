import express from 'express';
import multer from 'multer';
import { uploadFile, listFiles } from './gcs.js';

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await uploadFile(req.file);
    res.status(200).json({ message: 'Uploaded to GCS', name: result.name });
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
});

app.get('/files', async (req, res) => {
  try {
    const files = await listFiles();
    res.status(200).json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error listing files');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
