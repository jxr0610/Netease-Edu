// 事件注册函数,兼容IE8
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
 * [dataset 兼容版]
 * @param  {Element} element [元素节点]
 * @return {Obj}         [对象]
 */
function dataset(element){
  if(element.dataset){
    return element.dataset;
  }else{//否则使用以下代码模拟实现
    var attributes=element.attributes;
    var name=[],value=[];
    var obj={};
    for(var i=0;i<attributes.length;i++){
      if(attributes[i].nodeName.slice(0,5)=="data-"){
        
        name.push(attributes[i].nodeName.slice(5));
          
        value.push(attributes[i].nodeValue);
      }
    }
    for(var j=0;j<name.length;j++){
      obj[name[j]]=value[j];
    }
    return obj;
  }
}
// 兼容版 bind 方法
// 代码来源:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis || this,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

//兼容版的element.children
function children(element){
  if(element.children){
      return element.children;
  }else{
     var elementarr = [];
     var nodelist = element.childNodes;
     for(var i=0; i < nodelist.length; i++){
         if(nodelist[i].nodeType == 1){
             elementarr.push(nodelist[i]);
         }else continue;
     }
     return elementarr;
  }
}

/**
 * [getElementsByClassName 兼容版]
 * @param  {Element} element [元素节点]
 * @param  {Str} names   [类名,支持多个,以空格隔开]
 * @return {Array}         [元素节点数组]
 * @author [魏文庆]
 */
function getElementsByClassName(element, names) {
  if (element.getElementsByClassName) {
    return element.getElementsByClassName(names);
  } else {
      var elements = element.getElementsByTagName('*');
      var result = [];
      var element,
          classNameStr,
          flag;
      names = names.split(' ');
      for (var i = 0; element = elements[i]; i++) {
        classNameStr = ' ' + element.className + ' ';
        flag = true;
        for (var j = 0, name; name = names[j]; j++) {
          if (classNameStr.indexOf(' ' + name + '') == -1) {
              flag = false;
              break;
          }
        }
        if (flag) {
          result.push(element);
        }
      }
      return result;
    }
}


(function(){
  // 将HTML转换为节点
  function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }

  // 赋值属性
  // extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
  function extend(o1, o2){
    for(var i in o2) if(typeof o1[i] === 'undefined'){
      o1[i] = o2[i]
    } 
    return o1
  }

  // 关注模块
  
  var templateFo = 
  "<div class='u-follow'>\
    <div id='follow' class='icn'>关注</div>\
    <div class='followed'>\
      <div class='icn'></div>已关注<span class='cancel'>| <span class='unfollow'>取消</span></span>\
    </div>\
    <span>粉丝 </span><span class='fancount'>45</span>\
  </div>";

  function Follow(){
    this.container = this._layout.cloneNode(true);

    this.follow = children(this.container)[0];
    // 已关注
    this.followed = children(this.container)[1];
    // 取消关注按钮
    this.unfollow = this.followed.querySelector(".unfollow");
    // 关注人数
    this.fcount = this.container.querySelector(".fancount");

    this._initEvent();

  }

  extend(Follow.prototype,{
    _layout:html2node(templateFo),

    status_ava:function(){
      this.fcount.innerText -= 1;
      this.follow.style.display = "inline-block";
      this.followed.style.display = "none";
    },

    status_un:function(){
      this.fcount.innerText = Number(this.fcount.innerText) + 1;
      this.follow.style.display = "none";
      this.followed.style.display = "block";
    },

    _initEvent:function(){
      // 添加到页面中
      getElementsByClassName(document,"m-ct f-cb")[0].insertBefore(this.container,document.querySelector(".links"));
      // 判断是否登录以及关注,若都满足,设置成'已关注'状态
      if(document.cookie.indexOf("loginSuc=") != -1){
        if(document.cookie.indexOf("followSuc=") != -1){
          this.status_un();
        }
      }
      // 取关
      addEvent(this.unfollow,"click",function(){
      document.cookie = "followSuc=1; max-age=0;"
      this.status_ava();
      }.bind(this));
      // 关注
      addEvent(this.follow,"click",function(){
        if(document.cookie.indexOf("loginSuc=")==-1){
          login = new Login();
        }else{
          var url = "http://study.163.com/webDev/attention.htm";
          get(url,"",function(num){
            try{
              if(num==1){
                document.cookie = "followSuc=1";
                this.status_un();
              }
            }catch(ex){
              //
            }
          }.bind(this));
        }
      }.bind(this));
    }
  })  

  // 登录Modal

  var templateL = 
    "<div class='m-modal'>\
      <div class='align'></div>\
      <div class='login'>\
        <form class='form' name='loginForm'>\
          <div class='u-ttl'>登录网易云课堂</div>\
          <div class='icn'></div>\
          <input id='account' name='name' type='text' placeholder='账号''>\
          <input id = 'password' name='password' type='password' placeholder='密码'>\
          <div class='msg'></div>\
          <button class='loginbtn'>登录</button>\
         </form>\
       </div>\
     </div>";

  function Login(){
    this.container = this._layout.cloneNode(true)

    this.form = this.container.querySelector(".form");

    this.cls = children(this.form)[1];

    this.mask = document.createElement("div");

    this.mask.className = "f-mask";

    this._initEvent();
  }

  extend(Login.prototype,{

    _layout:html2node(templateL),

    show:function(){
      document.body.appendChild(this.mask);
      document.body.appendChild(this.container);
    },

    hide:function(){
      document.body.removeChild(this.mask)
      document.body.removeChild(this.container);
    },

    _initEvent:function(){
      this.show();
      // 登录事件
      addEvent(this.form,"submit",function(e){
        if(e.preventDefault){
          e.preventDefault();
        }else{
          e.returnValue = false;
        }
        // 加密
        var account = hex_md5(this.form.account.value),
            pswd = hex_md5(this.form.password.value),
            url = "http://study.163.com/webDev/login.htm",
            data = {userName:account,password:pswd};

        get(url,data,function(num){
          try{
            if(num==1){
              this.hide();
              document.cookie = "loginSuc=1";
              document.cookie = "followSuc=1";
              follow.status_un();
            }else if(num==0){
              alert("账号/密码错误")
            }
          }catch(ex){
            //
          }
        }.bind(this))
      }.bind(this));
      // 关闭
      addEvent(this.cls,"click",this.hide.bind(this));
    },

  })

  // slider 轮播图
  // 
  var templateS = "<div class='m-slider'>\
                    <a href='' target='_blank'><img class='slide'></a>\
                    <div class='pointer'>\
                      <i class='u-p' data-index='1'></i>\
                      <i class='u-p' data-index='2'></i>\
                      <i class='u-p' data-index='3'></i>\
                    </div>\
                  </div>";

  function Slider(options){
    extend(this,options);

    options = options || {};

    this.container = this.container || document.body;

    this.slider = this._layout.cloneNode(true);

    this.slides = this.slider.querySelector(".slide");

    this.link = this.slides.parentNode;

    this.pointer = this.slider.querySelector(".pointer");

    this.pointes = this.slider.querySelectorAll(".u-p");

    this.pageNum = this.images.length;
    // 判断pageindex是否合法/输入,默认为1
    this.pageindex = (0<this.pageindex && this.pageindex<this.pageNum +1)? this.pageindex : 1;

    this._initEvent();
  }

  extend(Slider.prototype,{

    _layout:html2node(templateS),
    // 轮播动作
    change:function(){
      index = this.pageindex;
      index ++;
      index >3?index=1:index=index;
      // 遍历所有"圆点",添加基本类名
      for(var i = 0,length=this.pageNum;i<length;i++){
        this.pointes[i].className = "u-p";
      }
      // 当前"圆点"添加"z-crt"类名
      this.pointes[index-1].className += " z-crt";
      // 改变src,实现轮播
      this.slides.src = this.images[index-1];
      // 改变url
      this.link.href = this.urls[index-1];

      this.slides.style.cssText = "opacity:0;";
      // 通过获取位置属性,清空浏览器对样式的缓存
      this.slides.offsetHeight;
      // 淡入
      this.slides.style.cssText = "opacity:1;transition-property:opacity;transition-duration:0.5s;transition-timing-function:ease-in;"

      this.pageindex = index;
    },
    // 执行轮播,5s一次
    start:function(){
      this.timer = setInterval(this.change.bind(this),5000)
    },
    // 停止轮播
    stop:function(){
      clearInterval(this.timer);
    },
    // 初始化,设置'首页'图片,对应"圆点"样式以及链接,开始轮播
    _initEvent:function(){

      this.container.appendChild(this.slider);

      this.link.href = this.urls[this.pageindex-1];
      this.slides.src = this.images[this.pageindex-1];
      this.pointes[this.pageindex-1].className+=" z-crt";
      // 添加'圆点'点击事件,采用事件代理
      addEvent(this.pointer,"click",function(e){
        var target = e.srcElement ? e.srcElement:e.target
        if(target.tagName=="I"){
          this.stop();
          this.pageindex = dataset(target).index - 1;
          this.change();
          this.start();
        }
      }.bind(this));

      // 鼠标移入,停止轮播.
      addEvent(this.slides,"mouseover",function(){
        this.stop();
      }.bind(this));
      // 鼠标移出,重新开始轮播
      addEvent(this.slides,"mouseout",function(){
        this.start();
      }.bind(this));
      // 开始轮播
      this.start();
    }
  })

  // course课程模块
  // ----
     
  var templateC = 
    "<li class='u-course'>\
      <a class='img'>\
        <img width = '223px' height = '124px'>\
        <div class='detail'>\
         <div class='top f-cb'>\
            <img class='dimg' width = '223px' height = '124px'>\
            <div class='content'>\
              <div class='dttl'></div>\
              <div class='dlcount icn'></div>\
              <div class='dprv'></div>\
              <div class='dcategory'></div>\
            </div>\
          </div>\
          <div class='descr'></div>\
        </div>\
      </a>\
    <div class='ttl'></div>\
    <div class='prv'></div>\
    <div class='lcount icn'></div>\
    <div class='price'></div>\
    </li>";

  function Course(options){

    options = options || {};
    // 主容器
    this.container = document.querySelector(".m-courselist");
    // 当前页课程数
    this.coursecount = getElementsByClassName(this.container,"u-course");
    // 页码器
    this.pager = document.querySelector(".m-page"),
    // 页数
    this.pagecount = getElementsByClassName(document,"pageindex");

    extend(this,options);

    this._initEvent();

  }



  extend(Course.prototype,{

    _layout: html2node(templateC),
    // 增加课程
    addcourse:function(i){

      this.container.appendChild(this._layout.cloneNode(true));
      this.setcourse(i);

    },
    // 设置课程样式
    setcourse:function(i){
      var s = children(this.container)[i],
          l = this.list[i];
      children(children(s)[0])[0].src = l.middlePhotoUrl;
      s.querySelector(".dimg").src = l.middlePhotoUrl;
      s.querySelector(".dttl").innerText = l.name;
      s.querySelector(".dlcount").innerText = l.learnerCount + "人在学"
      s.querySelector(".dprv").innerText = "发布者:" + l.provider;
      s.querySelector(".dcategory").innerText = "分类:" + (l.categoryName?l.categoryName:"无");
      s.querySelector(".descr").innerText = l.description;
      children(s)[1].innerText = l.name
      children(s)[2].innerText = l.provider;
      children(s)[3].innerText = l.learnerCount;
      children(s)[4].innerText = l.price == 0? "免费" : '￥'+ l.price;
    },
    // 页码点击执行函数
    pmove:function(event){
      var target = event.srcElement ? event.srcElement:event.target;
      if(target.tagName == "LI"){
        var index = Number(dataset(target).index),
            pageNo = data.pageNo;

        // -1为上一页,0为下一页
        switch(index){
          case -1:
            if(pageNo>1){
              data.pageNo = data.pageNo - 1;
              get(url,data,function(obj){
                // extend(obj,data)
                course = new Course(obj)
              })
            }
          
          break;
          case 0:
            if(pageNo<this.totalPage){
              data.pageNo += 1;
              get(url,data,function(obj){
                // extend(obj,data)
                course = new Course(obj);
              })
            }

          
          break;
          default:
            if(index>0 && index != pageNo){
              data.pageNo = index;
              get(url,data,function(obj){
                // extend(obj,data)
                course = new Course(obj);
              })
            }
        }
      }
    },

    // 初始化事件,根据现有的课程数和获取到的课程数来增删/设置课程
    _initEvent:function(){
      // 判断请求的页码数是否大于服务器返回的总页数.
      // 若大于总页数,自动返回最后一页数据
      // 经测试,'错误'的页码数还是会返回totalPage和totalCount
      if(data.pageNo > this.totalPage){
          data.pageNo = this.totalPage;
          get(url,data,function(obj){
            course = new Course(obj)
          })
      }else{
        var clength = this.coursecount.length,//当前页面的课程数量
            llength = this.list.length;//从服务器获取到的指定页面课程数量
        if(clength == 0){
          for(var i = 0,length=llength;i<length;i++){
            this.addcourse(i);
          }
        }else if(clength == llength){
          for(var i = 0,length=llength;i<length;i++){
            this.setcourse(i)
          }
        }else if(clength>llength){
          for(var i = 0,length=clength - llength;i<length;i++){
            this.container.removeChild(children(this.container)[0])
          }
          for(var i=0,length=llength;i<length;i++){
            this.setcourse(i)
          }
        }else{
          for(var i = 0;i<clength;i++){
            this.setcourse(i)
          }
          for(var i=clength;i<llength;i++){
            this.addcourse(i);
          }
        }
        // 设置页码数
        if(this.pagecount.length == 0){ //无页码时,即第一次加载页面时
          for(var i=0 ,length = this.totalPage;i<length;i++){
            // 创建元素
            var pageindex = document.createElement("li");
            // 设置类名
            (i+1) == data.pageNo ? pageindex.className = "pageindex z-sel" : pageindex.className = "pageindex";

            pageindex.setAttribute("data-index",i+1);

            pageindex.innerHTML = i+1 ;

            this.pager.insertBefore(pageindex,children(this.pager)[i+1]);
          }
          // 对页码器进行事件代理,执行跳转
          addEvent(this.pager,"click",this.pmove);
          // 注册tab的点击事件,采用事件代理
          var coursetab = document.querySelector(".u-tab");
          addEvent(coursetab,"click",function(e){
            var target = e.srcElement ? e.srcElement:e.target;
            switch(dataset(target).type){
              case "10":
              data.type = 10;
              data.pageNo = 1;
              break;

              case "20":
              data.type = 20;
              data.pageNo = 1;
              break;
            }
            // 遍历所有tab,设置基本类名
            for(var i = 0,length = children(coursetab).length;i<length;i++){
              children(coursetab)[i].className = "";
            }
            // 当前tab设置'z-sel'
            target.className = "z-sel"
            get(url,data,function(obj){
              // extend(obj,data)
              course = new Course(obj)
            })
          })
        }else if (this.pagecount.length < this.totalPage){ // 页面总页码数小于从服务器获取的总页码数时
          for(var i = this.pagecount.length ; i<this.totalPage;i++){

            var pageindex = document.createElement("li");

            pageindex.className = "pageindex";

            pageindex.setAttribute("data-index",i+1);

            pageindex.innerHTML = i+1 ;

            this.pager.insertBefore(pageindex,children(this.pager)[i+1]);
          }
        }else if(this.pagecount.length > this.totalPage){ //页面总页码数大于从服务器获取的总页码数时
          for(var i = this.totalPage;i<this.pagecount.length;i++){

            this.pager.removeChild(children(this.pager)[i+1]);
            
          }
        }
        // 设置页码状态
        for(i=0;i<this.totalPage;i++){
        (i+1) == data.pageNo ? this.pagecount[i].className = "pageindex z-sel" : this.pagecount[i].className = "pageindex";
        }
      }      
    }
  })


  // 热门课程模块
  //
  var templateHotC = "<li class='u-hot f-cb'>\
                      <img width='50px' height='50px'>\
                      <div>\
                        <div class='cttl'></div>\
                        <div class='lcount icn'></div>\
                      </div>\
                    </li>";

  function Hotcourse(options){
    options = options || {};
    // 将返回的数组放入list中,再放入Hotcourse
    this.list = [];

    extend(this.list,options);

    this.container = children(document.querySelector(".hot"))[0];

    this.supcontainer = this.container.parentNode;

    this._mt = 0;

    this._initEvent();

  }

  extend(Hotcourse.prototype,{

    _layout:html2node(templateHotC),
    //增加课程
    addcourse:function(i){

    this.container.appendChild(this._layout.cloneNode(true));

    this.setcourse(i);

    },
    // 设置课程样式
    setcourse:function(i){

      children(children(this.container)[i])[0].src = this.list[i].smallPhotoUrl;

      children(this.container)[i].querySelector(".cttl").innerText = this.list[i].name;

      children(this.container)[i].querySelector(".lcount").innerText = this.list[i].learnerCount;
    },
    // 滚动排行榜
    scroll:function(){

      if(this._mt == -1400){

        this._mt = 0;
        // 归位
        this.container.style.cssText = "";
        // 通过获取位置属性来清除浏览器对样式的缓存
        // 代码来源:https://segmentfault.com/q/1010000008720117,我自己的提问.
        this.container.offsetHeight;
      }

      this._mt += -70;

      var str = "margin-top:"+this._mt +"px;" + "transition-property:margin-top;transition-duration:1s;transition-timing-function:linear";
      
      this.container.style.cssText = str;

    },
    // 滚动
    start:function(){
      this.timer = setInterval(this.scroll.bind(this),5000)
    },
    // 停止
    stop:function(){
      clearInterval(this.timer);
    },
    // 初始化事件
    _initEvent:function(){
      // 调用Course的addcourse函数
      for(var i = 0,length=this.list.length;i<length;i++){
        this.addcourse(i)
      }
      // 克隆一个节点,用于后期滚动
      this.supcontainer.appendChild(this.container.cloneNode(true));
      // 开始滚动
      this.start();

      addEvent(this.supcontainer,"mouseover",this.stop.bind(this))

      addEvent(this.supcontainer,"mouseout",this.start.bind(this))
      // 对页面进行侦测,若处于'后台'状态,不进行滚动
      addEvent(document,"visibilitychange",function(){
        if(document.hidden){
          this.stop();
        }else{
          this.start();
        }
      }.bind(this))
    }

  })

  // video Modal 视频弹窗
  var templateVModal = 
  "<div class='m-modal'>\
    <div class='align'></div>\
    <div class='vct'>\
      <div class='zttl'>遇见更好的自己</div>\
      <div class='zcls'></div>\
      <div class='u-playbtn'></div>\
      <video src='http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4'  width='960px'></video>\
      <div>\
  </div>";

  function VModal(){

    this.container = this._layout.cloneNode(true);

    this.mask = document.createElement("div");

    this.mask.className = "f-mask";

    this.cls = this.container.querySelector(".zcls");

    this.playbtn = this.container.querySelector(".u-playbtn");
    // video本体
    this.vcontent = this.container.getElementsByTagName("video")[0];

    this._initEvent();
  }

  extend(VModal.prototype,{

    _layout:html2node(templateVModal),

    show:function(){
      document.body.appendChild(this.container);

      document.body.appendChild(this.mask);
    },

    hide:function(){
      document.body.removeChild(this.container);


      document.body.removeChild(this.mask);
    },

    play:function(){
      this.vcontent.play();
      this.playbtn.style.display = "none";
    },

    pause:function(){
      this.vcontent.pause();
      this.playbtn.style.display = "block";
    },

    judge:function(){
      if(this.vcontent.paused){
        this.play()
      }else {this.pause()}
    },

    _initEvent:function(){

      addEvent(this.cls,"click",this.hide.bind(this));
      // 点击视频外,关闭视频
      addEvent(this.container,"click",function(e){
        var target = e.target || e.srcElement;
        if(target.className == "m-modal"){
          this.hide();
        }
      }.bind(this));
      // 点击视频实现播放/暂停
      addEvent(this.vcontent,"click",this.judge.bind(this));

      this.show();

      this.play();
    }
  })

  // 暴露接口
  window.Follow = Follow;
  window.Login = Login;
  window.Slider = Slider;
  window.Course = Course;
  window.Hotcourse = Hotcourse;
  window.VModal = VModal;
  
  var winWidth = window.innerWidth,
      flag = 1,
      url = "https://study.163.com/webDev/couresByCategory.htm",
      data = {pageNo:1,psize:20,type:10},
      hoturl = "https://study.163.com/webDev/hotcouresByCategory.htm";
  // 若窗口宽度小于1205px,每页放15个
  if(winWidth < 1205){
    data.psize = 15;
    flag =0;
  }
  // 检测窗口,实时改变布局
  window.onresize = function(){
    if(window.innerWidth < 1205  && flag ==1){
      flag = 0;
      data.psize = 15;
      // data.pageNo = 1;
      get(url,data,function(obj){
      // extend(obj,data);
      course = new Course(obj);
      });
    }else if(window.innerWidth >=1206 && flag ==0){
      flag = 1;
      data.psize = 20;
      // data.pageNo = 1;
      get(url,data,function(obj){
      // extend(obj,data);
      course = new Course(obj);
      });
    }
  }
  // 获取课程数据
  get(url,data,function(obj){
    extend(obj,data);
    course = new Course(obj);
  });
  // 获取榜单数据
  get(hoturl,"",function(arr){
    hotcourse = new Hotcourse(arr);
  })
})();