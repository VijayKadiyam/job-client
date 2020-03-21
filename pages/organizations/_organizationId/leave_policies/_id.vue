<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Leave Policies"
      :link="`/organizations/${organization.value}/leave_policies`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Update Leave Policy</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.exam"
                prepend-icon="public" 
                name="exam" 
                label="Exam"
                v-model="form.exam" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_1"
                prepend-icon="public" 
                name="ipcc_group_1" 
                label="Ipcc Group 1"
                v-model="form.ipcc_group_1" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_2"
                prepend-icon="public" 
                name="ipcc_group_2" 
                label="Ipcc Group 2"
                v-model="form.ipcc_group_2" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ca_final_group_1"
                prepend-icon="public" 
                name="ca_final_group_1" 
                label="Ca Final Group 1"
                v-model="form.ca_final_group_1" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ca_final_group_2"
                prepend-icon="public" 
                name="ca_final_group_2" 
                label="Ca Final Group 2"
                v-model="form.ca_final_group_2" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_both_groups"
                prepend-icon="public" 
                name="ipcc_both_groups" 
                label="Ipcc Both Groups"
                v-model="form.ipcc_both_groups" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ca_final_both_groups"
                prepend-icon="public" 
                name="ca_final_both_groups" 
                label="Ca Final Both Groups"
                v-model="form.ca_final_both_groups" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Leave Policy</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'UpdateLeavePolicy',
  data: () => ({
    form: {

    }
  }),
  components: {
    BackButton
  },
  async mounted() {
    let leave_policy = await this.$axios.get(`/users/${this.user.id}/leave_policies/${this.$route.params.id}`)
    this.form = leave_policy.data.data
  },
  methods: {
    async store() {
      await this.$axios.patch(`/users/${this.user.id}/leave_policies/${this.$route.params.id}`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/leave_policies`);
    }
  }
}
</script> 