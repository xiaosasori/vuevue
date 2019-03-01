import Vue from 'vue'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import FormAlert from './components/Shared/FormAlert.vue'

import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

Vue.component('form-alert', FormAlert)
import Vuetify from 'vuetify';

Vue.use(Vuetify, {
  theme: {
    primary: '#26A69A',
    secondary: '#80CBC4',
    accent: '#EF5350',
    error: '#D50000',
    warning: '#FFB300',
    info: '#2196f3',
    success: '#4caf50'
  }
});

Vue.use(VueApollo)
// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // Include auth token with requests made to backend
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    if(!localStorage.token){
      localStorage.setItem('token', '')
    }
    // operation adds the token to an authentication header which sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if(networkError){
      console.log('networkError', networkError)
    }
    if(graphQLErrors){
      for(let err in graphQLErrors){
        if (err.name === "AuthenticationError") {
          // set auth error in state (to show in snackbar)
          store.commit("setAuthError", err);
          // signout user (to clear token)
          store.dispatch("signoutUser");
        }
      }
    }
  }
})
const apolloProvider = new VueApollo({defaultClient})


Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created(){
    const token = localStorage.getItem('token')
    if(token)
      this.$store.dispatch('getCurrentUser')
  }
}).$mount('#app')
