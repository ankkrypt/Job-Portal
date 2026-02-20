import crypto from 'crypto';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, getR2PublicBaseUrl } from '@/lib/r2';
import validateToken from '@/middleware/tokenValidation';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_CONTENT_TYPES = ['application/pdf'];

const generateKey = (originalFileName) => {
  const extension = path.extname(originalFileName || '').toLowerCase();
  const safeName = (path.basename(originalFileName || 'cv', extension) || 'cv')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .slice(0, 60);
  const randomString = crypto.randomBytes(6).toString('hex');
  return `cv/${safeName}_${randomString}${extension || '.pdf'}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return validateToken(req, res, async () => {
    try {
      const { fileName, contentType, fileSize } = req.body || {};

      if (!fileName || !contentType) {
        return res.status(400).json({ error: 'Missing file details' });
      }

      if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
        return res.status(400).json({ error: 'Only PDF files are allowed' });
      }

      if (fileSize && Number(fileSize) > MAX_FILE_SIZE_BYTES) {
        return res.status(400).json({ error: 'File is too large' });
      }

      const bucket = process.env.R2_BUCKET;
      const endpoint = process.env.R2_ENDPOINT;
      const publicBaseUrl = getR2PublicBaseUrl();

      if (!bucket || !endpoint || !publicBaseUrl) {
        return res.status(500).json({ error: 'R2 configuration is missing' });
      }

      const key = generateKey(fileName);

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 60 * 5 });
      const fileUrl = `${publicBaseUrl}/${key}`;

      return res.status(200).json({
        success: true,
        uploadUrl,
        fileUrl,
        key,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
}
