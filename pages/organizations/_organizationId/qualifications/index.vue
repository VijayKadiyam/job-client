<template>
  <section>
    <span class="title">Manage Qualification</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/qualifications/create`"
      :color="baseColor"
      title="Add New Qualification"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
 <v-text-field
      v-model="search"
      append-icon="search"
      label="Search"
      single-line
      @keydown.enter="searchQualification"
    ></v-text-field>
    <br>
    <v-data-table
      :headers="headers"
      :items="qualifications"
      :pagination.sync="pagination"
      :total-items="totalCount"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/qualifications/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageQualifications',
  async asyncData({$axios, params}) { 
    let qualifications = await $axios.get(`/qualifications`);
    return {
      qualifications: qualifications.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Qualification Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Action', value: '' }
    ],
    loading: true,
    search: '',
    pagination: {
      rowsPerPage: 5
    },
    totalCount: 0,
  }),
  watch: {
    pagination: {
      async handler () {
        if(this.search == "") {
          this.loading = true
          let qualifications = await this.$axios.get(`/qualifications?page=${this.pagination.page}&rowsPerPage=${this.pagination.rowsPerPage}`);
          this.qualifications = qualifications.data.data
          this.totalCount = qualifications.data.count
          this.pagination.totalItems = qualifications.data.count
          this.loading = false
        }
      },
      deep: true
    }
  },
  methods: {
    async searchQualification() {
      if(this.search != "")
      {
        this.loading = true
        let qualifications = await this.$axios.get(`/qualifications?search=${this.search}`);
        this.qualifications = qualifications.data.data
        this.totalCount = qualifications.data.count
        this.pagination.totalItems = qualifications.data.count
        this.loading = false
      }
    }
  }
}
</script>