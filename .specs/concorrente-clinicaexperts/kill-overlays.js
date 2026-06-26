// Removes Userpilot tours, trial popups, FAB backdrops, tippy backdrops so the app is interactable.
// Run after each navigation: playwright-cli --raw run-code --filename=kill-overlays.js
async page => {
  return await page.evaluate(() => {
    const kill = [];
    document.querySelectorAll('*').forEach(e => {
      const c = (e.className && e.className.toString) ? e.className.toString() : '';
      const id = e.id || '';
      if (/userpilot|introjs|intro-|trial-popup|floating-button-overlay|tippy-backdrop|coach|driver-/i.test(c + ' ' + id)) {
        kill.push((c || id).slice(0, 25));
        e.remove();
      }
    });
    // re-enable pointer events disabled by tours
    document.querySelectorAll('[style*="pointer-events"]').forEach(e => { e.style.pointerEvents = ''; });
    document.body.style.overflow = '';
    return kill.length;
  });
}
