import i18next from 'i18next';
import $ from 'jquery';
import * as yup from 'yup';
import resources from './locales';
import initView from './view';
import state from './state';
import parse from './parser';

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });

  yup.setLocale({
    string: {
      url: i18next.t('form.validation.url'),
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
      .notOneOf(view.urls, i18next.t('form.validation.notOneOf'))
      .validate(form.get('url'))
      .then((url) => {
        view.urls.push(url);
        view.form.url = '';
        view.form.errors = [];
        view.form.isValid = true;
        return url;
      })
      .then((url) => fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          const isRss = (/application\/rss\+xml;/).test(data.status.content_type);
          if (isRss) {
            return data.contents;
          }
          throw new Error(i18next.t('form.validation.invalidRssResouce'));
        }))
      .then((html) => parse(html, view.feeds.length))
      .then(({ feed, posts }) => {
        view.feeds.push(feed);
        view.posts.push(...posts);
      })
      .catch((error) => {
        view.form.errors = [];
        view.form.errors.push(error.message);
        view.form.isValid = false;
      });

    event.preventDefault();
  });
};
