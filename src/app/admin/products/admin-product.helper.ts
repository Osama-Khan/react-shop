import { min, notEmpty } from '../../components/form/helpers/validation.helper';
import InputControl from '../../components/form/models/input.model';
import SelectControl from '../../components/form/models/select.model';

export const imgRegex =
  '(http|https):\\/\\/[a-z0-9]+\\.[a-z0-9]+\\.[a-z0-9]+\\/(.+\\.jpg|.+\\.jpeg|.+\\.png)';

/**
 * Generates form data for product insertion and updation
 */
export function generateFormData(categories: any[], values?: any[]) {
  // Extract values needed for SelectControl options from categories
  const options = [
    { name: 'Select a category...', value: '', disabled: true },
    ...categories.map((c) => ({
      name: c.name,
      value: c.id,
    })),
  ];

  // Initialize Product Form Data
  const fd = [
    new InputControl({
      label: 'Code',
      name: 'code',
      placeholder: 'Unique Code',
      value: values ? values[0] : '',
      validators: [notEmpty],
    }),
    new InputControl({
      label: 'Title',
      name: 'title',
      placeholder: 'Give the product a nice catchy title',
      value: values ? values[1] : '',
      validators: [notEmpty],
    }),
    new InputControl({
      label: 'Description',
      name: 'description',
      type: 'textarea',
      placeholder: 'Describe the product in a paragraph or two',
      value: values ? values[2] : '',
      validators: [notEmpty],
    }),
    new InputControl({
      label: 'Highlights',
      name: 'highlights',
      type: 'textarea',
      placeholder: 'Lightweight\nSuper fast\n...',
      value: values ? values[3] : '',
      validators: [notEmpty],
    }),
    new SelectControl({
      label: 'Category',
      name: 'category',
      options,
      value: values ? values[4] : '',
      validators: [notEmpty],
    }),
    new InputControl({
      label: 'Price',
      name: 'price',
      type: 'number',
      placeholder: 'A reasonable price for the product',
      value: values ? values[5] : '',
      validators: [notEmpty, (v) => min(v, 1)],
    }),
    new InputControl({
      label: 'Starting Stock',
      name: 'stock',
      type: 'number',
      placeholder: 'Stock available for the product',
      value: values ? values[6] : '',
      validators: [notEmpty, (v) => min(v, 0)],
    }),
  ];

  return fd;
}
