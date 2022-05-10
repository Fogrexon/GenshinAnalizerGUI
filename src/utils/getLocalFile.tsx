export const getLocalFile = () => {
  return new Promise<unknown>(resolve => {
    window.eel.get_local_file()((path: unknown) => {
      resolve(path)
    })
  })
}
