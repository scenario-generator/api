class Users::SessionsController < Devise::SessionsController
  # DELETE /resource/sign_out
  def destroy
    super
  end
end
