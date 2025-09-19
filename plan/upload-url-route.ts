import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import crypto from "crypto";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { target, postId, mime, ext } = await req.json();
  if (!mime || !ext) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const userId = session.user.id;
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const bucket = process.env.AWS_S3_BUCKET!;

  const fileName = `${crypto.randomUUID()}.${ext.replace(".", "")}`;

  const key =
    target === "avatar"
      ? `users/${userId}/avatar/${yyyy}/${mm}/${fileName}`
      : target === "post" && postId
      ? `users/${userId}/posts/${postId}/${yyyy}/${mm}/${fileName}`
      : `users/${userId}/temp/${fileName}`;

  const tagging = key.includes("/temp/") ? "temp=true" : undefined;

  const put = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: mime,
    ...(tagging ? { Tagging: tagging } : {})
  });
  const url = await getSignedUrl(s3, put, { expiresIn: 60 });

  return NextResponse.json({ url, key });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { fromKey, toKey } = await req.json();
  if (!fromKey || !toKey) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const bucket = process.env.AWS_S3_BUCKET!;
  const copy = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `/${bucket}/${fromKey}`,
    Key: toKey
  });
  await s3.send(copy);
  return NextResponse.json({ ok: true });
}
