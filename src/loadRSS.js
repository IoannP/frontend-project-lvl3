export default (url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .catch(() => {
    throw new Error('Network error');
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network error');
  })
  .then((data) => {
    const isRss = (/application\/rss\+xml;/).test(data.status?.content_type)
      || /<rss version="2.0">/.test(data.contents);
    if (isRss) {
      return data.contents;
    }
    throw new Error('Invalid url');
  });
