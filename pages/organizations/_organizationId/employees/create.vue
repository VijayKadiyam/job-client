<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Employees"
      :link="`/organizations/${organization.value}/employees`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create Employee</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-avatar
                size="120px"
                v-if="form.image_path || imageBase64"
              >
                <img
                  :src="imageBase64 ? imageBase64 :  (mediaUrl + form.image_path)"
                  alt="Profile Image"
                >
              </v-avatar>
              <v-text-field 
                label="Select Image" 
                @click='pickFile' 
                v-model='imageName' 
                prepend-icon='attach_file'
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
              >
              <v-text-field 
                :error-messages="errors.employee_code"
                prepend-icon="code" 
                name="employee_code" 
                label="Employee Code"
                v-model="form.employee_code" 
                type="text"
              ></v-text-field>
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
              <v-text-field 
                :error-messages="errors.salary"
                prepend-icon="money" 
                name="salary" 
                label="Salary"
                v-model="form.salary" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.uid_no"
                prepend-icon="dns" 
                name="uid_no" 
                label="UID No"
                v-model="form.uid_no" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.asm_area"
                prepend-icon="add_to_home_screen" 
                name="asm_area" 
                label="Asm Area"
                v-model="form.asm_area" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.asm_name"
                prepend-icon="import_contacts" 
                name="asm_name" 
                label="Asm Name"
                v-model="form.asm_name" 
                type="text"
              ></v-text-field>
              <v-select
                v-model="form.supervisor_id"
                :items="supervisors"
                label="Supervisor"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Employee</v-btn>
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
    let supervisors = await $axios.get(`/users?role_id=4`)
    supervisors = supervisors.data.data.map(supervisor => ({
      'text': supervisor.name,
      'value': supervisor.id
    }))
    return {
      company_designations: company_designations,
      states: states,
      company_states: company_states.data.data,
      supervisors: supervisors
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      doj: '',
      dob: '',
      company_designation_id: '',
      company_state_id: '',
      company_state_branch_id: '',
      active: 1,
      role_id: 3,
      pf_no: '',
      uan_no: '',
      esi_no: '',
      salary: '',
      supervisor_id: ''
    },
    dojDateMenu: false,
    dobDateMenu: false,
    branches: [],
    imageBase64: '',
    imageName: '',
    imageFile: ''
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      let employee = await this.$axios.post(`/users`, this.form)
      // RoleUser
      let role_user = {
        user_id: employee.data.data.id,
        role_id: this.form.role_id
      }
      await this.$axios.post('/role_user', role_user)
      // Company User
      let company_user = {
        user_id: employee.data.data.id,
        company_id: this.organization.value
      }
      await this.$axios.post('/company_user', company_user)
      // Supervisor User
      let supervisor_user = {
        user_id: employee.data.data.id,
        supervisor_id: this.form.supervisor_id
      }
      if(this.form.supervisor_id)
        await this.$axios.post('/supervisor_user', supervisor_user)
      // To upload a file
      if(this.imageFile) {
        let formImage = new FormData()
        formImage.append('user_id', employee.data.data.id)
        formImage.append('profile_image', this.imageFile)
        await this.$axios.post(`/upload_profile_image`, formImage)
      }
      this.$router.push(`/organizations/${this.organization.value}/employees`);
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
    },
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (e) {
      const files = e.target.files
      if(files[0] !== undefined) {
        this.imageName = files[0].name
        if(this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader ()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageBase64 = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageBase64 = ''
      }
    }
  }
}
</script> 