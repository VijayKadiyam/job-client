<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To States"
      :link="`/organizations/${organization.value}/states`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create Branch of state: {{ state.name }}</v-toolbar-title>
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
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create State Branch</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateStateBranch',
  async asyncData({$axios, params}) { 
    let state = await $axios.get(`/company_states/${params.stateId}`);
    return {
      state: state.data.data,
    }
  },
  data: () => ({
    form: {
      name: ''
    }
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      await this.$axios.post(`company_states/${this.$route.params.stateId}/company_state_branches`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/states`);
    }
  }
}
</script> 