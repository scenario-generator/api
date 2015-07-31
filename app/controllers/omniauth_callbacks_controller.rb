class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def yammer
    result = Omniauth::Result.new(env['omniauth.auth'])
    user = authenticate_user!(result)

    if user.nil?
      redirect_to root_url
    else
      generate_token!(user, result)
      sign_in user
      redirect_to app_path
    end
  end

  def failure
    redirect_to root_url, alert: 'Sorry, something went wrong... Please try again!'
  end

  private

  def authenticate_user!(result)
    user_auth = Omniauth::UserAuth.new(result)
    provider = result.provider.capitalize

    if user_auth.authenticate!
      set_flash_message(:notice, :success, kind: provider)
    else
      set_flash_message(:error, :error, kind: provider)
    end

    user_auth.user
  end

  def generate_token!(user, result)
    secret = Rails.application.secrets.secret_key_base
    token = Fletcher::AuthToken.new(user, result.token, secret).create!
    cookies['auth_token'] = { value: token.try(:encode!), expires: 24.hours.from_now }
    token
  end
end