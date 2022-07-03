const getTitle = (element) => element.querySelector('title')?.textContent || '';
const getDescription = (element) => element.querySelector('description')?.textContent || '';

export default (content, feedCount) => {
  const html = new DOMParser().parseFromString(content, 'text/html');
  const feedId = feedCount + 1;

  const feed = {
    id: feedId,
    title: getTitle(html),
    description: getDescription(html),
  };
  const posts = [...html.querySelectorAll('item')].map((item) => {
    const [link] = item.textContent?.split('\n').filter((value) => value.trim().startsWith('http'));
    return {
      title: getTitle(item),
      description: getDescription(item),
      link: link.trim(),
      feedId,
    };
  });
  return { feed, posts };
};
