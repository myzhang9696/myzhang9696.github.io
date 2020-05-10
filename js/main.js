
$(function () {

  document.getElementById("date").innerHTML = Date();

  // List of date each past month
  var date_month = []
  for (i = 0; i < 13; i++) {
    var date_1 = new Date();
    date_1.setMonth(date_1.getMonth() - 11 + i);
    date_month.push(date_1);
  }
  // List of date each past week
  var date_week = []
  for (i = 0; i < 5; i++) {
    var date_1 = new Date();
    date_1.setDate(date_1.getDate() - 28 + i*7);
    date_week.push(date_1);
  }

// Search Bar (with react search selection drop box)
// From "https://www.w3schools.com/howto/howto_js_autocomplete.asp"
  var uniqueIDs = _.unique(_.map(data_1, function(f) { return f.EhKey; }));
  function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    //Function presses a key on the keyboard:
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          add_Active(x);
        } else if (e.keyCode == 38) {
          currentFocus--;
          add_Active(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    //Function to classify an item as "active":
    function add_Active(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    //Function to remove the "active" class from all autocomplete items:
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    //Close all autocomplete lists in the document:
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  autocomplete(document.getElementById("myInput"), uniqueIDs);


// All Plot Graphs
// set some global var
  var risk;
  var risk_text;
  var cut_off = 0.28;
  var warranty;
  var id_n = 0;
// plots
  function plot_all(x) {
    var id = x;
    var flag = 0;
    for(var i = 0; i<data_1.length; i++){
      if(data_1[i].EhKey == id){
        risk = data_1[i].Probs;
        id_n = i;
        $("#vehicle_id").text(`Vehicle ID: ${id}`);
        $("#vehicle_dpt").text(`Department: ${data_1[i].EqcDesc}`);
        $("#vehicle_make").text(`Make: ${data_1[i].Make}`);
        $("#vehicle_model").text(`Model: ${data_1[i].Model}`);
        flag =1;
      }
    }
    if(flag==0){
      alert("This ID do not exist");
    }
    risk_text = Math.round(risk * 1000) / 10 + "%";
    if(risk<cut_off){
      var salesDoughnutChartUS = new CanvasJS.Chart("sales-doughnut-chart-us", {
        animationEnabled: true,
        backgroundColor: "transparent",
        title: {
          fontColor: "#848484",
          fontSize: 70,
          horizontalAlign: "center",
          text: risk_text,
          verticalAlign: "center"
        },
        toolTip: {
          backgroundColor: "#ffffff",
          borderThickness: 0,
          cornerRadius: 0,
          fontColor: "#424242"
        },
        data: [
          {
            explodeOnClick: false,
            innerRadius: "96%",
            radius: "90%",
            startAngle: 270,
            type: "doughnut",
            dataPoints: [
              { y: risk*100, color: "#00c700", toolTipContent: `There is a ${risk_text} Chance that the Next Trip is a comeback Trip` },
              { y: (1-risk)*100, color: "#424242", toolTipContent: null }
            ]
          }
        ]
      });
      var salesDoughnutChartNL = new CanvasJS.Chart("sales-doughnut-chart-nl", {
        animationEnabled: true,
        backgroundColor: "transparent",
        title: {
          fontColor: "#848484",
          fontSize: 50,
          horizontalAlign: "center",
          text: "REG",
          verticalAlign: "center"
        },
        toolTip: {
          backgroundColor: "#ffffff",
          borderThickness: 0,
          cornerRadius: 0,
          fontColor: "#424242"
        },
        data: [
          {
            explodeOnClick: false,
            innerRadius: "56%",
            radius: "90%",
            startAngle: 270,
            type: "doughnut",
            dataPoints: [
              { y: 100, color: "#00c700", toolTipContent: "We predict the next trip to be a Regular Trip<span>" },
              { y: 0, color: "#424242", toolTipContent: null }
            ]
          }
        ]
      });
      var salesDoughnutChartDE = new CanvasJS.Chart("sales-doughnut-chart-de", {
        animationEnabled: true,
        backgroundColor: "transparent",
        title: {
          fontColor: "#848484",
          fontSize: 40,
          horizontalAlign: "center",
          text: `${data_1[id_n].EPCycleLength} ${data_1[id_n].CycleDESC}`,
          verticalAlign: "center"
        },
        toolTip: {
          backgroundColor: "#ffffff",
          borderThickness: 0,
          cornerRadius: 0,
          fontColor: "#424242"
        },
        data: [
          {
            explodeOnClick: false,
            innerRadius: "96%",
            radius: "90%",
            startAngle: 270,
            type: "doughnut",
            dataPoints: [
              { y: 100, color: "#00c700", toolTipContent: `The EPCycle or Warranty for this particular Vehicle & Part is ${data_1[id_n].EPCycleLength} ${data_1[id_n].CycleDESC}<span>` },
              { y: 0, color: "#424242", toolTipContent: null }
            ]
          }
        ]
      });
      salesDoughnutChartUS.render();
      salesDoughnutChartNL.render();
      salesDoughnutChartDE.render();
    }else{
      var salesDoughnutChartUS = new CanvasJS.Chart("sales-doughnut-chart-us", {
        animationEnabled: true,
        backgroundColor: "transparent",
        title: {
          fontColor: "#848484",
          fontSize: 70,
          horizontalAlign: "center",
          text: risk_text,
          verticalAlign: "center"
        },
        toolTip: {
          backgroundColor: "#ffffff",
          borderThickness: 0,
          cornerRadius: 0,
          fontColor: "#424242"
        },
        data: [
          {
            explodeOnClick: false,
            innerRadius: "96%",
            radius: "90%",
            startAngle: 270,
            type: "doughnut",
            dataPoints: [
              { y: risk*100, color: "#c70000", toolTipContent: `There is a ${risk_text} Chance that the Next Trip is a comeback Trip` },
              { y: (1-risk)*100, color: "#424242", toolTipContent: null }
            ]
          }
        ]
      });
      var salesDoughnutChartNL = new CanvasJS.Chart("sales-doughnut-chart-nl", {
        animationEnabled: true,
        backgroundColor: "transparent",
        title: {
          fontColor: "#848484",
          fontSize: 50,
          horizontalAlign: "center",
          text: "CB",
          verticalAlign: "center"
        },
        toolTip: {
          backgroundColor: "#ffffff",
          borderThickness: 0,
          cornerRadius: 0,
          fontColor: "#424242"
        },
        data: [
          {
            explodeOnClick: false,
            innerRadius: "56%",
            radius: "90%",
            startAngle: 270,
            type: "doughnut",
            dataPoints: [
              { y: 100, color: "#c70000", toolTipContent: "We predict the next trip to be a Comeback Trip<span>" },
              { y: 0, color: "#424242", toolTipContent: null }
            ]
          }
        ]
      });
      var salesDoughnutChartDE = new CanvasJS.Chart("sales-doughnut-chart-de", {
        animationEnabled: true,
        backgroundColor: "transparent",
        title: {
          fontColor: "#848484",
          fontSize: 40,
          horizontalAlign: "center",
          text: `${data_1[id_n].EPCycleLength} ${data_1[id_n].CycleDESC}`,
          verticalAlign: "center"
        },
        toolTip: {
          backgroundColor: "#ffffff",
          borderThickness: 0,
          cornerRadius: 0,
          fontColor: "#424242"
        },
        data: [
          {
            explodeOnClick: false,
            innerRadius: "96%",
            radius: "90%",
            startAngle: 270,
            type: "doughnut",
            dataPoints: [
              { y: 100, color: "#c70000", toolTipContent: `The EPCycle or Warranty for this particular Vehicle & Part is ${data_1[id_n].EPCycleLength} ${data_1[id_n].CycleDESC}<span>` },
              { y: 0, color: "#424242", toolTipContent: null }
            ]
          }
        ]
      });
      salesDoughnutChartUS.render();
      salesDoughnutChartNL.render();
      salesDoughnutChartDE.render();
    };

    var pageViewsSplineAreaChart = new CanvasJS.Chart("page-views-spline-area-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        lineThickness: 0,
        maximum: date_month[12],
        minimum: date_month[0],
        tickLength: 0,
        valueFormatString: " "
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickLength: 0,
        valueFormatString: " "
      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242"
      },
      data: [
        {
          color: "#424242",
          fillOpacity: 1,
          lineColor: "#ffffff",
          lineThickness: 3,
          markerSize: 0,
          type: "splineArea",
          dataPoints: [
            { x: date_month[0], y: data_1[id_n].cost_month_13_a },
            { x: date_month[1], y: data_1[id_n].cost_month_12_a },
            { x: date_month[2], y: data_1[id_n].cost_month_11_a },
            { x: date_month[3], y: data_1[id_n].cost_month_10_a },
            { x: date_month[4], y: data_1[id_n].cost_month_9_a },
            { x: date_month[5], y: data_1[id_n].cost_month_8_a },
            { x: date_month[6], y: data_1[id_n].cost_month_7_a },
            { x: date_month[7], y: data_1[id_n].cost_month_6_a },
            { x: date_month[8], y: data_1[id_n].cost_month_5_a },
            { x: date_month[9], y: data_1[id_n].cost_month_4_a },
            { x: date_month[10], y: data_1[id_n].cost_month_3_a },
            { x: date_month[11], y: data_1[id_n].cost_month_2_a },
            { x: date_month[12], y: data_1[id_n].cost_month_1_a }
          ]
        }
      ]
    });
    pageViewsSplineAreaChart.render();
    $("#number_1").text(`$ ${Math.round(data_1[id_n].cost_month_1_a)}`);

    var ordersSplineAreaChart = new CanvasJS.Chart("orders-spline-area-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        lineThickness: 0,
        maximum: date_week[4],
        minimum: date_week[0],
        tickLength: 0,
        valueFormatString: " "
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickLength: 0,
        valueFormatString: " "
      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242"
      },
      data: [
        {
          color: "#424242",
          fillOpacity: 1,
          lineColor: "#ffffff",
          lineThickness: 3,
          markerSize: 0,
          type: "splineArea",
          dataPoints: [
            { x: date_week[0], y: data_1[id_n].cost_week_5_a },
            { x: date_week[1], y: data_1[id_n].cost_week_4_a },
            { x: date_week[2], y: data_1[id_n].cost_week_3_a },
            { x: date_week[3], y: data_1[id_n].cost_week_2_a },
            { x: date_week[4], y: data_1[id_n].cost_week_1_a }
          ]
        }
      ]
    });
    ordersSplineAreaChart.render();
    $("#number_2").text(`$ ${Math.round(data_1[id_n].cost_week_1_a)}`);

    var revenueSplineAreaChart = new CanvasJS.Chart("revenue-spline-area-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        lineThickness: 0,
        maximum: date_month[12],
        minimum: date_month[1],
        tickLength: 0,
        valueFormatString: " "
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickLength: 0,
        valueFormatString: " "
      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242"
      },
      data: [
        {
          color: "#424242",
          fillOpacity: 1,
          lineColor: "#ffffff",
          lineThickness: 3,
          markerSize: 0,
          type: "splineArea",
          yValueFormatString: "$###,###.##",
          dataPoints: [
            { x: date_month[1], y: data_1[id_n].Meancost_1 },
            { x: date_month[2], y: data_1[id_n].Meancost_2 },
            { x: date_month[3], y: data_1[id_n].Meancost_3 },
            { x: date_month[4], y: data_1[id_n].Meancost_4 },
            { x: date_month[5], y: data_1[id_n].Meancost_5 },
            { x: date_month[6], y: data_1[id_n].Meancost_6 },
            { x: date_month[7], y: data_1[id_n].Meancost_7 },
            { x: date_month[8], y: data_1[id_n].Meancost_8 },
            { x: date_month[9], y: data_1[id_n].Meancost_9 },
            { x: date_month[10], y: data_1[id_n].Meancost_10 },
            { x: date_month[11], y: data_1[id_n].Meancost_11 },
            { x: date_month[12], y: data_1[id_n].Meancost_12 }
          ]
        }
      ]
    });
    revenueSplineAreaChart.render();
    $("#number_3").text(`$ ${Math.round(data_1[id_n].Meancost_6)}`);

    var comeback_not_sum=data_1[id_n].Comeback_Not_1+data_1[id_n].Comeback_Not_2+data_1[id_n].Comeback_Not_3+data_1[id_n].Comeback_Not_4+
    data_1[id_n].Comeback_Not_5+data_1[id_n].Comeback_Not_6+data_1[id_n].Comeback_Not_7+data_1[id_n].Comeback_Not_8+data_1[id_n].Comeback_Not_9+
    data_1[id_n].Comeback_Not_10+data_1[id_n].Comeback_Not_11+data_1[id_n].Comeback_Not_12;

    var comeback_sum=data_1[id_n].Comeback_1+data_1[id_n].Comeback_2+data_1[id_n].Comeback_3+data_1[id_n].Comeback_4+
    data_1[id_n].Comeback_5+data_1[id_n].Comeback_6+data_1[id_n].Comeback_7+data_1[id_n].Comeback_8+data_1[id_n].Comeback_9+
    data_1[id_n].Comeback_10+data_1[id_n].Comeback_11+data_1[id_n].Comeback_12;

    var percentage_comback = comeback_sum/(comeback_not_sum+comeback_sum)*100

    var usersDoughnutChart = new CanvasJS.Chart("users-doughnut-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      toolTip: {
        backgroundColor: "#000000",
        borderThickness: 2,
        cornerRadius: 0,
        fontColor: "#ffffff",
        contentFormatter: function (e) {
          return e.entries[0].dataPoint.name + ": " + CanvasJS.formatNumber(e.entries[0].dataPoint.y, '###,###')  + "%"; // calcuting and showing percentage of users inside tooltip
        }
      },
      data: [
        {
          innerRadius: "82%",
          radius: "100%",
          showInLegend: false,
          startAngle: 180,
          type: "doughnut",
          dataPoints: [
            { y: Math.round(100-percentage_comback), name: "Regular", color: "#00c700", exploded: true },
            { y: Math.round(percentage_comback), name: "Comeback", color: "#c70000" }
          ]
        }
      ]
    });
    usersDoughnutChart.render();

    var usersSplineChart = new CanvasJS.Chart("users-spline-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        labelFontColor: "#bbbbbb",
        lineColor: "#bbbbbb"
      },
      axisY: {
        gridThickness: 0,
        labelFontColor: "#bbbbbb",
        lineColor: "#bbbbbb"
      },
      legend: {
        dockInsidePlotArea: true,
        fontColor: "#ffffff",
        fontSize: 16,
        horizontalAlign: "right",
        verticalAlign: "top"
      },
      toolTip: {
        backgroundColor: "#000000",
        borderThickness: 2,
        cornerRadius: 0,
        fontColor: "#ffffff",
        shared: true
      },
      data: [
        {
          color: "#00c700",
          legendMarkerType: "square",
          legendText: "Regular Trip",
          name: "Regular Trip",
          showInLegend: true,
          type: "spline",
          dataPoints: [
            { x: date_month[0], y: data_1[id_n].Comeback_Not_1 },
            { x: date_month[1], y: data_1[id_n].Comeback_Not_2 },
            { x: date_month[2], y: data_1[id_n].Comeback_Not_3 },
            { x: date_month[3], y: data_1[id_n].Comeback_Not_4 },
            { x: date_month[4], y: data_1[id_n].Comeback_Not_5 },
            { x: date_month[5], y: data_1[id_n].Comeback_Not_6 },
            { x: date_month[6], y: data_1[id_n].Comeback_Not_7 },
            { x: date_month[7], y: data_1[id_n].Comeback_Not_8 },
            { x: date_month[8], y: data_1[id_n].Comeback_Not_9 },
            { x: date_month[9], y: data_1[id_n].Comeback_Not_10 },
            { x: date_month[10], y: data_1[id_n].Comeback_Not_11 },
            { x: date_month[11], y: data_1[id_n].Comeback_Not_12 }
          ]
        },
        {
          color: "#c70000",
          legendMarkerType: "square",
          legendText: "Comeback",
          name: "Comeback",
          showInLegend: true,
          type: "spline",
          dataPoints: [
            { x: date_month[0], y: data_1[id_n].Comeback_1 },
            { x: date_month[1], y: data_1[id_n].Comeback_2 },
            { x: date_month[2], y: data_1[id_n].Comeback_3 },
            { x: date_month[3], y: data_1[id_n].Comeback_4 },
            { x: date_month[4], y: data_1[id_n].Comeback_5 },
            { x: date_month[5], y: data_1[id_n].Comeback_6 },
            { x: date_month[6], y: data_1[id_n].Comeback_7 },
            { x: date_month[7], y: data_1[id_n].Comeback_8 },
            { x: date_month[8], y: data_1[id_n].Comeback_9 },
            { x: date_month[9], y: data_1[id_n].Comeback_10 },
            { x: date_month[10], y: data_1[id_n].Comeback_11 },
            { x: date_month[11], y: data_1[id_n].Comeback_12 }
          ]
        }

      ]
    });
    usersSplineChart.render();

    var part_sum = data_1[id_n].Others+data_1[id_n].Engine+data_1[id_n].Glass+data_1[id_n].Hydraulic+
    data_1[id_n].Electrical+data_1[id_n].Cranking+data_1[id_n].AC+data_1[id_n].Brakes+
    data_1[id_n].Fuel+data_1[id_n].Unit+data_1[id_n].Quick+data_1[id_n].Tire+data_1[id_n].Light;

    var usersCountriesBarChart = new CanvasJS.Chart("users-countries-bar-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        labelFontColor: "#f7f6f6",
        labelFontSize: 18,
        lineThickness: 0,
        tickThickness: 0
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickThickness: 0,
        valueFormatString: " "

      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242",
        contentFormatter: function (e) {
          return e.entries[0].dataPoint.label + ": " +  CanvasJS.formatNumber(Math.round(e.entries[0].dataPoint.y), '###,###'); // calculating and showing country wise number of users inside tooltip
        }
      },
      data: [
        {
          color: "#424242",
          indexLabelFontColor: "#f7f6f6",
          indexLabelFontFamily: "calibri",
          indexLabelFontSize: 18,
          indexLabelPlacement: "outside",
          type: "bar",
          dataPoints: [
          // { y: data_1[id_n].Engine,  indexLabel: `${Math.round(data_1[id_n].Engine/part_sum*100)}%`,  label: "Engine" },
          //   { y: data_1[id_n].Glass,  indexLabel: `${Math.round(data_1[id_n].Glass/part_sum*100)}%`,  label: "Glass-Component" },
            { y: data_1[id_n].Hydraulic,  indexLabel: `${Math.round(data_1[id_n].Hydraulic/part_sum*100)}%`,  label: "Hydraulic Sys" },
            { y: data_1[id_n].Electrical, indexLabel: `${Math.round(data_1[id_n].Electrical/part_sum*100)}%`, label: "Electrical" },
            { y: data_1[id_n].Cranking,  indexLabel: `${Math.round(data_1[id_n].Cranking/part_sum*100)}%`,  label: "Cranking System" },
            { y: data_1[id_n].AC, indexLabel: `${Math.round(data_1[id_n].AC/part_sum*100)}%`, label: "Air Conditioning" },
            { y: data_1[id_n].Brakes, indexLabel: `${Math.round(data_1[id_n].Brakes/part_sum*100)}%`, label: "Brakes" },
            { y: data_1[id_n].Fuel, indexLabel: `${Math.round(data_1[id_n].Fuel/part_sum*100)}%`, label: "Fuel System" },
            { y: data_1[id_n].Unit,  indexLabel: `${Math.round(data_1[id_n].Unit/part_sum*100)}%`,  label: "Unit Services" },
            { y: data_1[id_n].Quick, indexLabel: `${Math.round(data_1[id_n].Quick/part_sum*100)}%`, label: "Quick Svc Item" },
            { y: data_1[id_n].Tire, indexLabel: `${Math.round(data_1[id_n].Tire/part_sum*100)}%`, label: "Tire Service" },
            { y: data_1[id_n].Light, indexLabel: `${Math.round(data_1[id_n].Light/part_sum*100)}%`, label: "Light System" }
          ]
        }
      ]
    });
    usersCountriesBarChart.render();
  };


// Main()

// plot the original one
  plot_all("000036");
// Reset all plot after clicking the search button
  $("#id_search").click(function(e) {
    plot_all($('#myInput').val());
  });
});
