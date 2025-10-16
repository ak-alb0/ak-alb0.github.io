
    const slides = document.querySelectorAll('.slides');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    let index = 0;

    function showSlide(i) {
        slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (idx === i) slide.classList.add('active');
        });
    }

    nextBtn.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    });

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    });

    // Auto play (optional)
    // setInterval(() => {
    //     index = (index + 1) % slides.length;
    //     showSlide(index);
    // }, 8000);



// partie recherche


// Partie recherche
const searchTrigger = document.querySelector('.rechercher');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');

searchTrigger.addEventListener('click', () => {
  searchOverlay.style.display = 'flex';
  searchOverlay.classList.add('show');
  document.querySelector('.search-input-focus').focus();
});

closeSearch.addEventListener('click', () => {
  searchOverlay.classList.remove('show');
  setTimeout(() => {
    searchOverlay.style.display = 'none';
  }, 300); // doit correspondre à la durée de transition
});



// partie  menu burger


const burger = document.getElementById('menu');
const fullscreenMenu = document.createElement('div');
fullscreenMenu.classList.add('fullscreen-menu');
fullscreenMenu.innerHTML = `
  <i class="ri-close-line" id="closeMenu"></i>
  <ul>
    <li><a href="#">New Arrivals</a></li>
    <li><a href="#">Men</a></li>
    <li><a href="#">Women</a></li>
    <li><a href="#">Accessories</a></li>
  </ul>
`;
document.body.appendChild(fullscreenMenu);

burger.addEventListener('click', () => {
  fullscreenMenu.style.display = 'flex';
  setTimeout(() => {
    fullscreenMenu.classList.add('show');
  }, 10); // léger délai pour déclencher l'animation
});

document.addEventListener('click', (e) => {
  if (e.target.id === 'closeMenu') {
    fullscreenMenu.classList.remove('show');
    setTimeout(() => {
      fullscreenMenu.style.display = 'none';
    }, 400); // durée de l'animation
  }
});


