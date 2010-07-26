/*
 * GOOGLE ALARM
 * alerts you when the Google is watching!
 *
 * Visual & audible alerts are triggered by Google websites,
 * Google Analytics, AdSense, YouTube embeds & other GOOG tracking bugs
 *
 * By Jamie Wilkinson <http://jamiedubs.com>
 * Developed during FAT Lab "Fuck Google Week" <http://fffff.at>
 * Transmediale / Berlin, Germany / 2009
 *
 * Code released under an MIT License
 *
 * Originally based on "Invisible Web" by David Chancel
 * http://code.google.com/p/invisibleweb/ (also MIT licensed)
*/

var soundEnabled = false;

// Audio sample storage locations
// var fileStorage = "chrome://googlealarm/content";
// var fileStorage = "http://fffff.at/google-alarm/files";
var fileStorage = "http://localhost/googlealarm/content";
var soundFiles = fileStorage+'/samples/';

// State storage. TODO refactor into proper hashes, yeesh
var findCode = new Array();
var codeFound = new Array();
var favIco = new Array();
var soundFound = new Array();
var flagFound = new Array();

// Abort immediately if this page is iframe-esque -- < 300x300
var viewport = browserSize();
if(viewport['width'] <= 300 || viewport['height'] <= 300){
  // console.log("Document is too small, skipping");
  return;
}

// Initialize site-type counters
if(false){
  GM_deleteValue('googlealarm_total');
  GM_deleteValue('googlealarm_hits');
}
var websiteCounters = {'total':GM_getValue('googlealarm_total',0), 'hits':GM_getValue('googlealarm_hits',0)};


// -- matchers --
// Google Analytics
findCode[0] = [ 'google-analytics.com/urchin.js', 'google-analytics.com/ga.js' ];
codeFound[0] = 'Google Analytics detected';
favIco[0] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAABD0lEQVQ4y6WSPVLDMBSE9z35AFScgIYmje9DlY4axkfwHThAunAMhhlcUKQid4AGEiLpLYWtRP5hPJBt9LN6q08/ovfPBAmlQWAQRqh1LQLEIhwMaqHzIpQBjhHCALi7J+Z6ew+cU1pze+2oyohzpGrhrIBCLWD70acYjqeU1hTKgKsL1zPy8ZSkasC6bI/g6P+ELFXTa9VF3zPndk87jwiGyXP4j9u2TtV870ysy19DpGqwXi6OxUeCNJmS18vFiCgVD6Uunv5BnpyT5ITjADtMGokoheXhuQpnHrtvDwFBEYCACAEAq80BrEusNl8gAJGEx1OAmsfnbp8/VLoyAMTDy77rt46AY4LXm0v8Vz83U9fcKqJ9mwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNTowNiswMTowMAltsxUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMDgtMDctMjlUMDU6NDE6MDArMDI6MDCCUF3RAAAAAElFTkSuQmCC';
soundFound[0] = soundFiles+"airhorn.wav";

// Google AdSense
findCode[1] = [ 'googlesyndication.com', 'show_ads.js' ];
codeFound[1] = "Google AdSense detected";
favIco[1] = 'data:image/png;base64,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';
soundFound[1] = soundFiles+"ooga.wav";

// YouTube embeds
findCode[2] = [ 'youtube.com/v/' ]; // referenced from object/param tags
codeFound[2] = 'YouTube embed detected';
favIco[2] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAABJ0lEQVQ4y6VSMUvDQBh9F+PSCumio39BBSmogyCCzrWO7eDs2r2LODg5uBRiC7oFdy0uglSkQ9M5deisQ0Ti0tTncMnZI7XE+JZ73+N97/u4O5Bkt1nl8YZFkiyWGjy/9ZgWUATg20VIAKmbtYBus0oAarpT3yIAlmttNWDyTAR8DG0CYG80Vjxu6I3GvwYYSImzyhLc8Cuhm9PMC8tHcOqXEEKgXGtj1TQQ7uxjbX4OxVJD84porcww0e8Dm9vZujsPEMxZROD/iPmCbgr8pDYBQ2uaYZwdEGN9BWqbwJd1zFu25C0bGA6A+7voDtIgX5Ah3gA4PJCa9/KHgGmBEZIBzg20S33syPrqGjg5BYSQ9dMzsLsnX+H18z3TIos5C4Kuy//8g28JihOoOOV3aAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNToxNCswMTowMFJYoqIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMDktMDktMjNUMjA6NTE6MjArMDI6MDCKXDqoAAAAAElFTkSuQmCC';
soundFound[2] = soundFiles+"airhorn2.wav";

// Google-owned domain names
findCode[3] = [ 'url:google.com','url:gmail.com','url:youtube.com' ];
codeFound[3] = 'Google domain detected';
favIco[3] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAADCklEQVQ4yyXSy2ucVRjA4d97zvdNJpPJbTJJE9rYaCINShZtRCFIA1bbLryBUlyoLQjqVl12W7UbN4qb1gtuYhFRRBCDBITaesFbbI3RFBLSptEY05l0ZjLfnMvrov/Bs3gAcF71x6VVHTk+o8nDH+hrH89rUK9Z9Yaen57S3wVtGaMBNGC0IegWKIDxTtVaOHVugZVmH3HX3Zz+4l+W1xvkOjuZfPsspY4CNkZELEgEIJKwYlBjEwjec/mfCMVuorVs76R8+P0KYMmP30U2dT8eIZqAR2ipRcWjEYxGSCRhV08e04oYMoxYLi97EI9YCJ0FHBYbIVGDlUBLwRlLIuYW6chEmQt/rJO09RJjhjEJEYvJYGNhkbUhw43OXtIWDFRq9G87nAaSK6sVRm8r8fzRMWbOX2Xx7ypd7ZET03sQhDOz73DqSJOrd+7HSo4QIu0Nx/4rOzx+cRXZ9+z7+uqJ+3hiepxK3fHZT2tMjXYzOtzL6dmznPzhLexgN0QlxAAYxAlqUqRmkf5j59RlNQ6MFHhgcpCTTx8EUb5e+plD7x4jjg1ANCAgrRQAdR7xKXjBlGyLYi7PxaUmb8z8xcpGHVXLHaXdjI0egKyJiQYTEhSPREVIEUBNC+Mqm+xpz3j0njLPHB2nsh1QgeG+IS48dYbD5YNoo0ZUAbVEuTUoKuBSZOarX/WhyQn6eg2+usDWf0s0tq8zNPYk+WI/Lnge++hlvlyfQ3NdECzGRWKwEEA0qNY251n69kV6+Y0kbaCZoebG2X3oU7pKoyxuXOPe945zs9DCeosGIXoBDyaLdf6ce4Hbk+/Y299ksKtAuaeNsiyw8c1LKIZ95b0MdgxA5giixACpTxEPSau6QdFfI5/2cLPmEW+JAQrtJUJzDXF1dkwHzVodJMX4HFEcQQMaFdPeM0Jb/4PUtzzaLKAhRyJFwo6lbegRNFfk819muV5dR4JBQoQdQ2xFiDmSNDHiaptamR9Gq5cQ18AledrGDpOfeI5Lq8u88smbhMRisoSAgAYghdfn5H/JkHuR1YqVZQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNjo0MSswMTowMKO3OGIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTAtMDItMDVUMjI6MTY6NDErMDE6MDDS6oDeAAAAAElFTkSuQmCC';
soundFound[3] = soundFiles+"siren.wav";
// -- end matchers --


// Initialize
var numFound = 0;
var anyFound = false;
for (var i = 0; i < findCode.length; i++) {
  flagFound[i] = false;
}

// See if the page contains any of our search strings
var x = document.getElementsByTagName("html");
for(var i = 0; i < findCode.length; i++) {
  for(var j = 0; j < findCode[i].length; j++) {
    var scriptMatch = findCode[i][j].toLowerCase(); // look in the page for this
    var urlMatch = findCode[i][j].toLowerCase().replace('url:',''); // look in the doc location for this
    if( x[0].innerHTML.toLowerCase().indexOf(scriptMatch) != -1 || document.location.href.toLowerCase().indexOf(urlMatch) != -1) {
      flagFound[i] = true;
      numFound++;
      anyFound = true;
    }
  }
}

// Log that we visited another webpage
websiteCounters['total'] += 1;
var writingStats = true; // TODO make this just every N visits
if(writingStats){ GM_setValue('googlealarm_total', websiteCounters['total']); }

// Display our awesome messages + sounds
// e.g. Warning: Google here! The Big GOOG! Watch out homey! Sup!
if (anyFound == true) {

  // Increment our googcounter
  websiteCounters['hits'] += 1;
  if(writingStats){ GM_setValue('googlealarm_hits', websiteCounters['hits']); }

  // Inject a ghetto javascript fade-function
  var headID = document.getElementsByTagName("head")[0];
  var newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.innerHTML = "{ function fadeOut(el_id) { var el = document.getElementById(el_id); var b = 155; function f() { el.style.background = 'rgb(255,'+(b+=2)+','+(b+=2)+')'; /*el.style.color = 'rgb(255,'+(255 - b)+',255)';*/ el.style.opacity = -0.7+(255/b); if(b < 255){ setTimeout(f, 20); }else{ el.style.visibility = 'hidden'; } }; f(); } }";
  headID.appendChild(newScript);

  // Create our message div in the top-right
  var ni = document.getElementsByTagName("body");
  var wrapper = document.createElement('div');
  var divIdName = 'google_alarm';
  wrapper.setAttribute('id', divIdName);
  wrapper.setAttribute('style', 'height: 100px; visibility: visible; opacity: 1; position:absolute; top: 6px; right: 12px; z-index: 666666; font-size: 10pt; font-family: sans-serif; font-weight: normal;');

  var growlStyle = 'padding: 9px 3px 8px 110px; text-align: left; -moz-border-radius: 8px;';
  var defaultTimeout = 2500;
  var timeoutLag = 250; // b/w fadeouts

  // Create our overall warning w/ stats
  var top = document.createElement('div');
  var topID = divIdName+'_top';
  top.setAttribute('id', topID);
  // bg WAS f05050
  top.setAttribute('style', growlStyle+'font-size: 90%; color:#ddd; background: #ff0000 url('+fileStorage+'/images/google-logo-redmatte-og.png) 8px 7px no-repeat;');
  top.innerHTML = top.innerHTML + '<img height="32" style="position: absolute; margin-top: -8px; margin-left: -38px;" src="'+fileStorage+'/images/animated-siren.gif" />';
  top.innerHTML = top.innerHTML + websiteCounters['hits']+" / "+websiteCounters['total']+" sites ("+Math.round(parseFloat(websiteCounters['hits']/websiteCounters['total']*100)*10)/10+"%)";
  top.innerHTML = top.innerHTML + '<script type="text/javascript">setTimeout("fadeOut(\''+topID+'\')", '+defaultTimeout+');</script>';
  wrapper.appendChild(top);


  // process each of our Google detections and add appropriate notification msgs + sounds
  for (var i = 0; i < findCode.length; i++) {
    if (flagFound[i] == true) {

      // Create a new Growl-esque notifier
      var msg = document.createElement('div');
      var msgID = divIdName+'_msg_'+i;
      msg.setAttribute('id', msgID);
      msg.setAttribute('style', growlStyle+'; padding-left: 20px; margin-top: 10px; display: block; color: #fff; background-color: #ff0000; top: '+(30+(i*30))+'px;');
      msg.innerHTML = msg.innerHTML + '<span style="margin-right: 8px;">'+codeFound[i]+'</span>';
      if(soundEnabled) {
        msg.innerHTML = msg.innerHTML + '<audio autoplay src="'+soundFound[i]+'"></audio>';
      }

      var timeout = defaultTimeout - ((i+1) * timeoutLag);
      console.log(msgID);
      console.log("timeout="+timeout);
      msg.innerHTML = msg.innerHTML + '<script type="text/javascript">setTimeout("fadeOut(\''+msgID+'\')", '+timeout+');</script>';

      wrapper.appendChild(msg);
    }
  }
  ni[0].appendChild(wrapper);
}
else {
  // Nothing found
}


// -- helper methods --
function browserSize(){
  if (parseInt(navigator.appVersion)>3) {
    if (navigator.appName=="Netscape") {
      winW = window.innerWidth;
      winH = window.innerHeight;
     }
    if (navigator.appName.indexOf("Microsoft")!=-1) {
      winW = document.body.offsetWidth;
      winH = document.body.offsetHeight;
    }
  }
  return {"width":winW, "height":winH};
};


