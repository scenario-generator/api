class Tag < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: :slugged
  include SearchableByName

  has_and_belongs_to_many :users
  has_many :tag_taggables
  has_many :reviews, through: :tag_taggables, :source => :taggable, :source_type => 'Review'
  has_many :products, through: :reviews
  has_many :companies, through: :reviews

  scope :most_popular, ->() do
    joins('LEFT OUTER JOIN tags_users ON tags.id = tags_users.tag_id')
      .select('tags.id, tags.name, tags.slug, count(tags_users.user_id) as users_count')
      .group('tags.id, tags.name')
      .order('users_count DESC')
  end

  before_validation :downcase_name!

  validates :name, presence: true, uniqueness: true

  def should_generate_new_friendly_id?
    true
  end

  def follow(user)
    users.append user
  end

  def unfollow(user)
    users.delete user
  end

  def followed?(user)
    users.include? user
  end

  private

  def downcase_name!
    self.name = self.name.downcase if self.name
  end
end
