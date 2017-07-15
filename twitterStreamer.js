const request = require("request")
const Twitter = require("twitter")
const chalk = require("chalk")

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
} =  process.env

if (!TWITTER_CONSUMER_KEY)
    throwEnvironmentError('TWITTER_CONSUMER_KEY')
if (!TWITTER_CONSUMER_SECRET)
    throwEnvironmentError('TWITTER_CONSUMER_SECRET')
if (!TWITTER_ACCESS_TOKEN_KEY)
    throwEnvironmentError('TWITTER_ACCESS_TOKEN_KEY')
if (!TWITTER_ACCESS_TOKEN_SECRET)
    throwEnvironmentError('TWITTER_ACCESS_TOKEN_SECRET')

let stream, tweetListenerBot;

const userIds = []

const client = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    access_token_key: TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
});

function throwEnvironmentError(varName) {
    throw Error(`Environemnt variable ${varName} not set.`)
}

function openTwitterStream(){
    const userIdsString = JSON.stringify(userIds)
    const userIdsCSV = userIdsString.substring(1, userIdsString.length - 1)
    stream = client.stream('statuses/filter', {follow: userIdsCSV});
    if(tweetListenerBot)
        tweetListenerBot.setTwitterStream(stream)
}

function handleShowErrors(user, errors) {
    errors.forEach(function (error) {
        console.error(chalk.red(`users/show error: ${error.message}`))
    })
    throw new Error(chalk.red(`Could not retrieve Twitter user ${user}'s' id`))
}

function handleShowResponse(remainingUsersToRequest, requestedUser, response) {
    const jsonResp = JSON.parse(response.body)

    if (!jsonResp.id) {
        throw Error(`Could not receive ${requestedUser}'s' id\n got response: response.body`)
    } else
      userIds.push(jsonResp.id)

    if(remainingUsersToRequest.length === 0)
        openTwitterStream()
    else
        getTwitterUserIds(remainingUsersToRequest)
}

function getTwitterUserIds(usersToRequest){
    const user = usersToRequest[0]
    client.get('users/show', {screen_name: user}, function(errors, tweets, response){
        if(errors)
            handleShowErrors(user, errors)
        else
            handleShowResponse(usersToRequest.slice(1), user, response)
    });
}

module.exports  = {
    init: function(bot){
        getTwitterUserIds(bot.usersToFollow)
        tweetListenerBot = bot
    },
}
