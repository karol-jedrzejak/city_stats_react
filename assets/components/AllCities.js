import React, { Component } from "react";
import axios from "axios";
import Table from "./table/Table";
import Loading from "./Loading";

class AllCities extends Component {
  constructor() {
    super();
    this.state = {
      cities: {},
      loading_cities: true,
      sorting: "dsc",
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
      <div className="min-h-full bg-gray-50 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading_cities ? (
            <Loading />
          ) : (
            <div>
              <div className="pt-4 mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <div className="p-10 relative">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-[calc(2rem+1px)]">
                    <p className="m-5 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                      ALL CITIES:
                    </p>
                    <div className="m-5">
                      <Table
                        changeCurrent={this.props.changeCurrent}
                        columns={this.columns_cities}
                        defaultSorting={this.defaultSorting_cities}
                        tableData={this.state.cities.data}
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
export default AllCities;
