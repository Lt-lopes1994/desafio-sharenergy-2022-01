import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { format, formatISO } from "date-fns";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import api from "../../Services/api";
import ArticleModal from "../Modal";
import ButtonSearch from "../Button";
import "./styles.css";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Title",
  },
  {
    id: "summary",
    numeric: false,
    disablePadding: false,
    label: "Summary",
  },
  {
    id: "publishedAt",
    numeric: true,
    disablePadding: false,
    label: "Published at",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = () => {
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        ARTICLES
      </Typography>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false); //eslint-disable-line
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [articles, setArticles] = useState([]);
  const [input, setInput] = useState("");
  const [lowerDate, setLowerDate] = useState("");
  const [higherDate, setHigherDate] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState({});
  const [idModal, setIdModal] = useState(0);

  function handleArticleClick(pagination) {
    if (idModal + pagination < 0) {
      setIdModal(articles.length - 1);
      return;
    }

    if (idModal + pagination > articles.length - 1) {
      setIdModal(0);
      return;
    }

    setIdModal(idModal + pagination);
    setCurrentArticle(articles[idModal]);
  }

  function handleCurrentArticle(article, index) {
    setModalOpen(true);
    setCurrentArticle(article);
  }

  function handleCloseModal() {
    setModalOpen(false);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = articles.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, article, index) => {
    setIdModal(index);
    setCurrentArticle(article);
    setModalOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - articles.length) : 0;

  async function fetchData() {
    try {
      const response = await api.get("/articles");

      setArticles(response.data);
    } catch (error) {
      alert(error.code, error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleSearch() {
    setSearch(input);

    setInput("");
    setLowerDate("");
    setHigherDate("");
  }

  async function handleLoadSearchData() {
    const url =
      lowerDate && higherDate
        ? `/articles?title_contains=${search}&publishedAt_lte=${formatISO(
            new Date(lowerDate)
          )}&publishedAt_gte=${formatISO(new Date(higherDate))}`
        : `/articles?title_contains=${search}`;
    try {
      const response = await api.get(url);

      setArticles(response.data);
    } catch (error) {}
  }

  useEffect(() => {
    handleLoadSearchData();
  }, [search]); //eslint-disable-line

  return (
    <div className="teste">
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />

          <div className="containerSearch">
            <SearchIcon
              style={{ marginRight: "-0.5rem", marginLeft: "2rem" }}
              className="searchIcon"
              color="primary"
              fontSize="medium"
            />

            <input
              type="text"
              placeholder="Pesquisa por titulo:"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <label className="lowerDate">
              De:
              <input
                type={"date"}
                value={lowerDate}
                onChange={(e) => setLowerDate(e.target.value)}
              />
            </label>

            <label className="higherDate">
              Até:
              <input
                type={"date"}
                value={higherDate}
                onChange={(e) => setHigherDate(e.target.value)}
              />
            </label>
            <ButtonSearch handleSearch={handleSearch} />
          </div>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "small"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={articles.length}
              />

              <TableBody>
                {stableSort(articles, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((article, index) => {
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, article, index)}
                        tabIndex={-1}
                        key={article.id}
                        item={article}
                        handleCurrentArticle={handleCurrentArticle}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {article.title}
                        </TableCell>
                        <TableCell align="center">{article.summary}</TableCell>
                        <TableCell align="center">
                          {format(new Date(article.publishedAt), "dd/MM/yy")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={articles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <ArticleModal
          modalOpen={modalOpen}
          handleClose={handleCloseModal}
          article={currentArticle}
          handleArticleClick={handleArticleClick}
        />
      </Box>
    </div>
  );
}
