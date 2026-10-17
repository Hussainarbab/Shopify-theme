(() => {
  document.querySelectorAll('img[data-image-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.dataset.fallbackUsed === 'true') return;
      image.dataset.fallbackUsed = 'true';
      image.removeAttribute('srcset');
      image.src = image.dataset.imageFallback;
      image.classList.add('product-image--representative');
      const note = image.parentElement.querySelector('[data-image-note]');
      if (note) {
        note.hidden = false;
        note.textContent = 'Illustrative photo';
      }
    }, { once: true });
  });

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuToggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
      mobileMenu.hidden = expanded;
    });
    mobileMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        mobileMenu.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        menuToggle.focus();
      }
    });
  }

  const moneyFormat = (cents) => {
    const currency = document.documentElement.dataset.currency || 'PKR';
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'en-PK', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2
      }).format(cents / 100);
    } catch {
      return `${currency} ${(cents / 100).toFixed(2)}`;
    }
  };
  const variantSelect = document.querySelector('[data-variant-select]');
  const productForm = document.querySelector('#ProductForm');
  if (variantSelect && productForm) {
    const price = productForm.closest('[data-product-root]').querySelector('[data-product-price]');
    const currentPrice = price.querySelector('[data-current-price]');
    const comparePrice = price.querySelector('[data-compare-price]');
    const availability = productForm.closest('[data-product-root]').querySelector('[data-availability]');
    const addButton = productForm.querySelector('[data-add-button]');
    variantSelect.addEventListener('change', () => {
      const option = variantSelect.selectedOptions ? variantSelect.selectedOptions[0] : variantSelect;
      if (!option) return;
      const variantPrice = Number(option.dataset.price);
      const compareAt = Number(option.dataset.compare);
      const available = option.dataset.available === 'true';
      currentPrice.textContent = moneyFormat(variantPrice);
      if (compareAt && compareAt > variantPrice) {
        comparePrice.textContent = moneyFormat(compareAt);
        comparePrice.hidden = false;
        currentPrice.classList.add('price__current--sale');
      } else {
        comparePrice.hidden = true;
        currentPrice.classList.remove('price__current--sale');
      }
      availability.innerHTML = available
        ? '<span class="availability-dot"></span> Available'
        : '<span class="availability-dot availability-dot--out"></span> Currently unavailable';
      addButton.disabled = !available;
      addButton.innerHTML = available ? 'Add to cart <span aria-hidden="true">→</span>' : 'Sold out';
      const imageUrl = option.dataset.image;
      const mainImage = productForm.closest('[data-product-root]').querySelector('.product-gallery__main img');
      if (imageUrl && mainImage) {
        mainImage.removeAttribute('srcset');
        mainImage.src = imageUrl;
      }
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variantSelect.value);
      window.history.replaceState({}, '', url);
    });

    const quantity = productForm.querySelector('[data-quantity-input]');
    productForm.querySelector('[data-quantity-minus]').addEventListener('click', () => {
      quantity.value = Math.max(1, (parseInt(quantity.value, 10) || 1) - 1);
    });
    productForm.querySelector('[data-quantity-plus]').addEventListener('click', () => {
      quantity.value = Math.max(1, parseInt(quantity.value, 10) || 1) + 1;
    });

    productForm.addEventListener('submit', async (event) => {
      if (!event.submitter || event.submitter.name !== 'add') return;
      event.preventDefault();
      if (addButton.disabled) return;
      const message = productForm.querySelector('[data-product-message]');
      const idleLabel = addButton.textContent.replace('→', '').trim();
      addButton.disabled = true;
      addButton.textContent = 'Adding…';
      message.textContent = '';
      try {
        const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            id: Number(variantSelect.value),
            quantity: Math.max(1, parseInt(quantity.value, 10) || 1)
          })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.description || result.message || 'This item could not be added to your cart.');
        const cartResponse = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`, {
          headers: { Accept: 'application/json' }
        });
        if (!cartResponse.ok) throw new Error('Item added, but the cart could not be refreshed. Please open your cart to confirm.');
        const cart = await cartResponse.json();
        document.querySelectorAll('[data-cart-count]').forEach((count) => { count.textContent = cart.item_count; });
        document.querySelectorAll('.cart-link').forEach((link) => { link.setAttribute('aria-label', `Cart, ${cart.item_count} items`); });
        message.textContent = `${result.product_title} added to your cart.`;
      } catch (error) {
        message.textContent = error.message;
      } finally {
        const selectedOption = variantSelect.selectedOptions ? variantSelect.selectedOptions[0] : variantSelect;
        const available = selectedOption.dataset.available === 'true';
        addButton.disabled = !available;
        addButton.innerHTML = available ? `${idleLabel} <span aria-hidden="true">→</span>` : 'Sold out';
      }
    });
  }

  document.querySelectorAll('[data-gallery-image]').forEach((button) => {
    button.addEventListener('click', () => {
      const image = document.querySelector('.product-gallery__main img');
      if (!image) return;
      image.src = button.dataset.galleryImage;
      if (button.dataset.gallerySrcset) image.srcset = button.dataset.gallerySrcset;
      document.querySelectorAll('.product-thumb').forEach((thumb) => thumb.classList.remove('is-active'));
      button.classList.add('is-active');
    });
  });

  const sortSelect = document.querySelector('[data-sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortSelect.value);
      window.location.assign(url);
    });
  }

  document.querySelectorAll('[data-recommendations]').forEach(async (section) => {
    if (section.querySelector('.product-card')) return;
    try {
      const response = await fetch(section.dataset.url);
      if (!response.ok) throw new Error('Product recommendations could not be loaded.');
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const content = html.querySelector(`[data-section-id="${section.dataset.sectionId}"]`);
      if (content && content.querySelector('.product-card')) section.innerHTML = content.innerHTML;
    } catch {
      section.textContent = 'Related items could not be loaded right now.';
    }
  });
})();
