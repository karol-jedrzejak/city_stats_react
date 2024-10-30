import React, { Component } from "react";
import axios from "axios";
import Table from "./table/Table";

class AllCities extends Component {
  constructor() {
    super();
    this.state = {
      cities: {},
      loading_cities: true,
      sorting: "asc",
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
    };

    axios
      .post("http://localhost:8000/api/cities_by_population", data)
      .then((response) => {
        this.setState({ cities: response, loading_cities: false });
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
                <Table
                  columns={this.columns_cities}
                  defaultSorting={this.defaultSorting_cities}
                  tableData={this.state.cities.data}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default AllCities;
