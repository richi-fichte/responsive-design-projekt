const carousel = document.querySelector('.carousel');
const slides = [...document.querySelectorAll('[data-slide]')];
const dots = [...document.querySelectorAll('.dot')];
const prev = document.querySelector('.carousel-nav.prev');
const next = document.querySelector('.carousel-nav.next');

function goToSlide(index) {
  const slide = slides[index];
  if (!slide || !carousel) return;

  // Berechnet die Position so, dass das Bild exakt in der Mitte des Carousels landet
  const targetScrollLeft = slide.offsetLeft - (carousel.clientWidth - slide.offsetWidth) / 2;

  carousel.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth'
  });
}

let currentDotIndex = 0; // Speichert den aktuell aktiven Punkt

if (carousel) {
  carousel.addEventListener('scroll', () => {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let bestIndex = 0;
    let bestDistance = Infinity;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    // Nur wenn das Bild wirklich gewechselt hat:
    if (bestIndex !== currentDotIndex) {
      currentDotIndex = bestIndex;
      setActiveDot(bestIndex);
      autoplay(); // <-- Fix: Setzt den Timer beim Wischen zurück
    }
  }, { passive: true });
}

function setActiveDot(index) {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

dots.forEach((dot, i) => dot.addEventListener('click', () => {
  goToSlide(i);
  autoplay(); //Setzt den 6-Sekunden-Timer und die CSS-Animation zurück
}));

prev?.addEventListener('click', () => {
  const current = dots.findIndex(d => d.classList.contains('active'));
  goToSlide(Math.max(0, current - 1));
  autoplay();
});

next?.addEventListener('click', () => {
  const current = dots.findIndex(d => d.classList.contains('active'));
  goToSlide(Math.min(slides.length - 1, current + 1));
  autoplay();
});

let carouselTimer;
function autoplay() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    const current = dots.findIndex(d => d.classList.contains('active'));
    const nextIndex = (current + 1) % slides.length;
    goToSlide(nextIndex);
  }, 6000); // = alle 6 Sekunden bewegt sich die Bildergallerie
}
autoplay();

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Burger Menu Toggle
  const burger = document.getElementById('burger-menu');
  const nav = document.querySelector('.nav-links');

  burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');

    //Toggle das Scroll-Verbot auf der gesamten Seite
    document.body.classList.toggle('no-scroll');

    // Burger Animation (aus den 3 Strichen wird ein X)
    burger.classList.toggle('toggle');
    const lines = burger.children;
    if (nav.classList.contains('nav-active')) {
      lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  });

  // 2. Scroll Fade-In Animation (Intersection Observer)
  const faders = document.querySelectorAll('.fade-in');

  const appearOptions = {
    threshold: 0.15, // Löst aus, wenn 15% des Elements sichtbar sind
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target); // Animation nur einmal abspielen
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  //ANIMATION STATS//
  // Flüssige Zahlen-Animation (Counter) mit requestAnimationFrame
  const counters = document.querySelectorAll('.counter');

  const startCounting = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');

        // Nutzt data-speed als Gesamtdauer der Animation in Millisekunden (Standard: 2000ms)
        const duration = +counter.getAttribute('data-speed') || 2000;
        let startTime = null;

        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = currentTime - startTime;

          // Berechnet, wie viel Prozent der Zeit vergangen sind (Wert zwischen 0 und 1)
          const progressPercent = Math.min(progress / duration, 1);

          // Berechnet die aktuelle Zahl basierend auf dem Fortschritt
          counter.innerText = Math.floor(progressPercent * target);

          // Wenn die Zeit noch nicht um ist, die nächste Frame anfordern
          if (progressPercent < 1) {
            requestAnimationFrame(animate);
          } else {
            counter.innerText = target; // Garantiert, dass am Ende die exakte Zielzahl steht
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(counter);
      }
    });
  };

  const counterObserver = new IntersectionObserver(startCounting, {
    threshold: 0.2
  });

  counters.forEach(counter => counterObserver.observe(counter));

  // Klickbare Infoboxen
  const featureButtons = document.querySelectorAll('.feature-item .btn-links');

  featureButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentItem = button.closest('.feature-item');

      // Prüft, ob dieses Feld schon offen ist
      const isOpen = currentItem.classList.contains('open');

      // Schließt alle anderen eventuell offenen Textfelder (genau wie bei Apple)
      document.querySelectorAll('.feature-item').forEach(item => {
        item.classList.remove('open');
      });

      // Wenn es nicht offen war, öffne es jetzt
      if (!isOpen) {
        currentItem.classList.add('open');
      }
    });
  });
});