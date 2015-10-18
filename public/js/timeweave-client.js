var dataset = "data/documents.json";

var keywords = ["sanders", "clinton", "biden", "trump", "carson"];

var keyWordFrequency = {};

documents = [];

var timeline;

var parseDate = d3.time.format("%Y-%m-%d").parse;

$(document).ready(function () {

    d3.text(dataset, function (data) {

        data = data.split("\n");

        data.forEach(function (d) {

            d = d.slice(0, d.length - 1);
            d = JSON.parse(d);
            
            if (parseDate(d.date.split("T")[0]).getTime() < 
                parseDate("2015-05-01").getTime()) {
                return;   
            }

            d.date = parseDate(d.date.split("T")[0]);
            d.wordCount = +d.wordCount;

            var maxOccurrences = -1;
            var bestKeyword = "";

            var keywordOccurrences = {};

            for (var i = 0; i < keywords.length; i++) {

                var keyword = keywords[i];
                var m = new RegExp(keyword, "g");
                var occurrences = (d.url.toLowerCase().match(m) || []).length +
                    (d.content.toLowerCase().match(m) || []).length;

                if (maxOccurrences < occurrences) {
                    maxOccurrences = occurrences;
                    bestKeyword = keyword;
                }

                keywordOccurrences[keyword] = occurrences;
            }

            d.keyword = bestKeyword;
            d.keywordOccurrences = keywordOccurrences;

            if (!keyWordFrequency[bestKeyword]) {

                keyWordFrequency[bestKeyword] = 0;

            }

            //            if (!documents[bestKeyword]) {
            //             
            //                documents[bestKeyword] = [];
            //                
            //            }

            keyWordFrequency[bestKeyword] ++;

            documents.push(d);

        });

        console.log(documents);

        console.log(keyWordFrequency);

        timeline = TimeLine({
            width: $("body").width(),
            height: $("body").height(),
            keyWordFrequency: keyWordFrequency,
            documents: documents
        });

    });

});