;(function(window, document, $){
    var HelloView = {
        name : "Hello, I'm HelloView!",
        number:0
    };


    HelloView.add = function(){
        $('#number').html(this.number++);
    };

    HelloView.display = function(){
        $('#btnClickMe').on('click', function(){
            HelloView.add();
        });
    };


    return HelloView;
}(window, document, jQuery));