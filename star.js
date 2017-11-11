var Star = function(x)
{
  this.alive = true;
  this.x = x;
  this.y = random(0,height);
  this.distance = random() + 0.1; //distance from the mountains, going back. The speed is slower and the size is smaller the higher the distance.
  this.size = 2 * (1/this.distance);
  this.speed = 10 * (1/this.distance);
  
  this.draw = function()
  {
    noStroke();
    fill(255);
    ellipse(this.x,this.y,this.size);
  }
  this.move = function()
  {
    this.x -= this.speed*scrollSpd;;
  }
  
  this.update = function()
  {
    if(this.alive)
    {
      if(this.x > width * 2 || this.x < -width)
      {
        this.alive = false;
      }
      else
      {
        this.move();
        this.draw();
      }
    }
  }
}