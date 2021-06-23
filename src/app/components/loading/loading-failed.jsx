import Icon from "../icon/icon";

export default function LoadingFailed() {
  return (
    <div className="mt-5 row container d-flex justify-content-center">
      <div className="alert alert-danger">
        <Icon dataIcon="fa:times-circle" />
        <span className="ml-2">Failed to load</span>
      </div>
    </div>
  );
}
