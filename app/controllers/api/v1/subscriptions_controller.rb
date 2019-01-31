# frozen_string_literal: true

# Api::V1::SubscriptionsController
#
# API endpoints for Email subs
# Unsubscription is handled by Mailchimp so don't email me that I don't have an unsub system.
#
# POST  create - Subscribe to the mailing list
#
module Api
  module V1
    class SubscriptionsController < ApiController
      def create
        subscription_response = Mailchimp.subscribe(params[:email])
        render_error(400, [subscription_response['title']]) unless subscription_response['status'] == 'subscribed'
      end
    end
  end
end