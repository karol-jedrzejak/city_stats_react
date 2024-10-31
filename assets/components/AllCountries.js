import React, { Component } from "react";
import axios from "axios";
import Table from "./table/Table";

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
      loading_countries: true,
      sorting: "asc",
    };

    this.columns_countries = [
      { label: "Id", accessor: "id" },
      { label: "Country", accessor: "country" },
      { label: "Flag", accessor: "flag", formatImage: true },
      { label: "Code", accessor: "code" },
      { label: "Year", accessor: "population_year" },
      {
        label: "Value",
        accessor: "population_value",
        formatNumber: true,
        classNames: "text-right",
      },
    ];

    this.defaultSorting_countries = {
      accessor: "country",
      direction: "asc",
    };
  }

  componentDidMount() {
    this.countriesByPopulation();
  }

  // get
  countriesByPopulation() {
    axios
      .get(`http://localhost:8000/api/countries_by_population`)
      .then((response) => {
        this.setState({ countries: response.data, loading_countries: false });
      });
  }

  render() {
    const loading_countries = this.state.loading_countries;

    /*     const markerBlue = new L.Icon({
      iconUrl: require("../../public/leaflet/marker-icon-blue.png"),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -46],
    });

    const markerRed = new L.Icon({
      iconUrl: require("../../public/leaflet/marker-icon-red.png"),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -46],
    }); */

    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading_countries ? (
            <div className="row text-center">
              <span>LOADING</span>
            </div>
          ) : (
            <div>
              <div className="p-5 w-full">
                <MapContainer
                  center={[51.505, -0.09]}
                  zoom={7}
                  style={{ height: "600px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    detectRetina="true"
                  />
                  {this.state.countries.map((item) => (
                    <Marker
                      icon={
                        new L.Icon({
                          iconUrl: item.flag,
                          iconSize: [30, 20],
                          iconAnchor: [15, 10],
                          popupAnchor: [0, -30],
                        })
                        /*                     new L.Icon({
                          iconUrl: require("../../public/leaflet/marker-icon-blue.png"),
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [0, -46],
                        }) */
                      }
                      position={[item.lat, item.long]}
                    >
                      <Popup>
                        <img className="w-12" src={item.flag} />
                        <br />
                        <br />
                        <b>
                          {item.country} [{item.iso3}]
                        </b>
                        <br />
                        {item.population_year} -{" "}
                        {Intl.NumberFormat().format(item.population_value)}{" "}
                        people
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="p-10 w-full">
                <Table
                  columns={this.columns_countries}
                  defaultSorting={this.defaultSorting_countries}
                  tableData={this.state.countries}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default AllCountries;