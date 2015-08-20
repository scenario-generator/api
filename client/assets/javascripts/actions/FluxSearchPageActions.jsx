import alt from '../FluxAlt';
import _ from 'lodash';
import SearchAPI from '../utils/api/SearchAPI';

class FluxSearchPageActions {

  getSearchResults(data) {
    this.dispatch();

    SearchAPI.getSearchResults(
      data,
      (data) => {
        this.actions.updateData(data);
      },
      (error) => {
        this.actions.registerError(error);
      }
    );
  }

  updateData(data) {
    this.dispatch(data);
  }

  registerError(error) {
    this.dispatch(error);
  }
}

export default alt.createActions(FluxSearchPageActions);
