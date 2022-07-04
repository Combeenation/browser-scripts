// ==UserScript==
// @name         Paymo TaskList ID Visualizer
// @namespace    http://www.combeenation.com
// @version      1.0.1
// @description  Displays the ID of each TaskList and provides a search feature to look up Tasklists by ID, e.g. to verify YouTrack issues or PowerBI reports are linked correctly
// @author       Enzi
// @match        https://app.paymoapp.com/
// @grant        none
// ==/UserScript==

const IdNodeMarkerClass = "cbnTaskListVisualizer";
const TaskListFinderCSS = `<style type='text/css'>
  #cbnOpenTaskListFinderButton {
    background-color: transparent;
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    border:0;
    transition: background 200ms;
    cursor:pointer;
  }
  #cbnOpenTaskListFinderButton:hover {
    background: rgba(255,255,255, 0.04);
  }
  #cbnOpenTaskListFinderButton > svg {
    margin-top: 3px;
    cursor:pointer;
  }
  
  .cbnTaskListFinderDialog {
    width: 900px;
    height: 100%;
    margin: auto;
    display: flex;
    background: transparent;
    flex-direction: column;
  }
  .cbnTaskListFinderPanel {
    padding: 5px 15px;
    background-color: #eee;
    border-radius: 16px;
    box-shadow: none;
    height: 50px;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    line-height: 1.4;
  }
  .cbnTaskListFinderPanel svg {
    fill: #636b79;
    width: 14px;
    height: 14px;
    margin-top: 4px;
    margin-right: 15px;
  }
  .cbnTaskListFinderInputPanel {
    flex-grow: 1;
    margin: 0;
    color: #fff;
    cursor: text;
    display: inline-flex;
    position: relative;
    font-size: 14px;
    box-sizing: border-box;
    align-items: center;
    font-family: "-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Oxygen-Sans","Ubuntu","Cantarell","Fira Sans","Helvetica Neue","Arial",sans-serif;
    font-weight: 400;
    line-height: 1.1876em;
  }
  .cbnTaskListFinderInputPanel input {
    color: #000000;
    font-size: 18px;
    letter-spacing: 0.45px;

    font: inherit;
    width: 100%;
    border: 0;
    height: 1.1876em;
    margin: 0;
    display: block;
    padding: 6px 0 7px;
    min-width: 0;
    background: none;
    box-sizing: content-box;
  }
  .cbnTaskListFinderResultPanel {
    display: none;
    padding: 25px 20px 0 40px;
    background: #F8F8F8;
    margin-top: 12px;
    max-height: 100%;
    flex-direction: column;
    border-radius: 16px;
    box-shadow: none;
    flex-grow: 0.3;
  }
  .cbnTaskListFinderResultPanel div {
    color: #000;
  }
</style>`;

function createElement(html) {
  var template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

function addGlobalStyle(stlyeHtml) {
  const head = document.getElementsByTagName("head");
  if (head && head.length > 0) {
    head[0].appendChild(createElement(stlyeHtml));
  }
}

(function TaskListIdVisualizer() {
  'use strict';
  window.setInterval(() => {
    var taskListNodes = document.querySelectorAll('.tasks__groups-header-title--tasklist');
    taskListNodes.forEach(function (taskListNode) {
      // check if ID was already inserted
      let potentialIdNode = taskListNode.nextSibling.nextSibling;
      let potentialIdNodeClass = potentialIdNode && potentialIdNode.attributes.class;
      if (potentialIdNodeClass && potentialIdNodeClass.value && potentialIdNodeClass.value.indexOf(IdNodeMarkerClass) > 0) {
        return;
      }

      // insert TaskList ID
      let taskListId = taskListNode.attributes['record-id'].value;
      taskListNode.nextSibling.insertAdjacentHTML('afterEnd', `<span class="tasks__group-items-count ${IdNodeMarkerClass}"> — ${taskListId}</span>`);
    });
  }, 2000);
})();

(function TaskListFinderInjecter() {
  'use strict';
  var intervalId = window.setInterval(() => {
    const existingSearchButton = document.getElementById("cbnOpenTaskListFinderButton");
    if (existingSearchButton) {
      window.clearInterval(intervalId);
      return;
    }

    const sidebarContainer = document.getElementById("sidebar-targetEl");
    const searchButton = sidebarContainer && sidebarContainer.querySelector("button.search-button-MuiButtonBase-root");
    if (searchButton) {
      searchButton.insertAdjacentHTML("afterEnd", `<button id="cbnOpenTaskListFinderButton" tabindex="0" type="button" title="Find Tasklist">
      <svg viewBox="0 0 25.531 25.531" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" class="sidebar-jss20">
        <path d="M25.198,6.273c-0.014,0.23-0.045,0.389-0.087,0.467c-0.045,0.084-0.176,0.145-0.392,0.183
        c-0.469,0.104-0.781-0.074-0.935-0.533C23.239,4.7,22.59,3.578,21.84,3.016c-1.041-0.773-2.862-1.161-5.469-1.161
        c-1.054,0-1.633,0.115-1.734,0.343c-0.036,0.075-0.057,0.184-0.057,0.324v18.999c0,0.812,0.188,1.383,0.571,1.709
        c0.382,0.32,1.069,0.731,2.201,0.999c0.483,0.103,0.97,0.2,1.034,0.239c0.46,0,0.504,1.057-0.376,1.057
        c-0.025,0.016-10.375-0.008-10.375-0.008s-0.723-0.439-0.074-1.023c0.271-0.121,0.767-0.343,0.767-0.343s1.83-0.614,2.211-1.009
        c0.434-0.445,0.648-1.164,0.648-2.154V2.521c0-0.369-0.229-0.585-0.687-0.647c-0.049-0.015-0.425-0.02-1.122-0.02
        c-2.415,0-4.191,0.418-5.338,1.259C3.176,3.735,2.411,4.877,1.737,6.545C1.52,7.065,1.22,7.234,0.84,7.058
        C0.408,6.957,0.251,6.719,0.363,6.353c0.445-1.374,0.668-3.31,0.668-5.814c0-0.292,0.387-0.586,1.163-0.533L23.56,0.064
        c0.709-0.104,1.096,0.012,1.16,0.343C25.076,2.096,25.234,4.052,25.198,6.273z"/>
      </svg>
  </button>`);
      const openTaskListFinderButton = document.getElementById("cbnOpenTaskListFinderButton");
      if (openTaskListFinderButton) {
        addGlobalStyle(TaskListFinderCSS);
        openTaskListFinderButton.onclick = OpenTaskListFinderDialog;
      }
    }
  }, 2000);
})();

function OpenTaskListFinderDialog() {
  var finderDialog = createElement(`<div role="presentation" style="position: fixed; z-index: 1300; inset: 0px;">
  <div class="search-button-MuiBackdrop-root search-button-jss3" aria-hidden="true" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"></div>
  <div class="search-button-jss4" tabindex="-1">
    <div class="cbnTaskListFinderDialog">
      <div class="cbnTaskListFinderPanel">
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" class="search-jss15">
          <path d="M9.87 10.582A5.966 5.966 0 016 12c-3.31 0-6-2.689-6-6s2.69-6 6-6 6 2.689 6 6a5.95 5.95 0 01-1.42 3.875l5.27 5.271c.2.195.2.512 0 .707a.504.504 0 01-.71 0l-5.27-5.271zM6 1c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"></path>
        </svg>
        <div class="cbnTaskListFinderInputPanel">
          <input placeholder="Find TaskList by ID" type="text" class="search-MuiInputBase-input search-MuiInput-input search-jss14" value="">
        </div>
      </div>
      <div class="cbnTaskListFinderResultPanel">
        <div></div>
      </div>
    </div>
  </div>
</div>`);
  const htmlBody = document.getElementsByTagName("body")[0];
  htmlBody.appendChild(finderDialog);

  finderDialog.onclick = function () {
    htmlBody.removeChild(finderDialog);
  };

  let inputBox = finderDialog.querySelector("input");
  let outputPanel = finderDialog.querySelector(".cbnTaskListFinderResultPanel");
  let outputBox = outputPanel && outputPanel.querySelector("div");
  if (inputBox && outputBox) {
    let preventClickPropagation = function (evt) { evt.stopPropagation(); };
    inputBox.onclick = preventClickPropagation;
    outputPanel.onclick = preventClickPropagation;

    inputBox.onchange = function (evt) {
      let id = evt.target.value;
      FindTaskListById(id, htmlResult => {
        // make visible if not visible yet
        outputPanel.style.display = "flex";

        // clear previous output
        while (outputBox.firstChild) {
          outputBox.removeChild(outputBox.firstChild);
        }

        outputBox.appendChild(createElement(htmlResult));
      });
    };
  }
}

function FindTaskListById(id, resultWriter) {
  if (!id) {
    return
  }
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa("1d229f9933082213ac2cf9db2848a693:nopassword"));

  fetch(`https://app.paymoapp.com/api/tasklists/${id}?include=project.id,project.name,tasks.id,tasks.name`, { method: 'GET', headers: headers })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(result => {
      let tasklist = result.tasklists[0];
      let projectId = tasklist.project.id;
      let projectName = tasklist.project.name;
      let html = `<p>Tasklist found:<br>
<span style="font-weight:600;font-size:1.5em">${tasklist.name}</span><br><br>
<span>Project: <a href="https://app.paymoapp.com/#Paymo.Projects/${projectId}/tasks/simple">${projectName}</a></span><br>`;

      if (tasklist.tasks && tasklist.tasks.length > 0) {
        html += "<br><span>Tasks:</span><br>";
        tasklist.tasks.forEach(task => {
          html += `<a href="https://app.paymoapp.com/#Paymo.Projects/${projectId}/tasks/simple/task/${task.id}">${task.name}</a><br>`;
        });
      }

      html += "</p>";
      resultWriter(html);
    })
    .catch(error => {
      if (error.json) {
        error.json().then(jsonError => {
          resultWriter(`<p>No Tasklist found, API response:<br>${error.status}: ${jsonError.message}</p>`);
        });
      } else {
        resultWriter(`<p>Script error:<br>${error}</p>`);
      }
    })
}