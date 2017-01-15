/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */ 
var strMin = min + "min";
	
chrome.alarms.create(strMin, {
  delayInMinutes: min,
  periodInMinutes: min
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === strMin) {
    showNotification();
  }
});
	
function showNotification() {
	if(db==null){
		openConnection();
	}
	
	db.kanjis.toCollection().count(function (count){
		console.log("Total kanji: " + count);
		if(count == 0)
		{
			chrome.notifications.create('reminder', {
					type: 'basic',
					iconUrl: 'icon128-2x.png',
					title: 'DB is empty !',
					message: 'DB is empty now. Import data Starting ... !'
			 }, function(){
				 parseDataFromCSV(csvF);
			 });
		}
		else{
			var index = Math.floor(Math.random() * count) + 1
			db.kanjis.get(index, function(item){		
				if(item != undefined){
					/*chrome.notifications.create('reminder', {
							type: 'basic',
							iconUrl: 'icon128-2x.png',
							title: item.kanji + "                                (Lv: N"+item.type+")",
							message: item.hanviet.toUpperCase(),
							contextMessage: item.description.trim() + ", " + item.description1
					});*/
					var xhr = new XMLHttpRequest();
					xhr.open("GET", 'https://dummyimage.com/100x100/fff/000.png&text='+item.kanji);
					xhr.responseType = "blob";
					xhr.onload = function(){
						var blob = this.response;
						// Now create the notification
						chrome.notifications.create('reminder', {
							type: 'basic',
							iconUrl: window.URL.createObjectURL(blob),
							title: item.kanji + "                                 (Lv: N"+item.type+")",
							message: item.hanviet.toUpperCase(),
							contextMessage: item.description.trim() + ", " + item.description1
						});
					};
					xhr.send();
				 }
			 });
		}
	});
}