var Ship = function()
{
  this.alive = true;
  
	this.xLim = 300;
	this.x = this.xLim;
	this.y = height/2;
	this.w = 40;
	this.h = 15;
	this.dir = 1;
	this.spd = scrollSpd;
	this.moving = false
	this.yVel = 0
	this.termVel = 16;
	this.invuln = false;
	//For collision detection.
  this.hb = 
  {
    ox: this.x,
    oy : this.y,
    r : 50,
    v : [
          {
            x: this.x-this.w,
            y: this.y-this.h
          },
          {
            x: this.x-this.w,
            y: this.y+this.h
          },
          {
            x: this.x+this.w,
            y: this.y+this.h
          }
        ]
  }
	
	this.draw = function()
	{
	  if(this.alive)
	  {
	    this.hb.ox = this.x;
	    this.hb.oy = this.y;
  		noStroke();
  		if(this.dir == 1)
  		{
  		  if(this.invuln)
  		  {
  		    fill(255)
  		  }
  		  else
  		  {
  			  fill(200,0,150);
  		  }
  			triangle(this.x-this.w,this.y-this.h,this.x-this.w,this.y+this.h,this.x+this.w,this.y+this.h)
  			fill(0,0,255);
  			triangle(this.x-this.w/2,this.y-8,this.x+this.w/3,this.y+5,this.x-this.w/2,this.y+5)
  			if(this.moving)
  			{
  				fill(255);
  				triangle(this.x-this.w,this.y-this.h/2,this.x-this.w*1.5,this.y,this.x-this.w,this.y+this.h/2)
  			}
  			this.hb.v[0].x = this.x-this.w;
  			this.hb.v[0].y = this.y-this.h;
  			
  			this.hb.v[1].x = this.x-this.w;
  			this.hb.v[1].y = this.y+this.h;
  			
  			this.hb.v[2].x = this.x+this.w;
  			this.hb.v[2].y = this.y+this.h;
  		}
  		else
  		{
  		  if(this.invuln)
  		  {
  		    fill(255)
  		  }
  		  else
  		  {
  			  fill(200,0,150);
  		  }
  			triangle(this.x+this.w,this.y-this.h,this.x+this.w,this.y+this.h,this.x-this.w,this.y+this.h)
  			fill(0,0,255);
  			triangle(this.x+this.w/2,this.y-8,this.x-this.w/3,this.y+5,this.x+this.w/2,this.y+5)
  			if(this.moving)
  			{
  				fill(255);
  				triangle(this.x+this.w,this.y-this.h/2,this.x+this.w*1.5,this.y,this.x+this.w,this.y+this.h/2)
  			}
  			this.hb.v[0].x = this.x+this.w;
  			this.hb.v[0].y = this.y-this.h;
  			
  			this.hb.v[1].x = this.x+this.w;
  			this.hb.v[1].y = this.y+this.h;
  			
  			this.hb.v[2].x = this.x-this.w;
  			this.hb.v[2].y = this.y+this.h;
  		}
	  }
	}
	
	this.move = function()
	{
	  if(this.alive)
	  {
  		this.spd = 200*abs(scrollSpd) + 13;
  		
  		if(moveRight)
  		{
  			this.moving = true;
  			if(this.x > this.xLim)
  			{
  				this.dir = 1;
  				this.x -= this.spd;
  			}
  		}
  		else
  		{
  			if(moveLeft)
  			{
  				this.moving = true
  				if(this.x < width-this.xLim)
  				{
  					this.dir = -1;
  					this.x += this.spd
  				}
  			}
  			else
  			{
  				this.moving = false;
  			}
  		}
  		
  		if(moveUp)
  		{
  			this.yVel -= 5;
  		}
  		else if(this.yVel < 0)
  		{
  			this.yVel = this.yVel/1.5;
  		}
  		if(this.yVel < -this.termVel)
  		{
  			this.yVel = -this.termVel
  		}
  		
  		if(moveDown)
  		{
  			this.yVel += 5;
  		}
  		else if(this.yVel > 0)
  		{
  			this.yVel = this.yVel/1.5;
  		}
  		if(this.yVel > this.termVel)
  		{
  			this.yVel = this.termVel
  		}
  		
  		this.y += this.yVel
  		if(this.y > height-100)
  		{
  			this.y = height-100;
  		}
  		if(this.y < 100+(this.h*2))
  		{
  			this.y = 100+(this.h*2)
  		}
	  }
	}
	
	this.kill = function()
	{
	  if(this.alive)
	  {
	    sndDeath.play();
	    if(lives > 0)
	    {
	      explosions.push(new Explosion(this.x,this.y,50,color(255)));
	      scrollSpd = 0;
	      this.alive = false;
	      lives -= 1;
	      this.invuln = true;
	      setTimeout(function()
	      {
	        player.x = player.xLim;
	        player.y = height/2;
	        player.alive = true;
	        setTimeout(function()
	        {
	          player.invuln = false;
	        },2000);
	      },2000);
	    }
	    else
	    {
	      GM.playText = "LOADING...";
	      bgm.stop();
	      sndStop.play();
	      player.alive = true
	      lives = 3
	      console.log("Going to game oveer screen!")
	      gameState = 2;
	    }
	  };
	}
}

//Movement. It is cleaner to do this outside as most of the movement is actually moving the world rather than the ship.  
function keyPressed()
{
  switch(keyCode)
  {
    case ENTER:
      if(gameState == 0 && readyToPlay)
      {
        startStars = random(10,25)
        for(i = 0; i < startStars; i++)
        {
          stars.push(new Star(random(0,width)));
        }
        level = 1;
        readyToPlay = false;
        sndStart.play();
        GM.reset();
        player.alive = true;
        gameState = 1;
        bgm.loop();
        setInterval(function()
        {
          if(scrollSpd != 0)
          {
            if(player.dir == 1)
            {
              stars.push(new Star(width+50));
            }
            else
            {
              stars.push(new Star(-50));
            }
          }
        },200)
      }
      break;
    case 90:
      if(gameState == 1 && player.alive)
      {
        sndShot.play();
  		  bullets.push(new Bullet(player.x+((player.w)*player.dir),player.y+(player.h-3)));
      }
    	break;
  	case LEFT_ARROW:
  	  if(gameState == 1 && player.alive)
  	  {
        moveLeft = true;
  	  }
      break;
    case RIGHT_ARROW:
      if(gameState == 1 && player.alive)
      {
        moveRight = true;
      }
  		break;
    case UP_ARROW:
      if(gameState == 1 && player.alive)
      {
    	  moveUp = true;
      }
      break;
  	case DOWN_ARROW:
  	  if(gameState == 1 && player.alive)
  	  {
  		  moveDown = true;
  	  }
  		break;
  }
  return false;
}
  
function keyReleased()
{
  if(keyCode == LEFT_ARROW)
  {
  	moveLeft = false;
  }
  if(keyCode == RIGHT_ARROW)
  {
  	moveRight = false;
  }
  if(keyCode == UP_ARROW)
  {
  	moveUp = false;
  }
  if(keyCode == DOWN_ARROW)
  {
  	moveDown = false;
  }
}
