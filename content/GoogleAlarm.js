// ==UserScript==
// @name           Google Alarm
// @namespace      Jamie Wilkinson
// @description    Alerts you when the Big Goog is watching! Analytics tracking bugs, AdSense, YouTube embeds & more
// @include        *
// ==/UserScript==

// part of FAT Lab's "FUCK GOOGLE" week
// http://fffff.at/fuck-google
// created at Transmediale 2010 in Berlin

// Based on Invisible Web by David Chancel, which evolved into Ghostery
// http://code.google.com/p/invisibleweb/
// MIT Licensed (as is this code)


// begin
var x = document.getElementsByTagName("html");

// parallel arrays which contain the source code to search for, and the string the display once it has been found, 
// and a boolean for whether the search string was present -- FIXME this could be merged into simpler hashes
var findCode = new Array();
var codeFound = new Array();
var favIco = new Array();
var soundFound = new Array();
var flagFound = new Array(); // stores match results


// temp remote file storage -- replace with dataURIs when finalized
var remoteSound = "http://localhost/google-alarm/samples/";
// var remoteSound = "http://fffff.at/files/google-alarm/samples/";

// Analytics
findCode[0] = [ 'google-analytics.com/urchin.js', 'google-analytics.com/ga.js' ];
codeFound[0] = 'Analytics detected!';
favIco[0] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAABD0lEQVQ4y6WSPVLDMBSE9z35AFScgIYmje9DlY4axkfwHThAunAMhhlcUKQid4AGEiLpLYWtRP5hPJBt9LN6q08/ovfPBAmlQWAQRqh1LQLEIhwMaqHzIpQBjhHCALi7J+Z6ew+cU1pze+2oyohzpGrhrIBCLWD70acYjqeU1hTKgKsL1zPy8ZSkasC6bI/g6P+ELFXTa9VF3zPndk87jwiGyXP4j9u2TtV870ysy19DpGqwXi6OxUeCNJmS18vFiCgVD6Uunv5BnpyT5ITjADtMGokoheXhuQpnHrtvDwFBEYCACAEAq80BrEusNl8gAJGEx1OAmsfnbp8/VLoyAMTDy77rt46AY4LXm0v8Vz83U9fcKqJ9mwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNTowNiswMTowMAltsxUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMDgtMDctMjlUMDU6NDE6MDArMDI6MDCCUF3RAAAAAElFTkSuQmCC';
soundFound[0] = remoteSound+"lasers.wav";

// AdSense
findCode[1] = [ 'googlesyndication.com', 'show_ads.js' ];
codeFound[1] = "AdSense detected!";
// favIco[1] = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC1tbUFHBwcFQAAABoAAAAaAAAAFgAAAA8AAAAWBAAAGwIAABoAAAAXAAAAGQAAABkAAAAaAAAAGg0NDRiOjo4JJiYmDwAAABQAAAATAAAADQwCAR1YFRB4nCsqua0yLMSbLCyxYxoYfBgFAiwDAQAUAAAAEgAAABMAAAAUBwcHEhQUFA0AAAAOAAAACxMEARayLy%2FF7T9C%2F640K7FuJR1pZiMgYpczMZqeLSzBIAcFPQEBABAAAAANAAAADgAAAA4XFxcJAAAACgAAAABbKSNY%2F1ZO%2F3MdHY8AAAAAAAAAAAAAAAAAAAAAjzc2lHwdG7oDAAAVAAAACAAAAAoAAAAKFxcXBgAAAAcAAAAAVj43Tfx6df87BQFmAQIAAgAAAAQAAAAEAAAAAI0vJomvLCftCwEAHQAAAAQAAAAHAAAABxEREQQAAAAEAAAAAwYEAAi4bVm0uT8%2F4UwOC1wnBgMlFAQAEF4YGmnwQ0X8niQfxQEAAAgAAAADAAAABAAAAAQzMzMCHh4eAh8fHwMAAAAAKSglBJVbWGfQX16qxktJsLItKNTqP0X%2F5DxE8VklJTsAAAAAHx8fAh8fHwIfHx8C7%2B%2FvBO3t7QTt7e0E7e3tBOrr6wIAAAAAAAAAALWHgkH%2BVFD%2FxjI226J1dDYAAAAA7e7uBO3t7QTt7e0E7e3tBP%2F%2F%2Fwn%2F%2F%2F8K%2F%2F%2F%2FCv%2F%2F%2Fwv%2F%2F%2F8Eybi3HHw1LHeySkjC%2Fnd2%2F34iIZ1rbGkJ8fHxCv%2F%2F%2Fwr%2F%2F%2F8K%2F%2F%2F%2FCv%2F%2F%2Fwr%2F%2F%2F8R%2F%2F%2F%2FE%2F%2F%2F%2FxP%2F%2F%2F8P9OTiHtFGSNHPKS%2F%2F15KSeP7k4Evgb3DOXh4cjouJiCD9%2Ff4R%2F%2F%2F%2FE%2F%2F%2F%2FxP%2F%2F%2F8T%2F%2F%2F%2FGf%2F%2F%2Fxv%2F%2F%2F8b%2F%2F%2F%2FDvu3rnbrNCn%2Fo1NTk9%2Fr6wn%2F%2F%2F8C%2F9fXaqskJf9kTUxX7e%2FvGP%2F%2F%2Fxr%2F%2F%2F8b%2F%2F%2F%2FG%2F%2F%2F%2FyH%2F%2F%2F8k%2F%2F%2F%2FJP%2F%2F%2Fxb%2F0MyT00JA%2F5Byblv7%2F%2F8d%2F%2F%2F%2FFv7Ix3XUNjH%2FhFhVee%2Fz8x3%2F%2F%2F8j%2F%2F%2F%2FJP%2F%2F%2FyT%2F%2F%2F8o%2F%2F%2F%2FLf%2F%2F%2Fyz%2F%2F%2F8j%2F%2FDmZNphWv%2BOa2ll4urpJPHy8iLwcWDF0zEn%2B7edm1f%2F%2F%2F8m%2F%2F%2F%2FLP%2F%2F%2Fyz%2F%2F%2F8s%2F%2F%2F%2FMP%2F%2F%2FzX%2F%2F%2F80%2F%2F%2F%2FM%2F%2F%2F%2Fy77u7KoxlhZyrV%2Ff3XSc3Oy7z83%2F7w5NtymioZg5OHgOf%2F%2F%2FzP%2F%2F%2F80%2F%2F%2F%2FNf%2F%2F%2Fyv%2F%2F%2F89%2F%2F%2F%2FOv%2F%2F%2Fzr%2F%2F%2F84%2F%2F%2F%2FM%2F%2FT0m%2F3oaGk%2FbS0uv24ubPujouw2oqIoO3j40r%2F%2F%2F83%2F%2F%2F%2FPP%2F%2F%2FzP%2F%2F%2F8K%2F%2F%2F%2FMf%2F%2F%2Fz7%2F%2F%2F89%2F%2F%2F%2FPf%2F%2F%2Fz3%2F%2F%2F80%2F%2F%2F%2FMf%2F%2F%2FzH%2F%2F%2F8x%2F%2F%2F%2FMf%2F%2F%2FzX%2F%2F%2F88%2F%2F%2F%2FPv%2F%2F%2Fzf%2F%2F%2F8SAAAAAAAAAAAAAAAAI8AAACBAAAAAAAAAEAgAAAYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%3D%3D';
favIco[1] = 'data:image/png;base64,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';
soundFound[1] = remoteSound+"airhorn-clean.wav";

// YouTube embeds
findCode[2] = [ 'youtube.com/v/' ]; // ghetto -- used in <object>/<param>
codeFound[2] = 'YouTube embed detected!';
favIco[2] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAABJ0lEQVQ4y6VSMUvDQBh9F+PSCumio39BBSmogyCCzrWO7eDs2r2LODg5uBRiC7oFdy0uglSkQ9M5deisQ0Ti0tTncMnZI7XE+JZ73+N97/u4O5Bkt1nl8YZFkiyWGjy/9ZgWUATg20VIAKmbtYBus0oAarpT3yIAlmttNWDyTAR8DG0CYG80Vjxu6I3GvwYYSImzyhLc8Cuhm9PMC8tHcOqXEEKgXGtj1TQQ7uxjbX4OxVJD84porcww0e8Dm9vZujsPEMxZROD/iPmCbgr8pDYBQ2uaYZwdEGN9BWqbwJd1zFu25C0bGA6A+7voDtIgX5Ah3gA4PJCa9/KHgGmBEZIBzg20S33syPrqGjg5BYSQ9dMzsLsnX+H18z3TIos5C4Kuy//8g28JihOoOOV3aAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNToxNCswMTowMFJYoqIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMDktMDktMjNUMjA6NTE6MjArMDI6MDCKXDqoAAAAAElFTkSuQmCC';
soundFound[2] = remoteSound+"laser22.wav";

// Direct Google products
findCode[3] = [ 'url:google.com','url:gmail.com','url:youtube.com' ];
codeFound[3] = 'Google product detected!';
// favIco[3] = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC1tbUFHBwcFQAAABoAAAAaAAAAFgAAAA8AAAAWBAAAGwIAABoAAAAXAAAAGQAAABkAAAAaAAAAGg0NDRiOjo4JJiYmDwAAABQAAAATAAAADQwCAR1YFRB4nCsqua0yLMSbLCyxYxoYfBgFAiwDAQAUAAAAEgAAABMAAAAUBwcHEhQUFA0AAAAOAAAACxMEARayLy%2FF7T9C%2F640K7FuJR1pZiMgYpczMZqeLSzBIAcFPQEBABAAAAANAAAADgAAAA4XFxcJAAAACgAAAABbKSNY%2F1ZO%2F3MdHY8AAAAAAAAAAAAAAAAAAAAAjzc2lHwdG7oDAAAVAAAACAAAAAoAAAAKFxcXBgAAAAcAAAAAVj43Tfx6df87BQFmAQIAAgAAAAQAAAAEAAAAAI0vJomvLCftCwEAHQAAAAQAAAAHAAAABxEREQQAAAAEAAAAAwYEAAi4bVm0uT8%2F4UwOC1wnBgMlFAQAEF4YGmnwQ0X8niQfxQEAAAgAAAADAAAABAAAAAQzMzMCHh4eAh8fHwMAAAAAKSglBJVbWGfQX16qxktJsLItKNTqP0X%2F5DxE8VklJTsAAAAAHx8fAh8fHwIfHx8C7%2B%2FvBO3t7QTt7e0E7e3tBOrr6wIAAAAAAAAAALWHgkH%2BVFD%2FxjI226J1dDYAAAAA7e7uBO3t7QTt7e0E7e3tBP%2F%2F%2Fwn%2F%2F%2F8K%2F%2F%2F%2FCv%2F%2F%2Fwv%2F%2F%2F8Eybi3HHw1LHeySkjC%2Fnd2%2F34iIZ1rbGkJ8fHxCv%2F%2F%2Fwr%2F%2F%2F8K%2F%2F%2F%2FCv%2F%2F%2Fwr%2F%2F%2F8R%2F%2F%2F%2FE%2F%2F%2F%2FxP%2F%2F%2F8P9OTiHtFGSNHPKS%2F%2F15KSeP7k4Evgb3DOXh4cjouJiCD9%2Ff4R%2F%2F%2F%2FE%2F%2F%2F%2FxP%2F%2F%2F8T%2F%2F%2F%2FGf%2F%2F%2Fxv%2F%2F%2F8b%2F%2F%2F%2FDvu3rnbrNCn%2Fo1NTk9%2Fr6wn%2F%2F%2F8C%2F9fXaqskJf9kTUxX7e%2FvGP%2F%2F%2Fxr%2F%2F%2F8b%2F%2F%2F%2FG%2F%2F%2F%2FyH%2F%2F%2F8k%2F%2F%2F%2FJP%2F%2F%2Fxb%2F0MyT00JA%2F5Byblv7%2F%2F8d%2F%2F%2F%2FFv7Ix3XUNjH%2FhFhVee%2Fz8x3%2F%2F%2F8j%2F%2F%2F%2FJP%2F%2F%2FyT%2F%2F%2F8o%2F%2F%2F%2FLf%2F%2F%2Fyz%2F%2F%2F8j%2F%2FDmZNphWv%2BOa2ll4urpJPHy8iLwcWDF0zEn%2B7edm1f%2F%2F%2F8m%2F%2F%2F%2FLP%2F%2F%2Fyz%2F%2F%2F8s%2F%2F%2F%2FMP%2F%2F%2FzX%2F%2F%2F80%2F%2F%2F%2FM%2F%2F%2F%2Fy77u7KoxlhZyrV%2Ff3XSc3Oy7z83%2F7w5NtymioZg5OHgOf%2F%2F%2FzP%2F%2F%2F80%2F%2F%2F%2FNf%2F%2F%2Fyv%2F%2F%2F89%2F%2F%2F%2FOv%2F%2F%2Fzr%2F%2F%2F84%2F%2F%2F%2FM%2F%2FT0m%2F3oaGk%2FbS0uv24ubPujouw2oqIoO3j40r%2F%2F%2F83%2F%2F%2F%2FPP%2F%2F%2FzP%2F%2F%2F8K%2F%2F%2F%2FMf%2F%2F%2Fz7%2F%2F%2F89%2F%2F%2F%2FPf%2F%2F%2Fz3%2F%2F%2F80%2F%2F%2F%2FMf%2F%2F%2FzH%2F%2F%2F8x%2F%2F%2F%2FMf%2F%2F%2FzX%2F%2F%2F88%2F%2F%2F%2FPv%2F%2F%2Fzf%2F%2F%2F8SAAAAAAAAAAAAAAAAI8AAACBAAAAAAAAAEAgAAAYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%3D%3D';
favIco[3] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAADCklEQVQ4yyXSy2ucVRjA4d97zvdNJpPJbTJJE9rYaCINShZtRCFIA1bbLryBUlyoLQjqVl12W7UbN4qb1gtuYhFRRBCDBITaesFbbI3RFBLSptEY05l0ZjLfnMvrov/Bs3gAcF71x6VVHTk+o8nDH+hrH89rUK9Z9Yaen57S3wVtGaMBNGC0IegWKIDxTtVaOHVugZVmH3HX3Zz+4l+W1xvkOjuZfPsspY4CNkZELEgEIJKwYlBjEwjec/mfCMVuorVs76R8+P0KYMmP30U2dT8eIZqAR2ipRcWjEYxGSCRhV08e04oYMoxYLi97EI9YCJ0FHBYbIVGDlUBLwRlLIuYW6chEmQt/rJO09RJjhjEJEYvJYGNhkbUhw43OXtIWDFRq9G87nAaSK6sVRm8r8fzRMWbOX2Xx7ypd7ZET03sQhDOz73DqSJOrd+7HSo4QIu0Nx/4rOzx+cRXZ9+z7+uqJ+3hiepxK3fHZT2tMjXYzOtzL6dmznPzhLexgN0QlxAAYxAlqUqRmkf5j59RlNQ6MFHhgcpCTTx8EUb5e+plD7x4jjg1ANCAgrRQAdR7xKXjBlGyLYi7PxaUmb8z8xcpGHVXLHaXdjI0egKyJiQYTEhSPREVIEUBNC+Mqm+xpz3j0njLPHB2nsh1QgeG+IS48dYbD5YNoo0ZUAbVEuTUoKuBSZOarX/WhyQn6eg2+usDWf0s0tq8zNPYk+WI/Lnge++hlvlyfQ3NdECzGRWKwEEA0qNY251n69kV6+Y0kbaCZoebG2X3oU7pKoyxuXOPe945zs9DCeosGIXoBDyaLdf6ce4Hbk+/Y299ksKtAuaeNsiyw8c1LKIZ95b0MdgxA5giixACpTxEPSau6QdFfI5/2cLPmEW+JAQrtJUJzDXF1dkwHzVodJMX4HFEcQQMaFdPeM0Jb/4PUtzzaLKAhRyJFwo6lbegRNFfk819muV5dR4JBQoQdQ2xFiDmSNDHiaptamR9Gq5cQ18AledrGDpOfeI5Lq8u88smbhMRisoSAgAYghdfn5H/JkHuR1YqVZQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMi0wNVQyMjoxNjo0MSswMTowMKO3OGIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTAtMDItMDVUMjI6MTY6NDErMDE6MDDS6oDeAAAAAElFTkSuQmCC';
soundFound[3] = remoteSound+"airhorn02.wav";

//TODO: Google Insight
//any other embeddable G products?



//this sets the found flag in each element to false initially
for (var i = 0; i < findCode.length; i++) {
  flagFound[i] = false;
}

// this stores the number of search strings that were found in the html source
var numFound = 0;

// stores whether or not any strings were found
var anyFound = false;

// performs the search for the desired search strings
for(var i = 0; i < findCode.length; i++) {
  for(var j = 0; j < findCode[i].length; j++) {
    var scriptMatch = findCode[i][j].toLowerCase(); // look in the page for this
    var urlMatch = findCode[i][j].toLowerCase().replace('url:',''); // look in the doc location for this
  	if( x[0].innerHTML.toLowerCase().indexOf(scriptMatch) != -1 || document.location.href.toLowerCase().indexOf(urlMatch) != -1) {
      // console.log("flagFound["+i+"]="+findCode[i][j]);
  		flagFound[i] = true;
  		numFound++;
  		anyFound = true;
  	}
  }
}

// If we matched anything, display our awesome msg + soundz
// Warning: Google here!
if (anyFound == true) {

  // Inject a ghetto javascript fade-function
  var headID = document.getElementsByTagName("head")[0];         
  var newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.innerHTML = "{ function yellowFade(el) { var b = 155; function f() { el.style.background = 'rgb(255,'+(b+=2)+','+(b+=2)+')'; /*el.style.color = 'rgb(255,'+(255 - b)+',255)';*/ el.style.opacity = -0.7+(255/b); if(b < 255){ setTimeout(f, 20); }else{ el.style.visibility = 'hidden'; } }; f(); } }";
  headID.appendChild(newScript);

  // Output our msg div
	var ni = document.getElementsByTagName("body");
	var newdiv = document.createElement('div');
	var divIdName = 'fuckGoogle';
	newdiv.setAttribute('id', divIdName);
	/* animated-siren.gif */
	newdiv.setAttribute('style','visibility: visible; opacity: 1; color:#fff; position:absolute; top: 4px; left: 2px; padding: 9px 3px 8px 110px; z-index: 666666; text-align: left; -moz-border-radius: 8px; font-size: 10pt; font-family: sans-serif; font-weight: normal; background: #f05050 url(http://localhost/google-alarm/images/google-logo-redmatte-og.png) 8px 7px no-repeat;');
	
	// add the animated gif icon as an img so we can just use CSS resizing -- use datauri
	newdiv.innerHTML = newdiv.innerHTML + '<img height="32" style="position: absolute; margin-top: -8px; margin-left: -38px;" src="http://localhost/google-alarm/images/animated-siren.gif" />';
	
	// Process each of our Google detections and add appropriate notification msgs + sounds
	for (var i = 0; i < findCode.length; i++) {
		if (flagFound[i] == true) {

      // Add some text to the GOOG warning msg
      // newdiv.innerHTML = newdiv.innerHTML + '<img src="'+favIco[i]+'" title="'+codeFound[i]+'" style="width:12px; height:12px; margin:0px 0 0px 0;" />';
			newdiv.innerHTML = newdiv.innerHTML + '<span style="margin-right: 8px;">'+codeFound[i]+'</span>';      

			// Add some pimp sound fx
			//TODO: put these files locally -- can we do dataURI encoding for soundfx?
      // console.log("Playing sound: "+soundFound[i]);
			newdiv.innerHTML = newdiv.innerHTML +  '<audio autoplay src="'+soundFound[i]+'">Audio playback is not supported in your browser</audio><script type="text/javascript">var el = document.getElementById("fuckGoogle"); setTimeout("yellowFade(el)", 2000);</script>';
		}
	}
	ni[0].appendChild(newdiv);
				
	
	// send results to remote server -- this could be interesting for tracking stats, etc.
	/*
	// build our data string
  var data = "url="+encodeURI(document.location.href);
  for (var i = 0; i < findCode.length; i++) {
		if (flagFound[i] == true) {
			data += "&site="+encodeURI(codeFound[i]);
		}
	}
	GM_log(data);

  // POST it
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://localhost:4567/",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: function(response) {
      // if (response.responseText.indexOf("Logged in as") > -1){ location.href = "http://www.example.net/dashboard"; }
      GM_log([
        // response.status,
        response.statusText,
        // response.readyState,
        response.responseHeaders,
        response.responseText,
        // response.finalUrl,
        // response.responseXML
      ].join("\n"));      
    },
    onerror: function(response) {
      GML_log(["Error", respone.status, response.statusText]);
    }
  });
  */
  	
}