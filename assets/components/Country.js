import React, { Component } from "react";
import axios from "axios";
import Table from "./table/Table";

class Country extends Component {
  constructor() {
    super();
    this.state = {
      cities: {},
      loading_cities: true,
      sorting: "asc",
      country: {},
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
      direction: "asc",
    };
  }

  componentDidMount() {
    this.citiesByPopulation();
  }

  // post
  citiesByPopulation() {
    let data = {
      order: "asc",
      iso2: "pl",
    };

    axios.post("http://localhost:8000/api/country", data).then((response) => {
      this.setState({
        cities: response.data.cities,
        country: response.data.country,
        loading_cities: false,
      });
    });
  }

  render() {
    const loading_cities = this.state.loading_cities;
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading_cities ? (
            <div className="row text-center">
              <span>LOADING</span>
            </div>
          ) : (
            <div>
              <div className="p-10 w-full">
                INFO:
                <br />
                Nazwa: {this.state.country.name}
                <br />
                ISO2: {this.state.country.iso2}
                <br />
                ISO3: {this.state.country.iso3}
                <br />
                Flag:{" "}
                <img
                  className="w-48 border border-black m-4"
                  src={this.state.country.flag}
                />
                <br />
              </div>
              <div className="p-10 w-full">
                <Table
                  columns={this.columns_cities}
                  defaultSorting={this.defaultSorting_cities}
                  tableData={this.state.cities}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Country;
