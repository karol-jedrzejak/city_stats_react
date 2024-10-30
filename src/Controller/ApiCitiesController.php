<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ApiCitiesController extends AbstractController
{
    #[Route('/api/cities_by_population', methods: ['POST'], name: 'api.city_by_population')]
    public function api_cities_post(Request $request): Response
    {

        $post_data = json_decode($request->getContent(), true);

        $url = 'https://countriesnow.space/api/v0.1/countries/population/cities/filter';
        $data = ['orderBy' => 'populationCounts', "order" => $post_data['order']];

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

        $decoded_data = json_decode($data);
        $new_data = $decoded_data->data;

        // Get GPS coordinates
        $data_gps = file_get_contents('https://countriesnow.space/api/v0.1/countries/positions');
        $decoded_data_gps = json_decode($data_gps);

        foreach ($new_data as $key => $item) {
            if (is_numeric($item->populationCounts[0]->value)) {
                $item->population_value = (int) $item->populationCounts[0]->value;
                $item->population_year = $item->populationCounts[0]->year;
                $item->id = $key;

                $obj = array_column($decoded_data_gps->data, null, 'name')[$item->country] ?? null;
                if ($obj) {
                    $item->iso2 = $obj->iso2;
                    $item->long = $obj->long;
                    $item->lat = $obj->lat;
                } else {
                    $item->iso2 = "";
                    $item->long = 0;
                    $item->lat = 0;
                }
            } else {
                unset($new_data[$key]);
            }
        }

        $data = json_encode($new_data);

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->setContent($data);

        return $response;
    }

    /////////////////////////////////////////////////////////////////////////

    #[Route('/api/countries_by_population', methods: ['GET'], name: 'api.country_by_population')]
    public function api_cities_get(): Response
    {

        $population_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/population');
        $flags_data = file_get_contents(
            'https://countriesnow.space/api/v0.1/countries/flag/images'
        );
        $position_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/positions');

        $decoded_population_data = json_decode($population_data)->data;
        $decoded_flags_data = json_decode($flags_data)->data;
        $decoded_position_data = json_decode($position_data)->data;

        $new_data = [];
        $id = 1;
        foreach ($decoded_flags_data as $item) {
            $obj = array_column($decoded_population_data, null, 'iso3')[$item->iso3] ?? false;
            $obj2 = array_column($decoded_position_data, null, 'iso2')[$item->iso2] ?? false;
            if ($obj) {
                $obj->id = $id;
                $obj->flag = $item->flag;

                $obj->population_value = (int) $obj->populationCounts[count($obj->populationCounts) - 1]->value;
                $obj->population_year = $obj->populationCounts[count($obj->populationCounts) - 1]->year;

                if ($obj2) {
                    $obj->long = $obj2->long;
                    $obj->lat = $obj2->lat;
                }
                if ($item->iso2 == "GR") {
                    $obj->long = 22;
                    $obj->lat = 39;
                }

                $new_data[] = $obj;
                $id++;
            }
        }

        $data = json_encode($new_data);

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent($data);

        return $response;
    }
}
