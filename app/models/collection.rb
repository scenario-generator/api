class Collection < ActiveRecord::Base
  include SearchableByNameAndDescription

  extend FriendlyId
  friendly_id :name, use: [:slugged, :history], dependent: false

  enum privacy: [:hidden, :visible]

  belongs_to :user

  has_one :notification, as: :notification_subject
  has_many :collection_products, dependent: :destroy
  has_many :products, through: :collection_products
  has_many :collection_users, -> { where(email: nil) }, dependent: :destroy
  has_many :sharees, through: :collection_users
  has_many :invited_sharees, -> { where.not(email: nil) }, class_name: 'CollectionUser'
  has_many :tags, through: :products

  validates :name, presence: true
  validates :description, presence: true
  validates :user, presence: true
  validates :privacy, presence: true

  before_save :capitalize_name

  scope :latest, -> { order(created_at: :desc) }

  scope :visible, -> (user) {
    joins { collection_users.outer }
      .where {
        (user_id.eq user.id) |
        (collection_users.sharee.eq user) |
        (privacy.eq 1)
      }.uniq
  }

  scope :editable, -> (user) {
    joins { collection_users.outer }
      .where {
        (user_id.eq user.id) |
        (collection_users.sharee.eq(user) & collection_users.rank.gteq(1))
      }.uniq
  }

  scope :owned, -> (user) {
    joins { collection_users.outer }
      .where {
        (user_id.eq user.id) |
        (collection_users.sharee.eq(user) & collection_users.rank.gteq(2))
      }.uniq
  }

  scope :alphabetical, -> do
    order('name asc')
  end

  scope :recently_added, -> do
    order('created_at desc')
  end

  scope :with_tags, ->(tags_names) do
    joins(:tags).where('tags.name in (?)', tags_names).uniq
  end

  def export(type, opts = {})
    return export_to_ppt if type == 'ppt'
    products.to_export(type, opts)
  end

  def export_to_ppt(_opts = {})
    deck = PPTX::OPC::Package.new

    slide = PPTX::Slide.new(deck)
    slide.add_textbox PPTX.cm(2, 1, 22, 2), name, sz: 45 * PPTX::POINT
    slide.add_textbox PPTX.cm(2, 6, 22, 10), description
    deck.presentation.add_slide(slide)

    products.each do |product|
      slide = PPTX::Slide.new(deck)
      slide.add_textbox PPTX.cm(2, 1, 22, 2), name, sz: 45 * PPTX::POINT
      productContent = "#{product.description}\n\nTotal Reviews: #{product.reviews.length}\nQuality Score: #{product.rating}\nPrice Score: #{product.price}"
      slide.add_textbox PPTX.cm(2, 6, 22, 11), productContent
      deck.presentation.add_slide(slide)
    end

    [deck.to_zip, 'application/vnd.ms-powerpointtd>']
  end

  def self.deleted?(id)
    return  find_by(id: id).nil? &&
            !FriendlyIDSlug.find_by(sluggable_id: id, sluggable_type: 'Collection').nil? if id.to_i > 0
    slug = FriendlyIDSlug.find_by(slug: id)
    find_by(slug: id).nil? && !slug.nil? && slug.sluggable.nil?
  end

  def capitalize_name
    self.name = name.slice(0, 1).capitalize + name.slice(1..-1)
  end

  def visible_to?(user)
    Collection.where(id: id).visible(user).length > 0
  end

  def editable_by?(user)
    Collection.where(id: id).editable(user).length > 0
  end

  def owned_by?(user)
    Collection.where(id: id).owned(user).length > 0
  end

  def remove_sharees(ids)
    collection_users.where(sharee_id: ids).destroy_all
  end

  def remove_invitations(emails)
    invited_sharees.where(email: emails).destroy_all
  end

  def share_and_invite(users, emails)
    share(users) && invite(emails)
  end

  # This will remove any IDs that are not in the new_sharees array.
  def share(new_sharees)
    new_sharees = [] if new_sharees.nil?
    # Remove any sharees not passed in from the front end
    sharee_ids = new_sharees.map { |sharee| sharee.with_indifferent_access['id'].to_i }
    existing_sharee_ids = sharees.map(&:id)
    remove_sharees(existing_sharee_ids - sharee_ids)

    # Create new sharees or update existing ones with new info.
    new_sharees.each do |sharee_hash|
      sharee_hash = sharee_hash.with_indifferent_access
      sharee = collection_users.find_or_initialize_by(sharee_id: sharee_hash['id'])
      sharee.rank = sharee_hash['rank']
      sharee.save
    end
  end

  # This will remove any emails that are not in the new_invitations array
  def invite(new_invitations)
    new_invitations = [] if new_invitations.nil?

    emails = new_invitations.map { |sharee| sharee.with_indifferent_access['email'] }
    existing_invitations = invited_sharees.map(&:email)
    remove_invitations(existing_invitations - emails)

    # Create new invitations or update existing ones with new info.
    new_invitations.each do |invitation_hash|
      invitation_hash = invitation_hash.with_indifferent_access
      sharee = invited_sharees.find_or_initialize_by(email: invitation_hash['email'])
      sharee.rank = invitation_hash['rank']
      sharee.save
    end
  end

  def update_products(products, user)
    new_products = products - self.products
    update_attributes(products: products)
    new_collection_products = collection_products.where(product: new_products)
    new_collection_products.update_all(user_id: user.id)
  end

  def display_date
    updated_at.strftime('%b %e, %Y')
  end
end
