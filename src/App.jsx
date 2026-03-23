import { Routes ,Route} from "react-router-dom"
import Layout from "./component/layout/Layout"
import Home from "./component/pages/Home"
import AboutUs from "./component/pages/AboutUs"
import ContactUs from "./component/pages/ContactUs"
import Shop from "./component/pages/Shop"
import PageNotFound from "./component/pages/PageNotFound"
import Cart from "./component/global/cart"
import Fav from "./component/global/fav"
import ProductDetails from "./component/pages/Productdetails"

function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path="/AboutUs" element={<AboutUs/>}/>
      <Route path="/ContactUs" element={<ContactUs/>}/>
      <Route path="/Shop" element={<Shop/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/fav" element={<Fav/>}/>
      <Route path="/product/:id" element={<ProductDetails/>}/>
      <Route path="*" element={<PageNotFound/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
