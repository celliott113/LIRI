var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var liriArgument = process.argv[2];

switch (liriArgument) {
  case "my-tweets":
    myTweets();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;

  //Just do some shit here!
  default:
    console.log(
      "\r\n" +
        "Just type some shit you're told to below! 'node liri.js' : " +
        "\r\n" +
        "1. my-tweets 'any twitter name' " +
        "\r\n" +
        "2. spotify-this-song 'any song name' " +
        "\r\n" +
        "3. movie-this 'any movie name' " +
        "\r\n" +
        "4. do-what-it-says." +
        "\r\n" +
        "If movie is more than 1 word, place in quotes! You know what, fuck it! Just put EVERYTHING in quotes!"
    );
}

//Some damn function that pulls movie info from a money grubbing company that steals your dollars for an API key! Jerks!
function movieThis() {
  var movie = process.argv[3];
  if (!movie) {
    movie = "hackers";
  }
  params = movie;
  request(
    "http://www.omdbapi.com/?t=" +
      params +
      "&y=&plot=short&r=json&tomatoes=true",
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var movieObject = JSON.parse(body);
        var movieResults =
          "------------------------------------------------------------" +
          "\r\n";
        "Title: " +
          movieObject.Title +
          "\r\n" +
          "Year: " +
          movieObject.Year +
          "\r\n" +
          "Imdb Rating: " +
          movieObject.imdbRating +
          "\r\n" +
          "Country: " +
          movieObject.Country +
          "\r\n" +
          "Language: " +
          movieObject.Language +
          "\r\n" +
          "Plot: " +
          movieObject.Plot +
          "\r\n" +
          "Actors: " +
          movieObject.Actors +
          "\r\n" +
          "Rotten Tomatoes Rating: " +
          movieObject.tomatoRating +
          "\r\n" +
          "Rotten Tomatoes URL: " +
          movieObject.tomatoURL +
          "\r\n" +
          "------------------------------------------------------------" +
          "\r\n";
        console.log(movieResults);
        log(movieResults);
      } else {
        console.log("Error :" + error);
        return;
      }
    }
  );
}

//A function that let's you play with a little blue pecker!
function myTweets() {
  var client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
  var twitterUsername = process.argv[3];
  if (!twitterUsername) {
    twitterUsername = "KillerSentry13";
  }
  params = { screen_name: twitterUsername };
  client.get("statuses/user_timeline/", params, function(
    error,
    data,
    response
  ) {
    if (!error) {
      for (var i = 0; i < data.length; i++) {
        var twitterResults =
          "@" +
          data[i].user.screen_name +
          ": " +
          data[i].text +
          "\r\n" +
          data[i].created_at +
          "\r\n" +
          "------------------------------ " +
          i +
          " ------------------------------" +
          "\r\n";
        console.log(twitterResults);
        log(twitterResults);
      }
    } else {
      console.log("Error :" + error);
      return;
    }
  });
}

//Go listen to some damn tunes and leave me alone!
function spotifyThisSong(songName) {
  var songName = process.argv[3];
  if (!songName) {
    songName = "Deadpool Rap";
  }
  params = songName;
  spotify.search({ type: "track", query: params }, function(err, data) {
    if (!err) {
      var songInfo = data.tracks.items;
      for (var i = 0; i < 5; i++) {
        if (songInfo[i] != undefined) {
          var spotifyResults =
            "Artist: " +
            songInfo[i].artists[0].name +
            "\r\n" +
            "Song: " +
            songInfo[i].name +
            "\r\n" +
            "Album the song is from: " +
            songInfo[i].album.name +
            "\r\n" +
            "Preview Url: " +
            songInfo[i].preview_url +
            "\r\n" +
            "------------------------------ " +
            i +
            " ------------------------------" +
            "\r\n";
          console.log(spotifyResults);
          log(spotifyResults);
        }
      }
    } else {
      console.log("Error :" + err);
      return;
    }
  });
}

//You don't do what it says, you're gonna get an error. Don't come cryin' to me about it!
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (!error) {
      doWhatItSaysResults = data.split(",");
      spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
    } else {
      console.log("Error occurred" + error);
    }
  });
}

//Yeah that's right, we're recording your inputs! Deal with it!
function log(logResults) {
  fs.appendFile("log.txt", logResults, error => {
    if (error) {
      throw error;
    }
  });
}
