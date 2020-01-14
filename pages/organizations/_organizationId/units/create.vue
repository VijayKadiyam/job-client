<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To States"
      :link="`/organizations/${organization.value}/states`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm12 md12>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Register Unit</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <h4>Customer/Farmer Details</h4>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.first_name"
                    prepend-icon="public" 
                    name="first_name" 
                    label="First Name"
                    v-model="form.first_name" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.middle_name"
                    prepend-icon="public" 
                    name="middle_name" 
                    label="Middle Name"
                    v-model="form.middle_name" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.last_name"
                    prepend-icon="public" 
                    name="last_name" 
                    label="Last Name"
                    v-model="form.last_name" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field 
                    :error-messages="errors.residence_address"
                    prepend-icon="public" 
                    name="residence_address" 
                    label="Residence Address"
                    v-model="form.residence_address" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field 
                    :error-messages="errors.phone_no"
                    prepend-icon="public" 
                    name="phone_no" 
                    label="Phone No"
                    v-model="form.phone_no" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field 
                    :error-messages="errors.adhaar_no"
                    prepend-icon="public" 
                    name="adhaar_no" 
                    label="Adhaar No"
                    v-model="form.adhaar_no" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field 
                    :error-messages="errors.email"
                    prepend-icon="public" 
                    name="email" 
                    label="Email"
                    v-model="form.email" 
                    type="text"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <h4>Controller Details</h4>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.serial_no_controller"
                    prepend-icon="public" 
                    name="serial_no_controller" 
                    label="Controller Serial No"
                    v-model="form.serial_no_controller" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.location_controller"
                    prepend-icon="public" 
                    name="location_controller" 
                    label="Controller Location"
                    v-model="form.location_controller" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.manufacturer_vfd"
                    prepend-icon="public" 
                    name="manufacturer_vfd" 
                    label="VFD Manufacturer"
                    v-model="form.manufacturer_vfd" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.serial_no_vfd"
                    prepend-icon="public" 
                    name="serial_no_vfd" 
                    label="VFD Serial No"
                    v-model="form.serial_no_vfd" 
                    type="text"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <h4>Pump & Motor Details</h4>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.motor_type"
                    prepend-icon="public" 
                    name="motor_type" 
                    label="Motor Type"
                    v-model="form.motor_type" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.motor_category"
                    prepend-icon="public" 
                    name="motor_category" 
                    label="Motor Category"
                    v-model="form.motor_category" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.motor_serial_no"
                    prepend-icon="public" 
                    name="motor_serial_no" 
                    label="Motor Serial No"
                    v-model="form.motor_serial_no" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.pump_serial_no"
                    prepend-icon="public" 
                    name="pump_serial_no" 
                    label="Pump Serial No"
                    v-model="form.pump_serial_no" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.motor_hp"
                    prepend-icon="public" 
                    name="motor_hp" 
                    label="Motor HP"
                    v-model="form.motor_hp" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.motor_head_size"
                    prepend-icon="public" 
                    name="motor_head_size" 
                    label="Motor Head Size"
                    v-model="form.motor_head_size" 
                    type="text"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <h4>RMS Details</h4>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.imei_number"
                    prepend-icon="public" 
                    name="imei_number" 
                    label="IMEI Number"
                    v-model="form.imei_number" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.rms_phone_no"
                    prepend-icon="public" 
                    name="rms_phone_no" 
                    label="RMS Phone Number"
                    v-model="form.rms_phone_no" 
                    type="text"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field 
                    :error-messages="errors.device_id"
                    prepend-icon="public" 
                    name="device_id" 
                    label="Device ID"
                    v-model="form.device_id" 
                    type="text"
                  ></v-text-field>
                </v-flex>
              </v-layout>  
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Register Unit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateUnit',
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
      await this.$axios.post(`units`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/units`);
    }
  }
}
</script> 