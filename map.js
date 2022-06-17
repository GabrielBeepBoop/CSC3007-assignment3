//URLS for the datasource
var urlJSON = "https://chi-loong.github.io/CSC3007/assignments/sgmap.json";
var urlCSV = "https://chi-loong.github.io/CSC3007/assignments/population2021.csv";
var populationData = {};

// color scale: 0 - 90000
var colorArray = ["#FAA4F3", "#F780DF", "#F35CC3", "#EE3A9F", "#E91875", "#D31271", "#BD0D6C", "#A50864", "#8D055B", "#74024F", "#590041"];
var populationRange = [10,100,1000,5000,10000,20000,30000,50000,70000,80000,90000]

// Load into a color scale
const colorscale=d3.scaleThreshold()
  .domain(populationRange)
  .range(colorArray);


let width = 1000, height = 600;

let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

// Load external data
Promise.all([d3.json(urlJSON), d3.csv(urlCSV)]).then(data => {

//console.log(data[0]);
//console.log(data[1]);

//console.log(data[0].features[0].properties["Subzone Name"]);
// console.log(data[0].features[0].properties);
// console.log(data[1][0]["Subzone"]);

//  console.log(data[0].features.length);
//  console.log(data[1].length);

// console.log(data[1][0]["Population"]);

// Populate Population Data
for (var i = 0; i < data[1].length; i++){
    result = data[1][i]["Population"]
    if (!isNaN(result)){
        // Only populate those with numbers
        populationData[data[1][i]["Subzone"].toUpperCase()] = data[1][i]["Population"];
    }
}


// Map and projection
var projection = d3.geoMercator()
    .center([103.851959, 1.290270])
    .fitExtent([[20, 20], [980, 580]], data[0]);

let geopath = d3.geoPath().projection(projection);

svg.append("g")
    .attr("id", "districts")
    .selectAll("path")
    .data(data[0].features)
    .enter()
    .append("path")
    .attr("d", geopath)
    .attr("fill", function(d) {
        var color = colorscale(populationData[d.properties["Subzone Name"]]);
        return color;
    })

    //Add the Tooltip
    .on("mouseover", (event, d) => {
        //Display the tooltip
        d3.select(".tooltip")
        .html(d.properties["Subzone Name"] + "<br /> Population Size: " + populationData[d.properties["Subzone Name"]])
        .style("position", "absolute")
        .style("background", "black")
        .style("color", "white")
        .style("opacity", 0.5)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY) + "px")

        //Highlight the area
        d3.select(event.currentTarget)
        .style("stroke", "green")
        .style("stroke-width", "5px")
    })

    .on("mouseout", (event, d) => {
        //Hide the tooltip
        d3.select(".tooltip")
        .text("");
        
        //Return area back to default
        d3.select(event.currentTarget)
        .style("stroke", "white")
        .style("stroke-width", "0px")
    })
})

//Draw the Legends
//First Legend for the undefiend
svg.append("circle")
    .attr('cx',35)
    .attr('cy',20)
    .attr('r',9)
    .style('fill',"black")
    
svg.append("text")
    .attr('x',50)
    .attr('y',20)
    .text("Undefined")
    .style('font-size','12px')
    .attr('alignment-baseline','middle')
    .attr('text-anchor','start')
    .attr('stroke-width','0')

for (var i=0; i<colorArray.length; i++){
  
    svg.append("circle")
    .attr('cx',35)
    .attr('cy',40 + (20*i))
    .attr('r',9)
    .style('fill',colorArray[i])

  svg.append("text")
    .attr('x',50)
    .attr('y',40+ (20*i))
    .text(populationRange[i])
    .attr('alignment-baseline','middle')
    .attr('text-anchor','start')
}