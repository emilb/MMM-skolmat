

Module.register("MMM-skolmat", {
	// Default module config.
	defaults: {
	},

	// Override dom generator.
	getDom: function() {
		if (!this.shouldDisplay()) {
			return;
		}

		var wrapper = document.createElement("div");
		wrapper.innerHTML = 'Skolmat';
		if (this.weekMenu) {
			this.weekMenu.forEach(item => {
				var title = document.createElement("div");
				title.className = "bright medium regular";
				title.innerHTML = item.title;
				wrapper.appendChild(title);
				var menu = document.createElement("div");
				menu.className = "bright medium light menu";
				menu.innerHTML = item.menu;
				wrapper.appendChild(menu);
			});
		}

		return wrapper;
    },
    
    start: function() {
		this.weekMenu = [];
        this.sendSocketNotification("SKOLMAT_INIT", this.config);
    },

    // Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "SKOLMAT") {

            this.weekMenu = payload;
            this.updateDom();
		}
	},

    /* scheduleUpdateInterval()
	 * Schedule visual update.
	 */
	scheduleUpdateInterval: function() {
		var self = this;

		self.updateDom(self.config.animationSpeed);

		setInterval(function() {
			self.activeItem++;
			self.updateDom(self.config.animationSpeed);
		}, this.config.updateInterval);
	},
	
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required styles.
	getStyles: function() {
		return ["skolmat.css"];
	},

	shouldDisplay: function() {
		var weekDay = new Date().getDay();

		// Only show if saturday or sunday on even weeks
		if (this.getWeek() % 2 == 0 && (weekDay == 6 || weekDay == 0))
			return true;

		if (this.getWeek() % 2 != 0 && (weekDay == 6 || weekDay == 0))
			return false;

		return this.getWeek() % 2 != 0;
	},

	getWeek: function() {
		// Returns the ISO week of the date.
		var date = new Date();
		date.setHours(0, 0, 0, 0);
		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		// January 4 is always in week 1.
		var week1 = new Date(date.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
							- 3 + (week1.getDay() + 6) % 7) / 7);
	}
});

