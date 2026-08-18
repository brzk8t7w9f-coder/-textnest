
const screens = [...document.querySelectorAll('.screen')];
const openScreen = id => {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({top:0, behavior:'smooth'});
};
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click',()=>openScreen(b.dataset.open)));
document.querySelectorAll('.back').forEach(b=>b.addEventListener('click',()=>openScreen('home')));

const dialpad = document.getElementById('dialpad');
'123456789*0#'.split('').forEach(n=>{
  const b=document.createElement('button'); b.textContent=n;
  b.onclick=()=>document.getElementById('callNumber').value += n;
  dialpad.appendChild(b);
});
document.getElementById('callBtn').onclick=()=>{
  const n=document.getElementById('callNumber').value.trim();
  if(!n) return alert('Enter a phone number first.');
  location.href='tel:'+encodeURIComponent(n);
};
document.getElementById('textBtn').onclick=()=>{
  const n=document.getElementById('textNumber').value.trim();
  const body=document.getElementById('textBody').value.trim();
  if(!n) return alert('Enter a phone number first.');
  location.href='sms:'+encodeURIComponent(n)+(body?'&body='+encodeURIComponent(body):'');
};

let contacts = JSON.parse(localStorage.getItem('textnest_contacts')||'[]');
const saveContacts=()=>localStorage.setItem('textnest_contacts',JSON.stringify(contacts));
function renderContacts(){
  const box=document.getElementById('contactList'); box.innerHTML='';
  if(!contacts.length) box.innerHTML='<p class="note">No contacts saved yet.</p>';
  contacts.forEach((c,i)=>{
    const row=document.createElement('div'); row.className='row';
    row.innerHTML=`<div class="meta"><b>${escapeHtml(c.name)} ${c.favorite?'⭐':''}</b><small>${escapeHtml(c.phone)}</small></div>
      <div class="actions">
        <button class="icon-btn" aria-label="Call">📞</button>
        <button class="icon-btn" aria-label="Text">💬</button>
        <button class="icon-btn" aria-label="Delete">🗑️</button>
      </div>`;
    const btns=row.querySelectorAll('button');
    btns[0].onclick=()=>location.href='tel:'+encodeURIComponent(c.phone);
    btns[1].onclick=()=>location.href='sms:'+encodeURIComponent(c.phone);
    btns[2].onclick=()=>{contacts.splice(i,1);saveContacts();renderContacts();renderFavorites();};
    box.appendChild(row);
  });
}
function renderFavorites(){
  const box=document.getElementById('favoriteList'); box.innerHTML='';
  const fav=contacts.filter(c=>c.favorite);
  if(!fav.length) box.innerHTML='<p class="note">Star a contact to see them here.</p>';
  fav.forEach(c=>{
    const row=document.createElement('div'); row.className='row';
    row.innerHTML=`<div class="meta"><b>${escapeHtml(c.name)} ⭐</b><small>${escapeHtml(c.phone)}</small></div>
      <div class="actions"><button class="icon-btn">📞</button><button class="icon-btn">💬</button></div>`;
    const btns=row.querySelectorAll('button');
    btns[0].onclick=()=>location.href='tel:'+encodeURIComponent(c.phone);
    btns[1].onclick=()=>location.href='sms:'+encodeURIComponent(c.phone);
    box.appendChild(row);
  });
}
document.getElementById('saveContact').onclick=()=>{
  const name=document.getElementById('contactName').value.trim();
  const phone=document.getElementById('contactPhone').value.trim();
  const favorite=document.getElementById('contactFavorite').checked;
  if(!name||!phone) return alert('Enter a name and phone number.');
  contacts.push({name,phone,favorite}); saveContacts(); renderContacts(); renderFavorites();
  document.getElementById('contactName').value=''; document.getElementById('contactPhone').value=''; document.getElementById('contactFavorite').checked=false;
};
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

const tones=[
  {name:'Nest Bell', file:'nest-bell.wav'},
  {name:'Soft Chime', file:'soft-chime.wav'},
  {name:'Happy Pop', file:'happy-pop.wav'},
  {name:'Classic Ring', file:'classic-ring.wav'}
];
let selected=localStorage.getItem('textnest_tone')||'Nest Bell';
document.getElementById('selectedTone').textContent=selected;
const toneBox=document.getElementById('ringtoneList');
tones.forEach(t=>{
  const row=document.createElement('div'); row.className='row';
  row.innerHTML=`<button class="tone-btn"><b>${t.name}</b><small>Tap to preview</small></button><button class="icon-btn">✓</button>`;
  row.querySelector('.tone-btn').onclick=()=>{new Audio(t.file).play();};
  row.querySelector('.icon-btn').onclick=()=>{selected=t.name;localStorage.setItem('textnest_tone',selected);document.getElementById('selectedTone').textContent=selected;};
  toneBox.appendChild(row);
});

const btStatus=document.getElementById('btStatus'), btBtn=document.getElementById('btBtn');
if ('bluetooth' in navigator) btStatus.textContent='Bluetooth browser access is available on this device.';
else btStatus.textContent='Direct Bluetooth access is not available in this browser. Use iPhone/iPad Bluetooth Settings for call audio.';
btBtn.onclick=async()=>{
  if(!('bluetooth' in navigator)) return alert('Open Settings > Bluetooth on your iPhone/iPad to connect your headset, speaker, or vehicle.');
  try{
    const device=await navigator.bluetooth.requestDevice({acceptAllDevices:true});
    btStatus.textContent='Selected: '+(device.name||'Bluetooth device');
  }catch(e){btStatus.textContent='No device selected.'}
};

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}
renderContacts(); renderFavorites();
