import i18next from 'i18next';
import $ from 'jquery';
import * as yup from 'yup';
import resources from './locales';
import initView from './view';

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });

  const view = initView(i18next);

  $('.display-3').text(i18next.t('head'));
  $('.lead').text(i18next.t('lead'));
  $(':input#url-input').attr('placeholder', i18next.t('input.label'));
  $(':button').text(i18next.t('button'));

  $('.rss-form').on('submit', (event) => {
    const form = new FormData(event.target);

    yup.string().url()
      .matches(/.*rss$/, 'Url doesn\'t contain valid rss resource.')
      .notOneOf(view.urls, 'Url have been already added.')
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
