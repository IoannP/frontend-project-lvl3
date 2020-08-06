import i18next from 'i18next';
import 'bootstrap';

import resources from './locales';

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });

  const head = document.getElementsByClassName('display-3')[0];
  head.innerHTML = i18next.t('head');
  const lead = document.getElementsByClassName('lead')[0];
  lead.innerHTML = i18next.t('lead');
  const input = document.getElementsByClassName('form-control')[0];
  input.placeholder = i18next.t('input.placeholder');
  const btn = document.getElementsByTagName('button')[0];
  btn.innerHTML = i18next.t('button');
};
