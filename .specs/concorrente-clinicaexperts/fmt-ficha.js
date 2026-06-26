// Formats extract-ficha.js JSON into a compact human list.
let r = '';
process.stdin.on('data', d => r += d);
process.stdin.on('end', () => {
  const d = JSON.parse(r);
  d.questions.forEach(q => {
    if (/Clara Ribeiro/.test(q.title)) return;
    let s = '• ' + q.title + '  [' + (q.type || '?') + ']';
    if (q.radioOpts && q.radioOpts.length) s += '  {' + q.radioOpts.join(' | ') + '}';
    if (q.selectOpts && q.selectOpts.length) s += '  sel{' + q.selectOpts.join(' | ') + '}';
    if (q.cardOpts && q.cardOpts.length) s += '  card{' + q.cardOpts.join(' | ') + '}';
    if (q.placeholders && q.placeholders.length) s += '  ph{' + q.placeholders.join(' | ') + '}';
    console.log(s);
  });
});
