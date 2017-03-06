// User defninition

// 0: Red, 1: Orange, 2: Yellow, 3: Green Yellow, 4: Green, 5: Aqua Green,
// 6: Cyan, 7: Skyblue, 8: Blue, 9: Purple, 10: Magenta, 11: Pink, 12: White
var text_colors = [{"norm": "#ff0000",  "high": "#ff5555"}, 
                   {"norm": "#ff7f00",  "high": "#ffaa55"}, 
                   {"norm": "#ffff00",  "high": "#ffff55"}, 
                   {"norm": "#7fff00",  "high": "#aaff55"}, 
                   {"norm": "#00ff00",  "high": "#55ff55"}, 
                   {"norm": "#00ff7f",  "high": "#55ffaa"},
                   {"norm": "#00ffff",  "high": "#55ffff"}, 
                   {"norm": "#007fff",  "high": "#55aaff"}, 
                   {"norm": "#0000ff",  "high": "#5555ff"}, 
                   {"norm": "#7f00ff",  "high": "#aa55ff"}, 
                   {"norm": "#ff00ff",  "high": "#ff55ff"}, 
                   {"norm": "#ff007f",  "high": "#ff55aa"},
                   {"norm": "#ffffff",  "high": "#ffffff"}, 
                   {"norm": "#ff7f7f",  "high": "#ffaaaa"}, 
                   {"norm": "#ff7fff",  "high": "#ffaaff"}, 
                   {"norm": "#7f7fff",  "high": "#aaaaff"}];

var han_specs = "　　、。·‥…¨〃­―∥＼∼‘’" +
                "“”〔〕〈〉《》「」『』【】±×" +
                "÷≠≤≥∞∴°′″℃Å￠￡￥♂♀" +
                "∠⊥⌒∂∇≡≒§※☆★○●◎◇◆" +
                "□■△▲▽▼→←↑↓↔〓≪≫√∽" +
                "∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢　" +
                "　⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿" +
                "ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧" +
                "♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎" +
                "☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜" +
                "№㏇™㏂㏘℡　　　　　　　　　　";

var font_imgs = [ { "name": "basic_img",  "src": "img/basic_norm.png" },
                  { "name": "han_img",    "src": "img/han_iyg.png" },
                  { "name": "natja_img",  "src": "img/natja.png" },
                  { "name": "spe_img",    "src": "img/specs.png" },
                  { "name": "ani_img",    "src": "img/ani_symbol.png" } ];

var main_def_color = 4;
