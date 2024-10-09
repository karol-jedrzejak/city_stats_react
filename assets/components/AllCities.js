import React, { Component } from "react";
import axios from "axios";
import Table from "./table/Table";

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
    return (
      <div>
        {loading ? (
          <div className="row text-center">
            <span>LOADING</span>
          </div>
        ) : (
          <div className="p-10 w-full">
            <Table columns={this.columns} tableData={this.state.cities.data} />
          </div>
        )}
      </div>
    );
  }
}
export default AllCities;
