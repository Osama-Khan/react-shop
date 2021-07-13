export default function OrderState({ state }) {
  return state === 'Processing' ? (
    <b className="text-secondary">{state}</b>
  ) : state === 'Canceled' ? (
    <b className="text-red">{state}</b>
  ) : state === 'Shipped' ? (
    <b className="text-blue">{state}</b>
  ) : state === 'Delivered' ? (
    <b className="text-green">{state}</b>
  ) : (
    <></>
  );
}
