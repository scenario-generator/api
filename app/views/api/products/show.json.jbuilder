json.(@product, :id, :name, :description, :image, :rating, :url, :reviews, :tags, :price, :created_at, :updated_at, :author, :views)

json.company do
  json.(@product.company, :id, :name)
end