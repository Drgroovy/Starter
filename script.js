const navItems = document.querySelectorAll('.nav-item');
const tickerText = document.querySelector('#tickerText');
const featureTiles = document.querySelectorAll('.feature-tile');
const defaultTicker = 'NEW! Send Halloween E-Cards to your friends and family!';
let tickerTimer;

function setTicker(message) {
  tickerText.textContent = message;
  tickerText.style.animation = 'none';
  tickerText.offsetHeight;
  tickerText.style.animation = '';
  clearTimeout(tickerTimer);
  tickerTimer = setTimeout(() => setTicker(defaultTicker), 6500);
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((nav) => nav.classList.remove('selected'));
    item.classList.add('selected');
    const section = item.dataset.section;
    const message = section === 'Weather'
      ? 'Weather selected: Halloween Forecast updated at 11:30 PM.'
      : `${section} channel selected. Dial-up spirits are fetching spooky headlines...`;
    setTicker(message);
  });
});

featureTiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    setTicker(tile.dataset.message);
    tile.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-3px)' },
      { transform: 'translateY(0)' }
    ], {
      duration: 220,
      easing: 'steps(3, end)'
    });
  });
});

window.addEventListener('load', () => {
  setTimeout(() => setTicker('Updating Halloween Forecast... 100% complete. Connected.'), 1700);
});
