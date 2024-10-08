<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class MainController extends AbstractController
{
    #[Route('/', methods: ['GET'], name: 'main.index')]
    public function index(): Response
    {
        return $this->render('main.html.twig');
    }
}
