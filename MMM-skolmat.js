

Module.register("MMM-skolmat", {
	// Default module config.
	defaults: {
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = 'Skolmat';
		if (this.weekMenu) {
			this.weekMenu.forEach(item => {
				var title = document.createElement("div");
				title.className = "bright small light";
				title.innerHTML = item.title;
				wrapper.appendChild(title);
				var menu = document.createElement("div");
				menu.className = "bright xsmall light menu";
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
});

