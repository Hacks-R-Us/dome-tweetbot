var fs = require('fs');
var Twitter = require('twitter-util').Twitter;
var async = require("async");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var consumerKey = null;
var consumerSecret = null;
var accessToken = null;
var accessTokenSecret = null;

var regex = /@rgbdome ([0-9]+ ){0,1}([0-9]{1,3} [0-9]{1,3} [0-9]{1,3})/g;

function readTweets(){
    var error = function (err, response, body) {
    	console.log('ERROR [%s]', JSON.stringify(err));
    };
    var success = function (data) {
        dealWithTweets(data);
    };

    var config = {
    	"consumerKey": consumerKey["secret"],
    	"consumerSecret": consumerSecret["secret"],
    	"accessToken": accessToken["secret"],
    	"accessTokenSecret": accessTokenSecret["secret"]
    }

    var twitter = new Twitter(config);

    twitter.getMentionsTimeline({ count: '10'}, error, success);
}

function dealWithTweets(data){
    var tweets = JSON.parse(data);

    for (i in tweets){
        console.log('Tweet [%s]', tweets[i]["text"]);

        var found = tweets[i]["text"].match(regex);

        if (found != null){
            tweetData = found[0].split(" ");

            if (tweetData[0] == '@rgbdome'){
                if (tweetData.length == 4){
                    if (tweetData[1] <= 255 && tweetData[2] <= 255 && tweetData[3] <= 255){
                        if (tweetData[1] >= 0 && tweetData[2] >= 0 && tweetData[3] >= 0){
                            console.log("Setting dome to [%s %s %s]", tweetData[1], tweetData[2], tweetData[3]);
                            
                            postData = "[";
                            for (var i = 0; i < 10459; i++){
                                postData += "[" + tweetData[1] + "," + tweetData[2] + "," + tweetData[3] + "],";
                            }

                            postData += "[" + tweetData[1] + "," + tweetData[2] + "," + tweetData[3] + "]";

                            postData += "]";

                            setAllLED(postData);
                        }
                    }
                }else if (tweetData.length == 5){
                    if (tweetData[1] <= 10460 && tweetData[2] <= 255 && tweetData[3] <= 255 && tweetData[4] <= 255){
                        if (tweetData[1] >= 0 && tweetData[2] >= 0 && tweetData[3] >= 0 && tweetData[4] >= 0){
                            console.log("Setting led %s to [%s %s %s]", tweetData[1], tweetData[2], tweetData[3], tweetData[4]);

                            postData = "{\"id\":" + tweetData[1].toString() + ", \"led\":[" + tweetData[2].toString() + "," + tweetData[3].toString() + "," + tweetData[4].toString() + "]}";

                            setSingleLED(tweetData[1], postData);
                        }
                    }
                }
            }
        }
    }
}

function setAllLED(postData){
    var shouldBeAsync = true;

    var request = new XMLHttpRequest();

    request.onload = function () {
        var status = request.status;
        var data = request.responseText;
    }

    request.open("POST", "http://localhost:8080/LED", shouldBeAsync);

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.send(postData);
}

function setSingleLED(id, postData){
    var shouldBeAsync = true;

    var request = new XMLHttpRequest();

    request.onload = function () {
        var status = request.status;
        var data = request.responseText;
    }

    request.open("POST", "http://localhost:8080/LED/" + id.toString(), shouldBeAsync);

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.send(postData);
}

function main() {
    console.log("Starting the fake indie name generator");

    consumerKey = JSON.parse(fs.readFileSync('data/consumerKey.json', 'utf8'));
    consumerSecret = JSON.parse(fs.readFileSync('data/consumerSecret.json', 'utf8'));
    accessToken = JSON.parse(fs.readFileSync('data/accessToken.json', 'utf8'));
    accessTokenSecret = JSON.parse(fs.readFileSync('data/accessSecret.json', 'utf8'));

    readTweets();

    dealWithTweets(data);
}

main();
