import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Component/app/App.tsx'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@radix-ui/themes/styles.css";
import "./i18n.ts"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)