import os,docx,pickle,csv,smtplib,hashlib
from urllib.parse import quote
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
def get_text(filename):
    doc=docx.Document(filename)
    full_text=[]
    for para in doc.paragraphs:
        full_text.append(para.text)
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
    addition='<br/>\n<div style="text-align:center;">\n'
    for entry in entries:
        img_url='https://raw.githubusercontent.com/zhmgczh/Notes-on-Traditional-Chinese-Characters-in-Taiwan-for-Mainland-Chinese-Residents/master/Sample_of_Mistakes/'+quote(entry[0])
        addition+='<a href="'+img_url+'" target="_blank"><img src="'+img_url+'" alt="'+entry[1].replace('\\n',' ')+'"></a><br/>\n'
        addition+='<div style="text-align:center;">'+entry[1].replace('\\n','<br/>\n')+'</div>\n'
    addition+='</div>'
    return addition
def main(mode=0,email=False):
    if 0!=mode:
        with open('atom.pkl','rb') as inp:
            atom=pickle.load(inp)
            indices=pickle.load(inp)
            hashcodes=pickle.load(inp)
    else:
        atom=[]
        indices={-1}
        hashcodes={}
    max_index=max(indices)
    current_directory=os.getcwd()
    file_names=set(os.listdir(current_directory))
    load_mistakes()
    if email:
        initialize_smtp()
    else:
        article_library=[['id','title','content','excerpt','category']]
    for name in file_names:
        if (not name.startswith('._')) and 0<name.count('→') and name.endswith('.docx'):
            index=int(name.split('.')[0])
            max_index=max(index,max_index)
            id=name.split('.')[1].strip()
            corresponding_png=name.replace('.docx','_01.png')
            if corresponding_png not in file_names:
                print('Error:',name,'does not have a corresponding png file!')
                continue
            full_text=get_text(name)
            article='<p>'
            for i in range(1,len(full_text)-1):
                article+=full_text[i]+'</p>\n<p>'
            article+=full_text[-1]+'</p>\n'
            img_url='https://raw.githubusercontent.com/zhmgczh/Notes-on-Traditional-Chinese-Characters-in-Taiwan-for-Mainland-Chinese-Residents/master/'+quote(corresponding_png)
            article+='<a href="'+img_url+'" target="_blank"><img src="'+img_url+'" alt="'+full_text[0]+'"></a>'
            for character in id.split('→')[0].split('、'):
                article+=get_mistakes(character)
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
            atom.append(title)
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
    atom_file.write(str(atom))
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