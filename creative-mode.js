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
    0: "FIND WHAT'S WRONG IN 5 SECONDS",
    1: "FIND WHAT'S WRONG IN 5 SECONDS",
    2: 'YOU HAVE 5 SECONDS — WHERE DOES IT FAIL?'
  };
  prompt.textContent = hooks[level] || "FIND WHAT'S WRONG IN 5 SECONDS";
})();
