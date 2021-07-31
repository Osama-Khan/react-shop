import { Component } from 'react';
import Criteria from '../../models/criteria';
import Form from '../../components/form/form';
import { AppContext } from '../../context/app.provider';
import LoadingSpinner from '../../components/loading/loading-spinner';
import LoadingFailed from '../../components/loading/loading-failed';
import { generateFormData } from './admin-product.helper';
import ImagePicker from '../../components/image-picker/image-picker';
import Icon from '../../components/icon/icon';

export default class EditProduct extends Component {
  static contextType = AppContext;
  categoryCriteria;

  constructor(props) {
    super(props);
    this.state = { submitting: false, images: [], imagesChanged: false };

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
            images: product.images.map((i) => i.image),
            controls: this.generateFormData(cats, product),
          });
        })
        .catch((ex) => {
          this.setState({ failed: true });
        });
    });
  }

  render() {
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
                  <div>
                    <label>Product Images</label>
                    <div className="row mx-0">
                      {this.state.images.map((img, i) => (
                        <div className="position-relative mr-1 mb-1">
                          <img
                            src={img}
                            alt={'product-image-' + i}
                            key={'product-img-' + i}
                            className="img-large bg-light"
                          />
                          <div
                            className="top-right m-1 rounded-circle bg-dark img-tiny opacity-3 text-clickable text-white text-center"
                            onClick={() => {
                              const images = this.state.images.filter(
                                (_, ind) => ind !== i,
                              );
                              this.setState({ ...this.state, images });
                            }}>
                            <Icon dataIcon="fa:times" />
                          </div>
                        </div>
                      ))}
                      <ImagePicker
                        onPick={(imgs) =>
                          this.setState({
                            ...this.state,
                            images: this.state.images.concat(imgs),
                            imagesChanged: true,
                          })
                        }
                        noPreview={true}
                        maxSize={2000000}
                        onError={(e) =>
                          this.context.services.uiService.errorToast(e.message)
                        }
                        allowMultiple={true}
                        validFormats={['jpg', 'jpeg', 'png']}
                      />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary ml-auto"
                    disabled={
                      (this.state.controls?.some((c) => c.isValid === false) &&
                        !this.state.imagesChanged) ||
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
    // Create array of current values
    const values = [
      product.code,
      product.title,
      product.description,
      product.highlights.map((h) => h.highlight).join('\n'),
      product.category.id,
      product.price,
      product.stock,
    ];
    return generateFormData(categories, values);
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
    if (this.state.imagesChanged) {
      product.images = this.state.images;
    }

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
