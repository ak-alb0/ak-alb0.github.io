
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

