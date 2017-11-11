var Colonist = function(x,y)
{
  this.alive = true;
  
  this.x = x;
  this.y = y;
  
  this.h = 20;
  this.w = 8;
  
  //abduction stuff
  this.targeted = false;
  this.abducted = false;
  this.abductor = -1; //the index of the lander abducting
  
  this.targetReached = false;
  this.target = createVector(this.x+floor(random(-50,50)),this.y+floor(random(-5,5)));
  
  //Timing variables
  this.interval = 500;
  this.millisecond = millis();
  this.timeAtNextStep = millis() + this.interval;
  
  this.afkTimer = 0 //to despawn colonist if its outside of the view for too long.
  
  this.hb = 
  {
    r : 50,
    v : 
    [
     {
       x : this.x-this.w/2,
       y : this.y-this.h/2
     },
     {
       x : this.x+this.w/2,
       y : this.y-this.h/2
     },
     {
       x : this.x+this.w/2,
       y : this.y+this.h/2
     },
     {
       x : this.x-this.w/2,
       y : this.y+this.h/2
     }
    ]
  }
  
  
  this.draw = function()
  {
    if(this.alive)
    {
      //draw target
      //stroke(255)
      //strokeWeight(3)
      //draws the target
      //point(this.target.x,this.target.y);
      //noStroke();
    
      rectMode(CENTER)
      fill(255);
      noStroke();
      rect(this.x,this.y,this.w,this.h);
      fill(255,0,0)
      rect(this.x,this.y-this.h/2,this.w,this.w)
      
      this.millisecond = millis();
      if(this.millisecond >= this.timeAtNextStep)
      {
        this.timeAtNextStep = this.millisecond + this.interval;
        this.step();
      }
    }
  }
  
  this.move = function()
  {
    if(!this.abducted)
    {
      this.x += -200*scrollSpd;
    }
    else
    {
      if(this.y < height-80)
      {
        this.y += 100;  
      }
      this.target.x += -200*scrollSpd;
    }
  }
  
  this.step = function()
  {
    if(!this.abducted)
    {
      if(this.targetReached)
      {
        this.target.x = this.x + random(-100,100);
        
        this.target.y = this.y + random(-5,5)
        while(this.target.y < height-80 || this.target.y > height)
        {
            this.target.x = this.x + random(-100,100)
        }
        this.targetReached = false
      }
      else
      {
        if(dist(this.x,this.y,this.target.x,this.target.y) < 10)
        {
          this.targetReached = true;  
        }
        else
        {
          //step towards the target:
          if(this.x < this.target.x)
          {
            this.x += 1; 
          }
          else
          {
            this.x -= 1;
          }
           
          if(this.y < this.target.y)
          {
            this.y += 1; 
          }
          else
          {
            this.y -= 1;
          }
        }
      }
    }
    else
    {
      if(landers[this.abductor] != null)
      {
        this.x = landers[this.abductor].x;
        this.y = landers[this.abductor].y+30;
      }
    }
  };
  
  this.checkAfk = function()
  {
    if(this.x < 0 || this.x > width)
    {
      this.afkTimer += 1;
    }
    else
    {
      this.afkTimer = 0;
    }
    if(this.afkTimer >= 300)
    {
      this.alive = false;
    }
  }
  
  this.update = function()
  {
     this.checkAfk()
    if(dist(this.x,this.y,player.x,player.y) > width*2)
    {
      this.alive = false;
    }
    else
    {
      this.draw();
      this.move();
      this.step();
      
      this.hb.v[0].x = this.x-this.w/2;
      this.hb.v[0].y = this.y-this.h/2;
      
      this.hb.v[1].x = this.x+this.w/2;
      this.hb.v[1].y = this.y-this.h/2;
      
      this.hb.v[2].x = this.x+this.w/2;
      this.hb.v[2].y = this.y+this.h/2;
      
      this.hb.v[3].y = this.x-this.w/2,
      this.hb.v[3].y = this.y+this.h/2
      
    }
  };
};
