class ImageLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  defineImage() {
    if (this.props.sourceCollection.length) {
      var imageMap = this.props.sourceCollection.map(source => {
        return (
          <img className='image-preview' src={source}/>
        )
      });
      return imageMap;
    }
  }
  render() {
    this.props.sourceCollection = ['http://i.imgur.com/1wzSRZy.png','http://i.imgur.com/pWidUvT.jpg','http://i.imgur.com/uNuDcTj.jpg'];
    return (
      <div className='image-loader-container'>
        {this.defineImage()}
      </div>
    )
  }
}