alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ"

chaineacrypter=input("s'il'te plait antre un message a crypter:")
chaineacrypter=chaineacrypter.upper()
cléducode=int(input("entre un nombre entier de 1 a 25 en guise de clef."))
chainecryptée=""
for characthèreactuel in chaineacrypter:
    position=alphabet.find(characthèreactuel)
    nouvelleposition=position+cléducode
    chainecryptée=chainecryptée+alphabet[nouvelleposition]
print("ton message ceypté est",chainecryptée)
