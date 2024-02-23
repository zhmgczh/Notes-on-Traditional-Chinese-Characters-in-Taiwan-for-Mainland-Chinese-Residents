import os
from urllib.parse import quote
current_directory=os.getcwd()
file_names=set(os.listdir(current_directory))
blog=open('blog.xml','r',encoding='utf-8').read()
blog_backup=blog
replace_list=[]
while 0<blog.count("<title type='text'>一簡多繁辨析之"):
    blog=blog[blog.index("<title type='text'>一簡多繁辨析之")+len("<title type='text'>一簡多繁辨析之"):]
    title=blog[:blog.index('</title>')]
    title=title.replace('「','')
    title=title.replace('」','')
    file_name=''
    for name in file_names:
        if (not name.startswith('._')) and title+'_01.png' in name:
            if ''!=file_name:
                print('Warning:',title,name,file_name,'!')
            file_name=name
    if ''==file_name:
        print('Warning:',title,'!')
    end_index=blog.index('_01.png"')+len('_01.png')
    start_index=blog[:end_index].index('a href="')+len('a href="')
    ori_url=blog[start_index:end_index]
    new_url='https://raw.githubusercontent.com/zhmgczh/Notes-on-Traditional-Chinese-Characters-in-Taiwan-for-Mainland-Chinese-Residents/master/'+quote(file_name)
    replace_list.append((ori_url,new_url))
print(replace_list)
new_file=open('blog_edited.xml','w',encoding='utf-8')
for rep in replace_list:
    blog_backup=blog_backup.replace(rep[0],rep[1])
new_file.write(blog_backup)