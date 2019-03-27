//loader fadeout
$(window).on("load", function() {
    $(".loader .inner").fadeOut(1500, function() { // icon fadeout first 
        $(".loader").fadeOut(500); // then back
    });
});



$(document).ready(function() {
    // full screen slider
    $('#slides').superslides({
        animation:'fade',
        play:5000,
        pagination:false
    });

    // typing js
    var typed =new Typed(".typed", {
        strings:["Software Engineer","Web Developer","Student."],
        typeSpeed:70,
        loop:true,
        startDelay:1000,
        showCursor:false
    });

    // owl carousel
    $('.owl-carousel').owlCarousel({
        loop:true,
        items:4,
        responsive:{
            0:{
                items:1
            },
            480:{
                items:2
            },
            768:{
                items:3
            },
            938:{
                items:4
            }
        }
    });
    
    /// pie chart animation when it covers wait until cover
    var skillsTopOffset=$(".skillsection").offset().top; // from the top of website
    var statsTopOffset=$(".statssection").offset().top; // from the top of website
    var countUpFinished=false;
   
    $(window).scroll(function() {
        if(window.pageYOffset > skillsTopOffset -$(window).height() + 200) { // 200 is to catch on windows
            $('.chart').easyPieChart({
                easing:'easeInOut',
                barColor:'#fff',
                trackColor:false,
                scaleColor:false,
                lineWidth:4,
                size:152,
                onStep:function(from, to, precent) {
                    $(this.el).find('.percent').text(Math.round(precent));
                }
            });
        }

         //count up js package
        if(!countUpFinished && window.pageYOffset > statsTopOffset -$(window).height() + 200) { // 200 is to catch on windows
            $(".counter").each(function() {
                var element = $(this);
                var endVal =parseInt(element.text());
                element.countup(endVal);
                countUpFinished = true;
            });
        }
    });

    // fancy box image popup viewer
    $("[data-fancybox]").fancybox();

    // filter stuff
    $(".items").isotope({
        filter:'*',
        animationOptions:{
            duration:1500,
            easing:'linear',
            queue:false
        }
    });

    $("#filters a").click(function() {

        $("#filters .current").removeClass("current");
        $(this).addClass("current");

        var selector = $(this).attr("data-filter");
            $(".items").isotope({
                filter:selector,
                animationOptions:{
                duration:1500,
                easing:'linear',
                queue:false
                }
        });
        return false;
    });

    //sliding into elements
    $('#navigation li a').click(function(e) {
        e.preventDefault();
        
        var targetElement = $(this).attr("href");
        var targetPosition = $(targetElement).offset().top;

        $("html, body").animate({scrollTop:targetPosition - 50}, "slow");
    });




    //sticky navbar
    const nav = $("#navigation");
    const navTop = nav.offset().top;
    $(window).on("scroll", stickyNavigation);

    function stickyNavigation() {
        var body = $("body");

        if($(window).scrollTop() >= navTop) {
            body.css("padding-top", nav.outerHeight()+ "px");
            body.addClass("fixedNav");
        } else {
            body.css("padding-top", 0);
            body.removeClass("fixedNav");
        }
    }

});

