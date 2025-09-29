/**
 * TMU Payment Popup - Standalone JavaScript Library
 * A complete payment popup solution that can be used on any website
 * No dependencies required - Pure JavaScript
 * 
 * Usage:
 * <script src="tmuPayment.js"></script>
 * <script>
 *   TMUPayment.open({
 *     amount: 250.00,
 *     onSuccess: (result) => console.log('Pagamento riuscito:', result),
 *     onCancel: () => console.log('Pagamento annullato')
 *   });
 * </script>
 */

window.TMUPayment = (function () {
    'use strict';

    let currentPopup = null;
    let stripe = null;
    let elements = null;
    let cardElement = null;

    function loadStripeJs(publishableKey) {
        return new Promise((resolve, reject) => {
            if (window.Stripe) {
                try {
                    const instance = window.Stripe(publishableKey);
                    return resolve(instance);
                } catch (e) {
                    return reject(e);
                }
            }
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.async = true;
            script.onload = () => {
                try {
                    const instance = window.Stripe(publishableKey);
                    resolve(instance);
                } catch (e) {
                    reject(e);
                }
            };
            script.onerror = () => reject(new Error('Failed to load Stripe.js'));
            document.head.appendChild(script);
        });
    }

    // Main API
    const TMUPayment = {
        open: function (options = {}) {
            if (currentPopup) {
                TMUPayment.close();
            }

            const config = {
                amount: options.amount || 0,
                currency: options.currency || 'USD',
                baseUrl: options.baseUrl || '',
                stripePublicKey: options.stripePublicKey || 'pk_test_51KKIdNFmHEDbKHDRbwRM4LVISCGSNtPoOv691YhuDiXCEAi3bN3m5D9GWXCWFhTyH3MvAuM3hIanBBPTPQ20MWt600UQ0kXL2F',
                headers: { ...(options.headers || {}), "AUTHORIZATION": "IntegrationToken eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNiODBmZTdhLWY4YjctNGM4ZC1hYjc0LWRlNWMxMjQyZTQ4ZSIsInVzZXJfaWQiOiIyYjI0ZTIyNi1iZWVkLTQ2Y2QtOTA5MC1lZjlhYTc0YjExNWUifQ.kjkTsg-3Dsjl-wT8xYIPwdIFqPlGZakzefG-ibmAebB_k5HvxXTbGa7Iyfntl3Iu53SXaJ44feeLbxk83HhvEwOJA1FwDSwNsCJLMH0TLN2GKN3tB4kwj5e6kDpFg1FiPnX_XpAhQtLzUTY3DHZCNFEa6MNQ4roLCfPUDQKZgNhfS95HCmSWn7Ty6YPngijhP_aA58i-QDRgVQ95cXnOGY8Mf07Lwo19zG08xT37FlI7-yh1yg0x8xwwqPqbeNTfNfZdDD-wS9XSsbOaK93UX1kf211WKU9PyPfFcEhY6ZtwdfBZwMDmgXpgaaVKkwVN4FRhs1c2ppU9vGcTBtkP2wNpQR2GG1Sw44q07pT4gDgRl3j4s1EdrK_cUQtT_bMOH3vsxeciwsA8mkUDWmCEiy0Iyl1A1uKOcSF6aZiZ7SAJPwDkxgWbx1Ee0RYFsA2Bp_VI5ooKzDTMNcLXYwopUfSj7ilriXDM1LAED7KTCB1TSbiF53lUIl829ukRPNfoHvOUjdLrlcBeTjcSdAsj8rfVob0izGTMZe8K-ZP1iuKzYnwKeGuzzOew7W_PxkbFSI_QQuC4LCBI-NLIXFcgGsNHDECdIMESRI0MH33pfuP7PsQnhlLJZk5fqF2lyS4P3Q8xxa0LJzgxEqp72HCeYifSRpRUzaYnKiSPgRi_LO0" },
                returnUrl: options.returnUrl || '',
                onSuccess: options.onSuccess || function () { },
                onCancel: options.onCancel || function () { },
                onError: options.onError || function (error) { alert('Errore di pagamento: ' + error); }
            };

            currentPopup = createPaymentPopup(config);
            document.body.appendChild(currentPopup);

            // Add CSS if not already added
            if (!document.getElementById('tmu-payment-styles')) {
                addStyles();
            }

            return currentPopup;
        },

        close: function () {
            if (currentPopup && currentPopup.parentNode) {
                currentPopup.parentNode.removeChild(currentPopup);
                currentPopup = null;
            }
        },

        processPayment: function (paymentData) {
            console.log('Processing TMU payment:', paymentData);

            // Simulate payment processing
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (paymentData.agreeToTerms) {
                        resolve({
                            success: true,
                            transactionId: 'TMU_' + Date.now(),
                            amount: paymentData.amount,
                            message: 'Pagamento elaborato con successo!'
                        });
                    } else {
                        reject({
                            success: false,
                            error: "È necessario accettare i Termini d'uso"
                        });
                    }
                }, 1000);
            });
        }
    };

    // Add required CSS styles
    function addStyles() {
        const style = document.createElement('style');
        style.id = 'tmu-payment-styles';
        style.textContent = `
            :root { 
                --tmu-color: rgb(11, 157, 188); 
                --tmu-color-10: rgba(11, 157, 188, 0.1);
                --tmu-color-light: rgba(11, 157, 188, 0.05);
                --tmu-gradient: linear-gradient(135deg, rgb(11, 157, 188) 0%, rgb(8, 125, 150) 100%);
                --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            
            * {
                box-sizing: border-box;
            }
            
            .tmu-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                padding: 20px;
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .tmu-popup-container {
                background: white;
                border-radius: 20px;
                max-width: 530px;
                width: 100%;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: var(--shadow-xl);
                animation: slideUp 0.4s ease-out;
                position: relative;
            }
            
            .tmu-popup-header {
                background: var(--tmu-gradient);
                padding: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                overflow: hidden;
            }
            
          
            .tmu-popup-logo-container {
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 1;
                background: rgba(255, 255, 255, 0.95);
                padding: 8px 16px;
                border-radius: 12px;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .tmu-popup-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 12px;
                cursor: pointer;
                color: white;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 1;
            }
            
            .tmu-popup-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.05);
            }
            
            .tmu-popup-form {
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 18px;
                overflow-y: auto;
                max-height: calc(90vh - 100px);
            }
            
            .tmu-popup-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .tmu-popup-label {
                font-size: 13px;
                font-weight: 600;
                color: #1f2937;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 0;
            }
            
            .tmu-popup-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 400;
                color: #1f2937;
                background: #fafafa;
                transition: all 0.3s ease;
                appearance: none;
                height: 48px;
            }
            
            .tmu-popup-input:focus {
                outline: none;
                border-color: var(--tmu-color);
                background: white;
                box-shadow: 0 0 0 4px var(--tmu-color-10);
                transform: translateY(-1px);
            }
            
            .tmu-popup-input::placeholder {
                color: #9ca3af;
                font-weight: 400;
            }
            
            .tmu-popup-payment-methods {
                margin-top: 8px;
            }
            
            .tmu-popup-methods-title {
                font-size: 18px;
                font-weight: 700;
                color: #1f2937;
                margin: 0 0 16px 0;
                text-align: center;
            }
            
            .tmu-popup-methods-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            
            .tmu-popup-method {
                border: 2px solid #e5e7eb;
                border-radius: 16px;
                padding: 20px 16px;
                cursor: pointer;
                text-align: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                background: #fafafa;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tmu-popup-method::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                transition: left 0.5s;
            }
            
            .tmu-popup-method:hover {
                border-color: var(--tmu-color);
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
            }
            
            .tmu-popup-method:hover::before {
                left: 100%;
            }
            
            .tmu-popup-method.active {
                border-color: var(--tmu-color);
                background: var(--tmu-color-light);
                transform: translateY(-2px);
                box-shadow: 0 0 0 4px var(--tmu-color-10), var(--shadow-md);
            }
            
            .tmu-popup-card-fields {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-top: 8px;
                padding: 20px;
                background: var(--tmu-color-light);
                border-radius: 16px;
                border: 1px solid rgba(11, 157, 188, 0.1);
            }
            
            .tmu-popup-card-fields.hidden {
                display: none;
            }
            
            .tmu-popup-card-input-container {
                position: relative;
            }
            
            .tmu-popup-card-input {
                padding-left: 48px;
                padding-right: 120px;
            }
            
            .tmu-popup-card-icon {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                color: var(--tmu-color);
                opacity: 0.7;
            }
            
            .tmu-popup-autofill {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: var(--tmu-gradient);
                color: white;
                padding: 8px 12px;
                font-size: 11px;
                font-weight: 600;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .tmu-popup-autofill:hover {
                transform: translateY(-50%) scale(1.05);
                box-shadow: var(--shadow-sm);
            }
            
            .tmu-popup-checkbox-container {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 16px;
                background: #fafafa;
                border-radius: 12px;
                border: 1px solid #e5e7eb;
                transition: all 0.2s ease;
            }
            
            .tmu-popup-checkbox-container:hover {
                background: white;
                border-color: var(--tmu-color);
            }
            
            .tmu-popup-checkbox {
                width: 20px;
                height: 20px;
                margin-top: 2px;
                accent-color: var(--tmu-color);
                cursor: pointer;
            }
            
            .tmu-popup-checkbox-label {
                font-size: 14px;
                color: #4b5563;
                line-height: 1.5;
                cursor: pointer;
                font-weight: 400;
            }
            
            .tmu-popup-link {
                color: var(--tmu-color);
                text-decoration: none;
                font-weight: 600;
                position: relative;
                transition: all 0.2s ease;
            }
            
            .tmu-popup-link:hover {
                text-decoration: underline;
            }
            
            .tmu-popup-error {
                font-size: 12px;
                color: #dc2626;
                font-weight: 500;
                margin-top: 6px;
                display: none;
                animation: shake 0.3s ease-in-out;
            }
            
            .tmu-popup-error-message {
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 12px;
                padding: 12px 16px;
                margin-bottom: 16px;
                animation: slideDown 0.3s ease-out;
            }
            
            .tmu-popup-error-text {
                color: #dc2626;
                font-size: 14px;
                font-weight: 500;
                text-align: center;
                line-height: 1.4;
            }
            
            @keyframes slideDown {
                from { 
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-4px); }
                75% { transform: translateX(4px); }
            }
            
            .tmu-input-error {
                border-color: #dc2626 !important;
                background: #fef2f2 !important;
                box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1) !important;
                transform: none !important;
            }
            
            .tmu-popup-buttons {
                display: flex;
                gap: 16px;
                margin-top: 24px;
            }
            
            .tmu-popup-button {
                padding: 12px 20px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: none;
                position: relative;
                overflow: hidden;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .tmu-popup-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            
            .tmu-popup-button:hover::before {
                left: 100%;
            }
            
            .tmu-popup-button-cancel {
                flex: 1;
                border: 2px solid #e5e7eb;
                background: white;
                color: #6b7280;
            }
            
            .tmu-popup-button-cancel:hover {
                background: #f9fafb;
                border-color: #d1d5db;
                transform: translateY(-1px);
                box-shadow: var(--shadow-sm);
            }
            
            .tmu-popup-button-submit {
                flex: 2;
                background: var(--tmu-gradient);
                color: white;
                box-shadow: var(--shadow-md);
            }
            
            .tmu-popup-button-submit:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            
            .tmu-popup-button-submit:disabled {
                background: #9ca3af;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            
            .tmu-popup-credit-cards {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 600;
                color: #1f2937;
            }
            
            .tmu-popup-paypal {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                font-weight: 700;
                color: var(--tmu-color);
            }
            
            @media (max-width: 530px) {
                .tmu-popup-overlay {
                    padding: 16px;
                }
                
                .tmu-popup-container {
                    border-radius: 16px;
                    max-width: 100%;
                }
                
                .tmu-popup-header {
                    padding: 20px 24px;
                }
                
                .tmu-popup-form {
                    padding: 24px;
                    gap: 20px;
                }
                
                .tmu-popup-methods-grid {
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
                
                .tmu-popup-buttons {
                    flex-direction: column;
                    gap: 12px;
                }
                
                .tmu-popup-button {
                    padding: 14px 20px;
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create the payment popup DOM element
    function createPaymentPopup(config) {
        const popup = document.createElement('div');
        popup.className = 'tmu-popup-overlay';

        popup.innerHTML = `
            <div class="tmu-popup-container">
                <div class="tmu-popup-header">
                    <div class="tmu-popup-logo-container">
                        <svg width="90" height="21" color="rgba(10, 157, 189, 1)" viewBox="0 0 169 33">
                            <g fill-rule="nonzero" fill="none">
                                <path d="M59.34 23.12c.84 0 1.48-.1 1.82-.16v-2.34H61c-.2.02-.52.04-.72.04-.74 0-1.18-.22-1.18-1.02v-5.28h2.08v-2H59.1v-3.4h-3.08v3.4h-1.6v2h1.6v5.96c0 2.16 1.34 2.8 3.32 2.8zm8.62-.12v-4.94c0-2.08 1.12-3.14 2.82-3.12.22 0 .44.02.66.06h.08v-2.74c-.14-.06-.36-.08-.66-.08-1.32 0-2.28.6-2.96 2.08h-.06v-1.9h-3.02V23h3.14zm10.72.3c1.46 0 2.42-.58 3.2-1.82h.06V23h2.98V12.36h-3.1v6.02c0 1.32-.78 2.28-2.04 2.28-1.12 0-1.7-.68-1.7-1.86v-6.44h-3.14v7.04c0 2.34 1.32 3.9 3.74 3.9zm14.74.04c2.76 0 4.8-1.2 4.8-3.5 0-2.68-2.16-3.18-4.06-3.52-1.46-.26-2.62-.38-2.62-1.18 0-.68.62-1.08 1.58-1.08 1 0 1.6.38 1.8 1.14h2.92c-.28-1.86-1.76-3.14-4.72-3.14-2.5 0-4.48 1.14-4.48 3.32 0 2.48 1.92 2.96 3.82 3.32 1.48.28 2.74.4 2.74 1.36 0 .76-.64 1.22-1.76 1.22-1.22 0-1.98-.56-2.16-1.56h-2.96c.16 2.14 2.02 3.62 5.1 3.62zm12.36-.22c.84 0 1.48-.1 1.82-.16v-2.34h-.16c-.2.02-.52.04-.72.04-.74 0-1.18-.22-1.18-1.02v-5.28h2.08v-2h-2.08v-3.4h-3.08v3.4h-1.6v2h1.6v5.96c0 2.16 1.34 2.8 3.32 2.8zm7.58-.12v-6.62c0-1.64 1.38-2.82 2.66-2.82 1.1 0 1.84.78 1.84 2.1V23h1.84v-6.62c0-1.64 1.18-2.82 2.54-2.82 1.08 0 1.94.78 1.94 2.1V23h1.86v-7.5c0-2.24-1.36-3.5-3.32-3.5-1.3 0-2.56.66-3.32 2h-.04c-.44-1.32-1.48-2-2.78-2-1.38 0-2.52.7-3.18 1.86h-.06v-1.6h-1.84V23h1.86zm21.84.3c2.48 0 4.2-1.36 4.68-3.36h-1.82c-.34 1.14-1.36 1.84-2.84 1.84-2.08 0-3.22-1.6-3.36-3.7h8.24c0-1.82-.44-3.36-1.32-4.42-.84-1.04-2.08-1.66-3.68-1.66-3.08 0-5.14 2.52-5.14 5.64 0 3.14 1.94 5.66 5.24 5.66zm2.92-6.56h-6.22c.24-1.9 1.26-3.3 3.2-3.3 1.86 0 2.92 1.24 3.02 3.3z" fill="rgba(0, 0, 0, 1)"></path>
                                <path d="M147.5 23.3c1.46 0 2.42-.58 3.2-1.82h.06V23h2.98V12.36h-3.1v6.02c0 1.32-.78 2.28-2.04 2.28-1.12 0-1.7-.68-1.7-1.86v-6.44h-3.14v7.04c0 2.34 1.32 3.9 3.74 3.9zm13.46 3.24V24c0-1.14-.06-1.92-.1-2.32h.04c.62 1.04 1.74 1.66 3.14 1.66 2.84 0 4.68-2.2 4.68-5.66 0-3.26-1.76-5.62-4.58-5.62-1.46 0-2.52.6-3.24 1.82h-.06v-1.52h-3.02v14.18h3.14zm2.34-5.64c-1.6 0-2.44-1.3-2.44-3.12 0-1.8.78-3.22 2.4-3.22 1.54 0 2.28 1.32 2.28 3.22 0 1.9-.82 3.12-2.24 3.12z" fill="currentColor"></path>
                                <g fill="currentColor">
                                    <path d="M20.504 19.886l.064-.255-.177-.094a3.233 3.233 0 01-1.648-2.8l.005-.178c.093-1.647 1.495-3.015 3.193-3.073h.035l.04.004.041.003.041-.003.041-.004h.035l.18.01c1.676.151 3.02 1.575 3.017 3.24l-.007.21a3.245 3.245 0 01-1.817 2.685l.063.255h4.955l.006.078c.015.08.055.161.122.253l.393.542c.258.363.51.732.755 1.104l.154.238c.76 1.19 1.36 2.44 1.317 3.927l-.02.254c-.016.255-.03.511-.08.76l-.057.264c-.239 1.054-.656 2.033-1.419 2.82l-.226.224c-1.072 1.012-2.373 1.595-3.84 1.818l-.29.036a5.021 5.021 0 01-2.516-.401l-.388-.175a12.546 12.546 0 01-2.495-1.577l-.95-.759c-1.265-1.011-2.528-2.026-3.74-3.1l-.95-.863c-1.257-1.163-2.473-2.373-3.72-3.548l-.574-.526c-.387-.346-.78-.688-1.159-1.041l-.077-.076c-.09-.096-.13-.173-.125-.252h11.691l-1.333 5.47-.019.106a.845.845 0 00.836.943h4.125l.108-.007a.847.847 0 00.71-1.043l-1.333-5.47h-2.967zM20 0l.344.003C31.23.186 40 9.017 40 19.886H28.575l.01-.078a.686.686 0 01.127-.246l.413-.562c.272-.377.537-.76.792-1.147l.167-.258c.605-.95 1.1-1.949 1.206-3.095l.021-.323a6.198 6.198 0 00-.535-2.797l-.117-.251c-.846-1.725-2.28-2.748-4.131-3.233l-.285-.068c-1.701-.362-3.292.054-4.748 1.003l-.704.478c-.698.49-1.377 1.01-2.072 1.505l-.646.478c-1.914 1.462-3.61 3.17-5.353 4.823l-.75.692c-.757.684-1.535 1.348-2.297 2.029l-.399.364-.391.372-.072.073c-.086.093-.13.168-.136.24H0C0 8.904 8.955 0 19.999 0z"></path>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <button class="tmu-popup-close">&times;</button>
                </div>
                
                <form class="tmu-popup-form" novalidate>
                    <div class="tmu-popup-field">
                        <label class="tmu-popup-label">NOME*</label>
                        <input type="text" name="firstName" placeholder="Nome" class="tmu-popup-input" required>
                        <div class="tmu-popup-error" data-error-for="firstName">Inserisci il nome</div>
                    </div>
                    
                    <div class="tmu-popup-field">
                        <label class="tmu-popup-label">COGNOME*</label>
                        <input type="text" name="lastName" placeholder="Cognome" class="tmu-popup-input" required>
                        <div class="tmu-popup-error" data-error-for="lastName">Inserisci il cognome</div>
                    </div>
                    
                    <div class="tmu-popup-field">
                        <label class="tmu-popup-label">E-MAIL*</label>
                        <input type="email" name="email" placeholder="Il tuo indirizzo email" class="tmu-popup-input" required>
                        <div class="tmu-popup-error" data-error-for="email">Inserisci un indirizzo email valido</div>
                    </div>
                    
                    <div class="tmu-popup-payment-methods">
                        <h3 class="tmu-popup-methods-title">Metodo di pagamento</h3>
                        <div class="tmu-popup-methods-grid">
                            <div class="tmu-popup-method active" data-method="card">
                                <div class="tmu-popup-credit-cards">
                                    <span>💳</span> Carte di credito
                                </div>
                            </div>
                            <div class="tmu-popup-method" data-method="paypal">
                                <div class="tmu-popup-paypal">
                                    <svg width="120" height="40" viewBox="0 0 780 500" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="780" height="500" fill="transparent"/>
                                        <path d="m168.38 169.85c-8.399-5.774-19.359-8.668-32.88-8.668h-52.346c-4.145 0-6.435 2.073-6.87 6.214l-21.265 133.48c-0.221 1.311 0.107 2.51 0.981 3.6 0.869 1.093 1.962 1.636 3.271 1.636h24.864c4.361 0 6.758-2.068 7.198-6.216l5.888-35.985c0.215-1.744 0.982-3.162 2.291-4.254 1.308-1.09 2.944-1.804 4.907-2.13 1.963-0.324 3.814-0.487 5.562-0.487 1.743 0 3.814 0.11 6.217 0.327 2.397 0.218 3.925 0.324 4.58 0.324 18.756 0 33.478-5.285 44.167-15.866 10.684-10.577 16.032-25.244 16.032-44.004 0-12.868-4.202-22.192-12.597-27.975zm-26.99 40.08c-1.094 7.635-3.926 12.649-8.506 15.049-4.581 2.403-11.124 3.597-19.629 3.597l-10.797 0.328 5.563-35.007c0.434-2.397 1.851-3.597 4.252-3.597h6.218c8.72 0 15.049 1.257 18.975 3.761 3.924 2.51 5.233 7.802 3.924 15.869z" fill="#003087"/>
                                        <path d="m720.79 161.18h-24.208c-2.405 0-3.821 1.2-4.253 3.599l-21.267 136.1-0.328 0.654c0 1.096 0.437 2.127 1.311 3.109 0.868 0.979 1.963 1.471 3.271 1.471h21.595c4.138 0 6.429-2.068 6.871-6.215l21.265-133.81v-0.325c-2e-3 -3.053-1.424-4.58-4.257-4.58z" fill="#009CDE"/>
                                        <path d="m428.31 213.86c0-1.088-0.438-2.126-1.306-3.106-0.875-0.981-1.857-1.474-2.945-1.474h-25.191c-2.404 0-4.366 1.096-5.89 3.271l-34.679 51.04-14.394-49.075c-1.096-3.488-3.493-5.236-7.198-5.236h-24.54c-1.093 0-2.075 0.492-2.942 1.474-0.875 0.98-1.309 2.019-1.309 3.106 0 0.44 2.127 6.871 6.379 19.303 4.252 12.434 8.833 25.848 13.741 40.244 4.908 14.394 7.468 22.031 7.688 22.898-17.886 24.43-26.826 37.518-26.826 39.26 0 2.838 1.417 4.254 4.253 4.254h25.191c2.399 0 4.361-1.088 5.89-3.271l83.427-120.4c0.433-0.433 0.651-1.193 0.651-2.289z" fill="#003087"/>
                                        <path d="m662.89 209.28h-24.865c-3.056 0-4.904 3.599-5.559 10.797-5.677-8.72-16.031-13.088-31.083-13.088-15.704 0-29.065 5.89-40.077 17.668-11.016 11.779-16.521 25.631-16.521 41.551 0 12.871 3.761 23.121 11.285 30.752 7.524 7.639 17.611 11.451 30.266 11.451 6.323 0 12.757-1.311 19.3-3.926 6.544-2.617 11.665-6.105 15.379-10.469 0 0.219-0.222 1.198-0.654 2.942-0.44 1.748-0.655 3.06-0.655 3.926 0 3.494 1.414 5.234 4.254 5.234h22.576c4.138 0 6.541-2.068 7.193-6.216l13.415-85.389c0.215-1.309-0.111-2.507-0.981-3.599-0.876-1.087-1.964-1.634-3.273-1.634zm-42.694 64.452c-5.562 5.453-12.269 8.179-20.12 8.179-6.328 0-11.449-1.742-15.377-5.234-3.928-3.483-5.891-8.282-5.891-14.396 0-8.064 2.727-14.884 8.181-20.446 5.446-5.562 12.214-8.343 20.284-8.343 6.102 0 11.174 1.8 15.212 5.397 4.032 3.599 6.055 8.563 6.055 14.888-1e-3 7.851-2.783 14.505-8.344 19.955z" fill="#009CDE"/>
                                        <path d="m291.23 209.28h-24.864c-3.058 0-4.908 3.599-5.563 10.797-5.889-8.72-16.25-13.088-31.081-13.088-15.704 0-29.065 5.89-40.078 17.668-11.016 11.779-16.521 25.631-16.521 41.551 0 12.871 3.763 23.121 11.288 30.752 7.525 7.639 17.61 11.451 30.262 11.451 6.104 0 12.433-1.311 18.975-3.926 6.543-2.617 11.778-6.105 15.704-10.469-0.875 2.616-1.309 4.907-1.309 6.868 0 3.494 1.417 5.234 4.253 5.234h22.574c4.141 0 6.543-2.068 7.198-6.216l13.413-85.389c0.215-1.309-0.112-2.507-0.981-3.599-0.873-1.087-1.962-1.634-3.27-1.634zm-42.695 64.614c-5.563 5.351-12.382 8.017-20.447 8.017-6.329 0-11.4-1.742-15.214-5.234-3.819-3.483-5.726-8.282-5.726-14.396 0-8.064 2.725-14.884 8.18-20.446 5.449-5.562 12.211-8.343 20.284-8.343 6.104 0 11.175 1.8 15.214 5.398 4.032 3.599 6.052 8.563 6.052 14.888 0 8.069-2.781 14.778-8.343 20.116z" fill="#003087"/>
                                        <path d="m540.04 169.85c-8.398-5.774-19.356-8.668-32.879-8.668h-52.02c-4.364 0-6.765 2.073-7.197 6.214l-21.266 133.48c-0.221 1.312 0.106 2.511 0.981 3.601 0.865 1.092 1.962 1.635 3.271 1.635h26.826c2.617 0 4.361-1.416 5.235-4.252l5.89-37.949c0.216-1.744 0.98-3.162 2.29-4.254 1.309-1.09 2.943-1.803 4.908-2.13 1.962-0.324 3.812-0.487 5.562-0.487 1.743 0 3.814 0.11 6.214 0.327 2.399 0.218 3.931 0.324 4.58 0.324 18.76 0 33.479-5.285 44.168-15.866 10.688-10.577 16.031-25.244 16.031-44.004 2e-3 -12.867-4.199-22.191-12.594-27.974zm-33.534 53.82c-4.799 3.271-11.997 4.906-21.592 4.906l-10.47 0.328 5.562-35.007c0.432-2.397 1.849-3.597 4.252-3.597h5.887c4.798 0 8.614 0.218 11.454 0.653 2.831 0.44 5.562 1.799 8.179 4.089 2.618 2.291 3.926 5.618 3.926 9.98 0 9.16-2.402 15.375-7.198 18.648z" fill="#009CDE"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tmu-popup-card-fields">
                        <div class="tmu-popup-field">
                            <label class="tmu-popup-label">NOME INTESTATARIO*</label>
                            <input type="text" name="cardholderName" placeholder="Nome sulla carta" class="tmu-popup-input" required>
                            <div class="tmu-popup-error" data-error-for="cardholderName">Inserisci il nome dell'intestatario</div>
                        </div>
                        
                        <div class="tmu-popup-field">
                            <label class="tmu-popup-label">DETTAGLI CARTA*</label>
                            <div class="tmu-popup-card-input-container">
                                <svg class="tmu-popup-card-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                                </svg>
                                <div id="tmu-card-element" class="tmu-popup-input tmu-popup-card-input"></div>
                            </div>
                            <div class="tmu-popup-error" data-error-for="card">Inserisci i dettagli della carta</div>
                        </div>
                    </div>
                    
                    
                    <div class="tmu-popup-checkbox-container">
                        <input type="checkbox" name="agreeToTerms" id="agreeToTerms" class="tmu-popup-checkbox" required>
                        <label for="agreeToTerms" class="tmu-popup-checkbox-label">
                            Accetto i <a href="https://trustmeup.com/it/legal/donor-terms/17/" target="_blank" rel="noopener noreferrer" class="tmu-popup-link">Termini d'uso</a> 
                            e ho letto l'<a href="https://trustmeup.com/it/legal/privacy-policy/29/" target="_blank" rel="noopener noreferrer" class="tmu-popup-link">Informativa sulla privacy</a>
                        </label>
                        <div class="tmu-popup-error" data-error-for="agreeToTerms">Devi accettare i Termini d'uso</div>
                    </div>
                    
                    <div class="tmu-popup-error-message" style="display: none;">
                        <div class="tmu-popup-error-text"></div>
                    </div>
                    
                    <div class="tmu-popup-buttons">
                        <button type="button" class="tmu-popup-button tmu-popup-button-cancel">Annulla</button>
                        <button type="submit" class="tmu-popup-button tmu-popup-button-submit">CONTINUA</button>
                    </div>
                </form>
            </div>
        `;

        // Add event listeners
        const closeBtn = popup.querySelector('.tmu-popup-close');
        const cancelBtn = popup.querySelector('.tmu-popup-button-cancel');
        const form = popup.querySelector('.tmu-popup-form');
        const paymentMethods = popup.querySelectorAll('.tmu-popup-method');
        const cardFields = popup.querySelector('.tmu-popup-card-fields');
        const submitBtn = popup.querySelector('.tmu-popup-button-submit');

        async function setupStripeIfNeeded() {
            try {
                if (!config.stripePublicKey) return;
                if (!stripe) {
                    stripe = await loadStripeJs(config.stripePublicKey);
                }
                if (!elements) {
                    elements = stripe.elements();
                }
                if (!cardElement) {
                    const style = { base: { fontSize: '16px' } };
                    cardElement = elements.create('card', { style });
                    const mountPoint = popup.querySelector('#tmu-card-element');
                    if (mountPoint && !mountPoint.hasChildNodes()) {
                        cardElement.mount(mountPoint);
                    }
                }
            } catch (e) {
                // no-op; handled on submit
            }
        }

        closeBtn.addEventListener('click', () => {
            TMUPayment.close();
            config.onCancel();
        });

        cancelBtn.addEventListener('click', () => {
            TMUPayment.close();
            config.onCancel();
        });

        // Payment method selection
        paymentMethods.forEach(method => {
            method.addEventListener('click', async () => {
                // Remove active class from all methods
                paymentMethods.forEach(m => m.classList.remove('active'));
                // Add active class to clicked method
                method.classList.add('active');

                // Show/hide card fields based on selection
                if (method.dataset.method === 'card') {
                    cardFields.classList.remove('hidden');
                    await setupStripeIfNeeded();
                } else {
                    cardFields.classList.add('hidden');
                }
            });
        });

        // Mount Stripe card immediately if card is default selected
        const defaultMethod = popup.querySelector('.tmu-popup-method.active');
        if (defaultMethod && defaultMethod.dataset.method === 'card') {
            setupStripeIfNeeded();
        }

        // Clear error message when user interacts with form
        const inputs = popup.querySelectorAll('.tmu-popup-input, .tmu-popup-checkbox');
        inputs.forEach(input => {
            input.addEventListener('input', hideErrorMessage);
            input.addEventListener('change', hideErrorMessage);
        });

        function setError(name, message) {
            const err = popup.querySelector(`[data-error-for="${name}"]`);
            const input = popup.querySelector(`[name="${name}"]`);
            if (err) { err.textContent = message; err.style.display = 'block'; }
            if (input) { input.classList.add('tmu-input-error'); }
        }

        function clearErrors() {
            popup.querySelectorAll('.tmu-popup-error').forEach(el => el.style.display = 'none');
            popup.querySelectorAll('.tmu-input-error').forEach(el => el.classList.remove('tmu-input-error'));
            hideErrorMessage();
        }

        function showErrorMessage(message) {
            const errorMessage = popup.querySelector('.tmu-popup-error-message');
            const errorText = popup.querySelector('.tmu-popup-error-text');
            if (errorMessage && errorText) {
                errorText.textContent = message;
                errorMessage.style.display = 'block';
            }
        }

        function hideErrorMessage() {
            const errorMessage = popup.querySelector('.tmu-popup-error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }

        function validateFields() {
            clearErrors();
            let valid = true;
            const get = (n) => (popup.querySelector(`[name="${n}"]`) || {}).value || '';
            const email = get('email').trim();
            const first = get('firstName').trim();
            const last = get('lastName').trim();
            const method = popup.querySelector('.tmu-popup-method.active').dataset.method;
            if (!first) { setError('firstName', 'Inserisci il nome'); valid = false; }
            if (!last) { setError('lastName', 'Inserisci il cognome'); valid = false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Inserisci un indirizzo email valido'); valid = false; }
            if (!popup.querySelector('#agreeToTerms').checked) { setError('agreeToTerms', "Devi accettare i Termini d'uso"); valid = false; }
            if (method === 'card') {
                const holder = get('cardholderName').trim();
                if (!holder) { setError('cardholderName', "Inserisci il nome dell'intestatario"); valid = false; }
            }
            return valid;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateFields()) { return; }
            submitBtn.disabled = true;
            const formData = new FormData(form);
            const selectedMethod = popup.querySelector('.tmu-popup-method.active').dataset.method;
            const email = (formData.get('email') || '').toString().trim();
            const firstName = (formData.get('firstName') || '').toString().trim();
            const lastName = (formData.get('lastName') || '').toString().trim();

            try {
                let transactionId = null;
                let paymentMethodId = null;
                let requiresRedirect = false;

                if (!config.stripePublicKey) {
                    throw new Error('Chiave pubblicabile Stripe non configurata');
                }

                if (!stripe) {
                    stripe = await loadStripeJs(config.stripePublicKey);
                    elements = stripe.elements();
                }

                if (selectedMethod === 'card') {
                    if (!cardElement) {
                        const style = { base: { fontSize: '16px' } };
                        cardElement = elements.create('card', { style });
                        const mountPoint = popup.querySelector('#tmu-card-element');
                        if (mountPoint && !mountPoint.hasChildNodes()) {
                            cardElement.mount(mountPoint);
                        }
                    }

                    const cardholderName = (formData.get('cardholderName') || '').toString().trim();

                    const pmResult = await stripe.createPaymentMethod({
                        type: 'card',
                        card: cardElement,
                        billing_details: { name: cardholderName, email }
                    });
                    if (pmResult.error) {
                        throw new Error(pmResult.error.message || 'Errore creazione metodo di pagamento');
                    }

                    paymentMethodId = pmResult.paymentMethod.id;
                } else if (selectedMethod === 'paypal') {
                    // For PayPal, we need to create a payment method first
                    const pmResult = await stripe.createPaymentMethod({
                        type: 'paypal',
                        billing_details: {
                            email,
                            name: `${firstName} ${lastName}`.trim(),
                        }
                    });
                    if (pmResult.error) {
                        throw new Error(pmResult.error.message || 'Errore creazione metodo di pagamento PayPal');
                    }
                    paymentMethodId = pmResult.paymentMethod.id;
                } else {
                    throw new Error('Metodo di pagamento non supportato');
                }

                const payload = {
                    amount: String(config.amount),
                    intendedEmail: email,
                    firstName,
                    lastName,
                    phoneNumber: '',
                    stripePaymentMethodType: selectedMethod,
                    taxId: '',
                    vatNumber: '',
                    note: ''
                };
                if (paymentMethodId) {
                    payload.stripePaymentMethodId = paymentMethodId;
                }

                const donationResp = await fetch((config.baseUrl || '') + 'https://platform.alpha.trustmeup.com/api/integration/v1/donations/create-donation/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...(config.headers || {}) },
                    body: JSON.stringify(payload)
                });
                if (!donationResp.ok) {
                    const t = await donationResp.text();
                    throw new Error(t || 'Errore creazione donazione');
                }
                const donationJson = await donationResp.json();

                const clientSecret = donationJson.stripeClientSecret || donationJson.stripe_client_secret;
                if (!clientSecret) {
                    throw new Error('Client secret non disponibile');
                }

                const isSetupIntent = clientSecret.startsWith('seti_');
                let confirmResult = null;

                if (selectedMethod === 'card') {
                    confirmResult = isSetupIntent
                        ? await stripe.confirmCardSetup(clientSecret, { payment_method: paymentMethodId })
                        : await stripe.confirmCardPayment(clientSecret, { payment_method: paymentMethodId });
                } else if (selectedMethod === 'paypal') {
                    // Handle relative URLs by converting them to absolute URLs
                    let returnUrlString = config.returnUrl || window.location.href;
                    if (returnUrlString.startsWith('/')) {
                        returnUrlString = window.location.origin + returnUrlString;
                    }
                    const returnUrl = new URL(returnUrlString);
                    returnUrl.searchParams.set('tmuPayPal', '1');
                    const confirmOptions = {
                        return_url: returnUrl.toString(),
                        payment_method: {
                            billing_details: {
                                email,
                                name: `${firstName} ${lastName}`.trim(),
                            }
                        }
                    };
                    confirmResult = isSetupIntent
                        ? await stripe.confirmPayPalSetup(clientSecret, confirmOptions)
                        : await stripe.confirmPayPalPayment(clientSecret, confirmOptions);
                }

                if (confirmResult?.error) {
                    throw new Error(confirmResult.error.message || 'Conferma pagamento fallita');
                }

                const finalIntent = confirmResult?.setupIntent || confirmResult?.paymentIntent;
                if (finalIntent) {
                    transactionId = finalIntent.id || transactionId;
                    paymentMethodId = finalIntent.payment_method || paymentMethodId;
                    requiresRedirect = finalIntent.status === 'requires_action' || finalIntent.status === 'requires_confirmation';
                    if (!requiresRedirect && finalIntent.status && !['succeeded', 'processing', 'requires_capture'].includes(finalIntent.status)) {
                        throw new Error('Pagamento non completato');
                    }
                }

                if (!requiresRedirect) {
                    TMUPayment.close();
                    if (config.returnUrl) {
                        try {
                            // Handle relative URLs by converting them to absolute URLs
                            let returnUrlString = config.returnUrl;
                            if (returnUrlString.startsWith('/')) {
                                returnUrlString = window.location.origin + returnUrlString;
                            }
                            window.location.assign(returnUrlString);
                        } catch (_) {
                            window.location.href = config.returnUrl;
                        }
                        return;
                    }
                }
                config.onSuccess({ success: true, transactionId, paymentMethodId, donation: donationJson, requiresRedirect, returnUrl: config.returnUrl || null });
            } catch (error) {
                const errorMessage = error.message || 'Pagamento non riuscito';
                showErrorMessage(errorMessage);
                config.onError(errorMessage);
            } finally {
                submitBtn.disabled = false;
            }
        });

        // Close on backdrop click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                TMUPayment.close();
                config.onCancel();
            }
        });

        return popup;
    }

    return TMUPayment;

})();

/**
 * Usage Examples:
 * 
 * Basic usage:
 * TMUPayment.open({
 *   amount: 250.00,
 *   onSuccess: (result) => console.log('Pagamento riuscito:', result),
 *   onCancel: () => console.log('Pagamento annullato')
 * });
 * 
 * Advanced usage:
 * TMUPayment.open({
 *   amount: 150.75,
 *   currency: 'USD',
 *   onSuccess: (result) => {
 *     console.log('Transaction ID:', result.transactionId);
 *     window.location.href = '/success';
 *   },
 *   onCancel: () => {
 *     console.log('Pagamento annullato dall\'utente');
 *   },
 *   onError: (error) => {
 *     console.error('Pagamento non riuscito:', error);
 *     alert('Pagamento non riuscito. Riprova.');
 *   }
 * });
 * 
 * Close programmatically:
 * TMUPayment.close();
 */
