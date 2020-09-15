/*
  Initalizae the drop down tags for interactive display.  Initalize the demographics and plots 
  using the first subject.  Subsequent plots will be with restyle.  
*/

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

    var subjectText = `<h2 class="text-center">Subject: ${listIds[0]} Results</h2>`;
    document.getElementById("subject-header").innerHTML = subjectText;
    
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
      title: `Top 10 OTUs`,
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
      autocolorscale: true,
      //colorscale: 'Jet',
      marker: {
        color: otuIds,
        size: otuValues},
      mode: 'markers'
    };

    // format the layout
    var layoutb = {

      yaxis: { title: "OTU Value"},
      xaxis: { title: "OTU ID"}
      };

    // format the data input
    var databub = [trace2];

    // plot the bubble chart  
    Plotly.newPlot('bubble', databub,layoutb);

    // set up the data for the gauge
    var dataguage = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: demographics.wfreq,
        title: { text: "Belly Button Washing" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range:[0,9]},
          steps: [
            {range: [0,1], color: "white"},
            {range: [1,2], color: "linen"},
            {range: [2,3], color: "tan"},
            {range: [3,4], color: "white"},
            {range: [4,5], color: "linen"},
            {range: [5,6], color: "tan"},
            {range: [6,7], color: "white"},
            {range: [7,8], color: "linen"},
            {range: [8,9], color: "tan"}
          ]
        }
      }
    ];

    var layoutguage = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    // Plot the gauge
    Plotly.newPlot('gauge', dataguage, layoutguage);
  });
}

/*
  Find the new subject and populate the demographics and plots 
  based on that using restyle.  
  Inputs
    value - integer from the drop down. 

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
    //Plotly.restyle('bar', 'layoutp.title', [`Top 10 OTUs for Subject ${parseInt(value)}`])


    // redraw bubble chart for new subject
    Plotly.restyle('bubble', 'x', [otuIds] );
    Plotly.restyle('bubble', 'y', [otuValues] );
    Plotly.restyle('bubble', 'text', [otuLabels] );
    Plotly.restyle('bubble', 'color', [otuIds] );
    Plotly.restyle('bubble', 'size', [otuValues] );

    // Update the demographics for the new subject
    var demographics = jsdata.metadata[otuReferId];
    document.getElementById("sample-metadata").innerHTML = generatedemo(demographics);

    // Update the header.
    var subjectText = `<h2 class="text-center">Subject: ${value} Results</h2>`;
    document.getElementById("subject-header").innerHTML = subjectText;

    // Update the guage for the subject.
    Plotly.restyle('gauge', 'value', [demographics.wfreq]);
  });
}

/* function to generate the text for the drop downs.  This function creates a text string
  used to populate the drop down. 
  Input:
    keylist - array of integers containing the subject ID

  Returns:
    text - text string with html encoding with the format of 
      <option> integer </option>

*/

function generatetxt(keylist) {
  // set up variables being used in function.
  var text = [], i;

  // loop through array to populate the drop down.
  for (i = 0; i < keylist.length; i++) {
    text += "<option>" + keylist[i] + "</option>";
  }
  return text
} 

/* function to generate the text for the demographics panel.
  Input:
    subjectDemo: key value providing the demographics of the subject
      id: Integer
      ethnicity: tet field
      gender: single character
      age: integer
      location: text field
      bbtype:  Single character
      wfreq:  integrer between 0 and 9
  Returns:
    text - text string with html encoding

*/

function generatedemo(subjectDemo) {
  // set up variables being used in function.
  var text = [];

  // populate the demographics Info Panel.
  text += '<p class="font-weight-bold">Subject ID: ' + subjectDemo.id + '</p>';
  text += '<p class="font-weight-bold">Ethnicity: ' + subjectDemo.ethnicity + '</p>';
  text += '<p class="font-weight-bold">Gender: ' + subjectDemo.gender + '</p>';
  text += '<p class="font-weight-bold">Age: ' + subjectDemo.age + '</p>';
  text += '<p class="font-weight-bold">Location: ' + subjectDemo.location + '</p>';
  text += '<p class="font-weight-bold">BB Type: ' + subjectDemo.bbtype + '</p>';
  text += '<p class="font-weight-bold">W Freq.: ' + subjectDemo.wfreq + '</p>';
  return text
}

// Handle the selection of the new subject id from the drop down
/* function to generate the text for the demographics panel.
  Input:
    value - information from the drop down field. Integer 

*/
function optionChanged(value) {
  buildPlot(value);
  
}

init();
