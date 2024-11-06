import React, { Component } from "react";
import axios from "axios";
import Table from "./table/Table";
import Loading from "./Loading";
import Chart from "react-apexcharts";

class Country extends Component {
  constructor() {
    super();
    this.state = {
      cities: {},
      loading_cities: true,
      sorting: "dsc",
      country: {},

      chart_population_options: {},
      chart_population_series: [],
      chart_cities_options: {},
      chart_cities_series: [],
    };

    this.columns_cities = [
      { label: "City", accessor: "city" },
      { label: "Country", accessor: "country" },
      { label: "Year", accessor: "population_year" },
      {
        label: "Value",
        accessor: "population_value",
        formatNumber: true,
        classNames: "text-right",
      },
    ];

    this.defaultSorting_cities = {
      accessor: "population_value",
      direction: "dsc",
    };
  }

  componentDidMount() {
    this.citiesByPopulation();
  }

  // post
  citiesByPopulation() {
    let data = {
      order: "dsc",
      iso2: this.props.currentCountry,
    };

    axios.post("http://localhost:8000/api/country", data).then((response) => {
      if (response.data.country.population) {
        response.data.country.population.forEach((element) => {
          element[0] = new Date(element[0], 1, 1);
        });
      }

      let cities_data = [];

      if (response.data.cities) {
        let max = response.data.cities.length;
        if (max > 10) {
          max = 10;
        }
        for (let index = 0; index < max; index++) {
          let city_data = [];
          response.data.cities[index].populationCounts.forEach(
            (populationEntry) => {
              city_data.push([
                new Date(populationEntry.year, 1, 1),
                populationEntry.value,
              ]);
            }
          );
          cities_data.push({
            name: response.data.cities[index].city,
            data: city_data,
          });
        }
      }

      console.log(response.data);
      console.log(cities_data);

      this.setState({
        cities: response.data.cities,
        country: response.data.country,
        loading_cities: false,

        // Chart Population
        chart_population_options: {
          chart: {
            type: "area",
            zoom: {
              autoScaleYaxis: true,
            },
          },
          stroke: {
            curve: "smooth",
          },
          dataLabels: {
            enabled: false,
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return (val / 1000000).toFixed(2);
              },
            },
            title: {
              text: "Population [mln]",
            },
          },
          xaxis: {
            type: "datetime",
            format: "YYYY",
            title: {
              text: "Year",
            },
          },
        },
        chart_population_series: [
          {
            name: "Population [mln]",
            data: response.data.country.population,
          },
        ],

        // Chart Cities
        chart_cities_options: {
          chart: {
            type: "area",
            zoom: {
              autoScaleYaxis: true,
            },
          },
          stroke: {
            curve: "smooth",
          },
          dataLabels: {
            enabled: false,
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return (val / 1000000).toFixed(2);
              },
            },
            title: {
              text: "Population [mln]",
            },
          },
          xaxis: {
            type: "datetime",
            format: "YYYY",
            title: {
              text: "Year",
            },
          },
        },
        chart_cities_series: cities_data,
        ///
      });
    });
  }

  render() {
    const loading_cities = this.state.loading_cities;

    return (
      <div className="min-h-full bg-gray-50 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading_cities ? (
            <Loading />
          ) : (
            <div>
              <div className="bg-gray-50">
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <div className="pt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-1">
                    {/* ///////////////////// */}
                    <div className="relative">
                      <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                        <div className="p-8 sm:p-10">
                          <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                            INFO:
                          </p>
                          <div className="mt-2">
                            <table>
                              <tbody>
                                <tr>
                                  <td className="p-2">Name:</td>
                                  <td className="p-2">
                                    {this.state.country.name}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2">Alt. Name:</td>
                                  <td className="p-2">
                                    {this.state.country.name_2}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2">Alt. Name 2:</td>
                                  <td className="p-2">
                                    {this.state.country.name_3}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2">Capital:</td>
                                  <td className="p-2">
                                    {this.state.country.capital}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2">Currency:</td>
                                  <td className="p-2">
                                    {this.state.country.currency}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
                    </div>
                    {/* ///////////////////// */}
                    <div className="relative">
                      <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                        <div className="p-8 sm:p-10">
                          <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                            CODES:
                          </p>
                          <div className="mt-2 text-gray-600">
                            <table>
                              <tbody>
                                <tr>
                                  <td className="p-2">ISO 2 Code:</td>
                                  <td className="p-2">
                                    {this.state.country.iso2}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2">ISO 3 Code:</td>
                                  <td className="p-2">
                                    {this.state.country.iso3}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2">Unicode Flag:</td>
                                  <td className="p-2">
                                    {this.state.country.unicodeFlag}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2">Dial Code:</td>
                                  <td className="p-2">
                                    {this.state.country.dial_code}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
                    </div>
                    {/* ///////////////////// */}
                    <div className="relative">
                      <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-r-[calc(2rem+1px)]">
                        <div className="p-8 h-full flex justify-center items-center">
                          <img
                            className="w-fit border border-black"
                            src={this.state.country.flag}
                          />
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-r-[2rem]"></div>
                    </div>
                    {/* ///////////////////// */}
                  </div>
                </div>
                {/* ///////////////////// */}
                <div className="pt-4 mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <div className="p-10 relative">
                    <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-[calc(2rem+1px)]">
                      <p className="m-5 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        POPULATION:
                      </p>
                      <div>
                        {this.state.country.population ? (
                          <Chart
                            options={this.state.chart_population_options}
                            series={this.state.chart_population_series}
                            type="area"
                            height={350}
                          />
                        ) : (
                          <div>Missing Data in Supplier Api</div>
                        )}
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-[2rem]"></div>
                  </div>
                </div>
                {/* ///////////////////// */}
                <div className="pt-4 mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <div className="p-10 relative">
                    <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-[calc(2rem+1px)]">
                      <p className="m-5 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        10 BIGEST CITIES POPULATION:
                      </p>
                      <div>
                        {this.state.cities ? (
                          <Chart
                            options={this.state.chart_cities_options}
                            series={this.state.chart_cities_series}
                            type="area"
                            height={700}
                          />
                        ) : (
                          <div>Missing Data in Supplier Api</div>
                        )}
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-[2rem]"></div>
                  </div>
                </div>
                {/* ///////////////////// */}
                <div className="pt-4 mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <div className="p-10 relative">
                    <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-[calc(2rem+1px)]">
                      <p className="m-5 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        CITIES:
                      </p>
                      <div className="m-5">
                        {this.state.cities ? (
                          <Table
                            changeCurrent={this.props.changeCurrent}
                            columns={this.columns_cities}
                            defaultSorting={this.defaultSorting_cities}
                            tableData={this.state.cities}
                          />
                        ) : (
                          <div>Missing Data in Supplier Api</div>
                        )}
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-[2rem]"></div>
                  </div>
                </div>
                {/* ///////////////////// */}
                <div className="pt-4 mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <div className="p-10 relative">
                    <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-[calc(2rem+1px)]">
                      <p className="m-5 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        STATES:
                      </p>
                      <div className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                        {this.state.country.states ? (
                          <div>
                            {this.state.country.states.map(
                              ({ name, state_code }, key) => {
                                return (
                                  <div key={key}>
                                    - {state_code} - {name}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ) : (
                          <div>Missing Data in Supplier Api</div>
                        )}
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-[2rem]"></div>
                  </div>
                </div>
                {/* ///////////////////// */}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Country;
