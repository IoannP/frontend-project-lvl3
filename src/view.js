import onChange from 'on-change';
import $ from 'jquery';
import state from './state';

const label = $('label[for=\'url-input\']');

export default onChange(state, (path, value) => {
  label.text('').removeClass('text-danger');

  if (path === 'form.isValid') {
    if (value === true) {
      label.text('RSS was dawnloaded successfully').addClass('text-success');
      $(':input#url-input').text(state.form.url);
    } else {
      label.text(state.form.errors.join(' ')).addClass('text-danger');
    }
  }
});
