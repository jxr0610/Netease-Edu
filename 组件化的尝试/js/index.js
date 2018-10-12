var addEvent = document.addEventListener ?
    	 	function(ele,type,listener,useCapture){
    	 		ele.addEventListener(type,listener,useCapture);
    	 	}:
    	 	function(ele,type,listener){
    	 		ele.attachEvent('on'+type,listener);
    	 	};

/**
 * [Ajax get请求封装]
 * @param  {Str}   url      [请求地址]
 * @param  {Obj}   options  [请求参数]
 * @param  {Function} callback [执行回调函数]
 */
function get(url,options,callback){
	function serialize(options){
		if(!options) return '';
		var pairs = [];
		for(var name in options){
			if(!options.hasOwnProperty(name)) continue;
			if(typeof options[name] === 'function') continue;
			var value = options[name].toString();
			name = encodeURIComponent(name);
			value = encodeURIComponent(value);
			pairs.push(name + '=' + value);
		}
		return pairs.join('&');
			}
	var xhr = new XMLHttpRequest;
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if((xhr.status >= 200 && xhr.status<300) || (xhr.status == 304 )){
				callback(JSON.parse(xhr.responseText));
			}
		}
	}
	xhr.open('get',url + '?' + serialize(options),true);
	xhr.send(null);
}
/**
 * [fomdata description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function fomdata(obj){
	var courselist = document.querySelector(".m-courselist"),
		page = document.querySelector(".m-page"),
		coursecount = document.getElementsByClassName("u-course");
		totalpage = obj.totalPage;
	if(coursecount.length == 0){
		for(var i = 0,length=obj.list.length;i<length;i++){
			addcourse();
		}
	}else if(coursecount.length == obj.list.length){
		for(var i = 0;i<coursecount.length;i++){
			changestyle(coursecount[i])
		}
	}else if(coursecount.length>obj.list.length){
		for(var i=0;i<obj.list.length;i++){
			changestyle(coursecount[i])
		}
		for(var j=obj.list.length,length=coursecount.length;j<length;j++){
			courselist.removeChild(courselist.lastElementChild)
		}
	}else{
		for(var i = 0;i<coursecount.length;i++){
			changestyle(coursecount[i])
		}
		for(var i=coursecount.length;i<obj.list.length;i++){
			addcourse();
		}
	}
	function changestyle(ele){
		ele.children[0].firstElementChild.src = obj.list[i].middlePhotoUrl;
		ele.children[0].lastElementChild.firstElementChild.children[0].src = obj.list[i].middlePhotoUrl;
		ele.children[0].lastElementChild.firstElementChild.lastElementChild.children[0].textContent = obj.list[i].name;
		ele.children[0].lastElementChild.firstElementChild.lastElementChild.children[1].textContent = obj.list[i].learnerCount + "人在学"
		ele.children[0].lastElementChild.firstElementChild.lastElementChild.children[2].textContent = "发布者:" + obj.list[i].provider;
		ele.children[0].lastElementChild.firstElementChild.lastElementChild.children[3].textContent = "分类:" + obj.list[i].categoryName;
		ele.children[0].lastElementChild.lastElementChild.textContent = obj.list[i].description;
		ele.children[1].textContent = obj.list[i].name
		ele.children[2].innerHTML = obj.list[i].provider;
		ele.children[3].innerHTML = obj.list[i].learnerCount;
		ele.children[4].innerHTML = obj.list[i].price == 0? "免费" : '￥'+ obj.list[i].price;
		
	}
	function addcourse(){
		var course = document.createElement("li");
		course.className = "u-course";
		course.innerHTML = "<div class='img'>\
								<img width = '223px' height = '124px'>\
								<div class='detail'>\
									<div class='top f-cb'>\
										<img class='dimg' width = '223px' height = '124px'>\
										<div class='content'>\
											<div class='dttl'></div><div class='dlcount icn'></div><div class='dprv'></div><div class='dcategory'></div>\
										</div>\
									</div>\
									<div class='descr'></div>\
								</div>\
								</div>\
							<div class='ttl'></div>\
							<div class='prv'></div>\
							<div class='lcount icn'></div>\
							<div class='price'></div> ";
		changestyle(course);
		courselist.appendChild(course);
	}
				
	var pagearr = document.getElementsByClassName("pageindex");
	if(pagearr.length == 0){
		for(var i = 0,count = obj.totalPage;i<count;i++){
			var pageindex = document.createElement("div");
			pageindex.className = "pageindex";
			(i+1) == data.pageNo ? pageindex.className += " z-sel" : pageindex.className = "pageindex";
			pageindex.innerHTML = i+1 ;
			page.insertBefore(pageindex,page.lastElementChild);
		}
		// 给页码注册事件,实现点击效果
		var pages = document.querySelector(".m-page");
		for(var i = 1,length=pages.children.length;i<length-1;i++){
			(function(i){
				addEvent(pages.children[i],"click",function(){
					data.pageNo = i ;
					// console.log(i);
					get(courseurl,data,fomdata);
				})
			})(i)
			}
	}else{
		for(i=0;i<obj.totalPage;i++){
			(i+1) == data.pageNo ? pagearr[i].className = "pageindex z-sel" : pagearr[i].className = "pageindex";
		}
	}
}

function fomdata1(obj){
	console.log(obj);
	var list = document.getElementsByClassName("u-hot");
	for(var i =0,length = list.length;i<length;i++){
		list[i].firstElementChild.src = obj[i].smallPhotoUrl;
		list[i].children[1].firstElementChild.textContent = obj[i].name;
		list[i].lastElementChild.lastElementChild.textContent = obj[i].learnerCount;
	}
	var ul = list[0].parentNode.cloneNode(true);
	document.querySelector(".hot").appendChild(ul);
}
function extend(o1, o2){
  for(var i in o2) if(typeof o1[i] === 'undefined'){
    o1[i] = o2[i]
  } 
  return o1
}
var courseurl = "https://study.163.com/webDev/couresByCategory.htm",
	data = {pageNo:1,psize:20,type:10};
get(courseurl,data,fomdata);
get(courseurl,data,function(arr){
	haha11 = arr;
});
var hotlisturl = "https://study.163.com/webDev/hotcouresByCategory.htm"
get(hotlisturl,"",fomdata1);
// 注册箭头翻页
var prevpage = document.getElementsByClassName("icn left")[0];
	nextpage = document.getElementsByClassName("right icn")[0],
addEvent(prevpage,"click",function(){
	if(data.pageNo > 1? data.pageNo -=1 : false)
	get(courseurl,data,fomdata)
});
addEvent(nextpage,"click",function(){
	if(data.pageNo < totalpage? data.pageNo +=1 : false)
	get(courseurl,data,fomdata)
});

// 滚动列表
var list = document.getElementsByClassName("u-hot");
var mtop = window.getComputedStyle(list[0].parentNode).marginTop;
mtop = parseInt(mtop);
addEvent(document,"visibilitychange",function(){
	if(document.visibilityState == "hidden"){
		hotstop();
	}else{
		hotstart();
	}
});
function move(){
	var _count = 0;
	var doing ;
	mtop <= -1400? mtop=0:mtop=mtop;
	function setp(){
		doing =1;
		mtop = mtop - 3.5;
		mtop = mtop.toFixed(1);
		mt = mtop + "px"
		list[0].parentNode.style.marginTop = mt;
		if(mtop % 70 ==0){clearInterval(timer);doing = 0}
	}
	if(!doing){
		var timer = setInterval(setp,50);
	}
}
function hotstart(){hottimer = setInterval(move,5000);}
function hotstop(){clearInterval(hottimer)}
hotstart();
var hotul = document.querySelector(".hot");
addEvent(hotul,"mouseout",hotstart);
addEvent(hotul,"mouseover",hotstop)
// 登录
var follow = document.getElementById("follow"),
	followed = document.querySelector(".followed"),
	tips = document.getElementsByClassName("g-wrap")[0];
function iffollow(){
	if(document.cookie.indexOf("loginSuc=1") != -1){
		if(document.cookie.indexOf("followSuc=1") != -1){
			follow.style.display = "none"
			followed.style.display = "block";
		}
	}
	if(document.cookie.indexOf("tipstatus=0") != -1){
		tips.style.display = "none";
	}
}
iffollow();
addEvent(follow,"click",function(){
	if(document.cookie.indexOf("loginSuc=1") != -1){
		document.cookie = "followSuc=1";
		follow.style.display = "none"
		followed.style.display = "block";
	}else{
	var login = document.createElement("div"),
		mask = document.createElement("div")
	login.innerHTML = "<form name='loginForm'>\
						<div class='u-ttl'>登录网易云课堂</div>\
						<div class='icn'></div>\
						<input id='account' name='name' type='text' placeholder='账号''>\
						<input id = 'password' name='password' type='password' placeholder='密码'>\
						<button class='loginbtn'>登录</button>\
					   </form>"
	login.className = "m-login";
	mask.className = "f-mask"
	login = document.body.appendChild(login);
	mask = document.body.appendChild(mask);
	// 表单事件
	var form = document.forms.loginForm,
		close = login.getElementsByClassName("icn")[0];
	addEvent(close,"click",function(){
		document.body.removeChild(login);
		document.body.removeChild(mask)
	});
	addEvent(form,"submit",function(e){
		e.preventDefault();
		var account = form.account.value,
			pswd = form.password.value;
			url = "http://study.163.com/webDev/login.htm";
		account = hex_md5(account);
		pswd = hex_md5(pswd);
		data = {userName:account,password:pswd,}
		// var accountV = account.value,
		// 	pswdV = pswd.value;
		// account.value = hex_md5(accountV);
		// pswd.value = hex_md5(pswdV);
		get(url,data,function(num){
			if(num == 1){
				document.body.removeChild(login);
				document.body.removeChild(mask);
				document.cookie = "loginSuc=1";
				document.cookie = "followSuc=1";
				follow.style.display = "none"
				followed.style.display = "block";
			}else{
				alert("hah")
			}
		});
	});
}
});
// 取消关注

var unfollow = document.getElementById("unfollow");
addEvent(unfollow,"click",function(){
	document.cookie = "followSuc=1; max-age=0";
	follow.style.display = "inline-block";
	followed.style.display = "none";
});
// 不再提醒
var canceltip = document.getElementsByClassName("cancel")[0];
addEvent(canceltip,"click",function(){
	document.cookie = "tipstatus=0";
	iffollow();
})
// 注册tab
var coursetab = document.getElementsByClassName("u-tab");
addEvent(coursetab[0].firstElementChild,"click",function(){
	data.type = 10;
	data.pageNo = 1;
	coursetab[0].firstElementChild.className = "z-sel";
	coursetab[0].lastElementChild.className = "";
	get(courseurl,data,fomdata);
});
addEvent(coursetab[0].lastElementChild,"click",function(){
	data.type = 20;
	data.pageNo = 1;
	coursetab[0].lastElementChild.className = "z-sel";
	coursetab[0].firstElementChild.className = "";
	get(courseurl,data,fomdata);
})
	
		
		// var resobj = JSON.parse(response);

		// window.onload = function(){

var slide = document.getElementsByClassName("u-slide")[0];
var pointer = slide.parentNode.getElementsByClassName("u-pointer")[0].children;
// var index = slide.getAttribute("data-index");
var index = 1;
	// 淡入动画,100ms执行一次,共5次500ms
function fadein(ele){
	ele.style.opacity = 0;
	var curOpacity = 0;
	var step = function(){
		curOpacity += 0.2;
		ele.style.opacity = curOpacity;
		if (window.getComputedStyle(ele).opacity == 1) {clearInterval(fadeintimer);}
	};
	var fadeintimer = setInterval(step,100);
}
//轮播动画,5s执行一次,通过改变img的src来实现轮播
function changeimg(){
	fadein(slide);
	index++;
	index>3?index=1:index=index;
	for(var i = 0;i<3;i++){
		pointer[i].className = "";
	}
	pointer[index-1].className += " z-crt";
	slide.src = "images/banner" + index +".jpg";
}
// 开始轮播
function start(){
	timer = setInterval(changeimg,5000);
}
// 停止轮播
function stop(){
	clearInterval(timer);
}
start();
// 注册事件,鼠标移动停止轮播
addEvent(slide,"mouseenter",stop);
addEvent(slide,"mouseout",start);

// 注册事件,点击圆点切换图片
// 利用for循环注册事件,出现问题,var改成let可以解决,但低版本IE不支持
// 笨方法是一个个手动注册
// 还有个思路是立即执行函数
// for(var i = 0 ;i < 3 ; i++){
// 	(function(i){
// 	addEvent(pointer[i],"click",function(){
// 		stop();
// 		index = i
// 		changeimg();
// 		start();

// 	});})(i)
// }

// 利用事件委托实现点击圆点换图
var pointer1 = document.querySelector(".u-pointer");
addEvent(pointer1,"click",function(e){
	if(e.target.tagName == "I"){
		stop();
		index = e.target.dataset.index-1;
		changeimg();
		start();
	}
});
// 视频播放事件
var vdo = document.getElementsByClassName("u-intro")[0];

// 注册事件,点击出现视频
addEvent(vdo,"click",function(){
	var mask = document.createElement("div"),
		vct = document.createElement("div"),
	    mask = document.body.appendChild(mask),
	    vct = document.body.appendChild(vct);
	mask.className = "f-mask";
	vct.className = "m-vct";
	vct.innerHTML = "<div class='zttl'>遇见更好的自己</div><div class='zcls'></div><div class='u-playbtn'></div><video src='http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4'  autoplay='autoplay' width='889' height='537'></video>";
	var cls = vct.querySelector(".zcls"),
		playbtn = vct.querySelector(".u-playbtn"),
		video = vct.getElementsByTagName("video")[0];

	//	点击视频内容进行播放/暂停
	addEvent(video,"click",function(){
		if(this.paused){
			this.play();
			playbtn.style.display = "none"
	}
		else{
			this.pause();
			playbtn.style.display = "block"
		}
	});
	// 点击空白处,退出视频
	addEvent(mask,"click",function(){
		document.body.removeChild(vct);
		document.body.removeChild(mask);
	});
	// 点击关闭,退出视频
	addEvent(cls,"click",function(){
		document.body.removeChild(vct);
		document.body.removeChild(mask);
	});
});