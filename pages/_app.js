import "tailwindcss/tailwind.css"
import 'suneditor/dist/css/suneditor.min.css';
import './../public/css/suneditorCustomClasses.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp