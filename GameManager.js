GameManager = function()
{
  this.spawningColonist = false;
  this.spawningLander = false;
  this.maxSpawnTime = 4000
  this.playText = "PRESS [ENTER] TO PLAY";
  this.headerCol = color(255);
  this.playCol = 0;
  this.terrainCol = color(255,69,0);

  this.drawTerrain = function()
  {
    stroke(255);
    //noFill();
    fill(3,3,3);
    translate(0,500);
    beginShape();
    var xoff = start;
    for (var x = 0; x < width; x++) {
      stroke(this.terrainCol);
      var y = noise(xoff) * (height-500);
      vertex(x, y);
  
      xoff += inc;
    }
    vertex(width,height);
    vertex(0,height);
    endShape();
    translate(0,-500)
    start += scrollSpd;
  }
  
  this.drawGUI = function()
  {
    fill(0)
  	noStroke();
  	rectMode(CORNER);
  	rect(0,0,width,100);
  	stroke(0,0,255)
  	line(0,100,width,100);
  	//text(frameRate(),10,10,100,50)
  	fill(255);
  	textSize(18)
  	textAlign(LEFT);
  	text("LIVES: " + lives,10,75);
  	textAlign(RIGHT);
  	text("SCORE: " + score,width-10,75);
  	fill(0,80,255)
  	textAlign(CENTER);
  	textSize(14);
  	text("(C) 2017 TAHA NASIR   GUARDIAN (C) 1981 NASIR ELECTRONICS",width/2,20);
  	textSize(18);
  	fill(255);
  	text("ALIENS LEFT: " + aliensLeft,width/2,75);
  }
  
  
  //To make the terrain and other objects scroll to make it look like the player is travelling left and right
  this.checkControls = function()
  {
  	if(moveRight && player.alive)
  	{
  		if(scrollSpd >= 0)
  		{
  			scrollSpd += 0.02;
  		}
  		else
  		{
  			scrollSpd += 0.01;
  		}
  	}
  	else
  	{
  		if(moveLeft && player.alive)
  		{
  			dir = -1;
  			if(scrollSpd <= 0)
  			{
  				scrollSpd -= 0.02;
  			}
  			else
  			{
  				scrollSpd -= 0.008;
  			}
  		}
  		else
  		{
  		scrollSpd = scrollSpd/1.1;
  		}
  	}
  	if(scrollSpd > 0.1)
  	{
  		scrollSpd = 0.1;
  	}
  	if(scrollSpd < -0.1)
  	{
  		scrollSpd = -0.1;
  	}
  }
  
  this.updateSpawns = function()
  {
    //colonists spawning
    if(!GM.spawningColonist)
    {
      GM.spawningColonist = true;
      setTimeout(function()
      {
        GM.spawningColonist = false;
        if(floor(level/1.5 * 10) < 10)
        {
          lim = floor(level/1.5 * 10)
        }
        else
        {
          lim = 10;
        }
        if(colonists.length < 3*lim)
        {
          colonists.push(new Colonist(width/2+(width*player.dir),height-40));
        }
        //console.log("boop")
      },random(200,2000/(100*Math.abs(scrollSpd))));
    }
    
    //landers spawning
    if(!GM.spawningLander)
    {
      GM.spawningLander = true;
      setTimeout(function()
      {
        GM.spawningLander = false;
        var r = floor(random(-1,1));
        var dir = [-1,1];
        if(floor(level/1.5 * 10) < 10)
        {
          lim = floor(level/1.5 * 10);
        }
        else
        {
          lim = 10;
        }
        
        if(landers.length < lim)
        {
          landers.push(new Lander(width/2+(width*1.5*random(dir)),random(200,height-200)));
          landers[landers.length-1].id = landers.length-1;
        }
      },random(1000,this.maxSpawnTime));
    }
  }
  
  //Checks every line in a polygon for intersection with every line in the other polygon
  this.checkCol = function(a,b)
  {
    var intersection = false;
    
    for(var i = 0; i < a.length; i++)
    {
      for(var j = 0; j < b.length; j++)
      {
        if(i+1 >= a.length && j+1 < b.length)
        {
          var lineCheck = this.segmentIntersect(a[i],a[0],b[j],b[j+1]);
        }
        else
        {
          if(i+1 >= a.length && j+1 >= b.length)
          {
            var lineCheck = this.segmentIntersect(a[i],a[0],b[j],b[0]);
          }
          else
          {
            if(i+1 < a.length && j+1 >= b.length)
            {
              var lineCheck = this.segmentIntersect(a[i],a[i+1],b[j],b[0]);
            }
            else
            {
              var lineCheck = this.segmentIntersect(a[i],a[i+1],b[j],b[j+1]);
            }
          }
        }
  
        if(lineCheck)
        {
          intersection = true;
        }
      }
    }
    if(intersection)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  //Tests two lines for intersection Returns either true or false.
  this.segmentIntersect = function(p0,p1,p2,p3)
  {
  			var A1 = p1.y - p0.y,
  			B1 = p0.x - p1.x,
  			C1 = A1 * p0.x + B1 * p0.y,
  			A2 = p3.y - p2.y,
  			B2 = p2.x - p3.x,
  			C2 = A2 * p2.x + B2 * p2.y,
  			denominator = A1 * B2 - A2 * B1;
  		
  		if(denominator == 0)
  		{
  			return null;
  		}
  		
  		var	intersectX = (B2 * C1 - B1 * C2) / denominator,
  			intersectY = (A1 * C2 - A2 * C1) / denominator
  			rx0 = (intersectX - p0.x) / (p1.x - p0.x),
  			ry0 = (intersectY - p0.y) / (p1.y - p0.y),
  			rx1 = (intersectX - p2.x) / (p3.x - p2.x),
  			ry1 = (intersectY - p2.y) / (p3.y - p2.y);
  
  		if(((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) && 
  		   ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) 
  		{
  		  return true;
  		}
  		else 
  		{
  			return false;
  		}
  }

  this.checkBounds = function(a,b)
  {
    if(dist(a.ox,b.oy,b.ox,b.oy) < a.r+b.r)
    {
      //console.log("Entered bounding circle! Doing collision tests...");
      return this.checkCol(a.v,b.v);
    }
    else
    {
      //console.log("Not in bounding circle.")
      return false;
    }
  }
  
  this.updateCols = function()
  {
    //check landers (if there are any actual bullets we need tro deal with) We iterate backwards in case the size of the array changes throughout.
    if(bullets.length > 0)
    {
      for(i = landers.length-1; i > -1; i--)
      {
        for(j = bullets.length-1; j > -1; j--)
        {
          col = this.checkBounds(landers[i].hb,bullets[j].hb);
          if(col || dist(bullets[j].x,bullets[j].y,landers[i].x,landers[i].y) < 15)
          {
            landers[i].alive = false;
            bullets[j].alive = false;
            sndLanderK.play();
            score += 100;
            aliensLeft -= 1;
            explosions.push(new Explosion(landers[i].x,landers[i].y,50,color(0,255,0)));
          }
        }
      }
      for(i = mutants.length-1; i > -1; i--)
      {
        for(j = bullets.length-1; j > -1; j--)
        {
          if(dist(mutants[i].x,mutants[i].y,bullets[j].x,bullets[j].y) < 30)
          {
            sndLanderK.play();
            score += 50;
            mutants[i].alive = false;
            bullets[j].alive = false;
            aliensLeft -= 1;
            explosions.push(new Explosion(mutants[i].x,mutants[i].y,50,color(255,0,255)));
          }
        }
      }
    }
    if(landerBullets.length > 0)
    {
      for(i = 0; i < landerBullets.length; i++)
      {
        //console.log("Running");
        if(dist(player.x,player.y,landerBullets[i].pos.x,landerBullets[i].pos.y) < 20 && player.alive && !player.invuln)
        {
          landerBullets[i].alive = false;
          player.kill();
        }
      }
    }
    if(mutantBullets.length > 0)
    {
      for(i = 0; i < mutantBullets.length; i++)
      {
        //console.log("Running");
        if(dist(player.x,player.y,mutantBullets[i].x,mutantBullets[i].y) < 50 && player.alive && !player.invuln)
        {
          mutantBullets[i].alive = false;
          player.kill();
        }
      }
    }
    if(colonists.length > 0)
    {
      for(i = colonists.length-1; i > -1; i--)
      {
        if(dist(colonists[i].x,colonists[i].y,player.x,player.y) < 30 && !colonists[i].abducted && colonists[i].alive)
        {
          sndSave.play();
          lives += 1;
          colonists[i].alive = false;
          score += 1000;
        }
      }
    }
  }
  
  this.reset = function()
  {
    
    aliensLeft = floor(level/1.5 * 10);
    if(level == 1)
    {
      player = new Ship();
      lives = 3;
      score = 0;
      this.terrainCol = color(255,69,0);
    }
    else
    {
      this.terrainCol = color(random(25,255),random(25,255),random(25,255));
    }
    player.x = player.xLim;
    player.y = height/2;
    colonists = [];
    bullets = [];
    landers = [];
    landerBullets = [];
    mutants = [];
    mutantBullets = [];
    explosions = [];
    stars = [];
    strokeWeight(1);
    
    startStars = random(10,25)
    for(i = 0; i < startStars; i++)
    {
      stars.push(new Star(random(0,width)));
    }
  };
  
  this.updateGame = function()
  {
    if(this.maxSpawnTime > 1500)
    {
      this.maxSpawnTime = 5000000/millis();
    }
    else
    {
      this.maxSpawnTime = 1500;
    }
  	background(0);
  	this.checkControls();
  	for(i = 0; i < stars.length; i++)
  	{
  	  stars[i].update();
  	  if(!stars[i].alive)
  	  {
  	    stars.splice(i,1);
  	  }
  	}
  	
  	this.drawTerrain();
  	player.move();
  	player.draw();
  	
  	//Update objects and remove dead instances.
  	for(i = 0; i < bullets.length; i++)
  	{
  		bullets[i].update();
  		if(!bullets[i].alive)
  		{
  		  bullets.splice(i,1);
  		}
  	}
  	
  	for(i = 0; i < landerBullets.length; i++)
  	{
  	  landerBullets[i].update();
  	}
  	
  	for(i = landers.length-1; i > -1; i--)
  	{
  	  if(landers[i] != null)
  	  {
  		  landers[i].update();
  	  }
  	}
  	
  	for(i = 0; i < mutantBullets.length; i++)
  	{
  		mutantBullets[i].update();
  		if(!mutantBullets[i].alive)
  		{
  		  mutantBullets.splice(i,1);
  		}
  	}
  	
  	for(i = mutants.length-1; i > -1; i--)
  	{
  		mutants[i].update();
  	}
  	
  	for(i = 0; i < colonists.length; i++)
  	{
  		colonists[i].update();
  	}
  	
  	for(i = 0; i < explosions.length; i++)
  	{
  	  explosions[i].update();
  	}
  	
    mutants = mutants.filter(function(e)
    {
      if(e.alive)
      {
        return true;
      }
      else
      {
        return false;
      }
    });
    
    
    
    landers = landers.filter(function(e)
    {
      if(e.alive)
      {
        return true;
      }
      else
      {
        if(e.target != -1)
        {
          colonists[e.target].abducted = false;
          colonists[e.target].abductor = -1;
        }
        return false;
      }
    })
    
    landerBullets = landerBullets.filter(function(e)
    {
      if(e.alive)
      {
        return true;
      }
      else
      {
        return false;
      }
    })
    
    mutantBullets = mutantBullets.filter(function(e)
    {
      if(e.alive)
      {
        return true;
      }
      else
      {
        return false;
      }
    })
    
    explosions = explosions.filter(function(e)
    {
      if(e.alive)
      {
        return true;
      }
      else
      {
        return false;
      }
    })
    
    stars = stars.filter(function(e)
    {
      if(e.alive)
      {
        return true;
      }
      else
      {
        return false;
      }
    })
    
    
    //Check for victory
    if(aliensLeft <= 0)
    {
      setTimeout(function()
    	{
  	    GM.reset();
  	    gameState = 1;
    	},3000);
    	sndComplete.play();
      level += 1;
      gameState = 3;
    }
    
  	//Manage spawning
  	this.updateSpawns();
  	//deal with collisions
  	this.updateCols();
  	this.drawGUI();
  };
  //console.log(mutants.length);
  
  this.displayMenu = function()
  {
    if(readyToPlay)
    {
      this.playText = "PRESS [ENTER] TO PLAY";
    }
    else
    {
      this.playText = "LOADING...";
    }
    if(this.col+10 < 100)
		{
			this.col += 1;
		}
		else
		{
			this.col = 0;
		}
		colorMode(HSB,100)
		fill(this.col,100,100);
    background(0);
    
    imageMode(CENTER);
    image(cover,width/2,height/2);
    
	  textAlign(CENTER);
  	textFont(gameFont);
  	textSize(72);
  	text("GUARDIAN",width/2,height/6);
  	colorMode(RGB,255);
  	fill(255,0,255)
  	textSize(40);
  	text(this.playText,width/2,height/1.3)
  	fill(0,200,255)
  	textSize(14);
  	text("(C) 2017 TAHA NASIR   GUARDIAN (C) 1981 NASIR ELECTRONICS",width/2,height/1.05);
  }
  
  this.displayGameOver = function()
  {
    if(this.col+10 < 100)
		{
			this.col += 1;
		}
		else
		{
			this.col = 0;
		}
		colorMode(HSB,100)
		fill(this.col,100,100);
    background(0);
	  textAlign(CENTER);
  	textFont(gameFont);
  	textSize(72);
  	text("GAME OVER",width/2,height/4);
  	colorMode(RGB,255);
  	fill(255,0,255)
  	textSize(40);
  	text("FINAL SCORE: " + score,width/2,height/2)
  	fill(0,200,255)
  	textSize(14);
  	text("(C) 2017 TAHA NASIR   GUARDIAN (C) 1981 NASIR ELECTRONICS",width/2,height/1.05);
  	setTimeout(function()
  	{
  	  setTimeout(function()
  	  {
  	    readyToPlay = true;
  	  },2000);
  	  gameState = 0;
  	},2000);
  }
  
  this.displayLevelComplete = function()
  {
    if(this.col+10 < 100)
		{
			this.col += 1;
		}
		else
		{
			this.col = 0;
		}
		colorMode(HSB,100)
		fill(this.col,100,100);
    background(0);
	  textAlign(CENTER);
  	textFont(gameFont);
  	textSize(64);
  	aliensLeft = floor(level/1.5 * 10);
  	text("LEVEL COMPLETE!",width/2,height/4);
  	colorMode(RGB,255);
  	fill(255,0,255)
  	textSize(40);
  	text("STAGE "+level,width/2,height/2);
  	text(aliensLeft + " ALIENS LEFT",width/2,height/1.6);
  	fill(0,200,255)
  	textSize(14);
  	text("(C) 2017 TAHA NASIR   GUARDIAN (C) 1981 NASIR ELECTRONICS",width/2,height/1.05);
  }
}