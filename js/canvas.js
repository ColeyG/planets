(function(){
// This is all you need for a given canvas element
var canvas = document.getElementById('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var c = canvas.getContext('2d');

//sprites
var earth=document.getElementById('earth');
var moon=document.getElementById('moon');
var star=document.getElementById('star');
var asteroid=document.getElementById('asteroid');
var ship=document.getElementById('ship');

//balancing
//controls refire rate. May be between 1 and 99
let fireRate=7;
//sets whether or not the walls bounce the player back. False will bounce the player back.
let bounce=true;

//controls
var w=false;
var s=false;
var a=false;
var d=false;
var shoot=false;
var fired=false;
var fireDelay=0;
var shotArray=[];

//sprite sizing
var earthSize=window.innerWidth/6;
var moonSize=window.innerWidth/18;
var radius=window.innerWidth/6;
var asteroidSizeH=window.innerWidth/128;
var shipSizeW=window.innerWidth/64;
var shipSizeH=shipSizeW*1.75608756098;
var angle=0;
var moonRot=0;

//asteroids
var ax=Math.random()*innerWidth;
var ay=Math.random()*innerHeight;
var adx=Math.random()*10-5;
var ady=Math.random()*10-5;
var astDeg=0;

//ship
var sx=innerWidth/2-shipSizeW/2;
var sy=innerHeight/2-shipSizeH/2-earthSize/2-20;
var shipSpeedX=0;
var shipSpeedY=0;

//stars
var starAmount=1000;
var starArray=[];
function Star(x,y){
  this.x=x;
  this.y=y;
  this.update=function(){
    c.drawImage(star,x,y,10,10);
  }
}
function newStar(){
  var x = Math.random()*1910;
  var y = Math.random()*1070;
  starArray.push(new Star(x,y));
}
for(var i=0;i<starAmount;i++){
  newStar();
}

//Rotate around center function
function drawImageRot(img,x,y,width,height,deg){
  var rad = deg * Math.PI / 180;
  c.translate(x + width / 2, y + height / 2);
  c.rotate(rad);   
  c.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);
  c.rotate(rad * ( -1 ) );
  c.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

//Find ship rotation function
function shipRot(){
  var shypotenuse = (shipSpeedX*shipSpeedX)+(shipSpeedY*shipSpeedY);
  var shypotenuse=Math.sqrt(shypotenuse);
  var shangle=0;
  if(shipSpeedX>0&&shipSpeedY<=0){
    var shangle=Math.tan(shipSpeedX/shypotenuse)* (180 / Math.PI);
  }
  if(shipSpeedX<0&&shipSpeedY<=0){
    var shangle=Math.tan(shipSpeedX/shypotenuse)* (180 / Math.PI);
  }
  if(shipSpeedX<0&&shipSpeedY>=0){
    var shangle=Math.tan(shipSpeedX*(-1)/shypotenuse)* (180 / Math.PI);
    shangle=shangle+180;
  }
  if(shipSpeedX>0&&shipSpeedY>=0){
    var shangle=Math.tan(shipSpeedX*(-1)/shypotenuse)* (180 / Math.PI);
    shangle=shangle+180;
  }
  if(shipSpeedX==0&&shipSpeedY>0){
    shangle=180;
  }
  if(shangle<0){
    let offset=shangle*(-1)
    shangle=360-offset;
  }
  return shangle;
}

function Shot(x,y,ssx,ssy,radius){
  this.x=x;
  this.y=y;
  this.ssx=ssx;
  this.ssy=ssy;
  this.radius=radius;
  this.life=1;
  this.alive=true;
  this.draw=function(){
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle="rgba(255,255,0,"+this.life+")";
    c.fill();
    c.beginPath();
    c.arc(this.x,this.y,this.radius-this.radius/3,0,Math.PI*2,false);
    c.fillStyle="rgba(255,255,204,:"+this.life+")";
    c.fill();
    //console.log(this.x,this.y);
  }
  this.update=function(){
    this.x+=this.ssx;
    this.y+=this.ssy;
    this.life=this.life-.01;
    if(this.life<0){this.alive=false;}
    if(this.alive){this.draw();}
  }
};

//controls the fire function
function fire(){
  if(fired==false){
    //console.log('shot');
    fired=true;
    //This calls the sound fx
    //scopeShot.play();
    let shotSound = new Audio('sounds/fire.wav');
    shotSound.volume=0.1;
    shotSound.play();

    let shotAngle=shipRot();
    let shotX=shipSpeedX/((Math.abs(shipSpeedX)+Math.abs(shipSpeedY)))*10;
    let shotY=shipSpeedY/((Math.abs(shipSpeedX)+Math.abs(shipSpeedY)))*10;

    if(isNaN(shotX)||isNaN(shotY)){shotX=0;shotY=0;}

    shotArray.push(new Shot(sx+shipSizeW/2,sy+shipSizeH/2,shipSpeedX+shotX,shipSpeedY+shotY,innerWidth/500));
  }
  if(fireDelay>fireRate){fired=false;fireDelay=0;}
}

//controls the burstfire and the amount of time between shots
function refire(){
  if(fireDelay<100){fireDelay++;}
}

function animate(){
  requestAnimationFrame(animate);
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  c.fillStyle="rgb(10,42,94)";
  c.fillRect(0,0,innerWidth,innerHeight);
  //stars
  for(var i=0;i<starArray.length;i++){
    starArray[i].update();
  }
  //earth
  c.drawImage(earth,innerWidth/2-earthSize/2,innerHeight/2-earthSize/2,earthSize,earthSize);
  //moon
  drawImageRot(moon,innerWidth/2-moonSize+Math.cos(angle)*radius,innerHeight/2-moonSize/2+Math.sin(angle)*radius,moonSize,moonSize,moonRot);
  angle=angle+.01;
  moonRot=moonRot+.6;
  //asteroid
  drawImageRot(asteroid,ax,ay,asteroidSizeH*1.1484375,asteroidSizeH,astDeg);
  astDeg--;
  ax=ax+adx;
  ay=ay+ady;
  if (ax>innerWidth+asteroidSizeH+5){ax=0-asteroidSizeH;}
  if (ax<0-asteroidSizeH-5){ax=innerWidth+asteroidSizeH;}
  if (ay>innerHeight+asteroidSizeH+5){ay=0-asteroidSizeH;}
  if (ay<0-asteroidSizeH-5){ay=innerHeight+asteroidSizeH;}
  //ship
  drawImageRot(ship,sx,sy,shipSizeW,shipSizeH,shipRot());
  sx=sx+shipSpeedX;
  sy=sy+shipSpeedY;
  if(!bounce){
    if(sy<0-shipSizeH/2){sy=innerHeight-shipSizeH}
    if(sy>innerHeight-shipSizeH/2){sy=0}
    if(sx<0-shipSizeH/2){sx=innerWidth-shipSizeH/2}
    if(sx>innerWidth){sx=0}
  }else{
    if(sy<0-shipSizeH/2){
      shipSpeedY=(shipSpeedY*-1);
      sy=sy+shipSpeedY;
      shipSpeedY=shipSpeedY*.5;
    }
    if(sy>innerHeight-shipSizeH/2){
      shipSpeedY=(shipSpeedY*-1);
      sy=sy+shipSpeedY;
      shipSpeedY=shipSpeedY*.5;
    }
    if(sx<0-shipSizeH/2){
      shipSpeedX=(shipSpeedX*-1);
      sx=sx+shipSpeedX;
      shipSpeedX=shipSpeedX*.5;
    }
    if(sx>innerWidth){
      shipSpeedX=(shipSpeedX*-1);
      sx=sx+shipSpeedX;
      shipSpeedX=shipSpeedX*.5;
    }
  }
  
  //firing
  if(shoot==true){fire();}
  refire();
  //ship controls
  if (w==true){shipSpeedY=shipSpeedY-.1;}
  if (s==true){shipSpeedY=shipSpeedY+.1;}
  if (a==true){shipSpeedX=shipSpeedX-.1;}
  if (d==true){shipSpeedX=shipSpeedX+.1;}
  //updates for resize
  earthSize=window.innerWidth/6;
  moonSize=window.innerWidth/18;
  radius=window.innerWidth/6;
  asteroidSizeH=window.innerWidth/128;
  shipSizeW=window.innerWidth/64;
  shipSizeH=shipSizeW*1.75608756098;
    //begin shot clock
    for(var i=0;i<shotArray.length;i++){
      shotArray[i].update();
    }
    //end shot clock
}

document.addEventListener("keydown", function(event) {
  //console.log(event.which);
  if(event.which==86){shoot=true;}
  if(event.which==87){w=true;}
  if(event.which==83){s=true;}
  if(event.which==65){a=true;}
  if(event.which==68){d=true;}
});
document.addEventListener("keyup", function(event) {
  //console.log('stop');
  if(event.which==86){shoot=false;}
  if(event.which==87){w=false;}
  if(event.which==83){s=false;}
  if(event.which==65){a=false;}
  if(event.which==68){d=false;}
});

animate();
})();
