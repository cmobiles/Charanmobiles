import { Hono } from "hono";import { join } from "path";import { serveStatic } from "hono/bun";import { z } from "zod";import { eq, desc } from "drizzle-orm";import { db,ensureTables } from "./db";import * as S from "./schema";import { seedOwner,login,logout,requireOwner,changePassword,cleanupSessions } from "./auth";import { upload } from "./storage";import { makeBillPdf } from "./pdf";
const app=new Hono();
app.use("*",async(c,n)=>{
  c.header("X-Content-Type-Options","nosniff");
  c.header("X-Frame-Options","DENY");
  c.header("Referrer-Policy","strict-origin-when-cross-origin");
  await n();
});
app.use("/api/*",async(c,n)=>{c.header("Cache-Control","no-store");await n()});
app.onError((err,c)=>{
  console.error(err);
  if(err instanceof z.ZodError)return c.json({error:"Invalid request data"},400);
  return c.json({error:"Internal server error"},500);
});
const defaults={bg:"#080808",btn:"#f4f1eb",accent:"#d6ad50",animations:true,effects:true,open:"8:00 AM",close:"8:00 PM",holiday:"Sunday",leave:"",qr:""};
const serviceDefaults=[
["sbi","SBI Insurance Assistance","Ask through WhatsApp for insurance-related assistance and enquiries. All types of insurance enquiries can be discussed directly with the owner."],
["rubber","Rubber Tappers & Workers","Ask job-related questions and information about rubber tapping work through WhatsApp."],
["motors","Water Pumps & Motors","Information about quality, long-life durable pumps and motors with competitive pricing. Machinery information includes products sourced from Tamil Nadu."],
["vehicles","Used Vehicles Assistance","No fake or invented vehicle stock is shown. Contact Charan Mobiles for information or assistance regarding used vehicles."]];
const id=()=>crypto.randomUUID(), now=()=>Date.now();const body=async(c:any)=>c.req.json();
const imageUrl=z.string().url();
const productInput=z.object({name:z.string().trim().min(1).max(160),type:z.string().trim().min(1).max(80),stock:z.coerce.number().int().min(0),actual:z.union([z.string().max(40),z.null()]).optional(),offer:z.union([z.string().max(40),z.null()]).optional(),condition:z.string().trim().min(1).max(50),details:z.union([z.string().max(5000),z.null()]).optional(),damage:z.union([z.string().max(2000),z.null()]).optional(),images:z.array(imageUrl).max(20)});
const offerInput=z.object({title:z.string().trim().min(1).max(160),text:z.union([z.string().max(5000),z.null()]).optional(),images:z.array(imageUrl).max(20),popup:z.boolean()});
const serviceInput=z.object({title:z.string().trim().min(1).max(160),text:z.string().trim().min(1).max(5000),image:z.union([imageUrl,z.null()]).optional()});
const reminderInput=z.object({name:z.string().trim().min(1).max(160),phone:z.string().trim().regex(/^\+?[0-9 ()-]{7,25}$/),type:z.string().trim().min(1).max(100),english:z.string().trim().min(1).max(4000),kannada:z.string().trim().min(1).max(4000),includeQr:z.boolean()});

function calcBill(x:any){const items=(x.items||[]).map((it:any,i:number)=>{const q=Number(it.qty)||1,u=Number(it.unit)||0;return {no:i+1,desc:String(it.desc||it.description||"Item"),qty:q,unit:u,total:q*u}});const subtotal=items.reduce((a:number,x:any)=>a+x.total,0),discount=Number(x.discount)||0,other=Number(x.other)||0;return {...x,items,subtotal:String(subtotal),discount:String(discount),other:String(other),total:String(Math.max(0,subtotal-discount+other))}}
async function list(table:any){return db.select().from(table).orderBy(desc(table.createdAt))}
app.get("/api/health",c=>c.json({ok:true}));
app.get("/api/public/products",async c=>c.json(await list(S.products)));
app.get("/api/public/offers",async c=>c.json(await list(S.offers)));
app.get("/api/public/services",async c=>c.json(await list(S.services)));
app.get("/api/public/settings",async c=>{const r=(await db.select().from(S.settings).where(eq(S.settings.key,"site")))[0];return c.json(r?.value||defaults)});
app.get("/api/public/bills/lookup",async c=>{const phone=(c.req.query("phone")||"").replace(/\D/g,""),number=c.req.query("number");if(!phone&&!number)return c.json({error:"phone or number required"},400);const rows=await db.select().from(S.bills).orderBy(desc(S.bills.createdAt));const b=rows.find((x:any)=>(number&&x.number===number)||(!number&&phone&&x.phone.replace(/\D/g,"")===phone));return b?c.json({id:b.id,number:b.number,date:b.date,total:b.total,status:b.status}):c.json({error:"Not found"},404)});
app.get("/api/public/bills/:id/pdf",async c=>{const b=(await db.select().from(S.bills).where(eq(S.bills.id,c.req.param("id"))).limit(1))[0];if(!b)return c.text("Not found",404);const bytes=await Bun.file(join(import.meta.dir,"../public/assets/ebill-template.jpg")).arrayBuffer();const pdf=await makeBillPdf(b,bytes);return new Response(pdf,{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="Charan-Mobiles-${b.number}.pdf"`}})});
app.post("/api/auth/login",async c=>{const x=z.object({password:z.string().min(1)}).parse(await body(c));const r=await login(c,x.password);return r.ok?c.json({ok:true}):c.json(r,401)});
app.post("/api/auth/logout",requireOwner,async c=>{await logout(c);return c.json({ok:true})});
app.get("/api/auth/me",async c=>{try{let ok=false;await requireOwner(c,async()=>{ok=true});return c.json({authenticated:ok})}catch{return c.json({authenticated:false})}});
app.post("/api/auth/change-password",requireOwner,async c=>{const x=z.object({current:z.string(),next:z.string().min(10)}).parse(await body(c));try{await changePassword(x.current,x.next);await logout(c);return c.json({ok:true})}catch(e:any){return c.json({error:e.message},400)}});
app.use("/api/admin/*",requireOwner);
async function imageUrls(c:any){const form=await c.req.formData(),files=form.getAll("images").filter((x:any)=>x instanceof File) as File[];return {form,urls:await Promise.all(files.map(upload))}}
app.post("/api/admin/upload",async c=>{const {urls}=await imageUrls(c);return c.json({urls})});
function crud(path:string,table:any,fields:string[],parser:any){
 app.get(`/api/admin/${path}`,async c=>c.json(await list(table)));
 app.post(`/api/admin/${path}`,async c=>{const x=parser.parse(await body(c)),t=now(),row:any={id:id(),createdAt:t,updatedAt:t,...x};await db.insert(table).values(row);return c.json(row,201)});
 app.put(`/api/admin/${path}/:id`,async c=>{const x=parser.partial().parse(await body(c));if(!Object.keys(x).length)return c.json({error:"No changes supplied"},400);const result=await db.update(table).set({...x,updatedAt:now()}).where(eq(table.id,c.req.param("id")));return c.json({ok:true,changes:(result as any).rowsAffected??undefined})});
 app.delete(`/api/admin/${path}/:id`,async c=>{await db.delete(table).where(eq(table.id,c.req.param("id")));return c.json({ok:true})})
}
crud("products",S.products,["name","type","stock","actual","offer","condition","details","damage","images"],productInput);crud("offers",S.offers,["title","text","images","popup"],offerInput);crud("services",S.services,["title","text","image"],serviceInput);crud("reminders",S.reminders,["name","phone","type","english","kannada","includeQr"],reminderInput);
app.get("/api/admin/bills",async c=>c.json(await list(S.bills)));app.post("/api/admin/bills",async c=>{const x=calcBill(await body(c)),t=now(),row={...x,id:id(),createdAt:t,updatedAt:t};await db.insert(S.bills).values(row);return c.json(row,201)});app.put("/api/admin/bills/:id",async c=>{const x=calcBill(await body(c));delete x.id;await db.update(S.bills).set({...x,updatedAt:now()}).where(eq(S.bills.id,c.req.param("id")));return c.json({ok:true})});app.delete("/api/admin/bills/:id",async c=>{await db.delete(S.bills).where(eq(S.bills.id,c.req.param("id")));return c.json({ok:true})});
app.get("/api/admin/settings",async c=>{const r=(await db.select().from(S.settings).where(eq(S.settings.key,"site")))[0];return c.json(r?.value||defaults)});app.put("/api/admin/settings",async c=>{const value=await body(c);await db.insert(S.settings).values({key:"site",value,updatedAt:now()}).onConflictDoUpdate({target:S.settings.key,set:{value,updatedAt:now()}});return c.json(value)});
app.post("/api/admin/reminders/:id/send",async c=>{const r=(await db.select().from(S.reminders).where(eq(S.reminders.id,c.req.param("id"))).limit(1))[0];if(!r)return c.json({error:"Not found"},404);const token=process.env.WHATSAPP_ACCESS_TOKEN,phoneId=process.env.WHATSAPP_PHONE_NUMBER_ID;if(!token||!phoneId)return c.json({error:"WhatsApp Cloud API is not configured"},503);const graph=`https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION||"v23.0"}/${phoneId}/messages`;
const headers={Authorization:`Bearer ${token}`,"Content-Type":"application/json"};
const to=r.phone.replace(/\D/g,"");
const text=`${r.english}\n\n${r.kannada}`;
const res=await fetch(graph,{method:"POST",headers,body:JSON.stringify({messaging_product:"whatsapp",to,type:"text",text:{body:text}})});
if(!res.ok)return c.json({error:"WhatsApp API rejected message",details:await res.text()},502);
if(r.includeQr){
 const site=(await db.select().from(S.settings).where(eq(S.settings.key,"site")).limit(1))[0]?.value as any;
 if(site?.qr){const qrRes=await fetch(graph,{method:"POST",headers,body:JSON.stringify({messaging_product:"whatsapp",to,type:"image",image:{link:site.qr}})});if(!qrRes.ok)return c.json({error:"Reminder text sent, but QR image failed",details:await qrRes.text()},502)}
}
return c.json({ok:true})});
app.use("*",serveStatic({root:"./public"}));
app.get("*",async c=>c.html(await Bun.file(join(import.meta.dir,"../public/index.html")).text()));
await ensureTables();
await seedOwner();
const existing=await db.select().from(S.settings).where(eq(S.settings.key,"site"));
if(!existing.length)await db.insert(S.settings).values({key:"site",value:defaults,updatedAt:now()});
for(const [sid,title,text] of serviceDefaults){
  const ex=await db.select().from(S.services).where(eq(S.services.id,sid));
  if(!ex.length)await db.insert(S.services).values({id:sid,title,text,image:null,createdAt:now(),updatedAt:now()});
}
await cleanupSessions();
const port=Number(process.env.PORT||3000);
Bun.serve({hostname:"0.0.0.0",port,fetch:app.fetch});
console.log(`Charan Mobiles running on port ${port}`);
