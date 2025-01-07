import os, requests, hashlib, pickle, time, random
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en,zh-TW;q=0.9,zh;q=0.8",
    "connection": "keep-alive",
    "cookie": "_ga_7PH3J7XXS9=GS1.1.1732683926.5.1.1732684069.0.0.0; _ga_S4K4QEWN8T=GS1.1.1733352758.133.1.1733353023.0.0.0; _ga_TSW7HBKV2D=GS1.1.1733352758.436.1.1733353023.0.0.0; _ga_B185ZR663X=GS1.1.1733352758.436.1.1733353023.0.0.0; _ga=GA1.1.374967889.1716787206; _ga_DY7KJGF3R2=GS1.1.1733712566.31.1.1733712759.0.0.0; _ga_P8X29BZ1XP=GS1.1.1733712566.37.1.1733712759.0.0.0; JSESSIONID=2FD8D3A4C8901FDC034642FEE1191B18",
    "host": "dict.variants.moe.edu.tw",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}
session = requests.Session()
entries = set()
url_lookup_table = {}


def load_entries():
    if os.path.isfile("entries.pkl"):
        with open("entries.pkl", "rb") as inp:
            global entries, url_lookup_table
            entries = pickle.load(inp)
            url_lookup_table = pickle.load(inp)


def write_entries():
    with open("entries.pkl", "wb") as outp:
        global entries, url_lookup_table
        pickle.dump(entries, outp, pickle.HIGHEST_PROTOCOL)
        pickle.dump(url_lookup_table, outp, pickle.HIGHEST_PROTOCOL)


def restart_session():
    global session
    time.sleep(random.random() * 3)
    session = requests.Session()


def save_file(url, folder):
    global session, url_lookup_table
    if url in url_lookup_table:
        return url_lookup_table[url]
    print("Downloading resource from " + url + " ...")
    successful = False
    while not successful:
        try:
            response = session.get(url, stream=True, headers=headers)
            if 200 == response.status_code:
                successful = True
            else:
                print(f"Failed to fetch {url}")
                restart_session()
        except:
            print(f"Failed to fetch {url}")
            restart_session()
    file_hash = hashlib.md5(response.content).hexdigest()
    ext = os.path.splitext(urlparse(url).path)[-1] or ".bin"
    file_name = f"{file_hash}{ext}"
    file_path = os.path.join(folder, file_name)
    if os.path.exists(file_path):
        url_lookup_table[url] = file_name
        return file_name
    with open(file_path, "wb") as f:
        f.write(response.content)
        url_lookup_table[url] = file_name
    return file_name


resources = {"img": "src", "link": "href", "script": "src"}


def process_html(
    url, save_folder, name, resource_folder_name, search_replace, show_all_links
):
    global session
    successful = False
    while not successful:
        try:
            response = session.get(url, headers=headers)
            if response.status_code != 200:
                print(f"Failed to fetch {url}")
                restart_session()
            else:
                successful = True
        except:
            print(f"Failed to fetch {url}")
            restart_session()
    soup = BeautifulSoup(response.text, "lxml")
    resource_folder = os.path.join(save_folder, resource_folder_name)
    if not os.path.exists(resource_folder):
        os.makedirs(resource_folder)
    for tag, attr in resources.items():
        for resource in soup.find_all(tag):
            rel = resource.get("rel")
            if "link" == tag and None != rel and rel[0] in ("canonical", "alternate"):
                continue
            resource_url = resource.get(attr)
            if not resource_url:
                continue
            full_url = urljoin(url, resource_url)
            if urlparse(full_url).netloc != urlparse(url).netloc:
                continue
            local_file = save_file(full_url, resource_folder)
            if local_file:
                resource[attr] = os.path.join(resource_folder_name, local_file)
    internal_links = []
    if show_all_links:
        for a_tag in soup.find_all("a", href=True):
            full_url = urljoin(url, a_tag["href"])
            if urlparse(full_url).netloc == urlparse(url).netloc:
                internal_links.append(full_url)
    if None == name:
        html_file = os.path.join(
            save_folder, f"{hashlib.md5(url.encode()).hexdigest()}.html"
        )
    else:
        html_file = os.path.join(save_folder, f"{name}.html")
    html_final = soup.prettify()
    for search, replace in search_replace:
        html_final = html_final.replace(search, replace)
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_final)
    return html_file, internal_links


def crawl(
    urls,
    save_folder,
    names=None,
    resource_folder_name="resources",
    search_replace=[],
    show_all_links=False,
):
    global entries
    load_entries()
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)
    to_crawl = urls
    to_name = names
    all_links = []
    while to_crawl:
        url = to_crawl.pop(0)
        name = to_name.pop(0)
        if url in entries:
            continue
        print(f"Crawling {url} as {name} ...")
        if None == names:
            html_file, links = process_html(
                url,
                save_folder,
                None,
                resource_folder_name,
                search_replace,
                show_all_links,
            )
        else:
            html_file, links = process_html(
                url,
                save_folder,
                name,
                resource_folder_name,
                search_replace,
                show_all_links,
            )
        if html_file:
            entries.add(url)
            write_entries()
            all_links.extend(links)
            # to_crawl.extend([link for link in links if link not in entries])
    return all_links


print(
    crawl(
        [
            "https://dict.variants.moe.edu.tw/appendix.jsp?ID=1&la=0&page=" + str(i)
            for i in range(1, 301)
        ],
        "正字表",
        ["第" + str(i) + "頁" for i in range(1, 301)],
        "resources",
        [("func.js", "fa23fe9c322cbbe3ef3518d8d1912863.js")],
    )
)
print(
    crawl(
        [
            "https://dict.variants.moe.edu.tw/appendix.jsp?ID=3&la=0&page=" + str(i)
            for i in range(1, 745)
        ],
        "異體字表",
        ["第" + str(i) + "頁" for i in range(1, 745)],
        "resources",
        [("func.js", "fa23fe9c322cbbe3ef3518d8d1912863.js")],
    )
)
print(
    crawl(
        [
            "https://dict.variants.moe.edu.tw/appendix.jsp?ID=13&la=0&page=" + str(i)
            for i in range(1, 52)
        ],
        "民俗文獻用字表",
        ["第" + str(i) + "頁" for i in range(1, 52)],
        "resources",
        [("func.js", "fa23fe9c322cbbe3ef3518d8d1912863.js")],
    )
)
print(
    crawl(
        [
            "https://dict.variants.moe.edu.tw/appendix.jsp?ID=6&la=0&page=" + str(i)
            for i in range(1, 19)
        ],
        "臺灣戶政姓氏用字表",
        ["第" + str(i) + "頁" for i in range(1, 19)],
        "resources",
        [("func.js", "fa23fe9c322cbbe3ef3518d8d1912863.js")],
    )
)
print(
    crawl(
        [
            "https://dict.variants.moe.edu.tw/appendix.jsp?ID=8&la=0&page=" + str(i)
            for i in range(1, 18)
        ],
        "中日韓共用漢字表",
        ["第" + str(i) + "頁" for i in range(1, 18)],
        "resources",
        [("func.js", "fa23fe9c322cbbe3ef3518d8d1912863.js")],
    )
)
