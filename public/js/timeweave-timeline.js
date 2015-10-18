function TimeLine(options) {

    var _self = this;

    _self.margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 20
    };

    _self.width = options.width - _self.margin.left - _self.margin.right;
    _self.height = options.height - _self.margin.bottom - _self.margin.top;

    _self.documents = options.documents;
    _self.keyWordFrequency = options.keyWordFrequency;

    _self.svg = d3.select("#content").append("svg")
        .attr("id", "timeline-viz")
        .attr("class", "timeline")
        .attr("width", _self.width + _self.margin.left + _self.margin.right)
        .attr("height", _self.height + _self.margin.bottom + _self.margin.top);


    _self.padding = 15;

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
        .attr("stroke", "gray")
        .style("stroke-width", "2px");

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
        .attr("r", 4)
        .attr("fill", "#fb6a4a")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#fb6a4a")
        .attr("stroke-width", "1.5px");

}