(function($) {
    // Array of Month
    var month = ["January", "February", "Mach", "April", "May", "June", "July", "August", "September", "October", "November", "September"];
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var ListStore = {
        state: {
            items: []
        },
        newItem: function(text, status, label) {
            this.state.items.unshift({ text: text, status: status, label: label, isEditing: true });
        },
        load: function() {
            var dataString = window.localStorage.getItem('todo-list');
            if(dataString) {
                this.state.items = JSON.parse(dataString);
            }
            return true;
        },
        push: function() {
            window.localStorage.setItem('todo-list', JSON.stringify(this.state.items));
        }
    }

    /**
     * Header component
     */
    var Header = Vue.extend({
        template: '#todo-header',
        data: function() {
            return {
                date: '',
                weekDay: '',
                month: '',
                year: ''
            }
        },
        ready: function() {
            var d = new Date();
            this.date = d.getDate();
            this.weekDay = weekday[d.getDay()];
            this.month = month[d.getMonth()];
            this.year = d.getFullYear();
        },
        methods: {
            add: function(event) {
                ListStore.newItem('Type a new task and hit enter', 'undone', 'normal');
            }
        }
    });

    /**
     * Report Component
     */
    var Report = Vue.extend({
        template: '#todo-report',
        data: function() {
            return {
                listState: ListStore.state
            }
        },
        computed: {
            taskDone: function() {
                var total = 0;
                if(this.listState.items.length > 0) {
                    for(var i = 0; i < this.listState.items.length; i++) {
                         if(this.listState.items[i].status == "done") {
                             total++;
                         }
                    }
                }
                return total;
            },
            taskTotal: function() {
                return this.listState.items.length;
            }
        }
    });

    /**
     * Item component
     */
    var TodoItem = Vue.extend({
        template: '#todo-item',
        props: ['model'],
        data: function() {
            return {
                tempText: '',
            }
        },
        computed: {
            isDone: function() {
                return this.model.status == "done" ? true : false;
            }
        },
        methods: {
            save: function() {
                if(this.tempText != '') {
                    this.model.text = this.tempText;
                    this.model.isEditing = false;

                    // local storage
                    ListStore.push();
                }
            },
            markDone: function() {
                this.model.status = "done"

                // local storage
                ListStore.push();
            },
            edit: function() {
                this.model.isEditing = true;
                this.$nextTick(function() {
                    $(this.$el).find('input').focus();
                });
                this.tempText = this.model.text;
            },
            delete: function() {
                this.$dispatch('item-deleted', this.model);
                this.$nextTick(function() {
                    ListStore.push();
                });
            },
            showAction: function(event) {
                event.stopPropagation();
                var target = $(event.currentTarget);
                var actionList = target.find('.action-list');
        
                if(actionList.hasClass('show')) {
                    actionList.removeClass('show');
                } else {
                    $('.action-list').removeClass('show');
                    actionList.addClass('show');
                }   
            },
            showLabel: function(event) {
                event.stopPropagation();
                var target = $(event.currentTarget);
                var actionList = target.find('.action-popup');
        
                if(actionList.hasClass('show')) {
                    actionList.removeClass('show');
                } else {
                    $('.action-popup').removeClass('show');
                    actionList.addClass('show');
                }   
            },
            saveLabel: function(type) {
                this.model.label = type;

                // local storage
                ListStore.push();
            }
        }
    });


    /**
     * List component
     */
    var TodoList = Vue.extend({
        template: '#todo-list',
        props: ['collection'],
        components: {
            'todo-item': TodoItem
        },
        events: {
            'item-deleted': function(model) {
                this.collection.$remove(model);
            } 
        }
    });

    var todo = new Vue({
        el: '#app',
        data: function() {
            return {
                listState: ListStore.state
            }
        },
        ready: function() {
            ListStore.load();           
        },
        created: function() {
            window.addEventListener('click', this.hideAction);
        },
        methods: {
            /* Hide task action */
            hideAction: function() {
                $('.action-popup').removeClass('show');
            }
        }, 
        components: {
            'todo-header': Header,
            'todo-report': Report,
            'todo-list': TodoList
        }
    })
})(jQuery);