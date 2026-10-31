from turtle import*
color("red")
shape("turtle")
speed(1)
pensize(6)
Screen().bgcolor("yellow")
def formev():
    right(25)
    forward(50)
    backward(50)
    left(50)
    forward(50)
    backward(50)
    right(25)
def branchfloc():
    for x in range(0,4):
        forward(30)
        formev()
    backward(120)
def flocon():
    for c in range(0,6):
        branchfloc()
        right(60)
flocon()
hideturtle()
