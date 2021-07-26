import { Component } from 'react';

export default class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedImage: 0 };
  }

  render() {
    if (!this.props.images?.length > 0)
      return <div className="m-3 p-3 text-center card">No images</div>;
    const selected = this.state.selectedImage;
    const images = this.props.images.map((i) => i.image);
    const imgSelectors = images.map((img, i) => (
      <div
        key={'img-' + i}
        className={`card col-3 mr-1 my-1${
          selected !== i ? ' opacity-3' : ' border-primary'
        }`}
        onMouseOver={() => {
          this.setState({ selectedImage: i });
        }}>
        <img src={img} className="img-small" alt={'image-' + i} />
      </div>
    ));
    return (
      <div id="gallery" className="m-3">
        <div className="text-center card border-primary">
          <img
            src={images[this.state.selectedImage]}
            className="m-auto p-3"
            alt="Product"
          />
        </div>
        <div className="row mx-0 flex-nowrap overflow-auto">{imgSelectors}</div>
      </div>
    );
  }
}
