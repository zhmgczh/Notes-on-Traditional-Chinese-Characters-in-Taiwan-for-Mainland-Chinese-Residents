import json, requests, time, random, sys, os, pickle
from urllib.parse import quote
from copy import deepcopy


def deep_merge(d1, d2):
    """
    將 d2 合併進 d1（不改動原始 dict）
    規則：
    - 兩邊都是 dict -> 遞迴合併
    - 否則 -> d2 覆蓋 d1
    """
    result = deepcopy(d1)
    for k, v in d2.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = deep_merge(result[k], v)
        else:
            result[k] = deepcopy(v)
    return result


def deep_merge_key(d1, d2, added_value=""):
    result = deepcopy(d1)
    for k, v in d2.items():
        if isinstance(v, dict):
            if k not in result:
                result[k] = {}
            result[k] = deep_merge_key(result[k], v, added_value)
        else:
            result[k] = added_value
    return result


headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en,zh-TW;q=0.9,zh;q=0.8",
    "connection": "keep-alive",
    # "cookie": "_ga_7PH3J7XXS9=GS1.1.1732683926.5.1.1732684069.0.0.0; _ga_S4K4QEWN8T=GS1.1.1733352758.133.1.1733353023.0.0.0; _ga_TSW7HBKV2D=GS1.1.1733352758.436.1.1733353023.0.0.0; _ga_B185ZR663X=GS1.1.1733352758.436.1.1733353023.0.0.0; _ga=GA1.1.374967889.1716787206; _ga_DY7KJGF3R2=GS1.1.1733712566.31.1.1733712759.0.0.0; _ga_P8X29BZ1XP=GS1.1.1733712566.37.1.1733712759.0.0.0; JSESSIONID=C12A61B5689DAADB16774088927AB112",
    "host": "stroke-order.learningweb.moe.edu.tw",
    "referer": "https://stroke-order.learningweb.moe.edu.tw/searchW.jsp?ID2=1",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}
session = requests.Session()
entries = {}


def load_entries():
    if os.path.isfile("stroke_entries.pkl"):
        with open("stroke_entries.pkl", "rb") as inp:
            global entries
            entries = pickle.load(inp)


def write_entries():
    with open("stroke_entries.pkl", "wb") as outp:
        global entries
        pickle.dump(entries, outp, pickle.HIGHEST_PROTOCOL)


def restart_session():
    global session
    time.sleep(random.random() * 3)
    session = requests.Session()


def get_id_from_response(response: requests.Response):
    id = ""
    if 302 == response.status_code:
        location = response.headers.get("Location")
        id = location.split("?ID=")[1]
    elif 200 == response.status_code:
        html = response.text
        if (
            "<iframe src='https://stroke-order.learningweb.moe.edu.tw/dictFrame.jsp?ID="
            in response.text
        ):
            id = html.split(
                "<iframe src='https://stroke-order.learningweb.moe.edu.tw/dictFrame.jsp?ID="
            )[1].split("' frameborder=0")[0]
    return id


def get_id(character, force_found=False):
    global session, entries
    url = "https://stroke-order.learningweb.moe.edu.tw/searchW.jsp?ID2=1&WORD=" + quote(
        character
    )
    print(
        "Getting ID of",
        character,
        "from",
        url,
        "( force_found =",
        force_found,
        end=" ) : ",
    )
    sys.stdout.flush()
    successful = False
    while not successful:
        try:
            response = session.get(url, headers=headers)
            id = get_id_from_response(response)
            successful = True
            if force_found and "" == id:
                successful = False
                restart_session()
        except:
            restart_session()
    if "" != id:
        entries[character] = id
        write_entries()
    print(id)
    sys.stdout.flush()
    return id


def main():
    global entries
    load_entries()
    with open("final_table_normalized_renewed.json") as final_table:
        final_json = json.load(final_table)
    with open("stroke_table_normalized_renewed.json") as stroke_table:
        stroke_json = json.load(stroke_table)
    with open(
        "manually_added_dictionary_entries.json"
    ) as manually_added_dictionary_entries:
        manually_added_dictionary_entries = json.load(manually_added_dictionary_entries)
        final_json = deep_merge(final_json, manually_added_dictionary_entries)
    with open("manually_added_stroke_entries.json") as manually_added_stroke_entries:
        manually_added_stroke_entries = json.load(manually_added_stroke_entries)
        stroke_json = deep_merge(stroke_json, manually_added_stroke_entries)
    for key in stroke_json:
        for sub_key in stroke_json[key]:
            if sub_key in entries:
                stroke_json[key][sub_key] = entries[sub_key]
            else:
                stroke_json[key][sub_key] = get_id(
                    sub_key, "" != stroke_json[key][sub_key]
                )
    final = dict(
        sorted(
            final_json.items(),
            reverse=True,
            key=lambda t: len(final_json[t[0]].items()),
        )
    )
    stroke = dict(
        sorted(
            stroke_json.items(),
            reverse=True,
            key=lambda t: len(final_json[t[0]].items()),
        )
    )
    for key in final.keys():
        final[key] = dict(
            sorted(
                final[key].items(),
                reverse=True,
                key=lambda t: (0 if "" == final[key][t[0]] else 1)
                + (0 if "" == stroke[key][t[0]] else 1),
            )
        )
        stroke[key] = dict(
            sorted(
                stroke[key].items(),
                reverse=True,
                key=lambda t: (0 if "" == final[key][t[0]] else 1)
                + (0 if "" == stroke[key][t[0]] else 1),
            )
        )
    with open("final_table_normalized_renewed2.json", "w", encoding="utf-8") as f:
        json.dump(final, f)
    with open("stroke_table_normalized_renewed2.json", "w", encoding="utf-8") as f:
        json.dump(stroke, f)


if "__main__" == __name__:
    main()
