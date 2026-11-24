(() => {
  const launch = document.querySelector('#launch-sky');
  const sky = document.querySelector('#sky');
  const canvas = sky.querySelector('canvas');
  const art = sky.querySelector('.sky-art');
  const name = sky.querySelector('.sky-name');
  const close = sky.querySelector('#close-sky');
  const replay = sky.querySelector('#replay-sky');
  const message = sky.querySelector('#sky-message');
  const context = canvas.getContext('2d');
  const atlas = document.createElement('canvas');
  const atlasContext = atlas.getContext('2d', { willReadFrequently: true });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['#ffddc7', '#ffaaca', '#f5a5ef', '#cfabff'];
  const duration = 6900;
  const lastLine = 'Si je pouvais refaire cette journée, je choisirais encore de te rencontrer. ♡';
  let frame = 0;
  let elapsed = 0;
  let width = 0;
  let height = 0;
  let stars = [];

  if (typeof sky.showModal !== 'function') return;
  launch.hidden = false;

  function mix(start, end, progress) {
    return start + (end - start) * progress;
  }

  function ease(progress) {
    const value = Math.min(1, Math.max(0, progress));
    return value * value * (3 - 2 * value);
  }

  function heartPoint(angle, radius) {
    return [
      radius * 16 * Math.sin(angle) ** 3,
      -radius * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) -
        2 * Math.cos(3 * angle) - Math.cos(4 * angle))
    ];
  }

  function sampleName() {
    atlas.width = 420;
    atlas.height = 120;
    atlasContext.fillStyle = '#fff';
    atlasContext.font = 'italic 700 106px Georgia, serif';
    atlasContext.textAlign = 'center';
    atlasContext.textBaseline = 'middle';
    atlasContext.fillText(name.textContent.trim(), 210, 64);
    const { data } = atlasContext.getImageData(0, 0, atlas.width, atlas.height);
    const points = [];
    for (let y = 0; y < atlas.height; y += 3) {
      for (let x = 0; x < atlas.width; x += 3) {
        if (data[(y * atlas.width + x) * 4 + 3] > 150) points.push([x - 210, y - 60]);
      }
    }
    return points;
  }

  function buildStars() {
    const points = sampleName();
    if (!points.length) return false;
    const count = Math.min(width < 550 ? 510 : 780, points.length);
    stars = Array.from({ length: count }, (_, index) => {
      const angle = index * 2.3999632297;
      const radius = index % 4 === 0 ? 1 : .13 + .85 * Math.sqrt(Math.random());
      const [heartX, heartY] = heartPoint(angle, radius);
      const [nameX, nameY] = points[Math.floor(index * points.length / count)];
      return {
        heartX, heartY, nameX, nameY,
        swing: Math.sin(angle), rise: Math.cos(angle),
        color: index % palette.length, size: .7 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2, delay: Math.random() * 420
      };
    });
    return true;
  }

  function fitCanvas() {
    width = art.clientWidth;
    height = art.clientHeight;
    const density = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.max(1, Math.round(width * density));
    canvas.height = Math.max(1, Math.round(height * density));
    context.setTransform(density, 0, 0, density, 0, 0);
  }

  function drawComets(time) {
    context.lineWidth = 1.35;
    for (let index = 0; index < 7; index += 1) {
      const progress = (time - index * 118) / 1250;
      if (progress <= 0 || progress >= 1) continue;
      const direction = index % 2 ? 1 : -1;
      const rise = index / 7;
      const startX = width * (.5 + direction * (.24 + rise * .2));
      const startY = height * (.89 - rise * .23);
      const headX = mix(startX, width * .5, progress);
      const headY = mix(startY, height * .46, progress) - Math.sin(progress * Math.PI) * height * .27;
      context.globalAlpha = Math.sin(progress * Math.PI);
      context.strokeStyle = palette[index % palette.length];
      context.beginPath();
      context.moveTo(headX + direction * width * .09, headY + height * .07);
      context.quadraticCurveTo(headX + direction * width * .035, headY - 5, headX, headY);
      context.stroke();
    }
    context.globalAlpha = 1;
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    const centerX = width * .5;
    const centerY = height * .49;
    const heartScale = Math.min(width / 41, height / 38) *
      (1 + .035 * Math.sin(time / 125) * (1 - ease((time - 3300) / 900)));
    const nameScale = Math.min(width * .88 / 420, height * .64 / 120, 2.9);
    const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * .49);
    glow.addColorStop(0, '#ec87cf34');
    glow.addColorStop(.42, '#b95a9d19');
    glow.addColorStop(1, '#b95a9d00');
    context.globalAlpha = ease(time / 1500);
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 1;
    drawComets(time);

    const ring = (time - 2500) / 1600;
    if (ring > 0 && ring < 1) {
      context.globalAlpha = .5 * Math.sin(Math.PI * ring);
      context.strokeStyle = '#ffc5db';
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(centerX, centerY, Math.max(1, width * .46 * ring), Math.max(1, height * .24 * ring),
        -.22, 0, Math.PI * 2);
      context.stroke();
      context.globalAlpha = 1;
    }

    for (const [colorIndex, color] of palette.entries()) {
      context.fillStyle = color;
      context.beginPath();
      for (const star of stars) {
        if (star.color !== colorIndex || time < star.delay) continue;
        const gather = ease((time - 550 - star.delay) / 1580);
        const spell = ease((time - 3410 - star.delay) / 2130);
        const travel = Math.sin(spell * Math.PI);
        const drift = Math.sin(time / 520 + star.phase);
        const startX = width * (.5 + star.swing * .48);
        const startY = height * (.82 + star.rise * .2);
        const heartX = centerX + star.heartX * heartScale;
        const heartY = centerY + star.heartY * heartScale;
        const x = mix(mix(startX, heartX, gather), centerX + star.nameX * nameScale, spell)
          + star.rise * travel * width * .13 + drift * 1.1;
        const y = mix(mix(startY, heartY, gather), centerY + star.nameY * nameScale, spell)
          - star.swing * travel * height * .19;
        const radius = star.size * (.77 + .22 * drift) * (1 + .42 * travel);
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2);
      }
      context.fill();
    }
  }

  function finish(staticName = false) {
    cancelAnimationFrame(frame);
    frame = 0;
    canvas.hidden = staticName;
    name.hidden = !staticName;
    message.textContent = lastLine;
    replay.hidden = staticName;
  }

  function play() {
    cancelAnimationFrame(frame);
    frame = 0;
    elapsed = 0;
    message.textContent = '';
    replay.hidden = true;
    name.hidden = true;
    canvas.hidden = true;
    if (motion.matches || !context || !atlasContext) {
      finish(true);
      return;
    }

    canvas.hidden = false;
    fitCanvas();
    if (width < 2 || height < 2 || !buildStars()) {
      finish(true);
      return;
    }

    let start;
    function animate(now) {
      start ??= now;
      elapsed = Math.min(now - start, duration);
      draw(elapsed);
      if (elapsed < duration) {
        frame = requestAnimationFrame(animate);
      } else {
        finish();
      }
    }
    frame = requestAnimationFrame(animate);
  }

  launch.addEventListener('click', () => {
    sky.showModal();
    play();
  });

  replay.addEventListener('click', () => {
    close.focus({ preventScroll: true });
    play();
  });

  sky.addEventListener('close', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    launch.focus({ preventScroll: true });
  });

  function resize() {
    if (!sky.open || canvas.hidden || !context) return;
    fitCanvas();
    if (width > 1 && height > 1) draw(elapsed);
  }

  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(resize);
    observer.observe(art);
  } else {
    window.addEventListener('resize', resize);
  }

  motion.addEventListener('change', () => {
    if (sky.open) play();
  });
})();
