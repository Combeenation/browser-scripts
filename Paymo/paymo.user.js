// ==UserScript==
// @name         CbnPaymoExtensions
// @namespace    http://www.combeenation.com
// @version      1.0.1
// @description  Combeenation extensions for Paymo
// @author       Michael Harrer
// @match        https://app.paymoapp.com/
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// ==/UserScript==

const BILLABLE_MATCHER = ' - Billable';
const BILLABLE_CLS = 'project-is-billable';

const HEADER_STYLES =
`<style type='text/css'>
  .button-selected-values.${ BILLABLE_CLS }:before,
  .x-header-text.${ BILLABLE_CLS }:before,
  .task__tag-text.${ BILLABLE_CLS }:before,
  .title.${ BILLABLE_CLS }:before {
    content: "💰 ";
  }
  
  .billing-type {
    transition: box-shadow 300ms;
  }
</style>`;

function nodeTextMatchesBillable(el) {
  var nodeValue = el.childNodes[0].nodeValue;
  return nodeValue && (nodeValue.indexOf(BILLABLE_MATCHER) > 0);
}

$(HEADER_STYLES).appendTo('head');

(function() {
  'use strict';

  window.setInterval(() => {
    var $els = $(`span:contains("${ BILLABLE_MATCHER }")`).filter((idx, el) => nodeTextMatchesBillable(el));
    var $elsInTaskDetails = $els.filter((idx, el) => el.closest('.task-details'));
    var $billingType = $('.billing-type');
    var $taskTagTexts = $('.task__tag-text');
    
    $('.title')
      .add($('.x-header-text'))
      .add($('.button-selected-values'))
      .each((idx, el) => {
        var fn = (nodeTextMatchesBillable(el) ? 'addClass' : 'removeClass');
        $(el)[fn](BILLABLE_CLS);
      });
    
    if ($taskTagTexts.length) {
      $taskTagTexts.addClass(function() { return this.textContent.includes(BILLABLE_MATCHER) ? BILLABLE_CLS : ''; });
    }
    
    if ($billingType.length) {
      $billingType.css('box-shadow', ($elsInTaskDetails.length ? 'inset 0 0 20px 0px #f96161' : 'none'));
    }
  }, 2000);
})();
