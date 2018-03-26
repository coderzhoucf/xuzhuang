/**
 * Created by zhouchunfeng on 2017/9/29.
 */
/**
 *
 * @param str 目标元素
 * @param opts 一些自主配置
 * @returns {DragEleByTouch}
 * @constructor function DragEleByTouch(str,opts) {}
 */
function DragEleByTouch(str,opts) {
    var _this = this;
    _this.settings={
        maxScaleRatio: 3,
        minScaleRatio: 0.3,
        enableDamping: false
    };
    _this.settings= Object.assign(this.settings,opts);
    _this.startX = 0;
    _this.startY = 0 ;
    _this.startRotate= 0;
    _this.startScale =0;
    _this.isUserInteracting = false;
    _this.isTwoFinger= false;
    _this.isOneFinger= false;
    _this.startPoint=[];
    _this.disFinger=0;
    _this.angel=0;
    _this.index = 1;
    _this.disX = 0;
    _this.disY = 0;
    _this.preX=0;
    _this.preY=0;
    _this.nowX=0;
    _this.nowY=0;
    _this.dampingFactor=0.1;
    _this.obj = document.querySelector(str);
    _this.obj.addEventListener( 'touchstart',function (ev) {
        ev = event||window.event;
        ev.preventDefault();
        _this.ondown(ev);
    },false);
    _this.obj.addEventListener( 'touchmove',function (ev) {
        ev = event||window.event;
        ev.preventDefault();
        _this.onmove(ev);
    },false);
    _this.obj.addEventListener( 'touchend',function (ev) {
        ev = event||window.event;
        ev.preventDefault();
        _this.onup(ev);
    },false);
    return _this;
}
DragEleByTouch.prototype.index=0;
DragEleByTouch.prototype.ondown = function (ev) {
    this.isUserInteracting = true;
    if(ev.targetTouches.length>=1){
        DragEleByTouch.prototype.index++;
        this.obj.style.zIndex = DragEleByTouch.prototype.index;
        console.log(DragEleByTouch.prototype.index);
    }
    if(ev.targetTouches.length==1){
        this.isOneFinger = true;
        this.startX = css(this.obj,'translateX');
        this.startY = css(this.obj,'translateY') ;
        this.startPoint[0]={
            x:ev.targetTouches[0].clientX,
            y:ev.targetTouches[0].clientY
        };
        this.preX=ev.targetTouches[0].clientX;
        this.preY=ev.targetTouches[0].clientY;

    }else if(ev.targetTouches.length==2){
        this.startScale = css(this.obj,'scale');
        this.startRotate = css(this.obj,'rotate');
        this.isOneFinger = false;
        this.isTwoFinger = true;
        this.startPoint[0]={
            x:ev.targetTouches[0].clientX,
            y:ev.targetTouches[0].clientY
        };
        this.startPoint[1]={
            x:ev.targetTouches[1].clientX,
            y:ev.targetTouches[1].clientY
        };
        this.disFinger = Math.sqrt(Math.pow((this.startPoint[1].x-this.startPoint[0].x),2)+Math.pow((this.startPoint[1].y-this.startPoint[0].y),2));
        this.angel = angle(this.startPoint[0],this.startPoint[1]);
    }

};
DragEleByTouch.prototype.onmove = function (ev) {
    if(this.isUserInteracting){
        if(this.isOneFinger&&ev.targetTouches.length==1){
            var offX =this.startX+ev.targetTouches[0].clientX - this.startPoint[0].x;
            var offY =this.startY+ev.targetTouches[0].clientY - this.startPoint[0].y;
            if(offX<0){
                offX=0;
            }
            if(offY<0){
                offY=0;
            }
            if(offX>document.documentElement.clientWidth - this.obj.clientWidth){
                offX=document.documentElement.clientWidth - this.obj.clientWidth;
            }
            if(offY>document.documentElement.clientHeight - this.obj.clientHeight){
                offY=document.documentElement.clientHeight - this.obj.clientHeight;
            }
            css(this.obj,'translateX',offX);
            css(this.obj,'translateY',offY);

            this.nowX=ev.targetTouches[0].clientX;
            this.nowY=ev.targetTouches[0].clientY;
            this.disX=this.nowX-this.preX;
            this.disY=this.nowY-this.preY;
            this.preX=this.nowX;
            this.preY=this.nowY;
        }
        if(this.isTwoFinger&&ev.targetTouches.length==2){
            var nowPoint=[];
            nowPoint[0]={
                x:ev.targetTouches[0].clientX,
                y:ev.targetTouches[0].clientY
            };
            nowPoint[1]={
                x:ev.targetTouches[1].clientX,
                y:ev.targetTouches[1].clientY
            };
            var disFingerNow = Math.sqrt(Math.pow((nowPoint[1].x-nowPoint[0].x),2)+Math.pow((nowPoint[1].y-nowPoint[0].y),2));
            var scaleValue = this.startScale*disFingerNow/this.disFinger;

            if(scaleValue<this.settings.minScaleRatio*100){
                scaleValue=this.settings.minScaleRatio*100;
            }
            if(scaleValue>this.settings.maxScaleRatio*100){
                scaleValue=this.settings.maxScaleRatio*100;
            }
            console.log(scaleValue);
            css(this.obj,'scale',scaleValue);
            var nowAngle = angle(nowPoint[0],nowPoint[1]);
            css(this.obj,'rotate',this.startRotate+nowAngle-this.angel);
        }

    }
};
DragEleByTouch.prototype.onup = function (ev) {
    this.isUserInteracting = false;
    if(this.settings.enableDamping){
        this.animate();
    }

};
DragEleByTouch.prototype.animate = function (ev) {
    var _this = this;
    console.log(_this.disX);
    console.log(_this.disY);
    var t=setInterval(function (){
        _this.disX*=(1-_this.dampingFactor);
        _this.disY*=(1-_this.dampingFactor);
        var x= _this.disX+css(_this.obj,'translateX');
        var y= _this.disY+css(_this.obj,'translateY');

        if(x<0){
            x=0;
        }
        if(y<0){
            y=0;
        }
        if(x>document.documentElement.clientWidth - _this.obj.clientWidth){
            x=document.documentElement.clientWidth - _this.obj.clientWidth;
        }
        if(y>document.documentElement.clientHeight - _this.obj.clientHeight){
            y=document.documentElement.clientHeight - _this.obj.clientHeight;
        }

        if(Math.abs(_this.disX)>=Math.abs(_this.disY)){
            if(Math.abs(_this.disX)<=1){
                clearInterval(t);
            }
        }else{
            if(Math.abs(_this.disY)<=1){
                clearInterval(t);
            }
        }
        css(_this.obj,'translateX',x);
        css(_this.obj,'translateY',y);
    },60);
};
DragEleByTouch.prototype.translate = function (x,y) {
    css(this.obj,'translateX',x);
    css(this.obj,'translateY',y);
};
DragEleByTouch.prototype.rotate = function (deg) {
    css(this.obj,'rotate',deg);
};
DragEleByTouch.prototype.scale = function (x,y) {
    css(this.obj,'scaleX',x);
    css(this.obj,'scaleY',y);
};
function angle(start,end){
    var diff_x = end.x - start.x,
        diff_y = end.y - start.y;
    //返回角度,不是弧度
    return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
}

function css(element, attr , val){
    if(attr == "scale"||attr == "scaleX"
        ||attr == "scaleY"||attr == "scaleZ"
        ||attr == "rotateX"||attr == "rotateY"
        ||attr == "rotateZ"||attr == "rotate"
        ||attr == "skewX"||attr == "skewY"
        ||attr == "translateX"||attr == "translateY"
        ||attr == "translateZ") {
        return cssTransform(element, attr, val);
    }
    if(arguments.length == 2){
        var val = getComputedStyle(element)[attr];
        if(attr=='opacity'){
            val = Math.round(val*100);
        }
        return parseFloat(val);
    }
    if(attr == "opacity") {
        element.style.opacity= val/100;
    } else {
        element.style[attr]= val + "px";
    }
}
function cssTransform(element, attr, val){
    if(!element.transform){
        element.transform = {};
    }
    if(typeof val === "undefined"){
        if(typeof element.transform[attr] === "undefined"){
            switch(attr){
                case "scale":
                case "scaleX":
                case "scaleY":
                case "scaleZ":
                    element.transform[attr] = 100;
                    break;
                default:
                    element.transform[attr] = 0;
            }
        }
        return element.transform[attr];
    } else {
        element.transform[attr] = val;
        var transformVal  = "";
        for(var s in element.transform){
            switch(s){
                case "scale":
                case "scaleX":
                case "scaleY":
                case "scaleZ":
                    transformVal += " " + s + "("+(element.transform[s]/100)+")";
                    break;
                case "rotate":
                case "rotateX":
                case "rotateY":
                case "rotateZ":
                case "skewX":
                case "skewY":
                    transformVal += " " + s + "("+element.transform[s]+"deg)";
                    break;
                default:
                    transformVal += " " + s + "("+element.transform[s]+"px)";
            }
        }
        element.style.WebkitTransform = element.style.transform = transformVal;
    }
}