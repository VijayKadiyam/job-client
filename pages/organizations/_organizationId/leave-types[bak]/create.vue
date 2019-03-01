<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Designations"
      :link="`/organizations/${organization.value}/leave-types`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create Leave Type</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <!-- <v-radio-group v-model="form.leave_pattern_id" row>
                <v-radio
                  v-for="(leave_pattern, i) in leave_patterns"
                  :key="`l${i}`"
                  :label="leave_pattern.text"
                  :value="leave_pattern.value"
                ></v-radio>
              </v-radio-group> -->
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="beach_access" 
                name="name" 
                label="Leave Type Name"
                v-model="form.name" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.leaves"
                prepend-icon="clear_all" 
                name="leaves" 
                label="Leaves"
                v-model="form.leaves" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Leave Type</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateLeaveType',
  // async asyncData({$axios, params}) {
  //   let leave_patterns = await $axios.get(`leave_patterns`);
  //   leave_patterns = leave_patterns.data.data.map(pattern => ({
  //     'text'  :  pattern.name,
  //     'value' :  pattern.id
  //   }))
  //   return {
  //     leave_patterns: leave_patterns
  //   }
  // },
  data: () => ({
    form: {
      leave_pattern_id: 1,
      name: '',
      leaves: ''
    }
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      await this.$axios.post(`/company_leaves`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/leave-types`);
    }
  }
}
</script> 