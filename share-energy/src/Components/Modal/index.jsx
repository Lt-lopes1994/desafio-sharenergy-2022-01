import "./styles.css";
import { format } from "date-fns";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

function ArticleModal({ modalOpen, handleClose, article, handleArticleClick }) {
  return (
    <>
      {modalOpen && (
        <div className="containerModal">
          <CloseSharpIcon
            fontSize="large"
            className="closeIcon"
            onClick={handleClose}
          />
          <div className="modal">
            <ArrowBackIosNewIcon
              className="arrowBack"
              fontSize="large"
              onClick={(e) => handleArticleClick(-1)}
              color="primary"
              style={{ marginLeft: "0.5rem", cursor: "pointer" }}
            />

            <div className="content">
              <img className="articlePic" src={article.imageUrl} alt="" />

              <strong>{article.title}</strong>

              <p>{article.summary}</p>

              <a href={article.url}>Acesse a noticia completa clicando aqui!</a>
              <div className="dateContent">
                <span>
                  Publicado em:
                  {format(new Date(article.publishedAt), "dd/MM/yyyy")}
                </span>
                <span>
                  Atualizado em:
                  {format(new Date(article.updatedAt), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
            <ArrowForwardIosIcon
              className="arrowForward"
              fontSize="large"
              color="primary"
              style={{ cursor: "pointer" }}
              onClick={() => handleArticleClick(+1)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ArticleModal;
