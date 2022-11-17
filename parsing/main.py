import json

def write_data(dict):
    with open('rapport.csv', "a+", encoding='utf8') as report:
        report.write(json.dumps(dict, indent=4))

def processline(row):
    listElement = row.split(';')
    isEmpty = 0
    for element in listElement:
        if not element or isEmpty == 5 :
            isEmpty += 1
    if isEmpty <= 5:
        ListFormation.append(row)

ListFormation=[]
#clean/mise en forme CSV
with open('data_fr.csv', 'r',encoding='utf8') as file:
    creatline = ''
    for row in file:
        if row[0] == '-':
            row = row[1:]
        if row.count(';') == 14:
            processline(row)
        elif not creatline:
                creatline += row.rstrip()
        else:
            creatline += row.rstrip()
            if creatline.count(';') == 14:
                processline(creatline)
                creatline = ''

#Création json
listTitle =  ListFormation[0].split(';')
for element in ListFormation[1:]:
    jsonElement = {}
    listelement =  element.split(';')
    for idx, col in enumerate(listTitle):
        jsonElement[col] = listelement[idx]
    write_data(jsonElement)
