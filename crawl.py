import requests
from bs4 import BeautifulSoup
import pickle
def get_title(url):
    request=requests.get(url)
    soup=BeautifulSoup(request.text,'html.parser')
    result=''
    for title in soup.find_all('title'):
        result+=title.get_text()
    return result
def main(mode=0):
    if 0==mode:
        with open('atom.pkl','rb') as inp:
            atom=pickle.load(inp)
            link_set=pickle.load(inp)
    else:
        atom=[]
        link_set=set()
    sitemap=requests.get('https://www.zh-tw.top/sitemap.xml').text
    while 0<sitemap.count('<loc>'):
        sitemap=sitemap[sitemap.index('<loc>')+len('<loc>'):]
        link=sitemap[:sitemap.index('</loc>')]
        if link not in link_set:
            title=get_title(link)
            print(title,link)
            if 0<title.count('一簡多繁辨析之'):
                atom.append([title,link])
            link_set.add(link)
    atom_file=open('atom.js','w',encoding='utf-8')
    atom_file.write(str(atom))
    with open('atom.pkl','wb') as outp:
        pickle.dump(atom,outp,pickle.HIGHEST_PROTOCOL)
        pickle.dump(link_set,outp,pickle.HIGHEST_PROTOCOL)
if '__main__'==__name__:
    import sys
    if 2==len(sys.argv):
        main(int(sys.argv[1]))
    else:
        main()