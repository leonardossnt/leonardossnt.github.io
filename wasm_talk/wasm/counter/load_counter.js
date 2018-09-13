const wasm_counter = './wasm/counter/counter.wasm';
const js_counter = './wasm/counter/counter.js';

// Emscripten interface .js have a Module object defined;
// here we overwrite some of its defined functions to adapt to our application
var Module = {
    print: function(text) {
    	if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
    	console.log(text);
    },
    printErr: function(text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        console.error(text);
    }
};

function loadScriptAsync(url) {
	return new Promise(resolve => {
		var tag = document.createElement('script');
		tag.src = url;
		tag.onload = () => resolve();
		document.body.appendChild(tag);
	})
}

(async () => {
	var response = await fetch(wasm_counter);
	Module.wasmBinary = await response.arrayBuffer();
	
	loadScriptAsync(js_counter).then( () => {
		window.count = Module.cwrap('count', 'number', []);
		window.setCount = Module.cwrap('set_count', null, ['number']);
	});
})();