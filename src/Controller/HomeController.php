<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\SubCategory;
use App\Repository\CategoryRepository;
use App\Repository\SubCategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/home', name: 'app_home')]
    public function index(CategoryRepository $categoryRepository): Response
    {
        $categories = $categoryRepository->findAll();

        return $this->render('home/index.html.twig', [
            'categories' => $categories,
        ]);
    }

    #[Route('/category/{id}/subcategories', name: 'get_subcategories', methods: ['GET'])]
    public function getSubCategories(Category $category): JsonResponse
    {
        $subCategories = $category->getSubCategories();
        $subCategoriesArray = [];

        foreach ($subCategories as $subCategory) {
            $subCategoriesArray[] = [
                'id' => $subCategory->getId(),
                'name' => $subCategory->getName(),
            ];
        }

        return new JsonResponse($subCategoriesArray);
    }

    #[Route('/category/{id}/artworks', name: 'get_category_artworks', methods: ['GET'])]
    public function getCategoryArtworks(Category $category): JsonResponse
    {
        $artworks = $category->getArtworks();
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
