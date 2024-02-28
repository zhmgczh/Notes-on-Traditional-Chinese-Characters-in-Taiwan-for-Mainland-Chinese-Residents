function set_cookie(cname, cvalue, exdays = 3650) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = 'expires=' + d.toGMTString();
  document.cookie = cname + '=' + encodeURI(cvalue) + ';' + expires;
}
function get_cookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; ++i) {
    var c = ca[i].trim();
    if (0 == c.indexOf(name)) {
      return decodeURI(c.substring(name.length, c.length));
    }
  }
  return '';
}
function add_favorite() {
  var title = document.title;
  var URL = document.URL;
  if (document.all) {
    window.external.addFavorite(URL, title);
  }
  else if (window.sidebar) {
    try {
      window.sidebar.addPanel(title, URL, '');
    }
    catch (e) {
      alert("抱歉, 您所使用的瀏覽器無法完成此操作.\n\n加入收藏失敗, 請使用Ctrl+D進行添加.");
    }
  }
}
function get_request(url) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send(null);
  const result = xhr.responseText;
  return result;
}
function checkbox_onclick(s) {
  var checkbox = document.getElementById('yijianduofanbianxi_' + s);
  var records_array = '' != records ? records.split(',') : [];
  if (checkbox.checked && !records_array.includes(s)) {
    records_array[records_array.length] = s;
  }
  else if ((!checkbox.checked) && records_array.includes(s)) {
    records_array.splice(records_array.indexOf(s), 1);
  }
  records = '';
  for (var i = 0; i < records_array.length; ++i) {
    if (0 != i) {
      records += ',';
    }
    records += records_array[i];
  }
  set_cookie('records', records);
}
var records = get_cookie('records');
if ('' != records) {
  set_cookie('records', records);
}
var records_array = ('' != records ? records.split(',') : []).map(Number);
result.sort((a, b) => a[0].localeCompare(b[0], 'zh-Hant-TW'));
var main_string = '';
for (var i = 0; i < result.length; ++i) {
  main_string += '<tr><td>' + result[i][0].substring('一簡多繁辨析之'.length) + '</td><td>' + '<a href="https://www.zh-tw.top/一簡多繁辨析/' + result[i][0] + '" target="_blank">點擊打開</a>' + '</td><td>' + '<input type="checkbox" id="yijianduofanbianxi_' + result[i][1] + '" onclick="checkbox_onclick(' + "'" + result[i][1] + "'" + ')"' + (records_array.includes(result[i][1]) ? ' checked' : '') + '>' + '</td></tr>';
}
var main = document.getElementById('main_一簡多繁辨析_table');
main.innerHTML = main_string;
var my_table = null;
try {
  $(document).ready(function () {
    my_table = $('#myTable').DataTable({
      'ordering': false, 'stateSave': true, 'stateDuration': 60 * 60 * 24 * 3650, search: { smart: true }, language: {
        "decimal": "",
        "emptyTable": "表中無可顯示之條目",
        "info": "正在顯示編號在_START_至_END_之間的條目（共_TOTAL_條）",
        "infoEmpty": "表中無可顯示之條目",
        "infoFiltered": "（從全部_MAX_條條目中篩選）",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "每頁顯示_MENU_條",
        "loadingRecords": "正在加載……",
        "processing": "正在處理……",
        "search": "查詢：",
        "zeroRecords": "沒有找到匹配的條目",
        "paginate": {
          "first": "首頁",
          "last": "尾頁",
          "next": "下一頁",
          "previous": "上一頁"
        },
        "aria": {
          "sortAscending": ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
        }
      }
    });
  });
} catch (error) {
  window.location.reload();
}
function jump_page() {
  page_index_jump = parseInt(document.getElementById('page_index_jump').value) - 1;
  if (isNaN(page_index_jump) || page_index_jump < 0 || page_index_jump >= my_table.page.info().pages) {
    return;
  }
  my_table.page(page_index_jump).draw(false);
}