import { S3Client,PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";import { randomUUID } from "crypto";
const required=["TIGRIS_ENDPOINT","TIGRIS_BUCKET","TIGRIS_ACCESS_KEY_ID","TIGRIS_SECRET_ACCESS_KEY"];
function s3(){for(const k of required)if(!process.env[k])throw new Error(`Missing ${k}`);return new S3Client({region:process.env.TIGRIS_REGION||"auto",endpoint:process.env.TIGRIS_ENDPOINT,credentials:{accessKeyId:process.env.TIGRIS_ACCESS_KEY_ID!,secretAccessKey:process.env.TIGRIS_SECRET_ACCESS_KEY!},forcePathStyle:true})}
export async function upload(file:File){
  if(!file || file.size===0)throw new Error("Empty file");
  const allowed=new Set(["image/jpeg","image/png","image/webp","image/gif"]);
  if(!allowed.has(file.type))throw new Error("Only JPEG, PNG, WebP or GIF images are allowed");
  if(file.size>10*1024*1024)throw new Error("Image exceeds 10 MB");const key=`uploads/${new Date().toISOString().slice(0,10)}/${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;await s3().send(new PutObjectCommand({Bucket:process.env.TIGRIS_BUCKET!,Key:key,Body:new Uint8Array(await file.arrayBuffer()),ContentType:file.type}));const base=process.env.TIGRIS_PUBLIC_BASE_URL;if(!base)throw new Error("Missing TIGRIS_PUBLIC_BASE_URL");return `${base.replace(/\/$/,"")}/${key}`}
export async function removeByUrl(url:string){const base=process.env.TIGRIS_PUBLIC_BASE_URL?.replace(/\/$/,"");if(!base||!url.startsWith(base))return;const key=url.slice(base.length+1);await s3().send(new DeleteObjectCommand({Bucket:process.env.TIGRIS_BUCKET!,Key:key}))}
