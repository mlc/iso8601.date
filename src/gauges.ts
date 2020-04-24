/* eslint-disable no-underscore-dangle */

declare global {
  interface Window {
    _gauges: any;
  }
}

window._gauges = window._gauges || [];
const gauges = () => {
  const t = document.createElement('script');
  t.type = 'text/javascript';
  t.async = true;
  t.id = 'gauges-tracker';
  t.setAttribute('data-site-id', '5ccbdd3e3d83ae065ca1b419');
  t.setAttribute('data-track-path', 'https://track.gaug.es/track.gif');
  t.src = 'https://d2fuc4clr7gvcn.cloudfront.net/track.js';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode?.insertBefore(t, s);
};

export default gauges;
