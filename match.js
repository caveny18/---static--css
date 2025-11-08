/* match.js
 - Demo de match financiero con swipe real, 10 usuarios falsos,
 - guarda matches en localStorage bajo 'kuyana_matches' (array de apodos)
 - cuando hay 'match' (simulado con probability or pre-seeded likedBack),
   aparece modal y se guarda la pareja en 'kuyana_matches_pairs'
*/

// ===== Datos de ejemplo (10 usuarios) =====
const users = [
  { id: 'u1', apodo: 'Doña Mary', rubro: 'Bodega', ubic: 'Lima', junt: 3, photo: 'https://images.unsplash.com/photo-1604908554022-9f2f1f0b0f3b?q=80&w=800&auto=format&fit=crop&crop=faces'},
  { id: 'u2', apodo: 'Ferretería López', rubro: 'Ferretería', ubic: 'Trujillo', junt: 0, photo: 'https://images.unsplash.com/photo-1565372912506-3e1b6f2898f2?q=80&w=800&auto=format&fit=crop'},
  { id: 'u3', apodo: 'El Chato', rubro: 'Barbería', ubic: 'Cusco', junt: 1, photo: 'https://images.unsplash.com/photo-1531538511378-9f7a2f1b0b48?q=80&w=800&auto=format&fit=crop'},
  { id: 'u4', apodo: 'Panadería Los Trigales', rubro: 'Panadería', ubic: 'Arequipa', junt: 5, photo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop'},
  { id: 'u5', apodo: 'Boutique Estilo', rubro: 'Comercio', ubic: 'Lima', junt: 0, photo: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'},
  { id: 'u6', apodo: 'Todo a S/1', rubro: 'Comercio', ubic: 'Puno', junt: 2, photo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'},
  { id: 'u7', apodo: 'Artesanías Qori Wasi', rubro: 'Artesanía', ubic: 'Ayacucho', junt: 4, photo: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop'},
  { id: 'u8', apodo: 'Mercado Central', rubro: 'Comercio', ubic: 'Lima', junt: 7, photo: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop'},
  { id: 'u9', apodo: 'Taller El Fuerte', rubro: 'Taller', ubic: 'Arequipa', junt: 1, photo: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop'},
  { id: 'u10', apodo: 'Pan y Café', rubro: 'Panadería', ubic: 'Piura', junt: 6, photo: 'https://images.unsplash.com/photo-1498654209846-7a4f0f4e9b5f?q=80&w=800&auto=format&fit=crop'},
];

// storage keys
const MATCH_KEY = 'kuyana_matches';       // array of ids user liked + matched pairs stored separately
const MATCH_PAIRS = 'kuyana_matches_pairs'; // array of {you: 'me', them: 'uX'}

let deck = document.getElementById('deck');
let currentIndex = 0;

// load previously liked by this user (so we can avoid duplicates)
let likedList = JSON.parse(localStorage.getItem(MATCH_KEY) || '[]');
let pairs = JSON.parse(localStorage.getItem(MATCH_PAIRS) || '[]');

// helper to create a card element
function makeCard(u){
  const el = document.createElement('article');
  el.className = 'card';
  el.dataset.id = u.id;
  el.innerHTML = `
    <div class="indicator like" style="left:20px">ME GUSTA</div>
    <div class="indicator no" style="right:20px">NO</div>
    <img src="${u.photo}" alt="${u.apodo}">
    <div class="meta">
      <div>
        <h3>${u.apodo}</h3>
        <p>${u.rubro} • ${u.ubic}</p>
        <div class="badges"><span class="badge">${u.junt} juntas</span></div>
      </div>
      <div style="text-align:right;font-size:0.85rem;color:#4b6b73">Distancia: ~${Math.floor(Math.random()*8)+1} km</div>
    </div>
  `;
  initDrag(el);
  return el;
}

// render initial stack (last users on bottom)
function renderStack(){
  deck.innerHTML = '';
  for(let i = users.length-1; i>=0; i--){
    deck.appendChild(makeCard(users[i]));
  }
}
renderStack();

// DRAG / SWIPE logic (mouse + touch)
function initDrag(card){
  let startX=0,startY=0,offsetX=0,offsetY=0,dragging=false;

  function transform(x,y,rot,scale){
    card.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg) scale(${scale})`;
    // indicators
    const like = card.querySelector('.indicator.like');
    const no = card.querySelector('.indicator.no');
    const opacity = Math.min(Math.abs(x)/120,1);
    if(x>0){ like.style.opacity = opacity; no.style.opacity = 0; } else { no.style.opacity = opacity; like.style.opacity = 0; }
  }

  function start(e){
    dragging=true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    card.style.transition = 'none';
  }

  function move(e){
    if(!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
    offsetX = x; offsetY = y;
    const rot = x / 12;
    const scale = 1 - Math.min(Math.abs(x)/1200, 0.06);
    transform(x,y,rot,scale);
  }

  function end(){
    if(!dragging) return;
    dragging=false;
    card.style.transition = 'transform .35s cubic-bezier(.22,.9,.35,1)';
    // decide
    if(offsetX > 140){
      // like
      animateOut(card, 1000, offsetY, true);
      handleLike(card.dataset.id);
    } else if(offsetX < -140){
      // no
      animateOut(card, -1000, offsetY, false);
      nextCard();
    } else {
      // reset
      transform(0,0,0,1);
      card.querySelectorAll('.indicator').forEach(i=>i.style.opacity=0);
    }
    offsetX = 0; offsetY = 0;
  }

  card.addEventListener('mousedown', start);
  card.addEventListener('touchstart', start);
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('mouseup', end);
  window.addEventListener('touchend', end);

  // double click / tap for quick like
  card.addEventListener('dblclick', ()=>{ animateOut(card,1000,0,true); handleLike(card.dataset.id); });
}

function animateOut(card, x, y, liked){
  card.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${liked?15:-15}deg) scale(.95)`;
  card.style.opacity = '0';
  setTimeout(()=>{ if(card.parentNode) card.parentNode.removeChild(card); }, 420);
}

// advance to next card if user taps buttons
function nextCard(){
  // remove topmost DOM card if present
  const top = deck.querySelector('.card:last-child');
  if(top) top.remove();
}

// ====== Actions: like, dislike, info ======
function handleLike(id){
  if(likedList.includes(id)) {
    // already liked before
  } else {
    likedList.push(id);
    localStorage.setItem(MATCH_KEY, JSON.stringify(likedList));
  }

  // simulate reciprocity: some users are already "open" (pre-seeded)
  // We'll set a small probability or predefine a set of users who 'like back'
  const likedBackProbability = 0.35; // 35% chance they like you back (demo)
  const likedBack = Math.random() < likedBackProbability;

  if(likedBack){
    // create pair record
    pairs.push({ you: 'me', them: id, at: Date.now() });
    localStorage.setItem(MATCH_PAIRS, JSON.stringify(pairs));
    showMatchModal(id);
  } else {
    // continue to next card
    nextCard();
  }
}

// show modal when match happens
function showMatchModal(id){
  const u = users.find(x => x.id === id);
  document.getElementById('matchText').textContent = `¡Tienes match con ${u.apodo} (${u.rubro}) — ${u.ubic}!`;
  document.getElementById('matchModal').classList.remove('hidden');
  // hook buttons
  document.getElementById('closeModal').onclick = () => {
    document.getElementById('matchModal').classList.add('hidden');
    nextCard();
  };
  document.getElementById('goChat').onclick = () => {
    // placeholder: in prod abrir chat o la página de contacto
    alert(`Abrir chat / contacto con ${u.apodo} (simulado).`);
    document.getElementById('matchModal').classList.add('hidden');
    nextCard();
  };
}

// button handlers
document.getElementById('btnYes').addEventListener('click', ()=> {
  const top = deck.querySelector('.card:last-child');
  if(!top) return;
  animateOut(top, 1000, 0, true);
  handleLike(top.dataset.id);
});
document.getElementById('btnNo').addEventListener('click', ()=> {
  const top = deck.querySelector('.card:last-child');
  if(!top) return;
  animateOut(top, -1000, 0, false);
  nextCard();
});
document.getElementById('btnInfo').addEventListener('click', ()=> {
  const top = deck.querySelector('.card:last-child');
  if(!top) return;
  const u = users.find(x=>x.id === top.dataset.id);
  alert(`${u.apodo}\n\n${u.rubro} • ${u.ubic}\n${u.junt} juntas completadas\n\nDescripción: Emprendimiento local con buena reputación.`);
});

// keyboard support: ← = no, → = yes, space = info
window.addEventListener('keydown', (e)=> {
  if(e.key === 'ArrowLeft') document.getElementById('btnNo').click();
  if(e.key === 'ArrowRight') document.getElementById('btnYes').click();
  if(e.key === ' ') { e.preventDefault(); document.getElementById('btnInfo').click(); }
});

// initial quick hint
setTimeout(()=>{ if(confirm('Demo: quieres ver cómo funciona el swipe? Pulsa OK para ver una guía rápida.')) alert('Desliza la tarjeta a la derecha para dar "me gusta", a la izquierda para pasar. También usa los botones.'); },400);

// end
