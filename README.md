# 大陸居民臺灣正體字講義

（注意，除來自中華民國教育部的公開內容外，本講義的其他內容均採用雙重授權協議發佈，原始碼和網站內容的授權條款分開。再利用、複製和改編前請仔細閱讀[LICENSE](LICENSE.md)檔案，並做好適當標注。）

## 歡迎來到《大陸居民臺灣正體字講義》

本倉庫是《大陸居民臺灣正體字講義》的中央主倉庫，依據本倉庫內容構建的網站如下：

- [《大陸居民臺灣正體字講義》（主站）](https://www.zh-tw.top/) - www.zh-tw.top （WordPress構建）
- [《大陸居民臺灣正體字講義》（靜態備用站）](https://static.zh-tw.top/) - static.zh-tw.top （純靜態構建）

## 主要檔案說明

- [一簡多繁辨析講義](%E4%B8%80%E7%B0%A1%E5%A4%9A%E7%B9%81%E8%BE%A8%E6%9E%90%E8%AC%9B%E7%BE%A9/): 此資料夾包含本講義中所有「一簡多繁辨析」系列的DOCX文案和它們生成的PNG圖片；
- [Sample_of_Mistakes](Sample_of_Mistakes/)：此資料夾包含本講義中收集的所有「正體字誤用」示例（圖片和CSV登記表）；
- [content_generator.py](content_generator.py)：此Python程式可生成用於導入WordPress的「一簡多繁辨析」系列的CSV檔案，在默認模式下還會調用其他程式同時生成「一簡一繁對應」系列的CSV檔案以及調用靜態網站生成器生成整個靜態站（需要將倉庫[PinyinZhuyinConverter](https://github.com/zhmgczh/PinyinZhuyinConverter)資料夾和倉庫[WebsiteGenerator](https://github.com/zhmgczh/WebsiteGenerator)資料夾放入本倉庫的根目錄中方可運行）；
- [Dictionaries](Dictionaries/)：此資料夾包含本講義生成所需的全部字表，並含有「一簡一繁對應」系列的Python生成器和生成的CSV檔案；
- [WordPress](WordPress/)：此資料夾包含搭建WordPress網站所需的模板（以及對模板的修改之處）、所有頁面的HTML原稿（以及對應的別名、程式碼片段等）、「漢字趣談」系列的文章HTML原稿和網站所需的部分外掛程式，其中包含網站首頁及文章頁面的樣本圖片；
- [extract_key_characters.py](extract_key_characters.py)：此Python程式可從「一簡多繁辨析」系列的CSV檔案中提取大陸居民經常混淆的易錯字，易混簡化字表在[simplified_characters.txt](simplified_characters.txt)，易混正體字表在[tranditional_characters.txt](tranditional_characters.txt)；
- [Fonts](Fonts/)：此資料夾包含本講義所需的全部字型檔案；
- [Logo](Logo/)：此資料夾包含本講義的各種圖標設計稿和矢量圖；
- [補充資料](%E8%A3%9C%E5%85%85%E8%B3%87%E6%96%99/)：此資料夾包含來自中華民國教育部的開源辭典資料。