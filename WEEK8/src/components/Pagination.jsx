import React from "react";

function Pagination({ pagination = {}, onChangePage }) {
  const {
    current_page = 1,
    total_pages = 1,
    has_pre = false,
    has_next = false,
  } = pagination;

  const handleClick = (e, page) => {
    e.preventDefault();

    if (page < 1 || page > total_pages) return;

    onChangePage(page);
  };

  return (
    <nav className="d-flex justify-content-center mt-4" aria-label="Page navigation">
      <ul className="pagination">

        {/* 上一頁 */}
        <li className={`page-item ${!has_pre ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => handleClick(e, current_page - 1)}
          >
            &laquo;
          </a>
        </li>

        {/* 頁碼 */}
        {Array.from({ length: total_pages }, (_, index) => (
          <li
            key={index}
            className={`page-item ${
              current_page === index + 1 ? "active" : ""
            }`}
          >
            <a
              className="page-link"
              href="#"
              onClick={(e) => handleClick(e, index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}

        {/* 下一頁 */}
        <li className={`page-item ${!has_next ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => handleClick(e, current_page + 1)}
          >
            &raquo;
          </a>
        </li>

      </ul>
    </nav>
  );
}

export default Pagination;