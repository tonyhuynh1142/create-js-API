'use strict';
var TEST = (function ($, window) {
  var config = {
    large: 1200,
    tabletLarge: 1024,
    desktops: 992,
    tablets: 768,
    phones: 767,
    smallPhone: 480
  };

  var vars = {
    doc: $(document),
    win: $(window),
    body: $(document.body),
    html: $('html'),
    lang: $('html').attr('lang'),
    speedVeryFast: 200,
    speedFast: 300,
    speedDefault: 400,
    speedSlow: 500
  };

  var viewportWidth = (function () {
    if (window.Modernizr.touch) {
      return function () {
        return $(window).width();
      };
    } else {
      if (navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i)) {
        return function () {
          return document.documentElement.clientWidth;
        };
      } else {
        return function () {
          return window.innerWidth || document.documentElement.clientWidth;
        };
      }
    }
  })();

  var viewportHeight = (function () {
    if (window.Modernizr.touch) {
      return function () {
        return window.innerHeight || document.documentElement.clientHeight;
      };
    } else {
      return function () {
        return $(window).height();
      };
    }
  })();

  var isTabletLarge = (function () {
    return function () {
      if (viewportWidth() > config.tabletLarge) {
        return false;
      }
      return true;
    };
  })();

  var isDesktop = (function () {
    return function () {
      if (viewportWidth() < config.desktops) {
        return false;
      }
      return true;
    };
  })();

  var isMobile = (function () {
    return function () {
      if (viewportWidth() < config.tablets) {
        return true;
      }
      return false;
    };
  })();

  var isTablet = (function () {
    return function () {
      if (!isMobile() && !isDesktop()) {
        return true;
      }
      return false;
    };
  })();

  var isTabletlandscape = (function () {
    return function () {
      if (!isMobile() && !isTabletLarge()) {
        return true;
      }
      return false;
    };
  })();

  var checkScreen = (function () {
    if (isMobile()) {
      return 'mobile';
    }
    if (isTablet()) {
      return 'tablet';
    }
    if (isDesktop()) {
      return 'desktop';
    }
  })();

  var isIOS = function () {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  var detectMac = function () {
    if (navigator.appVersion.indexOf('Mac') !== -1) {
      vars.html.addClass('mac');
    }
	};
	
  var checkRatioYoutube = function() {
    var $allVideos = $("iframe[src*='www.youtube.com'], iframe[src*='player.vimeo.com']");
    var timer = null;
    $allVideos.each(function () {
      var self = $(this),
          valAspectRatio = self.data('aspect-ratio');

      self.data('aspectRatio', valAspectRatio).removeAttr('data-aspect-ratio');
    });

    // When the window is resized
    $(window).resize(function (e) {
      e.preventDefault();
      clearTimeout(timer);
      timer = setTimeout(function() {
        $allVideos.each(function () {
          var $el = $(this);
          // Get parent width of this video
          var newWidth = $el.parent().width();
          $el.width(newWidth).height(newWidth * $el.data('aspectRatio'));
        });
      }, 300);
    }).resize();
  };

  var ajaxHelper = function (request) {
    $.ajax({
      url: request.url,
      type: request.type,
      data: request.data,
      beforeSend: function () {
        if (request.beforeSendHandler) {
          request.beforeSendHandler();
        }
      },
      success: function (response) {
        if (request.successHandler) {
          request.successHandler(response);
        }
      },
      error: function () {
        if (request.errorHandler) {
          request.errorHandler();
        }
      },
      complete: function (xhr, status) {
        if (request.completeHandler) {
          request.completeHandler();
        }
      }
    });
  };

  $.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results) {
      return results[1] || 0;
    } return null;
  };

  return {
    viewportWidth: viewportWidth,
    viewportHeight: viewportHeight,
    isTabletlandscape: isTabletlandscape,
    isDesktop: isDesktop,
    isMobile: isMobile,
    isTablet: isTablet,
    checkScreen: checkScreen,
    isIOS: isIOS,
    detectMac: detectMac,
    checkRatioYoutube: checkRatioYoutube,
    ajaxHelper: ajaxHelper,
    config: config,
    vars: vars,
  };

})(jQuery, window);

jQuery(function () {
  TEST.detectMac();
  TEST.checkRatioYoutube();
});