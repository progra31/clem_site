choixsortie=""
while choixsortie!="QUITTER":
    table=int(input("S'il te plaît, entre une table de multiplication :"))
    for T in range(0,13):
        print(table,"x",T,"=",T*table)
    choixsortie=input ("Appuie sur Entrée pour entrer une nouvelle table de multiplication ou tape QUITTER pour arrêter.")
