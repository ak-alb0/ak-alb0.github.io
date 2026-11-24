const openButton = document.querySelector('#open-letter');
const story = document.querySelector('#lettre');
const storyTitle = story.querySelector('h2');
const envelope = document.querySelector('.envelope-scene');
const celebration = document.querySelector('.celebration');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sound = document.querySelector('#sound');
const soundLabel = document.querySelector('#sound-label');
const soundStatus = document.querySelector('#sound-status');
const track = document.querySelector('#track');

storyTitle.tabIndex = -1;
story.hidden = true;
openButton.setAttribute('aria-expanded', 'false');
openButton.setAttribute('aria-controls', story.id);
sound.hidden = false;
track.volume = 0.65;

function scatterStars() {
  const bounds = envelope.getBoundingClientRect();
  const colors = ['#ffb4ba', '#ffe4bc', '#f985a5'];
  for (let index = 0; index < 18; index += 1) {
    const angle = index * Math.PI * 2 / 18;
    const distance = 65 + Math.random() * 82;
    const star = document.createElement('span');
    star.className = 'particle';
    star.textContent = index % 3 === 0 ? '♡' : '✦';
    star.style.left = `${bounds.left + bounds.width / 2}px`;
    star.style.top = `${bounds.top + bounds.height / 2}px`;
    star.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    star.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    star.style.setProperty('--spin', `${index * 19}deg`);
    star.style.setProperty('--tint', colors[index % colors.length]);
    star.addEventListener('animationend', () => star.remove(), { once: true });
    celebration.append(star);
  }
  setTimeout(() => celebration.replaceChildren(), 900);
}

function showStory() {
  story.hidden = false;
  envelope.classList.add('is-open');
  openButton.setAttribute('aria-expanded', 'true');
  openButton.lastChild.textContent = ' Relire le cadeau';
}

function goToStory() {
  storyTitle.focus({ preventScroll: true });
  story.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}

openButton.addEventListener('click', (event) => {
  event.preventDefault();
  const firstOpen = story.hidden;
  showStory();
  if (firstOpen && !reducedMotion.matches) {
    openButton.focus({ preventScroll: true });
    scatterStars();
    setTimeout(() => {
      if (document.activeElement === openButton || document.activeElement === document.body) goToStory();
    }, 680);
    return;
  }
  goToStory();
});

if (location.hash === '#lettre' || location.hash === '#mot') {
  showStory();
  document.querySelector(location.hash).scrollIntoView();
}

sound.addEventListener('click', async () => {
  soundStatus.textContent = '';
  if (!track.paused) {
    track.pause();
    return;
  }
  try {
    await track.play();
  } catch (error) {
    if (error.name !== 'AbortError') {
      soundStatus.textContent = 'Morceau indisponible. Le cadeau peut s’ouvrir sans musique.';
    }
  }
});

function updateSound() {
  const playing = !track.paused && !track.error;
  sound.setAttribute('aria-pressed', String(playing));
  soundLabel.textContent = playing ? 'Couper la musique' : 'Écouter PNL';
}

track.addEventListener('play', updateSound);
track.addEventListener('pause', updateSound);
track.addEventListener('error', updateSound);
