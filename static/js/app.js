

function init() {
// pull the ids for the drop down

  d3.json("./data/samples.json").then(function(jsdata) {
  var listIds = jsdata.samples.map(subjectid => subjectid.id);
  var demographics = jsdata.metadata[0];
  // console.log(listIds);
  //Create the drop down list of subject IDs
  document.getElementById("selDataset").innerHTML = generatetxt(listIds);

  // Display the demographics for the initial subject
  document.getElementById("sample-metadata").innerHTML = generatedemo(demographics);
  
  // set up the data for the plots using the first subject.
  var otuIds = jsdata.samples[0].otu_ids;
  var otuValues = jsdata.samples[0].sample_values;
  var otuLabels = jsdata.samples[0].otu_labels;

  // produce a pie chart with labels and values
  var trace1 = 
    {
      labels: otuIds.slice(0,10).reverse(),
      values: otuValues.slice(0,10).reverse(),
      type: 'pie'

    };

  // set up the layout
  var layoutp = {
    title: `Top 10 OTUs for Subject ${jsdata.names[0]}`,
    height: 400,
    width: 500
    };

  var datapie = [trace1];

  // put a pie chart at the html class bar location
  Plotly.newPlot('bar', datapie,layoutp);

  // now create the bubble chart
  var trace2 = 
  {
    x: otuIds,
    y: otuValues,
    text: otuLabels,
    colorscale: 'Jet',
    marker: {
      color: otuIds,
      size: otuValues},
    mode: 'markers'
  };

var layoutb = {

  yaxis: { title: "OTU Value"},
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

  //Fetch the JSON data and pull the information out based on the inputted value
  d3.json("./data/samples.json").then(function(jsdata) {

     // Find out the index of the subject from the names identity
     otuReferId = jsdata.names.indexOf(value);

    // Sanity check.  This should never happen, but if you can't find the subject ID
    // in the data than default to subject with index of 0.
    if (otuReferId === -1 ) { otuReferId = 0} // set to first subject id.

    /* 
     set up the variables for the plots from the json file.
     The data is configured like
      names: array of the subject IDs
      metadata: key list of the demographics of the subject.
      samples: array of key list for each subject 
      ==============================================================================================
      (ASSUMPTION: the sample arrays are stored in descending order)
      ==============================================================================================
        id: subject id
        otu_ids: array of test ids
        otu_labels: array of labels
        sample_values: array of the test results (descending order)

    Note: bubble chart doesn't display when following the above coding
    update = {
    x: otuIds,
    y: otuValues,
    text: otuLabels,
    'marker.color': otuIds,
    'marker.size': otuValues
    }; 
    Plotly.restyle('bubble', update,0);
     */
    var otuIds = jsdata.samples[otuReferId].otu_ids;
    var otuValues = jsdata.samples[otuReferId].sample_values;
    var otuLabels = jsdata.samples[otuReferId].otu_labels;

    // rebuild the plot
    Plotly.restyle('bar', 'labels', [otuIds.slice(0,10).reverse()]);
    Plotly.restyle('bar', 'values', [otuValues.slice(0,10).reverse()]);
    Plotly.restyle('bar', 'title', [`Top 10 OTUs for Subject ${value}`])


    // redraw bubble chart for new subject
    Plotly.restyle('bubble', 'x', [otuIds] );
    Plotly.restyle('bubble', 'y', [otuValues] );
    Plotly.restyle('bubble', 'text', [otuLabels] );
    Plotly.restyle('bubble', 'color', [otuIds] );
    Plotly.restyle('bubble', 'size', [otuValues] );

    // Update the demographics for the new subject
    var demographics = jsdata.metadata[otuReferId];
    document.getElementById("sample-metadata").innerHTML = generatedemo(demographics);
  });
}
// function to generate the text for the drop downs.

function generatetxt(keylist) {
  // set up variables being used in function.
  var text = [], i;

  // loop through array to populate the drop down.
  for (i = 0; i < keylist.length; i++) {
    text += "<option>" + keylist[i] + "</option>";
  }
  return text
} 

// fucntion to generate the text for the demographics panel.

function generatedemo(subjectDemo) {
  // set up variables being used in function.
  var text = [];

  // loop through array to populate the drop down.
  text += '<br>Subject ID: ' + subjectDemo.id + '</br>';
  text += '<br>Ethnicity: ' + subjectDemo.ethnicity + '</br>';
  text += '<br>Gender: ' + subjectDemo.gender + '</br>';
  text += '<br>Age: ' + subjectDemo.age + '</br>';
  text += '<br>Location: ' + subjectDemo.location + '</br>';
  text += '<br>BB Type: ' + subjectDemo.bbtype + '</br>';
  text += '<br>W Freq.: ' + subjectDemo.wfreq + '</br>';
  return text
}
// Handle the selection of the new subject id from the drop down
function optionChanged(value) {
  buildPlot(value);
  
}

init();
