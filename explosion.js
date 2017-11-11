this.Explosion = function(x,y,size,col)
{
	this.x = x;
	this.y = y;
	this.r = 3;
	this.maxR = size;
	this.alive = true;
	this.col = col;
	
	this.draw = function()
	{
		if(this.r < this.maxR)
		{
			this.r += 15;
			noFill();
			strokeWeight(5);
			stroke(this.col);
			ellipse(this.x,this.y,this.r,this.r)
		}
		else
		{
			alive = false;	
		}
	}
  this.update = function()
  {
    this.x += -200*scrollSpd;
    this.draw();
  }
}