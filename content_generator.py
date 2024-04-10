import os,docx,pickle,csv,smtplib,hashlib,io,base64,json
from urllib.parse import quote
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from PIL import Image
from tabulate import tabulate
from PinyinZhuyinConverter.Converter import Converter
def insert_picture(text,imgs,id):
    joint_text=''.join(text)
    if joint_text.count('||')!=len(imgs) or joint_text.count('|')!=len(imgs)*2:
        print('Warning: the | and the number of pictures do not match!')
        print(joint_text)
        return text
    index=1
    text_index=0
    for image in imgs:
        image_bytesIO=io.BytesIO()
        image.save(image_bytesIO,format='PNG')
        binary_data=image_bytesIO.getvalue()
        base64_encoded=base64.b64encode(binary_data).decode('utf-8')
        html_img_tag=f'<img src="data:image/png;base64,{base64_encoded}" alt="《大陸居民臺灣正體字講義》一簡多繁辨析條目「'+id+'」疑難雜字('+str(index)+'")>'
        while 0==text[text_index].count('||'):
            text_index+=1
        text[text_index]=text[text_index].replace('||',html_img_tag,1)
        index+=1
    return text
converter=Converter()
converter_log=set()
def convert_all_pinyin(text):
    all_pinyin=converter.extract_all_pinyin(text)
    for pinyin in all_pinyin:
        zhuyin=converter.convert_pinyin(pinyin)[1]
        text=text.replace(pinyin,pinyin+'~'+zhuyin)
        converter_log.add((pinyin,zhuyin))
    return text
def write_converter_log(filename):
    with open(filename,mode='w',encoding='utf-8') as csv_file:
        csv_writer=csv.writer(csv_file)
        for log in converter_log:
            csv_writer.writerow(list(log))
def get_text(filename,id):
    doc=docx.Document(filename)
    imgs=[]
    for inline_shape in doc.inline_shapes:
        img_id=inline_shape._inline.graphic.graphicData.pic.blipFill.blip.embed
        image_part=doc.part.related_parts[img_id]
        image=Image.open(io.BytesIO(image_part._blob))
        imgs.append(image)
    full_text=[]
    bianyi_count=0
    for para in doc.paragraphs:
        para_text=convert_all_pinyin(para.text)
        if para_text.startswith('辨意：'):
            bianyi_count+=1
            text=para_text
            text=text.replace('辨意：','辨意：<br/>')
            text=text.replace('。','。<br/>')
            if text.endswith('<br/>'):
                text=text[:-len('<br/>')]
            table=text.split('<br/>')
            for i in range(len(table)):
                table[i]=[table[i]]
            text=tabulate(table,tablefmt='unsafehtml')
            full_text.append(text)
        else:
            full_text.append(para_text)
    if 1!=bianyi_count:
        print('Error in',filename,id,': the number of 辨意 paragraph is not 1!')
        exit()
    full_text=insert_picture(full_text,imgs,id)
    return full_text
origin_email_address=None
target_email_address=None
server=None
# email_settings.txt
# hostname
# port
# username
# password
# origin_email_address
# target_email_address
def initialize_smtp():
    global origin_email_address,target_email_address,server
    with open('email_settings.txt','r',encoding='utf-8') as setting_reader:
        settings=setting_reader.read().split('\n')
        hostname=settings[0]
        port=int(settings[1])
        username=settings[2]
        password=settings[3]
        origin_email_address=settings[4]
        target_email_address=settings[5]
    server=smtplib.SMTP(hostname,port)
    server.set_debuglevel(1)
    server.starttls()
    server.login(username,password)
def send_article(subject,article):
    global origin_email_address,target_email_address
    msg=MIMEMultipart()
    msg['From']=origin_email_address
    msg['To']=target_email_address
    msg['Subject']=subject
    msg.attach(MIMEText(article,'html'))
    text=msg.as_string()
    server.sendmail(origin_email_address,target_email_address,text)
# sample_of_mistakes.csv
# filename,character,comment
mistakes_dict={}
def load_mistakes():
    global mistakes_dict
    with open('Sample_of_Mistakes/sample_of_mistakes.csv',mode='r',encoding='utf-8') as mistakes_file:
        mistakes=csv.reader(mistakes_file)
        filename_index=character_index=comment_index=-1
        for line in mistakes:
            if -1==filename_index or -1==character_index or -1==comment_index:
                filename_index=line.index('filename')
                character_index=line.index('character')
                comment_index=line.index('comment')
            else:
                characters=line[character_index].split('|')
                for character in characters:
                    if character not in mistakes_dict:
                        mistakes_dict[character]=[]
                    mistakes_dict[character].append((line[filename_index],line[comment_index]))
def get_mistakes(character):
    global mistakes_dict
    if character not in mistakes_dict:
        return ''
    entries=mistakes_dict[character]
    addition='<br/>\n<p>誤用舉例（「'+character+'」）：</p>\n<div style="text-align:center;">\n'
    for entry in entries:
        img_url='https://cdn.githubraw.com/zhmgczh/Notes-on-Traditional-Chinese-Characters-in-Taiwan-for-Mainland-Chinese-Residents/master/Sample_of_Mistakes/'+quote(entry[0])
        addition+='<a href="'+img_url+'" target="_blank"><img src="'+img_url+'" alt="'+entry[1].replace('\\n',' ')+'"></a><br/>\n'
        addition+='<div style="text-align:center;">'+entry[1].replace('\\n','<br/>\n')+'</div>\n'
    addition+='</div>'
    return addition
final_json={}
stroke_json={}
dictionary_links_html='''
<tag id="stroke_pos"></tag>
<center><button onclick="close_stroke()">關閉「筆順學習」</button></center>
<center>
  <div id="stroke_player" style="width:348px;height:470px;display:none;">載入中，請稍後...</div>
</center>
<script src="https://stroke-order.learningweb.moe.edu.tw/js/playerShare.js"></script>
<script>
    function jumpTo(anchor_id) {
        var url = location.href;
        location.href = '#' + anchor_id;
        history.replaceState(null, null, url);
    }
    var stroke_id = '';
    function load_stroke(current_id) {
        var my_div = document.getElementById('stroke_player');
        if (current_id != stroke_id) {
            var playerShare = new PlayerShare('https://stroke-order.learningweb.moe.edu.tw/', current_id, '0', 'zh_TW');
            playerShare.load();
            my_div.style.removeProperty('display');
            stroke_id = current_id;
            jumpTo('stroke_pos');
        }
        else {
            my_div.style['display'] = 'none';
            my_div.innerHTML = '';
            stroke_id = '';
        }
    }
    function close_stroke() {
        var my_div = document.getElementById('stroke_player');
        my_div.style['display'] = 'none';
        my_div.innerHTML = '';
        stroke_id = '';
    }
</script>'''
dictionary_dict={'《國語辭典》（萌典）':'https://www.moedict.tw/#####',
                 '國字標準字體筆順學習網':'https://stroke-order.learningweb.moe.edu.tw/charactersQueryResult.do?words=#####',
                 '《國語辭典簡編本》':'https://dict.concised.moe.edu.tw/search.jsp?word=#####',
                 '《重編國語辭典修訂本》':'https://dict.revised.moe.edu.tw/search.jsp?word=#####',
                 '《成語典》':'https://dict.idioms.moe.edu.tw/idiomList.jsp?idiom=#####',
                 '中國哲學書電子化計劃':'https://ctext.org/dictionary.pl?if=gb&char=#####',
                 '漢語多功能字庫（香港）':'https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=#####'}
def load_dictionaries():
    global final_json,stroke_json
    with open('Dictionaries/final_table_normalized_renewed.json') as final_table:
        final_json_tmp=json.load(final_table)
    with open('Dictionaries/stroke_table_normalized_renewed.json') as stroke_table:
        stroke_json_tmp=json.load(stroke_table)
    for key in final_json_tmp:
        for sub_key in final_json_tmp[key]:
            if sub_key not in final_json or ''==final_json[sub_key]:
                final_json[sub_key]=final_json_tmp[key][sub_key]
    for key in stroke_json_tmp:
        for sub_key in stroke_json_tmp[key]:
            if sub_key not in stroke_json or ''==stroke_json[sub_key]:
                stroke_json[sub_key]=stroke_json_tmp[key][sub_key]
def get_dictionary_links(characters):
    global final_json,stroke_json,dictionary_links_html,dictionary_dict
    table=[['']+characters]
    finals=['《教育部異體字字典》']
    for character in characters:
        if character in final_json and ''!=final_json[character]:
            finals.append('<a href="https://dict.variants.moe.edu.tw/dictView.jsp?ID='+final_json[character]+'" target="_blank">打開</a>')
        else:
            finals.append('<a href="https://dict.variants.moe.edu.tw/search.jsp?QTP=0&WORD='+quote(character)+'" target="_blank">打開</a>')
    table.append(finals)
    for dictionary in dictionary_dict:
        entry=[dictionary]
        for character in characters:
            entry.append('<a href="'+dictionary_dict[dictionary].replace('#####',quote(character))+'" target="_blank">打開</a>')
        table.append(entry)
    strokes=['筆順學習']
    for character in characters:
        if character in stroke_json and ''!=stroke_json[character]:
            strokes.append('<button onclick="load_stroke('+"'"+stroke_json[character]+"'"+');">開關</button>')
        else:
            strokes.append('<a href="https://stroke-order.learningweb.moe.edu.tw/charactersQueryResult.do?words='+quote(character)+'" target="_blank">打開</a>')
    table.append(strokes)
    return '<br/>\n<p>文獻連結：</p>\n<div style="text-align:center;">\n'+tabulate(table,tablefmt='unsafehtml')+dictionary_links_html+'</div>'
def main(mode=0,email=False):
    if 0==mode:
        with open('atom.pkl','rb') as inp:
            atom=pickle.load(inp)
            indices=pickle.load(inp)
            hashcodes=pickle.load(inp)
    else:
        atom=set()
        indices={-1}
        hashcodes={}
    max_index=max(indices)
    current_directory=os.getcwd()
    file_names=set(os.listdir(current_directory))
    load_mistakes()
    load_dictionaries()
    if email:
        initialize_smtp()
    else:
        article_library=[['id','title','content','excerpt','category']]
    for name in file_names:
        if (not name.startswith('._')) and (not name.startswith('.~')) and 0<name.count('→') and name.endswith('.docx'):
            index=int(name.split('.')[0])
            max_index=max(index,max_index)
            id=name.split('.')[1].strip()
            corresponding_png=name.replace('.docx','_01.png')
            if corresponding_png not in file_names:
                print('Error:',name,'does not have a corresponding png file!')
                continue
            full_text=get_text(name,id)
            article='<p>'
            for i in range(1,len(full_text)-1):
                article+=full_text[i]+'</p>\n<p>'
            article+=full_text[-1]+'</p>\n'
            img_url='https://cdn.githubraw.com/zhmgczh/Notes-on-Traditional-Chinese-Characters-in-Taiwan-for-Mainland-Chinese-Residents/master/'+quote(corresponding_png)
            article+='<a href="'+img_url+'" target="_blank"><img src="'+img_url+'" alt="'+full_text[0]+'"></a>'
            characters=id.split('→')[0].split('、')
            for character in characters:
                article+=get_mistakes(character)
            article+=get_dictionary_links(characters)
            title=full_text[0][len('《大陸居民臺灣正體字講義》'):]
            h=hashlib.new('sha256')
            h.update((str(id)+'#####'+title+'#####'+article+'#####'+full_text[0]+'#####').encode())
            if index in indices and index in hashcodes and h.hexdigest()==hashcodes[index]:
                continue
            else:
                hashcodes[index]=h.hexdigest()
                print(id)
            if email:
                send_article(title,article)
            else:
                article_library.append([index,title,article,full_text[0],'一簡多繁辨析'])
            atom.add(title)
            indices.add(index)
        if (not name.startswith('._')) and 0<name.count('→') and name.endswith('_01.png'):
            if name.replace('_01.png','.docx') not in file_names:
                print('Warning:',name,'does not have a corresponding docx file!')
    if email:
        server.quit()
    else:
        with open('import.csv','w',encoding='utf-8') as import_file:
            writer=csv.writer(import_file)
            writer.writerows(article_library)
    difference_set=set(range(1,max_index+1)).difference(indices)
    if 0!=len(difference_set):
        print('Error: Indices not found ',difference_set)
    atom_file=open('atom.js','w',encoding='utf-8')
    atom_file.write(str(list(atom)))
    write_converter_log('pinyin_zhuyin_converter_log.csv')
    with open('atom.pkl','wb') as outp:
        pickle.dump(atom,outp,pickle.HIGHEST_PROTOCOL)
        pickle.dump(indices,outp,pickle.HIGHEST_PROTOCOL)
        pickle.dump(hashcodes,outp,pickle.HIGHEST_PROTOCOL)
if '__main__'==__name__:
    import sys
    if 3==len(sys.argv):
        main(int(sys.argv[1]),bool(sys.argv[2]))
    elif 2==len(sys.argv):
        main(int(sys.argv[1]))
    else:
        main()