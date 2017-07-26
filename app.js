//notes
// if you are using Chrome you may get a cross origin issue 
// since im not using a server,this chrome plugin should make everything work
//https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en


function initMap() {
        var uluru = {lat: 38.39139, lng: -122.33772};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 18,
          center: uluru,
          mapTypeId: 'satellite'
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
}

var state = {
	data: []
}

function getData() {
	$.getJSON("https://api.darksky.net/forecast/520daf995809f26a46e1ce03760f6786/38.39139,-122.33772", function(data) {
		state.data = data;
		console.log('localstate',state.data);
		updateCurrentConditions(state.data);
	})
}

function updateCurrentConditions(data){
	$( ".tempnum" ).html(data.currently.temperature);
	$( ".humiditynumber" ).html(data.currently.humidity);
	$( ".presurenumber" ).html(data.currently.pressure);
 	$(".temp").css("width", `${data.currently.temperature*2}`);
 	$(".humidity").css("width", `${data.currently.humidity}`);
 	$(".presurebar").css("width", `${data.currently.pressure /10}`);
}

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	var hourlyDataArray = state.data.hourly.data;
	var graphData =[['hour','']]
	var startDate = new Date(1000*hourlyDataArray[0].time);
	var startTime = startDate.toLocaleString().slice(11,23)
	var endDate = new Date(1000*hourlyDataArray[11].time);
	var endTime = endDate.toLocaleString().slice(11,23)
	$( ".hourlytime" ).html(startTime);
	$( ".hourlyendtime" ).html(endTime);

	for (i = 0; i < 12; i++) { 
    	myDate= new Date(1000*hourlyDataArray[i].time);
    	time = (myDate.toLocaleString());
    	dirtyData = time.slice(11,13)
    	var cleanData = dirtyData.replace(/:/i, '');
    	var hourlyTemp = hourlyDataArray[i].temperature
    	graphData.push([cleanData,hourlyTemp])
	}
    var data = google.visualization.arrayToDataTable(graphData);
    var options = {
      title: 'observed',
      legend: { position: 'none' },  
    };
    var chart = new google.visualization.LineChart(document.getElementById('HFgraph'));
    chart.draw(data, options);
}
	google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(dailygraph);

function dailygraph() {
	var dailyDataArylength = state.data.daily.data.length;
	var dailyDataArray = state.data.daily.data;
	console.log('look here',dailyDataArylength)
	var graphData =[['Day', 'High', 'tempLow']]
	for (i = 0; i < dailyDataArylength; i++) { 
		mydailyDate= new Date(1000*dailyDataArray[i].time);
		var daystring = mydailyDate.toString()
		var day = daystring.slice(0,3)
		var dayHigh = dailyDataArray[i].temperatureMax;
		console.log(isNaN(dayHigh))
		
		var dayLow = dailyDataArray[i].temperatureMin;
		graphData.push([day,dayLow,dayHigh]);   	
	}

		console.log(graphData)
    var data = new google.visualization.arrayToDataTable(graphData);

    var options = {
    legend: { position: 'none' }, 
      chart: {
        title: 'observed',
        
        subtitle: ''
      },
      bars: 'vertical', 
      series: {
        0: { axis: 'days' }, 
        1: { axis: 'temp' } 
      },
      axes: {
        x: {
          days: {label: 'parsecs'}, // Bottom x-axis.
          temp: {side: 'top', label: 'apparent magnitude'} // Top x-axis.
        }
      }
    };

  var chart = new google.charts.Bar(document.getElementById('DFgraph'));
  chart.draw(data, options);
};










getData()





























