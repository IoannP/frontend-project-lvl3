const getTitle = (element) => element.querySelector('title')?.textContent || '';
const getDescription = (element) => element.querySelector('description')?.textContent || '';

export default (content) => {
  const html = new DOMParser().parseFromString(content, 'text/html');

  const feed = {
    title: getTitle(html),
    description: getDescription(html),
  };
  const posts = [...html.querySelectorAll('item')].map((item) => {
    const link = item.textContent?.split('\n').find((value) => value.trim().startsWith('http'))?.trim();
    return {
      title: getTitle(item),
      description: getDescription(item),
      link,
    };
  });
  return { feed, posts };
};
