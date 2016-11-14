var canvas=document.getElementById("canvas");
var cxt=canvas.getContext("2d");
//宽
var width=canvas.width;	
//高
var height=canvas.height;
//背景
var bg;
//战机
var plane1=null,plane2=null;
//战机图片
var pImg1,pImg2;
//子弹数组
var bullets=[];
//子弹图片
var BImg;
//小型敌机数量
var eLength;
//敌机数组
var enemys=[];
//敌机图片
var eImg,eImg1,eImg2,life;
//中等敌机数组
var e11,e12,life1;
//敌机boss
var boss,life2;
//分数
var score=0;
//背景高度
var bgHeight;
//难度值
var hard;
//定时器
var timer;
window.onload=init();
//初始化
function init(){
	e11=null;
	e12=null;
	boss=null;
	eLength=10;
	hard=1;	
	bgHeight=0;
	document.getElementById("start1").onclick=function(){
		document.getElementById("start1").style.display="none";
		document.getElementById("start2").style.display="none";
		plane1=new Plane(width/2,height-100,200);
		timer=setInterval(draw,10);	
	}
	document.getElementById("start2").onclick=function(){
		document.getElementById("start1").style.display="none";
		document.getElementById("start2").style.display="none";
		plane1=new Plane(width/2-100,height-100,200);
		plane2=new Plane(width/2+100,height-100,200);
		timer=setInterval(draw,10);	
	}
	bg=addImage("img/Bg1.png");
	pImg1=addImage("img/plane1.png");
	pImg2=addImage("img/plane2.png");
	BImg=addImage("img/bullet.png");
	eImg=addImage("img/enemy.png");
	life=1;
	eImg1=addImage("img/enemy1.png");
	life1=5;
	eImg2=addImage("img/enemy2.png");
	life2=15;
}
//游戏运行
function draw(){
	cxt.clearRect(0,0,width,height);
//	cxt.drawImage(bg,0,0,width,height);
    drawBg();
	cxt.font = "bold 20px Arial"; 
	cxt.fillStyle="peru";
	if((plane1==null&&plane2==null)||hard==4){
		gameOver();
	}else{	
		//绘制分数
		cxt.fillText("得分:"+score,width-200,30);
		//目前关卡
		cxt.fillText("正处于第 "+hard+"关",width/2,30);
		//绘制战机
	    drawPlane();
	    //绘制子弹
	    drawBullet();
	    //绘制敌机
	    drawe();
	    drawe1();
	    drawe2();
	    bulletAndE();
	    bulletAndE1();
	    planeAndEnemy();
//	    pass();
	    document.onkeydown=function(event){
		   var e=event||window.event;
		   planeMove(e.keyCode);				
	    }
	}	
}
//战机对象
var Plane=function(x,y,life){
	this.x=x;
	this.y=y;
	this.life=life;
	this.move=10;
}
//子弹对象
var Bullet=function(x,y,speedx,speedy){
	this.x=x;
	this.y=y;
	this.speedx=speedx;
	this.speedy=speedy;
	this.move=function(){
		this.y-=this.speedy;
		this.x-=this.speedx;
	}
}
//敌机对象
var Enemy=function(x,y,speedy,life){
	this.x=x;
	this.y=y;
	this.speedy=speedy;
	this.life=life;
	this.move=function(){
		this.y+=this.speedy;
	}
}
//添加图片
function addImage(url){
	var img=new Image();
	img.src=url;
	return img;
}
//简单的碰撞检测
//x1,y1代表被碰撞物体的起点坐标
//w,h代表被撞物体的宽高
//x2,y2代表撞击者的起点坐标
function hitTestPoint(x1,y1,w,h,x2,y2){
	if(x2>=x1&&x2<=x1+w&&y2>=y1&&y2<=y1+h){
		return true;
	}else{
		return false;
	}
}
//绘制背景
function drawBg(){
	if(hard==1){
		bg.src="img/Bg1.png";
		eImg2.src="img/enemy2.png";
	}else if(hard==2){
		bg.src="img/Bg2.png";
		eImg2.src="img/enemy3.png";
	}else if(hard==3){
		bg.src="img/bg3.png"
		eImg2.src="img/enemy4.png";
	}else{
		bg.src="img/beginBg.jpg";
	}
	cxt.drawImage(bg,0,0,width,bgHeight);
	cxt.drawImage(bg,0,bgHeight,width,height);
	bgHeight=bgHeight+0.3;
	if(bgHeight>height){
		bgHeight=0;
	}
}
//绘制战机
function drawPlane(){
	if(plane1!=null){
		cxt.drawImage(pImg1,plane1.x,plane1.y);
		//q 81 e69   w 87 a65 s83 d 68
		cxt.fillText("战机一：A D移动，W发射子弹",10,30);
		cxt.fillText("战机一",plane1.x+pImg1.width/2-20,plane1.y+pImg1.height+20);
		//剩余生命值
		cxt.save();
	    cxt.strokeStyle="blue";
	    cxt.lineWidth=4;
		cxt.beginPath();
		cxt.moveTo(plane1.x,plane1.y-5);
		cxt.lineTo(plane1.x+pImg1.width/200*plane1.life,plane1.y-5);
		cxt.stroke();
		cxt.closePath();
		cxt.restore();
		//失去的生命值
		cxt.save();
	    cxt.strokeStyle="red";
	    cxt.lineWidth=4;
		cxt.beginPath();
		cxt.moveTo(plane1.x+pImg1.width/200*plane1.life,plane1.y-5);
		cxt.lineTo(plane1.x+pImg1.width,plane1.y-5);
		cxt.stroke();
		cxt.closePath();
		cxt.restore();
	}
	if(plane2!=null){
		cxt.drawImage(pImg2,plane2.x,plane2.y);
		//i73 j 74 k 75 l 76 o 79 u 85
		cxt.fillText("战机二:J L移动,I发射子弹",10,70);
		cxt.fillText("战机二",plane2.x+pImg2.width/2-20,plane2.y+pImg2.height+20);
		//剩余生命值
		cxt.save();
	    cxt.strokeStyle="blue";
	    cxt.lineWidth=4;
		cxt.beginPath();
		cxt.moveTo(plane2.x,plane2.y-5);
		cxt.lineTo(plane2.x+pImg2.width/200*plane2.life,plane2.y-5);
		cxt.stroke();
		cxt.closePath();
		cxt.restore();
		//失去的生命值
		cxt.save();
	    cxt.strokeStyle="red";
	    cxt.lineWidth=4;
		cxt.beginPath();
		cxt.moveTo(plane2.x+pImg2.width/200*plane2.life,plane2.y-5);
		cxt.lineTo(plane2.x+pImg2.width,plane2.y-5);
		cxt.stroke();
		cxt.closePath();
		cxt.restore();
	}
}
//绘制子弹
function drawBullet(){
	for(var i=0;i<bullets.length;i++){
		bullets[i].move();
		if(bullets[i].y<-50){
			bullets.splice(i,1);
		}
		if(bullets[i].x<-50||bullets[i].x>width){
			bullets.splice(i,1);
		}
	}
	for(var i=0;i<bullets.length;i++){
		cxt.drawImage(BImg,bullets[i].x,bullets[i].y);
	}
}
//飞机移动
function planeMove(code){
	if(plane1!=null){
		switch(code){
//			//向上移动
//			case 87:
//			case 119:
//			    plane1.y-=plane1.move;
//			    if(plane1.y<=0){
//				    plane1.y=0;
//			    }
//			    break;
			//向左移动
			case 65:
			case 97:
			    plane1.x-=plane1.move;
			    if(plane1.x<=0){
			    	plane1.x=0;
			    }
			    break;
//			//向下移动
//			case 83:
//			case 115:
//			    plane1.y+=plane1.move;
//			    if(plane1.y>=height-pImg1.height){
//				    plane1.y=height-pImg1.height;
//			    }
//			    break;
			//向右移动
			case 68:
			case 100:
			    plane1.x+=plane1.move;
			    if(plane1.x>=width-pImg1.width){
			    	plane1.x=width-pImg1.width;
			    }
			    break;
//			case 81:
//			case 113:
            case 87:
            case 119:
			    var bullet1=new Bullet(plane1.x+pImg1.width*0.5-5,plane1.y-5,-2,4);
		        bullets.push(bullet1);
		        var bullet2=new Bullet(plane1.x+pImg1.width*0.5+5,plane1.y-5,0,4);
		        bullets.push(bullet2);
		        var bullet3=new Bullet(plane1.x+pImg1.width*0.5+5,plane1.y-5,2,4);
		        bullets.push(bullet3);
		        break;
		}
	}
    if(plane2!=null){
		switch(code){
//			//向上移动
//			case 73:
//			case 105:
//			    plane2.y-=plane2.move;
//			    if(plane2.y<=0){
//				    plane2.y=0;
//			    }
//			    break;
			//向左移动
			case 74:
			case 106:
			    plane2.x-=plane2.move;
			    if(plane2.x<=0){
			    	plane2.x=0;
			    }
			    break;
//			//向下移动
//			case 75:
//			case 107:
//			    plane2.y+=plane2.move;
//			    if(plane2.y>=height-pImg2.height){
//				    plane2.y=height-pImg2.height;
//			    }
//			    break;
			//向右移动
			case 76:
			case 108:
			    plane2.x+=plane2.move;
			    if(plane2.x>=width-pImg2.width){
			    	plane2.x=width-pImg2.width;
			    }
			    break;
//			case 79:
//			case 111:
            case 73:
			case 105:
			    var bullet1=new Bullet(plane2.x+pImg2.width*0.5-5,plane2.y-5,-2,4);
		        bullets.push(bullet1);
		        var bullet2=new Bullet(plane2.x+pImg2.width*0.5+5,plane2.y-5,0,4);
		        bullets.push(bullet2);
		        var bullet3=new Bullet(plane2.x+pImg2.width*0.5+5,plane2.y-5,2,4);
		        bullets.push(bullet3);
		        break;
		}
	}
}
//绘制敌机
function drawe(){
	    if(enemys.length<eLength){
	    	var x=Math.random()*(width-eImg.width);
	    	var enemy=new Enemy(x,-Math.random()*height*1.5,1.5,life);
	        enemys.push(enemy);
	    }   
	    for(var i=0;i<enemys.length;i++){
		    enemys[i].move();
			if(enemys[i].y>height){
				enemys.splice(i,1);
			}
			if(enemys[i]){
				cxt.drawImage(eImg,enemys[i].x,enemys[i].y);
			}
			
		}
}
//绘制中等敌机
function drawe1(){
	if(e11==null){
	           var x=Math.random()*(width-eImg1.width);
	    	   e11=new  Enemy(x,-Math.random()*height-300,0.8,life1);
	        }else{
	        	e11.move();
	        	cxt.drawImage(eImg1,e11.x,e11.y);
	        }		    
			if(e11.y>height){
				e11=null;
			}
	if(e12==null){
	           var x=Math.random()*(width-eImg1.width);
	    	   e12=new  Enemy(x,-Math.random()*height-300,0.8,life1);
	        }else{
	        	e12.move();
	        	cxt.drawImage(eImg1,e12.x,e12.y);
	        }		    
			if(e12.y>height){
				e12=null;
			}
}
//绘制敌机boss
function drawe2(){
	        if(boss==null){
	           var x=Math.random()*(width-eImg2.width);
	    	   boss=new  Enemy(x,-Math.random()*height-600,0.4,life2);
	        }else{
	        	boss.move();
	        	cxt.drawImage(eImg2,boss.x,boss.y);
	        }		    
			if(boss.y>height){
				boss=null;
			}
}
//敌机和子弹碰撞
function bulletAndE(){
	for(var i=0;i<enemys.length;i++){
		for(var j=0;j<bullets.length;j++){
		   	if(enemys[i]&&bullets[j]){
		   		var hit=hitTestPoint(enemys[i].x,enemys[i].y,eImg.width,eImg.height,bullets[j].x,bullets[j].y);
		   	    if(hit){
		   		enemys[i].life--;
		   		bullets.splice(i,1);
		   		    if(enemys[i].life<=0){
		   		       enemys.splice(i,1);
		   	        }
		   		    score+=100;
		   	   }  	
		   	}  	   	
		}
    }
}
//中等敌机   boss与子弹的碰撞检测
function bulletAndE1(){	
	for(var i=0;i<bullets.length;i++){
		    if(e11!=null&&bullets[i]){
		    	var hit1=hitTestPoint(e11.x,e11.y,eImg1.width,eImg1.height,bullets[i].x,bullets[i].y);
		   	    if(hit1){
		   		   e11.life--;
		   		   score+=300;
		   		   bullets.splice(i,1);
		   		   if(e11.life<=0){
		   		       e11=null;
		   	        }
		   	    }	  
		    }
		    if(e12!=null&&bullets[i]){
		    	var hit=hitTestPoint(e12.x,e12.y,eImg1.width,eImg1.height,bullets[i].x,bullets[i].y);
		   	    if(hit){
		   		   e12.life--;
		   		   score+=300;
		   		   bullets.splice(i,1);
		   		   if(e12.life<=0){
		   		      e12=null;
		   	        }
		   	    }	 
		    }
		    if(boss!=null&&bullets[i]){
		    	var hit=hitTestPoint(boss.x,boss.y,eImg2.width,eImg2.height,bullets[i].x,bullets[i].y);
		   	    if(hit){
		   		   boss.life--;
		   		   score+=600;
		   		   bullets.splice(i,1);
		   		   if(boss.life<=0){
		   		      boss=null;
		   		      hard++;
		   		      addDiff();
		   	        }
		   	    }	 
		    }	   
    }
}
//敌机和战机的碰撞检测
function planeAndEnemy(){
	//战机一的碰撞检测
	if(plane1!=null){
		for(var i=0;i<enemys.length;i++){
		    if(enemys[i]){
			    var hit1=hitTestPoint(plane1.x,plane1.y,pImg1.width,pImg1.height,enemys[i].x,enemys[i].y);
		        var hit2=hitTestPoint(plane1.x,plane1.y,pImg1.width,pImg1.height,enemys[i].x+eImg.width,enemys[i].y);
		        if(hit1||hit2){
		    	   plane1.life-=1;
		        }
		    }	   
	    }
		if(e11!=null){
		    var hit1=hitTestPoint(plane1.x,plane1.y,pImg1.width,pImg1.height,e11.x,e11.y);
		    var hit2=hitTestPoint(plane1.x,plane1.y,pImg1.width,pImg1.height,e11.x+eImg1.width,e11.y);
		    if(hit1||hit2){
			   plane1.life-=1;
		    }
	    }
		if(e12!=null){
		    var hit1=hitTestPoint(plane1.x,plane1.y,pImg1.width,pImg1.height,e12.x,e12.y);
		    var hit2=hitTestPoint(plane1.x,plane1.y,pImg1.width,pImg1.height,e12.x+eImg1,e12.y);
		    if(hit1||hit2){
			     plane1.life-=1;
		    }
	    }
		if(boss!=null){
		    var hit1=hitTestPoint(plane1.x,plane1.y,pImg1.width,pImg1.height,boss.x,boss.y);
		    var hit2=hitTestPoint(plane1.x,plane1.y,pImg1.width,pImg1.height,boss.x+eImg2.width,boss.y);
		    if(hit1||hit2){
			   plane1.life-=1;
		    }
	   }
		if(plane1.life<=0){
			plane1=null;
		}
	}
    //战机二的碰撞检测
	if(plane2!=null){
		for(var i=0;i<enemys.length;i++){
		    if(enemys[i]){
			    var hit1=hitTestPoint(plane2.x,plane2.y,pImg2.width,pImg2.height,enemys[i].x,enemys[i].y);
		        var hit2=hitTestPoint(plane2.x,plane2.y,pImg2.width,pImg2.height,enemys[i].x+eImg.width,enemys[i].y);
		        if(hit1||hit2){
		    	   plane2.life-=1;
		        }
		    }
		    
	    }
		if(e11!=null){
		    var hit1=hitTestPoint(plane2.x,plane2.y,pImg2.width,pImg2.height,e11.x,e11.y);
		    var hit2=hitTestPoint(plane2.x,plane2.y,pImg2.width,pImg2.height,e11.x+eImg1.width,e11.y);
		    if(hit1||hit2){
			   plane2.life-=1;
		    }
	    }
		if(e12!=null){
		    var hit1=hitTestPoint(plane2.x,plane2.y,pImg2.width,pImg2.height,e12.x,e12.y);
		    var hit2=hitTestPoint(plane2.x,plane2.y,pImg2.width,pImg2.height,e12.x+eImg1,e12.y);
		    if(hit1||hit2){
			     plane1.life-=1;
		    }
	    }
		if(boss!=null){
		    var hit1=hitTestPoint(plane2.x,plane2.y,pImg2.width,pImg2.height,boss.x,boss.y);
		    var hit2=hitTestPoint(plane2.x,plane2.y,pImg2.width,pImg2.height,boss.x+eImg2.width,boss.y);
		    if(hit1||hit2){
			   plane2.life-=1;
		    }
	   }
		if(plane2.life<=0){
			plane2=null;
		}
	}
}
////关卡
//function pass(){
//	if(score>=2000&&score<=4000){
//		hard=2;
//	}else if(score>4000){
//		hard=3;
//	}
//}
//增加游戏难度
function addDiff(){
		eLength+=5;
		life=life*2;
		life1=life1*2;
		life2=life2*2;
		if(e11!=null){
			e11.life*=2;
		}
		if(e12!=null){
			e12.life*=2;
		}
		if(boss!=null){
			boss.life*=2;
		}
}
//重新开始游戏
function restartGame(){
	window.location.reload();
}
function gameOver(){
	clearInterval(timer);
	cxt.clearRect(0,0,width,height);
	cxt.drawImage(bg,0,0,width,height);
	if(hard==4){
		cxt.fillText("您已通关",width/2-60,height/2-80);
	}	
	cxt.fillText("总得分："+score,width/2-60,height/2-40);
	var restart=document.getElementById("restart");
	restart.style.display="block";
}