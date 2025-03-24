import csv


def main():
    tranditional_characters = []
    simplified_characters = []
    with open("import.csv", "r", encoding="utf-8") as input:
        content = csv.reader(input)
        next(content)
        for line in content:
            tranditional_simplified = line[1][len("一簡多繁辨析之「") :][:-1].split(
                "」→「"
            )
            tranditional_characters.extend(tranditional_simplified[0].split("、"))
            simplified_characters.extend(tranditional_simplified[1].split("、"))
    with open("tranditional_characters.txt", "w", encoding="utf-8") as output:
        output.write("|".join(tranditional_characters))
    with open("simplified_characters.txt", "w", encoding="utf-8") as output:
        output.write("|".join(simplified_characters))


if "__main__" == __name__:
    main()
