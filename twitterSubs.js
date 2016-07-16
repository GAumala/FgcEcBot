const storage = require('node-persist');
//init storage
storage.initSync()
const TWITTER_SUBS_KEY = "twitterSubs"
const twitterSubs = storage.getItem(TWITTER_SUBS_KEY) || []
console.log("loaded subs: " + JSON.stringify(twitterSubs))

module.exports = {
  remove: function(chat_id){
    const chatIndex = twitterSubs.indexOf(chat_id)
    if(chatIndex > -1){
      twitterSubs.splice(chatIndex, 1)
      storage.setItem(TWITTER_SUBS_KEY, twitterSubs)
      return true
    }
    return false
  },

 push: function(chat_id){
   if(twitterSubs.includes(chat_id))
    return false
   twitterSubs.push(chat_id)
   storage.setItem(TWITTER_SUBS_KEY, twitterSubs)
   return true
 },

 list: function(){
   return twitterSubs.slice()
 }

}
