<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class TestController extends AbstractController
{
    /*     #[Route('/test', methods: ['GET'], name: 'app_test.index')]
    public function index2(): Response
    {
        return $this->render('test.html.twig');
    }

    #[Route('apix/cities', methods: ['GET'], name: 'cities.index')]
    public function cities2(): Response
    {
        $data = file_get_contents('https://countriesnow.space/api/v0.1/countries/population/cities');

        $test = json_decode($data);

        dd($test);


        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent($data);

        return $response;
    }


    #[Route('apix/citiess', methods: ['GET'], name: 'citiess.search')]
    public function citiess2(): Response
    {
        
        $url = 'https://countriesnow.space/api/v0.1/countries/population/cities/filter';
        $data = ['orderBy' => 'populationCounts'];
 
        $url = 'https://countriesnow.space/api/v0.1/countries/population/cities';
        $data = ['city' => 'shanghai'];

        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data),
            ],
        ];

        $context = stream_context_create($options);
        $data = file_get_contents($url, false, $context);
        if ($data === false) {

        }

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent($data);

        return $response;
    }



    #[Route('/apix/test', methods: ['GET'], name: 'app_test2.index')]
    public function getUsers2(): Response
    {
        $users = [
            [
                'id' => 1,
                'name' => 'Olususi Oluyemi22',
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
                'imageURL' => 'https://randomuser.me/api/portraits/women/50.jpg'
            ],
            [
                'id' => 2,
                'name' => 'Camila Terry',
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
                'imageURL' => 'https://randomuser.me/api/portraits/men/42.jpg'
            ],
            [
                'id' => 3,
                'name' => 'Joel Williamson',
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
                'imageURL' => 'https://randomuser.me/api/portraits/women/67.jpg'
            ],
            [
                'id' => 4,
                'name' => 'Deann Payne',
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
                'imageURL' => 'https://randomuser.me/api/portraits/women/50.jpg'
            ],
            [
                'id' => 5,
                'name' => 'Donald Perkins',
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
                'imageURL' => 'https://randomuser.me/api/portraits/men/89.jpg'
            ]
        ];

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($users));

        return $response;
    }

    #[Route('/apix/testb', methods: ['GET'], name: 'app_test3.index')]
    public function getUsers3(): Response
    {
        $users = [
            [
                'id' => 1,
                'name' => 'aa',
                'description' => 'xx',
                'imageURL' => 'https://randomuser.me/api/portraits/women/50.jpg'
            ],
            [
                'id' => 2,
                'name' => 'bb',
                'description' => 'bb',
                'imageURL' => 'https://randomuser.me/api/portraits/men/42.jpg'
            ],
            [
                'id' => 3,
                'name' => 'cc',
                'description' => 'cc',
                'imageURL' => 'https://randomuser.me/api/portraits/women/67.jpg'
            ]
        ];

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($users));

        return $response;
    } */
}
