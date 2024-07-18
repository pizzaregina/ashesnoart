document.addEventListener('DOMContentLoaded', function () {
    const categoryLinks = document.querySelectorAll('.category-link');
    const artworkContainer = document.getElementById('artwork-container');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const categoryId = this.dataset.categoryId;

            // Toggle sub-category container visibility
            const subCategoryList = document.querySelector(`.sub-category-list[data-category-id="${categoryId}"]`);
            if (subCategoryList) {
                subCategoryList.classList.toggle('hidden');
                if (!subCategoryList.classList.contains('hidden') && subCategoryList.innerHTML === '') {
                    fetch(`/category/${categoryId}/subcategories`)
                        .then(response => response.json())
                        .then(data => {
                            subCategoryList.innerHTML = '';
                            if (data.length > 0) {
                                data.forEach(subCategory => {
                                    const li = document.createElement('li');
                                    const subCategoryLink = document.createElement('a');
                                    subCategoryLink.href = '#';
                                    subCategoryLink.dataset.subCategoryId = subCategory.id;
                                    subCategoryLink.textContent = subCategory.name;
                                    subCategoryLink.classList.add('sub-category-link');
                                    li.appendChild(subCategoryLink);
                                    subCategoryList.appendChild(li);
                                });

                                const subCategoryLinks = subCategoryList.querySelectorAll('.sub-category-link');
                                subCategoryLinks.forEach(subLink => {
                                    subLink.addEventListener('click', function (subEvent) {
                                        subEvent.preventDefault();
                                        const subCategoryId = this.dataset.subCategoryId;

                                        fetch(`/subcategory/${subCategoryId}/artworks`)
                                            .then(response => response.json())
                                            .then(data => {
                                                artworkContainer.innerHTML = '';
                                                data.forEach(artwork => {
                                                    const artworkElement = document.createElement('div');
                                                    artworkElement.classList.add('artwork-item');
                                                    artworkElement.innerHTML = `
                                                        <img src="/uploads/images/${artwork.imagePath}" alt="${artwork.title}" class="w-full h-full object-cover">
                                                        <h3 class="mt-2">${artwork.title}</h3>
                                                    `;
                                                    artworkContainer.appendChild(artworkElement);
                                                });
                                            });
                                    });
                                });
                            } else {
                                fetch(`/category/${categoryId}/artworks`)
                                    .then(response => response.json())
                                    .then(data => {
                                        artworkContainer.innerHTML = '';
                                        data.forEach(artwork => {
                                            const artworkElement = document.createElement('div');
                                            artworkElement.classList.add('artwork-item');
                                            artworkElement.innerHTML = `
                                                <img src="/uploads/images/${artwork.imagePath}" alt="${artwork.title}" class="w-full h-full object-cover">
                                                <h3 class="mt-2">${artwork.title}</h3>
                                            `;
                                            artworkContainer.appendChild(artworkElement);
                                        });
                                    });
                            }
                        });
                }
            }
        });
    });
});
