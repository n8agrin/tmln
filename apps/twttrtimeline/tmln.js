// ==========================================================================
// Project:   Tmln
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Tmln */

// endpoint
// https://api.twitter.com/1/statuses/public_timeline.json?include_entities=true

var PUBLIC_ENDPOINT = "https://api.twitter.com/1/statuses/public_timeline.json?include_entities=true";

Tmln = SC.Application.create();

Tmln.Tweet = SC.Object.extend({
  text: null,
  user: null
});

Tmln.tweetListController = SC.ArrayController.create({
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
      this.pushObject(Tmln.Tweet.create({
        text: tweet.text,
        user: tweet.user
      }));
    }, this);
    
    $.each(data, runner);
  }
});

Tmln.TweetListView = SC.TemplateCollectionView.extend({
  contentBinding: 'Tmln.tweetListController'
});

SC.ready(function() {
  Tmln.mainPane = SC.TemplatePane.append({
    layerId: 'tmln',
    templateName: 'tmln'
  });
  
  Tmln.tweetListController.getTweets();
  setInterval(
    $.proxy(
      Tmln.tweetListController.getTweets,
      Tmln.tweetListController
    )
  , 60 * 1000);
});

