// ==UserScript==
// @name         Paymo TaskList ID Visualizer
// @namespace    http://www.combeenation.com
// @version      1.0.0
// @description  Displays the ID of each TaskList, e.g. to verify YouTrack issues or PowerBI reports are linked correctly
// @author       Enzi
// @match        https://app.paymoapp.com/
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  var taskListNodes = document.querySelectorAll('.tasks__groups-header-title--tasklist');
  taskListNodes.forEach(function (taskListNode) {
    let taskListId = taskListNode.attributes['record-id'].value;
    taskListNode.nextSibling.insertAdjacentHTML('afterEnd', `<span class="tasks__group-items-count"> — ${taskListId}</span>`);
  });
})();