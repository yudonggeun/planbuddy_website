// i18n.js - Language detection and switching
(function () {
    'use strict';

    // Get browser language
    function getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('ko') ? 'ko' : 'en';
    }

    // Get stored language preference
    function getStoredLanguage() {
        return localStorage.getItem('preferredLanguage');
    }

    // Store language preference
    function storeLanguage(lang) {
        localStorage.setItem('preferredLanguage', lang);
    }

    // Get current page language
    function getCurrentLanguage() {
        return document.documentElement.lang || 'en';
    }

    // Redirect to appropriate language version
    function redirectToLanguage(targetLang) {
        const currentLang = getCurrentLanguage();
        const currentPath = window.location.pathname;

        if (currentLang === targetLang) {
            return; // Already on correct language
        }

        // Determine current page type
        let pageType = '';
        if (currentPath.includes('/terms')) {
            pageType = '/terms';
        } else if (currentPath.includes('/privacy')) {
            pageType = '/privacy';
        }

        if (targetLang === 'ko') {
            // Redirect to Korean version
            window.location.href = '/ko' + pageType;
        } else {
            // Redirect to English version
            window.location.href = pageType || '/';
        }
    }

    // Auto-detect and redirect on first visit
    function autoDetectLanguage() {
        const storedLang = getStoredLanguage();
        const currentLang = getCurrentLanguage();

        if (storedLang) {
            // User has a preference, respect it
            redirectToLanguage(storedLang);
        } else {
            // First visit, detect browser language
            const browserLang = getBrowserLanguage();
            if (browserLang !== currentLang) {
                redirectToLanguage(browserLang);
            }
        }
    }

    // Initialize language switcher buttons
    function initLanguageSwitcher() {
        const langButtons = document.querySelectorAll('[data-lang-switch]');

        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetLang = button.dataset.langSwitch;
                storeLanguage(targetLang);
                redirectToLanguage(targetLang);
            });
        });
    }

    // Run on page load
    document.addEventListener('DOMContentLoaded', () => {
        autoDetectLanguage();
        initLanguageSwitcher();
    });

})();
