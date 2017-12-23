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

//controls
var w=false;
var s=false;
var a=false;
var d=false;

//sprite sizing
var earthSize=window.innerWidth/6;
var moonSize=window.innerWidth/18;
var radius=window.innerWidth/6;
var asteroidSizeH=window.innerWidth/128;
var shipSizeW=window.innerWidth/64;
var shipSizeH=shipSizeW*1.75608756098;
var angle=0;

//asteroids
var ax=Math.random()*innerWidth;
var ay=Math.random()*innerHeight;
var adx=Math.random()*10-5;
var ady=Math.random()*10-5;

//ship
var sx=innerWidth/2-shipSizeW/2;
var sy=innerHeight/2-shipSizeH/2;
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
  c.drawImage(moon,innerWidth/2-moonSize/2+Math.cos(angle)*radius,innerHeight/2-moonSize/2+Math.sin(angle)*radius,moonSize,moonSize);
  angle=angle+.01;
  //asteroid
  c.drawImage(asteroid,ax,ay,asteroidSizeH*1.1484375,asteroidSizeH);
  ax=ax+adx;
  ay=ay+ady;
  if (ax>innerWidth+asteroidSizeH+5){ax=0-asteroidSizeH;}
  if (ax<0-asteroidSizeH-5){ax=innerWidth+asteroidSizeH;}
  if (ay>innerHeight+asteroidSizeH+5){ay=0-asteroidSizeH;}
  if (ay<0-asteroidSizeH-5){ay=innerHeight+asteroidSizeH;}
  //ship
  c.drawImage(ship,sx,sy,shipSizeW,shipSizeH);
  sx=sx+shipSpeedX;
  sy=sy+shipSpeedY;
  if (sy<0-shipSizeH){sy=innerHeight+shipSizeH;}
  if (sy>innerHeight+shipSizeH){sy=0-shipSizeH;}
  if (sx<0-shipSizeH){sx=innerWidth+shipSizeH;}
  if (sx>innerWidth+shipSizeH){sx=0-shipSizeH}
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
  console.log(event.which);
  if(event.which==87){w=true;}
  if(event.which==83){s=true;}
  if(event.which==65){a=true;}
  if(event.which==68){d=true;}
});
document.addEventListener("keyup", function(event) {
  console.log('stop');
  if(event.which==87){w=false;}
  if(event.which==83){s=false;}
  if(event.which==65){a=false;}
  if(event.which==68){d=false;}
});

animate();
})();
