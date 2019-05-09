var http = require('http');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var sw = require("stopword");
var mimir = require("mimir"),
    bow = mimir.bow,
    dict = mimir.dict,
    tfidf = mimir.tfidf,
    tokenize = mimir.tokenize,
    wordInDocsCount = mimir.wordInDocsCount,
    idf = mimir.idf


// Hàm đọc file
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                // console.log(allText);
            }
        }
	}
    
    rawFile.send(null);
    return allText;
}

// Hàm tìm vị trí của từ khóa trong bộ từ điển
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

var g_textlist = Array();

// Đọc hết các file, loại bỏ stopwords
for(var i = 1; i < 3; i++) {
    if (i < 10) {
        var tenfile = '00'+i;
    } else if (10 <= i < 100){
        var tenfile ='0'+i;
    } else {
      var tenfile = i
    }
    var document_string = readTextFile(`file://E:/data/bus/${tenfile}.txt`);  

    // Loại bỏ stopword trong file
    var document_string_after_stop_word = sw.removeStopwords(document_string.split(" "), sw.en).join(" ");

    g_textlist.push(document_string_after_stop_word);
}

// Bộ từ điển của collection
var voc = dict(g_textlist);

// Đếm số lần xuất hiện của từ 
var count = Object.values(wordInDocsCount(g_textlist))

// BOW của collection
var bowAllDocs = []
g_textlist.forEach(t => {
  bowAllDocs.push(bow(t, voc))
})

// TF-IDF của collection

console.time();
var tfidfAllDocs = []
bowAllDocs.forEach(b => {
    var score = []
    b.forEach( (element, index) => {
        if(element > 0) {
            score.push(tfidf(element, count[index] , g_textlist));
        } else {
            score.push(0);
        }
    })
    tfidfAllDocs.push(score)
});

console.timeEnd();

// HTTP request
http.createServer(function (req, res) {
    res.write('Hello World!'); //write a response to the client

    res.write(JSON.stringify(count))
    res.write(JSON.stringify(idf(count[0], g_textlist)))
    res.end(); //end the response
  }).listen(8080); //the server object listens on port 8080