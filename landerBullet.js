LanderBullet = function(x1,y1,x2,y2)
{
  this.alive = true;
  this.pos = createVector(x1,y1);
  this.target = createVector(x2,y2);
  this.spd = 8;
  this.angle = Math.atan2(this.target.y-this.pos.y, this.target.x-this.pos.x)
  //console.log("("+this.pos.x+","+this.pos.y+")");
  
  this.draw = function()
  {
    if(this.alive)
    {
      fill(255,0,0);
      stroke(255,0,0);
      strokeWeight(4);
      ellipse(this.pos.x,this.pos.y,4,4);
      strokeWeight(1);
      //point(this.target.x,this.target.y); //for debugging
    }
  }
  
  this.move = function()
  {
    this.pos.x += -200*scrollSpd;
  }
  
  this.step = function()
  {
    this.pos.x += this.spd * cos(this.angle);
    this.pos.y += this.spd * sin(this.angle);
  }
  
  this.update = function()
  {
    if(this.alive)
    {
      //check if I should die
      if(dist(this.x,this.y,x1,y1) > width)
      {
        //guess I'll die
        this.alive = false;
      }
      this.draw();
      this.move();
      this.step();
    }
  }
}