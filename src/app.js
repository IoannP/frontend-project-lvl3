import i18next from 'i18next';
import $ from 'jquery';
import resources from './locales';

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });

  $('.display-3').text(i18next.t('head'));
  $('.lead').text(i18next.t('lead'));
  $(':input#url-input').attr('placeholder', i18next.t('input.label'));
  $(':button').text(i18next.t('button'));
};
