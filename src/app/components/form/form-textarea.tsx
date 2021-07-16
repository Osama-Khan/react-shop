import InputControl from './models/input.model';

export default function FormTextArea(props: { control: InputControl }) {
  const c = props.control;
  return (
    <textarea
      id={c.id?.toString() || ''}
      name={c.name || ''}
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
      onChange={c.onChange}></textarea>
  );
}
