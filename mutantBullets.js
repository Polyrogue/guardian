MutantBullet = function(x,y)
{
  this.alive = true;
  
  this.x = x;
  this.y = y;
  
  this.toggleC = 0;
  
  angleMode(RADIANS);
  this.angle = Math.atan2(player.y-this.y,player.x-this.x);
  this.spd = 10;
  
  this.draw = function()
  {
    if(this.toggleC == 0)
    {
      fill(255);
      this.toggleC = 1;
    }
    else
    {
      fill(200,0,200);
      this.toggleC = 0;
    }
    ellipse(this.x,this.y,8,8);
  }
  
  this.move = function()
  {
    this.x += this.spd*cos(this.angle);
    this.y += this.spd*sin(this.angle);
  }
  
  this.update = function()
  {
    //check if I should die
    if(dist(this.x,this.y,x,y) > 2*width  && this.alive)
    {
      //guess I'll die
      this.alive = false;
    }
    this.move();
    this.draw();
  }
}