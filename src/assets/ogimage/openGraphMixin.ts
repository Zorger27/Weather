export const openGraphMixin = {
  methods: {
    setPageTitle(mainTitle: string): void {
      // Проверка, существует ли уже тег <title>
      let pageTitle = document.querySelector('title');

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

    setOpenGraphTags(metaDescription: string, title: string, description: string, imageUrl: string, url: string): void {
      const metaTags = [
        { name: 'description', content: metaDescription },
        { property: 'og:title', content: title },
        { property: 'twitter:title', content: title },
        { property: 'og:description', content: description },
        { property: 'twitter:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'twitter:image', content: imageUrl },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        { property: 'twitter:card', content: 'summary_large_image' }
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
          `[property="${metaTag.property}"], [name="${metaTag.name}"]`
        );
        existingMetaTags.forEach((tag) => tag.remove());

        // Добавить новый мета-тег
        document.head.appendChild(meta);
      });
    },
  },
};
