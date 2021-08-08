import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import multer from 'multer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const upload = (filePath: string) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET!,
      key: (req, file, cb) => {
        cb(null, filePath + `/${uuidv4()}.jpg`);
      },
      acl: 'public-read-write',
    }),
  });

export const deleteImage = async (filePath: string) =>
  await s3.deleteObject({ Bucket: process.env.BUCKET!, Key: 'portfolio/' + filePath }).promise();
