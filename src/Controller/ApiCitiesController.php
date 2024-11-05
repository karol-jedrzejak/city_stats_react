<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ApiCitiesController extends AbstractController
{
    #[Route('/api/cities_by_population', methods: ['POST'], name: 'api.city_by_population')]
    public function cities_by_population(Request $request): Response
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
        $cities_data = $decoded_data->data;

        // Get GPS coordinates
        $data_gps = file_get_contents('https://countriesnow.space/api/v0.1/countries/positions');
        $decoded_data_gps = json_decode($data_gps);

        foreach ($cities_data as $key => $item) {
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
                unset($cities_data[$key]);
            }
        }

        $data = json_encode($cities_data);

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->setContent($data);

        return $response;
    }

    /////////////////////////////////////////////////////////////////////////

    #[Route('/api/countries_by_population', methods: ['GET'], name: 'api.country_by_population')]
    public function countries_by_population(): Response
    {

        $population_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/population');
        $flags_data = file_get_contents(
            'https://countriesnow.space/api/v0.1/countries/flag/images'
        );
        $position_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/positions');

        $decoded_population_data = json_decode($population_data)->data;
        $decoded_flags_data = json_decode($flags_data)->data;
        $decoded_position_data = json_decode($position_data)->data;

        // Missing flag from api
        $decoded_flags_data[] = (object) [
            "name" => "Russia",
            "flag" => "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg",
            "iso2" => "RU",
            "iso3" => "RUS"
        ];
        $decoded_flags_data[] = (object) [
            "name" => "Congo, The Democratic Republic of the",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg",
            "iso2" => "CD",
            "iso3" => "COD"
        ];
        $decoded_flags_data[] = (object) [
            "name" => "Libya",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Libya.svg",
            "iso2" => "LY",
            "iso3" => "LBY"
        ];
        $decoded_flags_data[] = (object) [
            "name" => "Bolivia",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg",
            "iso2" => "BO",
            "iso3" => "BOL"
        ];
        $decoded_flags_data[] = (object) [
            "name" => "Venezuela",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg",
            "iso2" => "VE",
            "iso3" => "VEN"
        ];
        $decoded_flags_data[] = (object) [
            "name" => "North Korea",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_North_Korea.svg",
            "iso2" => "KP",
            "iso3" => "PRK"
        ];
        $decoded_flags_data[] = (object) [
            "name" => "South Korea",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg",
            "iso2" => "KR",
            "iso3" => "KOR"
        ];

        // Extract quantities into a separate array
        $names = array_map(function ($item) {
            return $item->name;
        }, $decoded_flags_data);

        // Sort the original array based on the quantities
        array_multisort($names, SORT_ASC, $decoded_flags_data);


        $cities_data = [];
        $id = 1;
        foreach ($decoded_flags_data as $item) {

            $obj = array_column($decoded_population_data, null, 'iso3')[$item->iso3] ?? false;

            //wrong iso correction
            switch ($item->iso2) {
                case "GR":
                    $iso2_search = "EL";
                    break;
                default:
                    $iso2_search = $item->iso2;
                    break;
            }
            $obj2 = array_column($decoded_position_data, null, 'iso2')[$iso2_search] ?? false;

            if ($obj) {
                $obj->id = $id;
                $obj->flag = $item->flag;

                $obj->population_value = (int) $obj->populationCounts[count($obj->populationCounts) - 1]->value;
                $obj->population_year = $obj->populationCounts[count($obj->populationCounts) - 1]->year;

                if ($obj2) {
                    $obj->long = $obj2->long;
                    $obj->lat = $obj2->lat;
                    $obj->iso2 = $obj2->iso2;
                }

                $cities_data[] = $obj;
                $id++;
            }
        }

        $data = json_encode($cities_data);

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent($data);

        return $response;
    }


    /////////////////////////////////////////////////////////////////////////


    //#[Route('/api/country', methods: ['post'], name: 'api.country')]
    #[Route('/api/country', methods: ['get'], name: 'api.country')]
    public function country(Request $request): Response
    {

        //$post_data = json_decode($request->getContent(), true);
        $post_data['iso2'] = "KR";
        $post_data['order'] = "asc";

        // Create class
        $response_data = new \stdClass();
        $response_data->country = new \stdClass();
        $response_data->country->iso2 = $post_data['iso2'];

        // Flag
        $url = 'https://countriesnow.space/api/v0.1/countries/flag/images';
        $data = ["iso2" => $response_data->country->iso2];

        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data),
            ],
        ];

        $context = stream_context_create($options);
        $data = @file_get_contents($url, false, $context);
        if ($data === false) {
            // Fixing missing data
            switch ($response_data->country->iso2) {
                case "RU":
                    $response_data->country->name = "Russia";
                    $response_data->country->name_alt = "Russian Federation";
                    $response_data->country->name_ll = null;
                    $response_data->country->flag = "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg";
                    $response_data->country->iso3 = "RUS";
                    break;
                case "CD":
                    $response_data->country->name = "Congo, The Democratic Republic of the";
                    $response_data->country->name_alt = "Congo, Dem. Rep.";
                    $response_data->country->name_ll = null;
                    $response_data->country->flag = "https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg";
                    $response_data->country->iso3 = "COD";
                    break;
                case "LY":
                    $response_data->country->name = "Libya";
                    $response_data->country->name_alt = "Libya";
                    $response_data->country->name_ll = null;
                    $response_data->country->flag = "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Libya.svg";
                    $response_data->country->iso3 = "LBY";
                    break;
                case "BO":
                    $response_data->country->name = "Bolivia";
                    $response_data->country->name_alt = "Bolivia (Plurinational State of)";
                    $response_data->country->name_ll = null;
                    $response_data->country->flag = "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg";
                    $response_data->country->iso3 = "BOL";
                    break;
                case "VE":
                    $response_data->country->name = "Venezuela";
                    $response_data->country->name_alt = "Venezuela, RB";
                    $response_data->country->name_ll = "Venezuela (Bolivarian Republic of)";
                    $response_data->country->flag = "https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg";
                    $response_data->country->iso3 = "VEN";
                    break;
                case "KP":
                    $response_data->country->name = "North Korea";
                    $response_data->country->name_alt = "Korea, Dem. People’s Rep.";
                    $response_data->country->name_ll = "Democratic People's Republic of Korea";
                    $response_data->country->flag = "https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_North_Korea.svg";
                    $response_data->country->iso3 = "PRK";
                    break;
                case "KR":
                    $response_data->country->name = "South Korea";
                    $response_data->country->name_alt = "Korea, Rep.";
                    $response_data->country->name_ll = null;
                    $response_data->country->flag = "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg";
                    $response_data->country->iso3 = "KOR";
                    break;
                default:
                    $response_data->country->name = null;
                    $response_data->country->name_alt = null;
                    $response_data->country->flag = null;
                    $response_data->country->iso3 = null;
                    $response_data->country->name_ll = null;
                    break;
            }
        } else {
            $decoded_data = json_decode($data);
            $flag_data = $decoded_data->data;

            $response_data->country->name = $flag_data->name;
            $response_data->country->flag = $flag_data->flag;
            $response_data->country->iso3 = $flag_data->iso3;
            $response_data->country->name_alt = null;
            $response_data->country->name_ll = null;
        }

        // Fixing supplier api incosistent country names
        switch ($response_data->country->name) {
            case 'Bahamas':
                $response_data->country->name_alt = "Bahamas, The";
                break;
            case 'Congo':
                $response_data->country->name_alt = "Congo Rep.";
                $response_data->country->name_ll = "Congo, Rep.";
                break;
            default:
                break;
        }

        // States
        $url = 'https://countriesnow.space/api/v0.1/countries/states';
        $data = ["country" => $response_data->country->name];

        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data),
            ],
        ];

        $context = stream_context_create($options);
        $data = @file_get_contents($url, false, $context);

        if ($data === false) {
            $ll_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/states');
            $decoded_ll_data = json_decode($ll_data)->data;
            $obj = array_column($decoded_ll_data, null, 'iso2')[$response_data->country->iso2] ?? false;
            if ($obj) {
                $transf = new \stdClass();
                $transf->data = $obj;
                $data = json_encode($transf);
            }
        }

        if ($data != false) {
            $decoded_data = json_decode($data);
            $states_data = $decoded_data->data;

            $response_data->country->states = $states_data->states;
        }

        // Population
        $url = 'https://countriesnow.space/api/v0.1/countries/population';
        $data = ["country" => $response_data->country->name];

        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data),
            ],
        ];

        $context = stream_context_create($options);
        $data = @file_get_contents($url, false, $context);

        if ($data === false && $response_data->country->name_alt) {
            $data_alt = ["country" => $response_data->country->name_alt];
            $options_alt = [
                'http' => [
                    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data_alt),
                ],
            ];
            $context_alt = stream_context_create($options_alt);
            $data = @file_get_contents($url, false, $context_alt);
        }

        if ($data === false) {
            $ll_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/population');
            $decoded_ll_data = json_decode($ll_data)->data;
            $obj = array_column($decoded_ll_data, null, 'country')[$response_data->country->name] ?? false;
            if (!$obj) {
                $obj = array_column($decoded_ll_data, null, 'country')[$response_data->country->name_alt] ?? false;
            }
            if (!$obj) {
                $obj = array_column($decoded_ll_data, null, 'country')[$response_data->country->name_ll] ?? false;
            }
            if ($obj) {
                $transf = new \stdClass();
                $transf->data = $obj;
                $data = json_encode($transf);
            }
        }

        if ($data != false) {
            $decoded_data = json_decode($data);
            $population_data = $decoded_data->data;

            $response_data->country->population_count = [];
            $response_data->country->population_years = [];

            foreach ($population_data->populationCounts as $item) {
                $response_data->country->population_years[] = $item->year;
                $response_data->country->population_count[] = $item->value;
                $response_data->country->population[] = [$item->year, $item->value];
            }
        }

        // Cities
        $url_cities = 'https://countriesnow.space/api/v0.1/countries/population/cities/filter';
        $data_cities = ['orderBy' => 'populationCounts', "order" => $post_data['order'], "country" => $response_data->country->name];

        $options_cities = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data_cities),
            ],
        ];

        $context_cities = stream_context_create($options_cities);
        $data = @file_get_contents($url_cities, false, $context_cities);

        // Second attempt - diffrent name
        if ($data === false && $response_data->country->name_alt) {
            $data_alt = ['orderBy' => 'populationCounts', "order" => $post_data['order'], "country" => $response_data->country->name_alt];
            $options_alt = [
                'http' => [
                    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data_alt),
                ],
            ];
            $context_alt = stream_context_create($options_alt);
            $data = @file_get_contents($url_cities, false, $context_alt);
        }

        // third attempt - diffrent name
        if ($data === false && $response_data->country->name_ll) {
            $data_ll = ['orderBy' => 'populationCounts', "order" => $post_data['order'], "country" => $response_data->country->name_ll];
            $options_ll = [
                'http' => [
                    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data_ll),
                ],
            ];
            $context_ll = stream_context_create($options_ll);
            $data = @file_get_contents($url_cities, false, $context_ll);
        }

        if ($data === false) {
            $url_ll = 'https://countriesnow.space/api/v0.1/countries/population/cities/filter';
            $data_ll = ['orderBy' => 'populationCounts', "order" => $post_data['order']];

            $options_ll = [
                'http' => [
                    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data_ll),
                ],
            ];

            $context_ll = stream_context_create($options_ll);
            $data_ll = file_get_contents($url_ll, false, $context_ll);
            $decoded_data_ll = json_decode($data_ll);
            $cities_data = $decoded_data_ll->data;

            $obj = array_column($cities_data, null, 'country')[$response_data->country->name] ?? false;
            if (!$obj) {
                $obj = array_column($decoded_data_ll, null, 'country')[$response_data->country->name_alt] ?? false;
            }
            if (!$obj) {
                $obj = array_column($decoded_data_ll, null, 'country')[$response_data->country->name_ll] ?? false;
            }
            dd($obj);

            if ($obj) {
                $transf = new \stdClass();
                $transf->data = $obj;
                $data = json_encode($transf);
            }
        }


        if ($data != false) {
            $decoded_data = json_decode($data);
            $cities_data = $decoded_data->data;

            foreach ($cities_data as $key => $item) {
                if (is_numeric($item->populationCounts[0]->value)) {
                    $item->population_value = (int) $item->populationCounts[0]->value;
                    $item->population_year = $item->populationCounts[0]->year;
                    $item->id = $key;
                } else {
                    unset($cities_data[$key]);
                }
            }

            $response_data->cities = $cities_data;
        } else {
            $response_data->cities = null;
        }

        $response_data = json_encode($response_data);

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->setContent($response_data);

        return $response;
    }
}
