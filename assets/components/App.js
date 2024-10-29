import React from "react";
import { useState } from "react";

import Navigation from "./Navigation";
import ByPopulation from "./ByPopulation";
import Countries from "./Countries";
import Capitals from "./Capitals";
import City from "./City";
import Map from "./Map";

const App = () => {
  const [navigation, setNavigation] = useState([
    { name: "By Population", href: "#", current: true }, // dane wszystkich miast
    { name: "Countries", href: "#", current: false }, // dane wszystkich miast w danym kraju
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
      case "By Population":
        return <ByPopulation />;
      case "Countries":
        return <Countries />;
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
      {/* <AllCities /> */}
      <div>{project()}</div>
    </div>
  );
};

export default App;
