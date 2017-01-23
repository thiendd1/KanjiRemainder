var db = null;
var filesInput;

/** Process DB */
function openConnection()
{
	/*
	|----------------------------|
	| Make a database connection |
	|----------------------------|
	*/
	db = new Dexie(dbName);

	// Define a schema
	db.version(1).stores({
		kanjis: '++id, kanji, hanviet, description, description1, type'
	});

	// Open the database
	db.open().catch(function(error) {
		console.log('Uh oh : ' + error);
	});
	console.log('Database ready !');
}

function parseDataFromCSV(csvF)
{
	if(db==null){
		openConnection();
	}
	
	db.kanjis.count(function(count){
		if(count == 0){
			Papa.parse(csvF, {
				download: true,
				complete: function(results) {
					if(results != undefined)
					{
						putData(results.data)
					}
				}
			});
		}
		else{
			console.log("Data is ready !");
		}
	});
}

function putData(array){
	if(array.length > 0){
		if(db==null){
			openConnection();
		}
		
		var kanji = 0, hanviet=1,description=2, description1=3,type=4;
		var items = [];
		insertData = function(item, index){
			if(index > 0){
				items.push({
					kanji: item[kanji],
					hanviet: item[hanviet],
					description: item[description],
					description1: item[description1],
					type: item[type]});
			}
		}
		array.forEach(insertData);
		
		// Put Data
		db.kanjis.bulkAdd(items).then(function () {
				console.log("Import data success !")
		}).then(showNotification()).catch(function(error) {
		   console.log("Ooops: " + error);
		});
	}
}

function getItem(id)
{
	if(db==null){
		openConnection();
	}
	
	db.kanjis.get(id, function(item){
		return item;
	});
}
/** Process DB END */

