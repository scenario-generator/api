class Company < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: [:slugged, :history], dependent: false

  has_many :products
  has_many :tag_taggables, as: :taggable
  has_many :tags, through: :tag_taggables

  include Avatarable
  include SearchableByNameAndDescription

  scope :with_tags, ->(tags_names) do
    joins(:tags).where('tags.name in (?)', tags_names).uniq
  end

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  pg_search_scope :search_by_name_and_description, against: [
                                                     [:name, 'A'],
                                                     [:description, 'B'],
                                                 ], using: {
                                                   tsearch:    { any_word: true, prefix: true },
                                                   dmetaphone: { any_word: true, sort_only: true },
                                                 }

  pg_search_scope :search_by_name, against: :name, using: {
    tsearch:    { any_word: true, prefix: true },
    dmetaphone: { any_word: true, sort_only: true },
  }

  pg_search_scope :search_by_description, against: :description, using: {
    tsearch:    { any_word: true, prefix: true },
    dmetaphone: { any_word: true, sort_only: true },
  }

  def self.deleted?(id)
    return  find_by(id: id).nil? &&
            !FriendlyIDSlug.find_by(sluggable_id: id, sluggable_type: 'Company').nil? if id.to_i > 0
    slug = FriendlyIDSlug.find_by(slug: id)
    find_by(slug: id).nil? && !slug.nil? && slug.sluggable.nil?
  end

  def image_url
    avatar.try(:url)
  end

  def short_desc
    description.split[0...9].join(' ') if description
  end

  def should_generate_new_friendly_id?
    true
  end
end
