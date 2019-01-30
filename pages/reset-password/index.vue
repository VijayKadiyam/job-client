<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Reset Password [{{ user.roles[0].name }}]</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.email"
                prepend-icon="email" 
                name="email" 
                label="Email" 
                v-model="form.email"
                disabled
                type="text"></v-text-field>
              <v-text-field 
                :error-messages="errors.password"
                id="password" 
                prepend-icon="lock" 
                name="password" 
                label="New Password" 
                v-model="form.password"
                type="password"></v-text-field>
              <v-text-field
                id="password_confirmation" 
                prepend-icon="lock_open" 
                name="password_confirmation" 
                label="Confirm New Password" 
                v-model="form.password_confirmation"
                type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Password</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'MyProfile',
  async asyncData({$axios, store}) {
    let user = await $axios.get(`/users/${store.getters['auth/user'].id}`);
    return {
      form: user.data.data
    }
  },
  mounted() {
    this.form.role_id = this.form.roles[0].id
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      await this.$axios.post(`/reset_password`, this.form)
      alert("Password Updated");
      this.$auth.logout();
    }
  }
}
</script> 