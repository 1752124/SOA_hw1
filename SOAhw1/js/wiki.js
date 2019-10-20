var isSearch = false;
$(document).ready(function(){
	//鼠标经过显示星星
	$("body").jstars({
		image_path:"imgs",
		style:'rand',
		frequency:15
	});
	
	//当点击搜索图标时，变成搜索框
	$(".search-img-a").on("click",function(){
		$(".search-img-a").css("display","none");
		$(".search-text").fadeIn(400);
		$(".search-title").focus();
		$(".clear-ico").fadeIn(150);
	});

	//点击关闭按钮就恢复到原来的样子
	$(".clear-ico").on("click",function(){
		if(!isSearch){
			//如果不是搜索状态
			$(".search-title").val("");
			$(".search-text").fadeOut(200,function(){
				$(".search-img-a").fadeIn(400);
			});
		}
		else if(isSearch){
			isSearch = false;
			//先恢复原状
			$(".search-ul").html("");
			$(".search-ul1").html("");
			$(".title").css("position","relative");
			$(".title").animate({left:'0'},500);
			$(".search-before").animate({top:"35%"},500,function(){
				$(".itro").fadeIn(300);
				$(".search-title").val("");
				$(".search-text").fadeOut(200,function(){
				$(".search-img-a").fadeIn(400);
			});
			});
			
		}
	});

	//监听输入框回车事件
	$(".search-title").keydown(function(event){
		if(event.keyCode == 13){
			var keyword = $(".search-title").val();

			if(keyword == ""){
				//如果没有输入
				$(".title").css("position","relative");
				$(".title").animate({left:'-40%'},500);

				$(".search-before").animate({top:"-40px"},500,function(){
					$(".searching").fadeIn(200);
				});
				$(".itro").css("display","none");
				isSearch = true;
				$(".search-ul").html("");
				$(".search-ul1").html("");
				return;
			}

			//alert("got it");
			if(!isSearch){
				$(".title").css("position","relative");
				$(".title").animate({left:'-40%'},500);

				$(".search-before").animate({top:"-40px"},500,function(){
					$(".searching").fadeIn(200);
				});
				$(".itro").css("display","none");
				isSearch = true;

				//开始从wiki获取搜索到的东西了
				getFromWiki(keyword);
				getFromTianqi(keyword);
				getFromInfo(keyword);
			}else if(isSearch){
				getFromWiki(keyword);
				getFromTianqi(keyword)
				getFromInfo(keyword);
			}
		}
	});

	var getFromWiki = function(keyword){
		$.ajax({
			url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + keyword + "&prop=info&inprop=url&utf8=&format=json",
			dataType:"jsonp",
			success:function(response){
				//console.log(response);
				showResults(response,keyword);
			},
			error:function(){
				alert("Sorry,there's something wrong within the search,please refresh this page and try again!");
			}
		});
	}

	var getFromTianqi = function(keyword){
		$.ajax({
			type:"get",
			url: "http://wthrcdn.etouch.cn/WeatherApi?city="+ keyword ,
			dataType:"xml",
			success:function(response){
				//console.log(response);
				showResults1(response,keyword);
			},
			error:function(){
				alert("Sorry,there's something wrong within the search,please refresh this page and try again!");
			}
		});
	}

	var getFromInfo = function(keyword){
		$.ajax({
			type:"get",
			url: "https://search.heweather.net/find?key=1ab689987b454d84aa7242bfc124d1bd&location="+ keyword ,
			dataType:"json",
			success:function(response){
				//console.log(response);
				showResults2(response,keyword);
			},
			error:function(){
				alert("Sorry,there's something wrong within the search,please refresh this page and try again!");
			}
		});
	}

	// var getFromNews = function(keyword){
	// 	$.ajax({
	// 		type:"get",
	// 		url: "http://139.196.96.59:82/toutiao/index.ashx?type=top",
	// 		dataType:"json",
	// 		success:function(response){
	// 			//console.log(response);
	// 			showResults(response,keyword);
	// 		},
	// 		error:function(response){
	// 			console.log(response);
	// 			alert("Sorry,there's something wrong within the search,please refresh this page and try again!");
	// 		}
	// 	});
	// }

	// var getFromJingdian = function(keyword){
	// 	$.ajax({
	// 		url: "http://139.196.96.59:82/toutiao/index.ashx?type=top",
	// 		dataType:"json",
	// 		success:function(response){
	// 			//console.log(response);
	// 			showResults(response,keyword);
	// 		},
	// 		error:function(){
	// 			alert("Sorry,there's something wrong within the search,please refresh this page and try again!");
	// 		}
	// 	});
	// }

	var showResults = function(response,keyword){
		console.log(response);
		//console.log(response.query.search.length);
		$(".search-ul").html("");

		if(response.query.search.length == 0){
			//没搜到
			var str = '<a class="search-link" href="#">';
			str+='<li class="search-li"><h3 class="search-h3">^_^</h3>';
			str+='<p class="search-abs">Sorry,the word "'+keyword+'" is not existed in wiki\'s database</p>';
			//str+='<p class="search-time">'+response.query.search[i].timestamp+'</p></li></a>';
			var dot = $(str);
			$(".search-ul").append(dot);
			return;
		}

		for(var i=0; i < 1;i++){
			var str = '<a class="search-link" href="https://en.wikipedia.org/wiki/'+response.query.search[i].title+'" target="_blank">';
			str+='<li class="search-li"><h3 class="search-h3">'+response.query.search[i].title+'</h3>';
			str+='<p class="search-abs">'+response.query.search[i].snippet+'</p>';
			str+='<p class="search-time">'+response.query.search[i].timestamp+'</p></li></a>';
			var dot = $(str);
			$(".search-ul").append(dot);
		}
	}

	var showResults1 = function(response,keyword){
		console.log(response);
		//console.log(response.query.search.length);
		$(".search-ul1").html("");

		// var name = $(response).find('city').text();
		// $(".search-ul1").text(name);

		var str = '<a class="search-link" href="http://www.weather.com.cn/" target="_blank">';
		str+='<li class="search-li"><h3 class="search-h3">'+$(response).find('city').text()+'</h3>';
		str+='<p class="search-abs">Temperature: '+$(response).find('wendu').text()+'</p>';
		str+='<p class="search-time">Humidity: '+$(response).find('shidu').text()+'</p></li></a>';
		var dot = $(str);
		$(".search-ul1").append(dot);
		console.log(1);
	}

	var showResults2 = function(response,keyword){
		console.log(response);
		//console.log(response.query.search.length);
		$(".search-ul2").html("");

		if(response.HeWeather6[0].basic.length == 0){
			//没搜到
			var str = '<a class="search-link" href="#">';
			str+='<li class="search-li"><h3 class="search-h3">^_^</h3>';
			str+='<p class="search-abs">Sorry,the word "'+keyword+'" is not existed in info\'s database</p>';
			//str+='<p class="search-time">'+response.query.search[i].timestamp+'</p></li></a>';
			var dot = $(str);
			$(".search-ul2").append(dot);
			return;
		}

		for(var i=0; i < 1;i++){
			var str = '<a class="search-link" href="http://xzqh.mca.gov.cn/map" target="_blank">';
			str+='<li class="search-li"><h3 class="search-h3">'+response.HeWeather6[0].basic[i].location+'</h3>';
			str+='<p class="search-abs">Parent city: '+response.HeWeather6[0].basic[i].parent_city+'  Admin area: '+response.HeWeather6[0].basic[i].admin_area+'  Country: '+response.HeWeather6[0].basic[i].cnty+'</p>';
			str+='<p class="search-time">'+response.HeWeather6[0].basic[i].cid+'</p></li></a>';
			var dot = $(str);
			$(".search-ul2").append(dot);
		}
	}

	var showError = function(keyword){

	}


});




/*https://en.wikipedia.org/w/api.php?action=query&titles=55&format=json
https://en.wikipedia.org/w/api.php?action=query&pageid=52801214
https://en.wikipedia.org/wiki/Vaajakoski-Jyskä

https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + keyword + "&prop=info&inprop=url&utf8=&format=json
https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=55&prop=info&inprop=url&utf8=&format=json


{"batchcomplete":"","continue":{"sroffset":10,"continue":"-||info"},"query":{"searchinfo":{"totalhits":461153},"search":[{"ns":0,"title":"AD 55","size":1382,"wordcount":140,"snippet":"AD <span class=\"searchmatch\">55</span> (LV) was a common yeyar starting on Wednesday (link will displa8y the full calendar) of the Julian calendar. At the time, it was known as the Year","timestamp":"2017-07-12T20:00:23Z"},{"ns":0,"title":"55 Cancri","size":38612,"wordcount":3561,"snippet":"<span class=\"searchmatch\">55</span> Cancri (/ˈkæŋkraɪ/ or /ˈkæŋkriː/) (abbreviated <span class=\"searchmatch\">55</span> Cnc) is a binary star approximately 41 light-years away from the Sun in the constellation of Cancer","timestamp":"2017-04-23T19:52:03Z"},{"ns":0,"title":"Interstate 55","size":17375,"wordcount":1713,"snippet":"Interstate <span class=\"searchmatch\">55</span> (I-<span class=\"searchmatch\">55</span>) is a major Interstate Highway in the central United States. As with most interstates that end in a five, it is a major cross-country","timestamp":"2017-08-05T12:52:11Z"},{"ns":0,"title":"T-54/T-55","size":54671,"wordcount":7407,"snippet":"The T-54 and T-<span class=\"searchmatch\">55</span> tanks are a series of Soviet main battle tanks introduced just as the Second World War ended. The first T-54 prototype was completed","timestamp":"2017-08-03T15:02:00Z"},{"ns":0,"title":"55 metres","size":10082,"wordcount":147,"snippet":"<span class=\"searchmatch\">55</span> metres is a sprint event in track and field. It is a relatively uncommon non-championship event for indoor track and field. The history of the event","timestamp":"2017-05-14T08:49:33Z"},{"ns":0,"title":"Kh-55","size":26616,"wordcount":2941,"snippet":"The Kh-<span class=\"searchmatch\">55</span> (Russian: Х-<span class=\"searchmatch\">55</span>, also known as RKV-500; NATO reporting name: AS-15 'Kent') is a Soviet/Russian subsonic air-launched cruise missile, designed","timestamp":"2017-07-15T14:25:18Z"},{"ns":0,"title":"CAMS 55","size":4989,"wordcount":508,"snippet":"The CAMS <span class=\"searchmatch\">55</span> was a reconnaissance flying boat built in France in the late 1920s which equipped the French Navy throughout the 1930s.   The CAMS <span class=\"searchmatch\">55</span> design","timestamp":"2017-06-05T16:12:41Z"},{"ns":0,"title":"Kentucky Route 55","size":25678,"wordcount":1291,"snippet":"Kentucky Route <span class=\"searchmatch\">55</span> (KY <span class=\"searchmatch\">55</span>) is a 140.858-mile-long (226.689 km) state highway in the U.S. Commonwealth of Kentucky. The route originates at a junction with","timestamp":"2017-03-14T22:55:13Z"},{"ns":0,"title":"U.S. Route 55","size":9535,"wordcount":602,"snippet":"U.S. Highway <span class=\"searchmatch\">55</span> was a north–south United States highway. Though it was part of the original 1926 numbering plan, it was deleted within 10 years.   From","timestamp":"2017-08-05T22:51:04Z"},{"ns":0,"title":"TI-55","size":1998,"wordcount":180,"snippet":"The TI-<span class=\"searchmatch\">55</span> is a programmable calculator first manufactured by Texas Instruments in 1977. It had an LED display, and weighed 6.4 ounces (180 grams). It was","timestamp":"2017-07-24T02:02:41Z"}]}}*/