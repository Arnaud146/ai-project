import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const credentialsBase64 = process.env.GCS_CREDENTIALS_BASE64;
const bucketName = process.env.GCS_BUCKET;

if (!credentialsBase64 || !bucketName) {
  throw new Error('Missing GCS_CREDENTIALS_BASE64 or GCS_BUCKET env variable.');
}

// Décode la clé et écrit un fichier temporaire
const keyFilePath = '/tmp/gcs-key.json';
fs.writeFileSync(keyFilePath, Buffer.from(credentialsBase64, 'base64'));

const storage = new Storage({ keyFilename: keyFilePath });
const bucket = storage.bucket(bucketName);

export async function uploadFile(file) {
  const blob = bucket.file(file.originalname);
  const stream = blob.createWriteStream();
  stream.end(file.buffer);
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(blob));
    stream.on('error', reject);
  });
}

export async function listFiles() {
  const [files] = await bucket.getFiles();
  return files.map(file => file.name);
}
