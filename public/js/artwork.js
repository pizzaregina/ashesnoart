document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.category-button');
    const subCategoryButtons = document.querySelectorAll('.subcategory-button');
    const artworkContainer = document.getElementById('artwork-container');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const spinnerContainer = document.getElementById('spinner');
    const hamburgerButton = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar-multi-level-sidebar');
      // Ouvre/ferme le menu déroulant sur mobile
 

    // Fonction pour afficher la modal avec l'image en grand
    function openModal(imageSrc, title, description) {
        modalImage.src = imageSrc;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalDescription').textContent = description;
    
        imageModal.classList.remove('hidden');
        setTimeout(() => {
            imageModal.style.opacity = '1';
            imageModal.style.transform = 'scale(1)';
        }, 100);
    }

    // Fonction pour fermer la modal
    function closeModal() {
        imageModal.style.opacity = '0';
        imageModal.style.transform = 'scale(0.95)';
        setTimeout(() => {
            imageModal.classList.add('hidden');
        }, 300);
    }

    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Fonction pour attacher un événement 'click' à chaque image
    function attachImageClickEvent(imgElement) {
        imgElement.addEventListener('click', function () {
            console.log("Image clicked:", this.src);
            openModal(this.src);
        });
    }

    // Gestionnaire de clic pour les catégories (inclut la catégorie "All")
    categoryButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const categoryId = this.getAttribute('data-category-id');

            // Effacer le contenu existant
            artworkContainer.innerHTML = ''; 
            
            // Afficher le spinner
            spinnerContainer.style.display = 'flex';
            spinnerContainer.style.zIndex = '1000';

            // Masquer le conteneur tant que les images ne sont pas chargées
            artworkContainer.style.opacity = '0';
            artworkContainer.style.transition = 'opacity 1s ease';

            // Requête pour récupérer les œuvres d'art d'une catégorie (ou "All")
            fetch(`/category/${categoryId}/artworks`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length === 0) {
                        spinnerContainer.style.display = 'none';
                        artworkContainer.innerHTML = '<p class="text-center text-2xl text-gray-500">Aucun artwork disponible.</p>';
                    } else {
                        let imagesLoaded = 0;
                        const totalImages = data.length;

                        data.forEach((artwork, index) => {
                            const artworkElement = document.createElement('div');
                            artworkElement.classList.add('artwork-item', 'relative', 'bg-gray-100', 'rounded', 'shadow-lg', 'overflow-hidden');
                            artworkElement.style.opacity = '0';
                            artworkElement.style.transform = 'translateY(20px)';
                            artworkElement.style.transition = 'opacity 1s ease, transform 1s ease';

                            artworkElement.innerHTML = `
                                <img src="/uploads/images/${artwork.imagePath}" alt="${artwork.title}" class="w-full h-full object-cover cursor-pointer hidden">
                                <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white"></div>
                            `;

                            const imgElement = artworkElement.querySelector('img');
                            artworkContainer.appendChild(artworkElement);

                            if (imgElement.complete) {
                                imagesLoaded += 1;
                                imgElement.classList.remove('hidden');
                                setTimeout(() => {
                                    artworkElement.style.opacity = '1';
                                    artworkElement.style.transform = 'translateY(0)';
                                }, index * 200);

                                attachImageClickEvent(imgElement);

                                if (imagesLoaded === totalImages) {
                                    spinnerContainer.style.display = 'none';
                                    artworkContainer.style.opacity = '1';
                                }
                            } else {
                                imgElement.onload = function () {
                                    imagesLoaded += 1;
                                    imgElement.classList.remove('hidden');
                                    setTimeout(() => {
                                        artworkElement.style.opacity = '1';
                                        artworkElement.style.transform = 'translateY(0)';
                                    }, index * 200);

                                    attachImageClickEvent(imgElement);

                                    if (imagesLoaded === totalImages) {
                                        spinnerContainer.style.display = 'none';
                                        artworkContainer.style.opacity = '1';
                                    }
                                };

                                imgElement.onerror = function () {
                                    imagesLoaded += 1;
                                    if (imagesLoaded === totalImages) {
                                        spinnerContainer.style.display = 'none';
                                        artworkContainer.style.opacity = '1';
                                    }
                                };
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des artworks:', error);
                    spinnerContainer.style.display = 'none';
                    artworkContainer.innerHTML = '<p class="text-center text-2xl text-red-500">Erreur lors de la récupération des artworks.</p>';
                });
        });
    });

    // Gestionnaire de clic pour les sous-catégories
    subCategoryButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const subCategoryId = this.getAttribute('data-sub-category-id');

            // Effacer le contenu existant
            artworkContainer.innerHTML = ''; 
            
            // Afficher le spinner
            spinnerContainer.style.display = 'flex';
            spinnerContainer.style.zIndex = '1000';

            // Masquer le conteneur tant que les images ne sont pas chargées
            artworkContainer.style.opacity = '0';
            artworkContainer.style.transition = 'opacity 1s ease';

            // Requête pour récupérer les œuvres d'art d'une sous-catégorie spécifique
            fetch(`/subcategory/${subCategoryId}/artworks`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length === 0) {
                        spinnerContainer.style.display = 'none';
                        artworkContainer.innerHTML = '<p class="text-center text-2xl text-gray-500">Aucun artwork disponible pour cette sous-catégorie.</p>';
                    } else {
                        let imagesLoaded = 0;
                        const totalImages = data.length;

                        data.forEach((artwork, index) => {
                            const artworkElement = document.createElement('div');
                            artworkElement.classList.add('artwork-item', 'relative', 'bg-gray-100', 'rounded', 'shadow-lg', 'overflow-hidden');
                            artworkElement.style.opacity = '0';
                            artworkElement.style.transform = 'translateY(20px)';
                            artworkElement.style.transition = 'opacity 1s ease, transform 1s ease';

                            artworkElement.innerHTML = `
                                <img src="/uploads/images/${artwork.imagePath}" alt="${artwork.title}" class="w-full h-full object-cover cursor-pointer hidden">
                                <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white"></div>
                            `;

                            const imgElement = artworkElement.querySelector('img');
                            artworkContainer.appendChild(artworkElement);

                            if (imgElement.complete) {
                                imagesLoaded += 1;
                                imgElement.classList.remove('hidden');
                                setTimeout(() => {
                                    artworkElement.style.opacity = '1';
                                    artworkElement.style.transform = 'translateY(0)';
                                }, index * 200);

                                attachImageClickEvent(imgElement);

                                if (imagesLoaded === totalImages) {
                                    spinnerContainer.style.display = 'none';
                                    artworkContainer.style.opacity = '1';
                                }
                            } else {
                                imgElement.onload = function () {
                                    imagesLoaded += 1;
                                    imgElement.classList.remove('hidden');
                                    setTimeout(() => {
                                        artworkElement.style.opacity = '1';
                                        artworkElement.style.transform = 'translateY(0)';
                                    }, index * 200);

                                    attachImageClickEvent(imgElement);

                                    if (imagesLoaded === totalImages) {
                                        spinnerContainer.style.display = 'none';
                                        artworkContainer.style.opacity = '1';
                                    }
                                };

                                imgElement.onerror = function () {
                                    imagesLoaded += 1;
                                    if (imagesLoaded === totalImages) {
                                        spinnerContainer.style.display = 'none';
                                        artworkContainer.style.opacity = '1';
                                    }
                                };
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des artworks:', error);
                    spinnerContainer.style.display = 'none';
                    artworkContainer.innerHTML = '<p class="text-center text-2xl text-red-500">Erreur lors de la récupération des artworks.</p>';
                });
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarButton = document.getElementById('toggleSidebar');
    
    toggleSidebarButton.addEventListener('click', function () {
        // Si la sidebar est cachée, la faire apparaître
        if (sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.remove('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
    });
});
