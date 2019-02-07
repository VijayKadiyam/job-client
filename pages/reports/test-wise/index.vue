<template>
  <section>
    <v-layout row wrap>
      <v-flex xs3 px-2>
        <v-select
          :error-messages="errors.batch_id"
          v-model="form.test_pattern_id"
          :items="test_patterns"
          label="Select Test Pattern"
        ></v-select>
      </v-flex>
      <v-flex xs3 px-2>
        <v-select
          :error-messages="errors.batch_id"
          v-model="form.batch_id"
          :items="batches"
          label="Select Batch"
        ></v-select>
      </v-flex>
      <v-flex xs3>
        <v-btn block
          :color="baseColor"
          :dark="darkStatus"
        >
          Generate
        </v-btn>
      </v-flex>
    </v-layout>
    <br>
    <span class="sub_title"><b>Test Wise Report</b></span>
    <br><br>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      class="elevation-1"
    >
      <!-- Header -->
      <template slot="headers" slot-scope="props">
        <tr>
          <th 
            v-for="(header,h) in props.headers" 
            v-html="header.text"
          >
          </th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td class="text-xs-center" v-html="props.item.name"></td>
        <td class="text-xs-center" v-html="props.item.total"></td>
        <td class="text-xs-center" v-html="props.item.physics"></td>
        <td class="text-xs-center" v-html="props.item.chemistry"></td>
        <td class="text-xs-center" v-html="props.item.mathematics"></td>
        <td class="text-xs-center" v-html="props.item.others"></td>
        <td class="text-xs-center" v-html="props.item.all_india_max_marks"></td>
        <td class="text-xs-center" v-html="props.item.batch_topper"></td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'Testwise Reports',
  async asyncData({$axios}) { 
    let test_patterns = await $axios.get('/test_patterns');
    test_patterns = test_patterns.data.data.map(pattern => ({
      'text': pattern.name,
      'value': pattern.id 
    }));
    let batches = await $axios.get('/batches');
    batches = batches.data.data.map(batch => ({
      'text': batch.name,
      'value': batch.id 
    }))
    return {
      test_patterns: test_patterns,
      batches: batches
    }
  },
  data:() =>  ({
    form: {},
    headers: [
      {
        text: 'Test Name',
        align: 'center',
        sortable: false,
        value: 'name'
      },
      { text: 'Total<br>High | Low', value: 'total' },
      { text: 'Physics<br>High | Low', value: 'physics' },
      { text: 'Chemistry<br>High | Low', value: 'chemistry' },
      { text: 'Mathematics<br>High | Low', value: 'mathematics' },
      { text: 'Others<br>High | Low', value: 'others' },
      { text: 'All India Maximum Marks', value: 'all_india_max_marks' },
      { text: 'Batch Topper', value: 'batch_topper' },
    ],
    items: [
      {
        name: 'FAT 1',
        total: '50 | 20',
        physics: '34 | 22',
        chemistry: '34 | 2',
        mathematics: '55 | 32',
        others: '0 | 0',
        all_india_max_marks: '234'
      }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>