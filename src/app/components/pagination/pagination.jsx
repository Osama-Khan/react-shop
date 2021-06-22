export default function Pagination({ currentPage, totalPages, gotoPage }) {
  const trimForward = totalPages > 3 && totalPages - currentPage + 1 > 3;
  const trimBackward = totalPages > 3 && totalPages - currentPage + 1 < 3;
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;
  const maxPages = trimForward ? currentPage + 3 : totalPages + 1;
  let numEls = [];
  if (trimBackward && !isFirst) {
    numEls.push(
      <li className="page-item">
        <span className="page-link">...</span>
      </li>
    );
  }
  for (
    let i = !isFirst
      ? isLast && totalPages > 3
        ? currentPage - 2
        : currentPage - 1
      : currentPage;
    i < maxPages;
    i++
  ) {
    numEls.push(
      <li className={`page-item${currentPage === i ? " active" : ""}`}>
        <span
          className="page-link text-clickable"
          onClick={() => {
            if (currentPage !== i) gotoPage(i);
          }}>
          {i}
        </span>
      </li>
    );
  }
  if (trimForward && !isLast) {
    numEls.push(
      <li className="page-item">
        <span className="page-link text-dark">...</span>
      </li>
    );
  }
  return (
    <div className="shadow">
      <ul class="pagination">
        <li class={`page-item${isFirst ? " disabled" : ""}`}>
          <span
            className="page-link text-clickable"
            onClick={() => {
              gotoPage(1);
            }}>
            First
          </span>
        </li>
        {numEls}
        <li class={`page-item${isLast ? " disabled" : ""}`}>
          <span
            className="page-link text-clickable"
            onClick={() => {
              gotoPage(totalPages);
            }}>
            Last
          </span>
        </li>
      </ul>
    </div>
  );
}
