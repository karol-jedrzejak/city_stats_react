<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ApiCitiesController extends AbstractController
{
    #[Route('/api/cities', methods: ['POST'], name: 'api.cities.post')]
    public function api_cities(Request $request): Response
    {

        $post_data = json_decode($request->getContent(), true);

        $url = 'https://countriesnow.space/api/v0.1/countries/population/cities/filter';
        $data = ['orderBy' => 'populationCounts', "order" => $post_data['order']];

        /*         $url = 'https://countriesnow.space/api/v0.1/countries/population/cities';
        $data = ['city' => 'poznan']; */

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
            /* Handle error */
        }

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent($data);

        return $response;
    }


    #[Route('/api/cities/get', methods: ['GET'], name: 'api.cities.get')]
    public function get_api_cities(): Response
    {

        $url = 'https://countriesnow.space/api/v0.1/countries/population/cities/filter';
        $data = ['orderBy' => 'populationCounts', "order" => "dsc"];

        /*         $url = 'https://countriesnow.space/api/v0.1/countries/population/cities';
        $data = ['city' => 'poznan']; */

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
            /* Handle error */
        }

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent($data);

        return $response;
    }
}
