import i18next from 'i18next';
import $ from 'jquery';
import * as yup from 'yup';
import resources from './locales';
import initView from './view';
import state from './state';

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });

  yup.setLocale({
    string: {
      matches: i18next.t('form.validation.matches'),
      email: i18next.t('form.validation.email'),
    },
  });

  const view = initView(state, i18next);

  $('.display-3').text(i18next.t('head'));
  $('.lead').text(i18next.t('lead'));
  $(':input#url-input').attr('placeholder', i18next.t('form.input.label'));
  $(':button').text(i18next.t('form.button'));

  $('.rss-form').on('submit', (event) => {
    const form = new FormData(event.target);

    yup.string().url()
      .matches(/.*rss$/)
      .notOneOf(view.urls, i18next.t('form.validation.notOneOf'))
      .validate(form.get('url'))
      .then((url) => {
        view.urls.push(url);
        view.form.url = '';
        view.form.errors = [];
        view.form.isValid = true;
      })
      .catch((error) => {
        view.form.errors = [];
        view.form.errors.push(error.message);
        view.form.isValid = false;
      });

    event.preventDefault();
  });
};
