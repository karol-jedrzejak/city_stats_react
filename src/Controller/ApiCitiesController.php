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

        $all_cities_data = $decoded_data->data;

        $selected_cities = ['MOSKVA', 'SEOUL', 'BUENOS AIRES', 'TOKYO', 'MEXICO, CIUDAD DE', 'HONG KONG SAR', 'SINGAPORE', 'SANTIAGO', 'Sydney', 'ROMA'];

        $selected_cities_data = [];

        foreach ($all_cities_data as $key => $item) {
            if (is_numeric($item->populationCounts[0]->value)) {
                $item->population_value = (int) $item->populationCounts[0]->value;
                $item->population_year = $item->populationCounts[0]->year;
                $item->id = $key;
            } else {
                unset($all_cities_data[$key]);
            }

            if ($key < 100) {
                if (in_array($item->city, $selected_cities)) {
                    $selected_city_data = new \stdClass();
                    $selected_city_data->name = $item->city;
                    $selected_city_data->data = [];
                    foreach ($item->populationCounts as $item2) {
                        $selected_city_data->data[] = [$item2->year, $item2->value];
                    }
                    $selected_cities_data[] = $selected_city_data;
                }
            }
        }

        $data_obj = new \stdClass();
        $data_obj->allCities = $all_cities_data;
        $data_obj->selected_cities_data = $selected_cities_data;
        $data = json_encode($data_obj);

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
        $position_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/positions');
        $capitals_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/capital');

        $decoded_population_data = json_decode($population_data)->data;
        $decoded_position_data = json_decode($position_data)->data;
        $decoded_capitals_data = json_decode($capitals_data)->data;

        $decoded_flags_data = $this->get_countries();

        $cities_data = [];
        $id = 1;
        foreach ($decoded_flags_data as $item) {

            $obj_population = array_column($decoded_population_data, null, 'iso3')[$item->iso3] ?? false;
            $obj_capitals = array_column($decoded_capitals_data, null, 'iso3')[$item->iso3] ?? false;

            //wrong iso correction
            switch ($item->iso2) {
                case "GR":
                    $iso2_search = "EL";
                    break;
                default:
                    $iso2_search = $item->iso2;
                    break;
            }
            $obj_position = array_column($decoded_position_data, null, 'iso2')[$iso2_search] ?? false;

            if ($obj_population) {
                $item->populationCounts = $obj_population->populationCounts;
                $item->id = $id;

                $item->population_value = (int) $item->populationCounts[count($item->populationCounts) - 1]->value;
                $item->population_year = $item->populationCounts[count($item->populationCounts) - 1]->year;

                if ($obj_position) {
                    $item->long = $obj_position->long;
                    $item->lat = $obj_position->lat;
                }

                if ($obj_capitals) {
                    $item->capital = $obj_capitals->capital;
                } else {
                    $item->capital = null;
                }

                $cities_data[] = $item;
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

    #[Route('/api/world_population', methods: ['GET'], name: 'api.world_population')]
    public function world_population(): Response
    {

        $population_data = file_get_contents('https://countriesnow.space/api/v0.1/countries/population');
        $decoded_population_data = json_decode($population_data)->data;

        $response_data = [];

        $search_array = [
            "World",
            "North America",
            "Europe & Central Asia",
            "East Asia & Pacific",
            "South Asia",
            "Middle East & North Africa",
            "Sub-Saharan Africa",
            "Australia",
        ];

        foreach ($search_array as $search_value) {
            $obj = array_column($decoded_population_data, null, 'country')[$search_value] ?? false;
            $single_data = new \stdClass();
            $single_data->name = $obj->country;

            foreach ($obj->populationCounts as $item) {
                $single_data->data[] = [$item->year, $item->value];
            }
            $response_data[] = $single_data;
        }

        $data = json_encode($response_data);

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent($data);

        return $response;
    }


    /////////////////////////////////////////////////////////////////////////

    /* 
    #[Route('/api/country', methods: ['get'], name: 'api.country')]
    public function country(Request $request): Response
    {
        $post_data['iso2'] = "KR";
        $post_data['order'] = "asc"; */



    #[Route('/api/country', methods: ['post'], name: 'api.country')]
    public function country(Request $request): Response
    {
        $post_data = json_decode($request->getContent(), true);

        // Create response class
        $response_data = new \stdClass();
        $response_data->country = $this->get_countries($post_data['iso2']);

        // States
        $url = "https://countriesnow.space/api/v0.1/countries/states";
        $retrived_data = $this->retrive_country_property($response_data->country, $url, $url);
        $response_data->country->states = $retrived_data ? $retrived_data->states : null;

        // Capital
        $url = "https://countriesnow.space/api/v0.1/countries/capital";
        $retrived_data = $this->retrive_country_property($response_data->country, $url, $url);
        $response_data->country->capital = $retrived_data ? $retrived_data->capital : null;

        // Currency
        $url = "https://countriesnow.space/api/v0.1/countries/currency";
        $retrived_data = $this->retrive_country_property($response_data->country, $url, $url);
        $response_data->country->currency = $retrived_data ? $retrived_data->currency : null;

        // Dial Code
        $url = "https://countriesnow.space/api/v0.1/countries/codes";
        $retrived_data = $this->retrive_country_property($response_data->country, $url, $url);
        $response_data->country->dial_code = $retrived_data ? $retrived_data->dial_code : null;

        // Unicode Flag
        $url = "https://countriesnow.space/api/v0.1/countries/flag/unicode";
        $retrived_data = $this->retrive_country_property($response_data->country, $url, $url, 'iso2');
        $response_data->country->unicodeFlag = $retrived_data ? $retrived_data->unicodeFlag : null;

        // Population
        $url = "https://countriesnow.space/api/v0.1/countries/population";
        $retrived_data = $this->retrive_country_property($response_data->country, $url, $url);

        $response_data->country->population_count = [];
        $response_data->country->population_years = [];

        if ($retrived_data) {
            foreach ($retrived_data->populationCounts as $item) {
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
        if ($data === false && $response_data->country->name_2) {
            $data_alt = ['orderBy' => 'populationCounts', "order" => $post_data['order'], "country" => $response_data->country->name_2];
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

            $array_of_cities = [];
            foreach ($cities_data as $item) {
                if (
                    $item->country == $response_data->country->name ||
                    $item->country == $response_data->country->name_2 ||
                    $item->country == $response_data->country->name_3
                ) {
                    $array_of_cities[] = $item;
                }
            }

            if (!empty($array_of_cities)) {
                $transf = new \stdClass();
                $transf->data = $array_of_cities;
                $data = json_encode($transf);
            }
        }

        /* 
        if ($data != false) {
            $url = 'https: //countriesnow.space/api/v0.1/countries/cities';
            $retrived_data = $this->retrive_country_property($response_data->country, $url, null, 'country');
            if ($retrived_data) {

                $city_array = [];
                foreach ($retrived_data as $city) {
                    $transf = new \stdClass();
                    $transf->city = $city;
                    $transf->country = $response_data->country->name;
                    $transf->populationCounts = [
                        "year" => "2000",
                        "value" => "0",
                        "sex" => "Both Sexes",
                        "reliabilty" => "Final figure, complete"
                    ];
                    $city_array[] = $transf;
                }
                $data = json_encode($transf);
            }
        } */


        if ($data != false) {
            $decoded_data = json_decode($data);
            $cities_data = $decoded_data->data;

            // Add states info to cities - discarded becouse to slow - wrongly constructed supplier api
            /*             foreach ($cities_data as $city) {
                $city->state = null;
            }

            if ($response_data->country->states != null) {
                foreach ($response_data->country->states as $state) {
                    $url = 'https://countriesnow.space/api/v0.1/countries/state/cities';
                    $data = ['state' => $state, "country" => $response_data->country->name];

                    $options = [
                        'http' => [
                            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                            'method' => 'POST',
                            'content' => http_build_query($data),
                        ],
                    ];

                    $context = stream_context_create($options);
                    $data = @file_get_contents($url, false, $context);

                    if ($data != false) {
                        foreach ($cities_data as $city) {
                            if (in_array($city->city, $data)) {
                                $city->state = $state;
                            }
                        }
                    }
                }
            } */

            //////////////

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

        ////////////

        $response_data = json_encode($response_data);

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->setContent($response_data);

        return $response;
    }

    /////////////////////////////////////////////////////////////////////////

    public function retrive_country_property($country, $url_single, $url_all, $accesor = "country")
    {
        $data = false;

        if ($url_single) {
            switch ($accesor) {
                case 'iso2':
                    $data_arrays = [["iso2" => $country->iso2]];
                    break;

                default:
                    $data_arrays = [["country" => $country->name], ["country" => $country->name_2], ["country" => $country->name_3]];
                    break;
            }

            foreach ($data_arrays as $data_array) {
                if ($data === false) {
                    $options = [
                        'http' => [
                            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                            'method' => 'POST',
                            'content' => http_build_query($data_array),
                        ],
                    ];

                    $context = stream_context_create($options);
                    $data = @file_get_contents($url_single, false, $context);
                }
            }
        }

        if ($data === false && $url_all) {
            $data = file_get_contents($url_all);
            $decoded_data = json_decode($data)->data;

            $search_array = [
                ["name" => 'iso2', "value" => $country->iso2],
                ["name" => 'iso3', "value" => $country->iso3],
                ["name" => 'name', "value" => $country->name],
                ["name" => 'name_2', "value" => $country->name_2],
                ["name" => 'name_3', "value" => $country->name_3],
            ];

            $obj = null;
            foreach ($search_array as $search) {
                if (!$obj) {
                    $obj = array_column($decoded_data, null, $search['name'])[$search['value']] ?? false;
                }
            }

            if ($obj) {
                $transf = new \stdClass();
                $transf->data = $obj;
                $data = json_encode($transf);
            }
        }

        if ($data != false) {
            $decoded_data = json_decode($data);
            $retrived_data = $decoded_data->data;
            return $retrived_data;
        } else {
            return null;
        }
    }


    /////////////////////////////////////////////////////////////////////////

    public function get_countries($selected = null)
    {
        $countries_data = file_get_contents(
            'https://countriesnow.space/api/v0.1/countries/flag/images'
        );
        $decoded_countries_data = json_decode($countries_data)->data;

        foreach ($decoded_countries_data as $decoded_country) {
            // Fixing supplier api incosistent country names
            switch ($decoded_country->name) {
                case 'Bahamas':
                    $decoded_country->name_2 = "Bahamas, The";
                    $decoded_country->name_3 = null;
                    break;
                case 'Congo':
                    $decoded_country->name_2 = "Congo Rep.";
                    $decoded_country->name_3 = "Congo, Rep.";
                    break;
                case 'Hong Kong':
                    $decoded_country->name_2 = "China, Hong Kong SAR";
                    $decoded_country->name_3 = "Hong Kong SAR, China";
                    break;
                case 'Iran, Islamic Rep.':
                    $decoded_country->name_2 = "Iran (Islamic Republic of)";
                    $decoded_country->name_3 = "Iran";
                    break;
                case 'Sudan':
                    $decoded_country->name_2 = "Republic of South Sudan";
                    $decoded_country->name_3 = null;
                    break;
                case 'United Kingdom':
                    $decoded_country->name_2 = "United Kingdom of Great Britain and Northern Ireland";
                    $decoded_country->name_3 = null;
                    break;
                case 'Tanzania':
                    $decoded_country->name_2 = "United Republic of Tanzania";
                    $decoded_country->name_3 = null;
                    break;
                case 'United States':
                    $decoded_country->name_2 = "United States of America";
                    $decoded_country->name_3 = null;
                    break;
                case 'Yemen':
                    $decoded_country->name_2 = "Yemen, Rep.";
                    $decoded_country->name_3 = null;
                    break;
                default:
                    $decoded_country->name_2 = null;
                    $decoded_country->name_3 = null;
                    break;
            }
        }

        // Add missing supplier Data
        $decoded_countries_data[] = (object) [
            "name" => "Russia",
            "name_2" => "Russian Federation",
            "name_3" => null,
            "flag" => "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg",
            "iso2" => "RU",
            "iso3" => "RUS"
        ];
        $decoded_countries_data[] = (object) [
            "name" => "Congo, The Democratic Republic of the",
            "name_2" => "Congo, Dem. Rep.",
            "name_3" => null,
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg",
            "iso2" => "CD",
            "iso3" => "COD"
        ];
        $decoded_countries_data[] = (object) [
            "name" => "Libya",
            "name_2" => null,
            "name_3" => null,
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Libya.svg",
            "iso2" => "LY",
            "iso3" => "LBY"
        ];
        $decoded_countries_data[] = (object) [
            "name" => "Bolivia",
            "name_2" => "Bolivia (Plurinational State of)",
            "name_3" => null,
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg",
            "iso2" => "BO",
            "iso3" => "BOL"
        ];
        $decoded_countries_data[] = (object) [
            "name" => "Venezuela",
            "name_2" => "Venezuela, RB",
            "name_3" => "Venezuela (Bolivarian Republic of)",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg",
            "iso2" => "VE",
            "iso3" => "VEN"
        ];
        $decoded_countries_data[] = (object) [
            "name" => "North Korea",
            "name_2" => "Korea, Dem. People’s Rep.",
            "name_3" => "Democratic People's Republic of Korea",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_North_Korea.svg",
            "iso2" => "KP",
            "iso3" => "PRK"
        ];
        $decoded_countries_data[] = (object) [
            "name" => "South Korea",
            "name_2" => "Korea, Rep.",
            "name_3" => "Republic of Korea",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg",
            "iso2" => "KR",
            "iso3" => "KOR"
        ];
        $decoded_countries_data[] = (object) [
            "name" => "Ivory Coast",
            "name_2" => "Côte d'Ivoire",
            "name_3" => "Cote d'Ivoire",
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg",
            "iso2" => "CI",
            "iso3" => "CIV"
        ];
        $decoded_countries_data[] = (object) [
            "name" => "Tanzania",
            "name_2" => "United Republic of Tanzania",
            "name_3" => null,
            "flag" => "https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tanzania.svg",
            "iso2" => "TZ",
            "iso3" => "TZA"
        ];

        if ($selected) {
            $country = array_column($decoded_countries_data, null, 'iso2')[$selected] ?? false;
            return $country;
        } else {
            // Extract names into a separate array
            $names = array_map(function ($item) {
                return $item->name;
            }, $decoded_countries_data);

            // Sort the original array based on the names
            array_multisort($names, SORT_ASC, $decoded_countries_data);

            return $decoded_countries_data;
        }
    }
}
