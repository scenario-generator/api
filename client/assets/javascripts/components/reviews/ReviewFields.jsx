import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import FluxReviewPageActions from '../../actions/FluxReviewPageActions'
import LinksManager from './LinksManager'
import PriceRating from '../PriceRating'
import QualityReview from './QualityReview'
import Rating from '../Rating'
import TagsManager from './TagsManager'
import UploadManager from './UploadManager'

const ReviewFields  = React.createClass({
  displayName: 'ReviewFields',

  getDefaultProps: function getDefaultProps() {
    return {
      onChange: function() {}
    }
  },

  getFields: function getFields() {
    let refs = this.refs;
    let quality_review_fields = refs.quality_review.getFields();

    return _.merge(quality_review_fields, {
      quality_score: refs.product_review_quality_score.getValue(),
      attachments: refs.upload_manager.getFiles(),
      links: refs.links_manager.getLinks(),
      tags: refs.tags_manager.getTags(),
      price_score: refs.product_review_price_score.getValue(),
      price_review: React.findDOMNode(refs.product_review_price_review).value,
    });
  },

  _getContent: function _getContent() {
    if (this.props.showDetails) {
      return (
        <fieldset className='review-fields'>
          <h1 className='title'>Your Review</h1>
          <span className='description'>Rate, review or tag this product. You can even upload files or an image.</span>

          <div className='form-group inline rating'>
            <label htmlFor='product[review[quality_score]]'>Rating</label>
            <Rating name='product[review[quality_score]]' ratingEnabled={true} ref='product_review_quality_score' />
          </div>

          <QualityReview ref='quality_review' title={this.props.title} quality_review={this.props.quality_review}
            onChange={this.props.onChange} />

          <div className='form-group attachments'>
            <label htmlFor='product[attachment]' className='sr-only'>Product's attachment</label>

            <UploadManager ref='upload_manager' attachments={this.props.attachments} onChange={this.props.onChange} />
          </div>

          <div className='form-group links'>
            <label htmlFor='product[attachment]' className='sr-only'>Product's attachment</label>

            <LinksManager ref='links_manager' links={this.props.links} />
          </div>

          <div className='form-group inline rating'>
            <label htmlFor='product[review[price_score]]'>Pricing</label>
            <PriceRating name='product[review[price_score]]' ratingEnabled={true} ref='product_review_price_score' />
          </div>

          <div className='form-group'>
            <label htmlFor='product[review[price_review]]' className='sr-only'>Price Review</label>

            <textarea type='text' className='form-control' placeholder='Add a brief description of the product’s pricing'
              name='product[review[price_review]]' rows='10' ref='product_review_price_review'
              value={this.props.price_review} onChange={this.props.onChange} />
          </div>

          <div className='form-group tags'>
            <label htmlFor='product[review[tags]]'>Add / Edit Tags</label>
            <TagsManager ref='tags_manager' />
          </div>
        </fieldset>
      );
    } else {
      return (<div />);
    }
  },

  render: function render() {
/* TODO
  //TODO: Fix add-tags component style
*/
    return this._getContent();
  }
})

export default ReviewFields;
