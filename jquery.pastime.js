/*
 * live timespans plugin for jquery
 * http://qhoxie.com/code/pastime
 * http://github.com/qhoxie/jquery.pastime
 *
 * usage: $(selector).pastime(options)
 * options:
 *  interval: [seconds]
 *  includeSeconds: [bool]
 *  includeAgo: [bool]
 */

(function($) {
  function timeAgoInWords(fromTime, includeSeconds) {
    return distanceOfTimeInWords(fromTime, new Date(), includeSeconds);
  }

  function distanceOfTimeInWords(fromTime, toTime, includeSeconds) {
    var fromSeconds = fromTime.getTime();
    var toSeconds = toTime.getTime();
    var distanceInSeconds = Math.round(Math.abs(fromSeconds - toSeconds) / 1000)
    var distanceInMinutes = Math.round(distanceInSeconds / 60)
    if (distanceInMinutes <= 1) {
      if (!includeSeconds)
        return (distanceInMinutes == 0) ? 'less than a minute' : '1 minute'
      if (distanceInSeconds < 5)
        return 'less than 5 seconds'
      if (distanceInSeconds < 10)
        return 'less than 10 seconds'
      if (distanceInSeconds < 20)
        return 'less than 20 seconds'
      if (distanceInSeconds < 40)
        return 'half a minute'
      if (distanceInSeconds < 60)
        return 'less than a minute'
      return '1 minute'
    }
    if (distanceInMinutes < 45)
      return distanceInMinutes + ' minutes'
    if (distanceInMinutes < 90)
      return "about 1 hour"
    if (distanceInMinutes < 1440)
      return "about " + (Math.round(distanceInMinutes / 60)) + ' hours'
    if (distanceInMinutes < 2880)
      return "1 day"
    if (distanceInMinutes < 43200)
      return (Math.round(distanceInMinutes / 1440)) + ' days'
    if (distanceInMinutes < 86400)
      return "about 1 month"
    if (distanceInMinutes < 525600)
      return (Math.round(distanceInMinutes / 43200)) + ' months'
    if (distanceInMinutes < 1051200)
      return "about 1 year"
    return "over " + (Math.round(distanceInMinutes / 525600)) + ' years'
  }

  $.fn.pastime = function(options) {
    options = $.extend({}, $.fn.pastime.defaults, options);

    var agoText = options.includeAgo ? " ago" : "";
    var elems = this.map(function() {
      var elem = $(this);
      return {
        elem: elem,
        fromTime: new Date(Date.parse(elem.data('pastime') || elem.text()))
      };
    });

    function updateTimes() {
      return elems.each(function() {
        this.elem.text(timeAgoInWords(this.fromTime, options.includeSeconds) + agoText);
        this.elem.trigger('pastime.updated');
      });
    }

    updateTimes();
    window.setInterval(updateTimes, options.interval * 1000);

    return this;
  };

  $.fn.pastime.defaults = {
    interval: 10,
    includeSeconds: true,
    includeAgo: true
  };
})(jQuery);
