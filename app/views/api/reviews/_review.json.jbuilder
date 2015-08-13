json.extract! review, :id, :title, :quality_review, :quality_score, :price_review,
  :price_score, :attachments, :links, :created_at, :updated_at, :tag_list, :tags, :reviewable

json.formatted_price_review (review.price_review.nil? or review.price_review.empty?) ? "" : simple_format(review.price_review)
json.formatted_quality_review (review.quality_review.nil? or review.quality_review.empty?) ? "" : simple_format(review.quality_review)

json.user do
  json.(review.user, :name, :job_title, :avatar_url, :location, :total_reviews)
end unless review.user.nil?
