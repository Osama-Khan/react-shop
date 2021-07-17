import { Component } from 'react';
import Criteria from '../../models/criteria';
import Form from '../../components/form/form';
import {
  isPattern,
  min,
  notEmpty,
} from '../../components/form/helpers/validation.helper';
import InputControl from '../../components/form/models/input.model';
import SelectControl from '../../components/form/models/select.model';
import { AppContext } from '../../context/app.provider';
import LoadingSpinner from '../../components/loading/loading-spinner';
import LoadingFailed from '../../components/loading/loading-failed';
import authorize from '../auth.helper';

export default class EditProduct extends Component {
  static contextType = AppContext;
  categoryCriteria;

  constructor(props) {
    super(props);
    this.state = { submitting: false };

    // Create criteria to fetch all categories
    this.categoryCriteria = new Criteria();
    this.categoryCriteria.setLimit(10000);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const svc = this.context.services;

    // Fetch categories, then products
    svc.categoryService.fetchCategories(this.categoryCriteria).then((res) => {
      const cats = res.data.data;
      svc.productService
        .fetchProduct(id)
        .then((res) => {
          const product = res.data;

          // Generate form data using products and categories and update state
          this.setState({
            ...this.state,
            product,
            controls: this.generateFormData(cats, product),
          });
        })
        .catch((ex) => {
          this.setState({ failed: true });
        });
    });
  }

  render() {
    const auth = authorize(this.context);
    if (auth) return auth;
    return (
      <div className="row">
        <div className="col-md-8 mx-auto mt-5 p-0 card shadow">
          <h3 className="card-header text-center row">
            <div
              className="mx-2 text-clickable"
              onClick={() => this.props.history.goBack()}>
              &larr;
            </div>
            <div>
              Editing{' '}
              {this.state.product
                ? this.state.product.code
                : `Product #${this.props.match.params.id}`}
            </div>
          </h3>
          {
            // If product has been fetched, render the form
            this.state.product ? (
              <div className="card-body">
                <form
                  className="d-flex flex-column"
                  onSubmit={(e) => this.update(e)}>
                  <Form
                    controls={this.state.controls}
                    onChange={(controls) => {
                      this.setState({ ...this.state, controls });
                    }}
                  />
                  <button
                    className="btn btn-primary ml-auto"
                    disabled={
                      !this.state.controls?.every((c) => c.isValid === true) ||
                      this.state.submitting
                    }>
                    Update
                  </button>
                </form>
              </div>
            ) : this.state.failed ? (
              // If loading failed, render failed message
              <LoadingFailed />
            ) : (
              // Otherwise, render loading spinner
              <LoadingSpinner />
            )
          }
        </div>
      </div>
    );
  }

  generateFormData(categories, product) {
    // Generate options array from category objects
    const options = [
      { name: 'Select a category...', value: '', disabled: true },
      ...categories.map((c) => ({
        name: c.name,
        value: c.id,
      })),
    ];
    return [
      new InputControl({
        label: 'Code',
        name: 'code',
        placeholder: 'Unique Code',
        value: product.code,
        validators: [notEmpty],
      }),
      new InputControl({
        label: 'Title',
        name: 'title',
        placeholder: 'Give the product a nice catchy title',
        value: product.title,
        validators: [notEmpty],
      }),
      new InputControl({
        label: 'Description',
        name: 'description',
        type: 'textarea',
        placeholder: 'Describe the product in a paragraph or two',
        value: product.description,
        validators: [notEmpty],
      }),
      new InputControl({
        label: 'Highlights',
        name: 'highlights',
        type: 'textarea',
        placeholder: 'Lightweight\nSuper fast\n...',
        value: product.highlights.map((h) => h.highlight).join('\n'),
        validators: [notEmpty],
      }),
      new SelectControl({
        label: 'Category',
        name: 'category',
        options,
        value: product.category.id,
        validators: [notEmpty],
      }),
      new InputControl({
        label: 'Price',
        name: 'price',
        type: 'number',
        placeholder: 'A reasonable price for the product',
        value: product.price,
        validators: [notEmpty, (v) => min(v, 1)],
      }),
      new InputControl({
        label: 'Stock',
        name: 'stock',
        type: 'number',
        placeholder: 'Stock available for the product',
        value: product.stock,
        validators: [notEmpty, (v) => min(v, 0)],
      }),
      new InputControl({
        label: 'Image',
        name: 'img',
        placeholder: 'https://www.imagehost.com/image.jpg',
        value: product.img,
        validators: [
          (v) =>
            isPattern(
              v,
              // Regex to allow only urls ending with jpg, jpeg, or png (case insenstitive)
              new RegExp('^(http|https)://.*/.+(.jpg|.jpeg|.png)$', 'i'),
            ),
        ],
      }),
    ];
  }

  /**
   * Validates data and submits an update request using only the updated fields
   * @param {React.FormEventHandler<HTMLFormElement>} e event object
   */
  update(e) {
    // Prevent redirection
    e.preventDefault();

    // Set state to submitting
    this.setState({ ...this.state, submitting: true });

    const svc = this.context.services;

    // Data validation
    const dataValid = this.state.controls.every((c) => c.isValid);
    if (!dataValid) svc.uiService.errorToast('Given data is invalid!');

    // Making sure only updated data is submitted
    const product = {};
    this.state.controls.forEach((c) => {
      const prop = c.name.toLowerCase();
      const isHighlightsProp = prop === 'highlights';
      const isCategoryProp = prop === 'category';

      // Handles highlights property
      if (isHighlightsProp) {
        const oldHighlights = this.state.product.highlights
          .map((h) => h.highlight)
          .join('\n');
        const isHighlightSame = c.value === oldHighlights;
        if (isHighlightSame) return;
        product['highlights'] = c.value.split('\n');
        return;
      }

      // Handles category property
      if (isCategoryProp) {
        const oldCategory = this.state.product.category.id;
        const isCategorySame = parseInt(c.value) === oldCategory;
        if (isCategorySame) return;
        product['category'] = c.value;
        return;
      }

      // Handles other product properties
      const isValueSame = c.value === this.state.product[c.name];
      if (!isValueSame) product[c.name] = c.value;
    });

    // Creating promise and toast messages
    const promise = svc.productService.edit(this.state.product.id, product);
    const msgs = {
      loading: 'Updating product...',
      success: 'Product updated successfully!',
      error: 'Could not update product!',
    };

    // Show toast
    svc.uiService.promiseToast(promise, msgs).then((res) => {
      // Set submitting to false and update current product state
      this.setState({
        ...this.state,
        submitting: false,
        product: {
          // Updates current product with new values
          ...this.state.product,
          ...product,
        },
      });
    });
  }
}
