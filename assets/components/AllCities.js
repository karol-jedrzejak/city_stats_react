import React, { Component } from "react";
import axios from "axios";

class AllCities extends Component {
  constructor() {
    super();
    this.state = {
      cities: {},
      loading: true,
      sorting: "asc",
    };
  }

  componentDidMount() {
    this.getCities();
    console.log(this.state.cities);
  }

  // get
  /*   getCities() {
    axios.get(`http://localhost:8000/api/cities/get`).then((cities) => {
      this.setState({ cities: cities.data, loading: false });
    });
  } */

  // post
  getCities() {
    let axiosConfig = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          '"GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"',
        "Access-Control-Allow-Headers": '"Content-Type", "Authorization"',
        "Access-Control-Max-Age": "3600",
        "Access-Control-Expose-Headers": "Link",
      },
    };

    let data = {
      order: "dsc",
    };

    axios
      .post("http://localhost:8000/api/cities", data, axiosConfig)
      .then((cities) => {
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
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Sort?
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.cities.data.map((city) => (
                  <tr className="even:bg-gray-50 odd:bg-white border-b">
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
      </div>
    );
  }
}
export default AllCities;
