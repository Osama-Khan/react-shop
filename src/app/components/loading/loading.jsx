import Icon from "../icon/icon";

export default function LoadingSpinner() {
  return (
    <div key="loadingIcon" className="col-12 d-flex my-5 py-5">
      <Icon classes="mx-auto icon-lg spin" dataIcon="fa:spinner" />
    </div>
  );
}
