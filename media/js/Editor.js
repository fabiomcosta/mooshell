/*
 * Add PostEditor (and possibly other) functionality to the textareas
 */
var MooShellEditor = new Class({
	Extends: PostEditor,
	options: {
		tab: '  ',
	},
	initialize: function(el,options) {
		this.setOptions(options);
		this.tab = this.options.tab;
		this.parent(el,this.options);
		this.editorLabelFX = new Fx.Tween(this.element.getParent('p').getElement('.editor_label'))
		this.element.addEvents({
			focus: function() {
				this.editorLabelFX.start('opacity',0.15);
			}.bind(this),
			blur: function() {
				this.editorLabelFX.start('opacity',1);
			}.bind(this)
		});
	},
	
	filterByPairs: function(e){
		var charCode = String.fromCharCode(e.charCode);
		var stpair = this.options.smartTypingPairs[charCode];
		if(this.lastPair && ((new Date()).getTime() - this.lastPair.date) < 400){
		    var se = this.se();
		    if(this.lastPair.pair == charCode){
		        e.preventDefault();
		        return;
		    }
		}
		if (stpair){
			if ($type(stpair) == 'string') stpair = {pair : stpair};
			if (!stpair.scope || this.scope(stpair.scope)){
				var ss = this.ss(), se = this.se(), start = this.getStart();
				if (ss == se){
				    this.lastPair = {date: (new Date()).getTime(), pair: stpair.pair};
					this.value([start,stpair.pair,this.getEnd()]);
					this.selectRange(start.length,0);
				} else {
					e.preventDefault();
					this.ssKey = ss;
					this.seKey = se;
					this.value([start,charCode,this.slice(ss,se),stpair.pair,this.getEnd()]);
					this.selectRange(ss+1,se-ss);
				}
			}
			stpair = null;
			return true;
		}
		return false;
	}
});

/*
 * JS specific settings
 */
MooShellEditor.JS = new Class({
	Extends: MooShellEditor,
	options: {			
		smartTypingPairs: {
			'(': ')',
			'{': '}',
			'[': ']',
			"'": "'"
		}
	},
	initialize: function(el,options) {
		this.setOptions(options);
		this.parent(el,this.options);
		Layout.js_edit = this;
	}
});


/*
 * CSS specific settings
 */
MooShellEditor.CSS = new Class({
	Extends: MooShellEditor,
	options: {			
		smartTypingPairs: {
			'{': '}',
			'[': ']',
			"'": "'"
		}
	},
	initialize: function(el,options) {
		this.setOptions(options);
		this.parent(el,this.options);
		Layout.css_edit = this;
	}
});


/*
 * HTML specific settings
 */
MooShellEditor.HTML = new Class({
	Extends: MooShellEditor,
	options: {			
		smartTypingPairs: {
			"'": "'"
		}
	},
	initialize: function(el,options) {
		this.setOptions(options);
		this.parent(el,this.options);
		Layout.html_edit = this;
	}
});