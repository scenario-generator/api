module Api
  class CompaniesController < AppController
    respond_to :json

    def show
      @company = Company.find(show_params)
      respond_to do |format|
        format.json { render }
      end
    end

    def show_params
      params.require(:id)
    end
  end
end
