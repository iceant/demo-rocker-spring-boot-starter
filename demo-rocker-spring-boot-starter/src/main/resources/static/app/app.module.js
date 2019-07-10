;(function(window, document, $){
    M.module = function(){
        var args = [].slice.call(arguments),
            fn = args.pop(),
            parts = args[0] && args[0] instanceof Array ? args[0] : args,
            modules = [],
            modId = '',
            i = 0,
            ilen = parts.length,
            parent, j, jlen;
        while(i<ilen){
            if(typeof parts[i]==='string'){
                parent = this;
                modId = parts[i].replace(/^M\./, '').split('.');
                for(j = 0, jlen = modId.length; j<jlen; j++){
                    parent = parent[modId[j]]||false;
                }
                modules.push(parent);
            }else{
                modules.push(parts[i]);
                i++;
            }
            fn.apply(null, modules);
        }
    };
}(window, document, jQuery));