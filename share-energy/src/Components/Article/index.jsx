import "./styles.css";

function Article({ item, handleCurrentArticle }) {
  return (
    <div
      className="containerArticle"
      onClick={() => handleCurrentArticle(item)}
    >
      <img src={item.imageUrl} alt="modal pic" />
      <span>{item.title}</span>

      <div className="content">
        <p>{item.summary}</p>

        <div className="infoDate">
          <span>Publicado em: {item.publishedAt}</span>
          <span>Atualizado em: {item.updatedAt}</span>
        </div>
        <a href={item.url}>Acesse a noticia completa</a>
      </div>
    </div>
  );
}

export default Article;
