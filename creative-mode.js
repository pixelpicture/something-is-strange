(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('creative') !== '1') return;
  document.documentElement.classList.add('creative-mode');
  const level = Number.parseInt(params.get('level') || '0', 10);
  const prompt = document.getElementById('prompt');
  const brand = document.querySelector('.brand');
  const footer = document.querySelector('.footer');
  const streak = document.getElementById('streak');
  brand.textContent = 'SOMETHING IS STRANGE';
  footer.textContent = '';
  streak.textContent = 'CAN YOU SEE IT?';
  const hooks = {
    0: "WATCH HIS SHADOW — WHAT'S WRONG?",
    1: '2 PEOPLE. HOW MANY SHADOWS?',
    2: 'WATCH THE SWITCH — WHICH LAMP?'
  };
  prompt.textContent = hooks[level] || "FIND WHAT'S WRONG";
})();
