const request = require("request")
const Twitter = require("twitter")
let stream, tweetListenerBot;

const userIds = []

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function openTwitterStream(){
    const userIdsString = JSON.stringify(userIds)
    const userIdsCSV = userIdsString.substring(1, userIdsString.length - 1)
    stream = client.stream('statuses/filter', {follow: userIdsCSV});
    if(tweetListenerBot)
        tweetListenerBot.setTwitterStream(stream)
}

function getTwitterUserId(listOfUsers, totalUsers){
    const newUser = listOfUsers[0]
    client.get('users/show', {screen_name: newUser}, function(error, tweets, response){
        if(error) throw error;
        const jsonResp = JSON.parse(response.body)
        console.log(newUser + " has user id: " + jsonResp.id);  // The favorites.
        userIds.push(jsonResp.id)
        if(userIds.length === totalUsers)
            openTwitterStream()
        else
      getTwitterUserId(listOfUsers.slice(1), totalUsers)
    });
}


module.exports  = {
    init: function(bot){
        getTwitterUserId(bot.usersToFollow, bot.usersToFollow.length)
        tweetListenerBot = bot
    },
}
