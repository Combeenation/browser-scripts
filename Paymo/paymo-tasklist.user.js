// ==UserScript==
// @name         Paymo TaskList ID Visualizer
// @namespace    http://www.combeenation.com
// @version      1.0.0
// @description  Displays the ID of each TaskList, e.g. to verify YouTrack issues or PowerBI reports are linked correctly
// @author       Enzi
// @match        https://app.paymoapp.com/
// @grant        none
// ==/UserScript==

const IdNodeMarkerClass = "cbnTaskListVisualizer";

(function () {
  'use strict';
  window.setInterval(() => {
    var taskListNodes = document.querySelectorAll('.tasks__groups-header-title--tasklist');
    taskListNodes.forEach(function (taskListNode) {
      // check if ID was already inserted
      let potentialIdNode = taskListNode.nextSibling.nextSibling;
      let potentialIdNodeClass = potentialIdNode && potentialIdNode.attributes['class'];
      if (potentialIdNodeClass && potentialIdNodeClass.value && potentialIdNodeClass.value.indexOf(IdNodeMarkerClass) > 0) {
        return;
      }

      // insert TaskList ID
      let taskListId = taskListNode.attributes['record-id'].value;
      taskListNode.nextSibling.insertAdjacentHTML('afterEnd', `<span class="tasks__group-items-count ${IdNodeMarkerClass}"> — ${taskListId}</span>`);
    });
  }, 2000);
})();