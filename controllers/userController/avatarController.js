import fs from 'fs/promises';

import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

import User from '../../models/userModel.js';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const updateAvatar = async (req, res) => {
  const userId = req.params.id;
  const { path } = req.file;
  try {
    const { url: avatarURL } = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      width: 200,
      height: 200,
    });
    await fs.unlink(path);

    await User.findByIdAndUpdate(userId, { avatarURL });

    res.status(200).send({ avatarURL });
  } catch (error) {
    console.log(error);
  }
};

export default updateAvatar;
