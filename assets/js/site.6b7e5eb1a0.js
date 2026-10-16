(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('#site-menu'),toggle=$('[data-menu-toggle]');
function closeMenu(){if(menu)menu.dataset.open='false';if(toggle)toggle.setAttribute('aria-expanded','false')}
toggle?.addEventListener('click',()=>{const open=menu.dataset.open!=='true';menu.dataset.open=String(open);toggle.setAttribute('aria-expanded',String(open))});
menu?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(menu?.dataset.open==='true'&&!e.target.closest('.site-header'))closeMenu()});

// Rehberler HTML içinde bulunur; JavaScript yalnızca görünen sonuçları süzer.
const search=$('#guide-search'),cards=$$('[data-guide]'),groups=$$('[data-guide-group]');
let category='Tümü';
const normalize=v=>v.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
function filterGuides(){const words=normalize(search?.value||'').trim().split(/\s+/).filter(Boolean);let total=0;
cards.forEach(c=>{const matches=(category==='Tümü'||c.dataset.category===category)&&words.every(w=>normalize(c.dataset.search).includes(w));c.hidden=!matches;if(matches)total++});
groups.forEach(g=>g.hidden=!$('[data-guide]:not([hidden])',g));
if($('#results-count'))$('#results-count').textContent=total+' rehber bulundu.';
if($('#no-results'))$('#no-results').hidden=total!==0;
}
if(search){search.value=new URLSearchParams(location.search).get('q')||'';filterGuides();search.addEventListener('input',filterGuides);
$('#guide-search-form')?.addEventListener('submit',e=>{e.preventDefault();filterGuides();$('#results-count')?.scrollIntoView({block:'nearest',behavior:'smooth'})});
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;$$('[data-category]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));filterGuides()}));}

// Galeri yalnızca tıklanınca büyük görseli yükler; native dialog klavye odağını korur.
const dialog=$('#gallery-dialog');
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{if(!dialog?.showModal)return;const img=$('#gallery-image');img.src=b.dataset.gallery;img.alt=b.dataset.caption;$('#gallery-caption').textContent=b.dataset.caption;dialog.showModal()}));
$('[data-close-gallery]')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

// İzin verilmeden Google ölçüm betiği indirilmez. Tek yükleyici iki mevcut kimliği kurar.
const consentKey='nazar-consent-v1',analyticsId='G-2JPQCH1B8C',adsId='AW-18151184267';
let consent=null,loaded=false;
try{consent=localStorage.getItem(consentKey)}catch{}
const banner=$('#cookie-banner');
function loadMeasurement(){if(loaded||consent!=='accepted')return;loaded=true;window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
gtag('js',new Date());
const pageURL=new URL(location.href);pageURL.searchParams.delete('q');pageURL.hash='';
gtag('config',analyticsId,{page_location:pageURL.toString()});gtag('config',adsId);
const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+analyticsId;document.head.append(tag);
}
function setConsent(next){consent=next;try{localStorage.setItem(consentKey,next)}catch{}
if(banner)banner.hidden=true;
if(next==='accepted'){if(loaded&&typeof window.gtag==='function')gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});loadMeasurement()}
else if(loaded&&typeof window.gtag==='function'){gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}
if(next!=='accepted'){
document.cookie.split(';').forEach(entry=>{const name=entry.split('=')[0].trim();if(/^(_ga|_gcl|_gid)/.test(name)){for(const domain of ['',location.hostname,'.'+location.hostname])document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'')}});
}}
if(banner)banner.hidden=consent==='accepted'||consent==='rejected';
$$('[data-consent]').forEach(b=>b.addEventListener('click',()=>b.dataset.consent==='open'?(banner.hidden=false):setConsent(b.dataset.consent)));
if(consent==='accepted'){if('requestIdleCallback'in window)requestIdleCallback(loadMeasurement,{timeout:2000});else setTimeout(loadMeasurement,1000)}
function track(name,extra={}){if(consent!=='accepted')return;loadMeasurement();if(typeof window.gtag==='function')gtag('event',name,{send_to:analyticsId,page_path:location.pathname,transport_type:'beacon',...extra})}
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const h=a.getAttribute('href');
if(h.startsWith('tel:')){track('phone_click');if(consent==='accepted'&&typeof window.gtag==='function')gtag('event','conversion',{send_to:adsId+'/cIXbCM_dtascEIuvlM9D',value:1,currency:'TRY',transport_type:'beacon'})}
else if(h.startsWith('https://wa.me/')){track('whatsapp_click');track('ads_conversion_Ki_i_1',{contact_method:'whatsapp_link',value:1,currency:'TRY'})}
});

// Form bir taslak açar; mesajı kullanıcı WhatsApp içinde gönderir. Kişisel bilgiler ölçüme eklenmez.
$$('[data-whatsapp-form]').forEach(form=>{form.querySelectorAll('[disabled]').forEach(el=>el.disabled=false);form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
const name=form.elements.namedItem('name').value.trim(),phone=form.elements.namedItem('phone').value.trim(),subject=form.elements.namedItem('subject').value;
const msg='Merhaba, adım '+name+'. Telefonum: '+phone+'. '+subject+'. Görüşme hakkında bilgi almak istiyorum.';
track('whatsapp_form_submit',{form_id:form.id});track('ads_conversion_Ki_i_1',{contact_method:'whatsapp_form',value:1,currency:'TRY'});
const opened=window.open('https://wa.me/905063284956?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer');
const status=$('[data-form-status]',form);if(status){status.hidden=false;status.textContent='WhatsApp mesaj taslağınızı açın. Talebiniz, mesajı WhatsApp’ta gönderdiğinizde bize ulaşır.';
const link=document.createElement('a');link.href='https://wa.me/905063284956?text='+encodeURIComponent(msg);link.target='_blank';link.rel='noopener noreferrer nofollow';link.textContent=' Taslağı aç';status.append(link);}
})});
})();
