import React from 'react';
import ImageMixin from './ImageMixin';

function _setBackgroundImage() {
  let component = $(React.findDOMNode(this));
  let picture = $(component).find('img');

  picture.hide();
  component.children().css('background-image', `url(${picture.attr('src')})`);
}

class AutoFitPicture extends React.Component {

  componentDidMount() {
    _setBackgroundImage.call(this);
  }

  componentDidUpdate() {
    _setBackgroundImage.call(this);
  }

  render() {
    let backgroundContainerStyle = this.props.backgroundContainerStyle;
    let containerStyle = this.props.containerStyle;
    let containerClasses = `.autofit-picture-container ${this.props.containerClass}`;
    let url = ImageMixin.getRightImageUrl(this.props.src, this.props.typeSizeImage);
    let img = <img src={url}/>;

    return (
      <div className={containerClasses}>
        <div style={backgroundContainerStyle}>
          {img}
        </div>
        <div style={containerStyle}>
          {img}
        </div>
      </div>
    );
  }
}

AutoFitPicture.displayName = 'AutoFitPicture';

AutoFitPicture.defaultProps = {
  backgroundContainerStyle: {
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    WebkitFilter: 'blur(7px)',
    MozFilter: 'blur(7px)',
    OFilter: 'blur(7px)',
    msFilter: 'blur(7px)',
    filter: 'blur(7px)',
    width: '100%',
    height: '100%',
    opacity: '0.5'
  },

  containerStyle: {
    overflow: 'hidden',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px'
  }
};

AutoFitPicture.propTypes = {
  src: React.PropTypes.string.isRequired,
  typeSizeImage: React.PropTypes.string.isRequired,
  containerClass: React.PropTypes.string,
  containerStyle: React.PropTypes.object
};

export default AutoFitPicture;
