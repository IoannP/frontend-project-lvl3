import onChange from 'on-change';
import $ from 'jquery';

const label = $('label[for=\'url-input\']');

export default (state, i18next) => onChange(state, (path, value) => {
  if (path === 'form.isValid') {
    if (value === true) {
      $(':input#url-input').val(state.form.url);
      label.removeClass('text-danger').text(i18next.t('form.successfullAdition')).addClass('text-success');
    } else {
      label.text(state.form.errors.join(' ')).addClass('text-danger');
    }
  }

  if (path === 'form.errors') {
    if (state.form.isValid === false) {
      label.text(state.form.errors.join(' ')).addClass('text-danger');
    }
  }

  if (path === 'feeds') {
    const feeds = $('.feeds');
    if (feeds.children().length === 0) {
      const card = document.createElement('div');
      const cardBody = document.createElement('div');
      const title = document.createElement('h2');
      const list = document.createElement('ul');

      list.classList.add('list-group', 'border-0', 'rounded-0');
      card.classList.add('card', 'border-0');
      cardBody.classList.add('card-body');
      title.classList.add('card-title', 'h4');
      title.textContent = i18next.t('list.feeds.title');

      cardBody.appendChild(title);
      card.appendChild(cardBody);
      card.appendChild(list);

      feeds.append(card);
    }

    const list = feeds.children().find('ul');
    list.empty();
    state.feeds.forEach(({ title, description }) => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');

      li.classList.add('list-group-item', 'border-0', 'border-end-0');

      h3.classList.add('h6', 'm-0');
      h3.textContent = title;

      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;

      li.append(h3);
      li.append(p);

      list.append(li);
    });
  }

  if (path === 'posts') {
    const posts = $('.posts');
    if (posts.children().length === 0) {
      const card = document.createElement('div');
      const cardBody = document.createElement('div');
      const title = document.createElement('h2');
      const list = document.createElement('ul');

      list.classList.add('list-group', 'border-0', 'rounded-0');
      card.classList.add('card', 'border-0');
      cardBody.classList.add('card-body');
      title.classList.add('card-title', 'h4');
      title.textContent = i18next.t('list.posts.title');

      cardBody.appendChild(title);
      card.appendChild(cardBody);
      card.appendChild(list);

      posts.append(card);
    }

    const list = posts.children().find('ul');
    state.posts.forEach(({ title, description, link }) => {
      const li = document.createElement('li');
      const p = document.createElement('p');
      const a = document.createElement('a');

      a.classList.add('fw-bold');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.href = link;
      a.textContent = title;

      li.classList.add('list-group-item', 'border-0', 'border-end-0');

      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;

      li.append(a);
      list.append(li);
    });
  }
});
