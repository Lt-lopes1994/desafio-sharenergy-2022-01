import * as React from "react";
import Button from "@mui/material/Button";

export default function ButtonSearch({ handleSearch }) {
  return (
    <Button variant="contained" disableElevation onClick={handleSearch}>
      Pesquisar
    </Button>
  );
}
