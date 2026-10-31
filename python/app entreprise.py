import time
import random
print("initialisation")
time.sleep(1)
choixsortie=" "
while choixsortie!="END":
    print("--------------------------------------------------------------------")
    time.sleep(1)
    print("entreprise mode")
    print("Bienvenue")
    print("merci de vous connecter")
    input("service sécurisé")
    print("inv = mode invité")
    co1=input("ID : ")
    if co1=="8":
        print("ADMIN MODE")
        print("------------------------------------------------------------------")
        print("modules :")
        print("- time")
        print("---------------------------------------------------------------")
        print("to do list :")
        print("- finir de coder")
        print("---------------------------------------")
        print("variables :")
        print("ID : ", co1)
    elif co1=="m-sg":
        sgmco2=input("mot de passe : ")
        if sgmco2=="douxmilo-shadowgard":
            print("rien ici")
        else:
            print("...")
    elif co1==("inv") or co1==("INV"):
        print("MODE Invité")
        print("liste des entreprises :")
        print("- Rien...")
    else:
        print("ERROR")
    choixsortie=input("appuie sur entrer pour redémarer ou tape END pour arréter : ")
