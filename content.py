import os,docx,pickle,smtplib
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
def main(mode=0):
    if 0==mode:
        with open('atom.pkl','rb') as inp:
            atom=pickle.load(inp)
            indices=pickle.load(inp)
    else:
        atom=list()
        indices={-1}
    max_index=max(indices)
    current_directory=os.getcwd()
    file_names=set(os.listdir(current_directory))
    initialize_smtp()
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
            article+='<img src="'+img_url+'" alt="'+full_text[0]+'">'
            title=full_text[0][len('《大陸居民臺灣正體字講義》'):]
            send_article(title,article)
            atom.append(id)
            indices.add(index)
        if (not name.startswith('._')) and 0<name.count('→') and name.endswith('_01.png'):
            if name.replace('_01.png','.docx') not in file_names:
                print('Warning:',name,'does not have a corresponding docx file!')
    server.quit()
    difference_set=set(range(1,max_index+1)).difference(indices)
    if 0!=len(difference_set):
        print('Error: Indices not found ',difference_set)
    atom_file=open('atom.js','w',encoding='utf-8')
    atom_file.write(str(atom))
    with open('atom.pkl','wb') as outp:
        pickle.dump(atom,outp,pickle.HIGHEST_PROTOCOL)
        pickle.dump(indices,outp,pickle.HIGHEST_PROTOCOL)
if '__main__'==__name__:
    import sys
    if 2==len(sys.argv):
        main(int(sys.argv[1]))
    else:
        main()