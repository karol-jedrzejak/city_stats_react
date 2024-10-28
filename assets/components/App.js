import React from "react";
import { useState } from "react";

import Navigation from "./Navigation";
import AllCities from "./AllCities";
import AllCities2 from "./AllCities2";

const App = () => {
  const [navigation, setNavigation] = useState([
    { name: "Dashboard", href: "#", current: true, page: <AllCities /> },
    { name: "Dashboard2", href: "#", current: false, page: <AllCities2 /> },
    { name: "Team", href: "#", current: false, page: <AllCities /> },
    { name: "Projects", href: "#", current: false, page: <AllCities /> },
    { name: "Calendar", href: "#", current: false, page: <AllCities /> },
    { name: "Reports", href: "#", current: false, page: <AllCities /> },
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
      case "Dashboard2":
        return <AllCities2 />;
      default:
        return <AllCities />;
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
