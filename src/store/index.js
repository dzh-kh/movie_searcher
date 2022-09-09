import { createStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import reducer from "../reducers/movies";
import filters from "../reducers/filters";

const store = createStore(
  combineReducers({ reducer, filters }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
