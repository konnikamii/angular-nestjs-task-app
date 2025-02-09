import { Component, OnInit } from '@angular/core';
import { toastMessage } from '../../utils_other/helperFunctions';

interface ConsentData {
  ad_storage: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  personalization_storage: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  security_storage: 'granted' | 'denied';
}

const acceptAll: ConsentData = {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  personalization_storage: 'granted',
  functionality_storage: 'granted',
  security_storage: 'granted',
};

const rejectAll: ConsentData = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  personalization_storage: 'denied',
  functionality_storage: 'denied',
  security_storage: 'denied',
};

const bannerDelay = 500;

@Component({
  selector: 'app-cookies',
  imports: [],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss',
})
export class CookiesComponent implements OnInit {
  ngOnInit(): void {
    const banner = document.getElementById('cookie-consent-banner');
    const settingsPopup = document.getElementById('cookie-settings-popup');
    const popupClose = document.querySelectorAll('#closing-popup-element');
    const btnSettings = document.getElementById('btn-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const btnAcceptAll = document.getElementById('btn-accept-all');
    const btnRejectAll = document.getElementById('btn-reject-all');
    const btnReopenCookies = document.getElementById('nav-footer-cookies');

    const analyticsInput = document.getElementById(
      'consent-analytics'
    ) as HTMLInputElement;
    const marketingInput = document.getElementById(
      'consent-marketing'
    ) as HTMLInputElement;

    if (banner) {
      try {
        const storedConsentData = localStorage.getItem('ucData');
        const expiration = localStorage.getItem('ucDataExpire');
        if (storedConsentData) {
          const parsedConsentData = JSON.parse(
            storedConsentData
          ) as ConsentData;
          analyticsInput.checked =
            parsedConsentData.analytics_storage === 'granted';
          marketingInput.checked = parsedConsentData.ad_storage === 'granted';
          const isAnyDenied = Object.values(parsedConsentData).some(
            (value) => value === 'denied'
          );
          if (isAnyDenied) {
            if (expiration) {
              const currentTime = new Date().getTime();
              const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
              if (currentTime - parseInt(expiration) > oneDayInMilliseconds) {
                setTimeout(() => {
                  banner.classList.add('show');
                }, bannerDelay);
              }
            } else {
              setTimeout(() => {
                banner.classList.add('show');
              }, bannerDelay);
            }
          } else {
            banner.style.display = 'none';
          }
        } else {
          setTimeout(() => {
            banner.classList.add('show');
          }, bannerDelay);
        }
      } catch (error) {
        console.error('Failed to parse consent data:', error);
        setTimeout(() => {
          banner.style.display = 'fixed';
          banner.style.opacity = '1';
        }, bannerDelay);
      }

      settingsPopup?.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      const hideSettingsPopup = () => {
        if (settingsPopup) settingsPopup.style.display = 'none';
      };
      const showSettingsPopup = () => {
        if (settingsPopup) settingsPopup.style.display = 'flex';
      };
      popupClose.forEach((element) => {
        element.addEventListener('click', hideSettingsPopup);
      });
      btnSettings?.addEventListener('click', showSettingsPopup);
      btnReopenCookies?.addEventListener('click', showSettingsPopup);

      btnSaveSettings?.addEventListener('click', () => {
        const newConsentData = {
          ad_storage: marketingInput.checked ? 'granted' : 'denied',
          analytics_storage: analyticsInput.checked ? 'granted' : 'denied',
          ad_user_data: marketingInput.checked ? 'granted' : 'denied',
          ad_personalization: marketingInput.checked ? 'granted' : 'denied',
          personalization_storage: analyticsInput.checked
            ? 'granted'
            : 'denied',
          functionality_storage: analyticsInput.checked ? 'granted' : 'denied',
          security_storage: analyticsInput.checked ? 'granted' : 'denied',
        };
        toastMessage(
          'Successfully updated your cookie preferences',
          'success',
          1500
        );
        localStorage.setItem('ucData', JSON.stringify(newConsentData));
        if (!analyticsInput.checked || !marketingInput.checked) {
          localStorage.setItem('ucDataExpire', new Date().getTime().toString());
        }
        hideSettingsPopup();
        banner.classList.remove('show');
        setTimeout(() => {
          banner.style.display = 'none';
        }, 500);
      });

      btnAcceptAll?.addEventListener('click', () => {
        toastMessage(
          'Successfully updated your cookie preferences',
          'success',
          1500
        );
        localStorage.setItem('ucData', JSON.stringify(acceptAll));
        banner.classList.remove('show');
        setTimeout(() => {
          banner.style.display = 'none';
        }, 500);
      });

      btnRejectAll?.addEventListener('click', () => {
        toastMessage(
          'Successfully updated your cookie preferences',
          'success',
          1500
        );
        localStorage.setItem('ucData', JSON.stringify(rejectAll));
        localStorage.setItem('ucDataExpire', new Date().getTime().toString());
        banner.classList.remove('show');
        setTimeout(() => {
          banner.style.display = 'none';
        }, 500);
      });
    }
  }
}
