/** Clickable pagination element */
const PaginationElement = ({ text, className, liClassName, onClick }) => (
  <li className={`page-item ${className}`}>
    <span
      className={`page-link text-clickable ${liClassName}`}
      onClick={onClick}>
      {text}
    </span>
  </li>
);

/** A pagination element indicating that there are more pages in between */
const MoreIndicator = () => (
  <PaginationElement text="..." liClassName="text-dark" />
);

/** Converts given metadata into a Pagination component */
export default function Pagination({ currentPage, totalPages, gotoPage }) {
  // If total pages are 1, there is no need for pagination
  if (totalPages <= 1) {
    return <></>;
  }

  // Conditions to decide what elements to add in pagination
  const showMore = totalPages > 3;
  const trimStart = showMore && currentPage > 2;
  const trimEnd = showMore && totalPages - currentPage + 1 > 3;
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;
  const maxPages = trimEnd ? currentPage + 3 : totalPages + 1;
  let numEls = [];

  // Show more indicator if start should be trimmed and selected page is not first
  if (trimStart && !isFirst) {
    numEls.push(<MoreIndicator key="pagination-el-more-1" />);
  }

  // Constant that decides where loop iteration will start
  const iStart = !showMore
    ? 1
    : !isFirst
    ? isLast
      ? currentPage - 2
      : currentPage - 1
    : currentPage;

  // Places the numbered clickable pagination elements
  for (let i = iStart; i < maxPages; i++) {
    numEls.push(
      <PaginationElement
        key={`pagination-el-${i}`}
        className={currentPage === i ? ' active' : ''}
        onClick={() => {
          if (currentPage !== i) gotoPage(i);
        }}
        text={i}
      />,
    );
  }

  // Show more indicator if end should be trimmed and selected page is not last
  if (trimEnd && !isLast) {
    numEls.push(<MoreIndicator key="pagination-el-more-2" />);
  }

  return (
    <ul className="pagination shadow">
      <PaginationElement
        key="pagination-el-first"
        className={isFirst ? ' disabled' : ''}
        text="First"
        onClick={() => {
          gotoPage(1);
        }}
      />
      {numEls}
      <PaginationElement
        key="pagination-el-last"
        className={isLast ? ' disabled' : ''}
        text="Last"
        onClick={() => {
          gotoPage(totalPages);
        }}
      />
    </ul>
  );
}
