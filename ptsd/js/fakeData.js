$(document).ready(function(){

  var titles = [
  "SUDs",
  "PTSD Symptoms",
  "PCL 9 (Depression)",
  "Mobility",
  //"Social Behavior",
  //"Time Management"
  ]

  var startTime = 1343521032000
  var endTime = 1346199432000
  var diffTime = endTime - startTime
  
  for(var j = 0; j < titles.length; j++){
    omh.dash.createDataSet(titles[j], function(datum){
      return omh.dash.colors.get(datum.values["Score"],0,10)
    })
    var val = Math.round(Math.random() * 40) + 20
    for(var i = 0; i < val; i++){
      var randTime = 
      startTime + Math.round(Math.random() * diffTime)
      var datum = {
        time:randTime,
        date:new Date(randTime),
        values:{
          "Score": Math.round(Math.random() * 10),
          //"Post Suds":Math.round(Math.random() * 10),
          "Duration":1 + Math.round(Math.random() * 3)+":"
          +Math.round(Math.random() * 6) + ""
          +Math.round(Math.random() * 9)
        }
      }
      omh.dash.addData(datum)
    }
  }
  
  omh.dash.plotTimeline()
  omh.dash.plot()
  omh.dash.expandToggleInit()
}) 
