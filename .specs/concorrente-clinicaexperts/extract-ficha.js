// Extracts question blocks of a Clinica Experts atendimento ficha via document-order walk.
// Titles = p.has-text-weight-bold; controls grouped under the preceding title.
async page => {
  return await page.evaluate(() => {
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    // collect ordered nodes of interest
    const root = document.querySelector('.appointments-wrapper') || document.querySelector('main') || document.body;
    const all = root.querySelectorAll('p.has-text-weight-bold, input, textarea, select, [contenteditable], img');
    const items = [];
    all.forEach(el => {
      if (!vis(el)) return;
      if (el.matches('p.has-text-weight-bold')) {
        const t = el.textContent.trim();
        if (t) items.push({ kind: 'title', t });
      } else if (el.tagName === 'IMG') {
        // card caption: nearest short text around the image
        let c = el.closest('div'), cap = '';
        for (let i = 0; i < 4 && c; i++) { const tx = c.textContent.trim(); if (tx && tx.length < 40) { cap = tx; break; } c = c.parentElement; }
        if (cap) items.push({ kind: 'card', cap });
      } else {
        items.push({ kind: 'ctrl', el });
      }
    });
    const radioLabel = (el) => {
      // label text near a radio/checkbox: climb to the row container that has text
      let l = el.closest('label');
      if (l && l.textContent.trim()) return l.textContent.trim().slice(0, 40);
      if (el.id) { const lf = document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (lf && lf.textContent.trim()) return lf.textContent.trim().slice(0, 40); }
      let c = el.parentElement, depth = 0;
      while (c && depth < 4) {
        const tx = c.textContent.trim();
        if (tx && tx.length < 50) return tx;
        c = c.parentElement; depth++;
      }
      return '';
    };
    const out = { url: location.href, questions: [] };
    let cur = null;
    items.forEach(it => {
      if (it.kind === 'title') {
        cur = { title: it.t, types: new Set(), radioOpts: new Set(), selectOpts: new Set(), placeholders: new Set(), cardOpts: new Set() };
        out.questions.push(cur);
        return;
      }
      if (!cur) return;
      if (it.kind === 'card') { cur.types.add('card'); cur.cardOpts.add(it.cap); return; }
      const el = it.el;
      const t = el.tagName.toLowerCase();
      if (el.getAttribute && el.getAttribute('contenteditable') !== null) { cur.types.add('rich-text'); return; }
      if (t === 'textarea') { cur.types.add('textarea'); if (el.placeholder) cur.placeholders.add(el.placeholder); return; }
      if (t === 'select') { cur.types.add('select'); [...el.options].forEach(o => { const x = o.textContent.trim(); if (x) cur.selectOpts.add(x); }); return; }
      if (t === 'input') {
        const ty = el.type;
        if (ty === 'radio') { cur.types.add('radio'); const lb = radioLabel(el); if (lb) cur.radioOpts.add(lb); }
        else if (ty === 'checkbox') { cur.types.add('checkbox'); const lb = radioLabel(el); if (lb) cur.radioOpts.add(lb); }
        else if (ty === 'file') { cur.types.add('file/upload'); }
        else { cur.types.add('text:' + ty); if (el.placeholder) cur.placeholders.add(el.placeholder); }
      }
    });
    return {
      url: out.url,
      questions: out.questions.map(q => ({
        title: q.title,
        type: [...q.types].join(', '),
        radioOpts: [...q.radioOpts],
        selectOpts: [...q.selectOpts],
        cardOpts: [...q.cardOpts],
        placeholders: [...q.placeholders],
      })),
    };
  });
}
