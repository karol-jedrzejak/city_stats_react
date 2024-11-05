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

      chart_options: {},
      chart_series: [],
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

      this.setState({
        cities: response.data.cities,
        country: response.data.country,
        loading_cities: false,
        chart_options: {
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
        chart_series: [
          {
            name: "series-1",
            data: response.data.country.population,
          },
        ],
      });
    });
  }

  render() {
    const loading_cities = this.state.loading_cities;
    /* 
    function population() {
      return (
        <Chart
          options={this.state.chart_options}
          series={this.state.chart_series}
          type="area"
          height={350}
        />
      );
    } */

    return (
      <div className="min-h-full bg-gray-50 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading_cities ? (
            <Loading />
          ) : (
            <div>
              <div className="bg-gray-50">
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <div className="pt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="relative lg:col-span-2">
                      <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tl-[calc(2rem+1px)]">
                        <div className="p-8 sm:p-10">
                          <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                            INFO:
                          </p>
                          <div className="mt-2 text-gray-600 flex justify-center items-center">
                            <div className="flex-none w-48">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="p-4">Nazwa:</td>
                                    <td className="p-4">
                                      {this.state.country.name}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-4">ISO2:</td>
                                    <td className="p-4">
                                      {this.state.country.iso2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-4">iso3:</td>
                                    <td className="p-4">
                                      {this.state.country.iso3}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="p-8">
                              <img
                                className="w-fit border border-black"
                                src={this.state.country.flag}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tl-[2rem]"></div>
                    </div>
                    {/* ///////////////////// */}
                    <div className="relative lg:col-span-2">
                      <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
                        <div className="p-8 sm:p-10">
                          <p className="mt-2 mb-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                            POPULATION:
                          </p>
                          <div>
                            {this.state.country.population ? (
                              <Chart
                                options={this.state.chart_options}
                                series={this.state.chart_series}
                                type="area"
                                height={350}
                              />
                            ) : (
                              <div>Missing Data in Supplier Api</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-bl-[2rem]"></div>
                    </div>
                    {/* ///////////////////// */}
                    <div className="relative lg:row-span-2 lg:col-start-3 lg:row-start-1">
                      <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-r-[calc(2rem+1px)]">
                        <div className="p-8 sm:p-10">
                          <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
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
                      </div>
                      <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-r-[2rem]"></div>
                    </div>
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
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Country;
