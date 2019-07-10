;(function(window, document, $){
    $(function(){
        $.ajaxSetup({
            error:function(xhr, status, error){
                console.log(arguments);
                alert(JSON.stringify(error));
            }
        });
    });

    function loadWebFragment(name, successCallback, errorCallback){
        $.get(name).done(function(data){
            if(data && data.control){
                var result = eval(data.control);
                if(successCallback) successCallback.call(result, data);
            }
        }).fail(errorCallback||function(){
            alert(JSON.stringify(arguments));
        });
    }

    window.loadWebFragment = loadWebFragment;
}(window, document, jQuery));