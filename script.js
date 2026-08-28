const toggle=document.querySelector('[data-menu-toggle]');
const nav=document.querySelector('[data-nav]');
if(toggle&&nav){
  toggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

async function hydrateBase64Images(){
  const images=[...document.querySelectorAll('img[data-b64-parts]')];
  await Promise.all(images.map(async img=>{
    try{
      const parts=img.dataset.b64Parts.split(',').map(x=>x.trim()).filter(Boolean);
      const chunks=await Promise.all(parts.map(async path=>{
        const response=await fetch(path);
        if(!response.ok) throw new Error(`Unable to load ${path}`);
        return (await response.text()).trim();
      }));
      img.src=`data:${img.dataset.mime||'image/webp'};base64,${chunks.join('')}`;
    }catch(error){
      console.warn('Image asset could not be hydrated',error);
    }
  }));
}
hydrateBase64Images();
