var PRICE = 9.99;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        newSearch: "",
        lastSearch: "",
        loading: false,
        didDefault: false
    },
    methods: {
        defaultSearch: function() {
            this.items = [];
            this.loading = true;
            this.$http
                .get('/get-top')
                .then(function(res) {
                    this.items = res.data;
                    this.loading = false;
                    this.didDefault = true;
                });
        },
        onSubmit: function() {
            this.items = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function(res) {
                    this.lastSearch = this.newSearch;
                    this.items = res.data;
                    this.loading = false;
                    this.didDefault = false;
                });
        },
        addItem: function(index) {
            var item = this.items[index];
            var found = false;

            this.total += PRICE;
            
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id == item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            };

            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                })
            }   
        },
        inc: function(item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function(item) {
            item.qty--;
            this.total -= PRICE;

            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        },
    },
    filters: {
        currency: function(price) {
            return '£'.concat(price.toFixed(2));
        }
    },
    mounted: function() {
        this.defaultSearch();
        this.didDefault = true;
    }
});