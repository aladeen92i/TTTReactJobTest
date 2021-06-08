import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "@fontsource/roboto";
import { Grid } from "@material-ui/core";
import ReservationForm from "./components/ReservationForm";
import Appbar from "./components/Appbar";

export default function App() {
  return (
      <div className="App">
        <Appbar />
        <br />
        <Grid container alignItems="center" justify="center" spacing={2}>
          <ReservationForm />
        </Grid>
      </div>
  );
}
