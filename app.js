// Reemplaza estos dos datos con la información oficial de Vitabars.
const CONFIG = {
  whatsapp: '51947227596',
  culqiPaymentLink: 'https://express.culqi.com/pago/F7BA793F86'
};

const products = [
  {id:1,name:'Sal de Maras & Chocolate',desc:'Barra proteica Plant-Based · 10 g proteína vegetal',price:13.50,color:'#d77b86',bg:'#f5e4e6',badge:'PLANT-BASED',category:'proteina',image:'saldemaras_y_chocolate.png'},
  {id:2,name:'Menta & Chocolate',desc:'Barra proteica ISO Whey · 12 g de proteína',price:13.50,color:'#7baa84',bg:'#e3f0df',badge:'ISO WHEY',category:'whey',image:'menta_y_chocolate.png'},
  {id:3,name:'Maca, Lúcuma & Cacao',desc:'Barra nutricional Superfoods · 10 g proteína vegetal',price:12.50,color:'#986941',bg:'#f3dfce',badge:'SUPERFOODS',category:'superfoods',image:'maca_lucuma_y_cacao.png'},
  {id:4,name:'Mini Lúcuma & Maní',desc:'Barra mini proteica · 7 g de proteína vegetal',price:8.50,color:'#79513d',bg:'#eadde0',badge:'FORMATO MINI',category:'proteina',image:'lucuma_y_mani.png'},
  {id:5,name:'Cacao & Cashew',desc:'Barra proteica Plant-Based · 10 g proteína vegetal',price:13.50,color:'#71815c',bg:'#e4ead7',badge:'PLANT-BASED',category:'proteina',image:'cacao_y_cashew.png'},
  {id:6,name:'Lúcuma & Maní',desc:'Barra proteica ISO Whey · formato 73 g',price:13.50,color:'#c1b566',bg:'#f1edcf',badge:'ISO WHEY',category:'whey',image:'lucuma_y_mani_73gr.png'}
];

let cart = JSON.parse(localStorage.getItem('vitabars_cart') || '[]');
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const money = n => `S/ ${n.toFixed(2)}`;
const subtotalValue = () => cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
const orderTotals = () => {
  const subtotal=subtotalValue();
  const wantsDelivery=$('#delivery-toggle')?.checked || false;
  const delivery=wantsDelivery && subtotal<100 ? 10 : 0;
  return {subtotal,delivery,total:subtotal+delivery,wantsDelivery};
};

function renderProducts(filter='todos'){
  const list=filter==='todos'?products:products.filter(p=>p.category===filter);
  $('#product-grid').innerHTML=list.map(p=>`<article class="product-card">
    <div class="product-image" style="background:${p.bg}"><span class="product-badge">${p.badge}</span><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
    <div class="product-info"><div class="product-top"><h3>${p.name}</h3><strong>${money(p.price)}</strong></div><p>${p.desc}</p><button class="add-btn" data-id="${p.id}">Agregar al carrito</button></div>
  </article>`).join('');
  $$('.add-btn').forEach(b=>b.addEventListener('click',()=>addToCart(+b.dataset.id)));
}

function addToCart(id){
  const found=cart.find(i=>i.id===id); found?found.qty++:cart.push({id,qty:1}); saveCart(); showToast('Agregado al carrito ✦');
}
function saveCart(){localStorage.setItem('vitabars_cart',JSON.stringify(cart));renderCart()}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0); $('.cart-count').textContent=count;
  const empty=$('.empty-cart'),summary=$('.cart-summary'),holder=$('.cart-items');
  if(!count){holder.innerHTML='';empty.hidden=false;summary.hidden=true;return}
  empty.hidden=true;summary.hidden=false;
  holder.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-item"><div class="cart-thumb" style="background:${p.color}">VITABARS</div><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button data-action="minus" data-id="${p.id}">−</button><span>${item.qty}</span><button data-action="plus" data-id="${p.id}">+</button></div></div><div><button class="remove" data-action="remove" data-id="${p.id}">Quitar</button></div></div>`}).join('');
  updateTotals();
  $$('[data-action]',holder).forEach(b=>b.onclick=()=>changeQty(+b.dataset.id,b.dataset.action));
}
function updateTotals(){
  const {subtotal,delivery,total,wantsDelivery}=orderTotals();
  $('.subtotal').textContent=money(subtotal);
  $('.delivery-cost').textContent=wantsDelivery?(delivery?money(delivery):'GRATIS'):'S/ 0.00';
  $('.cart-total').textContent=money(total);
  $('.payment-total').textContent=money(total);
}
function changeQty(id,action){const item=cart.find(i=>i.id===id);if(action==='plus')item.qty++;if(action==='minus')item.qty--;if(action==='remove'||item.qty<=0)cart=cart.filter(i=>i.id!==id);saveCart()}
function openPanel(el){$('.overlay').hidden=false;el.classList.add('open');el.setAttribute('aria-hidden','false')}
function closePanels(){$('.overlay').hidden=true;$$('.drawer,.modal').forEach(el=>{el.classList.remove('open');el.setAttribute('aria-hidden','true')})}
function cartText(){const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${i.qty} × ${p.name} (${money(p.price*i.qty)})`});const {subtotal,delivery,total,wantsDelivery}=orderTotals();const deliveryText=wantsDelivery?(delivery?money(delivery):'GRATIS'):'Recojo / sin delivery';return `Hola Vitabars 👋 Quiero hacer este pedido:\n\n${lines.join('\n')}\n\nSubtotal: ${money(subtotal)}\nDelivery: ${deliveryText}\nTOTAL: ${money(total)}\n\n¿Me ayudan a confirmar el pedido?`}
function openWhatsapp(message='Hola Vitabars 👋 Quisiera conocer sus productos y hacer un pedido.'){
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener');
}
function showToast(msg){const t=$('.toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2500)}

renderProducts();renderCart();
$$('.filter').forEach(btn=>btn.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');renderProducts(btn.dataset.filter)});
$('.cart-trigger').onclick=()=>openPanel($('.cart-drawer'));
$('.user-trigger').onclick=()=>openPanel($('.auth-modal'));
$('.menu-btn').onclick=()=>{$('nav').classList.toggle('mobile-open');$('.menu-btn').textContent=$('nav').classList.contains('mobile-open')?'×':'☰'};
$$('nav a').forEach(link=>link.onclick=()=>{$('nav').classList.remove('mobile-open');$('.menu-btn').textContent='☰'});
$$('.close-drawer,.modal-close').forEach(b=>b.onclick=closePanels);$('.overlay').onclick=closePanels;
$$('.whatsapp-general').forEach(a=>a.onclick=e=>{e.preventDefault();openWhatsapp()});
$('.checkout-whatsapp').onclick=()=>openWhatsapp(cartText());
$('#delivery-toggle').onchange=updateTotals;
$('.checkout-online').onclick=()=>{updateTotals();closePanels();openPanel($('.payment-modal'))};
$('.copy-total').onclick=async()=>{const total=orderTotals().total.toFixed(2);try{await navigator.clipboard.writeText(total);showToast(`Monto S/ ${total} copiado`)}catch{showToast(`Monto a pagar: S/ ${total}`)}};
$$('.payment-options button').forEach(btn=>btn.onclick=()=>{
  window.open(CONFIG.culqiPaymentLink,'_blank','noopener');
});
$('.auth-form').onsubmit=e=>{e.preventDefault();const email=$('#auth-email').value;localStorage.setItem('vitabars_user',email);closePanels();showToast(`¡Hola, ${email.split('@')[0]}! Sesión iniciada`);$('.user-trigger').style.background='var(--lime)'};
$('.auth-switch button').onclick=()=>{const title=$('#auth-title');const isLogin=title.textContent.includes('favoritos');title.textContent=isLogin?'Crea tu cuenta Vitabars.':'Tu cuenta, tus favoritos.';$('.auth-form button').textContent=isLogin?'Crear mi cuenta':'Ingresar'};
$('.newsletter').onsubmit=e=>{e.preventDefault();e.target.reset();showToast('¡Gracias! Ya estás en la lista ✦')};
if(localStorage.getItem('vitabars_user')) $('.user-trigger').style.background='var(--lime)';
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanels()});
