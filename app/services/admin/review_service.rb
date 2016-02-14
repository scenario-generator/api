class Admin::ReviewService
  def self.reviews(reviews_attributes, current_user)
    return [] if reviews_attributes.nil?
    reviews_attributes.collect do |_key, review|
      _review = Review.where(id: review[:id]).first_or_create
      _review.tags = tags(review[:tags_attributes])
      _review.title = review[:title]
      _review.quality_review = review[:quality_review]
      _review.quality_score = review[:quality_score]
      _review.price_review = review[:price_review]
      _review.price_score = review[:price_score]
      _review.product_id = review[:product_id]
      _review.user = current_user if _review.user.nil?
      _review.links = links(review[:links_attributes])
      review.delete(:tags_attributes)
      review.delete(:links_attributes)
      _review
    end
  end

  def self.links(links_attributes)
    return [] if links_attributes.nil?
    links = links_attributes.collect { |_key, value|
      keep = value[:_destroy].nil? || value[:_destroy] == '0'
      link = Link.where(url: value[:url]).first_or_create if keep
      link = nil unless keep && link.valid?
      link
    }
    links.compact
  end

  def self.tags(tags_attributes)
    return [] if tags_attributes.nil?
    tags = tags_attributes.collect { |_key, value|
      keep = value[:_destroy].nil? || value[:_destroy] == '0'
      tag = Tag.where(name: value[:name]).first_or_create if keep
      tag = nil unless keep && tag.valid?
      tag
    }
    tags.compact
  end
end
