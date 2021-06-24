import Icon from "../icon/icon";

export default function FilterForm({ state, setState, onFilter }) {
  const recordOptions = [10, 20, 30, 40, 50];
  const recordOptionsEl = recordOptions.map((r) => (
    <option key={`limit-option-${r}`} value={r}>
      {r}
    </option>
  ));
  return (
    <form
      className="col-12 row align-items-center m-0 row"
      onSubmit={(e) => e.preventDefault()}>
      <div className="form-group ml-md-auto">
        <input
          type="text"
          value={state.search}
          className="form-control"
          placeholder="Search..."
          onChange={(e) => setState({ ...state, search: e.target.value })}
        />
      </div>
      <div className="form-group mx-1">
        <select
          className="form-control"
          value={state.limit}
          onChange={(e) => setState({ ...state, limit: e.target.value })}>
          <option value="" disabled>
            Max Records...
          </option>
          {recordOptionsEl}
        </select>
      </div>
      <div className="form-group">
        <select
          className="form-control"
          value={state.orderBy}
          onChange={(e) => setState({ ...state, orderBy: e.target.value })}>
          <option value="" disabled>
            Sort by...
          </option>
          <option value="title">Title</option>
          <option value="rating">Rating</option>
          <option value="price">Price</option>
        </select>
      </div>
      {state.orderBy ? (
        <div className="form-group mx-1">
          <button
            className={`btn m-0 ${
              state.orderDir === "ASC" ? "btn-primary" : "btn-light"
            }`}
            disabled={state.orderDir === "ASC"}
            onClick={(e) => setState({ ...state, orderDir: "ASC" })}
            title="Sort in ascending order: A-Z, 0-9">
            <Icon
              key="filter-sort-icon-asc"
              dataIcon="mdi-sort-alphabetical-ascending"
            />
          </button>
          <button
            className={`btn m-0 ${
              state.orderDir === "DESC" ? "btn-primary" : "btn-light"
            }`}
            disabled={state.orderDir === "DESC"}
            onClick={(e) => setState({ ...state, orderDir: "DESC" })}
            title="Sort in descending order: Z-A, 9-0">
            <Icon
              key="filter-sort-icon-desc"
              dataIcon="mdi-sort-alphabetical-descending"
            />
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className="form-group">
        {
          <button className="btn btn-primary" onClick={onFilter}>
            Filter
          </button>
        }
      </div>
    </form>
  );
}
