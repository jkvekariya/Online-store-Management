import React from 'react'
import "../css/footer.css";

const Footer = () => {
  return (
    <>
      <div className='main-footer'>
        <div className='footer-container'>
            <div className='sec-one-about'>
                <h1>hello</h1>
                <p>let's purchasing new exclusive products in offer to provide lovely feeling.</p>
            </div>
            <div className='sec-two-customer-link'>
                <h2>customer services</h2>
                <ul className='footer-list'>
                  <li>my account</li>
                  <li>shipping & delivery</li>
                  <li>order tracking</li>
                  <li>orders history</li>
                  <li>help & FAQs</li>
                  <li>fast delivery</li>
                  <li>privacy</li>
                </ul>
            </div>
            <div className='sec-three-useful-link'>
              <h2>useful links</h2>
                <ul className='useful-link'>
                  <li>home</li>
                  <li>servies</li>
                  <li>contact us</li>
                  <li>about us</li>
                  <li>faq</li>
                </ul>
            </div>
            <div className='sec-four-contact'>

            </div>
        </div>
      </div>
    </>
  )
}

export default Footer