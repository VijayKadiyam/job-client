<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Branches"
      :link="`/organizations/${organization.value}/branches`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Update Branch</v-toolbar-title>
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
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Branch</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'UpdateBranch',

  data: () => ({
    form: {

    }
  }),
  components: {
    BackButton
  },
  async mounted() {
    let branch = await this.$axios.get(`/users/${this.user.id}/branches/${this.$route.params.id}`)
    this.form = branch.data.data
  },
  methods: {
    async store() {
      await this.$axios.patch(`/users/${this.user.id}/branches/${this.$route.params.id}`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/branches`);
    }
  }
}
</script> 