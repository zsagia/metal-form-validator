/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from FormFieldValidator.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace FormFieldValidator.
 * @public
 */

goog.module('FormFieldValidator.incrementaldom');

/** @suppress {extraRequire} */
var soy = goog.require('soy');
/** @suppress {extraRequire} */
var soydata = goog.require('soydata');
/** @suppress {extraRequire} */
goog.require('goog.asserts');
/** @suppress {extraRequire} */
goog.require('soy.asserts');
/** @suppress {extraRequire} */
goog.require('goog.i18n.bidi');
var IncrementalDom = goog.require('incrementaldom');
var ie_open = IncrementalDom.elementOpen;
var ie_close = IncrementalDom.elementClose;
var ie_void = IncrementalDom.elementVoid;
var ie_open_start = IncrementalDom.elementOpenStart;
var ie_open_end = IncrementalDom.elementOpenEnd;
var itext = IncrementalDom.text;
var iattr = IncrementalDom.attr;


/**
 * @param {{
 *    elementClasses: (null|string|undefined),
 *    errorMessage_: (null|string|undefined),
 *    field: (!soydata.SanitizedHtml|string),
 *    status_: (null|string|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $render(opt_data, opt_ignored, opt_ijData) {
  soy.asserts.assertType(opt_data.elementClasses == null || (opt_data.elementClasses instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.elementClasses), 'elementClasses', opt_data.elementClasses, 'null|string|undefined');
  var elementClasses = /** @type {null|string|undefined} */ (opt_data.elementClasses);
  soy.asserts.assertType(opt_data.errorMessage_ == null || (opt_data.errorMessage_ instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.errorMessage_), 'errorMessage_', opt_data.errorMessage_, 'null|string|undefined');
  var errorMessage_ = /** @type {null|string|undefined} */ (opt_data.errorMessage_);
  soy.asserts.assertType((opt_data.field instanceof Function) || (opt_data.field instanceof soydata.UnsanitizedText) || goog.isString(opt_data.field), 'field', opt_data.field, 'Function');
  var field = /** @type {Function} */ (opt_data.field);
  soy.asserts.assertType(opt_data.status_ == null || (opt_data.status_ instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.status_), 'status_', opt_data.status_, 'null|string|undefined');
  var status_ = /** @type {null|string|undefined} */ (opt_data.status_);
  ie_open('div', null, null,
      'class', 'form-field-validator' + (elementClasses ? ' ' + elementClasses : '') + (status_ ? ' ' + status_ : ''));
    field();
    if (errorMessage_) {
      ie_open('div', null, null,
          'class', 'form-validator-stack help-block');
        itext((goog.asserts.assert((errorMessage_) != null), errorMessage_));
      ie_close('div');
    }
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'FormFieldValidator.render';
}

exports.render.params = ["elementClasses","errorMessage_","field","status_"];
exports.render.types = {"elementClasses":"string","errorMessage_":"string","field":"html","status_":"string"};
templates = exports;
return exports;

});

class FormFieldValidator extends Component {}
Soy.register(FormFieldValidator, templates);
export { FormFieldValidator, templates };
export default templates;
/* jshint ignore:end */
