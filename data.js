const DEFAULT_SERVICES=[
{title:"SBI Insurance Assistance",text:"Ask through WhatsApp for information about available insurance assistance and related enquiries."},
{title:"Rubber Tappers & Workers",text:"Ask job-related questions and information regarding rubber tapping and worker opportunities through WhatsApp."},
{title:"Water Pumps & Motors",text:"Information about quality, durable pumps and motors with competitive pricing and Tamil Nadu sourced machinery."},
{title:"Used Vehicles",text:"No fake stock listings. Contact us for information or assistance in arranging used vehicle enquiries."}
];
const DEFAULT_SETTINGS={bg:"#090909",btn:"#f5f3ee",accent:"#d6ad50",animations:true,effects:true,open:"8:00 AM",close:"8:00 PM",holiday:"Sunday"};
function getStore(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function setStore(key,value){localStorage.setItem(key,JSON.stringify(value))}
let products=getStore("cm_products",[]);
let offers=getStore("cm_offers",[]);
let settings=getStore("cm_settings",DEFAULT_SETTINGS);
let selectedProduct=null;