<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Employees"
      :link="`/organizations/${organization.value}/users`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create User</v-toolbar-title>
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
              <v-text-field 
                :error-messages="errors.address"
                prepend-icon="public" 
                name="address" 
                label="Address"
                v-model="form.address" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.organigation_name"
                prepend-icon="public" 
                name="organigation_name" 
                label="Organigation Name"
                v-model="form.organigation_name" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.organigation_address"
                prepend-icon="public" 
                name="organigation_address" 
                label="Organigation Address"
                v-model="form.organigation_address" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.gstn"
                prepend-icon="public" 
                name="gstn" 
                label="Gstn"
                v-model="form.gstn" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.year_of_establishment"
                prepend-icon="public" 
                name="year_of_establishment" 
                label="Year Of Establishment"
                v-model="form.year_of_establishment" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.no_of_partners"
                prepend-icon="public" 
                name="no_of_partners" 
                label="No Of Partners"
                v-model="form.no_of_partners" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.total_no_of_people"
                prepend-icon="public" 
                name="total_no_of_people" 
                label="Total No Of People"
                v-model="form.total_no_of_people" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.description"
                prepend-icon="public" 
                name="description" 
                label="Description"
                v-model="form.description" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.transfer_policy"
                prepend-icon="public" 
                name="transfer_policy" 
                label="Transfer Policy"
                v-model="form.transfer_policy" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.training_policy"
                prepend-icon="public" 
                name="training_policy" 
                label="Training Policy"
                v-model="form.training_policy" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.leave_compensation"
                prepend-icon="public" 
                name="leave_compensation" 
                label="Leave Compensation"
                v-model="form.leave_compensation" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.dob"
                prepend-icon="public" 
                name="dob" 
                label="Dob"
                v-model="form.dob" 
                type="number"
              ></v-text-field>
             <v-autocomplete 
                :error-messages="errors.gender"
                prepend-icon="public" 
                name="gender" 
                label="Gender" 
                :items="genders"
                v-model="form.gender"
                type="text"
              ></v-autocomplete>
              <v-text-field 
                :error-messages="errors.marital_status"
                prepend-icon="public" 
                name="marital_status" 
                label="Marital Status"
                v-model="form.marital_status" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.passing_marks_10"
                prepend-icon="public" 
                name="10_passing_marks" 
                label="10 Passing Marks"
                v-model="form.passing_marks_10" 
                type="number"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.total_marks_10"
                prepend-icon="public" 
                name="10_total_marks" 
                label="10 Total Marks"
                v-model="form.total_marks_10" 
                type="number"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.passing_marks_12"
                prepend-icon="public" 
                name="12_passing_marks" 
                label="12 Passing Marks"
                v-model="form.passing_marks_12" 
                type="number"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.total_marks_12"
                prepend-icon="public" 
                name="12_total_marks" 
                label="12 Total Marks"
                v-model="form.total_marks_12" 
                type="number"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.cpt_passing_year"
                prepend-icon="public" 
                name="cpt_passing_year" 
                label="Cpt Passing Year"
                v-model="form.cpt_passing_year" 
                type="number"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.cpt_marks"
                prepend-icon="public" 
                name="cpt_marks" 
                label="Cpt Marks"
                v-model="form.cpt_marks" 
                type="number"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.cpt_attempts"
                prepend-icon="public" 
                name="cpt_attempts" 
                label="Cpt Attempts"
                v-model="form.cpt_attempts" 
                type="text"
              ></v-text-field>
               <v-text-field 
                :error-messages="errors.ipcc_group_1_passing_year"
                prepend-icon="public" 
                name="ipcc_group_1_passing_year" 
                label="Ipcc Group 1 Passing Year"
                v-model="form.ipcc_group_1_passing_year" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_1_marks"
                prepend-icon="public" 
                name="ipcc_group_1_marks" 
                label="Ipcc Group 1 Marks"
                v-model="form.ipcc_group_1_marks" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_1_attempts"
                prepend-icon="public" 
                name="ipcc_group_1_attempts" 
                label="Ipcc Group 1 Attempts"
                v-model="form.ipcc_group_1_attempts" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_2_passing_marks"
                prepend-icon="public" 
                name="ipcc_group_2_passing_marks" 
                label="Ipcc Group 2 Passing Marks"
                v-model="form.ipcc_group_2_passing_marks" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_2_marks"
                prepend-icon="public" 
                name="ipcc_group_2_marks" 
                label="Ipcc Group 2 Marks"
                v-model="form.ipcc_group_2_marks" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.ipcc_group_2_attempts"
                prepend-icon="public" 
                name="ipcc_group_2_attempts" 
                label="Ipcc Group 2 Attempts"
                v-model="form.ipcc_group_2_attempts" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.entry_scheme"
                prepend-icon="public" 
                name="entry_scheme" 
                label="Entry Scheme"
                v-model="form.entry_scheme" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.icitss_passed"
                prepend-icon="public" 
                name="icitss_passed" 
                label="Icitss Passed"
                v-model="form.icitss_passed" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.icitss_passing_marks"
                prepend-icon="public" 
                name="icitss_passing_marks" 
                label="Icitss Passing Marks"
                v-model="form.icitss_passing_marks" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.icitss_total_marks"
                prepend-icon="public" 
                name="icitss_total_marks" 
                label="Icitss Total Marks"
                v-model="form.icitss_total_marks" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.other_training_details"
                prepend-icon="public" 
                name="other_training_details" 
                label="Other Training Details"
                v-model="form.other_training_details" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.outstation_travel"
                prepend-icon="public" 
                name="outstation_travel" 
                label="Outstation Travel"
                v-model="form.outstation_travel" 
                type="text"
              ></v-text-field>              
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create User</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateUser',
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      address: '',
      organigation_name: '',
      organigation_address: '',
      gstn: '',
      year_of_establishment: '',
      no_of_partners: '',
      total_no_of_people: '',
      description: '',
      transfer_policy: '',
      training_policy: '',
      leave_compensation: '',
      dob: '',
      marital_status: '',
      passing_marks_10: '',
      total_marks_10: '',
      passing_marks_12: '',
      total_marks_12: '',
      cpt_passing_year: '',
      cpt_marks: '',
      cpt_attempts: '',
      ipcc_group_1_passing_year: '',
      ipcc_group_1_marks: '',
      ipcc_group_1_attempts: '',
      ipcc_group_2_passing_marks: '',
      ipcc_group_2_marks: '',
      ipcc_group_2_attempts: '',
      entry_scheme: '',
      icitss_passed: '',
      icitss_passing_marks: '',
      icitss_total_marks: '',
      other_training_details: '',
      outstation_travel: '',
      gender: '',
      active: 1,
      role_id: 3
    },
    genders: ['Male', 'Female','Other'],
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      let user = await this.$axios.post(`/users`, this.form)
      // RoleUser
      let role_user = {
        user_id: user.data.data.id,
        role_id: this.form.role_id
      }
      await this.$axios.post('/role_user', role_user)
      // Company User
      let company_user = {
        user_id: user.data.data.id,
        company_id: this.organization.value
      }
      await this.$axios.post('/company_user', company_user)
      this.$router.push(`/organizations/${this.organization.value}/users`);
    },
  }
}
</script> 