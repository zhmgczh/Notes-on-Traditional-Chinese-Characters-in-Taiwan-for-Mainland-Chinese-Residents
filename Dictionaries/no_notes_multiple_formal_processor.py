import csv, json


def main():
    dictionary = {}
    with open("no_notes_multiple_formal.csv", "r", encoding="utf-8") as input:
        content = csv.reader(input)
        next(content)
        for line in content:
            dictionary[line[0]] = line[1]
    with open("no_notes_multiple_formal.json", "w", encoding="utf-8") as f:
        json.dump(dictionary, f)


if "__main__" == __name__:
    main()
