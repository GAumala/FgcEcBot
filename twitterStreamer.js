const request = require("request")
const Twitter = require("twitter")
const credentials = require("./credentials.js")
let stream, tweetListenerBot;

const followedUser = 'EVO'
const client = new Twitter({
  consumer_key: credentials.getTwConsumerKey(),
  consumer_secret: credentials.getTwConsumerSecret(),
  access_token_key: credentials.getTwAccessToken(),
  access_token_secret: credentials.getTwAccessKey()
});

client.get('users/show', {screen_name: followedUser}, function(error, tweets, response){
  if(error) throw error;
  const jsonResp = JSON.parse(response.body)
  console.log("user id: " + jsonResp.id);  // The favorites.
  stream = client.stream('statuses/filter', {follow: jsonResp.id});
  if(tweetListenerBot)
    tweetListenerBot.onNewTweet(stream)
});

module.exports  = {
  setBot: function(bot){
    if(stream)
      bot.onNewTweet(stream)
    tweetListenerBot = bot
  }
}
