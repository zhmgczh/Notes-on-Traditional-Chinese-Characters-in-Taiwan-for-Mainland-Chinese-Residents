import os, pickle, csv, hashlib, json
from urllib.parse import quote
from tabulate import tabulate
import pandas as pd

# sample_of_mistakes.csv
# filename,character,comment
mistakes_dict = {}


def load_mistakes():
    global mistakes_dict
    mistakes_dict = {}
    with open(
        "../Sample_of_Mistakes/sample_of_mistakes.csv", mode="r", encoding="utf-8"
    ) as mistakes_file:
        mistakes = csv.reader(mistakes_file)
        filename_index = character_index = comment_index = -1
        for line in mistakes:
            if -1 == filename_index or -1 == character_index or -1 == comment_index:
                filename_index = line.index("filename")
                character_index = line.index("character")
                comment_index = line.index("comment")
            else:
                characters = line[character_index].split("|")
                for character in characters:
                    if character not in mistakes_dict:
                        mistakes_dict[character] = []
                    mistakes_dict[character].append(
                        (line[filename_index], line[comment_index])
                    )


def get_mistakes(character):
    global mistakes_dict
    if character not in mistakes_dict:
        return ""
    entries = mistakes_dict[character]
    addition = (
        '<p style="font-family: eduSong; font-size: 150%;">誤用舉例──「'
        + character
        + '」：</p>\n<div style="text-align:center;">\n'
    )
    for entry in entries:
        img_url = (
            "https://raw.githubusercontent.com/zhmgczh/Notes-on-Traditional-Chinese-Characters-in-Taiwan-for-Mainland-Chinese-Residents/master/Sample_of_Mistakes/"
            + quote(entry[0])
        )
        error_img_url = (
            "https://mainland-proxy.zh-tw.dpdns.org/zhmgczh/Notes-on-Traditional-Chinese-Characters-in-Taiwan-for-Mainland-Chinese-Residents/master/Sample_of_Mistakes/"
            + quote(entry[0])
        )
        addition += (
            '<div style="font-family: eduSong; font-size: 150%;"><a href="'
            + img_url
            + '" target="_blank"><img src="'
            + img_url
            + '" alt="'
            + entry[1].replace("\\n", " ")
            + '" onerror="if(!this.dataset.fallback){this.dataset.fallback=1; this.src=\''
            + error_img_url
            + "';}\"></a></div>\n"
        )
        addition += (
            '<div style="font-family: eduSong; font-size: 150%;">'
            + entry[1].replace("\\n", "<br/>\n")
            + "</div><br/>\n"
        )
    addition += "</div>"
    return addition


final_json = {}
stroke_json = {}
dictionary_links_html = """
<tag id="stroke_pos"></tag>
<center><button onclick="close_stroke()" style="font-family: eduSong; font-size: 150%;">關閉「筆順學習」</button></center>
<center>
  <!-- <div id="stroke_player" style="width:348px;height:470px;display:none;">載入中，請稍後...</div> -->
  <iframe id="stroke_player" src="" frameborder=0 style="width:300px;height:520px;display:none;" allow="fullscreen"></iframe>
</center>
<!-- <script src="https://stroke-order.learningweb.moe.edu.tw/js/playerShare.js"></script> -->
<script>
    function jumpTo(anchor_id) {
        var url = location.href;
        location.href = '#' + anchor_id;
        history.replaceState(null, null, url);
    }
    var stroke_id = '';
    function load_stroke(key) {
        var my_div = document.getElementById('stroke_player');
        var current_id = key;
        if (current_id != stroke_id) {
            // var playerShare = new PlayerShare('https://stroke-order.learningweb.moe.edu.tw/', current_id, '0', 'zh_TW');
            // playerShare.load();
            my_div.style['width'] = '300px';
            my_div.style['height'] = '520px';
            my_div.src = 'https://stroke-order.learningweb.moe.edu.tw/dictFrame.jsp?ID=' + current_id;
            my_div.style.removeProperty('display');
            stroke_id = current_id;
            jumpTo('stroke_pos');
        }
        else {
            my_div.style['display'] = 'none';
            // my_div.innerHTML = '';
            my_div.src = '';
            stroke_id = '';
        }
    }
    function close_stroke() {
        var my_div = document.getElementById('stroke_player');
        my_div.style['display'] = 'none';
        // my_div.innerHTML = '';
        my_div.src = '';
        stroke_id = '';
    }
</script>"""
dictionary_dict = {
    "《國語辭典》（萌典）": "https://www.moedict.tw/#####",
    "國字標準字體筆順學習網": "https://stroke-order.learningweb.moe.edu.tw/searchW.jsp?ID2=1&WORD=#####",
    "《國語辭典簡編本》": "https://dict.concised.moe.edu.tw/search.jsp?word=#####",
    "《重編國語辭典修訂本》": "https://dict.revised.moe.edu.tw/search.jsp?word=#####",
    "《成語典》": "https://dict.idioms.moe.edu.tw/idiomList.jsp?idiom=#####",
    "中國哲學書電子化計劃": "https://ctext.org/dictionary.pl?if=gb&char=#####",
    "漢語多功能字庫（香港）": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=#####",
}


def load_dictionaries():
    global final_json, stroke_json
    with open("final_table_normalized_renewed2.json") as final_table:
        final_json_tmp = json.load(final_table)
    with open("stroke_table_normalized_renewed2.json") as stroke_table:
        stroke_json_tmp = json.load(stroke_table)
    for key in final_json_tmp:
        for sub_key in final_json_tmp[key]:
            if sub_key not in final_json or "" == final_json[sub_key]:
                final_json[sub_key] = final_json_tmp[key][sub_key]
    for key in stroke_json_tmp:
        for sub_key in stroke_json_tmp[key]:
            if sub_key not in stroke_json or "" == stroke_json[sub_key]:
                stroke_json[sub_key] = stroke_json_tmp[key][sub_key]


def get_dictionary_links(characters):
    global final_json, stroke_json, dictionary_links_html, dictionary_dict
    table = [[""] + characters]
    finals = ["《教育部異體字字典》"]
    for character in characters:
        if character in final_json and "" != final_json[character]:
            finals.append(
                '<a href="https://dict.variants.moe.edu.tw/dictView.jsp?ID='
                + final_json[character]
                + '" target="_blank">打開</a>'
            )
        else:
            finals.append(
                '<a href="https://dict.variants.moe.edu.tw/search.jsp?QTP=0&WORD='
                + quote(character)
                + '" target="_blank">打開</a>'
            )
    table.append(finals)
    for dictionary in dictionary_dict:
        entry = [dictionary]
        for character in characters:
            entry.append(
                '<a href="'
                + dictionary_dict[dictionary].replace("#####", quote(character))
                + '" target="_blank">打開</a>'
            )
        table.append(entry)
    strokes = ["筆順學習"]
    for character in characters:
        if character in stroke_json and "" != stroke_json[character]:
            strokes.append(
                '<button onclick="load_stroke('
                + "'"
                + stroke_json[character]
                + "'"
                + ');">開關</button>'
            )
        else:
            strokes.append(
                '<a href="https://stroke-order.learningweb.moe.edu.tw/searchW.jsp?ID2=1&WORD='
                + quote(character)
                + '" target="_blank">打開</a>'
            )
    table.append(strokes)
    return (
        '<p style="font-family: eduSong; font-size: 150%;">文獻連結：</p>\n<div style="text-align:center;font-family: eduSong; font-size: 150%;">\n'
        + tabulate(table, tablefmt="unsafehtml")
        + "</div>"
        + dictionary_links_html
    )


def load_one_to_one_entries():
    one_to_one_entries = {}
    with open("總表.html", "r", encoding="utf-8") as one_to_one_file:
        one_to_one_table = one_to_one_file.read().split("<tbody", 1)[1]
        duplicates = set()
        while "<tr>" in one_to_one_table:
            entry = one_to_one_table.split("<tr>", 1)[1].split("</tr>", 1)[0]
            if "<del" not in entry:
                jian = (
                    entry.split(
                        '<td style="font-size: 150%; font-family: ZhongYiSong;">', 1
                    )[1]
                    .split("</td>", 1)[0]
                    .strip()
                )
                fan = (
                    entry.split('<td style="font-size: 150%;">', 1)[1]
                    .split("</td>", 1)[0]
                    .strip()
                )
                if (
                    jian != fan
                    and jian not in one_to_one_entries
                    and jian not in duplicates
                    and '<a href="/一簡多繁辨析/' not in entry
                ):
                    one_to_one_entries[jian] = fan
                else:
                    duplicates.add(jian)
                    if jian in one_to_one_entries:
                        del one_to_one_entries[jian]
            # else:
            #     jian = entry.split('text-decoration-thickness: 3px;">', 1)[1].split(
            #         "</del>", 1
            #     )[0].strip()
            #     fan = entry.split('text-decoration-thickness: 3px;">', 2)[2].split(
            #         "</del>", 1
            #     )[0].strip()
            one_to_one_table = one_to_one_table.split("</tr>", 1)[1]
    addtional = pd.read_csv("additional_one_to_one.csv", encoding="utf-8", header=0)
    for i in range(addtional.shape[0]):
        one_to_one_entries[addtional.iloc[i, 0]] = addtional.iloc[i, 1]
    return one_to_one_entries


def main(diff_generate=True):
    original_directory = os.getcwd()
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if diff_generate and os.path.exists("atom.pkl"):
        with open("atom.pkl", "rb") as inp:
            hashcodes = pickle.load(inp)
    else:
        hashcodes = {}
    load_mistakes()
    load_dictionaries()
    one_to_one_entries = load_one_to_one_entries()
    article_library = [["id", "title", "content", "excerpt", "category"]]
    index = 1
    json_table = []
    for jian, fan in one_to_one_entries.items():
        content = (
            '<div style="text-align: center;"><span style="font-family: eduKai, eduSong; font-size: 1500%;">'
            + fan
            + "</span><br/>\n"
            + '<span style="font-family: ZhongYiSong; font-size: 750%;">（'
            + jian
            + "）</span></div>\n"
            + get_mistakes(fan)
            + get_dictionary_links([fan])
        )
        h = hashlib.new("sha256")
        h.update(
            (
                "#####".join(
                    [
                        "一簡一繁對應之「" + fan + "」→「" + jian + "」",
                        content,
                        "《大陸居民臺灣正體字講義》一簡一繁對應之「"
                        + fan
                        + "」→「"
                        + jian
                        + "」",
                        "一簡一繁對應",
                    ]
                )
            ).encode()
        )
        # print(
        #     jian,
        #     jian not in hashcodes,
        #     h.hexdigest(),
        #     hashcodes.get(jian, ""),
        #     h.hexdigest() != hashcodes.get(jian, ""),
        # )
        if jian not in hashcodes or h.hexdigest() != hashcodes[jian]:
            print(fan, "→", jian, sep="")
            article_library.append(
                [
                    index,
                    "一簡一繁對應之「" + fan + "」→「" + jian + "」",
                    content,
                    "《大陸居民臺灣正體字講義》一簡一繁對應之「"
                    + fan
                    + "」→「"
                    + jian
                    + "」",
                    "一簡一繁對應",
                ]
            )
            hashcodes[jian] = h.hexdigest()
        json_table.append("一簡一繁對應之「" + fan + "」→「" + jian + "」")
        index += 1
    with open("one_to_one_entries.json", "w", encoding="utf-8") as f:
        json.dump(json_table, f)
    with open("import_one_to_one.csv", "w", encoding="utf-8") as import_file:
        writer = csv.writer(import_file)
        writer.writerows(article_library)
    with open("atom.pkl", "wb") as outp:
        pickle.dump(hashcodes, outp, pickle.HIGHEST_PROTOCOL)
    os.chdir(original_directory)


if "__main__" == __name__:
    import fire

    fire.Fire(main)
