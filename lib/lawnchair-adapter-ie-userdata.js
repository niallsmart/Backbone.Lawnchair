/**
 * ie userdata adaptor 
 *
 */
Lawnchair.adapter('ie-userdata', {
  valid: function () {
    return typeof(document.body.addBehavior) != 'undefined';
  },
	init:function(){
		var s = document.createElement('span');
		s.style.behavior = 'url(\'#default#userData\')';
		s.style.position = 'absolute';
		s.style.left = 10000;
		document.body.appendChild(s);
		this.storage = s;
		this.storage.load('lawnchair');
	},

	get:function(key, callback){
		
		var obj = JSON.parse(this.storage.getAttribute(key) || 'null');
        if (obj) {
            obj.key = key;

        }
        if (callback)
                callback(obj);
        return this;
	},

	save:function(obj, callback){
		var id = obj.key || 'lc' + this.uuid();
	    delete obj.key;
		this.storage.setAttribute(id, JSON.stringify(obj));
		this.storage.save('lawnchair');		
        obj.key = id;
		if (callback){
			callback(obj);
		}
        return this;
	},

	all:function(callback){
		var cb = callback;
		var ca = this.storage.XMLDocument.firstChild.attributes;
		var yar = [];
		var v,o;
		// yo ho yo ho a pirates life for me
		for (var i = 0, l = ca.length; i < l; i++) {
			v = ca[i];
			o = JSON.parse(v.nodeValue || 'null');
			if (o) {
				o.key = v.nodeName;
				yar.push(o);
			}
		}
		if (cb)
			cb(yar);
        return this;
	},
	remove:function(keyOrObj,callback) {
		var key = (typeof keyOrObj == 'string') ?  keyOrObj : keyOrObj.key;		
		this.storage.removeAttribute(key);
		this.storage.save('lawnchair');
		if(callback)
		  callback();
        return this;
	}, 
	nuke:function(callback) {
		var that = this;		  
		this.all(function(r){
			for (var i = 0, l = r.length; i < l; i++) {
				if (r[i].key)
					that.remove(r[i].key);
			}
			if(callback) 
				callback();
		});
        return this;
	}
});
