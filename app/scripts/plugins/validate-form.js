/**
 *  @name validate
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    destroy
 */
; (function ($, TEST) {
  'use strict';

  var pluginName = 'validate-form';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this,
        options = this.options,
        form = this.element,
        errorEle = form.find('[data-msg-error]');

			that.vars = {
				invalidHandlerTime: 0,
				submitForm: true
			};

      var validator = form.validate({
				debug:true,
				errorContainer: errorEle,
				errorElement: options.errorElement,
				errorPlacement: function () {
					return false;
				},

        highlight: function( element, errorClass, validClass ) {
          if ( element.type === 'radio' ) {
            this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
          } else {
            $( element ).addClass( errorClass ).removeClass( validClass );
          }
				},
				
        unhighlight: function( element, errorClass, validClass ) {
          if ( element.type === 'radio' ) {
            this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
          } else {
            $( element ).removeClass( errorClass ).addClass( validClass );
          }
				},

        invalidHandler: function(){
					// Show number fields are not invalid
					// var errors = validator.numberOfInvalids(),
					// 		textNumberEle = $('div.number-error');
					// if (errors) {
					// 	textNumberEle.text( validator.numberOfInvalids() + ' field(s) are invalid' );
					// 	$('div.number-error').show();
					// } else {
					// 	$('div.number-error').hide();
					// }
				},
				
        submitHandler: function(form){
					// submit usually
					// form.submit();

          // if form call ajax
					if($(form).is('[data-form-call-ajax]')){
						var formElement = $(form);
						
            var onSubmitSuccess = function (response) {
							if (!response.hasError && response.data.link) {
								formElement.data('redirect', true);
								window.location.href = response.data.link;

								return false;
							}

              var errorElement = formElement.find('[data-msg-error]'),
									dataServer = response.data,
									msgServerEle = formElement.find('.msg-server'),
									msgServerText;

              if(dataServer){
                msgServerText = dataServer.msg;
              }

              if (errorElement && msgServerText) {
                if(!msgServerEle.length){
                  errorElement.after('<p class="msg-server"></p>');
                  msgServerEle = formElement.find('.msg-server');
                }

                msgServerEle.text(msgServerText);

                if (response.hasError) {
                  msgServerEle.removeClass('msg-success').addClass('msg-error');
                } else {
									msgServerEle.removeClass('msg-error').addClass('msg-success');									
                }
              }
            };

            var linkServer = formElement.attr('action'),
              formData = formElement.serializeArray();

            var request = {
              url: linkServer,
              type: options.methobs,
              data: formData,
              beforeSendHandler: function(){
                //add loading
              },
              successHandler: onSubmitSuccess,	
              completeHandler: function(){
								// remove loading
              }
						};
						
						TEST.ajaxHelper(request);
					}
					return false;
				},
				
        onfocusin: function(){
          form.find('.msg-server').remove();
          // form.find('.field-error').removeClass('field-error');
        },
        onfocusout: function(){
          form.find('.msg-server').remove();
          // form.find('.field-error').removeClass('field-error');
        }
			});
			
      TEST.validator = validator;

			var modalWrapForm = form.closest('.modal');
			
      if(modalWrapForm.length){
        modalWrapForm.on('hidden.bs.modal', function(){
          validator.resetForm();
        });
      }
			
      $.validator.addMethod('password', function (password) {
        return /[A-Z]+/.test(password) && /[a-z]+/.test(password) && /[0-9]+/.test(password) && /\S{6,}/.test(password);
      });

      $.validator.addMethod('email', function (email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
      });

      $.validator.addMethod('number', function (value, element) {
        if ($(element).is('input')) {
          return /^\d+$/.test(value);
        }
        return true;
      });

      $.validator.addMethod('phoneNumber', function (value) {
        var phone = value;
        phone = phone.split('+').join('');
        phone = phone.split('-').join('');
        return /^\d+$/.test(phone);
      });

      $.validator.addMethod('checkLeastOne', function () {
        var checked = $('.rule-checkbox:checked'),
          title = $('.title-checkbox');
        if (checked.length) {
          title.removeClass('msg-error');
          return true;
        }
        title.addClass('msg-error');
        return false;
      });

      $.validator.addClassRules({
        password: { password: true },
        number: { number: true },
        email: { email: true },
        phoneNumber: { phoneNumber: true },
        checkLeastOne: { checkLeastOne: true }
      });
    },
    destroy: function () {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, 'plugin_' + pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    errorElement: 'p',
    methobs: 'GET'
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window.TEST));
