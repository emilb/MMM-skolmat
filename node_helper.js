const NodeHelper = require('node_helper');
var request = require('request');
var FeedMe = require("feedme");
var iconv = require("iconv-lite");
var moment = require('moment');


module.exports = NodeHelper.create({

    reloadInterval: 5 * 60 * 1000,

    // Subclass start method.
    start: function () {
        console.log("Starting node helper: " + this.name);
    },

    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'SKOLMAT_INIT') {
            this.config = payload;
            this.reloadTimer = null;
            this.fetchWeekMenu();
        }
    },

    fetchWeekMenu: function () {

        const self = this;
        weekMenu = [];
        var url = 'http://skolmaten.se/margretelundsskolan/rss/days/?limit=7';

        var parser = new FeedMe();
        
        parser.on("item", function(item) {

            var title = item.title;
            var description = item.description || item.summary || item.content || "";

            if (title && description) {

                //var regex = /(<([^>]+)>)/ig;
                //description = description.replace(regex, "");

                weekMenu.push({
                    title: title,
                    menu: description
                });

            } else {

                // console.log("Can't parse feed item:");
                // console.log(item);
                // console.log('Title: ' + title);
                // console.log('Description: ' + description);
                // console.log('Pubdate: ' + pubdate);

            }
        });

        parser.on("end", function() {
            self.sendSocketNotification("SKOLMAT", weekMenu);
            self.scheduleTimer();
        });

        parser.on("error", function(error) {
            console.log('Failed to fetch week menu');
            self.scheduleTimer();
        });

        nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
        headers = { "User-Agent": "Mozilla/5.0 (Node.js " + nodeVersion + ") MagicMirror/" + global.version + " (https://github.com/MichMich/MagicMirror/)" }


        request({uri: url, encoding: null, headers: headers})
        .on("error", function(error) {
            scheduleTimer();
        })
        .pipe(iconv.decodeStream("UTF-8")).pipe(parser);
    },

    scheduleTimer: function () {
        var self = this;
        clearTimeout(this.reloadTimer);
        this.reloadTimer = setTimeout(function () {
            self.fetchWeekMenu();
        }, this.reloadInterval);
    }
});
