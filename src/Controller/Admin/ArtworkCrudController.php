<?php

namespace App\Controller\Admin;

use App\Entity\Artwork;
use App\Entity\SubCategory;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ArtworkCrudController extends AbstractCrudController
{
    private $entityManager;
    private $requestStack;

    public function __construct(EntityManagerInterface $entityManager, RequestStack $requestStack)
    {
        $this->entityManager = $entityManager;
        $this->requestStack = $requestStack;
    }

    public static function getEntityFqcn(): string
    {
        return Artwork::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('title'),
            TextareaField::new('description'),
            ImageField::new('image_path')
                ->setBasePath('uploads/images/')
                ->setUploadDir('public/uploads/images/')
                ->setUploadedFileNamePattern('[randomhash].[extension]')
                ->setRequired(true),
            DateTimeField::new('created_at')->hideOnForm(),
            AssociationField::new('category'),
            AssociationField::new('SubCategory'),
        ];
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        $this->validateCategoryAndSubCategory($entityInstance);
        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        $this->validateCategoryAndSubCategory($entityInstance);
        parent::updateEntity($entityManager, $entityInstance);
    }

    private function validateCategoryAndSubCategory(Artwork $artwork): void
    {
        $category = $artwork->getCategory();
        $subCategory = $artwork->getSubCategory();

        if ($subCategory && $subCategory->getCategory() !== $category) {
            throw new BadRequestHttpException('La sous-catégorie sélectionnée n\'est pas liée à la catégorie sélectionnée.');
        }
    }
}
