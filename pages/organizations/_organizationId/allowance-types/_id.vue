<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Allowance Types"
      :link="`/organizations/${organization.value}/allowance-types`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Update Allowance Type</v-toolbar-title>
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
                :error-messages="errors.amount"
                prepend-icon="money" 
                name="amount" 
                label="Amount"
                v-model="form.amount" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Allowance Type</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'EditBreakType',
  async asyncData({$axios, params}) {
    let allowance_type = await $axios.get(`/allowance_types/${params.id}`)
    return {
      form: allowance_type.data.data
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
      await this.$axios.patch(`/allowance_types/${this.$route.params.id}`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/allowance-types`);
    }
  }
}
</script> 