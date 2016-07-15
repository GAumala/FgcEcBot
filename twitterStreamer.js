const request = require("request")
const Twitter = require("twitter")
let stream, tweetListenerBot;

const followedUser = 'EVO'
console.log("consumer_key: " + process.env.TWITTER_CONSUMER_KEY)
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
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
