/**
 * Noor's Handmade Bangles - Utility Functions
 */

import { CONFIG } from './config.js';

// Format Currency in BDT (৳)
export function formatCurrency(amount) {
  const numericAmount = parseFloat(amount) || 0;
  return `${CONFIG.CURRENCY}${numericAmount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// XSS Prevention: Safe HTML Escaping
export function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Toast Notifications System
export function showToast(message, type = 'info', duration = 3000) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
  toast.innerHTML = `
    <span style="font-weight: bold; font-size: 1.1rem;">${icon}</span>
    <span>${escapeHTML(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Browser WebP Image Compression (Max 1200px, < 300KB)
export async function compressAndConvertToWebP(file, maxDimension = 1200, maxQuality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; // white background for transparent PNG conversion if needed
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas compression failed'));
          const webpFilename = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          const compressedFile = new File([blob], webpFilename, { type: 'image/webp' });
          resolve({
            file: compressedFile,
            dataUrl: canvas.toDataURL('image/webp', maxQuality),
            sizeKB: Math.round(blob.size / 1024)
          });
        }, 'image/webp', maxQuality);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

// Honeypot & Anti-Spam Form Cooldown Check
const formCooldowns = new Map();

export function validateFormSpamProtection(formElement, cooldownSeconds = 10) {
  const honeypot = formElement.querySelector('input[name="website_url_hp"]');
  if (honeypot && honeypot.value.trim() !== '') {
    console.warn('Spam submission detected via honeypot.');
    return false; // Honeypot filled by bot
  }

  const formId = formElement.id || 'default_form';
  const lastSubmit = formCooldowns.get(formId);
  const now = Date.now();

  if (lastSubmit && (now - lastSubmit) < cooldownSeconds * 1000) {
    const remaining = Math.ceil((cooldownSeconds * 1000 - (now - lastSubmit)) / 1000);
    showToast(`Please wait ${remaining} seconds before submitting again.`, 'warning');
    return false;
  }

  formCooldowns.set(formId, now);
  return true;
}

// Export Array of Objects to CSV File
export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) {
    showToast('No data to export', 'warning');
    return;
  }

  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
        cell = cell.replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Elegant SVG Image Generator for Demo / Sample Bangles
export function generateBangleSVG(title = "Noor's Bangle", primaryColor = "#C85A32", secondaryColor = "#D4AF37") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FDFBF7"/>
        <stop offset="100%" stop-color="#F1ECE4"/>
      </radialGradient>
      <linearGradient id="bangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="50%" stop-color="${secondaryColor}"/>
        <stop offset="100%" stop-color="${primaryColor}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#2C2523" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <g filter="url(#shadow)" transform="translate(300, 290)">
      <!-- Main Outer Bangle -->
      <circle r="170" fill="none" stroke="url(#bangleGrad)" stroke-width="28"/>
      <circle r="148" fill="none" stroke="${secondaryColor}" stroke-width="3" stroke-dasharray="8 6"/>
      <circle r="192" fill="none" stroke="${secondaryColor}" stroke-width="3"/>
      
      <!-- Inner Accent Bangles -->
      <circle r="125" fill="none" stroke="${primaryColor}" stroke-width="12" opacity="0.85"/>
      <circle r="210" fill="none" stroke="${primaryColor}" stroke-width="8" opacity="0.75"/>
      
      <!-- Decorative Gems / Dots -->
      <g fill="${secondaryColor}">
        <circle cx="0" cy="-170" r="8"/>
        <circle cx="170" cy="0" r="8"/>
        <circle cx="0" cy="170" r="8"/>
        <circle cx="-170" cy="0" r="8"/>
        <circle cx="120" cy="120" r="6"/>
        <circle cx="-120" cy="-120" r="6"/>
        <circle cx="-120" cy="120" r="6"/>
        <circle cx="120" cy="-120" r="6"/>
      </g>
    </g>
    <!-- Brand Label Overlay -->
    <text x="300" y="520" text-anchor="middle" font-family="Playfair Display, serif" font-size="24" font-weight="600" fill="#2C2523" letter-spacing="1">${escapeHTML(title)}</text>
    <text x="300" y="550" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="600" fill="#786C68" letter-spacing="3">NOOR'S HANDMADE</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
