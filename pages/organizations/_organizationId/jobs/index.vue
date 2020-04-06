<template>
  <section>
    <span class="title">Manage Jobs</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/jobs/create`"
      :color="baseColor"
      title="Add New Job"
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
      @keydown.enter="searchLeadJob"
    ></v-text-field>
    <br>
    <v-data-table
      :headers="headers"
      :items="jobs"
      :pagination.sync="pagination"
      :total-items="totalCount"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.title }}</td>
        <td>{{ props.item.qualification.name }}</td>
        <td>{{ props.item.user.name }}</td>
        <td>{{ props.item.title }}</td>
        <td>{{ props.item.highlight }}</td>
        <td>{{ props.item.no_of_openings }}</td>
        <td>{{ props.item.user.experience }}</td>
        <td>{{ props.item.user.department }}</td>
        <td>{{ props.item.user.max_attempts_in_ca_exam }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/jobs/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageJobs',
  async asyncData({$axios, params}) { 
    let jobs = await $axios.get(`/jobs`);
    return {
      jobs: jobs.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Job Title',
        align: 'left',
        sortable: false,
        value: 'title'
      },
      { text: 'Qualification', value: 'qualification' },
      { text: 'User', value: 'user' },
      { text: ' Job Title', value: 'title' },
      { text: 'Highlight', value: 'highlight' },
      { text: 'No Of Openings', value: 'no_of_openings' },
      { text: 'Experience', value: 'experience' },
      { text: 'Department', value: 'department' },
      { text: 'Max Attempts In Ca Exam', value: 'max_attempts_in_ca_exam' },
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
          let jobs = await this.$axios.get(`/jobs?page=${this.pagination.page}&rowsPerPage=${this.pagination.rowsPerPage}`);
          this.jobs = jobs.data.data
          this.totalCount = jobs.data.count
          this.pagination.totalItems = jobs.data.count
          this.loading = false
        }
      },
      deep: true
    }
  },
  methods: {
    async searchLeadJob() {
      if(this.search != "")
      {
        this.loading = true
        let jobs = await this.$axios.get(`/jobs?search=${this.search}`);
        this.jobs = jobs.data.data
        this.totalCount = jobs.data.count
        this.pagination.totalItems = jobs.data.count
        this.loading = false
      }
    }
  }
}
</script>