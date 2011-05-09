// ==========================================================================
// Project:   Twttrtimeline
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Twttrtimeline */

// endpoint
// https://api.twitter.com/1/statuses/public_timeline.json?include_entities=true

var PUBLIC_ENDPOINT = "https://api.twitter.com/1/statuses/public_timeline.json?include_entities=true";

Twttrtimeline = SC.Application.create();

Twttrtimeline.Tweet = SC.Object.extend({
  text: null,
  user: null
});

Twttrtimeline.tweetListController = SC.ArrayController.create({
  content: [],
  
  getTweets: function() {
    $.ajax({
      dataType: 'jsonp',
      url: PUBLIC_ENDPOINT,
      success: $.proxy(this._gotTweets, this)
    })
  },
  
  _gotTweets: function(data) {
    var runner = $.proxy(function(idx, tweet) {
      this.pushObject(Twttrtimeline.Tweet.create({
        text: tweet.text,
        user: tweet.user
      }));
    }, this);
    
    $.each(data, runner);
  }
});

Twttrtimeline.TweetListView = SC.TemplateCollectionView.extend({
  contentBinding: 'Twttrtimeline.tweetListController'
});

SC.ready(function() {
  Twttrtimeline.mainPane = SC.TemplatePane.append({
    layerId: 'twttrtimeline',
    templateName: 'twttrtimeline'
  });
  
  Twttrtimeline.tweetListController.getTweets();
  setInterval(
    $.proxy(
      Twttrtimeline.tweetListController.getTweets,
      Twttrtimeline.tweetListController
    )
  , 60 * 1000);
});

