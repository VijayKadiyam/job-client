<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md6>
        <v-select
          v-model="organizationId"
          :items="organizations"
          label="Select Organization"
        ></v-select>
        <v-btn :dark="darkStatus" :color="baseColor" block @click="updateDetails">
          Update Details
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'AdminSettings',
  async asyncData({$axios}) {
    let organizations = await $axios.get('/organizations');
    organizations = organizations.data.data.map(organization => ({
      'text': organization.name,
      'value': organization.id 
    }));
    return {
      organizations: organizations
    }
  },
  data: () => ({
    organizationId: ''
  }),
  mounted() {
    this.organizationId = this.$store.getters['settings/organization'].value;
  },
  methods: {
    updateDetails() {
      if(this.organizationId){
        let organization = this.organizations.filter(o => o.value == this.organizationId)
        if(organization.length) {
          this.$store.dispatch('settings/setOrganization', organization[0])
          alert("Details Updated")
        }
      } else {
        alert("Please select the organization")
      }
    }
  }
}
</script> 