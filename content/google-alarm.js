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

var soundEnabled = true;

// Audio sample storage locations
// var fileStorage = "chrome://googlealarm/content";
// var fileStorage = "http://fffff.at/google-alarm/files";
var fileStorage = "http://localhost/googlealarm/content";
var soundFiles = fileStorage+'/samples/';

// Simple data storage. TODO refactor into proper hashes
var findCode = new Array();
var codeFound = new Array();
var favIco = new Array();
var soundFound = new Array();
var flagFound = new Array();

// Abort immediately if this page is iframe-esque (e.g. <300x300)
var viewport = browserSize();
if(viewport['width'] <= 300 || viewport['height'] <= 300){
  // console.log("Document is too small, skipping");
  return;
}

// Initialize site-type counters
// Reset if you add "?reset_googlealarm=1" to any URL
if(document.location.href.toLowerCase().indexOf('?reset_googlealarm=1') != -1){
  GM_deleteValue('googlealarm_total');
  GM_deleteValue('googlealarm_hits');
}
var websiteCounters = {'total':GM_getValue('googlealarm_total',0), 'hits':GM_getValue('googlealarm_hits',0)};


// -- matchers --

// Google-owned domain names
findCode[0] = [ 'url:google.com','url:gmail.com','url:youtube.com' ];
codeFound[0] = 'Google website';
favIco[0] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAADCklEQVQ4yyXSy2ucVRjA4d97zvdNJpPJbTJJE9rYaCINShZtRCFIA1bbLryBUlyoLQjqVl12W7UbN4qb1gtuYhFRRBCDBITaesFbbI3RFBLSptEY05l0ZjLfnMvrov/Bs3gAcF71x6VVHTk+o8nDH+hrH89rUK9Z9Yaen57S3wVtGaMBNGC0IegWKIDxTtVaOHVugZVmH3HX3Zz+4l+W1xvkOjuZfPsspY4CNkZELEgEIJKwYlBjEwjec/mfCMVuorVs76R8+P0KYMmP30U2dT8eIZqAR2ipRcWjEYxGSCRhV08e04oYMoxYLi97EI9YCJ0FHBYbIVGDlUBLwRlLIuYW6chEmQt/rJO09RJjhjEJEYvJYGNhkbUhw43OXtIWDFRq9G87nAaSK6sVRm8r8fzRMWbOX2Xx7ypd7ZET03sQhDOz73DqSJOrd+7HSo4QIu0Nx/4rOzx+cRXZ9+z7+uqJ+3hiepxK3fHZT2tMjXYzOtzL6dmznPzhLexgN0QlxAAYxAlqUqRmkf5j59RlNQ6MFHhgcpCTTx8EUb5e+plD7x4jjg1ANCAgrRQAdR7xKXjBlGyLYi7PxaUmb8z8xcpGHVXLHaXdjI0egKyJiQYTEhSPREVIEUBNC+Mqm+xpz3j0njLPHB2nsh1QgeG+IS48dYbD5YNoo0ZUAbVEuTUoKuBSZOarX/WhyQn6eg2+usDWf0s0tq8zNPYk+WI/Lnge++hlvlyfQ3NdECzGRWKwEEA0qNY251n69kV6+Y0kbaCZoebG2X3oU7pKoyxuXOPe945zs9DCeosGIXoBDyaLdf6ce4Hbk+/Y299ksKtAuaeNsiyw8c1LKIZ95b0MdgxA5giixACpTxEPSau6QdFfI5/2cLPmEW+JAQrtJUJzDXF1dkwHzVodJMX4HFEcQQMaFdPeM0Jb/4PUtzzaLKAhRyJFwo6lbegRNFfk819muV5dR4JBQoQdQ2xFiDmSNDHiaptamR9Gq5cQ18AledrGDpOfeI5Lq8u88smbhMRisoSAgAYghdfn5H/JkHuR1YqVZQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNjo0MSswMTowMKO3OGIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTAtMDItMDVUMjI6MTY6NDErMDE6MDDS6oDeAAAAAElFTkSuQmCC';
soundFound[0] = soundFiles+"siren.ogg";

// Google Analytics
findCode[1] = [ 'google-analytics.com/urchin.js', 'google-analytics.com/ga.js' ];
codeFound[1] = 'Google Analytics';
favIco[1] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAABD0lEQVQ4y6WSPVLDMBSE9z35AFScgIYmje9DlY4axkfwHThAunAMhhlcUKQid4AGEiLpLYWtRP5hPJBt9LN6q08/ovfPBAmlQWAQRqh1LQLEIhwMaqHzIpQBjhHCALi7J+Z6ew+cU1pze+2oyohzpGrhrIBCLWD70acYjqeU1hTKgKsL1zPy8ZSkasC6bI/g6P+ELFXTa9VF3zPndk87jwiGyXP4j9u2TtV870ysy19DpGqwXi6OxUeCNJmS18vFiCgVD6Uunv5BnpyT5ITjADtMGokoheXhuQpnHrtvDwFBEYCACAEAq80BrEusNl8gAJGEx1OAmsfnbp8/VLoyAMTDy77rt46AY4LXm0v8Vz83U9fcKqJ9mwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNTowNiswMTowMAltsxUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMDgtMDctMjlUMDU6NDE6MDArMDI6MDCCUF3RAAAAAElFTkSuQmCC';
soundFound[1] = soundFiles+"airhorn.ogg";

// Google AdSense
findCode[2] = [ 'googlesyndication.com', 'show_ads.js' ];
codeFound[2] = "Google AdSense";
favIco[2] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAAC5klEQVQ4y52TS4tbdQBHz30kN5k4yTzR0XQ6jhS12CpKnYL4QNCNlQoFF7YriyCILkq3goruXIh205WCiAhu1IUiAyqlgsHptJmhL2uGYcZpk0wmz5t7b27u/+ciH0DwfICzOsfyTt/R8ROv06GJFxQx6Rb9VI6puEpoMuBO0qTDjBMRWOOk4jabToqCcQHg0ZPX1R/UJUmxH8hoS3UZxZK2+9Lmxq46klqtUFEiqS9pEErtSH8eXpS7Y81jp7JEQH8sQ7Vb5Otva9wq/U6pbNMPZ6m5dQ4d9Hjm2BKvPG5x5H6HnOlihxWYPb0qo1AN9fWbL714tqTpJ37W33WpKmko6Y6kP65JxaMf6+HHzmpvT1JXujLhiYVTJRltKZT0xkfX9cCR86pFktGWBqYpDROFyci0cqurUnldgbpS1FX5oYLY9+Zt+bH0/vkN3f3UZ1q7ESmQFGpHLQUKtalAbSmQ4sFI5KutRFWtHESu27KwXdizxkglizxSTEMSIyePF3u0U/NYQCbxIZND+NgMseNpTC2PnY73CDD8sH4ZFoeYsRpYBivOQWJRSCCfAFYax4DBJiEBiSnXxW7kcwgbtzEFTWFHk9A1KOXTTRmIQU4EGUhs4ZgsWQSqEGX2YXtJizRQnJ5g+8YOkTOAcY+ok2PcsfEzUMNwsVJltR6zVoOV9SzGm6DtXMH27Aw2uxx9MgbnQT48t0bTjrDzwBDGCLi5muHtU5d46bnvOHHsR5aXK8jkyVlzsP/VQJJ0O5QWDl9UYepzLV+TAsUyktRrSEMpiqXL/0iz+9/Tl9+syGhLl2bmZA+y2wifGW+TX39aYm5ml+PPfsWnn1SoDiDJpWk5PXoubDRi6r2reOM+AJlcD2v2rbJunjuEZ0ZvNCPDmXd/4cL3a0TeJKQO4OQHhPW7KNxT5YXnfT448zL3ZbOUF+Zh6eRVqTMq77/oD5JR26Gkfl9/HbhXbuq1d3j6Av+LL/wd/gUZbg2r/2ZLlQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wNy0yNVQyMjoxNDo0NS0wNzowMEqJbfAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTAtMDMtMjVUMDI6NDI6NDMtMDc6MDAsS/U8AAAAAElFTkSuQmCC';
soundFound[2] = soundFiles+"ooga.ogg";

// YouTube embeds
findCode[3] = [ 'youtube.com/v/' ]; // referenced from object/param tags
codeFound[3] = 'YouTube embed';
favIco[3] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAABJ0lEQVQ4y6VSMUvDQBh9F+PSCumio39BBSmogyCCzrWO7eDs2r2LODg5uBRiC7oFdy0uglSkQ9M5deisQ0Ti0tTncMnZI7XE+JZ73+N97/u4O5Bkt1nl8YZFkiyWGjy/9ZgWUATg20VIAKmbtYBus0oAarpT3yIAlmttNWDyTAR8DG0CYG80Vjxu6I3GvwYYSImzyhLc8Cuhm9PMC8tHcOqXEEKgXGtj1TQQ7uxjbX4OxVJD84porcww0e8Dm9vZujsPEMxZROD/iPmCbgr8pDYBQ2uaYZwdEGN9BWqbwJd1zFu25C0bGA6A+7voDtIgX5Ah3gA4PJCa9/KHgGmBEZIBzg20S33syPrqGjg5BYSQ9dMzsLsnX+H18z3TIos5C4Kuy//8g28JihOoOOV3aAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNToxNCswMTowMFJYoqIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMDktMDktMjNUMjA6NTE6MjArMDI6MDCKXDqoAAAAAElFTkSuQmCC';
soundFound[3] = soundFiles+"airhorn2.ogg";

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

if (anyFound == true) {

  // Increment our googcounter
  websiteCounters['hits'] += 1;
  if(writingStats){ GM_setValue('googlealarm_hits', websiteCounters['hits']); }

  // Inject a ghetto javascript fade-function
  var headID = document.getElementsByTagName("head")[0];
  var newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.innerHTML = "{ function fadeOut(el_id) { var el = document.getElementById(el_id); var b = 155; function f() { el.style.background = 'rgb(255,'+(b+=2)+','+(b+=2)+')'; el.style.opacity = -0.7+(255/b); if(b < 200){ setTimeout(f, 5); }else{ el.style.visibility = 'hidden'; } }; f(); } }";
  headID.appendChild(newScript);

  // Create our message div in the top-right
  var ni = document.getElementsByTagName("body");
  var wrapper = document.createElement('div');
  var divIdName = 'google_alarm';
  wrapper.setAttribute('id', divIdName);
  wrapper.setAttribute('style', 'visibility: visible; opacity: 1; position:absolute; top: 6px; right: 12px; z-index: 666666; font-size: 12px; font-family: sans-serif; font-weight: normal;');

  var defaultTimeout = 2500;
  var timeoutLag = 250; // b/w fadeouts
  var growlStyle = 'padding: 9px 8px 8px 8px; text-align: left; -moz-border-radius: 8px; margin: 0; border: 2px solid #faa;';
  // padding: 9px 3px 8px 110px;


  // Create our top-level warning w/ stats
  var top = document.createElement('div');
  var topID = divIdName+'_top';
  top.setAttribute('id', topID);
  // bg WAS f05050
  top.setAttribute('style', growlStyle+'text-align: center; font-size: 98%; color:#fff; background: #ff0000 url('+fileStorage+'/images/google-logo-redmatte-og.png) 8px 7px no-repeat;');
  top.innerHTML = top.innerHTML + '<img height="32" style="position: absolute; margin-top: -8px; margin-left: -10px;" src="'+fileStorage+'/images/animated-siren.gif" />';
  top.innerHTML = top.innerHTML + '<img height="32" style="position: absolute; margin-top: -8px; margin-left: 20px;" src="'+fileStorage+'/images/animated-siren.gif" />';
  top.innerHTML = top.innerHTML + '<img height="32" style="position: absolute; margin-top: -8px; margin-left: 50px;" src="'+fileStorage+'/images/animated-siren.gif" />';
  top.innerHTML = top.innerHTML + '<span id="google_alarm_stats" style="display: block; margin-top: 25px;">'+websiteCounters['hits']+" of "+websiteCounters['total']+" websites visited ("+Math.round(parseFloat(websiteCounters['hits']/websiteCounters['total']*100)*10)/10+"%)</span>";
  top.innerHTML = top.innerHTML + '<script type="text/javascript">setTimeout("fadeOut(\''+topID+'\')", '+defaultTimeout+');</script>';
  wrapper.appendChild(top);


  // process each of our Google detections and add appropriate notification msgs + sounds
  for (var i = 0; i < findCode.length; i++) {
    if (flagFound[i] == true) {

      // Create a new Growl-esque notifier
      var msg = document.createElement('div');
      var msgID = divIdName+'_msg_'+i;
      msg.setAttribute('id', msgID);
      msg.setAttribute('style', growlStyle+'padding-left: 10px; margin-top: 10px; display: block; color: #fff; background-color: #ff0000; top: '+(30+(i*30))+'px;');
      msg.innerHTML = msg.innerHTML + '<img src="'+favIco[i]+' alt="" style="float: left;" />';
      msg.innerHTML = msg.innerHTML + '<span id="sp1" style="margin-left: 8px;">'+codeFound[i]+'</span>';
      if(soundEnabled) {
        msg.innerHTML = msg.innerHTML + '<audio autoplay src="'+soundFound[i]+'"></audio>';
      }

      var timeout = defaultTimeout - ((i+1) * timeoutLag);
      msg.innerHTML = msg.innerHTML + '<script type="text/javascript">setTimeout("fadeOut(\''+msgID+'\')", '+timeout+');</script>';

      wrapper.appendChild(msg);
    }
  }
  ni[0].appendChild(wrapper);
  flashBorder('google_alarm_top');

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

function getColor(start, end, percent){
	function hex2dec(hex){return(parseInt(hex,16));}
  function dec2hex(dec){return (dec < 16 ? "0" : "") + dec.toString(16);}
	var r1 = hex2dec(start.slice(0,2)), g1=hex2dec(start.slice(2,4)), b1=hex2dec(start.slice(4,6));
	var r2 = hex2dec(end.slice(0,2)),   g2=hex2dec(end.slice(2,4)),   b2=hex2dec(end.slice(4,6));
	var pc = percent/100;
	var r  = Math.floor(r1+(pc*(r2-r1)) + .5), g=Math.floor(g1+(pc*(g2-g1)) + .5), b=Math.floor(b1+(pc*(b2-b1)) + .5);
	return("#" + dec2hex(r) + dec2hex(g) + dec2hex(b));
}

function flashBorder(el_id){
  var test = document.getElementById(el_id);
  test.style.borderColor = getColor("ff0000", "ffffff", Math.random()*75 );
  var frequency = 200;
  setTimeout(function(){ flashBorder(el_id); }, frequency);
}
