(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("widgets/jquery-ui-datepicker", [], factory);
	else if(typeof exports === 'object')
		exports["widgets/jquery-ui-datepicker"] = factory();
	else
		root["widgets/jquery-ui-datepicker"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function init(Survey, $) {
  $ = $ || window.$;
  if (!$.fn.bootstrapDP && !!$.fn.datepicker && !!$.fn.datepicker.noConflict) {
    $.fn.bootstrapDP = $.fn.datepicker.noConflict();
    if (!$.fn.datepicker) {
      $.fn.datepicker = $.fn.bootstrapDP;
    }
  }
  var widget = {
    name: "datepicker",
    title: "Date picker",
    iconName: "icon-datepicker",
    widgetIsLoaded: function () {
      return !!$ && !!$.fn.datepicker && !$.fn.datepicker.noConflict;
    },
    isFit: function (question) {
      return question.getType() === "datepicker";
    },
    htmlTemplate: "<input class='form-control widget-datepicker' type='text'>",
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass(
        "datepicker",
        [
          { name: "inputType", visible: false },
          { name: "inputFormat", visible: false },
          { name: "inputMask", visible: false }
        ],
        null,
        "text"
      );
      Survey.JsonObject.metaData.addProperty("datepicker", {
        name: "dateFormat"
      });
      Survey.JsonObject.metaData.addProperty("datepicker", {
        name: "config",
        default: null
      });
    },
    afterRender: function (question, el) {
      var $el = $(el).is(".widget-datepicker")
        ? $(el)
        : $(el).find(".widget-datepicker");
      var isSelecting = false;
      var config = $.extend(true, {}, question.config || {});
      if (!!question.placeHolder) {
        $el.attr("placeholder", question.placeHolder);
      }
      if (config.dateFormat === undefined) {
        config.dateFormat = !!question.dateFormat
          ? question.dateFormat
          : undefined;
      }
      if (config.option === undefined) {
        config.option = {
          minDate: null,
          maxDate: null
        };
      }
      if (config.onSelect === undefined) {
        config.onSelect = function (dateText) {
          isSelecting = true;
          question.value = dateText;
          isSelecting = false;
          this.fixFocusIE = true;
        };
      }
      config.fixFocusIE = false;
      config.onClose = function (dateText, inst) {
        this.fixFocusIE = true;
      };
      config.beforeShow = function (input, inst) {
        var result = !!navigator.userAgent.match(/Trident\/7\./)
          ? !this.fixFocusIE
          : true;
        this.fixFocusIE = false;
        return result;
      };
      var pickerWidget = $el.datepicker(config);

      $el.keyup(function (e) {
        if (e.keyCode == 8 || e.keyCode == 46) {
          $.datepicker._clearDate(this);
        }
      });

      question.readOnlyChangedCallback = function () {
        $el.datepicker("option", "disabled", question.isReadOnly);
      };
      function updateDate() {
        if (question.value) {
          pickerWidget.datepicker("setDate", question.value);
        } else {
          pickerWidget.datepicker("setDate", null);
        }
      }
      question.registerFunctionOnPropertyValueChanged("dateFormat", function () {
        question.dateFormat && pickerWidget.datepicker("option", "dateFormat", question.dateFormat);
        updateDate();
      }
      );
      question.valueChangedCallback = function () {
        if (!isSelecting) {
          updateDate();
          $el.blur();
        }
      };
      question.valueChangedCallback();
    },
    willUnmount: function (question, el) {
      var $el = $(el).is(".widget-datepicker")
        ? $(el)
        : $(el).find(".widget-datepicker");
      $el.datepicker("destroy");
    }
  };

  Survey.matrixDropdownColumnTypes.datepicker = { properties: ["placeHolder"] };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

/* harmony default export */ __webpack_exports__["default"] = (init);


/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwNTBhYjhkZGMzY2FmZDkwMDgyOSIsIndlYnBhY2s6Ly8vLi9zcmMvanF1ZXJ5LXVpLWRhdGVwaWNrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDN0RBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLG9DQUFvQztBQUMvQyxXQUFXLHNDQUFzQztBQUNqRCxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx1QkFBdUI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaURBQWlEO0FBQ2pEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVlLG1FQUFJLEVBQUMiLCJmaWxlIjoid2lkZ2V0cy9qcXVlcnktdWktZGF0ZXBpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwid2lkZ2V0cy9qcXVlcnktdWktZGF0ZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJ3aWRnZXRzL2pxdWVyeS11aS1kYXRlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIndpZGdldHMvanF1ZXJ5LXVpLWRhdGVwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDA1MGFiOGRkYzNjYWZkOTAwODI5IiwiZnVuY3Rpb24gaW5pdChTdXJ2ZXksICQpIHtcbiAgJCA9ICQgfHwgd2luZG93LiQ7XG4gIGlmICghJC5mbi5ib290c3RyYXBEUCAmJiAhISQuZm4uZGF0ZXBpY2tlciAmJiAhISQuZm4uZGF0ZXBpY2tlci5ub0NvbmZsaWN0KSB7XG4gICAgJC5mbi5ib290c3RyYXBEUCA9ICQuZm4uZGF0ZXBpY2tlci5ub0NvbmZsaWN0KCk7XG4gICAgaWYgKCEkLmZuLmRhdGVwaWNrZXIpIHtcbiAgICAgICQuZm4uZGF0ZXBpY2tlciA9ICQuZm4uYm9vdHN0cmFwRFA7XG4gICAgfVxuICB9XG4gIHZhciB3aWRnZXQgPSB7XG4gICAgbmFtZTogXCJkYXRlcGlja2VyXCIsXG4gICAgdGl0bGU6IFwiRGF0ZSBwaWNrZXJcIixcbiAgICBpY29uTmFtZTogXCJpY29uLWRhdGVwaWNrZXJcIixcbiAgICB3aWRnZXRJc0xvYWRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICEhJCAmJiAhISQuZm4uZGF0ZXBpY2tlciAmJiAhJC5mbi5kYXRlcGlja2VyLm5vQ29uZmxpY3Q7XG4gICAgfSxcbiAgICBpc0ZpdDogZnVuY3Rpb24gKHF1ZXN0aW9uKSB7XG4gICAgICByZXR1cm4gcXVlc3Rpb24uZ2V0VHlwZSgpID09PSBcImRhdGVwaWNrZXJcIjtcbiAgICB9LFxuICAgIGh0bWxUZW1wbGF0ZTogXCI8aW5wdXQgY2xhc3M9J2Zvcm0tY29udHJvbCB3aWRnZXQtZGF0ZXBpY2tlcicgdHlwZT0ndGV4dCc+XCIsXG4gICAgYWN0aXZhdGVkQnlDaGFuZ2VkOiBmdW5jdGlvbiAoYWN0aXZhdGVkQnkpIHtcbiAgICAgIFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFxuICAgICAgICBcImRhdGVwaWNrZXJcIixcbiAgICAgICAgW1xuICAgICAgICAgIHsgbmFtZTogXCJpbnB1dFR5cGVcIiwgdmlzaWJsZTogZmFsc2UgfSxcbiAgICAgICAgICB7IG5hbWU6IFwiaW5wdXRGb3JtYXRcIiwgdmlzaWJsZTogZmFsc2UgfSxcbiAgICAgICAgICB7IG5hbWU6IFwiaW5wdXRNYXNrXCIsIHZpc2libGU6IGZhbHNlIH1cbiAgICAgICAgXSxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgXCJ0ZXh0XCJcbiAgICAgICk7XG4gICAgICBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRQcm9wZXJ0eShcImRhdGVwaWNrZXJcIiwge1xuICAgICAgICBuYW1lOiBcImRhdGVGb3JtYXRcIlxuICAgICAgfSk7XG4gICAgICBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRQcm9wZXJ0eShcImRhdGVwaWNrZXJcIiwge1xuICAgICAgICBuYW1lOiBcImNvbmZpZ1wiLFxuICAgICAgICBkZWZhdWx0OiBudWxsXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGFmdGVyUmVuZGVyOiBmdW5jdGlvbiAocXVlc3Rpb24sIGVsKSB7XG4gICAgICB2YXIgJGVsID0gJChlbCkuaXMoXCIud2lkZ2V0LWRhdGVwaWNrZXJcIilcbiAgICAgICAgPyAkKGVsKVxuICAgICAgICA6ICQoZWwpLmZpbmQoXCIud2lkZ2V0LWRhdGVwaWNrZXJcIik7XG4gICAgICB2YXIgaXNTZWxlY3RpbmcgPSBmYWxzZTtcbiAgICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgcXVlc3Rpb24uY29uZmlnIHx8IHt9KTtcbiAgICAgIGlmICghIXF1ZXN0aW9uLnBsYWNlSG9sZGVyKSB7XG4gICAgICAgICRlbC5hdHRyKFwicGxhY2Vob2xkZXJcIiwgcXVlc3Rpb24ucGxhY2VIb2xkZXIpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy5kYXRlRm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uZmlnLmRhdGVGb3JtYXQgPSAhIXF1ZXN0aW9uLmRhdGVGb3JtYXRcbiAgICAgICAgICA/IHF1ZXN0aW9uLmRhdGVGb3JtYXRcbiAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcub3B0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uZmlnLm9wdGlvbiA9IHtcbiAgICAgICAgICBtaW5EYXRlOiBudWxsLFxuICAgICAgICAgIG1heERhdGU6IG51bGxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcub25TZWxlY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25maWcub25TZWxlY3QgPSBmdW5jdGlvbiAoZGF0ZVRleHQpIHtcbiAgICAgICAgICBpc1NlbGVjdGluZyA9IHRydWU7XG4gICAgICAgICAgcXVlc3Rpb24udmFsdWUgPSBkYXRlVGV4dDtcbiAgICAgICAgICBpc1NlbGVjdGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZml4Rm9jdXNJRSA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBjb25maWcuZml4Rm9jdXNJRSA9IGZhbHNlO1xuICAgICAgY29uZmlnLm9uQ2xvc2UgPSBmdW5jdGlvbiAoZGF0ZVRleHQsIGluc3QpIHtcbiAgICAgICAgdGhpcy5maXhGb2N1c0lFID0gdHJ1ZTtcbiAgICAgIH07XG4gICAgICBjb25maWcuYmVmb3JlU2hvdyA9IGZ1bmN0aW9uIChpbnB1dCwgaW5zdCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9UcmlkZW50XFwvN1xcLi8pXG4gICAgICAgICAgPyAhdGhpcy5maXhGb2N1c0lFXG4gICAgICAgICAgOiB0cnVlO1xuICAgICAgICB0aGlzLmZpeEZvY3VzSUUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgICB2YXIgcGlja2VyV2lkZ2V0ID0gJGVsLmRhdGVwaWNrZXIoY29uZmlnKTtcblxuICAgICAgJGVsLmtleXVwKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT0gOCB8fCBlLmtleUNvZGUgPT0gNDYpIHtcbiAgICAgICAgICAkLmRhdGVwaWNrZXIuX2NsZWFyRGF0ZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHF1ZXN0aW9uLnJlYWRPbmx5Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkZWwuZGF0ZXBpY2tlcihcIm9wdGlvblwiLCBcImRpc2FibGVkXCIsIHF1ZXN0aW9uLmlzUmVhZE9ubHkpO1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZURhdGUoKSB7XG4gICAgICAgIGlmIChxdWVzdGlvbi52YWx1ZSkge1xuICAgICAgICAgIHBpY2tlcldpZGdldC5kYXRlcGlja2VyKFwic2V0RGF0ZVwiLCBxdWVzdGlvbi52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGlja2VyV2lkZ2V0LmRhdGVwaWNrZXIoXCJzZXREYXRlXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBxdWVzdGlvbi5yZWdpc3RlckZ1bmN0aW9uT25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChcImRhdGVGb3JtYXRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBxdWVzdGlvbi5kYXRlRm9ybWF0ICYmIHBpY2tlcldpZGdldC5kYXRlcGlja2VyKFwib3B0aW9uXCIsIFwiZGF0ZUZvcm1hdFwiLCBxdWVzdGlvbi5kYXRlRm9ybWF0KTtcbiAgICAgICAgdXBkYXRlRGF0ZSgpO1xuICAgICAgfVxuICAgICAgKTtcbiAgICAgIHF1ZXN0aW9uLnZhbHVlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzU2VsZWN0aW5nKSB7XG4gICAgICAgICAgdXBkYXRlRGF0ZSgpO1xuICAgICAgICAgICRlbC5ibHVyKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBxdWVzdGlvbi52YWx1ZUNoYW5nZWRDYWxsYmFjaygpO1xuICAgIH0sXG4gICAgd2lsbFVubW91bnQ6IGZ1bmN0aW9uIChxdWVzdGlvbiwgZWwpIHtcbiAgICAgIHZhciAkZWwgPSAkKGVsKS5pcyhcIi53aWRnZXQtZGF0ZXBpY2tlclwiKVxuICAgICAgICA/ICQoZWwpXG4gICAgICAgIDogJChlbCkuZmluZChcIi53aWRnZXQtZGF0ZXBpY2tlclwiKTtcbiAgICAgICRlbC5kYXRlcGlja2VyKFwiZGVzdHJveVwiKTtcbiAgICB9XG4gIH07XG5cbiAgU3VydmV5Lm1hdHJpeERyb3Bkb3duQ29sdW1uVHlwZXMuZGF0ZXBpY2tlciA9IHsgcHJvcGVydGllczogW1wicGxhY2VIb2xkZXJcIl0gfTtcbiAgU3VydmV5LkN1c3RvbVdpZGdldENvbGxlY3Rpb24uSW5zdGFuY2UuYWRkQ3VzdG9tV2lkZ2V0KHdpZGdldCwgXCJjdXN0b210eXBlXCIpO1xufVxuXG5pZiAodHlwZW9mIFN1cnZleSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBpbml0KFN1cnZleSwgd2luZG93LiQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanF1ZXJ5LXVpLWRhdGVwaWNrZXIuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEwIl0sInNvdXJjZVJvb3QiOiIifQ==