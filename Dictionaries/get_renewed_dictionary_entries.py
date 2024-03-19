import json,requests,time,random,sys,os,pickle
from urllib.parse import quote
from collections import OrderedDict
headers={'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
         'Accept-Encoding':'gzip, deflate, br, zstd',
         'Accept-Language':'en,zh-TW;q=0.9,zh;q=0.8',
         'Cache-Control':'max-age=0',
         'Connection':'keep-alive',
         #'Cookie':'_gid=GA1.3.1294110943.1710470589; _ga_E4NV6LGJEQ=GS1.1.1710794575.8.1.1710795175.0.0.0; _ga_8RPBR9G06C=GS1.1.1710794576.8.1.1710795175.0.0.0; _ga=GA1.1.1155386258.1710285071; _ga_S4K4QEWN8T=GS1.1.1710795305.17.1.1710795328.0.0.0; _ga_TSW7HBKV2D=GS1.1.1710795305.17.1.1710795328.0.0.0; _ga_B185ZR663X=GS1.1.1710795305.17.1.1710795328.0.0.0; JSESSIONID=DA5A04E70CC3BAB7B39090B39C2BBB2B; _ga_DY7KJGF3R2=GS1.1.1710801701.3.1.1710801872.0.0.0; _ga_P8X29BZ1XP=GS1.1.1710801701.3.1.1710801872.0.0.0',
         'Host':'dict.variants.moe.edu.tw',
         'Sec-Ch-Ua':'"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
         'Sec-Ch-Ua-Mobile':'?0',
         'Sec-Ch-Ua-Platform':'"macOS"',
         'Sec-Fetch-Dest':'empty',
         'Sec-Fetch-Mode':'navigate',
         'Sec-Fetch-Site':'same-origin',
         'Upgrade-Insecure-Requests':'1',
         'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}
session=requests.Session()
entries={}
def load_entries():
    if os.path.isfile('entries.pkl'):
        with open('entries.pkl','rb') as inp:
            global entries
            entries=pickle.load(inp)
def write_entries():
    with open('entries.pkl','wb') as outp:
        global entries
        pickle.dump(entries,outp,pickle.HIGHEST_PROTOCOL)
def restart_session():
    global session
    time.sleep(random.random()*3)
    session=requests.Session()
def get_id_from_response(response):
    html=response.text
    normal_tag=html.find("data-tp='正'")
    if -1==normal_tag:
        id=''
    else:
        id=html[:normal_tag].split('href="dictView.jsp?ID=')[-1].split('&q=1"')[0]
    if ''==id:
        url_tag=html.find("location.href='dictView.jsp?ID=")
        if -1!=url_tag:
            id=html[url_tag+len("location.href='dictView.jsp?ID="):].split("';</script>")[0]
    return id
def get_id(character,force_found=False):
    global session,entries
    url='https://dict.variants.moe.edu.tw/search.jsp?QTP=0&WORD='+quote(character)
    print('Getting ID of',character,'from',url,'( force_found =',force_found,end=' ) : ')
    sys.stdout.flush()
    successful=False
    while not successful:
        try:
            response=session.get(url,headers=headers)
            id=get_id_from_response(response)
            successful=True
            if force_found and ''==id:
                successful=False
                restart_session()
        except:
            restart_session()
    if ''!=id:
        entries[character]=id
        write_entries()
    print(id)
    sys.stdout.flush()
    return id
def main():
    global entries
    load_entries()
    with open('final_table_normalized.json') as final_table:
        final_json=json.load(final_table)
    with open('stroke_table_normalized.json') as stroke_table:
        stroke_json=json.load(stroke_table)
    for key in final_json:
        for sub_key in final_json[key]:
            if sub_key in entries:
                final_json[key][sub_key]=entries[sub_key]
            else:
                final_json[key][sub_key]=get_id(sub_key,''!=final_json[key][sub_key])
    final=OrderedDict(sorted(final_json.items(),reverse=True,key=lambda t:len(final_json[t[0]].items())))
    stroke=OrderedDict(sorted(stroke_json.items(),reverse=True,key=lambda t:len(final_json[t[0]].items())))
    for key in final.keys():
        final[key]=OrderedDict(sorted(final[key].items(),reverse=True,key=lambda t:(0 if ''==final[key][t[0]] else 1)+(0 if ''==stroke[key][t[0]] else 1)))
        stroke[key]=OrderedDict(sorted(stroke[key].items(),reverse=True,key=lambda t:(0 if ''==final[key][t[0]] else 1)+(0 if ''==stroke[key][t[0]] else 1)))
    with open('final_table_normalized_renewed.json','w',encoding='utf-8') as f:
        json.dump(final,f)
    with open('stroke_table_normalized_renewed.json','w',encoding='utf-8') as f:
        json.dump(stroke,f)
if '__main__'==__name__:
    main()