<template>
  <section>
    <span class="title">Manage Data of Unit: {{ unit.imei_number }}</span>
    <br><br>
    <v-layout row wrap>
      <v-flex md6 xs12 pr-2>
        <h4>Customer / Farmer Details</h4>
        <v-data-table
          :headers="headers"
          :items="customer_datas"
          :loading="loading"
          class="elevation-1"
          hide-actions
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td><b>{{ props.item.name }}</b></td>
            <td>{{ props.item.value }}</td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex md6 xs12>
        <h4>Controller Details</h4>
        <v-data-table
          :headers="headers"
          :items="controller_datas"
          :loading="loading"
          class="elevation-1"
          hide-actions
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td><b>{{ props.item.name }}</b></td>
            <td>{{ props.item.value }}</td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex md6 xs12 pr-2>
        <br>
        <h4>Pump & Motor Details</h4>
        <v-data-table
          :headers="headers"
          :items="pump_datas"
          :loading="loading"
          class="elevation-1"
          hide-actions
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td><b>{{ props.item.name }}</b></td>
            <td>{{ props.item.value }}</td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex md6 xs12>
        <br>
        <h4>RMS Details</h4>
        <v-data-table
          :headers="headers"
          :items="rms_datas"
          :loading="loading"
          class="elevation-1"
          hide-actions
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td><b>{{ props.item.name }}</b></td>
            <td>{{ props.item.value }}</td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex md12 xs12>
        <br>
        <h4>LIVE DATA</h4>
        <v-data-table
          :headers="liveHeaders"
          :items="live_datas"
          :loading="loading"
          class="elevation-1"
          hide-actions
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td>{{ props.index + 1 }}</td>
            <td><b>{{ props.item.date }}</b></td>
            <td>{{ props.item.time }}</td>
            <td>{{ props.item.pump_status }}</td>
            <td>{{ props.item.voltage }} V</td>
            <td>{{ props.item.current }} A</td>
            <td>{{ props.item.frequency }} Hz</td>
            <td>{{ props.item.temperature }}</td>
            <td>{{ props.item.phase_current_r }} A</td>
            <td>{{ props.item.phase_current_y }} A</td>
            <td>{{ props.item.phase_current_b }} A</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageUnitDatas',
  data:() =>  ({
    headers: [
      { text: '', value: 'sr_no' },
      { text: 'Detail', value: '' }
    ],
    liveHeaders: [
      { text: '', value: 'sr_no' },
      { text: 'Date', value: 'date' },
      { text: 'Time', value: 'time' },
      { text: 'Pump Status', value: 'pump_status' },
      { text: 'Solar Voltage', value: 'voltage' },
      { text: 'Solar Current', value: 'current' },
      { text: 'Frequency', value: 'frequency' },
      { text: 'Temperature', value: 'temperature' },
      { text: 'Phase Current R', value: 'phase_currentt_r' },
      { text: 'Phase Current Y', value: 'phase_currentt_y' },
      { text: 'Phase Current B', value: 'phase_currentt_b' },
    ],
    loading: true,
    unit: {},
    datas: [],
    customer_datas: [],
    controller_datas: [],
    pump_datas: [],
    rms_datas: [],
    live_datas: []
  }),
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      let unit = await this.$axios.get(`/units/${this.$route.params.unitId}`);
      this.unit = unit.data.data
      let datas = await this.$axios.get(`/units/${this.$route.params.unitId}/datas`);
      this.datas = datas.data.data
      this.loading = false
      this.getCustomerData()
      this.getControllerData()
      this.getPumpData()
      this.getRmsData()
      this.getLiveData()
    },
    getCustomerData() {
      this.customer_datas = []
      this.customer_datas.push({name: 'First Name', value: this.unit.first_name})
      this.customer_datas.push({name: 'Middle Name', value: this.unit.middle_name})
      this.customer_datas.push({name: 'Last Name', value: this.unit.last_name})
      this.customer_datas.push({name: 'Residence Address', value: this.unit.residence_address})
      this.customer_datas.push({name: 'Phone No', value: this.unit.phone_no})
      this.customer_datas.push({name: 'Adhaar No', value: this.unit.adhaar_no})
      this.customer_datas.push({name: 'Email', value: this.unit.email})
    },
    getControllerData() {
      this.controller_datas = []
      this.controller_datas.push({name: 'Controller Serial No', value: this.unit.serial_no_controller})
      this.controller_datas.push({name: 'Controller Location', value: this.unit.location_controller})
      this.controller_datas.push({name: 'VFD Manufacturer', value: this.unit.manufacturer_vfd})
      this.controller_datas.push({name: 'VFD Serial No', value: this.unit.serial_no_vfd})
    },
    getPumpData() {
      this.pump_datas = []
      this.pump_datas.push({name: 'Motor Type', value: this.unit.motor_type})
      this.pump_datas.push({name: 'Motor Category', value: this.unit.motor_category})
      this.pump_datas.push({name: 'Motor Serial No', value: this.unit.motor_serial_no})
      this.pump_datas.push({name: 'Pump Serial No', value: this.unit.pump_serial_no})
      this.pump_datas.push({name: 'Motor HP', value: this.unit.motor_hp})
      this.pump_datas.push({name: 'Motor Head Size', value: this.unit.motor_head_size})
    },
    getRmsData() {
      this.rms_datas = []
      this.rms_datas.push({name: 'IMEI Number', value: this.unit.imei_number })
      this.rms_datas.push({name: 'Device ID', value: this.unit.device_id })
    },
    async getLiveData() {
      this.loading = true
      let datas = await this.$axios.get(`units/${this.unit.id}/datas`)
      this.live_datas = datas.data.data
      this.loading = false
    }
  }
}
</script>