const lua_wasm = './wasm/luapoc/main.wasm';
const lua_js = './wasm/luapoc/main.js';
const result_div = document.getElementById("lua_result");
const source_div = document.getElementById("lua_source");

// Emscripten interface .js have a Module object defined;
// here we overwrite some of its defined functions to adapt to our application
var Module = {
    postRun: [
        luaChanged
    ],
    print: function(text) {
    	if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
    	console.log(text);
    	if (text != "emsc") result_div.innerHTML += "<br>\n" + text;
    },
    printErr: function(text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        if (0) { // XXX disabled for safety typeof dump == 'function') {
            dump(text + '\n'); // fast, straight to the real console
        } else {
            console.error(text);
        }
    }
};

var timer;
function luaChanged() {
	clearTimeout(timer);
	code = source_div.value;
	timer = setTimeout( () => {
		result_div.innerHTML = "";
		runLuaScript(code);
	}, 500);
}

function loadScriptAsync(url) {
	return new Promise(resolve => {
		var tag = document.createElement('script');
		tag.src = url;
		tag.onload = () => resolve();
		document.body.appendChild(tag);
	})
}

(async () => {
	// if response gets false, probably wasm doesn't exist; so we suppose
	// its an asm.js compilation and load Emscripten interface js file only
	var response = await fetch(lua_wasm);
	if (response.ok) {
		Module.wasmBinary = await response.arrayBuffer();
	}
	
	loadScriptAsync(lua_js).then( () => {
		// do cwraps after loading Emscripten interface js
		runLuaScript = Module.cwrap('run_lua', 'number', ['string']);
	});
})();