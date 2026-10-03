// Estado de la carta y el carrito.
let activeCategory = 'Todos';
let cart = {};
let menuQuantities = {};
let searchTerm = '';
let receiptNumber = '';
let receiptReady = false;
let receiptDownloaded = false;
let receiptMode = 'whatsapp';

const DELIVERY_TAPER_PRICE = 1;
const FULL_CHICKEN_NAME = 'Pollo Entero a la Brasa';

const money = (amount) => `S/ ${amount.toFixed(2)}`;

function refreshIcons() {
  lucide.createIcons();
}

// Carta
function setCategory(category) {
  activeCategory = category;
  renderFilters();
  renderProducts();
}

function renderFilters() {
  const filters = categories.map((category) => {
    const isActive = category === activeCategory ? 'active' : '';

    return `
      <button class="filter ${isActive}" onclick="setCategory('${category}')">
        ${category}
      </button>
    `;
  });

  document.getElementById('filters').innerHTML = filters.join('');
}

function renderProducts() {
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
    const searchableText = `${product.name} ${product.description} ${product.category}`
      .toLocaleLowerCase('es-PE');

    return matchesCategory && searchableText.includes(searchTerm);
  });
  const productGrid = document.getElementById('productGrid');
  const menuResultCount = document.getElementById('menuResultCount');

  menuResultCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'plato disponible' : 'platos disponibles'}`;

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="no-results">No encontramos un plato con esa busqueda. Prueba con otro nombre o categoria.</p>';
    return;
  }

  productGrid.innerHTML = visibleProducts.map(renderProductCard).join('');
  refreshIcons();
}

function renderProductCard(product) {
  const selectedQuantity = menuQuantities[product.id] || 1;

  return `
    <article class="dish">
      <div class="dish-img">
        <div class="dish-image-placeholder" aria-hidden="true">
          <i data-lucide="image" size="26"></i>
          <span>Foto del plato</span>
        </div>
        <img src="${product.image}" alt="Foto de ${product.name}" loading="lazy" decoding="async" onerror="this.remove()">
      </div>
      <div class="dish-cat">${product.category}</div>
      <div class="dish-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="dish-footer">
          <span class="price">${money(product.price)}</span>
          <div class="menu-quantity">
            <button onclick="changeMenuQty(${product.id}, -1)" aria-label="Restar una unidad de ${product.name}">
              <i data-lucide="minus" size="14"></i>
            </button>
            <span>${selectedQuantity}</span>
            <button onclick="changeMenuQty(${product.id}, 1)" aria-label="Sumar una unidad de ${product.name}">
              <i data-lucide="plus" size="14"></i>
            </button>
          </div>
          <button class="add" onclick="addToCart(${product.id})" aria-label="Agregar ${product.name}">
            <i data-lucide="shopping-bag" size="15"></i>Agregar
          </button>
        </div>
      </div>
    </article>
  `;
}

function setMenuSearch(value) {
  searchTerm = value.trim().toLocaleLowerCase('es-PE');
  renderProducts();
}

function changeMenuQty(productId, change) {
  const currentQuantity = menuQuantities[productId] || 1;
  menuQuantities[productId] = Math.max(1, currentQuantity + change);
  renderProducts();
}

// Carrito
function addToCart(productId) {
  const selectedQuantity = menuQuantities[productId] || 1;
  cart[productId] = (cart[productId] || 0) + selectedQuantity;
  menuQuantities[productId] = 1;
  announce(`${products[productId].name} fue agregado al carrito.`);

  renderProducts();
  renderCart();
}

function announce(message) {
  document.getElementById('cartAnnouncement').textContent = message;
}

function changeQty(productId, change) {
  const newQuantity = (cart[productId] || 0) + change;

  if (newQuantity <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = newQuantity;
  }

  renderCart();
}

function toggleCart(isOpen) {
  document.getElementById('drawer').classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function renderCart() {
  const entries = Object.entries(cart);
  const productQuantity = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const cartTotal = entries.reduce((total, [productId, quantity]) => {
    return total + products[productId].price * quantity;
  }, 0);

  document.getElementById('cartCount').textContent = productQuantity;
  document.getElementById('cartTotal').textContent = money(cartTotal);
  document.getElementById('checkoutButton').disabled = !productQuantity;
  document.getElementById('tableOrderButton').disabled = !productQuantity;
  document.getElementById('cartItems').innerHTML = entries.length
    ? entries.map(renderCartLine).join('')
    : `
      <div class="empty">
        <i data-lucide="shopping-bag" size="34"></i>
        <p>Tu pedido esta esperando sus favoritos.</p>
      </div>
    `;

  refreshIcons();
}

function renderCartLine([productId, quantity]) {
  const product = products[productId];
  const lineTotal = product.price * quantity;

  return `
    <div class="cart-line">
      <div>
        <h4>${product.name}</h4>
        <small>${money(product.price)} c/u</small>
        <div class="quantity">
          <button onclick="changeQty(${productId}, -1)" aria-label="Restar">
            <i data-lucide="minus" size="14"></i>
          </button>
          <span>${quantity}</span>
          <button onclick="changeQty(${productId}, 1)" aria-label="Sumar">
            <i data-lucide="plus" size="14"></i>
          </button>
        </div>
      </div>
      <div class="line-total">
        ${money(lineTotal)}
        <br>
        <button class="icon-only" onclick="changeQty(${productId}, -${quantity})" aria-label="Eliminar ${product.name}">
          <i data-lucide="trash-2" size="16"></i>
        </button>
      </div>
    </div>
  `;
}

// Checkout y delivery
function getOrderCosts(isTableOrder = false) {
  const entries = Object.entries(cart);
  const subtotal = entries.reduce((total, [productId, quantity]) => {
    return total + products[productId].price * quantity;
  }, 0);
  const isDelivery = !isTableOrder && document.getElementById('deliveryType').value === 'delivery';
  const taperCount = isDelivery ? getTaperCount(entries) : 0;
  const taperFee = taperCount * DELIVERY_TAPER_PRICE;

  return {
    subtotal,
    taperCount,
    taperFee,
    total: subtotal + taperFee,
    isDelivery,
  };
}

function getTaperCount(entries) {
  return entries.reduce((total, [productId, quantity]) => {
    const product = products[productId];
    const needsTaper = product.category !== 'Bebidas' && product.name !== FULL_CHICKEN_NAME;

    return needsTaper ? total + quantity : total;
  }, 0);
}

function updateCheckout() {
  const { subtotal, taperCount, taperFee, total, isDelivery } = getOrderCosts();
  const deliveryFields = document.querySelectorAll('.delivery-field');

  deliveryFields.forEach((field) => {
    field.hidden = !isDelivery;
  });
  document.getElementById('deliveryNote').hidden = !isDelivery;
  document.getElementById('address').required = isDelivery;

  const itemLines = Object.entries(cart).map(([productId, quantity]) => {
    const product = products[productId];
    return `${quantity}x ${product.name} (${money(product.price * quantity)})`;
  });
  const taperLine = isDelivery
    ? `<br>Tapers (${taperCount} x S/ 1.00): ${money(taperFee)}`
    : '';

  document.getElementById('orderSummary').innerHTML = `
    <strong>Resumen del pedido</strong><br>
    ${itemLines.join('<br>')}<br><br>
    Subtotal: ${money(subtotal)}${taperLine}<br>
    <strong>Total: ${money(total)}</strong>
  `;

  refreshIcons();
}

function openCheckout() {
  if (!Object.keys(cart).length) {
    return;
  }

  toggleCart(false);
  invalidateReceipt();
  updateCheckout();
  document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
}

function setReceiptStatus(message, state = '') {
  const status = document.getElementById('receiptStatus');

  status.textContent = message;
  status.className = `receipt-status${state ? ` is-${state}` : ''}`;
}

function setContinueButtonState(isReady) {
  const continueButton = document.getElementById('continueWhatsAppButton');

  continueButton.disabled = !isReady;
}

function invalidateReceipt() {
  receiptNumber = '';
  receiptReady = false;
  receiptDownloaded = false;
  receiptMode = 'whatsapp';
  setContinueButtonState(false);
  setReceiptStatus('');
}

// Boleta visual: se genera localmente con los valores ya calculados del pedido.
function getReceiptNumber() {
  if (!receiptNumber) {
    const now = new Date();
    const date = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('');
    const time = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join('');

    receiptNumber = `EG-${date}-${time}`;
  }

  return receiptNumber;
}

function wrapCanvasText(context, text, maxWidth) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (context.measureText(candidate).width <= maxWidth || !currentLine) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);

  return lines;
}

function getReceiptDetails(mode = 'whatsapp') {
  const isTableOrder = mode === 'table';
  const { subtotal, taperCount, taperFee, total, isDelivery } = getOrderCosts(isTableOrder);
  const name = document.getElementById('customerName').value.trim() || 'No indicado';
  const address = document.getElementById('address').value.trim() || 'No indicada';
  const reference = document.getElementById('reference').value.trim() || 'No indicada';

  return {
    number: getReceiptNumber(),
    createdAt: new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date()),
    isTableOrder,
    name: isTableOrder ? '' : name,
    payment: isTableOrder ? '' : document.getElementById('payment').value,
    delivery: isTableOrder ? 'Pedido para mesa' : (isDelivery ? 'Delivery' : 'Recojo en local'),
    address: isTableOrder ? '' : (isDelivery ? address : ''),
    reference: isTableOrder ? '' : (isDelivery ? reference : ''),
    subtotal,
    taperCount,
    taperFee,
    total,
    items: Object.entries(cart).map(([productId, quantity]) => {
      const product = products[productId];

      return {
        name: product.name,
        quantity,
        total: product.price * quantity,
      };
    }),
  };
}

function createReceiptCanvas(details) {
  const width = 840;
  const padding = 52;
  const lineHeight = 34;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const itemRows = [];

  context.font = '700 27px "DM Sans", sans-serif';
  details.items.forEach((item) => {
    const itemLines = wrapCanvasText(context, `${item.quantity} x ${item.name}`, width - padding * 2 - 170);

    itemLines.forEach((line, index) => {
      itemRows.push({
        label: line,
        total: index === 0 ? money(item.total) : '',
      });
    });
  });

  const customerRows = details.isTableOrder
    ? [
      'Pedido para consumir en el local.',
      'Envia esta boleta por WhatsApp para confirmar tu pedido.',
    ]
    : [
      `Cliente: ${details.name}`,
      `Entrega: ${details.delivery}`,
      `Pago: ${details.payment}`,
    ];

  if (!details.isTableOrder && details.address) customerRows.push(`Direccion: ${details.address}`);
  if (!details.isTableOrder && details.reference && details.reference !== 'No indicada') customerRows.push(`Referencia: ${details.reference}`);

  context.font = '500 24px "DM Sans", sans-serif';
  const wrappedCustomerRows = customerRows.flatMap((row) => wrapCanvasText(context, row, width - padding * 2));
  const height = 610 + itemRows.length * lineHeight + wrappedCustomerRows.length * lineHeight;

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = '#fffaf2';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#191311';
  context.fillRect(0, 0, width, 148);
  context.fillStyle = '#d92322';
  context.fillRect(0, 148, width, 10);

  context.textBaseline = 'middle';
  context.fillStyle = '#ffffff';
  context.font = '900 48px "Barlow Condensed", sans-serif';
  context.fillText('EL GRINGO J&M', padding, 57);
  context.fillStyle = '#edb34a';
  context.font = '700 21px "DM Sans", sans-serif';
  context.fillText('POLLERIA CHIFA', padding, 96);
  context.fillStyle = '#ded4c6';
  context.font = '500 19px "DM Sans", sans-serif';
  context.fillText(details.isTableOrder ? 'BOLETA PARA MESA' : 'BOLETA VISUAL DE PEDIDO', padding, 125);

  let y = 202;
  context.fillStyle = '#211d1a';
  context.font = '900 31px "Barlow Condensed", sans-serif';
  context.fillText('RESUMEN DEL PEDIDO', padding, y);
  y += 44;
  context.fillStyle = '#766d64';
  context.font = '500 20px "DM Sans", sans-serif';
  context.fillText(details.createdAt, padding, y);
  y += 38;

  context.strokeStyle = '#d8cfc3';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(padding, y);
  context.lineTo(width - padding, y);
  context.stroke();
  y += 28;

  context.fillStyle = '#211d1a';
  context.font = '700 27px "DM Sans", sans-serif';
  itemRows.forEach((item) => {
    context.fillText(item.label, padding, y);
    context.textAlign = 'right';
    context.fillText(item.total, width - padding, y);
    context.textAlign = 'left';
    y += lineHeight;
  });

  y += 18;
  context.strokeStyle = '#d8cfc3';
  context.beginPath();
  context.moveTo(padding, y);
  context.lineTo(width - padding, y);
  context.stroke();
  y += 34;

  context.fillStyle = '#4e463e';
  context.font = '500 24px "DM Sans", sans-serif';
  context.fillText(`Subtotal`, padding, y);
  context.textAlign = 'right';
  context.fillText(money(details.subtotal), width - padding, y);
  context.textAlign = 'left';
  y += lineHeight;

  if (details.taperFee) {
    context.fillText(`Tapers (${details.taperCount} x S/ 1.00)`, padding, y);
    context.textAlign = 'right';
    context.fillText(money(details.taperFee), width - padding, y);
    context.textAlign = 'left';
    y += lineHeight;
  }

  context.fillStyle = '#d92322';
  context.fillRect(padding, y + 10, width - padding * 2, 60);
  context.fillStyle = '#ffffff';
  context.font = '900 30px "DM Sans", sans-serif';
  context.fillText('TOTAL A PAGAR', padding + 18, y + 40);
  context.textAlign = 'right';
  context.fillText(money(details.total), width - padding - 18, y + 40);
  context.textAlign = 'left';
  y += 106;

  context.fillStyle = '#4e463e';
  context.font = '500 24px "DM Sans", sans-serif';
  wrappedCustomerRows.forEach((row) => {
    context.fillText(row, padding, y);
    y += lineHeight;
  });

  context.fillStyle = '#edb34a';
  context.fillRect(0, height - 10, width, 10);
  context.fillStyle = '#766d64';
  context.font = '500 19px "DM Sans", sans-serif';
  context.textAlign = 'center';
  context.fillText('Gracias por elegir El Gringo J&M', width / 2, height - 34);
  context.textAlign = 'left';

  return canvas;
}

function openReceiptPreview(mode = 'whatsapp') {
  const isTableOrder = mode === 'table';
  const checkoutForm = document.getElementById('checkoutForm');

  if (!isTableOrder && !checkoutForm.reportValidity()) return;

  const details = getReceiptDetails(mode);
  const receiptCanvas = createReceiptCanvas(details);
  const imageUrl = receiptCanvas.toDataURL('image/png');
  const receiptImage = document.getElementById('receiptImage');
  const receiptDownload = document.getElementById('receiptDownload');
  const receiptIntro = document.getElementById('receiptIntro');
  const receiptRuleText = document.getElementById('receiptRuleText');
  const continueButton = document.getElementById('continueWhatsAppButton');

  receiptMode = mode;
  receiptReady = true;
  receiptImage.src = imageUrl;
  receiptDownload.href = imageUrl;
  receiptDownload.download = isTableOrder ? 'boleta-pedido-mesa-el-gringo.png' : 'boleta-el-gringo.png';
  receiptIntro.textContent = isTableOrder
    ? 'Descarga tu boleta antes de continuar a WhatsApp.'
    : 'Descarga tu boleta antes de continuar a WhatsApp.';
  receiptRuleText.textContent = isTableOrder
    ? 'Los pedidos para mesa sin la boleta adjunta no seran atendidos.'
    : 'Los pedidos sin la boleta adjunta no seran atendidos.';
  continueButton.hidden = false;
  setContinueButtonState(false);
  setReceiptStatus(
    isTableOrder
      ? 'PASO 1: DESCARGA LA BOLETA. SIN DESCARGARLA NO PODRAS CONTINUAR A WHATSAPP.'
      : 'PASO 1: DESCARGA LA BOLETA. SIN DESCARGARLA NO PODRAS CONTINUAR A WHATSAPP.',
    'warning',
  );
  document.getElementById('receiptModal').classList.add('open');
  refreshIcons();
}

function openTableReceipt() {
  if (!Object.keys(cart).length) return;

  toggleCart(false);
  invalidateReceipt();
  openReceiptPreview('table');
}

function closeReceiptPreview() {
  document.getElementById('receiptModal').classList.remove('open');
}

function markReceiptDownloaded() {
  if (!receiptReady) return;

  receiptDownloaded = true;
  if (receiptMode === 'table') {
    setContinueButtonState(true);
    setReceiptStatus(
      'BOLETA DESCARGADA. PASO 2: ABRE WHATSAPP, ADJUNTALA EN EL CHAT Y ENVIA TU PEDIDO.',
      'ready',
    );
    return;
  }

  setContinueButtonState(true);
  setReceiptStatus(
    'BOLETA DESCARGADA. PASO 2: ABRE WHATSAPP, BUSCALA EN TU GALERIA Y ADJUNTALA EN EL CHAT.',
    'ready',
  );
}

function continueToWhatsApp() {
  if (!receiptReady || !receiptDownloaded) {
    setReceiptStatus('PRIMERO DESCARGA LA BOLETA PARA CONTINUAR.', 'warning');
    return;
  }

  closeReceiptPreview();
  submitOrder();
}

function toggleMobileMenu() {
  const navigation = document.getElementById('primaryNavigation');
  const button = document.getElementById('menuToggle');
  const isOpen = navigation.classList.toggle('show');

  button.setAttribute('aria-expanded', String(isOpen));
  button.setAttribute('aria-label', isOpen ? 'Cerrar navegacion' : 'Abrir navegacion');
}

function closeMobileMenu() {
  const navigation = document.getElementById('primaryNavigation');
  const button = document.getElementById('menuToggle');

  navigation.classList.remove('show');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Abrir navegacion');
}

function submitOrder(event) {
  if (event) event.preventDefault();

  if (!receiptReady) {
    openReceiptPreview();
    return;
  }

  if (!receiptDownloaded) {
    openReceiptPreview();
    setReceiptStatus('PRIMERO DESCARGA LA BOLETA PARA CONTINUAR.', 'warning');
    return;
  }

  const message = receiptMode === 'table'
    ? [
      'Hola, quiero realizar un pedido para mesa.',
      '',
      'Adjuntare mi boleta descargada por este chat.',
    ].join('\n')
    : [
      'Hola, quiero realizar mi pedido.',
      '',
      'Adjuntare mi boleta descargada por este chat.',
    ].join('\n');

  window.open(`https://wa.me/51914499760?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

// Eventos de cierre y carga inicial.
document.getElementById('checkoutForm').addEventListener('submit', submitOrder);
document.getElementById('drawer').addEventListener('click', (event) => {
  if (event.target.id === 'drawer') {
    toggleCart(false);
  }
});
document.getElementById('checkoutModal').addEventListener('click', (event) => {
  if (event.target.id === 'checkoutModal') {
    closeCheckout();
  }
});
document.querySelectorAll('#checkoutForm input, #checkoutForm select').forEach((field) => {
  field.addEventListener('input', invalidateReceipt);
  field.addEventListener('change', invalidateReceipt);
});
document.getElementById('receiptModal').addEventListener('click', (event) => {
  if (event.target.id === 'receiptModal') {
    closeReceiptPreview();
  }
});
document.querySelectorAll('.links a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu();
    closeReceiptPreview();
  }
});

renderFilters();
renderProducts();
renderCart();
refreshIcons();
