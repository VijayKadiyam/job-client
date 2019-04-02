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
      fixed: false
    }
  },
  computed: {
    drawer() {
      return this.authenticated
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
      if(this.permissions.indexOf(16)!= -1)
        items.push({ icon: 'accessible', title: 'User Logins', to: '/user-logins' })
      if(this.permissions.indexOf(5)!= -1)
        items.push({ icon: 'public', title: 'Organizations', to: '/organizations' })
      if(this.permissions.indexOf(4)!= -1)
        items.push({ icon: 'account_circle', title: 'Profile', to: '/profile' })
      if(this.permissions.indexOf(2)!= -1)
        items.push({ icon: 'lock_open', title: 'Manage Permissions', to: '/permissions' })
      // Master
      if(this.permissions.indexOf(3)!= -1)
        items.push({ icon: 'work_off', title: 'Holidays', to: '/holidays'})
      if(this.permissions.indexOf(1)!= -1)
        items.push({ icon: 'brightness_7', title: 'Settings', to: '/settings'})
      if(this.permissions.indexOf(13)!= -1)
        items.push({ icon: 'attach_money', title: 'Sales', to: '/sales'})
      if(this.permissions.indexOf(14)!= -1)
        items.push({ icon: 'security', title: "Reset Password", to: '/auth/reset-password'})
      // items.push({ icon: 'location_on', title: "Location", to: '/locations'})
      return items;
    },
    dropdownItems() {
      let dropdownItems = [];
      let length = 0;
      // Company
      if(this.permissions.indexOf(6)!= -1 || this.permissions.indexOf(7)!= -1 || this.permissions.indexOf(8)!= -1 || this.permissions.indexOf(15)!= -1) {

        dropdownItems.push({ name: 'Company', icon: 'account_balance', items: [] })
        length = dropdownItems.length - 1

        if(this.permissions.indexOf(6)!= -1)
          dropdownItems[length].items.push({ icon: 'school', title: 'Designations', to: `/organizations/${this.organizationId}/designations`})
        if(this.permissions.indexOf(7)!= -1)
          dropdownItems[length].items.push({ icon: 'location_on', title: 'States', to: `/organizations/${this.organizationId}/states`})
        if(this.permissions.indexOf(8)!= -1)
          dropdownItems[length].items.push({ icon: 'work_off', title: 'Holidays', to: `/organizations/${this.organizationId}/state_holidays`})
        if(this.permissions.indexOf(15)!= -1)
          dropdownItems[length].items.push({ icon: 'free_breakfast', title: 'Break Types', to: `/organizations/${this.organizationId}/break-types`})
        dropdownItems[length].items.push({ icon: 'all_inbox', title: 'Leave Types', to: `/organizations/${this.organizationId}/leave-types`})
        dropdownItems[length].items.push({ icon: 'tram', title: 'Transport Modes', to: `/organizations/${this.organizationId}/transport-modes`})
        dropdownItems[length].items.push({ icon: 'settings_ethernet', title: 'Travelling Ways', to: `/organizations/${this.organizationId}/travelling-ways`})
        dropdownItems[length].items.push({ icon: 'money', title: 'Allowance Types', to: `/organizations/${this.organizationId}/allowance-types`})
        dropdownItems[length].items.push({ icon: 'assignment', title: 'Voucher Types', to: `/organizations/${this.organizationId}/voucher-types`})
      }
      
      // Users
      if(this.permissions.indexOf(10)!= -1 || this.permissions.indexOf(9)!= -1) {

        dropdownItems.push({ name: 'Users', icon: 'group', items: [] })
        length = dropdownItems.length - 1

        if(this.permissions.indexOf(10)!= -1)
          dropdownItems[length].items.push({ icon: 'my_location', title: 'Supervisors', to: `/organizations/${this.organizationId}/supervisors`})
        if(this.permissions.indexOf(9)!= -1)
          dropdownItems[length].items.push({ icon: 'person', title: 'Employees', to: `/organizations/${this.organizationId}/employees`})

      }

      // Leaves
      if(this.permissions.indexOf(11)!= -1) {

        dropdownItems.push({ name: 'Leaves', icon: 'beach_access', items: [] })
        length = dropdownItems.length - 1

        if(this.permissions.indexOf(11)!= -1)
          dropdownItems[length].items.push({ icon: 'beach_access', title: 'Leaves', to: `/organizations/${this.organizationId}/leaves`})
      }

      // Applications
      if(this.permissions.indexOf(12)!= -1) {

        dropdownItems.push({ name: 'Applications', icon: 'bookmark_border', items: [] })
        length = dropdownItems.length - 1

        if(this.permissions.indexOf(12)!= -1)
          dropdownItems[length].items.push({ icon: 'bookmark_border', title: 'Leave Applications', to: `/organizations/${this.organizationId}/leave-applications`})
        dropdownItems[length].items.push({ icon: 'bookmark', title: 'Application Approvals', to: `/organizations/${this.organizationId}/application-approvals`})
      }

      dropdownItems.push({ name: 'Reports', icon: 'file_copy', items: [] })
        length = dropdownItems.length - 1

        dropdownItems[length].items.push({ icon: 'how_to_vote', title: 'Leave Report', to: `/reports/leave-report`})
        dropdownItems[length].items.push({ icon: 'inbox', title: 'Plan Report', to: `/reports/plan-report`})
        dropdownItems[length].items.push({ icon: 'flag', title: 'Sales Report', to: `/reports/sales-report`})
      
      return dropdownItems;
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
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