document.getElementById("year").textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); } });
  }, { threshold: .1 });
  document.querySelectorAll('h1, h2, .hero-lead, .section-heading, .product-card, .service-steps > div, .faq-list').forEach(el => { el.classList.add('reveal-ready'); reveal.observe(el); });
  reducedMotion.addEventListener('change', e => { if(e.matches) document.querySelectorAll('.reveal-ready').forEach(el => el.classList.add('is-visible')); });
}

const track = document.querySelector('.case-track');
const slides = [...track.querySelectorAll('.case-slide')];
const dots = [...document.querySelectorAll('[data-slide]')];
const prev = document.getElementById('case-prev');
const next = document.getElementById('case-next');
let current = 0;
function goToSlide(index) {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  track.scrollTo({ left: slides[target].offsetLeft - slides[0].offsetLeft, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
function updateSlide() {
  const offset = track.scrollLeft;
  current = slides.reduce((best, slide, i) => Math.abs(slide.offsetLeft - slides[0].offsetLeft - offset) < Math.abs(slides[best].offsetLeft - slides[0].offsetLeft - offset) ? i : best, 0);
  dots.forEach((dot,i) => { if(i === current) dot.setAttribute('aria-current','true'); else dot.removeAttribute('aria-current'); });
  prev.disabled = current === 0; next.disabled = current === slides.length - 1;
  document.getElementById('case-status').textContent = `Slide ${current + 1} dari ${slides.length}`;
}
dots.forEach((dot,i) => dot.addEventListener('click',() => goToSlide(i)));
prev.addEventListener('click',() => goToSlide(current - 1));
next.addEventListener('click',() => goToSlide(current + 1));
track.addEventListener('keydown',e => { if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); goToSlide(current + (e.key === 'ArrowRight' ? 1 : -1)); } });
let frame;
track.addEventListener('scroll',() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateSlide); },{ passive:true });
window.addEventListener('resize',updateSlide);
updateSlide();
