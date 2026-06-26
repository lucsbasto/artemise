// Reads extractor JSON from stdin, prints a compact human summary.
let raw = '';
process.stdin.on('data', d => raw += d);
process.stdin.on('end', () => {
  let d;
  try { d = JSON.parse(raw); } catch (e) { console.error('parse fail:', raw.slice(0, 300)); process.exit(1); }
  const noise = ['1. Criar um agendamento','2. Realizar um atendimento','3. Fazer uma venda','4. Automatize seus lembretes','5. Assine um documento','Pesquise ou pergunte algo a Anna'];
  console.log('URL  ', d.url);
  console.log('HEAD ', (d.headings||[]).join(' | '));
  console.log('TABS ', (d.tabs||[]).join(' | '));
  console.log('FIELDS:');
  (d.fields||[]).filter(f=>!noise.includes(f.label)&&f.name!=='g-recaptcha-response').forEach(f=>{
    const req = f.required?' *REQ*':'';
    const opt = f.options?`  opts=[${f.options.join(', ')}]`:'';
    const ml = f.maxLength?` max=${f.maxLength}`:'';
    const ph = f.placeholder?` ph="${f.placeholder}"`:'';
    console.log(`  - [${f.tag}/${f.type}] ${f.label}${req}${ml}${ph}${opt}`);
  });
  console.log('BUTTONS', (d.buttons||[]).filter(b=>!['Ajuda','Comunicação'].includes(b)).join(' | '));
});
