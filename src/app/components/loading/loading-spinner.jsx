import Icon from '../icon/icon';

export default function LoadingSpinner({ size = 'lg', inline = false }) {
  return (
    <div
      key="loadingIcon"
      className={inline ? 'my-auto mx-1' : 'col-12 d-flex my-5 py-5'}>
      <Icon classes={`mx-auto icon-${size} spin`} dataIcon="fa:spinner" />
    </div>
  );
}
