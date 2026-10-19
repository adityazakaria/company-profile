import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';

if (env.useCloudinary) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError(400, 'File gambar wajib diunggah (field: image)');

  let url;
  if (env.useCloudinary) {
    url = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'company-profile', resource_type: 'image' }, (err, result) =>
          err ? reject(err) : resolve(result.secure_url))
        .end(req.file.buffer);
    });
  } else {
    url = `${env.PUBLIC_API_URL.replace(/\/$/, '')}/uploads/${req.file.filename}`;
  }

  res.status(201).json({ success: true, message: 'Gambar berhasil diunggah', data: { url } });
});
