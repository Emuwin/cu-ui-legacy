﻿/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// <reference path="../vendor/jquery.d.ts" />
/// <reference path="../cu/cu.ts" />

// Keep in sync with enum on the server in Network/UserConnection.cs

module Announcement {
    export enum AnnouncementType {
        Text = 1,       // In the chat window.
        PopUp = 2,
        ALL = Text | PopUp
    }

    export enum AnnouncementPriority {
        Info = 0,
        Notice = 1,
        Vital = 2
    }

    var $announcement = cu.FindElement('#announcement');
    var $message = cu.FindElement('#message');

    var timeout;

    $announcement.click(hide);

    function onAnnouncement(message, type, priority) {
        // Text should be handled by chat.
        if (type & AnnouncementType.PopUp) {
            show(message);
        }
    }

    function show(message) {
        resetTimeout();

        $message[message.length < 20 ? 'addClass' : 'removeClass']('large').html(message);

        $announcement.css('visibility', 'visible').stop().fadeIn(() => {
            timeout = setTimeout(hide, 5000);
        });
    }

    function hide() {
        $announcement.stop().fadeOut(() => {
            if (timeout) {
                resetTimeout();

                $announcement.css('visibility', 'hidden');
            }
        });
    }

    function resetTimeout() {
        clearTimeout(timeout);
        timeout = null;
    }

    if (cu.HasAPI()) {
        cuAPI.OnAnnouncement(onAnnouncement);
    }
}