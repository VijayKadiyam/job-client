<template>
  <v-app light>
    <v-navigation-drawer
      :class="`${baseColor} lighten-5`"
      :clipped="clipped"
      :value="drawer"
      fixed
      app
      width=225
    >
      <v-list>
        <!-- Without dropdowns -->
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

        <!-- With dropdowns -->
        <v-list-group
          v-for="(dropdown, d) in dropdownItems"
          :key="`D${d}`"
          :prepend-icon="dropdown.icon"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>{{ dropdown.name }}</v-list-tile-title>
          </v-list-tile>

          <v-list-tile
            v-for="(item, i) in dropdown.items"
            :key="i"
            :to="item.to"
          >
            <v-list-tile-action>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content v-text="item.title"></v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
      :height="baseHeight"
      :color="baseColor"
      :dark="darkStatus"
    >
      <v-toolbar-side-icon @click="toggleNav"></v-toolbar-side-icon>
      <nuxt-link to="/">
        <v-icon large right>account_balance</v-icon>
        <span style="color: white"> {{ title }}</span>
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
          <v-avatar 
            style="margin: 5px;"
            size="40px"
            v-if="user.image_path"
          >
            <img
              :src="(mediaUrl + user.image_path)"
              alt="Profile Image"
            >
          </v-avatar>
        </template>
        <template v-else>
          <v-btn flat to="/register">
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
        <nuxt></nuxt>
      </v-container>
    </v-content>
    <!-- <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2017</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  name: 'Root',
  data() {
    return {
      clipped: true,
      fixed: false,
      toolbarDrawer: true,
    }
  },
  computed: {
    drawer() {
      return this.authenticated ? this.toolbarDrawer : this.authenticated
    },
    title() {
      return this.$auth.$state.user ? 
        (this.$auth.$state.user.companies.length ? 
          this.$auth.$state.user.companies[0].name + ' [' +this.$auth.$state.user.roles[0].name + ']' 
          : this.$store.getters['settings/organization'].text + ' [By Super Admin]') 
        : ''
    },
    organizationId() {
      return this.$auth.$state.user ? 
        (this.$auth.$state.user.companies.length ? 
          this.$auth.$state.user.companies[0].id
          : this.$store.getters['settings/organization'].value)
        : ''
    },
    role() {
      return this.user ? this.user.roles[0].name : '';
    },
    permissions() {
      return this.user ? this.user.roles[0].permissions.map(p => p.id) : ''
    },
    items() {
      let items = [];
      if(this.permissions.indexOf(5)!= -1)
        items.push({ icon: 'public', title: 'Organizations', to: '/organizations' })
      if(this.permissions.indexOf(4)!= -1)
        items.push({ icon: 'account_circle', title: 'Profile', to: '/profile' })
      // Master
      if(this.permissions.indexOf(1)!= -1)
        items.push({ icon: 'brightness_7', title: 'Settings', to: '/settings'})
      if(this.permissions.indexOf(14)!= -1)
        items.push({ icon: 'security', title: "Reset Password", to: '/auth/reset-password'})
      // if(this.permissions.indexOf(9)!= -1)

      //   items.push({ icon: 'person', title: 'Master', to: `/organizations/${this.organizationId}/users`})
      items.push({ icon: 'call_split', title: 'Branches', to: `/organizations/${this.organizationId}/branches`})
      items.push({ icon: 'access_time', title: 'OfficeTimings', to: `/organizations/${this.organizationId}/office_timings`})
      items.push({ icon: 'policy', title: 'Leave Policies', to: `/organizations/${this.organizationId}/leave_policies`})
      items.push({ icon: 'work', title: 'Jobs', to: `/organizations/${this.organizationId}/jobs`})
      items.push({ icon: 'person', title: 'User', to: `/organizations/${this.organizationId}/users`})
      items.push({ icon: 'timeline', title: 'Units', to: `/organizations/${this.organizationId}/units`})
      return items;
    },
    dropdownItems() {
      let dropdownItems = [];
      let length = 0;
      // Company
      // if(this.permissions.indexOf(6)!= -1 || this.permissions.indexOf(7)!= -1 || this.permissions.indexOf(8)!= -1 || this.permissions.indexOf(15)!= -1 || this.permissions.indexOf(17)!= -1 || this.permissions.indexOf(18)!= -1 || this.permissions.indexOf(19)!= -1 || this.permissions.indexOf(20)!= -1 || this.permissions.indexOf(21)!= -1) {

        dropdownItems.push({ name: 'Master', icon: 'account_balance', items: [] })
         length = dropdownItems.length - 1

      //   if(this.permissions.indexOf(6)!= -1)
          dropdownItems[length].items.push({ icon: 'insert_invitation', title: 'Days', to: `/organizations/${this.organizationId}/days`})
          dropdownItems[length].items.push({ icon: 'low_priority', title: 'Practice', to: `/organizations/${this.organizationId}/practices`})
          dropdownItems[length].items.push({ icon: 'gesture', title: 'Affiliation', to: `/organizations/${this.organizationId}/affiliations`})
          dropdownItems[length].items.push({ icon: 'school', title: 'Qualification', to: `/organizations/${this.organizationId}/qualifications`})
      //   if(this.permissions.indexOf(7)!= -1)
      //     dropdownItems[length].items.push({ icon: 'location_on', title: 'States', to: `/organizations/${this.organizationId}/states`})
      // }

      return dropdownItems;
    }
  },
  methods: {
    logout() {
      this.toolbarDrawer = true
      this.$auth.logout()
    },
    toggleNav() {
      this.toolbarDrawer = !this.toolbarDrawer
    }
  }
}
</script>


<style>
a {
  text-decoration: none !important;
}

.title {
  text-decoration: underline;
}

.button-group {
  width: 100% !important;
}

.button-active {
  background-color: #2196F3 !important;
  color: white !important;
}

.ck .ck-content {
  height: 150px !important;
}

.v-input__control {
  width: 100% !important;
}

.error-text {
  color: red !important;
}

a.links{
  text-decoration: underline !important;
  color: blue;
}

.download {
   color: red !important;
   text-decoration: underline !important; 
}
</style>