<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Organizations"
      link="/organizations"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create Organization</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="public" 
                name="name" 
                label="Name"
                v-model="form.name" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.email"
                prepend-icon="email" 
                name="email" 
                label="Email" 
                v-model="form.email"
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.phone"
                prepend-icon="phone" 
                name="phone" 
                label="Phone" 
                v-model="form.phone"
                type="number"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.address"
                prepend-icon="location_on" 
                name="address" 
                label="Address" 
                v-model="form.address"
              ></v-text-field>
              <v-autocomplete
                :error-messages="errors.time_zone"
                v-model="form.time_zone"
                :items="time_zones"
                label="Time Zone"
              >
              </v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Organization</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

import moment from 'moment'
import moment_timezone from 'moment-timezone'

export default {
  name: 'CreateOrganization',
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      address: '',
      time_zone: ''
    },
    time_zones: []
  }),
  components: {
    BackButton
  },
  mounted() {
    var timezones = moment.tz.names();
    for (var i = 0; i < timezones.length; i++) {
      this.time_zones.push({
        'text': timezones[i],
        'value': timezones[i]
      })
    }
  },
  methods: {
    async store() {
      await this.$axios.post(`/companies`, this.form)
      this.$router.push('/organizations');
    }
  }
}
</script> 