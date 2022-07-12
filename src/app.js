import i18next from 'i18next';
import { differenceBy } from 'lodash';
import $ from 'jquery';
import * as yup from 'yup';
import resources from './locales';
import initView from './view';
import state from './state';
import parse from './parser';
import loadRSS from './loadRSS';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  yup.setLocale({
    string: {
      url: i18next.t('form.validation.url'),
    },
  });

  const addFeed = (feedData, urlId, view) => {
    const feedId = view.feeds.length + 1;
    const feed = { id: feedId, urlId, ...feedData };
    view.feeds.push(feed);
    return feedId;
  };

  const addPosts = (postsData, feedId, view) => {
    const postlength = view.posts.length;
    const posts = postsData.map((post, index) => ({
      feedId, ...post, isWatched: false, id: index + postlength + 1,
    }));
    view.posts.push(...posts);
    return posts;
  };

  const view = initView(state, i18next);

  const updateRSS = (urlId) => {
    const url = view.urls.find((value) => value.id === urlId);
    const feed = view.feeds.find((value) => value.urlId === url.id);
    const posts = view.posts.filter((value) => value.feedId === feed.id);

    setTimeout(() => loadRSS(url.url)
      .then((data) => parse(data))
      .then((data) => {
        const diff = differenceBy(posts, data.posts, 'title');
        addPosts(diff, feed.id, view);
      })
      .then(() => updateRSS(urlId))
      .catch((error) => {
        console.warn(`Error during checking new posts for url - ${url.url}`);
        console.error(error);

        return updateRSS(urlId);
      }), 5000);
  };

  $('.display-3').get()[0].textContent = i18next.t('head');
  $('.lead').get()[0].textContent = i18next.t('lead');
  $(':input#url-input').attr('placeholder', i18next.t('form.input.label'));
  $(':button').text(i18next.t('form.button'));
  $('.modal-footer').find('.btn-primary').get()[0].textContent = i18next.t('modal.read');
  $('.modal-footer').find('.btn-secondary').get()[0].textContent = i18next.t('modal.close');
  $('.modal-header').find('button').get()[0].textContent = '';

  $('.rss-form').on('submit', (event) => {
    const form = new FormData(event.target);
    const url = { id: view.urls.length + 1, url: form.get('url') };

    yup.string().url()
      .notOneOf(view.urls.map((value) => value.url), i18next.t('form.validation.notOneOf'))
      .validate(form.get('url'))
      .then(() => loadRSS(url.url))
      .then((html) => parse(html))
      .then(({ feed, posts }) => {
        const feedId = addFeed(feed, url.id, view);
        addPosts(posts, feedId, view);
      })
      .then(() => {
        view.urls.push(url);
        view.form.url = '';
        view.form.errors = [];
        view.form.isValid = true;
      })
      .then(() => updateRSS(url.id))
      .catch((error) => {
        view.form.errors = [];
        view.form.isValid = false;

        const { message } = error;
        const [invalidMatch] = /Invalid url|Network error/i.exec(message) || [];

        switch (invalidMatch) {
          case 'Invalid url':
            view.form.errors.push(i18next.t('errors.invalidURL'));
            break;
          case 'Network error':
            view.form.errors.push(i18next.t('errors.network'));
            break;
          default:
            view.form.errors.push(message);
        }
      });

    event.preventDefault();
  });
};
