import _ from 'lodash';
import alt from '../FluxAlt';
import { Router, Navigation } from 'react-router'
import NewReviewPageAPI from '../utils/api/NewReviewPageAPI';
import ProductAPI from '../utils/api/ProductAPI';
import S3API from '../utils/api/S3API';

class FluxReviewPageActions {
  setShowDetails(showDetails) {
    this.dispatch(showDetails);
  }

  fetchProduct(productId, success, error) {
    this.dispatch(productId);
    ProductAPI.getProduct(productId, success, error)
  }

  setProduct(product) {
    this.dispatch(product);
  }

  updateProduct(product) {
    this.dispatch(product);
  }

  setReview(review) {
    this.dispatch(review);
  }

  updateReview(review) {
    this.dispatch(review);
  }

  submitReview(review, success, error) {
    let _this = this;
    NewReviewPageAPI.submit(review,
      function(data) {
        _this.dispatch();
        success(data);
      }, error);
  }

  registerError(error) {
    this.dispatch(error);
  }
}

export default alt.createActions(FluxReviewPageActions);
