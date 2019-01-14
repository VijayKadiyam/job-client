<template>
  <v-app light>
    <v-navigation-drawer
      :clipped="clipped"
      :value="drawer"
      fixed
      app
      width=200
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
      :height="baseHeight"
      :color="baseColor"
    >
      <nuxt-link to="/">
        <v-icon large right>account_balance</v-icon>
        <!-- <v-toolbar-title v-text="title" nuxt="/"/> -->
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <template v-if="authenticated">
          <v-btn flat to="/dashboard">
            Dashboard
            <v-icon dark right>dashboard</v-icon>
          </v-btn>
          <v-btn flat @click="logout" >
            Logout
            <v-icon dark right>cancel_presentation</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn flat to="/auth/register">
            Register
            <v-icon dark right>add_circle</v-icon>
          </v-btn>
          <v-btn flat to="/auth/login">
            Login
            <v-icon dark right>forward</v-icon>
          </v-btn>
        </template>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container px-0>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        clipped: true,
        fixed: false,
        items: [
          { icon: 'perm_data_setting', title: 'Manage Data', to: '/manage-data' },
          { icon: 'fast_forward', title: 'Plan Test', to: '/plan-test' }
        ],
        title: 'IIT Champions'
      }
    },
    computed: {
      drawer() {
        return this.authenticated
      }
    },
    methods: {
      logout() {
        this.$auth.logout()
      }
    }
  }
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>

<style>
.title {
  text-decoration: underline;
}
</style>