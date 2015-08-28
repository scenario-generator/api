gem 'faker'

class Product < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: :slugged

  belongs_to :company
  has_many :reviews
  has_many :attachments, through: :reviews, source: :attachments
  has_many :images, -> { with_images }, through: :reviews, source: :attachments
  has_many :links, through: :reviews
  has_many :tags, through: :reviews
  has_one :default_image, class_name: 'Attachment'
  belongs_to :user

  include SearchableByNameAndDescription
  include SearchableByTag

  accepts_nested_attributes_for :reviews

  validates :name, presence: true, uniqueness: { scope: :company_id, case_sensitive: false }
  validates :description, presence: true
  validates :company, presence: true

  scope :recently_added, -> do
    order('created_at desc')
  end

  scope :most_popular, -> do
    order('views desc')
  end

  scope :with_author, ->(author) do
    where(user: author)
  end

  scope :rating, -> rating_order do
    joins('LEFT JOIN reviews rev ON products.id = rev.product_id')
        .select('sum(COALESCE(rev.quality_score, 0)) / GREATEST(count(rev.quality_score), 1) as total_quality_score, products.id, products.name, products.description,
products.url, company_id, products.views, products.created_at, products.updated_at, products.slug')
        .group('products.id, products.name, products.description,
products.url, company_id, products.views, products.created_at, products.updated_at, products.slug')
        .order("total_quality_score #{rating_order}")
  end

  scope :best_rating, -> do
    rating('desc')
  end

  scope :worst_rating, -> do
    rating('asc')
  end

  def image
    image = default_image || images.first
    image.try(:url)
  end

  def total_reviews
    reviews.size
  end

  def rating
    self.reviews.map(&:quality_score).compact.average || 0
  end

  def price
    self.reviews.map(&:price_score).compact.average || 0
  end

  def author
    user
  end

  def short_desc
    description.split[0...9].join(' ') if description
  end

  def increment_views!
    self.views = self.views + 1
    self.save
  end

  def reviewed_by_user?(user)
    reviews.where(user: user).size > 0
  end
end
