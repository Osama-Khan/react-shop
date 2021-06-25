export default function Pill({ text, color }) {
  return (
    <div className={`p-3 badge-pill bg-${color}-subtle text-${color}`}>
      {text}
    </div>
  );
}
