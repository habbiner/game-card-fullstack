const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoginVisible: true
        };
    },
    methods: {
        toggleComponents() {
            this.isLoginVisible = !this.isLoginVisible;
        }
    }
}).mount("#app");
