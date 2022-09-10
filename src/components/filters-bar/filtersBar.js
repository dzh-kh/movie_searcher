import React, { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { Formik, Form } from "formik";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";

import {
  Slider,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  Container,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useMoviesService from "../movies-filters/service/movies-server";
import {
  filtersFetched,
  filtersFetching,
  filtersFetchingError,
  paramsFetched,
} from "../../actions";

function FiltersBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getMovieGenresList } = useMoviesService();

  useEffect(() => {
    dispatch(filtersFetching());
    getMovieGenresList()
      .then((res) => dispatch(filtersFetched(res)))
      .catch(dispatch(filtersFetchingError()));
  }, []);

  const getParams = (value) => {
    const { voteMax, voteMin, sortBy, checked, excluded, keyword, person } =
      value;
    const checkedValues = checked.map((el) => el[0]);
    const excludedValues = excluded.map((el) => el[0]);
    const keywordValues = keyword.map((el) => el.value);
    const personValues = person.map((el) => el.value);
    return `&sort_by=${sortBy}.desc&vote_average.gte=${voteMin}
                &vote_average.lte=${voteMax}
                &with_keywords=${keywordValues.join("%2C")}
                &with_people=${personValues.join("%2C")}
                &with_genres=${checkedValues.join("%2C")}
                &without_genres=${excludedValues.join("%2C")}`.replace(
      /\s+/g,
      "",
    );
  };
  const transformParams = (value) => {
    const { voteMax, voteMin, sortBy, checked, excluded, keyword, person } =
      value;
    const checkedValues =
      checked.length >= 1
        ? `&with_genres=${checked.map((el) => el[0]).join("%2C")}`
        : "";
    const excludedValues =
      excluded.length >= 1
        ? `&without_genres=${excluded.map((el) => el[0]).join("%2C")}`
        : "";
    const keywordValues =
      keyword.length >= 1
        ? `&with_keywords=${keyword
            .map((el) => `${el.value}+${el.label}`)
            .join("%2C")}`
        : "";
    const personValues =
      person.length >= 1
        ? `&with_people=${person
            .map((el) => `${el.value}+${el.label}`)
            .join("%2C")}`
        : "";
    const sortValue = sortBy === null ? "" : `&sort_by=${sortBy}.desc`;
    return `${sortValue}&vote_average.gte=${voteMin}
                &vote_average.lte=${voteMax}
                ${keywordValues}
                ${personValues}
                ${checkedValues}
                ${excludedValues}`.replace(/\s+/g, "");
  };
  return (
    <Formik
      initialValues={{
        reset: false,
        checked: [],
        excluded: [],
        voteMax: searchParams.has("vote_average.lte")
          ? +searchParams.get("vote_average.lte")
          : 10,
        voteMin: searchParams.has("vote_average.gte")
          ? +searchParams.get("vote_average.gte")
          : 0,
        sortBy: searchParams.has("sort_by")
          ? searchParams.get("sort_by")?.split(".")[0]
          : "popularity",
        keyword: searchParams.has("with_keywords")
          ? searchParams
              .get("with_keywords")
              .split(",")
              .map((e) => {
                const [value, label] = e.split(" ");
                return { label, value };
              })
          : [],
        person: searchParams.has("with_people")
          ? searchParams
              .get("with_people")
              .split(",")
              .map((e) => {
                const [value, label] = e.split(" ");
                return { label, value };
              })
          : [],
      }}
      enableReinitialize
      onSubmit={(value) => {
        const params = getParams(value);
        dispatch(paramsFetched(params));
        navigate(`/?page=1${transformParams(value)}`);
      }}
    >
      {({ setFieldValue, values, resetForm }) => (
        <Container
          sx={{
            maxHeight: "98vh",
            overflow: "auto",
            position: "sticky",
            top: "7px",
            boxShadow: "0 0 1rem 0 rgba(0, 0, 0, .2)",
            borderRadius: "5px",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            padding: "1em",
          }}
        >
          <Form>
            <SortingRadioButton
              searchParams={searchParams}
              value={values.sortBy}
              setFieldValue={setFieldValue}
            />
            <GenresList
              values={values}
              setFieldValue={setFieldValue}
              searchParams={searchParams}
            />{" "}
            <DoubleRange
              voteMax={values.voteMax}
              voteMin={values.voteMin}
              setFieldValue={setFieldValue}
            />{" "}
            <SelectField
              values={values.keyword}
              title="keyword"
              setFieldValue={setFieldValue}
            />{" "}
            <SelectField
              values={values.person}
              title="person"
              setFieldValue={setFieldValue}
            />{" "}
            <Button variant="outlined" type="submit">
              click{" "}
            </Button>{" "}
            <Button
              onClick={() => {
                resetForm();
                setFieldValue("reset", !values.reset);
              }}
              variant="contained"
              id="reset"
              name="reset"
              type="reset"
            >
              reset
            </Button>
          </Form>
        </Container>
      )}
    </Formik>
  );
}

export default FiltersBar;

const SortingRadioButton = React.memo(({ setFieldValue, value }) => {
  const handleChange = (e, value) => setFieldValue("sortBy", value);
  return (
    <FormControl>
      <Typography>Sort by:</Typography>
      <RadioGroup value={value} name="sortBy" row onChange={handleChange}>
        <FormControlLabel
          value="popularity"
          control={<Radio />}
          label="Popularity"
        />
        <FormControlLabel
          value="release_date"
          control={<Radio />}
          label="Release date"
        />
        <FormControlLabel
          value="vote_average"
          control={<Radio />}
          label="Vote average"
        />
      </RadioGroup>
    </FormControl>
  );
});

const DoubleRange = React.memo(({ setFieldValue, voteMax, voteMin }) => {
  const [value, setValue] = useState([0, 10]);
  const minDistance = 0.1;

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
    setFieldValue("voteMin", value[0]);
    setFieldValue("voteMax", value[1]);
  };
  return (
    <>
      <Typography id="track-inverted-slider" gutterBottom>
        Rating
      </Typography>
      <Slider
        max={10}
        min={0}
        step={0.1}
        getAriaLabel={() => "Minimum distance"}
        value={[voteMin, voteMax]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={() => `${value}`}
        disableSwap
      />
    </>
  );
});

const SelectField = React.memo(({ setFieldValue, title, values }) => {
  const animatedComponents = makeAnimated();
  const { getSearchedTitle } = useMoviesService();
  const handleChange = (newValue) => {
    setFieldValue(title, newValue);
  };
  const getOptions = (value) => {
    return value.length > 0 ? getSearchedTitle(title, value) : null;
  };
  const noOptions = (e) => (e.inputValue ? "Nothing found" : null);
  return (
    <AsyncSelect
      id={title}
      name={title}
      noOptionsMessage={noOptions}
      className="react-select-container"
      classNamePrefix="react-select"
      components={animatedComponents}
      onChange={handleChange}
      loadOptions={getOptions}
      isMulti
      isSearchable
      isClearable
      placeholder={`choose ${title}`}
      value={values}
    />
  );
});

const GenresList = React.memo(({ setFieldValue, values, searchParams }) => {
  const { filtersList, filtersLoadingStatus } = useSelector(
    (state) => state.filters,
  );
  const { excluded, reset, checked } = values;
  const [check, setCheck] = useState([]);
  const CHECKBOX_STATE = {
    CHECKED: "CHECKED",
    UNCHECKED: "UNCHECKED",
    EXCLUDED: "EXCLUDED",
  };
  function getCheckboxState(state) {
    switch (state) {
      case CHECKBOX_STATE.CHECKED:
        return CHECKBOX_STATE.EXCLUDED;
      case CHECKBOX_STATE.EXCLUDED:
        return CHECKBOX_STATE.UNCHECKED;
      case CHECKBOX_STATE.UNCHECKED:
        return CHECKBOX_STATE.CHECKED;
    }
  }
  useEffect(() => {
    const checkStateFilters = Object.fromEntries(
      filtersList.map((el) => {
        return searchParams.get("with_genres")?.includes(String(el.id))
          ? [el.id, CHECKBOX_STATE.CHECKED]
          : searchParams.get("without_genres")?.includes(String(el.id))
          ? [el.id, CHECKBOX_STATE.EXCLUDED]
          : [el.id, CHECKBOX_STATE.UNCHECKED];
      }),
    );
    setCheck(checkStateFilters);
  }, [reset, filtersList]);

  useEffect(() => {
    const checkedval = Object.entries(check).filter(
      (el) => el[1] === "CHECKED",
    );
    const excludedval = Object.entries(check).filter(
      (el) => el[1] === "EXCLUDED",
    );
    setFieldValue("checked", checkedval);
    setFieldValue("excluded", excludedval);
  }, [check]);

  const handleClick = (e, id) =>
    setCheck({ ...check, [id]: getCheckboxState(check[id]) });
  const content = filtersList.map(({ id, name }) => {
    const checkboxValue =
      checked.map((el) => el[0]).indexOf(`${id}`) !== -1
        ? true
        : excluded.map((el) => el[0]).indexOf(`${id}`) !== -1
        ? false
        : "null";
    return (
      <FormControlLabel
        label={name}
        control={
          <Checkbox
            checked={checkboxValue}
            value={checkboxValue}
            indeterminate={checkboxValue === false}
            indeterminateIcon={<CloseIcon />}
            checked={check[id] === "CHECKED"}
            onClick={(e) => handleClick(e, id)}
            id={name}
          />
        }
        key={name}
      />
    );
  });

  return (
    <FormGroup sx={{ display: "flex" }}>
      <Typography>Genres</Typography>
      {filtersLoadingStatus !== "loading" ? content : <CircularProgress />}
    </FormGroup>
  );
});
