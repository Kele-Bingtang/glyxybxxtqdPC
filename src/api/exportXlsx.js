export function exportXlsx(id) {
  return window.open(process.env.VUE_APP_BASE_API+"/export/"+id)
}
