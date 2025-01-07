import os


def replace_links(folder, filenames, search_replace):
    search_replace = sorted(search_replace, key=lambda x: len(x[0]), reverse=True)
    for filename in filenames:
        print("Replacing " + os.path.join(folder, filename) + " ...")
        with open(os.path.join(folder, filename), "r", encoding="utf-8") as input:
            file = input.read()
        for search, replace in search_replace:
            file = file.replace(search, replace)
        with open(os.path.join(folder, filename), "w", encoding="utf-8") as output:
            output.write(file)


replace_links(
    "正字表",
    ["第" + str(i) + "頁.html" for i in range(1, 301)],
    [
        ("/appendix.jsp?ID=1&page=" + str(i), "第" + str(i) + "頁.html")
        for i in range(1, 301)
    ],
)
replace_links(
    "異體字表",
    ["第" + str(i) + "頁.html" for i in range(1, 745)],
    [
        ("/appendix.jsp?ID=3&page=" + str(i), "第" + str(i) + "頁.html")
        for i in range(1, 745)
    ],
)
replace_links(
    "民俗文獻用字表",
    ["第" + str(i) + "頁.html" for i in range(1, 52)],
    [
        ("/appendix.jsp?ID=13&amp;page=" + str(i), "第" + str(i) + "頁.html")
        for i in range(1, 52)
    ],
)
replace_links(
    "臺灣戶政姓氏用字表",
    ["第" + str(i) + "頁.html" for i in range(1, 19)],
    [
        ("/appendix.jsp?ID=6&amp;page=" + str(i), "第" + str(i) + "頁.html")
        for i in range(1, 19)
    ],
)
replace_links(
    "中日韓共用漢字表",
    ["第" + str(i) + "頁.html" for i in range(1, 18)],
    [
        ("/appendix.jsp?ID=8&amp;page=" + str(i), "第" + str(i) + "頁.html")
        for i in range(1, 18)
    ],
)
