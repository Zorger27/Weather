interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export const openGraphMixin = {
  methods: {

    // Устанавливает заголовок страницы
    setPageTitle(mainTitle: string): void {
      let pageTitle = document.querySelector('title');

      // Проверка, существует ли уже тег <title>
      if (pageTitle) {
        // Если тег <title> существует, обновить его содержимое
        pageTitle.innerText = mainTitle;
      } else {
        // Если тег <title> не существует, создать новый
        const newTitleTag = document.createElement('title');
        newTitleTag.innerText = mainTitle;
        document.head.appendChild(newTitleTag);
      }
    },

    // Устанавливает или обновляет canonical URL
    setCanonical(url?: string): void {
      const canonicalUrl = url || window.location.href;

      // Удаляем старый canonical, если есть
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) existingCanonical.remove();

      // Создаём новый тег
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      document.head.appendChild(link);
    },


    // Устанавливает Open Graph и Twitter мета-теги
    setOpenGraphTags(metaDescription: string, title: string, description: string, imageUrl: string, url: string): void {
      const metaTags: MetaTag[] = [
        { name: 'description', content: metaDescription },
        { property: 'og:title', content: title },
        { property: 'twitter:title', content: title },
        { property: 'og:description', content: description },
        { property: 'twitter:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'twitter:image', content: imageUrl },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'https://Zorin.Expert' },
        { property: 'twitter:card', content: 'summary_large_image' },
        { name: 'author', content: 'Anatolii Zorin' },
        { name: 'robots', content: 'index,follow' }
      ];

      metaTags.forEach((metaTag) => {
        const meta = document.createElement('meta');
        if (metaTag.property) {
          meta.setAttribute('property', metaTag.property);
        } else if (metaTag.name) {
          meta.setAttribute('name', metaTag.name);
        }
        meta.setAttribute('content', metaTag.content);

        // Удалить существующие мета-теги с тем же property или name
        const existingMetaTags = document.querySelectorAll(
          `[property="${metaTag.property || ''}"], [name="${metaTag.name || ''}"]`
        );
        existingMetaTags.forEach((tag) => tag.remove());

        // Добавить новый мета-тег
        document.head.appendChild(meta);
      });
    },
  },
};
