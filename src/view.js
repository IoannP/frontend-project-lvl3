import onChange from 'on-change';
import $ from 'jquery';
import state from './state';

const label = $('label[for=\'url-input\']');

export default (i18next) => onChange(state, (path, value) => {
  if (path === 'form.isValid') {
    if (value === true) {
      $(':input#url-input').val(state.form.url);
      label.removeClass('text-danger').text('RSS was added successfully').addClass('text-success');
    } else {
      label.text(state.form.errors.join(' ')).addClass('text-danger');
    }
  }

  if (path === 'form.errors') {
    if (state.form.isValid === false) {
      label.text(state.form.errors.join(' ')).addClass('text-danger');
    }
  }
});
