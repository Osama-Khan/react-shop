import InputControl from './models/input.model';

export default function FormInput(props: { control: InputControl }) {
  const c = props.control;
  return (
    <input
      id={c.id?.toString() || ''}
      name={c.name || ''}
      type={c.type || 'text'}
      placeholder={c.placeholder || ''}
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
      value={c.value}
      onChange={c.onChange}
    />
  );
}
