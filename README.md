Google Alarm
------------

This browser add-on visually & audibly notifies you when Google
is monitoring & recording your web browsing, e.g. you visit webpages
containing Google Analytics, AdSense, YouTube embeds, and of course,
when you are using Google products directly (Gmail, google.com, etc).
All of these send data about you & your browsing habits back to Google.

Code
----

[http://github.com/jamiew/google-alarm](http://github.com/jamiew/google-alarm)

Available under an MIT License

Make Your Own
-------------

This addon is a compiled Greasemonkey script that inspects a document
for simple signatures left by Google tracking bugs. It then injects
some HTML, CSS, and javascript into the page, using &lt;audio&gt; for sounds

To get started modifying it, fire up a terminal:

1. git clone git://github.com/jamiew/google-alarm.git
2. cd google-alarm
3. *edit content/google-alarm.js...*
4. rake build
5. rake install

`rake` is "ruby make" -- if you don't have it installed, try:

sudo gem install rake

* `rake build` will generate a Firefox .xpi by correctly zipping 
  the manifest files & content/ and chrome/ directories
* `rake install` just does `open -a Firefox google-alarm.xpi`
* `rake deploy` is what I use to publish the simple website :)

Get started modifying **content/google-alarm.js** -- all of the other
files are basically Greasemonkey support files

For easy, no-recompiling development I recommend installing Greasemonkey, 
loading the above JS as a userscript and modifying it using GM's
inline editor. When done, copy back into content/, recompile, and publish! 

Images and sound are stored as base64-encoded "DataURIs"
To encode new images or sound fx I recommend using [DataURI Kitchen](http://software.hixie.ch/utilities/cgi/data/data)

Notes:

* sound fx are highly-compressed OGG files -- I had trouble
  with the large DataURIs generated using WAVs. YMMV
* The "Chrome version" is really just the google-alarm.js file
  renamed to google-alarm.user.js, and the GM_get/setValue
   


Authors
-----

Jamie Wilkinson | [@jamiew](http://twitter.com/jamiew) | [jamiedubs.com](http://jamiedubs.com)

Copyfree 2010 FAT Lab (Free Art & Technology)

[http://fffff.at](http://fffff.at)
