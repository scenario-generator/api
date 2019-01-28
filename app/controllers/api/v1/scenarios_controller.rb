# frozen_string_literal: true

# Api::V1::ScenariosController
#
# API endpoints for Scenarios
#
# GET  show   - Loads saved Scenario
# GET  new    - Generates a new Scenario
# POST create - Saves Scenario
#
module Api
  module V1
    class ScenariosController < ApiController
      before_action :setup_generators
      before_action :setup_generator

      def show
        @scenario_model = @generator.scenarios.find_by(uuid: params[:id])
        if @scenario_model
          @generator = @scenario_model.generator
        else
          render_error 404, ['Scenario not found']
        end
      end

      def create
        @scenario_model = @generator.scenarios.new(scenario_hash: scenario_hash)
        if @scenario_model.save
          render :show
        else
          render_error 400, @scenario_model.errors.full_messages
        end
      end

      def new
        @scenario = scenario_generator.generate
      end

      def update
        @scenario_model = @generator.scenarios.find_by(uuid: params[:id])

        if @scenario_model&.update(scenario_hash: scenario_hash)
          render :show
        else
          render_error 400, @scenario_model.errors.full_messages
        end
      end

      private

      def scenario_generator
        return @generator unless params[:column_id]

        @generator.owned_columns.find_by(id: params[:column_id])
      end

      def scenario_hash
        params[:scenario].permit!.to_hash.with_indifferent_access
      end
    end
  end
end
