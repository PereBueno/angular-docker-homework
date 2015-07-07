require 'controllers/application_controller'
require 'controllers/not_found_controller'

require 'controllers/api_controller'
require 'controllers/payments_controller'

module MyApplication
  class Dispatcher
    def call(env)
      path_info = env['PATH_INFO']

      app = case path_info
        when %r{^/api} then ApiController.new
        when %r{^/payment} then PaymentsController.new
        else NotFoundController.new
      end

      app.call(env)
    end
  end
end
