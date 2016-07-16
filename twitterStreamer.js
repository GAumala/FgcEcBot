const request = require("request")
const Twitter = require("twitter")
let stream, tweetListenerBot;

const usersToFollow = ['EVO', 'CapcomFighters', 'jiyunaJP', 'Furious_blog',
'GamerBeeTW', 'Yoshi_OnoChin', 'fchampryan', 'kazunoko0215', 'daigothebeast']
const userIds = []

console.log("consumer_key: " + process.env.TWITTER_ACCESS_TOKEN_KEY)
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
        tweetListenerBot.onNewTweet(stream)
}

function getTwitterUserId(listOfUsers){
    const newUser = listOfUsers[0]
    client.get('users/show', {screen_name: newUser}, function(error, tweets, response){
        if(error) throw error;
        const jsonResp = JSON.parse(response.body)
        console.log(newUser + " has user id: " + jsonResp.id);  // The favorites.
        userIds.push(jsonResp.id)
        if(userIds.length === usersToFollow.length)
            openTwitterStream()
        else
      getTwitterUserId(listOfUsers.slice(1))
    });
}

getTwitterUserId(usersToFollow)

module.exports  = {
    setBot: function(bot){
        if(stream)
            bot.onNewTweet(stream)
        tweetListenerBot = bot
    },
}
