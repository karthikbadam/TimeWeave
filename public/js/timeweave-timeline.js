function TimeLine (options) {
    
    var _self = this; 
    
    _self.margin = {
        top: 20,
        right: 0,
        bottom: 30,
        left: 30
    };
    
    _self.width = options.width - _self.margin.left + _self.margin.right;
    _self.height = options.height;
    
    _self.documents = options.documents;
    
    _self.keyWordFrequency = options.keyWordFrequency;
    
    _self.svg = d3.select("#content").append("svg")
                    .attr("id", "timeline-viz")
                    .attr("class", "timeline")
                    .attr("width", _self.width)
                    .attr(""
                
    
}