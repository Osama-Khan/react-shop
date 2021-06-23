import { productsUrl } from "../routes";
import LoadingSpinner from "../components/loading/loading";
import OrderStateBadge from "./order-state-badge";
import { Link } from "react-router-dom";

export default function OrderList({ state }) {
  return state.orders.length > 0 ? (
    state.orders.map((o) => {
      let total = 0;
      return (
        <div
          className="col-md-8 card mb-4 mx-auto p-0"
          key={`order-card-${o.id}`}>
          <div className="card-header bg-dark text-light row">
            <h1 className="m-0 ml-2">Order #{o.id} </h1>
            <OrderStateBadge orderState={o.orderState} />
          </div>
          <div className="mb-2 p-2">
            {state.detailLoaded ? (
              o.orderProducts.map((op) => {
                total += op.price * op.quantity;
                return (
                  <>
                    <br />
                    <span className="ml-2">
                      {" "}
                      {op.quantity} &times;{" "}
                      <Link
                        to={`${productsUrl}/${op.product.id}`}
                        title={op.product.title}>
                        {op.product.title.substring(0, 16) + "..."}
                      </Link>
                    </span>{" "}
                    = <b>{op.price} Rs.</b>
                  </>
                );
              })
            ) : (
              <LoadingSpinner />
            )}
          </div>
          <div className="row m-0 px-2">
            <span className="my-auto text-muted">
              Placed on: {new Date(o.createdAt).toLocaleString()}
              <br />
              Last Update: {new Date(o.updatedAt).toLocaleString()}
            </span>
            <span className="bg-green-subtle badge-pill m-3 ml-auto p-2 text-green">
              <b>{total}</b> Rs.
            </span>
          </div>
        </div>
      );
    })
  ) : (
    <>
      <div className="text-center text-muted font-weight-bold mt-5">
        You have placed no orders... yet!
      </div>
      <div className="d-flex">
        {" "}
        <Link className="btn btn-dark mx-auto mt-3" to={productsUrl}>
          Go Get Something
        </Link>
      </div>
    </>
  );
}
