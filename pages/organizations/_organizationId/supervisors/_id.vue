<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Supervisors"
      :link="`/organizations/${organization.value}/supervisors`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Edit Supervisor</v-toolbar-title>
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
                :error-messages="errors.email"
                prepend-icon="email" 
                name="email" 
                label="Email" 
                v-model="form.email"
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.phone"
                prepend-icon="phone" 
                name="phone" 
                label="Phone" 
                v-model="form.phone"
                type="number"
              ></v-text-field>
              <v-menu
                ref="dojDateMenu"
                :close-on-content-click="false"
                v-model="dojDateMenu"
                :nudge-right="40"
                :return-value.sync="form.doj"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  :error-messages="errors.doj"
                  slot="activator"
                  v-model="form.doj"
                  label="Date of Joining"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="form.doj" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="dojDateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dojDateMenu.save(form.doj)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <v-menu
                ref="dobDateMenu"
                :close-on-content-click="false"
                v-model="dobDateMenu"
                :nudge-right="40"
                :return-value.sync="form.dob"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  :error-messages="errors.dob"
                  slot="activator"
                  v-model="form.dob"
                  label="Date of Birth"
                  prepend-icon="date_range"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="form.dob" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="dobDateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dobDateMenu.save(form.dob)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <v-select
                :error-messages="errors.company_designation_id"
                v-model="form.company_designation_id"
                :items="company_designations"
                label="Designation"
              ></v-select>
              <v-select
                v-model="form.company_state_id"
                :items="states"
                label="State"
                @input="changeBranch"
              ></v-select>
              <v-select
                v-model="form.company_state_branch_id"
                :items="branches"
                label="Branches"
                @input="changeBranch"
              ></v-select>
              <v-text-field 
                :error-messages="errors.pf_no"
                prepend-icon="done" 
                name="pf_no" 
                label="PF NO"
                v-model="form.pf_no" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.uan_no"
                prepend-icon="done_all" 
                name="uan_no" 
                label="UAN NO"
                v-model="form.uan_no" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.esi_no"
                prepend-icon="done_outline" 
                name="esi_no" 
                label="ESI NO"
                v-model="form.esi_no" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Supervisor</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateEmployee',
  async asyncData({$axios, params}) {
    let employee = await $axios.get(`users/${params.id}`)
    let company_states = await $axios.get(`/company_states`);
    let states = []
    company_states.data.data.forEach(state => {
      states.push({
        'text': state.name,
        'value': state.id
      })
    })
    let company_designations = await $axios.get(`/companies/${params.organizationId}/company_designations`)
    company_designations = company_designations.data.data.map(role => ({
      'text': role.name,
      'value': role.id 
    }))
    return {
      company_designations: company_designations,
      states: states,
      company_states: company_states.data.data,
      form: employee.data.data
    }
  },
  data: () => ({
    dojDateMenu: false,
    dobDateMenu: false,
    branches: []
  }),
  components: {
    BackButton
  },
  created() {
    this.form.company_designation_id = parseInt(this.form.company_designation_id)
    this.company_states.forEach(state => {
      state.company_state_branches.find(branch => branch.id == this.form.company_state_branch_id)
      if(state){
        this.form.company_state_id = state.id
        this.changeBranch()
      }
    })
    this.form.company_state_branch_id = parseInt(this.form.company_state_branch_id)
  },
  methods: {
    async store() {
      let employee = await this.$axios.patch(`/users/${this.form.id}`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/supervisors`);
    },
    changeBranch() {
      let state = this.company_states.find(state => state.id == this.form.company_state_id)
      this.branches = []
      state.company_state_branches.forEach(branch => {
        this.branches.push({
          text: branch.name,
          value: branch.id
        })
      })
    }
  }
}
</script> 