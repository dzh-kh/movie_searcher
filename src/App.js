import React from "react";
import "./styles/app.css";
// import AsyncSelect from "react-select/async";
// import { validateYupSchema } from "formik";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import {
  Header,
  CatalogPage,
  SingleMoviePage,
  SingleCollectionPage,
  SearchedTitleList,
  UserPage,
} from "./components";
// import Footer from "./components/Footer";

// const theme = createTheme({
//   typography: {
//     allVariants: {
//       fontFamily: "Bebas Neue",
//     },
//   },
// });

function App() {
  return (
    <>
      {/* <ThemeProvider theme={theme}> */}
      <Header />
      <Routes>
        <Route path="/movie/:id/:section" element={<SingleMoviePage />} />
        <Route path="/catalog/" element={<CatalogPage />} />
        <Route path="/collection/:id" element={<SingleCollectionPage />} />
        <Route path="/search/" element={<SearchedTitleList />} />
        <Route path="/user/" element={<UserPage />} />
      </Routes>
      {/* <Footer /> */}
      {/* </ThemeProvider> */}
    </>
  );
}

export default App;
