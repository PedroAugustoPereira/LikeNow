export const register = () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful')
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err)
          }
        )
      })
    }
  }