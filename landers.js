var Lander = function(x,y)
{
  this.id = -1
  this.alive = true;
  
  this.x = x;
  this.y = y; 
  
  this.w = 45;
  this.h = 30;
  
  //0 = wander 1 = kidnap 2 = carry off
  this.state = 0;
  
  if (this.x > player.x)
  {
    this.dir = -1;
  }
  else
  {
    this.dir = 1;
  }
  this.spd = 5;
  this.visionDist = 400; //the radius the lander can "see" the player in order to try and shoot at him.
  this.shooting = false;
  this.cooldown = 1000;
  this.timeAtNextShot = millis() + this.cooldown;
  
  this.angle = 0 //angle between the lander and the next colonist they will abduct
  this.target = -1 //the index of the next colonist they will abduct
  this.mutantSpawned = false
  
  this.hb = 
  {
    ox : this.x,
    oy : this.y,
    r : 55,
    v : 
    [
      {
        x : this.x-this.w,
        y : this.y-this.h
      },
      {
        x : this.x+this.w,
        y : this.y-this.h
      },
      {
        x : this.x+this.w,
        y : this.y+this.h
      },
      {
        x : this.x-this.w,
        y : this.y+this.h
      }
    ]
  };
  
  //this.c = color(255,0,0,0); //for debugging
  
  this.draw = function()
  { 
    if(this.alive)
    {
      //ellipse(this.x,this.y,this.hb.r,this.hb.r);
      
      rectMode(CENTER);
      noStroke();
      fill(0,255,0);
      rect(this.x,this.y,this.w,this.h);
      stroke(1);
      rectMode(CORNER);
  
      stroke(0,255,0);
      line(this.x,this.y,this.x-this.w/2,this.y+this.h);
      line(this.x,this.y,this.x+this.w/2,this.y+this.h);
      line(this.x,this.y,this.x,this.y+this.h);
      
      noStroke();
      fill(0);
      rectMode(CENTER);
      rect(this.x-this.w/3,this.y,10,10);
      rect(this.x+this.w/3,this.y,10,10);
      rectMode(CORNER);
    }
  }
  
  this.move = function()
  {
    this.x += -200*scrollSpd;
    if(this.y > height-120 && this.state == 0)
    {
      this.y = height-120;
    }
  }
  
  this.wander = function()
  {
      this.x += this.spd * this.dir;
      this.y += 10*cos((this.x/50)-(200*scrollSpd));
  }
  
  this.abduct = function()
  {
    //check to see if the colonist is still alive, else go back to wandering.
    if(colonists[this.target].alive)
    {
      //check to see if we have reached the colonist
      if(dist(this.x,this.y,colonists[this.target].x,colonists[this.target].y) < 20)
      {
        colonists[this.target].abducted = true;
        
        //find my place in the array and tell the colonist where I am
        for(i = 0; i < landers.length; i++)
        {
          colonists[this.target].abductor = this.id;
        }
        this.state = 2;
      }
      else //move towards the colonist
      {
        this.angle = Math.atan2(colonists[this.target].y-this.y,colonists[this.target].x-this.x);
        this.x += this.spd*cos(this.angle);
        this.y += this.spd*sin(this.angle);
      }
    }
    else
    {
      this.state = 0;
    }
  }
  
  this.flee = function()
  {
    if(colonists[this.target].alive)
    if(this.y > 0)
    {
      this.y -= this.spd;
    }
    else
    {
      if(!this.mutantSpawned)
      {
        this.mutantSpawned = true;
        mutants.push(new Mutant(this.x,this.y));
        colonists[this.target].alive = false;
      }
      this.alive = false;
    }
    else
    {
      this.state = 0;
    }
  }
  
  this.update = function()
  {
    switch(this.state)
    {
      case 0:
        this.wander();
        break;
      case 1:
        this.abduct();
        break;
      case 2:
        this.flee();
        break;
    }
    this.move();
    this.draw();
    if(millis() >= this.timeAtNextShot)
    {
      //console.log(this.state);
      this.timeAtNextShot += this.cooldown;
      //Check if I should fire
      if(this.visionDist > dist(player.x,player.y,this.x,this.y) && this.alive)
      {
        sndLanderS.play();
        landerBullets.push(new LanderBullet(this.x,this.y,player.x,player.y));
      }
      //Also use this timer to check if there's any nearby Colonists to abduct
      for(i = 0; i < colonists.length; i++)
      {
        if(dist(colonists[i].x,colonists[i].y,this.x,this.y) < height-this.y && !colonists[i].targeted && this.state == 0)
        {
          this.target = i;
          break;
        }
      }
      if(this.target >= 0 && this.state == 0)
      {
        //Execute the order to begin abduction.
        colonists[this.target].targeted = true;
        this.state = 1;
      }
    }
    //update polygon points
    this.hb.v[0].x = this.x-this.w;
    this.hb.v[0].y = this.y-this.h;
    
    this.hb.v[1].x = this.x+this.w;
    this.hb.v[1].y = this.y-this.h;
    
    this.hb.v[2].x = this.x+this.w;
    this.hb.v[2].y = this.y+this.h
    
    this.hb.v[3].x = this.x-this.w;
    this.hb.v[3].y = this.y+this.h;
    
    this.hb.ox = this.x;
	  this.hb.oy = this.y;
  }
}
  /*
  if(dist(this.x,this.y,player.x,player.y) < this.visionDist)
  {
    if(!this.shooting)
    {
      this.shooting = true;
      self = this;
      console.log("Self is" + self);
      firingID = setInterval(function()
      {
        console.log("("+self.x+","+self.y+")");
        landerBullets.push(new LanderBullet(self.x,self.y,player.x,player.y));
      },100);
    }
  }
  else
  {
    if(this.shooting)
    {
      this.shooting = false;
      clearInterval(firingID)
    }
  }
  */
