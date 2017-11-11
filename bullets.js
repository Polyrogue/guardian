var Bullet = function(x,y)
{
  this.alive = true;
  
	this.x = x;
	this.y = y;
	this.origin = createVector(this.x,this.y);
	this.col = color(255);
	//this.spd = 50 + (40 * scrollSpd);
	this.spd = 30;
	this.r = 10;
	this.dir = player.dir
	
	this.col = 0;
	
	this.hb = 
	{
	  ox : this.x,
	  oy : this.y,
	  r : this.r*3,
	  v : 
	  [
	    {
	      x : this.x-this.r/2,
	      y : this.y-this.r/2
	    },
	    {
	      x : this.x+this.r/2,
	      y : this.y-this.r/2
	    },
	    {
	      x : this.x+this.r/2,
	      y : this.y+this.r/2
	    },
	    {
	      x : this.x-this.r/2,
	      y : this.y+this.r/2
	    }
	  ]
	}
	
	this.draw = function()
	{
	  if(this.alive)
	  {
  		if(this.col+10 < 100)
  		{
  			this.col += 10;
  		}
  		else
  		{
  			this.col = 0;
  		}
  		colorMode(HSB,100)
  		fill(this.col,100,100);
  		noStroke();
  		//ellipse(this.x,this.y,this.r,this.r);
  		rectMode(CENTER);
  		rect(this.x,this.y,this.r,this.r);
  		rectMode(CORNER);
  		strokeWeight(5);
  		stroke(this.col,100,100);
  		
  		if(dist(this.x,this.y,this.origin.x,this.origin.y) < 300)
  		{
  			line(this.x,this.y,this.origin.x,this.origin.y);
  		}
  		else
  		{
  			line(this.x,this.y,this.x+((this.dir*-1)*300),this.origin.y);
  		}
  		colorMode(RGB,255);
  		strokeWeight(1);
	  }
	}
	this.move = function()
	{
		this.x += this.spd*this.dir;
	}
	
	this.update = function()
	{
	  if(this.alive)
	  {
  	  //check if I should die
      if(dist(this.x,this.y,player.x,player.y) > 1.5*width  && this.alive)
      {
        //guess I'll die
        this.alive = false;
      }
  	  this.draw();
  	  this.move();
  	  
  	  //update polygon points
  	  this.hb.v[0].x = this.x-this.r/2,
  	  this.hb.v[0].y = this.y-this.r/2
  
  	  this.hb.v[1].x = this.x+this.r/2,
  	  this.hb.v[1].y = this.y-this.r/2
  
  	  this.hb.v[2].x = this.x+this.r/2,
  	  this.hb.v[2].y = this.y+this.r/2
  
  	  this.hb.v[3].x = this.x-this.r/2,
  	  this.hb.v[3].y = this.y+this.r/2
  	  
  	  this.hb.ox = this.x;
  	  this.hb.oy = this.y;
  	}
	}
}