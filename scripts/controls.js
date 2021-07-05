"use strict";
/**
* Switch to a new display mode by loading a stylesheet via AJAX
*/
function swDS(mode) {
    var dOpt = { desktop: "styles/fixed.css", mobile: "styles/fluid.css", print: "styles/print.css" };
    $.get(dOpt[mode], function (data) {
	 	$('head style[title="mediaOption"]').html(data);
    });
}
/**
* Switch a link in a list to active state when clicked, deactivating sibling list link elements
* @returns the link text which can contain a hook to determine further processing
*/
function swLinkTo(link) {
		if(link.hasClass("ui-state-active defaultCursor")) { return ''; }
		link.removeClass("clickable").addClass("ui-state-active defaultCursor").parent().siblings("li").children("a").removeClass("ui-state-active defaultCursor").addClass("clickable");
		_gaq.push(['_trackEvent', "View Change", link.text(), ipAddr, pageTime()]);
		return link.text();
}
/**
* Determine the display mode by checking a partciular style
*/
function findDS() {
	var link = $([]);
	if($(".bioPhotoMobile").css("display") !== "none") link = $(".sec_nav .mobile");
	else if($(".bioPhotoDesktop").css("display") !== "none") link = $(".sec_nav .desktop");
	else link = $(".sec_nav .print");
	swLinkTo(link);
}
/**
* Set the header font size to increase with the window size -- this preserves the header text for availablity in web searches
* @returns the calculated font size
*/
function setFontScale(maxScale, minScale, scaleFactor) {
	
	var scaleSource = $('body').width(),
		fontSize = scaleSource * scaleFactor;
	if (fontSize > maxScale) {
		fontSize = maxScale;
	}
	if (fontSize < minScale) {
		fontSize = minScale;
	}
	return fontSize;
}
/**
* Make the name scale with the window
*/
function setHeaderScale() {
	
	var fSize = setFontScale(600,113,0.15);
	$('div.name').css('font-size', fSize + '%');
	$('div.name').css('line-height', '125%');
}
/**
* Popup new named window with contents from an external/internal source
*/
function newWindow(mypage, myname, w, h, scroll) {
	
    var winl = (window.outerWidth - w)/2  + window.screenLeft,
		wint = (window.outerHeight - h)/2  +  window.screenTop,
		winprops = 'height=' + h + ',width=' + w + ',top=' + wint + ',left=' + winl +  ',location=no,directories=no,menubar=no,toolbar=no,scrollbars=' + scroll + ',resizable',
		win = window.open(mypage, myname, winprops);
    if (parseInt(navigator.appVersion, 10) >= 4) { win.window.focus(); }
}
/**
* Called on accordion change start to trigger ga.js event
*/
function aAnalytics(event, ui) {
	var mEvent = '',
		mAction = '';
		if(ui.newHeader.offset()) {
			mEvent = $(this).attr('id') + " Section View";
			mAction = ui.newHeader.children("a").attr('id');
			_gaq.push(['_trackEvent', mEvent, mAction, ipAddr, pageTime()]);
	   }
}
	
/**
* Called on accordion change to scroll to the header
*/
function scrollToNHA(event, ui){
			var oset = ui.newHeader.offset() || ui.oldHeader.offset();
			myScrollTo(oset.top, 35, 600);
//	    	$('html,body').animate({scrollTop: ui.newHeader.offset() ? ui.newHeader.offset().top - 35: ui.oldHeader.offset().top - 105 }, 700, function () {$(this).scroll();});
}
function scrollToNHB() {
		myScrollTo($(this).offset().top,70,700);
//		$('html,body').animate({scrollTop: $(this).offset().top - 70}, 700,function () {$(this).scroll();});
}
function myScrollTo(elO, myO,duration) {
		$('html, body').animate({scrollTop: elO - myO},duration, function() {$(this).scroll();});
}
/**
* Get the time elapsed since page load
*/
function pageTime() {
		var n = new Date(),
			tms = n.getTime() - siteTime;
			return (tms-(tms%1000))/1000;
}
/**
* Get the resolution to display a collage image at based on the location index
*/
function getResolution (index) {
	switch (index) {
		case 0:
			return 720;
			break;
		case 1:
			return 450;
			break;
		case 2:
			return 270;
			break;
		case 3:
			return 180;
			break;
		default:
			return 90;
	}
}
/** 
* Switch a collage image
*/	
function switchImage() {
	var myS = $(this).parent().children('a'),
		myi = myS.index(this),
		o = myS.map(function (index,e) {return $(e).children('img').first().attr('src');}).get(),
		m = o.slice(0),
		ci = 0,
		maxi = o.length,
		path = [],
		res=1170,
		capid="";
	if(myi === 0) return false;
	for (ci=0;ci<maxi;++ci) {
		m[((ci-myi)+maxi) % maxi] = o[ci];
	}
	myS.map(function (index,e) {
		var timg = $(this).children('img').first();
		path = m[index].split("\/");
		res = getResolution(index);
		path[path.length-2] = "" + res; 
		timg.attr('src',path.join('\/'));//.fadeIn(1000,"easeInCirc");
		if(index === 0) {
		capid = path[path.length-1].slice(0,path[path.length-1].indexOf("\."));
		}
	});
	$("#imgCaptionA, #imgCaptionB").html($("span#"+capid).html());
	_gaq.push(['_trackEvent', "Image View", capid, ipAddr, pageTime()]);
	return false;
}
/**
* The Research page init function
*/
function init_research() {
	
	$("div.HeadersNoJS").hide();
	$("hr.clearBoth").hide();
	$("#ResearchProjects").accordion({
	    header: 'h3',
	    collapsible: true,
	    active: false,
	    heightStyle: 'content',
//	    navigation: true,
	    activate: scrollToNHA,
	    beforeActivate: aAnalytics
	});
	$("#IndividualProjects,#CollaborativeProjects,#PublishedResearch").accordion({
	    header: 'h4',
	    collapsible: true,
	    active: false,
	    heightStyle: 'content',
//	    navigation: true,
	    activate: scrollToNHA,
	    beforeActvate: aAnalytics
	});
		$("#show_collage").button({
		icons: {
			primary: "ui-icon-circle-plus"
		}
	}).click(function () {
		var tHoldSel = $("#ResearchCollage"),
			 tFile = "Research/research_collage.shtml";
		if(!$("div.cimg").length) {
			tHoldSel.load(tFile, function() {
	 			
	 			myScrollTo(tHoldSel.offset().top,35,700);
	 			init_research_collage();
	 		});
			} else {
				$("#ResearchCollage").slideDown(function () { myScrollTo($(this).offset().top, 35,700);});
			}
			return false;
		});

	$("#hide_collage").button({
		icons: {
			primary: "ui-icon-circle-minus"
		}
	}).click(function() {
		$("#ResearchCollage").slideUp();
		return false;
	});
	/**
	* initialize the research collage
	*/
	function init_research_collage() {
		$("#imgCaptionA, #imgCaptionB").html($("div.cimg a img").first().next().html());
		$(".cimg a").removeAttr("href").children('img').removeAttr("title").end().click(switchImage);
		$("#cycleI").button({
			icons: {
				primary: 'ui-icon-refresh',
				secondary: 'ui-icon-image'
				}
		}).click(function () {
			$("#inhldr").click();
		});
		$("div.cimg a span").hide();
		$("#prevPhoto").button({icons: {primary: "ui-icon-circle-arrow-w"} }).click(function () { $("img#ip4hldr").click(); });
		$("#nextPhoto").button({icons: {secondary: "ui-icon-circle-arrow-e"} }).click(function () { $("img#inhldr").click(); });
		$("#nextArea").hover(
			function () { 
				$("#nextPhoto").mouseover().addClass("hoverClass"); 
			}, 
			function () {
				$("#nextPhoto").mouseout().removeClass("hoverClass"); 
			}).click(
			function() {
				$("#nextPhoto").click();
			});
		$("#prevArea").hover(
			function () { 
				$("#prevPhoto").mouseover().addClass("hoverClass"); 
			}, 
			function () {
				$("#prevPhoto").mouseout().removeClass("hoverClass"); 
			}).click(
			function() {
				$("#prevPhoto").click();
			});
	}	
}
/**
* The Projects page init function
*/
function init_projects() {
	
	$("div.HeadersNoJS").hide();

	/**
	* initialize the project collage
	*/
	var tHoldSel = $("#ProjectsCollage"),
		  tFile = "Projects/projects_collage.shtml";
		if(!$("div.cimg").length) {
			tHoldSel.load(tFile, function() {
	 			
/*	 			myScrollTo(tHoldSel.offset().top,35,700); */
	 			init_project_collage();
	 		});
			} else {
				$("#ProjectsCollage").slideDown(function () { myScrollTo($(this).offset().top, 35,700);});
			}	
	
	
	function init_project_collage() {
		$("#imgCaptionA, #imgCaptionB").html($("div.cimg a img").first().next().html());
		$(".cimg a").removeAttr("href").children('img').removeAttr("title").end().click(switchImage);
		$("#cycleI").button({
			icons: {
				primary: 'ui-icon-refresh',
				secondary: 'ui-icon-image'
				}
		}).click(function () {
			$("#inhldr").click();
		});
		$("div.cimg a span").hide();
		$("#prevPhoto").button({icons: {primary: "ui-icon-circle-arrow-w"} }).click(function () { $("img#ip4hldr").click(); });
		$("#nextPhoto").button({icons: {secondary: "ui-icon-circle-arrow-e"} }).click(function () { $("img#inhldr").click(); });
		$("#nextArea").hover(
			function () { 
				$("#nextPhoto").mouseover().addClass("hoverClass"); 
			}, 
			function () {
				$("#nextPhoto").mouseout().removeClass("hoverClass"); 
			}).click(
			function() {
				$("#nextPhoto").click();
			});
		$("#prevArea").hover(
			function () { 
				$("#prevPhoto").mouseover().addClass("hoverClass"); 
			}, 
			function () {
				$("#prevPhoto").mouseout().removeClass("hoverClass"); 
			}).click(
			function() {
				$("#prevPhoto").click();
			});
	}	
}
/**
* The Teaching page init function
*/
function init_teaching() {
	
	$("div.HeadersNoJS").hide();
	$("hr.clearBoth").hide();
	$("#Courses").accordion({
	    header: 'h3',
	    collapsible: true,
	    active: false,
	    heightStyle: 'content',
//	    navigation: true,
	    activate: scrollToNHA,
	    beforeActivate: aAnalytics
	});
}
/**
* The Vitae page init function
*/
function init_vitae() {
	
	var hcicon = "ui-icon-triangle-1-e", // Header Closed Icon
		hoicon = "ui-icon-triangle-1-s", // Header Open Icon
		vHeaderButtons = $('div#Vitae input[name="vitaecat"][type="checkbox"]'),
		toggleVitaeSection = function () {
			$(this).next().next().slideToggle("fast", scrollToNHB);
			var icons = $(this).button("option", "icons");
			if (icons.secondary === hcicon) {
				icons.secondary = hoicon;
				_gaq.push(['_trackEvent','Vitae Section View', $(this).next().attr('id'), ipAddr, pageTime()]);
			} else {
				icons.secondary = hcicon;
			}
			$(this).button("option", "icons", icons);
			$(this).button("refresh");
		};
	$("#hide_all, #show_all").removeClass("hide");
	$("div.HeadersNoJS,div#Vitae > div").hide();

	vHeaderButtons.each(function () {
		var iname = $(this).attr('id');
		$(this).removeClass("hide").prop("checked",false).next().removeClass("vhbnojs");
		$(this).button({
			icons: {
				primary: "ui-icon-" + iname,
				secondary: hcicon
			}
		}).click(toggleVitaeSection);
	});

	$("#show_all").button({
		icons: {
			primary: "ui-icon-circle-plus"
		}
	}).click(function () {
			$.fx.off=true;
			vHeaderButtons.not(':checked').click().button("refresh");
			$.fx.off=false;
			$('body').each(scrollToNHB);
		});

	$("#hide_all").button({
		icons: {
			primary: "ui-icon-circle-minus"
		}
	}).click(
			function () {
				$.fx.off=true;
				vHeaderButtons.filter(':checked').click().button("refresh");
				$.fx.off=false;
			}
		);
}
/**
* Handle the window resize event -- see documentation above for each called function
*/
$(window).resize(function () {setHeaderScale(); findDS();});
/**
* make main page tabs work; the syntax for adding new tabs is
* <id>Tab : the tab anchor link
* where <id> is the content section id
* <id>Holder is the wrapper around the content section
*/
var myTabs = $(".nav li a"),
	 loadTab = function () {
	 	
	 	var tab = $(this).attr("id").slice(0, -3),
	 		tFile = tab + "\/" + tab.toLowerCase() + ".shtml",
	 		tFunc = window["init_" + tab.toLowerCase()],
	 		tHoldSel = $("#" + tab + "Holder"),
	 		ntab = myTabs.index(this),
	 		tTime = pageTime();
	 	if(!($(this).hasClass("activeTab"))) {
	 		tHoldSel.load(tFile, function() {
	 			
	 			if(tFunc) tFunc();
	 			setTabSect(ntab, tab);
	 			_gaq.push(['_trackEvent','Page View', tab, ipAddr, tTime]);
	 		});
	 		$(this).addClass("activeTab");
	 	}
	 	return false;
	 },
	 setTabSect = function (ntab,tab) {
		
		var tDivSel = $("#" + tab),
			os = tDivSel.offset(),
			tDir = "left";
			myTabs.each(function () {
				
					var otab = $(this).attr("id").slice(0,-3);
					if ($(this).hasClass("activeTab") && otab !== tab) {
						if (ntab < myTabs.index(this)) { tDir = "right"; }
						$(this).removeClass("activeTab");
						$("#" + otab  ).hide("slide", { direction: tDir } ,"slow");
						return false;
				}
			});
			tDir = (tDir === "left")? "right" : "left";
			tDivSel.show("slide",{direction: tDir} ,"slow");
			if ($(window).width() < 600 && $(window).height() < 600 ) {
				(tab !== "Vitae") ? $(window).scrollTop($("#mainBlurbs").outerHeight(true)):$(window).scrollTop(0);
			$('html,body').scroll();
			}
		};

myTabs.click(loadTab);

/**
* Make the Views bar work: see functions above
*/
var dmLinks = $("ul.sec_nav li a");
dmLinks.click(function () {
	var mode = swLinkTo($(this));
	if (!mode) return false;
   $("body").hide();
   swDS(mode);
   $("body").fadeIn(1000,"easeInCirc");
	return false;	
});
/**
* Contact form window
*/
(function(){
	var bValid = true,
		email = $("#email"),
		nameA = $("#name"),
		say = $("#say"),
		allFields = $( [] ).add( nameA ).add( email ).add( say ),
		tips = $( ".validateTips"),
		tipsOT = tips.text();
		
function reset() {
	allFields.val("").removeClass("ui-state-error");
	tips.text(tipsOT);	
	}

function updateTips( t ) {
	tips
		.text( t )
		.addClass( "ui-state-highlight" );
	setTimeout(function() {
		tips.removeClass( "ui-state-highlight", 1500 );
	}, 500 );
}
			
function checkLength( o, n, min, max ) {
	if ( o.val().length < min){
		o.addClass( "ui-state-error" );
		updateTips( n + " too short. Minimum Length " + min + " characters.");
		return false;
		} else if (o.val().length > max ) {
			o.addClass( "ui-state-error" );
			updateTips( n + " too long. Maximum length " + max + " characters." );
			return false;
		}	else {
			return true;
		}
}

function checkRegexp( o, regexp, n ) {
	if ( !( regexp.test( o.val() ) ) ) {
		o.addClass( "ui-state-error" );
		updateTips( n );
		return false;
	} else {
		return true;
	}
}

function doneEmailVerify(data) {
	$("#email-transmit-msg").html(data).dialog("open");
	return;
}

function displayAjaxError(data) {
	$("#email-transmit-msg").html("<p class=\"ui-state-error\">Couldn't send email. Try using another method to send email to <a href=\"mailto:burair.kothari@gmail.com\">burair.kothari@gmail.com</a>").dialog("open");
	return;	
}


$("#emailHolder").addClass("clickable clickableLink")

$("#email-transmit-msg").dialog({
	autoOpen: false,
	title: "Email: Status Message",
	width: 320,
	height: 240,
	modal: true,
	buttons: {
		Ok: function() {
			$(this).dialog("close");			
			}
		}
});

$("#email-form-container").tooltip().dialog({
	autoOpen: false,
	title: "Compose an email to Burair Kothari",
	height: 480,
	width: 640,
	modal: true,
	buttons: {
		"Send Email":function() {
			
			bValid = true;
			allFields.removeClass( "ui-state-error");
			
			bValid = bValid && checkLength( email, "E-mail", 6, 80 );
			bValid = bValid && checkLength( nameA, "Name", 1, 40);
         bValid = bValid && checkLength( say, "Say", 5, 100000 );			
			
			bValid = bValid && checkRegexp( nameA, /^[a-z]([0-9a-z\s])+$/i, "Name(s) may consist of a-z, 0-9, spaces, and begin with a letter." );
		   bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. me@you.net" );
			
			if ( bValid ) {
				//send the email -- on success alert sucess
				var visemail = nameA.val() + " <" + email.val() +">",
					tosubject = "Email from web visitor: " + nameA.val() + ", email address: " + email.val(),
					body =  say.val();	
	
		      $.ajax( {
		        type: "POST",
		        url: "sendEmail.php",
		        data: {
			        B : body,
			        F : visemail,
		 	        S : tosubject		 
				  },
				  dataType: "html",
				  async: false,
				  success: doneEmailVerify,
				  error: displayAjaxError
				});

				reset();
				$(this).dialog( "close" );
			}				
			
		},
		Cancel: function() {
					reset();
					$( this ).dialog( "close" );
		}
	},
	close: function() {
		reset();		
	}
			
});
})();

$("#ContactMe").button({
	label: "Contact",
	icons: {
	    primary: "ui-icon-mail-open",
	    secondary: "ui-icon-newwin"
	}
});
$("#emailAddress, #ContactMe").click(function () {
	$("#email-form-container").dialog("open");
	
	return false;
});




/**
* Execute on jQuery DOM ready 
*/
$(function () {
	var locHead = window.location.search.substring(1),
		 locHash = window.location.hash,
		isTab = false;
	if(locHash.length > 0) {
		window.location.hash = "";
		myTabs.each(function () {
			var tTabHash = "#" + $(this).attr("id").slice(0,-3); 
			if ( tTabHash === locHash ) { isTab = true; return false;}
		});
	}
	myTabs.removeAttr("href");
	if ( isTab ) {
		$(locHash + "Tab").removeClass("activeTab").click();
	} else {	
		$("#AboutTab").removeClass("activeTab").click();
	}
	$("div#mainBlurbs").hide().fadeIn(1000);
	$("div.name span.first, div.name span.last").show(); // Use text for the name header with a javascript based dynamic resizing function
	$("img.name").hide(); // Hide the name image
	setHeaderScale();     // the function for dynamic resizing of the header based on window size
	findDS(); // which display style is active
	$("button#ContactMe").removeClass("ui-helper-hidden-accessible"); // Show the contact button which pops up the contact form
	if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
	{
		$(window).scroll(function () {
			$('#top_navigation').offset({top: $(window).scrollTop(), left: $(window).scrollLeft()});
		});
	}
});
