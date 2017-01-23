var strMin = min + "min";
var list = [];
	
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
		if(count == 0)
		{
			parseDataFromCSV(csvF);
		}
		else{
			if(list.length >= count)
			{
				list = [];
			}
			
			var index = 0;
			while (true){
				index = Math.floor(Math.random() * count) + 1
				var kq = $.inArray(index, list);
				if($.inArray(index, list) == -1){
					list.push(index);
					break;
				}
			}
			db.kanjis.get(index, function(item){		
				if(item != undefined){
					var xhr = new XMLHttpRequest();
					xhr.open("GET", textToImgURL + item.kanji);
					xhr.responseType = "blob";
					xhr.onload = function(){
						var blob = this.response;
						// Now create the notification
						chrome.notifications.create('reminder', {
							type: 'basic',
							iconUrl: window.URL.createObjectURL(blob),
							title: item.kanji + "                                  (Lv: N"+item.type+")",
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