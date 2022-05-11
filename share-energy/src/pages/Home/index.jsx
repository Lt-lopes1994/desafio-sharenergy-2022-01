import "./styles.css";
import Header from "../../Components/Header";
import ArticlesPagination from "../../Components/Pagination/";

function Home() {
  return (
    <div className="Home">
      <Header />
      <ArticlesPagination />
    </div>
  );
}

export default Home;
