
  
/*
  You SHOULD NOT modify source code in this page because
  It is automatically generated from EcomSolid
  Try to edit page with the live editor.
  https://ecomsolid.com
*/

(function(jQuery, $) {
  
      try {
        const funcLib9 = function() {
          "use strict";

/* gtProductSwatches */
(function (jQuery) {
  var gtProductSwatches = function (element, options) {
    var defaults = {
      classCurrentValue: null,
      classItem: null,
      classInputIdHidden: null,
      classBtnSelect: null,
      classCurrentStatus: null,
    };

    this.settings = {};
    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      _this.setInitVariant();
      _this.event();
      _this.listen();
    };

    this.setInitVariant = function () {
      if (_productJson) {
        var storeVariant = window.SOLID.store.getState("variant" + _productJson.id);

        if (storeVariant && storeVariant.variant_init) {
          window.store.update("variant" + _productJson.id, storeVariant);
          return;
        }

        var $productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson");

        if ($productJson && $productJson.length) {
          var variantID = parseInt($productJson.attr("data-variant"));

          for (var i = 0; i < _productJson.variants.length; i++) {
            var currentVariant = _productJson.variants[i];

            if (currentVariant.id == variantID) {
              try {
                var newVariant = JSON.parse(JSON.stringify(currentVariant));

                // eslint-disable-next-line camelcase
                newVariant.variant_init = true;
                window.store.update("variant" + _productJson.id, newVariant);
              } catch (e) {
                console.log(e);
              }
              break;
            }
          }
        }
      }
    };

    this.event = function () {
      if (_productJson) {
        try {
          var variants = _productJson.variants;
          var $select = $element.find(_this.settings.classBtnSelect);

          $select.off("click.select").on("click.select", function () {
            var $el = jQuery(this);

            if (!$el.hasClass("gt_soldout")) {
              var name = $el.attr("data-name");
              // Update active
              var $selector = $element.find(_this.settings.classBtnSelect + '[data-name="' + name + '"]');

              if ($selector && $selector.length) {
                $selector.removeClass("gf_active");
                $selector.removeClass("gt_active");
              }
              $el.addClass("gf_active");
              $el.addClass("gt_active");
              var $actives = $element.find(_this.settings.classBtnSelect + ".gf_active," + _this.settings.classBtnSelect + ".gt_active");
              var values = [];
              var i;

              if ($actives && $actives.length) {
                for (i = 0; i < $actives.length; i++) {
                  var activeValue = jQuery($actives[i]).attr("data-value");

                  if (activeValue) {
                    values.push(activeValue);
                  }
                }
              }
              var currentVariant = {};

              if (values && values.length) {
                for (i = 0; i < variants.length; i++) {
                  var variant = variants[i];
                  var options = variant.options; // => []
                  // console.log(options, " vs ", values)

                  if (_this.compare(values, options)) {
                    currentVariant = variant;
                    break;
                  }
                }
              }
              // console.log("variants: ", variants);
              // console.log("$actives: ", $actives);
              // console.log("values: ", values);
              // console.log("currentVariant: ", currentVariant);
              if (!jQuery.isEmptyObject(currentVariant)) {
                window.store.update("variant" + _productJson.id, currentVariant);
              } else {
                // Sản phẩm không được định nghĩa
                window.store.update("variant" + _productJson.id, {
                  id: 0,
                  available: false,
                });
              }
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        var options = _productJson.options;

        store.change("variant" + _productJson.id, function (variant) {
          if (variant && variant.variant_init) {
            return;
          }
          var $product = $element.closest("[keyword='product'], [data-keyword='product']");
          var $currentStatus = $product.find(_this.settings.classCurrentStatus);

          if ($currentStatus && $currentStatus.length) {
            if (!variant.available) {
              $currentStatus.show();
              var labelSoldOut = $currentStatus.attr("data-sold-out") || "Sold Out";

              $currentStatus.addClass(_this.settings.classCurrentStatus.replace(".", "") + "--inner");
              $currentStatus.html(labelSoldOut);
            } else {
              $currentStatus.addClass(_this.settings.classCurrentStatus.replace(".", "") + "--inner");
              $currentStatus.hide();
            }
          }

          if (variant.options && variant.options.length) {
            for (var i = 0; i < variant.options.length; i++) {
              var option = variant["option" + (i + 1)];

              if (option) {
                var name;

                if (options[i]) {
                  name = options[i];
                }
                if (!name || jQuery.isPlainObject(name)) {
                  name = options[i].name;
                }
                var $item = $element.find(_this.settings.classItem + '[data-name="' + name + '"]');

                if ($item && $item.length) {
                  if (_this.settings.classCurrentValue) {
                    var $currentValue = $item.find(_this.settings.classCurrentValue);

                    if ($currentValue && $currentValue.length) {
                      $currentValue.html(option);
                    }
                  }
                  var $selectActive = $item.find(_this.settings.classBtnSelect + '[data-value="' + option.replace(/"/g, "'") + '"]');
                  var $select = $item.find(_this.settings.classBtnSelect);

                  if ($select && $select.length && $selectActive && $selectActive.length) {
                    $select.removeClass("gf_active");
                    $select.removeClass("gt_active");
                    $selectActive.addClass("gf_active");
                    $selectActive.addClass("gt_active");
                  }
                }
              }
            }
          }
          if (!jQuery.isEmptyObject(variant)) {
            if ($product && $product.length) {
              var $input = $product.find(_this.settings.classInputIdHidden);

              if ($input && $input.length) {
                $input.attr("value", variant.id).val(variant.id);
                var currentURL = window.location.href;
                var variantURL = _this.updateUrlParameter(currentURL, "variant", variant.id);

                window.history.replaceState({}, "", variantURL);
              }
            }
          }
        });
      }
    };

    this.compare = function (array, array2) {
      array.sort();
      array2.sort();
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array2.length; j++) {
          var val1 = array[j];
          var val2 = array2[j];

          val1 = val1.replace(/"/gm, "'");
          val2 = val2.replace(/"/gm, "'");
          if (val1 != val2) {
            return false;
          }
        }
      }
      return true;
    };

    this.updateUrlParameter = function (url, key, value) {
      var parser = document.createElement("a");

      parser.href = url;
      var newUrl = parser.protocol + "//" + parser.host + parser.pathname;
      // has parameters ?

      if (parser.search && parser.search.indexOf("?") !== -1) {
        // parameter already exists
        if (parser.search.indexOf(key + "=") !== -1) {
          // paramters to array
          var params = parser.search.replace("?", "");

          params = params.split("&");
          params.forEach(function (param, i) {
            if (param.indexOf(key + "=") !== -1) {
              if (value !== null) { params[i] = key + "=" + value; } else { delete params[i]; }
            }
          });
          if (params.length > 0) { newUrl += "?" + params.join("&"); }
        } else if (value !== null) {
          newUrl += parser.search + "&" + key + "=" + value;
        } else {
          newUrl += parser.search;
        } // skip the value (remove)
      } else if (value !== null) {
        newUrl += "?" + key + "=" + value;
      } // no parameters, create it
      newUrl += parser.hash;
      return newUrl;
    };
    this.init();
  };

  jQuery.fn.gtProductSwatches = function (options) {
    return this.each(function () {
      var plugin = new gtProductSwatches(this, options, jQuery);

      jQuery(this).data("gtproductswatches", plugin);
    });
  };
})(jQuery);

        }
        funcLib9();
      } catch(e) {
        console.error("Error lib id: 9" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib10 = function() {
          "use strict";

var gtAnimations = {
  loopSlideUp: function (attrCSS, val, duration, last, element, callback) {
    var deg = val / duration;

    deg = Math.round(deg * 1000) / 1000;
    var max = val;
    var run = setInterval(function () {
      max = max - deg;
      if (val >= 0) {
        if (max <= 0) {
          max = 0;
        }
      } else if (max >= 0) {
        max = 0;
      }
      element.style[attrCSS] = max + "px";
      if ((val >= 0 && max <= 0) || (val <= 0 && max >= 0)) {
        clearInterval(run);
        if (last) {
          setTimeout(function () {
            element.style.removeProperty("overflow");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("border-top");
            element.style.removeProperty("border-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("height");
          }, 0);

          if (callback) {
            return callback();
          }
        }
      }
    }, 1);
  },
  SlideUp: function (element, duration, callback) {
    if (!element) {
      if (callback) {
        return callback();
      }
      return;
    }
    if (!duration) { duration = 500; }
    var compStyles = window.getComputedStyle(element, null);
    var height = parseInt(compStyles.height) || 0;
    var marginTop = parseInt(compStyles.marginTop) || 0;
    var marginBottom = parseInt(compStyles.marginBottom) || 0;
    var borderTop = parseInt(compStyles.borderTop) || 0;
    var borderBottom = parseInt(compStyles.borderBottom) || 0;
    var paddingTop = parseInt(compStyles.paddingTop) || 0;
    var paddingBottom = parseInt(compStyles.paddingBottom) || 0;

    element.style.overflow = "hidden";
    element.style.height = height + "px";
    element.style.paddingTop = paddingTop + "px";
    element.style.paddingBottom = paddingBottom + "px";
    element.style.borderTop = borderTop + "px";
    element.style.borderBottom = borderBottom + "px";
    element.style.marginTop = marginTop + "px";
    element.style.marginBottom = marginBottom + "px";

    var attrs = [{
      attr: "paddingTop",
      val: paddingTop,
    },
    {
      attr: "paddingBottom",
      val: paddingBottom,
    },
    {
      attr: "borderTop",
      val: borderTop,
    },
    {
      attr: "borderBottom",
      val: borderBottom,
    },
    {
      attr: "marginTop",
      val: marginTop,
    },
    {
      attr: "marginBottom",
      val: marginBottom,
    },
    {
      attr: "height",
      val: height,
    },
    ];

    for (var i = 0; i < attrs.length; i++) {
      var item = attrs[i];
      var last = false;

      if (i == attrs.length - 1) {
        last = true;
      }
      this.loopSlideUp(item.attr, item.val, duration, last, element, callback);
    }
  },
  loopSlideDown: function (attrCSS, val, duration, last, element, callback) {
    var deg = val / duration;

    deg = Math.round(deg * 1000) / 1000;
    var min = 0;
    var run = setInterval(function () {
      min = min + deg;

      if (val >= 0) {
        if (min >= val) {
          min = val;
        }
      } else if (min <= val) {
        min = val;
      }
      element.style[attrCSS] = min + "px";
      if ((val >= 0 && min >= val) || (val <= 0 && min <= val)) {
        clearInterval(run);
        if (last) {
          setTimeout(function () {
            element.style.removeProperty("overflow");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("border-top");
            element.style.removeProperty("border-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("height");
          }, 0);
          if (callback) {
            return callback();
          }
        }
      }
    }, 1);
  },
  SlideDown: function (element, duration, callback) {
    if (!element) {
      if (callback) {
        return callback();
      }
      return;
    }
    if (!duration) { duration = 500; }
    var compStyles = window.getComputedStyle(element, null);
    var height = parseInt(compStyles.height) || 0;
    var marginTop = parseInt(compStyles.marginTop) || 0;
    var marginBottom = parseInt(compStyles.marginBottom) || 0;
    var borderTop = parseInt(compStyles.borderTop) || 0;
    var borderBottom = parseInt(compStyles.borderBottom) || 0;
    var paddingTop = parseInt(compStyles.paddingTop) || 0;
    var paddingBottom = parseInt(compStyles.paddingBottom) || 0;

    element.style.overflow = "hidden";
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.borderTop = 0;
    element.style.borderBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    var attrs = [{
      attr: "paddingTop",
      val: paddingTop,
    },
    {
      attr: "paddingBottom",
      val: paddingBottom,
    },
    {
      attr: "borderTop",
      val: borderTop,
    },
    {
      attr: "borderBottom",
      val: borderBottom,
    },
    {
      attr: "marginTop",
      val: marginTop,
    },
    {
      attr: "marginBottom",
      val: marginBottom,
    },
    {
      attr: "height",
      val: height,
    },
    ];

    for (var i = 0; i < attrs.length; i++) {
      var item = attrs[i];
      var last = false;

      if (i == attrs.length - 1) {
        last = true;
      }
      this.loopSlideDown(item.attr, item.val, duration, last, element, callback);
    }
  },
};

window.gtAnimations = gtAnimations;

        }
        funcLib10();
      } catch(e) {
        console.error("Error lib id: 10" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib11 = function() {
          "use strict";

/* gtProductSaved */
(function (jQuery) {
  var gtProductSaved = function (element, options) {
    var defaults = {
      classTextPercent: null,
      classTextNumber: null,
      dataFormat: "",
      dataFormatKey: "",
      customCurrencyFormat: null,
      roundPercent: 0,
      roundNoZeroes: false,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      _this.Init();
      _this.listen();
    };

    this.Init = function () {
      if (_productJson) {
        var variant = window.store.get("variant" + _productJson.id);
        if (variant && variant.id) {
          _this.setPriceWithVariant(variant);
        }
      }
    };

    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          _this.setPriceWithVariant(variant);
        });

        store.change("quantity" + _productJson.id, function () {
          _this.Init();
        });
      }

      store.change("dataCurrency", function () {
        _this.Init();
      });
    };

    this.setPriceWithVariant = function (variant) {
      if (variant.compare_at_price && variant.price && variant.compare_at_price > variant.price) {
        $element.addClass("gf_active");
        $element.addClass("gt_active");

        // Giá giảm theo %
        if (_this.settings.classTextPercent) {
          var $number = $element.find(_this.settings.classTextPercent);
          var number = _this.getPercentDiscount(variant.price, variant.compare_at_price);

          $number.html(number);
        }

        // Giá giảm theo sổ tiền
        if (_this.settings.classTextNumber) {
          var $price = $element.find(_this.settings.classTextNumber);
          var diff = variant.compare_at_price - variant.price;

          diff = _this.formatMoneyPlugin(diff);
          $price.html(diff);
        }
      } else {
        $element.removeClass("gf_active");
        $element.removeClass("gt_active");
      }
    };

    // Get price with quantity
    this.getPriceWithQuantity = function (price) {
      if (_productJson) {
        var quantityProduct = window.store.get("quantity" + _productJson.id);

        quantityProduct = Number(quantityProduct);
        if (!quantityProduct || isNaN(quantityProduct)) {
          quantityProduct = 1;
        }
        price = Number(price) * quantityProduct;
      }
      return price;
    };

    // Format price
    this.formatMoneyPlugin = function (price) {
      price = _this.getPriceWithQuantity(price);
      var dataCurrency = window.store.get("dataCurrency");
      var format = __GemSettings.money;

      if (!dataCurrency) {
        // default shopify format
        price = Shopify.formatMoney(price, format);
      } else {
        // ES addon auto currency converter
        var notApplyRoundDecimal = true; // no apply round decimal for save money

        price = Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data, _this.settings.customCurrencyFormating, notApplyRoundDecimal);
      }

      if (_this.settings.dataFormat && _this.settings.dataFormatKey) {
        price = _this.settings.dataFormat.replace(_this.settings.dataFormatKey, price);
      }

      return price;
    };

    // Lấy phần trăm giảm giá
    this.getPercentDiscount = function (price, comparePrice) {
      price = parseFloat(price);
      comparePrice = parseFloat(comparePrice);
      var diff = comparePrice - price;

      diff = diff / comparePrice;
      diff = diff * 100;
      if(_this.settings.roundNoZeroes) {
        diff = _this.roundTo(diff, _this.settings.roundPercent);
      } else {
        diff = diff.toFixed(_this.settings.roundPercent);
      }
      diff += "%";

      if (_this.settings.dataFormat && _this.settings.dataFormatKey) {
        diff = _this.settings.dataFormat.replace(_this.settings.dataFormatKey, diff);
      }

      return diff;
    };

    this.roundTo = function(n, digits) {
      if (digits === undefined) {
        digits = 0;
      }
    
      var multiplicator = Math.pow(10, digits);
      n = parseFloat((n * multiplicator).toFixed(11));
      var test =(Math.round(n) / multiplicator);
      return +(test.toFixed(digits));
    }

    this.init();
  };

  jQuery.fn.gtProductSaved = function (options) {
    return this.each(function () {
      var plugin = new gtProductSaved(this, options, jQuery);

      jQuery(this).data("gtproductsaved", plugin);
    });
  };
})(jQuery);

        }
        funcLib11();
      } catch(e) {
        console.error("Error lib id: 11" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib4 = function() {
          "use strict";

/* gtProductImageFeature */
(function (jQuery) {
  var gtProductFeatureImage = function (element, options) {
    var defaults = {
      classFeatureImage: null,
      classImages: null,
      carousel: null,
      owlCarousel: null,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);

      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      if ($element.find(_this.settings.carousel) && $element.find(_this.settings.carousel).length) {
        $element.find(_this.settings.carousel).owlCarousel(_this.settings.owlCarousel);
      }

      _this.event();
      _this.listen();
    };
    this.event = function () {

    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          if (variant && variant.variant_init) {
            return;
          }
          if (variant.featured_image && variant.featured_image.src) {
            var src = variant.featured_image.src;

            if (_this.settings.classFeatureImage) {
              $element.find(_this.settings.classFeatureImage).attr("src", src);
            }
            if (_this.settings.carousel) {
              for (var i = 0; i < $element.find(_this.settings.classImages).length; i++) {
                var $img = $element.find(_this.settings.classImages).eq(i);
                var id = $img.attr("data-id");

                if (id == variant.featured_image.id) {
                  if (_this.settings.carousel) {
                    $element.find(_this.settings.carousel).trigger("to.owl.carousel", [i, 200, true]);
                  }
                  break;
                }
              }
            }
          }
        });
      }
    };

    this.init();
  };

  jQuery.fn.gtProductFeatureImage = function (options) {
    return this.each(function () {
      var plugin = new gtProductFeatureImage(this, options, jQuery);

      jQuery(this).data("gtproductfeatureimage", plugin);
    });
  };
})(jQuery);

        }
        funcLib4();
      } catch(e) {
        console.error("Error lib id: 4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib115 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtAnimationsV2
 * Animation cho accordion (slideUp, slideDown)
 * Update quantity của product
 */
var GtAnimationsV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params setting cua lib
     */
    function GtAnimationsV2(params) {
        this.$element = $(params.$element);
        this.settings = __assign(__assign({}, this.settings), params.settings);
        this.init();
    }
    /**
     * slideUp
     * @param callback callback when transition end
     */
    GtAnimationsV2.prototype.slideUp = function (callback) {
        var _this = this;
        this.$element.css({
            "max-height": this.getMaxHeight(),
        });
        this.$element
            .off("webkitTransitionEnd oTransitionEnd transitionend msTransitionEnd")
            .on("webkitTransitionEnd oTransitionEnd transitionend msTransitionEnd", function () {
            callback && callback();
            _this.$element.css({
                padding: "",
                margin: "",
                transition: "",
            });
        });
        setTimeout(function () {
            _this.$element.css({
                "max-height": "0px",
                padding: "0px",
                margin: "0px",
                transition: "all " + _this.settings.duration + "s",
            });
        }, 5);
    };
    /**
     * slideDown
     * @param callback callback when transition end
     */
    GtAnimationsV2.prototype.slideDown = function (callback) {
        var _this = this;
        var maxHeight = this.getMaxHeight();
        this.$element.css({
            "max-height": "0px",
            padding: "0px",
            margin: "0px",
        });
        this.$element
            .off("webkitTransitionEnd oTransitionEnd transitionend msTransitionEnd")
            .on("webkitTransitionEnd oTransitionEnd transitionend msTransitionEnd", function () {
            callback && callback();
            _this.$element.css({
                transition: "",
            });
        });
        setTimeout(function () {
            _this.$element.css({
                "max-height": maxHeight,
                padding: "",
                margin: "",
                transition: "all " + _this.settings.duration + "s",
            });
        }, 5);
    };
    /**
     * init: function init when call libs
     */
    GtAnimationsV2.prototype.init = function () {
        // add transition
        if (this.$element && this.$element.length) {
            this.$element.css({
                overflow: "hidden",
            });
        }
    };
    /**
     * getMaxHeight get max height of element
     * @returns maxheight
     */
    GtAnimationsV2.prototype.getMaxHeight = function () {
        return "calc(" + this.$element.get(0).scrollHeight + "px + " + this.$element.css("margin-top") + " + " + this.$element.css("margin-bottom") + " + " + this.$element.css("padding-top") + " + " + this.$element.css("padding-bottom") + ")";
    };
    return GtAnimationsV2;
}());
/**
 * GtAnimationsV2
 * @param params setting cua lib
 * @returns lib
 */
window.SOLID.library.gtAnimationsV2 = function (params) {
    return new GtAnimationsV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib115();
      } catch(e) {
        console.error("Error lib id: 115" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib7 = function() {
          "use strict";

/* gtProductPrice */
(function (jQuery) {
  var gtProductPrice = function (element, options) {
    var defaults = {
      classCurrentPrice: null,
      classComparePrice: null,
      syncQuantityPrice: true, // if syncQuantityPrice is true, change quantity trigger change price
      syncQuantityComparePrice: true,
      replacePriceForCurrentPrice: true,
      replacePriceForComparePrice: true,
      hideZeroPrice: false,
    };

    this.settings = {};

    var $element = jQuery(element).parent();
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);

      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
          _this.Init();
          _this.listen();
        }
      } catch (e) {
        console.log(e);
      }
    };

    this.Init = function () {
      var $currentPrice = $element.find(_this.settings.classCurrentPrice);
      var $comparePrice = $element.find(_this.settings.classComparePrice);
      var priceDefaults = $currentPrice.attr("data-currentprice");
      if (_this.settings.classCurrentPrice && _this.settings.replacePriceForCurrentPrice) {
        var price = _this.formatMoneyForSpecificPriceType(priceDefaults, "price");
        $currentPrice.html(price);
      }
      if (_this.settings.classComparePrice && _this.settings.replacePriceForComparePrice) {
        var $comparePrice = $element.find(_this.settings.classComparePrice);
        if ($comparePrice && $comparePrice.length) {
          var comparePriceDefaults = $comparePrice.attr("data-currentprice");
          var comparePrice = _this.formatMoneyForSpecificPriceType(comparePriceDefaults, "comparePrice");
          // so sanh comparePrice với price, chỉ hiển thị comparePrice khi comparePrice > price
          if (comparePrice && (!_this.settings.classCurrentPrice || parseFloat(comparePriceDefaults) > parseFloat(priceDefaults))) {
            $comparePrice.addClass("gf_active");
            $comparePrice.addClass("gt_active");
            $comparePrice.html(comparePrice);
          }
        }
      }
      if (_this.settings.hideZeroPrice) {
        if (parseFloat(priceDefaults)>0) {
          $currentPrice.show();
        } else {
          $currentPrice.hide();
          $comparePrice.hide();
        }
      }
    };

    this.listen = function () {
      var store = window.store;
      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          var price = variant.price;
          price = _this.formatMoneyForSpecificPriceType(price, "price");
          var $currentPrice = $element.find(_this.settings.classCurrentPrice);
          var $comparePrice = $element.find(_this.settings.classComparePrice);
          if (_this.settings.classCurrentPrice && _this.settings.replacePriceForCurrentPrice) {
            // Trong trường hợp khi code section/addon muốn thay đổi giá trị và ko muốn tự update lại giá theo store thì thêm class dontChangePrice vào classCurrentPrice
            // VD: Tính năng Price Display Logic = Only each trong Bundle Section 9169
            if ($currentPrice && $currentPrice.length && !$currentPrice.hasClass("dontChangePrice")) {
              $currentPrice.attr("data-currentprice", variant.price);
              $currentPrice.html(price);
            }
          }

          if (_this.settings.classComparePrice && _this.settings.replacePriceForComparePrice) {
            if ($comparePrice && $comparePrice.length) {
              if (variant.compare_at_price && variant.compare_at_price - variant.price > 0) {
                var comparePrice = variant.compare_at_price;
                comparePrice = _this.formatMoneyForSpecificPriceType(comparePrice, "comparePrice");
                $comparePrice.addClass("gf_active");
                $comparePrice.addClass("gt_active");
                $comparePrice.html(comparePrice);
                $comparePrice.attr("data-currentprice", variant.compare_at_price);
              } else {
                $comparePrice.removeClass("gf_active");
                $comparePrice.removeClass("gt_active");
              }
            }
          }

          if (_this.settings.hideZeroPrice) {
            if (parseFloat($currentPrice.attr("data-currentprice"))>0) {
              $currentPrice.show();
            } else {
              $currentPrice.hide();
              $comparePrice.hide();
            }
          }
        });

        store.change("quantity" + _productJson.id, function () {
          _this.Init();
        });
      }

      store.change("dataCurrency", function () {
        _this.Init();
      });
    };

    // Get price with quantity
    this.getPriceWithQuantity = function (price) {
      if (_productJson) {
        var quantityProduct = window.store.get("quantity" + _productJson.id);
        quantityProduct = Number(quantityProduct);
        if (!quantityProduct || isNaN(quantityProduct)) {
          quantityProduct = 1;
        }
        price = Number(price) * quantityProduct;
      }
      return price;
    };

    // Format price
    this.formatMoneyForSpecificPriceType = function (price, type) {
      if ((type === "price" && _this.settings.syncQuantityPrice) || (type === "comparePrice" && _this.settings.syncQuantityComparePrice)) {
        price = _this.getPriceWithQuantity(price);
      } else {
        price = Number(price);
      }
      var dataCurrency = window.store.get("dataCurrency");
      var format = __GemSettings.money;
      if (dataCurrency) {
        price = Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data);
      } else {
        price = Shopify.formatMoney(price, format);
      }
      return price;
    };
    this.init();
  };

  jQuery.fn.gtProductPrice = function (options) {
    return this.each(function () {
      var plugin = new gtProductPrice(this, options, jQuery);
      jQuery(this).data("gtproductprice", plugin);
    });
  };
})(jQuery);

        }
        funcLib7();
      } catch(e) {
        console.error("Error lib id: 7" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib8 = function() {
          "use strict";

/* gtProductButton */
(function (jQuery) {
  jQuery.gtProductButton = function (element, options) {
    var defaults = {
      type: null, //  null or ajax
      classText: null,
      button: null,
      TextSuccessfully: null,
      classTextSuccessfully: null,
      mode: "production",
      // loadingType: "filled" // "outlined"
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element
        .closest("[keyword='product'], [data-keyword='product']")
        .find(".ProductJson")
        .text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }
      _this.event();
      _this.listen();
    };
    this.event = function () {
      
      $element
        .find(_this.settings.classButton)
        .off("click.addtocart")
        .on("click.addtocart", addToCartHandler);

      function addToCartHandler(e) {
        var addons = window.SOLID.store.getState("addons");
        var cartDrawer;

        if (addons && addons.cart_drawer) {
          cartDrawer = addons.cart_drawer;
        }
        if (_this.settings.type == "ajax" || cartDrawer) {
          e.preventDefault();
          if (!$element.data("isBuying")) {
            var $product = $element.closest("[keyword='product'], [data-keyword='product']");
            var $buttonAddToCart = jQuery(this);
            var heightBtnAddToCart = $buttonAddToCart.outerHeight();

            $buttonAddToCart.css("position", "relative");
            $buttonAddToCart.css("height", heightBtnAddToCart + "px");
            var $loading = jQuery(
              '<div class="atom-button-loading-circle-loader"><div class="atom-button-loading-check-mark atom-button-loading-check-mark-draw"></div></div>'
            );
            var $styleLoading = jQuery("head").find("#gt_add-to-cart-animation--loading");

            if (!$styleLoading || !$styleLoading.length) {
              $styleLoading = jQuery(
                "<style type=\"text/css\" id=\"gt_add-to-cart-animation--loading\">\n" +
                ".atom-button-loading-circle-loader {\n" +
                "  position: absolute;\n" +
                "  left: calc(50% - 0.5em);\n" +
                "  top: calc(50% - 0.5em);\n" +
                "  border: 2px solid rgba(0, 0, 0, 0);\n" +
                "  border-left-color: currentColor;\n" +
                "  border-bottom-color: currentColor;\n" +
                "  animation: loader-spin 0.6s infinite linear;\n" +
                "  vertical-align: top;\n" +
                "  border-radius: 50%;\n" +
                "  width: 1em;\n" +
                "  height: 1em;\n" +
                "  border-width: calc(1em / 10);\n" +
                "}\n" +
                "\n" +
                ".load-complete {\n" +
                "  -webkit-animation: none;\n" +
                "  animation: none;\n" +
                "  border-color: currentColor;\n" +
                "  transition: border 500ms ease-out;\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark {\n" +
                "  display: none;\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark.atom-button-loading-check-mark-draw:after {\n" +
                "  animation-duration: 800ms;\n" +
                "  animation-timing-function: ease;\n" +
                "  animation-name: atom-button-loading-check-mark;\n" +
                "  transform: scaleX(-1) rotate(135deg);\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark:after {\n" +
                "  opacity: 1;\n" +
                "  transform-origin: left top;\n" +
                "  border-right: 2px solid #fff;\n" +
                "  border-top: 2px solid #fff;\n" +
                "  border-color: currentColor;\n" +
                "  content: '';\n" +
                "  position: absolute;\n" +
                "  border-width: calc(1em / 10);\n" +
                "  width: calc(1em / 4);\n" +
                "  height: calc(1em / 2);\n" +
                "  left: calc(1em / 4 - 1em / 10);\n" +
                "  top: calc(1em / 2 - 1em / 16);\n" +
                "}\n" +
                "\n" +
                "@keyframes loader-spin {\n" +
                "  0% {\n" +
                "    transform: rotate(0deg);\n" +
                "  }\n" +
                "\n" +
                "  100% {\n" +
                "    transform: rotate(360deg);\n" +
                "  }\n" +
                "}\n" +
                "\n" +
                "@keyframes atom-button-loading-check-mark {\n" +
                "  0% {\n" +
                "    height: 0px;\n" +
                "    width: 0px;\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "\n" +
                "  20% {\n" +
                "    height: 0px;\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "\n" +
                "  40% {\n" +
                "    height: calc(1em / 2);\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                " \n" +
                "  100% {\n" +
                "    height: calc(1em / 2);\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "}\n" +
                "</style>"
              );
              jQuery("head").append($styleLoading);
            }
            var $cacheButtonHtml = $buttonAddToCart.html();

            $buttonAddToCart.html($loading);
            $element.data("isBuying", true);
            var $form = $element.closest("form");

            window.gfTheme.addItemFromForm($form, function (item, form, error) {
              window.store.update("addToCart", item);
              if (error) {
                try {
                  var responseText = JSON.parse(error.responseText);

                  if (responseText && responseText.description) {
                    // eslint-disable-next-line no-alert
                    alert(responseText.description);
                  }
                } catch (e) {
                  console.log(e);
                }
                $buttonAddToCart.css("position", "");
                $buttonAddToCart.css("height", "");
                $buttonAddToCart.html($cacheButtonHtml);
                $element.data("isBuying", false);
              } else {
                if (
                  _this.settings.classTextSuccessfully &&
                  _this.settings.TextSuccessfully
                ) {
                  $product
                    .find(_this.settings.classTextSuccessfully)
                    .text(_this.settings.TextSuccessfully);
                } else {
                  var $loadingEl = $buttonAddToCart.find(
                    ".atom-button-loading-circle-loader"
                  );

                  clearTimeout(window.timeoutLoading);
                  /* display tick button */
                  $loadingEl.addClass("load-complete");
                  $loadingEl
                    .find(".atom-button-loading-check-mark")
                    .css("display", "block");
                  /* remove tick button and display text*/
                  window.timeoutLoading = setTimeout(function () {
                    $buttonAddToCart.css("position", "");
                    $buttonAddToCart.css("height", "");
                    $buttonAddToCart.html($cacheButtonHtml);
                    $element.data("isBuying", false);
                  }, 2000);
                }
                if (cartDrawer) {
                  // mo cart drawer thi cartPopup = "cart_drawer"
                  window.SOLID.store.dispatch("openCartPopup", "cart_drawer");
                }
              }
            }, true);
          }
          return false;
        }
      }
    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        var currentVariant = store.get("variant" + _productJson.id);

        if (!currentVariant.available) {
          $element.find(_this.settings.classButton).attr("disabled", true);
        } else {
          $element.find(_this.settings.classButton).attr("disabled", false);
        }

        store.change("variant" + _productJson.id, function (variant) {
          if (variant.available) {
            $element.removeClass("gf_soldout");
            $element.removeClass("gt_soldout");
            var textAddToCart = $element.attr("data-addtocart");

            if (_this.settings.classText) {
              $element.find(_this.settings.classText).html(textAddToCart);
            }

            if (_this.settings.classButton) {
              $element.find(_this.settings.classButton).attr("disabled", false);
            }
          } else {
            $element.addClass("gf_soldout");
            $element.addClass("gt_soldout");
            var text = $element.attr("data-soldout");

            if (_this.settings.classText) {
              $element.find(_this.settings.classText).html(text);
            }

            if (_this.settings.classButton && _this.settings.mode === "production") {
              $element.find(_this.settings.classButton).attr("disabled", true);
            }
          }
        });
      }
    };
    this.init();
  };

  jQuery.fn.gtProductButton = function (options) {
    return this.each(function () {
      var plugin = new jQuery.gtProductButton(this, options, jQuery);

      jQuery(this).data("gtproductbutton", plugin);
    });
  };
})(jQuery);

        }
        funcLib8();
      } catch(e) {
        console.error("Error lib id: 8" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib14 = function() {
          "use strict";

(function (jQuery) {
  var gtParallax = function (element, options) {
    // Khai bao cac tham so mac dinh trong biet *default*
    var defaults = {
      classBackgroundImage: null,
    };

    this.settings = {};
    var $element = jQuery(element);
    var _this = this;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      // Init parallax no transtion
      _this.refreshDrag();

      // Event scroll
      _this.parallaxIt();
    };
    this.parallaxIt = function () {
      var $fwindow = jQuery(window);
      var yPos = 0;
      var xPos = "50%";

      $fwindow.on("scroll.gtparallax resize.gtparallax", function () {
        _this.calcBackground(xPos, yPos);
      });
      jQuery("body").on("scroll.gtparallax resize.gtparallax", function () {
        _this.calcBackground(xPos, yPos);
      });
    };

    this.refreshDrag = function () {
      var yPos = 0;
      var xPos = "50%";
      _this.calcBackground(xPos, yPos);
    };

    this.calcBackground = function (xPos, yPos) {
      var $fwindow = jQuery(window);
      var $image = $element.find(_this.settings.classBackgroundImage);
      var speed = _this.settings.speed || 0.2;

      if ($fwindow.width() >= 992 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (speed == 1) {
          $image.css({
            backgroundPosition: xPos + " " + yPos + "vh",
            "background-attachment": "fixed",
            "-webkit-backface-visibility": "hidden",
            transition: "all 0.15s",
          });
        } else {
          $image.css({
            backgroundPosition: xPos + " " + yPos + "vh",
            "background-attachment": "fixed",
            "-webkit-backface-visibility": "hidden",
            transition: "all 0.15s",
          });
        }
      } else {
        $image.css({
          "backgroundPosition": "",
          "background-attachment": "",
          "-webkit-backface-visibility": "",
        });
      }
    };
    
    this.init();
  };

  jQuery.fn.gtParallax = function (options) {
    return this.each(function () {
      var plugin = new gtParallax(this, options);

      jQuery(this).data("gtparallax", plugin);
    });
  };
})(jQuery);

        }
        funcLib14();
      } catch(e) {
        console.error("Error lib id: 14" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib107 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductImagesV2
 */
var GtProductImagesV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params setting truyen vao thu vien
     */
    function GtProductImagesV2(params) {
        this.$element = $(params.$element);
        this.settings = __assign(__assign({}, this.settings), params.settings);
        this.init();
    }
    /**
     * init ham khoi tao thu vien
     */
    GtProductImagesV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.findElementId();
        this.clearActiveImage();
        this.initSwiperSlide();
        this.setCurrentVariant();
        this.event();
        this.listen();
    };
    GtProductImagesV2.prototype.findElementId = function () {
        var _a;
        this.elementId = this.$element.attr("data-atom-id") || ((_a = this.$element.attr("class")) === null || _a === void 0 ? void 0 : _a.replaceAll(" ", "-")) || "undefined";
    };
    /**
     * Khởi tạo thư viện swiper slide
     */
    GtProductImagesV2.prototype.initSwiperSlide = function () {
        var _this_1 = this;
        var _a, _b, _c, _d, _e, _f;
        var carousel = this.$element.find(this.settings.classSwiperContainer);
        var productImagesSwiper;
        if (carousel && carousel.length) {
            this.$carousel = carousel[0];
            if (this.$carousel.swiper) {
                this.$carousel.swiper.destroy();
            }
            var extraSwiperProductListSetting = ((_b = (_a = window.SOLID.extraSettings) === null || _a === void 0 ? void 0 : _a[this.elementId]) === null || _b === void 0 ? void 0 : _b.swiperSetting) || {};
            var swiperProductListSetting = __assign(__assign({}, this.settings.swiperSetting), extraSwiperProductListSetting);
            productImagesSwiper = new window.Swiper(this.$carousel, swiperProductListSetting);
        }
        var $featureCarousel = this.$element.find(this.settings.classFeatureSwiperContainer);
        if (this.settings.featureSwiperSetting && $featureCarousel && $featureCarousel.length) {
            if ($featureCarousel && $featureCarousel.length) {
                if (productImagesSwiper) {
                    this.settings.featureSwiperSetting.thumbs = {
                        swiper: productImagesSwiper,
                    };
                }
                var cacheEventImageReady_1 = (_d = (_c = this.settings.featureSwiperSetting) === null || _c === void 0 ? void 0 : _c.once) === null || _d === void 0 ? void 0 : _d.imagesReady;
                this.settings.featureSwiperSetting.once = {
                    imagesReady: function () {
                        if (cacheEventImageReady_1) {
                            cacheEventImageReady_1();
                        }
                        _this_1.activeProductImageByFeatureImage($featureCarousel);
                    },
                };
                this.$featureCarousel = $featureCarousel[0];
                // neu co roi thi destroy
                if (this.$featureCarousel.swiper) {
                    this.$featureCarousel.swiper.destroy();
                }
                // khoi tao swiper
                var extraSwiperFeatureSetting = ((_f = (_e = window.SOLID.extraSettings) === null || _e === void 0 ? void 0 : _e[this.elementId]) === null || _f === void 0 ? void 0 : _f.featureSwiperSetting) || {};
                var swiperFeatureSetting = __assign(__assign({}, this.settings.featureSwiperSetting), extraSwiperFeatureSetting);
                var featureSwiper = new window.Swiper(this.$featureCarousel, swiperFeatureSetting);
                // them su kien change slide cho product img swiper
                this.eventFeatureSwiper(featureSwiper, $featureCarousel);
            }
        }
        else {
            if (carousel && carousel.length) {
                var imageId = this.$element.find(this.settings.classFeatureImage).attr("data-id");
                this.activeImage(imageId);
            }
            // if(this.settings.initShowFeatureImage) {
            // }
        }
    };
    /**
     * onProductImageSlideChange: sự kiện thay đổi slide của swiper cho product imgs
     * @param swiper swiper can them su kien
     * @param $carousel carousel can them su kien
     */
    GtProductImagesV2.prototype.eventFeatureSwiper = function (swiper, $carousel) {
        var _this_1 = this;
        swiper.on("slideChangeTransitionEnd", function () {
            _this_1.activeProductImageByFeatureImage($carousel);
        });
    };
    /**
     * activeProductImageByFeatureImage: thay đổi slide active ở imageList theo feature image swiper
     * @param $carousel $featureCarousel
     */
    GtProductImagesV2.prototype.activeProductImageByFeatureImage = function ($carousel) {
        var $imageActive = $carousel.find(".swiper-slide.swiper-slide-active img");
        var imageId = $imageActive.attr("data-id");
        this.updateStoreVariantByImageID(imageId);
        this.activeImage(imageId);
    };
    /**
     * Lấy dữ liệu gtCurrentVariant ID đã được cache
     */
    GtProductImagesV2.prototype.setCurrentVariant = function () {
        var _this_1 = this;
        if (this._productJson) {
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                this._variantID = variantIDCache;
                var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
                if (storeVariant && storeVariant.id == this._variantID && storeVariant.variant_init) {
                    return;
                }
                else {
                    var variantData = this._productJson.variants.find(function (item) {
                        return Number(item.id) === Number(_this_1._variantID);
                    });
                    if (variantData) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(variantData));
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    };
    /**
     * event
     */
    GtProductImagesV2.prototype.event = function () {
        // Click to image item in slide image
        if (this.settings.classSwiperItemsImage) {
            var $carouseItemImages_1 = this.$element.find(this.settings.classSwiperItemsImage);
            var _this_2 = this;
            $carouseItemImages_1.off("click.selectImage").on("click.selectImage", function () {
                var $img = jQuery(this);
                var imageId = $img.attr("data-id");
                var imageUrl = $img.attr("src");
                $carouseItemImages_1.removeClass("gt_active");
                $img.addClass("gt_active");
                _this_2.updateFeatureImage(imageUrl, imageId);
                _this_2.updateStoreVariantByImageID(imageId);
            });
        }
        // Click to feature arrow
        if (this.settings.classFeatureArrow) {
            var $featureArrow = this.$element.find(this.settings.classFeatureArrow);
            var _this_3 = this;
            if ($featureArrow && $featureArrow.length) {
                $featureArrow.off("click.imageArrow").on("click.imageArrow", function () {
                    var isLeftArrow = $(this).hasClass("gt_product-img-nav--left");
                    var $currentActiveImage = $(_this_3.$carousel).find(".swiper-slide img.gt_active");
                    if (!$currentActiveImage || !$currentActiveImage.length) {
                        return;
                    }
                    var index = $currentActiveImage.closest(".swiper-slide").attr("aria-label").split(" / ");
                    var currentIndex = parseInt(index[0]);
                    var total = parseInt(index[1]);
                    if (isLeftArrow) {
                        currentIndex = currentIndex == 1 ? total : currentIndex - 1;
                    }
                    else {
                        currentIndex = currentIndex == total ? 1 : currentIndex + 1;
                    }
                    var newIndex = currentIndex + " / " + total;
                    var $newActiveImage = $(_this_3.$carousel).find(".swiper-slide[aria-label='" + newIndex + "'] img");
                    if ($newActiveImage && $newActiveImage.length) {
                        $newActiveImage.trigger("click");
                        _this_3.$carousel.swiper.slideTo(currentIndex - 1, 200, true);
                    }
                });
            }
        }
    };
    /**
     * listen
     */
    GtProductImagesV2.prototype.listen = function () {
        var _this_1 = this;
        var store = window.SOLID.store;
        if (this._productJson && this._productJson.id) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant &&
                    variant.variant_init &&
                    (_this_1.settings.initShowFeatureImage || _this_1.settings.initShow3DModel || _this_1.settings.initShowExVideo || _this_1.settings.initShowOtherVideo)) {
                    return;
                }
                _this_1.updateDataCacheAttr(variant.id);
                _this_1.updateImage(variant);
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductImagesV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductImagesV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * Cập nhật new variant
     * @param imageId id của image đang được active
     */
    GtProductImagesV2.prototype.updateStoreVariantByImageID = function (imageId) {
        var variants = [];
        if (this._productJson) {
            try {
                variants = this._productJson.variants;
            }
            catch (e) {
                console.log(e);
            }
        }
        if (variants.length) {
            var beforeActiveVariant_1 = window.SOLID.store.getState("variant" + this._productJson.id);
            // check variant hiện tại có feature image là imageid cần check hay không
            var beforeVariantHasImageId = variants.find(function (item) { var _a, _b; return String(item.id) === String(beforeActiveVariant_1 === null || beforeActiveVariant_1 === void 0 ? void 0 : beforeActiveVariant_1.id) && (((_a = item === null || item === void 0 ? void 0 : item.featured_media) === null || _a === void 0 ? void 0 : _a.id) == imageId || ((_b = item === null || item === void 0 ? void 0 : item.featured_image) === null || _b === void 0 ? void 0 : _b.id) == imageId); });
            if (beforeVariantHasImageId) {
                return;
            }
            // find variant with image id
            var currentVariant = variants.find(function (item) { return item.featured_image && item.featured_image.id && item.featured_image.id == imageId; });
            if (!currentVariant) {
                // nếu không tìm thấy theo imageId thì tìm theo mediaId
                currentVariant = variants.find(function (item) { return item.featured_media && item.featured_media.id == imageId; });
            }
            if (String(currentVariant === null || currentVariant === void 0 ? void 0 : currentVariant.id) === String(beforeActiveVariant_1 === null || beforeActiveVariant_1 === void 0 ? void 0 : beforeActiveVariant_1.id)) {
                return;
            }
            if (currentVariant) {
                window.SOLID.store.dispatch("variant" + this._productJson.id, currentVariant);
            }
        }
    };
    /**
     * Cập nhật ảnh của feature image theo ảnh đang được active trong slider image
     * @param url link ảnh đang được active trong slide images
     * @param imageId id cua feature image active
     * @param mediaId id cua feature media active
     */
    GtProductImagesV2.prototype.updateFeatureImage = function (url, imageId, mediaId) {
        if (!this.settings.featureSwiperSetting) {
            url = this.replaceImageToSize(url, "");
            if (this.settings.classFeatureImage) {
                this.$element.find(this.settings.classFeatureImage).attr("src", url);
            }
        }
        else {
            var $carouselFeatureImages = this.$element.find(this.settings.classFeatureSwiperItemsImage);
            var $carouselFeatureImageActive = this.$element.find(this.settings.classFeatureSwiperItemsImage + "[data-id=\"" + imageId + "\"]");
            if ($carouselFeatureImages && $carouselFeatureImageActive && $carouselFeatureImages.length && $carouselFeatureImageActive.length) {
                var indexActive = $carouselFeatureImages.index($carouselFeatureImageActive);
                this.$featureCarousel.swiper.slideTo(indexActive, 200, true);
            }
            else {
                // nếu không tìm thấy imageId thì tìm theo mediaId
                var $carouselFeatureMediaActive = this.$element.find(this.settings.classFeatureSwiperItemsImage + "[data-id=\"" + mediaId + "\"]");
                if ($carouselFeatureImages && $carouselFeatureMediaActive && $carouselFeatureImages.length && $carouselFeatureMediaActive.length) {
                    var indexActive = $carouselFeatureImages.index($carouselFeatureMediaActive);
                    this.$featureCarousel.swiper.slideTo(indexActive, 200, true);
                }
            }
        }
    };
    /**
     * Cập nhật lại trạng thái active của slide và feature image với variant tương ứng
     * @param variant dữ liệu của variant đang select
     */
    GtProductImagesV2.prototype.updateImage = function (variant) {
        var _a, _b;
        if (!this._productJson)
            return;
        if (!variant)
            variant = window.SOLID.store.getState("variant" + this._productJson.id);
        if (!variant || !variant.featured_image || !variant.featured_image.src || !this.settings.classSwiperItemsImage) {
            return;
        }
        this.updateFeatureImage(variant.featured_image.src, variant.featured_image.id, (_a = variant.featured_media) === null || _a === void 0 ? void 0 : _a.id);
        this.activeImage(variant.featured_image.id, (_b = variant.featured_media) === null || _b === void 0 ? void 0 : _b.id);
    };
    /**
     * active and scroll to image active
     * @param imageId  featured_image id current variant selected
     * @param mediaId  featured_media id current variant selected
     */
    GtProductImagesV2.prototype.activeImage = function (imageId, mediaId) {
        var $carouselImages = this.$element.find(this.settings.classSwiperItemsImage);
        var _this = this;
        var isFindActiveImage = false;
        $carouselImages.each(function (index) {
            $(this).removeClass("gt_active");
            $(this).removeClass("gf_active");
            var id = $(this).attr("data-id");
            if (id == imageId && _this.settings.swiperSetting) {
                _this.$carousel.swiper.slideTo(index, 200, true);
                $(this).addClass("gt_active");
                $(this).addClass("gf_active");
                isFindActiveImage = true;
            }
        });
        // support với media nếu không tìm thấy imageId
        if (!isFindActiveImage) {
            $carouselImages.each(function (index) {
                $(this).removeClass("gt_active");
                $(this).removeClass("gf_active");
                var id = $(this).attr("data-id");
                if (id == mediaId && _this.settings.swiperSetting) {
                    _this.$carousel.swiper.slideTo(index, 200, true);
                    $(this).addClass("gt_active");
                    $(this).addClass("gf_active");
                }
            });
        }
    };
    /**
     * clearActiveImage
     */
    GtProductImagesV2.prototype.clearActiveImage = function () {
        var $carouselImages = this.$element.find(this.settings.classSwiperItemsImage);
        $carouselImages.each(function () {
            $(this).removeClass("gt_active");
            $(this).removeClass("gf_active");
        });
    };
    /**
     * Kiểm tra xem có phải link ảnh trên shopify app hay ko
     * @param url link ảnh
     * @returns true or false
     */
    GtProductImagesV2.prototype.hasImageShopify = function (url) {
        if (!url || url == "") {
            return false;
        }
        if (url.indexOf("cdn.shopify.com/s/files/") != -1) {
            return true;
        }
        else if (url.indexOf("apps.shopifycdn.com/") != -1) {
            return true;
        }
        return false;
    };
    /**
     * replaceImageToSize
     * @param url link image
     * @param expectImageSize expectImageSize
     * @returns string
     */
    GtProductImagesV2.prototype.replaceImageToSize = function (url, expectImageSize) {
        if (expectImageSize == undefined || expectImageSize == null) {
            return url;
        }
        if (this.hasImageShopify(url)) {
            var ignore = ["jfif"];
            var params = "";
            var splitParams = url.split("?");
            if (splitParams && splitParams.length && splitParams.length >= 2) {
                params = splitParams[1];
            }
            var arrImage = splitParams[0].split("/").pop();
            var slugName = arrImage.split(".");
            var strExtention = slugName.pop();
            if (ignore.indexOf(strExtention) !== -1) {
                return url;
            }
            var nameImage = slugName.join(".");
            var arrayNames = nameImage.split("_");
            if (arrayNames && arrayNames.length >= 2) {
                var sizeCurrent = arrayNames.pop();
                var reg = new RegExp(/(\d+)x(\d+)|(\d+)x|x(\d+)/, "gm");
                if (sizeCurrent && reg.test(sizeCurrent)) {
                    var trimReg = sizeCurrent.replace(reg, "");
                    if (trimReg == "") {
                        var nameImages = nameImage.split("_");
                        nameImages.pop();
                        nameImage = nameImages.join("_");
                    }
                }
            }
            var srcImageSplit = url.split("?")[0].split("/");
            var smallSrc = "";
            for (var j = 0; j < srcImageSplit.length - 1; j++) {
                smallSrc += srcImageSplit[j] + "/";
            }
            if (expectImageSize) {
                url = smallSrc + nameImage + "_" + expectImageSize + "." + strExtention;
            }
            else {
                url = smallSrc + nameImage + "." + strExtention;
            }
            if (params) {
                url = url + "?" + params;
            }
        }
        return url;
    };
    return GtProductImagesV2;
}());
/**
 * gtProductImagesV2
 * @param params setting lib product gtProductImagesV2
 * @returns gtProductImagesV2
 */
window.SOLID.library.gtProductImagesV2 = function (params) {
    return new GtProductImagesV2(params);
};
exports.default = {};


/***/ })

/******/ });
});

        }
        funcLib107();
      } catch(e) {
        console.error("Error lib id: 107" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib105 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductSwatchesV2
 */
var GtProductSwatchesV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params settings class and element
     */
    function GtProductSwatchesV2(params) {
        this.$element = $(params.$element);
        this.classCurrentValue = params.settings.classCurrentValue;
        this.classItem = params.settings.classItem;
        this.classInputIdHidden = params.settings.classInputIdHidden;
        this.classBtnSelect = params.settings.classBtnSelect;
        this.classCurrentStatus = params.settings.classCurrentStatus;
        this.classVariantValueInTitle = params.settings.classVariantValueInTitle;
        this.init();
    }
    /* private methods */
    /**
     * init: function khoi tao lib
     */
    GtProductSwatchesV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.setCurrentVariant();
        this.event();
        this.listen();
    };
    /**
     * setInitVariant: tim ra variant dang active
     */
    GtProductSwatchesV2.prototype.setCurrentVariant = function () {
        if (this._productJson) {
            var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
            if (storeVariant && storeVariant.variant_init) {
                window.SOLID.store.dispatch("variant" + this._productJson.id, storeVariant);
                return;
            }
            // const $productJson = this.$element.closest("[keyword='product']").find(".ProductJson");
            // if ($productJson && $productJson.length) {
            // const variantID: number = parseInt($productJson.attr("data-variant"));
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                for (var i = 0; i < this._productJson.variants.length; i++) {
                    var currentVariant = this._productJson.variants[i];
                    if (currentVariant.id == variantIDCache) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(currentVariant));
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                        break;
                    }
                }
            }
            // }
        }
    };
    /**
     * event: thêm sự kiện click cho các variants
     */
    GtProductSwatchesV2.prototype.event = function () {
        if (this._productJson) {
            try {
                var variants_1 = this._productJson.variants;
                var $select = this.$element.find(this.classBtnSelect);
                var _this_1 = this;
                $select.off("click.select").on("click.select", function () {
                    var $el = jQuery(this);
                    if (!$el.hasClass("gt_soldout")) {
                        var name_1 = $el.attr("data-name");
                        // Update active
                        var $selector = _this_1.$element.find(_this_1.classBtnSelect + "[data-name=\"" + name_1 + "\"]");
                        if ($selector && $selector.length) {
                            $selector.removeClass("gf_active");
                            $selector.removeClass("gt_active");
                        }
                        $el.addClass("gf_active");
                        $el.addClass("gt_active");
                        var $actives = _this_1.$element.find(_this_1.classBtnSelect + ".gf_active," + _this_1.classBtnSelect + ".gt_active");
                        var values = [];
                        var i = void 0;
                        if ($actives && $actives.length) {
                            for (i = 0; i < $actives.length; i++) {
                                var activeValue = jQuery($actives[i]).attr("data-value");
                                if (activeValue) {
                                    values.push(activeValue);
                                }
                            }
                        }
                        var currentVariant = {};
                        if (values && values.length) {
                            for (i = 0; i < variants_1.length; i++) {
                                var variant = variants_1[i];
                                var options = variant.options; // => []
                                // console.log(options, " vs ", values)
                                if (_this_1.compare(values, options)) {
                                    currentVariant = variant;
                                    break;
                                }
                            }
                        }
                        if (!jQuery.isEmptyObject(currentVariant)) {
                            window.SOLID.store.dispatch("variant" + _this_1._productJson.id, currentVariant);
                        }
                        else {
                            // Sản phẩm không được định nghĩa
                            window.SOLID.store.dispatch("variant" + _this_1._productJson.id, {
                                id: 0,
                                available: false,
                            });
                        }
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    /**
     * listen: lắng nghe khi có variant active thay đổi
     */
    GtProductSwatchesV2.prototype.listen = function () {
        var _this_1 = this;
        var store = window.SOLID.store;
        if (this._productJson) {
            var options_1 = this._productJson.options;
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant && variant.variant_init) {
                    return;
                }
                _this_1.updateDataCacheAttr(variant.id);
                var $product = _this_1.$element.closest("[keyword='product'], [data-keyword='product']");
                var $currentStatus = $product.find(_this_1.classCurrentStatus);
                if ($currentStatus && $currentStatus.length) {
                    if (!variant.available) {
                        $currentStatus.show();
                        var labelSoldOut = $currentStatus.attr("data-sold-out") || "Sold Out";
                        $currentStatus.addClass(_this_1.classCurrentStatus.replace(".", "") + "--inner");
                        $currentStatus.html(labelSoldOut);
                    }
                    else {
                        $currentStatus.addClass(_this_1.classCurrentStatus.replace(".", "") + "--inner");
                        $currentStatus.hide();
                    }
                }
                if (variant.options && variant.options.length) {
                    for (var i = 0; i < variant.options.length; i++) {
                        var option = variant["option" + (i + 1)];
                        if (option) {
                            var name_2 = void 0;
                            if (options_1[i]) {
                                name_2 = options_1[i];
                            }
                            if (!name_2 || jQuery.isPlainObject(name_2)) {
                                name_2 = options_1[i].name;
                            }
                            var $item = _this_1.$element.find(_this_1.classItem + "[data-name=\"" + name_2 + "\"]");
                            if ($item && $item.length) {
                                var $titleValue = $item.find(_this_1.classVariantValueInTitle);
                                $titleValue.html(option);
                                var $select = $item.find(_this_1.classBtnSelect);
                                var $selectActive = $item.find(_this_1.classBtnSelect + "[data-value=\"" + option.replace(/"/g, "\\\"") + "\"]");
                                if (_this_1.classCurrentValue) {
                                    var $currentValue = $item.find(_this_1.classCurrentValue);
                                    if ($currentValue && $currentValue.length) {
                                        var $contentSelectActive = $selectActive.html();
                                        $currentValue.html($contentSelectActive);
                                        $currentValue.attr("data-value", option);
                                    }
                                }
                                if ($select && $select.length && $selectActive && $selectActive.length) {
                                    $select.removeClass("gf_active");
                                    $select.removeClass("gt_active");
                                    $selectActive.addClass("gf_active");
                                    $selectActive.addClass("gt_active");
                                }
                            }
                        }
                    }
                }
                if (!jQuery.isEmptyObject(variant)) {
                    if ($product && $product.length) {
                        var $input = $product.find(_this_1.classInputIdHidden);
                        if ($input && $input.length) {
                            $input.attr("value", variant.id).val(variant.id);
                            var currentURL = window.location.href;
                            var variantURL = _this_1.updateUrlParameter(currentURL, "variant", variant.id);
                            window.history.replaceState({}, "", variantURL);
                        }
                    }
                }
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductSwatchesV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductSwatchesV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * compare: compare 2 array
     * @param array array1
     * @param array2 array 2
     * @returns boolean
     */
    GtProductSwatchesV2.prototype.compare = function (array, array2) {
        array.sort();
        array2.sort();
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array2.length; j++) {
                var val1 = array[j];
                var val2 = array2[j];
                val1 = val1.replace(/"/gm, "'");
                val2 = val2.replace(/"/gm, "'");
                if (val1 != val2) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * updateUrlParameter: update params
     * @param url current url window.location.href
     * @param key "variant"
     * @param value variant id
     * @returns string
     */
    GtProductSwatchesV2.prototype.updateUrlParameter = function (url, key, value) {
        var parser = document.createElement("a");
        parser.href = url;
        var newUrl = parser.protocol + "//" + parser.host + parser.pathname;
        // has parameters ?
        if (parser.search && parser.search.indexOf("?") !== -1) {
            // parameter already exists
            if (parser.search.indexOf(key + "=") !== -1) {
                // paramters to array
                var params_1 = parser.search.replace("?", "");
                params_1 = params_1.split("&");
                params_1.forEach(function (param, i) {
                    if (param.indexOf(key + "=") !== -1) {
                        if (value !== null) {
                            params_1[i] = key + "=" + value;
                        }
                        else {
                            delete params_1[i];
                        }
                    }
                });
                if (params_1.length > 0) {
                    newUrl += "?" + params_1.join("&");
                }
            }
            else if (value !== null) {
                newUrl += parser.search + "&" + key + "=" + value;
            }
            else {
                newUrl += parser.search;
            } // skip the value (remove)
        }
        else if (value !== null) {
            newUrl += "?" + key + "=" + value;
        } // no parameters, create it
        newUrl += parser.hash;
        return newUrl;
    };
    return GtProductSwatchesV2;
}());
/**
 * gtProductSwatchesV2
 * @param params setting lib product swatches
 * @returns gtProductSwatchesV2
 */
window.SOLID.library.gtProductSwatchesV2 = function (params) {
    return new GtProductSwatchesV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib105();
      } catch(e) {
        console.error("Error lib id: 105" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib106 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductQuantityV2
 */
var GtProductQuantityV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params settings class and element
     */
    function GtProductQuantityV2(params) {
        this.$element = $(params.$element);
        this.classInput = params.settings.classInput;
        this.classPlus = params.settings.classPlus;
        this.classMinus = params.settings.classMinus;
        this.mode = params.settings.mode || "production";
        this.init();
    }
    /* private methods */
    /**
     * init: function khoi tao lib
     */
    GtProductQuantityV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.event();
        this.listen();
    };
    /**
     * event: thêm sự kiện click cho các variants
     */
    GtProductQuantityV2.prototype.event = function () {
        var _this = this;
        if (this._productJson) {
            if (this.classMinus) {
                this.$element
                    .find(this.classMinus)
                    .off("click.minus")
                    .on("click.minus", function () {
                    if (!_this.$element.hasClass("gt_soldout")) {
                        var value = _this.$element.find(_this.classInput).val();
                        value = parseInt(value) - 1;
                        if (value <= 1) {
                            value = 1;
                        }
                        _this.$element.find(_this.classInput).attr("value", value).val(value);
                        window.SOLID.store.dispatch("quantity" + _this._productJson.id, value);
                    }
                });
            }
            if (this.classPlus) {
                this.$element
                    .find(this.classPlus)
                    .off("click.plus")
                    .on("click.plus", function () {
                    if (!_this.$element.hasClass("gt_soldout")) {
                        var value = _this.$element.find(_this.classInput).val();
                        value = parseInt(value) + 1;
                        if (value <= 1) {
                            value = 1;
                        }
                        _this.$element.find(_this.classInput).attr("value", value).val(value);
                        window.SOLID.store.dispatch("quantity" + _this._productJson.id, value);
                    }
                });
            }
            if (this.classInput) {
                var $input = this.$element.find(this.classInput);
                if (this.mode !== "production") {
                    var quantityStore = window.SOLID.store.getState("quantity" + this._productJson.id) || 1;
                    $input.val(quantityStore);
                }
                $input.off("change.inputQuantity").on("change.inputQuantity", function (e) {
                    var $target = $(e.currentTarget);
                    var quantity = $target.val();
                    if (quantity == 0) {
                        $target.val(1);
                        quantity = 1;
                    }
                    window.SOLID.store.dispatch("quantity" + _this._productJson.id, quantity);
                });
            }
        }
    };
    /**
     * listen: lắng nghe khi có variant active thay đổi
     */
    GtProductQuantityV2.prototype.listen = function () {
        var _this = this;
        var store = window.SOLID.store;
        if (this._productJson) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                _this.updateDataCacheAttr(variant.id);
                if (variant.available) {
                    _this.$element.removeClass("gf_soldout");
                    _this.$element.removeClass("gt_soldout");
                    if (_this.classInput) {
                        _this.$element.find(_this.classInput).removeAttr("disabled");
                    }
                }
                else {
                    // Nếu là soldout update quantity về 1 và disable input thay đổi quantity
                    _this.$element.addClass("gf_soldout");
                    _this.$element.addClass("gt_soldout");
                    window.SOLID.store.dispatch("quantity" + _this._productJson.id, 1);
                    if (_this.classInput) {
                        jQuery(_this.classInput).attr("value", 1).val(1);
                        _this.$element.find(_this.classInput).attr("disabled", "disabled");
                    }
                }
            });
            store.subscribe("quantity" + this._productJson.id, function (quantity) {
                _this.$element.find(_this.classInput).attr("value", quantity).val(quantity);
            });
        }
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductQuantityV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    return GtProductQuantityV2;
}());
/**
 * gtProductQuantity
 * @param params setting lib product quantity
 * @returns gtProductQuantity
 */
window.SOLID.library.gtProductQuantityV2 = function (params) {
    return new GtProductQuantityV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib106();
      } catch(e) {
        console.error("Error lib id: 106" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib108 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductSaveV2
 */
var GtProductSaveV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params setting truyen vao thu vien
     */
    function GtProductSaveV2(params) {
        this.$element = $(params.$element);
        this.settings = {
            roundNoZeroes: false,
            roundPercent: 0,
            classTextPercent: "",
            classTextNumber: "",
            dataFormat: "",
            dataFormatKey: "",
            customCurrencyFormat: "",
        };
        this.settings = __assign(__assign({}, this.settings), params.settings);
        this.init();
    }
    /**
     * init ham khoi tao thu vien
     */
    GtProductSaveV2.prototype.init = function () {
        var productJson = this.$element
            .closest("[keyword='product'], [data-keyword='product']")
            .find(".ProductJson")
            .text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.setCurrentVariant();
        this.listen();
    };
    /**
     * Lấy dữ liệu gtCurrentVariant ID đã được cache
     */
    GtProductSaveV2.prototype.setCurrentVariant = function () {
        var _this = this;
        if (this._productJson) {
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                this._variantID = Number(variantIDCache);
                var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
                if (storeVariant &&
                    storeVariant.id == this._variantID &&
                    storeVariant.variant_init) {
                    this.setPriceWithVariant(storeVariant);
                    return;
                }
                else {
                    var variantData = this._productJson.variants.find(function (item) { return item.id === _this._variantID; });
                    if (variantData) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(variantData));
                            this.setPriceWithVariant(newVariant);
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    };
    /**
     * listen
     */
    GtProductSaveV2.prototype.listen = function () {
        var _this = this;
        var store = window.SOLID.store;
        if (this._productJson && this._productJson.id) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant && variant.variant_init) {
                    return;
                }
                _this.updateDataCacheAttr(variant.id);
                _this.setPriceWithVariant(variant);
            });
            store.subscribe("quantity" + this._productJson.id, function () {
                var variant = window.store.get("variant" + _this._productJson.id);
                if (variant && variant.id) {
                    _this.setPriceWithVariant(variant);
                }
            });
            store.subscribe("dataCurrency", function () {
                var variant = window.store.get("variant" + _this._productJson.id);
                if (variant && variant.id) {
                    _this.setPriceWithVariant(variant);
                }
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductSaveV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductSaveV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * setPriceWithVariant
     * @param variant variant
     */
    GtProductSaveV2.prototype.setPriceWithVariant = function (variant) {
        if (variant.compare_at_price &&
            variant.price &&
            variant.compare_at_price > variant.price) {
            this.$element.addClass("gt_active");
            // Giá giảm theo %
            if (this.settings.classTextPercent) {
                var $number = this.$element.find(this.settings.classTextPercent);
                var number = this.getPercentDiscount(variant.price, variant.compare_at_price);
                $number.html(number);
            }
            // Giá giảm theo sổ tiền
            if (this.settings.classTextNumber) {
                var $price = this.$element.find(this.settings.classTextNumber);
                var diff = variant.compare_at_price - variant.price;
                var diffFormat = this.formatMoneyPlugin(diff);
                $price.html(diffFormat);
            }
        }
        else {
            this.$element.removeClass("gt_active");
        }
    };
    /**
     * Format Money
     * @param price price
     * @returns Format Money
     */
    GtProductSaveV2.prototype.formatMoneyPlugin = function (price) {
        price = this.getPriceWithQuantity(price);
        var dataCurrency = window.store.get("dataCurrency");
        var format = window.__GemSettings.money;
        var priceFormat = price.toString();
        if (!dataCurrency) {
            // default shopify format
            priceFormat = window.Shopify.formatMoney(price, format);
        }
        else {
            // ES addon auto currency converter
            var notApplyRoundDecimal = true; // no apply round decimal for save money
            priceFormat = window.Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data, this.settings.customCurrencyFormat, notApplyRoundDecimal);
        }
        if (this.settings.dataFormat && this.settings.dataFormatKey) {
            priceFormat = this.settings.dataFormat.replace(this.settings.dataFormatKey, priceFormat);
        }
        return priceFormat;
    };
    /**
     * getPriceWithQuantity
     * @param price price
     * @returns price
     */
    GtProductSaveV2.prototype.getPriceWithQuantity = function (price) {
        if (this._productJson) {
            var quantityProduct = window.store.get("quantity" + this._productJson.id);
            quantityProduct = Number(quantityProduct);
            if (!quantityProduct || isNaN(quantityProduct)) {
                quantityProduct = 1;
            }
            price = Number(price) * quantityProduct;
        }
        return price;
    };
    /**
     * trả về phần trăm giảm giá
     * @param price giá bán
     * @param comparePrice giá gốc
     * @returns trăm giảm giá
     */
    GtProductSaveV2.prototype.getPercentDiscount = function (price, comparePrice) {
        var diff = comparePrice - price;
        diff = diff / comparePrice;
        diff = diff * 100;
        var diffString = diff.toString();
        if (this.settings.roundNoZeroes) {
            diffString = this.roundTo(diff, this.settings.roundPercent);
        }
        else {
            diffString = diff.toFixed(this.settings.roundPercent);
        }
        diffString += "%";
        if (this.settings.dataFormat && this.settings.dataFormatKey) {
            diffString = this.settings.dataFormat.replace(this.settings.dataFormatKey, diffString);
        }
        return diffString;
    };
    /**
     * Làm tròn số tới hàng thập phân thứ n bỏ O ở cuối string nếu có
     * @param n giá trị cần làm tròn
     * @param digits Làm tròn số tới hàng thập phân thứ
     * @returns string
     */
    GtProductSaveV2.prototype.roundTo = function (n, digits) {
        if (digits === undefined) {
            digits = 0;
        }
        var multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        var test = Math.round(n) / multiplicator;
        return test.toFixed(digits);
    };
    return GtProductSaveV2;
}());
/**
 * gtProductSaveV2
 * @param params setting lib product gtProductSaveV2
 * @returns gtProductSaveV2
 */
window.SOLID.library.gtProductSaveV2 = function (params) {
    return new GtProductSaveV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib108();
      } catch(e) {
        console.error("Error lib id: 108" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib17 = function() {
          "use strict";
/* gfProductZoomImage */
(function (jQuery) {
  var GfProductZoomImage = function (element, options, $) {
    var defaults = {
      classHoverItem: null,
      scale: 1.5,
      htmlZoom: '<div class="gt_product-zoom"></div>',
      classSection: null,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _url;
    var _$html;

    this.init = function () {
      const checkDevice = _this.getDeviceType();
      if (checkDevice !== "desktop") {
        return;
      }
      this.settings = jQuery.extend({}, defaults, options);
      var $itemHover = $element.closest(_this.settings.classHoverItem);

      if ($itemHover && $itemHover.length > 0) {
        var classElement = $itemHover.attr("class");
        // gt_product-image--feature gt_product-image
        var res = classElement.split(" ");

        if (_this.settings.classSection != null) {
          var cssClassName = "css-" + _this.settings.classSection;
          var css = '<style type="text/css" class="' + cssClassName + '">';

          css += _this.settings.classSection + " ." + res.join(".") + "{position:relative;overflow:hidden}";
          css += _this.settings.classSection + " .gt_product-img-box div.gt_product-zoom{display: none;position:absolute;top:0;left:0;width:100%;height:100%;background-color: #fff;background-repeat:no-repeat;background-position:center;background-size:cover;transition:transform .5s ease-out}";
          css += "</style>";
          if (!jQuery(cssClassName) || jQuery(cssClassName).length == 0) {
            jQuery("body").append(css);
          }
        }

        var $html = jQuery(_this.settings.htmlZoom);

        _$html = $html;
        if (!$itemHover.find(".gt_product-zoom") || $itemHover.find(".gt_product-zoom").length == 0) {
          $itemHover.append(_$html);
        }

        _this.event();
      }
    };

    this.event = function () {
      $element.closest(_this.settings.classHoverItem)
        .on("mouseover", function () {
          if (_this.settings.scale !== 1) {
            _url = $element.attr("src");
            _$html.css({
              display: "block", 
              "width": "100%",
              "height": "100%",
              "top": "0%",
              "left": "0%",
              "z-index": "9",
              "background-repeat": "no-repeat",
              "background-color": "#fff",
              "background-position": "center",
              "background-size": "cover",
              "transition": "transform .5s ease-out",
              "position": "absolute",
              "background-image": "url(" + _url + ")",
              transform: "scale(" + _this.settings.scale + ")",
            });
            $element.css("opacity", 0);
          }
        })
        .on("mouseout", function () {
          if (_this.settings.scale !== 1) {
            _$html.css({
              transform: "scale(1)",
              display: "none",
              "z-index": "-1",
            });
            $element.css("opacity", 1);
          }
        })
        .on("mousemove", function (e) {
          if (_this.settings.scale !== 1) {
            var $this = $(this);

            _$html.css({
              "transform-origin": ((e.pageX - $this.offset().left) / $this.width()) * 100 + "% " + ((e.pageY - $this.offset().top) / $this.height()) * 100 + "%",
              display: "block",
            });
            $element.css("opacity", 0);
          }
        });
    };

    this.getDeviceType = function() {
      var userAgent = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        return "tablet";
      }
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|OperaM(obi|ini)/.test(userAgent)) {
        return "mobile";
      }
      return "desktop";
    }

    this.init();
  };

  jQuery.fn.gfProductZoomImage = function (options) {
    return this.each(function () {
      if (undefined == jQuery(this).data("gfproductZoomImage")) {
        var plugin = new GfProductZoomImage(this, options, jQuery);

        jQuery(this).data("gfproductzoomimage", plugin);
      }
    });
  };
})(jQuery);

        }
        funcLib17();
      } catch(e) {
        console.error("Error lib id: 17" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionYyLSNZWgbKYoVQl = function() {
          
        }
        funcESSectionYyLSNZWgbKYoVQl()
      } catch(e) {
        console.error("Error ESSection Id: YyLSNZWgbKYoVQl" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureList = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureList";
  var id = "YyLSNZWgbKYoVQl_featureList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureList()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_headingText";
  var id = "YyLSNZWgbKYoVQl_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_messageText";
  var id = "YyLSNZWgbKYoVQl_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureItems = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureItems";
  var id = "YyLSNZWgbKYoVQl_featureItems";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureItems",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureItems()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureItems" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureItem_0";
  var id = "YyLSNZWgbKYoVQl_featureItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureIcon_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureIcon_0";
  var id = "YyLSNZWgbKYoVQl_featureIcon_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureIcon_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureIcon_0()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureIcon_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_titleContent_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_titleContent_0";
  var id = "YyLSNZWgbKYoVQl_titleContent_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_titleContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_titleContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_titleContent_0()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_titleContent_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_messageContent_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_messageContent_0";
  var id = "YyLSNZWgbKYoVQl_messageContent_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_messageContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_messageContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_messageContent_0()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_messageContent_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_lineBorder_0 = function() {
          
        }
        funcESAtomYyLSNZWgbKYoVQl_lineBorder_0()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_lineBorder_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureItem_1";
  var id = "YyLSNZWgbKYoVQl_featureItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureIcon_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureIcon_1";
  var id = "YyLSNZWgbKYoVQl_featureIcon_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureIcon_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureIcon_1()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureIcon_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_titleContent_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_titleContent_1";
  var id = "YyLSNZWgbKYoVQl_titleContent_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_titleContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_titleContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_titleContent_1()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_titleContent_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_messageContent_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_messageContent_1";
  var id = "YyLSNZWgbKYoVQl_messageContent_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_messageContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_messageContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_messageContent_1()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_messageContent_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_lineBorder_1 = function() {
          
        }
        funcESAtomYyLSNZWgbKYoVQl_lineBorder_1()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_lineBorder_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureItem_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureItem_2";
  var id = "YyLSNZWgbKYoVQl_featureItem_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureItem_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureItem_2()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureItem_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureIcon_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureIcon_2";
  var id = "YyLSNZWgbKYoVQl_featureIcon_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureIcon_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureIcon_2()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureIcon_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_titleContent_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_titleContent_2";
  var id = "YyLSNZWgbKYoVQl_titleContent_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_titleContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_titleContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_titleContent_2()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_titleContent_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_messageContent_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_messageContent_2";
  var id = "YyLSNZWgbKYoVQl_messageContent_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_messageContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_messageContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_messageContent_2()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_messageContent_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_lineBorder_2 = function() {
          
        }
        funcESAtomYyLSNZWgbKYoVQl_lineBorder_2()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_lineBorder_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureItem_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureItem_3";
  var id = "YyLSNZWgbKYoVQl_featureItem_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureItem_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureItem_3()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureItem_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_featureIcon_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_featureIcon_3";
  var id = "YyLSNZWgbKYoVQl_featureIcon_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "YyLSNZWgbKYoVQl_featureIcon_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_featureIcon_3()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_featureIcon_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_titleContent_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_titleContent_3";
  var id = "YyLSNZWgbKYoVQl_titleContent_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_titleContent_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_titleContent_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_titleContent_3()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_titleContent_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_messageContent_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-YyLSNZWgbKYoVQl_messageContent_3";
  var id = "YyLSNZWgbKYoVQl_messageContent_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "YyLSNZWgbKYoVQl_messageContent_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "YyLSNZWgbKYoVQl_messageContent_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomYyLSNZWgbKYoVQl_messageContent_3()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_messageContent_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomYyLSNZWgbKYoVQl_lineBorder_3 = function() {
          
        }
        funcESAtomYyLSNZWgbKYoVQl_lineBorder_3()
      } catch(e) {
        console.error("Error ESAtom Id: YyLSNZWgbKYoVQl_lineBorder_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionz3QcP3YRmTgMvxo = function() {
          (function() {
  var elementClassName = ".gt_section-z3QcP3YRmTgMvxo";
  var id = "z3QcP3YRmTgMvxo";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    /* store get state block script */
    /* methods block script */
    function triggerRenderAtom() {
      $(".gt_faq--question").off("click").on("click", faqAccordion);
    }

    function faqAccordion() {
      var $itemThis = $(this);
      var $subFaq = $itemThis.siblings();
      if ($subFaq.length > 0) {
        var time = 0.3;
        if ($itemThis.hasClass("gt_active")) {
          var animationIns = window.SOLID.library.gtAnimationsV2({
            $element: $subFaq[0],
            settings: {
              duration: time,
            },
          });
          animationIns.slideUp(function() {
            $itemThis.removeClass("gt_active");
            $subFaq.removeClass("gt_active-ans");
          });
        } else {
          var $itemActive = $element.find(".gt_faq--question.gt_active");
          if ($itemActive && $itemActive.length) {
            for (let i = 0; i < $itemActive.length; i++) {
              var $faqAnswersActive = $($itemActive[i]).siblings();
              var animationInsOther = window.SOLID.library.gtAnimationsV2({
                $element: $faqAnswersActive[0],
                settings: {
                  duration: time,
                },
              });
              animationInsOther.slideUp(function() {
                $($itemActive[i]).removeClass("gt_active");
                $faqAnswersActive.removeClass("gt_active-ans");
              });
            }
          }
          $itemThis.addClass("gt_active");
          $subFaq.addClass("gt_active-ans");
          var animationInsActive = window.SOLID.library.gtAnimationsV2({
            $element: $subFaq[0],
            settings: {
              duration: time,
            },
          });
          animationInsActive.slideDown();
        }
      }
    }
    /* init block script */
    /* store subscribe block script */
    store.subscribe("render-html-z3QcP3YRmTgMvxo-faqListItem", triggerRenderAtom);

    function destroy() {
      store.unsubscribe("render-html-z3QcP3YRmTgMvxo-faqListItem", triggerRenderAtom);
    }
    /* events block script */
    var $elements_1 = $element.find(".gt_faq--question");
    $elements_1.off("click").on("click", faqAccordion);
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESSectionz3QcP3YRmTgMvxo()
      } catch(e) {
        console.error("Error ESSection Id: z3QcP3YRmTgMvxo" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_boxFaq = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_boxFaq";
  var id = "z3QcP3YRmTgMvxo_boxFaq";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_boxFaq",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_boxFaq()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_boxFaq" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_titlePc = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_titlePc";
  var id = "z3QcP3YRmTgMvxo_titlePc";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_titlePc",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_titlePc",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_titlePc()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_titlePc" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_contentFaq = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_contentFaq";
  var id = "z3QcP3YRmTgMvxo_contentFaq";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_contentFaq",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_contentFaq()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_contentFaq" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_boxImage = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_boxImage";
  var id = "z3QcP3YRmTgMvxo_boxImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_boxImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_boxImage()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_boxImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_uploadImage = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_uploadImage";
  var id = "z3QcP3YRmTgMvxo_uploadImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_uploadImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_uploadImage()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_uploadImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_boxContentAbsolute = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_boxContentAbsolute";
  var id = "z3QcP3YRmTgMvxo_boxContentAbsolute";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_boxContentAbsolute",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_boxContentAbsolute()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_boxContentAbsolute" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_headingText1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_headingText1";
  var id = "z3QcP3YRmTgMvxo_headingText1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_headingText1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_headingText1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_headingText1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_headingText1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_messageText1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_messageText1";
  var id = "z3QcP3YRmTgMvxo_messageText1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_messageText1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_messageText1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_messageText1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_messageText1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_boxContent = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_boxContent";
  var id = "z3QcP3YRmTgMvxo_boxContent";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_boxContent",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_boxContent()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_boxContent" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_title = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_title";
  var id = "z3QcP3YRmTgMvxo_title";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_title",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_title",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_title()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_title" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqList = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqList";
  var id = "z3QcP3YRmTgMvxo_faqList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqList()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqListItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqListItem_0";
  var id = "z3QcP3YRmTgMvxo_faqListItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqListItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqListItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqListItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqAuestion_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqAuestion_0";
  var id = "z3QcP3YRmTgMvxo_faqAuestion_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqAuestion_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqAuestion_0()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqAuestion_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqTitle_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqTitle_0";
  var id = "z3QcP3YRmTgMvxo_faqTitle_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_faqTitle_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_faqTitle_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqTitle_0()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqTitle_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_iconOpen_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_iconOpen_0";
  var id = "z3QcP3YRmTgMvxo_iconOpen_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_iconOpen_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_iconOpen_0()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_iconOpen_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_iconClose_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_iconClose_0";
  var id = "z3QcP3YRmTgMvxo_iconClose_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_iconClose_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_iconClose_0()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_iconClose_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqAnswers_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqAnswers_0";
  var id = "z3QcP3YRmTgMvxo_faqAnswers_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqAnswers_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqAnswers_0()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqAnswers_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqContent_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqContent_0";
  var id = "z3QcP3YRmTgMvxo_faqContent_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_faqContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_faqContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqContent_0()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqContent_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqListItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqListItem_1";
  var id = "z3QcP3YRmTgMvxo_faqListItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqListItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqListItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqListItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqAuestion_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqAuestion_1";
  var id = "z3QcP3YRmTgMvxo_faqAuestion_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqAuestion_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqAuestion_1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqAuestion_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqTitle_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqTitle_1";
  var id = "z3QcP3YRmTgMvxo_faqTitle_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_faqTitle_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_faqTitle_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqTitle_1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqTitle_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_iconOpen_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_iconOpen_1";
  var id = "z3QcP3YRmTgMvxo_iconOpen_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_iconOpen_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_iconOpen_1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_iconOpen_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_iconClose_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_iconClose_1";
  var id = "z3QcP3YRmTgMvxo_iconClose_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_iconClose_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_iconClose_1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_iconClose_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqAnswers_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqAnswers_1";
  var id = "z3QcP3YRmTgMvxo_faqAnswers_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqAnswers_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqAnswers_1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqAnswers_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqContent_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqContent_1";
  var id = "z3QcP3YRmTgMvxo_faqContent_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_faqContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_faqContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqContent_1()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqContent_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqListItem_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqListItem_2";
  var id = "z3QcP3YRmTgMvxo_faqListItem_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqListItem_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqListItem_2()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqListItem_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqAuestion_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqAuestion_2";
  var id = "z3QcP3YRmTgMvxo_faqAuestion_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqAuestion_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqAuestion_2()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqAuestion_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqTitle_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqTitle_2";
  var id = "z3QcP3YRmTgMvxo_faqTitle_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_faqTitle_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_faqTitle_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqTitle_2()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqTitle_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_iconOpen_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_iconOpen_2";
  var id = "z3QcP3YRmTgMvxo_iconOpen_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_iconOpen_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_iconOpen_2()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_iconOpen_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_iconClose_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_iconClose_2";
  var id = "z3QcP3YRmTgMvxo_iconClose_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_iconClose_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_iconClose_2()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_iconClose_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqAnswers_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqAnswers_2";
  var id = "z3QcP3YRmTgMvxo_faqAnswers_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqAnswers_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqAnswers_2()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqAnswers_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqContent_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqContent_2";
  var id = "z3QcP3YRmTgMvxo_faqContent_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_faqContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_faqContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqContent_2()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqContent_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqListItem_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqListItem_3";
  var id = "z3QcP3YRmTgMvxo_faqListItem_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqListItem_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqListItem_3()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqListItem_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqAuestion_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqAuestion_3";
  var id = "z3QcP3YRmTgMvxo_faqAuestion_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqAuestion_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqAuestion_3()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqAuestion_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqTitle_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqTitle_3";
  var id = "z3QcP3YRmTgMvxo_faqTitle_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_faqTitle_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_faqTitle_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqTitle_3()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqTitle_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_iconOpen_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_iconOpen_3";
  var id = "z3QcP3YRmTgMvxo_iconOpen_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_iconOpen_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_iconOpen_3()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_iconOpen_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_iconClose_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_iconClose_3";
  var id = "z3QcP3YRmTgMvxo_iconClose_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_iconClose_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_iconClose_3()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_iconClose_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqAnswers_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqAnswers_3";
  var id = "z3QcP3YRmTgMvxo_faqAnswers_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_faqAnswers_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqAnswers_3()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqAnswers_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_faqContent_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_faqContent_3";
  var id = "z3QcP3YRmTgMvxo_faqContent_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_faqContent_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_faqContent_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_faqContent_3()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_faqContent_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_boxSendQuestion = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_boxSendQuestion";
  var id = "z3QcP3YRmTgMvxo_boxSendQuestion";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_boxSendQuestion",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_boxSendQuestion()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_boxSendQuestion" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_question = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_question";
  var id = "z3QcP3YRmTgMvxo_question";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "z3QcP3YRmTgMvxo_question",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "z3QcP3YRmTgMvxo_question",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_question()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_question" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomz3QcP3YRmTgMvxo_sectionButton = function() {
          (function() {
  var elementClassName = ".gt_atom-z3QcP3YRmTgMvxo_sectionButton";
  var id = "z3QcP3YRmTgMvxo_sectionButton";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[{"control":{"attribute":"2","desc":"","id":"2","isChooseVariantControl":true,"reference":"html","shopify":["all_products[productHandle]","collections.all.products"],"title":"Product","type":"pickproduct","value":{"handle":"No product","id":"No product","quantity":1,"title":"No product"}},"event":"click","id":2}]`
    const isCustomActions = "false" == "true"
    const openNewTab = "true" == "true"
    const linkButton = "https://www.forgano.com/pages/contact";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "z3QcP3YRmTgMvxo_sectionButton",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-z3QcP3YRmTgMvxo_sectionButton" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-z3QcP3YRmTgMvxo_sectionButton" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-z3QcP3YRmTgMvxo_sectionButton" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomz3QcP3YRmTgMvxo_sectionButton()
      } catch(e) {
        console.error("Error ESAtom Id: z3QcP3YRmTgMvxo_sectionButton" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectiontqShQL86K0RsXMm = function() {
          
        }
        funcESSectiontqShQL86K0RsXMm()
      } catch(e) {
        console.error("Error ESSection Id: tqShQL86K0RsXMm" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_boxTop = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_boxTop";
  var id = "tqShQL86K0RsXMm_boxTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_boxTop",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_boxTop()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_boxTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_imageUploadMobileTop = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_imageUploadMobileTop";
  var id = "tqShQL86K0RsXMm_imageUploadMobileTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_imageUploadMobileTop",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_imageUploadMobileTop()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_imageUploadMobileTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_bannerImageLeft = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_bannerImageLeft";
  var id = "tqShQL86K0RsXMm_bannerImageLeft";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_bannerImageLeft",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_bannerImageLeft()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_bannerImageLeft" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_boxFeaturedTop = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_boxFeaturedTop";
  var id = "tqShQL86K0RsXMm_boxFeaturedTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_boxFeaturedTop",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_boxFeaturedTop()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_boxFeaturedTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_itemFeaturedTopOne = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_itemFeaturedTopOne";
  var id = "tqShQL86K0RsXMm_itemFeaturedTopOne";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_itemFeaturedTopOne",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_itemFeaturedTopOne()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_itemFeaturedTopOne" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_iconNutritional = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_iconNutritional";
  var id = "tqShQL86K0RsXMm_iconNutritional";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_iconNutritional",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_iconNutritional()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_iconNutritional" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_headingText";
  var id = "tqShQL86K0RsXMm_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "tqShQL86K0RsXMm_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "tqShQL86K0RsXMm_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_messageText";
  var id = "tqShQL86K0RsXMm_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "tqShQL86K0RsXMm_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "tqShQL86K0RsXMm_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_itemFeaturedTwo = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_itemFeaturedTwo";
  var id = "tqShQL86K0RsXMm_itemFeaturedTwo";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_itemFeaturedTwo",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_itemFeaturedTwo()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_itemFeaturedTwo" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_iconWorkout = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_iconWorkout";
  var id = "tqShQL86K0RsXMm_iconWorkout";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_iconWorkout",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_iconWorkout()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_iconWorkout" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_headingTextWorkout = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_headingTextWorkout";
  var id = "tqShQL86K0RsXMm_headingTextWorkout";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "tqShQL86K0RsXMm_headingTextWorkout",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "tqShQL86K0RsXMm_headingTextWorkout",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_headingTextWorkout()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_headingTextWorkout" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_messageTextWorkout = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_messageTextWorkout";
  var id = "tqShQL86K0RsXMm_messageTextWorkout";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "tqShQL86K0RsXMm_messageTextWorkout",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "tqShQL86K0RsXMm_messageTextWorkout",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_messageTextWorkout()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_messageTextWorkout" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_boxBottom = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_boxBottom";
  var id = "tqShQL86K0RsXMm_boxBottom";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_boxBottom",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_boxBottom()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_boxBottom" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_imageUploadMobileBottom = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_imageUploadMobileBottom";
  var id = "tqShQL86K0RsXMm_imageUploadMobileBottom";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_imageUploadMobileBottom",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_imageUploadMobileBottom()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_imageUploadMobileBottom" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_boxFeaturedBottom = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_boxFeaturedBottom";
  var id = "tqShQL86K0RsXMm_boxFeaturedBottom";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_boxFeaturedBottom",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_boxFeaturedBottom()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_boxFeaturedBottom" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_itemFeaturedBottomOne = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_itemFeaturedBottomOne";
  var id = "tqShQL86K0RsXMm_itemFeaturedBottomOne";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_itemFeaturedBottomOne",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_itemFeaturedBottomOne()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_itemFeaturedBottomOne" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_iconFat = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_iconFat";
  var id = "tqShQL86K0RsXMm_iconFat";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_iconFat",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_iconFat()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_iconFat" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_headingTextFat = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_headingTextFat";
  var id = "tqShQL86K0RsXMm_headingTextFat";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "tqShQL86K0RsXMm_headingTextFat",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "tqShQL86K0RsXMm_headingTextFat",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_headingTextFat()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_headingTextFat" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_messageTextFat = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_messageTextFat";
  var id = "tqShQL86K0RsXMm_messageTextFat";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "tqShQL86K0RsXMm_messageTextFat",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "tqShQL86K0RsXMm_messageTextFat",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_messageTextFat()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_messageTextFat" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_itemFeaturedBottomTwo = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_itemFeaturedBottomTwo";
  var id = "tqShQL86K0RsXMm_itemFeaturedBottomTwo";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_itemFeaturedBottomTwo",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_itemFeaturedBottomTwo()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_itemFeaturedBottomTwo" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_iconAchieving = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_iconAchieving";
  var id = "tqShQL86K0RsXMm_iconAchieving";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_iconAchieving",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_iconAchieving()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_iconAchieving" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_headingTextAchieving = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_headingTextAchieving";
  var id = "tqShQL86K0RsXMm_headingTextAchieving";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "tqShQL86K0RsXMm_headingTextAchieving",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "tqShQL86K0RsXMm_headingTextAchieving",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_headingTextAchieving()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_headingTextAchieving" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_messageTextAchieving = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_messageTextAchieving";
  var id = "tqShQL86K0RsXMm_messageTextAchieving";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "tqShQL86K0RsXMm_messageTextAchieving",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "tqShQL86K0RsXMm_messageTextAchieving",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_messageTextAchieving()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_messageTextAchieving" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomtqShQL86K0RsXMm_bannerImageRight = function() {
          (function() {
  var elementClassName = ".gt_atom-tqShQL86K0RsXMm_bannerImageRight";
  var id = "tqShQL86K0RsXMm_bannerImageRight";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "tqShQL86K0RsXMm_bannerImageRight",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomtqShQL86K0RsXMm_bannerImageRight()
      } catch(e) {
        console.error("Error ESAtom Id: tqShQL86K0RsXMm_bannerImageRight" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSection2spiWDc4bhhrk6f = function() {
          
        }
        funcESSection2spiWDc4bhhrk6f()
      } catch(e) {
        console.error("Error ESSection Id: 2spiWDc4bhhrk6f" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureList = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureList";
  var id = "2spiWDc4bhhrk6f_featureList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureList()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_headingText";
  var id = "2spiWDc4bhhrk6f_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2spiWDc4bhhrk6f_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2spiWDc4bhhrk6f_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_messageText";
  var id = "2spiWDc4bhhrk6f_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2spiWDc4bhhrk6f_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2spiWDc4bhhrk6f_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureItems = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureItems";
  var id = "2spiWDc4bhhrk6f_featureItems";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureItems",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureItems()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureItems" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureItem_0";
  var id = "2spiWDc4bhhrk6f_featureItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureItemContent_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureItemContent_0";
  var id = "2spiWDc4bhhrk6f_featureItemContent_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureItemContent_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureItemContent_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureItemContent_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureIcon_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureIcon_0";
  var id = "2spiWDc4bhhrk6f_featureIcon_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureIcon_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureIcon_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureIcon_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_titleContent_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_titleContent_0";
  var id = "2spiWDc4bhhrk6f_titleContent_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2spiWDc4bhhrk6f_titleContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2spiWDc4bhhrk6f_titleContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_titleContent_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_titleContent_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_messageContent_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_messageContent_0";
  var id = "2spiWDc4bhhrk6f_messageContent_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2spiWDc4bhhrk6f_messageContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2spiWDc4bhhrk6f_messageContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_messageContent_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_messageContent_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_lineBorder_0 = function() {
          
        }
        funcESAtom2spiWDc4bhhrk6f_lineBorder_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_lineBorder_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureItem_1";
  var id = "2spiWDc4bhhrk6f_featureItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureItemContent_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureItemContent_1";
  var id = "2spiWDc4bhhrk6f_featureItemContent_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureItemContent_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureItemContent_1()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureItemContent_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureIcon_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureIcon_1";
  var id = "2spiWDc4bhhrk6f_featureIcon_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureIcon_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureIcon_1()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureIcon_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_titleContent_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_titleContent_1";
  var id = "2spiWDc4bhhrk6f_titleContent_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2spiWDc4bhhrk6f_titleContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2spiWDc4bhhrk6f_titleContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_titleContent_1()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_titleContent_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_messageContent_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_messageContent_1";
  var id = "2spiWDc4bhhrk6f_messageContent_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2spiWDc4bhhrk6f_messageContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2spiWDc4bhhrk6f_messageContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_messageContent_1()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_messageContent_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_lineBorder_1 = function() {
          
        }
        funcESAtom2spiWDc4bhhrk6f_lineBorder_1()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_lineBorder_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureItem_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureItem_2";
  var id = "2spiWDc4bhhrk6f_featureItem_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureItem_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureItem_2()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureItem_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureItemContent_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureItemContent_2";
  var id = "2spiWDc4bhhrk6f_featureItemContent_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureItemContent_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureItemContent_2()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureItemContent_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_featureIcon_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_featureIcon_2";
  var id = "2spiWDc4bhhrk6f_featureIcon_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2spiWDc4bhhrk6f_featureIcon_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_featureIcon_2()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_featureIcon_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_titleContent_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_titleContent_2";
  var id = "2spiWDc4bhhrk6f_titleContent_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2spiWDc4bhhrk6f_titleContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2spiWDc4bhhrk6f_titleContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_titleContent_2()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_titleContent_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_messageContent_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-2spiWDc4bhhrk6f_messageContent_2";
  var id = "2spiWDc4bhhrk6f_messageContent_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2spiWDc4bhhrk6f_messageContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2spiWDc4bhhrk6f_messageContent_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2spiWDc4bhhrk6f_messageContent_2()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_messageContent_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2spiWDc4bhhrk6f_lineBorder_2 = function() {
          
        }
        funcESAtom2spiWDc4bhhrk6f_lineBorder_2()
      } catch(e) {
        console.error("Error ESAtom Id: 2spiWDc4bhhrk6f_lineBorder_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSection2Unc5v8gwoTEmL8 = function() {
          
        }
        funcESSection2Unc5v8gwoTEmL8()
      } catch(e) {
        console.error("Error ESSection Id: 2Unc5v8gwoTEmL8" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_headingType2 = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_headingType2";
  var id = "2Unc5v8gwoTEmL8_headingType2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2Unc5v8gwoTEmL8_headingType2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2Unc5v8gwoTEmL8_headingType2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_headingType2()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_headingType2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_bannerBox = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_bannerBox";
  var id = "2Unc5v8gwoTEmL8_bannerBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_bannerBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_bannerBox()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_bannerBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_contentBox = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_contentBox";
  var id = "2Unc5v8gwoTEmL8_contentBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_contentBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_contentBox()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_contentBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_heading = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_heading";
  var id = "2Unc5v8gwoTEmL8_heading";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2Unc5v8gwoTEmL8_heading",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2Unc5v8gwoTEmL8_heading",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_heading()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_heading" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_price = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_price";
  var id = "2Unc5v8gwoTEmL8_price";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_price",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_price()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_price" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_titleBoxPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_titleBoxPrice";
  var id = "2Unc5v8gwoTEmL8_titleBoxPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2Unc5v8gwoTEmL8_titleBoxPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2Unc5v8gwoTEmL8_titleBoxPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_titleBoxPrice()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_titleBoxPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_mainPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_mainPrice";
  var id = "2Unc5v8gwoTEmL8_mainPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = `{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}`;
    const animation = `{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}`;
    const animationHover = `{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}`;
    var priceMain = "";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2Unc5v8gwoTEmL8_mainPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block",
        };
        var settingsText = {
          elementId: "2Unc5v8gwoTEmL8_mainPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text",
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function changeStoreCurrency() {
      var priceNumber = priceMain.replace(/[^0-9\s,.]/g, "").trim();
      var replacedPriceNumber = priceNumber.replace(',', '.');
      if (replacedPriceNumber) {
        $element.attr("data-currentprice", replacedPriceNumber);
        priceMain = $element.html(
          formatMoneyPlugin(replacedPriceNumber * 100)
        );
      }
    }

    function formatMoneyPlugin(price) {
      const dataCurrency = window.store.get("dataCurrency");
      const format = window.__GemSettings.money;
      if (dataCurrency) {
        price = window.Shopify.gemFormatMoney(
          price,
          dataCurrency.currency,
          dataCurrency.data,
          null, //paramssupportaddoncurrencyconvert
          null, //paramssupportaddoncurrencyconvert
        );
      } else {
        price = window.Shopify.formatMoney(price, format);
      }
      return price;
    }
    /* init block script */
    addInteraction();
    changeStoreCurrency();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_mainPrice()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_mainPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_featureList = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_featureList";
  var id = "2Unc5v8gwoTEmL8_featureList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_featureList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_featureList()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_featureList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_item_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_item_0";
  var id = "2Unc5v8gwoTEmL8_item_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_item_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_item_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_item_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_icon_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_icon_0";
  var id = "2Unc5v8gwoTEmL8_icon_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_icon_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_icon_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_icon_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_itemText_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_itemText_0";
  var id = "2Unc5v8gwoTEmL8_itemText_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2Unc5v8gwoTEmL8_itemText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2Unc5v8gwoTEmL8_itemText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_itemText_0()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_itemText_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_buttonBuyNow = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_buttonBuyNow";
  var id = "2Unc5v8gwoTEmL8_buttonBuyNow";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "true" == "true"
    const linkButton = "https://www.forgano.com/collections/all";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_buttonBuyNow",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-2Unc5v8gwoTEmL8_buttonBuyNow" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-2Unc5v8gwoTEmL8_buttonBuyNow" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-2Unc5v8gwoTEmL8_buttonBuyNow" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_buttonBuyNow()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_buttonBuyNow" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_guarantee = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_guarantee";
  var id = "2Unc5v8gwoTEmL8_guarantee";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_guarantee",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_guarantee()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_guarantee" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_iconGuarantee = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_iconGuarantee";
  var id = "2Unc5v8gwoTEmL8_iconGuarantee";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_iconGuarantee",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_iconGuarantee()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_iconGuarantee" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_textGuarantee = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_textGuarantee";
  var id = "2Unc5v8gwoTEmL8_textGuarantee";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "2Unc5v8gwoTEmL8_textGuarantee",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "2Unc5v8gwoTEmL8_textGuarantee",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_textGuarantee()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_textGuarantee" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_imageBadge = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_imageBadge";
  var id = "2Unc5v8gwoTEmL8_imageBadge";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"fade-left"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"heartBeat"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"flash"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_imageBadge",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_imageBadge()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_imageBadge" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_mainBanner = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_mainBanner";
  var id = "2Unc5v8gwoTEmL8_mainBanner";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_mainBanner",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_mainBanner()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_mainBanner" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom2Unc5v8gwoTEmL8_imageBageMobile = function() {
          (function() {
  var elementClassName = ".gt_atom-2Unc5v8gwoTEmL8_imageBageMobile";
  var id = "2Unc5v8gwoTEmL8_imageBageMobile";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "2Unc5v8gwoTEmL8_imageBageMobile",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom2Unc5v8gwoTEmL8_imageBageMobile()
      } catch(e) {
        console.error("Error ESAtom Id: 2Unc5v8gwoTEmL8_imageBageMobile" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionf5SUHjESq88WopV = function() {
          
        }
        funcESSectionf5SUHjESq88WopV()
      } catch(e) {
        console.error("Error ESSection Id: f5SUHjESq88WopV" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_box = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_box";
  var id = "f5SUHjESq88WopV_box";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_box",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function checkRemoteDefaultInput() {
      if (isExistAtomVariant()) {
        var $inputVariantDefault = $element.find(".gt_variant-input--default");
        if ($inputVariantDefault && $inputVariantDefault.length) {
          $($inputVariantDefault[0]).remove()
        }
      }

      if (isExistAtomQuantity()) {
        var $inputQuantityDefault = $element.find(".gt_quantity-input--default");
        if ($inputQuantityDefault && $inputQuantityDefault.length) {
          $($inputQuantityDefault[0]).remove()
        }
      }
    }

    function isExistAtomVariant() {
      var $atomProduct = $element.find(".gt_variant--input")
      if ($atomProduct && $atomProduct.length) {
        return true
      }
      return false
    }

    function isExistAtomQuantity() {
      var $atomQuantity = $element.find(".gt_quantity--input")
      if ($atomQuantity && $atomQuantity.length) {
        return true
      }
      return false
    }
    /* init block script */
    addInteraction();
    checkRemoteDefaultInput();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_box()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_box" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_boxInfoTop = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_boxInfoTop";
  var id = "f5SUHjESq88WopV_boxInfoTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_boxInfoTop",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_boxInfoTop()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_boxInfoTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productTitleTop = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productTitleTop";
  var id = "f5SUHjESq88WopV_productTitleTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_productTitleTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "f5SUHjESq88WopV_productTitleTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productTitleTop()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productTitleTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_boxPriceTop = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_boxPriceTop";
  var id = "f5SUHjESq88WopV_boxPriceTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_boxPriceTop",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_boxPriceTop()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_boxPriceTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productPriceTop = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productPriceTop";
  var id = "f5SUHjESq88WopV_productPriceTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!price!]"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_productPriceTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "f5SUHjESq88WopV_productPriceTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-price-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-price-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    };
    $element.gtProductPrice({
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityPrice: syncQuantityandPrice,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productPriceTop()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productPriceTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productComparePriceTop = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productComparePriceTop";
  var id = "f5SUHjESq88WopV_productComparePriceTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_productComparePriceTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "f5SUHjESq88WopV_productComparePriceTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    $element.gtProductPrice({
      classComparePrice: ".gt_product-price--compare",
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityComparePrice: syncQuantityandPrice,
      replacePriceForCurrentPrice: false,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productComparePriceTop()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productComparePriceTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productTagSaleTop = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productTagSaleTop";
  var id = "f5SUHjESq88WopV_productTagSaleTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const roundPercent = Number("0");
    const removeZeros = "true" === "true";
    /* store get state block script */
    /* methods block script */
    /* init block script */
    window.SOLID.library.gtProductSaveV2({
      $element: $element,
      settings: {
        classTextPercent: ".gt_product-tag-sale--value--percent",
        classTextNumber: ".gt_product-tag-sale--value--number",
        dataFormat: "[!Profit!] OFF",
        dataFormatKey: "[!Profit!]",
        customCurrencyFormating: "shortPrefix",
        roundPercent: roundPercent,
        roundNoZeroes: removeZeros
      }
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productTagSaleTop()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productTagSaleTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_boxImage = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_boxImage";
  var id = "f5SUHjESq88WopV_boxImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_boxImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_boxImage()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_boxImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productImageList = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productImageList";
  var id = "f5SUHjESq88WopV_productImageList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var mode = "production";
    var checkWindowWidth = $(window).width();
    var widthSliderCurrent;
    var sizeIconDotsCurrent;
    var imageListPositionCurrent;
    var $imgSlide = $element.find(".gt_product-carousel-box");
    var $imgBox = $element.find(".gt_product-img-box");
    var $imgBoxInner = $element.find(".gt_product-img--inner");
    var $imgSlideItem = $element.find(".gt_product-carousel--item");
    var $productImgInner = $element.find(".gt_product-image--thumb");
    var $controlNext = $element.find(".gt_product--swiper .gt_control-next");
    var $controlPrev = $element.find(".gt_product--swiper .gt_control-prev");
    var dynamicDotsOnOff = "false" === "true";
    var slidesPerView_lg = "5";
    var slidesPerView_md = "5";
    var slidesPerView_sm = "5";
    var slidesPerView_xs = "5";
    var spaceBetween_lg = parseInt("16") || 1;
    var spaceBetween_md = parseInt("16") || 1;
    var spaceBetween_sm = parseInt("14") || 1;
    var spaceBetween_xs = parseInt("14") || 1;
    var widthActive = "false" === "true";
    var widthSlider = "100%";
    var widthSlider_lg = "100%";
    var widthSlider_md = "100%";
    var widthSlider_sm = "100%";
    var widthSlider_xs = "100%";
    var sizeIconDots_sm = "20px";
    var sizeIconDots_xs = "15px";
    var imageRadio = "square";
    var hideDisplayProductImageAdvanced = "false" === "true";
    let initShowFeatureImage = false;
    let initShow3DModel = false;
    let initShowExVideo = false;
    let initShowOtherVideo = false;
    if (hideDisplayProductImageAdvanced) {
      initShowFeatureImage = "featureImage" === "featureImage";
    } else {
      initShowFeatureImage = "featureImageAdvanced" === "featureImageAdvanced";
      initShow3DModel = "featureImageAdvanced" === "3DModel";
      initShowExVideo = "featureImageAdvanced" === "exVideo";
      initShowOtherVideo = "featureImageAdvanced" === "otherVideo";
    }
    var imageListPosition = "bottom";
    var imageListPosition_lg = "bottom";
    var imageListPosition_md = "bottom";
    var imageListPosition_sm = "bottom";
    var imageListPosition_xs = "bottom";
    var imageListActive = "true" === "true";
    var spaceBetween_sm = "14";
    var spaceBetween_xs = "14";
    var scaleZoomImageActive = "true" === "true";
    var mySwiper;
    var mySwiperFeature;
    var spacingSmall = "16px";
    var displayTypeThumb = "thumb" === "thumb";
    var displayTypeCenter = "thumb" === "center";
    var allowDragSlider = "true" === "true";
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var featuredImage = $(elementClassName).find(".gt_product-img--inner img");
      var itemImage = $(elementClassName).find(".gt_product-carousel-box img");
      var widthFeaturedImage = featuredImage.width();
      var heightFeaturedImage = featuredImage.height();
      var widthItemImage = itemImage.width();
      var heightItemImage = itemImage.height();
      featuredImage.attr("width", widthFeaturedImage);
      featuredImage.attr("height", heightFeaturedImage);
      itemImage.attr("width", widthItemImage);
      itemImage.attr("height", heightItemImage);
    }

    function checkEnableEffectZoomImage() {
      if (scaleZoomImageActive) {
        var productImageFeature = $element.find(".gt_product-image--feature");
        if (productImageFeature && productImageFeature.length) {
          $element.find(".gt_product-image--scale").gfProductZoomImage({
            classHoverItem: ".gt_product-img-box",
            scale: "1.5",
            classSection: ".gt_atom-f5SUHjESq88WopV_productImageList",
          });
        }
      }
    }

    function listen() {
      listenElementResizeEvent();
      listenWindowResizeEvent();
    }

    function listenElementResizeEvent() {
      let observer = new ResizeObserver(() => {
        if (mySwiper) {
          mySwiper.update()
        }
      })
      observer.observe($element[0]);
    }

    function listenWindowResizeEvent() {
      var delayResize = 0;
      $(window).off("resize.checkSwitchScreensf5SUHjESq88WopV_productImageList").on("resize.checkSwitchScreensf5SUHjESq88WopV_productImageList", function() {
        clearTimeout(delayResize);
        delayResize = setTimeout(function() {
          const windowWidthCurrent = $(window).width();
          if (windowWidthCurrent !== checkWindowWidth) {
            checkWindowWidth = windowWidthCurrent;
            widthSliderCurrent = 0;
            sizeIconDotsCurrent = 0;
            if (checkWindowWidth <= 576) {
              widthSliderCurrent = widthSlider_xs;
              sizeIconDotsCurrent = sizeIconDots_xs;
            } else if (checkWindowWidth <= 992) {
              widthSliderCurrent = widthSlider_sm;
              sizeIconDotsCurrent = sizeIconDots_sm;
            } else if (checkWindowWidth <= 1200) {
              widthSliderCurrent = widthSlider_md;
            } else {
              widthSliderCurrent = widthSlider;
            }
            if (widthActive) {
              $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
              mySwiper.update();
            }
            var $paginationItem = $element.find(".gt_control-pagination-item");
            var $paginationItemIcon = $element.find(".gt_control-pagination-item .gt_icon");
            $paginationItemIcon.css("cssText", "width: " + sizeIconDotsCurrent + " !important; height: " + sizeIconDotsCurrent + "!important;");
            $paginationItem.css("cssText", "width: calc(8px + " + sizeIconDotsCurrent + ") !important; height: calc(8px + " + sizeIconDotsCurrent + ") !important;");

            checkImageListPosition();
            calculatorImageSlideHeight();
            checkImageListActive();
            initSlider();
          }
        }, 100)
      });
      if ($element.find(".swiper-slide").length == 1) {
        $element.find('.swiper-wrapper').addClass("gt_disabled");
        $element.find('.gt_control-pagination').addClass("gt_disabled");
      }
    }

    function autoRotateModel() {
      var model = $element.find(".gt_product-media--feature .gt_product-model");
      model.attr("auto-rotate", true);
    }

    function initSlider() {
      if (mySwiper) {
        mySwiper.destroy();
        checkDimensions();
      }
      var $swiperContainer = $element.find(".gt_product--swiper-f5SUHjESq88WopV_productImageList");
      if (!$swiperContainer || !$swiperContainer.length) {
        return;
      }
      if ($swiperContainer[0].swiper) {
        $swiperContainer[0].swiper.destroy();
      }
      if (mySwiperFeature) {
        mySwiperFeature.destroy();
      }
      if ($swiperContainer.find(".swiper-slide").length == 1) {
        $swiperContainer.addClass("gt_disabled");
      }
      var $swiperContainerFeature = $element.find(".gt_product-feature--swiper-f5SUHjESq88WopV_productImageList");
      if (!$swiperContainerFeature || !$swiperContainerFeature.length) {
        return;
      }
      if ($swiperContainerFeature[0].swiper) {
        $swiperContainerFeature[0].swiper.destroy();
      }
      if ($swiperContainerFeature.find(".swiper-slide").length == 1) {
        $swiperContainerFeature.find(".swiper-wrapper").addClass("gt_disabled");
        $swiperContainerFeature.find(".gt_control-pagination").addClass("gt_disabled");
      }
      let gtProductImageParams = {
        $element: $element,
        settings: {
          classSwiperItems: ".gt_product--swiper-f5SUHjESq88WopV_productImageList .gt_product-carousel--item",
          classSwiperItemsImage: ".gt_product--swiper-f5SUHjESq88WopV_productImageList .gt_product-carousel--item img",
          classSwiperContainer: ".gt_product--swiper-f5SUHjESq88WopV_productImageList",
          initShowFeatureImage: initShowFeatureImage,
          initShow3DModel: initShow3DModel,
          initShowExVideo: initShowExVideo,
          initShowOtherVideo: initShowOtherVideo,
          swiperSetting: getDataSwiperSettings(),
          //featureimageswiper
          featureSwiperSetting: getDataSwiperSettingsFeature(),
          classFeatureSwiperContainer: ".gt_product-feature--swiper-f5SUHjESq88WopV_productImageList",
          classFeatureSwiperItemsImage: ".gt_product-feature--swiper-f5SUHjESq88WopV_productImageList .gt_product-image--feature",
        }
      }
      window.SOLID.library.gtProductImagesV2(gtProductImageParams);
      mySwiper = $swiperContainer[0].swiper;
      mySwiperFeature = $swiperContainerFeature[0].swiper;
    }

    function getDataSwiperSettings() {
      let direction = 'horizontal';
      if (displayTypeThumb) {
        if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
          direction = "vertical";
        }
      }

      let loop = false;
      let centeredSlides = false;
      let freeMode = true;
      if (displayTypeCenter && checkWindowWidth > 992) {
        loop = true;
        centeredSlides = true;
        freeMode = false;
      }
      return {
        mousewheel: false,
        loop: loop,
        centeredSlides: centeredSlides,
        slidesPerView: 3,
        spaceBetween: 16,
        freeMode: freeMode,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".gt_product--swiper-f5SUHjESq88WopV_productImageList .gt_control-next",
          prevEl: ".gt_product--swiper-f5SUHjESq88WopV_productImageList .gt_control-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: slidesPerView_xs,
            spaceBetween: spaceBetween_xs,
            direction: direction,
            mousewheel: false,
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          577: {
            slidesPerView: slidesPerView_sm,
            spaceBetween: spaceBetween_sm,
            direction: direction,
            mousewheel: false,
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          993: {
            slidesPerView: slidesPerView_md,
            spaceBetween: spaceBetween_md,
            direction: direction,
            mousewhel: true,
          },
          1201: {
            slidesPerView: slidesPerView_lg,
            spaceBetween: spaceBetween_lg,
            direction: direction,
            mousewhel: true,
          }
        },
        on: {
          init: function() {
            window.SOLID.store.dispatch("trigger-lazyload", true);
          },
          imagesReady: function() {
            if (displayTypeCenter && checkWindowWidth > 992) {
              setTimeout(() => {
                var $swiperWrapperHide = $element.find(".gt_swiper_wrapper-type-center");
                if ($swiperWrapperHide && $swiperWrapperHide.length) {
                  $swiperWrapperHide.removeClass("gt_swiper_wrapper-type-center");
                }
              }, 100)
            }
          }
        },
      }
    }

    function getDataSwiperSettingsFeature() {
      let allowTouchMove = false;
      var productImageFeature = $element.find(".gt_product-image--feature");
      if (allowDragSlider && !productImageFeature.hasClass("gt_product-media--model") || displayTypeCenter) {
        allowTouchMove = true;
      }
      return {
        allowTouchMove: allowTouchMove,
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: ".gt_product-feature--swiper-f5SUHjESq88WopV_productImageList .gt_product-img-nav--right",
          prevEl: ".gt_product-feature--swiper-f5SUHjESq88WopV_productImageList .gt_product-img-nav--left",
        },
        pagination: {
          el: "#gt_control-pagination-f5SUHjESq88WopV_productImageList",
          type: 'bullets',
          clickable: true,
          renderBullet: function(index, classname) {
            return `<div class="gt_control-pagination-item ` + classname + ` ">
            <span data-optimize-type="icon"  data-attribute="iconDots,"  data-section-id="f5SUHjESq88WopV_productImageList"  class="gt_icon"><svg height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 22C13.05 22 13.5 21.55 13.5 21V3C13.5 2.45 13.05 2 12.5 2C11.95 2 11.5 2.45 11.5 3V21C11.5 21.55 11.95 22 12.5 22ZM8.5 18C9.05 18 9.5 17.55 9.5 17V7C9.5 6.45 9.05 6 8.5 6C7.95 6 7.5 6.45 7.5 7V17C7.5 17.55 7.95 18 8.5 18ZM5.5 13C5.5 13.55 5.05 14 4.5 14C3.95 14 3.5 13.55 3.5 13V11C3.5 10.45 3.95 10 4.5 10C5.05 10 5.5 10.45 5.5 11V13ZM16.5 18C17.05 18 17.5 17.55 17.5 17V7C17.5 6.45 17.05 6 16.5 6C15.95 6 15.5 6.45 15.5 7V17C15.5 17.55 15.95 18 16.5 18ZM19.5 13V11C19.5 10.45 19.95 10 20.5 10C21.05 10 21.5 10.45 21.5 11V13C21.5 13.55 21.05 14 20.5 14C19.95 14 19.5 13.55 19.5 13Z" fill="currentColor"/> </svg></span>
          </div>`;
          }
        },
        breakpoints: {
          0: {
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          577: {
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          }
        },
      }
    }

    function changeSliderActive(value) {
      if (value && value.sliderIndex !== NaN) {
        if (loop) {
          mySwiper.slideToLoop(value.sliderIndex, 500, true);
        } else {
          mySwiper.slideTo(value.sliderIndex, 500, true);
        }
      }
    }

    function isImgSliderBottom() {
      const $productImage = $element.find(".gt_product-image-list--bottom");
      if ($productImage && $productImage.length) {
        return true;
      }
      return false;
    }

    function checkImageListActive() {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        if (imageListActive) {
          slidesPerView_xs = "5";
          spaceBetween_xs = "14";
        } else if (!imageListActive) {
          slidesPerView_xs = 1;
          spaceBetween_xs = 0;
        }
      } else if (checkWindowWidth <= 992) {
        if (imageListActive) {
          slidesPerView_sm = "5";
          spaceBetween_sm = "14"
        } else if (!imageListActive) {
          slidesPerView_sm = 1;
          spaceBetween_sm = 0;
        }
      }
    }

    function calculatorImageSlideHeight() {
      var delay = setTimeout(function() {
        checkWindowWidth = $(window).width();
        if (!isImgSliderBottom()) {
          $imgBox = $element.find(".gt_product-img-box");
          var imgBoxHeight = $imgBox && $imgBox.length && $imgBox[0].offsetHeight;
          $imgSlide.css("height", imgBoxHeight);
          mySwiper.update();
        } else {
          $imgSlide.css("height", "");
        }
      }, 500);
    }

    function optimizeSizeIconDots(value) {
      mySwiper.pagination.render();
      var $paginationItem = $element.find(".gt_control-pagination-item");
      var $paginationItemIcon = $element.find(".gt_control-pagination-item .gt_icon");
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        sizeIconDots_xs = value;
      } else if (checkWindowWidth <= 992) {
        sizeIconDots_sm = value;
      }
      $paginationItemIcon.css("cssText", "width: " + value + " !important; height: " + value + "!important;");
      $paginationItem.css("cssText", "width: calc(8px + " + value + ") !important; height: calc(8px + " + value + ") !important;");
      mySwiper.pagination.update();
    }

    function optimizeSlidePerView(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        slidesPerView_xs = value;
      } else if (checkWindowWidth <= 992) {
        slidesPerView_sm = value;
      } else if (checkWindowWidth <= 1200) {
        slidesPerView_md = value;
      } else {
        slidesPerView_lg = value;
      }
      initSlider();
    }

    function optimizeWidthSlider(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        widthSlider_xs = value;
      } else if (checkWindowWidth <= 992) {
        widthSlider_sm = value;
      } else if (checkWindowWidth <= 1200) {
        widthSlider_md = value;
      } else {
        widthSlider_lg = widthSlider = value;
      }
      $element.css("cssText", "width: " + value + " !important;");
      mySwiper.update();
      calculatorImageSlideHeight();
    }

    function optimizeWidthActive(value) {
      widthActive = value;
      if (!value) {
        $element.css("cssText", "width: null");
      } else {
        checkWindowWidth = $(window).width();
        widthSliderCurrent = 0;
        if (checkWindowWidth <= 576) {
          widthSliderCurrent = widthSlider_xs;
        } else if (checkWindowWidth <= 992) {
          widthSliderCurrent = widthSlider_sm;
        } else if (checkWindowWidth <= 1200) {
          widthSliderCurrent = widthSlider_md;
        } else {
          widthSliderCurrent = widthSlider;
        }
        $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
        initSlider();
        mySwiper.update();
      }
    }

    function checkImageListPosition({
      isInit
    } = {}) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        imageListPositionCurrent = imageListPosition_xs;
        spacingSmall = "10px";
      } else if (checkWindowWidth <= 992) {
        imageListPositionCurrent = imageListPosition_sm;
        spacingSmall = "16px";
      } else if (checkWindowWidth <= 1200) {
        imageListPositionCurrent = imageListPosition_md;
        spacingSmall = "16px";
      } else {
        imageListPositionCurrent = imageListPosition;
        spacingSmall = "16px";
      }
      $element.find("#gt_product-image-list-id").attr("class", "gt_product-image-list--" + imageListPositionCurrent);
      //showimage
      var $swiperWrapperHide = $element.find(".gt-carousel--hide-default");
      var $productImageList = $element.find("#gt_product-image-list-id");
      if ($swiperWrapperHide && $swiperWrapperHide.length) {
        $swiperWrapperHide.removeClass("gt-carousel--hide-default");
        $productImageList.css("height", "auto");
      }
      if (imageListPositionCurrent !== "bottom") {
        var $productImageListWrapper = $element.find(".gt_product-carousel-box");
        var $productImageBox = $element.find(".gt_product-image--inner");
        $productImageListWrapper.css("height", $productImageBox.outerHeight());
      }
      //css
      if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
        $controlNext.css({
          "height": "auto",
          "width": "100%"
        });
        $controlPrev.css({
          "height": "auto",
          "width": "100%"
        });
      }
      if (imageListPositionCurrent === "left") {
        $productImgInner.css("flex-direction", "row-reverse");
        $imgSlide.css({
          "padding-left": "0",
          "padding-right": spacingSmall
        });
      } else if (imageListPositionCurrent === "right") {
        $productImgInner.css("flex-direction", "row");
        $imgSlide.css({
          "padding-right": "0",
          "padding-left": spacingSmall
        });
      } else {
        $productImgInner.css("flex-direction", "column");
        $imgSlide.css("padding", "");
        $controlNext.css({
          "height": "100%",
          "width": "auto"
        });
        $controlPrev.css({
          "height": "100%",
          "width": "auto"
        });
      }
      if (!isInit) {
        initSlider();
        mySwiper.update();
      }
    }

    function optimizeImageListPosition(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        imageListPosition_xs = imageListPositionCurrent = value;
      } else if (checkWindowWidth <= 992) {
        imageListPosition_sm = imageListPositionCurrent = value;
      } else if (checkWindowWidth <= 1200) {
        imageListPosition_md = imageListPositionCurrent = value;
      } else {
        imageListPosition_lg = imageListPositionCurrent = imageListPosition = value;
      }
      if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
        $controlNext.css({
          "height": "auto",
          "width": "100%"
        });
        $controlPrev.css({
          "height": "auto",
          "width": "100%"
        });
      }
      if (imageListPositionCurrent === "left") {
        $productImgInner.css("flex-direction", "row-reverse");
        $imgSlide.css({
          "padding-left": "0",
          "padding-right": spacingSmall
        });
      } else if (imageListPositionCurrent === "right") {
        $productImgInner.css("flex-direction", "row");
        $imgSlide.css({
          "padding-right": "0",
          "padding-left": spacingSmall
        });
      } else {
        $productImgInner.css("flex-direction", "column");
        $imgSlide.css("padding", "");
        $controlNext.css({
          "height": "100%",
          "width": "auto"
        });
        $controlPrev.css({
          "height": "100%",
          "width": "auto"
        });
      }
      $element.find("#gt_product-image-list-id").attr("class", "gt_product-image-list--" + value);
      initSlider();
      mySwiper.update();
      calculatorImageSlideHeight();
    }

    function optimizeImageRadio(imageRadio) {
      checkWindowWidth = $(window).width();
      imageRadio = value;
      if (imageRadio === "square") {
        $imgBoxInner.css("padding-top", "calc(100%)");
      } else if (imageRadio === "landscape") {
        $imgBoxInner.css("padding-top", "calc(100% * 3 / 4)");
      } else if (imageRadio === "portrait") {
        $imgBoxInner.css("padding-top", "calc(100% * 4 / 3)");
      }
      if (isImgSliderBottom() || checkWindowWidth < 992) {
        if (imageRadio === "square") {
          $imgSlideItem.css("padding-top", "calc(100%)");
        } else if (imageRadio === "landscape") {
          $imgSlideItem.css("padding-top", "calc(100% * 3 / 4)");
        } else if (imageRadio === "portrait") {
          $imgSlideItem.css("padding-top", "calc(100% * 4 / 3)");
        }
      }
      calculatorImageSlideHeight();
    }

    function optimizeImageRadioActive(value) {
      if (!value) {
        $imgBoxInner.css("padding-top", "");
        $imgSlideItem.css("padding-top", "");
      } else {
        optimizeImageRadio(imageRadio);
      }
      calculatorImageSlideHeight();
    }

    function optimizeDynamicDotsOnOff(value) {
      dynamicDotsOnOff = value;
      initSlider();
      var paginationEl = mySwiperFeature.pagination.el;
      if (value) {
        paginationEl.style.cssText = paginationEl.style.cssText + "margin: 0px auto; transform: translateX(0px); justify-content: unset;";
      } else {
        paginationEl.style.cssText = paginationEl.style.cssText + "justify-content: center;";
        paginationEl.classList.remove("swiper-pagination-bullets-dynamic");
      }
      mySwiperFeature.pagination.update();
      mySwiperFeature.update();
    }

    function getMySwiper() {
      return mySwiper;
    }

    function getMySwiperFeature() {
      return mySwiperFeature;
    }
    /* init block script */
    checkDimensions();
    checkImageListPosition({
      isInit: true
    });
    checkImageListActive();
    initSlider();
    calculatorImageSlideHeight();
    checkEnableEffectZoomImage();
    autoRotateModel();
    listen();
    /* store subscribe block script */
    store.subscribe("optimize-f5SUHjESq88WopV_productImageList-sizeIconDots", optimizeSizeIconDots);
    store.subscribe("optimal-f5SUHjESq88WopV_productImageList-slidesPerView", optimizeSlidePerView);
    store.subscribe("optimal-f5SUHjESq88WopV_productImageList-widthSlider", optimizeWidthSlider);
    store.subscribe("optimal-f5SUHjESq88WopV_productImageList-widthActive", optimizeWidthActive);
    store.subscribe("optimal-f5SUHjESq88WopV_productImageList-imageRadio", optimizeImageRadio);
    store.subscribe("optimal-f5SUHjESq88WopV_productImageList-imageRadioActive", optimizeImageRadioActive);
    store.subscribe("optimal-f5SUHjESq88WopV_productImageList-dynamicDotsOnOff", optimizeDynamicDotsOnOff);
    store.subscribe("optimal-f5SUHjESq88WopV_productImageList-imageListPosition", optimizeImageListPosition);
    store.subscribe("trigger-slider-f5SUHjESq88WopV_productImageList", changeSliderActive);

    function destroy() {
      store.unsubscribe("optimize-f5SUHjESq88WopV_productImageList-sizeIconDots", optimizeSizeIconDots);
      store.unsubscribe("optimal-f5SUHjESq88WopV_productImageList-slidesPerView", optimizeSlidePerView);
      store.unsubscribe("optimal-f5SUHjESq88WopV_productImageList-widthSlider", optimizeWidthSlider);
      store.unsubscribe("optimal-f5SUHjESq88WopV_productImageList-widthActive", optimizeWidthActive);
      store.unsubscribe("optimal-f5SUHjESq88WopV_productImageList-imageRadio", optimizeImageRadio);
      store.unsubscribe("optimal-f5SUHjESq88WopV_productImageList-imageRadioActive", optimizeImageRadioActive);
      store.unsubscribe("optimal-f5SUHjESq88WopV_productImageList-dynamicDotsOnOff", optimizeDynamicDotsOnOff);
      store.unsubscribe("optimal-f5SUHjESq88WopV_productImageList-imageListPosition", optimizeImageListPosition);
      store.unsubscribe("trigger-slider-f5SUHjESq88WopV_productImageList", changeSliderActive);
    }
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      initSlider,
      getMySwiper,
      getMySwiperFeature,
      checkImageListPosition,
      calculatorImageSlideHeight,
      checkImageListActive
    };
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      var publicFunc = script($target, indexEl);
      window.SOLID.public = window.SOLID.public || {};
      window.SOLID.public["atom" + "_" + id + "_" + indexEl] = publicFunc;
      if (publicFunc) {
        store.dispatch("public_function_atom_" + id, publicFunc);
      }
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productImageList()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productImageList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productInfoBox = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productInfoBox";
  var id = "f5SUHjESq88WopV_productInfoBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_productInfoBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productInfoBox()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productInfoBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_infoBox = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_infoBox";
  var id = "f5SUHjESq88WopV_infoBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_infoBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_infoBox()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_infoBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productTitle = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productTitle";
  var id = "f5SUHjESq88WopV_productTitle";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_productTitle",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "f5SUHjESq88WopV_productTitle",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productTitle()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productTitle" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_boxPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_boxPrice";
  var id = "f5SUHjESq88WopV_boxPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_boxPrice",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_boxPrice()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_boxPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productPrice";
  var id = "f5SUHjESq88WopV_productPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!price!]"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_productPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "f5SUHjESq88WopV_productPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-price-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-price-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    };
    $element.gtProductPrice({
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityPrice: syncQuantityandPrice,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productPrice()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productComparePrice = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productComparePrice";
  var id = "f5SUHjESq88WopV_productComparePrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_productComparePrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "f5SUHjESq88WopV_productComparePrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    $element.gtProductPrice({
      classComparePrice: ".gt_product-price--compare",
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityComparePrice: syncQuantityandPrice,
      replacePriceForCurrentPrice: false,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productComparePrice()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productComparePrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productTagSale = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productTagSale";
  var id = "f5SUHjESq88WopV_productTagSale";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const roundPercent = Number("0");
    const removeZeros = "true" === "true";
    /* store get state block script */
    /* methods block script */
    /* init block script */
    window.SOLID.library.gtProductSaveV2({
      $element: $element,
      settings: {
        classTextPercent: ".gt_product-tag-sale--value--percent",
        classTextNumber: ".gt_product-tag-sale--value--number",
        dataFormat: "[!Profit!] OFF",
        dataFormatKey: "[!Profit!]",
        customCurrencyFormating: "shortPrefix",
        roundPercent: roundPercent,
        roundNoZeroes: removeZeros
      }
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productTagSale()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productTagSale" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_boxGuarantee = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_boxGuarantee";
  var id = "f5SUHjESq88WopV_boxGuarantee";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_boxGuarantee",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_boxGuarantee()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_boxGuarantee" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_guaranteeImage = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_guaranteeImage";
  var id = "f5SUHjESq88WopV_guaranteeImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_guaranteeImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_guaranteeImage()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_guaranteeImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_textGuarantee = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_textGuarantee";
  var id = "f5SUHjESq88WopV_textGuarantee";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_textGuarantee",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "f5SUHjESq88WopV_textGuarantee",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_textGuarantee()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_textGuarantee" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productVariant = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productVariant";
  var id = "f5SUHjESq88WopV_productVariant";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var $variantChecked = $element.find(".gt_product-variant--checked");
    var $variantOptions = $element.find(".gt_product-variant-options");
    var mode = "production";
    var animationActive = 'false';
    var timeoutTooltip = null;
    var valueInTitleActive = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function animation() {
      if (animationActive === "true") {
        var interactionScrollIntoView =
          '""';
        window.SOLID.library.animation({
          elementId: id,
          $doms: $elements,
          interactionScrollIntoView: {
            value: JSON.parse(interactionScrollIntoView),
            previewAttr: "interactionScrollIntoView",
          },
          animationType: "block",
          mode: mode,
        });
      }
    }

    function initSwatches() {
      window.SOLID.library.gtProductSwatchesV2({
        $element: $element,
        settings: {
          classCurrentValue: ".gt_product-variant-option--selected .gt_product-variant-option--selected-text",
          classItem: ".gt_variant--select-item",
          classInputIdHidden: ".gt_variant--input",
          classBtnSelect: ".gt_product-variant--btn-select",
          classVariantValueInTitle: ".gt_title_value",
        }
      });
    }

    function openSelectDropdown() {
      $variantChecked.removeClass("gt_active");
      var $options = $(this).siblings(".gt_product-variant-options");
      if ($options.hasClass("gt_active")) {
        $options.css("top", "");
        $options.removeClass("gt_active");
        $(this).removeClass("gt_active");
        clearEventShowTooltip();
        $(document).off("mousedown.outsideClickVariantSelect");
      } else {
        $variantOptions.removeClass("gt_active");
        $options.addClass("gt_active");
        $(this).addClass("gt_active");
        var optionsOuterHeight = $options.outerHeight();
        var selectInputHeight = $variantChecked.outerHeight();
        var positionOptions = $options.offset().top - $(document).scrollTop() + optionsOuterHeight;
        var windowHeight = $(window).outerHeight();
        if (positionOptions > windowHeight) {
          const currentTopOptions = $options.css("top");
          const newTop = "calc( " + currentTopOptions + " - " + optionsOuterHeight + "px" + " - " + (Number(selectInputHeight) + 10) + "px" + " )";
          $options.css("top", newTop);
        }
        clearTimeout(timeoutTooltip);
        timeoutTooltip = setTimeout(() => {
          eventShowTooltipSelectType();
        }, 300)
        //addeventclickoutsidetoclose
        const $currentTargetOptions = $(this);
        $(document).off("mousedown.outsideClickVariantSelect").on("mousedown.outsideClickVariantSelect", function(event) {
          if ($options && $options.length && $currentTargetOptions && $currentTargetOptions.length) {
            const $optionsPure = $options[0];
            if ($optionsPure && !$optionsPure.contains(event.target) && !$currentTargetOptions[0].contains(event.target)) {
              $options.css("top", "");
              $options.removeClass("gt_active");
              $currentTargetOptions.removeClass("gt_active");
              clearEventShowTooltip();
              $(document).off("mousedown.outsideClickVariantSelect");
            }
          }
        });
      }
    }

    function onClickSelectDropDown() {
      $variantChecked.removeClass("gt_active");
      $variantOptions.removeClass("gt_active");
      var value = $(this).attr("data-value");
      var $variantCheckedCurrent = $(this).closest(
        ".gt_product-variant--select-box"
      );
      var $valueVariantChecked = $variantCheckedCurrent.find(
        ".gt_product-variant-option--selected .gt_product-variant-option--selected-text"
      );
      var $contentOptionSelect = $(this).html();
      $valueVariantChecked.attr("data-value", value);
      $valueVariantChecked.html($contentOptionSelect);
      //closetooltip
      const $tooltip = $element.find(".gt_product-variant-tooltip");
      $tooltip.css("display", "none");
      clearEventShowTooltip();
    }

    function hideAtomWhenNoVariant() {
      $element.css("display", "");
      var isHide = true;
      var $variantItems = $element.find(".gt_product-variant--item")
      for (var i = 0; i < $variantItems.length; i++) {
        var $item = $($variantItems[i]);
        var display = $item.css("display");
        if (display !== "none") {
          isHide = false;
          break;
        }
      }
      if (isHide) {
        $element.css("display", "none");
      }
    }

    function eventShowTooltipSelectType() {
      const $selectItems = $element.find(".gt_variant--select-item");
      for (var i = 0; i < $selectItems.length; i++) {
        const $selectItem = $($selectItems[i]);
        const $selectOptions = $selectItem.find(".gt_product-variant-option");
        const $tooltip = $selectItem.find(".gt_product-variant-tooltip");
        $selectOptions.off("mouseenter").on("mouseenter", function() {
          //checkoverflow
          const $contentValue = $(this).find(".gt_product-variant-option--txt");
          const cachedDisplayContentValue = $contentValue.css("display");
          $contentValue.css({
            display: "inline",
            overflow: "unset",
            whiteSpace: "nowrap"
          });
          const realWidth = $contentValue.outerWidth();
          $contentValue.css({
            display: cachedDisplayContentValue,
            overflow: "",
            whiteSpace: ""
          });
          //
          const selectOptionTop = this.getBoundingClientRect().top;
          const selectItemTop = $selectItem[0].getBoundingClientRect().top;
          const selectOptionHeight = $(this).outerHeight();
          const selectOptionWidth = $(this).outerWidth();
          const contentSelect = $contentValue.html();
          if (realWidth > selectOptionWidth) {
            $tooltip.find(".gt_product-variant-tooltip-name").html(contentSelect);
            $tooltip.css({
              display: "block",
              top: selectOptionTop - selectItemTop - selectOptionHeight,
              zIndex: 10
            });
            $tooltip.find(".gt_product-variant-tooltip-arrow").css({
              left: selectOptionWidth / 2 + "px",
            })
          }
        });
        $selectOptions.off("mouseleave").on("mouseleave", function() {
          $tooltip.css({
            display: "none"
          })
        });
      }
    }

    function clearEventShowTooltip() {
      const $selectitems = $element.find(".gt_variant--select-item");
      for (var i = 0; i < $selectitems.length; i++) {
        const $selectitem = $($selectitems[i]);
        const $selectoptions = $selectitem.find(".gt_product-variant-option");
        $selectoptions.off("mouseenter");
        $selectoptions.off("mouseleave");
      }
    }
    /* init block script */
    hideAtomWhenNoVariant();
    initSwatches();
    animation();
    /*global blockscript*/
    window.SOLID.store.subscribe("run-script-" + id, () => {
      $elements = document.querySelectorAll(elementClassName);
      main();
    });
    /* store subscribe block script */
    /* events block script */
    var $elements_1 = $element.find(".gt_product-variant--checked");
    $elements_1.off("click.openSelect").on("click.openSelect", openSelectDropdown);
    var $elements_2 = $element.find(".gt_product-variant-option");
    $elements_2.off("click.selectItem").on("click.selectItem", onClickSelectDropDown);
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productVariant()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productVariant" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productQuantity = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productQuantity";
  var id = "f5SUHjESq88WopV_productQuantity";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var style = "horizontal";
    var mode = "production";
    var interactionScrollIntoViewActive = "false";
    /* store get state block script */
    /* methods block script */
    function animation() {
      if (interactionScrollIntoViewActive === "true") {
        var interactionScrollIntoView =
          '""';
        var $container = $element.find(".gt_product-quantity");
        window.SOLID.library.animation({
          elementId: id,
          $doms: $container,
          interactionScrollIntoView: {
            value: JSON.parse(interactionScrollIntoView),
            previewAttr: "interactionScrollIntoView",
          },
          animationType: "block",
          mode: mode,
        });
      }
    }

    function initLibrary() {
      var params = {
        $element: $element,
        settings: {
          classInput: "input[name='quantity']",
          classPlus: ".gt_quantity_plus",
          classMinus: ".gt_quantity_minus",
          mode: mode,
        }
      };
      if (style === "horizontal") {
        params = {
          $element: $element,
          settings: {
            classInput: "input[name='quantity']",
            classPlus: ".gt_product-quantity--plus",
            classMinus: ".gt_product-quantity--minus",
            mode: mode,
          }
        };
      }
      window.SOLID.library.gtProductQuantityV2(params);
    }

    function validateInput() {
      var inputQuantity = $element.find("input[name='quantity']");
      inputQuantity.keyup(function() {
        var value = parseInt(this.value);
        if (isNaN(value)) {
          value = 1;
        }
        inputQuantity.attr("value", value).val(value);
      })
    }
    /* init block script */
    initLibrary();
    animation();
    validateInput();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productQuantity()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productQuantity" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_productButtonBuyItNow = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_productButtonBuyItNow";
  var id = "f5SUHjESq88WopV_productButtonBuyItNow";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var scrollIntoViewActive = 'false' == 'true';
    var animationActive = 'false' == 'true';
    var animationHoverActive = 'false' == 'true';
    var scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var mode = 'production';
    var previewSoldOut = 'false';
    var actions = '[{"control":{"attribute":"pickLinkButton","goToProductPage":true,"id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"#"},"event":"click","id":1}]';
    
    var activeButtonFixContent = "false" === "true";
    var buttonFixContent = "Buy [!quantity!] items";
    var disableListenSoldOut = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_productButtonBuyItNow",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        };
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settings);
      }
    }

    function eventChangeTextInIframe() {
      
    }

    function eventListenSoldOut() {
      if (mode !== "production") {
        if (previewSoldOut === "false") {
          window.SOLID.library.gtBuyProductListenSoldOut({
            $element: $($element)[0],
            options: {
              isButtonAddToCard: true,
              textAddToCard: "ORDER NOW",
              textSoldOut: "Sold out",
            },
            mode: "dev"
          });
        }
      } else {
        window.SOLID.library.gtBuyProductListenSoldOut({
          $element: $($element)[0],
          options: {
            isButtonAddToCard: true,
            textAddToCard: "ORDER NOW",
            textSoldOut: "Sold out",
          },
        });
      }
    }

    function addActionEvent() {
      // function customEvent(actions,id,key)
      if (mode === "production") {
        $($element).customEvent(
          JSON.parse(actions),
          'f5SUHjESq88WopV_productButtonBuyItNow' + '_' + indexEl
        );
      }
      /*Listenifisbuttonaddtocard*/
      store.subscribe(
        "loading-buy-now-f5SUHjESq88WopV_productButtonBuyItNow" + "_" + indexEl,
        function(isDisplay) {
          const $loadingEl = $($element).find(
            ".atom-button-loading-circle-loader"
          );
          const $textEl = $($element).find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              store.dispatch("loading-buy-now-f5SUHjESq88WopV_productButtonBuyItNow", "");
              store.dispatch("loading-buy-now-f5SUHjESq88WopV_productButtonBuyItNow" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl
                .find(".atom-button-loading-check-mark")
                .css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl
                  .find(".atom-button-loading-check-mark")
                  .removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                store.dispatch("loading-buy-now-f5SUHjESq88WopV_productButtonBuyItNow", "");
                store.dispatch("loading-buy-now-f5SUHjESq88WopV_productButtonBuyItNow" + "_" + indexEl, "");
              }, 3000);
            }
          }
        }
      );
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    if (activeButtonFixContent) {
      initFixContent();
    }
    addInteraction();
    addActionEvent();
    if (!disableListenSoldOut) {
      eventListenSoldOut();
    }
    eventChangeTextInIframe();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      eventListenSoldOut,
    };
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    var public = script($target, indexEl);
    window.SOLID.public = window.SOLID.public || {};
    window.SOLID.public["atom" + "_" + id + "_" + indexEl] = public;
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_productButtonBuyItNow()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_productButtonBuyItNow" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_serviceList = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_serviceList";
  var id = "f5SUHjESq88WopV_serviceList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_serviceList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_serviceList()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_serviceList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_serviceListItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_serviceListItem_0";
  var id = "f5SUHjESq88WopV_serviceListItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_serviceListItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_serviceListItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_serviceListItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_iconService_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_iconService_0";
  var id = "f5SUHjESq88WopV_iconService_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_iconService_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_iconService_0()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_iconService_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_messageService_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_messageService_0";
  var id = "f5SUHjESq88WopV_messageService_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_messageService_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "f5SUHjESq88WopV_messageService_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_messageService_0()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_messageService_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_serviceListItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_serviceListItem_1";
  var id = "f5SUHjESq88WopV_serviceListItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_serviceListItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_serviceListItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_serviceListItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_iconService_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_iconService_1";
  var id = "f5SUHjESq88WopV_iconService_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "f5SUHjESq88WopV_iconService_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_iconService_1()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_iconService_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_messageService_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_messageService_1";
  var id = "f5SUHjESq88WopV_messageService_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_messageService_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "f5SUHjESq88WopV_messageService_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_messageService_1()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_messageService_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomf5SUHjESq88WopV_textNote = function() {
          (function() {
  var elementClassName = ".gt_atom-f5SUHjESq88WopV_textNote";
  var id = "f5SUHjESq88WopV_textNote";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "f5SUHjESq88WopV_textNote",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "f5SUHjESq88WopV_textNote",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomf5SUHjESq88WopV_textNote()
      } catch(e) {
        console.error("Error ESAtom Id: f5SUHjESq88WopV_textNote" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionu3KiqnWLI5DwNuS = function() {
          (function() {
  var elementClassName = ".gt_section-u3KiqnWLI5DwNuS";
  var id = "u3KiqnWLI5DwNuS";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    /* store get state block script */
    /* methods block script */
    function addClassSticky() {
      var windowWidth = $(window).width();
      var windowCheckSticky = "disable";
      if (windowWidth <= 992) {
        windowCheckSticky = "disable";
      } else {
        windowCheckSticky = "disable";
      }

      $(window).off("scroll.scrollTopBaru3KiqnWLI5DwNuS").on("scroll.scrollTopBaru3KiqnWLI5DwNuS", function() {
        var scrollTop = $(document).scrollTop();
        if (scrollTop > 1) {
          if (windowCheckSticky === "enable") {
            $element.addClass("gt_sticky--top");
          } else {
            $element.removeClass("gt_sticky--top");
          }
        } else {
          $element.removeClass("gt_sticky--top");
        }
      });
    }
    /* init block script */
    addClassSticky();
    var delay = 0;
    $(window).off("resize.checkSwitchScreensu3KiqnWLI5DwNuS").on("resize.checkSwitchScreensu3KiqnWLI5DwNuS", function() {
      clearTimeout(delay);
      delay = setTimeout(function() {
        addClassSticky();
      }, 100);
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESSectionu3KiqnWLI5DwNuS()
      } catch(e) {
        console.error("Error ESSection Id: u3KiqnWLI5DwNuS" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_boxTopbar = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_boxTopbar";
  var id = "u3KiqnWLI5DwNuS_boxTopbar";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "u3KiqnWLI5DwNuS_boxTopbar",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_boxTopbar()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_boxTopbar" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_iconSocial = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_iconSocial";
  var id = "u3KiqnWLI5DwNuS_iconSocial";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "u3KiqnWLI5DwNuS_iconSocial",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_iconSocial()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_iconSocial" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_iconSocialItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_iconSocialItem_0";
  var id = "u3KiqnWLI5DwNuS_iconSocialItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "u3KiqnWLI5DwNuS_iconSocialItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_iconSocialItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_iconSocialItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_iconSocialItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_iconSocialItem_1";
  var id = "u3KiqnWLI5DwNuS_iconSocialItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "u3KiqnWLI5DwNuS_iconSocialItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_iconSocialItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_iconSocialItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_iconSocialItem_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_iconSocialItem_2";
  var id = "u3KiqnWLI5DwNuS_iconSocialItem_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "u3KiqnWLI5DwNuS_iconSocialItem_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_iconSocialItem_2()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_iconSocialItem_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_boxShipping = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_boxShipping";
  var id = "u3KiqnWLI5DwNuS_boxShipping";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "u3KiqnWLI5DwNuS_boxShipping",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_boxShipping()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_boxShipping" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_messageShipping = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_messageShipping";
  var id = "u3KiqnWLI5DwNuS_messageShipping";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "u3KiqnWLI5DwNuS_messageShipping",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "u3KiqnWLI5DwNuS_messageShipping",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_messageShipping()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_messageShipping" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_boxAccount = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_boxAccount";
  var id = "u3KiqnWLI5DwNuS_boxAccount";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "u3KiqnWLI5DwNuS_boxAccount",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_boxAccount()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_boxAccount" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomu3KiqnWLI5DwNuS_accountTopBar = function() {
          (function() {
  var elementClassName = ".gt_atom-u3KiqnWLI5DwNuS_accountTopBar";
  var id = "u3KiqnWLI5DwNuS_accountTopBar";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "u3KiqnWLI5DwNuS_accountTopBar",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomu3KiqnWLI5DwNuS_accountTopBar()
      } catch(e) {
        console.error("Error ESAtom Id: u3KiqnWLI5DwNuS_accountTopBar" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSection83qiOcJRsmpGDrL = function() {
          
        }
        funcESSection83qiOcJRsmpGDrL()
      } catch(e) {
        console.error("Error ESSection Id: 83qiOcJRsmpGDrL" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_contentBox = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_contentBox";
  var id = "83qiOcJRsmpGDrL_contentBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "83qiOcJRsmpGDrL_contentBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_contentBox()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_contentBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_headingColumn = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_headingColumn";
  var id = "83qiOcJRsmpGDrL_headingColumn";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "83qiOcJRsmpGDrL_headingColumn",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_headingColumn()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_headingColumn" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_headingText";
  var id = "83qiOcJRsmpGDrL_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "83qiOcJRsmpGDrL_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "83qiOcJRsmpGDrL_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_mainBox = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_mainBox";
  var id = "83qiOcJRsmpGDrL_mainBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "83qiOcJRsmpGDrL_mainBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_mainBox()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_mainBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_messageText";
  var id = "83qiOcJRsmpGDrL_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "83qiOcJRsmpGDrL_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "83qiOcJRsmpGDrL_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_listImage = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_listImage";
  var id = "83qiOcJRsmpGDrL_listImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "83qiOcJRsmpGDrL_listImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_listImage()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_listImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_boxImage1 = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_boxImage1";
  var id = "83qiOcJRsmpGDrL_boxImage1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "83qiOcJRsmpGDrL_boxImage1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_boxImage1()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_boxImage1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_image1 = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_image1";
  var id = "83qiOcJRsmpGDrL_image1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "83qiOcJRsmpGDrL_image1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_image1()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_image1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_messageImage1 = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_messageImage1";
  var id = "83qiOcJRsmpGDrL_messageImage1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "83qiOcJRsmpGDrL_messageImage1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "83qiOcJRsmpGDrL_messageImage1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_messageImage1()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_messageImage1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_boxImage2 = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_boxImage2";
  var id = "83qiOcJRsmpGDrL_boxImage2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "83qiOcJRsmpGDrL_boxImage2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_boxImage2()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_boxImage2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_image2 = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_image2";
  var id = "83qiOcJRsmpGDrL_image2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "83qiOcJRsmpGDrL_image2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_image2()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_image2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom83qiOcJRsmpGDrL_messageImage2 = function() {
          (function() {
  var elementClassName = ".gt_atom-83qiOcJRsmpGDrL_messageImage2";
  var id = "83qiOcJRsmpGDrL_messageImage2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "83qiOcJRsmpGDrL_messageImage2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "83qiOcJRsmpGDrL_messageImage2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom83qiOcJRsmpGDrL_messageImage2()
      } catch(e) {
        console.error("Error ESAtom Id: 83qiOcJRsmpGDrL_messageImage2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionNjsVetS6K5VmkjP = function() {
          
        }
        funcESSectionNjsVetS6K5VmkjP()
      } catch(e) {
        console.error("Error ESSection Id: NjsVetS6K5VmkjP" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_box = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_box";
  var id = "NjsVetS6K5VmkjP_box";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_box",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function checkRemoteDefaultInput() {
      if (isExistAtomVariant()) {
        var $inputVariantDefault = $element.find(".gt_variant-input--default");
        if ($inputVariantDefault && $inputVariantDefault.length) {
          $($inputVariantDefault[0]).remove()
        }
      }

      if (isExistAtomQuantity()) {
        var $inputQuantityDefault = $element.find(".gt_quantity-input--default");
        if ($inputQuantityDefault && $inputQuantityDefault.length) {
          $($inputQuantityDefault[0]).remove()
        }
      }
    }

    function isExistAtomVariant() {
      var $atomProduct = $element.find(".gt_variant--input")
      if ($atomProduct && $atomProduct.length) {
        return true
      }
      return false
    }

    function isExistAtomQuantity() {
      var $atomQuantity = $element.find(".gt_quantity--input")
      if ($atomQuantity && $atomQuantity.length) {
        return true
      }
      return false
    }
    /* init block script */
    addInteraction();
    checkRemoteDefaultInput();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_box()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_box" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_boxInfoTop = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_boxInfoTop";
  var id = "NjsVetS6K5VmkjP_boxInfoTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_boxInfoTop",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_boxInfoTop()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_boxInfoTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productTitleTop = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productTitleTop";
  var id = "NjsVetS6K5VmkjP_productTitleTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_productTitleTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_productTitleTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productTitleTop()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productTitleTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_boxPriceTop = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_boxPriceTop";
  var id = "NjsVetS6K5VmkjP_boxPriceTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_boxPriceTop",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_boxPriceTop()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_boxPriceTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productPriceTop = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productPriceTop";
  var id = "NjsVetS6K5VmkjP_productPriceTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!price!]"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_productPriceTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_productPriceTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-price-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-price-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    };
    $element.gtProductPrice({
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityPrice: syncQuantityandPrice,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productPriceTop()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productPriceTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productComparePriceTop = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productComparePriceTop";
  var id = "NjsVetS6K5VmkjP_productComparePriceTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_productComparePriceTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_productComparePriceTop",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    $element.gtProductPrice({
      classComparePrice: ".gt_product-price--compare",
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityComparePrice: syncQuantityandPrice,
      replacePriceForCurrentPrice: false,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productComparePriceTop()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productComparePriceTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productTagSaleTop = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productTagSaleTop";
  var id = "NjsVetS6K5VmkjP_productTagSaleTop";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const roundPercent = Number("0");
    const removeZeros = "true" === "true";
    /* store get state block script */
    /* methods block script */
    /* init block script */
    window.SOLID.library.gtProductSaveV2({
      $element: $element,
      settings: {
        classTextPercent: ".gt_product-tag-sale--value--percent",
        classTextNumber: ".gt_product-tag-sale--value--number",
        dataFormat: "[!Profit!] OFF",
        dataFormatKey: "[!Profit!]",
        customCurrencyFormating: "shortPrefix",
        roundPercent: roundPercent,
        roundNoZeroes: removeZeros
      }
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productTagSaleTop()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productTagSaleTop" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_boxImage = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_boxImage";
  var id = "NjsVetS6K5VmkjP_boxImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_boxImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_boxImage()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_boxImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productImageList = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productImageList";
  var id = "NjsVetS6K5VmkjP_productImageList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var mode = "production";
    var checkWindowWidth = $(window).width();
    var widthSliderCurrent;
    var sizeIconDotsCurrent;
    var imageListPositionCurrent;
    var $imgSlide = $element.find(".gt_product-carousel-box");
    var $imgBox = $element.find(".gt_product-img-box");
    var $imgBoxInner = $element.find(".gt_product-img--inner");
    var $imgSlideItem = $element.find(".gt_product-carousel--item");
    var $productImgInner = $element.find(".gt_product-image--thumb");
    var $controlNext = $element.find(".gt_product--swiper .gt_control-next");
    var $controlPrev = $element.find(".gt_product--swiper .gt_control-prev");
    var dynamicDotsOnOff = "false" === "true";
    var slidesPerView_lg = "5";
    var slidesPerView_md = "5";
    var slidesPerView_sm = "5";
    var slidesPerView_xs = "5";
    var spaceBetween_lg = parseInt("16") || 1;
    var spaceBetween_md = parseInt("16") || 1;
    var spaceBetween_sm = parseInt("14") || 1;
    var spaceBetween_xs = parseInt("14") || 1;
    var widthActive = "false" === "true";
    var widthSlider = "100%";
    var widthSlider_lg = "100%";
    var widthSlider_md = "100%";
    var widthSlider_sm = "100%";
    var widthSlider_xs = "100%";
    var sizeIconDots_sm = "20px";
    var sizeIconDots_xs = "15px";
    var imageRadio = "square";
    var hideDisplayProductImageAdvanced = "false" === "true";
    let initShowFeatureImage = false;
    let initShow3DModel = false;
    let initShowExVideo = false;
    let initShowOtherVideo = false;
    if (hideDisplayProductImageAdvanced) {
      initShowFeatureImage = "featureImage" === "featureImage";
    } else {
      initShowFeatureImage = "featureImageAdvanced" === "featureImageAdvanced";
      initShow3DModel = "featureImageAdvanced" === "3DModel";
      initShowExVideo = "featureImageAdvanced" === "exVideo";
      initShowOtherVideo = "featureImageAdvanced" === "otherVideo";
    }
    var imageListPosition = "bottom";
    var imageListPosition_lg = "bottom";
    var imageListPosition_md = "bottom";
    var imageListPosition_sm = "bottom";
    var imageListPosition_xs = "bottom";
    var imageListActive = "true" === "true";
    var spaceBetween_sm = "14";
    var spaceBetween_xs = "14";
    var scaleZoomImageActive = "true" === "true";
    var mySwiper;
    var mySwiperFeature;
    var spacingSmall = "16px";
    var displayTypeThumb = "thumb" === "thumb";
    var displayTypeCenter = "thumb" === "center";
    var allowDragSlider = "true" === "true";
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var featuredImage = $(elementClassName).find(".gt_product-img--inner img");
      var itemImage = $(elementClassName).find(".gt_product-carousel-box img");
      var widthFeaturedImage = featuredImage.width();
      var heightFeaturedImage = featuredImage.height();
      var widthItemImage = itemImage.width();
      var heightItemImage = itemImage.height();
      featuredImage.attr("width", widthFeaturedImage);
      featuredImage.attr("height", heightFeaturedImage);
      itemImage.attr("width", widthItemImage);
      itemImage.attr("height", heightItemImage);
    }

    function checkEnableEffectZoomImage() {
      if (scaleZoomImageActive) {
        var productImageFeature = $element.find(".gt_product-image--feature");
        if (productImageFeature && productImageFeature.length) {
          $element.find(".gt_product-image--scale").gfProductZoomImage({
            classHoverItem: ".gt_product-img-box",
            scale: "1.5",
            classSection: ".gt_atom-NjsVetS6K5VmkjP_productImageList",
          });
        }
      }
    }

    function listen() {
      listenElementResizeEvent();
      listenWindowResizeEvent();
    }

    function listenElementResizeEvent() {
      let observer = new ResizeObserver(() => {
        if (mySwiper) {
          mySwiper.update()
        }
      })
      observer.observe($element[0]);
    }

    function listenWindowResizeEvent() {
      var delayResize = 0;
      $(window).off("resize.checkSwitchScreensNjsVetS6K5VmkjP_productImageList").on("resize.checkSwitchScreensNjsVetS6K5VmkjP_productImageList", function() {
        clearTimeout(delayResize);
        delayResize = setTimeout(function() {
          const windowWidthCurrent = $(window).width();
          if (windowWidthCurrent !== checkWindowWidth) {
            checkWindowWidth = windowWidthCurrent;
            widthSliderCurrent = 0;
            sizeIconDotsCurrent = 0;
            if (checkWindowWidth <= 576) {
              widthSliderCurrent = widthSlider_xs;
              sizeIconDotsCurrent = sizeIconDots_xs;
            } else if (checkWindowWidth <= 992) {
              widthSliderCurrent = widthSlider_sm;
              sizeIconDotsCurrent = sizeIconDots_sm;
            } else if (checkWindowWidth <= 1200) {
              widthSliderCurrent = widthSlider_md;
            } else {
              widthSliderCurrent = widthSlider;
            }
            if (widthActive) {
              $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
              mySwiper.update();
            }
            var $paginationItem = $element.find(".gt_control-pagination-item");
            var $paginationItemIcon = $element.find(".gt_control-pagination-item .gt_icon");
            $paginationItemIcon.css("cssText", "width: " + sizeIconDotsCurrent + " !important; height: " + sizeIconDotsCurrent + "!important;");
            $paginationItem.css("cssText", "width: calc(8px + " + sizeIconDotsCurrent + ") !important; height: calc(8px + " + sizeIconDotsCurrent + ") !important;");

            checkImageListPosition();
            calculatorImageSlideHeight();
            checkImageListActive();
            initSlider();
          }
        }, 100)
      });
      if ($element.find(".swiper-slide").length == 1) {
        $element.find('.swiper-wrapper').addClass("gt_disabled");
        $element.find('.gt_control-pagination').addClass("gt_disabled");
      }
    }

    function autoRotateModel() {
      var model = $element.find(".gt_product-media--feature .gt_product-model");
      model.attr("auto-rotate", true);
    }

    function initSlider() {
      if (mySwiper) {
        mySwiper.destroy();
        checkDimensions();
      }
      var $swiperContainer = $element.find(".gt_product--swiper-NjsVetS6K5VmkjP_productImageList");
      if (!$swiperContainer || !$swiperContainer.length) {
        return;
      }
      if ($swiperContainer[0].swiper) {
        $swiperContainer[0].swiper.destroy();
      }
      if (mySwiperFeature) {
        mySwiperFeature.destroy();
      }
      if ($swiperContainer.find(".swiper-slide").length == 1) {
        $swiperContainer.addClass("gt_disabled");
      }
      var $swiperContainerFeature = $element.find(".gt_product-feature--swiper-NjsVetS6K5VmkjP_productImageList");
      if (!$swiperContainerFeature || !$swiperContainerFeature.length) {
        return;
      }
      if ($swiperContainerFeature[0].swiper) {
        $swiperContainerFeature[0].swiper.destroy();
      }
      if ($swiperContainerFeature.find(".swiper-slide").length == 1) {
        $swiperContainerFeature.find(".swiper-wrapper").addClass("gt_disabled");
        $swiperContainerFeature.find(".gt_control-pagination").addClass("gt_disabled");
      }
      let gtProductImageParams = {
        $element: $element,
        settings: {
          classSwiperItems: ".gt_product--swiper-NjsVetS6K5VmkjP_productImageList .gt_product-carousel--item",
          classSwiperItemsImage: ".gt_product--swiper-NjsVetS6K5VmkjP_productImageList .gt_product-carousel--item img",
          classSwiperContainer: ".gt_product--swiper-NjsVetS6K5VmkjP_productImageList",
          initShowFeatureImage: initShowFeatureImage,
          initShow3DModel: initShow3DModel,
          initShowExVideo: initShowExVideo,
          initShowOtherVideo: initShowOtherVideo,
          swiperSetting: getDataSwiperSettings(),
          //featureimageswiper
          featureSwiperSetting: getDataSwiperSettingsFeature(),
          classFeatureSwiperContainer: ".gt_product-feature--swiper-NjsVetS6K5VmkjP_productImageList",
          classFeatureSwiperItemsImage: ".gt_product-feature--swiper-NjsVetS6K5VmkjP_productImageList .gt_product-image--feature",
        }
      }
      window.SOLID.library.gtProductImagesV2(gtProductImageParams);
      mySwiper = $swiperContainer[0].swiper;
      mySwiperFeature = $swiperContainerFeature[0].swiper;
    }

    function getDataSwiperSettings() {
      let direction = 'horizontal';
      if (displayTypeThumb) {
        if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
          direction = "vertical";
        }
      }

      let loop = false;
      let centeredSlides = false;
      let freeMode = true;
      if (displayTypeCenter && checkWindowWidth > 992) {
        loop = true;
        centeredSlides = true;
        freeMode = false;
      }
      return {
        mousewheel: false,
        loop: loop,
        centeredSlides: centeredSlides,
        slidesPerView: 3,
        spaceBetween: 16,
        freeMode: freeMode,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".gt_product--swiper-NjsVetS6K5VmkjP_productImageList .gt_control-next",
          prevEl: ".gt_product--swiper-NjsVetS6K5VmkjP_productImageList .gt_control-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: slidesPerView_xs,
            spaceBetween: spaceBetween_xs,
            direction: direction,
            mousewheel: false,
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          577: {
            slidesPerView: slidesPerView_sm,
            spaceBetween: spaceBetween_sm,
            direction: direction,
            mousewheel: false,
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          993: {
            slidesPerView: slidesPerView_md,
            spaceBetween: spaceBetween_md,
            direction: direction,
            mousewhel: true,
          },
          1201: {
            slidesPerView: slidesPerView_lg,
            spaceBetween: spaceBetween_lg,
            direction: direction,
            mousewhel: true,
          }
        },
        on: {
          init: function() {
            window.SOLID.store.dispatch("trigger-lazyload", true);
          },
          imagesReady: function() {
            if (displayTypeCenter && checkWindowWidth > 992) {
              setTimeout(() => {
                var $swiperWrapperHide = $element.find(".gt_swiper_wrapper-type-center");
                if ($swiperWrapperHide && $swiperWrapperHide.length) {
                  $swiperWrapperHide.removeClass("gt_swiper_wrapper-type-center");
                }
              }, 100)
            }
          }
        },
      }
    }

    function getDataSwiperSettingsFeature() {
      let allowTouchMove = false;
      var productImageFeature = $element.find(".gt_product-image--feature");
      if (allowDragSlider && !productImageFeature.hasClass("gt_product-media--model") || displayTypeCenter) {
        allowTouchMove = true;
      }
      return {
        allowTouchMove: allowTouchMove,
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: ".gt_product-feature--swiper-NjsVetS6K5VmkjP_productImageList .gt_product-img-nav--right",
          prevEl: ".gt_product-feature--swiper-NjsVetS6K5VmkjP_productImageList .gt_product-img-nav--left",
        },
        pagination: {
          el: "#gt_control-pagination-NjsVetS6K5VmkjP_productImageList",
          type: 'bullets',
          clickable: true,
          renderBullet: function(index, classname) {
            return `<div class="gt_control-pagination-item ` + classname + ` ">
            <span data-optimize-type="icon"  data-attribute="iconDots,"  data-section-id="NjsVetS6K5VmkjP_productImageList"  class="gt_icon"><svg height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 22C13.05 22 13.5 21.55 13.5 21V3C13.5 2.45 13.05 2 12.5 2C11.95 2 11.5 2.45 11.5 3V21C11.5 21.55 11.95 22 12.5 22ZM8.5 18C9.05 18 9.5 17.55 9.5 17V7C9.5 6.45 9.05 6 8.5 6C7.95 6 7.5 6.45 7.5 7V17C7.5 17.55 7.95 18 8.5 18ZM5.5 13C5.5 13.55 5.05 14 4.5 14C3.95 14 3.5 13.55 3.5 13V11C3.5 10.45 3.95 10 4.5 10C5.05 10 5.5 10.45 5.5 11V13ZM16.5 18C17.05 18 17.5 17.55 17.5 17V7C17.5 6.45 17.05 6 16.5 6C15.95 6 15.5 6.45 15.5 7V17C15.5 17.55 15.95 18 16.5 18ZM19.5 13V11C19.5 10.45 19.95 10 20.5 10C21.05 10 21.5 10.45 21.5 11V13C21.5 13.55 21.05 14 20.5 14C19.95 14 19.5 13.55 19.5 13Z" fill="currentColor"/> </svg></span>
          </div>`;
          }
        },
        breakpoints: {
          0: {
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          577: {
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          }
        },
      }
    }

    function changeSliderActive(value) {
      if (value && value.sliderIndex !== NaN) {
        if (loop) {
          mySwiper.slideToLoop(value.sliderIndex, 500, true);
        } else {
          mySwiper.slideTo(value.sliderIndex, 500, true);
        }
      }
    }

    function isImgSliderBottom() {
      const $productImage = $element.find(".gt_product-image-list--bottom");
      if ($productImage && $productImage.length) {
        return true;
      }
      return false;
    }

    function checkImageListActive() {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        if (imageListActive) {
          slidesPerView_xs = "5";
          spaceBetween_xs = "14";
        } else if (!imageListActive) {
          slidesPerView_xs = 1;
          spaceBetween_xs = 0;
        }
      } else if (checkWindowWidth <= 992) {
        if (imageListActive) {
          slidesPerView_sm = "5";
          spaceBetween_sm = "14"
        } else if (!imageListActive) {
          slidesPerView_sm = 1;
          spaceBetween_sm = 0;
        }
      }
    }

    function calculatorImageSlideHeight() {
      var delay = setTimeout(function() {
        checkWindowWidth = $(window).width();
        if (!isImgSliderBottom()) {
          $imgBox = $element.find(".gt_product-img-box");
          var imgBoxHeight = $imgBox && $imgBox.length && $imgBox[0].offsetHeight;
          $imgSlide.css("height", imgBoxHeight);
          mySwiper.update();
        } else {
          $imgSlide.css("height", "");
        }
      }, 500);
    }

    function optimizeSizeIconDots(value) {
      mySwiper.pagination.render();
      var $paginationItem = $element.find(".gt_control-pagination-item");
      var $paginationItemIcon = $element.find(".gt_control-pagination-item .gt_icon");
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        sizeIconDots_xs = value;
      } else if (checkWindowWidth <= 992) {
        sizeIconDots_sm = value;
      }
      $paginationItemIcon.css("cssText", "width: " + value + " !important; height: " + value + "!important;");
      $paginationItem.css("cssText", "width: calc(8px + " + value + ") !important; height: calc(8px + " + value + ") !important;");
      mySwiper.pagination.update();
    }

    function optimizeSlidePerView(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        slidesPerView_xs = value;
      } else if (checkWindowWidth <= 992) {
        slidesPerView_sm = value;
      } else if (checkWindowWidth <= 1200) {
        slidesPerView_md = value;
      } else {
        slidesPerView_lg = value;
      }
      initSlider();
    }

    function optimizeWidthSlider(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        widthSlider_xs = value;
      } else if (checkWindowWidth <= 992) {
        widthSlider_sm = value;
      } else if (checkWindowWidth <= 1200) {
        widthSlider_md = value;
      } else {
        widthSlider_lg = widthSlider = value;
      }
      $element.css("cssText", "width: " + value + " !important;");
      mySwiper.update();
      calculatorImageSlideHeight();
    }

    function optimizeWidthActive(value) {
      widthActive = value;
      if (!value) {
        $element.css("cssText", "width: null");
      } else {
        checkWindowWidth = $(window).width();
        widthSliderCurrent = 0;
        if (checkWindowWidth <= 576) {
          widthSliderCurrent = widthSlider_xs;
        } else if (checkWindowWidth <= 992) {
          widthSliderCurrent = widthSlider_sm;
        } else if (checkWindowWidth <= 1200) {
          widthSliderCurrent = widthSlider_md;
        } else {
          widthSliderCurrent = widthSlider;
        }
        $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
        initSlider();
        mySwiper.update();
      }
    }

    function checkImageListPosition({
      isInit
    } = {}) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        imageListPositionCurrent = imageListPosition_xs;
        spacingSmall = "10px";
      } else if (checkWindowWidth <= 992) {
        imageListPositionCurrent = imageListPosition_sm;
        spacingSmall = "16px";
      } else if (checkWindowWidth <= 1200) {
        imageListPositionCurrent = imageListPosition_md;
        spacingSmall = "16px";
      } else {
        imageListPositionCurrent = imageListPosition;
        spacingSmall = "16px";
      }
      $element.find("#gt_product-image-list-id").attr("class", "gt_product-image-list--" + imageListPositionCurrent);
      //showimage
      var $swiperWrapperHide = $element.find(".gt-carousel--hide-default");
      var $productImageList = $element.find("#gt_product-image-list-id");
      if ($swiperWrapperHide && $swiperWrapperHide.length) {
        $swiperWrapperHide.removeClass("gt-carousel--hide-default");
        $productImageList.css("height", "auto");
      }
      if (imageListPositionCurrent !== "bottom") {
        var $productImageListWrapper = $element.find(".gt_product-carousel-box");
        var $productImageBox = $element.find(".gt_product-image--inner");
        $productImageListWrapper.css("height", $productImageBox.outerHeight());
      }
      //css
      if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
        $controlNext.css({
          "height": "auto",
          "width": "100%"
        });
        $controlPrev.css({
          "height": "auto",
          "width": "100%"
        });
      }
      if (imageListPositionCurrent === "left") {
        $productImgInner.css("flex-direction", "row-reverse");
        $imgSlide.css({
          "padding-left": "0",
          "padding-right": spacingSmall
        });
      } else if (imageListPositionCurrent === "right") {
        $productImgInner.css("flex-direction", "row");
        $imgSlide.css({
          "padding-right": "0",
          "padding-left": spacingSmall
        });
      } else {
        $productImgInner.css("flex-direction", "column");
        $imgSlide.css("padding", "");
        $controlNext.css({
          "height": "100%",
          "width": "auto"
        });
        $controlPrev.css({
          "height": "100%",
          "width": "auto"
        });
      }
      if (!isInit) {
        initSlider();
        mySwiper.update();
      }
    }

    function optimizeImageListPosition(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        imageListPosition_xs = imageListPositionCurrent = value;
      } else if (checkWindowWidth <= 992) {
        imageListPosition_sm = imageListPositionCurrent = value;
      } else if (checkWindowWidth <= 1200) {
        imageListPosition_md = imageListPositionCurrent = value;
      } else {
        imageListPosition_lg = imageListPositionCurrent = imageListPosition = value;
      }
      if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
        $controlNext.css({
          "height": "auto",
          "width": "100%"
        });
        $controlPrev.css({
          "height": "auto",
          "width": "100%"
        });
      }
      if (imageListPositionCurrent === "left") {
        $productImgInner.css("flex-direction", "row-reverse");
        $imgSlide.css({
          "padding-left": "0",
          "padding-right": spacingSmall
        });
      } else if (imageListPositionCurrent === "right") {
        $productImgInner.css("flex-direction", "row");
        $imgSlide.css({
          "padding-right": "0",
          "padding-left": spacingSmall
        });
      } else {
        $productImgInner.css("flex-direction", "column");
        $imgSlide.css("padding", "");
        $controlNext.css({
          "height": "100%",
          "width": "auto"
        });
        $controlPrev.css({
          "height": "100%",
          "width": "auto"
        });
      }
      $element.find("#gt_product-image-list-id").attr("class", "gt_product-image-list--" + value);
      initSlider();
      mySwiper.update();
      calculatorImageSlideHeight();
    }

    function optimizeImageRadio(imageRadio) {
      checkWindowWidth = $(window).width();
      imageRadio = value;
      if (imageRadio === "square") {
        $imgBoxInner.css("padding-top", "calc(100%)");
      } else if (imageRadio === "landscape") {
        $imgBoxInner.css("padding-top", "calc(100% * 3 / 4)");
      } else if (imageRadio === "portrait") {
        $imgBoxInner.css("padding-top", "calc(100% * 4 / 3)");
      }
      if (isImgSliderBottom() || checkWindowWidth < 992) {
        if (imageRadio === "square") {
          $imgSlideItem.css("padding-top", "calc(100%)");
        } else if (imageRadio === "landscape") {
          $imgSlideItem.css("padding-top", "calc(100% * 3 / 4)");
        } else if (imageRadio === "portrait") {
          $imgSlideItem.css("padding-top", "calc(100% * 4 / 3)");
        }
      }
      calculatorImageSlideHeight();
    }

    function optimizeImageRadioActive(value) {
      if (!value) {
        $imgBoxInner.css("padding-top", "");
        $imgSlideItem.css("padding-top", "");
      } else {
        optimizeImageRadio(imageRadio);
      }
      calculatorImageSlideHeight();
    }

    function optimizeDynamicDotsOnOff(value) {
      dynamicDotsOnOff = value;
      initSlider();
      var paginationEl = mySwiperFeature.pagination.el;
      if (value) {
        paginationEl.style.cssText = paginationEl.style.cssText + "margin: 0px auto; transform: translateX(0px); justify-content: unset;";
      } else {
        paginationEl.style.cssText = paginationEl.style.cssText + "justify-content: center;";
        paginationEl.classList.remove("swiper-pagination-bullets-dynamic");
      }
      mySwiperFeature.pagination.update();
      mySwiperFeature.update();
    }

    function getMySwiper() {
      return mySwiper;
    }

    function getMySwiperFeature() {
      return mySwiperFeature;
    }
    /* init block script */
    checkDimensions();
    checkImageListPosition({
      isInit: true
    });
    checkImageListActive();
    initSlider();
    calculatorImageSlideHeight();
    checkEnableEffectZoomImage();
    autoRotateModel();
    listen();
    /* store subscribe block script */
    store.subscribe("optimize-NjsVetS6K5VmkjP_productImageList-sizeIconDots", optimizeSizeIconDots);
    store.subscribe("optimal-NjsVetS6K5VmkjP_productImageList-slidesPerView", optimizeSlidePerView);
    store.subscribe("optimal-NjsVetS6K5VmkjP_productImageList-widthSlider", optimizeWidthSlider);
    store.subscribe("optimal-NjsVetS6K5VmkjP_productImageList-widthActive", optimizeWidthActive);
    store.subscribe("optimal-NjsVetS6K5VmkjP_productImageList-imageRadio", optimizeImageRadio);
    store.subscribe("optimal-NjsVetS6K5VmkjP_productImageList-imageRadioActive", optimizeImageRadioActive);
    store.subscribe("optimal-NjsVetS6K5VmkjP_productImageList-dynamicDotsOnOff", optimizeDynamicDotsOnOff);
    store.subscribe("optimal-NjsVetS6K5VmkjP_productImageList-imageListPosition", optimizeImageListPosition);
    store.subscribe("trigger-slider-NjsVetS6K5VmkjP_productImageList", changeSliderActive);

    function destroy() {
      store.unsubscribe("optimize-NjsVetS6K5VmkjP_productImageList-sizeIconDots", optimizeSizeIconDots);
      store.unsubscribe("optimal-NjsVetS6K5VmkjP_productImageList-slidesPerView", optimizeSlidePerView);
      store.unsubscribe("optimal-NjsVetS6K5VmkjP_productImageList-widthSlider", optimizeWidthSlider);
      store.unsubscribe("optimal-NjsVetS6K5VmkjP_productImageList-widthActive", optimizeWidthActive);
      store.unsubscribe("optimal-NjsVetS6K5VmkjP_productImageList-imageRadio", optimizeImageRadio);
      store.unsubscribe("optimal-NjsVetS6K5VmkjP_productImageList-imageRadioActive", optimizeImageRadioActive);
      store.unsubscribe("optimal-NjsVetS6K5VmkjP_productImageList-dynamicDotsOnOff", optimizeDynamicDotsOnOff);
      store.unsubscribe("optimal-NjsVetS6K5VmkjP_productImageList-imageListPosition", optimizeImageListPosition);
      store.unsubscribe("trigger-slider-NjsVetS6K5VmkjP_productImageList", changeSliderActive);
    }
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      initSlider,
      getMySwiper,
      getMySwiperFeature,
      checkImageListPosition,
      calculatorImageSlideHeight,
      checkImageListActive
    };
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      var publicFunc = script($target, indexEl);
      window.SOLID.public = window.SOLID.public || {};
      window.SOLID.public["atom" + "_" + id + "_" + indexEl] = publicFunc;
      if (publicFunc) {
        store.dispatch("public_function_atom_" + id, publicFunc);
      }
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productImageList()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productImageList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productInfoBox = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productInfoBox";
  var id = "NjsVetS6K5VmkjP_productInfoBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_productInfoBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productInfoBox()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productInfoBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_infoBox = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_infoBox";
  var id = "NjsVetS6K5VmkjP_infoBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_infoBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_infoBox()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_infoBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productTitle = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productTitle";
  var id = "NjsVetS6K5VmkjP_productTitle";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_productTitle",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_productTitle",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productTitle()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productTitle" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_boxPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_boxPrice";
  var id = "NjsVetS6K5VmkjP_boxPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_boxPrice",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_boxPrice()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_boxPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productPrice";
  var id = "NjsVetS6K5VmkjP_productPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!price!]"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_productPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_productPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-price-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-price-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    };
    $element.gtProductPrice({
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityPrice: syncQuantityandPrice,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productPrice()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productComparePrice = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productComparePrice";
  var id = "NjsVetS6K5VmkjP_productComparePrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_productComparePrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_productComparePrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    $element.gtProductPrice({
      classComparePrice: ".gt_product-price--compare",
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityComparePrice: syncQuantityandPrice,
      replacePriceForCurrentPrice: false,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productComparePrice()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productComparePrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productTagSale = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productTagSale";
  var id = "NjsVetS6K5VmkjP_productTagSale";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const roundPercent = Number("0");
    const removeZeros = "true" === "true";
    /* store get state block script */
    /* methods block script */
    /* init block script */
    window.SOLID.library.gtProductSaveV2({
      $element: $element,
      settings: {
        classTextPercent: ".gt_product-tag-sale--value--percent",
        classTextNumber: ".gt_product-tag-sale--value--number",
        dataFormat: "[!Profit!] OFF",
        dataFormatKey: "[!Profit!]",
        customCurrencyFormating: "shortPrefix",
        roundPercent: roundPercent,
        roundNoZeroes: removeZeros
      }
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productTagSale()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productTagSale" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_boxGuarantee = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_boxGuarantee";
  var id = "NjsVetS6K5VmkjP_boxGuarantee";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_boxGuarantee",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_boxGuarantee()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_boxGuarantee" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_guaranteeImage = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_guaranteeImage";
  var id = "NjsVetS6K5VmkjP_guaranteeImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_guaranteeImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_guaranteeImage()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_guaranteeImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_textGuarantee = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_textGuarantee";
  var id = "NjsVetS6K5VmkjP_textGuarantee";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_textGuarantee",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_textGuarantee",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_textGuarantee()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_textGuarantee" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productVariant = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productVariant";
  var id = "NjsVetS6K5VmkjP_productVariant";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var $variantChecked = $element.find(".gt_product-variant--checked");
    var $variantOptions = $element.find(".gt_product-variant-options");
    var mode = "production";
    var animationActive = 'false';
    var timeoutTooltip = null;
    var valueInTitleActive = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function animation() {
      if (animationActive === "true") {
        var interactionScrollIntoView =
          '""';
        window.SOLID.library.animation({
          elementId: id,
          $doms: $elements,
          interactionScrollIntoView: {
            value: JSON.parse(interactionScrollIntoView),
            previewAttr: "interactionScrollIntoView",
          },
          animationType: "block",
          mode: mode,
        });
      }
    }

    function initSwatches() {
      window.SOLID.library.gtProductSwatchesV2({
        $element: $element,
        settings: {
          classCurrentValue: ".gt_product-variant-option--selected .gt_product-variant-option--selected-text",
          classItem: ".gt_variant--select-item",
          classInputIdHidden: ".gt_variant--input",
          classBtnSelect: ".gt_product-variant--btn-select",
          classVariantValueInTitle: ".gt_title_value",
        }
      });
    }

    function openSelectDropdown() {
      $variantChecked.removeClass("gt_active");
      var $options = $(this).siblings(".gt_product-variant-options");
      if ($options.hasClass("gt_active")) {
        $options.css("top", "");
        $options.removeClass("gt_active");
        $(this).removeClass("gt_active");
        clearEventShowTooltip();
        $(document).off("mousedown.outsideClickVariantSelect");
      } else {
        $variantOptions.removeClass("gt_active");
        $options.addClass("gt_active");
        $(this).addClass("gt_active");
        var optionsOuterHeight = $options.outerHeight();
        var selectInputHeight = $variantChecked.outerHeight();
        var positionOptions = $options.offset().top - $(document).scrollTop() + optionsOuterHeight;
        var windowHeight = $(window).outerHeight();
        if (positionOptions > windowHeight) {
          const currentTopOptions = $options.css("top");
          const newTop = "calc( " + currentTopOptions + " - " + optionsOuterHeight + "px" + " - " + (Number(selectInputHeight) + 10) + "px" + " )";
          $options.css("top", newTop);
        }
        clearTimeout(timeoutTooltip);
        timeoutTooltip = setTimeout(() => {
          eventShowTooltipSelectType();
        }, 300)
        //addeventclickoutsidetoclose
        const $currentTargetOptions = $(this);
        $(document).off("mousedown.outsideClickVariantSelect").on("mousedown.outsideClickVariantSelect", function(event) {
          if ($options && $options.length && $currentTargetOptions && $currentTargetOptions.length) {
            const $optionsPure = $options[0];
            if ($optionsPure && !$optionsPure.contains(event.target) && !$currentTargetOptions[0].contains(event.target)) {
              $options.css("top", "");
              $options.removeClass("gt_active");
              $currentTargetOptions.removeClass("gt_active");
              clearEventShowTooltip();
              $(document).off("mousedown.outsideClickVariantSelect");
            }
          }
        });
      }
    }

    function onClickSelectDropDown() {
      $variantChecked.removeClass("gt_active");
      $variantOptions.removeClass("gt_active");
      var value = $(this).attr("data-value");
      var $variantCheckedCurrent = $(this).closest(
        ".gt_product-variant--select-box"
      );
      var $valueVariantChecked = $variantCheckedCurrent.find(
        ".gt_product-variant-option--selected .gt_product-variant-option--selected-text"
      );
      var $contentOptionSelect = $(this).html();
      $valueVariantChecked.attr("data-value", value);
      $valueVariantChecked.html($contentOptionSelect);
      //closetooltip
      const $tooltip = $element.find(".gt_product-variant-tooltip");
      $tooltip.css("display", "none");
      clearEventShowTooltip();
    }

    function hideAtomWhenNoVariant() {
      $element.css("display", "");
      var isHide = true;
      var $variantItems = $element.find(".gt_product-variant--item")
      for (var i = 0; i < $variantItems.length; i++) {
        var $item = $($variantItems[i]);
        var display = $item.css("display");
        if (display !== "none") {
          isHide = false;
          break;
        }
      }
      if (isHide) {
        $element.css("display", "none");
      }
    }

    function eventShowTooltipSelectType() {
      const $selectItems = $element.find(".gt_variant--select-item");
      for (var i = 0; i < $selectItems.length; i++) {
        const $selectItem = $($selectItems[i]);
        const $selectOptions = $selectItem.find(".gt_product-variant-option");
        const $tooltip = $selectItem.find(".gt_product-variant-tooltip");
        $selectOptions.off("mouseenter").on("mouseenter", function() {
          //checkoverflow
          const $contentValue = $(this).find(".gt_product-variant-option--txt");
          const cachedDisplayContentValue = $contentValue.css("display");
          $contentValue.css({
            display: "inline",
            overflow: "unset",
            whiteSpace: "nowrap"
          });
          const realWidth = $contentValue.outerWidth();
          $contentValue.css({
            display: cachedDisplayContentValue,
            overflow: "",
            whiteSpace: ""
          });
          //
          const selectOptionTop = this.getBoundingClientRect().top;
          const selectItemTop = $selectItem[0].getBoundingClientRect().top;
          const selectOptionHeight = $(this).outerHeight();
          const selectOptionWidth = $(this).outerWidth();
          const contentSelect = $contentValue.html();
          if (realWidth > selectOptionWidth) {
            $tooltip.find(".gt_product-variant-tooltip-name").html(contentSelect);
            $tooltip.css({
              display: "block",
              top: selectOptionTop - selectItemTop - selectOptionHeight,
              zIndex: 10
            });
            $tooltip.find(".gt_product-variant-tooltip-arrow").css({
              left: selectOptionWidth / 2 + "px",
            })
          }
        });
        $selectOptions.off("mouseleave").on("mouseleave", function() {
          $tooltip.css({
            display: "none"
          })
        });
      }
    }

    function clearEventShowTooltip() {
      const $selectitems = $element.find(".gt_variant--select-item");
      for (var i = 0; i < $selectitems.length; i++) {
        const $selectitem = $($selectitems[i]);
        const $selectoptions = $selectitem.find(".gt_product-variant-option");
        $selectoptions.off("mouseenter");
        $selectoptions.off("mouseleave");
      }
    }
    /* init block script */
    hideAtomWhenNoVariant();
    initSwatches();
    animation();
    /*global blockscript*/
    window.SOLID.store.subscribe("run-script-" + id, () => {
      $elements = document.querySelectorAll(elementClassName);
      main();
    });
    /* store subscribe block script */
    /* events block script */
    var $elements_1 = $element.find(".gt_product-variant--checked");
    $elements_1.off("click.openSelect").on("click.openSelect", openSelectDropdown);
    var $elements_2 = $element.find(".gt_product-variant-option");
    $elements_2.off("click.selectItem").on("click.selectItem", onClickSelectDropDown);
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productVariant()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productVariant" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productQuantity = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productQuantity";
  var id = "NjsVetS6K5VmkjP_productQuantity";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var style = "horizontal";
    var mode = "production";
    var interactionScrollIntoViewActive = "false";
    /* store get state block script */
    /* methods block script */
    function animation() {
      if (interactionScrollIntoViewActive === "true") {
        var interactionScrollIntoView =
          '""';
        var $container = $element.find(".gt_product-quantity");
        window.SOLID.library.animation({
          elementId: id,
          $doms: $container,
          interactionScrollIntoView: {
            value: JSON.parse(interactionScrollIntoView),
            previewAttr: "interactionScrollIntoView",
          },
          animationType: "block",
          mode: mode,
        });
      }
    }

    function initLibrary() {
      var params = {
        $element: $element,
        settings: {
          classInput: "input[name='quantity']",
          classPlus: ".gt_quantity_plus",
          classMinus: ".gt_quantity_minus",
          mode: mode,
        }
      };
      if (style === "horizontal") {
        params = {
          $element: $element,
          settings: {
            classInput: "input[name='quantity']",
            classPlus: ".gt_product-quantity--plus",
            classMinus: ".gt_product-quantity--minus",
            mode: mode,
          }
        };
      }
      window.SOLID.library.gtProductQuantityV2(params);
    }

    function validateInput() {
      var inputQuantity = $element.find("input[name='quantity']");
      inputQuantity.keyup(function() {
        var value = parseInt(this.value);
        if (isNaN(value)) {
          value = 1;
        }
        inputQuantity.attr("value", value).val(value);
      })
    }
    /* init block script */
    initLibrary();
    animation();
    validateInput();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productQuantity()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productQuantity" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_productButtonBuyItNow = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_productButtonBuyItNow";
  var id = "NjsVetS6K5VmkjP_productButtonBuyItNow";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var scrollIntoViewActive = 'false' == 'true';
    var animationActive = 'false' == 'true';
    var animationHoverActive = 'false' == 'true';
    var scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var mode = 'production';
    var previewSoldOut = 'false';
    var actions = '[{"control":{"attribute":"pickLinkButton","goToProductPage":true,"id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"#"},"event":"click","id":1}]';
    
    var activeButtonFixContent = "false" === "true";
    var buttonFixContent = "Buy [!quantity!] items";
    var disableListenSoldOut = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_productButtonBuyItNow",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        };
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settings);
      }
    }

    function eventChangeTextInIframe() {
      
    }

    function eventListenSoldOut() {
      if (mode !== "production") {
        if (previewSoldOut === "false") {
          window.SOLID.library.gtBuyProductListenSoldOut({
            $element: $($element)[0],
            options: {
              isButtonAddToCard: true,
              textAddToCard: "ORDER NOW",
              textSoldOut: "Sold out",
            },
            mode: "dev"
          });
        }
      } else {
        window.SOLID.library.gtBuyProductListenSoldOut({
          $element: $($element)[0],
          options: {
            isButtonAddToCard: true,
            textAddToCard: "ORDER NOW",
            textSoldOut: "Sold out",
          },
        });
      }
    }

    function addActionEvent() {
      // function customEvent(actions,id,key)
      if (mode === "production") {
        $($element).customEvent(
          JSON.parse(actions),
          'NjsVetS6K5VmkjP_productButtonBuyItNow' + '_' + indexEl
        );
      }
      /*Listenifisbuttonaddtocard*/
      store.subscribe(
        "loading-buy-now-NjsVetS6K5VmkjP_productButtonBuyItNow" + "_" + indexEl,
        function(isDisplay) {
          const $loadingEl = $($element).find(
            ".atom-button-loading-circle-loader"
          );
          const $textEl = $($element).find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              store.dispatch("loading-buy-now-NjsVetS6K5VmkjP_productButtonBuyItNow", "");
              store.dispatch("loading-buy-now-NjsVetS6K5VmkjP_productButtonBuyItNow" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl
                .find(".atom-button-loading-check-mark")
                .css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl
                  .find(".atom-button-loading-check-mark")
                  .removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                store.dispatch("loading-buy-now-NjsVetS6K5VmkjP_productButtonBuyItNow", "");
                store.dispatch("loading-buy-now-NjsVetS6K5VmkjP_productButtonBuyItNow" + "_" + indexEl, "");
              }, 3000);
            }
          }
        }
      );
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    if (activeButtonFixContent) {
      initFixContent();
    }
    addInteraction();
    addActionEvent();
    if (!disableListenSoldOut) {
      eventListenSoldOut();
    }
    eventChangeTextInIframe();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      eventListenSoldOut,
    };
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    var public = script($target, indexEl);
    window.SOLID.public = window.SOLID.public || {};
    window.SOLID.public["atom" + "_" + id + "_" + indexEl] = public;
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_productButtonBuyItNow()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_productButtonBuyItNow" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_serviceList = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_serviceList";
  var id = "NjsVetS6K5VmkjP_serviceList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_serviceList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_serviceList()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_serviceList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_serviceListItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_serviceListItem_0";
  var id = "NjsVetS6K5VmkjP_serviceListItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_serviceListItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_serviceListItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_serviceListItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_iconService_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_iconService_0";
  var id = "NjsVetS6K5VmkjP_iconService_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_iconService_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_iconService_0()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_iconService_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_messageService_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_messageService_0";
  var id = "NjsVetS6K5VmkjP_messageService_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_messageService_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_messageService_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_messageService_0()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_messageService_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_serviceListItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_serviceListItem_1";
  var id = "NjsVetS6K5VmkjP_serviceListItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_serviceListItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_serviceListItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_serviceListItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_iconService_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_iconService_1";
  var id = "NjsVetS6K5VmkjP_iconService_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_iconService_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_iconService_1()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_iconService_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_messageService_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_messageService_1";
  var id = "NjsVetS6K5VmkjP_messageService_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_messageService_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_messageService_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_messageService_1()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_messageService_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_textNote = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_textNote";
  var id = "NjsVetS6K5VmkjP_textNote";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_textNote",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_textNote",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_textNote()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_textNote" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_socialBox = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_socialBox";
  var id = "NjsVetS6K5VmkjP_socialBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_socialBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_socialBox()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_socialBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_textShare = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_textShare";
  var id = "NjsVetS6K5VmkjP_textShare";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NjsVetS6K5VmkjP_textShare",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NjsVetS6K5VmkjP_textShare",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_textShare()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_textShare" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_iconTwitter = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_iconTwitter";
  var id = "NjsVetS6K5VmkjP_iconTwitter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_iconTwitter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_iconTwitter()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_iconTwitter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_iconFacebook = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_iconFacebook";
  var id = "NjsVetS6K5VmkjP_iconFacebook";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_iconFacebook",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_iconFacebook()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_iconFacebook" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_iconPrinterest = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_iconPrinterest";
  var id = "NjsVetS6K5VmkjP_iconPrinterest";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_iconPrinterest",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_iconPrinterest()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_iconPrinterest" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNjsVetS6K5VmkjP_iconMail = function() {
          (function() {
  var elementClassName = ".gt_atom-NjsVetS6K5VmkjP_iconMail";
  var id = "NjsVetS6K5VmkjP_iconMail";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NjsVetS6K5VmkjP_iconMail",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNjsVetS6K5VmkjP_iconMail()
      } catch(e) {
        console.error("Error ESAtom Id: NjsVetS6K5VmkjP_iconMail" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionOYx8UsVH0MSCKxb = function() {
          
        }
        funcESSectionOYx8UsVH0MSCKxb()
      } catch(e) {
        console.error("Error ESSection Id: OYx8UsVH0MSCKxb" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomOYx8UsVH0MSCKxb_footerLeft = function() {
          (function() {
  var elementClassName = ".gt_atom-OYx8UsVH0MSCKxb_footerLeft";
  var id = "OYx8UsVH0MSCKxb_footerLeft";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "OYx8UsVH0MSCKxb_footerLeft",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomOYx8UsVH0MSCKxb_footerLeft()
      } catch(e) {
        console.error("Error ESAtom Id: OYx8UsVH0MSCKxb_footerLeft" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomOYx8UsVH0MSCKxb_logo = function() {
          (function() {
  var elementClassName = ".gt_atom-OYx8UsVH0MSCKxb_logo";
  var id = "OYx8UsVH0MSCKxb_logo";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var $elementLogo = $(".gt_atom-OYx8UsVH0MSCKxb_logo");
      var widthImage = $elementLogo.find("img").width();
      var heightImage = $elementLogo.find("img").height();
      $elementLogo.find("img").attr('width', widthImage);
      $elementLogo.find("img").attr('height', heightImage);
    }
    /* init block script */
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomOYx8UsVH0MSCKxb_logo()
      } catch(e) {
        console.error("Error ESAtom Id: OYx8UsVH0MSCKxb_logo" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomOYx8UsVH0MSCKxb_copyrightText = function() {
          (function() {
  var elementClassName = ".gt_atom-OYx8UsVH0MSCKxb_copyrightText";
  var id = "OYx8UsVH0MSCKxb_copyrightText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "OYx8UsVH0MSCKxb_copyrightText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "OYx8UsVH0MSCKxb_copyrightText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomOYx8UsVH0MSCKxb_copyrightText()
      } catch(e) {
        console.error("Error ESAtom Id: OYx8UsVH0MSCKxb_copyrightText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomOYx8UsVH0MSCKxb_footerRight = function() {
          (function() {
  var elementClassName = ".gt_atom-OYx8UsVH0MSCKxb_footerRight";
  var id = "OYx8UsVH0MSCKxb_footerRight";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "OYx8UsVH0MSCKxb_footerRight",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomOYx8UsVH0MSCKxb_footerRight()
      } catch(e) {
        console.error("Error ESAtom Id: OYx8UsVH0MSCKxb_footerRight" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomOYx8UsVH0MSCKxb_hotlineText = function() {
          (function() {
  var elementClassName = ".gt_atom-OYx8UsVH0MSCKxb_hotlineText";
  var id = "OYx8UsVH0MSCKxb_hotlineText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "OYx8UsVH0MSCKxb_hotlineText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "OYx8UsVH0MSCKxb_hotlineText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomOYx8UsVH0MSCKxb_hotlineText()
      } catch(e) {
        console.error("Error ESAtom Id: OYx8UsVH0MSCKxb_hotlineText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomOYx8UsVH0MSCKxb_addressText = function() {
          (function() {
  var elementClassName = ".gt_atom-OYx8UsVH0MSCKxb_addressText";
  var id = "OYx8UsVH0MSCKxb_addressText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "OYx8UsVH0MSCKxb_addressText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "OYx8UsVH0MSCKxb_addressText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomOYx8UsVH0MSCKxb_addressText()
      } catch(e) {
        console.error("Error ESAtom Id: OYx8UsVH0MSCKxb_addressText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomOYx8UsVH0MSCKxb_emailText = function() {
          (function() {
  var elementClassName = ".gt_atom-OYx8UsVH0MSCKxb_emailText";
  var id = "OYx8UsVH0MSCKxb_emailText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "OYx8UsVH0MSCKxb_emailText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "OYx8UsVH0MSCKxb_emailText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomOYx8UsVH0MSCKxb_emailText()
      } catch(e) {
        console.error("Error ESAtom Id: OYx8UsVH0MSCKxb_emailText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomOYx8UsVH0MSCKxb_trustBadge = function() {
          (function() {
  var elementClassName = ".gt_atom-OYx8UsVH0MSCKxb_trustBadge";
  var id = "OYx8UsVH0MSCKxb_trustBadge";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "OYx8UsVH0MSCKxb_trustBadge",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomOYx8UsVH0MSCKxb_trustBadge()
      } catch(e) {
        console.error("Error ESAtom Id: OYx8UsVH0MSCKxb_trustBadge" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESElement67530 = function() {
          var $elementProduct = $(".gt_element-67530");

var $price = $elementProduct.find(".gt_product-price");
if ($price && $price.length > 0) {
  $price.gtProductPrice({
    classCurrentPrice: ".gt_product-price--current",
    classComparePrice: ".gt_product-price--compare"
  });
}

var $featureImage = $elementProduct.find(".gt_product-image");
if ($featureImage && $featureImage.length > 0) {
  $featureImage.gtProductFeatureImage({
    classFeatureImage: ".gt_product-image--front, .gt_product-image--back",
    classImages: null,
    carousel: null,
    owlCarousel: null,
  });
}

var $swatches = $elementProduct.find(".gt_product_variants");
if ($swatches && $swatches.length > 0) {
  $swatches.gtProductSwatches({
    classCurrentValue: ".gt_product-variant-option--selected span",
    classCurrentStatus: ".gt_product-sold-out-tag",
    classItem: ".gt_product-variant-option",
    classInputIdHidden: ".gt_swatches--input",
    classBtnSelect: ".gt_swatches--select",
  });
}

var $saved = $elementProduct.find(".gt_product-sale-tag");
if ($saved && $saved.length > 0) {
  $saved.gtProductSaved({
    classTextPercent: ".gt_product-sale-tag--value--percent",
    classTextNumber: ".gt_product-sale-tag--value--number",
    dataFormat: "[!Profit!] off",
    dataFormatKey: "[!Profit!]",
    customCurrencyFormating: "shortPrefix"
  });
}

var $variantChecked = $elementProduct.find(".gt_product-variant--checked");
var $variantOptions = $elementProduct.find(".gt_product-variant-options");
var $variantOption = $elementProduct.find(".gt_product-variant-option");

$variantChecked.off("click.selectItem67530").on("click.selectItem67530", function() {
  var $options = $(this).siblings(".gt_product-variant-options");
  if($options.hasClass("gt_active")) {
    $options.removeClass("gt_active");
    $(this).removeClass("gt_active");
  } else {
    $variantOptions.removeClass("gt_active");
    $options.addClass("gt_active");
    $(this).addClass("gt_active");
  }
});

$variantOption.off("click.selectItem67530").on("click.selectItem67530", function() {
  $variantChecked.removeClass('gt_active');
  $variantOptions.removeClass('gt_active');
  var value = $(this).attr("data-value");
  var $variantCheckedCurrent =  $(this).closest(".gt_product-variant-box");
  $variantCheckedCurrent.find(".gt_product-variant--checked .gt_product-variant-option--selected span").html(value);
});

        }
        funcESElement67530()
      } catch(e) {
        console.error("Error ESElement Id: 67530" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom67530_productTitle = function() {
          var $atoms = jQuery(".gt_atom-67530_productTitle");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "67530_productTitle",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtom67530_productTitle()
      } catch(e) {
        console.error("Error ESAtom Id: 67530_productTitle" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom67530_productVendor = function() {
          var $atoms = jQuery(".gt_atom-67530_productVendor");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "67530_productVendor",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtom67530_productVendor()
      } catch(e) {
        console.error("Error ESAtom Id: 67530_productVendor" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom67530_productButtonBuy = function() {
          function main() {
  /* Init Actions */
  var $atoms = jQuery(".gt_atom-67530_productButtonBuy");
  if (!$atoms || !$atoms.length) {
    return;
  }
  /* Variables */
  const interactionHover = {"name":"none","duration":"1.5","delay":0,"iterationCount":1};
  const interactionNormal = {"name":"none","duration":"1.5","delay":0,"iterationCount":"infinite"};
  const interactionWhilePress = {"name":"none","duration":"1.5","delay":0,"iterationCount":1};
  const interactionScrollIntoView = "";
  // animation
  window.SOLID.library.animation({
    elementId: "67530_productButtonBuy",
    $doms: $atoms,
    interactionNormal: {
      value: interactionNormal,
      previewAttr: "interactionButton"
    },
    interactionHover: {
      value: interactionHover,
      previewAttr: "interactionButtonHover"
    },
    interactionWhilePress: {
      value: interactionWhilePress,
      previewAttr: "interactionButtonWhitePress"
    },
    interactionScrollIntoView: {
      value: interactionScrollIntoView,
      previewAttr: "interactionScrollIntoView"
    },
    animationType: "block",
    mode: "production",
  })

  for (let i = 0; i < $atoms.length; i++) {
    const $atom = $atoms[i];
    // function customEvent(actions, id, key)
    
      $($atom).customEvent([{"control":{"attribute":"pickProductButton","id":"pickProductButton","type":"pickproduct","isButtonAddToCard":true},"event":"click","id":1},{"control":{"attribute":"pickLinkButton","id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"/cart"},"event":"click","id":2}], "67530_productButtonBuy" + "_" + i);
    

    /* Listen if is button add to card */

    window.SOLID.store.subscribe("loading-buy-now-67530_productButtonBuy" + "_" + i, function (isDisplay) {
      const $loadingEl = $($atom).find(".atom-button-loading-circle-loader");
      const $textEl = $($atom).find(".gt_button-content-text");
      if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
        let timeout = undefined;
        if (isDisplay === true) {
          /* display loading button */
          clearTimeout(timeout);
          $loadingEl.css("display", "inline-block");
          $textEl.css("visibility", "hidden");
        } else if (isDisplay === "stop") {
          /* stop loading */
          $loadingEl.removeAttr("style");
          $textEl.removeAttr("style");
          window.SOLID.store.dispatch("loading-buy-now-67530_productButtonBuy", "");
          window.SOLID.store.dispatch("loading-buy-now-67530_productButtonBuy" + "_" + i, "");
        } else if (isDisplay === false){
          clearTimeout(timeout);
          /* display tick button */
          $loadingEl.addClass("load-complete");
          $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
          /* remove tick button and display text*/
          timeout = setTimeout(function() {
            $loadingEl.removeClass("load-complete");
            $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
            $loadingEl.removeAttr("style");
            $textEl.removeAttr("style");
            window.SOLID.store.dispatch("loading-buy-now-67530_productButtonBuy", "");
            window.SOLID.store.dispatch("loading-buy-now-67530_productButtonBuy" + "_" + i, "");
          }, 3000);
        }
      }
    });
  }
  for (let i = 0; i < $atoms.length; i++) {
    const $atom = $atoms[i];
    
        window.SOLID.library.gtBuyProductListenSoldOut({
          $element: $atom,
          options: {
            isButtonAddToCard: true, 
            textAddToCard: "Add to cart", 
            textSoldOut: "Sold out"
          }
        })
    
    
  }
}

main();

window.SOLID.store.subscribe("run-script-67530_productButtonBuy", () => {
  main();
});

        }
        funcESAtom67530_productButtonBuy()
      } catch(e) {
        console.error("Error ESAtom Id: 67530_productButtonBuy" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
})(window.esQuery || jQuery, window.esQuery || jQuery);

    
  
/*
  You SHOULD NOT modify source code in this page because
  It is automatically generated from EcomSolid
  Try to edit page with the live editor.
  https://ecomsolid.com
*/

    (function(jQuery, $) {
      
    try {
      function triggerDToStore() {
        window.SOLID = window.SOLID || {};
        var discounts = window.SOLID.discounts || [];
        if (window.store && window.store.update) {
          window.store.update("discounts", discounts)
        }
      }
      triggerDToStore()
    } catch(e) {
      console.log("=============================== START ERROR =================================")
      console.log(e)
      console.log("===============================  END ERROR  =================================")
    }
  
    })(window.esQuery || jQuery, window.esQuery || jQuery);
  
    
  