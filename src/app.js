import i18next from 'i18next';
import $ from 'jquery';
import * as yup from 'yup';
import resources from './locales';
import view from './view';

const schema = yup.string().url()
  .matches(/.*rss$/, 'Url doesn\'t contain valid rss resource.')
  .notOneOf(view.urls);

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

  $('.rss-form').on('submit', (event) => {
    const form = new FormData(event.target);

    view.form.isValid = true;
    view.form.errors = [];

    schema.validate(form.get('url'))
      .then(() => {
        view.url = '';
        view.form.isValid = true;
        view.form.errors = [];
      })
      .catch((error) => {
        view.form.errors.push(error.message);
        view.form.isValid = false;
      });

    event.preventDefault();
  });
};
