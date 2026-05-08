/* =====================================
   ODORIBA / Vanilla JS
   - FAQ accordion + tabs
   - Archive scroll auto-play
   - Intersection Observer for fade-in
   - Lazy loaded image fade-in on load
   ===================================== */

(function () {
  'use strict';

  // ============ Intersection Observer (fade-in on scroll) ============
  const fadeTargets = document.querySelectorAll(
    '.section-head, .content-card, .entry-card, .archive__photo, .faq__item, .access__item, .about__lead, .contents__lead, .timetable__text, .archive__lead, .contact__form, .follow__link'
  );
  fadeTargets.forEach((el) => el.classList.add('lazy-fade'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    fadeTargets.forEach((el) => io.observe(el));
  } else {
    fadeTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // ============ Image lazy load: native + decode hint ============
  // 画像のloading="lazy"はネイティブ対応。読み込み完了でフェードイン。
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.complete) return;
    img.style.opacity = '0';
    img.style.transition = 'opacity .6s ease';
    img.addEventListener(
      'load',
      () => {
        img.style.opacity = '1';
      },
      { once: true }
    );
    img.addEventListener(
      'error',
      () => {
        img.style.opacity = '1';
      },
      { once: true }
    );
  });

  // ============ FAQ accordion ============
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq__question');
    btn.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      faqItems.forEach((other) => (other.dataset.open = 'false'));
      item.dataset.open = isOpen ? 'false' : 'true';
    });
  });

  // ============ FAQ tabs ============
  const tabs = document.querySelectorAll('.faq__tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('faq__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('faq__tab--active');
      tab.setAttribute('aria-selected', 'true');
    });
  });

  // ============ Archive auto-scroll ============
  const archiveScroll = document.getElementById('archiveScroll');
  const archiveBtn = document.getElementById('archiveStopBtn');
  const archiveText = document.getElementById('archiveStopText');

  let archiveTimer = null;
  let archivePlaying = true;

  if (archiveScroll && archiveBtn) {
    archiveBtn.dataset.state = 'stop';

    const startAutoScroll = () => {
      if (archiveTimer) return;
      archiveTimer = setInterval(() => {
        const max = archiveScroll.scrollWidth - archiveScroll.clientWidth;
        if (archiveScroll.scrollLeft >= max - 1) {
          archiveScroll.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          archiveScroll.scrollBy({ left: 1, behavior: 'auto' });
        }
      }, 30);
    };
    const stopAutoScroll = () => {
      if (archiveTimer) {
        clearInterval(archiveTimer);
        archiveTimer = null;
      }
    };

    // 表示時に開始（パフォーマンスのため）
    if ('IntersectionObserver' in window) {
      const archiveIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && archivePlaying) startAutoScroll();
            else stopAutoScroll();
          });
        },
        { threshold: 0.3 }
      );
      archiveIO.observe(archiveScroll);
    } else {
      startAutoScroll();
    }

    archiveBtn.addEventListener('click', () => {
      archivePlaying = !archivePlaying;
      if (archivePlaying) {
        archiveBtn.dataset.state = 'stop';
        archiveText.textContent = 'STOP';
        startAutoScroll();
      } else {
        archiveBtn.dataset.state = 'play';
        archiveText.textContent = 'PLAY';
        stopAutoScroll();
      }
    });

    // ユーザー操作中は一時停止
    archiveScroll.addEventListener('touchstart', stopAutoScroll, { passive: true });
    archiveScroll.addEventListener('mousedown', stopAutoScroll);
  }

  // ============ Contact form (デモ動作) ============
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('お問い合わせを受け付けました（デモ）');
    });
  }
})();
