import React, { Component } from "react";
import axios from "axios";
import Table from "./table/Table";
import Loading from "./Loading";
import Chart from "react-apexcharts";

import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Icon,
} from "react-leaflet";

class AllCountries extends Component {
  constructor() {
    super();
    this.state = {
      countries: {},
      world_population_options: {},
      world_population_series: [],
      loading_countries: true,
      sorting: "asc",
    };

    this.columns_countries = [
      { label: "Id", accessor: "id" },
      {
        label: "Country",
        accessor: "name",
        link: true,
        link_accessor: "iso2",
        classNames: "cursor-pointer",
      },
      {
        label: "Capital",
        accessor: "capital",
      },
      {
        label: "Flag",
        accessor: "flag",
        formatImage: true,
        classNames: "w-48 flex justify-center items-center",
      },
      { label: "ISO2 Code", accessor: "iso2", classNames: "text-center" },
      { label: "ISO3 Code", accessor: "iso3", classNames: "text-center" },
      {
        label: "Population",
        accessor: "population_value",
        formatNumber: true,
        classNames: "text-right",
      },
    ];

    this.defaultSorting_countries = {
      accessor: "name",
      direction: "asc",
    };
  }

  componentDidMount() {
    this.getWorldPopulation();
    this.countriesByPopulation();
  }

  // get world population
  getWorldPopulation() {
    axios.get(`http://localhost:8000/api/world_population`).then((response) => {
      response.data.forEach((entry) => {
        entry.data.forEach((element) => {
          element = [new Date(element[0], 1, 1), element[1]];
        });
      });

      this.setState({
        world_population_options: {
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
        world_population_series: response.data,
      });
    });
  }

  // get countires
  countriesByPopulation() {
    axios
      .get(`http://localhost:8000/api/countries_by_population`)
      .then((response) => {
        this.setState({ countries: response.data, loading_countries: false });
      });
  }

  render() {
    const loading_countries = this.state.loading_countries;

    return (
      <div className="min-h-full bg-gray-50 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading_countries ? (
            <Loading />
          ) : (
            <div>
              <div className="pt-4 mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                {/* MAP */}
                <div className="p-10 relative">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-[2rem]"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-[calc(2rem+1px)]">
                    <p className="m-5 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                      MAP:
                    </p>
                    <div className="m-5">
                      <MapContainer
                        center={[51.505, -0.09]}
                        zoom={7}
                        style={{ height: "400px", zIndex: 3 }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          detectRetina="true"
                        />
                        {this.state.countries.map((item, key) => (
                          <Marker
                            key={key}
                            icon={
                              new L.Icon({
                                iconUrl: item.flag,
                                iconSize: [30, 20],
                                iconAnchor: [15, 10],
                                popupAnchor: [0, -30],
                              })
                            }
                            position={[item.lat, item.long]}
                          >
                            <Popup>
                              <img className="w-12" src={item.flag} />
                              <br />
                              <b>
                                {item.name} [{item.iso3}]
                              </b>
                              {item.name_2 ? (
                                <span>
                                  <br />
                                  Alt. name - {item.name_2}
                                </span>
                              ) : (
                                ""
                              )}
                              {item.name_3 ? (
                                <span>
                                  <br />
                                  Alt. name 2 - {item.name_3}
                                </span>
                              ) : (
                                ""
                              )}
                              <br />
                              <br />
                              Population ({item.population_year}):
                              <br />
                              {Intl.NumberFormat().format(
                                item.population_value
                              )}{" "}
                              people
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-[2rem]"></div>
                </div>
                {/* Population */}
                <div className="mt-10 p-10 relative">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-[2rem]"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-[calc(2rem+1px)]">
                    <p className="m-5 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                      Population:
                    </p>
                    <div>
                      {this.state.world_population_series ? (
                        <Chart
                          options={this.state.world_population_options}
                          series={this.state.world_population_series}
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
                {/* Countries */}
                <div className="mt-10 p-10 relative">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-[2rem]"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-[calc(2rem+1px)]">
                    <p className="m-5 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                      COUNTRIES:
                    </p>
                    <div className="m-5">
                      <Table
                        changeCurrent={this.props.changeCurrent}
                        columns={this.columns_countries}
                        defaultSorting={this.defaultSorting_countries}
                        tableData={this.state.countries}
                      />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-[2rem]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default AllCountries;
