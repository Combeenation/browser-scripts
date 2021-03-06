// ==UserScript==
// @name         CBN Raygun Extensions
// @namespace    http://www.combeenation.com
// @version      1.1.14
// @description  Add some combeenation specific extensions to raygun
// @author       Patrick Ecker, Harrer Michael
// @match        https://app.raygun.io/*
// @match        https://app.raygun.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://raw.githubusercontent.com/phstc/jquery-dateFormat/master/dist/jquery-dateformat.min.js
// ==/UserScript==
window.CbnRaygunExtensions = (function() {
  // region private variables
  let _latestErrorData = {};
  // endregion private variables

  // region private functions
  /**
   * Left pad the given string with spaces until it has a minum length
   *
   * @param {String} str
   * @param {Number} minCnt The minimum character count
   *
   * @returns {String}
   */
  function _leftPad(str, minCnt) {
    return (str.length < minCnt ? _leftPad(' ' + str, minCnt) : str);
  }

  /**
   * Format the duration between the 2 given dates into an "human readable" string
   *
   * @param {Number} date1 JS date (ms since...)
   * @param {Number} date2 JS date (ms since...)
   * @param {Number} [minLength=18] Minimum length of the returned string. Automatically left padded with spaces
   *
   * @returns {String} Formated string. E.g. "3h 12m 43s 118ms"
   */
  function _getTimeDiffString(date1, date2, minLength) {
    const diffMs = Math.abs(date1 - date2);
    let res = '';
    let diffSec, hours, mins, secs, ms;

    minLength = isNaN(minLength) ? 18 : minLength;

    if (isNaN(diffMs)) {
      res = '0ms';
    } else {
      diffSec = Math.floor(diffMs / 1000);
      hours   = Math.floor(diffSec / 3600);
      mins    = Math.floor((diffSec - 3600 * hours) / 60);
      secs    = Math.floor(diffSec - 3600 * hours - 60 * mins);
      ms      = diffMs - 3600 * hours * 1000 - 60 * mins * 1000 - secs * 1000;

      if (hours > 0) { res += hours + 'h '; }
      if (mins > 0)  { res += mins + 'm '; }
      if (secs > 0)  { res += secs + 's '; }
      res += ms + 'ms';
    }

    return _leftPad(res, minLength);
  }

  function _decryptVerboseNext() {
    _navigateAndDecryptVerbose('nextOccurrence');
  }

  function _decryptVerbosePrevious() {
    _navigateAndDecryptVerbose('previousOccurrence');
  }

   /**
   * Clicks on the button, waits until the load animation is gone,
   * then executes the 'decrypt verbose' and scrolls to the end of the log
   *
   * @param {string} btnId Button which should be clicked
   */
  function _navigateAndDecryptVerbose(btnId) {
    try {
      var nextBtn = $('#' + btnId);
      if (!nextBtn.length) {
        alert('Button to simulate click not available!');
        return;
      } else if (nextBtn.hasClass('button--disabled')) {
        alert('Button disabled! End reached?');
        return;
      }
      nextBtn.click();

      var decryptAfterLoad = function(firstLoad) {
        var loading = document.getElementsByClassName('loading--active');
        // timeout on first load in case the load-mask takes some time
        if (loading.length === 0 && !firstLoad) {
          _decryptLog(true);
          var decryptedLogEl = document.getElementById('cbn-decrypted-log');
          var yPos = decryptedLogEl ? decryptedLogEl.scrollHeight : document.body.scrollHeight;
          window.scrollTo(0, yPos);
        } else {
          window.setTimeout(decryptAfterLoad, 100);
        }
      };

      decryptAfterLoad(true);
    } catch(ex) {
      alert("Error!\n" + ex);
    }
  }

  /**
   * Read encrypted session log from DOM, decrypt it and print it into a new DIV
   *
   * {Boolean} [verbose=false] True to print verbose log (e.g. also print data sent with ChangeConfigurationValue
   *                           requests ets.)
   */
  function _decryptLog(verbose) {
    verbose = (true === verbose);

    try {
      const encryptedDiv = $('<div/>', { id: 'cbn-decrypted-log' });
      const sessionLogSpan = $('span.key:contains(sessionLog)').last();
      const encryptedDivContainer = sessionLogSpan.parent();
      let log = JSON.parse(sessionLogSpan.next().text());
      const logLength = log.length;
      let prevLogDate;

      // clear previous data
      encryptedDivContainer.find('hr').remove();
      encryptedDivContainer.find('p').remove();
      encryptedDivContainer.append($('<hr/>', {})).append(encryptedDiv);
      encryptedDiv.empty();

      try {
        log = JSON.parse(log);
      } catch (exc) {
        log = JSON.parse(LZString.decompressFromEncodedURIComponent(log));
      }

      if (log && log.length) {
        log
          .sort(function (x, y) { return (x.sltime - y.sltime); })
          .forEach(function(logEntry, idx, logEntries) {
            const logDate = new Date(logEntry.sltime);
            const addDataArgs = (logEntry.sladddata && logEntry.sladddata.args);

            if (0 === idx) {
              encryptedDiv.append($('<p/>', {
                style: 'margin: 16px 0; padding: 8px; background-color: rgb(228, 228, 228); text-align: center;',
                text: logEntries.length + ' Log Entries, ' + logLength + ' characters compressed'
              }));
            }

            if ((0 === idx) || (prevLogDate && (logDate.getDate() !== prevLogDate.getDate()))) {
              encryptedDiv.append($('<p/>', {
                style: 'margin: 16px 0; padding: 8px; background-color: rgb(228, 228, 228); text-align: center;',
                text: $.format.date(logDate, 'ddd, dd.MM.yy')
              }));
            }

            encryptedDiv.append($('<p/>', {
              style: 'color:' + logEntry.sltype,
              text: (
                $.format.date(logDate, 'HH:mm:ss.SSS') + ' '
                + _getTimeDiffString(logDate, prevLogDate) + '   '
                + logEntry.slmsg
              )
            }));

            if (
              verbose && addDataArgs && (addDataArgs.length >= 2)
              && ('ChangeConfigurationValue' === addDataArgs[0])
            ) {
              addDataArgs[1].forEach(function(arg) {
                encryptedDiv.append($('<p/>', {
                  style: 'color: lightgrey',
                  text: '                                  ' + arg.Name + ': ' + JSON.stringify(arg.Value)
                }));
              });
            }

            prevLogDate = logDate;
          });
      }

      // Remove the original session log to "shorten" the horizontal scrollbar...
      sessionLogSpan.next().remove();
    } catch (exc) {
      alert('Failed to parse session log');
      console.error('Failed to decrypt session log. Error:', exc);
    }
  }

  /**
   * Read encrypted session log from DOM and copy it into the clipboard
   */
  function _copyLogToClipboard() {
    const keyname = 'sessionLog';
    const foundSpans = $('span.key:contains(' + keyname + ')');
    const logEl = foundSpans.filter((index, node) => node.innerText === keyname).next();
    if (logEl && logEl.length) {
      const range = document.createRange();
      range.selectNode(logEl[0]);
      window.getSelection().addRange(range);
      if (!document.execCommand('copy')) {
        alert('Copying session history to clipboard failed');
      }
      window.getSelection().removeAllRanges();
    }
  }

  /**
   * Interceptor for each AJAX call. Checks the given data for error occurrence dates/times and saves them so that
   * we can later update the shown dates in _updateShownDates
   */
  function _onXhrDone(data) {
    if (data.hasOwnProperty('activeErrors')) {
      _latestErrorData = data;
    } else if (data.hasOwnProperty('records') && data.hasOwnProperty('totalRecords')) {
      // When e.g. in users view, all records are directly sent. We therefore put the data in the same form as in
      // the "Crash reporting" view.
      _latestErrorData = {
        myErrors: { records: [] },
        activeErrors: { records: [] },
        resolvedErrors: { records: [] },
        ignoredErrors: { records: [] },
        permanentlyIgnoredErrors: { records: [] }
      };

      data.records.forEach(function(record) {
        switch ((record.state || '').toLowerCase()) {
          case 'myerrors':           _latestErrorData.myErrors.records.push(record);                  break;
          case 'active':             _latestErrorData.activeErrors.records.push(record);              break;
          case 'resolved':           _latestErrorData.resolvedErrors.records.push(record);            break;
          case 'ignored':            _latestErrorData.ignoredErrors.records.push(record);             break;
          case 'permanentlyignored': _latestErrorData.permanentlyIgnoredErrors.records.push(record);  break;
        }
      });
    }
  }

  /**
   * Updates the format of the shown dates by showing the plain dates (e.g. "25 minutes ago" to "09.03.16 18:20:21")
   */
  function _updateShownDates() {
    const activeTab = $('.module-tab.is-active');
    let timeOcurredColIdx = $('th:contains("Time occurred")').index();
    let errorData;

    if (timeOcurredColIdx < 0) {
      timeOcurredColIdx = $('th:contains("Last occurred")').index();
    }

    if (activeTab.hasClass('js-myerrors-tab') || activeTab.hasClass('js-error-state-myerrors')) {
      errorData = _latestErrorData.myErrors;
    } else if (activeTab.hasClass('js-active-tab') || activeTab.hasClass('js-error-state-active')) {
      errorData = _latestErrorData.activeErrors;
    } else if (activeTab.hasClass('js-resolved-tab') || activeTab.hasClass('js-error-state-resolved')) {
      errorData = _latestErrorData.resolvedErrors;
    } else if (activeTab.hasClass('js-ignored-tab') || activeTab.hasClass('js-error-state-ignored')) {
      errorData = _latestErrorData.ignoredErrors;
    } else if (
      activeTab.hasClass('js-permanentlyignored-tab') || activeTab.hasClass('js-error-state-permanentlyignored')
    ) {
      errorData = _latestErrorData.permanentlyIgnoredErrors;
    }

    if (!errorData || !errorData.records || (timeOcurredColIdx < 0)) {
      alert('Update shown dates failed...');
      return;
    }

    errorData.records.forEach(function(record) {
      const msg = record.message;

      // Find correct table row by its message
      $('td > a:contains(' + msg + ')')
        .filter(function(idx, el) { return (msg === $(el).text()); })
        .each(function(idx, msgEl) {
          const date = record.lastOccurred || record.lastImpacted;

          if (date) {
            // Update the text of the "Last occurred" column
            $(msgEl).parents('tr')
              .find(':nth-child(' + (timeOcurredColIdx + 1) + ') > span')
              .text($.format.date(new Date(date), 'dd.MM. HH:mm:ss.SSS'));
          }
        });
    });
  }

  /**
   * Creates the additional buttons in the header bar ("Decrypt", "Copy Log", ...)
   */
  function _createButtons() {
    const emblemEl = $('.raygun-emblem');

	// Add "decrypt verbose" buttons
    const decryptVerboseWrapper = $('<div/>');
	decryptVerboseWrapper.append($('<a/>', {
	  'text': 'Decrypt verbose',
	  'class': 'raygun-emblem',
	  'style': 'color: white; position:absolute; left:-335px; top:-8px; width: auto;',
	  'click': () => _decryptLog(true)
	}));

    decryptVerboseWrapper.append($('<a/>', {
      'text': 'Previous',
      'class': 'raygun-emblem',
      'style': 'color: white; position:absolute; left:-334px; top: 10px; width: auto; font-size: 10px;',
      'click': _decryptVerbosePrevious
    }));
    decryptVerboseWrapper.append($('<a/>', {
      'text': 'Next',
      'class': 'raygun-emblem',
      'style': 'color: white; position:absolute; left:-252px; top: 10px; width: auto; font-size: 10px;',
      'click': _decryptVerboseNext
    }));
    emblemEl.append(decryptVerboseWrapper);

    // Add "decrypt" button
    emblemEl.append($('<a/>', {
      'text': 'Decrypt',
      'class': 'raygun-emblem',
      'style': 'color: white; position:absolute; left:-200px; top:-8px; width: auto;',
      'click': _decryptLog
    }));

    // Add "Copy Log" button
    emblemEl.append($('<a/>', {
      'text': 'Copy Log',
      'class': 'raygun-emblem',
      'style': 'color: white; position:absolute; left:-120px; top:-8px; width: auto;',
      'click': _copyLogToClipboard
    }));

    // Add "Update dates" button
    emblemEl.append($('<a/>', {
      'text': 'Show full dates',
      'class': 'raygun-emblem',
      'style': 'color: white; position:absolute; left:50px; top:-8px; width: 100px;',
      'click': _updateShownDates
    }));
  }

  /**
   * Waits for the DOM of the header bar into which our additional buttons are rendered to be ready and calls the
   * "_createButtons" function afterwards.
   *
   * Uses polling and stops trying after too many unsuccessful attempts (ATM after 40 sec).
   */
  function createButtonsAfterDomReady() {
    let retryCnt = 0;
    const retryCntMax = 20;

    function tryCreateButton() {
      const emblemEl = $('.raygun-emblem');
      if (emblemEl.length) {
        _createButtons();
      } else if (retryCnt < retryCntMax) {
        retryCnt++;
        window.setTimeout(tryCreateButton, 2000);
      }
    }

    $(document).ready(tryCreateButton);
  }
  // endregion private functions

  // region create ui
  // endregion create ui

  // public space
  return {
    // region public properties
    // endregion public properties

    // region public functions
    /**
     * Initializes the CbnRaygunExtensions module (add event listeners, ...)
     */
    init: function() {
      // Install interceptor for AJAX calls to read correct error times...
      $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        jqXHR.done(_onXhrDone);
      });

      createButtonsAfterDomReady();
    }
    // endregion public functions
  };
}());
window.CbnRaygunExtensions.init();
