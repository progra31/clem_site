import random
from turtle import*
shape("turtle")
speed(10)
pensize(6)
Screen().bgcolor("green")
couleur=["blue","yellow","pink","red","cyan","plum","goldenrod","lemon chiffon"]
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
    for c in range(0,18):
        color(random.choice(couleur))
        branchfloc()
        right(20)
flocon()
hideturtle()
