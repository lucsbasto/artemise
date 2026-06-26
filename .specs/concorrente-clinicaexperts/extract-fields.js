// Reusable form-field extractor for playwright-cli eval.
// Usage: playwright-cli --raw run-code --filename=extract-fields.js
// Returns JSON describing all inputs, selects, textareas, buttons, headings on the page.
async page => {
  return await page.evaluate(() => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };
    const labelFor = (el) => {
      // explicit label
      if (el.id) {
        const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (l && l.textContent.trim()) return l.textContent.trim();
      }
      // wrapping label
      let p = el.closest('label');
      if (p && p.textContent.trim()) return p.textContent.trim();
      // aria-label / placeholder / preceding label text
      if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
      // nearest preceding label-like sibling text
      let cur = el.parentElement, depth = 0;
      while (cur && depth < 4) {
        const lbl = cur.querySelector('label, .label, [class*="label"]');
        if (lbl && lbl.textContent.trim()) return lbl.textContent.trim().slice(0, 80);
        cur = cur.parentElement; depth++;
      }
      return el.getAttribute('placeholder') || el.name || '';
    };

    const out = { url: location.href, title: document.title, headings: [], fields: [], buttons: [], tabs: [], links: [] };

    document.querySelectorAll('h1,h2,h3').forEach(h => {
      if (visible(h) && h.textContent.trim()) out.headings.push(h.textContent.trim().slice(0, 120));
    });

    document.querySelectorAll('input, textarea, select').forEach(el => {
      if (!visible(el) && el.type !== 'hidden') { /* keep hidden out */ }
      if (el.type === 'hidden') return;
      const f = {
        tag: el.tagName.toLowerCase(),
        type: el.type || null,
        label: labelFor(el),
        name: el.name || null,
        placeholder: el.placeholder || null,
        required: el.required || el.getAttribute('aria-required') === 'true' || null,
        disabled: el.disabled || null,
        value: el.value || null,
        maxLength: el.maxLength > 0 ? el.maxLength : null,
        pattern: el.pattern || null,
        min: el.min || null, max: el.max || null,
      };
      if (el.tagName === 'SELECT') {
        f.options = [...el.options].map(o => o.textContent.trim()).filter(Boolean);
      }
      out.fields.push(f);
    });

    document.querySelectorAll('button, [role="button"], a[class*="btn"]').forEach(b => {
      if (visible(b) && b.textContent.trim()) {
        const t = b.textContent.trim().slice(0, 60);
        if (t) out.buttons.push(t);
      }
    });

    document.querySelectorAll('[role="tab"], [class*="tab"] a, nav a').forEach(t => {
      if (visible(t) && t.textContent.trim()) out.tabs.push(t.textContent.trim().slice(0, 60));
    });

    // dedupe
    out.buttons = [...new Set(out.buttons)];
    out.tabs = [...new Set(out.tabs)];
    return out;
  });
}
