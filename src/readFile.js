const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText
}

var array = readTextFile("file://E:/Project/text-bow-tfidf/src/test.txt")

console.log(array)

