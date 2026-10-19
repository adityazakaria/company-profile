import clsx from 'clsx';

export const cn = (...args) => clsx(...args);

export const PLACEHOLDER = '/placeholder.svg';

export const onImgError = (e) => {
  if (!e.currentTarget.dataset.fallback) {
    e.currentTarget.dataset.fallback = '1';
    e.currentTarget.src = PLACEHOLDER;
  }
};

export const formatDate = (d, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  d ? new Intl.DateTimeFormat('id-ID', opts).format(new Date(d)) : '';

export const formatDateTime = (d) =>
  formatDate(d, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatRupiah = (n) =>
  n === null || n === undefined
    ? 'Hubungi kami'
    : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export const formatNumber = (n) => new Intl.NumberFormat('id-ID').format(n);

/** Ambil pesan error ramah dari error axios */
export const getErrorMessage = (err, fallback = 'Terjadi kesalahan. Silakan coba lagi.') =>
  err?.response?.data?.message || (err?.code === 'ERR_NETWORK' ? 'Tidak dapat terhubung ke server.' : err?.message) || fallback;
