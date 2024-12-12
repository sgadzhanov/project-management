import propTypes from 'prop-types'
import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: propTypes.node,
}
