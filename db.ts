import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
const databaseUrl=process.env.TURSO_DATABASE_URL;
const databaseToken=process.env.TURSO_AUTH_TOKEN;
if(!databaseUrl||!databaseToken)throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
export const client=createClient({url:databaseUrl,authToken:databaseToken});
export const db=drizzle(client,{schema});
export async function ensureTables(){await client.executeMultiple(`
CREATE TABLE IF NOT EXISTS owner(id TEXT PRIMARY KEY,password_hash TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,token_hash TEXT NOT NULL UNIQUE,expires_at INTEGER NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY,name TEXT NOT NULL,type TEXT NOT NULL,stock INTEGER NOT NULL,actual TEXT,offer TEXT,condition TEXT NOT NULL,details TEXT,damage TEXT,images TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS offers(id TEXT PRIMARY KEY,title TEXT NOT NULL,text TEXT,images TEXT NOT NULL,popup INTEGER NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS services(id TEXT PRIMARY KEY,title TEXT NOT NULL,text TEXT NOT NULL,image TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS bills(id TEXT PRIMARY KEY,number TEXT NOT NULL UNIQUE,date TEXT NOT NULL,time TEXT NOT NULL,customer TEXT NOT NULL,phone TEXT NOT NULL,address TEXT,items TEXT NOT NULL,discount TEXT NOT NULL,other TEXT NOT NULL,status TEXT NOT NULL,subtotal TEXT NOT NULL,total TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS reminders(id TEXT PRIMARY KEY,name TEXT NOT NULL,phone TEXT NOT NULL,type TEXT NOT NULL,english TEXT NOT NULL,kannada TEXT NOT NULL,include_qr INTEGER NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);`)}
