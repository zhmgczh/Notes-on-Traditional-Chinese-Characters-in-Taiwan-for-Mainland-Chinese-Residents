import requests, time, random, sys, os, pickle
from urllib.parse import quote
from urllib.parse import urljoin

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
entries = set()


def load_entries():
    if os.path.isfile("entries.pkl"):
        with open("entries.pkl", "rb") as inp:
            global entries
            entries = pickle.load(inp)


def write_entries():
    with open("entries.pkl", "wb") as outp:
        global entries
        pickle.dump(entries, outp, pickle.HIGHEST_PROTOCOL)


def restart_session():
    global session
    time.sleep(random.random() * 3)
    session = requests.Session()


def download_strokes(character, type):
    global session
    url = (
        "https://stroke-order.learningweb.moe.edu.tw/stroke_card.jsp?WORD="
        + quote(character)
        + "&TYPE="
        + type
    )
    output_file = "./" + type + "s/" + character + "." + type + ".zip"
    successful = False
    print("Downloading " + character + " of type " + type + " from " + url, end=": ")
    while not successful:
        try:
            response = session.get(url, stream=True)
            if 200 == response.status_code:
                with open(output_file, "wb") as file:
                    for chunk in response.iter_content(chunk_size=1024):
                        if chunk:
                            file.write(chunk)
                print(f"stored at {output_file}.")
                successful = True
            elif 302 == response.status_code:
                url = urljoin(url, response.headers.get("Location"))
            else:
                restart_session()
        except:
            restart_session()


def main():
    global entries
    load_entries()
    directory = "./6063png/"
    all_files = os.listdir(directory)
    files_only = [f for f in all_files if os.path.isfile(os.path.join(directory, f))]
    for file in files_only:
        if file.endswith(".png"):
            character = file[: -len(".png")]
            if character not in entries:
                download_strokes(character, "pdf")
                download_strokes(character, "png")
                download_strokes(character, "svg")
                entries.add(character)
                write_entries()


if "__main__" == __name__:
    main()
