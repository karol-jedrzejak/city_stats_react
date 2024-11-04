import React from "react";
import { useState } from "react";

import Navigation from "./Navigation";
import AllCities from "./AllCities";
import AllCountries from "./AllCountries";
import Country from "./Country";
import Capitals from "./Capitals";
import City from "./City";
import Map from "./Map";

const App = () => {
  const [navigation, setNavigation] = useState([
    { name: "All Countries", href: "#", current: false }, // dane wszystkich miast
    { name: "All Cities", href: "#", current: false }, // dane wszystkich miast
    { name: "Country", href: "#", current: true }, // dane wszystkich miast w danym kraju
    { name: "Capitals", href: "#", current: false }, // dane wszystkich stolic
    { name: "City", href: "#", current: false }, // dane wybranego miasta
    { name: "Map", href: "#", current: false }, // mapka państw
  ]);

  const changeCurrent = (current) => {
    const changedNavigation = [...navigation];
    changedNavigation.forEach((element) => {
      if (element.name === current) {
        element.current = true;
      } else {
        element.current = false;
      }
    });
    setNavigation(changedNavigation);
  };

  const project = () => {
    const current = navigation.find((element) => element.current === true);

    switch (current.name) {
      case "All Cities":
        return <AllCities />;
      case "All Countries":
        return <AllCountries />;
      case "Country":
        return <Country />;
      case "Capitals":
        return <Capitals />;
      case "City":
        return <City />;
      case "Map":
        return <Map />;
      default:
        return <ByPopulation />;
    }
  };

  return (
    <div>
      <Navigation
        navigation={navigation}
        setNavigation={setNavigation}
        changeCurrent={changeCurrent}
      />
      <div className="bg-gray-50">{project()}</div>
    </div>
  );
};

export default App;
