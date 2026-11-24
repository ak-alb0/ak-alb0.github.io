const openButton = document.querySelector('#open-letter');
const openLabel = openButton.querySelector('.open-label');
const story = document.querySelector('#lettre');
const storyTitle = story.querySelector('h2');
const hero = document.querySelector('.hero');
const envelope = document.querySelector('.envelope-scene');
const openingLight = document.querySelector('.opening-light');
const giftIntro = document.querySelector('#gift-intro');
const skipIntro = document.querySelector('#skip-intro');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sound = document.querySelector('#sound');
const soundLabel = document.querySelector('#sound-label');
const soundStatus = document.querySelector('#sound-status');
const track = document.querySelector('#track');
const introDuration = 2300;
const openingDuration = 1900;
giftIntro.style.setProperty('--intro-duration', introDuration + 'ms');
let introTimer = 0;
let openingTimer = 0;
let stopOpeningLight;

storyTitle.tabIndex = -1;
story.hidden = true;
openButton.setAttribute('aria-expanded', 'false');
openButton.setAttribute('aria-controls', story.id);
sound.hidden = false;
track.volume = 0.65;

function playOpeningLight() {
  const context = openingLight.getContext('2d');
  if (!context) return;

  openingLight.hidden = false;
  const width = openingLight.clientWidth;
  const height = openingLight.clientHeight;
  const density = Math.min(devicePixelRatio || 1, 1.75);
  openingLight.width = Math.max(1, Math.round(width * density));
  openingLight.height = Math.max(1, Math.round(height * density));
  context.setTransform(density, 0, 0, density, 0, 0);

  const centerX = width * .5;
  const centerY = height * .51;
  const colors = ['#ffe4b6', '#ffacc5', '#ffc59d', '#f7b9f7'];
  const sparks = Array.from({ length: width < 440 ? 66 : 100 }, (_, index) => ({
    angle: index * 2.39996323,
    distance: .3 + Math.random() * .7,
    delay: Math.random() * 390,
    size: .7 + Math.random() * 1.8,
    color: colors[index % colors.length]
  }));
  let frame;
  let start;

  function drawTrails(time) {
    context.lineCap = 'round';
    for (let strand = 0; strand < 4; strand += 1) {
      const progress = (time - strand * 68) / 1440;
      if (progress <= 0 || progress >= 1) continue;
      const direction = strand % 2 === 0 ? 1 : -1;
      const offset = strand * Math.PI / 2;
      const light = Math.sin(progress * Math.PI);
      context.strokeStyle = colors[strand];
      for (let segment = 0; segment < 22; segment += 1) {
        const fraction = segment / 22;
        context.globalAlpha = light * fraction * fraction * .86;
        context.lineWidth = .55 + fraction * 1.55;
        context.beginPath();
        for (let point = 0; point <= 1; point += 1) {
          const position = Math.max(0, progress - .29 * (1 - (segment + point) / 22));
          const angle = offset + direction * (position * 8.2 - Math.PI / 2);
          const orbit = Math.sin(position * Math.PI * .58);
          const x = centerX + Math.cos(angle) * width * .47 * orbit;
          const y = centerY + Math.sin(angle) * height * .35 * orbit - position * height * .12;
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
    }
  }

  function drawSparks(time) {
    for (const [index, spark] of sparks.entries()) {
      const progress = (time - 410 - spark.delay) / 1000;
      if (progress <= 0 || progress >= 1) continue;
      const travel = 1 - (1 - progress) ** 2;
      const angle = spark.angle + travel * .75;
      const x = centerX + Math.cos(angle) * travel * spark.distance * width * .47;
      const y = centerY - height * .05 + Math.sin(angle) * travel * spark.distance * height * .44
        + height * .16 * progress ** 2;
      const size = spark.size * (1 - progress * .52);
      context.globalAlpha = Math.sin(progress * Math.PI) * (1 - progress * .35);
      context.fillStyle = spark.color;
      context.beginPath();
      if (index % 9 === 0) {
        context.moveTo(x, y - size * 2.9);
        context.lineTo(x + size * .62, y - size * .45);
        context.lineTo(x + size * 1.9, y);
        context.lineTo(x + size * .62, y + size * .45);
        context.lineTo(x, y + size * 2.9);
        context.lineTo(x - size * .62, y + size * .45);
        context.lineTo(x - size * 1.9, y);
        context.lineTo(x - size * .62, y - size * .45);
        context.closePath();
      } else {
        context.arc(x, y, size, 0, Math.PI * 2);
      }
      context.fill();
    }
  }

  function render(now) {
    start ??= now;
    const time = now - start;
    context.clearRect(0, 0, width, height);
    drawTrails(time);
    drawSparks(time);
    context.globalAlpha = 1;
    if (time < openingDuration) frame = requestAnimationFrame(render);
  }

  frame = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(frame);
    openingLight.hidden = true;
  };
}

function showStory() {
  story.hidden = false;
  envelope.classList.add('is-open');
  openButton.setAttribute('aria-expanded', 'true');
  openLabel.textContent = 'Relire le cadeau';
}

function goToStory() {
  storyTitle.focus({ preventScroll: true });
  story.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}

function finishOpening() {
  clearTimeout(openingTimer);
  openingTimer = 0;
  stopOpeningLight?.();
  stopOpeningLight = undefined;
  showStory();
  hero.classList.remove('is-opening');
}

function finishAndScroll() {
  finishOpening();
  goToStory();
}

function finishIfFocused() {
  finishOpening();
  if (document.activeElement === openButton || document.activeElement === document.body) goToStory();
}

function beginEnvelopeOpening() {
  openLabel.textContent = 'Passer l’animation';
  hero.classList.add('is-opening');
  stopOpeningLight = playOpeningLight();
  openingTimer = setTimeout(finishIfFocused, openingDuration);
}

openButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (openingTimer || !story.hidden || reducedMotion.matches) {
    finishAndScroll();
    return;
  }

  openButton.focus({ preventScroll: true });
  beginEnvelopeOpening();
});

function dismissIntro() {
  clearTimeout(introTimer);
  introTimer = 0;
  if (!giftIntro.open) return;
  giftIntro.close();
  openButton.focus({ preventScroll: true });
}

skipIntro.addEventListener('click', dismissIntro);
giftIntro.addEventListener('cancel', (event) => {
  event.preventDefault();
  dismissIntro();
});

reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) return;
  dismissIntro();
  if (openingTimer) finishIfFocused();
});

if (!location.hash && !reducedMotion.matches && typeof giftIntro.showModal === 'function') {
  giftIntro.showModal();
  introTimer = setTimeout(dismissIntro, introDuration);
}
document.documentElement.classList.remove('intro-pending');

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
