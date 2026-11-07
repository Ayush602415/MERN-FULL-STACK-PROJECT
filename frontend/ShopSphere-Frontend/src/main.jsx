import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import AppRoutes from './routes/AppRoutes.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { setCredentials, logout, setAuthInitialized } from './redux/feature/authSlice.js'
import { me, refresh } from './services/authServices.js'
import { setAccessToken } from './services/api.js'
import { socket } from './socket/socket.js'
import { addNotification } from './redux/feature/notificationSlice.js'

socket.on('orderStatusUpdated', ({ message, order }) => {
  const notification = {
    id: Date.now(),
    message,
    orderId: order._id,
    status: order.orderStatus,
    createdAt: new Date().toLocaleString(),
    read: false
  }

  store.dispatch(addNotification(notification))
  toast.info(message)
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRoutes />
    <ToastContainer position="top-right" autoClose={3000} />
  </Provider>
)

if (new URLSearchParams(window.location.search).get('google') !== 'success') {
  refresh()
    .then(async ({ accessToken }) => {
      const response = await me()
      store.dispatch(setCredentials({
        user: response.data.user,
        accessToken
      }))
    })
    .catch(() => {
      setAccessToken(null)
      store.dispatch(logout())
    })
    .finally(() => store.dispatch(setAuthInitialized()))
} else {
  store.dispatch(setAuthInitialized())
}
