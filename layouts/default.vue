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
          <template slot:activator>
            <v-list-tile>
              <v-list-tile-title>{{ dropdown.name }}</v-list-tile-title>
            </v-list-tile>
          </template>

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
      admins: [
        ['Management', 'people_outline'],
        ['Settings', 'settings']
      ],
      cruds: [
        ['Create', 'add'],
        ['Read', 'insert_drive_file'],
        ['Update', 'update'],
        ['Delete', 'delete']
      ],
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
    permissions() {
      return this.user ? this.user.roles[0].permissions.map(p => p.id) : ''
    },
    items() {
      let items = [];
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

      // if(this.permissions.indexOf(1)!= -1)
      //   items.push({ icon: 'perm_data_setting', title: 'Manage Data', to: '/manage-data/questions' })
      // if(this.permissions.indexOf(2)!= -1)
      //   items.push({ icon: 'fast_forward', title: 'Plan Tests', to: '/tests' })
      // if(this.permissions.indexOf(10)!= -1) {
      //   items.push({ icon: 'alarm_add', title: 'Schedule Tests', to: '/schedule-tests' })
      //   items.push({ icon: 'alarm', title: 'Scheduled Tests', to: '/scheduled-tests' })  
      // }
      // items.push({ icon: 'play_circle_outline', title: 'Tests', to: '/test-papers' })  
      // if(this.permissions.indexOf(3)!= -1)
      //   items.push({ icon: 'group', title: 'Manage Students', to: '/students' })
      // if(this.permissions.indexOf(4)!= -1)
      //   items.push({ icon: 'group_add', title: 'Manage Staffs', to: '/staffs' })
      // if(this.permissions.indexOf(5)!= -1)
      //   items.push({ icon: 'public', title: 'Organizations', to: '/organizations' })
      // if(this.permissions.indexOf(6)!= -1)
      // if(this.permissions.indexOf(9)!= -1)
      //   items.push({ icon: 'notifications_active', title: 'Manage Logins', to: '/logins' })
      // if(this.permissions.indexOf(8)!= -1)
      //   items.push({ icon: 'lock_open', title: 'Manage Permissions', to: '/permissions' })
      // if(this.permissions.indexOf(7)!= -1)
      //   items.push({ icon: 'brightness_7', title: 'Super Admin Settings', to: '/settings' })
      // items.push({ title: 'Report Charts', to: '/charts/simple' })
      return items;
    },
    dropdownItems() {
      // if(this.permissions.indexOf(3)!= -1 && this.permissions.indexOf(1)!= -1)
      let dropdownItems = [
        { name: 'Company', icon: 'account_balance', items: [] },
        { name: 'Users', icon: 'group', items: [] },
        { name: 'Leaves', icon: 'beach_access', items: [] },
        { name: 'Applications', icon: 'bookmark_border', items: [] },
      ];
      
      // Company
      if(this.permissions.indexOf(6)!= -1)
        dropdownItems[0].items.push({ icon: 'school', title: 'Designations', to: `/organizations/${this.organizationId}/designations`})
      if(this.permissions.indexOf(7)!= -1)
        dropdownItems[0].items.push({ icon: 'location_on', title: 'States', to: `/organizations/${this.organizationId}/states`})
      if(this.permissions.indexOf(8)!= -1)
        dropdownItems[0].items.push({ icon: 'work_off', title: 'Holidays', to: `/organizations/${this.organizationId}/state_holidays`})
      // Users
      if(this.permissions.indexOf(10)!= -1)
        dropdownItems[1].items.push({ icon: 'my_location', title: 'Supervisors', to: `/organizations/${this.organizationId}/supervisors`})
      if(this.permissions.indexOf(9)!= -1)
        dropdownItems[1].items.push({ icon: 'person', title: 'Employees', to: `/organizations/${this.organizationId}/employees`})
      // Leaves
      if(this.permissions.indexOf(11)!= -1)
        dropdownItems[2].items.push({ icon: 'beach_access', title: 'Leaves', to: `/organizations/${this.organizationId}/leaves`})
      // Applications
      if(this.permissions.indexOf(12)!= -1)
        dropdownItems[3].items.push({ icon: 'bookmark_border', title: 'Leave Applications', to: `/organizations/${this.organizationId}/leave-applications`})
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
</style>