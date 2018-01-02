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

//sounds
var scopeShot=document.getElementById('fireSounds');
scopeShot.volume = 0.2; 

//controls
var w=false;
var s=false;
var a=false;
var d=false;
var shoot=false;
var fired=false;
var fireDelay=0;

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
  //SEND IFS TO CHECK QUADRANT
  return shangle;
}

//controls the fire function
function fire(){
  if(fired==false){
    //console.log('shot');
    fired=true;
    scopeShot.play();
  }
  if(fireDelay>15){fired=false;fireDelay=0;}
}

//controls the burstfire and the amount of time between shots
function refire(){
  if(fireDelay<100){fireDelay++;}
  //console.log(fireDelay);
}

function animate(){
  requestAnimationFrame(animate);
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
  if (sy<0-shipSizeH){sy=innerHeight+shipSizeH;}
  if (sy>innerHeight+shipSizeH){sy=0-shipSizeH;}
  if (sx<0-shipSizeH){sx=innerWidth+shipSizeH;}
  if (sx>innerWidth+shipSizeH){sx=0-shipSizeH}
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
