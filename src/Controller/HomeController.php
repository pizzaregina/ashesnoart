<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\SubCategory;
use App\Repository\ArtworkRepository;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/home', name: 'app_home')]
    public function index(CategoryRepository $categoryRepository, ArtworkRepository $artworkRepository): Response
    {
        $categories = $categoryRepository->findAll();
        $artworks = $artworkRepository->findAll();

        // Rechercher la catégorie "All" et la mettre en première position
    usort($categories, function ($a, $b) {
        return $a->getName() === 'All' ? -1 : 1; // Si c'est "All", on le met en premier
    });

        return $this->render('home/index.html.twig', [
            'categories' => $categories,
            'artworks' => $artworks,
        ]);
    }

    #[Route('/category/{id}/artworks', name: 'get_category_artworks', methods: ['GET'])]
    public function getCategoryArtworks($id, CategoryRepository $categoryRepository, ArtworkRepository $artworkRepository): JsonResponse
    {
        // Récupère la catégorie avec l'ID
        $category = $categoryRepository->find($id);
    
        // Si la catégorie est "All", récupérer toutes les œuvres
        if ($category && $category->getName() === 'All') {
            $artworks = $artworkRepository->findAll(); // Récupère toutes les œuvres
        } else {
            // Sinon, récupérer les œuvres d'une catégorie spécifique
            if (!$category) {
                return new JsonResponse(['error' => 'Category not found'], 404);
            }
            $artworks = $category->getArtworks();
        }
    
        // Transformer les œuvres d'art en tableau JSON
        $artworksArray = [];
        foreach ($artworks as $artwork) {
            $artworksArray[] = [
                'id' => $artwork->getId(),
                'title' => $artwork->getTitle(),
                'imagePath' => $artwork->getImagePath(),
                'description' => $artwork->getDescription(),
            ];
        }
    
        return new JsonResponse($artworksArray);
    }

    #[Route('/subcategory/{id}/artworks', name: 'get_subcategory_artworks', methods: ['GET'])]
    public function getSubCategoryArtworks(SubCategory $subCategory): JsonResponse
    {
        $artworks = $subCategory->getArtworks();
        $artworksArray = [];

        foreach ($artworks as $artwork) {
            $artworksArray[] = [
                'id' => $artwork->getId(),
                'title' => $artwork->getTitle(),
                'imagePath' => $artwork->getImagePath(),
            ];
        }

        return new JsonResponse($artworksArray);
    }
}
