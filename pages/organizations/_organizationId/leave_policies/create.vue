<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To LeavePolicies"
      :link="`/organizations/${organization.value}/leave_policies`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create LeavePolicy</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.exam"
                prepend-icon="assignment" 
                name="exam" 
                label="Exam"
                v-model="form.exam" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_1"
                prepend-icon="group" 
                name="ipcc_group_1" 
                label="Ipcc Group 1"
                v-model="form.ipcc_group_1" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_2"
                prepend-icon="group" 
                name="ipcc_group_2" 
                label="Ipcc Group 2"
                v-model="form.ipcc_group_2" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ca_final_group_1"
                prepend-icon="group" 
                name="ca_final_group_1" 
                label="Ca Final Group 1"
                v-model="form.ca_final_group_1" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ca_final_group_2"
                prepend-icon="group" 
                name="ca_final_group_2" 
                label="Ca Final Group 2"
                v-model="form.ca_final_group_2" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_both_groups"
                prepend-icon="group" 
                name="ipcc_both_groups" 
                label="Ipcc Both Groups"
                v-model="form.ipcc_both_groups" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ca_final_both_groups"
                prepend-icon="group" 
                name="ca_final_both_groups" 
                label="Ca Final Both Groups"
                v-model="form.ca_final_both_groups" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create LeavePolicy</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateLeavePolicies',
  data: () => ({
    form: {
      exam: '',
      ipcc_group_1: '',
      ipcc_group_2: '',
      ca_final_group_1: '',
      ca_final_group_2: '',
      ipcc_both_groups: '',
      ca_final_both_groups: '',
    }
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      await this.$axios.post(`/users/${this.user.id}/leave_policies`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/leave_policies`);
    }
  }
}
</script> 