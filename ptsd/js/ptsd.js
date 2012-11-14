if (!omh)
  var omh = {};

omh.dash = {};

omh.dash.minTime = Number.MAX_VALUE;
omh.dash.maxTime = 0;
omh.dash.startTime;
omh.dash.endTime;
omh.dash.oneDay = 86400000;
omh.dash.variableHeight = $(window).height() - 300;

omh.dash.idInc = 0;
omh.dash.nextID = function() {
  omh.dash.idInc++;
  return omh.dash.idInc;
};

omh.dash.data = {};

omh.dash.dataTemplate = function() {
  var self = {};
  self.title = null;
  self.dataArray = [];
  self.getColor = function(datum) {
    return "#777";
  };
  return self;
};

omh.dash.createDataSet = function(title, getColorFunk) {
  omh.dash.data[title] = omh.dash.dataTemplate();
  omh.dash.data[title].title = title;
  omh.dash.data[title].getColor = getColorFunk;
};

omh.dash.addData = function(title, datum) {
  var data = omh.dash.data[title];
  datum.parent = data;
  data.dataArray.push(datum);
};

omh.dash.datumTemplate = function() {
  var self = {};
  self.time = null;
  self.values = {};
  return self;
};

omh.dash.plotTimeline = function() {
  //console.log("plotting timeline")
  var dateSelector = $(".dateSelector");
  var wid = dateSelector.width() - 5;
  dateSelector.find(".dataSet").remove();

  //establish bounds
  $.each(omh.dash.data, function(index) {
    $.each(this.dataArray, function(index) {
      if (this.time < omh.dash.minTime)
        omh.dash.minTime = this.time;
      if (this.time > omh.dash.maxTime)
        omh.dash.maxTime = this.time;
    });
  });//end each (omh.dash.data)

  omh.dash.startTime = omh.dash.minTime;
  omh.dash.endTime = omh.dash.maxTime;

  //create blocks
  $(".dataSet").remove();
  $.each(omh.dash.data, function(index) {
    var dataSet = $("<div class='dataSet'>").clone();
    dataSet.data("title", this.title);
    dateSelector.append(dataSet);
    this.dataArray.sort(function(a, b) {
      return a.date - b.date;
    });

    $.each(this.dataArray, function(index) {
      var dataBlock = $("<div class='dataBlock'>");
      dataBlock.data("datum", this);
      var id = omh.dash.nextID();
      dataBlock.attr("id", id);
      var time = this.time;
      time = time - omh.dash.minTime;
      time = time / (omh.dash.maxTime - omh.dash.minTime);
      var left = Math.round(time * wid);
      dataBlock.css("left", left);
      dataBlock.css("background", this.parent.getColor(this));
      dataBlock.css("border-color", this.parent.getColor(this));
      dataBlock.mouseover(function() {
        $(".dataBarInfoDisplay").hide();
        var bId = "b" + dataBlock.attr("id");
        $("#" + bId + " .dataBarInfoDisplay").show();
      });
      dataSet.append(dataBlock);
    });
  });
};

omh.dash.plot = function() {
  var dateSelector = $(".dateSelector");
  var yOffset = $(".dataStacks").position().top + 100;
  //+ dateSelector.position().top
  console.log("yOffset", yOffset);
  omh.dash.variableHeight = $(window).height() - yOffset;
  //console.log("plotting data")
  $(".dataSet").each(function() {
    //$(".dataStack").remove()
    var dataSet = $(this);
    var exists = false;
    $(".stackLabel").each(function() {
      if ($(this).text() === dataSet.data("title")) {
        console.log(dataSet.data("title") + " exists!");
        exists = true;
      }
    });
    if (true) {
      var stack = $(".templates .dataStack").clone().appendTo($(".dataStacks"));
      stack.find(".stackLabel").text(dataSet.data("title"));
      var index = 0;
      dataSet.find(".dataBlock").each(function() {
        var dataBlock = $(this);
        var datum = dataBlock.data("datum");
        //if datum.time is in time bounds
        if (datum.time < omh.dash.startTime || datum.time > omh.dash.endTime) {
        }
        else {
          var dataBar = $("<div class='dataBar'>").appendTo(stack);
          dataBar.data("time", datum.time);
          dataBar.data("index", index);
          dataBar.attr("id", "b" + dataBlock.attr("id"));

          var top;
          if (omh.dash.expanded) {
            var time = datum.time - omh.dash.startTime;
            time = time / (omh.dash.endTime - omh.dash.startTime);
            top = Math.round(time * omh.dash.variableHeight);
          }
          else
            top = index * 3;
          dataBar.css("top", top);
          dataBar.css("background-color", datum.parent.getColor(datum));
          dataBar.css("border-color", datum.parent.getColor(datum));
          dataBar.mouseover(function() {
            $(".dataBarInfoDisplay").hide();
            $(".dataBlock").removeClass("highlight");
            dataBar.find(".dataBarInfoDisplay").show();
            var bId = dataBar.attr("id").replace("b", "");
            $("#" + bId).addClass("highlight");
          });
          var info = $(".templates .dataBarInfoDisplay").clone().appendTo(dataBar);
          info.find(".date").text(datum.date.format("m/dd/yy"));
          var values = info.find(".values");
          $.each(datum.values, function(k, v) {
            values.append($("<label>").text(k + ":"));
            values.append($("<span>").text(v));
            values.append($("<br>"));
          });
          index++;
        }//end else
      });
    }
  });//end each ----------------------------------------------------------------

  $(".dateLabel").remove();
  var daySpan = (omh.dash.endTime - omh.dash.startTime) / omh.dash.oneDay;
  var dateMarker = omh.dash.startTime;
  while (dateMarker < (omh.dash.endTime - omh.dash.oneDay * 7)) {
    dateMarker += (omh.dash.oneDay * 7);
    var time = dateMarker - omh.dash.startTime;
    time = time / (omh.dash.endTime - omh.dash.startTime);
    //var top = Math.round(time * omh.dash.variableHeight);
    var top = time * omh.dash.variableHeight;
    var dateLabel = $("<div class='dateLabel'>"
      + new Date(dateMarker).format("m/dd/yy") + "</div>");
    dateLabel.css("top", top);
    $(".page .dataStack").first().append(dateLabel);
  //console.log($(".dataStack").first())
  //console.log(new Date(dateMarker).format("m/dd/yy"), "top = "+top)
  }
  omh.dash.dateRangeLabel();
};

omh.dash.expanded = false;
omh.dash.expandToggleInit = function() {

  $(".expander").click(function() {
    omh.dash.expanded = !omh.dash.expanded;
    if (omh.dash.expanded) {
      $(".page").addClass("expanded");
      $(".dataBar").each(function() {
        var d = $(this);
        var time = d.data("time");
        time = time - omh.dash.startTime;
        time = time / (omh.dash.endTime - omh.dash.startTime);
        var top = Math.round(time * omh.dash.variableHeight);
        d.animate({
          top: top + ".px",
          duration: 1000,
          queue: false
        });
      });
      return;
    }
    else {
      $(".page").removeClass("expanded");
      $(".dataBar").each(function() {
        var d = $(this);
        d.animate({
          top: d.data("index") * 3,
          duration: 1000,
          queue: false
        });
      });
      return;
    }
  ;
  });
};


omh.dash.colors = function() {
  var self = {};
  self.clrs = [];
  self.clrs.push("red");
  self.clrs.push($.xcolor.average("red", "#E6E600"));
  self.clrs.push("#E6E600");
  self.clrs.push($.xcolor.average("green", "#E6E600"));
  self.clrs.push("green");
  self.get = function(num, min, max) {
    //max = max-min;
    //min = 0;
    num = num / max;
    num = num * self.clrs.length;
    num = Math.round(num);
    if (num < 0)
      num = 0;
    if (num > self.clrs.length - 1)
      num = self.clrs.length - 1;
    return self.clrs[num];
  };
  return self;
}();

omh.dash.dateRangeLabel = function() {
  $(".dateRange .val").text(
    new Date(omh.dash.startTime).format("m/dd/yy") + "-" +
    new Date(omh.dash.endTime).format("m/dd/yy")
    );
};

omh.dash.render = function() {
  omh.dash.plotTimeline();
  omh.dash.plot();
  omh.dash.expandToggleInit();
  $(".expander").click()
};

$(document).ready(function() {
  $("*").disableSelection();
  $(".slider").draggable({
    axis: "x",
    containment: "parent",
    handle: ".handle",
    start: function(event, ui) {
      //console.log("dragging.start")
      omh.dash.dragging = true;
      $(".dataStacks .dataStack").remove();
    },
    drag: function(event, ui) {
      var wid = $(".dateSelector").width();
      var sStart = $(".slider.start");
      var sEnd = $(".slider.end");
      var start = sStart.position().left;
      var end = sEnd.position().left;
      if (start > end) {
        sStart.removeClass("start").addClass("end");
        sEnd.removeClass("end").addClass("start");
      }
      end += 40;
      var diff = omh.dash.maxTime - omh.dash.minTime;
      var sRatio = Math.round(start / wid * diff);
      var eRatio = Math.round(end / wid * diff);
      omh.dash.startTime = omh.dash.minTime + (sRatio);
      omh.dash.endTime = omh.dash.minTime + (eRatio);
      omh.dash.dateRangeLabel();
    },
    stop: function(event, ui) {
      omh.dash.dragging = false;
      omh.dash.plot();
    }
  });
});
