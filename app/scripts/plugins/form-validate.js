/**
 *  @name form-validate
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'form-validate',
      topScrollError = 0;

  var validateEmail = function(email) {
    var re =  /[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/;
      return re.test($.trim(email));
  };

  var validateInput = function(str) {
    if ($.trim(str).length > 0) {
      return true;
    }
    return false;
  };

  var setPositionScroll = function(el) {
    if (topScrollError === 0) {
      topScrollError = el.offset().top;
    }
  };

  var deleteNoticeerror = function(el) {
    el.removeClass('error-input');
    el.parent().find('.error-message').remove();
  };

  var validate = function(el) {
    el.parent().find('.error-message').remove();
    var type = el.attr('type'),
        val = el.val(),
        checkValidate = true;
    if (el.attr('data-required')) {
      switch(type){
        case 'email':
          checkValidate = validateEmail(val);
          break;
        default:
          checkValidate = validateInput(val);
      }
      if (!checkValidate) {
        setPositionScroll(el);
        el.addClass('error-input');
        el.after('<span class="error-message">' + el.data('msg-required') + '</span>');
        if (type !== 'text' && val.length > 0) {
          el.parent().find('.error-message').text(el.data('msg-' + type));
        }
      }
    }
    return checkValidate;
  };

  var validateForm = function() {
    var that = this,
        el = that.element,
        inputEl = el.find('input'),
        selectCategory = el.find('select'),
        textarea = el.find('textarea'),
        resultCheck = true;
    var inputRadioChecked = el.find('input[type=radio]:checked'),
        inputRadio = el.find('input[type=radio]');

    if (selectCategory.val() === 'all') {
      selectCategory.addClass('error-input');
      selectCategory.parent().after('<span class="error-message">' + selectCategory.data('msg-required') + '</span>');
      setPositionScroll(selectCategory);
      resultCheck = false;
    }

    if (inputRadioChecked.length === 0 ) {
      inputRadio.parent().parent().addClass('error-input-radio');
      inputRadio.parent().parent().after('<span class="error-message">' + inputRadio.parent().parent().data('msg-required') + '</span>');
      setPositionScroll(inputRadio);
      resultCheck = false;
    }


    inputEl.each(function(){
      if ($(this).attr('type') !== 'radio' && $(this).attr('type') !== 'hidden') {
        if (!validate($(this))) {
          resultCheck = false;
        }
      }
    });

    var mesg = textarea.val().trim();
    if (mesg.length === 0) {
      textarea.addClass('error-input');
      textarea.after('<span class="error-message">' + textarea.data('msg-required') + '</span>');
      resultCheck = false;
      setPositionScroll(textarea);
    }

    var inputRecapt = el.find('input[name=CaptchaInputText]');
    var recapttext = inputRecapt.val();

    if (typeof recapttext !== 'undefined') {
      if (recapttext.length === 0) {
        inputRecapt.addClass('error-input');
        inputRecapt.after('<span class="error-message">' + inputRecapt.parent().data('msg-required') + '</span>');
        setPositionScroll(inputRecapt);
        resultCheck = false;
      }
    }


    return resultCheck;
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      that.bind();
    },
    bind: function() {
      var that = this,
          el = that.element,
          options = that.options;

      el.on('submit', function(e) {
        e.preventDefault();
        el.find('.error-message').remove();
        if (!validateForm.call(that)) {
          $('html, body').animate({
            scrollTop: topScrollError - 100
          }, 300);
          topScrollError = 0;
          return false;
        } else {
          $.ajax({
            url: el.attr('action'),
            type: options.methobs,
            data: el.serializeArray(),
            success: function(res) {
              if (res.data.status === 'SUCCESS') {
                // el.parent().addClass('hidden');
                el[0].reset();
                $('[data-notice-message]').text(res.data.msg);
              } else {
                res.data.msg.forEach(function(msg){
                  var input = el.find('[data-rule=' + msg.type + ']');

                  input.addClass('error-input');
                  input.after('<span class="error-message">' + msg.errorMsg + '</span>');
                });
              }
            },
          });
        }
      });

      el.find('input[type=radio]').on('change.' + pluginName, function() {
        $(this).parent().parent().removeClass('error-input-radio');
        $(this).parent().parent().parent().find('.error-message').remove();
      });

      el.find('select').on('change.' + pluginName, function() {
        if ($(this).val() === 'all') {
          $(this).addClass('error-input');
          $(this).parent().after('<span class="error-message">' + $(this).data('msg-required') + '</span>');
        } else {
          // deleteNoticeerror($(this));
          $(this).removeClass('error-input');
          $(this).parent().parent().find('.error-message').remove();
        }
      });

      el.find('input, textarea').on('keyup.' + pluginName, function() {
        deleteNoticeerror($(this));
      });

      el.find('input, textarea').on('blur.' + pluginName, function() {
        if (validate($(this))) {
          deleteNoticeerror($(this));
        }
      });
    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    methobs: 'GET'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
