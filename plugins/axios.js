export default function({$axios, store}) {
  $axios.onError(error  =>  {
    store.dispatch('validation/setErrors', error.response.data.errors)
  });
  $axios.onRequest(error  =>  {
    store.dispatch('validation/clearErrors');
  })
}