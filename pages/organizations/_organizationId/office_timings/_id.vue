<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To OfficeTimings"
      :link="`/organizations/${organization.value}/office_timings`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Update Office Timing</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
           <v-form>
              <v-text-field 
                :error-messages="errors.from"
                prepend-icon="public" 
                name="from" 
                label="From"
                v-model="form.from" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.from_am_pm"
                prepend-icon="public" 
                name="from_am_pm" 
                label="From AM PM"
                v-model="form.from_am_pm" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.to"
                prepend-icon="public" 
                name="to" 
                label="To"
                v-model="form.to" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.to_am_pm"
                prepend-icon="public" 
                name="to_am_pm" 
                label="To AM PM"
                v-model="form.to_am_pm" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update OfficeTiming</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'UpdateOfficeTiming',
  data: () => ({
    form: {

    }
  }),
  components: {
    BackButton
  },
  async mounted() {
    let office_timing = await this.$axios.get(`/users/${this.user.id}/office_timings/${this.$route.params.id}`)
    this.form = office_timing.data.data
  },
  methods: {
    async store() {
      await this.$axios.patch(`/users/${this.user.id}/office_timings/${this.$route.params.id}`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/office_timings`);
    }
  }
}
</script> 