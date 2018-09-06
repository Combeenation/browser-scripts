// ==UserScript==

// @name         MS Outlook Web App Extensions
// @namespace    http://mail.combeenation.com/owa/
// @version      1.0.1
// @description  Add some extensions to MS Outlook Web App like desktop notifications for new mails
// @author       Harrer Michael
// @match        https://mail.combeenation.com/owa/*
// @grant        none
// ==/UserScript==
window.OWAExtensions = (function() {
  // region private variables
  var _notificationShown = false;
  var _tabHasFocus = true;
  // endregion private variables

  // region private functions
  /**
   * Checks if there are any unread mails and shows a desktop notification if so
   * @private
   */
  function _checkForUnreadMails() {
    var query = document.querySelectorAll('._unread_MailFolderTreeNodeView2Mouse_Wa');

    // TODO: Maybe improve shown body text by showing the names of the folders with unread mail and the unread
    //       mail count...
    if (query.length) {
      _notify();
    }
  }

  /**
   * Creates a desktop notification with the given text and handles requesting user permissions etc.
   *
   * @param {String} [bodyText="You have at least one unread mail in your Outlook Web App"]
   */
  function _notify(bodyText) {
    bodyText = bodyText || 'You have at least one unread mail in your Outlook Web App';

    if (_notificationShown || _tabHasFocus) {
      // Only show the notification once and if tab is currently not open..
      return;
    }

    if (!Notification) {
      alert('Desktop notifications not available in your browser...');
      return;
    }

    if ('denied' === Notification.permission) {
      // We need to ask the user for permission
      Notification.requestPermission(function (permission) {
        if ('granted' === permission) {
          _notify(bodyText);
        }
      });
    } else {
      _notificationShown = true;
      new Notification('New Mail', {
        requireInteraction: true,
        body: bodyText,
        icon: 'https://devpublic.blob.core.windows.net/tampermonkey/OWAExtensions/notifcation_icon.png'
      }).onclose = function() {
        _notificationShown = false;
      };
    }
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
     * Initializes the OWAExtensions module
     */
    init: function() {
      console.warn('Initializing OWAExtensions');

      window.setInterval(_checkForUnreadMails, 5000);

      window.onfocus = function () {
        _tabHasFocus = true;
      };

      window.onblur = function () {
        _tabHasFocus = false;
      };
    }
    // endregion public functions
  };
}());
window.OWAExtensions.init();
