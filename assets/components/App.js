import React from "react";
import { useState } from "react";

import Navigation from "./Navigation";
import AllCities from "./AllCities";
import AllCountries from "./AllCountries";
import Country from "./Country";

const App = () => {
  const [navigation, setNavigation] = useState([
    { name: "All Countries", href: "#", current: true }, // dane wszystkich miast
    { name: "All Cities", href: "#", current: false }, // dane wszystkich miast
    { name: "Country", href: "#", current: false }, // dane wszystkich miast w danym kraju
  ]);

  const [currentCountry, setCurrentCountry] = useState("PL");

  const changeCurrent = (current, country = null, city = null) => {
    const changedNavigation = [...navigation];
    changedNavigation.forEach((element) => {
      if (element.name === current) {
        element.current = true;
      } else {
        element.current = false;
      }
    });
    if (country) {
      setCurrentCountry(country);
    }
    setNavigation(changedNavigation);
    window.scrollTo(0, 0);
  };

  const project = () => {
    const current = navigation.find((element) => element.current === true);

    switch (current.name) {
      case "All Cities":
        return <AllCities changeCurrent={changeCurrent} />;
      case "All Countries":
        return <AllCountries changeCurrent={changeCurrent} />;
      case "Country":
        return (
          <Country
            changeCurrent={changeCurrent}
            currentCountry={currentCountry}
          />
        );
      default:
        return <AllCities changeCurrent={changeCurrent} />;
    }
  };

  return (
    <div>
      <Navigation
        navigation={navigation}
        setNavigation={setNavigation}
        changeCurrent={changeCurrent}
      />
      <div className="bg-gray-50 mt-[64px]">{project()}</div>
    </div>
  );
};

export default App;
