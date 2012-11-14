var showcase = {}
showcase.dataTypes = {}

showcase.dataTypes.moodMap = function() {
  omh.read({
    owner: omh.owner,
    payload_id: "omh:ohmage:campaign:urn:campaign:ohmage:mood_map:survey_id:moodMap",
    payload_version: "1",
    success: function(res) {
      omh.completeLoadingStep("Loading Mood Map");
      if (!res)
        return
      // console.log("res.data",res.data)
      omh.dash.createDataSet("Mood", function(datum) {
        var value = datum.values["Mood"]
        value += 100;
        return omh.dash.colors.get(value, 0, 200)
      })
      omh.dash.createDataSet("Energy", function(datum) {
        var value = datum.values["Energy"]
        value += 100;
        return omh.dash.colors.get(value, 0, 200)
      })
      $.each(res.data, function() {
        var moodDatum = omh.dash.datumTemplate()
        moodDatum.date = new Date(this.metadata.timestamp)
        moodDatum.time = moodDatum.date.getTime()
        moodDatum.values = {
          Mood: this.data.responses[2].value,
          Energy: this.data.responses[1].value
        }
        omh.dash.addData("Mood", moodDatum)

        var eDatum = omh.dash.datumTemplate()
        eDatum.date = new Date(this.metadata.timestamp)
        eDatum.time = moodDatum.date.getTime()
        eDatum.values = {
          Energy: this.data.responses[1].value,
          Mood: this.data.responses[2].value
        }
        omh.dash.addData("Energy", eDatum)
      })
      showcase.render();
    }
  })
}

showcase.dataTypes.ptsdPCL = function() {
  omh.read({
    owner: omh.owner,
    payload_id: "omh:ohmage:observer:com.openmhealth.ohmage.va.ptsd_explorer:pclAssessmentCompleted",
    payload_version: "1",
    success: function(res) {
      omh.completeLoadingStep("Loading PTSD PCL");
      if (!res)
        return
      console.log("PCL", res)

      omh.dash.createDataSet("PTSD Symptoms", function(datum) {
        var value = datum.values["PCL"]
        var range = 84 - 18
        value = value - 18
        value = range - value
        return omh.dash.colors.get(value, 0, range)
      })

      $.each(res.data, function() {
        var ptsdDatum = omh.dash.datumTemplate()
        ptsdDatum.date = new Date(this.metadata.timestamp)
        ptsdDatum.time = ptsdDatum.date.getTime()
        ptsdDatum.values = {
          PCL: this.data.final_score,
          Completed: this.completed
        }
        if (ptsdDatum.time > 1349128424000) {
          omh.dash.addData("PTSD Symptoms", ptsdDatum)
        }
      })
      showcase.render();
    }
  })
}

showcase.dataTypes.ptsdPHQ = function() {
  omh.read({
    owner: omh.owner,
    payload_id: "omh:ohmage:campaign:urn:campaign:va:ptsd_explorer:android:survey_id:phq9Survey",
    payload_version: "1",
    success: function(res) {
      omh.completeLoadingStep("Loading PTSD PHQ");
      if (!res)
        return
      console.log("PHQ9", res)

      omh.dash.createDataSet("Depression Symptoms", function(datum) {
        var value = datum.values["PHQ9"]
        value = 27 - value
        return omh.dash.colors.get(value, 0, 27)
      })

      $.each(res.data, function() {
        var ptsdDatum = omh.dash.datumTemplate()
        ptsdDatum.date = new Date(this.metadata.timestamp)
        ptsdDatum.time = ptsdDatum.date.getTime()
        var total = 0
        $.each(this.data.responses, function() {
          total += this.value
        })
        ptsdDatum.values = {
          PHQ9: total
        }
        if (ptsdDatum.time > 1349128424000) {
          omh.dash.addData("Depression Symptoms", ptsdDatum)
        }
      })
      showcase.render();
    }
  })
}

showcase.dataTypes.ptsdSUDS = function(nextFunction) {
  omh.read({
    owner: omh.owner,
    payload_id: "omh:ohmage:observer:com.openmhealth.ohmage.va.ptsd_explorer:postExerciseSuds",
    payload_version: "1",
    success: function(res) {
      omh.completeLoadingStep("Loading PTSD SUDS");
      if (!res)
        return
      console.log("SUDS", res)
      omh.dash.createDataSet("Pre-Exersize SUDS", function(datum) {
        var value = datum.values["Pre"]
        value = 10 - value
        return omh.dash.colors.get(value, 0, 10)
      })

      omh.dash.createDataSet("Post-Exersize SUDS", function(datum) {
        var value = datum.values["Post"]
        value = 10 - value
        return omh.dash.colors.get(value, 0, 10)
      })

      $.each(res.data, function() {
        var ptsdDatum = omh.dash.datumTemplate()
        ptsdDatum.date = new Date(this.metadata.timestamp)
        ptsdDatum.time = ptsdDatum.date.getTime()
        ptsdDatum.values = {
          Pre: this.data.initial_score,
          Post: this.data.post_score
        }
        if (ptsdDatum.time > 1349128424000) {
          omh.dash.addData("Pre-Exersize SUDS", ptsdDatum)
          omh.dash.addData("Post-Exersize SUDS", $.extend({}, ptsdDatum))
        }
      })
      showcase.render();
    }
  })
}

showcase.dataTypes.gingerIO = function() {
  omh.read({
    owner: omh.owner,
    payload_id: "omh:ginger_io",
    payload_version: "1",
    success: function(res) {
      omh.completeLoadingStep("Loading Ginger IO");
      if (!res)
        return
      console.log("gingerIO", res)
      omh.dash.createDataSet("Communication", function(datum) {
        if (datum.values["Type"] == "SMS") {
          return $.xcolor.average("blue", "blue")
        }
        else if (datum.values["Type"] == "Call") {
          return $.xcolor.average("purple", "purple")
        }
      })
      $.each(res.data, function() {
        var comDatum = omh.dash.datumTemplate()
        comDatum.date = new Date(this.metadata.timestamp)
        comDatum.time = comDatum.date.getTime()
        comDatum.values = {
        }
        if (this.data.sms_length) {
          comDatum.values["Type"] = "SMS"
          comDatum.values["Count"] = this.data.sms_count
          comDatum.values["Total Length"] = this.data.sms_length
          if (comDatum.time > 1326844800000)
            omh.dash.addData("Communication", comDatum)
        }
        else if (this.data.call_duration) {
          comDatum.values["Type"] = "Call"
          comDatum.values["Duration"] = this.data.call_duration
        }
      })
      showcase.render();
    }
  })
}

showcase.dataTypes.mindMyMeds = function() {
  omh.read({
    owner: omh.owner,
    payload_id: "omh:mind_my_meds",
    payload_version: "1",
    success: function(res) {
      omh.completeLoadingStep("Loading Mind My Meds");
      if (!res)
        return
      res = JSON.parse(res)
      console.log("mindMyMeds", res)
      omh.dash.createDataSet("Medications", function(datum) {
        var value = 0;
        switch (datum.values["Status"]) {
          case "NoReply":
            value = 1
            break
          case "Taken":
            value = 2
            break
        }
        return omh.dash.colors.get(value, 0, 3)
      })
      $.each(res.data, function() {
        var medDatum = omh.dash.datumTemplate()
        medDatum.date = new Date(this.data.reminder_sent)
        medDatum.time = medDatum.date.getTime()
        medDatum.values = {
          "Status": this.data.response
        }
        omh.dash.addData("Medications", medDatum)
      })
      showcase.render();
    }
  })
}

/*
 omh.read({
 owner: omh.owner,
 payload_id: "omh:health_vault:condition",
 payload_version: "1",
 success: function(res) {
 if (!res)
 return
 console.log("healthVault", res)
 showcase.render();
 }
 })
 }
 */

showcase.count = 0;
showcase.render = function() {
  showcase.count++;
  if (showcase.count === showcase.len){
    omh.dash.render();
    $(".prog").hide();
  }
  
};

$(document).ready(function() {
  omh.init();
  $(".patient").text("Patient: "+omh.get("omh.owner"));
  showcase.len = 0;
  $.each(showcase.dataTypes, function() {
    showcase.len++;
    omh.addLoadingStep();
  });
  $.each(showcase.dataTypes, function() {
    this();
  });
});