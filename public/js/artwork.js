document.addEventListener('DOMContentLoaded', function () {
    const subCategoryButtons = document.querySelectorAll('.subcategory-button');
    const artworkContainer = document.getElementById('artwork-container');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const spinnerContainer = document.getElementById('spinner');

    // Fonction pour afficher la modal avec l'image en grand
    function openModal(imageSrc) {
        modalImage.src = imageSrc;
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

    subCategoryButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const subCategoryId = this.getAttribute('data-sub-category-id');
            console.log(`Sub-category clicked: ${subCategoryId}`);

            // Effacer le contenu existant
            artworkContainer.innerHTML = ''; 
            
            // Forcer l'affichage du spinner directement via le style
            spinnerContainer.style.display = 'flex';  // Forcer l'affichage en flex pour centrer le spinner
            spinnerContainer.style.zIndex = '1000';   // S'assurer qu'il est au-dessus de tout

            // Masquer le conteneur tant que les images ne sont pas chargées
            artworkContainer.style.opacity = '0';
            artworkContainer.style.transition = 'opacity 1s ease';

            fetch(`/subcategory/${subCategoryId}/artworks`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length === 0) {
                        spinnerContainer.style.display = 'none'; // Cacher le spinner
                        artworkContainer.innerHTML = '<p class="text-center text-2xl text-gray-500">Aucun artwork disponible pour cette sous-catégorie.</p>';
                    } else {
                        let imagesLoaded = 0;
                        const totalImages = data.length;

                        data.forEach((artwork, index) => {
                            const artworkElement = document.createElement('div');
                            artworkElement.classList.add('artwork-item', 'relative', 'bg-gray-100', 'rounded', 'shadow-lg', 'overflow-hidden');
                            artworkElement.style.opacity = '0'; // Commence invisible
                            artworkElement.style.transform = 'translateY(20px)'; // Commence décalé vers le bas
                            artworkElement.style.transition = 'opacity 1s ease, transform 1s ease'; // Transition animée sur 1 seconde

                            // Masquer directement l'image jusqu'à son chargement
                            artworkElement.innerHTML = `
                                <img src="/uploads/images/${artwork.imagePath}" alt="${artwork.title}" class="w-full h-full object-cover cursor-pointer hidden"> <!-- Cacher l'image -->
                                <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
                                </div>
                            `;

                            const imgElement = artworkElement.querySelector('img');

                            // Ajoute l'élément au conteneur immédiatement
                            artworkContainer.appendChild(artworkElement);

                            // Vérifier si l'image est déjà en cache
                            if (imgElement.complete) {
                                // Si l'image est dans le cache, déclencher manuellement l'animation
                                imagesLoaded += 1;
                                imgElement.classList.remove('hidden'); // Montrer l'image
                                setTimeout(() => {
                                    artworkElement.style.opacity = '1'; // Rendre l'image visible
                                    artworkElement.style.transform = 'translateY(0)'; // Faire remonter l'image
                                }, index * 200); // Décalage de 0,2 seconde entre chaque image

                                // Si toutes les images sont chargées, cacher le spinner et afficher le conteneur
                                if (imagesLoaded === totalImages) {
                                    spinnerContainer.style.display = 'none';
                                    artworkContainer.style.opacity = '1'; // Rendre visible le conteneur
                                }
                            } else {
                                // Attends que chaque image soit chargée avant de la montrer
                                imgElement.onload = function () {
                                    imagesLoaded += 1;

                                    imgElement.classList.remove('hidden'); // Montrer l'image

                                    // Applique l'animation après un délai décalé pour chaque image
                                    setTimeout(() => {
                                        artworkElement.style.opacity = '1'; // Rendre l'image visible
                                        artworkElement.style.transform = 'translateY(0)'; // Faire remonter l'image
                                    }, index * 200); // Décalage de 0,2 seconde entre chaque image

                                    // Si toutes les images sont chargées, cacher le spinner et afficher le conteneur
                                    if (imagesLoaded === totalImages) {
                                        spinnerContainer.style.display = 'none';
                                        artworkContainer.style.opacity = '1'; // Rendre visible le conteneur
                                    }
                                };

                                // Gère les erreurs de chargement d'image
                                imgElement.onerror = function () {
                                    imagesLoaded += 1;

                                    // Si toutes les images ont tenté de se charger (y compris les erreurs), cacher le spinner
                                    if (imagesLoaded === totalImages) {
                                        spinnerContainer.style.display = 'none';
                                        artworkContainer.style.opacity = '1'; // Rendre visible le conteneur même en cas d'erreurs
                                    }
                                };
                            }

                            // Ajoute un gestionnaire d'événements pour ouvrir la modal quand l'image est cliquée
                            imgElement.addEventListener('click', function () {
                                openModal(this.src);
                            });
                        });
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des artworks:', error);
                    artworkContainer.innerHTML = '<p class="text-center text-2xl text-red-500">Erreur lors de la récupération des artworks.</p>';
                    spinnerContainer.style.display = 'none'; // Cacher le spinner
                });
        });
    });
});
