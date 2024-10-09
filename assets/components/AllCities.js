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
      { label: "Full Name 2", accessor: "full_name" },
      { label: "Email", accessor: "email" },
      { label: "Gender", accessor: "gender" },
      { label: "Age", accessor: "age" },
      { label: "Start date", accessor: "start_date" },
    ];
  }

  componentDidMount() {
    this.postCities();
  }

  // get
  getCities() {
    axios.get(`http://localhost:8000/api/cities/get`).then((cities) => {
      this.setState({ cities: cities.data, loading: false });
    });
  }

  // post
  postCities() {
    let data = {
      order: "asc",
    };

    //axios.defaults.headers.post["Content-Type"] = "application/json";
    //axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    /*     axios.defaults.headers.post["Access-Control-Allow-Methods"] = "GET,POST";
    axios.defaults.headers.post["Access-Control-Allow-Credentials"] = "true";
    axios.defaults.headers.post["Access-Control-Allow-Headers"] =
      "Content-Type";
    axios.defaults.headers.post["Access-Control-Expose-Headers"] = "*";
    axios.defaults.headers.post["Access-Control-Max-Age"] = "3600"; */

    axios.post("http://localhost:8000/api/cities/post", data).then((cities) => {
      this.setState({ cities: cities.data, loading: false });
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    City
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Country
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Population Year
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Population
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Sort?
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.cities.data.map((city) => (
                  <tr
                    className="even:bg-gray-50 odd:bg-white border-b"
                    key={city.city}
                  >
                    <td>{city.city}</td>
                    <td>{city.country}</td>
                    <td>{city.populationCounts[0].year}</td>
                    <td>{city.populationCounts[0].value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-10 w-full">
          <Table columns={this.columns} />
        </div>
      </div>
    );
  }
}
export default AllCities;
