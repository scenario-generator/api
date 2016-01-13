import _ from 'lodash';
import React from 'react';
import timeago from 'timeago';
import { Link, Navigation } from 'react-router';
import FluxCollectionActions from '../../actions/FluxCollectionActions';
import FluxAlertActions from '../../actions/FluxAlertActions';
import FluxNotificationsActions from '../../actions/FluxNotificationsActions';
import CollectionStore from '../../stores/CollectionStore'
import Rating from '../Rating'
import Avatar from '../Avatar'
import Decide from '../Decide';
import RenderDesktop from '../RenderDesktop';
import RenderMobile from '../RenderMobile';
import TableDisplay from '../TableDisplay'
import TabbedArea from '../TabbedArea'
import MoreOptionsDropdown from '../MoreOptionsDropdown';
import DateHelper from '../../utils/helpers/DateHelper';
import { EditCollectionMixin } from './EditCollectionModal'
import { ShareCollectionMixin } from './ShareCollectionModal'
import { ManageCollaboratorCollectionMixin } from './ManageCollaboratorCollectionModal'
import { UserListMixin } from '../modals/UserListModal'

const CollectionPage = React.createClass({
  displayName: 'CollectionPage',

  mixins: [
    Navigation,
    EditCollectionMixin,
    ShareCollectionMixin,
    ManageCollaboratorCollectionMixin,
    UserListMixin
  ],

  avatarSize: 30,

  contextTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      data: {
        collection: {
          name: '',
          description: '',
          user: {
            name: ''
          },
          products: [],
          owned: false,
          editable: false,
          users: []
        }
      }
    };
  },

  id: function() {
    return this.props.params.id
  },

  componentDidMount: function() {
    CollectionStore.listen(this.onChange);
    this.fetchCollection()
  },

  componentWillReceiveProps: function(newProps) {
    if (!newProps.isTransitioning) {
      this.fetchCollection()
    }
  },

  fetchCollection: function() {
    FluxCollectionActions.fetchCollection(this.id(), null, function() {
      this.transitionTo('/app')
      FluxNotificationsActions.showNotification({
        type: '404',
        text: `That collection does not exist`
      })
    }.bind(this));
  },

  onChange: function(data) {
    this.setState(data);
  },

  ownedByUser: function() {
    return this.state.data.collection.owned
  },

  deleteCollection: function() {
    let _this = this;
    let collection_name = this.state.data.collection.name;

    FluxAlertActions.showAlert({
      title: 'Delete this collection?',
      blue: true,
      success: 'Delete',
      cancel: 'Cancel',
      message: 'Deleting this collection will delete it for all the users in it. This action can’t be undone. Confirm your action below.',
      checkbox: 'I confirm that I want to delete this collection',
      headerIconClass: 'collections',
      showClose: true,
      successCallback: function() {
        FluxCollectionActions.deleteCollection({
          id: _this.props.params.id,
          name: collection_name
        }, function() {
          //TODO: Change this into a transition
          let previous = _this.getParameterByName('link') || `/app/users/current#collections`;
          window.location.href = previous
        });
      }
    })
  },

  editCollection: function() {
    this.showEditCollectionModal(this.state.data.collection)
  },

  shareCollection: function() {
    this.showShareCollectionModal(this.state.data.collection, {confirm: 'Save', cancel: 'Cancel', title: 'Add Collaborators', hideRadios: true, noGreyDescription: true})
  },

  viewCollaborators: function() {
    this.showUserListModal(this.state.data.collection.users.concat([this.state.data.collection.user]))
  },

  manageCollaborators: function() {
    this.showManageCollaboratorCollectionModal(this.state.data.collection)
  },

  renderEditButtons: function() {
    if (this.ownedByUser()) {
      return (
        <div className='user-buttons vertical-padding grey-bottom-border'>
          <div className='btn btn-red-inverted btn-round btn-small' onClick={this.shareCollection}>
            ADD NEW COLLABORATORS
          </div>
          <div className='btn btn-grey-inverted btn-round btn-small' onClick={this.manageCollaborators}>
            MANAGE EXISTING COLLABORATORS
          </div>
        </div>
      )
    }
  },

  removeProduct: function(product) {
    FluxAlertActions.showAlert({
      title: 'Remove this product?',
      headerIconClass: 'collections',
      showClose: true,
      message: `Removing "${product.name}" will also delete it for all of "${this.state.data.collection.name}'s" collaborators.`,
      success: 'Remove product',
      cancel: 'Cancel',
      successCallback: function() {
        FluxCollectionActions.deleteProduct(this.id(), product.id)
      },
    })
  },

  renderProductsTable: function(products) {
    return (
      <div tabTitle='Products' ref='products'>
        <RenderMobile
          conditional={this.state.data.collection.editable}>
          {this.renderAddProductButton()}
        </RenderMobile>

        <TableDisplay
          data={products}
          allowSorting={true}
          defaultSortColumn='added_on_raw'
          columns={[
            {
              title: 'Product',
              linkTo: 'products',
              dataColumn: 'name',
              secondaryDataType: 'rating',
              secondaryDataColumn: 'rating',
              sortByColumn: 'name',
              width: 8,
            },
            {
              title: 'Date Added',
              dataColumn: 'added_on_raw',
              secondaryDataType: 'string',
              secondaryDataColumn: 'added_by',
              sortByColumn: 'added_on_raw',
              width: 3,
              date: true,
              hiddenOn: 'mobile'
            },
            {
              title: '',
              dataColumn: '',
              value: 'Remove',
              className: 'link underlined small-text',
              onClick: this.removeProduct,
              display: this.ownedByUser(),
              width: 1
            }
          ]} />

        <RenderDesktop
          conditional={this.state.data.collection.editable}>
          {this.renderAddProductButton()}
        </RenderDesktop>
      </div>
    )
  },

  renderAddProductButton: function() {
    return (
      <div className='add-product-container'>
        <div className='link add-product-link' onClick={() => this.showEditCollectionModal()}>
          Add a new product
        </div>
      </div>
    )
  },

  renderCollaboratorInfo: function() {
    return (
      <div tabTitle='Collaborators' ref='collaborators'>
        {this.renderEditButtons()}
        {this.renderOwnerView()}
        {this.renderCollaboratorView()}
      </div>
    )
  },

  renderOwnerView: function() {
    if (this.state.data.collection.owned) {
      return (
        <div>
          {this.renderOwners()}
          {this.renderCollaborators()}
          {this.renderViewers()}
        </div>
      )
    }
  },

  renderCollaboratorView: function() {
    if (!this.state.data.collection.owned) {
      return (
        <div>
          {this.renderAllCollaborators()}
        </div>
      )
    }
  },

  totalCollaborators: function() {
    let total = this.owners().length + this.collaborators().length

    if(this.state.data.collection.privacy == 'hidden' || this.ownedByUser()) {
      total += this.viewers().length
    }

    return total
  },


  owners: function() {
    return [this.state.data.collection.user].concat(_.filter(this.state.data.collection.users, function(user) {
      return user.rank == 'owner'
    }))
  },

  collaborators: function() {
    return _.filter(this.state.data.collection.users, function(user) {
      return user.rank == 'collaborator'
    })
  },

  viewers: function() {
    return _.filter(this.state.data.collection.users, function(user) {
      return user.rank == 'viewer'
    })
  },

  renderOwners: function() {
    let _this = this
    return (
      <div className='grey-bottom-border vertical-padding'>
        <div className='bottom-margin'>
          Owners
        </div>
        {_.map(this.owners(), function(owner) {
          return <Avatar user={owner} size={_this.avatarSize} />
        })}
      </div>
    )
  },

  renderCollaborators: function() {
    if (this.collaborators().length <= 0) {
      return
    }
    let _this = this
    return (
      <div className='grey-bottom-border vertical-padding'>
        <div className='bottom-margin'>
          Can add products
        </div>
        {_.map(this.collaborators(), function(collaborator) {
          return <Avatar user={collaborator} size={_this.avatarSize} />
        })}
      </div>
    )
  },

  renderAllCollaborators: function() {
    let allCollaborators = this.owners().concat(this.collaborators());
    if(this.state.data.collection.privacy == 'hidden') {
      allCollaborators = allCollaborators.concat(this.viewers());
    }
    let _this = this;

    return (
      <div>
        <div className='top-margin small-text'>
          Collaborators in this collection
        </div>
        <div className='vertical-padding'>
          {_.map(allCollaborators, function(collaborator) {
            return <Avatar user={collaborator} size={_this.avatarSize} />
            })}
        </div>
      </div>
    )
  },

  isPrivacyChecked: function(type){
    return this.state.data.collection.privacy == type ? 'checked' : ''
  },

  renderViewers: function() {
    let _this = this
    let checkedHidden = this.isPrivacyChecked('hidden');
    let checkedPublic = this.isPrivacyChecked('visible');
    return (
      <form className='grey-bottom-border vertical-padding'>
        <div className='bottom-margin'>
          Can view
        </div>
        <label>
          <input checked={checkedHidden} type='radio' name='privacy' value='hidden' onClick={this.setPrivacy}/>
          Specific People
          <div className='small-text left-margin-2-5'>
            This collection will be viewable only to the people you specify.
          </div>
        </label>

        <div>
          {_.map(this.viewers(), function(viewer) {
            return <Avatar user={viewer} size={_this.avatarSize} />
          })}
        </div>

        <label>
          <input checked={checkedPublic} type='radio' name='privacy' value='visible' onClick={this.setPrivacy}
             />
          Public
          <div className='small-text left-margin-2-5'>
            Open it to the public. Every user in Fletcher will be able to view your collection.
          </div>
        </label>
      </form>
    )
  },

  setPrivacy: function(e) {
    let newValue = $(e.target).val()
    let message, button, title;
    let _this = this;

    if (newValue == 'hidden') {
      title = 'Make this collection private?'
      message = 'Are you sure you want to make this collection private? Only Fletcher users you share it with will be able to see it.'
      button = 'Make Private'
    } else {
      title = 'Make this collection public?'
      message = 'Are you sure you want to make this collection public? All Fletcher users will be able to view it.'
      button = 'Make Public'
    }

    FluxAlertActions.showAlert({
      title: title,
      blue: true,
      success: button,
      cancel: 'Cancel',
      message: message,
      showClose: true,
      headerIconClass: 'collections',
      successCallback: function() {
        _this.setState({privacy: newValue})
        FluxCollectionActions.updateCollection(_this.state.data.collection.id, {privacy: newValue})
      }
    })
  },

  firstProductName: function() {
    let product = this.state.data.collection.products[0]
    if (product) {
      return product.name
    }
  },

  renderFilePathLink: function(name, url) {
    return <a href={url} className='right-arrow-after grey-color'>{name}</a>
  },

  getParameterByName: function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  getPreviousLink: function() {
    return this.getParameterByName('link') || `/app/users/${this.state.data.collection.user.id}`
  },

  getPreviousName: function() {
    return this.getParameterByName('name') || this.state.data.collection.user.name
  },

  renderFilePath: function() {
    let name = this.getPreviousName()
    let link = this.getPreviousLink()

    return (
      <div className='vertical-padding red-bottom-border bottom-margin color-dark-grey hidden-xs'>
        {this.renderFilePathLink(name, link)}
        {this.renderFilePathLink('Collections', link + '#collections')}
        <span className='color-red'>{this.state.data.collection.name}</span>
      </div>
    )
  },

  renderBackButton: function() {
    let link = this.getParameterByName('link')
    if(link) {
      return <Link className='back-button' to={link}>Back</Link>
    }
  },

  getMoreOptionsRows: function() {
    let rows = []

    if(this.state.data.collection.owned) {
      rows.push({
        description: "Add Collaborators",
        action: this.shareCollection
      })
      rows.push({
        description: "Manage Collaborators",
        action: this.manageCollaborators
      })
      rows.push({
        description: "Delete Collection",
        className: 'blue',
        action: this.deleteCollection
      })
    } else if(this.totalCollaborators()) {
      rows.push({
        description: "View Collaborators",
        action: this.viewCollaborators
      })
    }

    return rows
  },

  renderHeader: function() {
    return (
      <div className='header vertical-padding bottom-margin-2 horizontal-padding'>
        <div className='large-text'>
          { this.state.data.collection.name }
        </div>
        <div className='color-dark-grey'>
          Created by <Link
                        to={`/app/users/${this.state.data.collection.user.id}`}
                        className='link'>
            {this.state.data.collection.user.name}
          </Link>, {DateHelper.getStrDateInDefaultFormat(this.state.data.collection.created_at) }
        </div>
        <div className='color-dark-grey'>
          {this.totalCollaborators()} collaborator(s)
        </div>
        <MoreOptionsDropdown
          rows={this.getMoreOptionsRows()} />
      </div>
    )
  },

  render: function() {
    let actionList = [];
    let isOwned = this.ownedByUser();

    if (isOwned) {
      actionList.push(
        {action: this.deleteCollection,
         type: 'delete-form',
         refs: ['collaborators', 'products'],
         tabTitle: 'Delete Collection'}
      );
    }

    return (
      <div className='tags-page'>
        {this.renderFilePath()}
        {this.renderBackButton()}
        {this.renderHeader()}
        <TabbedArea
          containerClass={'no-border no-margin no-child-padding hidden-xs'}
          actions={actionList}>
          { this.renderProductsTable(this.state.data.collection.products) }
          { this.renderCollaboratorInfo() }
        </TabbedArea>
        <div className='visible-xs row background-light-grey'>
          <div className='col-xs-12'>
            { this.renderProductsTable(this.state.data.collection.products) }
          </div>
        </div>
      </div>
    );
  }
})

export default CollectionPage;