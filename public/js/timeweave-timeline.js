function TimeLine(options) {

    var _self = this;

    _self.margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

    _self.width = options.width - _self.margin.left - _self.margin.right;
    _self.height = options.height - _self.margin.bottom - _self.margin.top;

    _self.documents = options.documents;
    _self.keyWordFrequency = options.keyWordFrequency;

    _self.svg = d3.select("#content").append("svg")
        .attr("id", "timeline-viz")
        .attr("class", "timeline")
        .attr("width", _self.width + _self.margin.left + _self.margin.right)
        .attr("height", _self.height + _self.margin.bottom + _self.margin.top)
        .style("border", "1px solid");

    _self.padding = 8;

    _self.svg.selectAll(".line")
        .data(Object.keys(_self.keyWordFrequency))
        .enter()
        .append("line")
        .attr("class", "line")
        .attr("transform", "translate(" + _self.margin.left + "," +
            _self.margin.top + ")")
        .attr("x1", 0)
        .attr("x2", _self.width)
        .attr("y1", function (d, i) {
            return _self.padding * i;
        })
        .attr("y2", function (d, i) {
            return _self.padding * i;
        })
        .attr("stroke", "#ddd")
        .style("stroke-width", "1px");
    
    _self.svg.selectAll(".keyword")
        .data(Object.keys(_self.keyWordFrequency))
        .enter()
        .append("text")
        .attr("class", "keyword")
        .attr("transform", function (d, i) {
            return "translate(" + (_self.margin.left - 5) + "," + 
                (_self.margin.top + _self.padding * (i + 0.3)) + ")";
        })
        .style("font-family", "Helvetica-Light")
        .style("font-size", "9px")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;   
        });
        

    _self.dateScale = d3.time.scale().range([0, _self.width]);

    _self.dateScale.domain([parseDate("2015-05-01"), d3.max(
        _self.documents, function (d) {
        return d.date;
    })]);
    

    _self.svg.selectAll(".dot")
        .data(_self.documents)
        .enter()
        .append("circle")
        .attr("circle", "dot")
        .attr("transform", "translate(" + _self.margin.left + "," +
            _self.margin.top + ")")
        .attr("cx", function (d) {
            return _self.dateScale(d.date);
        })
        .attr("cy", function (d) {
            var i = Object.keys(_self.keyWordFrequency).indexOf(d.keyword);
            return _self.padding * i;
        })
        .attr("r", 3)
        .attr("fill", "#fb6a4a")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "#fb6a4a")
        .attr("stroke-width", "1px");

}