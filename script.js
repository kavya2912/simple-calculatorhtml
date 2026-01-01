const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
let expr = '';

function update(){ display.value = expr || '0'; }

function safeEvaluate(s){
  // Allow only digits, operators and parentheses and dots
  if (!/^[0-9+\-*/().\s]+$/.test(s)) throw new Error('Invalid characters');
  // Basic eval via Function to avoid direct eval usage
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${s})`)();
}

buttons.forEach(btn => {
  const act = btn.dataset.action;
  const v = btn.textContent;
  btn.addEventListener('click', () => {
    if (!act) {
      expr += v;
    } else {
      switch (act) {
        case 'clear': expr = ''; break;
        case 'back': expr = expr.slice(0, -1); break;
        case 'dot': if (!/\.$/.test(expr)) expr += '.'; break;
        case 'operator': expr += v; break;
        case 'percent':
          // convert trailing number to number/100
          expr = expr.replace(/(\d+\.?\d*)$/, '($1/100)');
          break;
        case 'neg':
          // toggle sign of last number
          expr = expr.replace(/(\d+\.?\d*)$/,(m)=>`(0-(${m}))`);
          break;
        case 'equals':
          try{
            const res = safeEvaluate(expr || '0');
            expr = String(res);
          }catch(e){ expr = 'Error'; setTimeout(()=> expr = '', 800); }
          break;
      }
    }
    update();
  });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); document.querySelector('[data-action="equals"]').click(); return; }
  if (e.key === 'Backspace') { e.preventDefault(); document.querySelector('[data-action="back"]').click(); return; }
  if (e.key === 'Escape') { e.preventDefault(); document.querySelector('[data-action="clear"]').click(); return; }
  if (/[0-9.+\-*/()]/.test(e.key)) { expr += e.key; update(); }
});

update();
