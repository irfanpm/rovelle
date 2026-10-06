const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const ts=require("typescript");
function load(file,mocks={}){
 const js=ts.transpileModule(fs.readFileSync(path.join(__dirname,"..",file),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const loadedModule={exports:{}};
 const req=name=>Object.hasOwn(mocks,name)?mocks[name]:require(name);
 vm.runInNewContext(js,{module:loadedModule,exports:loadedModule.exports,require:req,console,process,FormData,Date,Map,Set,URL,Buffer},{filename:file});
 return loadedModule.exports;
}
const dto=load("src/modules/products/public-product.ts");
test("Existing unselected cart options merge with new no-option additions",()=>{
 let state;
 const create=()=>initializer=>{state=initializer(patch=>{state={...state,...patch};},()=>state);return()=>state;};
 load("src/modules/cart/store/useCartStore.ts",{"zustand":{create},"zustand/middleware":{persist:fn=>fn,createJSONStorage:()=>({})}});
 state.addToCart({productId:"legacy",title:"Existing item",price:100,image:"",slug:"existing",variant:"",quantity:2});
 state.addToCart({productId:"legacy",title:"Existing item",price:100,image:"",slug:"existing"});
 assert.equal(state.cart.length,1);assert.equal(state.cart[0].quantity,3);
 state.addToCart({productId:"legacy",title:"Existing item",price:100,image:"",slug:"existing",variant:"Gold"});
 assert.equal(state.cart.length,2);
 state.updateQuantity("legacy",4,"");assert.equal(state.cart[0].quantity,4);
 state.removeFromCart("legacy","");assert.equal(state.cart.length,1);assert.equal(state.cart[0].variant,"Gold");
});
test("Compare prices appear only for genuine positive discounts",()=>{
 for(const compareAtPrice of [undefined,99,100,NaN,Infinity])assert.equal(dto.toPublicProduct({price:100,compareAtPrice}).compareAtPrice,undefined);
 assert.equal(dto.toPublicProduct({price:100,compareAtPrice:150}).compareAtPrice,150);
});
test("Rovelle navigation retains the original sourcing publication categories",()=>{
 const brand=load("src/lib/brand.ts");
 for(const slug of ["baby-toddler","toys-learning","kids-fashion","school-essentials","nursery-care"])assert(brand.sourcingCategories.some(c=>c.slug===slug));
 assert(brand.isJewelleryCategory("necklaces"));assert(!brand.isJewelleryCategory("baby-toddler"));
 assert.equal(brand.categoryHref("new-arrivals"),"/products?new=1&edit=jewellery");
});
test("Public DTO drops private fields at every nesting level",()=>{
 const result=dto.toPublicProduct({_id:"a10000000000000000000001",title:"Kiddio Pouch",slug:"kiddio-pouch",price:299,
 supplier:{platform:"PRIVATE_SENTINEL",supplierPrice:120},supplierUrl:"PRIVATE_SENTINEL",costPrice:120,profit:99,margin:50,internalNotes:"PRIVATE_SENTINEL",
 category:{name:"School",slug:"school",supplier:"PRIVATE_SENTINEL"},images:["https://images.meesho.com/private.webp","/images/kiddio-pouch.webp"],specifications:[{name:"Material",value:"Fabric",supplier:"PRIVATE_SENTINEL"}]});
 const json=JSON.stringify(result);assert(!json.includes("PRIVATE_SENTINEL"));for(const key of ["supplier","costPrice","profit","margin","internalNotes"])assert(!json.includes(key));
 assert.deepEqual(Array.from(result.images),["/images/kiddio-pouch.webp"]);
 assert.equal(Object.keys(result.specifications[0]).join(","),"name,value");
});
const validation=load("src/modules/checkout/validation.ts");
test("Indian address and quantity validation rejects malformed input",()=>{
 for(const quantity of [0,-1,1.5,11,NaN])assert.equal(validation.itemsSchema.safeParse([{productId:"a10000000000000000000001",quantity}]).success,false);
 assert.equal(validation.addressSchema.safeParse({fullName:"Test Parent",phone:"9876543210",house:"Flat 2",street:"Test Road",city:"Pune",district:"Pune",state:"Maharashtra",pincode:"411001"}).success,true);
 assert.equal(validation.addressSchema.safeParse({fullName:"Test Parent",phone:"12345",house:"Flat 2",street:"Test Road",city:"Pune",district:"Pune",state:"California",pincode:"12345"}).success,false);
});
const profit=load("src/modules/products/profit.ts");
test("Risk-adjusted economics accounts for every cost reserve",()=>{const e=profit.economics(210,549,{shipping:70,cod:15,rto:20,payment:10,marketing:40});assert.equal(e.landed,365);assert.equal(e.contribution,184);assert.equal(e.margin,33.5);assert.throws(()=>profit.economics(20,0,{shipping:0,cod:0,rto:0,payment:0,marketing:0}));});
const id="a10000000000000000000001";
function checkout(options={}){
 const saved=[];const queries=[];const p={_id:id,title:"Kiddio Pencil Pouch",slug:"pouch",price:499,images:["/images/pouch.webp"],variants:[],isCodAvailable:true};
 const api=load("src/modules/checkout/actions/create-order.ts",{
 "@/lib/auth":{auth:async()=>options.unauthorized?null:{user:{id:"a20000000000000000000001"}}},
 "@/lib/db":{connectToDatabase:async()=>{}},
 "@/lib/store-config":{getStoreConfig:async()=>({checkoutEnabled:!options.closed,codEnabled:true,shippingFee:70,codFee:20,serviceablePincodes:["411001"]})},
 "@/modules/products/models/product.model":{find:q=>{queries.push(q);return {lean:async()=>options.unavailable?[]:[p]};}},
 "@/modules/orders/models/order.model":{findOne:async()=>options.existing?{_id:"existing",orderNumber:"KD-EXISTING"}:null,create:async data=>{saved.push(data);return {...data,_id:"new"};}},
 "../validation":validation,"@/modules/products/public-product":dto
 });return {api,saved,queries};
}
function payload(extra={}){return {items:[{productId:id,quantity:2,price:1,title:"Injected",supplier:"PRIVATE_SENTINEL"}],paymentMethod:"cod",requestKey:"12345678-1234-4234-8234-123456789abc",expectedTotal:1088,acceptedTerms:true,shippingAddress:{fullName:"Test Parent",phone:"9876543210",house:"Flat 2",street:"Test Road",city:"Pune",district:"Pune",state:"Maharashtra",pincode:"411001"},...extra};}
test("Checkout ignores client price and title; uses approved server products",async()=>{const x=checkout();const r=await x.api.createOrder(payload());assert.equal(r.success,true);assert.equal(x.saved[0].totals.total,1088);assert.equal(x.saved[0].items[0].title,"Kiddio Pencil Pouch");assert.equal(x.saved[0].shippingAddress.country,"India");assert.equal(x.queries[0].publicationApproved,true);assert(!JSON.stringify(r).includes("supplier"));});
test("Unknown or unpublished products fail without creating an order",async()=>{const x=checkout({unavailable:true});assert.equal((await x.api.createOrder(payload())).success,false);assert.equal(x.saved.length,0);});
test("Anonymous checkout and closed checkout fail closed",async()=>{for(const opts of [{unauthorized:true},{closed:true}]){const x=checkout(opts);assert.equal((await x.api.createOrder(payload())).success,false);assert.equal(x.saved.length,0);}});
test("A changed total requires customer review",async()=>{const x=checkout();assert.equal((await x.api.createOrder(payload({expectedTotal:100}))).success,false);assert.equal(x.saved.length,0);});
test("Unsupported pincode, variant and online payment are rejected",async()=>{for(const p of [payload({items:[{productId:id,quantity:1,variant:"invented"}]}),payload({paymentMethod:"online"}),payload({shippingAddress:{...payload().shippingAddress,pincode:"999999"}})]){const x=checkout();assert.equal((await x.api.createOrder(p)).success,false);assert.equal(x.saved.length,0);}});
test("Duplicate item rows cannot exceed the per-product limit",async()=>{const x=checkout();const r=await x.api.quoteOrder([{productId:id,quantity:10},{productId:id,quantity:10}],"411001");assert.equal(r.success,false);});
test("Idempotent replay returns only the existing customer's order",async()=>{const x=checkout({existing:true});const r=await x.api.createOrder(payload());assert.equal(r.orderId,"existing");assert.equal(x.saved.length,0);});
test("Preset admin email does not create an admin or bypass a missing user",async()=>{let config;load("src/lib/auth.ts",{"next-auth":c=>{config=c;return{};},"next-auth/providers/credentials":c=>c,"@/lib/db":{connectToDatabase:async()=>{}},"@/modules/auth/models/user.model":{findOne:()=>({select:async()=>null})}});assert.equal(await config.providers[0].authorize({email:"admin@kiddio.com",password:"admin123"}),null);});
test("A stale admin token cannot bypass database role checks",async()=>{const r=load("src/lib/require-admin.ts",{"server-only":{},"@/lib/auth":{auth:async()=>({user:{id,role:"admin"}})},"@/lib/db":{connectToDatabase:async()=>{}},"@/modules/auth/models/user.model":{findOne:async()=>null}});await assert.rejects(r.requireAdmin,/Unauthorized/);});
test("Private candidate dataset has all 16 scores and truthful evidence status",{skip:!fs.existsSync(path.join(__dirname,"../private/research-candidates.json"))},()=>{const data=JSON.parse(fs.readFileSync(path.join(__dirname,"../private/research-candidates.json")));assert.equal(data.candidates.length,24);assert.equal(data.criteria.length,16);for(const c of data.candidates){assert.equal(Object.keys(c.scores).length,16);assert.equal(c.publicationApproved,false);assert(c.supplier.supplierPrice>0);assert(c.supplier.priceBasis);assert(!/meesho|supplier|BPA|non-toxic/i.test(c.description));}assert.equal(data.candidates.find(c=>c.supplier.supplierProductCode==="hauuso").decision,"rejected");});

test("Release catalog has reviewed local images and private-only sourcing",{skip:!fs.existsSync(path.join(__dirname,"../private/catalog-release.json"))},()=>{const data=JSON.parse(fs.readFileSync(path.join(__dirname,"../private/catalog-release.json"),"utf8"));assert.equal(data.candidates.length,16);const slugs=new Set();for(const r of data.candidates){assert(!slugs.has(r.slug));slugs.add(r.slug);assert.equal(Object.keys(r.commercialScores).length,15);assert(r.estimatedMargin>=20);assert(r.publicationApproved);const publicData=dto.toPublicProduct({...r,_id:r.productId,price:r.retailPrice,category:{name:r.category,slug:r.category}});assert(!/supplier|meesho|costPrice|profit|margin|internalNotes/i.test(JSON.stringify(publicData)));for(const image of publicData.images)assert(fs.existsSync(path.join(__dirname,'../public',image)));}assert(!data.candidates.some(r=>['KD-R019','KD-R029'].includes(r.researchId)));});
