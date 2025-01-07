import re, urllib
import urllib.parse


def extract_css_urls(file_path, base_url=""):
    with open(file_path, "r", encoding="utf-8") as f:
        css_content = f.read()
    urls = re.findall(r"url\((.*?)\)", css_content)
    return [urllib.parse.urljoin(base_url, url.strip("'\"")) for url in urls]


css_file = "正字表/resources/webfont.css"
urls = extract_css_urls(css_file, "https://dict.variants.moe.edu.tw/")
with open("extracted_urls.txt", "w", encoding="utf-8") as extracted:
    extracted.write("\n".join(urls))
