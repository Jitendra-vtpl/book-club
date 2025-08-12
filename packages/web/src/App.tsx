import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import Route from './routes/index'
import { store } from './store'
import AuthInitializer from './components/AuthInitializer'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer />
        <Route/>
      </Router>
    </Provider>
  )
}

export default App
