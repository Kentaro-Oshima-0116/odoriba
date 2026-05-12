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
    '.section-head, .content-card, .entry-card, .faq__item, .access__item, .about__lead, .contents__lead, .timetable__text, .archive__lead, .contact__link, .follow__link'
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

  // ============ Hamburger menu ============
  const menuToggle = document.getElementById('menuToggle');
  const siteMenu = document.getElementById('siteMenu');

  if (menuToggle && siteMenu) {
    const menuFocusable = siteMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    const setMenuFocusable = (enabled) => {
      menuFocusable.forEach((el) => {
        if (enabled) {
          const originalTabIndex = el.dataset.originalTabIndex;
          if (originalTabIndex === undefined) {
            el.removeAttribute('tabindex');
          } else {
            el.setAttribute('tabindex', originalTabIndex);
          }
        } else {
          if (el.hasAttribute('tabindex') && el.dataset.originalTabIndex === undefined) {
            el.dataset.originalTabIndex = el.getAttribute('tabindex');
          }
          el.setAttribute('tabindex', '-1');
        }
      });
    };

    const setMenuOpen = (open) => {
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      siteMenu.setAttribute('aria-hidden', String(!open));
      siteMenu.inert = !open;
      setMenuFocusable(open);
      if (!open && siteMenu.contains(document.activeElement)) {
        menuToggle.focus({ preventScroll: true });
      }
    };

    setMenuOpen(false);

    menuToggle.addEventListener('click', () => {
      setMenuOpen(!document.body.classList.contains('menu-open'));
    });

    siteMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    });
  }

  // ============ FAQ accordion ============
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item, index) => {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    const answerId = answer.id || `faq-answer-${index + 1}`;
    answer.id = answerId;
    btn.setAttribute('aria-controls', answerId);
    btn.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');

    const setItemOpen = (target, open) => {
      target.dataset.open = String(open);
      const targetBtn = target.querySelector('.faq__question');
      const targetAnswer = target.querySelector('.faq__answer');
      if (targetBtn) targetBtn.setAttribute('aria-expanded', String(open));
      if (targetAnswer) targetAnswer.setAttribute('aria-hidden', String(!open));
    };

    btn.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      faqItems.forEach((other) => setItemOpen(other, false));
      setItemOpen(item, !isOpen);
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
  const archiveTrack = document.getElementById('archiveTrack');
  const archiveBtn = document.getElementById('archiveStopBtn');

  let archivePlaying = true;

  if (archiveScroll && archiveTrack && archiveBtn) {
    archiveBtn.dataset.state = 'stop';
    archiveBtn.setAttribute('aria-label', 'ハイライトを停止');
    archiveScroll.dataset.state = 'playing';

    const photoItems = Array.from(archiveTrack.children);
    const loopWidth = photoItems.reduce((total, item) => total + item.getBoundingClientRect().width, 0);
    if (loopWidth > 0) {
      archiveTrack.style.setProperty('--archive-loop-width', `${loopWidth}px`);
      archiveTrack.style.setProperty('--archive-loop-duration', `${(loopWidth / 10).toFixed(2)}s`);
    }

    photoItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.remove('lazy-fade', 'is-visible');
      clone.querySelectorAll('img').forEach((img) => {
        img.style.opacity = '';
        img.style.transition = '';
        img.loading = 'eager';
      });
      archiveTrack.appendChild(clone);
    });

    const startAutoScroll = () => {
      archiveScroll.dataset.state = 'playing';
    };
    const stopAutoScroll = () => {
      archiveScroll.dataset.state = 'paused';
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
        archiveBtn.setAttribute('aria-label', 'ハイライトを停止');
        startAutoScroll();
      } else {
        archiveBtn.dataset.state = 'play';
        archiveBtn.setAttribute('aria-label', 'ハイライトを再生');
        stopAutoScroll();
      }
    });

    archiveScroll.addEventListener('mouseenter', stopAutoScroll);
    archiveScroll.addEventListener('mouseleave', () => {
      if (archivePlaying) startAutoScroll();
    });
    archiveScroll.addEventListener('touchstart', stopAutoScroll, { passive: true });
  }

})();
