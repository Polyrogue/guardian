Mutant = function(x,y)
{
  this.alive = true;
  
  this.x = x;
  this.y = y;
  
  this.cW = 8;
  this.cH = 20;
  
  this.rot = 0;
  this.toggleC = 0
  
  this.spd = 5;
  this.angle = 0
  
  this.cooldown = 4000;
  this.timeAtNextShot = millis() + this.cooldown;
  
  this.hb = 
  {
    ox : this.x,
    oy : this.y,
    r : 100,
    v : 
    [
      {
        x : this.x-25,
        y : this.y-25
      },
      {
        x : this.x+25,
        y : this.y-25
      },
      {
        x : this.x+25,
        y : this.y+25
      },
      {
        x : this.x-25,
        y : this.y+25
      }
    ]
  };

  this.draw = function()
  {
    if(this.alive)
    {
      rectMode(CENTER)
      if(this.rot >= 355)
      {
        this.rot = 0;
      }
      else
      {
        this.rot += 5;
      }
      
      angleMode(DEGREES);
      if(this.toggleC == 0)
      {
        this.toggleC = fill(150,0,150);
        this.toggleC = 1;
      }
      else
      {
        this.toggleC = fill(180,0,185);
        this.toggleC = 0;
      }
      translate(this.x,this.y);
      rotate(this.rot);
      rect(0,0,50,50);
      rotate(-this.rot);
      translate(-this.x,-this.y);
      angleMode(RADIANS);
      
      fill(255);
      noStroke();
      rect(this.x,this.y,this.cW,this.cH);
      fill(255,0,0);
      rect(this.x,this.y-this.cH/2,this.cW,this.cW);
      rectMode(CORNER);
    }
  }
  
  this.move = function()
  {
      if(dist(this.x,this.y,player.x,player.y) >= 200)
      {
        this.angle = Math.atan2(player.y-this.y,player.x-this.x);
        this.x += this.spd*cos(this.angle);
        this.y += this.spd*sin(this.angle);
        this.x += -200*scrollSpd;
      }
  }
  
  this.update = function()
  {
    if(millis() >= this.timeAtNextShot && this.alive)
    {
      sndMutantS.play();
      this.timeAtNextShot += this.cooldown;
      mutantBullets.push(new MutantBullet(this.x,this.y));
    }
    
    this.hb.v[0].x = this.x-25;
    this.hb.v[0].y = this.y-25;
    
    this.hb.v[1].x = this.x+25;
    this.hb.v[1].y = this.y-25;
    
    this.hb.v[2].x = this.x+25;
    this.hb.v[2].y = this.y+25;
    
    this.hb.v[3].x = this.x-25;
    this.hb.v[3].y = this.y+25;
    
    this.move();
    this.draw();
    
    //x′=xcosθ−ysinθ
    //y′=ycosθ+xsinθ
    
    /*
    this.hb.v[0].x = (this.x-50)*cos(this.rot)-(this.y-50)*sin(this.rot);
    this.hb.v[0].y = (this.y-50)*cos(this.rot)+(this.x-50)*sin(this.rot);
    
    this.hb.v[1].x = (this.x+50)*cos(this.rot)-(this.y-50)*sin(this.rot);
    this.hb.v[1].y = (this.y-50)*cos(this.rot)+(this.x+50)*sin(this.rot);
    
    this.hb.v[2].x = (this.x+50)*cos(this.rot)-(this.y+50)*sin(this.rot);
    this.hb.v[2].y = (this.y+50)*cos(this.rot)+(this.x+50)*sin(this.rot);
    
    this.hb.v[3].x = (this.x-50)*cos(this.rot)-(this.y-50)*sin(this.rot);
    this.hb.v[3].y = (this.y+50)*cos(this.rot)+(this.x-50)*sin(this.rot);
    */
  }
  
}