;(function(window, document, $){
    var HelloView = V.extend({
        name: "Hello, I'm HelloView!",
        number:0,
        add: function(){
            var msg = this.msg('@rocker.$r.msg("msg.clicked_n_times")', ++this.number);
            this.$('#number').html(this.name+' => '+msg);
        },
        bindEvent:function(){
            var view = this;
            view.$('#btnClickMe').on('click', function(e){
                e.preventDefault();
                view.trigger('btnClickMe.click', this);
            });
        },
        handleEvent:function(){
            var view = this;
            view.listen('btnClickMe.click', function(){
                view.add();
            });
        }
    });
    return new HelloView();
}(window, document, jQuery));