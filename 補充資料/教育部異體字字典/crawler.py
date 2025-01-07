import os, requests, hashlib, pickle, time, random, certifi
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import undetected_chromedriver as uc

os.environ["SSL_CERT_FILE"] = certifi.where()
driver = uc.Chrome()
headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en,zh-TW;q=0.9,zh;q=0.8",
    "connection": "keep-alive",
    "cookie": "_ga_7PH3J7XXS9=GS1.1.1732683926.5.1.1732684069.0.0.0; _ga_S4K4QEWN8T=GS1.1.1733352758.133.1.1733353023.0.0.0; _ga_TSW7HBKV2D=GS1.1.1733352758.436.1.1733353023.0.0.0; _ga_B185ZR663X=GS1.1.1733352758.436.1.1733353023.0.0.0; _ga=GA1.1.374967889.1716787206; _ga_DY7KJGF3R2=GS1.1.1733712566.31.1.1733712759.0.0.0; _ga_P8X29BZ1XP=GS1.1.1733712566.37.1.1733712759.0.0.0; JSESSIONID=2FD8D3A4C8901FDC034642FEE1191B18",
    "host": "dict.variants.moe.edu.tw",
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
pairs = set()
code_to_index = {}
index_to_code = {}


def load_entries():
    global entries, url_lookup_table, code_to_index, index_to_code, pairs
    if os.path.isfile("entries.pkl"):
        with open("entries.pkl", "rb") as inp:
            entries = pickle.load(inp)
            url_lookup_table = pickle.load(inp)
            code_to_index = pickle.load(inp)
            index_to_code = pickle.load(inp)
    else:
        for i in range(1, 301):
            parse_table("字典附錄/正字表/第" + str(i) + "頁.html")
        for i in range(1, 745):
            parse_table("字典附錄/異體字表/第" + str(i) + "頁.html")
        for code, index in pairs:
            code_to_index[code] = index
            index_to_code[index] = code


def write_entries():
    with open("entries.pkl", "wb") as outp:
        global entries, url_lookup_table, code_to_index, index_to_code
        pickle.dump(entries, outp, pickle.HIGHEST_PROTOCOL)
        pickle.dump(url_lookup_table, outp, pickle.HIGHEST_PROTOCOL)
        pickle.dump(code_to_index, outp, pickle.HIGHEST_PROTOCOL)
        pickle.dump(index_to_code, outp, pickle.HIGHEST_PROTOCOL)


def restart_session():
    global session
    session.close()
    time.sleep(random.random() * 3)
    session = requests.Session()
    # restart_driver()


def restart_driver():
    global driver
    driver.quit()
    time.sleep(random.random() * 3)
    driver = uc.Chrome()


def save_file(url, folder, base_url):
    global session, url_lookup_table, driver
    if url in url_lookup_table:
        return url_lookup_table[url]
    print("Downloading resource from " + url + " ...")
    successful = False
    tried_times = 0
    while not successful and tried_times < 5:
        try:
            selenium_cookies = driver.get_cookies()
            cookies = {cookie["name"]: cookie["value"] for cookie in selenium_cookies}
            response = session.get(url, stream=True, headers=headers, cookies=cookies)
            if 200 == response.status_code:
                successful = True
            else:
                print(f"Failed to fetch {url}")
                restart_session()
                # driver.get(base_url)
                tried_times += 1
        except:
            print(f"Failed to fetch {url}")
            restart_session()
            # driver.get(base_url)
            tried_times += 1
    if not successful:
        url_lookup_table[url] = url
        return url
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
    # global session
    global driver
    successful = False
    while not successful:
        try:
            # response = session.get(url, headers=headers)
            # if response.status_code != 200:
            #     print(f"Failed to fetch {url}, code = " + str(response.status_code))
            #     restart_session()
            # else:
            #     successful = True
            driver.get(url)
            html = driver.page_source
            successful = True
        except Exception as e:
            print(f"Failed to fetch {url}, exception: {e}")
            restart_driver()
    # soup = BeautifulSoup(response.text, "lxml")
    soup = BeautifulSoup(html, "lxml")
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
            local_file = save_file(full_url, resource_folder, url)
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
    search_replace = sorted(search_replace, key=lambda x: len(x[0]), reverse=True)
    global entries
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
        time.sleep(random.random() * 10)
    return all_links


def parse_table(filepath):
    global pairs
    print("Parsing table from " + filepath + " ...")
    with open(filepath, "r", encoding="utf-8") as f:
        html_content = f.read()
    soup = BeautifulSoup(html_content, "html.parser")
    appendV_div = soup.find("div", class_="appendV")
    if appendV_div:
        first_child = appendV_div.find("table")
        if first_child:
            rows = first_child.find_all("tr")
            first_skipped = False
            for row in rows:
                if not first_skipped:
                    first_skipped = True
                    continue
                # cols = row.find_all(["td", "th"])
                cols = row.find_all("td")
                first_col = cols[0].get_text(strip=True)
                # print([col.get_text(strip=True) for col in cols])
                if len(cols) > 1:
                    second_col = cols[1]
                    a_tag = second_col.find("a")
                    if a_tag and "href" in a_tag.attrs:
                        pairs.add((first_col, a_tag["href"].split("ID=")[1]))


load_entries()
print(
    crawl(
        [
            "https://dict.variants.moe.edu.tw/dictView.jsp?la=0&ID=" + i
            for i in index_to_code
        ],
        "正文",
        [index_to_code[i] for i in index_to_code],
        "resources",
        [("/dictView.jsp?ID=" + i, index_to_code[i] + ".html") for i in index_to_code],
    )
)
driver.quit()
