import { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const s3 = s3Client;

export async function generatePresignedUrl(
  key: string,
  contentType: string,
  isTemp: boolean = false
) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: contentType,
    ...(isTemp ? { Tagging: 'temp=true' } : {}),
  });

  return await getSignedUrl(s3, command, { expiresIn: 60 });
}

export async function copyS3Object(fromKey: string, toKey: string) {
  const command = new CopyObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    CopySource: `/${process.env.AWS_S3_BUCKET}/${fromKey}`,
    Key: toKey,
  });

  return await s3.send(command);
}

export async function deleteS3Object(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  });

  return await s3.send(command);
}

export function getS3Url(key: string) {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export function generateS3Key(
  userId: string,
  target: 'avatar' | 'post' | 'temp',
  postId?: string,
  extension?: string
) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const filename = `${crypto.randomUUID()}${extension ? `.${extension}` : ''}`;

  switch (target) {
    case 'avatar':
      return `users/${userId}/avatar/${yyyy}/${mm}/${filename}`;
    case 'post':
      if (!postId) throw new Error('postId is required for post target');
      return `users/${userId}/posts/${postId}/${yyyy}/${mm}/${filename}`;
    case 'temp':
      return `users/${userId}/temp/${filename}`;
    default:
      throw new Error('Invalid target');
  }
}
