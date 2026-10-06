const fs=require('fs');const sharp=require('sharp');
const crops={
'pouch-grey':[24,24,464,464],'pouch-black':[24,24,464,464],
'brush-blue':[0,65,512,445],'bath-kit':[0,0,512,480],
'penguin':[0,0,512,500],'rope-caddy':[0,0,512,475],
'green-set':[0,0,512,740],'lavender-set':[0,0,512,735],'short-set':[0,0,512,800],
'kurta-set':[0,0,512,730],'travel-kit':[0,0,512,480],
'letters-stencil':[0,0,512,497],'shapes-stencil':[0,0,512,975],
'pouch-gradient':[0,0,512,475],'washcloth-muslin':[0,0,512,660],
'washcloth-pastel':[0,0,512,598],'bib-trio':[0,0,512,525],
'peach-caddy':[155,154,270,205]
};
(async()=>{fs.mkdirSync('public/images/catalog',{recursive:true});for(const [name,[left,top,width,height]]of Object.entries(crops)){await sharp('private/assets/'+name+'.webp').extract({left,top,width,height}).webp({quality:90}).toFile('public/images/catalog/kiddio-'+name+'.webp');}fs.writeFileSync('private/approved-image-crops.json',JSON.stringify({authorization:'User approved cropping only borders and sourcing codes; no product retouching.',crops},null,2));console.log('Prepared '+Object.keys(crops).length+' photographs');})();
