import React from 'react';
 
class ImageLoad extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageStatus: 'loading' };
  }
 
  handleImageLoaded() {
    this.setState({ imageStatus: 'loaded' });
  }
 
  handleImageErrored() {
    this.setState({ imageStatus: 'failed to load' });
  }
 
  render() {
    return (
      <div>
        <img
        className="img-responsive"
          src={this.props.imageUrl}
          onLoad={()=>this.handleImageLoaded }
          onError={()=>this.handleImageErrored}
          />
        {this.state.imageStatus}
      </div>
    );
  }
}
export default ImageLoad;