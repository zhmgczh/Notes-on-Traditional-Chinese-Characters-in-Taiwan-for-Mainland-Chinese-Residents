import os


def get_all_files(folder_path):
    absolute_paths = []
    for root, _, files in os.walk(folder_path):
        for file in files:
            absolute_paths.append(os.path.abspath(os.path.join(root, file)))
    return absolute_paths


folder_path = "./正文/"
all_files = get_all_files(folder_path)
with open("command.sh", "w", encoding="utf-8") as command:
    command.write("git status\n")
    file_index = 0
    for file_path in all_files:
        command.write(f"git add {file_path}\n")
        file_index += 1
        if 50 == file_index:
            command.write('git commit -m "Update."\n')
            command.write("git push https://zhmgczh:<<api_key>>@github.com/zhmgczh/Notes-on-Traditional-Chinese-Characters-in-Taiwan-for-Mainland-Chinese-Residents.git\n")
            command.write("sleep $((RANDOM % 4))\n")
            file_index = 0
