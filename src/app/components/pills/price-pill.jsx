export default function PricePill({ price, className, padding }) {
  return (
    <div
      className={`p-${
        padding ?? 3
      } badge-pill bg-green-subtle text-green ${className}`}>
      Rs. <b>{price}</b>
    </div>
  );
}
