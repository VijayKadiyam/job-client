<template>
  <section>
    <div
    id="e3"
    style="margin: auto;"
    class="grey lighten-3"
  >
    <v-toolbar
      color="pink"
      dark
    >
      <v-toolbar-title>Home</v-toolbar-title>
    </v-toolbar>

    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs4>
            <v-card color="purple" class="white--text">
              <v-layout row>
                <v-flex xs12>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">Total Employees</div>
                      <div>20</div>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
              <v-divider light></v-divider>
              <v-card-actions class="pa-3">
                <router-link :to="`/organizations/${organizationId}/employees`" style="color: white;">
                  VIEW DETAILS
                </router-link>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-flex xs4>
            <v-card color="green" class="white--text">
              <v-layout row>
                <v-flex xs12>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">Total Logins</div>
                      <div>3</div>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
              <v-divider light></v-divider>
              <v-card-actions class="pa-3">
                <router-link :to="`/user-logins`" style="color: white;">
                  VIEW DETAILS
                </router-link>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-flex xs4>
            <v-card color="red" class="white--text">
              <v-layout row>
                <v-flex xs12>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">Leave Applications</div>
                      <div>0</div>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
              <v-divider light></v-divider>
              <v-card-actions class="pa-3">
                <router-link :to="`/organizations/${organizationId}/application-approvals`" style="color: white;">
                  VIEW DETAILS
                </router-link>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  computed: {
    organizationId() {
      return this.$auth.$state.user ? 
        (this.$auth.$state.user.companies.length ? 
          this.$auth.$state.user.companies[0].id
          : this.$store.getters['settings/organization'].value)
        : ''
    },
  },
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
