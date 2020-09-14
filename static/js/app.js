

function init() {
// pull the ids for the drop down

  d3.json("./data/samples.json").then(function(jsdata) {
  listIds = jsdata.samples.map(subjectid => subjectid.id);
  console.log(listIds);
  document.getElementById("selDataset").innerHTML = generatetxt(listIds);
  //panel-body
  

  var otuIds = jsdata.samples[0].otu_ids;
  var otuValues = jsdata.samples[0].sample_values;
  var otuLabels = jsdata.samples[0].otu_labels;
  var trace1 = 
    {
      labels: otuIds.slice(0,10).reverse(),
      values: otuValues.slice(0,10).reverse(),
      type: 'pie'

    };

  var layoutp = {
    title: "Top 10 OTUs for selected Individual",
    height: 400,
    width: 500
    };

  var datapie = [trace1];
    
  Plotly.newPlot('bar', datapie,layoutp);

  var trace2 = 
  {
    x: otuIds,
    y: otuValues,
    text: otuLabels,
    marker: {
      color: otuIds,
      size: otuValues},
    mode: 'markers'
  };

var layoutb = {
  title: "Bubble Chart",
  yaxis: { title: "Sample value"},
  xaxis: { title: "OTU ID"}
  };

var databub = [trace2];

  
Plotly.newPlot('bubble', databub,layoutb);
});
}

/**
 * Fetch data and build the timeseries plot
 */

function buildPlot(value) {
  var otuReferId;
  var xlabels = [];
  var y= [];
  //Fetch the JSON data and console log it

  d3.json("./data/samples.json").then(function(jsdata) {
     console.log(jsdata);
     otuReferId = jsdata.names.indexOf(value);

     if (otuReferId === -1 ) { otuReferId = 0} // set to first patient id.

    var otuIds = jsdata.samples[otuReferId].otu_ids;
    var otuValues = jsdata.samples[otuReferId].sample_values;
    var otuLabels = jsdata.samples[otuReferId].otu_labels;
      
    Plotly.restyle('bar', 'labels', [otuIds.slice(0,10).reverse()]);
    Plotly.restyle('bar', 'values', [otuValues.slice(0,10).reverse()]);


    // redraw bubble chart for new subject
    Plotly.restyle('bubble', 'x', [otuIds] );
    Plotly.restyle('bubble', 'y', [otuValues] );
    Plotly.restyle('bubble', 'text', [otuLabels] );
    Plotly.restyle('bubble', 'color', [otuIds] );
    Plotly.restyle('bubble', 'size', [otuValues] );

  });
}
// fucntion to generate the text for the drop downs.

function generatetxt(keylist) {
  // set up variables being used in function.
  var text = [], i;

  // loop through array to populate the drop down.
  for (i = 0; i < keylist.length; i++) {
    text += "<option>" + keylist[i] + "</option>";
  }
  return text
}


function optionChanged(value) {
  buildPlot(value);
  
}

init();
