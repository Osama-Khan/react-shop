export default function Carousel({images, captions}) {
    let indicators = [], items = [];
    for (let i = 0; i < images.length; i++) {
        let first = i === 0;
        indicators.push((<li key={i} data-target="#carouselId" data-slide-to={i} className={first? "active": ""}></li>));
        items.push(
            <div key={i} className={`carousel-item${first?" active": ""}`}>
                <img src={images[i]} alt={`Slide ${i+1}`}/>
            </div>
        );
    }

    return (
        <div id="carouselId" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">{indicators}</ol>
            <div className="carousel-inner" role="listbox">{items}</div>
            <a className="carousel-control-prev" href="#carouselId" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselId" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
        </div>
    );
}