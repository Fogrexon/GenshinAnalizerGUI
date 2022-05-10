export const getLocalFile = () => {
  new Promise<string>(resolve => {
    window.eel.get_local_file()((path: string) => {
      const target_file = path.replace(/^.*[\\/]/, '')
      resolve(target_file)
    })
  })
}
