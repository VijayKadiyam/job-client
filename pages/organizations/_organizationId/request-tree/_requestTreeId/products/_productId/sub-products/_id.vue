<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Sub Products"
      :link="`/organizations/${organization.value}/request-tree/${listing.id}/products/${product.id}/sub-products`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md12>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Edit Sub Product of {{ product.name }} | {{ listing.name }}</v-toolbar-title>
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
                :error-messages="errors.email_subject"
                prepend-icon="subject" 
                name="name" 
                label="Email Subject"
                v-model="form.email_subject" 
                type="text"
              ></v-text-field>
              <v-textarea
                name="description"
                label="Description"
                v-model="form.description" 
              ></v-textarea>
              <no-ssr placeholder="Loading...">
                <b>HTML EMAIL CONTENT</b>
                <editor 
                  :data="form.email_html"
                  @updateHtml="updateHtml"
                ></editor>
              </no-ssr>
              <br>
              <!-- <v-btn flat color="blue" @click="removeFile">refresh</v-btn> -->
              <div>
                <b>Attachment 1</b>
                <v-text-field 
                  :error-messages="errors.image1_description"
                  prepend-icon="public" 
                  name="image1_description" 
                  label="Attachment 1 Description"
                  v-model="form.image1_description" 
                  type="text"
                ></v-text-field>
                <label>{{ form.image1_path }}</label>
                <br>
                <input 
                  type="file" 
                  ref="file1"
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
                >
                <br><br>
                <hr>
                <br>
              </div>
              <div>
                <b>Attachment 2</b>
                <v-text-field 
                  :error-messages="errors.image2_description"
                  prepend-icon="public" 
                  name="image2_description" 
                  label="Attachment 2 Description"
                  v-model="form.image2_description" 
                  type="text"
                ></v-text-field>
                <label>{{ form.image2_path }}</label>
                <br>
                <input 
                  type="file" 
                  ref="file2"
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
                >
                <br><br>
                <hr>
                <br>
              </div>
              <div>
                <b>Attachment 3</b>
                <v-text-field 
                  :error-messages="errors.image3_description"
                  prepend-icon="public" 
                  name="image3_description" 
                  label="Attachment 3 Description"
                  v-model="form.image3_description" 
                  type="text"
                ></v-text-field>
                <label>{{ form.image3_path }}</label>
                <br>
                <input 
                  type="file" 
                  ref="file3"
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
                >
                <br><br>
                <hr>
                <br>
              </div>
              <div>
                <b>Attachment 4</b>
                <v-text-field 
                  :error-messages="errors.image4_description"
                  prepend-icon="public" 
                  name="image4_description" 
                  label="Attachment 4 Description"
                  v-model="form.image4_description" 
                  type="text"
                ></v-text-field>
                <label>{{ form.image4_path }}</label>
                <br>
                <input 
                  type="file" 
                  ref="file4"
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
                >
                <br>
              </div>
                
                <!-- <input 
                  type="file"
                  id="file"
                  name="file[]" 
                  ref="file" 
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
                  multiple
                > -->
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Sub Product</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'
import editor from '@/components/editor.vue'

export default {
  name: 'UpdateSubProduct',
  async asyncData({$axios, params}) { 
    let listing = await $axios.get(`/listings/${params.requestTreeId}`);
    let product = await $axios.get(`/listings/${params.requestTreeId}/products/${params.productId}`);
    let sub_product = await $axios.get(`/products/${params.productId}/sub_products/${params.id}`);
    return {
      listing: listing.data.data,
      product: product.data.data,
      form: sub_product.data.data
    }
  },
  components: {
    BackButton, editor
  },
  methods: {
    updateHtml(html) {
      this.form.email_html = html
    },
    async store() {
      await this.$axios.patch(`/products/${this.$route.params.productId}/sub_products/${this.$route.params.id}`, this.form)
      await this.handleFileUpload()
      this.$router.push(`/organizations/${this.organization.value}/request-tree/${this.listing.id}/products/${this.product.id}/sub-products`);
    },
    async handleFileUpload() {
      this.picture1 = this.$refs.file1 ? this.$refs.file1.files[0] : ''
      this.picture2 = this.$refs.file2 ? this.$refs.file2.files[0] : ''
      this.picture3 = this.$refs.file3 ? this.$refs.file3.files[0] : ''
      this.picture4 = this.$refs.file4 ? this.$refs.file4.files[0] : ''
      let formData = new FormData();
      formData.append('id', this.form.id);
      formData.append('image1', this.picture1);
      formData.append('image2', this.picture2);
      formData.append('image3', this.picture3);
      formData.append('image4', this.picture4);
      await this.$axios.post('upload_attachments', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(data => {
        // this.filePath = data.data
        console.log(data);
      })
      .catch(function(){
        console.log('FAILURE!!');
      });
    },
  }
}
</script> 