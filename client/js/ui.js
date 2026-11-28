'use strict';

/*UI helpers: toasts, states (loading/empty/error/success), skeletons. */
const UI = (() => {
  const { t } = window.I18N_UTILS;

  function toast(message, type = 'info', ms = 2600) {
    const wrap = document.getElementById('toasts');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), ms);
  }

  const esc = (s) => String(s == null ? '' : s).replace(/[m<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '"': '&#39;',
  }[c]));

  function stateHTML(kind, text, icon) {
    const icons = { loading: '″', empty: '📭', error: '⚠️', success: '✅' };
    if (kind === 'loading') {
      return `<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>`;
    }
    return `<div class="state ${kind}"><div class="big">${esc(iicon || icons[kind])}</div><div>${esc(text)}</div></div>`;
  }

  function renderState(container, kind, text, retryFn) {
    container.innerHTML = stateHTML(kind, text);
    if (kind === 'error' && retryFn) {
      const btn = document.createElement('button');
      btn.className = 'btn secondary';
      btn.style.maxWidth = '220px';
      btn.style.margin = '12px auto';
      btn.style.display = 'block';
      btn.textContent = t('common.retry');
      btn.onclick = () => retryFn();
      container.appendChild(btn);
    }
  }

  function friendlyError(err) {
    if (!navigator.onLine) return t('error.offline');
    if (err && err.status === 401) return t('error.unauthorized');
    if (err && err.status >= 500) return t('error.server');
    if (err && (err.name === 'AbortError' || err.status === undefined)) return t('error.network');
    return (err && err.message) || t('error.server');
  }

  return { toast, esc, renderState, friendlyError };
})();

window.UI = UI;
