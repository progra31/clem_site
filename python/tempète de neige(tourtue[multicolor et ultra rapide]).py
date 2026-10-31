import random
from turtle import*
shape("turtle")
speed(10)
pensize(3)
Screen().bgcolor("black")
couleur=["blue","yellow","pink","red","cyan","plum","goldenrod","lemon chiffon"]
def formev(taille):
    right(25)
    forward(taille)
    backward(taille)
    left(50)
    forward(taille)
    backward(taille)
    right(25)
def branchfloc(taille):
    for x in range(0,4):
        forward(taille)
        formev(taille)
    backward(taille*4)
def flocon(taille):
    for c in range(0,18):
        color(random.choice(couleur))
        branchfloc(taille)
        right(20)
for i in range(1,10):
    taille=random.randint(5,30)
    x=random.randint(-400,400)
    y=random.randint(-400,400)
    penup()
    goto(x,y)
    pendown()
    flocon(taille)
hideturtle()
