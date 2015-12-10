import React from 'react';
import _ from 'lodash';
import { Link, Navigation } from 'react-router';
import Modal from 'react-modal';
import CollectionStore from '../../stores/CollectionStore';
import ModalStore from '../../stores/ModalStore';
import DefaultModalStyles from '../../utils/constants/DefaultModalStyles'
import FluxAlertActions from '../../actions/FluxAlertActions';
import FluxModalActions from '../../actions/FluxModalActions';
import FluxCollectionActions from '../../actions/FluxCollectionActions';
import FluxNotificationsActions from '../../actions/FluxNotificationsActions'
import UserTypeahead from '../UserTypeahead'
import Results from '../search/Results'
import ShareCollection from './ShareCollection'

// This mixin is included wherever we want this modal.
// It let's you render, show, and close the modal.
const ShareCollectionMixin = {

  renderShareCollectionModal: function() {
    return (
      <ShareCollectionModal
        ref='collectionShareModal'
        close={this.closeShareCollectionModal} />
    )
  },

  closeShareCollectionModal: function() {
    FluxModalActions.closeModal();
    if(this.props.router.state.components[0].displayName != 'CollectionPage') {
      FluxCollectionActions.clearCollection();
    }
  },

  showShareCollectionModal: function(collection, config) {
    FluxModalActions.setVisibleModal('ShareCollectionModal', 0, config);
    FluxCollectionActions.fetchedCollection(collection);
  }
};

const ShareCollectionModal = React.createClass ({
  displayName: 'ShareCollectionModal',

  getInitialState: function () {
    return {}
  },


  // Flux Methods
  // Keep track of changes that are made to the store
  componentDidMount: function() {
    ModalStore.listen(this.onChangeModal);
  },

  onChangeModal: function(data) {
    let visible = data.visibleModal == this.constructor.displayName;
    this.setState({ visible: visible, config: data.config });
  },

  close: function(e) {
    if(e) { e.preventDefault() }
    this.setState({unsaved_collection: this.state.collection})
    this.props.close()
  },

  render: function() {
    return (
      <Modal
        isOpen={this.state.visible}
        onRequestClose={this.close}
        style={DefaultModalStyles}>
        <div className='back-button' onClick={this.close}>{"Back"}</div>
        <ShareCollection close={this.close}/>

      </Modal>
    )
  }
});

module.exports = {
  ShareCollectionMixin: ShareCollectionMixin,
  ShareCollectionModal: ShareCollectionModal
};
