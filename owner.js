/*
 FRONTEND DEMO ONLY.
 Real security requires server-side authentication.
 The admin UI is hidden using the HTML `hidden` attribute and is never displayed
 until this browser session has passed the demo login check.
*/
const ownerPanel = document.getElementById("ownerPanel");
const ownerLoginModal = document.getElementById("ownerLogin");

function openOwnerLogin(){
  document.getElementById("ownerPassword").value="";
  document.getElementById("loginError").textContent="";
  ownerLoginModal.hidden=false;
}
function closeOwnerLogin(){ ownerLoginModal.hidden=true; }

function ownerLogin(){
  const pass=document.getElementById("ownerPassword").value;
  if(pass==="charan10"){
    sessionStorage.setItem("cm_owner_authenticated","true");
    closeOwnerLogin();
    ownerPanel.hidden=false;
    showAdminTab("dashboard");
  } else {
    document.getElementById("loginError").textContent="Incorrect password.";
  }
}
function ownerLogout(){
  sessionStorage.removeItem("cm_owner_authenticated");
  ownerPanel.hidden=true;
  ownerLoginModal.hidden=true;
}

function showAdminTab(name){
  document.querySelectorAll(".admin-tab").forEach(x=>x.hidden=true);
  const tab=document.getElementById("admin-"+name);
  if(tab) tab.hidden=false;
  if(name==="dashboard")renderStats();
  if(name==="products")renderAdminProducts();
  if(name==="offers")renderAdminOffers();
  if(name==="settings")loadSettingsForm();
}

async function filesToData(files){
  return Promise.all([...files].map(f=>new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(f);
  })));
}
async function saveProduct(e){
  e.preventDefault();
  const images=await filesToData(document.getElementById("pImages").files);
  const p={id:crypto.randomUUID(),name:pName.value.trim(),type:pType.value,stock:pStock.value,
    actual:pActual.value,offer:pOffer.value,condition:pCondition.value,
    details:pDetails.value.trim(),damage:pDamage.value.trim(),images};
  products.unshift(p);setStore("cm_products",products);e.target.reset();
  renderProducts();renderAdminProducts();alert("Product saved and published.");
}
function renderAdminProducts(){
  const el=document.getElementById("adminProductList");
  el.innerHTML=products.map(p=>`<div class="admin-list-item"><span>${esc(p.name)} — Stock: ${p.stock}</span><button class="delete-btn" onclick="deleteProduct('${p.id}')">Delete</button></div>`).join("")||"<p>No products yet.</p>";
}
function deleteProduct(id){
  if(!confirm("Delete this product?"))return;
  products=products.filter(p=>p.id!==id);setStore("cm_products",products);
  renderProducts();renderAdminProducts();
}
async function saveOffer(e){
  e.preventDefault();const file=oImage.files[0];let image="";
  if(file)image=(await filesToData([file]))[0];
  offers.unshift({id:crypto.randomUUID(),title:oTitle.value.trim(),text:oText.value.trim(),image,popup:oPopup.checked});
  setStore("cm_offers",offers);e.target.reset();renderOffers();renderAdminOffers();alert("Offer published.");
}
function renderAdminOffers(){
  const el=document.getElementById("adminOfferList");
  el.innerHTML=offers.map(o=>`<div class="admin-list-item"><span>${esc(o.title)} ${o.popup?"(Popup)":""}</span><button class="delete-btn" onclick="deleteOffer('${o.id}')">Delete</button></div>`).join("")||"<p>No offers yet.</p>";
}
function deleteOffer(id){
  if(!confirm("Delete this offer?"))return;
  offers=offers.filter(o=>o.id!==id);setStore("cm_offers",offers);
  renderOffers();renderAdminOffers();
}
function renderStats(){
  document.getElementById("dashboardStats").innerHTML=
  `<div class="stat"><span>Products</span><b>${products.length}</b></div>
   <div class="stat"><span>Offers</span><b>${offers.length}</b></div>
   <div class="stat"><span>Store Mode</span><b>Live</b></div>`;
}
function loadSettingsForm(){
  setBg.value=settings.bg;setBtn.value=settings.btn;setAccent.value=settings.accent;
  setAnimations.checked=settings.animations;setEffects.checked=settings.effects;
  setOpen.value=settings.open;setClose.value=settings.close;setHoliday.value=settings.holiday;
}
function saveSettings(){
  settings={bg:setBg.value,btn:setBtn.value,accent:setAccent.value,
    animations:setAnimations.checked,effects:setEffects.checked,
    open:setOpen.value,close:setClose.value,holiday:setHoliday.value};
  setStore("cm_settings",settings);applySettings();renderProducts();alert("Settings saved.");
}
if(sessionStorage.getItem("cm_owner_authenticated")==="true"){
  ownerPanel.hidden=false;
  showAdminTab("dashboard");
} else {
  ownerPanel.hidden=true;
}
