const PaginationElement = ({ text, className, liClassName, onClick }) => (
  <li className={`page-item ${className}`}>
    <span
      className={`page-link text-clickable ${liClassName}`}
      onClick={onClick}>
      {text}
    </span>
  </li>
);

const MoreIndicator = () => (
  <PaginationElement text="..." liClassName="text-dark" />
);

export default function Pagination({ currentPage, totalPages, gotoPage }) {
  const trimForward = totalPages > 3 && totalPages - currentPage + 1 > 3;
  const trimBackward = totalPages > 3 && totalPages - currentPage + 1 < 3;
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;
  const maxPages = trimForward ? currentPage + 3 : totalPages + 1;
  let numEls = [];

  if (trimBackward && !isFirst) {
    numEls.push(<MoreIndicator />);
  }

  const iStart = !isFirst
    ? isLast && totalPages > 3
      ? currentPage - 2
      : currentPage - 1
    : currentPage;

  for (let i = iStart; i < maxPages; i++) {
    numEls.push(
      <PaginationElement
        className={currentPage === i ? " active" : ""}
        onClick={() => {
          if (currentPage !== i) gotoPage(i);
        }}
        text={i}
      />
    );
  }

  if (trimForward && !isLast) {
    numEls.push(<MoreIndicator />);
  }

  return (
    <div className="shadow">
      <ul class="pagination">
        <PaginationElement
          className={isFirst ? " disabled" : ""}
          text="First"
          onClick={() => {
            gotoPage(1);
          }}
        />
        {numEls}
        <PaginationElement
          className={isLast ? " disabled" : ""}
          text="Last"
          onClick={() => {
            gotoPage(totalPages);
          }}
        />
      </ul>
    </div>
  );
}
