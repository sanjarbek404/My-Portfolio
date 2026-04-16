import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation();
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId) return;

    // Only inject if it doesn't exist yet
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(script2);
    }
  }, [gaId]);

  useEffect(() => {
    if (gaId && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, gaId]);

  return null;
};
