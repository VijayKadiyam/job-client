<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Holidays"
      link="/holidays"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create Holiday</v-toolbar-title>
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
            </v-form>
            <v-menu
              ref="holidayMenu"
              :close-on-content-click="false"
              v-model="holidayMenu"
              :nudge-right="40"
              :return-value.sync="form.date"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                :error-messages="errors.date"
                slot="activator"
                v-model="form.date"
                label="Date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="form.date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="holidayMenu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.holidayMenu.save(form.date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Holiday</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateHoliday',
  data: () => ({
    form: {
      name: '',
      date: ''
    },
    holidayMenu: false,
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      await this.$axios.post(`/holidays`, this.form)
      this.$router.push('/holidays');
    }
  }
}
</script> 