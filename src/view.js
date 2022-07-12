import onChange from 'on-change';
import $ from 'jquery';

const label = $('label[for=\'url-input\']');

const onClick = (state, postId) => (event) => {
  const post = state.posts.find((pt) => pt.id === Number(postId));
  const { title, description, link } = post;
  post.isWatched = true;

  const [readButton] = $('.modal-footer').find('.btn-primary').get();

  $('.modal-title').text(title);
  $('.modal-body').text(description);
  readButton.setAttribute('href', link);
  event.preventDefault();
};

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
    list.empty();
    state.posts.forEach((post, index) => {
      const {
        id, title, description, link, isWatched,
      } = post;

      const li = document.createElement('li');
      const p = document.createElement('p');
      const a = document.createElement('a');
      const button = document.createElement('button');

      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.setAttribute('type', 'button');
      button.setAttribute('data-id', index);
      button.addEventListener('click', onClick(state, post.id));
      button.textContent = i18next.t('list.posts.button');

      if (!isWatched) {
        a.classList.add('fw-bold');
      } else {
        a.classList.add('fw-normal', 'link-secondary');
      }
      a.setAttribute('data-id', id);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.href = link;
      a.textContent = title;
      a.addEventListener('click', (event) => {
        const el = event.target;
        const postId = el.dataset.id;
        const currentPost = state.posts.find((pt) => pt.id === Number(postId));
        currentPost.isWatched = true;
      });

      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;

      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      li.append(a);
      li.append(button);

      list.append(li);
    });
  }
});
