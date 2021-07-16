import SelectControl from './models/select.model';

export default function FormSelect(props: { control: SelectControl }) {
  const c = props.control;
  return (
    <select
      id={c.id?.toString() || ''}
      name={c.name || ''}
      className={
        'form-control' +
        (c.isDirty
          ? c.isValid === false
            ? ' is-invalid'
            : c.isValid === true
            ? ' is-valid'
            : ''
          : '')
      }
      value={c.value || ''}
      onChange={c.onChange}>
      {c.options.map((o) => (
        <option value={o.value} disabled={o.disabled}>
          {o.name}
        </option>
      ))}
    </select>
  );
}
