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

class AllCities extends Component {
  constructor() {
    super();
    this.state = {
      cities: {},
      loading: true,
      sorting: "asc",
    };

    this.columns = [
      { label: "City", accessor: "city" },
      { label: "Country", accessor: "country" },
      { label: "Year", accessor: "population_year" },
      { label: "Value", accessor: "population_value" },
    ];

    this.defaultSorting = { accessor: "population_value", direction: "asc" };
  }

  componentDidMount() {
    this.postCities();
  }

  // get
  getCities() {
    axios.get(`http://localhost:8000/api/cities/get`).then((response) => {
      this.setState({ cities: response.data, loading: false });
    });
  }

  // post
  postCities() {
    let data = {
      order: "asc",
    };

    axios
      .post("http://localhost:8000/api/cities/post", data)
      .then((response) => {
        this.setState({ cities: response, loading: false });
      });
  }

  render() {
    const loading = this.state.loading;

    const markerBlue = new L.Icon({
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
    });

    return (
      <div>
        {loading ? (
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
                <Marker icon={markerBlue} position={[51.505, -0.09]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
                {this.state.cities.data.map((item) => (
                  <Marker icon={markerRed} position={[item.lat, item.long]}>
                    <Popup>
                      {item.country} - {item.iso2}.
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="p-10 w-full">
              <Table
                columns={this.columns}
                defaultSorting={this.defaultSorting}
                tableData={this.state.cities.data}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default AllCities;
