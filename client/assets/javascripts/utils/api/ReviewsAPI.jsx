import { Promise } from 'es6-promise';
import ProductConstants from '../constants/ProductConstants';

module.exports = {
  getReviews: function (productID, resolve, reject) {
    if (productID) {
      let url = `/api/products/${productID}/reviews`;
      return new Promise(function () {
        $.ajax({
          url: url,
          success: resolve
        });
      });
    }
  },

  voteOnReview: function (productID, reviewId, helpful, resolve, reject) {
    if (productID) {
      let url = `/api/products/${productID}/reviews/${reviewId}/review_votes`;
      return new Promise(function () {
        $.ajax({
          type: 'POST',
          url: url,
          data: {helpful: helpful},
          success: resolve
        });
      });
    }
  }
};
